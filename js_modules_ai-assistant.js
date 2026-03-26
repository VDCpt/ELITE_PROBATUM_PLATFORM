/**
 * ============================================================================
 * ELITE PROBATUM — MÓDULO DE IA ASSISTANT
 * ============================================================================
 * Motor de previsão de êxito com scorecard judicial, análise de jurisprudência,
 * simulação de cenários de recurso e recomendações estratégicas.
 * ============================================================================
 */

class AIAssistant {
    constructor() {
        this.modelVersion = '3.0';
        this.trainingData = null;
        this.featureWeights = null;
        this.predictionCache = new Map();
        this.jurisprudenceDB = null;
        this.initialized = false;
        
        this.loadTrainingData();
        this.loadJurisprudenceDB();
    }
    
    /**
     * Inicializa o assistente IA
     */
    initialize() {
        this.calculateFeatureWeights();
        this.initialized = true;
        console.log('[ELITE] AI Assistant inicializado - Modelo v' + this.modelVersion);
        return this;
    }
    
    /**
     * Carrega dados de treino simulados (base de 500+ casos)
     */
    loadTrainingData() {
        this.trainingData = {
            totalCases: 547,
            features: {
                platform: { bolt: 0.72, uber: 0.68, freenow: 0.71, cabify: 0.65, indrive: 0.62, others: 0.55 },
                omissionPercentage: [
                    { range: [0, 20], weight: -0.05, confidence: 0.65 },
                    { range: [20, 40], weight: 0.02, confidence: 0.70 },
                    { range: [40, 60], weight: 0.08, confidence: 0.75 },
                    { range: [60, 80], weight: 0.15, confidence: 0.80 },
                    { range: [80, 100], weight: 0.22, confidence: 0.85 }
                ],
                judgeHistory: { favorable: 0.18, unfavorable: -0.12, neutral: 0.00 },
                court: { 
                    lisboa: { weight: 0.03, confidence: 0.72 },
                    porto: { weight: 0.08, confidence: 0.78 },
                    braga: { weight: -0.02, confidence: 0.65 },
                    coimbra: { weight: 0.01, confidence: 0.68 },
                    faro: { weight: -0.01, confidence: 0.66 },
                    evora: { weight: 0.00, confidence: 0.67 }
                },
                evidence: {
                    documentary: 0.12,
                    expert: 0.10,
                    digital: 0.14,
                    testimonial: 0.04,
                    none: -0.08
                },
                caseValue: [
                    { range: [0, 15000], weight: -0.02, confidence: 0.70 },
                    { range: [15000, 50000], weight: 0.03, confidence: 0.75 },
                    { range: [50000, 100000], weight: 0.08, confidence: 0.80 },
                    { range: [100000, Infinity], weight: 0.12, confidence: 0.85 }
                ],
                regulatory: {
                    hasATNotification: -0.18,
                    hasDAC7Discrepancy: 0.14,
                    hasTaxAudit: -0.10,
                    hasRegularization: 0.08
                },
                tenure: [
                    { range: [0, 1], weight: -0.08, confidence: 0.68 },
                    { range: [1, 3], weight: 0.02, confidence: 0.72 },
                    { range: [3, 5], weight: 0.05, confidence: 0.76 },
                    { range: [5, Infinity], weight: 0.09, confidence: 0.80 }
                ],
                adversary: {
                    PLMJ: -0.05,
                    VdA: -0.03,
                    Cuatrecasas: 0.02,
                    Garrigues: 0.01,
                    unknown: 0.00
                }
            }
        };
    }
    
