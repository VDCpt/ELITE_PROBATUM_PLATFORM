/**
 * ============================================================================
 * UNIFED-ELITE PLATFORM — MÓDULO 3: PERFIL DE MAGISTRADOS
 * ============================================================================
 */

class JudicialAnalytics {
    constructor() {
        this.judges = this.loadJudgesData();
        this.courts = this.loadCourtsData();
    }
    
    loadJudgesData() {
        // Base de dados de magistrados (em produção, viria de API)
        return {
            'Dr. António Costa': {
                court: 'Tribunal Judicial de Lisboa',
                decisions: 45,
                favorableRate: 0.68,
                avgTime: 120,
                patterns: {
                    prefersDocumentaryEvidence: true,
                    acceptsExpertWitness: true,
                    grantsInjunction: 0.72,
                    appealsReversal: 0.18
                },
                keyCases: [
                    { number: '1234/19.8BELRS', outcome: 'favorable', year: 2023 },
                    { number: '5678/20.1BELRS', outcome: 'favorable', year: 2023 },
                    { number: '9012/21.3BELRS', outcome: 'unfavorable', year: 2024 }
                ],
                recommendedStrategy: {
                    approach: 'aggressive',
                    arguments: ['dac7', 'monopoly_invoicing', 'vat_self_assessment'],
                    avoid: ['technical_error', 'force_majeure'],
                    evidence: ['documentary', 'expert']
                }
            },
            'Dra. Sofia Mendes': {
                court: 'Tribunal Judicial do Porto',
                decisions: 38,
                favorableRate: 0.72,
                avgTime: 95,
                patterns: {
                    prefersDocumentaryEvidence: true,
                    acceptsExpertWitness: true,
                    grantsInjunction: 0.85,
                    appealsReversal: 0.12
                },
                keyCases: [
                    { number: '3456/19.0BEPRT', outcome: 'favorable', year: 2023 },
                    { number: '7890/20.2BEPRT', outcome: 'favorable', year: 2023 }
                ],
                recommendedStrategy: {
                    approach: 'aggressive',
                    arguments: ['fraud_qualification', 'burden_reversal'],
                    avoid: ['jurisdiction'],
                    evidence: ['documentary', 'expert', 'digital']
                }
            },
            'Dr. Ricardo Alves': {
                court: 'Tribunal Judicial de Braga',
                decisions: 52,
                favorableRate: 0.58,
                avgTime: 110,
                patterns: {
                    prefersDocumentaryEvidence: false,
                    acceptsExpertWitness: true,
                    grantsInjunction: 0.45,
                    appealsReversal: 0.25
                },
                keyCases: [
                    { number: '1112/21.7BEBRG', outcome: 'unfavorable', year: 2023 },
                    { number: '1314/22.1BEBRG', outcome: 'favorable', year: 2024 }
                ],
                recommendedStrategy: {
                    approach: 'balanced',
                    arguments: ['settlement', 'arbitration'],
                    avoid: ['aggressive_claims', 'media_pressure'],
                    evidence: ['expert', 'documentary']
                }
            },
            'Dr. Pedro Santos': {
                court: 'Tribunal Arbitral (CAAD)',
                decisions: 28,
                favorableRate: 0.82,
                avgTime: 65,
                patterns: {
                    prefersDocumentaryEvidence: true,
                    acceptsExpertWitness: true,
                    grantsInjunction: 0.92,
                    appealsReversal: 0.05
                },
                recommendedStrategy: {
                    approach: 'aggressive',
                    arguments: ['all'],
                    avoid: [],
                    evidence: ['documentary', 'expert', 'digital']
                }
            }
        };
    }
    
    loadCourtsData() {
        return {
            'Tribunal Judicial de Lisboa': {
                avgSuccessRate: 0.62,
                avgDuration: 135,
                judges: ['Dr. António Costa', 'Dra. Isabel Ferreira', 'Dr. Manuel Rodrigues']
            },
            'Tribunal Judicial do Porto': {
                avgSuccessRate: 0.68,
                avgDuration: 110,
                judges: ['Dra. Sofia Mendes', 'Dr. Carlos Lima', 'Dra. Ana Marques']
            },
            'Tribunal Judicial de Braga': {
                avgSuccessRate: 0.55,
                avgDuration: 125,
                judges: ['Dr. Ricardo Alves', 'Dra. Teresa Martins']
            },
            'Tribunal Arbitral (CAAD)': {
                avgSuccessRate: 0.78,
                avgDuration: 85,
                judges: ['Dr. Pedro Santos', 'Dra. Luísa Costa']
            }
        };
    }
    
