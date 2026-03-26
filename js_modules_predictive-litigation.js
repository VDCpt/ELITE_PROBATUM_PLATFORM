/**
 * ============================================================================
 * ELITE PROBATUM — MÓDULO 1: PREVISÃO DE ÊXITO
 * ============================================================================
 * Motor de análise preditiva para litígios com base em dados históricos,
 * análise de jurisprudência e perfis de magistrados.
 * ============================================================================
 */

class PredictiveLitigation {
    constructor() {
        this.model = null;
        this.trained = false;
        this.predictionHistory = [];
        this.courtStats = {};
        this.judgeStats = {};
        this.caseFeatures = {};
        this.initialized = false;
        
        this.loadCourtStats();
        this.loadJudgeStats();
    }
    
    /**
     * Inicializa o motor de previsão
     */
    async initialize() {
        console.log('[ELITE] Inicializando motor de previsão de êxito...');
        
        // Carregar dados históricos
        await this.loadHistoricalData();
        
        this.trained = true;
        this.initialized = true;
        
        console.log('[ELITE] Motor de previsão inicializado com', Object.keys(this.caseFeatures).length, 'features');
        return true;
    }
    
    /**
     * Carrega estatísticas de tribunais
     */
    loadCourtStats() {
        this.courtStats = {
            lisboa: {
                name: 'Lisboa',
                avgSuccessRate: 0.62,
                avgDuration: 135,
                caseVolume: 450,
                judgeCount: 12,
                favorableJudges: ['Dr. António Costa', 'Dra. Isabel Ferreira'],
                unfavorableJudges: ['Dr. Manuel Rodrigues']
            },
            porto: {
                name: 'Porto',
                avgSuccessRate: 0.68,
                avgDuration: 110,
                caseVolume: 380,
                judgeCount: 10,
                favorableJudges: ['Dra. Sofia Mendes', 'Dr. Carlos Lima'],
                unfavorableJudges: []
            },
            braga: {
                name: 'Braga',
                avgSuccessRate: 0.55,
                avgDuration: 125,
                caseVolume: 250,
                judgeCount: 8,
                favorableJudges: [],
                unfavorableJudges: ['Dr. Ricardo Alves']
            },
            coimbra: {
                name: 'Coimbra',
                avgSuccessRate: 0.58,
                avgDuration: 140,
                caseVolume: 220,
                judgeCount: 9,
                favorableJudges: ['Dr. Rui Silva'],
                unfavorableJudges: []
            },
            faro: {
                name: 'Faro',
                avgSuccessRate: 0.61,
                avgDuration: 130,
                caseVolume: 180,
                judgeCount: 7,
                favorableJudges: [],
                unfavorableJudges: []
            },
            evora: {
                name: 'Évora',
                avgSuccessRate: 0.59,
                avgDuration: 145,
                caseVolume: 150,
                judgeCount: 6,
                favorableJudges: [],
                unfavorableJudges: []
            }
        };
    }
    
    /**
     * Carrega estatísticas de magistrados
     */
    loadJudgeStats() {
        this.judgeStats = {
            'Dr. António Costa': {
                court: 'Lisboa',
                decisions: 45,
                favorableRate: 0.68,
                avgTime: 120,
                preferredEvidence: ['documentary', 'expert'],
                aversion: ['technical_formalities']
            },
            'Dra. Sofia Mendes': {
                court: 'Porto',
                decisions: 38,
                favorableRate: 0.72,
                avgTime: 95,
                preferredEvidence: ['documentary', 'digital'],
                aversion: ['weak_testimony']
            },
            'Dr. Ricardo Alves': {
                court: 'Braga',
                decisions: 52,
                favorableRate: 0.58,
                avgTime: 110,
                preferredEvidence: ['expert'],
                aversion: ['circumstantial']
            },
            'Dra. Teresa Lopes': {
                court: 'Lisboa',
                decisions: 41,
                favorableRate: 0.71,
                avgTime: 105,
                preferredEvidence: ['documentary', 'digital'],
                aversion: []
            },
            'Dr. Pedro Martins': {
                court: 'Lisboa',
                decisions: 35,
                favorableRate: 0.65,
                avgTime: 125,
                preferredEvidence: ['documentary'],
                aversion: ['technical_formalities']
            },
            'Dr. João Costa': {
                court: 'Lisboa',
                decisions: 28,
                favorableRate: 0.62,
                avgTime: 115,
                preferredEvidence: ['expert', 'digital'],
                aversion: []
            },
            'Dra. Isabel Ferreira': {
                court: 'Porto',
                decisions: 32,
                favorableRate: 0.69,
                avgTime: 100,
                preferredEvidence: ['documentary'],
                aversion: ['technical_formalities']
            }
        };
    }
    
