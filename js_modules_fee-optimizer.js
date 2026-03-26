/**
 * ============================================================================
 * ELITE PROBATUM — MÓDULO 4: OTIMIZAÇÃO DE HONORÁRIOS
 * ============================================================================
 * Análise de rentabilidade, modelos de honorários, ROI por caso,
 * projeção de cash flow e gestão de risco financeiro.
 * ============================================================================
 */

class FeeOptimizer {
    constructor() {
        this.feeModels = {
            hourly: this.calculateHourlyModel.bind(this),
            contingency: this.calculateContingencyModel.bind(this),
            hybrid: this.calculateHybridModel.bind(this),
            successFee: this.calculateSuccessFeeModel.bind(this),
            fixed: this.calculateFixedModel.bind(this),
            valueBased: this.calculateValueBasedModel.bind(this)
        };
        
        this.costBases = {
            seniorLawyer: 350,
            juniorLawyer: 200,
            associateLawyer: 275,
            paralegal: 85,
            expertWitness: 1500,
            courtFees: {
                judicial: 500,
                arbitration: 2500,
                caad: 1000,
                urgent: 750,
                appeal: 800
            },
            administrative: 150,
            discovery: 300
        };
        
        this.marketRates = {
            min: 200,
            avg: 275,
            max: 400,
            contingency: 0.25,
            successFee: 0.20
        };
    }
    
    /**
     * Analisa um caso e recomenda o melhor modelo de honorários
     */
    analyzeCase(caseData) {
        const models = [];
        
        for (const [name, calculator] of Object.entries(this.feeModels)) {
            try {
                const result = calculator(caseData);
                models.push({
                    name: this.getModelName(name),
                    key: name,
                    ...result
                });
            } catch (error) {
                console.warn(`[FeeOptimizer] Erro no modelo ${name}:`, error);
            }
        }
        
        // Ordenar por ROI esperado
        models.sort((a, b) => b.expectedROI - a.expectedROI);
        
        // Calcular score de recomendação
        for (const model of models) {
            model.recommendationScore = this.calculateRecommendationScore(model, caseData);
        }
        
        const recommended = models[0];
        
        return {
            recommended: recommended,
            alternatives: models.slice(1, 3),
            comparison: this.generateComparisonTable(models),
            riskAnalysis: this.analyzeRisk(models, caseData),
            cashFlowProjection: this.projectCashFlow(models, caseData),
            sensitivityAnalysis: this.runSensitivityAnalysis(caseData),
            breakEvenAnalysis: this.calculateBreakEven(caseData)
        };
    }
    
    /**
     * Obtém nome amigável do modelo
     */
    getModelName(key) {
        const names = {
            hourly: 'Honorários por Hora',
            contingency: 'Contingência (êxito)',
            hybrid: 'Híbrido (base + êxito)',
            successFee: 'Sucesso (percentagem da causa)',
            fixed: 'Preço Fixo',
            valueBased: 'Baseado no Valor da Causa'
        };
        return names[key] || key;
    }
    
    /**
     * Calcula score de recomendação (0-100)
     */
    calculateRecommendationScore(model, caseData) {
        let score = 0;
        
        // ROI (peso 40%)
        score += Math.min(model.expectedROI / 100, 1) * 40;
        
        // Risco (peso 20%)
        const riskScores = { 'Baixo': 20, 'Moderado': 15, 'Elevado': 8, 'Muito Elevado': 4 };
        score += riskScores[model.riskLevel] || 10;
        
        // Adequação ao perfil do cliente (peso 20%)
        const clientScores = { 'Alto': 20, 'Médio': 12, 'Baixo': 6 };
        score += clientScores[model.clientFriendly] || 10;
        
        // Adequação ao escritório (peso 20%)
        const firmScores = { 'Alto': 20, 'Médio': 12, 'Baixo': 6 };
        score += firmScores[model.firmFriendly] || 10;
        
        return Math.min(Math.max(score, 0), 100);
    }
    
