/**
 * ============================================================================
 * ELITE PROBATUM — MÓDULO DE QUANTUM LEGAL ANALYTICS
 * ============================================================================
 * INOVAÇÃO DISRUPTIVA #4:
 * Análise de Teoria de Jogos para Otimização de Acordos
 * 
 * Funcionalidades:
 * 1. Cálculo do momento ótimo para propor acordo (Equilíbrio de Nash)
 * 2. Análise de fluxo de caixa da parte contrária
 * 3. Previsão de probabilidade de aceitação com base em variáveis de mercado
 * 4. Simulação de cenários de negociação com payoff matrices
 * 5. Recomendação de estratégia baseada em análise de comportamento
 * ============================================================================
 */

class QuantumLegalAnalytics {
    constructor() {
        this.marketData = this.loadMarketData();
        this.platformFinancials = this.loadPlatformFinancials();
        this.settlementHistory = this.loadSettlementHistory();
        this.gameTheoryModels = this.loadGameTheoryModels();
        this.initialized = false;
        
        this.loadSettlementHistory();
    }
    
    /**
     * Inicializa o módulo de analytics quântico
     */
    initialize() {
        this.initialized = true;
        console.log('[ELITE] Quantum Legal Analytics inicializado - Teoria de Jogos Ativa');
        return this;
    }
    
    /**
     * Carrega dados de mercado
     */
    loadMarketData() {
        return {
            // Indicadores macroeconómicos (simulados)
            economicIndicators: {
                inflation: 0.023,
                interestRate: 0.045,
                gdpGrowth: 0.019,
                unemployment: 0.065
            },
            // Tendências de litígio por setor
            litigationTrends: {
                banking: { growth: 0.18, avgCaseValue: 12500000, settlementRate: 0.42 },
                ma: { growth: 0.12, avgCaseValue: 45000000, settlementRate: 0.38 },
                mass: { growth: 0.25, avgCaseValue: 15200000, settlementRate: 0.55 },
                tax: { growth: 0.15, avgCaseValue: 12500000, settlementRate: 0.48 },
                labor: { growth: 0.08, avgCaseValue: 28900, settlementRate: 0.62 }
            },
            // Indicadores de sazonalidade
            seasonality: {
                Q1: { factor: 0.92, description: 'Menor atividade - início do ano' },
                Q2: { factor: 1.05, description: 'Aumento de litígios - pós-carnaval' },
                Q3: { factor: 1.08, description: 'Pico de atividade - antes das férias' },
                Q4: { factor: 0.95, description: 'Redução - período natalício' }
            }
        };
    }
    
    /**
     * Carrega dados financeiros de plataformas/empresas
     */
    loadPlatformFinancials() {
        return {
            bolt: {
                name: 'Bolt',
                revenue: 8500000000,
                profitMargin: 0.08,
                cashFlow: 1200000000,
                quarterlyProjection: [
                    { quarter: 'Q1 2025', cashFlow: 1150000000, liquidity: 'Alta' },
                    { quarter: 'Q2 2025', cashFlow: 1080000000, liquidity: 'Média' },
                    { quarter: 'Q3 2025', cashFlow: 950000000, liquidity: 'Média' },
                    { quarter: 'Q4 2025', cashFlow: 880000000, liquidity: 'Baixa' }
                ],
                settlementCapacity: 85000000,
                litigationBudget: 45000000,
                riskTolerance: 0.35
            },
            uber: {
                name: 'Uber',
                revenue: 35000000000,
                profitMargin: 0.12,
                cashFlow: 5200000000,
                quarterlyProjection: [
                    { quarter: 'Q1 2025', cashFlow: 5100000000, liquidity: 'Alta' },
                    { quarter: 'Q2 2025', cashFlow: 4950000000, liquidity: 'Alta' },
                    { quarter: 'Q3 2025', cashFlow: 4800000000, liquidity: 'Média' },
                    { quarter: 'Q4 2025', cashFlow: 4650000000, liquidity: 'Média' }
                ],
                settlementCapacity: 250000000,
                litigationBudget: 120000000,
                riskTolerance: 0.42
            },
            glovo: {
                name: 'Glovo',
                revenue: 850000000,
                profitMargin: -0.05, // Prejuízo
                cashFlow: 120000000,
                quarterlyProjection: [
                    { quarter: 'Q1 2025', cashFlow: 115000000, liquidity: 'Média' },
                    { quarter: 'Q2 2025', cashFlow: 98000000, liquidity: 'Baixa' },
                    { quarter: 'Q3 2025', cashFlow: 82000000, liquidity: 'Crítica' },
                    { quarter: 'Q4 2025', cashFlow: 75000000, liquidity: 'Crítica' }
                ],
                settlementCapacity: 35000000,
                litigationBudget: 15000000,
                riskTolerance: 0.65
            }
        };
    }
    
