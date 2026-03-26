/**
 * ============================================================================
 * ELITE PROBATUM — MÓDULO 6: DASHBOARD PARA SÓCIOS
 * ============================================================================
 * Painel executivo com KPIs em tempo real, mapas de calor,
 * alertas preditivos e comparação de performance entre equipas.
 * ============================================================================
 */

class PracticeDashboard {
    constructor() {
        this.data = {
            cases: [],
            lawyers: [],
            teams: [],
            financials: {},
            alerts: [],
            kpis: {},
            trends: {},
            performanceHistory: []
        };
        
        this.refreshInterval = null;
        this.charts = {};
        this.listeners = [];
        this.lastUpdate = null;
        
        this.loadData();
    }
    
    /**
     * Inicializa o dashboard
     */
    async initialize() {
        await this.loadData();
        this.setupCharts();
        this.startAutoRefresh();
        this.setupEventListeners();
        
        console.log('[ELITE] Practice Dashboard inicializado');
        return this;
    }
    
    /**
     * Carrega dados
     */
    async loadData() {
        this.data.cases = await this.fetchCases();
        this.data.lawyers = await this.fetchLawyers();
        this.data.teams = await this.fetchTeams();
        this.data.financials = this.calculateFinancials();
        this.data.kpis = this.calculateKPIs();
        this.data.trends = this.calculateTrends();
        this.data.alerts = this.generateAlerts();
        this.data.performanceHistory = this.loadPerformanceHistory();
        this.lastUpdate = new Date();
        
        return this.data;
    }
    
    /**
     * Busca casos (simulado)
     */
    async fetchCases() {
        return [
            { id: 'C001', value: 28450, status: 'active', lawyer: 'Ana Silva', team: 'Litígio', probability: 0.82, createdAt: '2024-09-15', resolvedAt: null, hoursSpent: 45, complexity: 'medium' },
            { id: 'C002', value: 15720, status: 'active', lawyer: 'Pedro Santos', team: 'Litígio', probability: 0.75, createdAt: '2024-10-01', resolvedAt: null, hoursSpent: 38, complexity: 'medium' },
            { id: 'C003', value: 32400, status: 'active', lawyer: 'Maria Costa', team: 'Arbitragem', probability: 0.88, createdAt: '2024-10-20', resolvedAt: null, hoursSpent: 28, complexity: 'high' },
            { id: 'C004', value: 12500, status: 'closed', lawyer: 'Ana Silva', team: 'Litígio', probability: 0.65, createdAt: '2024-08-10', resolvedAt: '2024-12-15', hoursSpent: 52, complexity: 'low' },
            { id: 'C005', value: 45200, status: 'active', lawyer: 'João Mendes', team: 'Fiscal', probability: 0.91, createdAt: '2024-09-25', resolvedAt: null, hoursSpent: 62, complexity: 'high' },
            { id: 'C006', value: 8900, status: 'active', lawyer: 'Sofia Rodrigues', team: 'Laboral', probability: 0.78, createdAt: '2024-11-01', resolvedAt: null, hoursSpent: 22, complexity: 'low' },
            { id: 'C007', value: 67300, status: 'active', lawyer: 'Carlos Lima', team: 'Fiscal', probability: 0.69, createdAt: '2024-08-15', resolvedAt: null, hoursSpent: 85, complexity: 'high' },
            { id: 'C008', value: 12400, status: 'closed', lawyer: 'Maria Costa', team: 'Arbitragem', probability: 0.82, createdAt: '2024-07-20', resolvedAt: '2024-11-30', hoursSpent: 35, complexity: 'medium' }
        ];
    }
    
    /**
     * Busca advogados
     */
    async fetchLawyers() {
        return [
            { id: 'L001', name: 'Ana Silva', team: 'Litígio', cases: 12, activeCases: 8, successRate: 0.78, revenue: 125000, efficiency: 0.85, experience: 8 },
            { id: 'L002', name: 'Pedro Santos', team: 'Litígio', cases: 8, activeCases: 5, successRate: 0.72, revenue: 89000, efficiency: 0.78, experience: 5 },
            { id: 'L003', name: 'Maria Costa', team: 'Arbitragem', cases: 6, activeCases: 4, successRate: 0.85, revenue: 112000, efficiency: 0.92, experience: 6 },
            { id: 'L004', name: 'João Mendes', team: 'Fiscal', cases: 10, activeCases: 7, successRate: 0.82, revenue: 156000, efficiency: 0.88, experience: 10 },
            { id: 'L005', name: 'Sofia Rodrigues', team: 'Laboral', cases: 5, activeCases: 4, successRate: 0.75, revenue: 45000, efficiency: 0.72, experience: 3 },
            { id: 'L006', name: 'Carlos Lima', team: 'Fiscal', cases: 7, activeCases: 5, successRate: 0.79, revenue: 98000, efficiency: 0.81, experience: 7 }
        ];
    }
    
