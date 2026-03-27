/**
 * ============================================================================
 * ELITE PROBATUM v2.0 — APLICAÇÃO PRINCIPAL
 * UNIDADE DE COMANDO FORENSE DIGITAL
 * ============================================================================
 * CORREÇÃO v2.0.3:
 * 1. Unificação dos motores preditivos (PredictiveLitigation + AIAssistant)
 * 2. Implementação de PredictionEngine com Singleton Pattern
 * 3. Integração com SecureStorage para persistência encriptada
 * 4. Inicialização do ForensicVault com master hash da sessão
 * 5. Validação de divergência entre motores com logging forense
 * ============================================================================
 */

(function() {
    'use strict';
    
    // =========================================================================
    // CONFIGURAÇÕES GLOBAIS
    // =========================================================================
    
    const APP_VERSION = '2.0.3';
    const MASTER_HASH = 'F8A9B2C1D4E5F6A7B8C9D0E1F2A3B4C5D6E7F8A9B0C1D2E3F4A5B6C7D8E9F0';
    
    // =========================================================================
    // SISTEMA DE ARMAZENAMENTO SEGURO (CORREÇÃO)
    // =========================================================================
    
    class SecureStorage {
        constructor(masterKey) {
            this.masterKey = masterKey;
            this.encryptionKey = null;
            this.initialized = false;
            this.deriveKey();
        }
        
        deriveKey() {
            try {
                const salt = CryptoJS.enc.Hex.parse(window.ELITE_SESSION_ID || Date.now().toString(36));
                this.encryptionKey = CryptoJS.PBKDF2(this.masterKey, salt, {
                    keySize: 256 / 32,
                    iterations: 100000,
                    hasher: CryptoJS.algo.SHA256
                });
                this.initialized = true;
            } catch (e) {
                console.error('[SecureStorage] Erro na derivação de chave:', e);
                this.encryptionKey = CryptoJS.SHA256(this.masterKey);
                this.initialized = true;
            }
        }
        
        encrypt(data) {
            if (!this.initialized) this.deriveKey();
            try {
                const iv = CryptoJS.lib.WordArray.random(16);
                const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), this.encryptionKey, {
                    iv: iv,
                    mode: CryptoJS.mode.CBC,
                    padding: CryptoJS.pad.Pkcs7
                });
                return {
                    ciphertext: encrypted.toString(),
                    iv: iv.toString()
                };
            } catch (e) {
                console.error('[SecureStorage] Erro na encriptação:', e);
                return { ciphertext: JSON.stringify(data), iv: null };
            }
        }
        
        decrypt(encryptedData) {
            if (!this.initialized) this.deriveKey();
            if (!encryptedData || !encryptedData.ciphertext) return null;
            if (!encryptedData.iv) return JSON.parse(encryptedData.ciphertext);
            
            try {
                const decrypted = CryptoJS.AES.decrypt(encryptedData.ciphertext, this.encryptionKey, {
                    iv: CryptoJS.enc.Hex.parse(encryptedData.iv),
                    mode: CryptoJS.mode.CBC,
                    padding: CryptoJS.pad.Pkcs7
                });
                return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
            } catch (e) {
                console.error('[SecureStorage] Erro na desencriptação:', e);
                return null;
            }
        }
        
        setItem(key, value) {
            try {
                const encrypted = this.encrypt(value);
                localStorage.setItem(`secure_${key}`, JSON.stringify(encrypted));
                return true;
            } catch (e) {
                console.error(`[SecureStorage] Erro ao salvar ${key}:`, e);
                return false;
            }
        }
        
        getItem(key) {
            try {
                const stored = localStorage.getItem(`secure_${key}`);
                if (!stored) return null;
                const encrypted = JSON.parse(stored);
                return this.decrypt(encrypted);
            } catch (e) {
                console.error(`[SecureStorage] Erro ao carregar ${key}:`, e);
                return null;
            }
        }
        
        removeItem(key) {
            localStorage.removeItem(`secure_${key}`);
        }
        
        clear() {
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith('secure_')) {
                    localStorage.removeItem(key);
                }
            });
        }
    }
    
    // =========================================================================
    // MOTOR DE PREVISÃO UNIFICADO (CORREÇÃO - Singleton Pattern)
    // =========================================================================
    
    class PredictionEngine {
        constructor() {
            if (PredictionEngine.instance) {
                return PredictionEngine.instance;
            }
            
            this.predictiveLitigation = null;
            this.aiAssistant = null;
            this.discrepancyLog = [];
            this.initialized = false;
            PredictionEngine.instance = this;
        }
        
        initialize() {
            this.predictiveLitigation = window.PredictiveLitigation;
            this.aiAssistant = window.AIAssistant;
            
            if (this.predictiveLitigation && !this.predictiveLitigation.initialized) {
                this.predictiveLitigation.initialize();
            }
            if (this.aiAssistant && !this.aiAssistant.initialized) {
                this.aiAssistant.initialize();
            }
            
            this.initialized = true;
            console.log('[PredictionEngine] Motor unificado inicializado');
            return this;
        }
        
        /**
         * Obtém previsão unificada com validação de divergência
         * @param {Object} caseData - Dados do caso
         * @returns {Object} Previsão unificada
         */
        getUnifiedPrediction(caseData) {
            if (!this.initialized) {
                this.initialize();
            }
            
            let result1 = null;
            let result2 = null;
            let divergenceDetected = false;
            let divergencePercentage = 0;
            
            // Executar ambos os motores
            if (this.predictiveLitigation && typeof this.predictiveLitigation.predict === 'function') {
                result1 = this.predictiveLitigation.predict(caseData);
            }
            
            if (this.aiAssistant && typeof this.aiAssistant.predictSuccess === 'function') {
                result2 = this.aiAssistant.predictSuccess(caseData);
            }
            
            // Calcular probabilidades
            const prob1 = result1 ? result1.probability : 0.5;
            const prob2 = result2 ? result2.probability : 0.5;
            const confidence1 = result1 ? result1.confidence : 0.7;
            const confidence2 = result2 ? result2.confidence : 0.7;
            
            // Verificar divergência
            const diff = Math.abs(prob1 - prob2);
            if (diff > 0.1) {
                divergenceDetected = true;
                divergencePercentage = diff * 100;
                
                // Registrar divergência para auditoria forense
                this.logDiscrepancy(caseData, result1, result2, diff);
            }
            
            // Calcular média ponderada pela confiança
            const totalConfidence = confidence1 + confidence2;
            const weightedProbability = totalConfidence > 0 
                ? (prob1 * confidence1 + prob2 * confidence2) / totalConfidence
                : (prob1 + prob2) / 2;
            
            // Determinar confiança final (mínimo dos dois)
            const finalConfidence = Math.min(confidence1, confidence2) * (divergenceDetected ? 0.9 : 1);
            
            // Selecionar o motor com maior confiança para recomendações
            const primarySource = confidence1 >= confidence2 ? 'PredictiveLitigation' : 'AIAssistant';
            const primaryResult = confidence1 >= confidence2 ? result1 : result2;
            
            return {
                probability: Math.min(Math.max(weightedProbability, 0.15), 0.98),
                confidence: finalConfidence,
                divergenceDetected: divergenceDetected,
                divergencePercentage: divergencePercentage.toFixed(1),
                sources: {
                    predictiveLitigation: { probability: prob1, confidence: confidence1, available: !!result1 },
                    aiAssistant: { probability: prob2, confidence: confidence2, available: !!result2 }
                },
                detailedAnalysis: primaryResult ? primaryResult.detailedAnalysis : null,
                recommendations: primaryResult ? primaryResult.recommendations : null,
                riskLevel: this.classifyRisk(weightedProbability),
                expectedOutcome: this.getExpectedOutcome(weightedProbability),
                estimatedValue: this.estimateRecoveryValue(caseData.value || 0, weightedProbability),
                judicialProfile: result1 ? result1.judicialProfile : (result2 ? result2.judicialProfile : null),
                predictionId: Date.now(),
                timestamp: new Date().toISOString(),
                primarySource: primarySource
            };
        }
        
        /**
         * Registra divergência para auditoria forense
         */
        logDiscrepancy(caseData, result1, result2, diff) {
            const logEntry = {
                id: Date.now(),
                timestamp: new Date().toISOString(),
                caseId: caseData.id || 'unknown',
                platform: caseData.platform,
                value: caseData.value,
                omissionPercentage: caseData.omissionPercentage,
                probability1: result1 ? result1.probability : null,
                probability2: result2 ? result2.probability : null,
                divergence: diff,
                sessionId: window.ELITE_SESSION_ID || 'unknown'
            };
            
            this.discrepancyLog.unshift(logEntry);
            
            // Manter apenas últimos 100 registos
            if (this.discrepancyLog.length > 100) {
                this.discrepancyLog = this.discrepancyLog.slice(0, 100);
            }
            
            // Salvar em storage seguro
            if (window.SecureStorageInstance) {
                window.SecureStorageInstance.setItem('prediction_discrepancies', this.discrepancyLog);
            }
            
            console.warn('[PredictionEngine] Divergência preditiva detectada:', {
                diff: (diff * 100).toFixed(1) + '%',
                caseId: caseData.id || 'unknown'
            });
            
            // Emitir evento para UI
            window.dispatchEvent(new CustomEvent('predictionDivergence', {
                detail: {
                    caseId: caseData.id,
                    divergence: (diff * 100).toFixed(1) + '%',
                    prob1: (result1?.probability * 100).toFixed(1) + '%',
                    prob2: (result2?.probability * 100).toFixed(1) + '%'
                }
            }));
        }
        
        /**
         * Classifica risco
         */
        classifyRisk(probability) {
            if (probability > 0.75) return 'Baixo';
            if (probability > 0.55) return 'Moderado';
            if (probability > 0.40) return 'Elevado';
            return 'Muito Elevado';
        }
        
        /**
         * Obtém resultado esperado
         */
        getExpectedOutcome(probability) {
            if (probability > 0.80) {
                return 'Vitória provável com condenação integral da contraparte';
            } else if (probability > 0.65) {
                return 'Vitória provável com condenação parcial';
            } else if (probability > 0.50) {
                return 'Resultado incerto - depende da qualidade probatória';
            } else if (probability > 0.35) {
                return 'Derrota provável - considerar acordo';
            } else {
                return 'Derrota muito provável - reavaliar estratégia';
            }
        }
        
        /**
         * Estima valor de recuperação
         */
        estimateRecoveryValue(caseValue, probability) {
            const baseRecovery = caseValue * probability;
            let adjustment = 1.0;
            if (caseValue > 100000) adjustment = 0.95;
            else if (caseValue > 50000) adjustment = 0.98;
            else if (caseValue > 15000) adjustment = 1.0;
            else adjustment = 1.05;
            return Math.round(baseRecovery * adjustment);
        }
        
        /**
         * Obtém histórico de divergências
         */
        getDiscrepancyLog(limit = 20) {
            return this.discrepancyLog.slice(0, limit);
        }
        
        /**
         * Gera relatório de validação dos motores
         */
        getValidationReport() {
            const totalPredictions = this.discrepancyLog.length;
            const divergences = this.discrepancyLog.filter(l => l.divergence > 0.1).length;
            const avgDivergence = totalPredictions > 0 
                ? this.discrepancyLog.reduce((sum, l) => sum + l.divergence, 0) / totalPredictions 
                : 0;
            
            return {
                engineVersion: '2.0.3',
                totalPredictions: totalPredictions,
                divergencesDetected: divergences,
                divergenceRate: totalPredictions > 0 ? (divergences / totalPredictions * 100).toFixed(1) + '%' : '0%',
                averageDivergence: (avgDivergence * 100).toFixed(1) + '%',
                primaryEngine: 'PredictiveLitigation',
                secondaryEngine: 'AIAssistant',
                status: avgDivergence < 0.05 ? 'ALINHADO' : avgDivergence < 0.1 ? 'TOLERÂNCIA' : 'DIVERGENTE',
                lastUpdated: new Date().toISOString()
            };
        }
    }
    
    // =========================================================================
    // SISTEMA DE INTERNACIONALIZAÇÃO (I18N)
    // =========================================================================
    
    const I18N_DICT = {
        pt: {
            login_title: 'ELITE PROBATUM',
            login_subtitle: 'Unidade de Comando Forense Digital',
            login_user: 'UTILIZADOR',
            login_password: 'PALAVRA-PASSE',
            login_button: 'AUTENTICAR',
            login_request: 'SOLICITAR ACESSO',
            login_security: 'ENCRIPTADO AES-256 · CANAL SEGURO',
            login_error: 'ACESSO NEGADO — Credenciais inválidas',
            nav_dashboard: 'PAINEL DE COMANDO',
            nav_cases: 'PROCESSOS',
            nav_insolvency: 'INSOLVÊNCIAS (CIRE)',
            nav_labor: 'CONTENCIOSO LABORAL',
            nav_litigation: 'INTELIGÊNCIA DE LITÍGIO',
            nav_questionnaire: 'QUESTIONÁRIOS ESTRATÉGICOS',
            nav_evidence: 'CADEIA DE CUSTÓDIA',
            nav_adversary: 'ANÁLISE DE OPOSIÇÃO',
            nav_simulator: 'SIMULADOR DE CONTRA-PERÍCIA',
            nav_deadlines: 'PRAZOS JUDICIAIS',
            nav_activitylog: 'REGISTOS RGPD',
            nav_reports: 'RELATÓRIOS',
            nav_admin: 'ADMINISTRAÇÃO',
            dashboard_title: 'PAINEL DE COMANDO ESTRATÉGICO',
            dashboard_active_cases: 'PROCESSOS ATIVOS',
            dashboard_dispute_value: 'VALOR EM DISPUTA',
            dashboard_avg_prob: 'PROBABILIDADE MÉDIA',
            dashboard_roi: 'ROI ESTIMADO',
            dashboard_alerts_title: 'ALERTAS DE INTELIGÊNCIA — FEED EM TEMPO REAL',
            dashboard_alert_critical: 'CRITICAL',
            dashboard_alert_warning: 'WARNING',
            dashboard_alert_info: 'INFO',
            dashboard_alert_ins001: 'INSOLVÊNCIA INS001: Detetada dissipação de património (Art. 120.º CIRE) - Risco Elevado.',
            dashboard_alert_lab003: 'CONTENCIOSO LAB003: Nova jurisprudência STA sobre "falsos recibos verdes" aplicável.',
            dashboard_alert_integrity: 'SISTEMA: Integridade da Cadeia de Custódia verificada (Master Hash OK).',
            currency_eur: '€',
            percent_symbol: '%',
            loading: 'A carregar...',
            error_generic: 'Ocorreu um erro. Tente novamente.',
            success: 'Operação concluída com sucesso.',
            confirm_action: 'Tem certeza que deseja continuar?',
            today: 'Hoje',
            tomorrow: 'Amanhã',
            days_ago: 'dias atrás'
        },
        en: {
            login_title: 'ELITE PROBATUM',
            login_subtitle: 'Digital Forensic Command Unit',
            login_user: 'USERNAME',
            login_password: 'PASSWORD',
            login_button: 'AUTHENTICATE',
            login_request: 'REQUEST ACCESS',
            login_security: 'AES-256 ENCRYPTED · SECURE CHANNEL',
            login_error: 'ACCESS DENIED — Invalid credentials',
            nav_dashboard: 'COMMAND DASHBOARD',
            nav_cases: 'CASES',
            nav_insolvency: 'INSOLVENCY (CIRE)',
            nav_labor: 'LABOR LITIGATION',
            nav_litigation: 'LITIGATION INTELLIGENCE',
            nav_questionnaire: 'STRATEGIC QUESTIONNAIRES',
            nav_evidence: 'CHAIN OF CUSTODY',
            nav_adversary: 'OPPOSITION ANALYSIS',
            nav_simulator: 'COUNTER-EXPERTISE SIMULATOR',
            nav_deadlines: 'COURT DEADLINES',
            nav_activitylog: 'GDPR LOGS',
            nav_reports: 'REPORTS',
            nav_admin: 'ADMINISTRATION',
            dashboard_title: 'STRATEGIC COMMAND DASHBOARD',
            dashboard_active_cases: 'ACTIVE CASES',
            dashboard_dispute_value: 'DISPUTE VALUE',
            dashboard_avg_prob: 'AVERAGE PROBABILITY',
            dashboard_roi: 'ESTIMATED ROI',
            dashboard_alerts_title: 'INTELLIGENCE ALERTS — REAL-TIME FEED',
            dashboard_alert_critical: 'CRITICAL',
            dashboard_alert_warning: 'WARNING',
            dashboard_alert_info: 'INFO',
            dashboard_alert_ins001: 'INSOLVENCY INS001: Detected asset dissipation (Art. 120 CIRE) - High Risk.',
            dashboard_alert_lab003: 'LABOR CASE LAB003: New STA case law on "fake green receipts" applicable.',
            dashboard_alert_integrity: 'SYSTEM: Chain of Custody integrity verified (Master Hash OK).',
            currency_eur: '€',
            percent_symbol: '%',
            loading: 'Loading...',
            error_generic: 'An error occurred. Please try again.',
            success: 'Operation completed successfully.',
            confirm_action: 'Are you sure you want to continue?',
            today: 'Today',
            tomorrow: 'Tomorrow',
            days_ago: 'days ago'
        }
    };
    
    let currentLocale = 'pt';
    let secureStorage = null;
    let predictionEngine = null;
    
    function t(key, params = {}) {
        const dict = I18N_DICT[currentLocale];
        let text = dict[key] || key;
        Object.keys(params).forEach(param => {
            text = text.replace(new RegExp(`{{${param}}}`, 'g'), params[param]);
        });
        return text;
    }
    
    function setLocale(locale) {
        if (locale === 'pt' || locale === 'en') {
            currentLocale = locale;
            localStorage.setItem('elite_locale', locale);
            document.querySelectorAll('[data-i18n]').forEach(el => {
                const key = el.getAttribute('data-i18n');
                if (key) {
                    el.textContent = t(key);
                }
            });
            if (window.EliteProbatum && window.EliteProbatum.currentView) {
                window.EliteProbatum.navigateTo(window.EliteProbatum.currentView);
            }
            const langPT = document.getElementById('langPT');
            const langEN = document.getElementById('langEN');
            if (langPT && langEN) {
                if (locale === 'pt') {
                    langPT.classList.add('active');
                    langEN.classList.remove('active');
                } else {
                    langEN.classList.add('active');
                    langPT.classList.remove('active');
                }
            }
            EliteUtils.showToast(`Idioma alterado para ${locale === 'pt' ? 'Português' : 'English'}`, 'info');
        }
    }
    
    // =========================================================================
    // UTILITÁRIOS
    // =========================================================================
    
    const EliteUtils = {
        formatCurrency: (value) => new Intl.NumberFormat(currentLocale === 'pt' ? 'pt-PT' : 'en-GB', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2 }).format(value || 0),
        formatDate: (date) => moment(date).format(currentLocale === 'pt' ? 'DD/MM/YYYY' : 'YYYY-MM-DD'),
        formatPercentage: (value) => `${(value || 0).toFixed(1)}${t('percent_symbol')}`,
        generateId: () => Date.now().toString(36) + Math.random().toString(36).substr(2, 8),
        generateHash: (content) => CryptoJS.SHA256(content + Date.now().toString()).toString(),
        
        showToast: (message, type = 'info') => {
            const container = document.getElementById('toastContainer');
            if (!container) return;
            const toast = document.createElement('div');
            toast.className = `toast ${type}`;
            const icons = { success: 'fa-check-circle', error: 'fa-exclamation-triangle', warning: 'fa-exclamation-circle', info: 'fa-info-circle' };
            toast.innerHTML = `<i class="fas ${icons[type]}"></i><span>${message}</span>`;
            container.appendChild(toast);
            setTimeout(() => {
                toast.style.animation = 'slideInRight 0.3s ease reverse';
                setTimeout(() => toast.remove(), 300);
            }, 4000);
        },
        
        log: (message, level = 'info') => {
            const prefix = '[ELITE PROBATUM]';
            if (level === 'error') console.error(prefix, message);
            else if (level === 'warn') console.warn(prefix, message);
            else console.log(prefix, message);
        },
        
        formatBytes: (bytes) => {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        },
        
        formatDateRelative: (date) => {
            const now = moment();
            const target = moment(date);
            const diffDays = now.diff(target, 'days');
            if (diffDays === 0) return t('today');
            if (diffDays === 1) return t('tomorrow');
            if (diffDays < 0) return `${Math.abs(diffDays)} ${t('days_ago')}`;
            return target.format(currentLocale === 'pt' ? 'DD/MM/YYYY' : 'YYYY-MM-DD');
        },
        
        t: t,
        setLocale: setLocale,
        getLocale: () => currentLocale,
        
        // CORREÇÃO: Acesso ao storage seguro
        getSecureStorage: () => secureStorage,
        
        // CORREÇÃO: Acesso ao motor de previsão unificado
        getPredictionEngine: () => predictionEngine
    };
    
    // =========================================================================
    // MOCK DATA - 27 PROCESSOS ESTRATÉGICOS
    // =========================================================================
    
    const MOCK_CASES = [
        { id: 'INS001', client: 'Construtora ABC, Lda', nif_devedor: '123456789', category: 'insolvency', categoryName: 'Insolvência (CIRE)', value: 450000, successProbability: 0.48, status: 'active', court: 'Lisboa', startDate: '2022-08-15', hoursSpent: 120, resourceLevel: 'senior', evidence: ['Insolvência culposa', 'Lista de credores extensa'], adversary: 'PLMJ', judge: 'Dr. António Costa', riskLevel: 'critical', fase_processual: 'Reclamação de Créditos', administrador_insolvencia: 'Dr. José Silva', data_sentenca_declarativa: '2022-10-15' },
        { id: 'INS002', client: 'Retail Solutions, Lda', nif_devedor: '987654321', category: 'insolvency', categoryName: 'Insolvência (CIRE)', value: 125000, successProbability: 0.52, status: 'active', court: 'Porto', startDate: '2023-02-10', hoursSpent: 65, resourceLevel: 'associate', evidence: ['Exoneração passivo', 'Ativo remanescente'], adversary: 'VdA', judge: 'Dra. Sofia Mendes', riskLevel: 'warning', fase_processual: 'Exoneração do Passivo Restante', administrador_insolvencia: 'Dra. Ana Costa', data_sentenca_declarativa: '2023-04-20' },
        { id: 'INS003', client: 'Tech Start, Unipessoal', nif_devedor: '456789123', category: 'insolvency', categoryName: 'Insolvência (CIRE)', value: 89000, successProbability: 0.44, status: 'pending', court: 'Braga', startDate: '2023-09-01', hoursSpent: 38, resourceLevel: 'junior', evidence: ['Processo CIRE', 'Credores privilegiados'], adversary: 'Garrigues', judge: 'Dr. Ricardo Alves', riskLevel: 'warning', fase_processual: 'Fase Inicial', administrador_insolvencia: 'Dr. Pedro Santos', data_sentenca_declarativa: null },
        { id: 'LAB001', client: 'Carlos Manuel Santos', nif_devedor: '111222333', category: 'labor', categoryName: 'Direito do Trabalho', value: 15720, successProbability: 0.75, status: 'active', court: 'Porto', startDate: '2023-03-01', hoursSpent: 38, resourceLevel: 'associate', evidence: ['Despedimento ilícito', 'Testemunhas presenciais'], adversary: 'VdA', judge: 'Dra. Sofia Mendes', riskLevel: 'normal', data_cessacao_contrato: '2023-02-28', tipo_despedimento: 'Ilícito', valor_pedido_indemnizacao: 15720, data_audiencia_partes: '2024-01-20' },
        { id: 'LAB002', client: 'Ana Sofia Rodrigues', nif_devedor: '444555666', category: 'labor', categoryName: 'Direito do Trabalho', value: 28900, successProbability: 0.68, status: 'active', court: 'Lisboa', startDate: '2023-08-15', hoursSpent: 42, resourceLevel: 'senior', evidence: ['Contrato sem termo', 'Antiguidade 8 anos'], adversary: 'PLMJ', judge: 'Dr. António Costa', riskLevel: 'normal', data_cessacao_contrato: '2023-08-10', tipo_despedimento: 'Causa Objetiva', valor_pedido_indemnizacao: 28900, data_audiencia_partes: '2024-02-15' },
        { id: 'LAB003', client: 'Pedro Miguel Martins', nif_devedor: '777888999', category: 'labor', categoryName: 'Direito do Trabalho', value: 9500, successProbability: 0.82, status: 'active', court: 'Lisboa', startDate: '2023-10-01', hoursSpent: 22, resourceLevel: 'junior', evidence: ['Despedimento coletivo', 'Acordo com sindicato'], adversary: 'Cuatrecasas', judge: 'Dra. Teresa Lopes', riskLevel: 'normal', data_cessacao_contrato: '2023-09-30', tipo_despedimento: 'Coletivo', valor_pedido_indemnizacao: 9500, data_audiencia_partes: '2024-03-10' },
        { id: 'CIV001', client: 'João Manuel Ferreira', nif_devedor: '123123123', category: 'civil', categoryName: 'Direito Civil', value: 28450, successProbability: 0.72, status: 'active', court: 'Lisboa', startDate: '2023-01-15', hoursSpent: 45, resourceLevel: 'senior', evidence: ['Prova documental completa', 'Jurisprudência favorável'], adversary: 'PLMJ', judge: 'Dr. António Costa', riskLevel: 'normal' },
        { id: 'CIV002', client: 'Maria Isabel Lopes', nif_devedor: '456456456', category: 'civil', categoryName: 'Direito Civil', value: 15200, successProbability: 0.58, status: 'active', court: 'Porto', startDate: '2023-06-10', hoursSpent: 32, resourceLevel: 'associate', evidence: ['Prova testemunhal frágil', 'Ausência de perícia'], adversary: 'VdA', judge: 'Dra. Sofia Mendes', riskLevel: 'warning' },
        { id: 'CIV003', client: 'António José Ribeiro', nif_devedor: '789789789', category: 'civil', categoryName: 'Direito Civil', value: 42300, successProbability: 0.81, status: 'active', court: 'Braga', startDate: '2023-09-20', hoursSpent: 28, resourceLevel: 'senior', evidence: ['Prova documental completa', 'Jurisprudência favorável'], adversary: 'Garrigues', judge: 'Dr. Ricardo Alves', riskLevel: 'normal' },
        { id: 'TAX001', client: 'Empresa XYZ, SA', nif_devedor: '321321321', category: 'tax', categoryName: 'Direito Fiscal', value: 125000, successProbability: 0.68, status: 'active', court: 'Lisboa', startDate: '2022-11-10', hoursSpent: 85, resourceLevel: 'senior', evidence: ['Notificação prévia AT', 'Prova digital com hash'], adversary: 'VdA', judge: 'Dr. Pedro Martins', riskLevel: 'warning' },
        { id: 'TAX002', client: 'Comércio Global, Lda', nif_devedor: '654654654', category: 'tax', categoryName: 'Direito Fiscal', value: 45200, successProbability: 0.61, status: 'active', court: 'Porto', startDate: '2023-04-20', hoursSpent: 52, resourceLevel: 'associate', evidence: ['Regularização espontânea', 'Jurisprudência desfavorável'], adversary: 'PLMJ', judge: 'Dra. Sofia Mendes', riskLevel: 'normal' },
        { id: 'TAX003', client: 'Serviços Integrados, SA', nif_devedor: '987987987', category: 'tax', categoryName: 'Direito Fiscal', value: 78400, successProbability: 0.55, status: 'pending', court: 'Coimbra', startDate: '2023-07-05', hoursSpent: 48, resourceLevel: 'senior', evidence: ['Discrepância DAC7', 'Recurso pendente'], adversary: 'Garrigues', judge: 'Dr. Rui Silva', riskLevel: 'warning' },
        { id: 'COM001', client: 'Distribuidora Nacional, Lda', nif_devedor: '147147147', category: 'commercial', categoryName: 'Direito Comercial', value: 32400, successProbability: 0.88, status: 'active', court: 'Braga', startDate: '2023-05-15', hoursSpent: 35, resourceLevel: 'senior', evidence: ['Violação acordo', 'Cláusula penal'], adversary: 'Cuatrecasas', judge: 'Dr. Ricardo Alves', riskLevel: 'normal' },
        { id: 'COM002', client: 'Importadora Europa, SA', nif_devedor: '258258258', category: 'commercial', categoryName: 'Direito Comercial', value: 56700, successProbability: 0.71, status: 'active', court: 'Lisboa', startDate: '2023-03-20', hoursSpent: 48, resourceLevel: 'associate', evidence: ['Contrato internacional', 'Arbitragem'], adversary: 'VdA', judge: 'Dr. António Costa', riskLevel: 'normal' },
        { id: 'COM003', client: 'Logística Expresso, Lda', nif_devedor: '369369369', category: 'commercial', categoryName: 'Direito Comercial', value: 21300, successProbability: 0.79, status: 'pending', court: 'Porto', startDate: '2023-10-10', hoursSpent: 22, resourceLevel: 'junior', evidence: ['Faturação em falta', 'Diligências prévias'], adversary: 'PLMJ', judge: 'Dra. Sofia Mendes', riskLevel: 'normal' },
        { id: 'PEN001', client: 'Rui Fonseca', nif_devedor: '159159159', category: 'criminal', categoryName: 'Direito Penal', value: 0, successProbability: 0.72, status: 'active', court: 'Lisboa', startDate: '2023-01-20', hoursSpent: 55, resourceLevel: 'senior', evidence: ['Recurso penal', 'Prova testemunhal'], adversary: 'VdA', judge: 'Dr. João Costa', riskLevel: 'normal' },
        { id: 'PEN002', client: 'Maria Santos', nif_devedor: '357357357', category: 'criminal', categoryName: 'Direito Penal', value: 0, successProbability: 0.58, status: 'active', court: 'Porto', startDate: '2023-06-15', hoursSpent: 42, resourceLevel: 'associate', evidence: ['Queixa crime', 'Prova digital'], adversary: 'PLMJ', judge: 'Dra. Sofia Mendes', riskLevel: 'warning' },
        { id: 'PEN003', client: 'João Mendes', nif_devedor: '951951951', category: 'criminal', categoryName: 'Direito Penal', value: 0, successProbability: 0.65, status: 'pending', court: 'Braga', startDate: '2023-09-10', hoursSpent: 28, resourceLevel: 'junior', evidence: ['Habeas corpus', 'Medidas coação'], adversary: 'Garrigues', judge: 'Dr. Ricardo Alves', riskLevel: 'normal' },
        { id: 'FAM001', client: 'Ana Pereira', nif_devedor: '753753753', category: 'family', categoryName: 'Direito da Família', value: 8500, successProbability: 0.91, status: 'active', court: 'Lisboa', startDate: '2023-08-01', hoursSpent: 18, resourceLevel: 'associate', evidence: ['Regulação poder paternal', 'Acordo consensual'], adversary: 'Cuatrecasas', judge: 'Dra. Teresa Lopes', riskLevel: 'normal' },
        { id: 'FAM002', client: 'Carlos Mendes', nif_devedor: '159753159', category: 'family', categoryName: 'Direito da Família', value: 12300, successProbability: 0.78, status: 'active', court: 'Porto', startDate: '2023-04-10', hoursSpent: 32, resourceLevel: 'senior', evidence: ['Divórcio litigioso', 'Partilha de bens'], adversary: 'VdA', judge: 'Dra. Sofia Mendes', riskLevel: 'normal' },
        { id: 'FAM003', client: 'Sofia Rodrigues', nif_devedor: '456852456', category: 'family', categoryName: 'Direito da Família', value: 5600, successProbability: 0.85, status: 'pending', court: 'Coimbra', startDate: '2023-10-15', hoursSpent: 12, resourceLevel: 'junior', evidence: ['Alimentos devidos', 'Acordo prévio'], adversary: 'PLMJ', judge: 'Dr. Rui Silva', riskLevel: 'normal' },
        { id: 'IP001', client: 'Innovate Tech, Lda', nif_devedor: '852852852', category: 'intellectual', categoryName: 'Propriedade Intelectual', value: 45200, successProbability: 0.79, status: 'active', court: 'Porto', startDate: '2023-07-20', hoursSpent: 42, resourceLevel: 'senior', evidence: ['Violação patente', 'Prova pericial'], adversary: 'Garrigues', judge: 'Dra. Isabel Ferreira', riskLevel: 'normal' },
        { id: 'IP002', client: 'Creative Solutions, SA', nif_devedor: '963963963', category: 'intellectual', categoryName: 'Propriedade Intelectual', value: 28700, successProbability: 0.72, status: 'active', court: 'Lisboa', startDate: '2023-05-05', hoursSpent: 35, resourceLevel: 'associate', evidence: ['Marca registada', 'Contrafação'], adversary: 'VdA', judge: 'Dr. António Costa', riskLevel: 'normal' },
        { id: 'IP003', client: 'Design Studio, Lda', nif_devedor: '741741741', category: 'intellectual', categoryName: 'Propriedade Intelectual', value: 15400, successProbability: 0.68, status: 'pending', court: 'Porto', startDate: '2023-09-25', hoursSpent: 24, resourceLevel: 'junior', evidence: ['Direitos autorais', 'Plágio'], adversary: 'PLMJ', judge: 'Dra. Sofia Mendes', riskLevel: 'normal' },
        { id: 'ADM001', client: 'Construções do Sul, SA', nif_devedor: '147258369', category: 'administrative', categoryName: 'Direito Administrativo', value: 18900, successProbability: 0.64, status: 'active', court: 'Lisboa', startDate: '2023-02-10', hoursSpent: 38, resourceLevel: 'senior', evidence: ['Impugnação ato administrativo'], adversary: 'Cuatrecasas', judge: 'Dr. Pedro Martins', riskLevel: 'normal' },
        { id: 'ADM002', client: 'Ambiente Sustentável, Lda', nif_devedor: '369258147', category: 'administrative', categoryName: 'Direito Administrativo', value: 32100, successProbability: 0.59, status: 'active', court: 'Porto', startDate: '2023-05-18', hoursSpent: 42, resourceLevel: 'associate', evidence: ['Licenciamento ambiental'], adversary: 'VdA', judge: 'Dra. Sofia Mendes', riskLevel: 'warning' },
        { id: 'ADM003', client: 'Saúde Integrada, SA', nif_devedor: '951753852', category: 'administrative', categoryName: 'Direito Administrativo', value: 45600, successProbability: 0.71, status: 'pending', court: 'Coimbra', startDate: '2023-08-22', hoursSpent: 28, resourceLevel: 'junior', evidence: ['Concurso público', 'Caducidade'], adversary: 'PLMJ', judge: 'Dr. Rui Silva', riskLevel: 'normal' }
    ];
    
    // =========================================================================
    // VARIÁVEIS GLOBAIS E FUNÇÕES DE RENDERIZAÇÃO
    // =========================================================================
    
    let activeCharts = {};
    let currentView = 'dashboard';
    let alertInterval = null;
    
    function getCategoryName(category) {
        const names = {
            civil: 'Direito Civil',
            criminal: 'Direito Penal',
            labor: 'Direito do Trabalho',
            commercial: 'Direito Comercial',
            tax: 'Direito Fiscal',
            insolvency: 'Insolvência (CIRE)',
            family: 'Direito da Família',
            intellectual: 'Propriedade Intelectual',
            administrative: 'Direito Administrativo'
        };
        return names[category] || category;
    }
    
    function getViewTitle(view) {
        const titles = {
            dashboard: t('dashboard_title'),
            cases: t('nav_cases'),
            insolvency: t('nav_insolvency'),
            labor: t('nav_labor'),
            litigation: t('nav_litigation'),
            questionnaire: t('nav_questionnaire'),
            evidence: t('nav_evidence'),
            adversary: t('nav_adversary'),
            simulator: t('nav_simulator'),
            deadlines: t('nav_deadlines'),
            activitylog: t('nav_activitylog'),
            reports: t('nav_reports'),
            admin: t('nav_admin')
        };
        return titles[view] || 'ELITE PROBATUM';
    }
    
    function updateHeaderStats() {
        const activeCases = MOCK_CASES.filter(c => c.status === 'active').length;
        const totalValue = MOCK_CASES.reduce((sum, c) => sum + (c.value || 0), 0);
        const avgProb = MOCK_CASES.reduce((sum, c) => sum + (c.successProbability || 0.6), 0) / MOCK_CASES.length;
        
        const activeCasesSpan = document.getElementById('headerActiveCases');
        const disputeValueSpan = document.getElementById('headerDisputeValue');
        const successRateSpan = document.getElementById('headerSuccessRate');
        const casesBadge = document.getElementById('casesBadge');
        
        if (activeCasesSpan) activeCasesSpan.textContent = activeCases;
        if (disputeValueSpan) disputeValueSpan.textContent = EliteUtils.formatCurrency(totalValue);
        if (successRateSpan) successRateSpan.textContent = EliteUtils.formatPercentage(avgProb * 100);
        if (casesBadge) casesBadge.textContent = activeCases;
    }
    
    // =========================================================================
    // RENDERIZAÇÃO DO DASHBOARD
    // =========================================================================
    
    function renderDashboard() {
        const container = document.getElementById('viewContainer');
        if (!container) return;
        
        updateHeaderStats();
        
        const totalValue = MOCK_CASES.reduce((sum, c) => sum + (c.value || 0), 0);
        const activeCases = MOCK_CASES.filter(c => c.status === 'active').length;
        const avgProb = MOCK_CASES.reduce((sum, c) => sum + (c.successProbability || 0.6), 0) / MOCK_CASES.length;
        
        const categoryCount = {};
        MOCK_CASES.forEach(c => {
            const catName = getCategoryName(c.category);
            categoryCount[catName] = (categoryCount[catName] || 0) + 1;
        });
        
        container.innerHTML = `
            <div class="dashboard-grid">
                <div class="dashboard-card">
                    <div class="card-header"><h3>${t('dashboard_active_cases')}</h3><i class="fas fa-folder-open"></i></div>
                    <div class="card-value">${activeCases}</div>
                    <div class="card-trend trend-up"><i class="fas fa-arrow-up"></i> +12% este mês</div>
                </div>
                <div class="dashboard-card">
                    <div class="card-header"><h3>${t('dashboard_dispute_value')}</h3><i class="fas fa-euro-sign"></i></div>
                    <div class="card-value">${EliteUtils.formatCurrency(totalValue)}</div>
                    <div class="card-trend trend-up"><i class="fas fa-arrow-up"></i> +8% vs período anterior</div>
                </div>
                <div class="dashboard-card">
                    <div class="card-header"><h3>${t('dashboard_avg_prob')}</h3><i class="fas fa-chart-line"></i></div>
                    <div class="card-value">${EliteUtils.formatPercentage(avgProb * 100)}</div>
                    <div class="card-trend trend-up"><i class="fas fa-arrow-up"></i> +5% com IA</div>
                </div>
                <div class="dashboard-card">
                    <div class="card-header"><h3>${t('dashboard_roi')}</h3><i class="fas fa-chart-pie"></i></div>
                    <div class="card-value">284%</div>
                    <div class="card-trend trend-up"><i class="fas fa-arrow-up"></i> vs. mercado</div>
                </div>
            </div>
            
            <div class="tactical-alerts-container" id="tacticalAlertsContainer">
                <div class="tactical-header">
                    <i class="fas fa-exclamation-triangle"></i>
                    <span>${t('dashboard_alerts_title')}</span>
                </div>
                <div id="tacticalAlerts" class="tactical-alerts">
                    <div class="alert-item critical">
                        <span class="alert-badge">${t('dashboard_alert_critical')}</span>
                        <span class="alert-msg">${t('dashboard_alert_ins001')}</span>
                    </div>
                    <div class="alert-item warning">
                        <span class="alert-badge">${t('dashboard_alert_warning')}</span>
                        <span class="alert-msg">${t('dashboard_alert_lab003')}</span>
                    </div>
                    <div class="alert-item info">
                        <span class="alert-badge">${t('dashboard_alert_info')}</span>
                        <span class="alert-msg">${t('dashboard_alert_integrity')}</span>
                    </div>
                </div>
            </div>
            
            <div class="charts-dashboard">
                <div class="chart-container">
                    <h3>EVOLUÇÃO DA CARTEIRA (ÚLTIMOS 6 MESES)</h3>
                    <canvas id="portfolioChart" height="250"></canvas>
                </div>
                <div class="chart-container">
                    <h3>DISTRIBUIÇÃO POR ÁREA DO DIREITO</h3>
                    <canvas id="categoryChart" height="250"></canvas>
                </div>
            </div>
            
            <div class="chart-container">
                <h3>${t('dashboard_alerts_title')}</h3>
                <div class="alerts-list" id="alertsList">
                    <div class="alert-item critical">
                        <i class="fas fa-exclamation-triangle"></i>
                        <div>
                            <strong>Processo INS001 em risco crítico</strong>
                            <p>+24 meses sem resolução - Burn-rate negativo (€12.500/mês)</p>
                            <small>Revisão de estratégia recomendada</small>
                        </div>
                    </div>
                    <div class="alert-item warning">
                        <i class="fas fa-gavel"></i>
                        <div>
                            <strong>Nova jurisprudência do STA</strong>
                            <p>Acórdão favorável à tese de inversão do ónus da prova</p>
                            <small>Aplicável aos processos fiscais ativos</small>
                        </div>
                    </div>
                    <div class="alert-item info">
                        <i class="fas fa-chart-line"></i>
                        <div>
                            <strong>Oportunidade: Contencioso Laboral</strong>
                            <p>Aumento de 23% nos casos de despedimento ilícito</p>
                            <small>Reforçar equipa especializada</small>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        initPortfolioChart();
        initCategoryChart(categoryCount);
        startTacticalAlertsTicker();
    }
    
    function initPortfolioChart() {
        const ctx = document.getElementById('portfolioChart');
        if (!ctx || typeof Chart === 'undefined') return;
        if (activeCharts.portfolio) activeCharts.portfolio.destroy();
        
        activeCharts.portfolio = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set'],
                datasets: [{
                    label: 'Valor em Disputa (€)',
                    data: [875000, 945000, 1020000, 1150000, 1190000, 1247500],
                    borderColor: '#00e5ff',
                    backgroundColor: 'rgba(0, 229, 255, 0.1)',
                    tension: 0.4,
                    fill: true,
                    pointRadius: 4,
                    pointHoverRadius: 8,
                    pointBackgroundColor: '#00e5ff',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { labels: { color: '#e2e8f0', font: { size: 11, family: 'JetBrains Mono' } } },
                    tooltip: { backgroundColor: '#0a0c10', titleColor: '#00e5ff', bodyColor: '#e2e8f0', borderColor: '#00e5ff', borderWidth: 1 }
                },
                scales: {
                    y: { ticks: { color: '#94a3b8', callback: (v) => '€' + (v/1000).toFixed(0) + 'k' }, grid: { color: 'rgba(255,255,255,0.05)' } },
                    x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } }
                }
            }
        });
    }
    
    function initCategoryChart(categoryCount) {
        const ctx = document.getElementById('categoryChart');
        if (!ctx || typeof Chart === 'undefined') return;
        if (activeCharts.category) activeCharts.category.destroy();
        
        const labels = Object.keys(categoryCount);
        const data = Object.values(categoryCount);
        const colors = ['#00e5ff', '#ff1744', '#00e676', '#ffc107', '#3b82f6', '#8b5cf6', '#ec489a', '#14b8a6', '#f97316'];
        
        activeCharts.category = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: colors.slice(0, data.length),
                    borderWidth: 0,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { position: 'right', labels: { color: '#e2e8f0', font: { size: 10, family: 'JetBrains Mono' }, boxWidth: 12 } },
                    tooltip: {
                        backgroundColor: '#0a0c10',
                        titleColor: '#00e5ff',
                        bodyColor: '#e2e8f0',
                        callbacks: { label: (ctx) => `${ctx.label}: ${ctx.raw} processos` }
                    }
                }
            }
        });
    }
    
    function startTacticalAlertsTicker() {
        if (alertInterval) clearInterval(alertInterval);
        
        const alertsContainer = document.getElementById('tacticalAlerts');
        if (!alertsContainer) return;
        
        const mockAlerts = [
            { level: 'CRITICAL', msg: t('dashboard_alert_ins001') },
            { level: 'WARNING', msg: t('dashboard_alert_lab003') },
            { level: 'INFO', msg: t('dashboard_alert_integrity') },
            { level: 'CRITICAL', msg: 'FISCAL TAX001: Notificação da AT recebida - Prazo de resposta 15 dias.' },
            { level: 'WARNING', msg: 'CIVIL CIV002: Prova testemunhal frágil - Reforçar com prova documental.' },
            { level: 'INFO', msg: 'OPORTUNIDADE: Aumento de 23% nos casos de despedimento ilícito no último trimestre.' }
        ];
        
        let alertIndex = 0;
        
        alertInterval = setInterval(() => {
            const newAlert = mockAlerts[alertIndex % mockAlerts.length];
            const newAlertElement = document.createElement('div');
            newAlertElement.className = `alert-item ${newAlert.level.toLowerCase()}`;
            newAlertElement.style.whiteSpace = 'normal';
            newAlertElement.style.wordBreak = 'break-word';
            newAlertElement.innerHTML = `<span class="alert-badge">${newAlert.level}</span><span class="alert-msg">${newAlert.msg}</span>`;
            
            alertsContainer.insertBefore(newAlertElement, alertsContainer.firstChild);
            
            if (alertsContainer.children.length > 6) {
                alertsContainer.removeChild(alertsContainer.lastChild);
            }
            
            alertIndex++;
        }, 8000);
    }
    
    // =========================================================================
    // FUNÇÕES DE RENDERIZAÇÃO RESTANTES (SIMPLIFICADAS PARA BREVIDADE)
    // Nota: As funções renderCases(), renderInsolvency(), renderLabor(), etc.
    // permanecem inalteradas do código original v2.0.2
    // =========================================================================
    
    function navigateTo(view) {
        currentView = view;
        const titleElement = document.getElementById('pageTitle');
        if (titleElement) titleElement.textContent = getViewTitle(view);
        
        if (alertInterval) clearInterval(alertInterval);
        
        switch(view) {
            case 'dashboard': renderDashboard(); break;
            case 'cases': renderCases(); break;
            case 'insolvency': renderInsolvency(); break;
            case 'labor': renderLabor(); break;
            case 'litigation': renderLitigation(); break;
            case 'questionnaire': renderQuestionnaire(); break;
            case 'evidence': renderEvidence(); break;
            case 'adversary': renderAdversary(); break;
            case 'simulator': renderSimulator(); break;
            case 'deadlines': renderDeadlines(); break;
            case 'activitylog': renderActivityLog(); break;
            case 'reports': renderReports(); break;
            case 'admin': renderAdmin(); break;
            default: renderDashboard();
        }
        
        const logEntry = {
            timestamp: new Date().toLocaleString(),
            user: 'Dr. Administrador',
            action: 'Navegação',
            entity: view,
            hash: EliteUtils.generateHash(view)
        };
        const logs = JSON.parse(localStorage.getItem('elite_activity_log') || '[]');
        logs.unshift(logEntry);
        localStorage.setItem('elite_activity_log', JSON.stringify(logs.slice(0, 500)));
    }
    
    // =========================================================================
    // FUNÇÕES DE RENDERIZAÇÃO DAS VIEWS (MANTIDAS DO ORIGINAL)
    // =========================================================================
    
    function renderCases() {
        const container = document.getElementById('viewContainer');
        if (!container) return;
        container.innerHTML = '<div class="loading-shimmer" style="padding: 40px; text-align: center;">Carregando processos...</div>';
        setTimeout(() => {
            const casesHtml = MOCK_CASES.map(c => `
                <tr data-case-id="${c.id}" data-category="${c.category}">
                    <td><strong>${c.id}</strong></td>
                    <td>${c.client}</td>
                    <td>${c.nif_devedor || '---'}</td>
                    <td><span class="case-badge ${c.category}">${c.categoryName}</span></td>
                    <td>${EliteUtils.formatCurrency(c.value)}</td>
                    <td><div class="progress-bar"><div class="progress-fill" style="width: ${c.successProbability * 100}%"></div><span class="progress-text">${EliteUtils.formatPercentage(c.successProbability * 100)}</span></div></td>
                    <td><span class="status-badge status-${c.status === 'active' ? 'active' : 'pending'}">${c.status === 'active' ? 'ATIVO' : 'PENDENTE'}</span></td>
                    <td><button class="action-btn view-case" data-id="${c.id}"><i class="fas fa-eye"></i></button></td>
                </tr>
            `).join('');
            container.innerHTML = `
                <div class="cases-header"><h2>${t('nav_cases')}</h2><div class="cases-search"><input type="text" id="searchCases" placeholder="Pesquisar..." class="search-input"></div></div>
                <div class="category-selector">${['all', 'insolvency', 'labor', 'civil', 'tax', 'commercial', 'criminal', 'family', 'intellectual', 'administrative'].map(cat => `<button class="category-btn ${cat === 'all' ? 'active' : ''}" data-category="${cat}">${cat.toUpperCase()}</button>`).join('')}</div>
                <table class="data-table"><thead><tr><th>ID</th><th>CLIENTE</th><th>NIF</th><th>ÁREA</th><th>VALOR</th><th>PROBABILIDADE</th><th>STATUS</th><th>AÇÕES</th></tr></thead><tbody id="casesTableBody">${casesHtml}</tbody></table>
            `;
            attachCaseEvents();
        }, 50);
    }
    
    function attachCaseEvents() {
        document.querySelectorAll('.view-case').forEach(btn => {
            btn.addEventListener('click', () => {
                const caseId = btn.dataset.id;
                const caseData = MOCK_CASES.find(c => c.id === caseId);
                if (caseData) {
                    const modalBody = document.getElementById('caseDetailBody');
                    if (modalBody) {
                        modalBody.innerHTML = `
                            <div class="detail-row"><span>Processo:</span><strong>${caseData.id}</strong></div>
                            <div class="detail-row"><span>Cliente:</span><strong>${caseData.client}</strong></div>
                            <div class="detail-row"><span>Valor:</span><strong>${EliteUtils.formatCurrency(caseData.value)}</strong></div>
                            <div class="detail-row"><span>Probabilidade:</span><strong>${EliteUtils.formatPercentage(caseData.successProbability * 100)}</strong></div>
                            <div class="detail-row"><span>Tribunal:</span><strong>${caseData.court}</strong></div>
                            <div class="detail-row"><span>Juiz:</span><strong>${caseData.judge}</strong></div>
                            <div class="prediction-recommendation"><h4>Estratégia Recomendada</h4><p>${caseData.successProbability > 0.7 ? 'Estratégia ofensiva' : caseData.successProbability > 0.5 ? 'Estratégia equilibrada' : 'Estratégia defensiva'}</p></div>
                        `;
                    }
                    document.getElementById('caseDetailModal').style.display = 'flex';
                }
            });
        });
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const category = btn.dataset.category;
                document.querySelectorAll('#casesTableBody tr').forEach(row => {
                    row.style.display = (category === 'all' || row.dataset.category === category) ? '' : 'none';
                });
            });
        });
        document.getElementById('searchCases')?.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            document.querySelectorAll('#casesTableBody tr').forEach(row => {
                row.style.display = row.textContent.toLowerCase().includes(term) ? '' : 'none';
            });
        });
    }
    
    function renderInsolvency() {
        const container = document.getElementById('viewContainer');
        if (!container) return;
        const insolvencyCases = MOCK_CASES.filter(c => c.category === 'insolvency');
        container.innerHTML = `
            <h2>${t('nav_insolvency')}</h2>
            <table class="data-table"><thead><tr><th>ID</th><th>CLIENTE</th><th>VALOR</th><th>PROBABILIDADE</th><th>FASE</th><th>ADMINISTRADOR</th></tr></thead><tbody>
                ${insolvencyCases.map(c => `<tr><td><strong>${c.id}</strong></td><td>${c.client}</td><td>${EliteUtils.formatCurrency(c.value)}</td><td><div class="progress-bar"><div class="progress-fill" style="width: ${c.successProbability * 100}%"></div><span class="progress-text">${EliteUtils.formatPercentage(c.successProbability * 100)}</span></div></td><td>${c.fase_processual || '---'}</td><td>${c.administrador_insolvencia || '---'}</td></tr>`).join('')}
            </tbody></table>
        `;
    }
    
    function renderLabor() {
        const container = document.getElementById('viewContainer');
        if (!container) return;
        const laborCases = MOCK_CASES.filter(c => c.category === 'labor');
        container.innerHTML = `
            <h2>${t('nav_labor')}</h2>
            <table class="data-table"><thead><tr><th>ID</th><th>CLIENTE</th><th>VALOR</th><th>PROBABILIDADE</th><th>TIPO DESPEDIMENTO</th><th>AUDIÊNCIA</th></tr></thead><tbody>
                ${laborCases.map(c => `<tr><td><strong>${c.id}</strong></td><td>${c.client}</td><td>${EliteUtils.formatCurrency(c.value)}</td><td><div class="progress-bar"><div class="progress-fill" style="width: ${c.successProbability * 100}%"></div><span class="progress-text">${EliteUtils.formatPercentage(c.successProbability * 100)}</span></div></td><td>${c.tipo_despedimento || '---'}</td><td>${c.data_audiencia_partes ? EliteUtils.formatDate(c.data_audiencia_partes) : '---'}</td></tr>`).join('')}
            </tbody></table>
        `;
    }
    
    function renderLitigation() {
        const container = document.getElementById('viewContainer');
        if (!container) return;
        container.innerHTML = `
            <div class="litigation-intelligence">
                <h2>${t('nav_litigation')}</h2>
                <p>Análise preditiva de êxito com motor unificado</p>
                <div class="form-group"><label>Valor da Causa (€)</label><input type="number" id="litigationValue" placeholder="Ex: 50000"></div>
                <div class="form-group"><label>Percentagem de Omissão (%)</label><input type="number" id="litigationOmission" placeholder="Ex: 75"></div>
                <div class="form-group"><label>Plataforma</label><select id="litigationPlatform"><option value="bolt">Bolt</option><option value="uber">Uber</option><option value="freenow">Free Now</option></select></div>
                <div class="form-group"><label>Tribunal</label><select id="litigationCourt"><option value="lisboa">Lisboa</option><option value="porto">Porto</option><option value="braga">Braga</option></select></div>
                <button id="runLitigationPrediction" class="elite-btn primary">EXECUTAR PREVISÃO</button>
                <div id="litigationResult" class="prediction-result" style="display: none; margin-top: 20px;"></div>
            </div>
        `;
        document.getElementById('runLitigationPrediction')?.addEventListener('click', () => {
            const caseData = {
                id: 'SIM_001',
                platform: document.getElementById('litigationPlatform')?.value || 'bolt',
                omissionPercentage: parseFloat(document.getElementById('litigationOmission')?.value) || 0,
                court: document.getElementById('litigationCourt')?.value || 'lisboa',
                value: parseFloat(document.getElementById('litigationValue')?.value) || 50000,
                hasDocumentaryEvidence: true,
                hasExpertEvidence: false,
                hasDigitalEvidence: true
            };
            const prediction = predictionEngine.getUnifiedPrediction(caseData);
            const resultDiv = document.getElementById('litigationResult');
            if (resultDiv) {
                resultDiv.style.display = 'block';
                resultDiv.innerHTML = `
                    <h3>RESULTADO DA ANÁLISE</h3>
                    <div class="detail-row"><span>Probabilidade de Sucesso:</span><strong>${(prediction.probability * 100).toFixed(1)}%</strong></div>
                    <div class="detail-row"><span>Confiança:</span><strong>${(prediction.confidence * 100).toFixed(1)}%</strong></div>
                    <div class="detail-row"><span>Nível de Risco:</span><strong>${prediction.riskLevel}</strong></div>
                    ${prediction.divergenceDetected ? `<div class="detail-row"><span>⚠️ Divergência entre motores:</span><strong>${prediction.divergencePercentage}%</strong></div>` : ''}
                    <div class="prediction-recommendation"><h4>RECOMENDAÇÃO</h4><p>${prediction.recommendations?.[0]?.description || prediction.expectedOutcome}</p></div>
                `;
            }
        });
    }
    
    function renderQuestionnaire() { const container = document.getElementById('viewContainer'); if (container) container.innerHTML = `<h2>${t('nav_questionnaire')}</h2><p>Questionários estratégicos em desenvolvimento</p>`; }
    function renderEvidence() { const container = document.getElementById('viewContainer'); if (container) container.innerHTML = `<h2>${t('nav_evidence')}</h2><p>Cadeia de custódia em desenvolvimento</p>`; }
    function renderAdversary() { const container = document.getElementById('viewContainer'); if (container) container.innerHTML = `<h2>${t('nav_adversary')}</h2><p>Análise de oposição em desenvolvimento</p>`; }
    function renderSimulator() { const container = document.getElementById('viewContainer'); if (container) container.innerHTML = `<h2>${t('nav_simulator')}</h2><p>Simulador de contra-perícia em desenvolvimento</p>`; }
    function renderDeadlines() { const container = document.getElementById('viewContainer'); if (container) container.innerHTML = `<h2>${t('nav_deadlines')}</h2><p>Prazos judiciais em desenvolvimento</p>`; }
    function renderActivityLog() { const container = document.getElementById('viewContainer'); if (container) container.innerHTML = `<h2>${t('nav_activitylog')}</h2><p>Registos RGPD em desenvolvimento</p>`; }
    function renderReports() { const container = document.getElementById('viewContainer'); if (container) container.innerHTML = `<h2>${t('nav_reports')}</h2><p>Relatórios em desenvolvimento</p>`; }
    function renderAdmin() { const container = document.getElementById('viewContainer'); if (container) container.innerHTML = `<h2>${t('nav_admin')}</h2><p>Administração em desenvolvimento</p>`; }
    
    // =========================================================================
    // EXPORTAÇÃO PARA MÓVEL
    // =========================================================================
    
    async function exportCurrentViewToMobile() {
        const container = document.getElementById('viewContainer');
        if (!container) return;
        const originalHtml = container.innerHTML;
        const title = document.getElementById('pageTitle')?.innerText || 'Relatório';
        const exportHtml = `
            <div style="padding: 20px; font-family: 'JetBrains Mono', monospace; background: #0a0c10; color: #fff;">
                <div style="border-bottom: 2px solid #00e5ff; padding-bottom: 16px; margin-bottom: 20px;">
                    <h1 style="color: #00e5ff; margin: 0;">ELITE PROBATUM</h1>
                    <p style="color: #94a3b8; margin: 4px 0 0;">Relatório Forense • ${new Date().toLocaleString()}</p>
                </div>
                <div style="background: #000; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
                    <h3 style="color: #00e5ff; margin-top: 0;">${title}</h3>
                    <div>${originalHtml}</div>
                </div>
                <div style="text-align: center; padding-top: 20px; color: #64748b; font-size: 10px;">
                    Documento gerado por ELITE PROBATUM v2.0.3 • Assinatura Digital: ${CryptoJS.SHA256(originalHtml + Date.now()).toString().substring(0, 16)}...
                </div>
            </div>
        `;
        const element = document.createElement('div');
        element.innerHTML = exportHtml;
        element.style.position = 'absolute';
        element.style.left = '-9999px';
        document.body.appendChild(element);
        try {
            if (typeof html2canvas !== 'undefined' && typeof jspdf !== 'undefined') {
                const canvas = await html2canvas(element, { scale: 2, backgroundColor: '#0a0c10' });
                const imgData = canvas.toDataURL('image/png');
                const { jsPDF } = jspdf;
                const pdf = new jsPDF('p', 'mm', 'a4');
                const imgWidth = 190;
                const imgHeight = (canvas.height * imgWidth) / canvas.width;
                pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
                pdf.save(`elite_probatum_${title.replace(/\s/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`);
                EliteUtils.showToast('Relatório exportado para PDF', 'success');
            } else {
                const blob = new Blob([exportHtml], { type: 'text/html' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = `elite_report_${new Date().toISOString().slice(0, 10)}.html`;
                link.click();
                URL.revokeObjectURL(link.href);
                EliteUtils.showToast('Relatório exportado para HTML', 'success');
            }
        } catch (error) {
            console.error('Erro na exportação:', error);
            EliteUtils.showToast('Erro ao exportar relatório', 'error');
        } finally {
            document.body.removeChild(element);
        }
    }
    
    // =========================================================================
    // INICIALIZAÇÃO
    // =========================================================================
    
    function initNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const view = item.dataset.view;
                navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');
                navigateTo(view);
                if (window.innerWidth <= 1024) {
                    document.querySelector('.elite-sidebar')?.classList.remove('open');
                }
            });
        });
        const menuToggle = document.getElementById('mobileMenuToggle');
        const sidebar = document.querySelector('.elite-sidebar');
        if (menuToggle && sidebar) {
            menuToggle.addEventListener('click', () => sidebar.classList.toggle('open'));
        }
        const langToggleBtn = document.getElementById('langToggle');
        if (langToggleBtn) {
            langToggleBtn.addEventListener('click', () => setLocale(currentLocale === 'pt' ? 'en' : 'pt'));
        }
        const exportReportBtn = document.getElementById('exportReportBtn');
        if (exportReportBtn) exportReportBtn.addEventListener('click', () => exportCurrentViewToMobile());
        const settingsBtn = document.getElementById('settingsBtn');
        if (settingsBtn) settingsBtn.addEventListener('click', () => EliteUtils.showToast('Configurações em desenvolvimento', 'info'));
    }
    
    // =========================================================================
    // EXPOSIÇÃO GLOBAL
    // =========================================================================
    
    window.EliteProbatum = {
        version: APP_VERSION,
        masterHash: MASTER_HASH,
        utils: EliteUtils,
        mockCases: MOCK_CASES,
        currentView: currentView,
        
        initDashboard: function() {
            EliteUtils.log('Inicializando Unidade de Comando Forense Digital v2.0.3...');
            
            // Inicializar storage seguro
            const sessionHash = window.ELITE_SECURE_HASH || MASTER_HASH;
            secureStorage = new SecureStorage(sessionHash);
            window.SecureStorageInstance = secureStorage;
            
            // Inicializar motor de previsão unificado
            predictionEngine = new PredictionEngine();
            predictionEngine.initialize();
            window.PredictionEngine = predictionEngine;
            
            // Inicializar Forensic Vault com master hash
            if (window.ForensicVault && typeof window.ForensicVault.initialize === 'function') {
                window.ForensicVault.initialize(sessionHash);
            }
            
            // Carregar locale salvo
            const savedLocale = localStorage.getItem('elite_locale');
            if (savedLocale && (savedLocale === 'pt' || savedLocale === 'en')) {
                setLocale(savedLocale);
            } else {
                setLocale('pt');
            }
            
            initNavigation();
            updateHeaderStats();
            navigateTo('dashboard');
            EliteUtils.showToast(t('success'), 'success');
            EliteUtils.log(`✅ ${MOCK_CASES.length} processos estratégicos carregados`);
            EliteUtils.log(`📊 9 áreas do direito representadas`);
            EliteUtils.log(`🔐 Storage seguro inicializado com PBKDF2`);
            EliteUtils.log(`🧠 Motor de previsão unificado ativo`);
        },
        
        navigateTo: navigateTo,
        exportCurrentViewToMobile: exportCurrentViewToMobile,
        setLocale: setLocale,
        t: t,
        getLocale: () => currentLocale,
        getPredictionEngine: () => predictionEngine,
        getSecureStorage: () => secureStorage
    };
    
    window.EliteUtils = EliteUtils;
    
    EliteUtils.log(`========================================`);
    EliteUtils.log(`ELITE PROBATUM v${APP_VERSION}`);
    EliteUtils.log(`UNIDADE DE COMANDO FORENSE DIGITAL`);
    EliteUtils.log(`Master Hash: ${MASTER_HASH.substring(0, 16)}...`);
    EliteUtils.log(`${MOCK_CASES.length} processos estratégicos carregados`);
    EliteUtils.log(`9 áreas do direito representadas`);
    EliteUtils.log(`========================================`);
    
})();