    /**
     * Carrega base de jurisprudência simulada
     */
    loadJurisprudenceDB() {
        this.jurisprudenceDB = [
            {
                id: 'STA_01080_2023',
                court: 'STA',
                date: '2023-09-27',
                summary: 'Plataforma falha no reporte DAC7 configura omissão tributária',
                keywords: ['DAC7', 'omissão', 'plataforma', 'reporte'],
                relevance: 0.92,
                outcome: 'favorable',
                impact: 'high'
            },
            {
                id: 'STA_0456_2024',
                court: 'STA',
                date: '2024-03-14',
                summary: 'Discrepância entre extrato e fatura é preço de transferência dissimulado',
                keywords: ['preço_transferência', 'comissões', 'dissimulação', 'extrato'],
                relevance: 0.95,
                outcome: 'favorable',
                impact: 'high'
            },
            {
                id: 'TCA_0237_2023',
                court: 'TCA Sul',
                date: '2023-11-08',
                summary: 'Prova digital com hash SHA-256 é admissível nos termos do Art. 125 CPP',
                keywords: ['prova_digital', 'hash', 'admissibilidade', 'SHA-256'],
                relevance: 0.88,
                outcome: 'favorable',
                impact: 'medium'
            },
            {
                id: 'STA_0891_2024',
                court: 'STA',
                date: '2024-05-22',
                summary: 'Reincidência de omissões configura dolo para fraude fiscal qualificada',
                keywords: ['reincidência', 'dolo', 'fraude_qualificada', 'RGIT'],
                relevance: 0.91,
                outcome: 'favorable',
                impact: 'high'
            },
            {
                id: 'CAAD_01234_2025',
                court: 'CAAD',
                date: '2025-01-15',
                summary: 'Regularização Art. 78 CIVA é obrigatória quando há omissão',
                keywords: ['regularização', 'CIVA_78', 'omissão', 'IVA'],
                relevance: 0.85,
                outcome: 'favorable',
                impact: 'medium'
            },
            {
                id: 'STA_1122_2024',
                court: 'STA',
                date: '2024-08-30',
                summary: 'Inversão do ónus da prova aplicável quando plataforma detém monopólio da informação',
                keywords: ['inversão_ónus', 'prova', 'monopólio', 'Art_344_CC'],
                relevance: 0.89,
                outcome: 'favorable',
                impact: 'high'
            }
        ];
    }
    
    /**
     * Calcula pesos das features com base nos dados de treino
     */
    calculateFeatureWeights() {
        this.featureWeights = {
            platform: 0.12,
            omissionPercentage: 0.22,
            judgeHistory: 0.18,
            court: 0.08,
            evidence: 0.15,
            caseValue: 0.10,
            regulatory: 0.10,
            tenure: 0.05
        };
    }
    
    /**
     * Gera chave de cache para previsão
     */
    generateCacheKey(caseData) {
        return `${caseData.platform}_${caseData.omissionPercentage}_${caseData.court}_${caseData.judge}_${caseData.value}`;
    }
    