    /**
     * Busca equipas
     */
    async fetchTeams() {
        return [
            { name: 'Litígio', lawyers: 2, cases: 20, activeCases: 13, successRate: 0.75, revenue: 214000, efficiency: 0.82, avgHoursPerCase: 45 },
            { name: 'Arbitragem', lawyers: 1, cases: 6, activeCases: 4, successRate: 0.85, revenue: 112000, efficiency: 0.92, avgHoursPerCase: 32 },
            { name: 'Fiscal', lawyers: 2, cases: 17, activeCases: 12, successRate: 0.82, revenue: 254000, efficiency: 0.85, avgHoursPerCase: 52 },
            { name: 'Laboral', lawyers: 1, cases: 5, activeCases: 4, successRate: 0.75, revenue: 45000, efficiency: 0.72, avgHoursPerCase: 28 }
        ];
    }
    
    /**
     * Calcula métricas financeiras
     */
    calculateFinancials() {
        const cases = this.data.cases;
        const activeCases = cases.filter(c => c.status === 'active');
        const closedCases = cases.filter(c => c.status === 'closed');
        
        const totalDispute = activeCases.reduce((sum, c) => sum + c.value, 0);
        const resolvedValue = closedCases.reduce((sum, c) => sum + c.value, 0);
        const estimatedFees = activeCases.reduce((sum, c) => sum + (c.value * 0.25), 0);
        const realizedFees = closedCases.reduce((sum, c) => sum + (c.value * 0.25 * c.probability), 0);
        const estimatedCosts = activeCases.reduce((sum, c) => sum + (c.hoursSpent * 200), 0);
        const realizedCosts = closedCases.reduce((sum, c) => sum + (c.hoursSpent * 200), 0);
        
        return {
            totalDispute,
            resolvedValue,
            estimatedFees,
            realizedFees,
            estimatedCosts,
            realizedCosts,
            estimatedProfit: estimatedFees - estimatedCosts,
            realizedProfit: realizedFees - realizedCosts,
            roi: estimatedCosts > 0 ? ((estimatedFees - estimatedCosts) / estimatedCosts) * 100 : 0,
            averageCaseValue: totalDispute / (activeCases.length || 1),
            pipelineValue: totalDispute * 0.65
        };
    }
    
    /**
     * Calcula KPIs
     */
    calculateKPIs() {
        const cases = this.data.cases;
        const activeCases = cases.filter(c => c.status === 'active');
        const closedCases = cases.filter(c => c.status === 'closed');
        
        const successRate = closedCases.length > 0 
            ? closedCases.filter(c => c.probability > 0.6).length / closedCases.length 
            : 0;
        
        const avgProbability = activeCases.reduce((sum, c) => sum + c.probability, 0) / (activeCases.length || 1);
        const totalHours = cases.reduce((sum, c) => sum + c.hoursSpent, 0);
        const avgHoursPerCase = totalHours / cases.length;
        
        const highComplexityCases = cases.filter(c => c.complexity === 'high' && c.status === 'active').length;
        const criticalCases = cases.filter(c => c.probability < 0.5 && c.status === 'active').length;
        
        return {
            activeCases: activeCases.length,
            totalCases: cases.length,
            closedCases: closedCases.length,
            successRate: successRate * 100,
            avgProbability: avgProbability * 100,
            monthlyGrowth: 12.5,
            avgResolutionTime: 142,
            totalHoursBilled: totalHours,
            avgHoursPerCase: avgHoursPerCase.toFixed(0),
            highComplexityCases,
            criticalCases,
            utilizationRate: 78
        };
    }
    
