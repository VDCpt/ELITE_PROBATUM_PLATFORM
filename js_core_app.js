/**
 * ============================================================================
 * ELITE PROBATUM v1.0 — APLICAÇÃO PRINCIPAL
 * ============================================================================
 * Orquestra todos os módulos, gerencia estado, navegação e eventos globais
 * Versão atualizada para casos gerais de todas as áreas do direito
 * ============================================================================
 */

(function() {
    'use strict';
    
    // =========================================================================
    // ESTADO GLOBAL
    // =========================================================================
    
    const AppState = {
        // Dados
        cases: [],
        clients: [],
        lawyers: [],
        notifications: [],
        categories: ['civil', 'criminal', 'labor', 'commercial', 'administrative', 'tax', 'family', 'intellectual'],
        
        // Métricas
        metrics: {
            totalCases: 0,
            activeCases: 0,
            totalDisputeValue: 0,
            successRate: 0,
            avgROI: 0
        },
        
        // Config
        config: {
            enableAI: true,
            refreshInterval: 30000,
            autoSave: true
        },
        
        // UI
        currentView: 'dashboard',
        sidebarOpen: false,
        isLoading: false,
        currentCategory: 'all'
    };
    
    // =========================================================================
    // MÓDULOS REGISTADOS
    // =========================================================================
    
    const Modules = {};
    
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
        
        debounce: (func, wait) => {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },
        
        showToast: (message, type = 'info') => {
            const container = document.getElementById('toastContainer');
            const toast = document.createElement('div');
            toast.className = `toast ${type}`;
            
            const icons = {
                success: 'fa-check-circle',
                error: 'fa-exclamation-triangle',
                warning: 'fa-exclamation-circle',
                info: 'fa-info-circle'
            };
            
            toast.innerHTML = `
                <i class="fas ${icons[type]}"></i>
                <span>${message}</span>
            `;
            
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
                civil: 'Direito Civil',
                criminal: 'Direito Penal',
                labor: 'Direito do Trabalho',
                commercial: 'Direito Comercial',
                administrative: 'Direito Administrativo',
                tax: 'Direito Fiscal',
                family: 'Direito da Família',
                intellectual: 'Propriedade Intelectual',
                all: 'Todos os Casos'
            };
            return names[category] || category;
        },
        
        getCategoryColor: (category) => {
            const colors = {
                civil: '#3B82F6',
                criminal: '#EF4444',
                labor: '#10B981',
                commercial: '#F59E0B',
                administrative: '#8B5CF6',
                tax: '#00E5FF',
                family: '#EC489A',
                intellectual: '#14B8A6'
            };
            return colors[category] || '#64748B';
        }
    };
    
    // =========================================================================
    // API CLIENT (Simulado com casos gerais)
    // =========================================================================
    
    const API = {
        async getCases() {
            // Simular dados iniciais para diversas áreas do direito
            return [
                {
                    id: 'C001',
                    client: 'João Silva',
                    category: 'civil',
                    categoryName: 'Direito Civil',
                    value: 28450,
                    successProbability: 0.82,
                    status: 'active',
                    judge: 'Dr. António Costa',
                    court: 'Tribunal Judicial de Lisboa',
                    description: 'Incumprimento contratual - prestação de serviços',
                    createdAt: '2024-09-15'
                },
                {
                    id: 'C002',
                    client: 'Maria Santos',
                    category: 'labor',
                    categoryName: 'Direito do Trabalho',
                    value: 15720,
                    successProbability: 0.75,
                    status: 'active',
                    judge: 'Dra. Sofia Mendes',
                    court: 'Tribunal Judicial do Porto',
                    description: 'Despedimento ilícito - trabalhador',
                    createdAt: '2024-10-01'
                },
                {
                    id: 'C003',
                    client: 'António Pereira',
                    category: 'commercial',
                    categoryName: 'Direito Comercial',
                    value: 32400,
                    successProbability: 0.88,
                    status: 'pending',
                    judge: 'Dr. Ricardo Alves',
                    court: 'Tribunal Judicial de Braga',
                    description: 'Violação de acordo de acionistas',
                    createdAt: '2024-10-20'
                },
                {
                    id: 'C004',
                    client: 'Empresa XYZ',
                    category: 'tax',
                    categoryName: 'Direito Fiscal',
                    value: 125000,
                    successProbability: 0.68,
                    status: 'active',
                    judge: 'Dr. Pedro Martins',
                    court: 'Tribunal Administrativo de Lisboa',
                    description: 'Impugnação de liquidação de IVA',
                    createdAt: '2024-08-10'
                },
                {
                    id: 'C005',
                    client: 'Ana Rodrigues',
                    category: 'family',
                    categoryName: 'Direito da Família',
                    value: 8500,
                    successProbability: 0.91,
                    status: 'active',
                    judge: 'Dra. Teresa Lopes',
                    court: 'Tribunal de Família de Lisboa',
                    description: 'Regulação do poder paternal',
                    createdAt: '2024-09-25'
                },
                {
                    id: 'C006',
                    client: 'Carlos Mendes',
                    category: 'criminal',
                    categoryName: 'Direito Penal',
                    value: 0,
                    successProbability: 0.72,
                    status: 'active',
                    judge: 'Dr. João Costa',
                    court: 'Tribunal Criminal de Lisboa',
                    description: 'Recurso penal - recurso de condenação',
                    createdAt: '2024-10-05'
                },
                {
                    id: 'C007',
                    client: 'Tech Solutions Lda',
                    category: 'intellectual',
                    categoryName: 'Propriedade Intelectual',
                    value: 45200,
                    successProbability: 0.79,
                    status: 'active',
                    judge: 'Dra. Isabel Ferreira',
                    court: 'Tribunal da Propriedade Intelectual',
                    description: 'Violação de patente de software',
                    createdAt: '2024-09-18'
                },
                {
                    id: 'C008',
                    client: 'José Santos',
                    category: 'administrative',
                    categoryName: 'Direito Administrativo',
                    value: 18900,
                    successProbability: 0.64,
                    status: 'pending',
                    judge: 'Dr. Rui Silva',
                    court: 'Tribunal Administrativo do Porto',
                    description: 'Impugnação de ato administrativo',
                    createdAt: '2024-10-12'
                }
            ];
        },
        
        async getClients() {
            return [
                { id: 'CL001', name: 'João Silva', nif: '123456789', category: 'civil', cases: 1, totalValue: 28450 },
                { id: 'CL002', name: 'Maria Santos', nif: '987654321', category: 'labor', cases: 1, totalValue: 15720 },
                { id: 'CL003', name: 'António Pereira', nif: '456789123', category: 'commercial', cases: 1, totalValue: 32400 },
                { id: 'CL004', name: 'Empresa XYZ', nif: '502345678', category: 'tax', cases: 1, totalValue: 125000 },
                { id: 'CL005', name: 'Ana Rodrigues', nif: '789123456', category: 'family', cases: 1, totalValue: 8500 },
                { id: 'CL006', name: 'Carlos Mendes', nif: '321654987', category: 'criminal', cases: 1, totalValue: 0 },
                { id: 'CL007', name: 'Tech Solutions Lda', nif: '512345678', category: 'intellectual', cases: 1, totalValue: 45200 },
                { id: 'CL008', name: 'José Santos', nif: '654987321', category: 'administrative', cases: 1, totalValue: 18900 }
            ];
        },
        
        async getJudges() {
            return [
                { name: 'Dr. António Costa', court: 'Lisboa', category: 'civil', decisions: 45, favorableRate: 0.68, avgTime: 120 },
                { name: 'Dra. Sofia Mendes', court: 'Porto', category: 'labor', decisions: 38, favorableRate: 0.72, avgTime: 95 },
                { name: 'Dr. Ricardo Alves', court: 'Braga', category: 'commercial', decisions: 52, favorableRate: 0.58, avgTime: 110 },
                { name: 'Dr. Pedro Martins', court: 'Lisboa', category: 'tax', decisions: 32, favorableRate: 0.65, avgTime: 140 },
                { name: 'Dra. Teresa Lopes', court: 'Lisboa', category: 'family', decisions: 28, favorableRate: 0.81, avgTime: 85 },
                { name: 'Dr. João Costa', court: 'Lisboa', category: 'criminal', decisions: 56, favorableRate: 0.59, avgTime: 115 }
            ];
        }
    };
    
    // =========================================================================
    // RENDERIZAÇÃO DAS VIEWS
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
                clients: 'Clientes',
                reports: 'Relatórios'
            };
            return titles[viewName] || viewName;
        },
        
        async renderDashboard() {
            const cases = await API.getCases();
            const activeCases = cases.filter(c => c.status === 'active').length;
            const totalValue = cases.reduce((sum, c) => sum + c.value, 0);
            const avgProbability = cases.reduce((sum, c) => sum + c.successProbability, 0) / cases.length;
            
            return `
                <div class="dashboard-grid">
                    <div class="dashboard-card">
                        <div class="card-header">
                            <h3>Casos Ativos</h3>
                            <i class="fas fa-folder-open"></i>
                        </div>
                        <div class="card-value">${activeCases}</div>
                        <div class="card-trend trend-up">
                            <i class="fas fa-arrow-up"></i> +12% este mês
                        </div>
                    </div>
                    
                    <div class="dashboard-card">
                        <div class="card-header">
                            <h3>Valor em Disputa</h3>
                            <i class="fas fa-euro-sign"></i>
                        </div>
                        <div class="card-value">${EliteUtils.formatCurrency(totalValue)}</div>
                        <div class="card-trend trend-up">
                            <i class="fas fa-arrow-up"></i> +8% vs período anterior
                        </div>
                    </div>
                    
                    <div class="dashboard-card">
                        <div class="card-header">
                            <h3>Probabilidade Média</h3>
                            <i class="fas fa-chart-line"></i>
                        </div>
                        <div class="card-value">${EliteUtils.formatPercentage(avgProbability * 100)}</div>
                        <div class="card-trend trend-up">
                            <i class="fas fa-arrow-up"></i> +5% com IA ativa
                        </div>
                    </div>
                    
                    <div class="dashboard-card">
                        <div class="card-header">
                            <h3>ROI Estimado</h3>
                            <i class="fas fa-chart-pie"></i>
                        </div>
                        <div class="card-value">284%</div>
                        <div class="card-trend trend-up">
                            <i class="fas fa-arrow-up"></i> vs. mercado
                        </div>
                    </div>
                </div>
                
                <div class="charts-dashboard">
                    <div class="chart-container">
                        <h3>Evolução da Carteira (últimos 6 meses)</h3>
                        <canvas id="portfolioChart" height="250"></canvas>
                    </div>
                    
                    <div class="chart-container">
                        <h3>Distribuição por Área do Direito</h3>
                        <canvas id="categoryChart" height="250"></canvas>
                    </div>
                </div>
                
                <div class="chart-container">
                    <h3>Top Alertas Estratégicos</h3>
                    <div id="alertsList" class="alerts-list"></div>
                </div>
            `;
        },
        
        async renderCases() {
            const cases = await API.getCases();
            const categories = AppState.categories;
            
            return `
                <div class="cases-header" style="display: flex; justify-content: space-between; margin-bottom: 20px; flex-wrap: wrap; gap: 16px;">
                    <div class="cases-actions">
                        <button id="newCaseBtn" class="elite-btn primary">
                            <i class="fas fa-plus"></i> Novo Caso
                        </button>
                        <button id="importCasesBtn" class="elite-btn secondary">
                            <i class="fas fa-upload"></i> Importar Lote
                        </button>
                    </div>
                    <div class="cases-search">
                        <input type="text" id="searchCases" placeholder="Pesquisar casos..." class="search-input" style="width: 250px;">
                    </div>
                </div>
                
                <div class="category-selector">
                    <button class="category-btn active" data-category="all">Todos</button>
                    ${categories.map(cat => `
                        <button class="category-btn" data-category="${cat}">${EliteUtils.getCategoryName(cat)}</button>
                    `).join('')}
                </div>
                
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Processo</th>
                            <th>Cliente</th>
                            <th>Área</th>
                            <th>Valor (€)</th>
                            <th>Prob. Sucesso</th>
                            <th>Status</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody id="casesTableBody">
                        ${cases.map(c => `
                            <tr data-case-id="${c.id}" data-category="${c.category}">
                                <td><strong>${c.id}</strong><br><small>${c.description.substring(0, 30)}...</small></td>
                                <td>${c.client}</td>
                                <td><span class="case-badge ${c.category}" style="background: ${EliteUtils.getCategoryColor(c.category)}20; color: ${EliteUtils.getCategoryColor(c.category)}">${c.categoryName}</span></td>
                                <td>${EliteUtils.formatCurrency(c.value)}</td>
                                <td>
                                    <div class="progress-bar">
                                        <div class="progress-fill" style="width: ${c.successProbability * 100}%"></div>
                                        <span class="progress-text">${EliteUtils.formatPercentage(c.successProbability * 100)}</span>
                                    </div>
                                </td>
                                <td><span class="status-badge status-${c.status}">${c.status === 'active' ? 'Ativo' : 'Pendente'}</span></td>
                                <td>
                                    <button class="action-btn view-case" data-id="${c.id}" title="Ver detalhes">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                    <button class="action-btn analyze-case" data-id="${c.id}" title="Análise preditiva">
                                        <i class="fas fa-chart-line"></i>
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        },
        
        async renderLitigationIntelligence() {
            return `
                <div class="litigation-intelligence">
                    <div class="intelligence-header">
                        <h2>Análise Preditiva de Êxito</h2>
                        <p>Insira os dados do caso para obter previsão detalhada em qualquer área do direito</p>
                    </div>
                    
                    <div class="intelligence-form">
                        <div class="form-row">
                            <div class="form-group">
                                <label>Área do Direito</label>
                                <select id="predictCategory">
                                    <option value="civil">Direito Civil</option>
                                    <option value="criminal">Direito Penal</option>
                                    <option value="labor">Direito do Trabalho</option>
                                    <option value="commercial">Direito Comercial</option>
                                    <option value="administrative">Direito Administrativo</option>
                                    <option value="tax">Direito Fiscal</option>
                                    <option value="family">Direito da Família</option>
                                    <option value="intellectual">Propriedade Intelectual</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Valor da Causa (€)</label>
                                <input type="number" id="predictValue" placeholder="Ex: 50000">
                            </div>
                            <div class="form-group">
                                <label>Probabilidade Estimada (%)</label>
                                <input type="number" id="predictProbability" placeholder="Ex: 75" step="1">
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Tribunal</label>
                                <select id="predictCourt">
                                    <option value="lisboa">Lisboa</option>
                                    <option value="porto">Porto</option>
                                    <option value="braga">Braga</option>
                                    <option value="coimbra">Coimbra</option>
                                    <option value="faro">Faro</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Juiz (opcional)</label>
                                <input type="text" id="predictJudge" placeholder="Nome do juiz">
                            </div>
                            <div class="form-group">
                                <label>Complexidade do Caso</label>
                                <select id="predictComplexity">
                                    <option value="low">Baixa</option>
                                    <option value="medium" selected>Média</option>
                                    <option value="high">Alta</option>
                                </select>
                            </div>
                        </div>
                        <button id="runPredictionBtn" class="elite-btn primary full-width">
                            <i class="fas fa-brain"></i> Executar Previsão
                        </button>
                    </div>
                    
                    <div id="predictionResult" class="prediction-result" style="display: none;">
                        <!-- Resultados da previsão serão inseridos aqui -->
                    </div>
                </div>
            `;
        },
        
        async renderJudgesProfiles() {
            const judges = await API.getJudges();
            
            return `
                <div class="judges-header">
                    <h2>Perfil de Magistrados</h2>
                    <p>Análise comportamental de juízes com base em decisões anteriores</p>
                </div>
                
                <div class="judges-grid">
                    ${judges.map(j => `
                        <div class="judge-card" data-judge="${j.name}">
                            <div class="judge-header">
                                <i class="fas fa-gavel"></i>
                                <div>
                                    <h3>${j.name}</h3>
                                    <p>${j.court} · ${EliteUtils.getCategoryName(j.category)}</p>
                                </div>
                            </div>
                            <div class="judge-stats">
                                <div class="stat">
                                    <span class="stat-label">Decisões analisadas</span>
                                    <span class="stat-value">${j.decisions}</span>
                                </div>
                                <div class="stat">
                                    <span class="stat-label">Taxa favorável</span>
                                    <span class="stat-value ${j.favorableRate > 0.65 ? 'positive' : 'neutral'}">${EliteUtils.formatPercentage(j.favorableRate * 100)}</span>
                                </div>
                                <div class="stat">
                                    <span class="stat-label">Tempo médio</span>
                                    <span class="stat-value">${j.avgTime} dias</span>
                                </div>
                            </div>
                            <div class="judge-insights">
                                <strong>Estratégia recomendada:</strong>
                                <p>${this.getRecommendedStrategy(j)}</p>
                            </div>
                            <button class="elite-btn small view-judge-detail" data-judge="${j.name}">
                                Ver análise detalhada
                            </button>
                        </div>
                    `).join('')}
                </div>
                
                <div class="chart-container">
                    <h3>Tendências por Tribunal</h3>
                    <canvas id="courtTrendsChart" height="300"></canvas>
                </div>
            `;
        },
        
        getRecommendedStrategy(judge) {
            if (judge.favorableRate > 0.7) {
                return "Estratégia ofensiva. Argumentos técnicos fortes têm boa aceitação. Foco em prova documental e jurisprudência consolidada.";
            } else if (judge.favorableRate > 0.55) {
                return "Estratégia equilibrada. Preparar para contraditório robusto. Valorizar acordos e soluções consensuais.";
            } else {
                return "Estratégia defensiva. Considerar arbitragem ou mudança de foro. Fortalecer provas e explorar precedentes favoráveis.";
            }
        },
        
        async renderClients() {
            const clients = await API.getClients();
            
            return `
                <div class="clients-header" style="display: flex; justify-content: space-between; margin-bottom: 20px;">
                    <h2>Clientes</h2>
                    <button id="newClientBtn" class="elite-btn primary">
                        <i class="fas fa-user-plus"></i> Novo Cliente
                    </button>
                </div>
                
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Cliente</th>
                            <th>NIF</th>
                            <th>Área Principal</th>
                            <th>Casos</th>
                            <th>Valor Total (€)</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${clients.map(c => `
                             <tr>
                                <td><strong>${c.name}</strong></td>
                                <td>${c.nif}</td>
                                <td><span class="case-badge ${c.category}" style="background: ${EliteUtils.getCategoryColor(c.category)}20; color: ${EliteUtils.getCategoryColor(c.category)}">${EliteUtils.getCategoryName(c.category)}</span></td>
                                <td>${c.cases}</td>
                                <td>${EliteUtils.formatCurrency(c.totalValue)}</td>
                                <td>
                                    <button class="action-btn view-client" data-id="${c.id}" title="Ver detalhes">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                    <button class="action-btn access-portal" data-client="${c.id}" title="Portal do Cliente">
                                        <i class="fas fa-external-link-alt"></i>
                                    </button>
                                </td>
                             </tr>
                        `).join('')}
                    </tbody>
                 </table>
            `;
        },
        
        async renderReports() {
            return `
                <div class="reports-header">
                    <h2>Relatórios Estratégicos</h2>
                    <p>Documentos gerados automaticamente com análise aprofundada</p>
                </div>
                
                <div class="reports-grid">
                    <div class="report-card">
                        <i class="fas fa-chart-line"></i>
                        <h3>Relatório de Performance</h3>
                        <p>Análise de métricas da carteira, taxas de sucesso e ROI por área do direito</p>
                        <button class="elite-btn small" onclick="ELITE_PROBATUM.generatePerformanceReport()">
                            <i class="fas fa-download"></i> Gerar
                        </button>
                    </div>
                    
                    <div class="report-card">
                        <i class="fas fa-gavel"></i>
                        <h3>Análise de Magistrados</h3>
                        <p>Perfil detalhado de juízes e tendências por tribunal e área</p>
                        <button class="elite-btn small" onclick="ELITE_PROBATUM.generateJudgesReport()">
                            <i class="fas fa-download"></i> Gerar
                        </button>
                    </div>
                    
                    <div class="report-card">
                        <i class="fas fa-chart-pie"></i>
                        <h3>Projeção Financeira</h3>
                        <p>Previsão de receitas e cash flow para 12 meses</p>
                        <button class="elite-btn small" onclick="ELITE_PROBATUM.generateFinancialForecast()">
                            <i class="fas fa-download"></i> Gerar
                        </button>
                    </div>
                    
                    <div class="report-card">
                        <i class="fas fa-balance-scale"></i>
                        <h3>Análise por Área</h3>
                        <p>Performance detalhada por ramo do direito</p>
                        <button class="elite-btn small" onclick="ELITE_PROBATUM.generateCategoryReport()">
                            <i class="fas fa-download"></i> Gerar
                        </button>
                    </div>
                </div>
                
                <div class="scheduled-reports">
                    <h3>Relatórios Agendados</h3>
                    <table class="data-table">
                        <thead>
                            <tr><th>Relatório</th><th>Frequência</th><th>Próxima Execução</th><th>Destinatários</th><th>Ações</th></tr>
                        </thead>
                        <tbody>
                            <tr><td>Dashboard Executivo</td><td>Semanal</td><td>Segunda-feira, 09:00</td><td>Sócios (5)</td>
                            <td><button class="action-btn"><i class="fas fa-edit"></i></button><button class="action-btn"><i class="fas fa-trash"></i></button></td></tr>
                            <tr><td>Análise por Área</td><td>Mensal</td><td>1 de cada mês, 10:00</td><td>Equipa de Litígio (12)</td>
                            <td><button class="action-btn"><i class="fas fa-edit"></i></button><button class="action-btn"><i class="fas fa-trash"></i></button></td></tr>
                        </tbody>
                    </table>
                    <button class="elite-btn secondary" id="scheduleReportBtn">
                        <i class="fas fa-calendar-plus"></i> Agendar Novo Relatório
                    </button>
                </div>
            `;
        },
        
        async initDashboardComponents() {
            const cases = await API.getCases();
            
            // Gráfico de portfólio - tamanho reduzido
            const portfolioCtx = document.getElementById('portfolioChart');
            if (portfolioCtx && typeof Chart !== 'undefined') {
                new Chart(portfolioCtx, {
                    type: 'line',
                    data: {
                        labels: ['Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set'],
                        datasets: [{
                            label: 'Valor em Disputa (€)',
                            data: [125000, 142000, 158000, 187000, 215000, 248000],
                            borderColor: '#00E5FF',
                            backgroundColor: 'rgba(0, 229, 255, 0.1)',
                            tension: 0.4,
                            fill: true,
                            pointRadius: 3,
                            pointHoverRadius: 6
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: true,
                        plugins: {
                            legend: { labels: { color: '#94A3B8', font: { size: 10 } } },
                            tooltip: { mode: 'index', intersect: false }
                        },
                        scales: {
                            y: { ticks: { color: '#94A3B8', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,0.05)' } },
                            x: { ticks: { color: '#94A3B8', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,0.05)' } }
                        }
                    }
                });
            }
            
            // Gráfico de categorias (substituindo plataformas)
            const categoryCtx = document.getElementById('categoryChart');
            if (categoryCtx && typeof Chart !== 'undefined') {
                const categoryCount = {};
                cases.forEach(c => {
                    categoryCount[c.categoryName] = (categoryCount[c.categoryName] || 0) + 1;
                });
                
                const categoryColors = {
                    'Direito Civil': '#3B82F6',
                    'Direito Penal': '#EF4444',
                    'Direito do Trabalho': '#10B981',
                    'Direito Comercial': '#F59E0B',
                    'Direito Administrativo': '#8B5CF6',
                    'Direito Fiscal': '#00E5FF',
                    'Direito da Família': '#EC489A',
                    'Propriedade Intelectual': '#14B8A6'
                };
                
                new Chart(categoryCtx, {
                    type: 'doughnut',
                    data: {
                        labels: Object.keys(categoryCount),
                        datasets: [{
                            data: Object.values(categoryCount),
                            backgroundColor: Object.keys(categoryCount).map(c => categoryColors[c] || '#64748B'),
                            borderWidth: 0
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: true,
                        plugins: {
                            legend: { 
                                position: 'right',
                                labels: { color: '#94A3B8', font: { size: 10 }, boxWidth: 10 }
                            },
                            tooltip: { callbacks: { label: (ctx) => `${ctx.label}: ${ctx.raw} casos` } }
                        }
                    }
                });
            }
            
            // Carregar alertas
            const alertsList = document.getElementById('alertsList');
            if (alertsList) {
                alertsList.innerHTML = `
                    <div class="alert-item critical">
                        <i class="fas fa-exclamation-triangle"></i>
                        <div>
                            <strong>Nova jurisprudência do Supremo Tribunal de Justiça</strong>
                            <p>Acórdão relevante em matéria de responsabilidade civil</p>
                            <small>Fonte: DGSI - 15.10.2024</small>
                        </div>
                    </div>
                    <div class="alert-item warning">
                        <i class="fas fa-gavel"></i>
                        <div>
                            <strong>Mudança na composição do Tribunal da Relação</strong>
                            <p>Novos desembargadores nomeados - atualizar perfis</p>
                            <small>Fonte: CSM - 14.10.2024</small>
                        </div>
                    </div>
                    <div class="alert-item info">
                        <i class="fas fa-chart-line"></i>
                        <div>
                            <strong>Crescimento na área do Direito Fiscal</strong>
                            <p>Aumento de 23% nos casos de impugnação tributária</p>
                            <small>Análise de Mercado - Outubro 2024</small>
                        </div>
                    </div>
                `;
            }
        },
        
        async initCasesTable() {
            document.querySelectorAll('.view-case').forEach(btn => {
                btn.addEventListener('click', () => {
                    const caseId = btn.dataset.id;
                    EliteUtils.showToast(`Abrindo detalhes do caso ${caseId}`, 'info');
                });
            });
            
            document.querySelectorAll('.analyze-case').forEach(btn => {
                btn.addEventListener('click', () => {
                    const caseId = btn.dataset.id;
                    this.showCasePrediction(caseId);
                });
            });
            
            document.getElementById('newCaseBtn')?.addEventListener('click', () => {
                this.showNewCaseModal();
            });
            
            document.getElementById('searchCases')?.addEventListener('input', (e) => {
                this.filterCases(e.target.value);
            });
            
            // Category filters
            document.querySelectorAll('.category-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    const category = btn.dataset.category;
                    this.filterCasesByCategory(category);
                });
            });
        },
        
        filterCasesByCategory(category) {
            const rows = document.querySelectorAll('#casesTableBody tr');
            rows.forEach(row => {
                if (category === 'all' || row.dataset.category === category) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        },
        
        async initLitigationModule() {
            document.getElementById('runPredictionBtn')?.addEventListener('click', async () => {
                await this.runPrediction();
            });
        },
        
        async runPrediction() {
            const category = document.getElementById('predictCategory')?.value;
            const value = parseFloat(document.getElementById('predictValue')?.value);
            const userProbability = parseFloat(document.getElementById('predictProbability')?.value);
            const court = document.getElementById('predictCourt')?.value;
            const judge = document.getElementById('predictJudge')?.value;
            const complexity = document.getElementById('predictComplexity')?.value;
            
            if (!value) {
                EliteUtils.showToast('Preencha o valor da causa', 'warning');
                return;
            }
            
            EliteUtils.showToast('A processar previsão...', 'info');
            
            setTimeout(() => {
                const probability = userProbability ? userProbability / 100 : this.calculateProbability(category, value, complexity);
                const expectedSettlement = this.calculateExpectedSettlement(value, probability);
                const recommendedFee = this.calculateRecommendedFee(value, probability);
                
                const resultDiv = document.getElementById('predictionResult');
                if (resultDiv) {
                    resultDiv.style.display = 'block';
                    resultDiv.innerHTML = `
                        <div class="prediction-header">
                            <h3>Resultado da Análise Preditiva</h3>
                            <div class="probability-gauge">
                                <div class="gauge-value" style="--probability: ${probability * 100}%">
                                    <span>${EliteUtils.formatPercentage(probability * 100)}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="prediction-details">
                            <div class="detail-row">
                                <span>Área do Direito:</span>
                                <strong>${EliteUtils.getCategoryName(category)}</strong>
                            </div>
                            <div class="detail-row">
                                <span>Probabilidade de êxito:</span>
                                <strong class="${probability > 0.7 ? 'positive' : probability > 0.4 ? 'neutral' : 'negative'}">
                                    ${EliteUtils.formatPercentage(probability * 100)}
                                </strong>
                            </div>
                            <div class="detail-row">
                                <span>Valor estimado de êxito:</span>
                                <strong>${EliteUtils.formatCurrency(expectedSettlement)}</strong>
                            </div>
                            <div class="detail-row">
                                <span>Honorários recomendados:</span>
                                <strong>${EliteUtils.formatCurrency(recommendedFee)}</strong>
                            </div>
                            <div class="detail-row">
                                <span>Duração estimada do processo:</span>
                                <strong>${this.estimateDuration(court, complexity)}</strong>
                            </div>
                        </div>
                        
                        <div class="prediction-recommendation">
                            <h4>Estratégia Recomendada</h4>
                            <p>${this.getGeneralRecommendation(probability, value, expectedSettlement, category)}</p>
                        </div>
                        
                        <div class="prediction-actions">
                            <button class="elite-btn primary" onclick="ELITE_PROBATUM.generatePetition()">
                                <i class="fas fa-file-alt"></i> Gerar Minuta de Petição
                            </button>
                            <button class="elite-btn secondary" onclick="ELITE_PROBATUM.simulateDefense()">
                                <i class="fas fa-shield-alt"></i> Simular Defesa
                            </button>
                        </div>
                    `;
                }
            }, 1000);
        },
        
        calculateProbability(category, value, complexity) {
            let prob = 0.55;
            
            const categoryFactors = {
                civil: 0.05,
                criminal: -0.02,
                labor: 0.08,
                commercial: 0.03,
                administrative: 0.02,
                tax: 0.04,
                family: 0.10,
                intellectual: 0.06
            };
            prob += categoryFactors[category] || 0;
            
            if (value > 100000) prob += 0.05;
            else if (value > 50000) prob += 0.03;
            else if (value > 10000) prob += 0.02;
            
            if (complexity === 'low') prob += 0.08;
            else if (complexity === 'high') prob -= 0.05;
            
            return Math.min(Math.max(prob, 0.25), 0.92);
        },
        
        calculateExpectedSettlement(value, probability) {
            return value * (0.4 + probability * 0.3);
        },
        
        calculateRecommendedFee(value, probability) {
            const baseFee = value * 0.15;
            const riskAdjustment = (1 - probability) * value * 0.1;
            return Math.min(baseFee + riskAdjustment, value * 0.35);
        },
        
        estimateDuration(court, complexity) {
            const baseDurations = {
                lisboa: 12,
                porto: 10,
                braga: 14,
                coimbra: 16,
                faro: 13
            };
            let months = baseDurations[court] || 12;
            if (complexity === 'high') months += 6;
            if (complexity === 'low') months -= 3;
            return `${Math.max(months, 6)}-${months + 6} meses`;
        },
        
        getGeneralRecommendation(probability, value, expectedSettlement, category) {
            if (probability > 0.75) {
                return `Recomenda-se ação judicial imediata. A alta probabilidade de êxito (${EliteUtils.formatPercentage(probability * 100)}) 
                        justifica litígio até julgamento. O valor estimado de êxito (${EliteUtils.formatCurrency(expectedSettlement)}) 
                        é superior à média para casos de ${EliteUtils.getCategoryName(category)}.`;
            } else if (probability > 0.55) {
                return `Estratégia equilibrada: notificação extrajudicial com prazo para acordo. 
                        Se não houver resposta favorável em 15 dias, avançar com ação judicial. 
                        O valor estimado (${EliteUtils.formatCurrency(expectedSettlement)}) é razoável para este tipo de caso.`;
            } else {
                return `Recomenda-se negociação de acordo. A probabilidade de êxito (${EliteUtils.formatPercentage(probability * 100)}) 
                        sugere que litígio pode não ser a melhor opção. Considere também arbitragem ou mediação como alternativas.`;
            }
        },
        
        async initJudgesModule() {
            const ctx = document.getElementById('courtTrendsChart');
            if (ctx && typeof Chart !== 'undefined') {
                new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: ['Lisboa', 'Porto', 'Braga', 'Coimbra', 'Faro'],
                        datasets: [
                            {
                                label: 'Taxa de Sucesso (%)',
                                data: [68, 72, 58, 62, 55],
                                backgroundColor: '#00E5FF',
                                borderRadius: 8
                            },
                            {
                                label: 'Tempo Médio (dias)',
                                data: [120, 95, 110, 130, 105],
                                backgroundColor: '#F59E0B',
                                borderRadius: 8
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { labels: { color: '#94A3B8' } }
                        },
                        scales: {
                            y: { ticks: { color: '#94A3B8' }, grid: { color: 'rgba(255,255,255,0.05)' } },
                            x: { ticks: { color: '#94A3B8' }, grid: { color: 'rgba(255,255,255,0.05)' } }
                        }
                    }
                });
            }
            
            document.querySelectorAll('.view-judge-detail').forEach(btn => {
                btn.addEventListener('click', () => {
                    const judge = btn.dataset.judge;
                    EliteUtils.showToast(`Análise detalhada do ${judge}`, 'info');
                });
            });
        },
        
        async initClientsTable() {
            document.querySelectorAll('.access-portal').forEach(btn => {
                btn.addEventListener('click', () => {
                    const clientId = btn.dataset.client;
                    this.openClientPortal(clientId);
                });
            });
        },
        
        openClientPortal(clientId) {
            EliteUtils.showToast(`A abrir portal do cliente ${clientId}`, 'info');
        },
        
        async initReportsModule() {
            document.getElementById('scheduleReportBtn')?.addEventListener('click', () => {
                EliteUtils.showToast('Agendamento de relatórios em desenvolvimento', 'info');
            });
        },
        
        showCasePrediction(caseId) {
            EliteUtils.showToast(`A analisar caso ${caseId}...`, 'info');
        },
        
        showNewCaseModal() {
            EliteUtils.showToast('Funcionalidade de novo caso em desenvolvimento', 'info');
        },
        
        filterCases(searchTerm) {
            const rows = document.querySelectorAll('#casesTableBody tr');
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(searchTerm.toLowerCase()) ? '' : 'none';
            });
        },
        
        generatePerformanceReport() {
            EliteUtils.showToast('A gerar relatório de performance...', 'info');
            setTimeout(() => {
                EliteUtils.showToast('Relatório gerado com sucesso!', 'success');
            }, 1500);
        },
        
        generateJudgesReport() {
            EliteUtils.showToast('A gerar análise de magistrados...', 'info');
        },
        
        generateFinancialForecast() {
            EliteUtils.showToast('A gerar projeção financeira...', 'info');
        },
        
        generateCategoryReport() {
            EliteUtils.showToast('A gerar análise por área do direito...', 'info');
        }
    };
    
    // =========================================================================
    // INICIALIZAÇÃO
    // =========================================================================
    
    async function init() {
        EliteUtils.log('Inicializando ELITE PROBATUM v1.0...');
        
        // Aguardar splash screen
        const splash = document.getElementById('splashScreen');
        const enterBtn = document.getElementById('enterPlatformBtn');
        
        if (splash && enterBtn) {
            setTimeout(() => {
                enterBtn.style.display = 'inline-flex';
                const loaderText = document.querySelector('.loader-text');
                if (loaderText) loaderText.textContent = 'Pronto! Clique para entrar';
            }, 2500);
            
            enterBtn.addEventListener('click', () => {
                splash.style.opacity = '0';
                setTimeout(() => {
                    splash.style.display = 'none';
                    const app = document.getElementById('appContainer');
                    if (app) {
                        app.style.display = 'flex';
                        setTimeout(() => {
                            app.classList.add('visible');
                        }, 50);
                    }
                }, 500);
            });
        }
        
        // Carregar dados iniciais
        AppState.cases = await API.getCases();
        AppState.clients = await API.getClients();
        AppState.metrics.activeCases = AppState.cases.filter(c => c.status === 'active').length;
        AppState.metrics.totalDisputeValue = AppState.cases.reduce((sum, c) => sum + c.value, 0);
        AppState.metrics.successRate = AppState.cases.reduce((sum, c) => sum + c.successProbability, 0) / AppState.cases.length * 100;
        
        // Atualizar badges do header
        document.getElementById('headerActiveCases').textContent = AppState.metrics.activeCases;
        document.getElementById('headerDisputeValue').textContent = EliteUtils.formatCurrency(AppState.metrics.totalDisputeValue);
        document.getElementById('headerSuccessRate').textContent = EliteUtils.formatPercentage(AppState.metrics.successRate);
        document.getElementById('casesBadge').textContent = AppState.cases.length;
        document.getElementById('clientsBadge').textContent = AppState.clients.length;
        
        // Configurar navegação
        setupNavigation();
        
        // Configurar modais
        setupModals();
        
        // Configurar eventos globais
        setupGlobalEvents();
        
        // Renderizar view inicial
        await Views.render('dashboard');
        
        EliteUtils.log('✅ ELITE PROBATUM inicializada com sucesso!', 'success');
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
                
                if (window.innerWidth <= 1024) {
                    document.querySelector('.elite-sidebar').classList.remove('open');
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
    }
    
    function setupModals() {
        const notifBtn = document.getElementById('notificationsBtn');
        const notifModal = document.getElementById('notificationsModal');
        if (notifBtn && notifModal) {
            notifBtn.addEventListener('click', () => {
                notifModal.style.display = 'flex';
            });
        }
        
        const settingsBtn = document.getElementById('settingsBtn');
        const settingsModal = document.getElementById('settingsModal');
        if (settingsBtn && settingsModal) {
            settingsBtn.addEventListener('click', () => {
                settingsModal.style.display = 'flex';
            });
        }
        
        document.querySelectorAll('.modal-close').forEach(closeBtn => {
            closeBtn.addEventListener('click', () => {
                closeBtn.closest('.elite-modal').style.display = 'none';
            });
        });
        
        document.querySelectorAll('.elite-modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            });
        });
    }
    
    function setupGlobalEvents() {
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                if (confirm('Tem certeza que deseja sair?')) {
                    EliteUtils.showToast('Sessão encerrada', 'info');
                    location.reload();
                }
            });
        }
        
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'd') {
                e.preventDefault();
                document.querySelector('.nav-item[data-view="dashboard"]')?.click();
            }
            if (e.ctrlKey && e.key === 'c') {
                e.preventDefault();
                document.querySelector('.nav-item[data-view="cases"]')?.click();
            }
            if (e.ctrlKey && e.key === 'l') {
                e.preventDefault();
                document.querySelector('.nav-item[data-view="litigation"]')?.click();
            }
        });
    }
    
    // Expor globalmente
    window.ELITE_PROBATUM = {
        ...EliteUtils,
        AppState,
        Views,
        generatePerformanceReport: () => Views.generatePerformanceReport(),
        generateJudgesReport: () => Views.generateJudgesReport(),
        generateFinancialForecast: () => Views.generateFinancialForecast(),
        generateCategoryReport: () => Views.generateCategoryReport(),
        generatePetition: () => EliteUtils.showToast('Gerando minuta de petição...', 'info'),
        simulateDefense: () => EliteUtils.showToast('Simulação de defesa em desenvolvimento', 'info')
    };
    
    // Iniciar
    init();
})();