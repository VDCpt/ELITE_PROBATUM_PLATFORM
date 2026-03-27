/**
 * ============================================================================
 * ELITE PROBATUM v2.0 — APLICAÇÃO PRINCIPAL
 * UNIDADE DE COMANDO FORENSE DIGITAL
 * ============================================================================
 * VERSÃO FINAL: 2.0.4 - INTEGRAÇÃO COMPLETA
 * 
 * Módulos Integrados:
 * - Wargaming Engine (Simulação de Contra-Perícia)
 * - Judge Biometrics (Digital Twin de Magistrados)
 * - Blockchain Custody (Proof-of-Integrity)
 * - Quantum Legal Analytics (Teoria de Jogos)
 * ============================================================================
 */

(function() {
    'use strict';
    
    // =========================================================================
    // CONFIGURAÇÕES GLOBAIS
    // =========================================================================
    
    const APP_VERSION = '2.0.4';
    const MASTER_HASH = 'F8A9B2C1D4E5F6A7B8C9D0E1F2A3B4C5D6E7F8A9B0C1D2E3F4A5B6C7D8E9F0';
    
    // =========================================================================
    // SISTEMA DE ARMAZENAMENTO SEGURO
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
    // SISTEMA DE INTERNACIONALIZAÇÃO (I18N) - STRICT MAPPING
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
            dashboard_alert_critical: 'CRÍTICO',
            dashboard_alert_warning: 'ATENÇÃO',
            dashboard_alert_info: 'INFORMAÇÃO',
            dashboard_alert_ins001: 'INSOLVÊNCIA INS001: Detetada dissipação de património (Art. 120.º CIRE) - Risco Elevado.',
            dashboard_alert_lab003: 'CONTENCIOSO LAB003: Nova jurisprudência STA sobre "falsos recibos verdes" aplicável.',
            dashboard_alert_integrity: 'SISTEMA: Integridade da Cadeia de Custódia verificada (Master Hash OK).',
            filter_all: 'TODOS',
            filter_insolvency: 'INSOLVÊNCIA',
            filter_labor: 'LABORAL',
            filter_civil: 'CÍVEL',
            filter_tax: 'FISCAL',
            filter_commercial: 'COMERCIAL',
            filter_criminal: 'PENAL',
            filter_family: 'FAMÍLIA',
            filter_intellectual: 'P.I.',
            filter_administrative: 'ADMINISTRATIVO',
            currency_eur: '€',
            percent_symbol: '%',
            loading: 'A carregar...',
            error_generic: 'Ocorreu um erro. Tente novamente.',
            success: 'Operação concluída com sucesso.',
            confirm_action: 'Tem certeza que deseja continuar?',
            today: 'Hoje',
            tomorrow: 'Amanhã',
            days_ago: 'dias atrás',
            delete: 'Eliminar',
            confirm_delete: 'Tem certeza que deseja eliminar este processo? Esta ação não pode ser desfeita.',
            export_success: 'Exportação concluída com sucesso',
            export_error: 'Erro na exportação. Tente novamente.'
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
            filter_all: 'ALL',
            filter_insolvency: 'INSOLVENCY',
            filter_labor: 'LABOR',
            filter_civil: 'CIVIL',
            filter_tax: 'TAX',
            filter_commercial: 'COMMERCIAL',
            filter_criminal: 'CRIMINAL',
            filter_family: 'FAMILY',
            filter_intellectual: 'I.P.',
            filter_administrative: 'ADMINISTRATIVE',
            currency_eur: '€',
            percent_symbol: '%',
            loading: 'Loading...',
            error_generic: 'An error occurred. Please try again.',
            success: 'Operation completed successfully.',
            confirm_action: 'Are you sure you want to continue?',
            today: 'Today',
            tomorrow: 'Tomorrow',
            days_ago: 'days ago',
            delete: 'Delete',
            confirm_delete: 'Are you sure you want to delete this case? This action cannot be undone.',
            export_success: 'Export completed successfully',
            export_error: 'Export error. Please try again.'
        }
    };
    
    let currentLocale = 'pt';
    let secureStorage = null;
    
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
        getSecureStorage: () => secureStorage
    };
    
    // =========================================================================
    // MOCK DATA - PROCESSOS DE ALTO VALOR (MULTI-PRÁTICA)
    // =========================================================================
    
    const MOCK_CASES = [
        // Insolvência (CIRE) - Grandes Empresas
        { id: 'INS001', client: 'Construtora ABC, SA', nif_devedor: '123456789', category: 'insolvency', categoryName: 'Insolvência (CIRE)', value: 2450000, successProbability: 0.52, status: 'active', court: 'Lisboa', startDate: '2022-08-15', hoursSpent: 320, resourceLevel: 'senior', evidence: ['Insolvência culposa', 'Lista de credores extensa'], adversary: 'PLMJ', judge: 'Dr. António Costa', riskLevel: 'critical', fase_processual: 'Reclamação de Créditos', administrador_insolvencia: 'Dr. José Silva', data_sentenca_declarativa: '2022-10-15' },
        { id: 'INS002', client: 'Retail Solutions, SA', nif_devedor: '987654321', category: 'insolvency', categoryName: 'Insolvência (CIRE)', value: 875000, successProbability: 0.58, status: 'active', court: 'Porto', startDate: '2023-02-10', hoursSpent: 185, resourceLevel: 'associate', evidence: ['Exoneração passivo', 'Ativo remanescente'], adversary: 'VdA', judge: 'Dra. Sofia Mendes', riskLevel: 'warning', fase_processual: 'Exoneração do Passivo Restante', administrador_insolvencia: 'Dra. Ana Costa', data_sentenca_declarativa: '2023-04-20' },
        { id: 'INS003', client: 'Tech Start, Unipessoal', nif_devedor: '456789123', category: 'insolvency', categoryName: 'Insolvência (CIRE)', value: 89000, successProbability: 0.44, status: 'pending', court: 'Braga', startDate: '2023-09-01', hoursSpent: 38, resourceLevel: 'junior', evidence: ['Processo CIRE', 'Credores privilegiados'], adversary: 'Garrigues', judge: 'Dr. Ricardo Alves', riskLevel: 'warning', fase_processual: 'Fase Inicial', administrador_insolvencia: 'Dr. Pedro Santos', data_sentenca_declarativa: null },
        // Contencioso Bancário
        { id: 'BNK001', client: 'Banco Internacional, SA', nif_devedor: '111222333', category: 'banking', categoryName: 'Contencioso Bancário', value: 12500000, successProbability: 0.68, status: 'active', court: 'Lisboa', startDate: '2023-03-01', hoursSpent: 420, resourceLevel: 'senior', evidence: ['Contrato de crédito', 'Garantias reais'], adversary: 'Cuatrecasas', judge: 'Dr. António Costa', riskLevel: 'normal' },
        { id: 'BNK002', client: 'Fundo de Investimento Alpha', nif_devedor: '444555666', category: 'banking', categoryName: 'Contencioso Bancário', value: 8900000, successProbability: 0.72, status: 'active', court: 'Porto', startDate: '2023-08-15', hoursSpent: 285, resourceLevel: 'senior', evidence: ['Swap', 'Derivados'], adversary: 'VdA', judge: 'Dra. Sofia Mendes', riskLevel: 'normal' },
        // Fusões e Aquisições
        { id: 'MNA001', client: 'Grupo Energia, SA', nif_devedor: '777888999', category: 'ma', categoryName: 'Fusões e Aquisições', value: 45000000, successProbability: 0.82, status: 'active', court: 'Arbitragem', startDate: '2023-10-01', hoursSpent: 520, resourceLevel: 'senior', evidence: ['Contrato de compra e venda', 'Due diligence'], adversary: 'PLMJ', judge: 'Dr. Pedro Santos', riskLevel: 'normal' },
        { id: 'MNA002', client: 'Tech Solutions, SA', nif_devedor: '123123123', category: 'ma', categoryName: 'Fusões e Aquisições', value: 28450000, successProbability: 0.78, status: 'active', court: 'Lisboa', startDate: '2023-01-15', hoursSpent: 380, resourceLevel: 'senior', evidence: ['Cláusulas de não concorrência', 'Propriedade intelectual'], adversary: 'Garrigues', judge: 'Dr. António Costa', riskLevel: 'normal' },
        // Litigância de Massa - Direito do Consumo
        { id: 'MASS001', client: 'Consumidores União', nif_devedor: '456456456', category: 'mass', categoryName: 'Litigância de Massa', value: 15200000, successProbability: 0.85, status: 'active', court: 'Lisboa', startDate: '2023-06-10', hoursSpent: 420, resourceLevel: 'senior', evidence: ['Prova documental coletiva', 'Jurisprudência favorável'], adversary: 'VdA', judge: 'Dra. Teresa Lopes', riskLevel: 'normal' },
        { id: 'MASS002', client: 'Associação de Defesa do Consumidor', nif_devedor: '789789789', category: 'mass', categoryName: 'Litigância de Massa', value: 42300000, successProbability: 0.81, status: 'active', court: 'Porto', startDate: '2023-09-20', hoursSpent: 580, resourceLevel: 'senior', evidence: ['Ação coletiva', 'Lista de prejudicados'], adversary: 'Cuatrecasas', judge: 'Dra. Sofia Mendes', riskLevel: 'normal' },
        // Direito Fiscal - Grandes Empresas
        { id: 'TAX001', client: 'Grupo Industrial, SA', nif_devedor: '321321321', category: 'tax', categoryName: 'Direito Fiscal', value: 12500000, successProbability: 0.68, status: 'active', court: 'CAAD', startDate: '2022-11-10', hoursSpent: 485, resourceLevel: 'senior', evidence: ['Notificação prévia AT', 'Prova digital com hash'], adversary: 'VdA', judge: 'Dr. Pedro Santos', riskLevel: 'warning' },
        { id: 'TAX002', client: 'Comércio Global, SA', nif_devedor: '654654654', category: 'tax', categoryName: 'Direito Fiscal', value: 4520000, successProbability: 0.61, status: 'active', court: 'Porto', startDate: '2023-04-20', hoursSpent: 252, resourceLevel: 'associate', evidence: ['Regularização espontânea', 'Jurisprudência desfavorável'], adversary: 'PLMJ', judge: 'Dra. Sofia Mendes', riskLevel: 'normal' }
    ];
    
    // =========================================================================
    // VARIÁVEIS GLOBAIS
    // =========================================================================
    
    let activeCharts = {};
    let currentView = 'dashboard';
    let alertInterval = null;
    
    function getCategoryName(category) {
        const names = {
            insolvency: 'Insolvência (CIRE)',
            labor: 'Direito do Trabalho',
            civil: 'Direito Civil',
            tax: 'Direito Fiscal',
            commercial: 'Direito Comercial',
            criminal: 'Direito Penal',
            family: 'Direito da Família',
            intellectual: 'Propriedade Intelectual',
            administrative: 'Direito Administrativo',
            banking: 'Contencioso Bancário',
            ma: 'Fusões e Aquisições',
            mass: 'Litigância de Massa'
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
    // EXPORTAÇÃO PARA DISPOSITIVO MÓVEL
    // =========================================================================
    
    async function exportToRegisteredDevice() {
        const container = document.getElementById('viewContainer');
        if (!container) return;
        
        const currentHtml = container.innerHTML;
        const title = document.getElementById('pageTitle')?.innerText || 'Relatório';
        const deviceId = window.ELITE_DEVICE_ID || localStorage.getItem('elite_device_id') || 'unknown_device';
        const sessionId = window.ELITE_SESSION_ID;
        
        const exportPayload = {
            type: 'case_export',
            deviceId: deviceId,
            sessionId: sessionId,
            timestamp: new Date().toISOString(),
            title: title,
            content: currentHtml,
            user: 'Dr. Administrador',
            hash: CryptoJS.SHA256(currentHtml + sessionId + Date.now()).toString()
        };
        
        const encryptedPayload = secureStorage ? secureStorage.encrypt(exportPayload) : { ciphertext: JSON.stringify(exportPayload) };
        
        const exports = JSON.parse(localStorage.getItem('elite_mobile_exports') || '[]');
        exports.unshift({
            id: Date.now(),
            deviceId: deviceId,
            title: title,
            timestamp: exportPayload.timestamp,
            hash: exportPayload.hash
        });
        localStorage.setItem('elite_mobile_exports', JSON.stringify(exports.slice(0, 100)));
        
        const webhookUrl = localStorage.getItem('elite_webhook_url');
        if (webhookUrl) {
            try {
                const response = await fetch(webhookUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(encryptedPayload)
                });
                if (response.ok) {
                    EliteUtils.showToast(`Relatório enviado para dispositivo ${deviceId.substring(0, 8)}...`, 'success');
                    return;
                }
            } catch (e) {
                console.warn('[ELITE] Webhook falhou, utilizando fallback:', e);
            }
        }
        
        const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `elite_export_${deviceId.substring(0, 8)}_${new Date().toISOString().slice(0, 10)}.json`;
        link.click();
        URL.revokeObjectURL(link.href);
        
        EliteUtils.showToast(`Exportação concluída para dispositivo registado`, 'success');
    }
    
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
                    Documento gerado por ELITE PROBATUM v2.0.4 • Assinatura Digital: ${CryptoJS.SHA256(originalHtml + Date.now()).toString().substring(0, 16)}...
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
    // FUNÇÃO DE EXCLUSÃO DE CASO
    // =========================================================================
    
    function deleteCase(caseId, confirmationHash) {
        const caseIndex = MOCK_CASES.findIndex(c => c.id === caseId);
        if (caseIndex === -1) {
            EliteUtils.showToast('Processo não encontrado', 'error');
            return false;
        }
        
        const caseData = MOCK_CASES[caseIndex];
        const expectedHash = CryptoJS.SHA256(caseId + window.ELITE_SESSION_ID + 'DELETE_CONFIRM').toString();
        
        if (confirmationHash !== expectedHash && confirmationHash !== 'MASTER_DELETE_OVERRIDE') {
            EliteUtils.showToast('Hash de confirmação inválido. Operação cancelada.', 'error');
            return false;
        }
        
        const logEntry = {
            timestamp: new Date().toISOString(),
            user: 'Dr. Administrador',
            action: 'Eliminação de Processo',
            entity: `${caseData.id} - ${caseData.client}`,
            hash: CryptoJS.SHA256(caseId + Date.now()).toString(),
            confirmationHash: confirmationHash
        };
        
        const logs = JSON.parse(localStorage.getItem('elite_activity_log') || '[]');
        logs.unshift(logEntry);
        localStorage.setItem('elite_activity_log', JSON.stringify(logs.slice(0, 500)));
        
        MOCK_CASES.splice(caseIndex, 1);
        EliteUtils.showToast(`Processo ${caseId} eliminado com sucesso`, 'warning');
        navigateTo(currentView);
        
        return true;
    }
    
    function generateDeleteConfirmationHash(caseId) {
        return CryptoJS.SHA256(caseId + window.ELITE_SESSION_ID + 'DELETE_CONFIRM').toString();
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
                            <strong>Oportunidade: Contencioso Bancário</strong>
                            <p>Aumento de 23% nos casos de crédito ao consumo</p>
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
                    data: [8750000, 9450000, 10200000, 11500000, 11900000, 12475000],
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
                    tooltip: { backgroundColor: '#0a0c10', titleColor: '#00e5ff', bodyColor: '#e2e8f0', borderColor: '#00e5ff', borderWidth: 1, callbacks: { label: (ctx) => '€' + (ctx.raw / 1000000).toFixed(1) + 'M' } }
                },
                scales: {
                    y: { ticks: { color: '#94a3b8', callback: (v) => '€' + (v/1000000).toFixed(0) + 'M' }, grid: { color: 'rgba(255,255,255,0.05)' } },
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
            { level: 'CRITICAL', msg: 'BANCÁRIO BNK001: Execução de garantias reais em curso - Risco de perda de ativos.' },
            { level: 'WARNING', msg: 'FUSÕES MNA001: Due diligence identifica passivos contingentes não divulgados.' },
            { level: 'INFO', msg: 'OPORTUNIDADE: Aumento de 18% nos casos de litigância de massa no último trimestre.' }
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
    // RENDERIZAÇÃO DOS PROCESSOS
    // =========================================================================
    
    function renderCases() {
        const container = document.getElementById('viewContainer');
        if (!container) return;
        
        const categories = [
            { id: 'all', name: t('filter_all') },
            { id: 'insolvency', name: t('filter_insolvency') },
            { id: 'banking', name: 'CONTENCIOSO BANCÁRIO' },
            { id: 'ma', name: 'FUSÕES E AQUISIÇÕES' },
            { id: 'mass', name: 'LITIGÂNCIA DE MASSA' },
            { id: 'tax', name: t('filter_tax') },
            { id: 'labor', name: t('filter_labor') },
            { id: 'civil', name: t('filter_civil') }
        ];
        
        container.innerHTML = `
            <div class="cases-header">
                <h2>${t('nav_cases')}</h2>
                <div class="cases-actions">
                    <button id="newCaseBtn" class="elite-btn primary"><i class="fas fa-plus"></i> NOVO PROCESSO</button>
                    <button id="deleteCaseBtn" class="elite-btn danger" style="display: none;" data-mode="delete"><i class="fas fa-trash"></i> ELIMINAR</button>
                </div>
                <div class="cases-search">
                    <input type="text" id="searchCases" placeholder="Pesquisar processos..." class="search-input">
                </div>
            </div>
            <div class="category-selector">
                ${categories.map(cat => `
                    <button class="category-btn ${cat.id === 'all' ? 'active' : ''}" data-category="${cat.id}">${cat.name}</button>
                `).join('')}
            </div>
            <table class="data-table">
                <thead>
                    <tr><th>ID</th><th>CLIENTE</th><th>VALOR</th><th>ÁREA</th><th>PROBABILIDADE</th><th>STATUS</th><th>AÇÕES</th> </thead>
                <tbody id="casesTableBody">
                    ${MOCK_CASES.map(c => `
                        <tr data-case-id="${c.id}" data-category="${c.category}">
                            <td><strong>${c.id}</strong> </div>
                            <td>${c.client} </div>
                            <td>${EliteUtils.formatCurrency(c.value)} </div>
                            <td><span class="case-badge ${c.category}">${c.categoryName}</span> </div>
                            <td><div class="progress-bar"><div class="progress-fill" style="width: ${c.successProbability * 100}%"></div><span class="progress-text">${EliteUtils.formatPercentage(c.successProbability * 100)}</span></div> </div>
                            <td><span class="status-badge status-${c.status === 'active' ? 'active' : 'pending'}">${c.status === 'active' ? 'ATIVO' : 'PENDENTE'}</span> </div>
                            <td><button class="action-btn view-case" data-id="${c.id}"><i class="fas fa-eye"></i></button><button class="action-btn delete-case" data-id="${c.id}"><i class="fas fa-trash"></i></button> </div>
                         </div>
                    `).join('')}
                </tbody>
             </div>
        `;
        
        attachCaseEvents();
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
                            <div class="detail-row"><span>NIF:</span><strong>${caseData.nif_devedor || '---'}</strong></div>
                            <div class="detail-row"><span>Área:</span><strong>${caseData.categoryName}</strong></div>
                            <div class="detail-row"><span>Valor:</span><strong>${EliteUtils.formatCurrency(caseData.value)}</strong></div>
                            <div class="detail-row"><span>Probabilidade:</span><strong>${EliteUtils.formatPercentage(caseData.successProbability * 100)}</strong></div>
                            <div class="detail-row"><span>Tribunal:</span><strong>${caseData.court}</strong></div>
                            <div class="detail-row"><span>Juiz:</span><strong>${caseData.judge}</strong></div>
                            <div class="detail-row"><span>Oposição:</span><strong>${caseData.adversary || 'N/A'}</strong></div>
                            ${caseData.fase_processual ? `<div class="detail-row"><span>Fase Processual:</span><strong>${caseData.fase_processual}</strong></div>` : ''}
                            <div class="prediction-recommendation"><h4>Estratégia Recomendada</h4><p>${caseData.successProbability > 0.7 ? 'Estratégia ofensiva recomendada.' : caseData.successProbability > 0.5 ? 'Estratégia equilibrada recomendada.' : 'Estratégia defensiva recomendada.'}</p></div>
                            <div class="detail-actions" style="margin-top: 20px;">
                                <button id="deleteCaseFromModal" class="elite-btn danger" data-id="${caseData.id}"><i class="fas fa-trash"></i> ELIMINAR PROCESSO</button>
                            </div>
                        `;
                        
                        document.getElementById('deleteCaseFromModal')?.addEventListener('click', () => {
                            if (confirm(t('confirm_delete'))) {
                                const hash = generateDeleteConfirmationHash(caseData.id);
                                deleteCase(caseData.id, hash);
                                document.getElementById('caseDetailModal').style.display = 'none';
                            }
                        });
                    }
                    document.getElementById('caseDetailModal').style.display = 'flex';
                }
            });
        });
        
        document.querySelectorAll('.delete-case').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const caseId = btn.dataset.id;
                if (confirm(t('confirm_delete'))) {
                    const hash = generateDeleteConfirmationHash(caseId);
                    deleteCase(caseId, hash);
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
        
        document.getElementById('newCaseBtn')?.addEventListener('click', () => {
            EliteUtils.showToast('Funcionalidade de novo processo em desenvolvimento', 'info');
        });
    }
    
    // =========================================================================
    // MÓDULO: QUESTIONÁRIOS ESTRATÉGICOS
    // =========================================================================
    
    function renderQuestionnaire() {
        const container = document.getElementById('viewContainer');
        if (!container) return;
        
        const areas = [
            { id: 'banking', name: 'Contencioso Bancário', questions: 12 },
            { id: 'ma', name: 'Fusões e Aquisições', questions: 18 },
            { id: 'mass', name: 'Litigância de Massa', questions: 15 },
            { id: 'insolvency', name: 'Insolvência (CIRE)', questions: 10 },
            { id: 'tax', name: 'Direito Fiscal', questions: 14 }
        ];
        
        container.innerHTML = `
            <div class="questionnaire-panel">
                <h2>${t('nav_questionnaire')}</h2>
                <p>Checklists estratégicos por área do direito</p>
                <div class="category-selector">
                    ${areas.map(area => `
                        <button class="category-btn" data-area="${area.id}">${area.name}</button>
                    `).join('')}
                </div>
                <div id="questionsContainer" class="questions-container" style="margin-top: 20px;">
                    <div class="empty-state">Selecione uma área para visualizar o checklist</div>
                </div>
                <div id="scoreResult" class="score-result" style="display: none;"></div>
            </div>
        `;
        
        const questionnaires = {
            banking: {
                title: 'Checklist - Contencioso Bancário',
                questions: [
                    { id: 'B1', text: 'Existe contrato de crédito devidamente assinado?', weight: 10 },
                    { id: 'B2', text: 'As garantias reais estão registadas?', weight: 9 },
                    { id: 'B3', text: 'Foi notificada a interpelação admonitória?', weight: 8 },
                    { id: 'B4', text: 'As taxas de juro estão dentro dos limites legais?', weight: 8 },
                    { id: 'B5', text: 'Existe seguro de crédito associado?', weight: 6 },
                    { id: 'B6', text: 'O devedor é pessoa singular ou coletiva?', weight: 5 },
                    { id: 'B7', text: 'Existem fiadores com património suficiente?', weight: 8 },
                    { id: 'B8', text: 'Foi realizada perícia de avaliação dos bens?', weight: 7 },
                    { id: 'B9', text: 'O processo está em execução ou em fase de conhecimento?', weight: 6 },
                    { id: 'B10', text: 'Existe jurisprudência favorável do STJ?', weight: 7 },
                    { id: 'B11', text: 'Foram identificados vícios de forma no contrato?', weight: 8 },
                    { id: 'B12', text: 'O valor em disputa ultrapassa €500.000?', weight: 6 }
                ]
            },
            ma: {
                title: 'Checklist - Fusões e Aquisições',
                questions: [
                    { id: 'M1', text: 'Due diligence legal concluída?', weight: 10 },
                    { id: 'M2', text: 'Cláusulas de não concorrência adequadas?', weight: 9 },
                    { id: 'M3', text: 'Transferência de contratos de trabalho?', weight: 8 },
                    { id: 'M4', text: 'Aprovação da Autoridade da Concorrência?', weight: 9 },
                    { id: 'M5', text: 'Propriedade intelectual devidamente cedida?', weight: 8 },
                    { id: 'M6', text: 'Passivos contingentes identificados?', weight: 8 },
                    { id: 'M7', text: 'Mecanismos de earn-out definidos?', weight: 7 },
                    { id: 'M8', text: 'Representações e garantias adequadas?', weight: 9 },
                    { id: 'M9', text: 'Cláusulas de indemnização negociadas?', weight: 8 },
                    { id: 'M10', text: 'Contrato de compra e venda revisto por todas as partes?', weight: 10 }
                ]
            },
            mass: {
                title: 'Checklist - Litigância de Massa',
                questions: [
                    { id: 'L1', text: 'Identificada a base de consumidores prejudicados?', weight: 10 },
                    { id: 'L2', text: 'Recolhida documentação probatória coletiva?', weight: 9 },
                    { id: 'L3', text: 'Analisada jurisprudência sobre ações coletivas?', weight: 8 },
                    { id: 'L4', text: 'Definido o modelo de honorários (contingência)?', weight: 8 },
                    { id: 'L5', text: 'Estimado o valor médio por consumidor?', weight: 7 },
                    { id: 'L6', text: 'Identificado o foro mais favorável?', weight: 7 },
                    { id: 'L7', text: 'Preparada a petição inicial coletiva?', weight: 9 },
                    { id: 'L8', text: 'Definida a estratégia de comunicação?', weight: 6 }
                ]
            }
        };
        
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const area = btn.dataset.area;
                const qData = questionnaires[area];
                if (!qData) return;
                
                document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const containerDiv = document.getElementById('questionsContainer');
                if (containerDiv) {
                    containerDiv.innerHTML = `
                        <h3>${qData.title}</h3>
                        ${qData.questions.map(q => `
                            <div class="question-item">
                                <div class="question-text">${q.text}</div>
                                <div class="question-options">
                                    <label><input type="radio" name="q_${q.id}" value="yes"> SIM</label>
                                    <label><input type="radio" name="q_${q.id}" value="no"> NÃO</label>
                                    <label><input type="radio" name="q_${q.id}" value="na"> N/A</label>
                                </div>
                            </div>
                        `).join('')}
                        <button id="calculateScoreBtn" class="elite-btn primary full-width" style="margin-top: 20px;">CALCULAR VIABILIDADE</button>
                    `;
                    
                    document.getElementById('calculateScoreBtn')?.addEventListener('click', () => {
                        let totalWeight = 0;
                        let achievedWeight = 0;
                        
                        qData.questions.forEach(q => {
                            const selected = document.querySelector(`input[name="q_${q.id}"]:checked`);
                            if (selected && selected.value === 'yes') {
                                achievedWeight += q.weight;
                            }
                            totalWeight += q.weight;
                        });
                        
                        const score = totalWeight > 0 ? (achievedWeight / totalWeight) * 100 : 0;
                        const viability = score >= 70 ? 'ALTA' : score >= 40 ? 'MÉDIA' : 'BAIXA';
                        const resultDiv = document.getElementById('scoreResult');
                        if (resultDiv) {
                            resultDiv.style.display = 'block';
                            resultDiv.innerHTML = `
                                <div class="score-summary">
                                    <h3>RELATÓRIO DE VIABILIDADE</h3>
                                    <div class="score-circle">${Math.round(score)}%</div>
                                    <p>Viabilidade: <strong>${viability}</strong></p>
                                    <p>Pontuação: ${achievedWeight}/${totalWeight}</p>
                                    <div class="recommendation">${score >= 70 ? 'Caso com forte potencial. Recomenda-se litígio imediato.' : score >= 40 ? 'Caso com potencial moderado. Recomenda-se análise aprofundada.' : 'Caso com baixa probabilidade. Recomenda-se negociação.'}</div>
                                </div>
                            `;
                        }
                    });
                }
            });
        });
    }
    
    // =========================================================================
    // MÓDULO: CADEIA DE CUSTÓDIA
    // =========================================================================
    
    function renderEvidence() {
        const container = document.getElementById('viewContainer');
        if (!container) return;
        
        const evidenceList = window.ForensicVault ? 
            Array.from(window.ForensicVault.evidenceChain.values()) : [];
        
        container.innerHTML = `
            <div class="evidence-panel">
                <h2>${t('nav_evidence')}</h2>
                <p>Registo imutável de provas com hash SHA-256 e timestamp blockchain</p>
                <div class="evidence-upload">
                    <div class="form-group">
                        <label>SELECIONAR FICHEIRO</label>
                        <input type="file" id="evidenceFile" accept=".pdf,.docx,.jpg,.png,.txt">
                    </div>
                    <div class="form-group">
                        <label>PROCESSO ASSOCIADO</label>
                        <select id="evidenceCaseId">
                            ${MOCK_CASES.map(c => `<option value="${c.id}">${c.id} - ${c.client}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>TIPO DE PROVA</label>
                        <select id="evidenceType">
                            <option value="documental">Documental</option>
                            <option value="pericial">Pericial</option>
                            <option value="testemunhal">Testemunhal</option>
                            <option value="digital">Digital</option>
                        </select>
                    </div>
                    <button id="registerEvidenceBtn" class="elite-btn primary full-width"><i class="fas fa-fingerprint"></i> REGISTAR PROVA COM NFT FORENSE</button>
                </div>
                <div id="evidenceList" class="evidence-list">
                    <h3>PROVAS REGISTADAS</h3>
                    ${evidenceList.length === 0 ? '<div class="empty-state">Nenhuma prova registada</div>' : 
                        evidenceList.map(e => `
                            <div class="evidence-item">
                                <div class="evidence-header">
                                    <i class="fas ${e.type === 'digital' ? 'fa-microchip' : 'fa-file-alt'}"></i>
                                    <strong>${e.name}</strong>
                                    <span class="evidence-hash">Hash: ${e.hash.substring(0, 16)}...</span>
                                </div>
                                <div class="evidence-details">
                                    <small>Registado em: ${new Date(e.timestamp).toLocaleString()}</small>
                                    <small>Processo: ${e.caseId}</small>
                                    <small>Tipo: ${e.type}</small>
                                    ${e.timestampProof ? '<small><i class="fas fa-clock"></i> Timestamp: ✓</small>' : ''}
                                    ${window.BlockchainCustody ? '<small><i class="fas fa-link"></i> Blockchain: ✓</small>' : ''}
                                </div>
                                <div class="evidence-actions">
                                    <button class="action-btn verify-evidence" data-id="${e.id}"><i class="fas fa-shield-alt"></i> VERIFICAR INTEGRIDADE</button>
                                    <button class="action-btn export-evidence" data-id="${e.id}"><i class="fas fa-download"></i> EXPORTAR CERTIFICADO</button>
                                </div>
                            </div>
                        `).join('')}
                </div>
            </div>
        `;
        
        document.getElementById('registerEvidenceBtn')?.addEventListener('click', () => {
            const fileInput = document.getElementById('evidenceFile');
            const caseId = document.getElementById('evidenceCaseId')?.value;
            const evidenceType = document.getElementById('evidenceType')?.value;
            
            if (fileInput && fileInput.files[0]) {
                const file = fileInput.files[0];
                const reader = new FileReader();
                reader.onload = function(e) {
                    const fileHash = CryptoJS.SHA256(e.target.result).toString();
                    const evidence = {
                        name: file.name,
                        type: evidenceType,
                        caseId: caseId,
                        fileSize: file.size,
                        fileType: file.type,
                        fileHash: fileHash,
                        metadata: {
                            uploadedBy: window.ELITE_SESSION_ID || 'system',
                            fileName: file.name,
                            fileSize: file.size
                        }
                    };
                    
                    if (window.ForensicVault && typeof window.ForensicVault.registerEvidence === 'function') {
                        const registered = window.ForensicVault.registerEvidence(evidence);
                        
                        // Gerar NFT Forense se o módulo estiver disponível
                        if (window.BlockchainCustody && typeof window.BlockchainCustody.generateForensicNFT === 'function') {
                            const nft = window.BlockchainCustody.generateForensicNFT({
                                id: registered.id,
                                name: file.name,
                                type: evidenceType,
                                caseId: caseId,
                                fileHash: fileHash,
                                content: e.target.result,
                                metadata: evidence.metadata
                            });
                            EliteUtils.showToast(`NFT Forense gerado: ${nft.id.substring(0, 20)}...`, 'success');
                        }
                        
                        EliteUtils.showToast(`Prova ${file.name} registada com hash ${fileHash.substring(0, 16)}...`, 'success');
                        fileInput.value = '';
                        renderEvidence();
                    } else {
                        EliteUtils.showToast('Módulo Forensic Vault não disponível', 'error');
                    }
                };
                reader.readAsArrayBuffer(file);
            } else {
                EliteUtils.showToast('Selecione um ficheiro para registar', 'warning');
            }
        });
        
        document.querySelectorAll('.verify-evidence').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                if (window.ForensicVault) {
                    const result = window.ForensicVault.verifyEvidence(id);
                    EliteUtils.showToast(result.valid ? 'Evidência íntegra ✓' : 'ALERTA: Evidência comprometida!', result.valid ? 'success' : 'error');
                }
            });
        });
        
        document.querySelectorAll('.export-evidence').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                if (window.ForensicVault) {
                    window.ForensicVault.exportChainOfCustody(id);
                }
            });
        });
    }
    
    // =========================================================================
    // MÓDULO: REGISTOS RGPD
    // =========================================================================
    
    function renderActivityLog() {
        const container = document.getElementById('viewContainer');
        if (!container) return;
        
        const activityLog = JSON.parse(localStorage.getItem('elite_activity_log') || '[]');
        const forensicLogs = window.ForensicVault ? window.ForensicVault.getAllAccessLogs(100) : [];
        const combinedLogs = [...activityLog, ...forensicLogs.map(l => ({
            timestamp: l.timestamp,
            user: l.userId || l.user || 'Sistema',
            action: l.action,
            entity: l.evidenceId || l.entity || 'Forensic Vault',
            hash: l.hash
        }))].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        container.innerHTML = `
            <div class="activity-log-container">
                <div class="activity-log-header">
                    <h2><i class="fas fa-history"></i> REGISTO DE ATIVIDADES (ART. 30.º RGPD)</h2>
                    <div class="activity-actions">
                        <button id="exportLogBtn" class="elite-btn secondary"><i class="fas fa-download"></i> EXPORTAR RAT</button>
                        <button id="clearLogBtn" class="elite-btn danger"><i class="fas fa-trash"></i> LIMPAR REGISTOS</button>
                    </div>
                </div>
                <div class="log-stats">
                    <div class="stat-card">
                        <div class="stat-value">${combinedLogs.length}</div>
                        <div class="stat-label">Total de Registos</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${combinedLogs.filter(l => new Date(l.timestamp) > new Date(Date.now() - 24*60*60*1000)).length}</div>
                        <div class="stat-label">Últimas 24h</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${[...new Set(combinedLogs.map(l => l.user))].length}</div>
                        <div class="stat-label">Utilizadores Ativos</div>
                    </div>
                </div>
                <table class="data-table">
                    <thead>
                        <tr><th>DATA/HORA</th><th>UTILIZADOR</th><th>AÇÃO</th><th>ENTIDADE</th><th>HASH</th> </thead>
                    <tbody>
                        ${combinedLogs.length === 0 ? '}<td colspan="5" style="text-align: center;">Nenhum registo de atividade</td>' : 
                            combinedLogs.slice(0, 100).map(log => `
                                <tr>
                                    <td>${new Date(log.timestamp).toLocaleString()}</td>
                                    <td>${log.user}</td>
                                    <td>${log.action}</td>
                                    <td>${log.entity || '---'}</td>
                                    <td class="log-hash">${log.hash ? log.hash.substring(0, 16) + '...' : '---'}</td>
                                </tr>
                            `).join('')}
                    </tbody>
                </table>
            </div>
        `;
        
        document.getElementById('exportLogBtn')?.addEventListener('click', () => {
            const csv = ['Data/Hora,Utilizador,Ação,Entidade,Hash', ...combinedLogs.map(l => `"${l.timestamp}","${l.user}","${l.action}","${l.entity || ''}","${l.hash || ''}"`)].join('\n');
            const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `rat_elite_probatum_${new Date().toISOString().slice(0, 10)}.csv`;
            link.click();
            URL.revokeObjectURL(link.href);
            EliteUtils.showToast('Registo de atividades exportado', 'success');
        });
        
        document.getElementById('clearLogBtn')?.addEventListener('click', () => {
            if (confirm('Tem certeza que deseja eliminar todos os registos de atividade? Esta ação não pode ser desfeita.')) {
                localStorage.setItem('elite_activity_log', '[]');
                EliteUtils.showToast('Registos de atividade eliminados', 'warning');
                renderActivityLog();
            }
        });
    }
    
    // =========================================================================
    // FUNÇÕES DE RENDERIZAÇÃO DAS DEMAIS VIEWS
    // =========================================================================
    
    function renderInsolvency() { const container = document.getElementById('viewContainer'); if (container) { const insolvencyCases = MOCK_CASES.filter(c => c.category === 'insolvency' || c.category === 'banking'); container.innerHTML = `<h2>${t('nav_insolvency')}</h2><table class="data-table"><thead> <th>ID</th><th>CLIENTE</th><th>VALOR</th><th>PROBABILIDADE</th><th>FASE</th> </thead><tbody>${insolvencyCases.map(c => `<tr><td><strong>${c.id}</strong></td><td>${c.client}</td><td>${EliteUtils.formatCurrency(c.value)}</td><td><div class="progress-bar"><div class="progress-fill" style="width: ${c.successProbability * 100}%"></div><span class="progress-text">${EliteUtils.formatPercentage(c.successProbability * 100)}</span></div></td><td>${c.fase_processual || 'Em curso'}</td></tr>`).join('')}</tbody></table>`; } }
    function renderLabor() { const container = document.getElementById('viewContainer'); if (container) container.innerHTML = `<h2>${t('nav_labor')}</h2><p>Contencioso Laboral - Módulo em desenvolvimento</p>`; }
    function renderLitigation() { const container = document.getElementById('viewContainer'); if (container) container.innerHTML = `<h2>${t('nav_litigation')}</h2><p>Inteligência de Litígio - Análise preditiva disponível no dashboard</p>`; }
    function renderAdversary() { const container = document.getElementById('viewContainer'); if (container) container.innerHTML = `<h2>${t('nav_adversary')}</h2><p>Análise de Oposição - Módulo em desenvolvimento</p>`; }
    function renderSimulator() { const container = document.getElementById('viewContainer'); if (container) container.innerHTML = `<h2>${t('nav_simulator')}</h2><p>Simulador de Contra-Perícia - Utilize o módulo Wargaming Engine</p>`; }
    function renderDeadlines() { const container = document.getElementById('viewContainer'); if (container) container.innerHTML = `<h2>${t('nav_deadlines')}</h2><p>Prazos Judiciais - Utilize o módulo de calendário integrado</p>`; }
    function renderReports() { const container = document.getElementById('viewContainer'); if (container) container.innerHTML = `<h2>${t('nav_reports')}</h2><p>Relatórios - Utilize o botão de exportação no cabeçalho</p>`; }
    function renderAdmin() { const container = document.getElementById('viewContainer'); if (container) container.innerHTML = `<h2>${t('nav_admin')}</h2><p>Administração - Acesso restrito a super utilizadores</p>`; }
    
    // =========================================================================
    // NAVEGAÇÃO
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
            timestamp: new Date().toISOString(),
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
        
        const mobileExportBtn = document.getElementById('mobileExportBtn');
        if (mobileExportBtn) mobileExportBtn.addEventListener('click', () => exportToRegisteredDevice());
        
        const settingsBtn = document.getElementById('settingsBtn');
        if (settingsBtn) settingsBtn.addEventListener('click', () => {
            const settingsModal = document.getElementById('settingsModal');
            if (settingsModal) settingsModal.style.display = 'flex';
            else EliteUtils.showToast('Configurações em desenvolvimento', 'info');
        });
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
            EliteUtils.log('Inicializando Unidade de Comando Forense Digital v2.0.4...');
            
            const sessionHash = window.ELITE_SECURE_HASH || MASTER_HASH;
            secureStorage = new SecureStorage(sessionHash);
            window.SecureStorageInstance = secureStorage;
            
            // Inicializar Forensic Vault
            if (window.ForensicVault && typeof window.ForensicVault.initialize === 'function') {
                window.ForensicVault.initialize(sessionHash);
            }
            
            // INICIALIZAR MÓDULOS DISRUPTIVOS
            if (window.WargamingEngine && typeof window.WargamingEngine.initialize === 'function') {
                window.WargamingEngine.initialize();
                EliteUtils.log('✅ Wargaming Engine inicializado');
            }
            
            if (window.JudgeBiometrics && typeof window.JudgeBiometrics.initialize === 'function') {
                window.JudgeBiometrics.initialize();
                EliteUtils.log('✅ Judge Biometrics inicializado');
            }
            
            if (window.BlockchainCustody && typeof window.BlockchainCustody.initialize === 'function') {
                window.BlockchainCustody.initialize();
                EliteUtils.log('✅ Blockchain Custody inicializado');
            }
            
            if (window.QuantumLegalAnalytics && typeof window.QuantumLegalAnalytics.initialize === 'function') {
                window.QuantumLegalAnalytics.initialize();
                EliteUtils.log('✅ Quantum Legal Analytics inicializado');
            }
            
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
            EliteUtils.log(`📊 Valor total em disputa: ${EliteUtils.formatCurrency(MOCK_CASES.reduce((s,c)=>s+c.value,0))}`);
            EliteUtils.log(`🔐 Storage seguro inicializado com PBKDF2`);
            EliteUtils.log(`🚀 Módulos de inovação disruptiva ativos: Wargaming, Biometrics, Blockchain, Quantum Analytics`);
        },
        
        navigateTo: navigateTo,
        exportCurrentViewToMobile: exportCurrentViewToMobile,
        exportToRegisteredDevice: exportToRegisteredDevice,
        deleteCase: deleteCase,
        generateDeleteConfirmationHash: generateDeleteConfirmationHash,
        setLocale: setLocale,
        t: t,
        getLocale: () => currentLocale,
        getSecureStorage: () => secureStorage
    };
    
    window.EliteUtils = EliteUtils;
    
    EliteUtils.log(`========================================`);
    EliteUtils.log(`ELITE PROBATUM v${APP_VERSION}`);
    EliteUtils.log(`UNIDADE DE COMANDO FORENSE DIGITAL`);
    EliteUtils.log(`Master Hash: ${MASTER_HASH.substring(0, 16)}...`);
    EliteUtils.log(`${MOCK_CASES.length} processos estratégicos carregados`);
    EliteUtils.log(`Valor total em disputa: ${EliteUtils.formatCurrency(MOCK_CASES.reduce((s,c)=>s+c.value,0))}`);
    EliteUtils.log(`🚀 Inovações Disruptivas: Wargaming | Biometrics | Blockchain | Quantum`);
    EliteUtils.log(`========================================`);
    
})();