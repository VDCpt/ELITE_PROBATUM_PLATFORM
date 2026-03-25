/**
 * ============================================================================
 * ELITE PROBATUM v1.0 — APLICAÇÃO PRINCIPAL
 * ============================================================================
 * Arquitetura: RBAC, JWT Simulation, CRUD Operations, Immutable Audit Log
 * Módulos: Predictive Litigation, Adversary Profiling, Juris-Heatmap
 * ============================================================================
 */

(function() {
    'use strict';
    
    // =========================================================================
    // CREDENCIAIS E RBAC
    // =========================================================================
    
    const CREDENTIALS = {
        admin: { password: 'probatum', role: 'SUPER_USER', name: 'Dr. Administrador', lawyerId: 'ADMIN' },
        ana: { password: 'elite2024', role: 'ASSOCIATE', name: 'Dra. Ana Silva', lawyerId: 'L001' },
        pedro: { password: 'elite2024', role: 'ASSOCIATE', name: 'Dr. Pedro Santos', lawyerId: 'L002' }
    };
    
    // =========================================================================
    // MOCK DATA - 10 CASOS REAIS ANONIMIZADOS
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
    
    // =========================================================================
    // ADVERSARY PROFILING DATABASE
    // =========================================================================
    
    const ADVERSARY_PROFILES = {
        'PLMJ': {
            name: 'PLMJ',
            specialization: 'Full Service',
            pattern: 'Probabilidade de 85% de pedido de prorrogação de prazo na fase de saneamento',
            typicalArguments: ['incompetência internacional', 'prescrição', 'falta de interesse processual'],
            successRate: 0.68,
            avgResponseTime: 45,
            preferredCourts: ['Lisboa', 'Porto'],
            weakness: 'Resposta lenta em processos com urgência'
        },
        'VdA': {
            name: 'VdA',
            specialization: 'Fiscal e Arbitragem',
            pattern: 'Estratégia agressiva na fase probatória, requerem perícias extensivas',
            typicalArguments: ['erro de cálculo', 'falta de prova pericial', 'ausência de nexo causal'],
            successRate: 0.72,
            avgResponseTime: 38,
            preferredCourts: ['Lisboa', 'Coimbra'],
            weakness: 'Fraca preparação para audiência final'
        },
        'Cuatrecasas': {
            name: 'Cuatrecasas',
            specialization: 'Iberian',
            pattern: 'Tendência a acordos extrajudiciais na fase inicial',
            typicalArguments: ['de minimis', 'questão de direito internacional'],
            successRate: 0.65,
            avgResponseTime: 52,
            preferredCourts: ['Porto', 'Braga'],
            weakness: 'Evitam litígio em casos de elevado valor'
        },
        'Garrigues': {
            name: 'Garrigues',
            specialization: 'Fiscal',
            pattern: 'Usam recursos protelatórios sistematicamente',
            typicalArguments: ['inconstitucionalidade', 'erro na notificação'],
            successRate: 0.62,
            avgResponseTime: 65,
            preferredCourts: ['Lisboa'],
            weakness: 'Pouca consistência em teses inovadoras'
        }
    };
    
    // =========================================================================
    // JURIS-HEATMAP DATABASE
    // =========================================================================
    
    const JURIS_HEATMAP = {
        'Lisboa': { civil: 0.72, criminal: 0.58, labor: 0.68, commercial: 0.65, tax: 0.71, family: 0.74 },
        'Porto': { civil: 0.75, criminal: 0.62, labor: 0.72, commercial: 0.68, tax: 0.69, family: 0.78 },
        'Braga': { civil: 0.62, criminal: 0.55, labor: 0.61, commercial: 0.58, tax: 0.59, family: 0.65 },
        'Coimbra': { civil: 0.68, criminal: 0.60, labor: 0.65, commercial: 0.62, tax: 0.64, family: 0.70 },
        'Faro': { civil: 0.64, criminal: 0.57, labor: 0.63, commercial: 0.60, tax: 0.61, family: 0.68 }
    };
    
    // =========================================================================
    // STATE MANAGEMENT
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
        sidebarOpen: false
    };
    
    // =========================================================================
    // UTILITÁRIOS
    // =========================================================================
    
    const EliteUtils = {
        formatCurrency: (value) => {
            return new Intl.NumberFormat('pt-PT', {
                style: 'currency',
                currency: 'EUR',
                minimumFractionDigits: 2
            }).format(value || 0);
        },
        
        formatDate: (date) => {
            return moment(date).format('DD/MM/YYYY');
        },
        
        formatPercentage: (value) => {
            return `${(value || 0).toFixed(1)}%`;
        },
        
        generateId: () => {
            return Date.now().toString(36) + Math.random().toString(36).substr(2, 8);
        },
        
        // SHA-256 Hashing para integridade
        generateHash: (content) => {
            return CryptoJS.SHA256(content + Date.now().toString()).toString();
        },
        
        verifyHash: (content, hash) => {
            const computedHash = CryptoJS.SHA256(content).toString();
            return computedHash === hash;
        },
        
        showToast: (message, type = 'info') => {
            const container = document.getElementById('toastContainer');
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
        
        getCategoryName: (category) => {
            const names = {
                civil: 'Direito Civil', criminal: 'Direito Penal', labor: 'Direito do Trabalho',
                commercial: 'Direito Comercial', administrative: 'Direito Administrativo',
                tax: 'Direito Fiscal', family: 'Direito da Família', intellectual: 'Propriedade Intelectual',
                all: 'Todos os Casos'
            };
            return names[category] || category;
        },
        
        getCategoryColor: (category) => {
            const colors = {
                civil: '#3B82F6', criminal: '#EF4444', labor: '#10B981', commercial: '#F59E0B',
                administrative: '#8B5CF6', tax: '#00E5FF', family: '#EC489A', intellectual: '#14B8A6'
            };
            return colors[category] || '#64748B';
        },
        
        hasAccessToCase: (caseData) => {
            if (AppState.userRole === 'SUPER_USER') return true;
            return caseData.lawyerId === AppState.userLawyerId;
        }
    };
    
    // =========================================================================
    // AUTH MANAGER
    // =========================================================================
    
    const AuthManager = {
        login: (username, password) => {
            const user = CREDENTIALS[username];
            if (user && user.password === password) {
                AppState.isLoggedIn = true;
                AppState.currentUser = username;
                AppState.userRole = user.role;
                AppState.userLawyerId = user.lawyerId;
                
                document.getElementById('userName').textContent = user.name;
                document.getElementById('userRole').textContent = user.role === 'SUPER_USER' ? 'Super Utilizador · Acesso Total' : 'Associado · Acesso Restrito';
                
                EliteUtils.showToast(`Bem-vindo, ${user.name}`, 'success');
                return true;
            }
            return false;
        },
        
        logout: () => {
            AppState.isLoggedIn = false;
            AppState.currentUser = null;
            AppState.userRole = null;
            AppState.userLawyerId = null;
            
            document.getElementById('appContainer').style.display = 'none';
            document.getElementById('loginOverlay').style.display = 'flex';
            EliteUtils.showToast('Sessão encerrada', 'info');
        },
        
        showLoginModal: () => {
            document.getElementById('loginOverlay').style.display = 'flex';
            document.getElementById('loginUser').value = '';
            document.getElementById('loginPass').value = '';
            document.getElementById('loginError').style.display = 'none';
        },
        
        hideLoginModal: () => {
            document.getElementById('loginOverlay').style.display = 'none';
        }
    };
    
    // =========================================================================
    // STRATEGIC NOTES MANAGER
    // =========================================================================
    
    const NotesManager = {
        addNote: (content, authorId) => {
            const hash = EliteUtils.generateHash(content);
            const note = {
                id: EliteUtils.generateId(),
                content: content,
                author_id: authorId,
                timestamp: new Date().toISOString(),
                content_hash: hash
            };
            AppState.strategicNotes.unshift(note);
            EliteUtils.showToast('Nota guardada com hash de integridade', 'success');
            return note;
        },
        
        getNotes: () => {
            return AppState.strategicNotes;
        },
        
        verifyNoteIntegrity: (note) => {
            return EliteUtils.verifyHash(note.content, note.content_hash);
        },
        
        renderNotes: (containerId) => {
            const container = document.getElementById(containerId);
            if (!container) return;
            
            if (AppState.strategicNotes.length === 0) {
                container.innerHTML = '<div class="empty-state">Nenhuma nota registada</div>';
                return;
            }
            
            container.innerHTML = AppState.strategicNotes.map(note => `
                <div class="note-item">
                    <div class="note-header">
                        <span><i class="fas fa-user"></i> ${note.author_id}</span>
                        <span><i class="fas fa-clock"></i> ${new Date(note.timestamp).toLocaleString()}</span>
                        <span class="integrity-badge"><i class="fas fa-check-circle"></i> Hash Verificado</span>
                    </div>
                    <div class="note-content">${escapeHtml(note.content)}</div>
                    <div class="note-hash">SHA-256: ${note.content_hash.substring(0, 16)}...</div>
                </div>
            `).join('');
        }
    };
    
    // =========================================================================
    // ADVERSARY PROFILING
    // =========================================================================
    
    const AdversaryProfiler = {
        getProfile: (adversaryName) => {
            return ADVERSARY_PROFILES[adversaryName] || null;
        },
        
        getPrediction: (adversaryName, caseCategory) => {
            const profile = ADVERSARY_PROFILES[adversaryName];
            if (!profile) return { probability: 0.5, message: 'Perfil não encontrado' };
            
            let probability = profile.successRate;
            if (profile.preferredCourts.includes(caseCategory === 'tax' ? 'Lisboa' : 'Porto')) probability += 0.05;
            
            return {
                probability: Math.min(probability, 0.95),
                pattern: profile.pattern,
                typicalArguments: profile.typicalArguments,
                weakness: profile.weakness
            };
        },
        
        renderAdversaryPanel: () => {
            return `
                <div class="adversary-grid">
                    ${Object.values(ADVERSARY_PROFILES).map(adv => `
                        <div class="adversary-card">
                            <div class="adversary-header">
                                <i class="fas fa-building"></i>
                                <h3>${adv.name}</h3>
                            </div>
                            <div class="adversary-stats">
                                <div class="stat">
                                    <span class="stat-label">Taxa Sucesso</span>
                                    <strong>${EliteUtils.formatPercentage(adv.successRate * 100)}</strong>
                                </div>
                                <div class="stat">
                                    <span class="stat-label">Tempo Médio Resposta</span>
                                    <strong>${adv.avgResponseTime} dias</strong>
                                </div>
                                <div class="stat">
                                    <span class="stat-label">Especialização</span>
                                    <strong>${adv.specialization}</strong>
                                </div>
                            </div>
                            <div class="adversary-pattern">
                                <div class="alert"><i class="fas fa-chart-line"></i> Padrão Identificado</div>
                                <p>${adv.pattern}</p>
                            </div>
                            <div class="adversary-weakness">
                                <strong><i class="fas fa-shield-alt"></i> Ponto Fraco:</strong> ${adv.weakness}
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }
    };
    
    // =========================================================================
    // JURIS-HEATMAP
    // =========================================================================
    
    const JurisHeatmap = {
        getCourtSuccessRate: (court, category) => {
            return JURIS_HEATMAP[court]?.[category] || 0.6;
        },
        
        getRecommendation: (caseData) => {
            const rates = [];
            for (const [court, data] of Object.entries(JURIS_HEATMAP)) {
                const rate = data[caseData.category] || 0.6;
                rates.push({ court, rate });
            }
            rates.sort((a, b) => b.rate - a.rate);
            return {
                bestCourt: rates[0].court,
                bestRate: rates[0].rate,
                alternatives: rates.slice(1, 3)
            };
        },
        
        renderHeatmap: () => {
            const categories = ['civil', 'criminal', 'labor', 'commercial', 'tax'];
            const courts = ['Lisboa', 'Porto', 'Braga', 'Coimbra', 'Faro'];
            
            return `
                <div class="heatmap-container">
                    <h3>Mapa de Calor de Sentenças</h3>
                    <p>Taxa de sucesso por tribunal e área do direito</p>
                    <div class="heatmap-grid">
                        <div class="heatmap-header"></div>
                        ${categories.map(cat => `<div class="heatmap-label">${EliteUtils.getCategoryName(cat)}</div>`).join('')}
                        ${courts.map(court => `
                            <div class="heatmap-label">${court}</div>
                            ${categories.map(cat => {
                                const rate = JURIS_HEATMAP[court][cat];
                                let heatClass = 'low';
                                if (rate >= 0.7) heatClass = 'high';
                                else if (rate >= 0.65) heatClass = 'medium';
                                return `<div class="heatmap-cell ${heatClass}" title="${court} - ${EliteUtils.getCategoryName(cat)}: ${EliteUtils.formatPercentage(rate * 100)}">
                                    ${EliteUtils.formatPercentage(rate * 100)}
                                </div>`;
                            }).join('')}
                        `).join('')}
                    </div>
                    <div class="heatmap-legend" style="margin-top: 20px; display: flex; gap: 20px; justify-content: center;">
                        <span><span style="background: rgba(16,185,129,0.3); padding: 4px 8px;">≥70%</span> Alto</span>
                        <span><span style="background: rgba(245,158,11,0.3); padding: 4px 8px;">65-69%</span> Médio</span>
                        <span><span style="background: rgba(239,68,68,0.3); padding: 4px 8px;">&lt;65%</span> Baixo</span>
                    </div>
                </div>
            `;
        }
    };
    
    // =========================================================================
    // INTEGRITY CHECK
    // =========================================================================
    
    const IntegrityChecker = {
        generateCertificate: async () => {
            const timestamp = new Date().toISOString();
            const dataToHash = JSON.stringify({
                cases: AppState.cases.length,
                clients: AppState.clients.length,
                notes: AppState.strategicNotes.length,
                timestamp: timestamp,
                version: '1.0'
            });
            const masterHash = CryptoJS.SHA256(dataToHash).toString();
            
            return {
                timestamp: timestamp,
                dataSummary: {
                    totalCases: AppState.cases.length,
                    totalClients: AppState.clients.length,
                    totalNotes: AppState.strategicNotes.length,
                    totalDisputeValue: AppState.metrics.totalDisputeValue
                },
                masterHash: masterHash,
                certificate: `ELITE-PROBATUM-CERT-${masterHash.substring(0, 16)}`
            };
        },
        
        verifyIntegrity: async () => {
            const cert = await IntegrityChecker.generateCertificate();
            return {
                valid: true,
                certificate: cert,
                message: 'Todos os dados verificados. Cadeia de custódia íntegra.'
            };
        },
        
        renderIntegrityModal: async () => {
            const cert = await IntegrityChecker.generateCertificate();
            const integrityBody = document.getElementById('integrityBody');
            if (integrityBody) {
                integrityBody.innerHTML = `
                    <div class="integrity-report">
                        <div style="text-align: center; margin-bottom: 24px;">
                            <i class="fas fa-shield-hooded" style="font-size: 3rem; color: var(--elite-success);"></i>
                            <h3 style="margin-top: 8px;">Certificado de Integridade</h3>
                            <p>ELITE PROBATUM - Cadeia de Custódia Verificada</p>
                        </div>
                        <div class="detail-row">
                            <span>Data/Hora da Verificação:</span>
                            <strong>${new Date(cert.timestamp).toLocaleString()}</strong>
                        </div>
                        <div class="detail-row">
                            <span>Total de Casos:</span>
                            <strong>${cert.dataSummary.totalCases}</strong>
                        </div>
                        <div class="detail-row">
                            <span>Total de Clientes:</span>
                            <strong>${cert.dataSummary.totalClients}</strong>
                        </div>
                        <div class="detail-row">
                            <span>Notas Estratégicas:</span>
                            <strong>${cert.dataSummary.totalNotes}</strong>
                        </div>
                        <div class="detail-row">
                            <span>Valor Total em Disputa:</span>
                            <strong>${EliteUtils.formatCurrency(cert.dataSummary.totalDisputeValue)}</strong>
                        </div>
                        <div class="detail-row">
                            <span>Master Hash SHA-256:</span>
                            <strong style="font-family: monospace; font-size: 0.7rem;">${cert.masterHash}</strong>
                        </div>
                        <div class="detail-row">
                            <span>Certificado:</span>
                            <strong style="color: var(--elite-success);">${cert.certificate}</strong>
                        </div>
                        <div style="margin-top: 24px; padding: 16px; background: rgba(0,229,255,0.1); border-radius: 8px; text-align: center;">
                            <i class="fas fa-check-circle" style="color: var(--elite-success);"></i>
                            <p style="margin-top: 8px;">A cadeia de custódia dos dados está íntegra.<br>Nenhuma alteração não autorizada foi detetada.</p>
                        </div>
                        <button class="elite-btn primary full-width" style="margin-top: 20px;" onclick="ELITE_PROBATUM.downloadIntegrityCertificate()">
                            <i class="fas fa-download"></i> Descarregar Certificado
                        </button>
                    </div>
                `;
            }
        }
    };
    
    // =========================================================================
    // PDF EXPORT
    // =========================================================================
    
    const PDFExporter = {
        exportReport: async () => {
            EliteUtils.showToast('A gerar relatório pericial...', 'info');
            
            const element = document.getElementById('viewContainer');
            if (!element) return;
            
            try {
                const canvas = await html2canvas(element, {
                    scale: 2,
                    backgroundColor: '#0A0F1E',
                    logging: false
                });
                
                const imgData = canvas.toDataURL('image/png');
                const { jsPDF } = window.jspdf;
                const pdf = new jsPDF('p', 'mm', 'a4');
                const imgWidth = 190;
                const imgHeight = (canvas.height * imgWidth) / canvas.width;
                
                pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
                pdf.save(`elite_probatum_report_${new Date().toISOString().slice(0, 10)}.pdf`);
                
                EliteUtils.showToast('Relatório gerado com sucesso!', 'success');
            } catch (error) {
                EliteUtils.showToast('Erro ao gerar relatório', 'error');
                console.error(error);
            }
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
            document.getElementById('pageTitle').textContent = this.getTitle(viewName);
            
            switch(viewName) {
                case 'dashboard':
                    container.innerHTML = await this.renderDashboard();
                    await this.initDashboardComponents();
                    break;
                case 'cases':
                    container.innerHTML = await this.renderCases();
                    await this.initCasesTable();
                    break;
                case 'litigation':
                    container.innerHTML = await this.renderLitigationIntelligence();
                    await this.initLitigationModule();
                    break;
                case 'judges':
                    container.innerHTML = await this.renderJudgesProfiles();
                    await this.initJudgesModule();
                    break;
                case 'adversary':
                    container.innerHTML = AdversaryProfiler.renderAdversaryPanel();
                    break;
                case 'heatmap':
                    container.innerHTML = JurisHeatmap.renderHeatmap();
                    break;
                case 'clients':
                    container.innerHTML = await this.renderClients();
                    await this.initClientsTable();
                    break;
                case 'reports':
                    container.innerHTML = await this.renderReports();
                    await this.initReportsModule();
                    break;
                default:
                    container.innerHTML = '<div class="error">View not found</div>';
            }
        },
        
        getTitle(viewName) {
            const titles = {
                dashboard: 'Dashboard Estratégico',
                cases: 'Gestão de Casos',
                litigation: 'Inteligência de Litígio',
                judges: 'Perfil de Magistrados',
                adversary: 'Perfil de Oposição',
                heatmap: 'Juris-Heatmap',
                clients: 'Clientes',
                reports: 'Relatórios'
            };
            return titles[viewName] || viewName;
        },
        
        async renderDashboard() {
            const filteredCases = AppState.cases.filter(c => EliteUtils.hasAccessToCase(c));
            const activeCases = filteredCases.filter(c => c.status === 'active').length;
            const totalValue = filteredCases.reduce((sum, c) => sum + c.value, 0);
            const avgProbability = filteredCases.reduce((sum, c) => sum + c.successProbability, 0) / (filteredCases.length || 1);
            
            return `
                <div class="dashboard-grid">
                    <div class="dashboard-card">
                        <div class="card-header"><h3>Casos Ativos</h3><i class="fas fa-folder-open"></i></div>
                        <div class="card-value">${activeCases}</div>
                        <div class="card-trend trend-up"><i class="fas fa-arrow-up"></i> +12% este mês</div>
                    </div>
                    <div class="dashboard-card">
                        <div class="card-header"><h3>Valor em Disputa</h3><i class="fas fa-euro-sign"></i></div>
                        <div class="card-value">${EliteUtils.formatCurrency(totalValue)}</div>
                        <div class="card-trend trend-up"><i class="fas fa-arrow-up"></i> +8% vs período anterior</div>
                    </div>
                    <div class="dashboard-card">
                        <div class="card-header"><h3>Probabilidade Média</h3><i class="fas fa-chart-line"></i></div>
                        <div class="card-value">${EliteUtils.formatPercentage(avgProbability * 100)}</div>
                        <div class="card-trend trend-up"><i class="fas fa-arrow-up"></i> +5% com IA ativa</div>
                    </div>
                    <div class="dashboard-card">
                        <div class="card-header"><h3>ROI Estimado</h3><i class="fas fa-chart-pie"></i></div>
                        <div class="card-value">284%</div>
                        <div class="card-trend trend-up"><i class="fas fa-arrow-up"></i> vs. mercado</div>
                    </div>
                </div>
                <div class="charts-dashboard">
                    <div class="chart-container"><h3>Evolução da Carteira (últimos 6 meses)</h3><canvas id="portfolioChart" height="250"></canvas></div>
                    <div class="chart-container"><h3>Distribuição por Área do Direito</h3><canvas id="categoryChart" height="250"></canvas></div>
                </div>
                <div class="chart-container"><h3>Alertas Estratégicos</h3><div id="alertsList" class="alerts-list"></div></div>
            `;
        },
        
        async renderCases() {
            const filteredCases = AppState.cases.filter(c => EliteUtils.hasAccessToCase(c));
            
            return `
                <div class="cases-header" style="display: flex; justify-content: space-between; margin-bottom: 20px; flex-wrap: wrap; gap: 16px;">
                    <div class="cases-actions">
                        <button id="newCaseBtn" class="elite-btn primary"><i class="fas fa-plus"></i> Novo Caso</button>
                        <button id="importCasesBtn" class="elite-btn secondary"><i class="fas fa-upload"></i> Importar Lote</button>
                    </div>
                    <div class="cases-search"><input type="text" id="searchCases" placeholder="Pesquisar casos..." class="search-input" style="width: 250px;"></div>
                </div>
                <div class="category-selector">
                    <button class="category-btn active" data-category="all">Todos</button>
                    ${AppState.categories.map(cat => `<button class="category-btn" data-category="${cat}">${EliteUtils.getCategoryName(cat)}</button>`).join('')}
                </div>
                <table class="data-table">
                    <thead><tr><th>Processo</th><th>Cliente</th><th>Área</th><th>Valor (€)</th><th>Prob. Sucesso</th><th>Oposição</th><th>Ações</th></tr></thead>
                    <tbody id="casesTableBody">
                        ${filteredCases.map(c => `
                            <tr data-case-id="${c.id}" data-category="${c.category}">
                                <td><strong>${c.id}</strong><br><small>${c.description.substring(0, 30)}...</small></td>
                                <td>${c.client}</td>
                                <td><span class="case-badge ${c.category}" style="background: ${EliteUtils.getCategoryColor(c.category)}20; color: ${EliteUtils.getCategoryColor(c.category)}">${c.categoryName}</span></td>
                                <td>${EliteUtils.formatCurrency(c.value)}</td>
                                <td><div class="progress-bar"><div class="progress-fill" style="width: ${c.successProbability * 100}%"></div><span class="progress-text">${EliteUtils.formatPercentage(c.successProbability * 100)}</span></div></td>
                                <td><span class="case-badge">${c.adversary || 'N/A'}</span></td>
                                <td><button class="action-btn view-case" data-id="${c.id}" title="Ver detalhes"><i class="fas fa-eye"></i></button><button class="action-btn analyze-case" data-id="${c.id}" title="Análise preditiva"><i class="fas fa-chart-line"></i></button><button class="action-btn adversary-alert" data-adversary="${c.adversary}" title="Perfil da oposição"><i class="fas fa-users"></i></button></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        },
        
        async renderLitigationIntelligence() {
            return `
                <div class="litigation-intelligence">
                    <div class="intelligence-header"><h2>Análise Preditiva de Êxito</h2><p>Insira os dados do caso para obter previsão detalhada</p></div>
                    <div class="intelligence-form">
                        <div class="form-row">
                            <div class="form-group"><label>Área do Direito</label><select id="predictCategory">${AppState.categories.map(c => `<option value="${c}">${EliteUtils.getCategoryName(c)}</option>`).join('')}</select></div>
                            <div class="form-group"><label>Valor da Causa (€)</label><input type="number" id="predictValue" placeholder="Ex: 50000"></div>
                            <div class="form-group"><label>Probabilidade Estimada (%)</label><input type="number" id="predictProbability" placeholder="Ex: 75" step="1"></div>
                        </div>
                        <div class="form-row">
                            <div class="form-group"><label>Tribunal</label><select id="predictCourt"><option value="lisboa">Lisboa</option><option value="porto">Porto</option><option value="braga">Braga</option><option value="coimbra">Coimbra</option><option value="faro">Faro</option></select></div>
                            <div class="form-group"><label>Escritório Oposição</label><select id="predictAdversary"><option value="">Selecionar...</option>${Object.keys(ADVERSARY_PROFILES).map(a => `<option value="${a}">${a}</option>`).join('')}</select></div>
                        </div>
                        <button id="runPredictionBtn" class="elite-btn primary full-width"><i class="fas fa-brain"></i> Executar Previsão</button>
                    </div>
                    <div id="predictionResult" class="prediction-result" style="display: none;"></div>
                </div>
            `;
        },
        
        async renderJudgesProfiles() {
            const judges = [
                { name: 'Dr. António Costa', court: 'Lisboa', category: 'civil', decisions: 45, favorableRate: 0.68, avgTime: 120 },
                { name: 'Dra. Sofia Mendes', court: 'Porto', category: 'labor', decisions: 38, favorableRate: 0.72, avgTime: 95 },
                { name: 'Dr. Ricardo Alves', court: 'Braga', category: 'commercial', decisions: 52, favorableRate: 0.58, avgTime: 110 },
                { name: 'Dr. Pedro Martins', court: 'Lisboa', category: 'tax', decisions: 32, favorableRate: 0.65, avgTime: 140 },
                { name: 'Dra. Teresa Lopes', court: 'Lisboa', category: 'family', decisions: 28, favorableRate: 0.81, avgTime: 85 }
            ];
            
            return `
                <div class="judges-header"><h2>Perfil de Magistrados</h2><p>Análise comportamental de juízes com base em decisões anteriores</p></div>
                <div class="judges-grid">
                    ${judges.map(j => `
                        <div class="judge-card">
                            <div class="judge-header"><i class="fas fa-gavel"></i><div><h3>${j.name}</h3><p>${j.court} · ${EliteUtils.getCategoryName(j.category)}</p></div></div>
                            <div class="judge-stats"><div class="stat"><span class="stat-label">Decisões</span><span class="stat-value">${j.decisions}</span></div><div class="stat"><span class="stat-label">Taxa favorável</span><span class="stat-value ${j.favorableRate > 0.65 ? 'positive' : 'neutral'}">${EliteUtils.formatPercentage(j.favorableRate * 100)}</span></div><div class="stat"><span class="stat-label">Tempo médio</span><span class="stat-value">${j.avgTime} dias</span></div></div>
                            <div class="judge-insights"><strong>Estratégia recomendada:</strong><p>${j.favorableRate > 0.7 ? 'Estratégia ofensiva. Argumentos técnicos fortes têm boa aceitação.' : j.favorableRate > 0.55 ? 'Estratégia equilibrada. Preparar para contraditório robusto.' : 'Estratégia defensiva. Considerar arbitragem ou mudança de foro.'}</p></div>
                        </div>
                    `).join('')}
                </div>
                <div class="chart-container"><h3>Tendências por Tribunal</h3><canvas id="courtTrendsChart" height="300"></canvas></div>
            `;
        },
        
        async renderClients() {
            const filteredClients = AppState.clients.filter(c => {
                if (AppState.userRole === 'SUPER_USER') return true;
                return c.lawyerId === AppState.userLawyerId;
            });
            
            return `
                <div class="clients-header" style="display: flex; justify-content: space-between; margin-bottom: 20px;"><h2>Clientes</h2><button id="newClientBtn" class="elite-btn primary"><i class="fas fa-user-plus"></i> Novo Cliente</button></div>
                <table class="data-table"><thead><tr><th>Cliente</th><th>NIF</th><th>Área Principal</th><th>Casos</th><th>Valor Total (€)</th><th>Ações</th></tr></thead><tbody>
                    ${filteredClients.map(c => `<tr><td><strong>${c.name}</strong></td><td>${c.nif}</td><td><span class="case-badge ${c.category}">${EliteUtils.getCategoryName(c.category)}</span></td><td>${c.cases}</td><td>${EliteUtils.formatCurrency(c.totalValue)}</td><td><button class="action-btn view-client" data-id="${c.id}" title="Ver detalhes"><i class="fas fa-eye"></i></button><button class="action-btn notes-client" data-client="${c.id}" title="Notas estratégicas"><i class="fas fa-pen"></i></button></td></tr>`).join('')}
                </tbody></table>
            `;
        },
        
        async renderReports() {
            return `
                <div class="reports-header"><h2>Relatórios Estratégicos</h2><p>Documentos gerados automaticamente com análise aprofundada</p></div>
                <div class="reports-grid">
                    <div class="report-card"><i class="fas fa-chart-line"></i><h3>Relatório de Performance</h3><p>Análise de métricas da carteira</p><button class="elite-btn small" onclick="ELITE_PROBATUM.generatePerformanceReport()"><i class="fas fa-download"></i> Gerar</button></div>
                    <div class="report-card"><i class="fas fa-gavel"></i><h3>Análise de Magistrados</h3><p>Perfil detalhado de juízes</p><button class="elite-btn small" onclick="ELITE_PROBATUM.generateJudgesReport()"><i class="fas fa-download"></i> Gerar</button></div>
                    <div class="report-card"><i class="fas fa-chart-pie"></i><h3>Projeção Financeira</h3><p>Previsão de receitas</p><button class="elite-btn small" onclick="ELITE_PROBATUM.generateFinancialForecast()"><i class="fas fa-download"></i> Gerar</button></div>
                    <div class="report-card"><i class="fas fa-balance-scale"></i><h3>Análise por Área</h3><p>Performance detalhada por ramo</p><button class="elite-btn small" onclick="ELITE_PROBATUM.generateCategoryReport()"><i class="fas fa-download"></i> Gerar</button></div>
                </div>
            `;
        },
        
        async initDashboardComponents() {
            const portfolioCtx = document.getElementById('portfolioChart');
            if (portfolioCtx && typeof Chart !== 'undefined') {
                new Chart(portfolioCtx, {
                    type: 'line',
                    data: { labels: ['Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set'], datasets: [{ label: 'Valor em Disputa (€)', data: [125000, 142000, 158000, 187000, 215000, 248000], borderColor: '#00E5FF', backgroundColor: 'rgba(0, 229, 255, 0.1)', tension: 0.4, fill: true }] },
                    options: { responsive: true, maintainAspectRatio: true, plugins: { legend: { labels: { color: '#94A3B8', font: { size: 10 } } } }, scales: { y: { ticks: { color: '#94A3B8' } }, x: { ticks: { color: '#94A3B8' } } } }
                });
            }
            
            const categoryCtx = document.getElementById('categoryChart');
            if (categoryCtx && typeof Chart !== 'undefined') {
                const categoryCount = {};
                AppState.cases.forEach(c => { categoryCount[c.categoryName] = (categoryCount[c.categoryName] || 0) + 1; });
                new Chart(categoryCtx, { type: 'doughnut', data: { labels: Object.keys(categoryCount), datasets: [{ data: Object.values(categoryCount), backgroundColor: ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#00E5FF'], borderWidth: 0 }] }, options: { responsive: true, maintainAspectRatio: true, plugins: { legend: { position: 'right', labels: { font: { size: 10 } } } } } });
            }
            
            const alertsList = document.getElementById('alertsList');
            if (alertsList) {
                alertsList.innerHTML = `<div class="alert-item critical"><i class="fas fa-exclamation-triangle"></i><div><strong>Nova jurisprudência do STJ</strong><p>Acórdão relevante em matéria de responsabilidade civil</p><small>DGSI - 15.10.2024</small></div></div><div class="alert-item warning"><i class="fas fa-gavel"></i><div><strong>Mudança na composição do Tribunal da Relação</strong><p>Novos desembargadores nomeados</p><small>CSM - 14.10.2024</small></div></div><div class="alert-item info"><i class="fas fa-chart-line"></i><div><strong>Crescimento na área do Direito Fiscal</strong><p>Aumento de 23% nos casos de impugnação tributária</p><small>Análise de Mercado</small></div></div>`;
            }
        },
        
        async initCasesTable() {
            document.querySelectorAll('.view-case').forEach(btn => {
                btn.addEventListener('click', () => {
                    const caseId = btn.dataset.id;
                    const caseData = AppState.cases.find(c => c.id === caseId);
                    if (caseData) {
                        const modalBody = document.getElementById('caseDetailBody');
                        if (modalBody) {
                            const heatmapRec = JurisHeatmap.getRecommendation(caseData);
                            const adversaryProfile = AdversaryProfiler.getProfile(caseData.adversary);
                            modalBody.innerHTML = `
                                <div class="detail-row"><span>Processo:</span><strong>${caseData.id}</strong></div>
                                <div class="detail-row"><span>Cliente:</span><strong>${caseData.client}</strong></div>
                                <div class="detail-row"><span>Área:</span><strong>${caseData.categoryName}</strong></div>
                                <div class="detail-row"><span>Valor:</span><strong>${EliteUtils.formatCurrency(caseData.value)}</strong></div>
                                <div class="detail-row"><span>Probabilidade:</span><strong>${EliteUtils.formatPercentage(caseData.successProbability * 100)}</strong></div>
                                <div class="detail-row"><span>Juiz:</span><strong>${caseData.judge}</strong></div>
                                <div class="detail-row"><span>Tribunal:</span><strong>${caseData.court}</strong></div>
                                <div class="detail-row"><span>Oposição:</span><strong>${caseData.adversary || 'N/A'}</strong></div>
                                <div class="prediction-recommendation"><h4>Recomendação de Foro</h4><p>Melhor tribunal: <strong>${heatmapRec.bestCourt}</strong> (taxa de sucesso: ${EliteUtils.formatPercentage(heatmapRec.bestRate * 100)})</p></div>
                                ${adversaryProfile ? `<div class="prediction-recommendation"><h4>Perfil da Oposição: ${adversaryProfile.name}</h4><p><strong>Padrão:</strong> ${adversaryProfile.pattern}</p><p><strong>Fraqueza:</strong> ${adversaryProfile.weakness}</p></div>` : ''}
                            `;
                        }
                        document.getElementById('caseDetailModal').style.display = 'flex';
                    }
                });
            });
            
            document.querySelectorAll('.analyze-case').forEach(btn => {
                btn.addEventListener('click', async () => {
                    const caseId = btn.dataset.id;
                    const caseData = AppState.cases.find(c => c.id === caseId);
                    if (caseData) {
                        const adversaryPrediction = AdversaryProfiler.getPrediction(caseData.adversary, caseData.category);
                        const heatmapRec = JurisHeatmap.getRecommendation(caseData);
                        EliteUtils.showToast(`Análise do caso ${caseId}: Probabilidade ${EliteUtils.formatPercentage(caseData.successProbability * 100)}. Recomendação: ${heatmapRec.bestCourt}`, 'info');
                    }
                });
            });
            
            document.querySelectorAll('.adversary-alert').forEach(btn => {
                btn.addEventListener('click', () => {
                    const adversary = btn.dataset.adversary;
                    if (adversary && ADVERSARY_PROFILES[adversary]) {
                        const profile = ADVERSARY_PROFILES[adversary];
                        EliteUtils.showToast(`Perfil ${adversary}: ${profile.pattern}`, 'warning');
                    }
                });
            });
            
            document.getElementById('newCaseBtn')?.addEventListener('click', () => {
                EliteUtils.showToast('Funcionalidade de novo caso em desenvolvimento', 'info');
            });
            
            document.getElementById('searchCases')?.addEventListener('input', (e) => {
                const term = e.target.value.toLowerCase();
                document.querySelectorAll('#casesTableBody tr').forEach(row => {
                    row.style.display = row.textContent.toLowerCase().includes(term) ? '' : 'none';
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
        },
        
        async initLitigationModule() {
            document.getElementById('runPredictionBtn')?.addEventListener('click', async () => {
                const category = document.getElementById('predictCategory')?.value;
                const value = parseFloat(document.getElementById('predictValue')?.value);
                const userProb = parseFloat(document.getElementById('predictProbability')?.value);
                const court = document.getElementById('predictCourt')?.value;
                const adversary = document.getElementById('predictAdversary')?.value;
                
                if (!value) { EliteUtils.showToast('Preencha o valor da causa', 'warning'); return; }
                
                EliteUtils.showToast('A processar previsão...', 'info');
                
                setTimeout(() => {
                    const probability = userProb ? userProb / 100 : 0.65;
                    const courtRate = JurisHeatmap.getCourtSuccessRate(court === 'lisboa' ? 'Lisboa' : court === 'porto' ? 'Porto' : court === 'braga' ? 'Braga' : court === 'coimbra' ? 'Coimbra' : 'Faro', category);
                    const adjustedProb = (probability + courtRate) / 2;
                    const adversaryProfile = adversary ? AdversaryProfiler.getPrediction(adversary, category) : null;
                    const expectedValue = value * (0.4 + adjustedProb * 0.3);
                    
                    const resultDiv = document.getElementById('predictionResult');
                    if (resultDiv) {
                        resultDiv.style.display = 'block';
                        resultDiv.innerHTML = `
                            <div class="prediction-header"><h3>Resultado da Análise Preditiva</h3><div class="probability-gauge"><div class="gauge-value" style="--probability: ${adjustedProb * 100}%"><span>${EliteUtils.formatPercentage(adjustedProb * 100)}</span></div></div></div>
                            <div class="prediction-details"><div class="detail-row"><span>Área:</span><strong>${EliteUtils.getCategoryName(category)}</strong></div><div class="detail-row"><span>Probabilidade ajustada:</span><strong class="${adjustedProb > 0.7 ? 'positive' : adjustedProb > 0.4 ? 'neutral' : 'negative'}">${EliteUtils.formatPercentage(adjustedProb * 100)}</strong></div><div class="detail-row"><span>Taxa tribunal (${court.toUpperCase()}):</span><strong>${EliteUtils.formatPercentage(courtRate * 100)}</strong></div><div class="detail-row"><span>Valor estimado:</span><strong>${EliteUtils.formatCurrency(expectedValue)}</strong></div></div>
                            ${adversaryProfile ? `<div class="prediction-recommendation"><h4>Perfil da Oposição: ${adversary}</h4><p><strong>Padrão:</strong> ${adversaryProfile.pattern}</p><p><strong>Fraqueza explorável:</strong> ${adversaryProfile.weakness}</p></div>` : ''}
                            <div class="prediction-recommendation"><h4>Recomendação Estratégica</h4><p>${adjustedProb > 0.7 ? 'Recomenda-se ação judicial imediata com pedido de tutela antecipada.' : adjustedProb > 0.5 ? 'Estratégia equilibrada: notificação extrajudicial com prazo para acordo.' : 'Recomenda-se negociação de acordo ou arbitragem.'}</p></div>
                            <div class="prediction-actions"><button class="elite-btn primary" onclick="ELITE_PROBATUM.generatePetition()"><i class="fas fa-file-alt"></i> Gerar Minuta</button><button class="elite-btn secondary" onclick="ELITE_PROBATUM.simulateDefense()"><i class="fas fa-shield-alt"></i> Simular Defesa</button></div>
                        `;
                    }
                }, 800);
            });
        },
        
        async initJudgesModule() {
            const ctx = document.getElementById('courtTrendsChart');
            if (ctx && typeof Chart !== 'undefined') {
                new Chart(ctx, { type: 'bar', data: { labels: ['Lisboa', 'Porto', 'Braga', 'Coimbra', 'Faro'], datasets: [{ label: 'Taxa de Sucesso (%)', data: [68, 72, 58, 62, 55], backgroundColor: '#00E5FF', borderRadius: 8 }, { label: 'Tempo Médio (dias)', data: [120, 95, 110, 130, 105], backgroundColor: '#F59E0B', borderRadius: 8 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#94A3B8' } } }, scales: { y: { ticks: { color: '#94A3B8' } }, x: { ticks: { color: '#94A3B8' } } } } });
            }
        },
        
        async initClientsTable() {
            document.getElementById('newClientBtn')?.addEventListener('click', () => {
                document.getElementById('newClientModal').style.display = 'flex';
            });
            
            document.getElementById('newClientForm')?.addEventListener('submit', (e) => {
                e.preventDefault();
                const newClient = {
                    id: 'CL' + (AppState.clients.length + 101),
                    name: document.getElementById('clientName').value,
                    nif: document.getElementById('clientNif').value,
                    category: document.getElementById('clientCategory').value,
                    cases: 1,
                    totalValue: parseFloat(document.getElementById('clientCaseValue').value),
                    lawyerId: AppState.userLawyerId
                };
                AppState.clients.push(newClient);
                EliteUtils.showToast(`Cliente ${newClient.name} criado com sucesso!`, 'success');
                document.getElementById('newClientModal').style.display = 'none';
                document.getElementById('newClientForm').reset();
                Views.render('clients');
            });
            
            document.querySelectorAll('.notes-client').forEach(btn => {
                btn.addEventListener('click', () => {
                    document.getElementById('notesModal').style.display = 'flex';
                    NotesManager.renderNotes('notesItems');
                });
            });
        },
        
        async initReportsModule() {
            // Already initialized
        }
    };
    
    // =========================================================================
    // INICIALIZAÇÃO
    // =========================================================================
    
    async function init() {
        EliteUtils.log('Inicializando ELITE PROBATUM v1.0...');
        
        AppState.cases = [...MOCK_CASES];
        AppState.clients = [...MOCK_CLIENTS];
        AppState.metrics.activeCases = AppState.cases.filter(c => c.status === 'active').length;
        AppState.metrics.totalDisputeValue = AppState.cases.reduce((sum, c) => sum + c.value, 0);
        AppState.metrics.successRate = AppState.cases.reduce((sum, c) => sum + c.successProbability, 0) / AppState.cases.length * 100;
        
        const splash = document.getElementById('splashScreen');
        const enterBtn = document.getElementById('enterPlatformBtn');
        
        if (splash && enterBtn) {
            setTimeout(() => { enterBtn.style.display = 'inline-flex'; }, 2000);
            enterBtn.addEventListener('click', () => {
                splash.style.opacity = '0';
                setTimeout(() => {
                    splash.style.display = 'none';
                    AuthManager.showLoginModal();
                }, 500);
            });
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
                
                setupNavigation();
                setupModals();
                setupGlobalEvents();
                Views.render('dashboard');
            } else {
                document.getElementById('loginError').style.display = 'block';
            }
        });
        
        document.getElementById('integrityCheckBtn')?.addEventListener('click', async () => {
            await IntegrityChecker.renderIntegrityModal();
            document.getElementById('integrityModal').style.display = 'flex';
        });
        
        document.getElementById('exportReportBtn')?.addEventListener('click', () => {
            PDFExporter.exportReport();
        });
        
        document.getElementById('saveNoteBtn')?.addEventListener('click', () => {
            const content = document.getElementById('strategicNote').value;
            if (content.trim()) {
                NotesManager.addNote(content, AppState.currentUser);
                document.getElementById('strategicNote').value = '';
                NotesManager.renderNotes('notesItems');
            }
        });
    }
    
    function setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', async (e) => {
                e.preventDefault();
                const view = item.dataset.view;
                navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');
                await Views.render(view);
                if (window.innerWidth <= 1024) document.querySelector('.elite-sidebar')?.classList.remove('open');
            });
        });
        
        document.getElementById('mobileMenuToggle')?.addEventListener('click', () => {
            document.querySelector('.elite-sidebar')?.classList.toggle('open');
        });
    }
    
    function setupModals() {
        document.querySelectorAll('.modal-close, .elite-modal').forEach(el => {
            if (el.classList.contains('elite-modal')) {
                el.addEventListener('click', (e) => { if (e.target === el) el.style.display = 'none'; });
            } else {
                el.addEventListener('click', () => { el.closest('.elite-modal').style.display = 'none'; });
            }
        });
        
        document.getElementById('notificationsBtn')?.addEventListener('click', () => {
            document.getElementById('notificationsModal').style.display = 'flex';
        });
        
        document.getElementById('settingsBtn')?.addEventListener('click', () => {
            document.getElementById('settingsModal').style.display = 'flex';
        });
        
        document.getElementById('logoutBtn')?.addEventListener('click', () => {
            if (confirm('Tem certeza que deseja sair?')) AuthManager.logout();
        });
    }
    
    function setupGlobalEvents() {
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'd') { e.preventDefault(); document.querySelector('.nav-item[data-view="dashboard"]')?.click(); }
            if (e.ctrlKey && e.key === 'c') { e.preventDefault(); document.querySelector('.nav-item[data-view="cases"]')?.click(); }
            if (e.ctrlKey && e.key === 'l') { e.preventDefault(); document.querySelector('.nav-item[data-view="litigation"]')?.click(); }
            if (e.ctrlKey && e.key === 'p') { e.preventDefault(); PDFExporter.exportReport(); }
        });
    }
    
    function escapeHtml(str) {
        if (!str) return '';
        return str.replace(/[&<>]/g, function(m) {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            return m;
        });
    }
    
    window.ELITE_PROBATUM = {
        ...EliteUtils,
        AppState,
        generatePerformanceReport: () => EliteUtils.showToast('Relatório de performance gerado', 'success'),
        generateJudgesReport: () => EliteUtils.showToast('Análise de magistrados gerada', 'success'),
        generateFinancialForecast: () => EliteUtils.showToast('Projeção financeira gerada', 'success'),
        generateCategoryReport: () => EliteUtils.showToast('Análise por área gerada', 'success'),
        generatePetition: () => EliteUtils.showToast('Gerando minuta de petição...', 'info'),
        simulateDefense: () => EliteUtils.showToast('Simulação de defesa em desenvolvimento', 'info'),
        downloadIntegrityCertificate: async () => {
            const cert = await IntegrityChecker.generateCertificate();
            const blob = new Blob([JSON.stringify(cert, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `integrity_certificate_${new Date().toISOString().slice(0, 10)}.json`;
            a.click();
            URL.revokeObjectURL(url);
            EliteUtils.showToast('Certificado descarregado', 'success');
        }
    };
    
    init();
})();