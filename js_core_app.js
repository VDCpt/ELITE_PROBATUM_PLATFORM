/**
 * ============================================================================
 * UNIFED-ELITE PLATFORM v1.0 — APLICAÇÃO PRINCIPAL
 * ============================================================================
 * Orquestra todos os módulos, gerencia estado, navegação e eventos globais
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
        isLoading: false
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
            const prefix = '[ELITE]';
            if (level === 'error') console.error(prefix, message);
            else if (level === 'warn') console.warn(prefix, message);
            else console.log(prefix, message);
        }
    };
    
    // =========================================================================
    // API CLIENT (Simulado)
    // =========================================================================
    
    const API = {
        async getCases() {
            // Simular dados iniciais
            return [
                {
                    id: 'C001',
                    client: 'João Silva',
                    platform: 'Bolt',
                    value: 28450,
                    discrepancy: 2184.95,
                    percentage: 89.26,
                    status: 'active',
                    judge: 'Dr. António Costa',
                    court: 'Tribunal Judicial de Lisboa',
                    probability: 0.82,
                    createdAt: '2024-09-15'
                },
                {
                    id: 'C002',
                    client: 'Maria Santos',
                    platform: 'Uber',
                    value: 15720,
                    discrepancy: 1200.00,
                    percentage: 76.35,
                    status: 'active',
                    judge: 'Dra. Sofia Mendes',
                    court: 'Tribunal Judicial do Porto',
                    probability: 0.75,
                    createdAt: '2024-10-01'
                },
                {
                    id: 'C003',
                    client: 'António Pereira',
                    platform: 'Bolt',
                    value: 32400,
                    discrepancy: 2845.67,
                    percentage: 92.45,
                    status: 'pending',
                    judge: 'Dr. Ricardo Alves',
                    court: 'Tribunal Judicial de Braga',
                    probability: 0.88,
                    createdAt: '2024-10-20'
                }
            ];
        },
        
        async getClients() {
            return [
                { id: 'CL001', name: 'João Silva', nif: '123456789', cases: 1, totalValue: 28450 },
                { id: 'CL002', name: 'Maria Santos', nif: '987654321', cases: 1, totalValue: 15720 },
                { id: 'CL003', name: 'António Pereira', nif: '456789123', cases: 1, totalValue: 32400 }
            ];
        },
        
        async getJudges() {
            return [
                { name: 'Dr. António Costa', court: 'Lisboa', decisions: 45, favorableRate: 0.68, avgTime: 120 },
                { name: 'Dra. Sofia Mendes', court: 'Porto', decisions: 38, favorableRate: 0.72, avgTime: 95 },
                { name: 'Dr. Ricardo Alves', court: 'Braga', decisions: 52, favorableRate: 0.58, avgTime: 110 }
            ];
        },
        
        async getPlatformIntel() {
            return {
                bolt: {
                    settlementRate: 0.45,
                    avgSettlementValue: 8500,
                    commonDefenses: ['jurisdiction', 'technical_error', 'de_minimis'],
                    weaknesses: ['regulatory_scrutiny', 'media_sensitive']
                },
                uber: {
                    settlementRate: 0.38,
                    avgSettlementValue: 7200,
                    commonDefenses: ['jurisdiction', 'algorithm', 'terms_of_service'],
                    weaknesses: ['class_action_risk', 'public_pressure']
                }
            };
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
                case 'platforms':
                    container.innerHTML = await this.renderPlatformsIntel();
                    await this.initPlatformsModule();
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
                platforms: 'Inteligência de Plataformas',
                clients: 'Clientes',
                reports: 'Relatórios'
            };
            return titles[viewName] || viewName;
        },
        
        async renderDashboard() {
            const cases = await API.getCases();
            const activeCases = cases.filter(c => c.status === 'active').length;
            const totalValue = cases.reduce((sum, c) => sum + c.value, 0);
            const avgProbability = cases.reduce((sum, c) => sum + c.probability, 0) / cases.length;
            
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
                
                <div class="chart-container">
                    <h3>Evolução da Carteira (últimos 6 meses)</h3>
                    <canvas id="portfolioChart" height="300"></canvas>
                </div>
                
                <div class="chart-container">
                    <h3>Distribuição por Plataforma</h3>
                    <canvas id="platformChart" height="300"></canvas>
                </div>
                
                <div class="chart-container">
                    <h3>Top 5 Alertas Estratégicos</h3>
                    <div id="alertsList" class="alerts-list"></div>
                </div>
            `;
        },
        
        async renderCases() {
            const cases = await API.getCases();
            
            return `
                <div class="cases-header" style="display: flex; justify-content: space-between; margin-bottom: 20px;">
                    <div class="cases-actions">
                        <button id="newCaseBtn" class="elite-btn primary">
                            <i class="fas fa-plus"></i> Novo Caso
                        </button>
                        <button id="importCasesBtn" class="elite-btn secondary">
                            <i class="fas fa-upload"></i> Importar Lote
                        </button>
                    </div>
                    <div class="cases-search">
                        <input type="text" id="searchCases" placeholder="Pesquisar casos..." class="search-input">
                    </div>
                </div>
                
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Processo</th>
                            <th>Cliente</th>
                            <th>Plataforma</th>
                            <th>Valor (€)</th>
                            <th>Omissão</th>
                            <th>Prob. Sucesso</th>
                            <th>Status</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody id="casesTableBody">
                        ${cases.map(c => `
                            <tr data-case-id="${c.id}">
                                <td><strong>${c.id}</strong></td>
                                <td>${c.client}</td>
                                <td><span class="platform-badge">${c.platform}</span></td>
                                <td>${EliteUtils.formatCurrency(c.value)}</td>
                                <td><span class="discrepancy-badge ${c.percentage > 80 ? 'critical' : 'high'}">${c.percentage.toFixed(1)}%</span></td>
                                <td>
                                    <div class="progress-bar">
                                        <div class="progress-fill" style="width: ${c.probability * 100}%"></div>
                                        <span class="progress-text">${EliteUtils.formatPercentage(c.probability * 100)}</span>
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
                        <p>Insira os dados do caso para obter previsão detalhada</p>
                    </div>
                    
                    <div class="intelligence-form">
                        <div class="form-row">
                            <div class="form-group">
                                <label>Plataforma</label>
                                <select id="predictPlatform">
                                    <option value="bolt">Bolt</option>
                                    <option value="uber">Uber</option>
                                    <option value="freenow">Free Now</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Valor da Causa (€)</label>
                                <input type="number" id="predictValue" placeholder="Ex: 28450">
                            </div>
                            <div class="form-group">
                                <label>Percentagem de Omissão (%)</label>
                                <input type="number" id="predictPercentage" placeholder="Ex: 89.26" step="0.01">
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
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Juiz (opcional)</label>
                                <input type="text" id="predictJudge" placeholder="Nome do juiz">
                            </div>
                            <div class="form-group">
                                <label>Notificação prévia da AT?</label>
                                <select id="predictATNotification">
                                    <option value="false">Não</option>
                                    <option value="true">Sim</option>
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
                    
                    <div class="similar-cases">
                        <h3>Casos Similares (Base de Dados)</h3>
                        <div id="similarCasesList" class="similar-cases-list"></div>
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
                                    <p>${j.court}</p>
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
                
                <div class="judge-trends">
                    <h3>Tendências por Tribunal</h3>
                    <canvas id="courtTrendsChart" height="300"></canvas>
                </div>
            `;
        },
        
        getRecommendedStrategy(judge) {
            if (judge.favorableRate > 0.7) {
                return "Estratégia ofensiva. Argumentos técnicos fortes têm boa aceitação. Foco em prova documental.";
            } else if (judge.favorableRate > 0.55) {
                return "Estratégia equilibrada. Preparar para contraditório robusto. Valorizar acordos.";
            } else {
                return "Estratégia defensiva. Considerar arbitragem ou mudança de foro. Fortalecer provas.";
            }
        },
        
        async renderPlatformsIntel() {
            const intel = await API.getPlatformIntel();
            
            return `
                <div class="platforms-header">
                    <h2>Inteligência de Plataformas</h2>
                    <p>Análise estratégica de comportamento de cada plataforma</p>
                </div>
                
                <div class="platforms-grid">
                    ${Object.entries(intel).map(([name, data]) => `
                        <div class="platform-card ${name}">
                            <div class="platform-header">
                                <i class="fas fa-building"></i>
                                <h3>${name.toUpperCase()}</h3>
                            </div>
                            <div class="platform-stats">
                                <div class="stat">
                                    <span>Taxa de Acordo</span>
                                    <strong>${EliteUtils.formatPercentage(data.settlementRate * 100)}</strong>
                                </div>
                                <div class="stat">
                                    <span>Valor Médio Acordo</span>
                                    <strong>${EliteUtils.formatCurrency(data.avgSettlementValue)}</strong>
                                </div>
                            </div>
                            <div class="platform-defenses">
                                <strong>Defesas comuns:</strong>
                                <ul>
                                    ${data.commonDefenses.map(d => `<li>${this.translateDefense(d)}</li>`).join('')}
                                </ul>
                            </div>
                            <div class="platform-weaknesses">
                                <strong>Pontos fracos:</strong>
                                <ul>
                                    ${data.weaknesses.map(w => `<li>${this.translateWeakness(w)}</li>`).join('')}
                                </ul>
                            </div>
                            <button class="elite-btn small negotiate-strategy" data-platform="${name}">
                                <i class="fas fa-handshake"></i> Estratégia Negocial
                            </button>
                        </div>
                    `).join('')}
                </div>
            `;
        },
        
        translateDefense(defense) {
            const map = {
                jurisdiction: 'Questão de jurisdição (sede estrangeira)',
                technical_error: 'Erro técnico no processamento',
                de_minimis: 'Valor inferior a 15.000€',
                algorithm: 'Algoritmo de cálculo proprietário',
                terms_of_service: 'Termos e Condições aceites pelo utilizador'
            };
            return map[defense] || defense;
        },
        
        translateWeakness(weakness) {
            const map = {
                regulatory_scrutiny: 'Sob escrutínio da ASAE/AT',
                media_sensitive: 'Sensível a cobertura mediática',
                class_action_risk: 'Risco de ação coletiva',
                public_pressure: 'Pressão pública sobre o modelo de negócio'
            };
            return map[weakness] || weakness;
        },
        
        async renderClients() {
            const clients = await API.getClients();
            
            return `
                <div class="clients-header">
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
                            <th>Casos</th>
                            <th>Valor Total (€)</th>
                            <th>Portal</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${clients.map(c => `
                            <tr>
                                <td><strong>${c.name}</strong></td>
                                <td>${c.nif}</td>
                                <td>${c.cases}</td>
                                <td>${EliteUtils.formatCurrency(c.totalValue)}</td>
                                <td>
                                    <button class="elite-btn small access-portal" data-client="${c.id}">
                                        <i class="fas fa-external-link-alt"></i> Aceder
                                    </button>
                                </td>
                                <td>
                                    <button class="action-btn view-client" data-id="${c.id}">
                                        <i class="fas fa-eye"></i>
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
                        <p>Análise de métricas da carteira, taxas de sucesso e ROI</p>
                        <button class="elite-btn small" onclick="UNIFEDElite.generatePerformanceReport()">
                            <i class="fas fa-download"></i> Gerar
                        </button>
                    </div>
                    
                    <div class="report-card">
                        <i class="fas fa-gavel"></i>
                        <h3>Análise de Magistrados</h3>
                        <p>Perfil detalhado de juízes e tendências por tribunal</p>
                        <button class="elite-btn small" onclick="UNIFEDElite.generateJudgesReport()">
                            <i class="fas fa-download"></i> Gerar
                        </button>
                    </div>
                    
                    <div class="report-card">
                        <i class="fas fa-building"></i>
                        <h3>Inteligência de Plataformas</h3>
                        <p>Estratégias de defesa e padrões de acordo</p>
                        <button class="elite-btn small" onclick="UNIFEDElite.generatePlatformsReport()">
                            <i class="fas fa-download"></i> Gerar
                        </button>
                    </div>
                    
                    <div class="report-card">
                        <i class="fas fa-chart-pie"></i>
                        <h3>Projeção Financeira</h3>
                        <p>Previsão de receitas e cash flow para 12 meses</p>
                        <button class="elite-btn small" onclick="UNIFEDElite.generateFinancialForecast()">
                            <i class="fas fa-download"></i> Gerar
                        </button>
                    </div>
                </div>
                
                <div class="scheduled-reports">
                    <h3>Relatórios Agendados</h3>
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Relatório</th>
                                <th>Frequência</th>
                                <th>Próxima Execução</th>
                                <th>Destinatários</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Dashboard Executivo</td>
                                <td>Semanal</td>
                                <td>Segunda-feira, 09:00</td>
                                <td>Sócios (5)</td>
                                <td>
                                    <button class="action-btn"><i class="fas fa-edit"></i></button>
                                    <button class="action-btn"><i class="fas fa-trash"></i></button>
                                </td>
                            </tr>
                            <tr>
                                <td>Inteligência de Mercado</td>
                                <td>Mensal</td>
                                <td>1 de cada mês, 10:00</td>
                                <td>Equipa de Litígio (12)</td>
                                <td>
                                    <button class="action-btn"><i class="fas fa-edit"></i></button>
                                    <button class="action-btn"><i class="fas fa-trash"></i></button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <button class="elite-btn secondary" id="scheduleReportBtn">
                        <i class="fas fa-calendar-plus"></i> Agendar Novo Relatório
                    </button>
                </div>
            `;
        },
        
        async initDashboardComponents() {
            // Inicializar gráficos
            if (typeof Chart !== 'undefined') {
                // Gráfico de portfólio
                const portfolioCtx = document.getElementById('portfolioChart');
                if (portfolioCtx) {
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
                                fill: true
                            }]
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
                
                // Gráfico de plataformas
                const platformCtx = document.getElementById('platformChart');
                if (platformCtx) {
                    new Chart(platformCtx, {
                        type: 'doughnut',
                        data: {
                            labels: ['Bolt', 'Uber', 'Free Now', 'Outras'],
                            datasets: [{
                                data: [65, 25, 7, 3],
                                backgroundColor: ['#00E5FF', '#3B82F6', '#8B5CF6', '#64748B'],
                                borderWidth: 0
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: { labels: { color: '#94A3B8' } }
                            }
                        }
                    });
                }
            }
            
            // Carregar alertas
            const alertsList = document.getElementById('alertsList');
            if (alertsList) {
                alertsList.innerHTML = `
                    <div class="alert-item critical">
                        <i class="fas fa-exclamation-triangle"></i>
                        <div>
                            <strong>Novo padrão de omissão detetado na Bolt</strong>
                            <p>Percentagem de omissão em setembro subiu 23% vs média histórica</p>
                            <small>Fonte: Community Forensic Network</small>
                        </div>
                    </div>
                    <div class="alert-item warning">
                        <i class="fas fa-gavel"></i>
                        <div>
                            <strong>Decisão favorável no STA</strong>
                            <p>Acórdão reforça tese de inversão do ónus da prova</p>
                            <small>Proc. 01080/17.3BELRS · 27.09.2023</small>
                        </div>
                    </div>
                    <div class="alert-item info">
                        <i class="fas fa-chart-line"></i>
                        <div>
                            <strong>Projeção de receita atualizada</strong>
                            <p>Carteira atual: €248.000 | Projeção 12m: €1.2M</p>
                        </div>
                    </div>
                `;
            }
        },
        
        async initCasesTable() {
            // Adicionar event listeners para botões de ação
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
        },
        
        async initLitigationModule() {
            document.getElementById('runPredictionBtn')?.addEventListener('click', async () => {
                await this.runPrediction();
            });
        },
        
        async runPrediction() {
            const platform = document.getElementById('predictPlatform')?.value;
            const value = parseFloat(document.getElementById('predictValue')?.value);
            const percentage = parseFloat(document.getElementById('predictPercentage')?.value);
            const court = document.getElementById('predictCourt')?.value;
            const judge = document.getElementById('predictJudge')?.value;
            const hasATNotification = document.getElementById('predictATNotification')?.value === 'true';
            
            if (!value || !percentage) {
                EliteUtils.showToast('Preencha todos os campos obrigatórios', 'warning');
                return;
            }
            
            EliteUtils.showToast('A processar previsão...', 'info');
            
            // Simular previsão (em produção, chamaria o módulo de IA)
            setTimeout(() => {
                const probability = this.calculateProbability(platform, value, percentage, court, hasATNotification);
                const expectedSettlement = value * (platform === 'bolt' ? 0.45 : 0.38);
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
                                <span>Probabilidade de êxito em julgamento:</span>
                                <strong class="${probability > 0.7 ? 'positive' : probability > 0.4 ? 'neutral' : 'negative'}">
                                    ${EliteUtils.formatPercentage(probability * 100)}
                                </strong>
                            </div>
                            <div class="detail-row">
                                <span>Valor estimado de acordo:</span>
                                <strong>${EliteUtils.formatCurrency(expectedSettlement)}</strong>
                            </div>
                            <div class="detail-row">
                                <span>Honorários recomendados:</span>
                                <strong>${EliteUtils.formatCurrency(recommendedFee)}</strong>
                                <small>(${recommendedFee / value * 100}% da causa)</small>
                            </div>
                            <div class="detail-row">
                                <span>Duração estimada do processo:</span>
                                <strong>${this.estimateDuration(court)}</strong>
                            </div>
                        </div>
                        
                        <div class="prediction-recommendation">
                            <h4>Estratégia Recomendada</h4>
                            <p>${this.getRecommendation(probability, value, expectedSettlement)}</p>
                        </div>
                        
                        <div class="prediction-actions">
                            <button class="elite-btn primary" onclick="UNIFEDElite.generatePetition()">
                                <i class="fas fa-file-alt"></i> Gerar Minuta de Petição
                            </button>
                            <button class="elite-btn secondary" onclick="UNIFEDElite.simulateDefense()">
                                <i class="fas fa-shield-alt"></i> Simular Defesa da Plataforma
                            </button>
                        </div>
                    `;
                }
            }, 1000);
        },
        
        calculateProbability(platform, value, percentage, court, hasATNotification) {
            // Algoritmo simplificado de previsão
            let prob = 0.5;
            
            // Fator plataforma
            if (platform === 'bolt') prob += 0.05;
            else if (platform === 'uber') prob += 0.02;
            
            // Fator percentagem de omissão
            if (percentage > 80) prob += 0.15;
            else if (percentage > 60) prob += 0.1;
            else if (percentage > 40) prob += 0.05;
            
            // Fator valor
            if (value > 50000) prob += 0.05;
            else if (value > 15000) prob += 0.03;
            
            // Fator tribunal
            if (court === 'lisboa') prob += 0.02;
            else if (court === 'porto') prob += 0.05;
            
            // Fator notificação AT
            if (hasATNotification) prob -= 0.1;
            
            return Math.min(Math.max(prob, 0.2), 0.95);
        },
        
        calculateRecommendedFee(value, probability) {
            // Modelo de honorários baseado no risco e valor
            const baseFee = value * 0.15; // 15% base
            const riskAdjustment = (1 - probability) * value * 0.1; // Prémio de risco
            return Math.min(baseFee + riskAdjustment, value * 0.4);
        },
        
        estimateDuration(court) {
            const durations = {
                lisboa: '8-12 meses',
                porto: '6-10 meses',
                braga: '10-14 meses',
                coimbra: '12-16 meses'
            };
            return durations[court] || '8-12 meses';
        },
        
        getRecommendation(probability, value, expectedSettlement) {
            if (probability > 0.75) {
                return `Recomenda-se ação judicial imediata. A alta probabilidade de êxito (${EliteUtils.formatPercentage(probability * 100)}) 
                        justifica litígio até julgamento. O valor estimado de acordo (${EliteUtils.formatCurrency(expectedSettlement)}) 
                        pode ser utilizado como baseline para negociação, mas a expectativa de sucesso em tribunal é superior.`;
            } else if (probability > 0.55) {
                return `Estratégia equilibrada: notificação extrajudicial com prazo para acordo. 
                        Se não houver resposta favorável em 15 dias, avançar com ação judicial. 
                        O valor estimado de acordo (${EliteUtils.formatCurrency(expectedSettlement)}) é razoável, 
                        mas existe margem para melhorar em julgamento (${EliteUtils.formatPercentage(probability * 100)}).`;
            } else {
                return `Recomenda-se negociação de acordo. A probabilidade de êxito (${EliteUtils.formatPercentage(probability * 100)}) 
                        sugere que litígio pode não ser a melhor opção. O valor estimado de acordo (${EliteUtils.formatCurrency(expectedSettlement)}) 
                        é uma base realista. Considere também arbitragem como alternativa mais rápida.`;
            }
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
        
        async initJudgesModule() {
            // Inicializar gráfico de tendências
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
            
            // Adicionar eventos para cards de juízes
            document.querySelectorAll('.view-judge-detail').forEach(btn => {
                btn.addEventListener('click', () => {
                    const judge = btn.dataset.judge;
                    EliteUtils.showToast(`Análise detalhada do ${judge}`, 'info');
                });
            });
        },
        
        async initPlatformsModule() {
            document.querySelectorAll('.negotiate-strategy').forEach(btn => {
                btn.addEventListener('click', () => {
                    const platform = btn.dataset.platform;
                    this.showNegotiationStrategy(platform);
                });
            });
        },
        
        showNegotiationStrategy(platform) {
            EliteUtils.showToast(`A gerar estratégia negocial para ${platform}...`, 'info');
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
        
        generatePerformanceReport() {
            EliteUtils.showToast('A gerar relatório de performance...', 'info');
            setTimeout(() => {
                EliteUtils.showToast('Relatório gerado com sucesso!', 'success');
            }, 1500);
        },
        
        generateJudgesReport() {
            EliteUtils.showToast('A gerar análise de magistrados...', 'info');
        },
        
        generatePlatformsReport() {
            EliteUtils.showToast('A gerar inteligência de plataformas...', 'info');
        },
        
        generateFinancialForecast() {
            EliteUtils.showToast('A gerar projeção financeira...', 'info');
        }
    };
    
    // =========================================================================
    // INICIALIZAÇÃO
    // =========================================================================
    
    async function init() {
        EliteUtils.log('Inicializando UNIFED-ELITE Platform v1.0...');
        
        // Aguardar splash screen
        const splash = document.getElementById('splashScreen');
        const enterBtn = document.getElementById('enterPlatformBtn');
        
        if (splash && enterBtn) {
            // Simular carregamento
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
        AppState.metrics.successRate = AppState.cases.reduce((sum, c) => sum + c.probability, 0) / AppState.cases.length * 100;
        
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
        
        EliteUtils.log('✅ UNIFED-ELITE Platform inicializada com sucesso!', 'success');
    }
    
    function setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', async (e) => {
                e.preventDefault();
                const view = item.dataset.view;
                
                // Atualizar classe ativa
                navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');
                
                // Renderizar view
                await Views.render(view);
                
                // Fechar sidebar em mobile
                if (window.innerWidth <= 1024) {
                    document.querySelector('.elite-sidebar').classList.remove('open');
                }
            });
        });
        
        // Mobile menu toggle
        const menuToggle = document.getElementById('mobileMenuToggle');
        const sidebar = document.querySelector('.elite-sidebar');
        if (menuToggle && sidebar) {
            menuToggle.addEventListener('click', () => {
                sidebar.classList.toggle('open');
            });
        }
    }
    
    function setupModals() {
        // Notificações
        const notifBtn = document.getElementById('notificationsBtn');
        const notifModal = document.getElementById('notificationsModal');
        if (notifBtn && notifModal) {
            notifBtn.addEventListener('click', () => {
                notifModal.style.display = 'flex';
            });
        }
        
        // Settings
        const settingsBtn = document.getElementById('settingsBtn');
        const settingsModal = document.getElementById('settingsModal');
        if (settingsBtn && settingsModal) {
            settingsBtn.addEventListener('click', () => {
                settingsModal.style.display = 'flex';
            });
        }
        
        // Close modals
        document.querySelectorAll('.modal-close').forEach(closeBtn => {
            closeBtn.addEventListener('click', () => {
                closeBtn.closest('.elite-modal').style.display = 'none';
            });
        });
        
        // Click outside
        document.querySelectorAll('.elite-modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            });
        });
    }
    
    function setupGlobalEvents() {
        // Logout
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                if (confirm('Tem certeza que deseja sair?')) {
                    EliteUtils.showToast('Sessão encerrada', 'info');
                    // Recarregar para splash screen
                    location.reload();
                }
            });
        }
        
        // Teclas de atalho
        document.addEventListener('keydown', (e) => {
            // Ctrl + D -> Dashboard
            if (e.ctrlKey && e.key === 'd') {
                e.preventDefault();
                document.querySelector('.nav-item[data-view="dashboard"]').click();
            }
            // Ctrl + C -> Casos
            if (e.ctrlKey && e.key === 'c') {
                e.preventDefault();
                document.querySelector('.nav-item[data-view="cases"]').click();
            }
            // Ctrl + L -> Litígio
            if (e.ctrlKey && e.key === 'l') {
                e.preventDefault();
                document.querySelector('.nav-item[data-view="litigation"]').click();
            }
        });
    }
    
    // Expor globalmente
    window.UNIFEDElite = {
        ...EliteUtils,
        AppState,
        Views,
        generatePerformanceReport: () => Views.generatePerformanceReport(),
        generateJudgesReport: () => Views.generateJudgesReport(),
        generatePlatformsReport: () => Views.generatePlatformsReport(),
        generateFinancialForecast: () => Views.generateFinancialForecast(),
        generatePetition: () => EliteUtils.showToast('Gerando minuta de petição...', 'info'),
        simulateDefense: () => EliteUtils.showToast('Simulação de defesa em desenvolvimento', 'info')
    };
    
    // Iniciar
    init();
})();