    /**
     * Carrega histórico de acordos
     */
    loadSettlementHistory() {
        return [
            { platform: 'bolt', quarter: 'Q1 2024', count: 12, avgDiscount: 0.32, acceptanceRate: 0.68 },
            { platform: 'bolt', quarter: 'Q2 2024', count: 15, avgDiscount: 0.28, acceptanceRate: 0.72 },
            { platform: 'bolt', quarter: 'Q3 2024', count: 18, avgDiscount: 0.25, acceptanceRate: 0.75 },
            { platform: 'bolt', quarter: 'Q4 2024', count: 22, avgDiscount: 0.22, acceptanceRate: 0.78 },
            { platform: 'uber', quarter: 'Q1 2024', count: 8, avgDiscount: 0.35, acceptanceRate: 0.58 },
            { platform: 'uber', quarter: 'Q2 2024', count: 10, avgDiscount: 0.32, acceptanceRate: 0.62 },
            { platform: 'uber', quarter: 'Q3 2024', count: 12, avgDiscount: 0.30, acceptanceRate: 0.65 },
            { platform: 'uber', quarter: 'Q4 2024', count: 15, avgDiscount: 0.28, acceptanceRate: 0.68 },
            { platform: 'glovo', quarter: 'Q1 2024', count: 5, avgDiscount: 0.45, acceptanceRate: 0.52 },
            { platform: 'glovo', quarter: 'Q2 2024', count: 7, avgDiscount: 0.48, acceptanceRate: 0.48 },
            { platform: 'glovo', quarter: 'Q3 2024', count: 9, avgDiscount: 0.52, acceptanceRate: 0.45 },
            { platform: 'glovo', quarter: 'Q4 2024', count: 11, avgDiscount: 0.55, acceptanceRate: 0.42 }
        ];
    }
    
    /**
     * Carrega modelos de teoria de jogos
     */
    loadGameTheoryModels() {
        return {
            // Matriz de payoff para negociação (Jogador A = Cliente, Jogador B = Plataforma)
            payoffMatrix: {
                aggressive_vs_aggressive: { a: -0.3, b: -0.25, equilibrium: false },
                aggressive_vs_compromise: { a: 0.2, b: -0.1, equilibrium: false },
                compromise_vs_aggressive: { a: -0.1, b: 0.2, equilibrium: false },
                compromise_vs_compromise: { a: 0.4, b: 0.3, equilibrium: true },
                concede_vs_aggressive: { a: -0.5, b: 0.4, equilibrium: false },
                aggressive_vs_concede: { a: 0.5, b: -0.4, equilibrium: false }
            },
            // Estratégias dominantes por perfil
            dominantStrategies: {
                high_cashflow: 'aggressive',
                low_cashflow: 'compromise',
                critical_liquidity: 'concede',
                high_risk_tolerance: 'aggressive',
                low_risk_tolerance: 'compromise'
            }
        };
    }
    
    /**
     * Analisa o momento ótimo para propor acordo usando Teoria de Jogos
     * @param {Object} caseData - Dados do caso
     * @param {string} platform - Plataforma/empresa adversária
     * @returns {Object} Recomendação de timing e estratégia
     */
    analyzeOptimalSettlementTiming(caseData, platform) {
        const financials = this.platformFinancials[platform];
        if (!financials) return null;
        
        const currentQuarter = this.getCurrentQuarter();
        const futureQuarters = financials.quarterlyProjection;
        
        // Analisar fluxo de caixa projetado
        const cashFlowAnalysis = this.analyzeCashFlow(financials);
        
        // Identificar trimestre com menor liquidez
        let worstLiquidityQuarter = null;
        let worstLiquidityScore = 1;
        
        for (const q of futureQuarters) {
            let liquidityScore = 1;
            if (q.liquidity === 'Crítica') liquidityScore = 0;
            else if (q.liquidity === 'Baixa') liquidityScore = 0.3;
            else if (q.liquidity === 'Média') liquidityScore = 0.6;
            else if (q.liquidity === 'Alta') liquidityScore = 0.9;
            
            if (liquidityScore < worstLiquidityScore) {
                worstLiquidityScore = liquidityScore;
                worstLiquidityQuarter = q;
            }
        }
        
        // Analisar histórico de acordos
        const settlementTrend = this.analyzeSettlementTrend(platform);
        
        // Calcular probabilidade de aceitação por trimestre
        const acceptanceProbabilities = [];
        for (const q of futureQuarters) {
            let baseProbability = settlementTrend.currentAcceptanceRate;
            
            // Ajustar por liquidez
            if (q.liquidity === 'Crítica') baseProbability += 0.25;
            else if (q.liquidity === 'Baixa') baseProbability += 0.15;
            else if (q.liquidity === 'Média') baseProbability += 0.05;
            else baseProbability -= 0.1;
            
            // Ajustar por sazonalidade
            const seasonality = this.marketData.seasonality[q.quarter] || { factor: 1.0 };
            baseProbability *= seasonality.factor;
            
            // Ajustar por valor do caso
            const caseValue = caseData.value || 50000;
            const valueFactor = Math.min(caseValue / financials.settlementCapacity, 1);
            baseProbability *= (1 - valueFactor * 0.3);
            
            acceptanceProbabilities.push({
                quarter: q.quarter,
                probability: Math.min(Math.max(baseProbability, 0.1), 0.95),
                liquidity: q.liquidity,
                recommendedDiscount: this.calculateRecommendedDiscount(platform, q, caseValue)
            });
        }
        
        // Identificar momento ótimo
        const optimal = acceptanceProbabilities.reduce((best, current) => 
            current.probability > best.probability ? current : best, acceptanceProbabilities[0]);
        
        // Calcular Equilíbrio de Nash para a negociação
        const nashEquilibrium = this.calculateNashEquilibrium(caseData, platform, optimal);
        
        return {
            platform: financials.name,
            currentQuarter: currentQuarter,
            cashFlowAnalysis: cashFlowAnalysis,
            optimalTiming: optimal,
            acceptanceProbabilities: acceptanceProbabilities,
            nashEquilibrium: nashEquilibrium,
            recommendedStrategy: this.getRecommendedStrategy(platform, optimal, cashFlowAnalysis),
            payoffMatrix: this.generatePayoffMatrix(caseData, platform, optimal),
            expectedROI: this.calculateExpectedROI(caseData, optimal)
        };
    }
    