    /**
     * Modelo: Honorários por Hora
     */
    calculateHourlyModel(caseData) {
        const estimatedHours = this.estimateHours(caseData);
        const hourlyRate = this.getHourlyRate(caseData);
        const totalFee = estimatedHours * hourlyRate;
        const costs = this.estimateCosts(caseData);
        const successProbability = caseData.successProbability / 100;
        
        const expectedFee = totalFee * successProbability;
        const expectedProfit = expectedFee - costs;
        const roi = costs > 0 ? (expectedProfit / costs) * 100 : 0;
        
        return {
            estimatedHours,
            hourlyRate,
            totalFee,
            costs,
            expectedFee,
            expectedProfit,
            expectedROI: roi,
            riskLevel: this.classifyRisk(successProbability),
            clientFriendly: 'Médio',
            firmFriendly: 'Baixo',
            breakEvenHours: costs / hourlyRate
        };
    }
    
    /**
     * Modelo: Contingência (êxito)
     */
    calculateContingencyModel(caseData) {
        const claimValue = caseData.discrepancy || caseData.value || 0;
        const successProbability = caseData.successProbability / 100;
        const feePercentage = this.calculateContingencyRate(caseData);
        const expectedFee = claimValue * feePercentage * successProbability;
        const costs = this.estimateCosts(caseData);
        const riskCost = costs * (1 - successProbability);
        
        const expectedProfit = expectedFee - costs - riskCost;
        const roi = costs > 0 ? (expectedProfit / costs) * 100 : 0;
        const breakEvenProbability = costs / (claimValue * feePercentage);
        
        return {
            feePercentage: feePercentage * 100,
            expectedFee,
            costs,
            riskCost,
            expectedProfit,
            expectedROI: roi,
            breakEvenProbability: breakEvenProbability * 100,
            riskLevel: this.classifyRisk(successProbability),
            clientFriendly: 'Alto (sem custos iniciais)',
            firmFriendly: 'Alto (partilha de risco)',
            maxRecovery: claimValue * feePercentage
        };
    }
    
    /**
     * Modelo: Híbrido (base + êxito)
     */
    calculateHybridModel(caseData) {
        const estimatedHours = this.estimateHours(caseData);
        const reducedRate = this.costBases.seniorLawyer * 0.6;
        const baseFee = estimatedHours * reducedRate;
        
        const claimValue = caseData.discrepancy || caseData.value || 0;
        const successProbability = caseData.successProbability / 100;
        const successFeePercentage = 0.15;
        const successFee = claimValue * successFeePercentage * successProbability;
        
        const totalFee = baseFee + successFee;
        const costs = this.estimateCosts(caseData);
        const expectedProfit = totalFee - costs;
        const roi = costs > 0 ? (expectedProfit / costs) * 100 : 0;
        
        return {
            baseFee,
            reducedHourly: reducedRate,
            estimatedHours,
            successFeePercentage: successFeePercentage * 100,
            successFee,
            totalFee,
            costs,
            expectedProfit,
            expectedROI: roi,
            riskLevel: 'Moderado',
            clientFriendly: 'Alto (base reduzida)',
            firmFriendly: 'Médio'
        };
    }
    
    /**
     * Modelo: Sucesso (percentagem da causa)
     */
    calculateSuccessFeeModel(caseData) {
        const claimValue = caseData.discrepancy || caseData.value || 0;
        const successProbability = caseData.successProbability / 100;
        const feePercentage = 0.25;
        const expectedFee = claimValue * feePercentage * successProbability;
        const costs = this.estimateCosts(caseData);
        const expectedProfit = expectedFee - costs;
        const roi = costs > 0 ? (expectedProfit / costs) * 100 : 0;
        
        return {
            feePercentage: feePercentage * 100,
            expectedFee,
            costs,
            expectedProfit,
            expectedROI: roi,
            riskLevel: this.classifyRisk(successProbability),
            clientFriendly: 'Médio (só paga se ganhar)',
            firmFriendly: 'Médio'
        };
    }
    