    /**
     * Carrega dados históricos de casos
     */
    async loadHistoricalData() {
        // Simular carga de dados históricos (em produção, viria de API)
        this.caseFeatures = {
            platform: {
                bolt: { baseRate: 0.72, sampleSize: 185, confidence: 0.85 },
                uber: { baseRate: 0.68, sampleSize: 156, confidence: 0.83 },
                freenow: { baseRate: 0.71, sampleSize: 42, confidence: 0.75 },
                glovo: { baseRate: 0.65, sampleSize: 28, confidence: 0.70 },
                others: { baseRate: 0.55, sampleSize: 35, confidence: 0.68 }
            },
            evidence: {
                documentary: { impact: 0.12, sampleSize: 320 },
                expert: { impact: 0.10, sampleSize: 145 },
                digital: { impact: 0.14, sampleSize: 98 },
                testimonial: { impact: 0.04, sampleSize: 210 },
                none: { impact: -0.08, sampleSize: 85 }
            },
            omissionRanges: [
                { min: 0, max: 20, impact: -0.05, sampleSize: 42 },
                { min: 20, max: 40, impact: 0.02, sampleSize: 68 },
                { min: 40, max: 60, impact: 0.08, sampleSize: 112 },
                { min: 60, max: 80, impact: 0.15, sampleSize: 156 },
                { min: 80, max: 100, impact: 0.22, sampleSize: 89 }
            ],
            valueRanges: [
                { min: 0, max: 15000, impact: -0.02, sampleSize: 134 },
                { min: 15000, max: 50000, impact: 0.03, sampleSize: 178 },
                { min: 50000, max: 100000, impact: 0.08, sampleSize: 92 },
                { min: 100000, max: Infinity, impact: 0.12, sampleSize: 63 }
            ]
        };
    }
    