    /**
     * Calcula tendências
     */
    calculateTrends() {
        const months = ['Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        const casesByMonth = [12, 15, 18, 22, 28, 35, 38, 42, 45];
        const revenueByMonth = [125000, 142000, 158000, 187000, 215000, 248000, 272000, 298000, 325000];
        const successByMonth = [68, 71, 73, 75, 78, 82, 81, 83, 84];
        const newClientsByMonth = [8, 10, 12, 15, 18, 22, 24, 28, 31];
        
        return {
            months,
            casesByMonth,
            revenueByMonth,
            successByMonth,
            newClientsByMonth,
            revenueGrowth: ((revenueByMonth[revenueByMonth.length - 1] - revenueByMonth[0]) / revenueByMonth[0] * 100).toFixed(1),
            caseGrowth: ((casesByMonth[casesByMonth.length - 1] - casesByMonth[0]) / casesByMonth[0] * 100).toFixed(1)
        };
    }
    
    /**
     * Carrega histórico de performance
     */
    loadPerformanceHistory() {
        const quarters = ['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024'];
        return {
            quarters,
            revenue: [245000, 312000, 398000, 452000],
            casesWon: [18, 24, 31, 38],
            newClients: [22, 28, 35, 42]
        };
    }
    
    /**
     * Gera alertas
     */
    generateAlerts() {
        const alerts = [];
        const kpis = this.data.kpis;
        const financials = this.data.financials;
        
        // Alerta 1: Casos críticos
        if (kpis.criticalCases > 0) {
            alerts.push({
                id: 'ALERT_001',
                severity: 'critical',
                title: 'Casos com baixa probabilidade',
                description: `${kpis.criticalCases} casos com probabilidade <50% necessitam revisão urgente`,
                source: 'Litigation Intelligence',
                date: new Date().toISOString(),
                action: 'Revisar estratégia',
                category: 'risk'
            });
        }
        
        // Alerta 2: Nova jurisprudência
        alerts.push({
            id: 'ALERT_002',
            severity: 'info',
            title: 'Nova decisão do STA',
            description: 'Acórdão favorável à tese de inversão do ónus da prova (Proc. 0456/2024)',
            source: 'Market Intelligence',
            date: new Date().toISOString(),
            action: 'Aplicar aos casos ativos',
            category: 'jurisprudence'
        });
        
        // Alerta 3: Performance acima da média
        if (kpis.monthlyGrowth > 10) {
            alerts.push({
                id: 'ALERT_003',
                severity: 'success',
                title: 'Crescimento da carteira',
                description: `+${kpis.monthlyGrowth}% de novos casos este mês. Tendência positiva.`,
                source: 'Dashboard',
                date: new Date().toISOString(),
                action: 'Analisar oportunidades',
                category: 'growth'
            });
        }
        
        // Alerta 4: Capacidade vs Demanda
        if (kpis.utilizationRate > 85) {
            alerts.push({
                id: 'ALERT_004',
                severity: 'warning',
                title: 'Capacidade próxima do limite',
                description: `Utilização de ${kpis.utilizationRate}% - Considerar reforço da equipa`,
                source: 'Resource Management',
                date: new Date().toISOString(),
                action: 'Avaliar contratações',
                category: 'resource'
            });
        }
        
        // Alerta 5: Oportunidade de mercado
        alerts.push({
            id: 'ALERT_005',
            severity: 'info',
            title: 'Oportunidade: Contencioso Laboral',
            description: 'Aumento de 23% nos casos de despedimento ilícito no último trimestre',
            source: 'Market Intelligence',
            date: new Date().toISOString(),
            action: 'Reforçar equipa especializada',
            category: 'opportunity'
        });
        
        return alerts;
    }
    
    /**
     * Configura gráficos
     */
    setupCharts() {
        this.createActiveCasesChart();
        this.createRevenueChart();
        this.createSuccessRateChart();
        this.createLawyerPerformanceChart();
        this.createHeatmap();
        this.createCaseDistributionChart();
        this.createPipelineChart();
    }
    
    /**
     * Cria gráfico de casos ativos
     */
    createActiveCasesChart() {
        const canvas = document.getElementById('activeCasesChart');
        if (!canvas) return;
        
        if (this.charts.activeCases) this.charts.activeCases.destroy();
        
        this.charts.activeCases = new Chart(canvas, {
            type: 'line',
            data: {
                labels: this.data.trends.months,
                datasets: [{
                    label: 'Casos Ativos',
                    data: this.data.trends.casesByMonth,
                    borderColor: '#00E5FF',
                    backgroundColor: 'rgba(0, 229, 255, 0.1)',
                    tension: 0.4,
                    fill: true,
                    pointRadius: 4,
                    pointHoverRadius: 8,
                    pointBackgroundColor: '#00E5FF'
                }]
            },
            options: this.getChartOptions('Casos Ativos', 'Nº de Casos')
        });
    }
    
    /**
     * Cria gráfico de receita
     */
    createRevenueChart() {
        const canvas = document.getElementById('revenueChart');
        if (!canvas) return;
        
        if (this.charts.revenue) this.charts.revenue.destroy();
        
        this.charts.revenue = new Chart(canvas, {
            type: 'bar',
            data: {
                labels: this.data.trends.months,
                datasets: [{
                    label: 'Receita (€)',
                    data: this.data.trends.revenueByMonth,
                    backgroundColor: '#3B82F6',
                    borderRadius: 8,
                    barPercentage: 0.7
                }]
            },
            options: this.getChartOptions('Receita Mensal', '€')
        });
    }
    
    /**
     * Cria gráfico de taxa de sucesso
     */
    createSuccessRateChart() {
        const canvas = document.getElementById('successRateChart');
        if (!canvas) return;
        
        if (this.charts.successRate) this.charts.successRate.destroy();
        
        this.charts.successRate = new Chart(canvas, {
            type: 'line',
            data: {
                labels: this.data.trends.months,
                datasets: [{
                    label: 'Taxa de Sucesso (%)',
                    data: this.data.trends.successByMonth,
                    borderColor: '#10B981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    tension: 0.4,
                    fill: true,
                    pointRadius: 4,
                    pointBackgroundColor: '#10B981'
                }]
            },
            options: this.getChartOptions('Taxa de Sucesso', '%')
        });
    }
    
    /**
     * Cria gráfico de performance por advogado
     */
    createLawyerPerformanceChart() {
        const canvas = document.getElementById('lawyerPerformanceChart');
        if (!canvas) return;
        
        const lawyers = this.data.lawyers;
        
        if (this.charts.lawyerPerformance) this.charts.lawyerPerformance.destroy();
        
        this.charts.lawyerPerformance = new Chart(canvas, {
            type: 'bar',
            data: {
                labels: lawyers.map(l => l.name),
                datasets: [
                    {
                        label: 'Casos',
                        data: lawyers.map(l => l.cases),
                        backgroundColor: '#00E5FF',
                        borderRadius: 8,
                        yAxisID: 'y'
                    },
                    {
                        label: 'Taxa Sucesso (%)',
                        data: lawyers.map(l => l.successRate * 100),
                        backgroundColor: '#F59E0B',
                        borderRadius: 8,
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { labels: { color: '#94A3B8' } },
                    tooltip: { mode: 'index', intersect: false }
                },
                scales: {
                    y: {
                        position: 'left',
                        title: { display: true, text: 'Nº de Casos', color: '#94A3B8' },
                        ticks: { color: '#94A3B8' },
                        grid: { color: 'rgba(255,255,255,0.05)' }
                    },
                    y1: {
                        position: 'right',
                        title: { display: true, text: 'Taxa de Sucesso (%)', color: '#94A3B8' },
                        ticks: { color: '#94A3B8', min: 0, max: 100 },
                        grid: { display: false }
                    },
                    x: {
                        ticks: { color: '#94A3B8' },
                        grid: { display: false }
                    }
                }
            }
        });
    }
    
    /**
     * Cria mapa de calor (radar)
     */
    createHeatmap() {
        const canvas = document.getElementById('teamHeatmap');
        if (!canvas) return;
        
        const teams = this.data.teams;
        
        if (this.charts.heatmap) this.charts.heatmap.destroy();
        
        this.charts.heatmap = new Chart(canvas, {
            type: 'radar',
            data: {
                labels: teams.map(t => t.name),
                datasets: [
                    {
                        label: 'Taxa Sucesso (%)',
                        data: teams.map(t => t.successRate * 100),
                        borderColor: '#00E5FF',
                        backgroundColor: 'rgba(0, 229, 255, 0.2)',
                        pointBackgroundColor: '#00E5FF'
                    },
                    {
                        label: 'Receita (k€)',
                        data: teams.map(t => t.revenue / 1000),
                        borderColor: '#F59E0B',
                        backgroundColor: 'rgba(245, 158, 11, 0.2)',
                        pointBackgroundColor: '#F59E0B'
                    },
                    {
                        label: 'Eficiência (%)',
                        data: teams.map(t => t.efficiency * 100),
                        borderColor: '#10B981',
                        backgroundColor: 'rgba(16, 185, 129, 0.2)',
                        pointBackgroundColor: '#10B981'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { labels: { color: '#94A3B8' } },
                    tooltip: { mode: 'index', intersect: false }
                },
                scales: {
                    r: {
                        ticks: { color: '#94A3B8', backdropColor: 'transparent', stepSize: 20 },
                        grid: { color: 'rgba(255,255,255,0.1)' },
                        angleLines: { color: 'rgba(255,255,255,0.1)' },
                        pointLabels: { color: '#94A3B8', font: { size: 10 } }
                    }
                }
            }
        });
    }
    
    /**
     * Cria gráfico de distribuição de casos
     */
    createCaseDistributionChart() {
        const canvas = document.getElementById('caseDistributionChart');
        if (!canvas) return;
        
        const teams = this.data.teams;
        
        if (this.charts.caseDistribution) this.charts.caseDistribution.destroy();
        
        this.charts.caseDistribution = new Chart(canvas, {
            type: 'doughnut',
            data: {
                labels: teams.map(t => t.name),
                datasets: [{
                    data: teams.map(t => t.activeCases),
                    backgroundColor: ['#00E5FF', '#3B82F6', '#10B981', '#F59E0B'],
                    borderWidth: 0,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'right', labels: { color: '#94A3B8', font: { size: 10 } } },
                    tooltip: { callbacks: { label: (ctx) => `${ctx.label}: ${ctx.raw} casos (${((ctx.raw / ctx.dataset.data.reduce((a,b)=>a+b,0))*100).toFixed(1)}%)` } }
                },
                cutout: '60%'
            }
        });
    }
    
    /**
     * Cria gráfico de pipeline
     */
    createPipelineChart() {
        const canvas = document.getElementById('pipelineChart');
        if (!canvas) return;
        
        const stages = ['Análise', 'Notificação', 'Litígio', 'Recurso', 'Concluído'];
        const values = [12, 18, 24, 8, 32];
        
        if (this.charts.pipeline) this.charts.pipeline.destroy();
        
        this.charts.pipeline = new Chart(canvas, {
            type: 'bar',
            data: {
                labels: stages,
                datasets: [{
                    label: 'Casos por Fase',
                    data: values,
                    backgroundColor: '#00E5FF',
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: { callbacks: { label: (ctx) => `${ctx.raw} casos` } }
                },
                scales: {
                    y: {
                        ticks: { color: '#94A3B8' },
                        grid: { color: 'rgba(255,255,255,0.05)' }
                    },
                    x: {
                        ticks: { color: '#94A3B8' },
                        grid: { display: false }
                    }
                }
            }
        });
    }
    
    /**
     * Obtém opções padrão para gráficos
     */
    getChartOptions(title, yLabel) {
        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { labels: { color: '#94A3B8' } },
                tooltip: { mode: 'index', intersect: false, backgroundColor: '#0a0c10', titleColor: '#00e5ff', bodyColor: '#e2e8f0', borderColor: '#00e5ff', borderWidth: 1 }
            },
            scales: {
                y: { 
                    title: { display: true, text: yLabel, color: '#94A3B8' },
                    ticks: { color: '#94A3B8' },
                    grid: { color: 'rgba(255,255,255,0.05)' }
                },
                x: { 
                    ticks: { color: '#94A3B8' },
                    grid: { display: false }
                }
            }
        };
    }
    
    /**
     * Renderiza o dashboard
     */
    render() {
        const container = document.getElementById('viewContainer');
        if (!container) return;
        
        const financials = this.data.financials;
        const kpis = this.data.kpis;
        
        container.innerHTML = `
            <div class="practice-dashboard">
                <div class="dashboard-header">
                    <h2><i class="fas fa-chart-line"></i> Dashboard Executivo</h2>
                    <div class="dashboard-controls">
                        <select id="dashboardPeriod">
                            <option value="30d">Últimos 30 dias</option>
                            <option value="90d" selected>Últimos 90 dias</option>
                            <option value="1y">Último ano</option>
                        </select>
                        <button id="refreshDashboardBtn" class="elite-btn small secondary">
                            <i class="fas fa-sync-alt"></i> ATUALIZAR
                        </button>
                        <button id="exportDashboardBtn" class="elite-btn small primary">
                            <i class="fas fa-download"></i> EXPORTAR
                        </button>
                    </div>
                </div>
                
                <div class="kpi-grid">
                    <div class="kpi-card">
                        <div class="kpi-icon"><i class="fas fa-folder-open"></i></div>
                        <div class="kpi-content">
                            <div class="kpi-label">Casos Ativos</div>
                            <div class="kpi-value">${kpis.activeCases}</div>
                            <div class="kpi-trend trend-up">+${kpis.monthlyGrowth}% este mês</div>
                        </div>
                    </div>
                    <div class="kpi-card">
                        <div class="kpi-icon"><i class="fas fa-euro-sign"></i></div>
                        <div class="kpi-content">
                            <div class="kpi-label">Valor em Disputa</div>
                            <div class="kpi-value">${this.formatCurrency(financials.totalDispute)}</div>
                            <div class="kpi-trend trend-up">+8% vs período anterior</div>
                        </div>
                    </div>
                    <div class="kpi-card">
                        <div class="kpi-icon"><i class="fas fa-chart-line"></i></div>
                        <div class="kpi-content">
                            <div class="kpi-label">Taxa Sucesso</div>
                            <div class="kpi-value">${kpis.successRate.toFixed(1)}%</div>
                            <div class="kpi-trend trend-up">+5% com IA</div>
                        </div>
                    </div>
                    <div class="kpi-card">
                        <div class="kpi-icon"><i class="fas fa-chart-pie"></i></div>
                        <div class="kpi-content">
                            <div class="kpi-label">ROI Estimado</div>
                            <div class="kpi-value">${financials.roi.toFixed(0)}%</div>
                            <div class="kpi-trend trend-up">vs. mercado</div>
                        </div>
                    </div>
                    <div class="kpi-card">
                        <div class="kpi-icon"><i class="fas fa-clock"></i></div>
                        <div class="kpi-content">
                            <div class="kpi-label">Horas Faturadas</div>
                            <div class="kpi-value">${kpis.totalHoursBilled}</div>
                            <div class="kpi-trend">${kpis.avgHoursPerCase}h/caso</div>
                        </div>
                    </div>
                    <div class="kpi-card">
                        <div class="kpi-icon"><i class="fas fa-chart-simple"></i></div>
                        <div class="kpi-content">
                            <div class="kpi-label">Pipeline</div>
                            <div class="kpi-value">${this.formatCurrency(financials.pipelineValue)}</div>
                            <div class="kpi-trend">65% de conversão estimada</div>
                        </div>
                    </div>
                </div>
                
                <div class="charts-grid">
                    <div class="chart-card">
                        <h3>Evolução da Carteira</h3>
                        <canvas id="activeCasesChart" height="250"></canvas>
                    </div>
                    <div class="chart-card">
                        <h3>Receita Mensal</h3>
                        <canvas id="revenueChart" height="250"></canvas>
                    </div>
                    <div class="chart-card">
                        <h3>Taxa de Sucesso</h3>
                        <canvas id="successRateChart" height="250"></canvas>
                    </div>
                    <div class="chart-card">
                        <h3>Performance por Advogado</h3>
                        <canvas id="lawyerPerformanceChart" height="250"></canvas>
                    </div>
                    <div class="chart-card">
                        <h3>Distribuição de Casos</h3>
                        <canvas id="caseDistributionChart" height="250"></canvas>
                    </div>
                    <div class="chart-card">
                        <h3>Pipeline por Fase</h3>
                        <canvas id="pipelineChart" height="250"></canvas>
                    </div>
                    <div class="chart-card full-width">
                        <h3>Mapa de Calor por Equipa</h3>
                        <canvas id="teamHeatmap" height="280"></canvas>
                    </div>
                </div>
                
                <div class="alerts-panel">
                    <h3><i class="fas fa-bell"></i> Alertas Estratégicos</h3>
                    <div class="alerts-list">
                        ${this.renderAlerts()}
                    </div>
                </div>
                
                <div class="cases-table">
                    <h3>Casos Prioritários</h3>
                    ${this.renderPriorityCases()}
                </div>
                
                <div class="performance-history">
                    <h3>Histórico de Performance</h3>
                    <div class="history-grid">
                        <div class="history-card">
                            <div class="history-value">${this.formatCurrency(this.data.performanceHistory.revenue[this.data.performanceHistory.revenue.length - 1])}</div>
                            <div class="history-label">Receita YTD</div>
                            <div class="history-trend trend-up">+${((this.data.performanceHistory.revenue[this.data.performanceHistory.revenue.length - 1] - this.data.performanceHistory.revenue[0]) / this.data.performanceHistory.revenue[0] * 100).toFixed(0)}%</div>
                        </div>
                        <div class="history-card">
                            <div class="history-value">${this.data.performanceHistory.casesWon[this.data.performanceHistory.casesWon.length - 1]}</div>
                            <div class="history-label">Casos Ganhos</div>
                            <div class="history-trend trend-up">+${((this.data.performanceHistory.casesWon[this.data.performanceHistory.casesWon.length - 1] - this.data.performanceHistory.casesWon[0]) / this.data.performanceHistory.casesWon[0] * 100).toFixed(0)}%</div>
                        </div>
                        <div class="history-card">
                            <div class="history-value">${this.data.performanceHistory.newClients[this.data.performanceHistory.newClients.length - 1]}</div>
                            <div class="history-label">Novos Clientes</div>
                            <div class="history-trend trend-up">+${((this.data.performanceHistory.newClients[this.data.performanceHistory.newClients.length - 1] - this.data.performanceHistory.newClients[0]) / this.data.performanceHistory.newClients[0] * 100).toFixed(0)}%</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Re-inicializar gráficos
        this.setupCharts();
        
        // Eventos
        document.getElementById('refreshDashboardBtn')?.addEventListener('click', () => this.refresh());
        document.getElementById('exportDashboardBtn')?.addEventListener('click', () => this.exportDashboard());
        document.getElementById('dashboardPeriod')?.addEventListener('change', (e) => this.changePeriod(e.target.value));
    }
    
    /**
     * Renderiza alertas
     */
    renderAlerts() {
        if (this.data.alerts.length === 0) {
            return '<div class="alert neutral">✅ Nenhum alerta crítico no momento</div>';
        }
        
        return this.data.alerts.map(alert => `
            <div class="alert-item ${alert.severity}">
                <i class="fas ${this.getAlertIcon(alert.severity)}"></i>
                <div>
                    <strong>${alert.title}</strong>
                    <p>${alert.description}</p>
                    <small>${alert.source} · ${new Date(alert.date).toLocaleDateString('pt-PT')}</small>
                </div>
                <button class="elite-btn small" onclick="PracticeDashboard.handleAlert('${alert.id}')">
                    ${alert.action}
                </button>
            </div>
        `).join('');
    }
    
    /**
     * Renderiza casos prioritários
     */
    renderPriorityCases() {
        const priorityCases = this.data.cases
            .filter(c => c.status === 'active')
            .sort((a, b) => b.value - a.value)
            .slice(0, 5);
        
        if (priorityCases.length === 0) {
            return '<div class="empty-state">Nenhum caso ativo</div>';
        }
        
        return `
            <table class="data-table">
                <thead>
                    <tr><th>Processo</th><th>Advogado</th><th>Equipa</th><th>Valor</th><th>Probabilidade</th><th>Horas</th><th>Status</th></tr>
                </thead>
                <tbody>
                    ${priorityCases.map(c => `
                        <tr>
                            <td><strong>${c.id}</strong></td>
                            <td>${c.lawyer}</td>
                            <td><span class="badge badge-primary">${c.team}</span></td>
                            <td>${this.formatCurrency(c.value)}</td>
                            <td>
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: ${c.probability * 100}%"></div>
                                    <span class="progress-text">${(c.probability * 100).toFixed(0)}%</span>
                                </div>
                            </td>
                            <td>${c.hoursSpent}h</div>
                            <td><span class="status-badge status-${c.status === 'active' ? 'active' : 'closed'}">${c.status === 'active' ? 'Ativo' : 'Concluído'}</span>
                        </div>
                    `).join('')}
                </tbody>
            </div>
        `;
    }
    
    /**
     * Obtém ícone do alerta
     */
    getAlertIcon(severity) {
        const icons = {
            critical: 'fa-exclamation-triangle',
            warning: 'fa-exclamation-circle',
            success: 'fa-check-circle',
            info: 'fa-info-circle'
        };
        return icons[severity] || 'fa-bell';
    }
    
    /**
     * Atualiza dashboard
     */
    async refresh() {
        await this.loadData();
        this.render();
        
        if (window.EliteUtils) {
            window.EliteUtils.showToast('Dashboard atualizado', 'success');
        }
    }
    
    /**
     * Altera período
     */
    changePeriod(period) {
        console.log('[ELITE] Período alterado para:', period);
        this.refresh();
    }
    
    /**
     * Exporta dashboard
     */
    async exportDashboard() {
        const container = document.getElementById('viewContainer');
        if (!container) return;
        
        const report = {
            generatedAt: new Date().toISOString(),
            kpis: this.data.kpis,
            financials: this.data.financials,
            trends: this.data.trends,
            alerts: this.data.alerts,
            teams: this.data.teams,
            performanceHistory: this.data.performanceHistory
        };
        
        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `dashboard_export_${new Date().toISOString().slice(0, 10)}.json`;
        link.click();
        URL.revokeObjectURL(url);
        
        if (window.EliteUtils) {
            window.EliteUtils.showToast('Dashboard exportado com sucesso', 'success');
        }
    }
    
    /**
     * Gera relatório de performance
     */
    generatePerformanceReport() {
        const report = {
            title: 'Relatório de Performance',
            generatedAt: new Date().toISOString(),
            kpis: this.data.kpis,
            financials: this.data.financials,
            teamPerformance: this.data.teams,
            topLawyers: this.data.lawyers.sort((a, b) => b.revenue - a.revenue).slice(0, 3),
            trends: this.data.trends,
            recommendations: this.generateRecommendations()
        };
        
        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `performance_report_${new Date().toISOString().slice(0, 10)}.json`;
        link.click();
        URL.revokeObjectURL(url);
        
        if (window.EliteUtils) {
            window.EliteUtils.showToast('Relatório de performance gerado', 'success');
        }
        
        return report;
    }
    
    /**
     * Gera relatório de magistrados
     */
    generateJudgeReport() {
        if (window.JudicialAnalytics) {
            const stats = window.JudicialAnalytics.getJudicialStatistics();
            const blob = new Blob([JSON.stringify(stats, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `judges_analysis_${new Date().toISOString().slice(0, 10)}.json`;
            link.click();
            URL.revokeObjectURL(url);
            
            if (window.EliteUtils) {
                window.EliteUtils.showToast('Análise de magistrados gerada', 'success');
            }
        } else {
            if (window.EliteUtils) {
                window.EliteUtils.showToast('Módulo de análise judicial não disponível', 'error');
            }
        }
    }
    
    /**
     * Gera recomendações estratégicas
     */
    generateRecommendations() {
        const recommendations = [];
        const kpis = this.data.kpis;
        const financials = this.data.financials;
        
        if (kpis.criticalCases > 0) {
            recommendations.push(`Revisar urgentemente ${kpis.criticalCases} casos com baixa probabilidade de sucesso`);
        }
        
        if (kpis.utilizationRate > 85) {
            recommendations.push('Considerar contratação de novos advogados para equilibrar carga de trabalho');
        }
        
        if (financials.roi < 200) {
            recommendations.push('Revisar modelo de honorários para aumentar rentabilidade');
        }
        
        if (kpis.successRate < 75) {
            recommendations.push('Investir em formação e ferramentas de análise preditiva');
        }
        
        return recommendations;
    }
    
    /**
     * Inicia atualização automática
     */
    startAutoRefresh() {
        if (this.refreshInterval) clearInterval(this.refreshInterval);
        
        this.refreshInterval = setInterval(async () => {
            await this.loadData();
            if (document.getElementById('viewContainer')?.innerHTML) {
                this.render();
            }
        }, 30000);
    }
    
    /**
     * Para atualização automática
     */
    stopAutoRefresh() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
            this.refreshInterval = null;
        }
    }
    
    /**
     * Configura event listeners
     */
    setupEventListeners() {
        document.addEventListener('massLitigationProgress', (e) => {
            this.updateProgress(e.detail);
        });
        
        document.addEventListener('caseUpdated', () => {
            this.refresh();
        });
        
        document.addEventListener('leadConverted', () => {
            this.refresh();
        });
    }
    
    /**
     * Atualiza progresso
     */
    updateProgress(data) {
        const progressElement = document.getElementById(`batch-${data.batchId}-progress`);
        if (progressElement) {
            progressElement.style.width = `${data.progress}%`;
            progressElement.textContent = `${data.progress.toFixed(0)}%`;
        }
    }
    
    /**
     * Manipula alerta
     */
    static handleAlert(alertId) {
        if (window.EliteUtils) {
            window.EliteUtils.showToast(`A processar alerta ${alertId}...`, 'info');
        }
    }
    
    /**
     * Formata moeda
     */
    formatCurrency(value) {
        if (value === null || value === undefined) return '€0';
        return new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
    }
}

// Instância global
window.PracticeDashboard = new PracticeDashboard();