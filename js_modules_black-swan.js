/**
 * ============================================================================
 * ELITE PROBATUM v2.0.5 — MÓDULO DE BLACK SWAN PREDICTOR
 * SIMULAÇÃO DE MONTE CARLO PARA ANÁLISE DE RISCO JURÍDICO
 * ============================================================================
 * Funcionalidades:
 * 1. Simulação de Monte Carlo com 10.000 iterações
 * 2. Cálculo de Value at Risk (VaR) Jurídico
 * 3. Análise de cenários de Cisne Negro (Black Swan)
 * 4. Histograma de distribuição de resultados
 * 5. Previsão de volatilidade judicial
 * ============================================================================
 */

class BlackSwanPredictor {
    constructor() {
        this.iterations = 10000;
        this.confidenceLevels = [0.95, 0.99, 0.999];
        this.simulationHistory = [];
        this.initialized = false;
        
        this.loadSimulationHistory();
    }
    
    /**
     * Inicializa o Black Swan Predictor
     */
    initialize() {
        this.initialized = true;
        console.log('[ELITE] Black Swan Predictor inicializado - Motor de Monte Carlo Ativo');
        return this;
    }
    
    /**
     * Carrega histórico de simulações
     */
    loadSimulationHistory() {
        const stored = localStorage.getItem('elite_blackswan_history');
        if (stored) {
            try {
                this.simulationHistory = JSON.parse(stored);
            } catch (e) {
                console.error('[ELITE] Erro ao carregar histórico:', e);
                this.simulationHistory = [];
            }
        }
    }
    
    /**
     * Salva histórico de simulações
     */
    saveSimulationHistory() {
        if (this.simulationHistory.length > 100) {
            this.simulationHistory = this.simulationHistory.slice(0, 100);
        }
        localStorage.setItem('elite_blackswan_history', JSON.stringify(this.simulationHistory));
    }
    
    /**
     * Gera número aleatório com distribuição normal (Box-Muller)
     * @param {number} mean - Média
     * @param {number} stdev - Desvio padrão
     * @returns {number} Valor aleatório com distribuição normal
     */
    gaussianRandom(mean = 0, stdev = 1) {
        const u1 = Math.random();
        const u2 = Math.random();
        const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
        return z0 * stdev + mean;
    }
    
    /**
     * Gera número aleatório com distribuição log-normal (para valores assimétricos)
     * @param {number} mean - Média
     * @param {number} stdev - Desvio padrão
     * @returns {number} Valor com distribuição log-normal
     */
    logNormalRandom(mean, stdev) {
        const mu = Math.log(mean) - 0.5 * Math.log(1 + Math.pow(stdev / mean, 2));
        const sigma = Math.sqrt(Math.log(1 + Math.pow(stdev / mean, 2)));
        return Math.exp(this.gaussianRandom(mu, sigma));
    }
    