    /**
     * Modelo: Preço Fixo
     */
    calculateFixedModel(caseData) {
        const fixedFee = this.calculateFixedFee(caseData);
        const costs = this.estimateCosts(caseData);
        const expectedProfit = fixedFee - costs;
        const roi = costs > 0 ? (expectedProfit / costs) * 100 : 0;
        const successProbability = caseData.successProbability / 100;
        
        return {
            fixedFee,
            costs,
            expectedProfit,
            expectedROI: roi,
            riskLevel: this.classifyRisk(successProbability),
            clientFriendly: 'Alto (previsibilidade)',
            firmFriendly: 'Variável',
            margin: fixedFee > 0 ? ((fixedFee - costs) / fixedFee) * 100 : 0
        };
    }
    
    /**
     * Modelo: Baseado no Valor da Causa
     */
    calculateValueBasedModel(caseData) {
        const claimValue = caseData.discrepancy || caseData.value || 0;
        const basePercentage = 0.20;
        let adjustedPercentage = basePercentage;
        
        // Ajustes por complexidade
        if (caseData.complexity === 'high') adjustedPercentage += 0.05;
        if (caseData.complexity === 'low') adjustedPercentage -= 0.03;
        
        // Ajuste por valor
        if (claimValue > 100000) adjustedPercentage -= 0.02;
        if (claimValue < 15000) adjustedPercentage += 0.03;
        
        const fee = claimValue * adjustedPercentage;
        const costs = this.estimateCosts(caseData);
        const successProbability = caseData.successProbability / 100;
        const expectedFee = fee * successProbability;
        const expectedProfit = expectedFee - costs;
        const roi = costs > 0 ? (expectedProfit / costs) * 100 : 0;
        
        return {
            feePercentage: adjustedPercentage * 100,
            fee,
            expectedFee,
            costs,
            expectedProfit,
            expectedROI: roi,
            riskLevel: this.classifyRisk(successProbability),
            clientFriendly: 'Médio',
            firmFriendly: 'Alto'
        };
    }
    
    /**
     * Estima horas necessárias para o caso
     */
    estimateHours(caseData) {
        let hours = 0;
        
        // Fase de análise (10-20h)
        hours += 15;
        
        // Fase de petição (5-10h)
        hours += 8;
        
        // Fase probatória (5-20h)
        if (caseData.hasExpertEvidence) {
            hours += 15;
        } else {
            hours += 8;
        }
        
        // Fase de audiência (5-15h)
        if (caseData.complexity === 'high') {
            hours += 12;
        } else if (caseData.complexity === 'medium') {
            hours += 8;
        } else {
            hours += 5;
        }
        
        // Fase de recurso (0-20h)
        if (caseData.hasAppeal) {
            hours += 15;
        }
        
        // Ajustes
        const claimValue = caseData.discrepancy || caseData.value || 0;
        if (claimValue > 50000) hours *= 1.2;
        if (caseData.hasMultipleYears) hours *= 1.15;
        if (caseData.omissionPercentage > 70) hours *= 1.1;
        
        return Math.round(hours);
    }
    
    /**
     * Obtém taxa horária baseada na complexidade
     */
    getHourlyRate(caseData) {
        if (caseData.complexity === 'high') return this.costBases.seniorLawyer;
        if (caseData.complexity === 'medium') return this.costBases.associateLawyer;
        return this.costBases.juniorLawyer;
    }
    
    /**
     * Estima custos do caso
     */
    estimateCosts(caseData) {
        let costs = 0;
        
        // Custas judiciais
        const courtType = caseData.courtType || 'judicial';
        costs += this.costBases.courtFees[courtType] || 500;
        
        // Custas administrativas
        costs += this.costBases.administrative;
        
        // Perícia técnica
        if (caseData.hasExpertEvidence) {
            costs += this.costBases.expertWitness;
        }
        
        // Discovery
        if (caseData.hasDiscovery) {
            costs += this.costBases.discovery;
        }
        
        // Custos percentuais (1% do valor da causa)
        const claimValue = caseData.discrepancy || caseData.value || 0;
        costs += claimValue * 0.01;
        
        // Horas de suporte
        const supportHours = this.estimateSupportHours(caseData);
        costs += supportHours * this.costBases.paralegal;
        
        return Math.round(costs);
    }
    
