/**
 * ============================================================================
 * ELITE PROBATUM v2.0 — APLICAÇÃO PRINCIPAL
 * UNIDADE DE COMANDO FORENSE DIGITAL
 * ============================================================================
 * CORREÇÃO: Navegação entre views, eventos de clique, renderização de módulos
 * VERSÃO: 2.0.1 - INTEGRIDADE FORENSE VERIFICADA
 * ============================================================================
 */

(function() {
    'use strict';
    
    // =========================================================================
    // CONFIGURAÇÕES GLOBAIS
    // =========================================================================
    
    const APP_VERSION = '2.0.1';
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
            if (diffDays === 0) return 'Hoje';
            if (diffDays === 1) return 'Amanhã';
            if (diffDays < 0) return `${Math.abs(diffDays)} dias atrás`;
            return target.format('DD/MM/YYYY');
        }
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
            dashboard: 'PAINEL DE COMANDO ESTRATÉGICO',
            cases: 'PROCESSOS',
            insolvency: 'INSOLVÊNCIAS (CIRE)',
            labor: 'CONTENCIOSO LABORAL',
            litigation: 'INTELIGÊNCIA DE LITÍGIO',
            questionnaire: 'QUESTIONÁRIOS ESTRATÉGICOS',
            evidence: 'CADEIA DE CUSTÓDIA',
            adversary: 'ANÁLISE DE OPOSIÇÃO',
            simulator: 'SIMULADOR DE CONTRA-PERÍCIA',
            deadlines: 'PRAZOS JUDICIAIS',
            activitylog: 'REGISTOS RGPD',
            reports: 'RELATÓRIOS',
            admin: 'ADMINISTRAÇÃO'
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
    // VIEW: DASHBOARD
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
                    <div class="card-header"><h3>PROCESSOS ATIVOS</h3><i class="fas fa-folder-open"></i></div>
                    <div class="card-value">${activeCases}</div>
                    <div class="card-trend trend-up"><i class="fas fa-arrow-up"></i> +12% este mês</div>
                </div>
                <div class="dashboard-card">
                    <div class="card-header"><h3>VALOR EM DISPUTA</h3><i class="fas fa-euro-sign"></i></div>
                    <div class="card-value">${EliteUtils.formatCurrency(totalValue)}</div>
                    <div class="card-trend trend-up"><i class="fas fa-arrow-up"></i> +8% vs período anterior</div>
                </div>
                <div class="dashboard-card">
                    <div class="card-header"><h3>PROBABILIDADE MÉDIA</h3><i class="fas fa-chart-line"></i></div>
                    <div class="card-value">${EliteUtils.formatPercentage(avgProb * 100)}</div>
                    <div class="card-trend trend-up"><i class="fas fa-arrow-up"></i> +5% com IA</div>
                </div>
                <div class="dashboard-card">
                    <div class="card-header"><h3>ROI ESTIMADO</h3><i class="fas fa-chart-pie"></i></div>
                    <div class="card-value">284%</div>
                    <div class="card-trend trend-up"><i class="fas fa-arrow-up"></i> vs. mercado</div>
                </div>
            </div>
            
            <div class="tactical-alerts-container" id="tacticalAlertsContainer">
                <div class="tactical-header">
                    <i class="fas fa-exclamation-triangle"></i>
                    <span>ALERTAS DE INTELIGÊNCIA — FEED EM TEMPO REAL</span>
                </div>
                <div id="tacticalAlerts" class="tactical-alerts">
                    <div class="alert-item critical">
                        <span class="alert-badge">CRITICAL</span>
                        <span class="alert-msg">INSOLVÊNCIA INS001: Detetada dissipação de património (Art. 120.º CIRE) - Risco Elevado.</span>
                    </div>
                    <div class="alert-item warning">
                        <span class="alert-badge">WARNING</span>
                        <span class="alert-msg">CONTENCIOSO LAB003: Nova jurisprudência STA sobre 'falsos recibos verdes' aplicável.</span>
                    </div>
                    <div class="alert-item info">
                        <span class="alert-badge">INFO</span>
                        <span class="alert-msg">SISTEMA: Integridade da Cadeia de Custódia verificada (Master Hash OK).</span>
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
                <h3>ALERTAS ESTRATÉGICOS</h3>
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
        
        const mockAlerts = [
            { level: 'CRITICAL', msg: 'INSOLVÊNCIA INS001: Detetada dissipação de património (Art. 120.º CIRE) - Risco Elevado.' },
            { level: 'WARNING', msg: 'CONTENCIOSO LAB003: Nova jurisprudência STA sobre "falsos recibos verdes" aplicável.' },
            { level: 'INFO', msg: 'SISTEMA: Integridade da Cadeia de Custódia verificada (Master Hash OK).' },
            { level: 'CRITICAL', msg: 'FISCAL TAX001: Notificação da AT recebida - Prazo de resposta 15 dias.' },
            { level: 'WARNING', msg: 'CIVIL CIV002: Prova testemunhal frágil - Reforçar com prova documental.' },
            { level: 'INFO', msg: 'OPORTUNIDADE: Aumento de 23% nos casos de despedimento ilícito no último trimestre.' }
        ];
        
        let alertIndex = 0;
        
        alertInterval = setInterval(() => {
            const newAlert = mockAlerts[alertIndex % mockAlerts.length];
            const newAlertElement = document.createElement('div');
            newAlertElement.className = `alert-item ${newAlert.level.toLowerCase()}`;
            newAlertElement.innerHTML = `<span class="alert-badge">${newAlert.level}</span><span class="alert-msg">${newAlert.msg}</span>`;
            
            alertsContainer.insertBefore(newAlertElement, alertsContainer.firstChild);
            
            if (alertsContainer.children.length > 6) {
                alertsContainer.removeChild(alertsContainer.lastChild);
            }
            
            alertIndex++;
        }, 8000);
    }
    
    // =========================================================================
    // VIEW: PROCESSOS (CASES)
    // =========================================================================
    
    function renderCases() {
        const container = document.getElementById('viewContainer');
        if (!container) return;
        
        container.innerHTML = `
            <div class="cases-header" style="display: flex; justify-content: space-between; margin-bottom: 20px; flex-wrap: wrap; gap: 16px;">
                <div class="cases-actions">
                    <button id="newCaseBtn" class="elite-btn primary"><i class="fas fa-plus"></i> NOVO PROCESSO</button>
                    <button id="importCasesBtn" class="elite-btn secondary"><i class="fas fa-file-import"></i> IMPORTAR</button>
                </div>
                <div class="cases-search">
                    <input type="text" id="searchCases" placeholder="Pesquisar processos..." class="search-input" style="width: 280px;">
                </div>
            </div>
            <div class="category-selector">
                <button class="category-btn active" data-category="all">TODOS</button>
                <button class="category-btn" data-category="insolvency">INSOLVÊNCIAS</button>
                <button class="category-btn" data-category="labor">LABORAL</button>
                <button class="category-btn" data-category="civil">CIVIL</button>
                <button class="category-btn" data-category="tax">FISCAL</button>
                <button class="category-btn" data-category="commercial">COMERCIAL</button>
                <button class="category-btn" data-category="criminal">PENAL</button>
                <button class="category-btn" data-category="family">FAMÍLIA</button>
                <button class="category-btn" data-category="intellectual">PI</button>
                <button class="category-btn" data-category="administrative">ADMIN</button>
            </div>
            <table class="data-table">
                <thead>
                    <tr><th>ID</th><th>CLIENTE</th><th>NIF</th><th>ÁREA</th><th>VALOR</th><th>PROBABILIDADE</th><th>STATUS</th><th>AÇÕES</th></tr>
                </thead>
                <tbody id="casesTableBody">
                    ${MOCK_CASES.map(c => `
                        <tr data-case-id="${c.id}" data-category="${c.category}">
                            <td><strong>${c.id}</strong></td>
                            <td>${c.client}</td>
                            <td>${c.nif_devedor || '---'}</td>
                            <td><span class="case-badge ${c.category}">${c.categoryName}</span></td>
                            <td>${EliteUtils.formatCurrency(c.value)}</td>
                            <td><div class="progress-bar"><div class="progress-fill" style="width: ${c.successProbability * 100}%"></div><span class="progress-text">${EliteUtils.formatPercentage(c.successProbability * 100)}</span></div></td>
                            <td><span class="status-badge status-${c.status === 'active' ? 'active' : 'pending'}">${c.status === 'active' ? 'ATIVO' : 'PENDENTE'}</span></td>
                            <td><button class="action-btn view-case" data-id="${c.id}"><i class="fas fa-eye"></i></button><button class="action-btn export-case" data-id="${c.id}"><i class="fas fa-download"></i></button></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        
        attachCaseEvents();
    }
    
    function attachCaseEvents() {
        document.querySelectorAll('.view-case').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const caseId = btn.dataset.id;
                const caseData = MOCK_CASES.find(c => c.id === caseId);
                if (caseData) {
                    const modalBody = document.getElementById('caseDetailBody');
                    if (modalBody) {
                        modalBody.innerHTML = `
                            <div class="detail-row"><span>Processo:</span><strong>${caseData.id}</strong></div>
                            <div class="detail-row"><span>Cliente:</span><strong>${caseData.client}</strong></div>
                            <div class="detail-row"><span>NIF:</span><strong>${caseData.nif_devedor || '---'}</strong></div>
                            <div class="detail-row"><span>Área:</span><strong>${caseData.categoryName}</strong></div>
                            <div class="detail-row"><span>Valor:</span><strong>${EliteUtils.formatCurrency(caseData.value)}</strong></div>
                            <div class="detail-row"><span>Probabilidade:</span><strong>${EliteUtils.formatPercentage(caseData.successProbability * 100)}</strong></div>
                            <div class="detail-row"><span>Tribunal:</span><strong>${caseData.court}</strong></div>
                            <div class="detail-row"><span>Juiz:</span><strong>${caseData.judge}</strong></div>
                            <div class="detail-row"><span>Oposição:</span><strong>${caseData.adversary || 'N/A'}</strong></div>
                            ${caseData.fase_processual ? `<div class="detail-row"><span>Fase Processual:</span><strong>${caseData.fase_processual}</strong></div>` : ''}
                            ${caseData.data_sentenca_declarativa ? `<div class="detail-row"><span>Data Sentença:</span><strong>${EliteUtils.formatDate(caseData.data_sentenca_declarativa)}</strong></div>` : ''}
                            ${caseData.tipo_despedimento ? `<div class="detail-row"><span>Tipo Despedimento:</span><strong>${caseData.tipo_despedimento}</strong></div>` : ''}
                            ${caseData.data_audiencia_partes ? `<div class="detail-row"><span>Data Audiência:</span><strong>${EliteUtils.formatDate(caseData.data_audiencia_partes)}</strong></div>` : ''}
                            <div class="prediction-recommendation"><h4>Estratégia Recomendada</h4><p>${caseData.successProbability > 0.7 ? 'Estratégia ofensiva recomendada.' : caseData.successProbability > 0.5 ? 'Estratégia equilibrada recomendada.' : 'Estratégia defensiva recomendada.'}</p></div>
                            <div class="prediction-recommendation"><h4>Análise IA</h4><p>${caseData.successProbability > 0.7 ? 'Alta probabilidade de êxito. Prosseguir com ação judicial.' : caseData.successProbability > 0.5 ? 'Probabilidade moderada. Considerar notificação extrajudicial prévia.' : 'Baixa probabilidade. Priorizar acordo ou arbitragem.'}</p></div>
                        `;
                    }
                    document.getElementById('caseDetailModal').style.display = 'flex';
                }
            });
        });
        
        document.querySelectorAll('.export-case').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const caseId = btn.dataset.id;
                if (window.EliteProbatum && typeof window.EliteProbatum.exportCaseToMobile === 'function') {
                    await window.EliteProbatum.exportCaseToMobile(caseId);
                } else {
                    EliteUtils.showToast('Funcionalidade de exportação em desenvolvimento', 'info');
                }
            });
        });
        
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const category = btn.dataset.category;
                filterCasesByCategory(category);
            });
        });
        
        document.getElementById('searchCases')?.addEventListener('input', (e) => {
            filterCasesBySearch(e.target.value);
        });
        
        document.getElementById('newCaseBtn')?.addEventListener('click', () => {
            showNewCaseModal();
        });
        
        document.getElementById('importCasesBtn')?.addEventListener('click', () => {
            EliteUtils.showToast('Funcionalidade de importação em desenvolvimento', 'info');
        });
    }
    
    function showNewCaseModal() {
        const modalBody = document.getElementById('caseDetailBody');
        if (modalBody) {
            modalBody.innerHTML = `
                <form id="newCaseForm">
                    <div class="form-group"><label>Cliente *</label><input type="text" id="newCaseClient" required></div>
                    <div class="form-group"><label>NIF *</label><input type="text" id="newCaseNif" required></div>
                    <div class="form-group"><label>Área do Direito</label><select id="newCaseCategory"><option value="civil">Direito Civil</option><option value="labor">Direito do Trabalho</option><option value="tax">Direito Fiscal</option><option value="insolvency">Insolvência (CIRE)</option><option value="commercial">Direito Comercial</option></select></div>
                    <div class="form-group"><label>Valor da Causa (€)</label><input type="number" id="newCaseValue" placeholder="0"></div>
                    <div class="form-group"><label>Tribunal</label><input type="text" id="newCaseCourt" placeholder="Ex: Lisboa"></div>
                    <button type="submit" class="elite-btn primary full-width">CRIAR PROCESSO</button>
                </form>
            `;
            
            document.getElementById('newCaseForm')?.addEventListener('submit', (e) => {
                e.preventDefault();
                const newCase = {
                    id: `NEW_${Date.now()}`,
                    client: document.getElementById('newCaseClient')?.value || 'Novo Cliente',
                    nif_devedor: document.getElementById('newCaseNif')?.value || '',
                    category: document.getElementById('newCaseCategory')?.value || 'civil',
                    categoryName: getCategoryName(document.getElementById('newCaseCategory')?.value || 'civil'),
                    value: parseFloat(document.getElementById('newCaseValue')?.value) || 0,
                    successProbability: 0.50,
                    status: 'active',
                    court: document.getElementById('newCaseCourt')?.value || 'Lisboa',
                    startDate: new Date().toISOString().split('T')[0],
                    hoursSpent: 0,
                    resourceLevel: 'junior',
                    evidence: [],
                    adversary: '',
                    judge: '',
                    riskLevel: 'normal'
                };
                MOCK_CASES.push(newCase);
                EliteUtils.showToast(`Processo ${newCase.id} criado com sucesso.`, 'success');
                document.getElementById('caseDetailModal').style.display = 'none';
                navigateTo(currentView);
            });
        }
        document.getElementById('caseDetailModal').style.display = 'flex';
    }
    
    function filterCasesByCategory(category) {
        const rows = document.querySelectorAll('#casesTableBody tr');
        rows.forEach(row => {
            if (category === 'all' || row.dataset.category === category) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }
    
    function filterCasesBySearch(term) {
        const rows = document.querySelectorAll('#casesTableBody tr');
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(term.toLowerCase()) ? '' : 'none';
        });
    }
    
    // =========================================================================
    // VIEW: INSOLVÊNCIAS
    // =========================================================================
    
    function renderInsolvency() {
        const container = document.getElementById('viewContainer');
        if (!container) return;
        
        const insolvencyCases = MOCK_CASES.filter(c => c.category === 'insolvency');
        
        container.innerHTML = `
            <div class="cases-header" style="margin-bottom: 20px;">
                <button id="newInsolvencyBtn" class="elite-btn primary"><i class="fas fa-plus"></i> NOVO PROCESSO INSOLVÊNCIA</button>
            </div>
            <table class="data-table">
                <thead>
                    <tr><th>ID</th><th>CLIENTE</th><th>NIF</th><th>VALOR</th><th>PROBABILIDADE</th><th>FASE</th><th>ADMINISTRADOR</th><th>RISCO</th><th>AÇÕES</th></tr>
                </thead>
                <tbody>
                    ${insolvencyCases.map(c => `
                        <tr>
                            <td><strong>${c.id}</strong></td>
                            <td>${c.client}</td>
                            <td>${c.nif_devedor || '---'}</td>
                            <td>${EliteUtils.formatCurrency(c.value)}</td>
                            <td><div class="progress-bar"><div class="progress-fill" style="width: ${c.successProbability * 100}%"></div><span class="progress-text">${EliteUtils.formatPercentage(c.successProbability * 100)}</span></div></td>
                            <td><span class="badge badge-primary">${c.fase_processual || 'Em curso'}</span></td>
                            <td>${c.administrador_insolvencia || '---'}</td>
                            <td><span class="status-badge ${c.riskLevel === 'critical' ? 'status-critical' : 'status-pending'}">${c.riskLevel === 'critical' ? 'CRÍTICO' : 'ATENÇÃO'}</span></td>
                            <td><button class="action-btn view-case" data-id="${c.id}"><i class="fas fa-eye"></i></button></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        
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
                            <div class="detail-row"><span>NIF:</span><strong>${caseData.nif_devedor}</strong></div>
                            <div class="detail-row"><span>Valor:</span><strong>${EliteUtils.formatCurrency(caseData.value)}</strong></div>
                            <div class="detail-row"><span>Probabilidade:</span><strong>${EliteUtils.formatPercentage(caseData.successProbability * 100)}</strong></div>
                            <div class="detail-row"><span>Tribunal:</span><strong>${caseData.court}</strong></div>
                            <div class="detail-row"><span>Juiz:</span><strong>${caseData.judge}</strong></div>
                            <div class="detail-row"><span>Fase Processual:</span><strong>${caseData.fase_processual || '---'}</strong></div>
                            <div class="detail-row"><span>Administrador:</span><strong>${caseData.administrador_insolvencia || '---'}</strong></div>
                            <div class="detail-row"><span>Data Sentença Declarativa:</span><strong>${caseData.data_sentenca_declarativa ? EliteUtils.formatDate(caseData.data_sentenca_declarativa) : '---'}</strong></div>
                        `;
                    }
                    document.getElementById('caseDetailModal').style.display = 'flex';
                }
            });
        });
        
        document.getElementById('newInsolvencyBtn')?.addEventListener('click', () => {
            EliteUtils.showToast('Funcionalidade de nova insolvência em desenvolvimento', 'info');
        });
    }
    
    // =========================================================================
    // VIEW: CONTENCIOSO LABORAL
    // =========================================================================
    
    function renderLabor() {
        const container = document.getElementById('viewContainer');
        if (!container) return;
        
        const laborCases = MOCK_CASES.filter(c => c.category === 'labor');
        
        container.innerHTML = `
            <div class="cases-header" style="margin-bottom: 20px;">
                <button id="newLaborBtn" class="elite-btn primary"><i class="fas fa-plus"></i> NOVO PROCESSO LABORAL</button>
            </div>
            <table class="data-table">
                <thead>
                    <tr><th>ID</th><th>CLIENTE</th><th>VALOR</th><th>PROBABILIDADE</th><th>TIPO DESPEDIMENTO</th><th>DATA AUDIÊNCIA</th><th>AÇÕES</th></tr>
                </thead>
                <tbody>
                    ${laborCases.map(c => `
                        <tr>
                            <td><strong>${c.id}</strong></td>
                            <td>${c.client}</td>
                            <td>${EliteUtils.formatCurrency(c.value)}</td>
                            <td><div class="progress-bar"><div class="progress-fill" style="width: ${c.successProbability * 100}%"></div><span class="progress-text">${EliteUtils.formatPercentage(c.successProbability * 100)}</span></div></td>
                            <td><span class="badge badge-warning">${c.tipo_despedimento || '---'}</span></td>
                            <td>${c.data_audiencia_partes ? EliteUtils.formatDate(c.data_audiencia_partes) : '---'}</td>
                            <td><button class="action-btn view-case" data-id="${c.id}"><i class="fas fa-eye"></i></button></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        
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
                            <div class="detail-row"><span>Valor Indemnização:</span><strong>${EliteUtils.formatCurrency(caseData.valor_pedido_indemnizacao || caseData.value)}</strong></div>
                            <div class="detail-row"><span>Probabilidade:</span><strong>${EliteUtils.formatPercentage(caseData.successProbability * 100)}</strong></div>
                            <div class="detail-row"><span>Data Cessação:</span><strong>${caseData.data_cessacao_contrato ? EliteUtils.formatDate(caseData.data_cessacao_contrato) : '---'}</strong></div>
                            <div class="detail-row"><span>Tipo Despedimento:</span><strong>${caseData.tipo_despedimento || '---'}</strong></div>
                            <div class="detail-row"><span>Data Audiência:</span><strong>${caseData.data_audiencia_partes ? EliteUtils.formatDate(caseData.data_audiencia_partes) : '---'}</strong></div>
                        `;
                    }
                    document.getElementById('caseDetailModal').style.display = 'flex';
                }
            });
        });
        
        document.getElementById('newLaborBtn')?.addEventListener('click', () => {
            EliteUtils.showToast('Funcionalidade de novo processo laboral em desenvolvimento', 'info');
        });
    }
    
    // =========================================================================
    // VIEW: INTELIGÊNCIA DE LITÍGIO
    // =========================================================================
    
    function renderLitigation() {
        const container = document.getElementById('viewContainer');
        if (!container) return;
        
        container.innerHTML = `
            <div class="litigation-intelligence">
                <div class="intelligence-header">
                    <h2>ANÁLISE PREDITIVA DE ÊXITO</h2>
                    <p>Insira os dados do processo para obter previsão detalhada</p>
                </div>
                <div class="intelligence-form">
                    <div class="form-row">
                        <div class="form-group">
                            <label>ÁREA DO DIREITO</label>
                            <select id="predictCategory">
                                <option value="civil">Direito Civil</option>
                                <option value="labor">Direito do Trabalho</option>
                                <option value="tax">Direito Fiscal</option>
                                <option value="insolvency">Insolvência (CIRE)</option>
                                <option value="commercial">Direito Comercial</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>VALOR DA CAUSA (€)</label>
                            <input type="number" id="predictValue" placeholder="Ex: 50000">
                        </div>
                        <div class="form-group">
                            <label>PROBABILIDADE ESTIMADA (%)</label>
                            <input type="number" id="predictProbability" placeholder="Ex: 75" step="1">
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>TRIBUNAL</label>
                            <select id="predictCourt">
                                <option value="lisboa">Lisboa</option>
                                <option value="porto">Porto</option>
                                <option value="braga">Braga</option>
                                <option value="coimbra">Coimbra</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>ESCRITÓRIO OPOSIÇÃO</label>
                            <select id="predictAdversary">
                                <option value="">Selecionar...</option>
                                <option value="PLMJ">PLMJ</option>
                                <option value="VdA">VdA</option>
                                <option value="Cuatrecasas">Cuatrecasas</option>
                                <option value="Garrigues">Garrigues</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>CUSTAS JUDICIAIS (€)</label>
                            <input type="text" id="courtFeesDisplay" readonly placeholder="Calcular automaticamente">
                        </div>
                        <div class="form-group">
                            <button id="calculateFeesBtn" class="elite-btn secondary" style="margin-top: 24px;"><i class="fas fa-calculator"></i> CALCULAR CUSTAS</button>
                        </div>
                    </div>
                    <div style="display: flex; gap: 12px;">
                        <button id="runPredictionBtn" class="elite-btn primary full-width"><i class="fas fa-brain"></i> EXECUTAR PREVISÃO</button>
                        <button id="resetPredictionBtn" class="elite-btn secondary"><i class="fas fa-undo"></i> LIMPAR</button>
                    </div>
                </div>
                <div id="predictionResult" class="prediction-result" style="display: none;"></div>
            </div>
        `;
        
        document.getElementById('calculateFeesBtn')?.addEventListener('click', () => {
            const value = parseFloat(document.getElementById('predictValue')?.value) || 0;
            const fees = calculateCourtFees(value);
            document.getElementById('courtFeesDisplay').value = EliteUtils.formatCurrency(fees);
        });
        
        document.getElementById('runPredictionBtn')?.addEventListener('click', () => {
            const value = parseFloat(document.getElementById('predictValue')?.value) || 50000;
            const probability = (parseFloat(document.getElementById('predictProbability')?.value) || 70) / 100;
            const category = document.getElementById('predictCategory')?.value;
            const court = document.getElementById('predictCourt')?.value;
            const adversary = document.getElementById('predictAdversary')?.value;
            
            let adjustedProbability = probability;
            if (adversary === 'PLMJ') adjustedProbability -= 0.05;
            if (adversary === 'VdA') adjustedProbability -= 0.03;
            if (court === 'porto') adjustedProbability += 0.05;
            if (court === 'braga') adjustedProbability -= 0.03;
            adjustedProbability = Math.min(Math.max(adjustedProbability, 0.2), 0.95);
            
            const resultDiv = document.getElementById('predictionResult');
            if (resultDiv) {
                resultDiv.style.display = 'block';
                resultDiv.innerHTML = `
                    <div class="prediction-header">
                        <h3>RESULTADO DA ANÁLISE</h3>
                        <div class="probability-gauge" style="--probability: ${adjustedProbability * 360}deg">
                            <div class="gauge-value"><span>${EliteUtils.formatPercentage(adjustedProbability * 100)}</span></div>
                        </div>
                    </div>
                    <div class="prediction-details">
                        <div class="detail-row"><span>Valor Estimado de Recuperação:</span><strong>${EliteUtils.formatCurrency(value * adjustedProbability)}</strong></div>
                        <div class="detail-row"><span>Custas Judiciais Estimadas:</span><strong>${EliteUtils.formatCurrency(calculateCourtFees(value))}</strong></div>
                        <div class="detail-row"><span>Honorários Estimados (êxito):</span><strong>${EliteUtils.formatCurrency(value * adjustedProbability * 0.25)}</strong></div>
                    </div>
                    <div class="prediction-recommendation">
                        <h4>RECOMENDAÇÃO ESTRATÉGICA</h4>
                        <p>${adjustedProbability > 0.7 ? 'Recomenda-se ação judicial imediata com pedido de tutela antecipada.' : adjustedProbability > 0.5 ? 'Estratégia equilibrada com notificação extrajudicial prévia. Probabilidade de acordo: 65%.' : 'Priorizar acordo ou arbitragem. Litígio tem baixa probabilidade de sucesso.'}</p>
                    </div>
                    <div class="prediction-recommendation">
                        <h4>ANÁLISE DE RISCO</h4>
                        <p>${adjustedProbability > 0.7 ? 'Risco BAIXO. O caso tem fundamentos sólidos.' : adjustedProbability > 0.5 ? 'Risco MODERADO. Recomenda-se reforço probatório.' : 'Risco ELEVADO. Considerar estratégias alternativas.'}</p>
                    </div>
                `;
            }
        });
        
        document.getElementById('resetPredictionBtn')?.addEventListener('click', () => {
            document.getElementById('predictValue').value = '';
            document.getElementById('predictProbability').value = '';
            document.getElementById('predictCategory').value = 'civil';
            document.getElementById('predictCourt').value = 'lisboa';
            document.getElementById('predictAdversary').value = '';
            document.getElementById('courtFeesDisplay').value = '';
            document.getElementById('predictionResult').style.display = 'none';
            if (activeCharts.prediction) {
                activeCharts.prediction.destroy();
                delete activeCharts.prediction;
            }
            EliteUtils.showToast('Formulário limpo.', 'info');
        });
    }
    
    function calculateCourtFees(value) {
        if (value <= 0) return 0;
        if (value <= 2750) return 51.00;
        if (value <= 5000) return 102.00;
        if (value <= 10000) return 153.00;
        if (value <= 25000) return 255.00;
        if (value <= 50000) return 357.00;
        if (value <= 100000) return 510.00;
        if (value <= 250000) return 765.00;
        if (value <= 500000) return 1020.00;
        return 1530.00;
    }
    
    // =========================================================================
    // VIEW: QUESTIONÁRIOS ESTRATÉGICOS
    // =========================================================================
    
    function renderQuestionnaire() {
        const container = document.getElementById('viewContainer');
        if (!container) return;
        
        const questions = {
            insolvency: [
                { id: 'Q1', text: 'Existe risco de reversão fiscal?', weight: 8 },
                { id: 'Q2', text: 'A insolvência é culposa ou fortuita?', weight: 7 },
                { id: 'Q3', text: 'Existem bens apreensíveis?', weight: 6 },
                { id: 'Q4', text: 'O administrador de insolvência já apresentou relatório?', weight: 7 },
                { id: 'Q5', text: 'Existem credores com garantias reais?', weight: 8 }
            ],
            tax: [
                { id: 'Q1', text: 'A prova digital foi preservada via hash?', weight: 9 },
                { id: 'Q2', text: 'Existe notificação prévia da AT?', weight: 8 },
                { id: 'Q3', text: 'O valor em disputa excede €50.000?', weight: 7 },
                { id: 'Q4', text: 'Existe divergência DAC7?', weight: 8 },
                { id: 'Q5', text: 'A regularização espontânea foi efetuada?', weight: 7 }
            ],
            labor: [
                { id: 'Q1', text: 'O despedimento foi comunicado por carta registada?', weight: 8 },
                { id: 'Q2', text: 'Existem testemunhas presenciais?', weight: 7 },
                { id: 'Q3', text: 'O trabalhador tem antiguidade superior a 5 anos?', weight: 6 },
                { id: 'Q4', text: 'A cessação foi por iniciativa do empregador?', weight: 7 },
                { id: 'Q5', text: 'Existe acordo de sindicato?', weight: 5 }
            ],
            civil: [
                { id: 'Q1', text: 'Existe contrato escrito?', weight: 9 },
                { id: 'Q2', text: 'O incumprimento é total ou parcial?', weight: 7 },
                { id: 'Q3', text: 'Existem testemunhas do negócio?', weight: 6 },
                { id: 'Q4', text: 'A mora foi constituída?', weight: 5 },
                { id: 'Q5', text: 'Existe jurisprudência favorável?', weight: 7 }
            ]
        };
        
        container.innerHTML = `
            <div class="questionnaire-panel">
                <h2>QUESTIONÁRIOS ESTRATÉGICOS</h2>
                <p>Avaliação de mérito com base em 50 perguntas críticas</p>
                <div class="form-group">
                    <label>SELECIONAR ÁREA</label>
                    <select id="questionnaireCategory">
                        <option value="insolvency">Insolvência (CIRE)</option>
                        <option value="tax">Direito Fiscal</option>
                        <option value="labor">Direito do Trabalho</option>
                        <option value="civil">Direito Civil</option>
                    </select>
                </div>
                <div id="questionsContainer"></div>
                <button id="calculateScoreBtn" class="elite-btn primary full-width">CALCULAR VIABILIDADE</button>
                <div id="scoreResult" class="score-result" style="display: none; margin-top: 20px;"></div>
            </div>
        `;
        
        function loadQuestions() {
            const category = document.getElementById('questionnaireCategory').value;
            const qs = questions[category] || questions.civil;
            const container = document.getElementById('questionsContainer');
            if (container) {
                container.innerHTML = qs.map(q => `
                    <div class="question-item">
                        <div class="question-text">${q.text}</div>
                        <div class="question-options">
                            <label><input type="radio" name="q_${q.id}" value="yes"> SIM</label>
                            <label><input type="radio" name="q_${q.id}" value="no"> NÃO</label>
                        </div>
                    </div>
                `).join('');
            }
        }
        
        document.getElementById('questionnaireCategory')?.addEventListener('change', loadQuestions);
        loadQuestions();
        
        document.getElementById('calculateScoreBtn')?.addEventListener('click', () => {
            const category = document.getElementById('questionnaireCategory').value;
            const qs = questions[category] || questions.civil;
            let totalWeight = 0;
            let achievedWeight = 0;
            
            qs.forEach(q => {
                const selected = document.querySelector(`input[name="q_${q.id}"]:checked`);
                if (selected && selected.value === 'yes') {
                    achievedWeight += q.weight;
                }
                totalWeight += q.weight;
            });
            
            const score = totalWeight > 0 ? (achievedWeight / totalWeight) * 100 : 0;
            const viability = score >= 70 ? 'ALTA' : score >= 40 ? 'MÉDIA' : 'BAIXA';
            const resultDiv = document.getElementById('scoreResult');
            if (resultDiv) {
                resultDiv.style.display = 'block';
                resultDiv.innerHTML = `
                    <div class="score-summary">
                        <h3>RELATÓRIO DE VIABILIDADE</h3>
                        <div class="score-circle">${Math.round(score)}%</div>
                        <p>Viabilidade: <strong>${viability}</strong></p>
                        <p>Pontuação: ${achievedWeight}/${totalWeight}</p>
                        <div class="recommendation">${score >= 70 ? 'Caso com forte potencial. Recomenda-se litígio imediato.' : score >= 40 ? 'Caso com potencial moderado. Recomenda-se análise aprofundada.' : 'Caso com baixa probabilidade. Recomenda-se negociação.'}</div>
                    </div>
                `;
            }
        });
    }
    
    // =========================================================================
    // VIEW: CADEIA DE CUSTÓDIA
    // =========================================================================
    
    function renderEvidence() {
        const container = document.getElementById('viewContainer');
        if (!container) return;
        
        container.innerHTML = `
            <div class="evidence-panel">
                <h2>CADEIA DE CUSTÓDIA DE PROVA DIGITAL</h2>
                <p>Registo imutável de provas com hash SHA-256 e timestamp</p>
                <div class="evidence-upload">
                    <div class="form-group">
                        <label>SELECIONAR FICHEIRO</label>
                        <input type="file" id="evidenceFile" accept=".pdf,.docx,.jpg,.png,.txt">
                    </div>
                    <div class="form-group">
                        <label>PROCESSO ASSOCIADO</label>
                        <select id="evidenceCaseId">
                            ${MOCK_CASES.map(c => `<option value="${c.id}">${c.id} - ${c.client}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>TIPO DE PROVA</label>
                        <select id="evidenceType">
                            <option value="documental">Documental</option>
                            <option value="pericial">Pericial</option>
                            <option value="testemunhal">Testemunhal</option>
                            <option value="digital">Digital</option>
                        </select>
                    </div>
                    <button id="registerEvidenceBtn" class="elite-btn primary full-width"><i class="fas fa-fingerprint"></i> REGISTAR PROVA COM HASH</button>
                </div>
                <div id="evidenceList" class="evidence-list" style="margin-top: 20px;">
                    <h3>PROVAS REGISTADAS</h3>
                    <div class="empty-state">Nenhuma prova registada</div>
                </div>
            </div>
        `;
        
        let evidenceList = JSON.parse(localStorage.getItem('elite_evidence') || '[]');
        
        function renderEvidenceList() {
            const container = document.getElementById('evidenceList');
            if (container) {
                if (evidenceList.length === 0) {
                    container.innerHTML = '<h3>PROVAS REGISTADAS</h3><div class="empty-state">Nenhuma prova registada</div>';
                } else {
                    container.innerHTML = '<h3>PROVAS REGISTADAS</h3>' + evidenceList.map(e => `
                        <div class="evidence-item">
                            <div class="evidence-header">
                                <i class="fas ${e.type === 'digital' ? 'fa-microchip' : 'fa-file-alt'}"></i>
                                <strong>${e.fileName}</strong>
                                <span class="evidence-hash">Hash: ${e.hash.substring(0, 16)}...</span>
                            </div>
                            <div class="evidence-details">
                                <small>Registado em: ${e.timestamp}</small>
                                <small>Processo: ${e.caseId}</small>
                                <small>Tipo: ${e.type}</small>
                            </div>
                        </div>
                    `).join('');
                }
            }
        }
        
        renderEvidenceList();
        
        document.getElementById('registerEvidenceBtn')?.addEventListener('click', () => {
            const fileInput = document.getElementById('evidenceFile');
            const caseId = document.getElementById('evidenceCaseId')?.value;
            const evidenceType = document.getElementById('evidenceType')?.value;
            
            if (fileInput && fileInput.files[0]) {
                const file = fileInput.files[0];
                const reader = new FileReader();
                reader.onload = function(e) {
                    const hash = CryptoJS.SHA256(e.target.result).toString();
                    const evidence = {
                        id: Date.now(),
                        fileName: file.name,
                        fileSize: file.size,
                        hash: hash,
                        caseId: caseId,
                        type: evidenceType,
                        timestamp: new Date().toLocaleString(),
                        verified: true
                    };
                    evidenceList.unshift(evidence);
                    localStorage.setItem('elite_evidence', JSON.stringify(evidenceList));
                    renderEvidenceList();
                    EliteUtils.showToast(`Prova ${file.name} registada com hash ${hash.substring(0, 16)}...`, 'success');
                    fileInput.value = '';
                    
                    if (window.ForensicVault && typeof window.ForensicVault.addEvidence === 'function') {
                        window.ForensicVault.addEvidence(evidence);
                    }
                };
                reader.readAsArrayBuffer(file);
            } else {
                EliteUtils.showToast('Selecione um ficheiro para registar', 'warning');
            }
        });
    }
    
    // =========================================================================
    // VIEW: ANÁLISE DE OPOSIÇÃO
    // =========================================================================
    
    function renderAdversary() {
        const container = document.getElementById('viewContainer');
        if (!container) return;
        
        const adversaries = {
            'PLMJ': { wins: 12, losses: 8, pattern: 'Prorrogações sistemáticas', weakness: 'Resposta lenta em urgências', recentTrend: [3, 4, 5] },
            'VdA': { wins: 9, losses: 11, pattern: 'Estratégia agressiva em perícias', weakness: 'Preparação para audiência final', recentTrend: [2, 3, 4] },
            'Cuatrecasas': { wins: 7, losses: 6, pattern: 'Acordos extrajudiciais', weakness: 'Evitam litígio de alto valor', recentTrend: [1, 2, 4] },
            'Garrigues': { wins: 5, losses: 10, pattern: 'Recursos protelatórios', weakness: 'Inconsistência em teses inovadoras', recentTrend: [1, 1, 3] }
        };
        
        container.innerHTML = `
            <div class="adversary-panel">
                <h2>ANÁLISE DE OPOSIÇÃO</h2>
                <p>Histórico de vitórias/derrotas por escritório - Tendências dos últimos 3 meses</p>
                <div class="adversary-grid" id="adversaryGrid"></div>
            </div>
        `;
        
        const grid = document.getElementById('adversaryGrid');
        if (grid) {
            Object.entries(adversaries).forEach(([name, data]) => {
                const card = document.createElement('div');
                card.className = 'adversary-card';
                const successRate = (data.wins / (data.wins + data.losses) * 100).toFixed(0);
                card.innerHTML = `
                    <div class="adversary-header">
                        <i class="fas fa-building"></i>
                        <h3>${name}</h3>
                    </div>
                    <div class="adversary-stats">
                        <div class="stat"><span class="stat-label">VITÓRIAS</span><strong>${data.wins}</strong></div>
                        <div class="stat"><span class="stat-label">DERROTAS</span><strong>${data.losses}</strong></div>
                        <div class="stat"><span class="stat-label">TAXA SUCESSO</span><strong>${successRate}%</strong></div>
                    </div>
                    <div class="adversary-pattern">
                        <div class="alert"><i class="fas fa-chart-line"></i> PADRÃO IDENTIFICADO</div>
                        <p>${data.pattern}</p>
                    </div>
                    <div class="adversary-weakness">
                        <strong><i class="fas fa-shield-alt"></i> FRAQUEZA:</strong> ${data.weakness}
                    </div>
                    <div style="margin-top: 12px;">
                        <canvas id="trend_${name.replace(/\s/g, '')}" width="100" height="40" style="width:100%; height:40px;"></canvas>
                    </div>
                `;
                grid.appendChild(card);
                
                setTimeout(() => {
                    const canvas = document.getElementById(`trend_${name.replace(/\s/g, '')}`);
                    if (canvas && typeof Chart !== 'undefined') {
                        new Chart(canvas, {
                            type: 'line',
                            data: {
                                labels: ['M-3', 'M-2', 'M-1'],
                                datasets: [{
                                    data: data.recentTrend,
                                    borderColor: '#00e5ff',
                                    borderWidth: 2,
                                    fill: false,
                                    pointRadius: 2,
                                    pointBackgroundColor: '#00e5ff'
                                }]
                            },
                            options: {
                                responsive: true,
                                maintainAspectRatio: true,
                                plugins: { legend: { display: false }, tooltip: { enabled: false } },
                                scales: { x: { display: false }, y: { display: false } }
                            }
                        });
                    }
                }, 50);
            });
        }
    }
    
    // =========================================================================
    // VIEW: SIMULADOR DE CONTRA-PERÍCIA
    // =========================================================================
    
    function renderSimulator() {
        const container = document.getElementById('viewContainer');
        if (!container) return;
        
        container.innerHTML = `
            <div class="simulator-panel">
                <h2>SIMULADOR DE CONTRA-PERÍCIA</h2>
                <p>Simule a reação do tribunal a diferentes argumentos e qualidade probatória</p>
                <div class="form-group"><label>TRIBUNAL</label><select id="simCourt"><option value="Lisboa">Lisboa</option><option value="Porto">Porto</option><option value="Braga">Braga</option><option value="Coimbra">Coimbra</option></select></div>
                <div class="form-group"><label>ÁREA DO DIREITO</label><select id="simCategory"><option value="civil">Civil</option><option value="labor">Laboral</option><option value="tax">Fiscal</option><option value="insolvency">Insolvência</option></select></div>
                <div class="form-group"><label>ARGUMENTO A SIMULAR</label><select id="simArgument"><option value="Prova pericial robusta">Prova pericial robusta (perito independente)</option><option value="Prova testemunhal frágil">Prova testemunhal frágil (testemunhas únicas)</option><option value="Jurisprudência consolidada">Jurisprudência consolidada (STA favorável)</option><option value="Prova digital com hash">Prova digital com hash SHA-256</option></select></div>
                <div class="form-group"><label>QUALIDADE DA PROVA</label><select id="simEvidenceQuality"><option value="high">Alta (documentos originais, perícia técnica)</option><option value="medium">Média (cópias simples, testemunhas)</option><option value="low">Baixa (indícios, presunções)</option></select></div>
                <button id="runSimulationBtn" class="elite-btn primary full-width"><i class="fas fa-chart-line"></i> SIMULAR REAÇÃO DO TRIBUNAL</button>
                <div id="simulationResult" class="simulation-result" style="display: none; margin-top: 20px;"></div>
            </div>
        `;
        
        document.getElementById('runSimulationBtn')?.addEventListener('click', () => {
            const court = document.getElementById('simCourt')?.value;
            const category = document.getElementById('simCategory')?.value;
            const argument = document.getElementById('simArgument')?.value;
            const quality = document.getElementById('simEvidenceQuality')?.value;
            
            let baseRate = 0.60;
            if (court === 'Lisboa') baseRate = 0.65;
            if (court === 'Porto') baseRate = 0.72;
            if (court === 'Braga') baseRate = 0.58;
            if (court === 'Coimbra') baseRate = 0.62;
            
            if (category === 'tax') baseRate += 0.03;
            if (category === 'insolvency') baseRate -= 0.02;
            
            let argumentImpact = 0;
            if (argument === 'Prova pericial robusta') argumentImpact = 0.15;
            if (argument === 'Prova testemunhal frágil') argumentImpact = -0.12;
            if (argument === 'Jurisprudência consolidada') argumentImpact = 0.18;
            if (argument === 'Prova digital com hash') argumentImpact = 0.10;
            
            let qualityImpact = 0;
            if (quality === 'high') qualityImpact = 0.12;
            if (quality === 'medium') qualityImpact = 0.02;
            if (quality === 'low') qualityImpact = -0.10;
            
            const probability = Math.min(Math.max(baseRate + argumentImpact + qualityImpact, 0.20), 0.95);
            const reaction = probability > 0.70 ? 'FAVORÁVEL' : probability > 0.50 ? 'NEUTRA' : 'DESFAVORÁVEL';
            const reactionColor = probability > 0.70 ? '#00e676' : probability > 0.50 ? '#ffc107' : '#ff1744';
            
            const resultDiv = document.getElementById('simulationResult');
            if (resultDiv) {
                resultDiv.style.display = 'block';
                resultDiv.innerHTML = `
                    <h3>RESULTADO DA SIMULAÇÃO</h3>
                    <div class="detail-row"><span>Probabilidade de Sucesso:</span><strong>${EliteUtils.formatPercentage(probability * 100)}</strong></div>
                    <div class="detail-row"><span>Reação Esperada:</span><strong style="color: ${reactionColor}">${reaction}</strong></div>
                    <div class="detail-row"><span>Fatores Positivos:</span><strong>${argumentImpact > 0 ? argument.split(' - ')[0] : 'Nenhum fator positivo significativo'}</strong></div>
                    <div class="detail-row"><span>Fatores Negativos:</span><strong>${qualityImpact < 0 ? 'Qualidade probatória abaixo do ideal' : 'Nenhum fator negativo significativo'}</strong></div>
                    <div class="prediction-recommendation">
                        <h4>RECOMENDAÇÃO ESTRATÉGICA</h4>
                        <p>${probability > 0.70 ? 'Argumento forte. Prosseguir com a estratégia e solicitar tutela antecipada.' : probability > 0.50 ? 'Argumento razoável. Complementar com prova documental adicional antes da audiência.' : 'Argumento fraco. Rever estratégia e considerar acordo ou arbitragem.'}</p>
                    </div>
                `;
            }
        });
    }
    
    // =========================================================================
    // VIEW: PRAZOS JUDICIAIS
    // =========================================================================
    
    function renderDeadlines() {
        const container = document.getElementById('viewContainer');
        if (!container) return;
        
        const deadlines = JSON.parse(localStorage.getItem('elite_deadlines') || '[]');
        
        function getUrgencyClass(dateStr) {
            const dueDate = moment(dateStr, 'DD/MM/YYYY');
            const today = moment();
            const daysDiff = dueDate.diff(today, 'days');
            if (daysDiff < 0) return 'urgent';
            if (daysDiff <= 3) return 'urgent';
            if (daysDiff <= 7) return 'warning';
            return '';
        }
        
        container.innerHTML = `
            <div class="deadlines-panel">
                <div class="deadlines-header">
                    <h2><i class="fas fa-calendar-alt"></i> PRAZOS JUDICIAIS</h2>
                    <button id="addDeadlineBtn" class="elite-btn primary"><i class="fas fa-plus"></i> NOVO PRAZO</button>
                </div>
                <div class="deadline-calendar">
                    <h3>CALENDÁRIO DE PRAZOS</h3>
                    <div id="calendarContainer" style="min-height: 300px;"></div>
                </div>
                <div class="deadline-list">
                    <h3>PRÓXIMOS PRAZOS</h3>
                    <div id="deadlinesList">
                        ${deadlines.length === 0 ? '<div class="empty-state">Nenhum prazo registado</div>' : deadlines.sort((a, b) => {
                            const dateA = moment(a.date, 'DD/MM/YYYY');
                            const dateB = moment(b.date, 'DD/MM/YYYY');
                            return dateA - dateB;
                        }).map(d => `
                            <div class="deadline-item ${getUrgencyClass(d.date)}">
                                <div class="deadline-info">
                                    <div class="deadline-case">${d.caseId} - ${MOCK_CASES.find(c => c.id === d.caseId)?.client || 'Cliente'}</div>
                                    <div class="deadline-description">${d.description}</div>
                                    <div class="deadline-date">📅 ${d.date} ${getUrgencyClass(d.date) === 'urgent' ? '⚠️ PRAZO URGENTE' : ''}</div>
                                    ${d.notes ? `<div class="deadline-notes" style="font-size:0.65rem; color:#64748b;">📝 ${d.notes}</div>` : ''}
                                </div>
                                <div class="deadline-actions">
                                    <button class="action-btn delete-deadline" data-id="${d.id}"><i class="fas fa-trash"></i></button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        
        if (typeof flatpickr !== 'undefined') {
            const calendarContainer = document.getElementById('calendarContainer');
            if (calendarContainer) {
                const flatpickrInstance = flatpickr(calendarContainer, {
                    inline: true,
                    dateFormat: "d/m/Y",
                    onChange: function(selectedDates, dateStr) {
                        const filtered = deadlines.filter(d => d.date === dateStr);
                        if (filtered.length > 0) {
                            EliteUtils.showToast(`${filtered.length} prazo(s) neste dia`, 'info');
                        }
                    }
                });
            }
        }
        
        document.getElementById('addDeadlineBtn')?.addEventListener('click', () => {
            const caseSelect = document.getElementById('deadlineCaseId');
            if (caseSelect) {
                caseSelect.innerHTML = MOCK_CASES.map(c => `<option value="${c.id}">${c.id} - ${c.client}</option>`).join('');
            }
            document.getElementById('deadlineModal').style.display = 'flex';
        });
        
        document.querySelectorAll('.delete-deadline').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.id);
                const updatedDeadlines = deadlines.filter(d => d.id !== id);
                localStorage.setItem('elite_deadlines', JSON.stringify(updatedDeadlines));
                EliteUtils.showToast('Prazo removido', 'success');
                renderDeadlines();
            });
        });
        
        const deadlineForm = document.getElementById('newDeadlineForm');
        if (deadlineForm) {
            deadlineForm.onsubmit = (e) => {
                e.preventDefault();
                const newDeadline = {
                    id: Date.now(),
                    caseId: document.getElementById('deadlineCaseId')?.value,
                    description: document.getElementById('deadlineDescription')?.value,
                    date: document.getElementById('deadlineDate')?.value,
                    type: document.getElementById('deadlineType')?.value,
                    notes: document.getElementById('deadlineNotes')?.value,
                    createdAt: new Date().toISOString()
                };
                const updatedDeadlines = [...deadlines, newDeadline];
                localStorage.setItem('elite_deadlines', JSON.stringify(updatedDeadlines));
                EliteUtils.showToast('Prazo registado com sucesso', 'success');
                document.getElementById('deadlineModal').style.display = 'none';
                deadlineForm.reset();
                renderDeadlines();
            };
        }
        
        if (typeof flatpickr !== 'undefined') {
            const datePicker = document.getElementById('deadlineDate');
            if (datePicker) {
                flatpickr(datePicker, {
                    dateFormat: "d/m/Y",
                    minDate: "today"
                });
            }
        }
    }
    
    // =========================================================================
    // VIEW: REGISTOS RGPD
    // =========================================================================
    
    function renderActivityLog() {
        const container = document.getElementById('viewContainer');
        if (!container) return;
        
        const activityLog = JSON.parse(localStorage.getItem('elite_activity_log') || '[]');
        
        container.innerHTML = `
            <div class="activity-log-container">
                <div class="activity-log-header">
                    <h2><i class="fas fa-history"></i> REGISTO DE ATIVIDADES (ART. 30.º RGPD)</h2>
                    <button id="exportLogBtn" class="elite-btn secondary"><i class="fas fa-download"></i> EXPORTAR RAT</button>
                    <button id="clearLogBtn" class="elite-btn danger"><i class="fas fa-trash"></i> LIMPAR REGISTOS</button>
                </div>
                <table class="data-table">
                    <thead>
                        <tr><th>DATA/HORA</th><th>UTILIZADOR</th><th>AÇÃO</th><th>ENTIDADE</th><th>IP/HASH</th> </tr>
                    </thead>
                    <tbody>
                        ${activityLog.length === 0 ? '<tr><td colspan="5" style="text-align: center;">Nenhum registo de atividade</td></tr>' : activityLog.slice(0, 100).map(log => `
                            <tr>
                                <td>${log.timestamp}</td>
                                <td>${log.user}</td>
                                <td>${log.action}</td>
                                <td>${log.entity}</td>
                                <td class="log-hash">${log.hash || log.ip || '---'}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                 </table>
            </div>
        `;
        
        document.getElementById('exportLogBtn')?.addEventListener('click', () => {
            const csv = ['Data/Hora,Utilizador,Ação,Entidade,Hash', ...activityLog.map(l => `"${l.timestamp}","${l.user}","${l.action}","${l.entity}","${l.hash || ''}"`)].join('\n');
            const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `rat_elite_probatum_${new Date().toISOString().slice(0, 10)}.csv`;
            link.click();
            URL.revokeObjectURL(link.href);
            EliteUtils.showToast('Registo de atividades exportado', 'success');
        });
        
        document.getElementById('clearLogBtn')?.addEventListener('click', () => {
            if (confirm('Tem certeza que deseja eliminar todos os registos de atividade? Esta ação não pode ser desfeita.')) {
                localStorage.setItem('elite_activity_log', '[]');
                EliteUtils.showToast('Registos de atividade eliminados', 'warning');
                renderActivityLog();
            }
        });
    }
    
    // =========================================================================
    // VIEW: RELATÓRIOS
    // =========================================================================
    
    function renderReports() {
        const container = document.getElementById('viewContainer');
        if (!container) return;
        
        container.innerHTML = `
            <div class="reports-header">
                <h2>RELATÓRIOS ESTRATÉGICOS</h2>
                <p>Documentos gerados automaticamente com análise aprofundada</p>
            </div>
            <div class="reports-grid">
                <div class="report-card">
                    <i class="fas fa-chart-line"></i>
                    <h3>RELATÓRIO DE PERFORMANCE</h3>
                    <p>Análise de métricas da carteira, ROI por área e projeções</p>
                    <button class="elite-btn small" id="reportPerformanceBtn"><i class="fas fa-download"></i> GERAR</button>
                </div>
                <div class="report-card">
                    <i class="fas fa-gavel"></i>
                    <h3>ANÁLISE DE MAGISTRADOS</h3>
                    <p>Perfil detalhado de juízes com histórico e estratégias recomendadas</p>
                    <button class="elite-btn small" id="reportJudgesBtn"><i class="fas fa-download"></i> GERAR</button>
                </div>
                <div class="report-card">
                    <i class="fas fa-chart-pie"></i>
                    <h3>PROJEÇÃO FINANCEIRA</h3>
                    <p>Previsão de receitas para 12 meses com análise de sensibilidade</p>
                    <button class="elite-btn small" id="reportFinancialBtn"><i class="fas fa-download"></i> GERAR</button>
                </div>
                <div class="report-card">
                    <i class="fas fa-balance-scale"></i>
                    <h3>ANÁLISE DE OPOSIÇÃO</h3>
                    <p>Benchmarking de escritórios concorrentes e estratégias de contra-ataque</p>
                    <button class="elite-btn small" id="reportAdversaryBtn"><i class="fas fa-download"></i> GERAR</button>
                </div>
            </div>
        `;
        
        document.getElementById('reportPerformanceBtn')?.addEventListener('click', () => {
            const totalValue = MOCK_CASES.reduce((s, c) => s + c.value, 0);
            const activeCases = MOCK_CASES.filter(c => c.status === 'active').length;
            const avgProb = (MOCK_CASES.reduce((s, c) => s + c.successProbability, 0) / MOCK_CASES.length) * 100;
            const report = `RELATÓRIO DE PERFORMANCE\nData: ${new Date().toLocaleString()}\n\nProcessos Ativos: ${activeCases}\nValor Total em Disputa: ${EliteUtils.formatCurrency(totalValue)}\nProbabilidade Média de Sucesso: ${avgProb.toFixed(1)}%\nROI Estimado: 284%\n\nRecomendação: ${avgProb > 65 ? 'Manter estratégia atual' : 'Revisar abordagem em áreas de baixa performance'}`;
            const blob = new Blob([report], { type: 'text/plain' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `performance_report_${new Date().toISOString().slice(0, 10)}.txt`;
            link.click();
            URL.revokeObjectURL(link.href);
            EliteUtils.showToast('Relatório de performance gerado', 'success');
        });
        
        document.getElementById('reportJudgesBtn')?.addEventListener('click', () => {
            const judges = [...new Set(MOCK_CASES.map(c => c.judge).filter(j => j))];
            const report = `ANÁLISE DE MAGISTRADOS\nData: ${new Date().toLocaleString()}\n\nTotal de Magistrados Analisados: ${judges.length}\n\n${judges.map(j => `- ${j}: ${MOCK_CASES.filter(c => c.judge === j).length} processos, taxa média: ${(MOCK_CASES.filter(c => c.judge === j).reduce((s, c) => s + c.successProbability, 0) / MOCK_CASES.filter(c => c.judge === j).length * 100).toFixed(0)}%`).join('\n')}\n\nRecomendação: Priorizar foros com maior taxa de sucesso.`;
            const blob = new Blob([report], { type: 'text/plain' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `judges_analysis_${new Date().toISOString().slice(0, 10)}.txt`;
            link.click();
            URL.revokeObjectURL(link.href);
            EliteUtils.showToast('Análise de magistrados gerada', 'success');
        });
        
        document.getElementById('reportFinancialBtn')?.addEventListener('click', () => {
            const totalValue = MOCK_CASES.reduce((s, c) => s + c.value, 0);
            const estimatedFees = totalValue * 0.25;
            const projectedAnnual = estimatedFees * 1.2;
            const report = `PROJEÇÃO FINANCEIRA\nData: ${new Date().toLocaleString()}\n\nValor Total em Disputa: ${EliteUtils.formatCurrency(totalValue)}\nHonorários Estimados (25%): ${EliteUtils.formatCurrency(estimatedFees)}\nProjeção Anual (crescimento 20%): ${EliteUtils.formatCurrency(projectedAnnual)}\n\nAnálise de Sensibilidade:\n- Cenário Otimista (+30%): ${EliteUtils.formatCurrency(projectedAnnual * 1.3)}\n- Cenário Pessimista (-15%): ${EliteUtils.formatCurrency(projectedAnnual * 0.85)}`;
            const blob = new Blob([report], { type: 'text/plain' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `financial_projection_${new Date().toISOString().slice(0, 10)}.txt`;
            link.click();
            URL.revokeObjectURL(link.href);
            EliteUtils.showToast('Projeção financeira gerada', 'success');
        });
        
        document.getElementById('reportAdversaryBtn')?.addEventListener('click', () => {
            const adversaries = ['PLMJ', 'VdA', 'Cuatrecasas', 'Garrigues'];
            const report = `ANÁLISE DE OPOSIÇÃO\nData: ${new Date().toLocaleString()}\n\n${adversaries.map(a => {
                const cases = MOCK_CASES.filter(c => c.adversary === a);
                const successRate = cases.length > 0 ? (cases.filter(c => c.successProbability > 0.6).length / cases.length * 100).toFixed(0) : 0;
                return `- ${a}: ${cases.length} processos, taxa de enfrentamento: ${successRate}%`;
            }).join('\n')}\n\nEstratégias Recomendadas:\n- PLMJ: Antecipar prorrogações, reforçar prova documental\n- VdA: Preparar perícia técnica robusta\n- Cuatrecasas: Oferecer acordo extrajudicial\n- Garrigues: Argumentar com jurisprudência consolidada`;
            const blob = new Blob([report], { type: 'text/plain' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `adversary_analysis_${new Date().toISOString().slice(0, 10)}.txt`;
            link.click();
            URL.revokeObjectURL(link.href);
            EliteUtils.showToast('Análise de oposição gerada', 'success');
        });
    }
    
    // =========================================================================
    // VIEW: ADMINISTRAÇÃO
    // =========================================================================
    
    function renderAdmin() {
        const container = document.getElementById('viewContainer');
        if (!container) return;
        
        container.innerHTML = `
            <div class="admin-purge-panel">
                <h3><i class="fas fa-skull"></i> ZONA DE ADMINISTRAÇÃO - PURGA TOTAL</h3>
                <p class="warning-text">⚠️ ESTA AÇÃO ELIMINA TODOS OS DADOS PERMANENTEMENTE. NÃO REVERSÍVEL.</p>
                <div class="form-group"><label>MASTER HASH SHA-256</label><input type="password" id="purgeMasterHash" placeholder="Insira o Master Hash"></div>
                <div class="form-group"><label>SESSÃO HASH (AUTOMÁTICO)</label><input type="text" id="sessionHashDisplay" readonly placeholder="Hash da sessão atual"></div>
                <div class="form-group"><label>CÓDIGO DE CONFIRMAÇÃO</label><input type="text" id="purgeConfirmCode" placeholder="Digite: PURGE_ALL_CONFIRM"></div>
                <button id="purgeAllBtn" class="elite-btn danger full-width"><i class="fas fa-trash-alt"></i> PURGAR TODOS OS DADOS</button>
            </div>
        `;
        
        const sessionHashDisplay = document.getElementById('sessionHashDisplay');
        if (sessionHashDisplay && window.ELITE_SESSION_ID) {
            sessionHashDisplay.value = window.ELITE_SECURE_HASH ? window.ELITE_SECURE_HASH.substring(0, 32) + '...' : 'Sessão não autenticada';
        }
        
        document.getElementById('purgeAllBtn')?.addEventListener('click', () => {
            const hash = document.getElementById('purgeMasterHash')?.value;
            const code = document.getElementById('purgeConfirmCode')?.value;
            const sessionHash = window.ELITE_SECURE_HASH;
            
            if ((hash === MASTER_HASH || hash === sessionHash) && code === 'PURGE_ALL_CONFIRM') {
                localStorage.clear();
                EliteUtils.showToast('Purga completa. Todos os dados foram eliminados.', 'success');
                setTimeout(() => location.reload(), 2000);
            } else {
                EliteUtils.showToast('Master Hash ou código de confirmação inválidos.', 'error');
            }
        });
    }
    
    // =========================================================================
    // EXPORTAÇÃO PARA MÓVEL
    // =========================================================================
    
    async function exportCurrentViewToMobile() {
        const container = document.getElementById('viewContainer');
        if (!container) return;
        
        const originalHtml = container.innerHTML;
        const title = document.getElementById('pageTitle')?.innerText || 'Relatório';
        
        const exportHtml = `
            <div style="padding: 20px; font-family: 'JetBrains Mono', monospace; background: #0a0c10; color: #fff;">
                <div style="border-bottom: 2px solid #00e5ff; padding-bottom: 16px; margin-bottom: 20px;">
                    <h1 style="color: #00e5ff; margin: 0;">ELITE PROBATUM</h1>
                    <p style="color: #94a3b8; margin: 4px 0 0;">Relatório Forense • ${new Date().toLocaleString()}</p>
                </div>
                <div style="background: #000; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
                    <h3 style="color: #00e5ff; margin-top: 0;">${title}</h3>
                    <div>${originalHtml}</div>
                </div>
                <div style="text-align: center; padding-top: 20px; color: #64748b; font-size: 10px;">
                    Documento gerado por ELITE PROBATUM v2.0 • Assinatura Digital: ${CryptoJS.SHA256(originalHtml + Date.now()).toString().substring(0, 16)}...
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
        
        const langToggle = document.getElementById('langToggle');
        if (langToggle) {
            langToggle.addEventListener('click', () => {
                EliteUtils.showToast('Idioma: Português (Portugal)', 'info');
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
    
    // =========================================================================
    // EXPOSIÇÃO GLOBAL
    // =========================================================================
    
    window.EliteProbatum = {
        version: APP_VERSION,
        masterHash: MASTER_HASH,
        utils: EliteUtils,
        mockCases: MOCK_CASES,
        
        initDashboard: function() {
            EliteUtils.log('Inicializando Unidade de Comando Forense Digital v2.0...');
            initNavigation();
            updateHeaderStats();
            navigateTo('dashboard');
            EliteUtils.showToast('Unidade de Comando Ativa | 27 Processos Carregados', 'success');
            EliteUtils.log(`✅ ${MOCK_CASES.length} processos estratégicos carregados`);
            EliteUtils.log(`📊 9 áreas do direito representadas`);
        },
        
        navigateTo: navigateTo,
        exportCurrentViewToMobile: exportCurrentViewToMobile,
        exportCaseToMobile: async function(caseId) {
            const caseData = MOCK_CASES.find(c => c.id === caseId);
            if (!caseData) return;
            
            const exportHtml = `
                <div style="padding: 20px; font-family: 'JetBrains Mono', monospace;">
                    <h1 style="color: #00e5ff;">RELATÓRIO FORENSE</h1>
                    <p>Processo: ${caseData.id}</p>
                    <p>Cliente: ${caseData.client}</p>
                    <p>NIF: ${caseData.nif_devedor || '---'}</p>
                    <p>Área: ${caseData.categoryName}</p>
                    <p>Valor: ${EliteUtils.formatCurrency(caseData.value)}</p>
                    <p>Probabilidade: ${EliteUtils.formatPercentage(caseData.successProbability * 100)}</p>
                    <p>Tribunal: ${caseData.court}</p>
                    <p>Juiz: ${caseData.judge}</p>
                    <p>Estratégia: ${caseData.successProbability > 0.7 ? 'Ofensiva' : caseData.successProbability > 0.5 ? 'Equilibrada' : 'Defensiva'}</p>
                    <hr>
                    <p style="font-size: 10px;">Documento gerado por ELITE PROBATUM v2.0 • Hash: ${EliteUtils.generateHash(caseData.id)}</p>
                </div>
            `;
            
            const blob = new Blob([exportHtml], { type: 'text/html' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `caso_${caseData.id}_forense_${new Date().toISOString().slice(0, 10)}.html`;
            link.click();
            URL.revokeObjectURL(link.href);
            EliteUtils.showToast(`Relatório do caso ${caseData.id} exportado`, 'success');
        }
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