    /**
     * Analisa fluxo de caixa da parte contrária
     */
    analyzeCashFlow(financials) {
        const currentCF = financials.cashFlow;
        const projectedCF = financials.quarterlyProjection;
        
        let trend = 'stable';
        let trendPercentage = 0;
        
        if (projectedCF.length >= 2) {
            const first = projectedCF[0].cashFlow;
            const last = projectedCF[projectedCF.length - 1].cashFlow;
            trendPercentage = ((last - first) / first) * 100;
            trend = trendPercentage > 0 ? 'improving' : 'declining';
        }
        
        const liquidityRisk = this.assessLiquidityRisk(financials);
        
        return {
            currentCashFlow: currentCF,
            projectedTrend: trend,
            trendPercentage: trendPercentage.toFixed(1),
            liquidityRisk: liquidityRisk,
            settlementCapacity: financials.settlementCapacity,
            riskTolerance: financials.riskTolerance,
            recommendation: liquidityRisk === 'high' 
                ? 'Momento favorável para propor acordo - contraparte com necessidade de liquidez'
                : liquidityRisk === 'medium'
                ? 'Janela de oportunidade moderada - considerar proposta com desconto competitivo'
                : 'Contraparte com liquidez confortável - estratégia mais agressiva recomendada'
        };
    }
    
    /**
     * Avalia risco de liquidez
     */
    assessLiquidityRisk(financials) {
        const quarterlyProjection = financials.quarterlyProjection;
        let criticalQuarters = 0;
        
        for (const q of quarterlyProjection) {
            if (q.liquidity === 'Crítica') criticalQuarters++;
            else if (q.liquidity === 'Baixa') criticalQuarters += 0.5;
        }
        
        if (criticalQuarters >= 2) return 'high';
        if (criticalQuarters >= 1) return 'medium';
        return 'low';
    }
    
    /**
     * Analisa tendência de acordos
     */
    analyzeSettlementTrend(platform) {
        const history = this.settlementHistory.filter(h => h.platform === platform);
        if (history.length === 0) return { trend: 'stable', currentAcceptanceRate: 0.5 };
        
        const recent = history.slice(-4);
        const avgAcceptance = recent.reduce((sum, h) => sum + h.acceptanceRate, 0) / recent.length;
        const avgDiscount = recent.reduce((sum, h) => sum + h.avgDiscount, 0) / recent.length;
        
        let trend = 'stable';
        if (recent.length >= 2) {
            const last = recent[recent.length - 1].acceptanceRate;
            const prev = recent[recent.length - 2].acceptanceRate;
            if (last > prev) trend = 'increasing';
            else if (last < prev) trend = 'decreasing';
        }
        
        return {
            trend: trend,
            currentAcceptanceRate: avgAcceptance,
            averageDiscount: avgDiscount,
            recentQuarters: recent.map(h => ({ quarter: h.quarter, acceptanceRate: h.acceptanceRate, discount: h.avgDiscount }))
        };
    }
    
    /**
     * Calcula desconto recomendado
     */
    calculateRecommendedDiscount(platform, quarter, caseValue) {
        const financials = this.platformFinancials[platform];
        const settlementTrend = this.analyzeSettlementTrend(platform);
        
        let baseDiscount = settlementTrend.averageDiscount;
        
        // Ajustar por liquidez
        if (quarter.liquidity === 'Crítica') baseDiscount += 0.15;
        else if (quarter.liquidity === 'Baixa') baseDiscount += 0.1;
        else if (quarter.liquidity === 'Média') baseDiscount += 0.05;
        else baseDiscount -= 0.05;
        
        // Ajustar por valor do caso
        const valueRatio = caseValue / financials.settlementCapacity;
        if (valueRatio > 0.5) baseDiscount += 0.05;
        else if (valueRatio < 0.1) baseDiscount -= 0.05;
        
        // Limitar entre 0.1 e 0.7
        return Math.min(Math.max(baseDiscount, 0.1), 0.7);
    }
    
    /**
     * Calcula Equilíbrio de Nash para a negociação
     */
    calculateNashEquilibrium(caseData, platform, optimalTiming) {
        const financials = this.platformFinancials[platform];
        const caseValue = caseData.value || 50000;
        const proposedValue = caseValue * (1 - optimalTiming.recommendedDiscount);
        
        // Payoffs do cliente
        const clientPayoff = {
            accept: proposedValue,
            reject_litigate: caseValue * (caseData.successProbability / 100 || 0.7),
            reject_arbitrate: caseValue * 0.6,
            expectedValue: proposedValue * optimalTiming.probability + 
                           (caseValue * 0.7) * (1 - optimalTiming.probability)
        };
        
        // Payoffs da plataforma
        const platformPayoff = {
            accept: -proposedValue,
            reject_litigate: -(caseValue * 0.5 + 50000), // Estimativa de custos
            reject_settle_later: -(caseValue * 0.3),
            bestResponse: proposedValue < (caseValue * 0.5 + 50000) ? 'accept' : 'reject'
        };
        
        // Verificar se proposta está no Equilíbrio de Nash
        const isNashEquilibrium = platformPayoff.bestResponse === 'accept' && 
                                   clientPayoff.expectedValue > clientPayoff.reject_litigate;
        
        return {
            isEquilibrium: isNashEquilibrium,
            clientOptimalStrategy: clientPayoff.expectedValue > clientPayoff.reject_litigate ? 'accept' : 'litigate',
            platformOptimalStrategy: platformPayoff.bestResponse,
            equilibriumValue: proposedValue,
            clientPayoff: clientPayoff,
            platformPayoff: platformPayoff,
            explanation: isNashEquilibrium 
                ? `Proposta de €${proposedValue.toLocaleString()} (${(optimalTiming.recommendedDiscount * 100).toFixed(0)}% de desconto) está no equilíbrio. Ambas as partes maximizam seus payoffs aceitando.`
                : `Proposta atual não está no equilíbrio. ${platformPayoff.bestResponse === 'accept' ? 'Cliente' : 'Plataforma'} tem incentivo para desviar.`
        };
    }
    