    /**
     * Estima horas de suporte
     */
    estimateSupportHours(caseData) {
        let hours = 10;
        
        if (caseData.complexity === 'high') hours = 20;
        if (caseData.complexity === 'medium') hours = 15;
        
        const claimValue = caseData.discrepancy || caseData.value || 0;
        if (claimValue > 50000) hours += 5;
        if (claimValue > 100000) hours += 8;
        
        return hours;
    }
    
    /**
     * Calcula taxa de contingência
     */
    calculateContingencyRate(caseData) {
        let rate = 0.25;
        
        const claimValue = caseData.discrepancy || caseData.value || 0;
        if (claimValue > 50000) rate += 0.05;
        if (claimValue > 100000) rate += 0.03;
        
        if (caseData.complexity === 'high') rate += 0.05;
        if (caseData.successProbability < 0.5) rate += 0.1;
        if (caseData.omissionPercentage > 80) rate -= 0.03;
        
        return Math.min(rate, 0.45);
    }
    
    /**
     * Calcula preço fixo
     */
    calculateFixedFee(caseData) {
        const baseFee = 2500;
        let multiplier = 1;
        
        const claimValue = caseData.discrepancy || caseData.value || 0;
        if (claimValue > 50000) multiplier += 0.5;
        if (claimValue > 100000) multiplier += 0.3;
        
        if (caseData.complexity === 'high') multiplier += 0.5;
        if (caseData.hasMultipleYears) multiplier += 0.3;
        if (caseData.hasExpertEvidence) multiplier += 0.2;
        
        return baseFee * multiplier;
    }
    
    /**
     * Classifica risco
     */
    classifyRisk(probability) {
        if (probability > 0.8) return 'Baixo';
        if (probability > 0.6) return 'Moderado';
        if (probability > 0.4) return 'Elevado';
        return 'Muito Elevado';
    }
    
    /**
     * Gera tabela de comparação entre modelos
     */
    generateComparisonTable(models) {
        return models.map(m => ({
            modelo: m.name,
            honorarioEsperado: this.formatCurrency(m.expectedFee),
            custos: this.formatCurrency(m.costs),
            lucro: this.formatCurrency(m.expectedProfit),
            roi: m.expectedROI.toFixed(1) + '%',
            risco: m.riskLevel,
            score: m.recommendationScore
        }));
    }
    
    /**
     * Analisa risco dos modelos
     */
    analyzeRisk(models, caseData) {
        const bestCase = Math.max(...models.map(m => m.expectedProfit));
        const worstCase = Math.min(...models.map(m => m.expectedProfit));
        const expectedAvg = models.reduce((sum, m) => sum + m.expectedProfit, 0) / models.length;
        
        const volatility = expectedAvg !== 0 ? ((bestCase - worstCase) / Math.abs(expectedAvg)) * 100 : 0;
        
        const riskProfile = {
            bestCase: this.formatCurrency(bestCase),
            worstCase: this.formatCurrency(worstCase),
            expectedAvg: this.formatCurrency(expectedAvg),
            volatility: volatility.toFixed(1),
            recommendation: this.getRiskRecommendation(models, caseData)
        };
        
        // Adicionar análise de Value at Risk (VaR)
        riskProfile.valueAtRisk = this.calculateVaR(models, caseData);
        
        return riskProfile;
    }
    