    /**
     * Calcula Value at Risk (VaR) Jurídico
     * @param {number} baseValue - Valor base da causa
     * @param {number} successProb - Probabilidade de sucesso (0-1)
     * @param {Object} options - Opções adicionais
     * @returns {Object} Resultados da simulação de Monte Carlo
     */
    calculateLegalVaR(baseValue, successProb, options = {}) {
        const volatility = options.volatility || 0.25;
        const judicialVolatility = options.judicialVolatility || 0.15;
        const legislativeRisk = options.legislativeRisk || 0.1;
        const iterations = options.iterations || this.iterations;
        
        const results = [];
        const scenarios = [];
        const outcomes = {
            victory: 0,
            partial: 0,
            defeat: 0,
            catastrophic: 0
        };
        
        // Registro de cenários extremos
        let bestCase = { value: 0, iteration: -1 };
        let worstCase = { value: Infinity, iteration: -1 };
        let blackSwanEvents = [];
        
        // Simulação de Monte Carlo
        for (let i = 0; i < iterations; i++) {
            // Variáveis estocásticas
            const judicialFactor = this.gaussianRandom(0, judicialVolatility);
            const legislativeFactor = this.gaussianRandom(0, legislativeRisk);
            const marketFactor = this.gaussianRandom(0, volatility * 0.5);
            
            // Probabilidade ajustada
            let adjustedProb = successProb + judicialFactor + legislativeFactor + marketFactor;
            adjustedProb = Math.min(Math.max(adjustedProb, 0.01), 0.99);
            
            // Valor de recuperação baseado na probabilidade
            let recoveryValue = 0;
            let outcomeType = '';
            
            const randomOutcome = Math.random();
            
            if (randomOutcome < adjustedProb) {
                // Vitória total
                recoveryValue = baseValue * (0.8 + this.gaussianRandom(0, 0.1));
                outcomeType = 'victory';
                outcomes.victory++;
            } else if (randomOutcome < adjustedProb + (1 - adjustedProb) * 0.3) {
                // Vitória parcial (acordo)
                recoveryValue = baseValue * (0.4 + this.gaussianRandom(0, 0.15));
                outcomeType = 'partial';
                outcomes.partial++;
            } else {
                // Derrota
                recoveryValue = -baseValue * (0.1 + Math.abs(this.gaussianRandom(0, 0.05)));
                outcomeType = 'defeat';
                outcomes.defeat++;
            }
            
            // Verificar evento de Cisne Negro (Black Swan)
            const isBlackSwan = Math.random() < 0.01; // 1% de probabilidade
            if (isBlackSwan) {
                const blackSwanImpact = -baseValue * (0.5 + Math.random() * 0.5);
                recoveryValue += blackSwanImpact;
                outcomeType = 'catastrophic';
                outcomes.catastrophic++;
                
                blackSwanEvents.push({
                    iteration: i,
                    impact: blackSwanImpact,
                    type: this.getBlackSwanType()
                });
            }
            
            results.push(recoveryValue);
            scenarios.push({
                iteration: i,
                probability: adjustedProb,
                outcome: recoveryValue,
                outcomeType: outcomeType,
                factors: { judicialFactor, legislativeFactor, marketFactor }
            });
            
            // Atualizar best/worst case
            if (recoveryValue > bestCase.value) {
                bestCase = { value: recoveryValue, iteration: i, scenario: scenarios[i] };
            }
            if (recoveryValue < worstCase.value) {
                worstCase = { value: recoveryValue, iteration: i, scenario: scenarios[i] };
            }
        }
        
        // Ordenar resultados para cálculo de VaR
        results.sort((a, b) => a - b);
        
        // Calcular Value at Risk para diferentes níveis de confiança
        const varResults = {};
        for (const confidence of this.confidenceLevels) {
            const index = Math.floor(iterations * (1 - confidence));
            varResults[`var${(confidence * 100).toFixed(0)}`] = results[index];
        }
        
        // Calcular estatísticas adicionais
        const mean = results.reduce((a, b) => a + b, 0) / iterations;
        const variance = results.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / iterations;
        const stdev = Math.sqrt(variance);
        
        // Calcular Expected Shortfall (CVaR)
        const var95Index = Math.floor(iterations * 0.05);
        const tailResults = results.slice(0, var95Index);
        const expectedShortfall = tailResults.reduce((a, b) => a + b, 0) / tailResults.length;
        
        // Gerar histograma para visualização
        const histogram = this.generateHistogram(results);
        
        // Calcular probabilidade de perda
        const lossProbability = results.filter(r => r < 0).length / iterations;
        
        // Calcular cenário de Cisne Negro mais provável
        const mostLikelyBlackSwan = this.analyzeBlackSwanScenarios(blackSwanEvents);
        
        const simulationResult = {
            simulationId: Date.now(),
            timestamp: new Date().toISOString(),
            parameters: {
                baseValue: baseValue,
                successProbability: successProb,
                volatility: volatility,
                judicialVolatility: judicialVolatility,
                legislativeRisk: legislativeRisk,
                iterations: iterations
            },
            statistics: {
                mean: mean,
                median: results[Math.floor(iterations / 2)],
                mode: this.calculateMode(results),
                standardDeviation: stdev,
                variance: variance,
                min: results[0],
                max: results[iterations - 1],
                range: results[iterations - 1] - results[0],
                skewness: this.calculateSkewness(results, mean, stdev),
                kurtosis: this.calculateKurtosis(results, mean, stdev)
            },
            riskMetrics: {
                valueAtRisk: varResults,
                expectedShortfall: expectedShortfall,
                lossProbability: lossProbability,
                gainProbability: 1 - lossProbability,
                worstCase: worstCase.value,
                bestCase: bestCase.value,
                blackSwanProbability: blackSwanEvents.length / iterations
            },
            outcomes: {
                victory: outcomes.victory / iterations,
                partial: outcomes.partial / iterations,
                defeat: outcomes.defeat / iterations,
                catastrophic: outcomes.catastrophic / iterations
            },
            blackSwan: {
                events: blackSwanEvents.slice(0, 10),
                mostLikelyScenario: mostLikelyBlackSwan,
                impactRange: {
                    min: Math.min(...blackSwanEvents.map(e => e.impact), 0),
                    max: Math.max(...blackSwanEvents.map(e => e.impact), 0)
                }
            },
            histogram: histogram,
            bestCaseScenario: bestCase.scenario,
            worstCaseScenario: worstCase.scenario,
            confidenceIntervals: this.calculateConfidenceIntervals(results),
            recommendation: this.generateRecommendation(varResults[`var95`], lossProbability, outcomes.catastrophic / iterations)
        };
        
        // Registrar no histórico
        this.simulationHistory.unshift(simulationResult);
        this.saveSimulationHistory();
        
        return simulationResult;
    }
    
