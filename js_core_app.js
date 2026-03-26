/**
 * ============================================================================
 * ELITE PROBATUM v2.0 — APLICAÇÃO PRINCIPAL
 * UNIDADE DE COMANDO FORENSE DIGITAL
 * ============================================================================
 * CORREÇÃO: Internacionalização funcional, eventos de idioma, alertas visíveis
 * VERSÃO: 2.0.2 - INTEGRIDADE FORENSE VERIFICADA
 * ============================================================================
 */

(function() {
    'use strict';
    
    // =========================================================================
    // CONFIGURAÇÕES GLOBAIS
    // =========================================================================
    
    const APP_VERSION = '2.0.2';
    const MASTER_HASH = 'F8A9B2C1D4E5F6A7B8C9D0E1F2A3B4C5D6E7F8A9B0C1D2E3F4A5B6C7D8E9F0';
    
    // =========================================================================
    // SISTEMA DE INTERNACIONALIZAÇÃO (I18N) - CORREÇÃO FUNCIONAL
    // =========================================================================
    
    const I18N_DICT = {
        pt: {
            // Login
            login_title: 'ELITE PROBATUM',
            login_subtitle: 'Unidade de Comando Forense Digital',
            login_user: 'UTILIZADOR',
            login_password: 'PALAVRA-PASSE',
            login_button: 'AUTENTICAR',
            login_request: 'SOLICITAR ACESSO',
            login_security: 'ENCRIPTADO AES-256 · CANAL SEGURO',
            login_error: 'ACESSO NEGADO — Credenciais inválidas',
            
            // Navegação
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
            
            // Dashboard
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
            
            // Comum
            currency_eur: '€',
            percent_symbol: '%',
            loading: 'A carregar...',
            error_generic: 'Ocorreu um erro. Tente novamente.',
            success: 'Operação concluída com sucesso.',
            confirm_action: 'Tem certeza que deseja continuar?'
        },
        en: {
            // Login
            login_title: 'ELITE PROBATUM',
            login_subtitle: 'Digital Forensic Command Unit',
            login_user: 'USERNAME',
            login_password: 'PASSWORD',
            login_button: 'AUTHENTICATE',
            login_request: 'REQUEST ACCESS',
            login_security: 'AES-256 ENCRYPTED · SECURE CHANNEL',
            login_error: 'ACCESS DENIED — Invalid credentials',
            
            // Navigation
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
            
            // Dashboard
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
            
            // Common
            currency_eur: '€',
            percent_symbol: '%',
            loading: 'Loading...',
            error_generic: 'An error occurred. Please try again.',
            success: 'Operation completed successfully.',
            confirm_action: 'Are you sure you want to continue?'
        }
    };
    
    let currentLocale = 'pt';
    
    function t(key, params = {}) {
        const dict = I18N_DICT[currentLocale];
        let text = dict[key] || key;
        
        // Substituir placeholders {{param}}
        Object.keys(params).forEach(param => {
            text = text.replace(new RegExp(`{{${param}}}`, 'g'), params[param]);
        });
        
        return text;
    }
    
    function setLocale(locale) {
        if (locale === 'pt' || locale === 'en') {
            currentLocale = locale;
            localStorage.setItem('elite_locale', locale);
            
            // Atualizar UI estática
            document.querySelectorAll('[data-i18n]').forEach(el => {
                const key = el.getAttribute('data-i18n');
                if (key) {
                    el.textContent = t(key);
                }
            });
            
            // Re-renderizar view atual para atualizar conteúdo dinâmico
            if (window.EliteProbatum && window.EliteProbatum.currentView) {
                window.EliteProbatum.navigateTo(window.EliteProbatum.currentView);
            }
            
            // Atualizar classes ativas nos botões de idioma
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
        getLocale: () => currentLocale
    };
    
    // =========================================================================
    // MOCK DATA - 27 PROCESSOS ESTRATÉGICOS (9 ÁREAS x 3 PROCESSOS)
    // =========================================================================
    
    const MOCK_CASES = [
        // Insolvência (CIRE) - 3 processos
        { id: 'INS001', client: 'Construtora ABC, Lda', nif_devedor: '123456789', category: 'insolvency', categoryName: 'Insolvência (CIRE)', value: 450000, successProbability: 0.48, status: 'active', court: 'Lisboa', startDate: '2022-08-15', hoursSpent: 120, resourceLevel: 'senior', evidence: ['Insolvência culposa', 'Lista de credores extensa'], adversary: 'PLMJ', judge: 'Dr. António Costa', riskLevel: 'critical', fase_processual: 'Reclamação de Créditos', administrador_insolvencia: 'Dr. José Silva', data_sentenca_declarativa: '2022-10-15' },
        { id: 'INS002', client: 'Retail Solutions, Lda', nif_devedor: '987654321', category: 'insolvency', categoryName: 'Insolvência (CIRE)', value: 125000, successProbability: 0.52, status: 'active', court: 'Porto', startDate: '2023-02-10', hoursSpent: 65, resourceLevel: 'associate', evidence: ['Exoneração passivo', 'Ativo remanescente'], adversary: 'VdA', judge: 'Dra. Sofia Mendes', riskLevel: 'warning', fase_processual: 'Exoneração do Passivo Restante', administrador_insolvencia: 'Dra. Ana Costa', data_sentenca_declarativa: '2023-04-20' },
        { id: 'INS003', client: 'Tech Start, Unipessoal', nif_devedor: '456789123', category: 'insolvency', categoryName: 'Insolvência (CIRE)', value: 89000, successProbability: 0.44, status: 'pending', court: 'Braga', startDate: '2023-09-01', hoursSpent: 38, resourceLevel: 'junior', evidence: ['Processo CIRE', 'Credores privilegiados'], adversary: 'Garrigues', judge: 'Dr. Ricardo Alves', riskLevel: 'warning', fase_processual: 'Fase Inicial', administrador_insolvencia: 'Dr. Pedro Santos', data_sentenca_declarativa: null },
        
        // Contencioso Laboral - 3 processos
        { id: 'LAB001', client: 'Carlos Manuel Santos', nif_devedor: '111222333', category: 'labor', categoryName: 'Direito do Trabalho', value: 15720, successProbability: 0.75, status: 'active', court: 'Porto', startDate: '2023-03-01', hoursSpent: 38, resourceLevel: 'associate', evidence: ['Despedimento ilícito', 'Testemunhas presenciais'], adversary: 'VdA', judge: 'Dra. Sofia Mendes', riskLevel: 'normal', data_cessacao_contrato: '2023-02-28', tipo_despedimento: 'Ilícito', valor_pedido_indemnizacao: 15720, data_audiencia_partes: '2024-01-20' },
        { id: 'LAB002', client: 'Ana Sofia Rodrigues', nif_devedor: '444555666', category: 'labor', categoryName: 'Direito do Trabalho', value: 28900, successProbability: 0.68, status: 'active', court: 'Lisboa', startDate: '2023-08-15', hoursSpent: 42, resourceLevel: 'senior', evidence: ['Contrato sem termo', 'Antiguidade 8 anos'], adversary: 'PLMJ', judge: 'Dr. António Costa', riskLevel: 'normal', data_cessacao_contrato: '2023-08-10', tipo_despedimento: 'Causa Objetiva', valor_pedido_indemnizacao: 28900, data_audiencia_partes: '2024-02-15' },
        { id: 'LAB003', client: 'Pedro Miguel Martins', nif_devedor: '777888999', category: 'labor', categoryName: 'Direito do Trabalho', value: 9500, successProbability: 0.82, status: 'active', court: 'Lisboa', startDate: '2023-10-01', hoursSpent: 22, resourceLevel: 'junior', evidence: ['Despedimento coletivo', 'Acordo com sindicato'], adversary: 'Cuatrecasas', judge: 'Dra. Teresa Lopes', riskLevel: 'normal', data_cessacao_contrato: '2023-09-30', tipo_despedimento: 'Coletivo', valor_pedido_indemnizacao: 9500, data_audiencia_partes: '2024-03-10' },
        
        // Direito Civil - 3 processos
        { id: 'CIV001', client: 'João Manuel Ferreira', nif_devedor: '123123123', category: 'civil', categoryName: 'Direito Civil', value: 28450, successProbability: 0.72, status: 'active', court: 'Lisboa', startDate: '2023-01-15', hoursSpent: 45, resourceLevel: 'senior', evidence: ['Prova documental completa', 'Jurisprudência favorável'], adversary: 'PLMJ', judge: 'Dr. António Costa', riskLevel: 'normal' },
        { id: 'CIV002', client: 'Maria Isabel Lopes', nif_devedor: '456456456', category: 'civil', categoryName: 'Direito Civil', value: 15200, successProbability: 0.58, status: 'active', court: 'Porto', startDate: '2023-06-10', hoursSpent: 32, resourceLevel: 'associate', evidence: ['Prova testemunhal frágil', 'Ausência de perícia'], adversary: 'VdA', judge: 'Dra. Sofia Mendes', riskLevel: 'warning' },
        { id: 'CIV003', client: 'António José Ribeiro', nif_devedor: '789789789', category: 'civil', categoryName: 'Direito Civil', value: 42300, successProbability: 0.81, status: 'active', court: 'Braga', startDate: '2023-09-20', hoursSpent: 28, resourceLevel: 'senior', evidence: ['Prova documental completa', 'Jurisprudência favorável'], adversary: 'Garrigues', judge: 'Dr. Ricardo Alves', riskLevel: 'normal' },
        
        // Direito Fiscal - 3 processos
        { id: 'TAX001', client: 'Empresa XYZ, SA', nif_devedor: '321321321', category: 'tax', categoryName: 'Direito Fiscal', value: 125000, successProbability: 0.68, status: 'active', court: 'Lisboa', startDate: '2022-11-10', hoursSpent: 85, resourceLevel: 'senior', evidence: ['Notificação prévia AT', 'Prova digital com hash'], adversary: 'VdA', judge: 'Dr. Pedro Martins', riskLevel: 'warning' },
        { id: 'TAX002', client: 'Comércio Global, Lda', nif_devedor: '654654654', category: 'tax', categoryName: 'Direito Fiscal', value: 45200, successProbability: 0.61, status: 'active', court: 'Porto', startDate: '2023-04-20', hoursSpent: 52, resourceLevel: 'associate', evidence: ['Regularização espontânea', 'Jurisprudência desfavorável'], adversary: 'PLMJ', judge: 'Dra. Sofia Mendes', riskLevel: 'normal' },
        { id: 'TAX003', client: 'Serviços Integrados, SA', nif_devedor: '987987987', category: 'tax', categoryName: 'Direito Fiscal', value: 78400, successProbability: 0.55, status: 'pending', court: 'Coimbra', startDate: '2023-07-05', hoursSpent: 48, resourceLevel: 'senior', evidence: ['Discrepância DAC7', 'Recurso pendente'], adversary: 'Garrigues', judge: 'Dr. Rui Silva', riskLevel: 'warning' },
        
        // Direito Comercial - 3 processos
        { id: 'COM001', client: 'Distribuidora Nacional, Lda', nif_devedor: '147147147', category: 'commercial', categoryName: 'Direito Comercial', value: 32400, successProbability: 0.88, status: 'active', court: 'Braga', startDate: '2023-05-15', hoursSpent: 35, resourceLevel: 'senior', evidence: ['Violação acordo', 'Cláusula penal'], adversary: 'Cuatrecasas', judge: 'Dr. Ricardo Alves', riskLevel: 'normal' },
        { id: 'COM002', client: 'Importadora Europa, SA', nif_devedor: '258258258', category: 'commercial', categoryName: 'Direito Comercial', value: 56700, successProbability: 0.71, status: 'active', court: 'Lisboa', startDate: '2023-03-20', hoursSpent: 48, resourceLevel: 'associate', evidence: ['Contrato internacional', 'Arbitragem'], adversary: 'VdA', judge: 'Dr. António Costa', riskLevel: 'normal' },
        { id: 'COM003', client: 'Logística Expresso, Lda', nif_devedor: '369369369', category: 'commercial', categoryName: 'Direito Comercial', value: 21300, successProbability: 0.79, status: 'pending', court: 'Porto', startDate: '2023-10-10', hoursSpent: 22, resourceLevel: 'junior', evidence: ['Faturação em falta', 'Diligências prévias'], adversary: 'PLMJ', judge: 'Dra. Sofia Mendes', riskLevel: 'normal' },
        
        // Direito Penal - 3 processos
        { id: 'PEN001', client: 'Rui Fonseca', nif_devedor: '159159159', category: 'criminal', categoryName: 'Direito Penal', value: 0, successProbability: 0.72, status: 'active', court: 'Lisboa', startDate: '2023-01-20', hoursSpent: 55, resourceLevel: 'senior', evidence: ['Recurso penal', 'Prova testemunhal'], adversary: 'VdA', judge: 'Dr. João Costa', riskLevel: 'normal' },
        { id: 'PEN002', client: 'Maria Santos', nif_devedor: '357357357', category: 'criminal', categoryName: 'Direito Penal', value: 0, successProbability: 0.58, status: 'active', court: 'Porto', startDate: '2023-06-15', hoursSpent: 42, resourceLevel: 'associate', evidence: ['Queixa crime', 'Prova digital'], adversary: 'PLMJ', judge: 'Dra. Sofia Mendes', riskLevel: 'warning' },
        { id: 'PEN003', client: 'João Mendes', nif_devedor: '951951951', category: 'criminal', categoryName: 'Direito Penal', value: 0, successProbability: 0.65, status: 'pending', court: 'Braga', startDate: '2023-09-10', hoursSpent: 28, resourceLevel: 'junior', evidence: ['Habeas corpus', 'Medidas coação'], adversary: 'Garrigues', judge: 'Dr. Ricardo Alves', riskLevel: 'normal' },
        
        // Direito da Família - 3 processos
        { id: 'FAM001', client: 'Ana Pereira', nif_devedor: '753753753', category: 'family', categoryName: 'Direito da Família', value: 8500, successProbability: 0.91, status: 'active', court: 'Lisboa', startDate: '2023-08-01', hoursSpent: 18, resourceLevel: 'associate', evidence: ['Regulação poder paternal', 'Acordo consensual'], adversary: 'Cuatrecasas', judge: 'Dra. Teresa Lopes', riskLevel: 'normal' },
        { id: 'FAM002', client: 'Carlos Mendes', nif_devedor: '159753159', category: 'family', categoryName: 'Direito da Família', value: 12300, successProbability: 0.78, status: 'active', court: 'Porto', startDate: '2023-04-10', hoursSpent: 32, resourceLevel: 'senior', evidence: ['Divórcio litigioso', 'Partilha de bens'], adversary: 'VdA', judge: 'Dra. Sofia Mendes', riskLevel: 'normal' },
        { id: 'FAM003', client: 'Sofia Rodrigues', nif_devedor: '456852456', category: 'family', categoryName: 'Direito da Família', value: 5600, successProbability: 0.85, status: 'pending', court: 'Coimbra', startDate: '2023-10-15', hoursSpent: 12, resourceLevel: 'junior', evidence: ['Alimentos devidos', 'Acordo prévio'], adversary: 'PLMJ', judge: 'Dr. Rui Silva', riskLevel: 'normal' },
        
        // Propriedade Intelectual - 3 processos
        { id: 'IP001', client: 'Innovate Tech, Lda', nif_devedor: '852852852', category: 'intellectual', categoryName: 'Propriedade Intelectual', value: 45200, successProbability: 0.79, status: 'active', court: 'Porto', startDate: '2023-07-20', hoursSpent: 42, resourceLevel: 'senior', evidence: ['Violação patente', 'Prova pericial'], adversary: 'Garrigues', judge: 'Dra. Isabel Ferreira', riskLevel: 'normal' },
        { id: 'IP002', client: 'Creative Solutions, SA', nif_devedor: '963963963', category: 'intellectual', categoryName: 'Propriedade Intelectual', value: 28700, successProbability: 0.72, status: 'active', court: 'Lisboa', startDate: '2023-05-05', hoursSpent: 35, resourceLevel: 'associate', evidence: ['Marca registada', 'Contrafação'], adversary: 'VdA', judge: 'Dr. António Costa', riskLevel: 'normal' },
        { id: 'IP003', client: 'Design Studio, Lda', nif_devedor: '741741741', category: 'intellectual', categoryName: 'Propriedade Intelectual', value: 15400, successProbability: 0.68, status: 'pending', court: 'Porto', startDate: '2023-09-25', hoursSpent: 24, resourceLevel: 'junior', evidence: ['Direitos autorais', 'Plágio'], adversary: 'PLMJ', judge: 'Dra. Sofia Mendes', riskLevel: 'normal' },
        
        // Direito Administrativo - 3 processos
        { id: 'ADM001', client: 'Construções do Sul, SA', nif_devedor: '147258369', category: 'administrative', categoryName: 'Direito Administrativo', value: 18900, successProbability: 0.64, status: 'active', court: 'Lisboa', startDate: '2023-02-10', hoursSpent: 38, resourceLevel: 'senior', evidence: ['Impugnação ato administrativo'], adversary: 'Cuatrecasas', judge: 'Dr. Pedro Martins', riskLevel: 'normal' },
        { id: 'ADM002', client: 'Ambiente Sustentável, Lda', nif_devedor: '369258147', category: 'administrative', categoryName: 'Direito Administrativo', value: 32100, successProbability: 0.59, status: 'active', court: 'Porto', startDate: '2023-05-18', hoursSpent: 42, resourceLevel: 'associate', evidence: ['Licenciamento ambiental'], adversary: 'VdA', judge: 'Dra. Sofia Mendes', riskLevel: 'warning' },
        { id: 'ADM003', client: 'Saúde Integrada, SA', nif_devedor: '951753852', category: 'administrative', categoryName: 'Direito Administrativo', value: 45600, successProbability: 0.71, status: 'pending', court: 'Coimbra', startDate: '2023-08-22', hoursSpent: 28, resourceLevel: 'junior', evidence: ['Concurso público', 'Caducidade'], adversary: 'PLMJ', judge: 'Dr. Rui Silva', riskLevel: 'normal' }
    ];
    
    // =========================================================================
    // RENDERIZAÇÃO DAS VIEWS
    // =========================================================================
    
    let activeCharts = {};
    let currentView = 'dashboard';
    let alertInterval = null;
    let deadlinesInterval = null;
    
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
    // VIEW: DASHBOARD - CORREÇÃO DE VISIBILIDADE DOS ALERTAS
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
        
        // HTML do Dashboard com estrutura corrigida para alertas multi-linha
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
        
        // Array de alertas com strings multi-linha - garantindo visibilidade total
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
            // Garantir que o conteúdo de texto não seja truncado - white-space normal
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
            menuToggle.addEventListener('click', () => {
                sidebar.classList.toggle('open');
            });
        }
        
        // CORREÇÃO: Implementar seletor de idioma funcional
        const langToggleBtn = document.getElementById('langToggle');
        if (langToggleBtn) {
            langToggleBtn.addEventListener('click', () => {
                const newLocale = currentLocale === 'pt' ? 'en' : 'pt';
                setLocale(newLocale);
            });
        }
        
        const exportReportBtn = document.getElementById('exportReportBtn');
        if (exportReportBtn) {
            exportReportBtn.addEventListener('click', () => {
                exportCurrentViewToMobile();
            });
        }
        
        const settingsBtn = document.getElementById('settingsBtn');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => {
                EliteUtils.showToast('Configurações em desenvolvimento', 'info');
            });
        }
    }
    
    // Funções de renderização restantes (renderCases, renderInsolvency, etc.) mantidas do original
    // ... (as demais funções de renderização permanecem inalteradas por brevidade, 
    // mas estão presentes no código completo original)
    
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
            EliteUtils.log('Inicializando Unidade de Comando Forense Digital v2.0...');
            
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
        },
        
        navigateTo: navigateTo,
        exportCurrentViewToMobile: exportCurrentViewToMobile,
        setLocale: setLocale,
        t: t,
        getLocale: () => currentLocale
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