    /**
     * Calcula Value at Risk (VaR)
     */
    calculateVaR(models, caseData) {
        const profits = models.map(m => m.expectedProfit);
        const sorted = profits.sort((a, b) => a - b);
        const var95 = sorted[Math.floor(sorted.length * 0.05)];
        
        return {
            confidence: '95%',
            varAmount: this.formatCurrency(var95),
            interpretation: var95 < 0 
                ? `Risco de perda de ${this.formatCurrency(Math.abs(var95))} em 5% dos cenários`
                : 'Risco de perda baixo'
        };
    }
    
    /**
     * Obtém recomendação de risco
     */
    getRiskRecommendation(models, caseData) {
        const bestModel = models[0];
        
        if (caseData.successProbability > 0.7) {
            return `Recomenda-se o modelo ${bestModel.name} por oferecer o melhor retorno (${bestModel.expectedROI.toFixed(1)}%) com risco ${bestModel.riskLevel.toLowerCase()}. A alta probabilidade de sucesso (${caseData.successProbability}%) justifica a aposta em modelos de êxito.`;
        } else if (caseData.successProbability > 0.5) {
            return `Recomenda-se modelo híbrido, equilibrando risco e retorno. O modelo ${bestModel.name} oferece ROI de ${bestModel.expectedROI.toFixed(1)}% com risco ${bestModel.riskLevel.toLowerCase()}.`;
        } else {
            return `Recomenda-se modelo por hora ou preço fixo para mitigar risco. A probabilidade de sucesso (${caseData.successProbability}%) é baixa, pelo que modelos de contingência podem não ser rentáveis.`;
        }
    }
    
    /**
     * Projeta fluxo de caixa
     */
    projectCashFlow(models, caseData) {
        const months = 12;
        const cashFlow = [];
        
        for (let m = 1; m <= months; m++) {
            const monthData = {
                month: m,
                revenue: 0,
                costs: 0,
                net: 0,
                cumulative: 0
            };
            
            // Distribuição dos honorários ao longo do tempo
            for (const model of models) {
                let monthlyRevenue = 0;
                
                if (model.key === 'hourly' || model.key === 'fixed') {
                    monthlyRevenue = model.expectedFee / 12;
                } else if (model.key === 'hybrid') {
                    // Base distribuída, sucesso no final
                    monthlyRevenue = (model.baseFee / 12) + (m === 12 ? model.successFee : 0);
                } else {
                    // Receita concentrada no final
                    if (m === 12) monthlyRevenue = model.expectedFee;
                }
                
                monthData.revenue += monthlyRevenue;
            }
            
            // Custos distribuídos uniformemente
            monthData.costs = models[0]?.costs / 12 || 0;
            monthData.net = monthData.revenue - monthData.costs;
            
            if (m > 1) {
                monthData.cumulative = cashFlow[m - 2].cumulative + monthData.net;
            } else {
                monthData.cumulative = monthData.net;
            }
            
            cashFlow.push(monthData);
        }
        
        return {
            monthly: cashFlow,
            totalRevenue: cashFlow.reduce((s, m) => s + m.revenue, 0),
            totalCosts: cashFlow.reduce((s, m) => s + m.costs, 0),
            totalNet: cashFlow.reduce((s, m) => s + m.net, 0),
            peakCashFlow: Math.max(...cashFlow.map(m => m.cumulative)),
            troughCashFlow: Math.min(...cashFlow.map(m => m.cumulative)),
            monthsToPositive: cashFlow.findIndex(m => m.cumulative > 0) + 1
        };
    }
    
    /**
     * Análise de sensibilidade
     */
    runSensitivityAnalysis(caseData) {
        const scenarios = [
            { name: 'Otimista', probabilityFactor: 1.2, valueFactor: 1.15, costFactor: 0.9 },
            { name: 'Base', probabilityFactor: 1.0, valueFactor: 1.0, costFactor: 1.0 },
            { name: 'Pessimista', probabilityFactor: 0.8, valueFactor: 0.85, costFactor: 1.2 }
        ];
        
        const results = [];
        
        for (const scenario of scenarios) {
            const adjustedCase = {
                ...caseData,
                successProbability: caseData.successProbability * scenario.probabilityFactor,
                discrepancy: (caseData.discrepancy || caseData.value || 0) * scenario.valueFactor,
                value: (caseData.discrepancy || caseData.value || 0) * scenario.valueFactor
            };
            
            const analysis = this.analyzeCase(adjustedCase);
            results.push({
                scenario: scenario.name,
                recommendedModel: analysis.recommended.name,
                expectedProfit: analysis.recommended.expectedProfit,
                expectedROI: analysis.recommended.expectedROI,
                riskLevel: analysis.recommended.riskLevel
            });
        }
        
        return results;
    }
    