    /**
     * Gera histograma para visualização
     */
    generateHistogram(results, bins = 20) {
        const min = Math.min(...results);
        const max = Math.max(...results);
        const binWidth = (max - min) / bins;
        const histogram = [];
        
        for (let i = 0; i < bins; i++) {
            const binMin = min + i * binWidth;
            const binMax = binMin + binWidth;
            const count = results.filter(r => r >= binMin && r < binMax).length;
            histogram.push({
                binMin: binMin,
                binMax: binMax,
                count: count,
                frequency: count / results.length
            });
        }
        
        return histogram;
    }
    
    /**
     * Calcula moda dos resultados
     */
    calculateMode(results) {
        const freq = {};
        results.forEach(r => {
            const key = Math.round(r / 1000) * 1000;
            freq[key] = (freq[key] || 0) + 1;
        });
        let mode = 0;
        let maxFreq = 0;
        for (const [value, count] of Object.entries(freq)) {
            if (count > maxFreq) {
                maxFreq = count;
                mode = parseFloat(value);
            }
        }
        return mode;
    }
    
    /**
     * Calcula assimetria (skewness)
     */
    calculateSkewness(results, mean, stdev) {
        const n = results.length;
        const sumCube = results.reduce((sum, r) => sum + Math.pow((r - mean) / stdev, 3), 0);
        return (n / ((n - 1) * (n - 2))) * sumCube;
    }
    
    /**
     * Calcula curtose (kurtosis)
     */
    calculateKurtosis(results, mean, stdev) {
        const n = results.length;
        const sumFourth = results.reduce((sum, r) => sum + Math.pow((r - mean) / stdev, 4), 0);
        return (n * (n + 1) / ((n - 1) * (n - 2) * (n - 3))) * sumFourth - (3 * Math.pow(n - 1, 2) / ((n - 2) * (n - 3)));
    }
    
    /**
     * Calcula intervalos de confiança
     */
    calculateConfidenceIntervals(results) {
        const sorted = [...results].sort((a, b) => a - b);
        const n = sorted.length;
        
        return {
            ci_90: {
                lower: sorted[Math.floor(n * 0.05)],
                upper: sorted[Math.floor(n * 0.95)]
            },
            ci_95: {
                lower: sorted[Math.floor(n * 0.025)],
                upper: sorted[Math.floor(n * 0.975)]
            },
            ci_99: {
                lower: sorted[Math.floor(n * 0.005)],
                upper: sorted[Math.floor(n * 0.995)]
            }
        };
    }
    
    /**
     * Gera tipo de Cisne Negro aleatório
     */
    getBlackSwanType() {
        const types = [
            'Inversão de Jurisprudência no STJ',
            'Substituição do Magistrado por juiz desfavorável',
            'Mudança legislativa de última hora',
            'Quebra da cadeia de custódia',
            'Testemunha-chave desistiu de depor',
            'Documento considerado falso por perícia',
            'Prescrição do direito',
            'Decisão do Tribunal Constitucional',
            'Alteração da taxa de juros legais',
            'Falência da parte contrária'
        ];
        return types[Math.floor(Math.random() * types.length)];
    }
    