    /**
     * Previsão principal de sucesso
     * @param {Object} caseData - Dados do caso
     * @returns {Object} Resultado da previsão
     */
    predict(caseData) {
        if (!this.initialized) {
            this.initialize();
        }
        
        // Extrair features do caso
        const features = this.extractFeatures(caseData);
        
        // Calcular probabilidade base
        let probability = 0.50;
        let confidence = 0.70;
        const contributingFactors = [];
        
        // 1. Fator Plataforma (peso: 0.15)
        const platformData = this.caseFeatures.platform[features.platform] || this.caseFeatures.platform.others;
        const platformContribution = (platformData.baseRate - 0.50) * 0.30;
        probability += platformContribution;
        contributingFactors.push({
            name: 'Plataforma',
            value: platformData.baseRate,
            contribution: platformContribution,
            confidence: platformData.confidence,
            details: `${features.platform.toUpperCase()} - Taxa histórica: ${(platformData.baseRate * 100).toFixed(0)}%`
        });
        
        // 2. Fator Percentagem de Omissão (peso: 0.20)
        const omissionRange = this.caseFeatures.omissionRanges.find(
            r => features.omissionPercentage >= r.min && features.omissionPercentage < r.max
        ) || { impact: 0, sampleSize: 0 };
        const omissionContribution = omissionRange.impact * 0.25;
        probability += omissionContribution;
        contributingFactors.push({
            name: 'Omissão Fiscal',
            value: features.omissionPercentage,
            contribution: omissionContribution,
            confidence: Math.min(0.9, omissionRange.sampleSize / 100),
            details: `Omissão de ${features.omissionPercentage}% - ${omissionRange.impact > 0 ? 'Fator positivo' : 'Fator negativo'}`
        });
        
        // 3. Fator Tribunal (peso: 0.10)
        const courtData = this.courtStats[features.court] || this.courtStats.lisboa;
        const courtContribution = (courtData.avgSuccessRate - 0.50) * 0.20;
        probability += courtContribution;
        contributingFactors.push({
            name: 'Tribunal',
            value: courtData.avgSuccessRate,
            contribution: courtContribution,
            confidence: 0.75,
            details: `${courtData.name} - Taxa média: ${(courtData.avgSuccessRate * 100).toFixed(0)}%`
        });
        
        // 4. Fator Juiz (peso: 0.15)
        let judgeContribution = 0;
        let judgeData = null;
        if (features.judge && this.judgeStats[features.judge]) {
            judgeData = this.judgeStats[features.judge];
            judgeContribution = (judgeData.favorableRate - 0.50) * 0.30;
            probability += judgeContribution;
            contributingFactors.push({
                name: 'Juiz',
                value: judgeData.favorableRate,
                contribution: judgeContribution,
                confidence: Math.min(0.85, judgeData.decisions / 50),
                details: `${features.judge} - Taxa favorável: ${(judgeData.favorableRate * 100).toFixed(0)}%`
            });
        } else {
            contributingFactors.push({
                name: 'Juiz',
                value: 0.50,
                contribution: 0,
                confidence: 0.50,
                details: 'Juiz desconhecido - Análise baseada em média geral'
            });
        }
        
        // 5. Fator Evidência (peso: 0.15)
        let evidenceWeight = 0;
        const evidenceTypes = [];
        
        if (features.hasDocumentaryEvidence) {
            evidenceWeight += this.caseFeatures.evidence.documentary.impact;
            evidenceTypes.push('Documental');
        }
        if (features.hasExpertEvidence) {
            evidenceWeight += this.caseFeatures.evidence.expert.impact;
            evidenceTypes.push('Pericial');
        }
        if (features.hasDigitalEvidence) {
            evidenceWeight += this.caseFeatures.evidence.digital.impact;
            evidenceTypes.push('Digital');
        }
        if (features.hasTestimonialEvidence) {
            evidenceWeight += this.caseFeatures.evidence.testimonial.impact;
            evidenceTypes.push('Testemunhal');
        }
        if (evidenceWeight === 0) {
            evidenceWeight = this.caseFeatures.evidence.none.impact;
        }
        
        const evidenceContribution = evidenceWeight * 0.30;
        probability += evidenceContribution;
        contributingFactors.push({
            name: 'Qualidade Probatória',
            value: evidenceWeight,
            contribution: evidenceContribution,
            confidence: 0.80,
            details: evidenceTypes.length ? `Tipos: ${evidenceTypes.join(', ')}` : 'Ausência de prova robusta'
        });
        
        // 6. Fator Valor da Causa (peso: 0.10)
        const valueRange = this.caseFeatures.valueRanges.find(
            r => features.value >= r.min && features.value < r.max
        ) || { impact: 0, sampleSize: 0 };
        const valueContribution = valueRange.impact * 0.20;
        probability += valueContribution;
        contributingFactors.push({
            name: 'Valor da Causa',
            value: features.value,
            contribution: valueContribution,
            confidence: Math.min(0.85, valueRange.sampleSize / 100),
            details: `€${features.value.toLocaleString()} - ${valueRange.impact > 0 ? 'Fator positivo' : 'Fator negativo'}`
        });
        
        // 7. Fator Regulatório (peso: 0.10)
        let regulatoryWeight = 0;
        if (features.hasDAC7Discrepancy) regulatoryWeight += 0.14;
        if (features.hasATNotification) regulatoryWeight -= 0.18;
        if (features.hasTaxAudit) regulatoryWeight -= 0.10;
        if (features.hasRegularization) regulatoryWeight += 0.08;
        
        const regulatoryContribution = regulatoryWeight * 0.20;
        probability += regulatoryContribution;
        contributingFactors.push({
            name: 'Contexto Regulatório',
            value: regulatoryWeight,
            contribution: regulatoryContribution,
            confidence: 0.75,
            details: `${features.hasDAC7Discrepancy ? 'Divergência DAC7 ' : ''}${features.hasATNotification ? 'Notificação AT ' : ''}`
        });
        
        // 8. Fator Antiguidade (peso: 0.05)
        let tenureImpact = 0;
        if (features.yearsOfOperation > 5) tenureImpact = 0.09;
        else if (features.yearsOfOperation > 3) tenureImpact = 0.05;
        else if (features.yearsOfOperation > 1) tenureImpact = 0.02;
        else if (features.yearsOfOperation < 1) tenureImpact = -0.08;
        
        const tenureContribution = tenureImpact * 0.10;
        probability += tenureContribution;
        contributingFactors.push({
            name: 'Antiguidade',
            value: features.yearsOfOperation,
            contribution: tenureContribution,
            confidence: 0.70,
            details: `${features.yearsOfOperation} anos de operação`
        });
        
        // Limitar probabilidade entre 0.15 e 0.98
        probability = Math.min(Math.max(probability, 0.15), 0.98);
        
        // Calcular confiança global
        confidence = this.calculateGlobalConfidence(contributingFactors);
        
        // Gerar análise detalhada
        const detailedAnalysis = this.getDetailedAnalysis(features, probability, contributingFactors);
        
        // Gerar recomendações estratégicas
        const recommendations = this.generateRecommendations(features, probability, judgeData);
        
        // Registrar previsão no histórico
        const predictionRecord = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            caseData: { ...caseData },
            probability,
            confidence,
            contributingFactors,
            recommendations
        };
        this.predictionHistory.unshift(predictionRecord);
        