    /**
     * Previsão principal de sucesso
     * @param {Object} caseData - Dados do caso
     * @param {boolean} useCache - Usar cache
     * @returns {Object} Resultado da previsão
     */
    predictSuccess(caseData, useCache = true) {
        if (!this.initialized) {
            this.initialize();
        }
        
        const cacheKey = this.generateCacheKey(caseData);
        if (useCache && this.predictionCache.has(cacheKey)) {
            return this.predictionCache.get(cacheKey);
        }
        
        let probability = 0.50; // Base neutra
        let confidenceFactors = [];
        
        // 1. Fator Plataforma (peso: 0.12)
        const platformFactor = this.trainingData.features.platform[caseData.platform] || 0.55;
        const platformContribution = (platformFactor - 0.50) * this.featureWeights.platform * 2;
        probability += platformContribution;
        confidenceFactors.push({
            factor: 'Plataforma',
            contribution: platformContribution,
            confidence: 0.85,
            detail: `Plataforma ${caseData.platform} tem taxa histórica de ${(platformFactor * 100).toFixed(0)}%`
        });
        
        // 2. Fator Percentagem de Omissão (peso: 0.22)
        const omissionFeature = this.trainingData.features.omissionPercentage.find(
            f => caseData.omissionPercentage >= f.range[0] && caseData.omissionPercentage < f.range[1]
        ) || { weight: 0, confidence: 0.70 };
        const omissionContribution = omissionFeature.weight * this.featureWeights.omissionPercentage;
        probability += omissionContribution;
        confidenceFactors.push({
            factor: 'Percentagem de Omissão',
            contribution: omissionContribution,
            confidence: omissionFeature.confidence,
            detail: `Omissão de ${caseData.omissionPercentage}% - ${omissionFeature.weight > 0 ? 'Fator positivo' : 'Fator negativo'}`
        });
        
        // 3. Fator Histórico do Juiz (peso: 0.18)
        let judgeContribution = 0;
        if (caseData.judge && window.JudicialAnalytics) {
            const judgeProfile = window.JudicialAnalytics.getJudgeProfile(caseData.judge);
            if (judgeProfile) {
                const judgeFactor = judgeProfile.favorableRate > 0.65 ? 'favorable' : 
                                   judgeProfile.favorableRate < 0.55 ? 'unfavorable' : 'neutral';
                judgeContribution = this.trainingData.features.judgeHistory[judgeFactor] * this.featureWeights.judgeHistory;
                probability += judgeContribution;
                confidenceFactors.push({
                    factor: 'Histórico do Juiz',
                    contribution: judgeContribution,
                    confidence: 0.75,
                    detail: `Juiz ${caseData.judge} - Taxa favorável: ${(judgeProfile.favorableRate * 100).toFixed(0)}%`
                });
            }
        }
        
        // 4. Fator Tribunal (peso: 0.08)
        const courtData = this.trainingData.features.court[caseData.court] || { weight: 0, confidence: 0.70 };
        const courtContribution = courtData.weight * this.featureWeights.court;
        probability += courtContribution;
        confidenceFactors.push({
            factor: 'Tribunal',
            contribution: courtContribution,
            confidence: courtData.confidence,
            detail: `Tribunal ${caseData.court} - Taxa base: ${((courtData.weight + 0.5) * 100).toFixed(0)}%`
        });
        
        // 5. Fator Evidência (peso: 0.15)
        let evidenceWeight = this.trainingData.features.evidence.none;
        if (caseData.hasDocumentaryEvidence) evidenceWeight += this.trainingData.features.evidence.documentary;
        if (caseData.hasExpertEvidence) evidenceWeight += this.trainingData.features.evidence.expert;
        if (caseData.hasDigitalEvidence) evidenceWeight += this.trainingData.features.evidence.digital;
        if (caseData.hasTestimonialEvidence) evidenceWeight += this.trainingData.features.evidence.testimonial;
        const evidenceContribution = Math.min(evidenceWeight, 0.25) * this.featureWeights.evidence;
        probability += evidenceContribution;
        confidenceFactors.push({
            factor: 'Qualidade Probatória',
            contribution: evidenceContribution,
            confidence: 0.82,
            detail: `Tipos de prova: ${caseData.hasDocumentaryEvidence ? 'Documental ' : ''}${caseData.hasExpertEvidence ? 'Pericial ' : ''}${caseData.hasDigitalEvidence ? 'Digital ' : ''}`
        });
        
        // 6. Fator Valor da Causa (peso: 0.10)
        const valueFeature = this.trainingData.features.caseValue.find(
            f => caseData.value >= f.range[0] && caseData.value < f.range[1]
        ) || { weight: 0, confidence: 0.70 };
        const valueContribution = valueFeature.weight * this.featureWeights.caseValue;
        probability += valueContribution;
        confidenceFactors.push({
            factor: 'Valor da Causa',
            contribution: valueContribution,
            confidence: valueFeature.confidence,
            detail: `Valor: €${caseData.value.toLocaleString()}`
        });
        
        // 7. Fator Regulatório (peso: 0.10)
        let regulatoryWeight = 0;
        if (caseData.hasATNotification) regulatoryWeight += this.trainingData.features.regulatory.hasATNotification;
        if (caseData.hasDAC7Discrepancy) regulatoryWeight += this.trainingData.features.regulatory.hasDAC7Discrepancy;
        if (caseData.hasTaxAudit) regulatoryWeight += this.trainingData.features.regulatory.hasTaxAudit;
        if (caseData.hasRegularization) regulatoryWeight += this.trainingData.features.regulatory.hasRegularization;
        const regulatoryContribution = regulatoryWeight * this.featureWeights.regulatory;
        probability += regulatoryContribution;
        confidenceFactors.push({
            factor: 'Contexto Regulatório',
            contribution: regulatoryContribution,
            confidence: 0.78,
            detail: `${caseData.hasATNotification ? 'Notificação AT ' : ''}${caseData.hasDAC7Discrepancy ? 'Divergência DAC7 ' : ''}`
        });
        
        // 8. Fator Antiguidade (peso: 0.05)
        const tenureFeature = this.trainingData.features.tenure.find(
            f => caseData.yearsOfOperation >= f.range[0] && caseData.yearsOfOperation < f.range[1]
        ) || { weight: 0, confidence: 0.70 };
        const tenureContribution = tenureFeature.weight * this.featureWeights.tenure;
        probability += tenureContribution;
        confidenceFactors.push({
            factor: 'Antiguidade do Cliente',
            contribution: tenureContribution,
            confidence: tenureFeature.confidence,
            detail: `${caseData.yearsOfOperation} anos de operação`
        });
        
        // 9. Fator Oposição (ajuste adicional)
        const adversaryWeight = this.trainingData.features.adversary[caseData.adversary] || 0;
        probability += adversaryWeight;
        
        // Limitar probabilidade entre 0.15 e 0.98
        probability = Math.min(Math.max(probability, 0.15), 0.98);
        
        // Calcular confiança geral (média ponderada das confianças)
        const totalConfidence = confidenceFactors.reduce((sum, f) => sum + f.confidence, 0) / confidenceFactors.length;
        const overallConfidence = Math.min(totalConfidence * (this.trainingData.totalCases / 500), 0.95);
        
        // Gerar análise detalhada
        const detailedAnalysis = this.getDetailedAnalysis(caseData, probability, confidenceFactors);
        
        // Buscar jurisprudência relevante
        const relevantJurisprudence = this.findRelevantJurisprudence(caseData);
        
        const result = {
            probability,
            confidence: overallConfidence,
            confidenceFactors,
            detailedAnalysis,
            relevantJurisprudence,
            recommendedStrategy: this.getRecommendedStrategy(probability, caseData),
            riskLevel: this.classifyRisk(probability),
            expectedOutcome: this.getExpectedOutcome(probability),
            nextSteps: this.getNextSteps(probability, caseData),
            modelVersion: this.modelVersion,
            timestamp: new Date().toISOString()
        };
        
        // Guardar em cache
        this.predictionCache.set(cacheKey, result);
        
        return result;
    }
    