    /**
     * Analisa cenários de Cisne Negro
     */
    analyzeBlackSwanScenarios(events) {
        if (events.length === 0) {
            return {
                type: 'Nenhum evento de Cisne Negro identificado',
                probability: 0,
                impact: 0
            };
        }
        
        const typeCount = {};
        events.forEach(e => {
            typeCount[e.type] = (typeCount[e.type] || 0) + 1;
        });
        
        let mostLikely = null;
        let maxCount = 0;
        for (const [type, count] of Object.entries(typeCount)) {
            if (count > maxCount) {
                maxCount = count;
                mostLikely = type;
            }
        }
        
        const avgImpact = events.reduce((sum, e) => sum + e.impact, 0) / events.length;
        
        return {
            type: mostLikely,
            probability: maxCount / events.length,
            averageImpact: avgImpact,
            severity: avgImpact < -1000000 ? 'EXTREMO' : avgImpact < -100000 ? 'ALTO' : 'MODERADO'
        };
    }
    
    /**
     * Gera recomendação baseada nos resultados
     */
    generateRecommendation(var95, lossProbability, blackSwanProbability) {
        if (var95 < 0 && lossProbability > 0.4) {
            return {
                action: 'REVISÃO URGENTE',
                strategy: 'Considerar acordo ou arbitragem. Risco de perda elevado.',
                priority: 'CRITICAL',
                message: `VaR(95%): ${this.formatCurrency(var95)} | Probabilidade de perda: ${(lossProbability * 100).toFixed(1)}%`
            };
        } else if (var95 < 0 && lossProbability > 0.2) {
            return {
                action: 'REFORÇO PROBATÓRIO',
                strategy: 'Reforçar evidências e preparar argumentação alternativa.',
                priority: 'HIGH',
                message: `VaR(95%): ${this.formatCurrency(var95)} | Probabilidade de perda: ${(lossProbability * 100).toFixed(1)}%`
            };
        } else if (blackSwanProbability > 0.02) {
            return {
                action: 'MITIGAÇÃO DE CISNE NEGRO',
                strategy: 'Preparar estratégia de contingência para eventos de baixa probabilidade.',
                priority: 'MEDIUM',
                message: `Probabilidade de evento extremo: ${(blackSwanProbability * 100).toFixed(1)}%`
            };
        } else {
            return {
                action: 'MANTER ESTRATÉGIA',
                strategy: 'Caso com boa probabilidade de sucesso. Manter estratégia atual.',
                priority: 'LOW',
                message: `Probabilidade de sucesso ajustada: ${((1 - lossProbability) * 100).toFixed(1)}%`
            };
        }
    }
    
    /**
     * Formata moeda
     */
    formatCurrency(value) {
        if (value === null || value === undefined) return '€0';
        return new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
    }
    
    /**
     * Renderiza painel de Black Swan para um caso
     */
    renderBlackSwanPanel(containerId, caseData) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const baseValue = caseData.value || 50000;
        const successProb = (caseData.successProbability || 70) / 100;
        
        const simulation = this.calculateLegalVaR(baseValue, successProb, {
            judicialVolatility: 0.15,
            legislativeRisk: 0.1
        });
        
        const var95 = simulation.riskMetrics.valueAtRisk.var95;
        const lossProb = simulation.riskMetrics.lossProbability;
        const blackSwanProb = simulation.riskMetrics.blackSwanProbability;
        
        const histogram = simulation.histogram;
        const maxFrequency = Math.max(...histogram.map(h => h.count));
        
