/**
 * ============================================================================
 * ELITE PROBATUM v2.0.5 — APLICAÇÃO PRINCIPAL
 * UNIDADE DE COMANDO ESTRATÉGICO
 * ARQUITETURA DE VERDADE
 * ============================================================================
 * VERSÃO FINAL: 2.0.5 - REBRANDING ESTRATÉGICO
 * ============================================================================
 */

(function() {
    'use strict';
    
    // =========================================================================
    // CONFIGURAÇÕES GLOBAIS
    // =========================================================================
    
    const APP_VERSION = '2.0.5';
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
    // SISTEMA DE INTERNACIONALIZAÇÃO (I18N)
    // =========================================================================
    
    const I18N_DICT = {
        pt: {
            login_title: 'ELITE PROBATUM',
            login_subtitle: 'Unidade de Comando Estratégico',
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
            nav_simulator: 'SIMULADOR DE RISCO',
            nav_deadlines: 'PRAZOS JUDICIAIS',
            nav_activitylog: 'REGISTOS RGPD',
            nav_truth_architecture: 'ARQUITETURA DE VERDADE',
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
            login_subtitle: 'Strategic Command Unit',
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
            nav_simulator: 'RISK SIMULATOR',
            nav_deadlines: 'COURT DEADLINES',
            nav_activitylog: 'GDPR LOGS',
            nav_truth_architecture: 'TRUTH ARCHITECTURE',
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
    // MOCK DATA (EXPANDIDO PARA DEMONSTRAÇÃO)
    // =========================================================================
    
    const MOCK_CASES = [
        { id: 'INS001', client: 'Construtora ABC, SA', nif_devedor: '123456789', category: 'insolvency', categoryName: 'Insolvência (CIRE)', value: 2450000, successProbability: 0.52, status: 'active', court: 'Lisboa', startDate: '2022-08-15', hoursSpent: 320, resourceLevel: 'senior', evidence: ['Insolvência culposa', 'Lista de credores extensa'], adversary: 'PLMJ', judge: 'Dr. António Costa', riskLevel: 'critical', fase_processual: 'Reclamação de Créditos', administrador_insolvencia: 'Dr. José Silva', data_sentenca_declarativa: '2022-10-15', hasDocumentaryEvidence: true, hasDigitalEvidence: false, platform: 'unknown' },
        { id: 'INS002', client: 'Retail Solutions, SA', nif_devedor: '987654321', category: 'insolvency', categoryName: 'Insolvência (CIRE)', value: 875000, successProbability: 0.58, status: 'active', court: 'Porto', startDate: '2023-02-10', hoursSpent: 185, resourceLevel: 'associate', evidence: ['Exoneração passivo', 'Ativo remanescente'], adversary: 'VdA', judge: 'Dra. Sofia Mendes', riskLevel: 'warning', fase_processual: 'Exoneração do Passivo Restante', administrador_insolvencia: 'Dra. Ana Costa', data_sentenca_declarativa: '2023-04-20', hasDocumentaryEvidence: true, hasDigitalEvidence: true, platform: 'unknown' },
        { id: 'BNK001', client: 'Banco Internacional, SA', nif_devedor: '111222333', category: 'banking', categoryName: 'Contencioso Bancário', value: 12500000, successProbability: 0.68, status: 'active', court: 'Lisboa', startDate: '2023-03-01', hoursSpent: 420, resourceLevel: 'senior', evidence: ['Contrato de crédito', 'Garantias reais'], adversary: 'Cuatrecasas', judge: 'Dr. António Costa', riskLevel: 'normal', hasDocumentaryEvidence: true, hasDigitalEvidence: true, platform: 'unknown' },
        { id: 'MNA001', client: 'Grupo Energia, SA', nif_devedor: '777888999', category: 'ma', categoryName: 'Fusões e Aquisições', value: 45000000, successProbability: 0.82, status: 'active', court: 'Arbitragem', startDate: '2023-10-01', hoursSpent: 520, resourceLevel: 'senior', evidence: ['Contrato de compra e venda', 'Due diligence'], adversary: 'PLMJ', judge: 'Dr. Pedro Santos', riskLevel: 'normal', hasDocumentaryEvidence: true, hasDigitalEvidence: true, platform: 'unknown' },
        { id: 'MASS001', client: 'Consumidores União', nif_devedor: '456456456', category: 'mass', categoryName: 'Litigância de Massa', value: 15200000, successProbability: 0.85, status: 'active', court: 'Lisboa', startDate: '2023-06-10', hoursSpent: 420, resourceLevel: 'senior', evidence: ['Prova documental coletiva', 'Jurisprudência favorável'], adversary: 'VdA', judge: 'Dra. Teresa Lopes', riskLevel: 'normal', hasDocumentaryEvidence: true, hasDigitalEvidence: false, platform: 'unknown' },
        { id: 'TAX001', client: 'Grupo Industrial, SA', nif_devedor: '321321321', category: 'tax', categoryName: 'Direito Fiscal', value: 12500000, successProbability: 0.68, status: 'active', court: 'CAAD', startDate: '2022-11-10', hoursSpent: 485, resourceLevel: 'senior', evidence: ['Notificação prévia AT', 'Prova digital com hash'], adversary: 'VdA', judge: 'Dr. Pedro Santos', riskLevel: 'warning', hasDocumentaryEvidence: true, hasDigitalEvidence: true, platform: 'unknown' },
        { id: 'LAB001', client: 'Maria Rodrigues', nif_devedor: '654321987', category: 'labor', categoryName: 'Direito do Trabalho', value: 28900, successProbability: 0.78, status: 'active', court: 'Porto', startDate: '2024-01-15', hoursSpent: 85, resourceLevel: 'junior', evidence: ['Contrato de trabalho', 'Recibos de vencimento'], adversary: 'Garrigues', judge: 'Dra. Sofia Mendes', riskLevel: 'normal', hasDocumentaryEvidence: true, hasDigitalEvidence: false, platform: 'unknown' },
        { id: 'CIV001', client: 'António Almeida', nif_devedor: '147258369', category: 'civil', categoryName: 'Direito Civil', value: 125000, successProbability: 0.72, status: 'active', court: 'Coimbra', startDate: '2023-11-01', hoursSpent: 120, resourceLevel: 'associate', evidence: ['Contrato promessa compra e venda'], adversary: 'Abreu', judge: 'Dr. Rui Silva', riskLevel: 'normal', hasDocumentaryEvidence: true, hasDigitalEvidence: false, platform: 'unknown' }
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
            truth_architecture: t('nav_truth_architecture'),
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
    // FUNÇÕES DE EXPORTAÇÃO
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
                    <p style="color: #94a3b8; margin: 4px 0 0;">Relatório Estratégico • ${new Date().toLocaleString()}</p>
                </div>
                <div style="background: #000; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
                    <h3 style="color: #00e5ff; margin-top: 0;">${title}</h3>
                    <div>${originalHtml}</div>
                </div>
                <div style="text-align: center; padding-top: 20px; color: #64748b; font-size: 10px;">
                    Documento gerado por ELITE PROBATUM v2.0.5 • Assinatura Digital: ${CryptoJS.SHA256(originalHtml + Date.now()).toString().substring(0, 16)}...
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
            
            <div class="tactical-alerts-container">
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
            
            <!-- BLACK SWAN PANEL - Simulação de Monte Carlo -->
            <div id="blackSwanPanel" class="chart-container" style="margin-top: 20px;">
                <h3><i class="fas fa-chart-line"></i> ANÁLISE DE RISCO (VAR JURÍDICO)</h3>
                <div id="monteCarloResults" style="min-height: 300px;"></div>
            </div>
        `;
        
        initPortfolioChart();
        initCategoryChart(categoryCount);
        initBlackSwanPanel();
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
    
    function initBlackSwanPanel() {
        const resultsContainer = document.getElementById('monteCarloResults');
        if (!resultsContainer) return;
        
        if (window.BlackSwan && typeof window.BlackSwan.renderBlackSwanPanel === 'function') {
            const sampleCase = { id: 'MOCK_CASE', value: 12500000, successProbability: 68 };
            window.BlackSwan.renderBlackSwanPanel('monteCarloResults', sampleCase);
        } else {
            resultsContainer.innerHTML = '<div class="loading-shimmer" style="height: 200px; border-radius: 12px;"></div><p class="text-muted" style="text-align: center; margin-top: 16px;">A carregar motor de simulação estocástica...</p>';
        }
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
    // RENDERIZAÇÃO DOS PROCESSOS (COM FUNCIONALIDADE DE CRIAÇÃO/ELIMINAÇÃO)
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
                            <div class="detail-row"><span>Valor:</span><strong>${EliteUtils.formatCurrency(caseData.value)}</strong></div>
                            <div class="detail-row"><span>Probabilidade:</span><strong>${EliteUtils.formatPercentage(caseData.successProbability * 100)}</strong></div>
                            <div class="detail-row"><span>Tribunal:</span><strong>${caseData.court}</strong></div>
                            <div class="detail-row"><span>Juiz:</span><strong>${caseData.judge}</strong></div>
                            <div class="detail-row"><span>Área:</span><strong>${caseData.categoryName}</strong></div>
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
            showNewCaseModal();
        });
    }
    
    function showNewCaseModal() {
        const modalBody = document.getElementById('caseDetailBody');
        if (!modalBody) return;
        
        modalBody.innerHTML = `
            <form id="newCaseForm">
                <div class="form-group">
                    <label>ID do Processo *</label>
                    <input type="text" id="newCaseId" placeholder="Ex: TAX002" required>
                </div>
                <div class="form-group">
                    <label>Cliente *</label>
                    <input type="text" id="newClientName" required>
                </div>
                <div class="form-group">
                    <label>NIF/NIPC</label>
                    <input type="text" id="newClientNif">
                </div>
                <div class="form-group">
                    <label>Valor da Causa (€) *</label>
                    <input type="number" id="newCaseValue" required>
                </div>
                <div class="form-group">
                    <label>Área do Direito</label>
                    <select id="newCaseCategory">
                        <option value="insolvency">Insolvência (CIRE)</option>
                        <option value="labor">Direito do Trabalho</option>
                        <option value="civil">Direito Civil</option>
                        <option value="tax">Direito Fiscal</option>
                        <option value="commercial">Direito Comercial</option>
                        <option value="criminal">Direito Penal</option>
                        <option value="family">Direito da Família</option>
                        <option value="banking">Contencioso Bancário</option>
                        <option value="ma">Fusões e Aquisições</option>
                        <option value="mass">Litigância de Massa</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Tribunal</label>
                    <input type="text" id="newCaseCourt" placeholder="Ex: Lisboa">
                </div>
                <div class="form-group">
                    <label>Juiz</label>
                    <input type="text" id="newCaseJudge" placeholder="Ex: Dr. António Costa">
                </div>
                <button type="submit" class="elite-btn primary full-width">CRIAR PROCESSO</button>
            </form>
        `;
        
        document.getElementById('newCaseForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            const newCase = {
                id: document.getElementById('newCaseId')?.value || `NEW_${Date.now()}`,
                client: document.getElementById('newClientName')?.value || 'Cliente',
                nif_devedor: document.getElementById('newClientNif')?.value || '000000000',
                category: document.getElementById('newCaseCategory')?.value || 'civil',
                categoryName: getCategoryName(document.getElementById('newCaseCategory')?.value),
                value: parseFloat(document.getElementById('newCaseValue')?.value) || 0,
                successProbability: 0.65,
                status: 'active',
                court: document.getElementById('newCaseCourt')?.value || 'Lisboa',
                startDate: new Date().toISOString().split('T')[0],
                hoursSpent: 0,
                resourceLevel: 'junior',
                evidence: [],
                adversary: 'A designar',
                judge: document.getElementById('newCaseJudge')?.value || 'A designar',
                riskLevel: 'normal',
                hasDocumentaryEvidence: false,
                hasDigitalEvidence: false,
                platform: 'unknown'
            };
            
            MOCK_CASES.push(newCase);
            EliteUtils.showToast(`Processo ${newCase.id} criado com sucesso!`, 'success');
            document.getElementById('caseDetailModal').style.display = 'none';
            navigateTo('cases');
        });
        
        document.getElementById('caseDetailModal').style.display = 'flex';
    }
    
    // =========================================================================
    // FUNÇÕES DE RENDERIZAÇÃO DAS DEMAIS VIEWS
    // =========================================================================
    
    function renderInsolvency() { 
        const container = document.getElementById('viewContainer'); 
        if (container) { 
            const insolvencyCases = MOCK_CASES.filter(c => c.category === 'insolvency' || c.category === 'banking'); 
            container.innerHTML = `
                <div class="cases-header">
                    <h2>${t('nav_insolvency')}</h2>
                    <div class="cases-actions">
                        <button id="newInsolvencyBtn" class="elite-btn primary"><i class="fas fa-plus"></i> NOVO PROCESSO INSOLVÊNCIA</button>
                    </div>
                </div>
                <table class="data-table">
                    <thead>
                        <tr><th>ID</th><th>CLIENTE</th><th>VALOR</th><th>PROBABILIDADE</th><th>FASE</th><th>AÇÕES</th> </thead>
                    <tbody>
                        ${insolvencyCases.map(c => `
                            <tr>
                                <td><strong>${c.id}</strong> </div>
                                <td>${c.client} </div>
                                <td>${EliteUtils.formatCurrency(c.value)} </div>
                                <td><div class="progress-bar"><div class="progress-fill" style="width: ${c.successProbability * 100}%"></div><span class="progress-text">${EliteUtils.formatPercentage(c.successProbability * 100)}</span></div> </div>
                                <td>${c.fase_processual || 'Em curso'} </div>
                                <td><button class="action-btn delete-case" data-id="${c.id}"><i class="fas fa-trash"></i></button> </div>
                             </div>
                        `).join('')}
                        ${insolvencyCases.length === 0 ? '专业<td colspan="6" class="empty-state">Nenhum processo de insolvência</td>' : ''}
                    </tbody>
                 </div>
            `;
            attachDeleteEvents();
            document.getElementById('newInsolvencyBtn')?.addEventListener('click', showNewCaseModal);
        } 
    }
    
    function renderLabor() { 
        const container = document.getElementById('viewContainer'); 
        if (container) {
            const laborCases = MOCK_CASES.filter(c => c.category === 'labor');
            container.innerHTML = `
                <div class="cases-header">
                    <h2>${t('nav_labor')}</h2>
                    <div class="cases-actions">
                        <button id="newLaborBtn" class="elite-btn primary"><i class="fas fa-plus"></i> NOVO PROCESSO LABORAL</button>
                    </div>
                </div>
                <table class="data-table">
                    <thead> <th>ID</th><th>CLIENTE</th><th>VALOR</th><th>PROBABILIDADE</th><th>JUIZ</th><th>AÇÕES</th> </thead>
                    <tbody>
                        ${laborCases.map(c => `
                             <tr><strong>${c.id}</strong> </div>
                             <td>${c.client} </div>
                             <td>${EliteUtils.formatCurrency(c.value)} </div>
                             <td><div class="progress-bar"><div class="progress-fill" style="width: ${c.successProbability * 100}%"></div><span class="progress-text">${EliteUtils.formatPercentage(c.successProbability * 100)}</span></div> </div>
                             <td>${c.judge || 'N/A'} </div>
                             <td><button class="action-btn delete-case" data-id="${c.id}"><i class="fas fa-trash"></i></button> </div>
                        `).join('')}
                        ${laborCases.length === 0 ? '专业<td colspan="6" class="empty-state">Nenhum processo laboral</td>' : ''}
                    </tbody>
                 </div>
            `;
            attachDeleteEvents();
            document.getElementById('newLaborBtn')?.addEventListener('click', showNewCaseModal);
        }
    }
    
    function renderLitigation() { 
        const container = document.getElementById('viewContainer'); 
        if (container) {
            container.innerHTML = `
                <h2>${t('nav_litigation')}</h2>
                <div class="alerts-panel">
                    <h3><i class="fas fa-brain"></i> INTELIGÊNCIA DE LITÍGIO - ANÁLISE PREDITIVA</h3>
                    <div class="kpi-grid">
                        <div class="kpi-card"><div class="kpi-icon"><i class="fas fa-chart-line"></i></div><div class="kpi-content"><div class="kpi-label">Probabilidade Média de Sucesso</div><div class="kpi-value">68.5%</div></div></div>
                        <div class="kpi-card"><div class="kpi-icon"><i class="fas fa-clock"></i></div><div class="kpi-content"><div class="kpi-label">Tempo Médio de Resolução</div><div class="kpi-value">132 dias</div></div></div>
                        <div class="kpi-card"><div class="kpi-icon"><i class="fas fa-gavel"></i></div><div class="kpi-content"><div class="kpi-label">Valor Médio por Caso</div><div class="kpi-value">${EliteUtils.formatCurrency(12500000)}</div></div></div>
                    </div>
                    <div id="litigationPredictionPanel" style="margin-top: 20px;"></div>
                </div>
            `;
            if (window.AIAssistant && typeof window.AIAssistant.renderDashboard === 'function') {
                window.AIAssistant.renderDashboard('litigationPredictionPanel', MOCK_CASES[0]);
            } else {
                document.getElementById('litigationPredictionPanel').innerHTML = '<div class="loading-shimmer" style="height: 200px;"></div>';
            }
        }
    }
    
    function renderQuestionnaire() { 
        const container = document.getElementById('viewContainer'); 
        if (container) container.innerHTML = `<h2>${t('nav_questionnaire')}</h2><div class="alert-item info"><i class="fas fa-info-circle"></i><div><strong>Questionários Estratégicos</strong><p>Em desenvolvimento. Em breve disponível para todas as áreas do direito.</p></div></div>`; 
    }
    
    function renderEvidence() { 
        const container = document.getElementById('viewContainer'); 
        if (container) {
            container.innerHTML = `
                <h2><i class="fas fa-link"></i> ${t('nav_evidence')}</h2>
                <div id="strategicVaultDashboard"></div>
            `;
            if (window.ForensicVault && typeof window.ForensicVault.renderDashboard === 'function') {
                window.ForensicVault.renderDashboard('strategicVaultDashboard');
            } else {
                document.getElementById('strategicVaultDashboard').innerHTML = '<div class="loading-shimmer" style="height: 300px;"></div>';
            }
        }
    }
    
    function renderAdversary() { 
        const container = document.getElementById('viewContainer'); 
        if (container) {
            container.innerHTML = `
                <h2><i class="fas fa-users"></i> ${t('nav_adversary')}</h2>
                <div id="riskMitigationDashboard"></div>
            `;
            if (window.WargamingEngine && typeof window.WargamingEngine.renderDashboard === 'function') {
                const sampleCase = MOCK_CASES[0];
                const sampleEvidence = [{ id: 'EVD001', name: 'Petição Inicial', type: 'documentary', fileType: 'pdf', hash: 'a1b2c3d4' }];
                window.WargamingEngine.renderDashboard('riskMitigationDashboard', sampleCase, sampleEvidence);
            } else {
                document.getElementById('riskMitigationDashboard').innerHTML = '<div class="loading-shimmer" style="height: 300px;"></div>';
            }
        }
    }
    
    function renderSimulator() { 
        const container = document.getElementById('viewContainer'); 
        if (container) container.innerHTML = `<h2><i class="fas fa-flask"></i> ${t('nav_simulator')}</h2><div class="alert-item info"><i class="fas fa-flask"></i><div><strong>Simulador de Risco</strong><p>Utilize o módulo de análise de risco para simular cenários de incerteza.</p><button id="runRiskSimulation" class="elite-btn primary" style="margin-top: 16px;">INICIAR SIMULAÇÃO</button></div></div>`;
        document.getElementById('runRiskSimulation')?.addEventListener('click', () => {
            if (window.WargamingEngine && typeof window.WargamingEngine.renderDashboard === 'function') {
                window.WargamingEngine.renderDashboard('viewContainer', MOCK_CASES[0], []);
            }
        });
    }
    
    function renderDeadlines() { 
        const container = document.getElementById('viewContainer'); 
        if (container) {
            container.innerHTML = `<h2><i class="fas fa-calendar-alt"></i> ${t('nav_deadlines')}</h2><div id="deadlinesCalendar"></div>`;
            if (window.CourtDeadlines && typeof window.CourtDeadlines.renderCalendar === 'function') {
                window.CourtDeadlines.renderCalendar('deadlinesCalendar');
            } else {
                document.getElementById('deadlinesCalendar').innerHTML = '<div class="loading-shimmer" style="height: 200px;"></div>';
            }
        }
    }
    
    function renderActivityLog() { 
        const container = document.getElementById('viewContainer'); 
        if (container) {
            const logs = JSON.parse(localStorage.getItem('elite_activity_log') || '[]');
            container.innerHTML = `
                <h2><i class="fas fa-history"></i> ${t('nav_activitylog')}</h2>
                <div class="activity-log-container">
                    <div class="activity-log-header"><h2>REGISTO DE ATIVIDADES (RGPD Art. 30.º)</h2><button id="exportLogsBtn" class="elite-btn secondary"><i class="fas fa-download"></i> EXPORTAR CSV</button></div>
                    <table class="data-table">
                        <thead> <th>Data/Hora</th><th>Utilizador</th><th>Ação</th><th>Entidade</th><th>Hash</th> </thead>
                        <tbody>
                            ${logs.slice(0, 50).map(log => `
                                <tr><td class="log-hash">${log.hash ? log.hash.substring(0, 16) + '...' : 'N/A'}</td>
                            `).join('')}
                            ${logs.length === 0 ? '专业<td colspan="5" class="empty-state">Nenhum registo de atividade</td>' : ''}
                        </tbody>
                     </div>
                </div>
            `;
            document.getElementById('exportLogsBtn')?.addEventListener('click', () => {
                const csvRows = [['Data/Hora', 'Utilizador', 'Ação', 'Entidade', 'Hash']];
                logs.forEach(log => csvRows.push([log.timestamp, log.user || 'Sistema', log.action, log.entity, log.hash || '']));
                const csvContent = csvRows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
                const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = `elite_activity_log_${new Date().toISOString().slice(0, 10)}.csv`;
                link.click();
                URL.revokeObjectURL(link.href);
                EliteUtils.showToast('Registos exportados com sucesso', 'success');
            });
        }
    }
    
    function renderAdmin() { 
        const container = document.getElementById('viewContainer'); 
        if (container) container.innerHTML = `<h2><i class="fas fa-skull"></i> ${t('nav_admin')}</h2><div class="alert-item critical"><i class="fas fa-shield-alt"></i><div><strong>Área Restrita</strong><p>Acesso reservado a Super Utilizadores e Master Hash Controller.</p></div></div>`; 
    }
    
    function attachDeleteEvents() {
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
    }
    
    // =========================================================================
    // RENDERIZAÇÃO DA ARQUITETURA DE VERDADE
    // =========================================================================
    
    function renderTruthArchitecture() {
        const container = document.getElementById('viewContainer');
        if (!container) return;
        
        if (window.PracticeDashboard && typeof window.PracticeDashboard.renderTruthArchitecture === 'function') {
            window.PracticeDashboard.renderTruthArchitecture();
        } else {
            container.innerHTML = `
                <div class="truth-architecture-dashboard">
                    <div class="dashboard-header">
                        <h2><i class="fas fa-chess-queen"></i> ARQUITETURA DE VERDADE</h2>
                        <div class="header-badges">
                            <span class="badge badge-primary"><i class="fas fa-link"></i> Shadow Dossier Ativo</span>
                            <span class="badge badge-success"><i class="fas fa-chart-line"></i> Monte Carlo Online</span>
                            <span class="badge badge-info"><i class="fas fa-shield-alt"></i> Strategic Vault</span>
                        </div>
                    </div>
                    
                    <div class="truth-summary">
                        <div class="summary-card"><div class="summary-icon"><i class="fas fa-fingerprint"></i></div><div class="summary-content"><div class="summary-value">0</div><div class="summary-label">Vínculos CITIUS</div><div class="summary-trend">0 validados</div></div></div>
                        <div class="summary-card"><div class="summary-icon"><i class="fas fa-chart-simple"></i></div><div class="summary-content"><div class="summary-value">0</div><div class="summary-label">Simulações Monte Carlo</div><div class="summary-trend">Análise de 0% risco</div></div></div>
                        <div class="summary-card"><div class="summary-icon"><i class="fas fa-file-alt"></i></div><div class="summary-content"><div class="summary-value">0</div><div class="summary-label">Bónus Meritocráticos</div><div class="summary-trend">Total: €0</div></div></div>
                    </div>
                    
                    <div class="truth-tabs">
                        <button class="tab-btn active" data-tab="shadow-dossier"><i class="fas fa-link"></i> Shadow Dossier</button>
                        <button class="tab-btn" data-tab="black-swan"><i class="fas fa-chart-line"></i> Black Swan Predictor</button>
                        <button class="tab-btn" data-tab="executive-report"><i class="fas fa-crown"></i> Relatório Executivo</button>
                        <button class="tab-btn" data-tab="forensic-decomposition"><i class="fas fa-microscope"></i> Decomposição Estratégica</button>
                    </div>
                    
                    <div id="truth-tab-content" class="truth-tab-content">
                        <div class="shadow-dossier-panel">
                            <div class="panel-header"><h3><i class="fas fa-link"></i> Shadow Dossier - Vínculo CITIUS/SINOFE</h3><button id="newCitiusBinding" class="elite-btn small primary"><i class="fas fa-plus"></i> NOVO VÍNCULO</button></div>
                            <div class="empty-state"><i class="fas fa-inbox"></i><p>Nenhum vínculo CITIUS registado</p><small>Utilize o botão acima para vincular recibos oficiais do tribunal</small></div>
                        </div>
                    </div>
                </div>
                <style>
                    .truth-architecture-dashboard { padding: 0; }
                    .dashboard-header { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; margin-bottom: 24px; }
                    .header-badges { display: flex; gap: 8px; }
                    .badge { display: inline-flex; align-items: center; gap: 6px; padding: 4px 12px; border-radius: 20px; font-size: 0.7rem; font-weight: 600; }
                    .badge-primary { background: var(--elite-primary-dim); color: var(--elite-primary); border: 1px solid var(--elite-primary); }
                    .badge-success { background: var(--elite-success-dim); color: var(--elite-success); border: 1px solid var(--elite-success); }
                    .badge-info { background: var(--elite-info-dim); color: var(--elite-info); border: 1px solid var(--elite-info); }
                    .truth-summary { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 24px; }
                    .summary-card { background: var(--bg-command); border-radius: 16px; padding: 20px; display: flex; align-items: center; gap: 16px; border: 1px solid var(--border-tactic); transition: all 0.2s; }
                    .summary-card:hover { border-color: var(--elite-primary); transform: translateY(-2px); }
                    .summary-icon { width: 48px; height: 48px; background: var(--elite-primary-dim); border-radius: 12px; display: flex; align-items: center; justify-content: center; }
                    .summary-icon i { font-size: 1.5rem; color: var(--elite-primary); }
                    .summary-value { font-size: 1.8rem; font-weight: 800; font-family: 'JetBrains Mono'; color: var(--elite-primary); }
                    .summary-label { font-size: 0.7rem; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; }
                    .summary-trend { font-size: 0.65rem; color: #64748b; margin-top: 4px; }
                    .truth-tabs { display: flex; gap: 8px; border-bottom: 1px solid var(--border-tactic); margin-bottom: 24px; padding-bottom: 0; }
                    .tab-btn { background: transparent; border: none; padding: 12px 24px; color: #94a3b8; cursor: pointer; font-family: 'JetBrains Mono'; font-size: 0.8rem; transition: all 0.2s; border-bottom: 2px solid transparent; }
                    .tab-btn:hover { color: var(--elite-primary); }
                    .tab-btn.active { color: var(--elite-primary); border-bottom-color: var(--elite-primary); }
                    .empty-state { text-align: center; padding: 48px; color: #64748b; background: var(--bg-terminal); border-radius: 16px; border: 1px dashed var(--border-tactic); }
                    @media (max-width: 768px) { .truth-summary { grid-template-columns: 1fr; } .truth-tabs { flex-wrap: wrap; } .tab-btn { padding: 8px 16px; font-size: 0.7rem; } }
                </style>
            `;
            
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    const tab = btn.dataset.tab;
                    const contentDiv = document.getElementById('truth-tab-content');
                    if (contentDiv) {
                        if (tab === 'black-swan' && window.BlackSwan && typeof window.BlackSwan.renderBlackSwanPanel === 'function') {
                            contentDiv.innerHTML = '<div id="monteCarloPanel"></div>';
                            window.BlackSwan.renderBlackSwanPanel('monteCarloPanel', MOCK_CASES[0]);
                        } else if (tab === 'executive-report' && window.FeeOptimizer && typeof window.FeeOptimizer.generateExecutiveReport === 'function') {
                            const report = window.FeeOptimizer.generateExecutiveReport('quarterly');
                            contentDiv.innerHTML = `
                                <div class="executive-report-panel">
                                    <div class="panel-header"><h3>Relatório de Performance e Meritocracia</h3><button id="exportExecutiveReport" class="elite-btn small secondary">EXPORTAR PDF</button></div>
                                    <div class="executive-summary"><div class="total-bonus">Total de Bónus: €${report?.executiveSummary.totalBonusPool?.toLocaleString() || '0'}</div></div>
                                    <table class="data-table"><thead> <th>Advogado</th><th>Categoria</th><th>Medalha</th><th>Bónus Sugerido</th><th>Status</th> </thead><tbody>${report?.bonusAutomation.map(b => ` <td>🏅 ${b.medalha}</td><td><strong>€${b.bonus_sugerido.toLocaleString()}</strong></td><td>${b.status}</td> `).join('') || ' <td colspan="5" class="empty-state">Nenhum bónus calculado</td> '}</tbody> </div>
                            `;
                        } else {
                            contentDiv.innerHTML = `<div class="empty-state"><i class="fas fa-cog fa-spin"></i><p>Módulo em desenvolvimento</p></div>`;
                        }
                    }
                });
            });
            
            document.getElementById('newCitiusBinding')?.addEventListener('click', () => {
                EliteUtils.showToast('Funcionalidade de vínculo CITIUS - Selecione um recibo PDF', 'info');
            });
        }
    }
    
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
            case 'truth_architecture': renderTruthArchitecture(); break;
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
            EliteUtils.log('========================================');
            EliteUtils.log(`ELITE PROBATUM v${APP_VERSION}`);
            EliteUtils.log('UNIDADE DE COMANDO ESTRATÉGICO');
            EliteUtils.log('ARQUITETURA DE VERDADE ATIVADA');
            EliteUtils.log('========================================');
            
            const sessionHash = window.ELITE_SECURE_HASH || MASTER_HASH;
            secureStorage = new SecureStorage(sessionHash);
            window.SecureStorageInstance = secureStorage;
            
            // Inicializar todos os módulos
            if (window.ForensicVault && typeof window.ForensicVault.initialize === 'function') {
                window.ForensicVault.initialize(sessionHash);
                EliteUtils.log('✅ Strategic Vault inicializado');
            }
            
            if (window.BlackSwan && typeof window.BlackSwan.initialize === 'function') {
                window.BlackSwan.initialize();
                EliteUtils.log('✅ Black Swan Predictor inicializado');
            }
            
            if (window.WargamingEngine && typeof window.WargamingEngine.initialize === 'function') {
                window.WargamingEngine.initialize();
                EliteUtils.log('✅ Risk Mitigation Engine inicializado');
            }
            
            if (window.JudgeBiometrics && typeof window.JudgeBiometrics.initialize === 'function') {
                window.JudgeBiometrics.initialize();
                EliteUtils.log('✅ Judicial Behavioral Analytics inicializado');
            }
            
            if (window.BlockchainCustody && typeof window.BlockchainCustody.initialize === 'function') {
                window.BlockchainCustody.initialize();
                EliteUtils.log('✅ Blockchain Custody inicializado');
            }
            
            if (window.QuantumLegalAnalytics && typeof window.QuantumLegalAnalytics.initialize === 'function') {
                window.QuantumLegalAnalytics.initialize();
                EliteUtils.log('✅ Quantum Legal Analytics inicializado');
            }
            
            if (window.ShadowDossier && typeof window.ShadowDossier.initialize === 'function') {
                window.ShadowDossier.initialize();
                EliteUtils.log('✅ Shadow Dossier Manager inicializado');
            }
            
            if (window.CourtDeadlines && typeof window.CourtDeadlines.initialize === 'function') {
                window.CourtDeadlines.initialize();
                EliteUtils.log('✅ Court Deadlines inicializado');
            }
            
            if (window.GamificationSystem && typeof window.GamificationSystem.initialize === 'function') {
                window.GamificationSystem.initialize();
                EliteUtils.log('✅ Gamification System inicializado');
            }
            
            if (window.AIAssistant && typeof window.AIAssistant.initialize === 'function') {
                window.AIAssistant.initialize();
                EliteUtils.log('✅ AI Assistant inicializado');
            }
            
            if (window.PredictiveLitigation && typeof window.PredictiveLitigation.initialize === 'function') {
                window.PredictiveLitigation.initialize();
                EliteUtils.log('✅ Predictive Litigation inicializado');
            }
            
            if (window.PlatformIntelligence && typeof window.PlatformIntelligence.initialize === 'function') {
                window.PlatformIntelligence.initialize();
                EliteUtils.log('✅ Platform Intelligence inicializado');
            }
            
            if (window.MarketIntelligence && typeof window.MarketIntelligence.initialize === 'function') {
                window.MarketIntelligence.initialize();
                EliteUtils.log('✅ Market Intelligence inicializado');
            }
            
            if (window.LeadIntelligence && typeof window.LeadIntelligence.initialize === 'function') {
                window.LeadIntelligence.initialize();
                EliteUtils.log('✅ Lead Intelligence inicializado');
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
            EliteUtils.log(`🚀 Módulos de inovação estratégica ativos`);
            EliteUtils.log(`🎯 ARQUITETURA DE VERDADE: Shadow Dossier | Black Swan | Decomposição Estratégica`);
            EliteUtils.log(`📌 Extensões carregadas dinamicamente após autenticação`);
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
    EliteUtils.log(`UNIDADE DE COMANDO ESTRATÉGICO`);
    EliteUtils.log(`Master Hash: ${MASTER_HASH.substring(0, 16)}...`);
    EliteUtils.log(`${MOCK_CASES.length} processos estratégicos carregados`);
    EliteUtils.log(`Valor total em disputa: ${EliteUtils.formatCurrency(MOCK_CASES.reduce((s,c)=>s+c.value,0))}`);
    EliteUtils.log(`🎯 Arquitetura de Verdade: Shadow Dossier | Black Swan | Decomposição Estratégica`);
    EliteUtils.log(`📌 Extensões carregadas dinamicamente após autenticação`);
    EliteUtils.log(`========================================`);
    
})();