    getJudgeProfile(judgeName) {
        return this.judges[judgeName] || null;
    }
    
    getCourtProfile(courtName) {
        return this.courts[courtName] || null;
    }
    
    analyzeCase(judgeName, caseData) {
        const judge = this.getJudgeProfile(judgeName);
        if (!judge) {
            return {
                successProbability: 0.5,
                confidence: 0.3,
                message: 'Juiz não encontrado na base de dados. Usar análise genérica.'
            };
        }
        
        // Calcular probabilidade baseada no histórico do juiz
        let probability = judge.favorableRate;
        
        // Ajustar por tipo de caso
        if (caseData.type === 'tvde') {
            probability += 0.05; // Juízes mais familiarizados com TVDE
        }
        
        // Ajustar por valor
        if (caseData.value > 50000) {
            probability += 0.03;
        }
        
        // Ajustar por qualidade da prova
        if (caseData.hasDocumentaryEvidence) {
            if (judge.patterns.prefersDocumentaryEvidence) probability += 0.08;
            else probability += 0.03;
        }
        
        if (caseData.hasExpertEvidence) {
            if (judge.patterns.acceptsExpertWitness) probability += 0.05;
        }
        
        // Probabilidade de tutela antecipada
        const injunctionProbability = judge.patterns.grantsInjunction;
        
        return {
            judge: judgeName,
            court: judge.court,
            successProbability: Math.min(probability, 0.95),
            confidence: this.calculateConfidence(judge),
            injunctionProbability: injunctionProbability,
            expectedDuration: judge.avgTime,
            recommendedStrategy: judge.recommendedStrategy,
            keyCases: judge.keyCases?.slice(0, 3) || [],
            patterns: judge.patterns,
            observations: this.getObservations(judge, caseData)
        };
    }
    
    calculateConfidence(judge) {
        const baseConfidence = Math.min(judge.decisions / 50, 0.9);
        return baseConfidence;
    }
    
    getObservations(judge, caseData) {
        const observations = [];
        
        if (judge.patterns.prefersDocumentaryEvidence && !caseData.hasDocumentaryEvidence) {
            observations.push('⚠️ Este juiz valoriza fortemente prova documental. Reforce esta área.');
        }
        
        if (judge.patterns.grantsInjunction > 0.7) {
            observations.push('✅ Boa probabilidade de deferimento de tutela antecipada.');
        }
        
        if (judge.favorableRate < 0.6) {
            observations.push('⚠️ Este juiz tem histórico desfavorável. Considere arbitragem ou mudança de foro.');
        }
        
        if (judge.recommendedStrategy.avoid.includes('aggressive_claims')) {
            observations.push('ℹ️ Evitar linguagem agressiva. Este juiz prefere abordagem técnica.');
        }
        
        return observations;
    }
    
    compareJudges(judges, caseData) {
        const comparisons = judges.map(judge => ({
            name: judge,
            ...this.analyzeCase(judge, caseData)
        }));
        
        comparisons.sort((a, b) => b.successProbability - a.successProbability);
        
        return {
            best: comparisons[0],
            alternatives: comparisons.slice(1, 3),
            recommendation: comparisons[0].successProbability > 0.65 
                ? 'Litigar neste foro'
                : 'Considerar arbitragem ou mudança de foro'
        };
    }
    
    getTrends(court, period = 12) {
        const courtData = this.getCourtProfile(court);
        if (!courtData) return null;
        
        return {
            court,
            avgSuccessRate: courtData.avgSuccessRate,
            avgDuration: courtData.avgDuration,
            judges: courtData.judges.map(judge => ({
                name: judge,
                profile: this.getJudgeProfile(judge)
            })),
            recommendation: courtData.avgSuccessRate > 0.65 
                ? 'Foro favorável para litígio'
                : 'Foro desafiador — reforçar estratégia probatória'
        };
    }
}

// Instância global
window.JudicialAnalytics = new JudicialAnalytics();