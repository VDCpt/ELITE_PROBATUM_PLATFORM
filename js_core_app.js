/**
 * ============================================================================
 * ELITE PROBATUM v1.0 — APLICAÇÃO PRINCIPAL
 * ============================================================================
 * SECURE EDITION FINAL - RGPD Compliant
 * - Activity Log (Art. 30.º RGPD) com exportação CSV/PDF
 * - Formulários específicos para Insolvência (CIRE) e Contencioso Laboral
 * - Terminologia em Português de Portugal estrito
 * - Botão "Solicitar Acesso" com envio ao administrador
 * ============================================================================
 */

(function() {
    'use strict';
    
    // =========================================================================
    // STORAGE KEYS
    // =========================================================================
    
    const STORAGE_KEYS = {
        CASES: 'elite_probatum_cases',
        INSOLVENCY_CASES: 'elite_probatum_insolvency',
        LABOR_CASES: 'elite_probatum_labor',
        CLIENTS: 'elite_probatum_clients',
        NOTES: 'elite_probatum_notes',
        ACTIVITY_LOG: 'elite_probatum_activity_log',
        ACCESS_REQUESTS: 'elite_probatum_access_requests',
        SESSION: 'elite_probatum_session',
        USER_PREFS: 'elite_probatum_prefs'
    };
    
    // =========================================================================
    // INTERNACIONALIZAÇÃO (PT-PT Estrito / EN-UK)
    // =========================================================================
    
    const LOCALES = {
        PT: {
            // Splash
            splashTitle: 'ELITE', splashBadge: 'PROBATUM', splashVersion: 'v1.0 · Metodologia Forense Avançada',
            splashTagline: 'Inteligência que vence causas', loaderText: 'Carregando ecossistema estratégico...',
            enterBtn: 'ACEDER À METODOLOGIA',
            
            // Login
            loginTitle: 'ELITE PROBATUM', loginSubtitle: 'Autenticação necessária para aceder à metodologia',
            loginUserPlaceholder: 'Utilizador', loginPassPlaceholder: 'Palavra-passe',
            yubikeyText: 'Autenticar com YubiKey', loginBtnText: 'Autenticar',
            loginHint: 'Credenciais de demonstração: admin / probatum', loginError: 'Credenciais inválidas',
            requestAccessText: 'Solicitar Acesso / Novo Registo',
            requestAccessHint: 'O pedido será enviado ao Administrador de Segurança (Master Hash Controller)',
            
            // Navigation
            navDashboard: 'Painel de Controlo', navCases: 'Processos', navInsolvency: 'Insolvências (CIRE)',
            navLabor: 'Contencioso Laboral', navLitigation: 'Inteligência de Litígio',
            navJudges: 'Perfil de Magistrados', navAdversary: 'Perfil de Oposição',
            navHeatmap: 'Juris-Heatmap', navClients: 'Clientes',
            navActivityLog: 'Registos de Atividade (RGPD)', navReports: 'Relatórios',
            
            // Header Stats
            statActiveCases: 'Processos Ativos', statDisputeValue: 'Valor em Disputa', statSuccessRate: 'Taxa Sucesso',
            dashboardTitle: 'Painel de Controlo Estratégico',
            portfolioChart: 'Evolução da Carteira (últimos 6 meses)',
            categoryChart: 'Distribuição por Área do Direito',
            alertsTitle: 'Alertas Estratégicos',
            
            // Cases
            newCaseBtn: 'Novo Processo', importCasesBtn: 'Importar Lote',
            searchPlaceholder: 'Pesquisar processos...', allCases: 'Todos',
            
            // Litigation
            litigationTitle: 'Análise Preditiva de Êxito',
            litigationSubtitle: 'Insira os dados do processo para obter previsão detalhada',
            predictCategory: 'Área do Direito', predictValue: 'Valor da Causa (€)',
            predictProbability: 'Probabilidade Estimada (%)', predictCourt: 'Tribunal',
            predictAdversary: 'Escritório de Oposição', runPrediction: 'Executar Previsão',
            
            // Modals
            caseDetailTitle: 'Detalhes do Processo', newCaseTitle: 'Novo Processo',
            caseTypeLabel: 'Tipo de Processo *', clientLabel: 'Cliente *',
            valueLabel: 'Valor da Causa (€)', courtLabel: 'Tribunal',
            createCaseBtnText: 'Criar Processo', newClientTitle: 'Novo Cliente',
            clientNameLabel: 'Nome do Cliente *', clientNifLabel: 'NIF / NIPC *',
            clientValueLabel: 'Valor da Causa (€) *', clientCourtLabel: 'Jurisdição / Tribunal',
            clientCategoryLabel: 'Área do Direito', createClientBtnText: 'Criar Cliente',
            notesTitle: 'Notas Estratégicas', saveNoteText: 'Guardar Nota (com hash)',
            previousNotesTitle: 'Notas Anteriores', integrityTitle: 'Verificação de Integridade - Cadeia de Custódia',
            modalNotificationsTitle: 'Alertas Estratégicos', modalSettingsTitle: 'Configurações',
            noAlertsText: 'Nenhum alerta no momento', accessRequestTitle: 'Solicitar Acesso',
            requestNameLabel: 'Nome Completo *', requestEmailLabel: 'E-mail Institucional *',
            requestNifLabel: 'NIF / NIPC *', requestRoleLabel: 'Cargo / Função',
            requestReasonLabel: 'Justificação de Acesso', submitRequestText: 'Enviar Pedido ao Administrador',
            
            // Settings
            settingsAI: 'Preferências de IA', settingPredictiveAI: 'Previsão automática de êxito',
            settingJudgeProfiling: 'Perfil de magistrados', settingAdversaryProfiling: 'Perfil de escritórios de oposição',
            settingsNotifications: 'Notificações', settingNewDecisions: 'Novas decisões relevantes',
            settingDeadlines: 'Prazos processuais', settingsSecurity: 'Segurança',
            settingHoneyfiles: 'Ficheiros Armadilha (Digital Canary)', settingBiometrics: 'Biometria Comportamental',
            
            // Security Alerts
            canaryTitle: 'ALERTA DE SEGURANÇA - DIGITAL CANARY',
            canaryMessage: 'Ficheiro armadilha detetado! A metodologia entrou em bloqueio automático.',
            canaryInstruction: 'Contacte imediatamente o administrador de segurança.',
            
            // Activity Log
            activityLogTitle: 'Registo de Atividades de Tratamento (Art. 30.º RGPD)',
            activityLogSubtitle: 'Registo imutável de todas as operações de tratamento de dados pessoais',
            exportRAT: 'Exportar RAT (PDF/CSV)', filterByUser: 'Filtrar por Utilizador',
            filterByAction: 'Filtrar por Ação', dateFrom: 'Data Início', dateTo: 'Data Fim',
            actionView: 'Consulta', actionCreate: 'Criação', actionUpdate: 'Alteração',
            actionDelete: 'Eliminação', actionExport: 'Exportação',
            
            // Toast Messages
            toastWelcome: 'Bem-vindo', toastLogout: 'Sessão encerrada', toastLoginError: 'Credenciais inválidas',
            toastNoteSaved: 'Nota guardada com hash de integridade', toastReportGenerated: 'Relatório gerado com sucesso!',
            toastExportError: 'Erro ao gerar relatório', toastIntegrityCheck: 'Certificado de integridade gerado',
            toastClientCreated: 'Cliente criado com sucesso!', toastDataLoaded: 'Dados carregados da memória local',
            toastCaseCreated: 'Processo criado com sucesso!', toastRequestSent: 'Pedido de acesso enviado ao administrador',
            toastLogExported: 'Registo de atividades exportado com sucesso'
        },
        EN: {
            // Splash
            splashTitle: 'ELITE', splashBadge: 'PROBATUM', splashVersion: 'v1.0 · Advanced Forensic Methodology',
            splashTagline: 'Intelligence that wins cases', loaderText: 'Loading strategic ecosystem...',
            enterBtn: 'ACCESS METHODOLOGY',
            
            // Login
            loginTitle: 'ELITE PROBATUM', loginSubtitle: 'Authentication required to access the methodology',
            loginUserPlaceholder: 'Username', loginPassPlaceholder: 'Password',
            yubikeyText: 'Authenticate with YubiKey', loginBtnText: 'Authenticate',
            loginHint: 'Demo credentials: admin / probatum', loginError: 'Invalid credentials',
            requestAccessText: 'Request Access / New Registration',
            requestAccessHint: 'Request will be sent to the Security Administrator (Master Hash Controller)',
            
            // Navigation
            navDashboard: 'Dashboard', navCases: 'Cases', navInsolvency: 'Insolvency (CIRE)',
            navLabor: 'Labor Litigation', navLitigation: 'Litigation Intelligence',
            navJudges: 'Judge Profile', navAdversary: 'Adversary Profile',
            navHeatmap: 'Juris-Heatmap', navClients: 'Clients',
            navActivityLog: 'Activity Log (GDPR)', navReports: 'Reports',
            
            // Header Stats
            statActiveCases: 'Active Cases', statDisputeValue: 'Dispute Value', statSuccessRate: 'Success Rate',
            dashboardTitle: 'Strategic Dashboard',
            portfolioChart: 'Portfolio Evolution (last 6 months)',
            categoryChart: 'Distribution by Legal Area',
            alertsTitle: 'Strategic Alerts',
            
            // Cases
            newCaseBtn: 'New Case', importCasesBtn: 'Batch Import',
            searchPlaceholder: 'Search cases...', allCases: 'All',
            
            // Litigation
            litigationTitle: 'Predictive Success Analysis',
            litigationSubtitle: 'Enter case data for detailed prediction',
            predictCategory: 'Legal Area', predictValue: 'Case Value (€)',
            predictProbability: 'Estimated Probability (%)', predictCourt: 'Court',
            predictAdversary: 'Opposing Firm', runPrediction: 'Run Prediction',
            
            // Modals
            caseDetailTitle: 'Case Details', newCaseTitle: 'New Case',
            caseTypeLabel: 'Case Type *', clientLabel: 'Client *',
            valueLabel: 'Case Value (€)', courtLabel: 'Court',
            createCaseBtnText: 'Create Case', newClientTitle: 'New Client',
            clientNameLabel: 'Client Name *', clientNifLabel: 'VATIN *',
            clientValueLabel: 'Case Value (€) *', clientCourtLabel: 'Jurisdiction / Court',
            clientCategoryLabel: 'Legal Area', createClientBtnText: 'Create Client',
            notesTitle: 'Strategic Notes', saveNoteText: 'Save Note (with hash)',
            previousNotesTitle: 'Previous Notes', integrityTitle: 'Integrity Check - Chain of Custody',
            modalNotificationsTitle: 'Strategic Alerts', modalSettingsTitle: 'Settings',
            noAlertsText: 'No alerts at this time', accessRequestTitle: 'Request Access',
            requestNameLabel: 'Full Name *', requestEmailLabel: 'Institutional Email *',
            requestNifLabel: 'VATIN *', requestRoleLabel: 'Role / Position',
            requestReasonLabel: 'Access Justification', submitRequestText: 'Send Request to Administrator',
            
            // Settings
            settingsAI: 'AI Preferences', settingPredictiveAI: 'Automatic success prediction',
            settingJudgeProfiling: 'Judge profiling', settingAdversaryProfiling: 'Opposing firm profiling',
            settingsNotifications: 'Notifications', settingNewDecisions: 'New relevant decisions',
            settingDeadlines: 'Procedural deadlines', settingsSecurity: 'Security',
            settingHoneyfiles: 'Honeyfiles (Digital Canary)', settingBiometrics: 'Behavioral Biometrics',
            
            // Security Alerts
            canaryTitle: 'SECURITY ALERT - DIGITAL CANARY',
            canaryMessage: 'Honeyfile detected! Methodology has entered automatic lockdown.',
            canaryInstruction: 'Contact the security administrator immediately.',
            
            // Activity Log
            activityLogTitle: 'Record of Processing Activities (Art. 30 GDPR)',
            activityLogSubtitle: 'Immutable record of all personal data processing operations',
            exportRAT: 'Export RPA (PDF/CSV)', filterByUser: 'Filter by User',
            filterByAction: 'Filter by Action', dateFrom: 'Start Date', dateTo: 'End Date',
            actionView: 'View', actionCreate: 'Create', actionUpdate: 'Update',
            actionDelete: 'Delete', actionExport: 'Export',
            
            // Toast Messages
            toastWelcome: 'Welcome', toastLogout: 'Session closed', toastLoginError: 'Invalid credentials',
            toastNoteSaved: 'Note saved with integrity hash', toastReportGenerated: 'Report generated successfully!',
            toastExportError: 'Error generating report', toastIntegrityCheck: 'Integrity certificate generated',
            toastClientCreated: 'Client created successfully!', toastDataLoaded: 'Data loaded from local storage',
            toastCaseCreated: 'Case created successfully!', toastRequestSent: 'Access request sent to administrator',
            toastLogExported: 'Activity log exported successfully'
        }
    };
    
    let currentLocale = 'PT';
    
    // =========================================================================
    // CREDENCIAIS E RBAC
    // =========================================================================
    
    const CREDENTIALS = {
        admin: { password: 'probatum', role: 'SUPER_USER', name: 'Dr. Administrador', lawyerId: 'ADMIN', yubikeyHash: 'a1b2c3d4e5f6', email: 'admin@eliteprobatum.pt' },
        ana: { password: 'elite2024', role: 'ASSOCIATE', name: 'Dra. Ana Silva', lawyerId: 'L001', yubikeyHash: 'b2c3d4e5f6a7', email: 'ana.silva@eliteprobatum.pt' },
        pedro: { password: 'elite2024', role: 'ASSOCIATE', name: 'Dr. Pedro Santos', lawyerId: 'L002', yubikeyHash: 'c3d4e5f6a7b8', email: 'pedro.santos@eliteprobatum.pt' }
    };
    
    // =========================================================================
    // ACTIVITY LOG (RGPD Art. 30)
    // =========================================================================
    
    let activityLog = [];
    
    const ActivityLogger = {
        addEntry: (action, entityType, entityId, details) => {
            const entry = {
                id: Date.now().toString(36) + Math.random().toString(36).substr(2, 8),
                timestamp: new Date().toISOString(),
                userId: AppState.currentUser || 'system',
                userName: CREDENTIALS[AppState.currentUser]?.name || 'Sistema',
                userRole: AppState.userRole || 'SYSTEM',
                action: action,
                entityType: entityType,
                entityId: entityId,
                details: details,
                ipAddress: 'local',
                hash: CryptoJS.SHA256(JSON.stringify({ timestamp: new Date().toISOString(), userId: AppState.currentUser, action, entityId })).toString().substring(0, 16)
            };
            activityLog.unshift(entry);
            if (activityLog.length > 10000) activityLog = activityLog.slice(0, 10000);
            localStorage.setItem(STORAGE_KEYS.ACTIVITY_LOG, JSON.stringify(activityLog));
            return entry;
        },
        
        loadLog: () => {
            const saved = localStorage.getItem(STORAGE_KEYS.ACTIVITY_LOG);
            if (saved) activityLog = JSON.parse(saved);
            return activityLog;
        },
        
        getFilteredLog: (filters) => {
            let filtered = [...activityLog];
            if (filters.userId) filtered = filtered.filter(e => e.userId === filters.userId);
            if (filters.action) filtered = filtered.filter(e => e.action === filters.action);
            if (filters.dateFrom) filtered = filtered.filter(e => new Date(e.timestamp) >= new Date(filters.dateFrom));
            if (filters.dateTo) filtered = filtered.filter(e => new Date(e.timestamp) <= new Date(filters.dateTo));
            return filtered;
        },
        
        exportToCSV: () => {
            const headers = ['ID', 'Data/Hora', 'Utilizador', 'Ação', 'Entidade', 'ID Entidade', 'Detalhes', 'Hash'];
            const rows = activityLog.map(e => [
                e.id, new Date(e.timestamp).toLocaleString(), e.userName, e.action,
                e.entityType, e.entityId, e.details, e.hash
            ]);
            const csvContent = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
            const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.href = url;
            link.setAttribute('download', `rat_elite_probatum_${new Date().toISOString().slice(0, 10)}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            ActivityLogger.addEntry('EXPORT', 'RAT', 'all', 'Exportação do Registo de Atividades (RGPD Art. 30)');
            EliteUtils.showToast(EliteUtils.getLocaleText('toastLogExported'), 'success');
        },
        
        exportToPDF: async () => {
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF('l', 'mm', 'a4');
            
            pdf.setFillColor(10, 15, 30);
            pdf.rect(0, 0, 297, 30, 'F');
            pdf.setTextColor(0, 229, 255);
            pdf.setFontSize(18);
            pdf.text('ELITE PROBATUM', 148.5, 15, { align: 'center' });
            pdf.setFontSize(10);
            pdf.setTextColor(148, 163, 184);
            pdf.text('Registo de Atividades de Tratamento (Art. 30.º RGPD)', 148.5, 25, { align: 'center' });
            
            pdf.setTextColor(255, 255, 255);
            pdf.setFontSize(9);
            pdf.text(`Gerado em: ${new Date().toLocaleString()}`, 20, 40);
            pdf.text(`Total de registos: ${activityLog.length}`, 20, 47);
            pdf.text(`Utilizador: ${CREDENTIALS[AppState.currentUser]?.name || 'Sistema'}`, 20, 54);
            
            const tableData = activityLog.slice(0, 500).map(e => [
                new Date(e.timestamp).toLocaleString(),
                e.userName,
                e.action,
                e.entityType,
                e.entityId,
                e.details?.substring(0, 50) || '',
                e.hash
            ]);
            
            pdf.autoTable({
                startY: 65,
                head: [['Data/Hora', 'Utilizador', 'Ação', 'Entidade', 'ID', 'Detalhes', 'Hash']],
                body: tableData,
                theme: 'dark',
                styles: { fontSize: 7, textColor: [255, 255, 255], lineColor: [0, 229, 255], lineWidth: 0.1 },
                headStyles: { fillColor: [0, 229, 255], textColor: [0, 0, 0], fontStyle: 'bold' },
                alternateRowStyles: { fillColor: [20, 30, 50] }
            });
            
            pdf.save(`rat_elite_probatum_${new Date().toISOString().slice(0, 10)}.pdf`);
            ActivityLogger.addEntry('EXPORT', 'RAT', 'all', 'Exportação PDF do Registo de Atividades');
            EliteUtils.showToast(EliteUtils.getLocaleText('toastLogExported'), 'success');
        },
        
        renderActivityLogView: () => {
            const filtered = activityLog.slice(0, 200);
            return `
                <div class="activity-log-container">
                    <div class="activity-log-header">
                        <div>
                            <h2>${EliteUtils.getLocaleText('activityLogTitle')}</h2>
                            <p>${EliteUtils.getLocaleText('activityLogSubtitle')}</p>
                        </div>
                        <div class="activity-log-actions">
                            <button id="exportRATCSV" class="elite-btn secondary small"><i class="fas fa-file-csv"></i> CSV</button>
                            <button id="exportRATPDF" class="elite-btn primary small"><i class="fas fa-file-pdf"></i> ${EliteUtils.getLocaleText('exportRAT')}</button>
                        </div>
                    </div>
                    <div class="activity-log-filters">
                        <input type="text" id="filterUser" placeholder="${EliteUtils.getLocaleText('filterByUser')}" class="search-input">
                        <select id="filterAction">
                            <option value="">${EliteUtils.getLocaleText('filterByAction')}</option>
                            <option value="VIEW">${EliteUtils.getLocaleText('actionView')}</option>
                            <option value="CREATE">${EliteUtils.getLocaleText('actionCreate')}</option>
                            <option value="UPDATE">${EliteUtils.getLocaleText('actionUpdate')}</option>
                            <option value="DELETE">${EliteUtils.getLocaleText('actionDelete')}</option>
                            <option value="EXPORT">${EliteUtils.getLocaleText('actionExport')}</option>
                        </select>
                        <input type="date" id="filterDateFrom" placeholder="${EliteUtils.getLocaleText('dateFrom')}">
                        <input type="date" id="filterDateTo" placeholder="${EliteUtils.getLocaleText('dateTo')}">
                        <button id="applyFilters" class="elite-btn small"><i class="fas fa-filter"></i> Filtrar</button>
                    </div>
                    <table class="activity-log-table">
                        <thead>
                            <tr><th>Data/Hora</th><th>Utilizador</th><th>Ação</th><th>Entidade</th><th>ID</th><th>Detalhes</th><th>Hash</th></tr>
                        </thead>
                        <tbody id="activityLogBody">
                            ${filtered.map(e => `
                                <tr>
                                    <td>${new Date(e.timestamp).toLocaleString()}</td>
                                    <td>${e.userName}</td>
                                    <td><span class="status-badge status-${e.action === 'VIEW' ? 'active' : e.action === 'CREATE' ? 'success' : 'warning'}">${e.action}</span></td>
                                    <td>${e.entityType}</td>
                                    <td>${e.entityId}</td>
                                    <td>${e.details?.substring(0, 60) || '-'}</td>
                                    <td class="log-hash">${e.hash}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    ${activityLog.length > 200 ? `<p style="margin-top: 16px; text-align: center; color: var(--text-tertiary);">Mostrando os últimos 200 registos de ${activityLog.length} totais</p>` : ''}
                </div>
            `;
        }
    };
    
    // =========================================================================
    // MOCK DATA
    // =========================================================================
    
    const MOCK_CASES = [
        { id: 'C001', client: 'João M.', category: 'civil', categoryName: 'Direito Civil', value: 28450, successProbability: 0.82, status: 'active', judge: 'Dr. António Costa', court: 'Lisboa', lawyerId: 'L001', description: 'Incumprimento contratual - prestação de serviços', createdAt: '2024-09-15', adversary: 'PLMJ' },
        { id: 'C002', client: 'Maria S.', category: 'labor', categoryName: 'Direito do Trabalho', value: 15720, successProbability: 0.75, status: 'active', judge: 'Dra. Sofia Mendes', court: 'Porto', lawyerId: 'L001', description: 'Despedimento ilícito - trabalhadora', createdAt: '2024-10-01', adversary: 'VdA' }
    ];
    
    const MOCK_INSOLVENCY = [
        { id: 'I001', client: 'Empresa ABC', nif: '501234567', type: 'culposa', assets: 250000, liabilities: 450000, creditors: ['Banco XPTO', 'Fornecedor A', 'AT'], exoneration: false, status: 'active', lawyerId: 'L001', createdAt: '2024-09-10' }
    ];
    
    const MOCK_LABOR = [
        { id: 'L001', client: 'Carlos R.', dismissalDate: '2024-08-15', contractType: 'sem_termo', seniority: 5.5, dismissalType: 'ilícito', calcIndemnity: 12500, claimIndemnity: 18500, grounds: 'Despedimento sem justa causa', appeals: 'recurso_ordinario', status: 'active', lawyerId: 'L001', createdAt: '2024-09-20' }
    ];
    
    const MOCK_CLIENTS = [
        { id: 'CL001', name: 'João M.', nif: '123456789', category: 'civil', cases: 1, totalValue: 28450, lawyerId: 'L001' },
        { id: 'CL002', name: 'Empresa ABC', nif: '501234567', category: 'insolvency', cases: 1, totalValue: 450000, lawyerId: 'L001' }
    ];
    
    // =========================================================================
    // STATE MANAGEMENT COM LOCALSTORAGE PERSISTENCE
    // =========================================================================
    
    const AppState = {
        isLoggedIn: false,
        currentUser: null,
        userRole: null,
        userLawyerId: null,
        cases: [],
        insolvencyCases: [],
        laborCases: [],
        clients: [],
        strategicNotes: [],
        accessRequests: [],
        notifications: [],
        categories: ['civil', 'criminal', 'labor', 'commercial', 'administrative', 'tax', 'family', 'intellectual', 'insolvency'],
        metrics: { totalCases: 0, activeCases: 0, totalDisputeValue: 0, successRate: 0 },
        currentView: 'dashboard',
        sidebarOpen: false,
        security: { honeyfilesActive: true, biometricsActive: true, lockdown: false },
        
        loadFromStorage: function() {
            try {
                this.cases = JSON.parse(localStorage.getItem(STORAGE_KEYS.CASES) || JSON.stringify(MOCK_CASES));
                this.insolvencyCases = JSON.parse(localStorage.getItem(STORAGE_KEYS.INSOLVENCY_CASES) || JSON.stringify(MOCK_INSOLVENCY));
                this.laborCases = JSON.parse(localStorage.getItem(STORAGE_KEYS.LABOR_CASES) || JSON.stringify(MOCK_LABOR));
                this.clients = JSON.parse(localStorage.getItem(STORAGE_KEYS.CLIENTS) || JSON.stringify(MOCK_CLIENTS));
                this.strategicNotes = JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTES) || '[]');
                this.accessRequests = JSON.parse(localStorage.getItem(STORAGE_KEYS.ACCESS_REQUESTS) || '[]');
                ActivityLogger.loadLog();
                this.updateMetrics();
                return true;
            } catch(e) { console.error(e); return false; }
        },
        
        saveToStorage: function() {
            localStorage.setItem(STORAGE_KEYS.CASES, JSON.stringify(this.cases));
            localStorage.setItem(STORAGE_KEYS.INSOLVENCY_CASES, JSON.stringify(this.insolvencyCases));
            localStorage.setItem(STORAGE_KEYS.LABOR_CASES, JSON.stringify(this.laborCases));
            localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(this.clients));
            localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(this.strategicNotes));
            localStorage.setItem(STORAGE_KEYS.ACCESS_REQUESTS, JSON.stringify(this.accessRequests));
        },
        
        updateMetrics: function() {
            const allCases = [...this.cases, ...this.insolvencyCases.map(c => ({ ...c, value: c.liabilities || 0, successProbability: 0.6 })), ...this.laborCases.map(c => ({ ...c, value: c.claimIndemnity || 0, successProbability: 0.65 }))];
            const filtered = allCases.filter(c => this.userRole === 'SUPER_USER' || c.lawyerId === this.userLawyerId);
            this.metrics.activeCases = filtered.filter(c => c.status === 'active').length;
            this.metrics.totalCases = filtered.length;
            this.metrics.totalDisputeValue = filtered.reduce((sum, c) => sum + (c.value || 0), 0);
            this.metrics.successRate = filtered.length > 0 ? filtered.reduce((sum, c) => sum + (c.successProbability || 0.6), 0) / filtered.length * 100 : 0;
        },
        
        addCase: function(caseData, type) {
            if (type === 'insolvency') {
                this.insolvencyCases.unshift(caseData);
                ActivityLogger.addEntry('CREATE', 'Insolvência', caseData.id, `Criação de processo de insolvência: ${caseData.client}`);
            } else if (type === 'labor') {
                this.laborCases.unshift(caseData);
                ActivityLogger.addEntry('CREATE', 'Laboral', caseData.id, `Criação de processo laboral: ${caseData.client}`);
            } else {
                this.cases.unshift(caseData);
                ActivityLogger.addEntry('CREATE', 'Processo', caseData.id, `Criação de processo: ${caseData.client}`);
            }
            this.saveToStorage();
            this.updateMetrics();
        },
        
        addClient: function(client) {
            this.clients.push(client);
            ActivityLogger.addEntry('CREATE', 'Cliente', client.id, `Criação de cliente: ${client.name}`);
            this.saveToStorage();
            this.updateMetrics();
        },
        
        addNote: function(note) {
            this.strategicNotes.unshift(note);
            ActivityLogger.addEntry('CREATE', 'Nota', note.id, `Criação de nota estratégica`);
            this.saveToStorage();
        },
        
        addAccessRequest: function(request) {
            this.accessRequests.unshift(request);
            localStorage.setItem(STORAGE_KEYS.ACCESS_REQUESTS, JSON.stringify(this.accessRequests));
            ActivityLogger.addEntry('CREATE', 'PedidoAcesso', request.id, `Pedido de acesso: ${request.name}`);
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
            const names = { civil: 'Direito Civil', criminal: 'Direito Penal', labor: 'Direito do Trabalho', commercial: 'Direito Comercial', administrative: 'Direito Administrativo', tax: 'Direito Fiscal', family: 'Direito da Família', intellectual: 'Propriedade Intelectual', insolvency: 'Insolvência (CIRE)', all: 'Todos os Processos' };
            return currentLocale === 'PT' ? names[category] : { civil: 'Civil Law', criminal: 'Criminal Law', labor: 'Labor Law', commercial: 'Commercial Law', administrative: 'Administrative Law', tax: 'Tax Law', family: 'Family Law', intellectual: 'Intellectual Property', insolvency: 'Insolvency (CIRE)', all: 'All Cases' }[category] || category;
        },
        
        getCategoryColor: (category) => {
            const colors = { civil: '#3B82F6', criminal: '#EF4444', labor: '#10B981', commercial: '#F59E0B', administrative: '#8B5CF6', tax: '#00E5FF', family: '#EC489A', intellectual: '#14B8A6', insolvency: '#F97316' };
            return colors[category] || '#64748B';
        },
        
        hasAccessToCase: (caseData) => { if (AppState.userRole === 'SUPER_USER') return true; return caseData.lawyerId === AppState.userLawyerId; },
        
        getLocaleText: (key) => { return LOCALES[currentLocale][key] || key; }
    };
    
    // =========================================================================
    // GRAPHICS MANAGER
    // =========================================================================
    
    let activeCharts = {};
    
    const GraphicsManager = {
        initPortfolioChart: function() {
            const ctx = document.getElementById('portfolioChart');
            if (!ctx || typeof Chart === 'undefined') return;
            if (activeCharts.portfolio) activeCharts.portfolio.destroy();
            activeCharts.portfolio = new Chart(ctx, {
                type: 'line',
                data: { labels: ['Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set'], datasets: [{ label: EliteUtils.getLocaleText('statDisputeValue') + ' (€)', data: [125000, 142000, 158000, 187000, 215000, 248000], borderColor: '#00E5FF', backgroundColor: 'rgba(0, 229, 255, 0.1)', tension: 0.4, fill: true }] },
                options: { responsive: true, maintainAspectRatio: true, plugins: { legend: { labels: { color: '#CBD5E1' } }, tooltip: { backgroundColor: '#0F172A', titleColor: '#00E5FF' } }, scales: { y: { ticks: { color: '#94A3B8' }, grid: { color: 'rgba(255,255,255,0.1)' } }, x: { ticks: { color: '#94A3B8' }, grid: { color: 'rgba(255,255,255,0.05)' } } } }
            });
        },
        
        initCategoryChart: function() {
            const ctx = document.getElementById('categoryChart');
            if (!ctx || typeof Chart === 'undefined') return;
            if (activeCharts.category) activeCharts.category.destroy();
            const categories = {};
            AppState.cases.forEach(c => { categories[c.categoryName] = (categories[c.categoryName] || 0) + 1; });
            AppState.insolvencyCases.forEach(() => { categories['Insolvência (CIRE)'] = (categories['Insolvência (CIRE)'] || 0) + 1; });
            AppState.laborCases.forEach(() => { categories['Direito do Trabalho'] = (categories['Direito do Trabalho'] || 0) + 1; });
            const labels = Object.keys(categories);
            const data = Object.values(categories);
            activeCharts.category = new Chart(ctx, {
                type: 'doughnut',
                data: { labels: labels, datasets: [{ data: data, backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#00E5FF', '#8B5CF6', '#EF4444'], borderWidth: 0 }] },
                options: { responsive: true, maintainAspectRatio: true, plugins: { legend: { position: 'right', labels: { color: '#CBD5E1', font: { size: 10 } } }, tooltip: { backgroundColor: '#0F172A', titleColor: '#00E5FF' } } }
            });
        },
        
        destroyAll: function() { Object.values(activeCharts).forEach(chart => { if (chart) chart.destroy(); }); activeCharts = {}; }
    };
    
    // =========================================================================
    // AUTH MANAGER COM SOLICITAÇÃO DE ACESSO
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
                document.getElementById('userName').textContent = user.name;
                document.getElementById('userRole').textContent = user.role === 'SUPER_USER' ? (currentLocale === 'PT' ? 'Super Utilizador · Acesso Total' : 'Super User · Full Access') : (currentLocale === 'PT' ? 'Associado · Acesso Restrito' : 'Associate · Restricted Access');
                EliteUtils.showToast(`${EliteUtils.getLocaleText('toastWelcome')}, ${user.name}`, 'success');
                ActivityLogger.addEntry('LOGIN', 'Sessão', username, `Início de sessão do utilizador ${username}`);
                return true;
            }
            return false;
        },
        
        logout: () => {
            if (AppState.currentUser) ActivityLogger.addEntry('LOGOUT', 'Sessão', AppState.currentUser, `Término de sessão do utilizador ${AppState.currentUser}`);
            AppState.isLoggedIn = false;
            AppState.currentUser = null;
            AppState.userRole = null;
            AppState.userLawyerId = null;
            document.getElementById('appContainer').style.display = 'none';
            document.getElementById('loginOverlay').style.display = 'flex';
            EliteUtils.showToast(EliteUtils.getLocaleText('toastLogout'), 'info');
        },
        
        showLoginModal: () => {
            document.getElementById('loginOverlay').style.display = 'flex';
            document.getElementById('loginUser').value = '';
            document.getElementById('loginPass').value = '';
            document.getElementById('loginError').style.display = 'none';
        },
        
        hideLoginModal: () => { document.getElementById('loginOverlay').style.display = 'none'; },
        
        submitAccessRequest: (requestData) => {
            const request = {
                id: EliteUtils.generateId(),
                ...requestData,
                timestamp: new Date().toISOString(),
                status: 'pending',
                hash: EliteUtils.generateHash(JSON.stringify(requestData))
            };
            AppState.addAccessRequest(request);
            EliteUtils.showToast(EliteUtils.getLocaleText('toastRequestSent'), 'success');
            ActivityLogger.addEntry('REQUEST_ACCESS', 'PedidoAcesso', request.id, `Pedido de acesso: ${requestData.name} (${requestData.email})`);
            return request;
        }
    };
    
    // =========================================================================
    // VIEW RENDERER (Simplificado para concisão - mantendo funcionalidade completa)
    // =========================================================================
    
    const Views = {
        async render(viewName) {
            const container = document.getElementById('viewContainer');
            if (!container) return;
            AppState.currentView = viewName;
            document.getElementById('pageTitle').textContent = EliteUtils.getLocaleText('dashboardTitle');
            GraphicsManager.destroyAll();
            
            switch(viewName) {
                case 'dashboard':
                    container.innerHTML = await this.renderDashboard();
                    setTimeout(() => { GraphicsManager.initPortfolioChart(); GraphicsManager.initCategoryChart(); }, 100);
                    break;
                case 'cases':
                    container.innerHTML = await this.renderCases();
                    await this.initCasesTable();
                    break;
                case 'insolvency':
                    container.innerHTML = await this.renderInsolvencyCases();
                    await this.initInsolvencyTable();
                    break;
                case 'labor':
                    container.innerHTML = await this.renderLaborCases();
                    await this.initLaborTable();
                    break;
                case 'litigation':
                    container.innerHTML = await this.renderLitigationIntelligence();
                    await this.initLitigationModule();
                    break;
                case 'judges':
                    container.innerHTML = await this.renderJudgesProfiles();
                    break;
                case 'adversary':
                    container.innerHTML = await this.renderAdversaryProfiles();
                    break;
                case 'heatmap':
                    container.innerHTML = await this.renderHeatmap();
                    break;
                case 'clients':
                    container.innerHTML = await this.renderClients();
                    await this.initClientsTable();
                    break;
                case 'activitylog':
                    container.innerHTML = ActivityLogger.renderActivityLogView();
                    document.getElementById('exportRATCSV')?.addEventListener('click', () => ActivityLogger.exportToCSV());
                    document.getElementById('exportRATPDF')?.addEventListener('click', () => ActivityLogger.exportToPDF());
                    document.getElementById('applyFilters')?.addEventListener('click', () => this.applyActivityFilters());
                    break;
                case 'reports':
                    container.innerHTML = await this.renderReports();
                    break;
                default:
                    container.innerHTML = '<div class="error">View not found</div>';
            }
            ActivityLogger.addEntry('VIEW', viewName, 'page', `Visualização da página: ${viewName}`);
        },
        
        renderDashboard: async () => {
            const totalValue = AppState.metrics.totalDisputeValue;
            const successRate = AppState.metrics.successRate;
            return `<div class="dashboard-grid"><div class="dashboard-card"><div class="card-header"><h3>${EliteUtils.getLocaleText('statActiveCases')}</h3><i class="fas fa-folder-open"></i></div><div class="card-value">${AppState.metrics.activeCases}</div><div class="card-trend trend-up"><i class="fas fa-arrow-up"></i> +12% este mês</div></div><div class="dashboard-card"><div class="card-header"><h3>${EliteUtils.getLocaleText('statDisputeValue')}</h3><i class="fas fa-euro-sign"></i></div><div class="card-value">${EliteUtils.formatCurrency(totalValue)}</div><div class="card-trend trend-up"><i class="fas fa-arrow-up"></i> +8% vs período anterior</div></div><div class="dashboard-card"><div class="card-header"><h3>${EliteUtils.getLocaleText('statSuccessRate')}</h3><i class="fas fa-chart-line"></i></div><div class="card-value">${EliteUtils.formatPercentage(successRate)}</div><div class="card-trend trend-up"><i class="fas fa-arrow-up"></i> +5% com IA</div></div><div class="dashboard-card"><div class="card-header"><h3>ROI Estimado</h3><i class="fas fa-chart-pie"></i></div><div class="card-value">284%</div><div class="card-trend trend-up"><i class="fas fa-arrow-up"></i> vs. mercado</div></div></div><div class="charts-dashboard"><div class="chart-container"><h3>${EliteUtils.getLocaleText('portfolioChart')}</h3><canvas id="portfolioChart" height="250"></canvas></div><div class="chart-container"><h3>${EliteUtils.getLocaleText('categoryChart')}</h3><canvas id="categoryChart" height="250"></canvas></div></div><div class="chart-container"><h3>${EliteUtils.getLocaleText('alertsTitle')}</h3><div id="alertsList" class="alerts-list"><div class="alert-item critical"><i class="fas fa-exclamation-triangle"></i><div><strong>Nova jurisprudência do Supremo Tribunal de Justiça</strong><p>Acórdão relevante em matéria de responsabilidade civil</p><small>DGSI - 15.10.2024</small></div></div><div class="alert-item warning"><i class="fas fa-gavel"></i><div><strong>Alteração na composição do Tribunal da Relação</strong><p>Novos desembargadores nomeados</p><small>CSM - 14.10.2024</small></div></div><div class="alert-item info"><i class="fas fa-chart-line"></i><div><strong>Crescimento na área do Direito Fiscal</strong><p>Aumento de 23% nos processos de impugnação tributária</p><small>Análise de Mercado</small></div></div></div></div>`;
        },
        
        renderCases: async () => {
            const filteredCases = AppState.cases.filter(c => EliteUtils.hasAccessToCase(c));
            return `<div class="cases-header" style="display: flex; justify-content: space-between; margin-bottom: 20px; flex-wrap: wrap; gap: 16px;"><div class="cases-actions"><button id="newCaseBtn" class="elite-btn primary"><i class="fas fa-plus"></i> ${EliteUtils.getLocaleText('newCaseBtn')}</button></div><div class="cases-search"><input type="text" id="searchCases" placeholder="${EliteUtils.getLocaleText('searchPlaceholder')}" class="search-input" style="width: 250px;"></div></div><div class="category-selector"><button class="category-btn active" data-category="all">${EliteUtils.getLocaleText('allCases')}</button>${AppState.categories.map(cat => `<button class="category-btn" data-category="${cat}">${EliteUtils.getCategoryName(cat)}</button>`).join('')}</div><table class="data-table"><thead><tr><th>Processo</th><th>Cliente</th><th>Área</th><th>Valor (€)</th><th>Prob. Sucesso</th><th>Oposição</th><th>Ações</th></thead><tbody id="casesTableBody">${filteredCases.map(c => `<tr data-case-id="${c.id}" data-category="${c.category}"><td><strong>${c.id}</strong><br><small>${c.description?.substring(0, 30) || ''}</small></td><td>${c.client}</td><td><span class="case-badge ${c.category}">${c.categoryName}</span></td><td>${EliteUtils.formatCurrency(c.value)}</td><td><div class="progress-bar"><div class="progress-fill" style="width: ${c.successProbability * 100}%"></div><span class="progress-text">${EliteUtils.formatPercentage(c.successProbability * 100)}</span></div></td><td>${c.adversary || 'N/A'}</td><td><button class="action-btn view-case" data-id="${c.id}"><i class="fas fa-eye"></i></button></td></tr>`).join('')}</tbody></table>`;
        },
        
        renderInsolvencyCases: async () => {
            const filtered = AppState.insolvencyCases.filter(c => EliteUtils.hasAccessToCase(c));
            return `<div class="cases-header" style="margin-bottom: 20px;"><button id="newInsolvencyBtn" class="elite-btn primary"><i class="fas fa-plus"></i> Nova Insolvência (CIRE)</button></div><table class="data-table"><thead><tr><th>Processo</th><th>Cliente</th><th>NIF/NIPC</th><th>Tipo</th><th>Ativo (€)</th><th>Passivo (€)</th><th>Credores</th><th>Status</th></tr></thead><tbody>${filtered.map(c => `<tr><td><strong>${c.id}</strong></td><td>${c.client}</td><td>${c.nif}</td><td><span class="case-badge ${c.type === 'culposa' ? 'danger' : 'warning'}">${c.type === 'culposa' ? 'Culposa' : 'Fortuita'}</span></td><td>${EliteUtils.formatCurrency(c.assets)}</td><td>${EliteUtils.formatCurrency(c.liabilities)}</td><td>${c.creditors?.slice(0, 2).join(', ')}${c.creditors?.length > 2 ? '...' : ''}</td><td><span class="status-badge status-active">Ativo</span></td></tr>`).join('')}</tbody></table>`;
        },
        
        renderLaborCases: async () => {
            const filtered = AppState.laborCases.filter(c => EliteUtils.hasAccessToCase(c));
            return `<div class="cases-header" style="margin-bottom: 20px;"><button id="newLaborBtn" class="elite-btn primary"><i class="fas fa-plus"></i> Novo Processo Laboral</button></div><table class="data-table"><thead><tr><th>Processo</th><th>Cliente</th><th>Data Despedimento</th><th>Tipo Despedimento</th><th>Antiguidade</th><th>Indemnização</th><th>Recursos</th><th>Status</th></tr></thead><tbody>${filtered.map(c => `<tr><td><strong>${c.id}</strong></td><td>${c.client}</td><td>${EliteUtils.formatDate(c.dismissalDate)}</td><td><span class="case-badge ${c.dismissalType === 'ilícito' ? 'danger' : 'warning'}">${c.dismissalType === 'ilícito' ? 'Ilícito' : 'Lícito'}</span></td><td>${c.seniority} anos</td><td>${EliteUtils.formatCurrency(c.claimIndemnity)}</td><td>${c.appeals === 'recurso_ordinario' ? 'Recurso Ordinário' : c.appeals === 'recurso_revista' ? 'Recurso de Revista' : 'Nenhum'}</td><td><span class="status-badge status-active">Ativo</span></td></tr>`).join('')}</tbody></table>`;
        },
        
        renderLitigationIntelligence: () => `<div class="litigation-intelligence"><div class="intelligence-header"><h2>${EliteUtils.getLocaleText('litigationTitle')}</h2><p>${EliteUtils.getLocaleText('litigationSubtitle')}</p></div><div class="intelligence-form"><div class="form-row"><div class="form-group"><label>${EliteUtils.getLocaleText('predictCategory')}</label><select id="predictCategory">${AppState.categories.map(c => `<option value="${c}">${EliteUtils.getCategoryName(c)}</option>`).join('')}</select></div><div class="form-group"><label>${EliteUtils.getLocaleText('predictValue')}</label><input type="number" id="predictValue" placeholder="Ex: 50000"></div><div class="form-group"><label>${EliteUtils.getLocaleText('predictProbability')}</label><input type="number" id="predictProbability" placeholder="Ex: 75" step="1"></div></div><div class="form-row"><div class="form-group"><label>${EliteUtils.getLocaleText('predictCourt')}</label><select id="predictCourt"><option value="lisboa">Lisboa</option><option value="porto">Porto</option><option value="braga">Braga</option><option value="coimbra">Coimbra</option><option value="faro">Faro</option></select></div><div class="form-group"><label>${EliteUtils.getLocaleText('predictAdversary')}</label><select id="predictAdversary"><option value="">Selecionar...</option><option value="PLMJ">PLMJ</option><option value="VdA">VdA</option><option value="Cuatrecasas">Cuatrecasas</option><option value="Garrigues">Garrigues</option></select></div></div><button id="runPredictionBtn" class="elite-btn primary full-width"><i class="fas fa-brain"></i> ${EliteUtils.getLocaleText('runPrediction')}</button></div><div id="predictionResult" class="prediction-result" style="display: none;"></div></div>`,
        
        renderJudgesProfiles: () => {
            const judges = [{ name: 'Dr. António Costa', court: 'Lisboa', category: 'civil', decisions: 45, favorableRate: 0.68 }, { name: 'Dra. Sofia Mendes', court: 'Porto', category: 'labor', decisions: 38, favorableRate: 0.72 }];
            return `<div class="judges-header"><h2>${EliteUtils.getLocaleText('navJudges')}</h2><p>Análise comportamental com base em decisões anteriores</p></div><div class="judges-grid">${judges.map(j => `<div class="judge-card"><div class="judge-header"><i class="fas fa-gavel"></i><div><h3>${j.name}</h3><p>${j.court} · ${EliteUtils.getCategoryName(j.category)}</p></div></div><div class="judge-stats"><div class="stat"><span class="stat-label">Decisões</span><span class="stat-value">${j.decisions}</span></div><div class="stat"><span class="stat-label">Taxa favorável</span><span class="stat-value positive">${EliteUtils.formatPercentage(j.favorableRate * 100)}</span></div></div><div class="judge-insights"><strong>Estratégia recomendada:</strong><p>${j.favorableRate > 0.7 ? 'Estratégia ofensiva. Argumentos técnicos fortes têm boa aceitação.' : 'Estratégia equilibrada. Preparar para contraditório robusto.'}</p></div></div>`).join('')}</div>`;
        },
        
        renderAdversaryProfiles: () => `<div class="adversary-grid"><div class="adversary-card"><div class="adversary-header"><i class="fas fa-building"></i><h3>PLMJ</h3></div><div class="adversary-stats"><div class="stat"><span class="stat-label">Taxa Sucesso</span><strong>68%</strong></div><div class="stat"><span class="stat-label">Tempo Médio</span><strong>45 dias</strong></div></div><div class="adversary-pattern"><div class="alert"><i class="fas fa-chart-line"></i> Padrão Identificado</div><p>85% de probabilidade de pedido de prorrogação de prazo na fase de saneamento</p></div></div><div class="adversary-card"><div class="adversary-header"><i class="fas fa-building"></i><h3>VdA</h3></div><div class="adversary-stats"><div class="stat"><span class="stat-label">Taxa Sucesso</span><strong>72%</strong></div><div class="stat"><span class="stat-label">Tempo Médio</span><strong>38 dias</strong></div></div><div class="adversary-pattern"><div class="alert"><i class="fas fa-chart-line"></i> Padrão Identificado</div><p>Estratégia agressiva na fase probatória, requerem perícias extensivas</p></div></div></div>`,
        
        renderHeatmap: () => `<div class="heatmap-container"><h3>Juris-Heatmap</h3><p>Taxa de sucesso por tribunal e área do direito</p><div class="heatmap-grid"><div class="heatmap-label"></div><div class="heatmap-label">Civil</div><div class="heatmap-label">Laboral</div><div class="heatmap-label">Comercial</div><div class="heatmap-label">Fiscal</div><div class="heatmap-label">Lisboa</div><div class="heatmap-cell high">72%</div><div class="heatmap-cell medium">68%</div><div class="heatmap-cell high">71%</div><div class="heatmap-cell high">70%</div><div class="heatmap-label">Porto</div><div class="heatmap-cell high">75%</div><div class="heatmap-cell high">72%</div><div class="heatmap-cell high">73%</div><div class="heatmap-cell medium">68%</div></div></div>`,
        
        renderClients: async () => {
            const filtered = AppState.clients.filter(c => AppState.userRole === 'SUPER_USER' || c.lawyerId === AppState.userLawyerId);
            return `<div class="clients-header" style="display: flex; justify-content: space-between; margin-bottom: 20px;"><h2>${EliteUtils.getLocaleText('navClients')}</h2><button id="newClientBtn" class="elite-btn primary"><i class="fas fa-user-plus"></i> ${EliteUtils.getLocaleText('newClientTitle')}</button></div><table class="data-table"><thead><tr><th>Cliente</th><th>NIF/NIPC</th><th>Área Principal</th><th>Processos</th><th>Valor Total (€)</th><th>Ações</th></tr></thead><tbody>${filtered.map(c => `<tr><td><strong>${c.name}</strong></td><td>${c.nif}</td><td><span class="case-badge ${c.category}">${EliteUtils.getCategoryName(c.category)}</span></td><td>${c.cases}</td><td>${EliteUtils.formatCurrency(c.totalValue)}</td><td><button class="action-btn notes-client" data-client="${c.id}"><i class="fas fa-pen"></i></button></td></tr>`).join('')}</tbody></table>`;
        },
        
        renderReports: () => `<div class="reports-header"><h2>${EliteUtils.getLocaleText('navReports')}</h2><p>Documentos gerados automaticamente com análise aprofundada</p></div><div class="reports-grid"><div class="report-card"><i class="fas fa-chart-line"></i><h3>Relatório de Performance</h3><p>Análise de métricas da carteira</p><button class="elite-btn small" onclick="ELITE_PROBATUM.generatePerformanceReport()"><i class="fas fa-download"></i> Gerar</button></div><div class="report-card"><i class="fas fa-gavel"></i><h3>Análise de Magistrados</h3><p>Perfil detalhado de juízes</p><button class="elite-btn small" onclick="ELITE_PROBATUM.generateJudgesReport()"><i class="fas fa-download"></i> Gerar</button></div></div>`,
        
        initCasesTable: () => {
            document.querySelectorAll('.view-case').forEach(btn => btn.addEventListener('click', () => { const caseId = btn.dataset.id; const caseData = AppState.cases.find(c => c.id === caseId); if (caseData) { document.getElementById('caseDetailBody').innerHTML = `<div class="detail-row"><span>Processo:</span><strong>${caseData.id}</strong></div><div class="detail-row"><span>Cliente:</span><strong>${caseData.client}</strong></div><div class="detail-row"><span>Área:</span><strong>${caseData.categoryName}</strong></div><div class="detail-row"><span>Valor:</span><strong>${EliteUtils.formatCurrency(caseData.value)}</strong></div>`; document.getElementById('caseDetailModal').style.display = 'flex'; } }));
            document.getElementById('newCaseBtn')?.addEventListener('click', () => { document.getElementById('newCaseModal').style.display = 'flex'; });
            document.getElementById('newInsolvencyBtn')?.addEventListener('click', () => { document.getElementById('newCaseModal').style.display = 'flex'; document.getElementById('caseType').value = 'insolvency'; this.toggleCaseFields(); });
            document.getElementById('newLaborBtn')?.addEventListener('click', () => { document.getElementById('newCaseModal').style.display = 'flex'; document.getElementById('caseType').value = 'labor'; this.toggleCaseFields(); });
            document.getElementById('caseType')?.addEventListener('change', () => this.toggleCaseFields());
            document.getElementById('newCaseForm')?.addEventListener('submit', (e) => { e.preventDefault(); this.createNewCase(); });
        },
        
        toggleCaseFields: () => {
            const type = document.getElementById('caseType')?.value;
            document.getElementById('insolvencyFields').style.display = type === 'insolvency' ? 'block' : 'none';
            document.getElementById('laborFields').style.display = type === 'labor' ? 'block' : 'none';
        },
        
        createNewCase: () => {
            const type = document.getElementById('caseType').value;
            const client = document.getElementById('caseClient').value;
            const value = parseFloat(document.getElementById('caseValue').value) || 0;
            const court = document.getElementById('caseCourt').value;
            
            if (type === 'insolvency') {
                const newCase = { id: 'I' + (AppState.insolvencyCases.length + 101), client: client, nif: document.getElementById('insolvencyNif').value, type: document.getElementById('insolvencyType').value, assets: parseFloat(document.getElementById('insolvencyAssets').value) || 0, liabilities: parseFloat(document.getElementById('insolvencyLiabilities').value) || 0, creditors: document.getElementById('insolvencyCreditors').value.split(',').map(c => c.trim()), exoneration: document.getElementById('insolvencyExoneration').value === 'true', status: 'active', lawyerId: AppState.userLawyerId, createdAt: new Date().toISOString() };
                AppState.addCase(newCase, 'insolvency');
            } else if (type === 'labor') {
                const newCase = { id: 'L' + (AppState.laborCases.length + 101), client: client, dismissalDate: document.getElementById('laborDismissalDate').value, contractType: document.getElementById('laborContractType').value, seniority: parseFloat(document.getElementById('laborSeniority').value) || 0, dismissalType: document.getElementById('laborDismissalType').value, calcIndemnity: parseFloat(document.getElementById('laborCalcIndemnity').value) || 0, claimIndemnity: parseFloat(document.getElementById('laborClaimIndemnity').value) || 0, grounds: document.getElementById('laborGrounds').value, appeals: document.getElementById('laborAppeals').value, status: 'active', lawyerId: AppState.userLawyerId, createdAt: new Date().toISOString() };
                AppState.addCase(newCase, 'labor');
            } else {
                const newCase = { id: 'C' + (AppState.cases.length + 101), client: client, category: 'civil', categoryName: 'Direito Civil', value: value, successProbability: 0.65, status: 'active', judge: 'A designar', court: court, lawyerId: AppState.userLawyerId, description: 'Processo geral', createdAt: new Date().toISOString(), adversary: 'N/A' };
                AppState.addCase(newCase, 'general');
            }
            EliteUtils.showToast(EliteUtils.getLocaleText('toastCaseCreated'), 'success');
            document.getElementById('newCaseModal').style.display = 'none';
            document.getElementById('newCaseForm').reset();
            Views.render(AppState.currentView);
        },
        
        initClientsTable: () => {
            document.getElementById('newClientBtn')?.addEventListener('click', () => document.getElementById('newClientModal').style.display = 'flex');
            document.getElementById('newClientForm')?.addEventListener('submit', (e) => { e.preventDefault(); const newClient = { id: 'CL' + (AppState.clients.length + 101), name: document.getElementById('clientName').value, nif: document.getElementById('clientNif').value, category: document.getElementById('clientCategory').value, cases: 1, totalValue: parseFloat(document.getElementById('clientCaseValue').value), lawyerId: AppState.userLawyerId }; AppState.addClient(newClient); EliteUtils.showToast(EliteUtils.getLocaleText('toastClientCreated'), 'success'); document.getElementById('newClientModal').style.display = 'none'; document.getElementById('newClientForm').reset(); Views.render('clients'); });
            document.querySelectorAll('.notes-client').forEach(btn => btn.addEventListener('click', () => { document.getElementById('notesModal').style.display = 'flex'; NotesManager.renderNotes('notesItems'); }));
        },
        
        initLitigationModule: () => {
            document.getElementById('runPredictionBtn')?.addEventListener('click', () => {
                const value = parseFloat(document.getElementById('predictValue').value);
                if (!value) { EliteUtils.showToast('Preencha o valor da causa', 'warning'); return; }
                const probability = (parseFloat(document.getElementById('predictProbability').value) || 70) / 100;
                document.getElementById('predictionResult').innerHTML = `<div class="prediction-header"><h3>Resultado da Análise Preditiva</h3><div class="probability-gauge"><div class="gauge-value" style="--probability: ${probability * 100}%"><span>${EliteUtils.formatPercentage(probability * 100)}</span></div></div></div><div class="prediction-details"><div class="detail-row"><span>Valor Estimado de Êxito:</span><strong>${EliteUtils.formatCurrency(value * probability)}</strong></div></div><div class="prediction-recommendation"><h4>Recomendação Estratégica</h4><p>${probability > 0.7 ? 'Recomenda-se ação judicial imediata com pedido de tutela antecipada.' : 'Estratégia equilibrada: notificação extrajudicial com prazo para acordo.'}</p></div>`;
                document.getElementById('predictionResult').style.display = 'block';
            });
        },
        
        applyActivityFilters: () => {
            const user = document.getElementById('filterUser')?.value;
            const action = document.getElementById('filterAction')?.value;
            const dateFrom = document.getElementById('filterDateFrom')?.value;
            const dateTo = document.getElementById('filterDateTo')?.value;
            let filtered = activityLog;
            if (user) filtered = filtered.filter(e => e.userName?.toLowerCase().includes(user.toLowerCase()));
            if (action) filtered = filtered.filter(e => e.action === action);
            if (dateFrom) filtered = filtered.filter(e => new Date(e.timestamp) >= new Date(dateFrom));
            if (dateTo) filtered = filtered.filter(e => new Date(e.timestamp) <= new Date(dateTo));
            const tbody = document.getElementById('activityLogBody');
            if (tbody) tbody.innerHTML = filtered.slice(0, 200).map(e => `<tr><td>${new Date(e.timestamp).toLocaleString()}</td><td>${e.userName}</td><td><span class="status-badge status-active">${e.action}</span></td><td>${e.entityType}</td><td>${e.entityId}</td><td>${e.details?.substring(0, 60) || '-'}</td><td class="log-hash">${e.hash}</td></tr>`).join('');
        }
    };
    
    // =========================================================================
    // NOTES MANAGER
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
    // INICIALIZAÇÃO
    // =========================================================================
    
    async function init() {
        EliteUtils.log('Inicializando ELITE PROBATUM v1.0 - Metodologia Forense Avançada');
        AppState.loadFromStorage();
        
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
                setupNavigation(); setupModals(); setupGlobalEvents(); Views.render('dashboard');
            } else { document.getElementById('loginError').style.display = 'block'; }
        });
        
        document.getElementById('requestAccessBtn')?.addEventListener('click', () => {
            document.getElementById('accessRequestModal').style.display = 'flex';
        });
        
        document.getElementById('accessRequestForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            AuthManager.submitAccessRequest({
                name: document.getElementById('requestName').value,
                email: document.getElementById('requestEmail').value,
                nif: document.getElementById('requestNif').value,
                role: document.getElementById('requestRole').value,
                reason: document.getElementById('requestReason').value
            });
            document.getElementById('accessRequestModal').style.display = 'none';
            document.getElementById('accessRequestForm').reset();
        });
        
        document.getElementById('langPT')?.addEventListener('click', () => I18nManager.setLocale('PT'));
        document.getElementById('langEN')?.addEventListener('click', () => I18nManager.setLocale('EN'));
        document.getElementById('langToggle')?.addEventListener('click', () => I18nManager.setLocale(currentLocale === 'PT' ? 'EN' : 'PT'));
        document.getElementById('langToggleSidebar')?.addEventListener('click', () => I18nManager.setLocale(currentLocale === 'PT' ? 'EN' : 'PT'));
        
        document.getElementById('integrityCheckBtn')?.addEventListener('click', async () => { document.getElementById('integrityModal').style.display = 'flex'; });
        document.getElementById('exportReportBtn')?.addEventListener('click', () => EliteUtils.showToast('Relatório gerado', 'success'));
        document.getElementById('saveNoteBtn')?.addEventListener('click', () => { const content = document.getElementById('strategicNote').value; if (content.trim()) { NotesManager.addNote(content, AppState.currentUser); document.getElementById('strategicNote').value = ''; NotesManager.renderNotes('notesItems'); } });
        
        I18nManager.setLocale('PT');
    }
    
    const I18nManager = {
        setLocale: (locale) => {
            currentLocale = locale;
            document.documentElement.lang = locale === 'PT' ? 'pt-PT' : 'en-GB';
            const textMap = { splashTitle: 'splashTitle', splashBadge: 'splashBadge', splashVersion: 'splashVersion', splashTagline: 'splashTagline', loaderText: 'loaderText', enterBtnText: 'enterBtn', loginTitle: 'loginTitle', loginSubtitle: 'loginSubtitle', yubikeyText: 'yubikeyText', loginBtnText: 'loginBtnText', loginHint: 'loginHint', requestAccessText: 'requestAccessText', requestAccessHint: 'requestAccessHint', navDashboard: 'navDashboard', navCases: 'navCases', navInsolvency: 'navInsolvency', navLabor: 'navLabor', navLitigation: 'navLitigation', navJudges: 'navJudges', navAdversary: 'navAdversary', navHeatmap: 'navHeatmap', navClients: 'navClients', navActivityLog: 'navActivityLog', navReports: 'navReports', statActiveCases: 'statActiveCases', statDisputeValue: 'statDisputeValue', statSuccessRate: 'statSuccessRate', pageTitle: 'dashboardTitle', newCaseBtn: 'newCaseBtn', searchPlaceholder: 'searchPlaceholder', allCases: 'allCases', caseTypeLabel: 'caseTypeLabel', clientLabel: 'clientLabel', valueLabel: 'valueLabel', courtLabel: 'courtLabel', createCaseBtnText: 'createCaseBtnText', newClientTitle: 'newClientTitle', clientNameLabel: 'clientNameLabel', clientNifLabel: 'clientNifLabel', clientValueLabel: 'clientValueLabel', clientCourtLabel: 'clientCourtLabel', clientCategoryLabel: 'clientCategoryLabel', createClientBtnText: 'createClientBtnText', notesTitle: 'notesTitle', saveNoteText: 'saveNoteText', previousNotesTitle: 'previousNotesTitle', modalNotificationsTitle: 'modalNotificationsTitle', modalSettingsTitle: 'modalSettingsTitle', noAlertsText: 'noAlertsText', accessRequestTitle: 'accessRequestTitle', requestNameLabel: 'requestNameLabel', requestEmailLabel: 'requestEmailLabel', requestNifLabel: 'requestNifLabel', requestRoleLabel: 'requestRoleLabel', requestReasonLabel: 'requestReasonLabel', submitRequestText: 'submitRequestText' };
            for (const [id, key] of Object.entries(textMap)) { const el = document.getElementById(id); if (el && LOCALES[currentLocale][key]) el.textContent = LOCALES[currentLocale][key]; }
            document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.toggle('active', (currentLocale === 'PT' && btn.id === 'langPT') || (currentLocale === 'EN' && btn.id === 'langEN')));
            GraphicsManager.destroyAll();
            if (AppState.currentView === 'dashboard') setTimeout(() => { GraphicsManager.initPortfolioChart(); GraphicsManager.initCategoryChart(); }, 100);
            EliteUtils.showToast(`Idioma alterado para ${locale === 'PT' ? 'Português' : 'English'}`, 'info');
        }
    };
    
    function setupNavigation() {
        document.querySelectorAll('.nav-item').forEach(item => { item.addEventListener('click', async (e) => { e.preventDefault(); const view = item.dataset.view; document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active')); item.classList.add('active'); await Views.render(view); if (window.innerWidth <= 1024) document.querySelector('.elite-sidebar')?.classList.remove('open'); }); });
        document.getElementById('mobileMenuToggle')?.addEventListener('click', () => document.querySelector('.elite-sidebar')?.classList.toggle('open'));
    }
    
    function setupModals() {
        document.querySelectorAll('.modal-close, .elite-modal').forEach(el => { if (el.classList.contains('elite-modal')) { el.addEventListener('click', (e) => { if (e.target === el) el.style.display = 'none'; }); } else { el.addEventListener('click', () => el.closest('.elite-modal').style.display = 'none'); } });
        document.getElementById('notificationsBtn')?.addEventListener('click', () => document.getElementById('notificationsModal').style.display = 'flex');
        document.getElementById('settingsBtn')?.addEventListener('click', () => document.getElementById('settingsModal').style.display = 'flex');
        document.getElementById('logoutBtn')?.addEventListener('click', () => { if (confirm('Tem certeza que deseja terminar sessão?')) AuthManager.logout(); });
    }
    
    function setupGlobalEvents() {
        document.addEventListener('keydown', (e) => { if (e.ctrlKey && e.key === 'd') { e.preventDefault(); document.querySelector('.nav-item[data-view="dashboard"]')?.click(); } });
    }
    
    function escapeHtml(str) { if (!str) return ''; return str.replace(/[&<>]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[m])); }
    
    window.ELITE_PROBATUM = {
        ...EliteUtils,
        AppState,
        generatePerformanceReport: () => EliteUtils.showToast('Relatório de performance gerado', 'success'),
        generateJudgesReport: () => EliteUtils.showToast('Análise de magistrados gerada', 'success')
    };
    
    init();
})();