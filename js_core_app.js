/**
 * ============================================================================
 * ELITE PROBATUM v1.0 — APLICAÇÃO PRINCIPAL
 * ============================================================================
 * SECURE EDITION FINAL
 * - localStorage Persistence para dados
 * - Gráficos com mock data estática (offline-ready)
 * - PDF Certificate com jsPDF auto-table
 * - Cores otimizadas para legibilidade
 * ============================================================================
 */

(function() {
    'use strict';
    
    // =========================================================================
    // STORAGE KEYS
    // =========================================================================
    
    const STORAGE_KEYS = {
        CASES: 'elite_probatum_cases',
        CLIENTS: 'elite_probatum_clients',
        NOTES: 'elite_probatum_notes',
        SESSION: 'elite_probatum_session',
        USER_PREFS: 'elite_probatum_prefs'
    };
    
    // =========================================================================
    // INTERNACIONALIZAÇÃO (PT/EN)
    // =========================================================================
    
    const LOCALES = {
        PT: {
            splashTitle: 'ELITE', splashBadge: 'PROBATUM', splashVersion: 'v1.0 · Secure Edition', splashTagline: 'Inteligência que vence casos',
            loaderText: 'Carregando ecossistema estratégico...', enterBtn: 'ENTRAR NA PLATAFORMA',
            loginTitle: 'ELITE PROBATUM', loginSubtitle: 'Autenticação necessária para aceder à plataforma',
            loginUserPlaceholder: 'Utilizador', loginPassPlaceholder: 'Palavra-passe',
            yubikeyText: 'Autenticar com YubiKey', loginBtnText: 'Autenticar',
            loginHint: 'Credenciais: admin / probatum', loginError: 'Credenciais inválidas',
            navDashboard: 'Dashboard', navCases: 'Casos', navLitigation: 'Inteligência de Litígio',
            navJudges: 'Perfil de Magistrados', navAdversary: 'Perfil de Oposição',
            navHeatmap: 'Juris-Heatmap', navClients: 'Clientes', navReports: 'Relatórios',
            statActiveCases: 'Casos Ativos', statDisputeValue: 'Valor em Disputa', statSuccessRate: 'Taxa Sucesso',
            dashboardTitle: 'Dashboard Estratégico', portfolioChart: 'Evolução da Carteira (últimos 6 meses)',
            categoryChart: 'Distribuição por Área do Direito', alertsTitle: 'Alertas Estratégicos',
            newCaseBtn: 'Novo Caso', importCasesBtn: 'Importar Lote', searchPlaceholder: 'Pesquisar casos...', allCases: 'Todos',
            litigationTitle: 'Análise Preditiva de Êxito', litigationSubtitle: 'Insira os dados do caso para obter previsão detalhada',
            predictCategory: 'Área do Direito', predictValue: 'Valor da Causa (€)', predictProbability: 'Probabilidade Estimada (%)',
            predictCourt: 'Tribunal', predictAdversary: 'Escritório Oposição', runPrediction: 'Executar Previsão',
            caseDetailTitle: 'Detalhes do Caso', newClientTitle: 'Novo Cliente',
            clientNameLabel: 'Nome do Cliente *', clientNifLabel: 'NIF / VATIN *',
            clientValueLabel: 'Valor da Causa (€) *', clientCourtLabel: 'Jurisdição / Tribunal',
            clientCategoryLabel: 'Área do Direito', createClientBtn: 'Criar Cliente',
            notesTitle: 'Notas Estratégicas', saveNoteText: 'Guardar Nota (com hash)',
            previousNotesTitle: 'Notas Anteriores', integrityTitle: 'Integrity Check - Cadeia de Custódia',
            modalNotificationsTitle: 'Alertas Estratégicos', modalSettingsTitle: 'Configurações', noAlertsText: 'Nenhum alerta no momento',
            settingsAI: 'Preferências de IA', settingPredictiveAI: 'Previsão automática de êxito',
            settingJudgeProfiling: 'Perfil de magistrados', settingAdversaryProfiling: 'Perfil de escritórios de oposição',
            settingsNotifications: 'Notificações', settingNewDecisions: 'Novas decisões relevantes',
            settingDeadlines: 'Prazos processuais', settingsSecurity: 'Segurança',
            settingHoneyfiles: 'Ficheiros Armadilha (Digital Canary)', settingBiometrics: 'Biometria Comportamental',
            canaryTitle: 'ALERTA DE SEGURANÇA - DIGITAL CANARY',
            canaryMessage: 'Ficheiro armadilha detetado! O sistema entrou em lockdown automático.',
            canaryInstruction: 'Contacte imediatamente o administrador de segurança.',
            toastWelcome: 'Bem-vindo', toastLogout: 'Sessão encerrada', toastLoginError: 'Credenciais inválidas',
            toastNoteSaved: 'Nota guardada com hash de integridade', toastReportGenerated: 'Relatório gerado com sucesso!',
            toastExportError: 'Erro ao gerar relatório', toastIntegrityCheck: 'Certificado de integridade gerado',
            toastClientCreated: 'Cliente criado com sucesso!', toastDataLoaded: 'Dados carregados da memória local'
        },
        EN: {
            splashTitle: 'ELITE', splashBadge: 'PROBATUM', splashVersion: 'v1.0 · Secure Edition', splashTagline: 'Intelligence that wins cases',
            loaderText: 'Loading strategic ecosystem...', enterBtn: 'ENTER PLATFORM',
            loginTitle: 'ELITE PROBATUM', loginSubtitle: 'Authentication required to access the platform',
            loginUserPlaceholder: 'Username', loginPassPlaceholder: 'Password',
            yubikeyText: 'Authenticate with YubiKey', loginBtnText: 'Authenticate',
            loginHint: 'Credentials: admin / probatum', loginError: 'Invalid credentials',
            navDashboard: 'Dashboard', navCases: 'Cases', navLitigation: 'Litigation Intelligence',
            navJudges: 'Judge Profile', navAdversary: 'Adversary Profile',
            navHeatmap: 'Juris-Heatmap', navClients: 'Clients', navReports: 'Reports',
            statActiveCases: 'Active Cases', statDisputeValue: 'Dispute Value', statSuccessRate: 'Success Rate',
            dashboardTitle: 'Strategic Dashboard', portfolioChart: 'Portfolio Evolution (last 6 months)',
            categoryChart: 'Distribution by Legal Area', alertsTitle: 'Strategic Alerts',
            newCaseBtn: 'New Case', importCasesBtn: 'Batch Import', searchPlaceholder: 'Search cases...', allCases: 'All',
            litigationTitle: 'Predictive Success Analysis', litigationSubtitle: 'Enter case data for detailed prediction',
            predictCategory: 'Legal Area', predictValue: 'Case Value (€)', predictProbability: 'Estimated Probability (%)',
            predictCourt: 'Court', predictAdversary: 'Opposing Firm', runPrediction: 'Run Prediction',
            caseDetailTitle: 'Case Details', newClientTitle: 'New Client',
            clientNameLabel: 'Client Name *', clientNifLabel: 'VATIN *',
            clientValueLabel: 'Case Value (€) *', clientCourtLabel: 'Jurisdiction / Court',
            clientCategoryLabel: 'Legal Area', createClientBtn: 'Create Client',
            notesTitle: 'Strategic Notes', saveNoteText: 'Save Note (with hash)',
            previousNotesTitle: 'Previous Notes', integrityTitle: 'Integrity Check - Chain of Custody',
            modalNotificationsTitle: 'Strategic Alerts', modalSettingsTitle: 'Settings', noAlertsText: 'No alerts at this time',
            settingsAI: 'AI Preferences', settingPredictiveAI: 'Automatic success prediction',
            settingJudgeProfiling: 'Judge profiling', settingAdversaryProfiling: 'Opposing firm profiling',
            settingsNotifications: 'Notifications', settingNewDecisions: 'New relevant decisions',
            settingDeadlines: 'Procedural deadlines', settingsSecurity: 'Security',
            settingHoneyfiles: 'Honeyfiles (Digital Canary)', settingBiometrics: 'Behavioral Biometrics',
            canaryTitle: 'SECURITY ALERT - DIGITAL CANARY',
            canaryMessage: 'Honeyfile detected! System has entered automatic lockdown.',
            canaryInstruction: 'Contact the security administrator immediately.',
            toastWelcome: 'Welcome', toastLogout: 'Session closed', toastLoginError: 'Invalid credentials',
            toastNoteSaved: 'Note saved with integrity hash', toastReportGenerated: 'Report generated successfully!',
            toastExportError: 'Error generating report', toastIntegrityCheck: 'Integrity certificate generated',
            toastClientCreated: 'Client created successfully!', toastDataLoaded: 'Data loaded from local storage'
        }
    };
    
    let currentLocale = 'PT';
    
    // =========================================================================
    // CREDENCIAIS E RBAC
    // =========================================================================
    
    const CREDENTIALS = {
        admin: { password: 'probatum', role: 'SUPER_USER', name: 'Dr. Administrador', lawyerId: 'ADMIN', yubikeyHash: 'a1b2c3d4e5f6' },
        ana: { password: 'elite2024', role: 'ASSOCIATE', name: 'Dra. Ana Silva', lawyerId: 'L001', yubikeyHash: 'b2c3d4e5f6a7' },
        pedro: { password: 'elite2024', role: 'ASSOCIATE', name: 'Dr. Pedro Santos', lawyerId: 'L002', yubikeyHash: 'c3d4e5f6a7b8' }
    };
    
    // =========================================================================
    // MOCK DATA - COM DADOS ESTÁTICOS PARA GRÁFICOS
    // =========================================================================
    
    const MOCK_CASES = [
        { id: 'C001', client: 'João M.', category: 'civil', categoryName: 'Direito Civil', value: 28450, successProbability: 0.82, status: 'active', judge: 'Dr. António Costa', court: 'Lisboa', lawyerId: 'L001', description: 'Incumprimento contratual - prestação de serviços', createdAt: '2024-09-15', adversary: 'PLMJ' },
        { id: 'C002', client: 'Maria S.', category: 'labor', categoryName: 'Direito do Trabalho', value: 15720, successProbability: 0.75, status: 'active', judge: 'Dra. Sofia Mendes', court: 'Porto', lawyerId: 'L001', description: 'Despedimento ilícito - trabalhador', createdAt: '2024-10-01', adversary: 'VdA' },
        { id: 'C003', client: 'António P.', category: 'commercial', categoryName: 'Direito Comercial', value: 32400, successProbability: 0.88, status: 'pending', judge: 'Dr. Ricardo Alves', court: 'Braga', lawyerId: 'L002', description: 'Violação de acordo de acionistas', createdAt: '2024-10-20', adversary: 'Cuatrecasas' },
        { id: 'C004', client: 'Empresa XYZ', category: 'tax', categoryName: 'Direito Fiscal', value: 125000, successProbability: 0.68, status: 'active', judge: 'Dr. Pedro Martins', court: 'Lisboa', lawyerId: 'ADMIN', description: 'Impugnação de liquidação de IVA', createdAt: '2024-08-10', adversary: 'Garrigues' },
        { id: 'C005', client: 'Ana R.', category: 'family', categoryName: 'Direito da Família', value: 8500, successProbability: 0.91, status: 'active', judge: 'Dra. Teresa Lopes', court: 'Lisboa', lawyerId: 'L001', description: 'Regulação do poder paternal', createdAt: '2024-09-25', adversary: 'PLMJ' },
        { id: 'C006', client: 'Carlos M.', category: 'criminal', categoryName: 'Direito Penal', value: 0, successProbability: 0.72, status: 'active', judge: 'Dr. João Costa', court: 'Lisboa', lawyerId: 'L002', description: 'Recurso penal', createdAt: '2024-10-05', adversary: 'VdA' },
        { id: 'C007', client: 'Tech Solutions', category: 'intellectual', categoryName: 'Propriedade Intelectual', value: 45200, successProbability: 0.79, status: 'active', judge: 'Dra. Isabel Ferreira', court: 'Porto', lawyerId: 'ADMIN', description: 'Violação de patente', createdAt: '2024-09-18', adversary: 'Cuatrecasas' },
        { id: 'C008', client: 'José S.', category: 'administrative', categoryName: 'Direito Administrativo', value: 18900, successProbability: 0.64, status: 'pending', judge: 'Dr. Rui Silva', court: 'Braga', lawyerId: 'L001', description: 'Impugnação de ato administrativo', createdAt: '2024-10-12', adversary: 'Garrigues' },
        { id: 'C009', client: 'Mariana L.', category: 'civil', categoryName: 'Direito Civil', value: 42300, successProbability: 0.71, status: 'active', judge: 'Dr. António Costa', court: 'Lisboa', lawyerId: 'L002', description: 'Responsabilidade civil', createdAt: '2024-09-05', adversary: 'PLMJ' },
        { id: 'C010', client: 'Rui F.', category: 'labor', categoryName: 'Direito do Trabalho', value: 23500, successProbability: 0.69, status: 'active', judge: 'Dra. Sofia Mendes', court: 'Porto', lawyerId: 'L001', description: 'Acidente de trabalho', createdAt: '2024-10-18', adversary: 'VdA' }
    ];
    
    const MOCK_CLIENTS = [
        { id: 'CL001', name: 'João M.', nif: '123456789', category: 'civil', cases: 1, totalValue: 28450, lawyerId: 'L001' },
        { id: 'CL002', name: 'Maria S.', nif: '987654321', category: 'labor', cases: 1, totalValue: 15720, lawyerId: 'L001' },
        { id: 'CL003', name: 'António P.', nif: '456789123', category: 'commercial', cases: 1, totalValue: 32400, lawyerId: 'L002' },
        { id: 'CL004', name: 'Empresa XYZ', nif: '502345678', category: 'tax', cases: 1, totalValue: 125000, lawyerId: 'ADMIN' },
        { id: 'CL005', name: 'Ana R.', nif: '789123456', category: 'family', cases: 1, totalValue: 8500, lawyerId: 'L001' }
    ];
    
    // DADOS ESTÁTICOS PARA GRÁFICOS (OFFLINE-READY)
    const CHART_MOCK_DATA = {
        portfolio: {
            labels: ['Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set'],
            values: [125000, 142000, 158000, 187000, 215000, 248000]
        },
        categories: {
            civil: 3, labor: 2, commercial: 1, tax: 1, family: 1, criminal: 1, intellectual: 1, administrative: 1
        },
        courts: {
            lisboa: 68, porto: 72, braga: 58, coimbra: 62, faro: 55
        }
    };
    
    // =========================================================================
    // ADVERSARY PROFILING DATABASE
    // =========================================================================
    
    const ADVERSARY_PROFILES = {
        'PLMJ': { name: 'PLMJ', specialization: 'Full Service', pattern: '85% probability of extension request during case management phase', typicalArguments: ['international jurisdiction', 'statute of limitations', 'lack of procedural interest'], successRate: 0.68, avgResponseTime: 45, preferredCourts: ['Lisboa', 'Porto'], weakness: 'Slow response in urgent cases' },
        'VdA': { name: 'VdA', specialization: 'Tax & Arbitration', pattern: 'Aggressive strategy in evidentiary phase, extensive expert requests', typicalArguments: ['calculation error', 'lack of expert evidence', 'absence of causal link'], successRate: 0.72, avgResponseTime: 38, preferredCourts: ['Lisboa', 'Coimbra'], weakness: 'Poor preparation for final hearing' },
        'Cuatrecasas': { name: 'Cuatrecasas', specialization: 'Iberian', pattern: 'Tendency to out-of-court settlements in initial phase', typicalArguments: ['de minimis', 'international law issue'], successRate: 0.65, avgResponseTime: 52, preferredCourts: ['Porto', 'Braga'], weakness: 'Avoid litigation in high-value cases' },
        'Garrigues': { name: 'Garrigues', specialization: 'Tax', pattern: 'Systematic use of delaying appeals', typicalArguments: ['unconstitutionality', 'notification error'], successRate: 0.62, avgResponseTime: 65, preferredCourts: ['Lisboa'], weakness: 'Inconsistent in innovative arguments' }
    };
    
    // =========================================================================
    // JURIS-HEATMAP DATABASE
    // =========================================================================
    
    const JURIS_HEATMAP = {
        'Lisboa': { civil: 0.72, criminal: 0.58, labor: 0.68, commercial: 0.65, tax: 0.71, family: 0.74, administrative: 0.67, intellectual: 0.70 },
        'Porto': { civil: 0.75, criminal: 0.62, labor: 0.72, commercial: 0.68, tax: 0.69, family: 0.78, administrative: 0.71, intellectual: 0.73 },
        'Braga': { civil: 0.62, criminal: 0.55, labor: 0.61, commercial: 0.58, tax: 0.59, family: 0.65, administrative: 0.60, intellectual: 0.63 },
        'Coimbra': { civil: 0.68, criminal: 0.60, labor: 0.65, commercial: 0.62, tax: 0.64, family: 0.70, administrative: 0.66, intellectual: 0.68 },
        'Faro': { civil: 0.64, criminal: 0.57, labor: 0.63, commercial: 0.60, tax: 0.61, family: 0.68, administrative: 0.62, intellectual: 0.65 }
    };
    
    // =========================================================================
    // STATE MANAGEMENT COM LOCALSTORAGE PERSISTENCE
    // =========================================================================
    
    const AppState = {
        isLoggedIn: false,
        currentUser: null,
        userRole: null,
        userLawyerId: null,
        cases: [],
        clients: [],
        strategicNotes: [],
        notifications: [],
        categories: ['civil', 'criminal', 'labor', 'commercial', 'administrative', 'tax', 'family', 'intellectual'],
        metrics: { totalCases: 0, activeCases: 0, totalDisputeValue: 0, successRate: 0 },
        currentView: 'dashboard',
        sidebarOpen: false,
        security: { honeyfilesActive: true, biometricsActive: true, lockdown: false },
        
        // Persistence Methods
        loadFromStorage: function() {
            try {
                const savedCases = localStorage.getItem(STORAGE_KEYS.CASES);
                if (savedCases) this.cases = JSON.parse(savedCases);
                else this.cases = JSON.parse(JSON.stringify(MOCK_CASES));
                
                const savedClients = localStorage.getItem(STORAGE_KEYS.CLIENTS);
                if (savedClients) this.clients = JSON.parse(savedClients);
                else this.clients = JSON.parse(JSON.stringify(MOCK_CLIENTS));
                
                const savedNotes = localStorage.getItem(STORAGE_KEYS.NOTES);
                if (savedNotes) this.strategicNotes = JSON.parse(savedNotes);
                else this.strategicNotes = [];
                
                this.updateMetrics();
                EliteUtils.log('Data loaded from localStorage', 'info');
                return true;
            } catch (e) {
                EliteUtils.log('Error loading from storage: ' + e, 'error');
                this.cases = JSON.parse(JSON.stringify(MOCK_CASES));
                this.clients = JSON.parse(JSON.stringify(MOCK_CLIENTS));
                this.strategicNotes = [];
                return false;
            }
        },
        
        saveToStorage: function() {
            try {
                localStorage.setItem(STORAGE_KEYS.CASES, JSON.stringify(this.cases));
                localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(this.clients));
                localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(this.strategicNotes));
                EliteUtils.log('Data saved to localStorage', 'info');
                return true;
            } catch (e) {
                EliteUtils.log('Error saving to storage: ' + e, 'error');
                return false;
            }
        },
        
        updateMetrics: function() {
            const filteredCases = this.cases.filter(c => EliteUtils.hasAccessToCase(c));
            this.metrics.activeCases = filteredCases.filter(c => c.status === 'active').length;
            this.metrics.totalCases = filteredCases.length;
            this.metrics.totalDisputeValue = filteredCases.reduce((sum, c) => sum + c.value, 0);
            this.metrics.successRate = filteredCases.length > 0 ? filteredCases.reduce((sum, c) => sum + c.successProbability, 0) / filteredCases.length * 100 : 0;
        },
        
        addClient: function(client) {
            this.clients.push(client);
            this.saveToStorage();
            this.updateMetrics();
        },
        
        addNote: function(note) {
            this.strategicNotes.unshift(note);
            this.saveToStorage();
        }
    };
    
    // =========================================================================
    // UTILITÁRIOS
    // =========================================================================
    
    const EliteUtils = {
        formatCurrency: (value) => new Intl.NumberFormat(currentLocale === 'PT' ? 'pt-PT' : 'en-GB', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2 }).format(value || 0),
        formatDate: (date) => moment(date).format(currentLocale === 'PT' ? 'DD/MM/YYYY' : 'YYYY-MM-DD'),
        formatPercentage: (value) => `${(value || 0).toFixed(1)}%`,
        generateId: () => Date.now().toString(36) + Math.random().toString(36).substr(2, 8),
        generateHash: (content) => CryptoJS.SHA256(content + Date.now().toString()).toString(),
        verifyHash: (content, hash) => CryptoJS.SHA256(content).toString() === hash,
        
        showToast: (message, type = 'info') => {
            const container = document.getElementById('toastContainer');
            if (!container) return;
            const toast = document.createElement('div');
            toast.className = `toast ${type}`;
            const icons = { success: 'fa-check-circle', error: 'fa-exclamation-triangle', warning: 'fa-exclamation-circle', info: 'fa-info-circle' };
            toast.innerHTML = `<i class="fas ${icons[type]}"></i><span>${message}</span>`;
            container.appendChild(toast);
            setTimeout(() => { toast.style.animation = 'slideInRight 0.3s ease reverse'; setTimeout(() => toast.remove(), 300); }, 4000);
        },
        
        log: (message, level = 'info') => { const prefix = '[ELITE PROBATUM]'; if (level === 'error') console.error(prefix, message); else if (level === 'warn') console.warn(prefix, message); else console.log(prefix, message); },
        
        getCategoryName: (category) => {
            const names = { civil: 'Direito Civil', criminal: 'Direito Penal', labor: 'Direito do Trabalho', commercial: 'Direito Comercial', administrative: 'Direito Administrativo', tax: 'Direito Fiscal', family: 'Direito da Família', intellectual: 'Propriedade Intelectual', all: 'Todos os Casos' };
            return currentLocale === 'PT' ? names[category] : { civil: 'Civil Law', criminal: 'Criminal Law', labor: 'Labor Law', commercial: 'Commercial Law', administrative: 'Administrative Law', tax: 'Tax Law', family: 'Family Law', intellectual: 'Intellectual Property', all: 'All Cases' }[category] || category;
        },
        
        getCategoryColor: (category) => {
            const colors = { civil: '#3B82F6', criminal: '#EF4444', labor: '#10B981', commercial: '#F59E0B', administrative: '#8B5CF6', tax: '#00E5FF', family: '#EC489A', intellectual: '#14B8A6' };
            return colors[category] || '#64748B';
        },
        
        hasAccessToCase: (caseData) => { if (AppState.userRole === 'SUPER_USER') return true; return caseData.lawyerId === AppState.userLawyerId; },
        
        getLocaleText: (key) => { return LOCALES[currentLocale][key] || key; }
    };
    
    // =========================================================================
    // PDF CERTIFICATE GENERATOR (jsPDF com auto-table)
    // =========================================================================
    
    const PDFCertificate = {
        generateCertificate: async function(certData) {
            return new Promise((resolve) => {
                const { jsPDF } = window.jspdf;
                const pdf = new jsPDF('p', 'mm', 'a4');
                
                // Cabeçalho com logotipo
                pdf.setFillColor(10, 15, 30);
                pdf.rect(0, 0, 210, 40, 'F');
                pdf.setTextColor(0, 229, 255);
                pdf.setFontSize(24);
                pdf.setFont('helvetica', 'bold');
                pdf.text('ELITE PROBATUM', 105, 20, { align: 'center' });
                pdf.setFontSize(10);
                pdf.setTextColor(148, 163, 184);
                pdf.text('Certificate of Integrity - Chain of Custody', 105, 30, { align: 'center' });
                
                // Corpo do certificado
                pdf.setTextColor(255, 255, 255);
                pdf.setFontSize(12);
                pdf.setFont('helvetica', 'normal');
                pdf.text(`Issued: ${new Date(certData.timestamp).toLocaleString()}`, 20, 55);
                pdf.text(`Certificate ID: ${certData.certificate}`, 20, 65);
                
                // Tabela de dados
                pdf.setFillColor(30, 41, 59);
                pdf.rect(20, 80, 170, 50, 'F');
                pdf.setTextColor(0, 229, 255);
                pdf.setFontSize(10);
                pdf.setFont('helvetica', 'bold');
                pdf.text('Data Summary', 25, 90);
                
                pdf.setTextColor(255, 255, 255);
                pdf.setFont('helvetica', 'normal');
                pdf.text(`Total Cases: ${certData.dataSummary.totalCases}`, 25, 100);
                pdf.text(`Total Clients: ${certData.dataSummary.totalClients}`, 25, 108);
                pdf.text(`Strategic Notes: ${certData.dataSummary.totalNotes}`, 25, 116);
                pdf.text(`Total Dispute Value: €${certData.dataSummary.totalDisputeValue.toLocaleString()}`, 25, 124);
                
                // Master Hash
                pdf.setTextColor(0, 229, 255);
                pdf.setFontSize(9);
                pdf.text('Master Hash SHA-256:', 20, 150);
                pdf.setTextColor(100, 116, 139);
                pdf.setFont('courier', 'normal');
                pdf.text(certData.masterHash, 20, 158);
                
                // Rodapé
                pdf.setFillColor(10, 15, 30);
                pdf.rect(0, 270, 210, 20, 'F');
                pdf.setTextColor(100, 116, 139);
                pdf.setFontSize(8);
                pdf.text('ELITE PROBATUM v1.0 Secure Edition - Digital Evidence Integrity Certificate', 105, 280, { align: 'center' });
                pdf.text(`Generated: ${new Date().toISOString()}`, 105, 287, { align: 'center' });
                
                pdf.save(`elite_probatum_integrity_cert_${new Date().toISOString().slice(0, 10)}.pdf`);
                resolve(true);
            });
        }
    };
    
    // =========================================================================
    // GRAPHICS MANAGER (com mock data para offline)
    // =========================================================================
    
    let activeCharts = {};
    
    const GraphicsManager = {
        initPortfolioChart: function() {
            const ctx = document.getElementById('portfolioChart');
            if (!ctx || typeof Chart === 'undefined') return;
            if (activeCharts.portfolio) activeCharts.portfolio.destroy();
            activeCharts.portfolio = new Chart(ctx, {
                type: 'line',
                data: { labels: CHART_MOCK_DATA.portfolio.labels, datasets: [{ label: EliteUtils.getLocaleText('statDisputeValue') + ' (€)', data: CHART_MOCK_DATA.portfolio.values, borderColor: '#00E5FF', backgroundColor: 'rgba(0, 229, 255, 0.1)', tension: 0.4, fill: true, pointRadius: 4, pointHoverRadius: 8, pointBackgroundColor: '#00E5FF' }] },
                options: { responsive: true, maintainAspectRatio: true, plugins: { legend: { labels: { color: '#CBD5E1', font: { size: 11 } } }, tooltip: { backgroundColor: '#0F172A', titleColor: '#00E5FF', bodyColor: '#FFFFFF' } }, scales: { y: { ticks: { color: '#94A3B8', callback: (v) => '€' + v.toLocaleString() }, grid: { color: 'rgba(255,255,255,0.1)' } }, x: { ticks: { color: '#94A3B8' }, grid: { color: 'rgba(255,255,255,0.05)' } } } }
            });
        },
        
        initCategoryChart: function() {
            const ctx = document.getElementById('categoryChart');
            if (!ctx || typeof Chart === 'undefined') return;
            if (activeCharts.category) activeCharts.category.destroy();
            const categories = AppState.cases.reduce((acc, c) => { acc[c.categoryName] = (acc[c.categoryName] || 0) + 1; return acc; }, {});
            const labels = Object.keys(categories);
            const data = Object.values(categories);
            const colors = labels.map(l => {
                const cat = { 'Direito Civil': '#3B82F6', 'Direito Penal': '#EF4444', 'Direito do Trabalho': '#10B981', 'Direito Comercial': '#F59E0B', 'Direito Administrativo': '#8B5CF6', 'Direito Fiscal': '#00E5FF', 'Direito da Família': '#EC489A', 'Propriedade Intelectual': '#14B8A6' }[l] || '#64748B';
                return colors;
            });
            activeCharts.category = new Chart(ctx, {
                type: 'doughnut',
                data: { labels: labels, datasets: [{ data: data, backgroundColor: colors, borderWidth: 0, hoverOffset: 10 }] },
                options: { responsive: true, maintainAspectRatio: true, plugins: { legend: { position: 'right', labels: { color: '#CBD5E1', font: { size: 10 }, boxWidth: 12 } }, tooltip: { backgroundColor: '#0F172A', titleColor: '#00E5FF', bodyColor: '#FFFFFF', callbacks: { label: (ctx) => `${ctx.label}: ${ctx.raw} casos (${((ctx.raw / data.reduce((a,b)=>a+b,0))*100).toFixed(1)}%)` } } } }
            });
        },
        
        initCourtTrendsChart: function() {
            const ctx = document.getElementById('courtTrendsChart');
            if (!ctx || typeof Chart === 'undefined') return;
            if (activeCharts.court) activeCharts.court.destroy();
            activeCharts.court = new Chart(ctx, {
                type: 'bar',
                data: { labels: ['Lisboa', 'Porto', 'Braga', 'Coimbra', 'Faro'], datasets: [{ label: 'Success Rate (%)', data: [68, 72, 58, 62, 55], backgroundColor: '#00E5FF', borderRadius: 8, barPercentage: 0.6 }, { label: 'Avg Time (days)', data: [120, 95, 110, 130, 105], backgroundColor: '#F59E0B', borderRadius: 8, barPercentage: 0.6 }] },
                options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#CBD5E1' } }, tooltip: { backgroundColor: '#0F172A', titleColor: '#00E5FF', bodyColor: '#FFFFFF' } }, scales: { y: { ticks: { color: '#94A3B8' }, grid: { color: 'rgba(255,255,255,0.1)' } }, x: { ticks: { color: '#94A3B8' }, grid: { color: 'rgba(255,255,255,0.05)' } } } }
            });
        },
        
        destroyAll: function() {
            Object.values(activeCharts).forEach(chart => { if (chart) chart.destroy(); });
            activeCharts = {};
        }
    };
    
    // =========================================================================
    // BIOMETRIA COMPORTAMENTAL
    // =========================================================================
    
    let keystrokeTimestamps = [];
    let biometricProfile = { avgKeyDelay: 0, samples: [] };
    
    const BiometricMonitor = {
        startMonitoring: () => {
            const inputs = document.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                input.addEventListener('keydown', (e) => { keystrokeTimestamps.push({ key: e.key, time: Date.now(), type: 'down' }); });
                input.addEventListener('keyup', (e) => { 
                    keystrokeTimestamps.push({ key: e.key, time: Date.now(), type: 'up' });
                    if (keystrokeTimestamps.length > 10) BiometricMonitor.analyzePattern();
                });
            });
        },
        analyzePattern: () => {
            if (keystrokeTimestamps.length < 10) return;
            const delays = [];
            for (let i = 1; i < keystrokeTimestamps.length; i++) {
                if (keystrokeTimestamps[i].type === 'down' && keystrokeTimestamps[i-1].type === 'up') {
                    delays.push(keystrokeTimestamps[i].time - keystrokeTimestamps[i-1].time);
                }
            }
            const avgDelay = delays.reduce((a,b) => a+b, 0) / delays.length;
            if (biometricProfile.avgKeyDelay === 0) { biometricProfile.avgKeyDelay = avgDelay; biometricProfile.samples.push(avgDelay); }
            else {
                const deviation = Math.abs(avgDelay - biometricProfile.avgKeyDelay) / biometricProfile.avgKeyDelay;
                if (deviation > 0.5 && AppState.security.biometricsActive && AppState.isLoggedIn) {
                    EliteUtils.showToast('Anomalous typing pattern detected - access monitored', 'warning');
                    EliteUtils.log('Keystroke anomaly detected', 'warn');
                }
            }
            if (keystrokeTimestamps.length > 100) keystrokeTimestamps = keystrokeTimestamps.slice(-50);
        },
        calibrate: () => { keystrokeTimestamps = []; biometricProfile.avgKeyDelay = 0; biometricProfile.samples = []; }
    };
    
    // =========================================================================
    // DIGITAL CANARY (Honeyfiles)
    // =========================================================================
    
    let canaryTriggered = false;
    
    const DigitalCanary = {
        deployHoneyfiles: () => {
            if (!AppState.security.honeyfilesActive) return;
            const honeyfileContainer = document.createElement('div');
            honeyfileContainer.style.display = 'none';
            honeyfileContainer.id = 'honeyfile-container';
            document.body.appendChild(honeyfileContainer);
            const honeyfiles = [
                { name: 'estrategia_fiscal_confidencial.pdf', hash: 'f1e2d3c4b5a6' },
                { name: 'acordo_secreto_plataformas.docx', hash: 'a1b2c3d4e5f6' }
            ];
            honeyfiles.forEach(hf => {
                const fakeElement = document.createElement('div');
                fakeElement.setAttribute('data-honeyfile', hf.name);
                fakeElement.setAttribute('data-hash', hf.hash);
                fakeElement.style.display = 'none';
                honeyfileContainer.appendChild(fakeElement);
            });
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes' || mutation.type === 'childList') {
                        const target = mutation.target;
                        if (target.getAttribute && target.getAttribute('data-honeyfile')) {
                            DigitalCanary.triggerLockdown(target.getAttribute('data-honeyfile'));
                        }
                    }
                });
            });
            observer.observe(honeyfileContainer, { attributes: true, childList: true, subtree: true });
        },
        triggerLockdown: (honeyfileName) => {
            if (canaryTriggered) return;
            canaryTriggered = true;
            AppState.security.lockdown = true;
            EliteUtils.log(`⚠️ DIGITAL CANARY TRIGGERED: ${honeyfileName}`, 'error');
            const canaryModal = document.getElementById('canaryAlertModal');
            if (canaryModal) canaryModal.style.display = 'flex';
            localStorage.removeItem(STORAGE_KEYS.SESSION);
            setTimeout(() => { AuthManager.logout(); }, 3000);
        }
    };
    
    // =========================================================================
    // AUTH MANAGER
    // =========================================================================
    
    const AuthManager = {
        login: (username, password, yubikeyHash = null) => {
            const user = CREDENTIALS[username];
            if (user && user.password === password) {
                if (yubikeyHash && user.yubikeyHash !== yubikeyHash) {
                    EliteUtils.showToast(EliteUtils.getLocaleText('toastLoginError'), 'error');
                    return false;
                }
                AppState.isLoggedIn = true;
                AppState.currentUser = username;
                AppState.userRole = user.role;
                AppState.userLawyerId = user.lawyerId;
                AppState.security.lockdown = false;
                document.getElementById('userName').textContent = user.name;
                document.getElementById('userRole').textContent = user.role === 'SUPER_USER' ? (currentLocale === 'PT' ? 'Super Utilizador · Acesso Total' : 'Super User · Full Access') : (currentLocale === 'PT' ? 'Associado · Acesso Restrito' : 'Associate · Restricted Access');
                EliteUtils.showToast(`${EliteUtils.getLocaleText('toastWelcome')}, ${user.name}`, 'success');
                BiometricMonitor.calibrate();
                setTimeout(() => BiometricMonitor.startMonitoring(), 1000);
                DigitalCanary.deployHoneyfiles();
                return true;
            }
            return false;
        },
        logout: () => {
            AppState.isLoggedIn = false;
            AppState.currentUser = null;
            AppState.userRole = null;
            AppState.userLawyerId = null;
            AppState.security.lockdown = false;
            canaryTriggered = false;
            document.getElementById('appContainer').style.display = 'none';
            document.getElementById('loginOverlay').style.display = 'flex';
            EliteUtils.showToast(EliteUtils.getLocaleText('toastLogout'), 'info');
            BiometricMonitor.calibrate();
        },
        showLoginModal: () => {
            document.getElementById('loginOverlay').style.display = 'flex';
            document.getElementById('loginUser').value = '';
            document.getElementById('loginPass').value = '';
            document.getElementById('loginError').style.display = 'none';
        },
        hideLoginModal: () => { document.getElementById('loginOverlay').style.display = 'none'; }
    };
    
    // =========================================================================
    // INTERNATIONALIZATION MANAGER
    // =========================================================================
    
    const I18nManager = {
        setLocale: (locale) => {
            currentLocale = locale;
            document.documentElement.lang = locale === 'PT' ? 'pt-PT' : 'en-GB';
            I18nManager.updateAllTexts();
            GraphicsManager.destroyAll();
            if (AppState.currentView === 'dashboard') {
                setTimeout(() => { GraphicsManager.initPortfolioChart(); GraphicsManager.initCategoryChart(); }, 100);
            } else if (AppState.currentView === 'judges') {
                setTimeout(() => { GraphicsManager.initCourtTrendsChart(); }, 100);
            }
            EliteUtils.showToast(`Idioma alterado para ${locale === 'PT' ? 'Português' : 'English'}`, 'info');
        },
        updateAllTexts: () => {
            const textMap = {
                splashTitle: 'splashTitle', splashBadge: 'splashBadge', splashVersion: 'splashVersion', splashTagline: 'splashTagline', loaderText: 'loaderText', enterBtnText: 'enterBtn',
                loginTitle: 'loginTitle', loginSubtitle: 'loginSubtitle', yubikeyText: 'yubikeyText', loginBtnText: 'loginBtnText', loginHint: 'loginHint',
                navDashboard: 'navDashboard', navCases: 'navCases', navLitigation: 'navLitigation', navJudges: 'navJudges', navAdversary: 'navAdversary', navHeatmap: 'navHeatmap', navClients: 'navClients', navReports: 'navReports',
                statActiveCases: 'statActiveCases', statDisputeValue: 'statDisputeValue', statSuccessRate: 'statSuccessRate',
                pageTitle: 'dashboardTitle', modalNotificationsTitle: 'modalNotificationsTitle', modalSettingsTitle: 'modalSettingsTitle', noAlertsText: 'noAlertsText',
                settingsAI: 'settingsAI', settingPredictiveAI: 'settingPredictiveAI', settingJudgeProfiling: 'settingJudgeProfiling', settingAdversaryProfiling: 'settingAdversaryProfiling',
                settingsNotifications: 'settingsNotifications', settingNewDecisions: 'settingNewDecisions', settingDeadlines: 'settingDeadlines',
                settingsSecurity: 'settingsSecurity', settingHoneyfiles: 'settingHoneyfiles', settingBiometrics: 'settingBiometrics'
            };
            for (const [id, key] of Object.entries(textMap)) {
                const el = document.getElementById(id);
                if (el && LOCALES[currentLocale][key]) el.textContent = LOCALES[currentLocale][key];
            }
            document.querySelectorAll('.lang-btn').forEach(btn => {
                btn.classList.toggle('active', (currentLocale === 'PT' && btn.id === 'langPT') || (currentLocale === 'EN' && btn.id === 'langEN'));
            });
        }
    };
    
    // =========================================================================
    // NOTES MANAGER COM PERSISTENCE
    // =========================================================================
    
    const NotesManager = {
        addNote: (content, authorId) => {
            const hash = EliteUtils.generateHash(content);
            const note = { id: EliteUtils.generateId(), content: content, author_id: authorId, timestamp: new Date().toISOString(), content_hash: hash };
            AppState.addNote(note);
            EliteUtils.showToast(EliteUtils.getLocaleText('toastNoteSaved'), 'success');
            return note;
        },
        renderNotes: (containerId) => {
            const container = document.getElementById(containerId);
            if (!container) return;
            if (AppState.strategicNotes.length === 0) { container.innerHTML = '<div class="empty-state">Nenhuma nota registada</div>'; return; }
            container.innerHTML = AppState.strategicNotes.map(note => `<div class="note-item"><div class="note-header"><span><i class="fas fa-user"></i> ${note.author_id}</span><span><i class="fas fa-clock"></i> ${new Date(note.timestamp).toLocaleString()}</span><span class="integrity-badge"><i class="fas fa-check-circle"></i> Hash Verificado</span></div><div class="note-content">${escapeHtml(note.content)}</div><div class="note-hash">SHA-256: ${note.content_hash.substring(0, 16)}...</div></div>`).join('');
        }
    };
    
    // =========================================================================
    // ADVERSARY PROFILING
    // =========================================================================
    
    const AdversaryProfiler = {
        getProfile: (adversaryName) => ADVERSARY_PROFILES[adversaryName] || null,
        renderAdversaryPanel: () => `<div class="adversary-grid">${Object.values(ADVERSARY_PROFILES).map(adv => `<div class="adversary-card"><div class="adversary-header"><i class="fas fa-building"></i><h3>${adv.name}</h3></div><div class="adversary-stats"><div class="stat"><span class="stat-label">${EliteUtils.getLocaleText('statSuccessRate') || 'Success Rate'}</span><strong>${EliteUtils.formatPercentage(adv.successRate * 100)}</strong></div><div class="stat"><span class="stat-label">Avg Response</span><strong>${adv.avgResponseTime} days</strong></div><div class="stat"><span class="stat-label">Specialization</span><strong>${adv.specialization}</strong></div></div><div class="adversary-pattern"><div class="alert"><i class="fas fa-chart-line"></i> Pattern Identified</div><p>${adv.pattern}</p></div><div class="adversary-weakness"><strong><i class="fas fa-shield-alt"></i> Weakness:</strong> ${adv.weakness}</div></div>`).join('')}</div>`
    };
    
    // =========================================================================
    // JURIS-HEATMAP
    // =========================================================================
    
    const JurisHeatmap = {
        getCourtSuccessRate: (court, category) => JURIS_HEATMAP[court]?.[category] || 0.6,
        getRecommendation: (caseData) => {
            const rates = [];
            for (const [court, data] of Object.entries(JURIS_HEATMAP)) { const rate = data[caseData.category] || 0.6; rates.push({ court, rate }); }
            rates.sort((a, b) => b.rate - a.rate);
            return { bestCourt: rates[0].court, bestRate: rates[0].rate, alternatives: rates.slice(1, 3) };
        },
        renderHeatmap: () => {
            const categories = ['civil', 'criminal', 'labor', 'commercial', 'tax'];
            const courts = ['Lisboa', 'Porto', 'Braga', 'Coimbra', 'Faro'];
            return `<div class="heatmap-container"><h3>Juris-Heatmap</h3><p>Success rate by court and legal area</p><div class="heatmap-grid"><div class="heatmap-label"></div>${categories.map(cat => `<div class="heatmap-label">${EliteUtils.getCategoryName(cat)}</div>`).join('')}${courts.map(court => `<div class="heatmap-label">${court}</div>${categories.map(cat => { const rate = JURIS_HEATMAP[court][cat]; let heatClass = 'low'; if (rate >= 0.7) heatClass = 'high'; else if (rate >= 0.65) heatClass = 'medium'; return `<div class="heatmap-cell ${heatClass}">${EliteUtils.formatPercentage(rate * 100)}</div>`; }).join('')}`).join('')}</div><div class="heatmap-legend" style="margin-top: 20px; display: flex; gap: 20px; justify-content: center;"><span><span style="background: rgba(16,185,129,0.3); padding: 4px 8px;">≥70%</span> High</span><span><span style="background: rgba(245,158,11,0.3); padding: 4px 8px;">65-69%</span> Medium</span><span><span style="background: rgba(239,68,68,0.3); padding: 4px 8px;">&lt;65%</span> Low</span></div></div>`;
        }
    };
    
    // =========================================================================
    // INTEGRITY CHECKER COM PDF
    // =========================================================================
    
    const IntegrityChecker = {
        generateCertificate: async () => {
            const timestamp = new Date().toISOString();
            const dataToHash = JSON.stringify({ cases: AppState.cases.length, clients: AppState.clients.length, notes: AppState.strategicNotes.length, timestamp: timestamp, version: '1.0' });
            const masterHash = CryptoJS.SHA256(dataToHash).toString();
            return { timestamp: timestamp, dataSummary: { totalCases: AppState.cases.length, totalClients: AppState.clients.length, totalNotes: AppState.strategicNotes.length, totalDisputeValue: AppState.metrics.totalDisputeValue }, masterHash: masterHash, certificate: `ELITE-PROBATUM-CERT-${masterHash.substring(0, 16)}` };
        },
        renderIntegrityModal: async () => {
            const cert = await IntegrityChecker.generateCertificate();
            const integrityBody = document.getElementById('integrityBody');
            if (integrityBody) {
                integrityBody.innerHTML = `<div class="integrity-report"><div style="text-align: center; margin-bottom: 24px;"><i class="fas fa-shield-hooded" style="font-size: 3rem; color: var(--elite-success);"></i><h3>Integrity Certificate</h3><p>ELITE PROBATUM - Chain of Custody Verified</p></div><div class="detail-row"><span>Verification Date/Time:</span><strong>${new Date(cert.timestamp).toLocaleString()}</strong></div><div class="detail-row"><span>Total Cases:</span><strong>${cert.dataSummary.totalCases}</strong></div><div class="detail-row"><span>Total Clients:</span><strong>${cert.dataSummary.totalClients}</strong></div><div class="detail-row"><span>Strategic Notes:</span><strong>${cert.dataSummary.totalNotes}</strong></div><div class="detail-row"><span>Total Dispute Value:</span><strong>${EliteUtils.formatCurrency(cert.dataSummary.totalDisputeValue)}</strong></div><div class="detail-row"><span>Master Hash SHA-256:</span><strong style="font-family: monospace; font-size: 0.7rem; word-break: break-all;">${cert.masterHash}</strong></div><div class="detail-row"><span>Certificate:</span><strong style="color: var(--elite-success);">${cert.certificate}</strong></div><div style="margin-top: 24px; padding: 16px; background: rgba(0,229,255,0.1); border-radius: 8px; text-align: center;"><i class="fas fa-check-circle" style="color: var(--elite-success);"></i><p>Chain of custody is intact. No unauthorized changes detected.</p></div><button class="elite-btn primary full-width" style="margin-top: 20px;" id="downloadPdfCertBtn"><i class="fas fa-file-pdf"></i> Download PDF Certificate</button></div>`;
                document.getElementById('downloadPdfCertBtn')?.addEventListener('click', async () => { await PDFCertificate.generateCertificate(cert); EliteUtils.showToast(EliteUtils.getLocaleText('toastIntegrityCheck'), 'success'); });
            }
        }
    };
    
    // =========================================================================
    // PDF EXPORTER
    // =========================================================================
    
    const PDFExporter = {
        exportReport: async () => {
            EliteUtils.showToast('Generating expert report...', 'info');
            const element = document.getElementById('viewContainer');
            if (!element) return;
            try {
                const canvas = await html2canvas(element, { scale: 2, backgroundColor: '#0A0F1E', logging: false });
                const imgData = canvas.toDataURL('image/png');
                const { jsPDF } = window.jspdf;
                const pdf = new jsPDF('p', 'mm', 'a4');
                const imgWidth = 190;
                const imgHeight = (canvas.height * imgWidth) / canvas.width;
                pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
                pdf.save(`elite_probatum_report_${new Date().toISOString().slice(0, 10)}.pdf`);
                EliteUtils.showToast(EliteUtils.getLocaleText('toastReportGenerated'), 'success');
            } catch (error) { EliteUtils.showToast(EliteUtils.getLocaleText('toastExportError'), 'error'); console.error(error); }
        }
    };
    
    // =========================================================================
    // VIEW RENDERER
    // =========================================================================
    
    const Views = {
        async render(viewName) {
            const container = document.getElementById('viewContainer');
            if (!container) return;
            AppState.currentView = viewName;
            document.getElementById('pageTitle').textContent = EliteUtils.getLocaleText('dashboardTitle');
            GraphicsManager.destroyAll();
            switch(viewName) {
                case 'dashboard': container.innerHTML = await this.renderDashboard(); setTimeout(() => { GraphicsManager.initPortfolioChart(); GraphicsManager.initCategoryChart(); }, 100); break;
                case 'cases': container.innerHTML = await this.renderCases(); await this.initCasesTable(); break;
                case 'litigation': container.innerHTML = await this.renderLitigationIntelligence(); await this.initLitigationModule(); break;
                case 'judges': container.innerHTML = await this.renderJudgesProfiles(); setTimeout(() => { GraphicsManager.initCourtTrendsChart(); }, 100); break;
                case 'adversary': container.innerHTML = AdversaryProfiler.renderAdversaryPanel(); break;
                case 'heatmap': container.innerHTML = JurisHeatmap.renderHeatmap(); break;
                case 'clients': container.innerHTML = await this.renderClients(); await this.initClientsTable(); break;
                case 'reports': container.innerHTML = await this.renderReports(); break;
                default: container.innerHTML = '<div class="error">View not found</div>';
            }
        },
        
        renderDashboard: async () => {
            const filteredCases = AppState.cases.filter(c => EliteUtils.hasAccessToCase(c));
            const activeCases = filteredCases.filter(c => c.status === 'active').length;
            const totalValue = filteredCases.reduce((sum, c) => sum + c.value, 0);
            const avgProbability = filteredCases.reduce((sum, c) => sum + c.successProbability, 0) / (filteredCases.length || 1);
            return `<div class="dashboard-grid"><div class="dashboard-card"><div class="card-header"><h3>${EliteUtils.getLocaleText('statActiveCases')}</h3><i class="fas fa-folder-open"></i></div><div class="card-value">${activeCases}</div><div class="card-trend trend-up"><i class="fas fa-arrow-up"></i> +12% this month</div></div><div class="dashboard-card"><div class="card-header"><h3>${EliteUtils.getLocaleText('statDisputeValue')}</h3><i class="fas fa-euro-sign"></i></div><div class="card-value">${EliteUtils.formatCurrency(totalValue)}</div><div class="card-trend trend-up"><i class="fas fa-arrow-up"></i> +8% vs previous period</div></div><div class="dashboard-card"><div class="card-header"><h3>${EliteUtils.getLocaleText('statSuccessRate')}</h3><i class="fas fa-chart-line"></i></div><div class="card-value">${EliteUtils.formatPercentage(avgProbability * 100)}</div><div class="card-trend trend-up"><i class="fas fa-arrow-up"></i> +5% with AI</div></div><div class="dashboard-card"><div class="card-header"><h3>ROI Estimado</h3><i class="fas fa-chart-pie"></i></div><div class="card-value">284%</div><div class="card-trend trend-up"><i class="fas fa-arrow-up"></i> vs. market</div></div></div><div class="charts-dashboard"><div class="chart-container"><h3>${EliteUtils.getLocaleText('portfolioChart')}</h3><canvas id="portfolioChart" height="250"></canvas></div><div class="chart-container"><h3>${EliteUtils.getLocaleText('categoryChart')}</h3><canvas id="categoryChart" height="250"></canvas></div></div><div class="chart-container"><h3>${EliteUtils.getLocaleText('alertsTitle')}</h3><div id="alertsList" class="alerts-list"><div class="alert-item critical"><i class="fas fa-exclamation-triangle"></i><div><strong>New Supreme Court precedent</strong><p>Relevant ruling on civil liability</p><small>DGSI - 15.10.2024</small></div></div><div class="alert-item warning"><i class="fas fa-gavel"></i><div><strong>Court of Appeal composition change</strong><p>New judges appointed</p><small>CSM - 14.10.2024</small></div></div><div class="alert-item info"><i class="fas fa-chart-line"></i><div><strong>Tax Law growth</strong><p>23% increase in tax litigation cases</p><small>Market Analysis</small></div></div></div></div>`;
        },
        
        renderCases: async () => {
            const filteredCases = AppState.cases.filter(c => EliteUtils.hasAccessToCase(c));
            return `<div class="cases-header" style="display: flex; justify-content: space-between; margin-bottom: 20px; flex-wrap: wrap; gap: 16px;"><div class="cases-actions"><button id="newCaseBtn" class="elite-btn primary"><i class="fas fa-plus"></i> ${EliteUtils.getLocaleText('newCaseBtn')}</button><button id="importCasesBtn" class="elite-btn secondary"><i class="fas fa-upload"></i> ${EliteUtils.getLocaleText('importCasesBtn')}</button></div><div class="cases-search"><input type="text" id="searchCases" placeholder="${EliteUtils.getLocaleText('searchPlaceholder')}" class="search-input" style="width: 250px;"></div></div><div class="category-selector"><button class="category-btn active" data-category="all">${EliteUtils.getLocaleText('allCases')}</button>${AppState.categories.map(cat => `<button class="category-btn" data-category="${cat}">${EliteUtils.getCategoryName(cat)}</button>`).join('')}</div><table class="data-table"><thead><tr><th>Case</th><th>Client</th><th>Area</th><th>Value (€)</th><th>Success Prob.</th><th>Opposition</th><th>Actions</th></thead><tbody id="casesTableBody">${filteredCases.map(c => `<tr data-case-id="${c.id}" data-category="${c.category}"><td><strong>${c.id}</strong><br><small>${c.description.substring(0, 30)}...</small></td><td>${c.client}</td><td><span class="case-badge ${c.category}" style="background: ${EliteUtils.getCategoryColor(c.category)}20; color: ${EliteUtils.getCategoryColor(c.category)}">${c.categoryName}</span></td><td>${EliteUtils.formatCurrency(c.value)}</td><td><div class="progress-bar"><div class="progress-fill" style="width: ${c.successProbability * 100}%"></div><span class="progress-text">${EliteUtils.formatPercentage(c.successProbability * 100)}</span></div></td><td><span class="case-badge">${c.adversary || 'N/A'}</span></td><td><button class="action-btn view-case" data-id="${c.id}" title="View details"><i class="fas fa-eye"></i></button><button class="action-btn analyze-case" data-id="${c.id}" title="Predictive analysis"><i class="fas fa-chart-line"></i></button><button class="action-btn adversary-alert" data-adversary="${c.adversary}" title="Opposition profile"><i class="fas fa-users"></i></button></td></tr>`).join('')}</tbody></table>`;
        },
        
        renderLitigationIntelligence: () => `<div class="litigation-intelligence"><div class="intelligence-header"><h2>${EliteUtils.getLocaleText('litigationTitle')}</h2><p>${EliteUtils.getLocaleText('litigationSubtitle')}</p></div><div class="intelligence-form"><div class="form-row"><div class="form-group"><label>${EliteUtils.getLocaleText('predictCategory')}</label><select id="predictCategory">${AppState.categories.map(c => `<option value="${c}">${EliteUtils.getCategoryName(c)}</option>`).join('')}</select></div><div class="form-group"><label>${EliteUtils.getLocaleText('predictValue')}</label><input type="number" id="predictValue" placeholder="Ex: 50000"></div><div class="form-group"><label>${EliteUtils.getLocaleText('predictProbability')}</label><input type="number" id="predictProbability" placeholder="Ex: 75" step="1"></div></div><div class="form-row"><div class="form-group"><label>${EliteUtils.getLocaleText('predictCourt')}</label><select id="predictCourt"><option value="lisboa">Lisboa</option><option value="porto">Porto</option><option value="braga">Braga</option><option value="coimbra">Coimbra</option><option value="faro">Faro</option></select></div><div class="form-group"><label>${EliteUtils.getLocaleText('predictAdversary')}</label><select id="predictAdversary"><option value="">Select...</option>${Object.keys(ADVERSARY_PROFILES).map(a => `<option value="${a}">${a}</option>`).join('')}</select></div></div><button id="runPredictionBtn" class="elite-btn primary full-width"><i class="fas fa-brain"></i> ${EliteUtils.getLocaleText('runPrediction')}</button></div><div id="predictionResult" class="prediction-result" style="display: none;"></div></div>`,
        
        renderJudgesProfiles: () => {
            const judges = [{ name: 'Dr. António Costa', court: 'Lisboa', category: 'civil', decisions: 45, favorableRate: 0.68, avgTime: 120 }, { name: 'Dra. Sofia Mendes', court: 'Porto', category: 'labor', decisions: 38, favorableRate: 0.72, avgTime: 95 }, { name: 'Dr. Ricardo Alves', court: 'Braga', category: 'commercial', decisions: 52, favorableRate: 0.58, avgTime: 110 }, { name: 'Dr. Pedro Martins', court: 'Lisboa', category: 'tax', decisions: 32, favorableRate: 0.65, avgTime: 140 }, { name: 'Dra. Teresa Lopes', court: 'Lisboa', category: 'family', decisions: 28, favorableRate: 0.81, avgTime: 85 }];
            return `<div class="judges-header"><h2>${EliteUtils.getLocaleText('navJudges')}</h2><p>Behavioral analysis based on previous decisions</p></div><div class="judges-grid">${judges.map(j => `<div class="judge-card"><div class="judge-header"><i class="fas fa-gavel"></i><div><h3>${j.name}</h3><p>${j.court} · ${EliteUtils.getCategoryName(j.category)}</p></div></div><div class="judge-stats"><div class="stat"><span class="stat-label">Decisions</span><span class="stat-value">${j.decisions}</span></div><div class="stat"><span class="stat-label">Success Rate</span><span class="stat-value ${j.favorableRate > 0.65 ? 'positive' : 'neutral'}">${EliteUtils.formatPercentage(j.favorableRate * 100)}</span></div><div class="stat"><span class="stat-label">Avg Time</span><span class="stat-value">${j.avgTime} days</span></div></div><div class="judge-insights"><strong>Recommended Strategy:</strong><p>${j.favorableRate > 0.7 ? 'Aggressive strategy. Strong technical arguments are well received.' : j.favorableRate > 0.55 ? 'Balanced strategy. Prepare for robust cross-examination.' : 'Defensive strategy. Consider arbitration or change of venue.'}</p></div></div>`).join('')}</div><div class="chart-container"><h3>Trends by Court</h3><canvas id="courtTrendsChart" height="300"></canvas></div>`;
        },
        
        renderClients: async () => {
            const filteredClients = AppState.clients.filter(c => AppState.userRole === 'SUPER_USER' || c.lawyerId === AppState.userLawyerId);
            return `<div class="clients-header" style="display: flex; justify-content: space-between; margin-bottom: 20px;"><h2>${EliteUtils.getLocaleText('navClients')}</h2><button id="newClientBtn" class="elite-btn primary"><i class="fas fa-user-plus"></i> ${EliteUtils.getLocaleText('newClientTitle')}</button></div><table class="data-table"><thead><tr><th>Client</th><th>VATIN</th><th>Main Area</th><th>Cases</th><th>Total Value (€)</th><th>Actions</th></tr></thead><tbody>${filteredClients.map(c => `<tr><td><strong>${c.name}</strong></td><td>${c.nif}</td><td><span class="case-badge ${c.category}">${EliteUtils.getCategoryName(c.category)}</span></td><td>${c.cases}</td><td>${EliteUtils.formatCurrency(c.totalValue)}</td><td><button class="action-btn view-client" data-id="${c.id}"><i class="fas fa-eye"></i></button><button class="action-btn notes-client" data-client="${c.id}"><i class="fas fa-pen"></i></button></td></tr>`).join('')}</tbody></table>`;
        },
        
        renderReports: () => `<div class="reports-header"><h2>${EliteUtils.getLocaleText('navReports')}</h2><p>Automatically generated documents with in-depth analysis</p></div><div class="reports-grid"><div class="report-card"><i class="fas fa-chart-line"></i><h3>Performance Report</h3><p>Portfolio metrics analysis, success rates and ROI</p><button class="elite-btn small" onclick="ELITE_PROBATUM.generatePerformanceReport()"><i class="fas fa-download"></i> Generate</button></div><div class="report-card"><i class="fas fa-gavel"></i><h3>Judge Analysis</h3><p>Detailed judge profile and court trends</p><button class="elite-btn small" onclick="ELITE_PROBATUM.generateJudgesReport()"><i class="fas fa-download"></i> Generate</button></div><div class="report-card"><i class="fas fa-chart-pie"></i><h3>Financial Forecast</h3><p>Revenue projection and cash flow for 12 months</p><button class="elite-btn small" onclick="ELITE_PROBATUM.generateFinancialForecast()"><i class="fas fa-download"></i> Generate</button></div><div class="report-card"><i class="fas fa-balance-scale"></i><h3>Area Analysis</h3><p>Detailed performance by legal area</p><button class="elite-btn small" onclick="ELITE_PROBATUM.generateCategoryReport()"><i class="fas fa-download"></i> Generate</button></div></div>`,
        
        initCasesTable: () => {
            document.querySelectorAll('.view-case').forEach(btn => btn.addEventListener('click', () => { const caseId = btn.dataset.id; const caseData = AppState.cases.find(c => c.id === caseId); if (caseData) { const modalBody = document.getElementById('caseDetailBody'); if (modalBody) { const heatmapRec = JurisHeatmap.getRecommendation(caseData); const adversaryProfile = AdversaryProfiler.getProfile(caseData.adversary); modalBody.innerHTML = `<div class="detail-row"><span>Case:</span><strong>${caseData.id}</strong></div><div class="detail-row"><span>Client:</span><strong>${caseData.client}</strong></div><div class="detail-row"><span>Area:</span><strong>${caseData.categoryName}</strong></div><div class="detail-row"><span>Value:</span><strong>${EliteUtils.formatCurrency(caseData.value)}</strong></div><div class="detail-row"><span>Success Probability:</span><strong>${EliteUtils.formatPercentage(caseData.successProbability * 100)}</strong></div><div class="detail-row"><span>Judge:</span><strong>${caseData.judge}</strong></div><div class="detail-row"><span>Court:</span><strong>${caseData.court}</strong></div><div class="detail-row"><span>Opposition:</span><strong>${caseData.adversary || 'N/A'}</strong></div><div class="prediction-recommendation"><h4>Venue Recommendation</h4><p>Best court: <strong>${heatmapRec.bestCourt}</strong> (success rate: ${EliteUtils.formatPercentage(heatmapRec.bestRate * 100)})</p></div>${adversaryProfile ? `<div class="prediction-recommendation"><h4>Opposition Profile: ${adversaryProfile.name}</h4><p><strong>Pattern:</strong> ${adversaryProfile.pattern}</p><p><strong>Weakness:</strong> ${adversaryProfile.weakness}</p></div>` : ''}`; } document.getElementById('caseDetailModal').style.display = 'flex'; } }));
            document.querySelectorAll('.analyze-case').forEach(btn => btn.addEventListener('click', async () => { const caseId = btn.dataset.id; const caseData = AppState.cases.find(c => c.id === caseId); if (caseData) { const heatmapRec = JurisHeatmap.getRecommendation(caseData); EliteUtils.showToast(`Case ${caseId} analysis: Success probability ${EliteUtils.formatPercentage(caseData.successProbability * 100)}. Recommendation: ${heatmapRec.bestCourt}`, 'info'); } }));
            document.querySelectorAll('.adversary-alert').forEach(btn => btn.addEventListener('click', () => { const adversary = btn.dataset.adversary; if (adversary && ADVERSARY_PROFILES[adversary]) { const profile = ADVERSARY_PROFILES[adversary]; EliteUtils.showToast(`${adversary} profile: ${profile.pattern}`, 'warning'); } }));
            document.getElementById('newCaseBtn')?.addEventListener('click', () => EliteUtils.showToast('New case feature in development', 'info'));
            document.getElementById('searchCases')?.addEventListener('input', (e) => { const term = e.target.value.toLowerCase(); document.querySelectorAll('#casesTableBody tr').forEach(row => { row.style.display = row.textContent.toLowerCase().includes(term) ? '' : 'none'; }); });
            document.querySelectorAll('.category-btn').forEach(btn => btn.addEventListener('click', () => { document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active')); btn.classList.add('active'); const category = btn.dataset.category; document.querySelectorAll('#casesTableBody tr').forEach(row => { row.style.display = (category === 'all' || row.dataset.category === category) ? '' : 'none'; }); }));
        },
        
        initLitigationModule: () => {
            document.getElementById('runPredictionBtn')?.addEventListener('click', async () => {
                const category = document.getElementById('predictCategory')?.value;
                const value = parseFloat(document.getElementById('predictValue')?.value);
                const userProb = parseFloat(document.getElementById('predictProbability')?.value);
                const court = document.getElementById('predictCourt')?.value;
                const adversary = document.getElementById('predictAdversary')?.value;
                if (!value) { EliteUtils.showToast('Please enter case value', 'warning'); return; }
                EliteUtils.showToast('Processing prediction...', 'info');
                setTimeout(() => {
                    const probability = userProb ? userProb / 100 : 0.65;
                    const courtRate = JurisHeatmap.getCourtSuccessRate(court === 'lisboa' ? 'Lisboa' : court === 'porto' ? 'Porto' : court === 'braga' ? 'Braga' : court === 'coimbra' ? 'Coimbra' : 'Faro', category);
                    const adjustedProb = (probability + courtRate) / 2;
                    const adversaryProfile = adversary ? AdversaryProfiler.getPrediction(adversary, category) : null;
                    const expectedValue = value * (0.4 + adjustedProb * 0.3);
                    const resultDiv = document.getElementById('predictionResult');
                    if (resultDiv) {
                        resultDiv.style.display = 'block';
                        resultDiv.innerHTML = `<div class="prediction-header"><h3>Predictive Analysis Result</h3><div class="probability-gauge"><div class="gauge-value" style="--probability: ${adjustedProb * 100}%"><span>${EliteUtils.formatPercentage(adjustedProb * 100)}</span></div></div></div><div class="prediction-details"><div class="detail-row"><span>Legal Area:</span><strong>${EliteUtils.getCategoryName(category)}</strong></div><div class="detail-row"><span>Adjusted Probability:</span><strong class="${adjustedProb > 0.7 ? 'positive' : adjustedProb > 0.4 ? 'neutral' : 'negative'}">${EliteUtils.formatPercentage(adjustedProb * 100)}</strong></div><div class="detail-row"><span>Court Rate (${court.toUpperCase()}):</span><strong>${EliteUtils.formatPercentage(courtRate * 100)}</strong></div><div class="detail-row"><span>Estimated Value:</span><strong>${EliteUtils.formatCurrency(expectedValue)}</strong></div></div>${adversaryProfile ? `<div class="prediction-recommendation"><h4>Opposition Profile: ${adversary}</h4><p><strong>Pattern:</strong> ${adversaryProfile.pattern}</p><p><strong>Exploitable Weakness:</strong> ${adversaryProfile.weakness}</p></div>` : ''}<div class="prediction-recommendation"><h4>Strategic Recommendation</h4><p>${adjustedProb > 0.7 ? 'Immediate legal action recommended with preliminary injunction request.' : adjustedProb > 0.5 ? 'Balanced strategy: extrajudicial notification with settlement deadline.' : 'Settlement negotiation or arbitration recommended.'}</p></div><div class="prediction-actions"><button class="elite-btn primary" onclick="ELITE_PROBATUM.generatePetition()"><i class="fas fa-file-alt"></i> Generate Draft</button><button class="elite-btn secondary" onclick="ELITE_PROBATUM.simulateDefense()"><i class="fas fa-shield-alt"></i> Simulate Defense</button></div>`;
                    }
                }, 800);
            });
        },
        
        initClientsTable: () => {
            document.getElementById('newClientBtn')?.addEventListener('click', () => document.getElementById('newClientModal').style.display = 'flex');
            document.getElementById('newClientForm')?.addEventListener('submit', (e) => { e.preventDefault(); 
                const newClient = { id: 'CL' + (AppState.clients.length + 101), name: document.getElementById('clientName').value, nif: document.getElementById('clientNif').value, category: document.getElementById('clientCategory').value, cases: 1, totalValue: parseFloat(document.getElementById('clientCaseValue').value), lawyerId: AppState.userLawyerId }; 
                AppState.addClient(newClient);
                EliteUtils.showToast(EliteUtils.getLocaleText('toastClientCreated'), 'success'); 
                document.getElementById('newClientModal').style.display = 'none'; 
                document.getElementById('newClientForm').reset(); 
                Views.render('clients'); 
            });
            document.querySelectorAll('.notes-client').forEach(btn => btn.addEventListener('click', () => { document.getElementById('notesModal').style.display = 'flex'; NotesManager.renderNotes('notesItems'); }));
        }
    };
    
    // =========================================================================
    // INICIALIZAÇÃO
    // =========================================================================
    
    async function init() {
        EliteUtils.log('Initializing ELITE PROBATUM v1.0 Secure Edition...');
        
        // Load data from localStorage
        AppState.loadFromStorage();
        AppState.updateMetrics();
        
        const splash = document.getElementById('splashScreen');
        const enterBtn = document.getElementById('enterPlatformBtn');
        if (splash && enterBtn) {
            setTimeout(() => { enterBtn.style.display = 'inline-flex'; }, 2000);
            enterBtn.addEventListener('click', () => { splash.style.opacity = '0'; setTimeout(() => { splash.style.display = 'none'; AuthManager.showLoginModal(); }, 500); });
        }
        
        document.getElementById('loginBtn')?.addEventListener('click', () => {
            const user = document.getElementById('loginUser').value;
            const pass = document.getElementById('loginPass').value;
            if (AuthManager.login(user, pass)) {
                AuthManager.hideLoginModal();
                document.getElementById('appContainer').style.display = 'flex';
                setTimeout(() => document.getElementById('appContainer').classList.add('visible'), 50);
                document.getElementById('headerActiveCases').textContent = AppState.metrics.activeCases;
                document.getElementById('headerDisputeValue').textContent = EliteUtils.formatCurrency(AppState.metrics.totalDisputeValue);
                document.getElementById('headerSuccessRate').textContent = EliteUtils.formatPercentage(AppState.metrics.successRate);
                document.getElementById('casesBadge').textContent = AppState.cases.filter(c => EliteUtils.hasAccessToCase(c)).length;
                document.getElementById('clientsBadge').textContent = AppState.clients.filter(c => AppState.userRole === 'SUPER_USER' || c.lawyerId === AppState.userLawyerId).length;
                setupNavigation(); setupModals(); setupGlobalEvents(); Views.render('dashboard');
                EliteUtils.showToast(EliteUtils.getLocaleText('toastDataLoaded'), 'info');
            } else { document.getElementById('loginError').style.display = 'block'; }
        });
        
        document.getElementById('langPT')?.addEventListener('click', () => I18nManager.setLocale('PT'));
        document.getElementById('langEN')?.addEventListener('click', () => I18nManager.setLocale('EN'));
        document.getElementById('langToggle')?.addEventListener('click', () => I18nManager.setLocale(currentLocale === 'PT' ? 'EN' : 'PT'));
        document.getElementById('langToggleSidebar')?.addEventListener('click', () => I18nManager.setLocale(currentLocale === 'PT' ? 'EN' : 'PT'));
        
        document.getElementById('yubikeyBtn')?.addEventListener('click', () => {
            const fakeYubiHash = 'a1b2c3d4e5f6';
            EliteUtils.showToast('YubiKey simulation - authentication token generated', 'success');
            AuthManager.login(document.getElementById('loginUser').value, document.getElementById('loginPass').value, fakeYubiHash);
        });
        
        document.getElementById('integrityCheckBtn')?.addEventListener('click', async () => { await IntegrityChecker.renderIntegrityModal(); document.getElementById('integrityModal').style.display = 'flex'; });
        document.getElementById('exportReportBtn')?.addEventListener('click', () => PDFExporter.exportReport());
        document.getElementById('saveNoteBtn')?.addEventListener('click', () => { const content = document.getElementById('strategicNote').value; if (content.trim()) { NotesManager.addNote(content, AppState.currentUser); document.getElementById('strategicNote').value = ''; NotesManager.renderNotes('notesItems'); } });
        
        I18nManager.setLocale('PT');
    }
    
    function setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => { item.addEventListener('click', async (e) => { e.preventDefault(); const view = item.dataset.view; navItems.forEach(nav => nav.classList.remove('active')); item.classList.add('active'); await Views.render(view); if (window.innerWidth <= 1024) document.querySelector('.elite-sidebar')?.classList.remove('open'); }); });
        document.getElementById('mobileMenuToggle')?.addEventListener('click', () => document.querySelector('.elite-sidebar')?.classList.toggle('open'));
    }
    
    function setupModals() {
        document.querySelectorAll('.modal-close, .elite-modal').forEach(el => { if (el.classList.contains('elite-modal')) { el.addEventListener('click', (e) => { if (e.target === el) el.style.display = 'none'; }); } else { el.addEventListener('click', () => el.closest('.elite-modal').style.display = 'none'); } });
        document.getElementById('notificationsBtn')?.addEventListener('click', () => document.getElementById('notificationsModal').style.display = 'flex');
        document.getElementById('settingsBtn')?.addEventListener('click', () => document.getElementById('settingsModal').style.display = 'flex');
        document.getElementById('logoutBtn')?.addEventListener('click', () => { if (confirm('Are you sure you want to logout?')) AuthManager.logout(); });
    }
    
    function setupGlobalEvents() {
        document.addEventListener('keydown', (e) => { if (e.ctrlKey && e.key === 'd') { e.preventDefault(); document.querySelector('.nav-item[data-view="dashboard"]')?.click(); } if (e.ctrlKey && e.key === 'c') { e.preventDefault(); document.querySelector('.nav-item[data-view="cases"]')?.click(); } if (e.ctrlKey && e.key === 'l') { e.preventDefault(); document.querySelector('.nav-item[data-view="litigation"]')?.click(); } if (e.ctrlKey && e.key === 'p') { e.preventDefault(); PDFExporter.exportReport(); } });
    }
    
    function escapeHtml(str) { if (!str) return ''; return str.replace(/[&<>]/g, m => { if (m === '&') return '&amp;'; if (m === '<') return '&lt;'; if (m === '>') return '&gt;'; return m; }); }
    
    window.ELITE_PROBATUM = {
        ...EliteUtils,
        AppState,
        generatePerformanceReport: () => EliteUtils.showToast('Performance report generated', 'success'),
        generateJudgesReport: () => EliteUtils.showToast('Judge analysis generated', 'success'),
        generateFinancialForecast: () => EliteUtils.showToast('Financial forecast generated', 'success'),
        generateCategoryReport: () => EliteUtils.showToast('Area analysis generated', 'success'),
        generatePetition: () => EliteUtils.showToast('Generating petition draft...', 'info'),
        simulateDefense: () => EliteUtils.showToast('Defense simulation in development', 'info')
    };
    
    init();
})();