    /**
     * Obtém estratégia recomendada
     */
    getRecommendedStrategy(platform, optimalTiming, cashFlowAnalysis) {
        const strategies = {
            aggressive: {
                name: 'Estratégia Agressiva',
                description: 'Manter posição firme, propor desconto mínimo',
                discount: '5-15%',
                timing: 'Imediato ou quando contraparte tem alta liquidez',
                successProbability: 0.65
            },
            balanced: {
                name: 'Estratégia Equilibrada',
                description: 'Propor desconto moderado, buscar acordo vantajoso',
                discount: '20-30%',
                timing: 'Quando contraparte tem liquidez média',
                successProbability: 0.75
            },
            concession: {
                name: 'Estratégia de Concessão',
                description: 'Oferecer desconto significativo para garantir acordo rápido',
                discount: '35-50%',
                timing: 'Quando contraparte tem necessidade crítica de liquidez',
                successProbability: 0.85
            }
        };
        
        let selected = strategies.balanced;
        
        if (cashFlowAnalysis.liquidityRisk === 'high') {
            selected = strategies.concession;
        } else if (cashFlowAnalysis.liquidityRisk === 'low' && optimalTiming.liquidity !== 'Crítica') {
            selected = strategies.aggressive;
        }
        
        return {
            ...selected,
            recommendedDiscount: optimalTiming.recommendedDiscount,
            optimalQuarter: optimalTiming.quarter,
            acceptanceProbability: (optimalTiming.probability * 100).toFixed(0) + '%',
            rationale: cashFlowAnalysis.liquidityRisk === 'high' 
                ? 'Contraparte com necessidade crítica de liquidez - janela de oportunidade para acordo rápido com desconto moderado'
                : cashFlowAnalysis.liquidityRisk === 'low'
                ? 'Contraparte com liquidez confortável - manter posição agressiva'
                : 'Momento equilibrado para negociação'
        };
    }
    