        container.innerHTML = `
            <div class="black-swan-panel">
                <div class="panel-header">
                    <h3><i class="fas fa-chart-line"></i> ANÁLISE DE CISNE NEGRO (MONTE CARLO)</h3>
                    <div class="simulation-badge">${simulation.parameters.iterations.toLocaleString()} iterações</div>
                </div>
                
                <div class="risk-metrics-grid">
                    <div class="metric-card ${var95 < 0 ? 'danger' : 'success'}">
                        <div class="metric-label">Value at Risk (VaR 95%)</div>
                        <div class="metric-value">${this.formatCurrency(var95)}</div>
                        <div class="metric-sub">Perda máxima com 95% confiança</div>
                    </div>
                    <div class="metric-card ${lossProb > 0.3 ? 'warning' : 'success'}">
                        <div class="metric-label">Probabilidade de Perda</div>
                        <div class="metric-value">${(lossProb * 100).toFixed(1)}%</div>
                        <div class="metric-sub">Risco de resultado negativo</div>
                    </div>
                    <div class="metric-card ${blackSwanProb > 0.02 ? 'warning' : 'info'}">
                        <div class="metric-label">Probabilidade de Cisne Negro</div>
                        <div class="metric-value">${(blackSwanProb * 100).toFixed(2)}%</div>
                        <div class="metric-sub">Evento de baixa probabilidade, alto impacto</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-label">Expected Shortfall (CVaR)</div>
                        <div class="metric-value">${this.formatCurrency(simulation.riskMetrics.expectedShortfall)}</div>
                        <div class="metric-sub">Perda esperada nos 5% piores cenários</div>
                    </div>
                </div>
                
                <div class="outcomes-distribution">
                    <h4>Distribuição de Resultados (${simulation.parameters.iterations.toLocaleString()} cenários)</h4>
                    <div class="histogram">
                        ${histogram.map(h => `
                            <div class="histogram-bar" style="height: ${(h.count / maxFrequency) * 100}%">
                                <div class="bar-fill ${h.binMin < 0 ? 'negative' : 'positive'}" style="height: ${(h.count / maxFrequency) * 100}%"></div>
                                <div class="bar-label">${this.formatCurrency(h.binMin)}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="outcomes-stats">
                    <div class="stat-item">
                        <span class="stat-label">Vitória Total:</span>
                        <span class="stat-value">${(simulation.outcomes.victory * 100).toFixed(1)}%</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Vitória Parcial:</span>
                        <span class="stat-value">${(simulation.outcomes.partial * 100).toFixed(1)}%</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Derrota:</span>
                        <span class="stat-value">${(simulation.outcomes.defeat * 100).toFixed(1)}%</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Cisne Negro:</span>
                        <span class="stat-value">${(simulation.outcomes.catastrophic * 100).toFixed(2)}%</span>
                    </div>
                </div>
                
                <div class="confidence-intervals">
                    <h4>Intervalos de Confiança</h4>
                    <div class="ci-list">
                        <div class="ci-item">
                            <span>90%</span>
                            <span>${this.formatCurrency(simulation.confidenceIntervals.ci_90.lower)} a ${this.formatCurrency(simulation.confidenceIntervals.ci_90.upper)}</span>
                        </div>
                        <div class="ci-item">
                            <span>95%</span>
                            <span>${this.formatCurrency(simulation.confidenceIntervals.ci_95.lower)} a ${this.formatCurrency(simulation.confidenceIntervals.ci_95.upper)}</span>
                        </div>
                        <div class="ci-item">
                            <span>99%</span>
                            <span>${this.formatCurrency(simulation.confidenceIntervals.ci_99.lower)} a ${this.formatCurrency(simulation.confidenceIntervals.ci_99.upper)}</span>
                        </div>
                    </div>
                </div>
                
                <div class="recommendation-card priority-${simulation.recommendation.priority.toLowerCase()}">
                    <div class="rec-header">
                        <i class="fas ${simulation.recommendation.priority === 'CRITICAL' ? 'fa-skull' : simulation.recommendation.priority === 'HIGH' ? 'fa-exclamation-triangle' : 'fa-chart-line'}"></i>
                        <strong>${simulation.recommendation.action}</strong>
                    </div>
                    <p>${simulation.recommendation.strategy}</p>
                    <small>${simulation.recommendation.message}</small>
                </div>
                
