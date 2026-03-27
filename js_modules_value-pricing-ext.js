/**
 * ============================================================================
 * ELITE PROBATUM v2.0.5 — MÓDULO DE VALUE-BASED PRICING ANALYTICS
 * ANÁLISE DE CUSTO DE OPORTUNIDADE E ROI ESTRATÉGICO
 * ============================================================================
 * INOVAÇÃO ESTRATÉGICA:
 * Business Intelligence & Value-Based Pricing Analytics
 * 
 * Funcionalidades:
 * 1. Cálculo de Custo de Oportunidade por processo
 * 2. Análise de ROI de Eficiência Automática
 * 3. Modelos de precificação baseados em valor
 * 4. Previsão de rentabilidade por caso
 * 5. Dashboards executivos de performance financeira
 * ============================================================================
 */

class ValueBasedPricingAnalytics {
    constructor() {
        this.feeModels = this.loadFeeModels();
        this.efficiencyMetrics = this.loadEfficiencyMetrics();
        this.roiHistory = this.loadROIHistory();
        this.opportunityCosts = this.loadOpportunityCosts();
        this.initialized = false;
        
        this.loadROIHistory();
        this.loadOpportunityCosts();
    }
    
    /**
     * Inicializa o módulo de pricing analytics
     */
    initialize() {
        this.initialized = true;
        console.log('[ELITE] Value-Based Pricing Analytics inicializado - Análise de ROI Estratégico');
        return this;
    }
    
    /**
     * Carrega modelos de precificação
     */
    loadFeeModels() {
        return {
            hourly: {
                name: 'Honorários por Hora',
                baseRate: 250,
                multiplier: 1.0,
                applicableCases: ['all'],
                complexityMultiplier: {
                    low: 1.0,
                    medium: 1.3,
                    high: 1.8,
                    critical: 2.5
                },
                description: 'Modelo tradicional baseado em horas efetivamente trabalhadas'
            },
            fixed: {
                name: 'Honorários Fixos',
                baseRate: 5000,
                multiplier: 1.0,
                applicableCases: ['standard', 'predictable'],
                complexityMultiplier: {
                    low: 0.8,
                    medium: 1.2,
                    high: 1.6,
                    critical: 2.0
                },
                description: 'Valor fixo por fase processual ou por caso'
            },
            contingency: {
                name: 'Honorários de Êxito',
                baseRate: 0.20,
                multiplier: 1.0,
                applicableCases: ['high_value', 'favorable_odds'],
                complexityMultiplier: {
                    low: 0.15,
                    medium: 0.20,
                    high: 0.25,
                    critical: 0.30
                },
                description: 'Percentual sobre o valor recuperado (20-30%)'
            },
            hybrid: {
                name: 'Modelo Híbrido',
                baseRate: 3000,
                multiplier: 0.12,
                applicableCases: ['complex', 'uncertain'],
                complexityMultiplier: {
                    low: 0.08,
                    medium: 0.12,
                    high: 0.18,
                    critical: 0.25
                },
                description: 'Parte fixa + percentual sobre êxito'
            },
            valueBased: {
                name: 'Precificação Baseada em Valor',
                baseRate: 0,
                multiplier: 0,
                applicableCases: ['strategic', 'high_impact'],
                complexityMultiplier: {
                    low: 1.0,
                    medium: 1.5,
                    high: 2.2,
                    critical: 3.0
                },
                description: 'Valor baseado no benefício económico para o cliente'
            }
        };
    }
    
    /**
     * Carrega métricas de eficiência
     */
    loadEfficiencyMetrics() {
        return {
            industryAverages: {
                hourlyRate: 220,
                avgHoursPerCase: 45,
                successRate: 0.65,
                costPerHour: 85
            },
            benchmarks: {
                topQuartile: {
                    successRate: 0.82,
                    avgResolutionDays: 95,
                    clientSatisfaction: 92
                },
                median: {
                    successRate: 0.68,
                    avgResolutionDays: 135,
                    clientSatisfaction: 78
                },
                bottomQuartile: {
                    successRate: 0.52,
                    avgResolutionDays: 180,
                    clientSatisfaction: 62
                }
            },
            efficiencyFactors: {
                digitalEvidence: 0.15,
                specializedTeam: 0.12,
                aiAssisted: 0.20,
                precedentResearch: 0.08,
                templateAutomation: 0.10
            }
        };
    }
    