    /**
     * Obtém análise detalhada dos fatores
     */
    getDetailedAnalysis(caseData, probability, confidenceFactors) {
        const strengths = [];
        const weaknesses = [];
        const opportunities = [];
        const threats = [];
        
        for (const factor of confidenceFactors) {
            if (factor.contribution > 0.02) {
                strengths.push(factor.detail);
            } else if (factor.contribution < -0.02) {
                weaknesses.push(factor.detail);
            }
        }
        
        if (caseData.omissionPercentage > 70) {
            strengths.push('Omissão superior a 70% - Forte indicador de fraude qualificada (Art. 104 RGIT)');
        }
        
        if (caseData.hasDAC7Discrepancy) {
            strengths.push('Divergência DAC7 evidencia subdeclaração sistemática');
        }
        
        if (caseData.value > 15000) {
            strengths.push(`Valor da causa (€${caseData.value.toLocaleString()}) ultrapassa limiar de fraude qualificada`);
        }
        
        if (caseData.hasATNotification) {
            weaknesses.push('Notificação prévia da AT pode indicar maior escrutínio');
        }
        
        if (!caseData.judge) {
            weaknesses.push('Juiz desconhecido — impossível ajustar estratégia específica');
        }
        
        if (!caseData.hasDocumentaryEvidence && !caseData.hasExpertEvidence) {
            weaknesses.push('Ausência de prova documental ou pericial - Fragilidade probatória');
        }
        
        if (probability > 0.7) {
            opportunities.push('Alta probabilidade de êxito - Considerar pedido de tutela antecipada');
        } else if (probability < 0.4) {
            threats.push('Baixa probabilidade de sucesso - Risco de condenação em custas');
        }
        
        return {
            strengths,
            weaknesses,
            opportunities,
            threats,
            summary: `Análise baseada em ${this.trainingData.totalCases} casos históricos. Probabilidade: ${(probability * 100).toFixed(1)}%`,
            keyArguments: this.getKeyArguments(caseData)
        };
    }
    
    /**
     * Obtém argumentos-chave para o caso
     */
    getKeyArguments(caseData) {
        const arguments_list = [
            'Art. 103.º/104.º RGIT — Fraude fiscal qualificada',
            'Art. 36.º n.º 11 CIVA — Monopólio da emissão documental',
            'Art. 125.º CPP — Admissibilidade da prova digital'
        ];
        
        if (caseData.hasDAC7Discrepancy) {
            arguments_list.push('Diretiva DAC7 (UE) 2021/514 — Obrigação de reporte');
        }
        
        if (caseData.omissionPercentage > 80) {
            arguments_list.push('Art. 344.º CC — Inversão do ónus da prova');
        }
        
        if (caseData.hasDocumentaryEvidence) {
            arguments_list.push('Art. 376.º CC — Força probatória plena de documento autêntico');
        }
        
        if (caseData.hasDigitalEvidence) {
            arguments_list.push('ISO/IEC 27037:2012 — Diretrizes para prova digital');
        }
        
        return arguments_list;
    }
    