    /**
     * Gera matriz de payoff para negociação
     */
    generatePayoffMatrix(caseData, platform, optimalTiming) {
        const caseValue = caseData.value || 50000;
        const discount = optimalTiming.recommendedDiscount;
        const proposedValue = caseValue * (1 - discount);
        
        // Estratégias possíveis
        const clientStrategies = ['aggressive', 'balanced', 'concession'];
        const platformStrategies = ['aggressive', 'balanced', 'concession'];
        
        const matrix = [];
        
        for (const clientStrategy of clientStrategies) {
            const row = { clientStrategy, platformPayoffs: [] };
            
            for (const platformStrategy of platformStrategies) {
                let clientPayoff = 0;
                let platformPayoff = 0;
                
                // Calcular payoffs baseado nas estratégias
                if (clientStrategy === 'aggressive' && platformStrategy === 'aggressive') {
                    clientPayoff = caseValue * 0.3;
                    platformPayoff = -caseValue * 0.5;
                } else if (clientStrategy === 'aggressive' && platformStrategy === 'balanced') {
                    clientPayoff = caseValue * 0.5;
                    platformPayoff = -caseValue * 0.35;
                } else if (clientStrategy === 'aggressive' && platformStrategy === 'concession') {
                    clientPayoff = caseValue * 0.7;
                    platformPayoff = -caseValue * 0.2;
                } else if (clientStrategy === 'balanced' && platformStrategy === 'aggressive') {
                    clientPayoff = caseValue * 0.4;
                    platformPayoff = -caseValue * 0.4;
                } else if (clientStrategy === 'balanced' && platformStrategy === 'balanced') {
                    clientPayoff = proposedValue;
                    platformPayoff = -proposedValue;
                } else if (clientStrategy === 'balanced' && platformStrategy === 'concession') {
                    clientPayoff = proposedValue * 1.1;
                    platformPayoff = -proposedValue * 0.9;
                } else if (clientStrategy === 'concession' && platformStrategy === 'aggressive') {
                    clientPayoff = caseValue * 0.2;
                    platformPayoff = -caseValue * 0.6;
                } else if (clientStrategy === 'concession' && platformStrategy === 'balanced') {
                    clientPayoff = caseValue * 0.3;
                    platformPayoff = -caseValue * 0.45;
                } else if (clientStrategy === 'concession' && platformStrategy === 'concession') {
                    clientPayoff = caseValue * 0.5;
                    platformPayoff = -caseValue * 0.3;
                }
                
                row.platformPayoffs.push({
                    platformStrategy,
                    clientPayoff: Math.round(clientPayoff),
                    platformPayoff: Math.round(platformPayoff),
                    isNash: false
                });
            }
            
            matrix.push(row);
        }
        
        // Identificar Equilíbrio de Nash na matriz
        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[i].platformPayoffs.length; j++) {
                const cell = matrix[i].platformPayoffs[j];
                const clientBest = this.isClientBestResponse(matrix, i, j);
                const platformBest = this.isPlatformBestResponse(matrix, i, j);
                cell.isNash = clientBest && platformBest;
            }
        }
        
        return {
            clientStrategies: clientStrategies,
            platformStrategies: platformStrategies,
            matrix: matrix,
            dominantStrategy: this.findDominantStrategy(matrix),
            recommendation: this.findNashEquilibrium(matrix)
        };
    }
    
    /**
     * Verifica se é melhor resposta para o cliente
     */
    isClientBestResponse(matrix, row, col) {
        const currentPayoff = matrix[row].platformPayoffs[col].clientPayoff;
        for (let r = 0; r < matrix.length; r++) {
            if (matrix[r].platformPayoffs[col].clientPayoff > currentPayoff) {
                return false;
            }
        }
        return true;
    }
    
    /**
     * Verifica se é melhor resposta para a plataforma
     */
    isPlatformBestResponse(matrix, row, col) {
        const currentPayoff = matrix[row].platformPayoffs[col].platformPayoff;
        for (let c = 0; c < matrix[row].platformPayoffs.length; c++) {
            if (matrix[row].platformPayoffs[c].platformPayoff > currentPayoff) {
                return false;
            }
        }
        return true;
    }
    
    /**
     * Encontra estratégia dominante
     */
    findDominantStrategy(matrix) {
        // Análise simplificada para encontrar estratégia dominante
        const clientScores = { aggressive: 0, balanced: 0, concession: 0 };
        
        for (let i = 0; i < matrix.length; i++) {
            const strategy = matrix[i].clientStrategy;
            const avgPayoff = matrix[i].platformPayoffs.reduce((sum, p) => sum + p.clientPayoff, 0) / matrix[i].platformPayoffs.length;
            clientScores[strategy] = avgPayoff;
        }
        
        const dominant = Object.entries(clientScores).reduce((a, b) => a[1] > b[1] ? a : b);
        
        return {
            strategy: dominant[0],
            avgPayoff: Math.round(dominant[1]),
            description: `Estratégia ${dominant[0]} maximiza o payoff médio do cliente`
        };
    }
    
    /**
     * Encontra equilíbrio de Nash na matriz
     */
    findNashEquilibrium(matrix) {
        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[i].platformPayoffs.length; j++) {
                if (matrix[i].platformPayoffs[j].isNash) {
                    return {
                        exists: true,
                        clientStrategy: matrix[i].clientStrategy,
                        platformStrategy: matrix[i].platformPayoffs[j].platformStrategy,
                        clientPayoff: matrix[i].platformPayoffs[j].clientPayoff,
                        platformPayoff: matrix[i].platformPayoffs[j].platformPayoff,
                        description: `Equilíbrio de Nash encontrado: Cliente joga ${matrix[i].clientStrategy}, Plataforma joga ${matrix[i].platformPayoffs[j].platformStrategy}`
                    };
                }
            }
        }
        
        return {
            exists: false,
            description: 'Nenhum equilíbrio de Nash puro encontrado. Recomenda-se estratégia mista.'
        };
    }
    
    /**
     * Calcula ROI esperado do acordo
     */
    calculateExpectedROI(caseData, optimalTiming) {
        const caseValue = caseData.value || 50000;
        const settlementValue = caseValue * (1 - optimalTiming.recommendedDiscount);
        const litigationCosts = 25000; // Estimativa
        const successProbability = caseData.successProbability / 100 || 0.7;
        const expectedLitigationValue = caseValue * successProbability - litigationCosts;
        
        const roi = ((settlementValue - expectedLitigationValue) / expectedLitigationValue) * 100;
        
        return {
            settlementValue: settlementValue,
            expectedLitigationValue: expectedLitigationValue,
            roi: roi.toFixed(1) + '%',
            recommendation: roi > 0 ? 'Acordo mais vantajoso que litígio' : 'Litígio pode ser mais vantajoso',
            breakEvenDiscount: ((caseValue - expectedLitigationValue) / caseValue * 100).toFixed(1) + '%'
        };
    }
    
    /**
     * Obtém trimestre atual
     */
    getCurrentQuarter() {
        const now = new Date();
        const month = now.getMonth();
        if (month <= 2) return 'Q1 2025';
        if (month <= 5) return 'Q2 2025';
        if (month <= 8) return 'Q3 2025';
        return 'Q4 2025';
    }
    
    /**
     * Gera relatório completo de análise
     */
    generateReport(caseData, platform) {
        const analysis = this.analyzeOptimalSettlementTiming(caseData, platform);
        if (!analysis) return null;
        
        return {
            generatedAt: new Date().toISOString(),
            caseId: caseData.id,
            platform: platform,
            caseValue: caseData.value,
            optimalTiming: {
                quarter: analysis.optimalTiming.quarter,
                probability: (analysis.optimalTiming.probability * 100).toFixed(0) + '%',
                recommendedDiscount: (analysis.optimalTiming.recommendedDiscount * 100).toFixed(0) + '%',
                liquidity: analysis.optimalTiming.liquidity
            },
            cashFlowAnalysis: {
                currentCashFlow: analysis.cashFlowAnalysis.currentCashFlow,
                liquidityRisk: analysis.cashFlowAnalysis.liquidityRisk,
                recommendation: analysis.cashFlowAnalysis.recommendation
            },
            nashEquilibrium: analysis.nashEquilibrium,
            recommendedStrategy: analysis.recommendedStrategy,
            expectedROI: analysis.expectedROI,
            payoffMatrix: analysis.payoffMatrix,
            summary: this.generateSummary(analysis)
        };
    }
    
    /**
     * Gera sumário executivo
     */
    generateSummary(analysis) {
        const optimal = analysis.optimalTiming;
        const strategy = analysis.recommendedStrategy;
        
        return {
            headline: `Momento ótimo para acordo: ${optimal.quarter}`,
            keyFinding: `Probabilidade de aceitação de ${(optimal.probability * 100).toFixed(0)}% com desconto de ${(optimal.recommendedDiscount * 100).toFixed(0)}%`,
            recommendation: strategy.name,
            rationale: strategy.rationale,
            expectedOutcome: strategy.acceptanceProbability === '85%' ? 'Alta probabilidade de acordo rápido' : 
                             strategy.acceptanceProbability === '75%' ? 'Boa oportunidade de acordo' :
                             'Janela desafiadora - considerar estratégia alternativa'
        };
    }
    
    /**
     * Renderiza dashboard de analytics quântico
     */
    renderDashboard(containerId, caseData, platform) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const analysis = this.analyzeOptimalSettlementTiming(caseData, platform);
        if (!analysis) {
            container.innerHTML = '<div class="error">Dados insuficientes para análise</div>';
            return;
        }
        
        container.innerHTML = `
            <div class="quantum-analytics-dashboard">
                <div class="dashboard-header">
                    <h2><i class="fas fa-chart-line"></i> QUANTUM LEGAL ANALYTICS</h2>
                    <div class="platform-badge">${analysis.platform}</div>
                </div>
                
                <div class="summary-header">
                    <div class="summary-card">
                        <div class="summary-value">${analysis.optimalTiming.quarter}</div>
                        <div class="summary-label">Momento Ótimo</div>
                        <div class="summary-trend">${analysis.optimalTiming.liquidity}</div>
                    </div>
                    <div class="summary-card">
                        <div class="summary-value">${analysis.optimalTiming.probability}</div>
                        <div class="summary-label">Probabilidade Aceitação</div>
                        <div class="summary-trend trend-up">+${(analysis.optimalTiming.probability * 100).toFixed(0)}%</div>
                    </div>
                    <div class="summary-card">
                        <div class="summary-value">${analysis.optimalTiming.recommendedDiscount}</div>
                        <div class="summary-label">Desconto Recomendado</div>
                        <div class="summary-trend">vs. ${(analysis.nashEquilibrium.equilibriumValue ? '€' + (analysis.nashEquilibrium.equilibriumValue / 1000).toFixed(0) + 'k' : 'N/A')}</div>
                    </div>
                    <div class="summary-card">
                        <div class="summary-value">${analysis.expectedROI.roi}</div>
                        <div class="summary-label">ROI Esperado</div>
                        <div class="summary-trend ${analysis.expectedROI.roi > '0' ? 'positive' : 'negative'}">${analysis.expectedROI.recommendation}</div>
                    </div>
                </div>
                
                <div class="two-columns">
                    <div class="column">
                        <div class="cashflow-card">
                            <h3><i class="fas fa-chart-line"></i> Análise de Fluxo de Caixa</h3>
                            <div class="cashflow-metric">
                                <div class="metric-label">Liquidez Atual</div>
                                <div class="metric-value">€${(analysis.cashFlowAnalysis.currentCashFlow / 1000000).toFixed(0)}M</div>
                                <div class="metric-status ${analysis.cashFlowAnalysis.liquidityRisk === 'high' ? 'critical' : analysis.cashFlowAnalysis.liquidityRisk === 'medium' ? 'warning' : 'good'}">
                                    Risco: ${analysis.cashFlowAnalysis.liquidityRisk === 'high' ? 'ALTO' : analysis.cashFlowAnalysis.liquidityRisk === 'medium' ? 'MÉDIO' : 'BAIXO'}
                                </div>
                            </div>
                            <div class="cashflow-trend">
                                <strong>Tendência:</strong> ${analysis.cashFlowAnalysis.projectedTrend === 'improving' ? '📈 Melhorando' : analysis.cashFlowAnalysis.projectedTrend === 'declining' ? '📉 Piorando' : '📊 Estável'}
                                <span>(${analysis.cashFlowAnalysis.trendPercentage > 0 ? '+' : ''}${analysis.cashFlowAnalysis.trendPercentage}%)</span>
                            </div>
                            <div class="cashflow-recommendation">
                                <i class="fas fa-lightbulb"></i> ${analysis.cashFlowAnalysis.recommendation}
                            </div>
                        </div>
                        
                        <div class="probabilities-card">
                            <h3><i class="fas fa-chart-simple"></i> Probabilidades por Trimestre</h3>
                            <div class="quarter-probabilities">
                                ${analysis.acceptanceProbabilities.map(q => `
                                    <div class="quarter-item">
                                        <div class="quarter-name">${q.quarter}</div>
                                        <div class="progress-bar">
                                            <div class="progress-fill" style="width: ${q.probability * 100}%"></div>
                                            <span class="progress-text">${(q.probability * 100).toFixed(0)}%</span>
                                        </div>
                                        <div class="quarter-discount">Desconto: ${(q.recommendedDiscount * 100).toFixed(0)}%</div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                    
                    <div class="column">
                        <div class="nash-card">
                            <h3><i class="fas fa-chess-board"></i> Equilíbrio de Nash</h3>
                            <div class="nash-status ${analysis.nashEquilibrium.isEquilibrium ? 'equilibrium' : 'no-equilibrium'}">
                                ${analysis.nashEquilibrium.isEquilibrium ? '✓ EQUILÍBRIO ENCONTRADO' : '⚠ SEM EQUILÍBRIO PURO'}
                            </div>
                            <div class="nash-explanation">
                                ${analysis.nashEquilibrium.explanation}
                            </div>
                            <div class="nash-values">
                                <div class="value-row">
                                    <span>Valor de Equilíbrio:</span>
                                    <strong>€${analysis.nashEquilibrium.equilibriumValue ? analysis.nashEquilibrium.equilibriumValue.toLocaleString() : 'N/A'}</strong>
                                </div>
                                <div class="value-row">
                                    <span>Estratégia Cliente:</span>
                                    <strong>${analysis.nashEquilibrium.clientOptimalStrategy === 'accept' ? 'Aceitar proposta' : 'Litigar'}</strong>
                                </div>
                                <div class="value-row">
                                    <span>Estratégia Plataforma:</span>
                                    <strong>${analysis.nashEquilibrium.platformOptimalStrategy === 'accept' ? 'Aceitar proposta' : 'Rejeitar'}</strong>
                                </div>
                            </div>
                        </div>
                        
                        <div class="strategy-card">
                            <h3><i class="fas fa-gavel"></i> Estratégia Recomendada</h3>
                            <div class="strategy-name">${analysis.recommendedStrategy.name}</div>
                            <div class="strategy-description">${analysis.recommendedStrategy.description}</div>
                            <div class="strategy-details">
                                <div><strong>Desconto:</strong> ${analysis.recommendedStrategy.discount}</div>
                                <div><strong>Timing:</strong> ${analysis.recommendedStrategy.optimalQuarter}</div>
                                <div><strong>Probabilidade:</strong> ${analysis.recommendedStrategy.acceptanceProbability}</div>
                            </div>
                            <div class="strategy-rationale">
                                <i class="fas fa-brain"></i> ${analysis.recommendedStrategy.rationale}
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="payoff-matrix">
                    <h3><i class="fas fa-table"></i> Matriz de Payoff</h3>
                    <div class="matrix-container">
                        <table class="payoff-table">
                            <thead>
                                <tr>
                                    <th>Cliente \ Plataforma</th>
                                    ${analysis.payoffMatrix.platformStrategies.map(s => `<th>${s.toUpperCase()}</th>`).join('')}
                                </tr>
                            </thead>
                            <tbody>
                                ${analysis.payoffMatrix.matrix.map(row => `
                                    <tr>
                                        <td class="strategy-label">${row.clientStrategy.toUpperCase()}</td>
                                        ${row.platformPayoffs.map(cell => `
                                            <td class="${cell.isNash ? 'nash-cell' : ''}">
                                                (${cell.clientPayoff.toLocaleString()}, ${cell.platformPayoff.toLocaleString()})
                                                ${cell.isNash ? '<span class="nash-badge">NASH</span>' : ''}
                                            </td>
                                        `).join('')}
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                    <div class="matrix-explanation">
                        <strong>Legenda:</strong> (Payoff Cliente, Payoff Plataforma) | <span class="nash-badge-example">NASH</span> = Equilíbrio de Nash
                    </div>
                </div>
                
                <div class="roi-card">
                    <h3><i class="fas fa-chart-pie"></i> Análise de ROI</h3>
                    <div class="roi-values">
                        <div class="roi-item">
                            <div class="roi-label">Valor do Acordo</div>
                            <div class="roi-value">€${analysis.expectedROI.settlementValue.toLocaleString()}</div>
                        </div>
                        <div class="roi-item">
                            <div class="roi-label">Valor Esperado Litígio</div>
                            <div class="roi-value">€${analysis.expectedROI.expectedLitigationValue.toLocaleString()}</div>
                        </div>
                        <div class="roi-item">
                            <div class="roi-label">ROI do Acordo</div>
                            <div class="roi-value ${analysis.expectedROI.roi > '0' ? 'positive' : 'negative'}">${analysis.expectedROI.roi}</div>
                        </div>
                        <div class="roi-item">
                            <div class="roi-label">Break-even Discount</div>
                            <div class="roi-value">${analysis.expectedROI.breakEvenDiscount}</div>
                        </div>
                    </div>
                    <div class="roi-recommendation">
                        <i class="fas ${analysis.expectedROI.roi > '0' ? 'fa-check-circle' : 'fa-exclamation-triangle'}"></i>
                        ${analysis.expectedROI.recommendation}
                    </div>
                </div>
                
                <div class="summary-footer">
                    <div class="summary-headline">${analysis.summary.headline}</div>
                    <div class="summary-key">${analysis.summary.keyFinding}</div>
                    <div class="summary-action">
                        <button id="applyStrategyBtn" class="elite-btn primary">
                            <i class="fas fa-rocket"></i> APLICAR ESTRATÉGIA RECOMENDADA
                        </button>
                        <button id="exportAnalysisBtn" class="elite-btn secondary">
                            <i class="fas fa-download"></i> EXPORTAR ANÁLISE
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Estilos adicionais
        const style = document.createElement('style');
        style.textContent = `
            .quantum-analytics-dashboard { padding: 0; }
            .platform-badge { background: var(--elite-primary-dim); color: var(--elite-primary); padding: 4px 12px; border-radius: 20px; font-size: 0.7rem; }
            .summary-header { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin: 20px 0; }
            .summary-card { background: var(--bg-command); border-radius: 16px; padding: 20px; text-align: center; }
            .summary-value { font-size: 1.5rem; font-weight: 800; font-family: 'JetBrains Mono'; color: var(--elite-primary); }
            .summary-label { font-size: 0.7rem; color: #94a3b8; margin: 8px 0; }
            .summary-trend { font-size: 0.65rem; }
            .summary-trend.positive { color: #00e676; }
            .summary-trend.negative { color: #ff1744; }
            .two-columns { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
            .cashflow-card, .probabilities-card, .nash-card, .strategy-card { background: var(--bg-terminal); border-radius: 16px; padding: 20px; margin-bottom: 20px; }
            .cashflow-metric { text-align: center; padding: 16px; }
            .metric-status { margin-top: 8px; font-size: 0.7rem; font-weight: bold; }
            .metric-status.critical { color: #ff1744; }
            .metric-status.warning { color: #ffc107; }
            .metric-status.good { color: #00e676; }
            .cashflow-trend { padding: 12px; border-top: 1px solid var(--border-tactic); font-size: 0.8rem; }
            .cashflow-recommendation { background: var(--elite-primary-dim); padding: 12px; border-radius: 8px; margin-top: 12px; font-size: 0.75rem; }
            .quarter-probabilities { display: flex; flex-direction: column; gap: 12px; }
            .quarter-item { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
            .quarter-name { width: 60px; font-size: 0.7rem; font-weight: bold; }
            .quarter-item .progress-bar { flex: 1; }
            .quarter-discount { font-size: 0.65rem; color: #94a3b8; }
            .nash-status { padding: 12px; border-radius: 8px; text-align: center; font-weight: bold; margin-bottom: 16px; }
            .nash-status.equilibrium { background: rgba(0, 230, 118, 0.1); color: #00e676; }
            .nash-status.no-equilibrium { background: rgba(255, 193, 7, 0.1); color: #ffc107; }
            .nash-explanation { font-size: 0.75rem; color: #94a3b8; margin-bottom: 16px; }
            .nash-values { background: var(--bg-command); border-radius: 8px; padding: 12px; }
            .value-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 0.75rem; }
            .strategy-name { font-size: 1.2rem; font-weight: bold; color: var(--elite-primary); margin: 12px 0; }
            .strategy-description { font-size: 0.8rem; color: #94a3b8; margin-bottom: 16px; }
            .strategy-details { display: flex; gap: 16px; justify-content: space-between; padding: 12px; background: var(--bg-command); border-radius: 8px; margin-bottom: 16px; font-size: 0.7rem; }
            .strategy-rationale { background: var(--elite-primary-dim); padding: 12px; border-radius: 8px; font-size: 0.75rem; }
            .payoff-matrix { background: var(--bg-terminal); border-radius: 16px; padding: 20px; margin: 20px 0; overflow-x: auto; }
            .payoff-table { width: 100%; border-collapse: collapse; font-size: 0.7rem; }
            .payoff-table th, .payoff-table td { padding: 12px; text-align: center; border: 1px solid var(--border-tactic); }
            .payoff-table .strategy-label { font-weight: bold; background: var(--bg-command); }
            .nash-cell { background: rgba(0, 229, 255, 0.1); position: relative; }
            .nash-badge { display: inline-block; background: #00e5ff; color: #000; font-size: 0.55rem; padding: 2px 6px; border-radius: 10px; margin-left: 8px; }
            .nash-badge-example { display: inline-block; background: #00e5ff; color: #000; font-size: 0.6rem; padding: 2px 8px; border-radius: 10px; }
            .roi-card { background: var(--bg-terminal); border-radius: 16px; padding: 20px; margin: 20px 0; }
            .roi-values { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin: 16px 0; }
            .roi-item { text-align: center; }
            .roi-label { font-size: 0.65rem; color: #94a3b8; }
            .roi-value { font-size: 1rem; font-weight: bold; margin-top: 4px; }
            .roi-value.positive { color: #00e676; }
            .roi-value.negative { color: #ff1744; }
            .roi-recommendation { background: var(--bg-command); padding: 12px; border-radius: 8px; display: flex; align-items: center; gap: 8px; font-size: 0.75rem; }
            .summary-footer { background: var(--bg-command); border-radius: 16px; padding: 24px; text-align: center; margin-top: 20px; }
            .summary-headline { font-size: 1.2rem; font-weight: bold; color: var(--elite-primary); margin-bottom: 8px; }
            .summary-key { font-size: 0.85rem; color: #94a3b8; margin-bottom: 20px; }
            .summary-action { display: flex; gap: 16px; justify-content: center; }
            @media (max-width: 768px) { .two-columns { grid-template-columns: 1fr; } .roi-values { grid-template-columns: 1fr 1fr; } .summary-header { grid-template-columns: 1fr 1fr; } }
        `;
        container.appendChild(style);
        
        // Event listeners
        document.getElementById('applyStrategyBtn')?.addEventListener('click', () => {
            if (window.EliteUtils) {
                window.EliteUtils.showToast(`Estratégia ${analysis.recommendedStrategy.name} aplicada. Proposta recomendada: ${analysis.recommendedStrategy.discount} de desconto no ${analysis.recommendedStrategy.optimalQuarter}.`, 'success');
            }
        });
        
        document.getElementById('exportAnalysisBtn')?.addEventListener('click', () => {
            const report = this.generateReport(caseData, platform);
            const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `quantum_analysis_${caseData.id}_${new Date().toISOString().slice(0, 10)}.json`;
            link.click();
            URL.revokeObjectURL(link.href);
            
            if (window.EliteUtils) {
                window.EliteUtils.showToast('Análise exportada com sucesso', 'success');
            }
        });
    }
}

// Instância global
window.QuantumLegalAnalytics = new QuantumLegalAnalytics();