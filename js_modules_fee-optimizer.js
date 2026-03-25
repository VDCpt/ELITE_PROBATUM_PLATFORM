/**
 * ============================================================================
 * UNIFED-ELITE PLATFORM — MÓDULO 4: OTIMIZAÇÃO DE HONORÁRIOS
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
            fixed: this.calculateFixedModel.bind(this)
        };
        
        this.costBases = {
            seniorLawyer: 350,    // €/hora
            juniorLawyer: 200,    // €/hora
            paralegal: 85,        // €/hora
            expertWitness: 1500,  // €/perícia
            courtFees: {
                judicial: 500,
                arbitration: 2500,
                caad: 1000
            }
        };
    }
    
    analyzeCase(caseData) {
        const models = [];
        
        for (const [name, calculator] of Object.entries(this.feeModels)) {
            const result = calculator(caseData);
            models.push({
                name: this.getModelName(name),
                key: name,
                ...result
            });
        }
        
        // Ordenar por ROI esperado
        models.sort((a, b) => b.expectedROI - a.expectedROI);
        
        return {
            recommended: models[0],
            alternatives: models.slice(1, 3),
            comparison: this.generateComparisonTable(models),
            riskAnalysis: this.analyzeRisk(models, caseData),
            cashFlowProjection: this.projectCashFlow(models, caseData)
        };
    }
    
    getModelName(key) {
        const names = {
            hourly: 'Honorários por Hora',
            contingency: 'Contingência (êxito)',
            hybrid: 'Híbrido (base + êxito)',
            successFee: 'Sucesso (percentagem da causa)',
            fixed: 'Preço Fixo'
        };
        return names[key] || key;
    }
    
    calculateHourlyModel(caseData) {
        const estimatedHours = this.estimateHours(caseData);
        const hourlyRate = this.getHourlyRate(caseData);
        const totalFee = estimatedHours * hourlyRate;
        const costs = this.estimateCosts(caseData);
        const successProbability = caseData.successProbability / 100;
        
        const expectedFee = totalFee * successProbability;
        const expectedProfit = expectedFee - costs;
        const roi = (expectedProfit / costs) * 100;
        
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
            firmFriendly: 'Baixo'
        };
    }
    
    calculateContingencyModel(caseData) {
        const claimValue = caseData.discrepancy;
        const successProbability = caseData.successProbability / 100;
        const feePercentage = this.calculateContingencyRate(caseData);
        const expectedFee = claimValue * feePercentage * successProbability;
        const costs = this.estimateCosts(caseData);
        const riskCost = costs * (1 - successProbability);
        
        const expectedProfit = expectedFee - costs - riskCost;
        const roi = (expectedProfit / costs) * 100;
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
            firmFriendly: 'Alto (partilha de risco)'
        };
    }
    
    calculateHybridModel(caseData) {
        const estimatedHours = this.estimateHours(caseData);
        const reducedRate = this.costBases.seniorLawyer * 0.6; // 60% do valor normal
        const baseFee = estimatedHours * reducedRate;
        
        const claimValue = caseData.discrepancy;
        const successProbability = caseData.successProbability / 100;
        const successFeePercentage = 0.15; // 15% sobre o êxito
        const successFee = claimValue * successFeePercentage * successProbability;
        
        const totalFee = baseFee + successFee;
        const costs = this.estimateCosts(caseData);
        const expectedProfit = totalFee - costs;
        const roi = (expectedProfit / costs) * 100;
        
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
    
    calculateSuccessFeeModel(caseData) {
        const claimValue = caseData.discrepancy;
        const successProbability = caseData.successProbability / 100;
        const feePercentage = 0.25; // 25% do valor da causa
        const expectedFee = claimValue * feePercentage * successProbability;
        const costs = this.estimateCosts(caseData);
        const expectedProfit = expectedFee - costs;
        const roi = (expectedProfit / costs) * 100;
        
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
    
    calculateFixedModel(caseData) {
        const fixedFee = this.calculateFixedFee(caseData);
        const costs = this.estimateCosts(caseData);
        const expectedProfit = fixedFee - costs;
        const roi = (expectedProfit / costs) * 100;
        const successProbability = caseData.successProbability / 100;
        
        return {
            fixedFee,
            costs,
            expectedProfit,
            expectedROI: roi,
            riskLevel: this.classifyRisk(successProbability),
            clientFriendly: 'Alto (previsibilidade)',
            firmFriendly: 'Variável'
        };
    }
    
    estimateHours(caseData) {
        let hours = 0;
        
        // Fase de análise (10-20h)
        hours += 15;
        
        // Fase de petição (5-10h)
        hours += 8;
        
        // Fase probatória (5-20h)
        hours += caseData.hasExpertEvidence ? 15 : 8;
        
        // Fase de audiência (5-15h)
        hours += caseData.complexity === 'high' ? 12 : 6;
        
        // Ajustes
        if (caseData.discrepancy > 50000) hours *= 1.2;
        if (caseData.hasMultipleYears) hours *= 1.15;
        
        return Math.round(hours);
    }
    
    getHourlyRate(caseData) {
        if (caseData.complexity === 'high') return this.costBases.seniorLawyer;
        if (caseData.complexity === 'medium') return this.costBases.seniorLawyer * 0.9;
        return this.costBases.juniorLawyer;
    }
    
    estimateCosts(caseData) {
        let costs = 0;
        
        // Custas judiciais
        const courtType = caseData.courtType || 'judicial';
        costs += this.costBases.courtFees[courtType] || 500;
        
        // Perícia técnica
        if (caseData.hasExpertEvidence) {
            costs += this.costBases.expertWitness;
        }
        
        // Custos administrativos (10% do valor da causa)
        costs += caseData.discrepancy * 0.01;
        
        // Horas de suporte
        const supportHours = this.estimateSupportHours(caseData);
        costs += supportHours * this.costBases.paralegal;
        
        return Math.round(costs);
    }
    
    estimateSupportHours(caseData) {
        let hours = 10;
        if (caseData.complexity === 'high') hours = 20;
        if (caseData.discrepancy > 50000) hours += 5;
        return hours;
    }
    
    calculateContingencyRate(caseData) {
        let rate = 0.25; // 25% base
        
        if (caseData.discrepancy > 50000) rate += 0.05;
        if (caseData.complexity === 'high') rate += 0.05;
        if (caseData.successProbability < 0.5) rate += 0.1;
        
        return Math.min(rate, 0.45); // Máximo 45%
    }
    
    calculateFixedFee(caseData) {
        const baseFee = 2500;
        let multiplier = 1;
        
        if (caseData.discrepancy > 50000) multiplier += 0.5;
        if (caseData.complexity === 'high') multiplier += 0.5;
        if (caseData.hasMultipleYears) multiplier += 0.3;
        
        return baseFee * multiplier;
    }
    
    classifyRisk(probability) {
        if (probability > 0.8) return 'Baixo';
        if (probability > 0.6) return 'Moderado';
        if (probability > 0.4) return 'Elevado';
        return 'Muito Elevado';
    }
    
    generateComparisonTable(models) {
        return models.map(m => ({
            modelo: m.name,
            honorarioEsperado: window.UNIFEDElite?.formatCurrency(m.expectedFee) || '€0',
            custos: window.UNIFEDElite?.formatCurrency(m.costs) || '€0',
            lucro: window.UNIFEDElite?.formatCurrency(m.expectedProfit) || '€0',
            roi: m.expectedROI.toFixed(1) + '%',
            risco: m.riskLevel
        }));
    }
    
    analyzeRisk(models, caseData) {
        const bestCase = Math.max(...models.map(m => m.expectedProfit));
        const worstCase = Math.min(...models.map(m => m.expectedProfit));
        const expectedAvg = models.reduce((sum, m) => sum + m.expectedProfit, 0) / models.length;
        
        return {
            bestCase,
            worstCase,
            expectedAvg,
            volatility: ((bestCase - worstCase) / expectedAvg) * 100,
            recommendation: this.getRiskRecommendation(models, caseData)
        };
    }
    
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
    
    projectCashFlow(models, caseData) {
        const months = 12;
        const cashFlow = [];
        
        for (let m = 1; m <= months; m++) {
            const monthData = {
                month: m,
                revenue: 0,
                costs: 0,
                cumulative: 0
            };
            
            // Distribuição dos honorários ao longo do tempo
            for (const model of models) {
                let monthlyRevenue = 0;
                
                if (model.key === 'hourly' || model.key === 'fixed') {
                    // Distribuição linear
                    monthlyRevenue = model.expectedFee / 12;
                } else {
                    // Receita concentrada no final
                    if (m === 12) monthlyRevenue = model.expectedFee;
                }
                
                monthData.revenue += monthlyRevenue;
            }
            
            // Custos distribuídos
            monthData.costs = models[0].costs / 12;
            monthData.net = monthData.revenue - monthData.costs;
            
            if (m > 1) {
                monthData.cumulative = cashFlow[m - 2].cumulative + monthData.net;
            } else {
                monthData.cumulative = monthData.net;
            }
            
            cashFlow.push(monthData);
        }
        
        return cashFlow;
    }
    
    calculatePortfolioROI(cases) {
        const analyses = cases.map(c => this.analyzeCase(c));
        
        const total = {
            expectedRevenue: 0,
            expectedCosts: 0,
            expectedProfit: 0,
            weightedROI: 0,
            cashFlow: []
        };
        
        for (const analysis of analyses) {
            total.expectedRevenue += analysis.recommended.expectedFee;
            total.expectedCosts += analysis.recommended.costs;
        }
        
        total.expectedProfit = total.expectedRevenue - total.expectedCosts;
        total.weightedROI = (total.expectedProfit / total.expectedCosts) * 100;
        
        // Projetar cash flow agregado
        const months = 12;
        for (let m = 1; m <= months; m++) {
            let monthlyRevenue = 0;
            for (const analysis of analyses) {
                const model = analysis.recommended;
                if (model.key === 'hourly' || model.key === 'fixed') {
                    monthlyRevenue += model.expectedFee / 12;
                } else if (m === 12) {
                    monthlyRevenue += model.expectedFee;
                }
            }
            total.cashFlow.push({
                month: m,
                revenue: monthlyRevenue,
                cumulative: total.cashFlow.reduce((s, c) => s + c.revenue, 0) + monthlyRevenue
            });
        }
        
        return total;
    }
}

// Instância global
window.FeeOptimizer = new FeeOptimizer();