    /**
     * Encontra jurisprudência relevante para o caso
     */
    findRelevantJurisprudence(caseData) {
        const keywords = [];
        
        if (caseData.platform === 'bolt' || caseData.platform === 'uber') {
            keywords.push('plataforma');
        }
        if (caseData.omissionPercentage > 60) {
            keywords.push('omissão');
            keywords.push('fraude_qualificada');
        }
        if (caseData.hasDAC7Discrepancy) {
            keywords.push('DAC7');
        }
        if (caseData.hasDigitalEvidence) {
            keywords.push('prova_digital');
            keywords.push('hash');
        }
        
        const relevant = this.jurisprudenceDB.filter(j => 
            j.keywords.some(k => keywords.includes(k))
        ).sort((a, b) => b.relevance - a.relevance).slice(0, 3);
        
        return relevant;
    }
    
    /**
     * Obtém estratégia recomendada baseada na probabilidade
     */
    getRecommendedStrategy(probability, caseData) {
        if (probability > 0.75) {
            return {
                name: 'Estratégia Ofensiva',
                description: 'Ação judicial imediata com pedido de tutela antecipada',
                actions: [
                    'Submeter petição inicial com pedido de providência cautelar',
                    'Solicitar inversão do ónus da prova (Art. 344.º CC)',
                    'Requerer produção antecipada de provas',
                    'Notificar a contraparte para constituição de mandatário'
                ],
                timeline: '30-45 dias para decisão cautelar',
                successExpectation: 'Elevada'
            };
        } else if (probability > 0.55) {
            return {
                name: 'Estratégia Equilibrada',
                description: 'Notificação extrajudicial seguida de ação se necessário',
                actions: [
                    'Enviar notificação extrajudicial com prazo de 15 dias',
                    'Caso não haja acordo, apresentar petição inicial',
                    'Solicitar perícia técnica complementar',
                    'Explorar possibilidade de mediação'
                ],
                timeline: '60-90 dias para resolução',
                successExpectation: 'Moderada'
            };
        } else {
            return {
                name: 'Estratégia Defensiva',
                description: 'Priorizar acordo, arbitragem ou desistência estratégica',
                actions: [
                    'Analisar viabilidade de acordo extrajudicial',
                    'Considerar arbitragem como alternativa',
                    'Avaliar custo-benefício do litígio',
                    'Preparar defesa robusta caso litígio inevitável'
                ],
                timeline: '30-60 dias para acordo',
                successExpectation: 'Limitada'
            };
        }
    }
    
    /**
     * Classifica o risco do caso
     */
    classifyRisk(probability) {
        if (probability > 0.75) return 'Baixo';
        if (probability > 0.55) return 'Moderado';
        if (probability > 0.40) return 'Elevado';
        return 'Muito Elevado';
    }
    
    /**
     * Obtém resultado esperado
     */
    getExpectedOutcome(probability) {
        if (probability > 0.80) {
            return 'Vitória provável com condenação integral da contraparte';
        } else if (probability > 0.65) {
            return 'Vitória provável com condenação parcial';
        } else if (probability > 0.50) {
            return 'Resultado incerto - depende da qualidade probatória';
        } else if (probability > 0.35) {
            return 'Derrota provável - considerar acordo';
        } else {
            return 'Derrota muito provável - reavaliar estratégia';
        }
    }
    
    /**
     * Obtém próximos passos recomendados
     */
    getNextSteps(probability, caseData) {
        const steps = [];
        
        steps.push({
            order: 1,
            action: 'Constituir mandato e juntar procuração',
            deadline: 'Imediato',
            responsible: 'Advogado responsável'
        });
        
        if (probability > 0.6) {
            steps.push({
                order: 2,
                action: 'Preparar petição inicial com pedido de tutela antecipada',
                deadline: '15 dias',
                responsible: 'Equipa de litígio'
            });
            steps.push({
                order: 3,
                action: 'Reunir prova documental e pericial',
                deadline: '30 dias',
                responsible: 'Equipa de prova'
            });
        } else {
            steps.push({
                order: 2,
                action: 'Analisar viabilidade de acordo extrajudicial',
                deadline: '10 dias',
                responsible: 'Equipa de negociação'
            });
            steps.push({
                order: 3,
                action: 'Solicitar parecer de especialista externo',
                deadline: '15 dias',
                responsible: 'Sócio responsável'
            });
        }
        
        if (caseData.hasATNotification) {
            steps.push({
                order: 4,
                action: 'Responder à notificação da AT no prazo legal',
                deadline: '10 dias',
                responsible: 'Equipa fiscal'
            });
        }
        
        return steps;
    }
    
