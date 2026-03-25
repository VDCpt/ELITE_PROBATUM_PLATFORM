/**
 * ============================================================================
 * ELITE PROBATUM v2.0 — APLICAÇÃO PRINCIPAL
 * ============================================================================
 * VERSÃO FINAL - 27 PROCESSOS ESTRATÉGICOS
 * Áreas: Insolvência (CIRE), Contencioso Laboral, Civil, Penal, Fiscal,
 *        Comercial, Família, Propriedade Intelectual, Administrativo
 * ============================================================================
 */

(function() {
    'use strict';
    
    // =========================================================================
    // CONFIGURAÇÕES GLOBAIS
    // =========================================================================
    
    const APP_VERSION = '2.0';
    const MASTER_HASH = 'F8A9B2C1D4E5F6A7B8C9D0E1F2A3B4C5D6E7F8A9B0C1D2E3F4A5B6C7D8E9F0';
    
    // =========================================================================
    // UTILITÁRIOS
    // =========================================================================
    
    const EliteUtils = {
        formatCurrency: (value) => new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2 }).format(value || 0),
        formatDate: (date) => moment(date).format('DD/MM/YYYY'),
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
        }
    };
    
    // =========================================================================
    // MOCK DATA - 27 PROCESSOS ESTRATÉGICOS (9 ÁREAS x 3 PROCESSOS)
    // =========================================================================
    
    const MOCK_CASES = [
        // Insolvência (CIRE) - 3 processos
        { id: 'INS001', client: 'Construtora ABC, Lda', category: 'insolvency', value: 450000, successProbability: 0.48, status: 'active', court: 'Lisboa', startDate: '2022-08-15', hoursSpent: 120, resourceLevel: 'senior', evidence: ['Insolvência culposa', 'Lista de credores extensa'], adversary: 'PLMJ' },
        { id: 'INS002', client: 'Retail Solutions, Lda', category: 'insolvency', value: 125000, successProbability: 0.52, status: 'active', court: 'Porto', startDate: '2023-02-10', hoursSpent: 65, resourceLevel: 'associate', evidence: ['Exoneração passivo', 'Ativo remanescente'], adversary: 'VdA' },
        { id: 'INS003', client: 'Tech Start, Unipessoal', category: 'insolvency', value: 89000, successProbability: 0.44, status: 'pending', court: 'Braga', startDate: '2023-09-01', hoursSpent: 38, resourceLevel: 'junior', evidence: ['Processo CIRE', 'Credores privilegiados'], adversary: 'Garrigues' },
        
        // Contencioso Laboral - 3 processos
        { id: 'LAB001', client: 'Carlos Manuel Santos', category: 'labor', value: 15720, successProbability: 0.75, status: 'active', court: 'Porto', startDate: '2023-03-01', hoursSpent: 38, resourceLevel: 'associate', evidence: ['Despedimento ilícito', 'Testemunhas presenciais'], adversary: 'VdA' },
        { id: 'LAB002', client: 'Ana Sofia Rodrigues', category: 'labor', value: 28900, successProbability: 0.68, status: 'active', court: 'Lisboa', startDate: '2023-08-15', hoursSpent: 42, resourceLevel: 'senior', evidence: ['Contrato sem termo', 'Antiguidade 8 anos'], adversary: 'PLMJ' },
        { id: 'LAB003', client: 'Pedro Miguel Martins', category: 'labor', value: 9500, successProbability: 0.82, status: 'active', court: 'Lisboa', startDate: '2023-10-01', hoursSpent: 22, resourceLevel: 'junior', evidence: ['Despedimento coletivo', 'Acordo com sindicato'], adversary: 'Cuatrecasas' },
        
        // Direito Civil - 3 processos
        { id: 'CIV001', client: 'João Manuel Ferreira', category: 'civil', value: 28450, successProbability: 0.72, status: 'active', court: 'Lisboa', startDate: '2023-01-15', hoursSpent: 45, resourceLevel: 'senior', evidence: ['Prova documental completa', 'Jurisprudência favorável'], adversary: 'PLMJ' },
        { id: 'CIV002', client: 'Maria Isabel Lopes', category: 'civil', value: 15200, successProbability: 0.58, status: 'active', court: 'Porto', startDate: '2023-06-10', hoursSpent: 32, resourceLevel: 'associate', evidence: ['Prova testemunhal frágil', 'Ausência de perícia'], adversary: 'VdA' },
        { id: 'CIV003', client: 'António José Ribeiro', category: 'civil', value: 42300, successProbability: 0.81, status: 'active', court: 'Braga', startDate: '2023-09-20', hoursSpent: 28, resourceLevel: 'senior', evidence: ['Prova documental completa', 'Jurisprudência favorável'], adversary: 'Garrigues' },
        
        // Direito Fiscal - 3 processos
        { id: 'TAX001', client: 'Empresa XYZ, SA', category: 'tax', value: 125000, successProbability: 0.68, status: 'active', court: 'Lisboa', startDate: '2022-11-10', hoursSpent: 85, resourceLevel: 'senior', evidence: ['Notificação prévia AT', 'Prova digital com hash'], adversary: 'VdA' },
        { id: 'TAX002', client: 'Comércio Global, Lda', category: 'tax', value: 45200, successProbability: 0.61, status: 'active', court: 'Porto', startDate: '2023-04-20', hoursSpent: 52, resourceLevel: 'associate', evidence: ['Regularização espontânea', 'Jurisprudência desfavorável'], adversary: 'PLMJ' },
        { id: 'TAX003', client: 'Serviços Integrados, SA', category: 'tax', value: 78400, successProbability: 0.55, status: 'pending', court: 'Coimbra', startDate: '2023-07-05', hoursSpent: 48, resourceLevel: 'senior', evidence: ['Discrepância DAC7', 'Recurso pendente'], adversary: 'Garrigues' },
        
        // Direito Comercial - 3 processos
        { id: 'COM001', client: 'Distribuidora Nacional, Lda', category: 'commercial', value: 32400, successProbability: 0.88, status: 'active', court: 'Braga', startDate: '2023-05-15', hoursSpent: 35, resourceLevel: 'senior', evidence: ['Violação acordo', 'Cláusula penal'], adversary: 'Cuatrecasas' },
        { id: 'COM002', client: 'Importadora Europa, SA', category: 'commercial', value: 56700, successProbability: 0.71, status: 'active', court: 'Lisboa', startDate: '2023-03-20', hoursSpent: 48, resourceLevel: 'associate', evidence: ['Contrato internacional', 'Arbitragem'], adversary: 'VdA' },
        { id: 'COM003', client: 'Logística Expresso, Lda', category: 'commercial', value: 21300, successProbability: 0.79, status: 'pending', court: 'Porto', startDate: '2023-10-10', hoursSpent: 22, resourceLevel: 'junior', evidence: ['Faturação em falta', 'Diligências prévias'], adversary: 'PLMJ' },
        
        // Direito Penal - 3 processos
        { id: 'PEN001', client: 'Rui Fonseca', category: 'criminal', value: 0, successProbability: 0.72, status: 'active', court: 'Lisboa', startDate: '2023-01-20', hoursSpent: 55, resourceLevel: 'senior', evidence: ['Recurso penal', 'Prova testemunhal'], adversary: 'VdA' },
        { id: 'PEN002', client: 'Maria Santos', category: 'criminal', value: 0, successProbability: 0.58, status: 'active', court: 'Porto', startDate: '2023-06-15', hoursSpent: 42, resourceLevel: 'associate', evidence: ['Queixa crime', 'Prova digital'], adversary: 'PLMJ' },
        { id: 'PEN003', client: 'João Mendes', category: 'criminal', value: 0, successProbability: 0.65, status: 'pending', court: 'Braga', startDate: '2023-09-10', hoursSpent: 28, resourceLevel: 'junior', evidence: ['Habeas corpus', 'Medidas coação'], adversary: 'Garrigues' },
        
        // Direito da Família - 3 processos
        { id: 'FAM001', client: 'Ana Pereira', category: 'family', value: 8500, successProbability: 0.91, status: 'active', court: 'Lisboa', startDate: '2023-08-01', hoursSpent: 18, resourceLevel: 'associate', evidence: ['Regulação poder paternal', 'Acordo consensual'], adversary: 'Cuatrecasas' },
        { id: 'FAM002', client: 'Carlos Mendes', category: 'family', value: 12300, successProbability: 0.78, status: 'active', court: 'Porto', startDate: '2023-04-10', hoursSpent: 32, resourceLevel: 'senior', evidence: ['Divórcio litigioso', 'Partilha de bens'], adversary: 'VdA' },
        { id: 'FAM003', client: 'Sofia Rodrigues', category: 'family', value: 5600, successProbability: 0.85, status: 'pending', court: 'Coimbra', startDate: '2023-10-15', hoursSpent: 12, resourceLevel: 'junior', evidence: ['Alimentos devidos', 'Acordo prévio'], adversary: 'PLMJ' },
        
        // Propriedade Intelectual - 3 processos
        { id: 'IP001', client: 'Innovate Tech, Lda', category: 'intellectual', value: 45200, successProbability: 0.79, status: 'active', court: 'Porto', startDate: '2023-07-20', hoursSpent: 42, resourceLevel: 'senior', evidence: ['Violação patente', 'Prova pericial'], adversary: 'Garrigues' },
        { id: 'IP002', client: 'Creative Solutions, SA', category: 'intellectual', value: 28700, successProbability: 0.72, status: 'active', court: 'Lisboa', startDate: '2023-05-05', hoursSpent: 35, resourceLevel: 'associate', evidence: ['Marca registada', 'Contrafação'], adversary: 'VdA' },
        { id: 'IP003', client: 'Design Studio, Lda', category: 'intellectual', value: 15400, successProbability: 0.68, status: 'pending', court: 'Porto', startDate: '2023-09-25', hoursSpent: 24, resourceLevel: 'junior', evidence: ['Direitos autorais', 'Plágio'], adversary: 'PLMJ' },
        
        // Direito Administrativo - 3 processos
        { id: 'ADM001', client: 'Construções do Sul, SA', category: 'administrative', value: 18900, successProbability: 0.64, status: 'active', court: 'Lisboa', startDate: '2023-02-10', hoursSpent: 38, resourceLevel: 'senior', evidence: ['Impugnação ato administrativo'], adversary: 'Cuatrecasas' },
        { id: 'ADM002', client: 'Ambiente Sustentável, Lda', category: 'administrative', value: 32100, successProbability: 0.59, status: 'active', court: 'Porto', startDate: '2023-05-18', hoursSpent: 42, resourceLevel: 'associate', evidence: ['Licenciamento ambiental'], adversary: 'VdA' },
        { id: 'ADM003', client: 'Saúde Integrada, SA', category: 'administrative', value: 45600, successProbability: 0.71, status: 'pending', court: 'Coimbra', startDate: '2023-08-22', hoursSpent: 28, resourceLevel: 'junior', evidence: ['Concurso público', 'Caducidade'], adversary: 'PLMJ' }
    ];
    
    // =========================================================================
    // DASHBOARD RENDERER
    // =========================================================================
    
    let activeCharts = {};
    
    function renderDashboard() {
        const container = document.getElementById('viewContainer');
        if (!container) {
            console.error('[ELITE] viewContainer não encontrado');
            return;
        }
        
        const totalValue = MOCK_CASES.reduce((sum, c) => sum + (c.value || 0), 0);
        const activeCases = MOCK_CASES.filter(c => c.status === 'active').length;
        const avgProb = MOCK_CASES.reduce((sum, c) => sum + (c.successProbability || 0.6), 0) / MOCK_CASES.length;
        
        // Calcular distribuição por categoria
        const categoryCount = {};
        MOCK_CASES.forEach(c => {
            const catName = getCategoryName(c.category);
            categoryCount[catName] = (categoryCount[catName] || 0) + 1;
        });
        
        container.innerHTML = `
            <div class="dashboard-grid">
                <div class="dashboard-card">
                    <div class="card-header"><h3>Processos Ativos</h3><i class="fas fa-folder-open"></i></div>
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
                    <div class="card-value">${EliteUtils.formatPercentage(avgProb * 100)}</div>
                    <div class="card-trend trend-up"><i class="fas fa-arrow-up"></i> +5% com IA</div>
                </div>
                <div class="dashboard-card">
                    <div class="card-header"><h3>ROI Estimado</h3><i class="fas fa-chart-pie"></i></div>
                    <div class="card-value">284%</div>
                    <div class="card-trend trend-up"><i class="fas fa-arrow-up"></i> vs. mercado</div>
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
                <h3>Alertas Estratégicos</h3>
                <div class="alerts-list">
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
        
        // Inicializar gráficos
        initPortfolioChart();
        initCategoryChart(categoryCount);
    }
    
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
                    borderColor: '#00E5FF',
                    backgroundColor: 'rgba(0, 229, 255, 0.1)',
                    tension: 0.4,
                    fill: true,
                    pointRadius: 4,
                    pointHoverRadius: 8,
                    pointBackgroundColor: '#00E5FF'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { labels: { color: '#E2E8F0', font: { size: 11 } } },
                    tooltip: { backgroundColor: '#111318', titleColor: '#00E5FF', bodyColor: '#FFFFFF' }
                },
                scales: {
                    y: { ticks: { color: '#94A3B8', callback: (v) => '€' + (v/1000).toFixed(0) + 'k' }, grid: { color: 'rgba(255,255,255,0.1)' } },
                    x: { ticks: { color: '#94A3B8' }, grid: { color: 'rgba(255,255,255,0.05)' } }
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
        const colors = [
            '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
            '#00E5FF', '#EC489A', '#14B8A6', '#F97316'
        ];
        
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
                    legend: { position: 'right', labels: { color: '#E2E8F0', font: { size: 10 }, boxWidth: 12 } },
                    tooltip: {
                        backgroundColor: '#111318',
                        titleColor: '#00E5FF',
                        bodyColor: '#FFFFFF',
                        callbacks: { label: (ctx) => `${ctx.label}: ${ctx.raw} processos` }
                    }
                }
            }
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
        
        initDashboard: function() {
            EliteUtils.log('Inicializando Dashboard ELITE PROBATUM v2.0...');
            renderDashboard();
            EliteUtils.showToast('Dashboard carregado com 27 processos estratégicos', 'success');
            EliteUtils.log(`✅ ${MOCK_CASES.length} processos carregados com sucesso`);
        },
        
        getCasesByCategory: function(category) {
            return MOCK_CASES.filter(c => c.category === category);
        },
        
        getCaseById: function(id) {
            return MOCK_CASES.find(c => c.id === id);
        },
        
        getTotalValue: function() {
            return MOCK_CASES.reduce((sum, c) => sum + (c.value || 0), 0);
        },
        
        getActiveCasesCount: function() {
            return MOCK_CASES.filter(c => c.status === 'active').length;
        }
    };
    
    window.EliteUtils = EliteUtils;
    
    EliteUtils.log(`========================================`);
    EliteUtils.log(`ELITE PROBATUM v${APP_VERSION}`);
    EliteUtils.log(`Master Hash: ${MASTER_HASH.substring(0, 16)}...`);
    EliteUtils.log(`${MOCK_CASES.length} processos estratégicos carregados`);
    EliteUtils.log(`9 áreas do direito representadas`);
    EliteUtils.log(`========================================`);
    
    // Auto-execução para verificação
    console.log('[ELITE] Módulos carregados. Aguardando autenticação...');
    
})();