        // Manter apenas últimos 100 registos
        if (this.predictionHistory.length > 100) {
            this.predictionHistory = this.predictionHistory.slice(0, 100);
        }
        
        return {
            probability,
            confidence,
            contributingFactors,
            detailedAnalysis,
            recommendations,
            riskLevel: this.classifyRisk(probability),
            expectedOutcome: this.getExpectedOutcome(probability),
            estimatedValue: this.estimateRecoveryValue(features.value, probability),
            judicialProfile: judgeData ? this.getJudicialProfile(judgeData, features) : null,
            predictionId: predictionRecord.id
        };
    }
    
    /**
     * Extrai features do caso
     */
    extractFeatures(caseData) {
        return {
            platform: caseData.platform || 'unknown',
            omissionPercentage: caseData.omissionPercentage || 0,
            court: (caseData.court || 'lisboa').toLowerCase(),
            judge: caseData.judge || null,
            value: caseData.value || 0,
            yearsOfOperation: caseData.yearsOfOperation || 1,
            hasDocumentaryEvidence: caseData.hasDocumentaryEvidence || false,
            hasExpertEvidence: caseData.hasExpertEvidence || false,
            hasDigitalEvidence: caseData.hasDigitalEvidence || false,
            hasTestimonialEvidence: caseData.hasTestimonialEvidence || false,
            hasDAC7Discrepancy: caseData.hasDAC7Discrepancy || false,
            hasATNotification: caseData.hasATNotification || false,
            hasTaxAudit: caseData.hasTaxAudit || false,
            hasRegularization: caseData.hasRegularization || false
        };
    }
    
    /**
     * Calcula confiança global
     */
    calculateGlobalConfidence(factors) {
        const avgConfidence = factors.reduce((sum, f) => sum + f.confidence, 0) / factors.length;
        const baseConfidence = 0.70;
        return Math.min(baseConfidence + (avgConfidence - 0.70) * 0.5, 0.95);
    }
    
    /**
     * Obtém análise detalhada
     */
    getDetailedAnalysis(features, probability, factors) {
        const strengths = [];
        const weaknesses = [];
        const opportunities = [];
        const threats = [];
        
        for (const factor of factors) {
            if (factor.contribution > 0.02) {
                strengths.push(factor.details);
            } else if (factor.contribution < -0.02) {
                weaknesses.push(factor.details);
            }
        }
        
        if (features.omissionPercentage > 70) {
            strengths.push('Omissão superior a 70% - Forte indicador de fraude qualificada (Art. 104 RGIT)');
        }
        
        if (features.hasDAC7Discrepancy) {
            strengths.push('Divergência DAC7 evidencia subdeclaração sistemática');
        }
        
        if (features.value > 15000) {
            strengths.push(`Valor da causa (€${features.value.toLocaleString()}) ultrapassa limiar de fraude qualificada`);
        }
        
        if (features.hasATNotification) {
            weaknesses.push('Notificação prévia da AT pode indicar maior escrutínio');
        }
        
        if (!features.hasDocumentaryEvidence && !features.hasExpertEvidence) {
            weaknesses.push('Ausência de prova documental ou pericial - Fragilidade probatória');
        }
        
        if (probability > 0.75) {
            opportunities.push('Alta probabilidade de êxito - Considerar pedido de tutela antecipada');
            opportunities.push('Possibilidade de ação coletiva para maximizar recuperação');
        } else if (probability < 0.40) {
            threats.push('Baixa probabilidade de sucesso - Risco de condenação em custas');
            threats.push('Considerar acordo extrajudicial como alternativa');
        }
        
        const keyArguments = this.getKeyArguments(features);
        
        return {
            strengths,
            weaknesses,
            opportunities,
            threats,
            keyArguments,
            summary: `Análise baseada em ${Object.values(this.caseFeatures.platform).reduce((s, p) => s + p.sampleSize, 0)} casos históricos. Probabilidade: ${(probability * 100).toFixed(1)}%`
        };
    }
    
    /**
     * Obtém argumentos-chave
     */
    getKeyArguments(features) {
        const argumentsList = [
            'Art. 103.º/104.º RGIT — Fraude fiscal qualificada',
            'Art. 36.º n.º 11 CIVA — Monopólio da emissão documental',
            'Art. 125.º CPP — Admissibilidade da prova digital'
        ];
        
        if (features.hasDAC7Discrepancy) {
            argumentsList.push('Diretiva DAC7 (UE) 2021/514 — Obrigação de reporte');
        }
        
        if (features.omissionPercentage > 80) {
            argumentsList.push('Art. 344.º CC — Inversão do ónus da prova');
        }
        
        if (features.hasDocumentaryEvidence) {
            argumentsList.push('Art. 376.º CC — Força probatória plena de documento autêntico');
        }
        
        if (features.hasDigitalEvidence) {
            argumentsList.push('ISO/IEC 27037:2012 — Diretrizes para prova digital');
        }
        
        return argumentsList;
    }
    
    /**
     * Gera recomendações estratégicas
     */
    generateRecommendations(features, probability, judgeData) {
        const recommendations = [];
        
        // Recomendação baseada na probabilidade
        if (probability > 0.75) {
            recommendations.push({
                type: 'strategy',
                priority: 'high',
                title: 'Estratégia Ofensiva',
                description: 'Ação judicial imediata com pedido de tutela antecipada',
                actions: [
                    'Submeter petição inicial com pedido de providência cautelar',
                    'Solicitar inversão do ónus da prova (Art. 344.º CC)',
                    'Requerer produção antecipada de provas',
                    'Notificar a contraparte para constituição de mandatário'
                ],
                timeline: '30-45 dias para decisão cautelar'
            });
        } else if (probability > 0.55) {
            recommendations.push({
                type: 'strategy',
                priority: 'medium',
                title: 'Estratégia Equilibrada',
                description: 'Notificação extrajudicial seguida de ação se necessário',
                actions: [
                    'Enviar notificação extrajudicial com prazo de 15 dias',
                    'Caso não haja acordo, apresentar petição inicial',
                    'Solicitar perícia técnica complementar',
                    'Explorar possibilidade de mediação'
                ],
                timeline: '60-90 dias para resolução'
            });
        } else {
            recommendations.push({
                type: 'strategy',
                priority: 'high',
                title: 'Estratégia Defensiva',
                description: 'Priorizar acordo, arbitragem ou desistência estratégica',
                actions: [
                    'Analisar viabilidade de acordo extrajudicial',
                    'Considerar arbitragem como alternativa',
                    'Avaliar custo-benefício do litígio',
                    'Preparar defesa robusta caso litígio inevitável'
                ],
                timeline: '30-60 dias para acordo'
            });
        }
        
        // Recomendação baseada na qualidade probatória
        if (!features.hasDocumentaryEvidence && !features.hasExpertEvidence) {
            recommendations.push({
                type: 'evidence',
                priority: 'critical',
                title: 'Reforço Probatório',
                description: 'Ausência de prova robusta - Necessário reforçar elementos',
                actions: [
                    'Solicitar perícia técnica independente',
                    'Reunir documentação complementar',
                    'Identificar testemunhas qualificadas'
                ],
                timeline: 'Imediato'
            });
        }
        
        // Recomendação baseada no perfil do juiz
        if (judgeData) {
            if (judgeData.preferredEvidence.includes('digital') && features.hasDigitalEvidence) {
                recommendations.push({
                    type: 'judicial',
                    priority: 'medium',
                    title: 'Aproveitar Perfil do Juiz',
                    description: `Juiz ${judgeData.name} tem preferência por prova digital`,
                    actions: [
                        'Enfatizar prova digital na petição',
                        'Apresentar hash SHA-256 das evidências',
                        'Referenciar acórdãos do mesmo juiz em casos similares'
                    ],
                    timeline: 'Na submissão'
                });
            }
            
            if (judgeData.aversion.includes('technical_formalities')) {
                recommendations.push({
                    type: 'judicial',
                    priority: 'medium',
                    title: 'Evitar Formalismos Excessivos',
                    description: `Juiz ${judgeData.name} demonstra aversão a formalismos técnicos`,
                    actions: [
                        'Simplificar linguagem processual',
                        'Evitar recursos a questões formais',
                        'Focar no mérito da causa'
                    ],
                    timeline: 'Em todas as peças'
                });
            }
        }
        
        return recommendations;
    }
    
    /**
     * Classifica risco
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
            return 'Vitória provável com condenação integral da contraparte e custas';
        } else if (probability > 0.65) {
            return 'Vitória provável com condenação parcial ou acordo favorável';
        } else if (probability > 0.50) {
            return 'Resultado incerto - depende da qualidade probatória e argumentação';
        } else if (probability > 0.35) {
            return 'Derrota provável - considerar acordo ou desistência estratégica';
        } else {
            return 'Derrota muito provável - reavaliar fundamentos ou desistir';
        }
    }
    
    /**
     * Estima valor de recuperação
     */
    estimateRecoveryValue(caseValue, probability) {
        const baseRecovery = caseValue * probability;
        
        // Ajuste para casos de alto valor
        let adjustment = 1.0;
        if (caseValue > 100000) adjustment = 0.95;
        else if (caseValue > 50000) adjustment = 0.98;
        else if (caseValue > 15000) adjustment = 1.0;
        else adjustment = 1.05;
        
        return Math.round(baseRecovery * adjustment);
    }
    
    /**
     * Obtém perfil judicial detalhado
     */
    getJudicialProfile(judgeData, features) {
        const preferredMatch = judgeData.preferredEvidence.some(evidence => {
            if (evidence === 'documentary' && features.hasDocumentaryEvidence) return true;
            if (evidence === 'expert' && features.hasExpertEvidence) return true;
            if (evidence === 'digital' && features.hasDigitalEvidence) return true;
            return false;
        });
        
        return {
            name: judgeData.name,
            court: judgeData.court,
            favorableRate: judgeData.favorableRate,
            decisions: judgeData.decisions,
            avgTime: judgeData.avgTime,
            preferredEvidence: judgeData.preferredEvidence,
            aversion: judgeData.aversion,
            alignmentScore: preferredMatch ? 0.85 : 0.60,
            recommendations: [
                `Taxa favorável: ${(judgeData.favorableRate * 100).toFixed(0)}%`,
                `Tempo médio de decisão: ${judgeData.avgTime} dias`,
                preferredMatch ? 'Evidências alinhadas com preferências do magistrado' : 'Reforçar prova documental'
            ]
        };
    }
    
    /**
     * Simula cenário de recurso
     */
    simulateAppeal(caseData, instance = '2a') {
        const basePrediction = this.predict(caseData);
        const baseProbability = basePrediction.probability;
        
        let reversalRate = 0;
        let appealDuration = 0;
        let appealCosts = 0;
        
        switch(instance) {
            case '1a':
                reversalRate = 0;
                appealDuration = 180;
                appealCosts = caseData.value * 0.05;
                break;
            case '2a':
                reversalRate = 0.25;
                appealDuration = 270;
                appealCosts = caseData.value * 0.08;
                break;
            case 'STA':
                reversalRate = 0.35;
                appealDuration = 360;
                appealCosts = caseData.value * 0.12;
                break;
            default:
                reversalRate = 0;
                appealDuration = 180;
                appealCosts = caseData.value * 0.05;
        }
        
        let appealSuccessRate = baseProbability;
        
        // Ajustar por qualidade da prova
        if (caseData.hasExpertEvidence) {
            appealSuccessRate += 0.05;
        }
        if (caseData.hasDigitalEvidence) {
            appealSuccessRate += 0.03;
        }
        
        // Ajustar por jurisprudência favorável
        if (basePrediction.detailedAnalysis.keyArguments.length > 3) {
            appealSuccessRate += 0.04;
        }
        
        appealSuccessRate = Math.min(Math.max(appealSuccessRate, 0.20), 0.95);
        
        return {
            instance,
            baseProbability: (baseProbability * 100).toFixed(1),
            reversalProbability: (reversalRate * 100).toFixed(1),
            appealSuccessRate: (appealSuccessRate * 100).toFixed(1),
            expectedDurationDays: appealDuration,
            estimatedCosts: Math.round(appealCosts),
            recommendation: appealSuccessRate > 0.60 ? 'Recurso recomendado' :
                           appealSuccessRate > 0.40 ? 'Recurso condicionado' : 'Recurso não recomendado',
            roiEstimate: appealSuccessRate > 0.60 ? 'Potencial ROI positivo' : 'Risco de custos superiores ao benefício'
        };
    }
    
    /**
     * Gera relatório completo
     */
    generateReport(caseData) {
        const prediction = this.predict(caseData);
        const appealSimulation = this.simulateAppeal(caseData);
        
        return {
            generatedAt: new Date().toISOString(),
            caseId: caseData.id || 'N/A',
            platform: caseData.platform,
            value: caseData.value,
            omissionPercentage: caseData.omissionPercentage,
            prediction: {
                probability: (prediction.probability * 100).toFixed(1) + '%',
                confidence: (prediction.confidence * 100).toFixed(1) + '%',
                riskLevel: prediction.riskLevel,
                expectedOutcome: prediction.expectedOutcome,
                estimatedRecovery: prediction.estimatedValue
            },
            strengths: prediction.detailedAnalysis.strengths,
            weaknesses: prediction.detailedAnalysis.weaknesses,
            opportunities: prediction.detailedAnalysis.opportunities,
            threats: prediction.detailedAnalysis.threats,
            keyArguments: prediction.detailedAnalysis.keyArguments,
            recommendations: prediction.recommendations,
            appealSimulation: appealSimulation,
            judicialProfile: prediction.judicialProfile
        };
    }
    
    /**
     * Obtém histórico de previsões
     */
    getPredictionHistory(limit = 10) {
        return this.predictionHistory.slice(0, limit);
    }
    
    /**
     * Limpa cache de previsões
     */
    clearCache() {
        this.predictionHistory = [];
        console.log('[ELITE] Histórico de previsões limpo');
        return this;
    }
    
    /**
     * Obtém estatísticas do modelo
     */
    getModelStats() {
        const totalPredictions = this.predictionHistory.length;
        const avgProbability = totalPredictions > 0
            ? this.predictionHistory.reduce((sum, p) => sum + p.probability, 0) / totalPredictions
            : 0;
        
        return {
            initialized: this.initialized,
            totalPredictions: totalPredictions,
            averageProbability: (avgProbability * 100).toFixed(1) + '%',
            featuresCount: Object.keys(this.caseFeatures).length,
            courtsCount: Object.keys(this.courtStats).length,
            judgesCount: Object.keys(this.judgeStats).length
        };
    }
}

// Instância global
window.PredictiveLitigation = new PredictiveLitigation();