                <div class="black-swan-scenarios">
                    <h4><i class="fas fa-feather-alt"></i> Cenários de Cisne Negro</h4>
                    ${simulation.blackSwan.events.length === 0 ? 
                        '<p class="empty-state">Nenhum evento de Cisne Negro identificado nas simulações.</p>' :
                        simulation.blackSwan.events.slice(0, 3).map(e => `
                            <div class="scenario-item">
                                <div class="scenario-type">${e.type}</div>
                                <div class="scenario-impact impact-negative">Impacto: ${this.formatCurrency(e.impact)}</div>
                                <div class="scenario-prob">Probabilidade: ${(1 / simulation.parameters.iterations * 100).toFixed(2)}%</div>
                            </div>
                        `).join('')
                    }
                </div>
            </div>
        `;
        
        // Estilos adicionais
        const style = document.createElement('style');
        style.textContent = `
            .black-swan-panel { padding: 0; }
            .panel-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
            .simulation-badge { background: var(--elite-primary-dim); padding: 4px 12px; border-radius: 20px; font-size: 0.7rem; font-family: monospace; }
            .risk-metrics-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
            .metric-card { background: var(--bg-terminal); border-radius: 12px; padding: 16px; text-align: center; border-left: 3px solid; }
            .metric-card.danger { border-left-color: #ff1744; }
            .metric-card.warning { border-left-color: #ffc107; }
            .metric-card.success { border-left-color: #00e676; }
            .metric-card.info { border-left-color: #00e5ff; }
            .metric-label { font-size: 0.7rem; color: #94a3b8; margin-bottom: 8px; }
            .metric-value { font-size: 1.3rem; font-weight: bold; font-family: 'JetBrains Mono'; }
            .metric-sub { font-size: 0.6rem; color: #64748b; margin-top: 4px; }
            .histogram { display: flex; align-items: flex-end; gap: 4px; height: 200px; margin: 20px 0; padding: 10px 0; }
            .histogram-bar { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: flex-end; height: 100%; }
            .bar-fill { width: 100%; min-height: 2px; border-radius: 2px 2px 0 0; transition: height 0.3s; }
            .bar-fill.positive { background: linear-gradient(180deg, #00e676, #00c853); }
            .bar-fill.negative { background: linear-gradient(180deg, #ff1744, #b71c1c); }
            .bar-label { font-size: 0.55rem; transform: rotate(-45deg); margin-top: 8px; white-space: nowrap; }
            .outcomes-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin: 20px 0; background: var(--bg-command); border-radius: 12px; padding: 16px; }
            .stat-item { display: flex; justify-content: space-between; font-size: 0.8rem; }
            .confidence-intervals { background: var(--bg-terminal); border-radius: 12px; padding: 16px; margin: 20px 0; }
            .ci-list { display: flex; flex-direction: column; gap: 8px; margin-top: 12px; }
            .ci-item { display: flex; justify-content: space-between; padding: 8px; border-bottom: 1px solid var(--border-tactic); font-size: 0.75rem; }
            .recommendation-card { padding: 16px; border-radius: 12px; margin: 20px 0; border-left: 4px solid; }
            .recommendation-card.priority-critical { border-left-color: #ff1744; background: rgba(255, 23, 68, 0.1); }
            .recommendation-card.priority-high { border-left-color: #ffc107; background: rgba(255, 193, 7, 0.1); }
            .recommendation-card.priority-medium { border-left-color: #3b82f6; background: rgba(59, 130, 246, 0.1); }
            .recommendation-card.priority-low { border-left-color: #00e676; background: rgba(0, 230, 118, 0.1); }
            .rec-header { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; font-size: 0.9rem; }
            .black-swan-scenarios { margin-top: 20px; }
            .scenario-item { background: var(--bg-terminal); border-radius: 8px; padding: 12px; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; }
            .scenario-type { font-weight: bold; font-size: 0.8rem; }
            .scenario-impact { font-size: 0.7rem; }
            .impact-negative { color: #ff1744; }
            @media (max-width: 768px) {
                .risk-metrics-grid { grid-template-columns: 1fr 1fr; }
                .histogram-bar .bar-label { display: none; }
                .outcomes-stats { grid-template-columns: 1fr 1fr; }
            }
        `;
        container.appendChild(style);
        
        return simulation;
    }
    
    /**
     * Gera relatório completo de análise de risco
     */
    generateRiskReport(caseData) {
        const simulation = this.calculateLegalVaR(caseData.value, caseData.successProbability / 100);
        
        return {
            generatedAt: new Date().toISOString(),
            caseId: caseData.id,
            caseValue: caseData.value,
            simulationId: simulation.simulationId,
            riskProfile: {
                var95: simulation.riskMetrics.valueAtRisk.var95,
                var99: simulation.riskMetrics.valueAtRisk.var99,
                expectedShortfall: simulation.riskMetrics.expectedShortfall,
                lossProbability: simulation.riskMetrics.lossProbability,
                blackSwanProbability: simulation.riskMetrics.blackSwanProbability
            },
            statisticalAnalysis: {
                mean: simulation.statistics.mean,
                median: simulation.statistics.median,
                standardDeviation: simulation.statistics.standardDeviation,
                skewness: simulation.statistics.skewness,
                kurtosis: simulation.statistics.kurtosis
            },
            confidenceIntervals: simulation.confidenceIntervals,
            recommendation: simulation.recommendation,
            blackSwanScenarios: simulation.blackSwan.events.slice(0, 5)
        };
    }
    
    /**
     * Obtém histórico de simulações
     */
    getSimulationHistory(limit = 10) {
        return this.simulationHistory.slice(0, limit);
    }
}

// Instância global
window.BlackSwan = new BlackSwanPredictor();

console.log('[ELITE] Black Swan Predictor carregado - Motor de Monte Carlo Ativo');