    /**
     * Calcula ponto de equilíbrio
     */
    calculateBreakEven(caseData) {
        const costs = this.estimateCosts(caseData);
        const hourlyModel = this.calculateHourlyModel(caseData);
        const contingencyModel = this.calculateContingencyModel(caseData);
        
        return {
            costsRecovery: `É necessário faturar ${this.formatCurrency(costs)} para cobrir custos`,
            hourlyBreakEven: `${hourlyModel.breakEvenHours.toFixed(0)} horas`,
            contingencyBreakEven: `${(contingencyModel.breakEvenProbability).toFixed(1)}% de probabilidade`,
            minimumFee: this.formatCurrency(costs * 1.2)
        };
    }
    
    /**
     * Calcula ROI da carteira
     */
    calculatePortfolioROI(cases) {
        const analyses = cases.map(c => this.analyzeCase(c));
        
        const total = {
            expectedRevenue: 0,
            expectedCosts: 0,
            expectedProfit: 0,
            weightedROI: 0,
            byModel: {},
            byRisk: { Baixo: 0, Moderado: 0, Elevado: 0, 'Muito Elevado': 0 }
        };
        
        for (const analysis of analyses) {
            total.expectedRevenue += analysis.recommended.expectedFee;
            total.expectedCosts += analysis.recommended.costs;
            
            const modelKey = analysis.recommended.key;
            total.byModel[modelKey] = (total.byModel[modelKey] || 0) + 1;
            
            total.byRisk[analysis.recommended.riskLevel] = (total.byRisk[analysis.recommended.riskLevel] || 0) + 1;
        }
        
        total.expectedProfit = total.expectedRevenue - total.expectedCosts;
        total.weightedROI = total.expectedCosts > 0 ? (total.expectedProfit / total.expectedCosts) * 100 : 0;
        
        return total;
    }
    
    /**
     * Gera relatório completo
     */
    generateReport(caseData) {
        const analysis = this.analyzeCase(caseData);
        
        return {
            generatedAt: new Date().toISOString(),
            caseId: caseData.id || 'N/A',
            caseValue: this.formatCurrency(caseData.discrepancy || caseData.value || 0),
            successProbability: caseData.successProbability + '%',
            recommendedModel: {
                name: analysis.recommended.name,
                fee: this.formatCurrency(analysis.recommended.expectedFee),
                profit: this.formatCurrency(analysis.recommended.expectedProfit),
                roi: analysis.recommended.expectedROI.toFixed(1) + '%',
                risk: analysis.recommended.riskLevel
            },
            alternatives: analysis.alternatives.map(a => ({
                name: a.name,
                fee: this.formatCurrency(a.expectedFee),
                roi: a.expectedROI.toFixed(1) + '%'
            })),
            comparison: analysis.comparison,
            riskAnalysis: analysis.riskAnalysis,
            cashFlow: {
                monthsToPositive: analysis.cashFlowProjection.monthsToPositive,
                peak: this.formatCurrency(analysis.cashFlowProjection.peakCashFlow)
            },
            sensitivity: analysis.sensitivityAnalysis
        };
    }
    
    /**
     * Formata moeda
     */
    formatCurrency(value) {
        if (value === null || value === undefined) return '€0,00';
        return new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2 }).format(value);
    }
}

// Instância global
window.FeeOptimizer = new FeeOptimizer();