/**
 * ============================================================================
 * UNIFED-ELITE PLATFORM — MÓDULO 6: DASHBOARD PARA SÓCIOS
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
            trends: {}
        };
        
        this.refreshInterval = null;
        this.charts = {};
        this.listeners = [];
    }
    
    async initialize() {
        await this.loadData();
        this.setupCharts();
        this.startAutoRefresh();
        this.setupEventListeners();
        
        console.log('[ELITE] Practice Dashboard inicializado');
    }
    
    async loadData() {
        // Simular carga de dados
        this.data.cases = await this.fetchCases();
        this.data.lawyers = await this.fetchLawyers();
        this.data.teams = await this.fetchTeams();
        this.data.financials = this.calculateFinancials();
        this.data.kpis = this.calculateKPIs();
        this.data.trends = this.calculateTrends();
        this.data.alerts = this.generateAlerts();
        
        return this.data;
    }
    
    async fetchCases() {
        // Em produção, viria de API
        return [
            { id: 'C001', value: 28450, status: 'active', lawyer: 'Ana Silva', team: 'Litígio', probability: 0.82, createdAt: '2024-09-15' },
            { id: 'C002', value: 15720, status: 'active', lawyer: 'Pedro Santos', team: 'Litígio', probability: 0.75, createdAt: '2024-10-01' },
            { id: 'C003', value: 32400, status: 'pending', lawyer: 'Maria Costa', team: 'Arbitragem', probability: 0.88, createdAt: '2024-10-20' },
            { id: 'C004', value: 12500, status: 'closed', lawyer: 'Ana Silva', team: 'Litígio', probability: 0.65, createdAt: '2024-08-10' },
            { id: 'C005', value: 45200, status: 'active', lawyer: 'João Mendes', team: 'Fiscal', probability: 0.91, createdAt: '2024-09-25' }
        ];
    }
    
    async fetchLawyers() {
        return [
            { id: 'L001', name: 'Ana Silva', team: 'Litígio', cases: 12, successRate: 0.78, revenue: 125000 },
            { id: 'L002', name: 'Pedro Santos', team: 'Litígio', cases: 8, successRate: 0.72, revenue: 89000 },
            { id: 'L003', name: 'Maria Costa', team: 'Arbitragem', cases: 6, successRate: 0.85, revenue: 112000 },
            { id: 'L004', name: 'João Mendes', team: 'Fiscal', cases: 10, successRate: 0.82, revenue: 156000 }
        ];
    }
    
    async fetchTeams() {
        return [
            { name: 'Litígio', lawyers: 2, cases: 20, successRate: 0.75, revenue: 214000 },
            { name: 'Arbitragem', lawyers: 1, cases: 6, successRate: 0.85, revenue: 112000 },
            { name: 'Fiscal', lawyers: 1, cases: 10, successRate: 0.82, revenue: 156000 }
        ];
    }
    
    calculateFinancials() {
        const cases = this.data.cases;
        const activeCases = cases.filter(c => c.status === 'active');
        
        const totalDispute = activeCases.reduce((sum, c) => sum + c.value, 0);
        const estimatedFees = activeCases.reduce((sum, c) => sum + (c.value * 0.25), 0);
        const estimatedCosts = activeCases.length * 2500;
        
        return {
            totalDispute,
            estimatedFees,
            estimatedCosts,
            estimatedProfit: estimatedFees - estimatedCosts,
            roi: ((estimatedFees - estimatedCosts) / estimatedCosts) * 100,
            averageCaseValue: totalDispute / (activeCases.length || 1)
        };
    }
    
    calculateKPIs() {
        const cases = this.data.cases;
        const activeCases = cases.filter(c => c.status === 'active');
        const closedCases = cases.filter(c => c.status === 'closed');
        
        const successRate = closedCases.length > 0 
            ? closedCases.filter(c => c.probability > 0.5).length / closedCases.length 
            : 0;
        
        const avgProbability = activeCases.reduce((sum, c) => sum + c.probability, 0) / (activeCases.length || 1);
        
        return {
            activeCases: activeCases.length,
            totalCases: cases.length,
            successRate: successRate * 100,
            avgProbability: avgProbability * 100,
            monthlyGrowth: 12.5,
            avgResolutionTime: 142 // dias
        };
    }
    
    calculateTrends() {
        // Simular tendências dos últimos 6 meses
        const months = ['Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set'];
        const casesByMonth = [12, 15, 18, 22, 28, 35];
        const revenueByMonth = [125000, 142000, 158000, 187000, 215000, 248000];
        const successByMonth = [68, 71, 73, 75, 78, 82];
        
        return {
            months,
            casesByMonth,
            revenueByMonth,
            successByMonth
        };
    }
    
    generateAlerts() {
        const alerts = [];
        
        // Alerta 1: Nova decisão relevante
        alerts.push({
            id: 'ALERT_001',
            severity: 'critical',
            title: 'Nova decisão do STA',
            description: 'Acórdão favorável à tese de inversão do ónus da prova',
            source: 'STA',
            date: '2024-10-15',
            action: 'Aplicar aos casos ativos'
        });
        
        // Alerta 2: Performance acima da média
        if (this.data.kpis.monthlyGrowth > 10) {
            alerts.push({
                id: 'ALERT_002',
                severity: 'success',
                title: 'Crescimento da carteira',
                description: `+${this.data.kpis.monthlyGrowth}% de novos casos este mês`,
                source: 'Dashboard',
                date: new Date().toISOString(),
                action: 'Analisar oportunidades'
            });
        }
        
        // Alerta 3: Caso com risco elevado
        const highRiskCases = this.data.cases.filter(c => c.probability < 0.5 && c.status === 'active');
        if (highRiskCases.length > 0) {
            alerts.push({
                id: 'ALERT_003',
                severity: 'warning',
                title: 'Casos com baixa probabilidade',
                description: `${highRiskCases.length} casos com probabilidade <50%`,
                source: 'Litigation Intelligence',
                date: new Date().toISOString(),
                action: 'Revisar estratégia'
            });
        }
        
        return alerts;
    }
    
    setupCharts() {
        this.createActiveCasesChart();
        this.createRevenueChart();
        this.createSuccessRateChart();
        this.createLawyerPerformanceChart();
        this.createHeatmap();
    }
    
    createActiveCasesChart() {
        const canvas = document.getElementById('activeCasesChart');
        if (!canvas) return;
        
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
                    fill: true
                }]
            },
            options: this.getChartOptions('Casos Ativos')
        });
    }
    
    createRevenueChart() {
        const canvas = document.getElementById('revenueChart');
        if (!canvas) return;
        
        this.charts.revenue = new Chart(canvas, {
            type: 'bar',
            data: {
                labels: this.data.trends.months,
                datasets: [{
                    label: 'Receita (€)',
                    data: this.data.trends.revenueByMonth,
                    backgroundColor: '#3B82F6',
                    borderRadius: 8
                }]
            },
            options: this.getChartOptions('Receita Mensal (€)')
        });
    }
    
    createSuccessRateChart() {
        const canvas = document.getElementById('successRateChart');
        if (!canvas) return;
        
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
                    fill: true
                }]
            },
            options: this.getChartOptions('Taxa de Sucesso (%)')
        });
    }
    
    createLawyerPerformanceChart() {
        const canvas = document.getElementById('lawyerPerformanceChart');
        if (!canvas) return;
        
        const lawyers = this.data.lawyers;
        
        this.charts.lawyerPerformance = new Chart(canvas, {
            type: 'bar',
            data: {
                labels: lawyers.map(l => l.name),
                datasets: [
                    {
                        label: 'Casos',
                        data: lawyers.map(l => l.cases),
                        backgroundColor: '#00E5FF',
                        borderRadius: 8
                    },
                    {
                        label: 'Taxa Sucesso (%)',
                        data: lawyers.map(l => l.successRate * 100),
                        backgroundColor: '#F59E0B',
                        borderRadius: 8
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
                    y: { ticks: { color: '#94A3B8' }, grid: { color: 'rgba(255,255,255,0.05)' } },
                    x: { ticks: { color: '#94A3B8' }, grid: { color: 'rgba(255,255,255,0.05)' } }
                }
            }
        });
    }
    
    createHeatmap() {
        const canvas = document.getElementById('teamHeatmap');
        if (!canvas) return;
        
        const teams = this.data.teams;
        
        this.charts.heatmap = new Chart(canvas, {
            type: 'radar',
            data: {
                labels: teams.map(t => t.name),
                datasets: [
                    {
                        label: 'Taxa Sucesso (%)',
                        data: teams.map(t => t.successRate * 100),
                        borderColor: '#00E5FF',
                        backgroundColor: 'rgba(0, 229, 255, 0.2)'
                    },
                    {
                        label: 'Receita (k€)',
                        data: teams.map(t => t.revenue / 1000),
                        borderColor: '#F59E0B',
                        backgroundColor: 'rgba(245, 158, 11, 0.2)'
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
                    r: {
                        ticks: { color: '#94A3B8', backdropColor: 'transparent' },
                        grid: { color: 'rgba(255,255,255,0.1)' }
                    }
                }
            }
        });
    }
    
    getChartOptions(title) {
        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { labels: { color: '#94A3B8' } },
                tooltip: { mode: 'index', intersect: false }
            },
            scales: {
                y: { 
                    ticks: { color: '#94A3B8' },
                    grid: { color: 'rgba(255,255,255,0.05)' }
                },
                x: { 
                    ticks: { color: '#94A3B8' },
                    grid: { color: 'rgba(255,255,255,0.05)' }
                }
            }
        };
    }
    
    render() {
        const container = document.getElementById('practiceDashboard');
        if (!container) return;
        
        container.innerHTML = `
            <div class="dashboard-header">
                <h2>Dashboard Executivo</h2>
                <div class="dashboard-controls">
                    <select id="dashboardPeriod">
                        <option value="30d">Últimos 30 dias</option>
                        <option value="90d">Últimos 90 dias</option>
                        <option value="1y">Último ano</option>
                    </select>
                    <button id="exportDashboardBtn" class="elite-btn small">
                        <i class="fas fa-download"></i> Exportar
                    </button>
                </div>
            </div>
            
            <div class="kpi-grid">
                <div class="kpi-card">
                    <div class="kpi-icon"><i class="fas fa-folder-open"></i></div>
                    <div class="kpi-content">
                        <div class="kpi-label">Casos Ativos</div>
                        <div class="kpi-value">${this.data.kpis.activeCases}</div>
                        <div class="kpi-trend trend-up">+${this.data.kpis.monthlyGrowth}% este mês</div>
                    </div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-icon"><i class="fas fa-euro-sign"></i></div>
                    <div class="kpi-content">
                        <div class="kpi-label">Valor em Disputa</div>
                        <div class="kpi-value">${window.UNIFEDElite?.formatCurrency(this.data.financials.totalDispute)}</div>
                        <div class="kpi-trend trend-up">+8% vs período anterior</div>
                    </div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-icon"><i class="fas fa-chart-line"></i></div>
                    <div class="kpi-content">
                        <div class="kpi-label">Taxa Sucesso</div>
                        <div class="kpi-value">${this.data.kpis.successRate.toFixed(1)}%</div>
                        <div class="kpi-trend trend-up">+5% com IA</div>
                    </div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-icon"><i class="fas fa-chart-pie"></i></div>
                    <div class="kpi-content">
                        <div class="kpi-label">ROI Estimado</div>
                        <div class="kpi-value">${this.data.financials.roi.toFixed(0)}%</div>
                        <div class="kpi-trend trend-up">vs. mercado</div>
                    </div>
                </div>
            </div>
            
            <div class="charts-grid">
                <div class="chart-card">
                    <h3>Evolução da Carteira</h3>
                    <canvas id="activeCasesChart" height="300"></canvas>
                </div>
                <div class="chart-card">
                    <h3>Receita Mensal</h3>
                    <canvas id="revenueChart" height="300"></canvas>
                </div>
                <div class="chart-card">
                    <h3>Taxa de Sucesso</h3>
                    <canvas id="successRateChart" height="300"></canvas>
                </div>
                <div class="chart-card">
                    <h3>Performance por Advogado</h3>
                    <canvas id="lawyerPerformanceChart" height="300"></canvas>
                </div>
                <div class="chart-card full-width">
                    <h3>Mapa de Calor por Equipa</h3>
                    <canvas id="teamHeatmap" height="300"></canvas>
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
                <table class="data-table">
                    <thead>
                        <tr><th>Processo</th><th>Advogado</th><th>Valor</th><th>Probabilidade</th><th>Status</th></tr>
                    </thead>
                    <tbody>
                        ${this.renderPriorityCases()}
                    </tbody>
                </table>
            </div>
        `;
        
        // Re-inicializar gráficos
        this.setupCharts();
    }
    
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
                    <small>${alert.source} · ${alert.date}</small>
                </div>
                <button class="elite-btn small" onclick="PracticeDashboard.handleAlert('${alert.id}')">
                    ${alert.action}
                </button>
            </div>
        `).join('');
    }
    
    getAlertIcon(severity) {
        const icons = {
            critical: 'fa-exclamation-triangle',
            warning: 'fa-exclamation-circle',
            success: 'fa-check-circle',
            info: 'fa-info-circle'
        };
        return icons[severity] || 'fa-bell';
    }
    
    renderPriorityCases() {
        const priorityCases = this.data.cases
            .filter(c => c.status === 'active')
            .sort((a, b) => b.value - a.value)
            .slice(0, 5);
        
        return priorityCases.map(c => `
            <tr>
                <td><strong>${c.id}</strong></td>
                <td>${c.lawyer}</td>
                <td>${window.UNIFEDElite?.formatCurrency(c.value)}</td>
                <td>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${c.probability * 100}%"></div>
                        <span class="progress-text">${(c.probability * 100).toFixed(0)}%</span>
                    </div>
                </td>
                <td><span class="status-badge status-${c.status}">${c.status === 'active' ? 'Ativo' : 'Concluído'}</span></td>
            </tr>
        `).join('');
    }
    
    startAutoRefresh() {
        if (this.refreshInterval) clearInterval(this.refreshInterval);
        
        this.refreshInterval = setInterval(async () => {
            await this.loadData();
            this.render();
        }, 30000);
    }
    
    setupEventListeners() {
        document.addEventListener('massLitigationProgress', (e) => {
            this.updateProgress(e.detail);
        });
        
        document.addEventListener('caseUpdated', () => {
            this.loadData();
            this.render();
        });
    }
    
    updateProgress(data) {
        const progressElement = document.getElementById(`batch-${data.batchId}-progress`);
        if (progressElement) {
            progressElement.style.width = `${data.progress}%`;
            progressElement.textContent = `${data.progress.toFixed(0)}%`;
        }
    }
    
    static handleAlert(alertId) {
        window.UNIFEDElite?.showToast(`A processar alerta ${alertId}...`, 'info');
    }
    
    async exportDashboard() {
        const data = {
            exportedAt: new Date().toISOString(),
            kpis: this.data.kpis,
            financials: this.data.financials,
            trends: this.data.trends,
            alerts: this.data.alerts
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `dashboard_export_${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }
}

// Instância global
window.PracticeDashboard = new PracticeDashboard();