    /**
     * Carrega histórico de ROI
     */
    loadROIHistory() {
        const stored = localStorage.getItem('elite_roi_history');
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                console.error('[ELITE] Erro ao carregar histórico de ROI:', e);
                return [];
            }
        }
        return [];
    }
    
    /**
     * Carrega custos de oportunidade
     */
    loadOpportunityCosts() {
        const stored = localStorage.getItem('elite_opportunity_costs');
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                console.error('[ELITE] Erro ao carregar custos de oportunidade:', e);
                return {};
            }
        }
        return {
            capitalCost: 0.08,
            alternativeInvestment: 0.12,
            marketRate: 0.10
        };
    }
    
    /**
     * Salva histórico de ROI
     */
    saveROIHistory() {
        if (this.roiHistory.length > 500) {
            this.roiHistory = this.roiHistory.slice(0, 500);
        }
        localStorage.setItem('elite_roi_history', JSON.stringify(this.roiHistory));
    }
    
    /**
     * Salva custos de oportunidade
     */
    saveOpportunityCosts() {
        localStorage.setItem('elite_opportunity_costs', JSON.stringify(this.opportunityCosts));
    }
    
    /**
     * Calcula Custo de Oportunidade para um processo
     * @param {Object} caseData - Dados do processo
     * @returns {Object} Análise de custo de oportunidade
     */
    calculateOpportunityCost(caseData) {
        const caseValue = caseData.value || 0;
        const expectedDuration = caseData.expectedDuration || 180;
        const successProbability = caseData.successProbability || 0.65;
        
        // Custo de capital imobilizado
        const capitalCostRate = this.opportunityCosts.capitalCost || 0.08;
        const capitalCost = caseValue * capitalCostRate * (expectedDuration / 365);
        
        // Custo de oportunidade de investimento alternativo
        const alternativeRate = this.opportunityCosts.alternativeInvestment || 0.12;
        const alternativeReturn = caseValue * alternativeRate * (expectedDuration / 365);
        
        // Custo de oportunidade de recursos humanos
        const resourceCost = this.calculateResourceOpportunityCost(caseData);
        
        // Custo de oportunidade total
        const totalOpportunityCost = capitalCost + alternativeReturn + resourceCost;
        
        // Custo de oportunidade ajustado pela probabilidade
        const riskAdjustedCost = totalOpportunityCost * (1 - successProbability);
        
        return {
            capitalCost: capitalCost,
            capitalCostFormatted: this.formatCurrency(capitalCost),
            alternativeReturn: alternativeReturn,
            alternativeReturnFormatted: this.formatCurrency(alternativeReturn),
            resourceCost: resourceCost,
            resourceCostFormatted: this.formatCurrency(resourceCost),
            totalOpportunityCost: totalOpportunityCost,
            totalOpportunityCostFormatted: this.formatCurrency(totalOpportunityCost),
            riskAdjustedCost: riskAdjustedCost,
            riskAdjustedCostFormatted: this.formatCurrency(riskAdjustedCost),
            percentageOfValue: ((totalOpportunityCost / caseValue) * 100).toFixed(1) + '%',
            recommendation: totalOpportunityCost > caseValue * 0.2 
                ? 'Custo de oportunidade elevado - acelerar resolução'
                : 'Custo de oportunidade dentro do esperado'
        };
    }
    
    /**
     * Calcula custo de oportunidade de recursos humanos
     */
    calculateResourceOpportunityCost(caseData) {
        const hoursSpent = caseData.hoursSpent || 0;
        const resourceLevel = caseData.resourceLevel || 'senior';
        
        const hourlyRates = {
            senior: 180,
            associate: 120,
            junior: 80,
            partner: 250
        };
        
        const rate = hourlyRates[resourceLevel] || 150;
        const resourceCost = hoursSpent * rate;
        
        // Custo de oportunidade por alocação de recursos
        const allocationCost = resourceCost * 0.15;
        
        return resourceCost + allocationCost;
    }
    
    /**
     * Calcula ROI de Eficiência Automática
     * @param {Object} caseData - Dados do processo
     * @param {Object} efficiencyGains - Ganhos de eficiência
     * @returns {Object} Análise de ROI
     */
    calculateEfficiencyROI(caseData, efficiencyGains = {}) {
        const traditionalHours = caseData.estimatedHours || 120;
        const actualHours = caseData.actualHours || traditionalHours * 0.7;
        
        // Calcular ganhos de eficiência
        const hoursSaved = traditionalHours - actualHours;
        const hourlyRate = this.feeModels.hourly.baseRate;
        const directSavings = hoursSaved * hourlyRate;
        
        // Aplicar fatores de eficiência
        let efficiencyMultiplier = 1.0;
        if (efficiencyGains.digitalEvidence) efficiencyMultiplier += this.efficiencyMetrics.efficiencyFactors.digitalEvidence;
        if (efficiencyGains.specializedTeam) efficiencyMultiplier += this.efficiencyMetrics.efficiencyFactors.specializedTeam;
        if (efficiencyGains.aiAssisted) efficiencyMultiplier += this.efficiencyMetrics.efficiencyFactors.aiAssisted;
        if (efficiencyGains.precedentResearch) efficiencyMultiplier += this.efficiencyMetrics.efficiencyFactors.precedentResearch;
        if (efficiencyGains.templateAutomation) efficiencyMultiplier += this.efficiencyMetrics.efficiencyFactors.templateAutomation;
        
        const adjustedSavings = directSavings * efficiencyMultiplier;
        
        // Custo da implementação da eficiência
        const implementationCost = this.calculateImplementationCost(efficiencyGains);
        
        // ROI
        const netBenefit = adjustedSavings - implementationCost;
        const roi = implementationCost > 0 ? (netBenefit / implementationCost) * 100 : 100;
        
        // Payback period
        const monthlyBenefit = netBenefit / (caseData.expectedDuration / 30);
        const paybackMonths = monthlyBenefit > 0 ? (implementationCost / monthlyBenefit) : 0;
        
        const result = {
            traditionalHours: traditionalHours,
            actualHours: actualHours,
            hoursSaved: hoursSaved,
            directSavings: directSavings,
            directSavingsFormatted: this.formatCurrency(directSavings),
            efficiencyMultiplier: efficiencyMultiplier.toFixed(2),
            adjustedSavings: adjustedSavings,
            adjustedSavingsFormatted: this.formatCurrency(adjustedSavings),
            implementationCost: implementationCost,
            implementationCostFormatted: this.formatCurrency(implementationCost),
            netBenefit: netBenefit,
            netBenefitFormatted: this.formatCurrency(netBenefit),
            roi: roi.toFixed(1),
            roiClassification: roi > 200 ? 'Excelente' : roi > 100 ? 'Bom' : roi > 50 ? 'Moderado' : 'Baixo',
            paybackMonths: paybackMonths.toFixed(1),
            recommendation: roi > 100 ? 'Investimento em eficiência altamente recomendado' :
                           roi > 50 ? 'Investimento recomendado' :
                           'Avaliar viabilidade do investimento'
        };
        
        // Registrar no histórico
        this.roiHistory.unshift({
            caseId: caseData.id,
            timestamp: new Date().toISOString(),
            efficiencyGains: efficiencyGains,
            result: result
        });
        this.saveROIHistory();
        
        return result;
    }
    
    /**
     * Calcula custo de implementação da eficiência
     */
    calculateImplementationCost(efficiencyGains) {
        let cost = 0;
        
        if (efficiencyGains.digitalEvidence) cost += 2500;
        if (efficiencyGains.specializedTeam) cost += 5000;
        if (efficiencyGains.aiAssisted) cost += 8000;
        if (efficiencyGains.precedentResearch) cost += 1500;
        if (efficiencyGains.templateAutomation) cost += 2000;
        
        return cost;
    }
    
    /**
     * Otimiza modelo de precificação para um caso
     * @param {Object} caseData - Dados do processo
     * @returns {Object} Recomendação de modelo de precificação
     */
    optimizePricing(caseData) {
        const caseValue = caseData.value || 0;
        const successProbability = caseData.successProbability || 0.65;
        const complexity = caseData.complexity || 'medium';
        const expectedHours = caseData.estimatedHours || 80;
        
        const models = [];
        
        // Calcular cada modelo
        for (const [key, model] of Object.entries(this.feeModels)) {
            let fee = 0;
            let value = 0;
            
            switch(key) {
                case 'hourly':
                    fee = expectedHours * model.baseRate;
                    fee *= model.complexityMultiplier[complexity];
                    value = fee;
                    break;
                case 'fixed':
                    fee = model.baseRate;
                    fee *= model.complexityMultiplier[complexity];
                    value = fee;
                    break;
                case 'contingency':
                    fee = caseValue * model.baseRate;
                    fee *= model.complexityMultiplier[complexity];
                    value = fee * successProbability;
                    break;
                case 'hybrid':
                    const fixedPart = model.baseRate;
                    const variablePart = caseValue * model.multiplier;
                    fee = fixedPart + variablePart;
                    fee *= model.complexityMultiplier[complexity];
                    value = fixedPart + (variablePart * successProbability);
                    break;
                case 'valueBased':
                    const valueMultiplier = this.calculateValueMultiplier(caseData);
                    fee = caseValue * 0.15 * valueMultiplier;
                    fee *= model.complexityMultiplier[complexity];
                    value = fee * successProbability;
                    break;
            }
            
            // Calcular ROI para o cliente
            const clientROI = caseValue > 0 ? ((caseValue - fee) / fee) * 100 : 0;
            
            models.push({
                id: key,
                name: model.name,
                description: model.description,
                fee: Math.round(fee),
                feeFormatted: this.formatCurrency(fee),
                expectedValue: Math.round(value),
                expectedValueFormatted: this.formatCurrency(value),
                clientROI: clientROI.toFixed(1),
                clientROIFormatted: clientROI.toFixed(1) + '%',
                riskProfile: key === 'hourly' ? 'Baixo (cliente)' : 
                            key === 'fixed' ? 'Moderado' :
                            key === 'contingency' ? 'Alto (escritório)' :
                            key === 'hybrid' ? 'Equilibrado' : 'Personalizado',
                recommendation: this.getPricingRecommendation(key, clientROI, successProbability)
            });
        }
        
        // Ordenar por valor esperado
        models.sort((a, b) => b.expectedValue - a.expectedValue);
        
        // Identificar modelo ótimo
        const optimalModel = models[0];
        
        // Calcular custo de oportunidade
        const opportunityCost = this.calculateOpportunityCost(caseData);
        
        return {
            caseId: caseData.id,
            caseValue: caseValue,
            caseValueFormatted: this.formatCurrency(caseValue),
            successProbability: successProbability,
            successProbabilityPercent: (successProbability * 100).toFixed(1) + '%',
            complexity: complexity,
            expectedHours: expectedHours,
            models: models,
            optimalModel: optimalModel,
            opportunityCost: opportunityCost,
            recommendation: this.generatePricingStrategy(optimalModel, caseData, opportunityCost),
            competitiveAnalysis: this.analyzeCompetitivePricing(caseData)
        };
    }
    
    /**
     * Calcula multiplicador de valor baseado no caso
     */
    calculateValueMultiplier(caseData) {
        let multiplier = 1.0;
        
        // Fator de impacto estratégico
        if (caseData.strategicImportance) multiplier += 0.5;
        
        // Fator de precedente
        if (caseData.precedentValue) multiplier += 0.3;
        
        // Fator de visibilidade
        if (caseData.highVisibility) multiplier += 0.4;
        
        // Fator de inovação
        if (caseData.innovative) multiplier += 0.2;
        
        return Math.min(multiplier, 2.5);
    }
    
    /**
     * Obtém recomendação de precificação
     */
    getPricingRecommendation(modelId, clientROI, successProbability) {
        if (modelId === 'contingency' && successProbability > 0.7) {
            return 'Recomendado para casos com alta probabilidade de êxito';
        }
        if (modelId === 'hourly' && clientROI < 50) {
            return 'Recomendado quando o ROI é inferior a 50%';
        }
        if (modelId === 'fixed' && clientROI > 100) {
            return 'Excelente opção quando o ROI é superior a 100%';
        }
        if (modelId === 'hybrid') {
            return 'Bom equilíbrio entre risco e retorno';
        }
        if (modelId === 'valueBased') {
            return 'Ideal para casos de alto valor estratégico';
        }
        return 'Modelo viável dependendo do perfil de risco do cliente';
    }
    
    /**
     * Gera estratégia de precificação
     */
    generatePricingStrategy(optimalModel, caseData, opportunityCost) {
        const strategy = {
            recommendedModel: optimalModel.name,
            rationale: '',
            negotiationLevers: [],
            targetFee: optimalModel.fee,
            targetFeeFormatted: this.formatCurrency(optimalModel.fee),
            minimumAcceptable: Math.round(optimalModel.fee * 0.8),
            minimumAcceptableFormatted: this.formatCurrency(optimalModel.fee * 0.8),
            expectedValue: optimalModel.expectedValue,
            expectedValueFormatted: this.formatCurrency(optimalModel.expectedValue)
        };
        
        if (optimalModel.id === 'valueBased') {
            strategy.rationale = 'O caso tem alto valor estratégico, justificando precificação baseada em valor';
            strategy.negotiationLevers = ['Valor estratégico do caso', 'Precedente jurisprudencial', 'Visibilidade do caso'];
        } else if (optimalModel.id === 'contingency') {
            strategy.rationale = `Alta probabilidade de sucesso (${(caseData.successProbability * 100).toFixed(0)}%) justifica modelo de contingência`;
            strategy.negotiationLevers = ['Percentual de êxito', 'Valor mínimo garantido', 'Bónus por performance superior'];
        } else if (optimalModel.id === 'hybrid') {
            strategy.rationale = 'Equilíbrio entre risco do cliente e retorno do escritório';
            strategy.negotiationLevers = ['Parte fixa', 'Percentual variável', 'Escalonamento por fase'];
        } else {
            strategy.rationale = 'Modelo tradicional com previsibilidade para o cliente';
            strategy.negotiationLevers = ['Desconto por volume', 'Pacote de serviços', 'Condições de pagamento'];
        }
        
        if (opportunityCost.totalOpportunityCost > caseData.value * 0.15) {
            strategy.rationale += '. Custo de oportunidade elevado recomenda acelerar resolução.';
            strategy.negotiationLevers.push('Priorização do caso');
        }
        
        return strategy;
    }
    
    /**
     * Analisa precificação competitiva
     */
    analyzeCompetitivePricing(caseData) {
        const marketAverage = this.efficiencyMetrics.industryAverages;
        const caseComplexity = caseData.complexity || 'medium';
        
        const complexityMultipliers = {
            low: 0.8,
            medium: 1.0,
            high: 1.4,
            critical: 2.0
        };
        
        const multiplier = complexityMultipliers[caseComplexity] || 1.0;
        
        const competitiveAnalysis = {
            marketAverageHourly: marketAverage.hourlyRate * multiplier,
            marketAverageHourlyFormatted: this.formatCurrency(marketAverage.hourlyRate * multiplier),
            topQuartileHourly: (marketAverage.hourlyRate * 1.3) * multiplier,
            topQuartileHourlyFormatted: this.formatCurrency((marketAverage.hourlyRate * 1.3) * multiplier),
            marketAverageSuccessRate: (marketAverage.successRate * 100).toFixed(0) + '%',
            topQuartileSuccessRate: this.efficiencyMetrics.benchmarks.topQuartile.successRate * 100 + '%',
            positioning: caseData.successProbability > this.efficiencyMetrics.benchmarks.topQuartile.successRate 
                ? 'Acima do mercado' 
                : caseData.successProbability > marketAverage.successRate 
                ? 'Em linha com mercado' 
                : 'Abaixo do mercado',
            competitiveAdvantage: caseData.successProbability > this.efficiencyMetrics.benchmarks.topQuartile.successRate
                ? 'Alta performance justifica prémio de 15-20%'
                : caseData.successProbability > marketAverage.successRate
                ? 'Performance sólida permite posicionamento competitivo'
                : 'Necessário reforçar diferenciais para justificar preço'
        };
        
        return competitiveAnalysis;
    }
    
    /**
     * Calcula ROI total da carteira
     */
    calculatePortfolioROI(cases) {
        if (!cases || cases.length === 0) return null;
        
        let totalValue = 0;
        let totalFees = 0;
        let totalOpportunityCost = 0;
        let totalEfficiencyGain = 0;
        
        for (const caseData of cases) {
            totalValue += caseData.value || 0;
            
            const pricing = this.optimizePricing(caseData);
            totalFees += pricing.optimalModel.fee;
            
            const opportunityCost = this.calculateOpportunityCost(caseData);
            totalOpportunityCost += opportunityCost.totalOpportunityCost;
            
            const efficiencyROI = this.calculateEfficiencyROI(caseData);
            totalEfficiencyGain += efficiencyROI.netBenefit;
        }
        
        const totalROI = totalFees > 0 ? ((totalValue - totalFees) / totalFees) * 100 : 0;
        const efficiencyImpact = totalEfficiencyGain / totalFees * 100;
        
        return {
            totalCases: cases.length,
            totalValue: totalValue,
            totalValueFormatted: this.formatCurrency(totalValue),
            totalFees: totalFees,
            totalFeesFormatted: this.formatCurrency(totalFees),
            totalOpportunityCost: totalOpportunityCost,
            totalOpportunityCostFormatted: this.formatCurrency(totalOpportunityCost),
            totalEfficiencyGain: totalEfficiencyGain,
            totalEfficiencyGainFormatted: this.formatCurrency(totalEfficiencyGain),
            totalROI: totalROI.toFixed(1),
            totalROIFormatted: totalROI.toFixed(1) + '%',
            efficiencyImpact: efficiencyImpact.toFixed(1) + '%',
            averageFeePerCase: totalFees / cases.length,
            averageFeePerCaseFormatted: this.formatCurrency(totalFees / cases.length),
            averageValuePerCase: totalValue / cases.length,
            averageValuePerCaseFormatted: this.formatCurrency(totalValue / cases.length),
            portfolioEfficiency: this.classifyPortfolioEfficiency(totalROI, efficiencyImpact)
        };
    }
    
    /**
     * Classifica eficiência da carteira
     */
    classifyPortfolioEfficiency(roi, efficiencyImpact) {
        if (roi > 200 && efficiencyImpact > 30) return 'Excelente';
        if (roi > 100 && efficiencyImpact > 20) return 'Bom';
        if (roi > 50 && efficiencyImpact > 10) return 'Moderado';
        return 'Necessita Melhoria';
    }
    
    /**
     * Formata moeda
     */
    formatCurrency(value) {
        if (value === null || value === undefined) return '€0';
        if (Math.abs(value) >= 1000000) {
            return new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
        }
        return new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
    }
    
    /**
     * Gera relatório executivo de pricing
     */
    generateExecutiveReport(cases) {
        const portfolioROI = this.calculatePortfolioROI(cases);
        const opportunities = [];
        
        for (const caseData of cases) {
            const pricing = this.optimizePricing(caseData);
            if (pricing.optimalModel.id === 'valueBased' && caseData.successProbability > 0.75) {
                opportunities.push({
                    caseId: caseData.id,
                    client: caseData.client,
                    value: caseData.value,
                    recommendedModel: pricing.optimalModel.name,
                    expectedFee: pricing.optimalModel.fee,
                    expectedFeeFormatted: this.formatCurrency(pricing.optimalModel.fee)
                });
            }
        }
        
        return {
            generatedAt: new Date().toISOString(),
            generatedAtFormatted: new Date().toLocaleString('pt-PT'),
            portfolioAnalysis: portfolioROI,
            opportunities: opportunities.slice(0, 5),
            recommendations: this.generatePricingRecommendations(portfolioROI, opportunities),
            benchmarks: this.efficiencyMetrics.benchmarks,
            industryAverages: this.efficiencyMetrics.industryAverages
        };
    }
    
    /**
     * Gera recomendações de pricing
     */
    generatePricingRecommendations(portfolioROI, opportunities) {
        const recommendations = [];
        
        if (portfolioROI && portfolioROI.totalROI < 100) {
            recommendations.push({
                area: 'Estratégia de Precificação',
                action: 'Revisar modelos de precificação para casos de menor rentabilidade',
                priority: 'Alta',
                expectedImpact: 'Aumento de 15-20% na rentabilidade média'
            });
        }
        
        if (opportunities.length > 0) {
            recommendations.push({
                area: 'Oportunidades de Valor',
                action: `Aplicar modelo Value-Based em ${opportunities.length} casos identificados`,
                priority: 'Média',
                expectedImpact: `Potencial de aumento de receita em ${this.formatCurrency(opportunities.reduce((sum, o) => sum + o.expectedFee, 0) * 0.2)}`
            });
        }
        
        if (portfolioROI && portfolioROI.efficiencyImpact < 15) {
            recommendations.push({
                area: 'Eficiência Operacional',
                action: 'Implementar automações e ferramentas de IA para ganhos de eficiência',
                priority: 'Alta',
                expectedImpact: 'Redução de 20-25% em horas alocadas'
            });
        }
        
        return recommendations;
    }
    
    /**
     * Renderiza dashboard de pricing analytics
     */
    renderDashboard(containerId, caseData) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const pricing = this.optimizePricing(caseData);
        const opportunityCost = this.calculateOpportunityCost(caseData);
        const efficiencyROI = this.calculateEfficiencyROI(caseData);
        
        container.innerHTML = `
            <div class="value-pricing-dashboard">
                <div class="dashboard-header">
                    <h2><i class="fas fa-chart-line"></i> VALUE-BASED PRICING ANALYTICS</h2>
                    <div class="roi-badge ${efficiencyROI.roi > 100 ? 'excellent' : efficiencyROI.roi > 50 ? 'good' : 'moderate'}">
                        ROI Eficiência: ${efficiencyROI.roi}%
                    </div>
                </div>
                
                <div class="pricing-models">
                    <h3><i class="fas fa-tags"></i> MODELOS DE PRECIFICAÇÃO</h3>
                    <div class="models-grid">
                        ${pricing.models.map(model => `
                            <div class="model-card ${model.id === pricing.optimalModel.id ? 'optimal' : ''}">
                                <div class="model-header">
                                    <strong>${model.name}</strong>
                                    ${model.id === pricing.optimalModel.id ? '<span class="optimal-badge">ÓTIMO</span>' : ''}
                                </div>
                                <div class="model-fee">${model.feeFormatted}</div>
                                <div class="model-value">Valor Esperado: ${model.expectedValueFormatted}</div>
                                <div class="model-roi">ROI Cliente: ${model.clientROIFormatted}</div>
                                <div class="model-risk">Perfil: ${model.riskProfile}</div>
                                <div class="model-recommendation">${model.recommendation}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="opportunity-analysis">
                    <h3><i class="fas fa-clock"></i> CUSTO DE OPORTUNIDADE</h3>
                    <div class="opportunity-grid">
                        <div class="opp-card">
                            <div class="opp-value">${opportunityCost.totalOpportunityCostFormatted}</div>
                            <div class="opp-label">Custo Total de Oportunidade</div>
                            <div class="opp-percent">${opportunityCost.percentageOfValue}</div>
                        </div>
                        <div class="opp-card">
                            <div class="opp-value">${opportunityCost.capitalCostFormatted}</div>
                            <div class="opp-label">Custo de Capital</div>
                        </div>
                        <div class="opp-card">
                            <div class="opp-value">${opportunityCost.alternativeReturnFormatted}</div>
                            <div class="opp-label">Retorno Alternativo Perdido</div>
                        </div>
                        <div class="opp-card">
                            <div class="opp-value">${opportunityCost.resourceCostFormatted}</div>
                            <div class="opp-label">Custo de Recursos</div>
                        </div>
                    </div>
                    <div class="opp-recommendation">
                        <i class="fas fa-lightbulb"></i> ${opportunityCost.recommendation}
                    </div>
                </div>
                
                <div class="efficiency-roi">
                    <h3><i class="fas fa-chart-simple"></i> ROI DE EFICIÊNCIA AUTOMÁTICA</h3>
                    <div class="roi-grid">
                        <div class="roi-card">
                            <div class="roi-value">${efficiencyROI.hoursSaved}</div>
                            <div class="roi-label">Horas Poupanças</div>
                        </div>
                        <div class="roi-card">
                            <div class="roi-value">${efficiencyROI.directSavingsFormatted}</div>
                            <div class="roi-label">Poupança Direta</div>
                        </div>
                        <div class="roi-card">
                            <div class="roi-value">${efficiencyROI.efficiencyMultiplier}x</div>
                            <div class="roi-label">Multiplicador de Eficiência</div>
                        </div>
                        <div class="roi-card">
                            <div class="roi-value">${efficiencyROI.netBenefitFormatted}</div>
                            <div class="roi-label">Benefício Líquido</div>
                        </div>
                    </div>
                    <div class="roi-details">
                        <div class="detail-item">
                            <span>Investimento:</span>
                            <strong>${efficiencyROI.implementationCostFormatted}</strong>
                        </div>
                        <div class="detail-item">
                            <span>Payback:</span>
                            <strong>${efficiencyROI.paybackMonths} meses</strong>
                        </div>
                        <div class="detail-item">
                            <span>Classificação:</span>
                            <strong class="roi-${efficiencyROI.roiClassification.toLowerCase()}">${efficiencyROI.roiClassification}</strong>
                        </div>
                    </div>
                    <div class="roi-recommendation">
                        <i class="fas ${efficiencyROI.roi > 100 ? 'fa-check-circle' : 'fa-info-circle'}"></i>
                        ${efficiencyROI.recommendation}
                    </div>
                </div>
                
                <div class="strategy-card">
                    <h3><i class="fas fa-chess"></i> ESTRATÉGIA RECOMENDADA</h3>
                    <div class="strategy-header">
                        <strong>${pricing.recommendation.recommendedModel}</strong>
                        <div class="target-fee">${pricing.recommendation.targetFeeFormatted}</div>
                    </div>
                    <p>${pricing.recommendation.rationale}</p>
                    <div class="negotiation-levers">
                        <strong>Alavancas de Negociação:</strong>
                        <ul>
                            ${pricing.recommendation.negotiationLevers.map(lever => `<li>${lever}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="fee-range">
                        <span>Mínimo Aceitável: ${pricing.recommendation.minimumAcceptableFormatted}</span>
                        <span>Alvo: ${pricing.recommendation.targetFeeFormatted}</span>
                        <span>Valor Esperado: ${pricing.recommendation.expectedValueFormatted}</span>
                    </div>
                </div>
                
                <div class="competitive-analysis">
                    <h3><i class="fas fa-chart-line"></i> ANÁLISE COMPETITIVA</h3>
                    <div class="comp-grid">
                        <div class="comp-card">
                            <div class="comp-label">Mercado Médio</div>
                            <div class="comp-value">${pricing.competitiveAnalysis.marketAverageHourlyFormatted}/h</div>
                        </div>
                        <div class="comp-card">
                            <div class="comp-label">Top Quartil</div>
                            <div class="comp-value">${pricing.competitiveAnalysis.topQuartileHourlyFormatted}/h</div>
                        </div>
                        <div class="comp-card">
                            <div class="comp-label">Taxa Sucesso Mercado</div>
                            <div class="comp-value">${pricing.competitiveAnalysis.marketAverageSuccessRate}</div>
                        </div>
                        <div class="comp-card">
                            <div class="comp-label">Posicionamento</div>
                            <div class="comp-value">${pricing.competitiveAnalysis.positioning}</div>
                        </div>
                    </div>
                    <div class="comp-advantage">
                        ${pricing.competitiveAnalysis.competitiveAdvantage}
                    </div>
                </div>
            </div>
        `;
        
        // Estilos adicionais
        const style = document.createElement('style');
        style.textContent = `
            .value-pricing-dashboard { padding: 0; }
            .roi-badge { padding: 4px 12px; border-radius: 20px; font-size: 0.7rem; font-weight: bold; }
            .roi-badge.excellent { background: rgba(0, 230, 118, 0.1); color: #00e676; border: 1px solid #00e676; }
            .roi-badge.good { background: rgba(0, 229, 255, 0.1); color: #00e5ff; border: 1px solid #00e5ff; }
            .roi-badge.moderate { background: rgba(255, 193, 7, 0.1); color: #ffc107; border: 1px solid #ffc107; }
            .models-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; margin: 20px 0; }
            .model-card { background: var(--bg-terminal); border-radius: 12px; padding: 16px; border: 1px solid var(--border-tactic); transition: all 0.2s; }
            .model-card.optimal { border: 2px solid var(--elite-success); background: linear-gradient(135deg, var(--bg-terminal), rgba(0, 230, 118, 0.05)); }
            .model-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
            .optimal-badge { background: var(--elite-success-dim); color: var(--elite-success); padding: 2px 8px; border-radius: 12px; font-size: 0.6rem; }
            .model-fee { font-size: 1.5rem; font-weight: bold; color: var(--elite-primary); margin: 8px 0; }
            .model-value, .model-roi, .model-risk { font-size: 0.7rem; color: #94a3b8; margin: 4px 0; }
            .model-recommendation { font-size: 0.65rem; color: #64748b; margin-top: 8px; padding-top: 8px; border-top: 1px solid var(--border-tactic); }
            .opportunity-grid, .roi-grid, .comp-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin: 16px 0; }
            .opp-card, .roi-card, .comp-card { background: var(--bg-command); border-radius: 12px; padding: 16px; text-align: center; }
            .opp-value, .roi-value, .comp-value { font-size: 1.2rem; font-weight: bold; color: var(--elite-primary); }
            .opp-label, .roi-label, .comp-label { font-size: 0.6rem; color: #94a3b8; margin-top: 4px; }
            .opp-percent { font-size: 0.7rem; color: var(--elite-success); margin-top: 8px; }
            .opp-recommendation, .roi-recommendation { background: var(--elite-primary-dim); padding: 12px; border-radius: 8px; margin-top: 12px; font-size: 0.75rem; display: flex; align-items: center; gap: 8px; }
            .roi-details { display: flex; justify-content: space-between; margin: 16px 0; padding: 12px; background: var(--bg-command); border-radius: 8px; font-size: 0.7rem; }
            .roi-excelente, .roi-bom { color: #00e676; }
            .roi-moderado { color: #ffc107; }
            .roi-baixo { color: #ff1744; }
            .strategy-card { background: var(--bg-command); border-radius: 16px; padding: 20px; margin: 20px 0; }
            .strategy-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
            .target-fee { font-size: 1.5rem; font-weight: bold; color: var(--elite-success); }
            .negotiation-levers ul { margin: 8px 0 0 20px; font-size: 0.75rem; color: #94a3b8; }
            .fee-range { display: flex; justify-content: space-between; margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--border-tactic); font-size: 0.7rem; }
            .comp-advantage { margin-top: 12px; padding: 12px; background: var(--elite-primary-dim); border-radius: 8px; font-size: 0.75rem; }
            @media (max-width: 768px) {
                .models-grid { grid-template-columns: 1fr; }
                .opportunity-grid, .roi-grid, .comp-grid { grid-template-columns: 1fr 1fr; }
                .fee-range { flex-direction: column; gap: 8px; }
            }
        `;
        container.appendChild(style);
    }
}

// Instância global - mantendo compatibilidade com nome antigo
window.FeeOptimizer = new ValueBasedPricingAnalytics();
window.ValueBasedPricingAnalytics = window.FeeOptimizer;

console.log('[ELITE] Value-Based Pricing Analytics carregado - Análise de ROI Estratégico');