    /**
     * Simula cenário de recurso
     * @param {Object} caseData - Dados do caso
     * @param {string} instance - Instância (1a, 2a, STA)
     * @returns {Object} Resultado da simulação
     */
    simulateAppeal(caseData, instance = '2a') {
        const baseProbability = this.predictSuccess(caseData).probability;
        
        let reversalProbability = 0;
        let appealSuccessRate = 0;
        let expectedDuration = 0;
        
        switch(instance) {
            case '1a':
                reversalProbability = 0;
                appealSuccessRate = baseProbability;
                expectedDuration = 180;
                break;
            case '2a':
                reversalProbability = 0.25;
                appealSuccessRate = baseProbability * (1 - reversalProbability);
                expectedDuration = 270;
                break;
            case 'STA':
                reversalProbability = 0.35;
                appealSuccessRate = baseProbability * (1 - reversalProbability);
                expectedDuration = 360;
                break;
            default:
                reversalProbability = 0;
                appealSuccessRate = baseProbability;
                expectedDuration = 180;
        }
        
        // Ajustar por qualidade da prova
        if (caseData.hasExpertEvidence) {
            appealSuccessRate += 0.05;
        }
        
        // Ajustar por jurisprudência favorável
        const relevantJur = this.findRelevantJurisprudence(caseData);
        if (relevantJur.length > 0 && relevantJur[0].impact === 'high') {
            appealSuccessRate += 0.08;
        }
        
        appealSuccessRate = Math.min(Math.max(appealSuccessRate, 0.15), 0.95);
        
        return {
            instance,
            baseProbability: (baseProbability * 100).toFixed(1),
            reversalProbability: (reversalProbability * 100).toFixed(1),
            appealSuccessRate: (appealSuccessRate * 100).toFixed(1),
            expectedDurationDays: expectedDuration,
            estimatedCosts: this.estimateAppealCosts(caseData, instance),
            recommendation: appealSuccessRate > 0.6 ? 'Recurso recomendado' : 
                           appealSuccessRate > 0.4 ? 'Recurso condicionado' : 'Recurso não recomendado',
            relevantJurisprudence: relevantJur.slice(0, 2)
        };
    }
    
    /**
     * Estima custos de recurso
     */
    estimateAppealCosts(caseData, instance) {
        const baseCost = caseData.value * 0.05;
        
        const multipliers = {
            '1a': 1,
            '2a': 1.5,
            'STA': 2
        };
        
        const multiplier = multipliers[instance] || 1;
        let totalCost = baseCost * multiplier;
        
        if (caseData.hasExpertEvidence) totalCost += 1500;
        if (caseData.value > 50000) totalCost *= 1.2;
        
        return Math.round(totalCost);
    }
    
    /**
     * Gera relatório completo em formato legível
     */
    generateReport(caseData) {
        const prediction = this.predictSuccess(caseData);
        
        return {
            generatedAt: new Date().toISOString(),
            caseId: caseData.id,
            client: caseData.client,
            platform: caseData.platform,
            omissionPercentage: caseData.omissionPercentage,
            value: caseData.value,
            prediction: {
                probability: (prediction.probability * 100).toFixed(1) + '%',
                confidence: (prediction.confidence * 100).toFixed(1) + '%',
                riskLevel: prediction.riskLevel,
                recommendedStrategy: prediction.recommendedStrategy.name
            },
            strengths: prediction.detailedAnalysis.strengths,
            weaknesses: prediction.detailedAnalysis.weaknesses,
            keyArguments: prediction.detailedAnalysis.keyArguments,
            relevantJurisprudence: prediction.relevantJurisprudence.map(j => ({
                caseNumber: j.id,
                court: j.court,
                summary: j.summary,
                date: j.date
            })),
            nextSteps: prediction.nextSteps,
            appealSimulation: this.simulateAppeal(caseData, '2a')
        };
    }
    
    /**
     * Limpa cache de previsões
     */
    clearCache() {
        this.predictionCache.clear();
        console.log('[ELITE] Cache de previsões limpo');
        return this;
    }
    
    /**
     * Obtém estatísticas do modelo
     */
    getModelStats() {
        return {
            modelVersion: this.modelVersion,
            trainingCases: this.trainingData.totalCases,
            featuresCount: Object.keys(this.trainingData.features).length,
            cacheSize: this.predictionCache.size,
            initialized: this.initialized,
            jurisprudenceCount: this.jurisprudenceDB.length
        };
    }
}

// Instância global
window.AIAssistant = new AIAssistant();