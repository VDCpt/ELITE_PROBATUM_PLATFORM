/**
 * ============================================================================
 * UNIFED-ELITE PLATFORM — MÓDULO 5: INTELIGÊNCIA DE PLATAFORMAS
 * ============================================================================
 */

class PlatformIntelligence {
    constructor() {
        this.platforms = {
            bolt: {
                name: 'Bolt',
                settlementRate: 0.45,
                avgSettlementValue: 8500,
                commonDefenses: [
                    'jurisdiction', 'technical_error', 'de_minimis', 'algorithm'
                ],
                weaknesses: ['regulatory_scrutiny', 'media_sensitive', 'class_action_risk'],
                keyPeople: [
                    { name: 'Markus Villig', role: 'CEO', pressurePoint: 'reputação' },
                    { name: 'Martin Villig', role: 'Chairman', pressurePoint: 'estrutura societária' }
                ],
                legalStrategy: {
                    preferredCourts: ['lisboa', 'porto'],
                    avoidCourts: ['braga'],
                    successfulArguments: ['dac7_discrepancy', 'monopoly_invoicing'],
                    weakArguments: ['algorithm_error', 'force_majeure']
                }
            },
            uber: {
                name: 'Uber',
                settlementRate: 0.38,
                avgSettlementValue: 7200,
                commonDefenses: [
                    'jurisdiction', 'algorithm', 'terms_of_service', 'independent_contractor'
                ],
                weaknesses: ['public_pressure', 'class_action_risk', 'regulatory_history'],
                keyPeople: [
                    { name: 'Dara Khosrowshahi', role: 'CEO', pressurePoint: 'governança' },
                    { name: 'Nelson Chai', role: 'CFO', pressurePoint: 'resultados financeiros' }
                ],
                legalStrategy: {
                    preferredCourts: ['porto', 'coimbra'],
                    avoidCourts: ['braga', 'faro'],
                    successfulArguments: ['tax_omission', 'vAT_self_assessment'],
                    weakArguments: ['technical_error', 'force_majeure']
                }
            },
            freenow: {
                name: 'Free Now',
                settlementRate: 0.52,
                avgSettlementValue: 6500,
                commonDefenses: [
                    'technical_error', 'de_minimis', 'third_party_liability'
                ],
                weaknesses: ['market_share', 'local_operation'],
                keyPeople: [
                    { name: 'Thomas Zimmermann', role: 'CEO', pressurePoint: 'expansão europeia' }
                ],
                legalStrategy: {
                    preferredCourts: ['lisboa'],
                    avoidCourts: ['porto'],
                    successfulArguments: ['invoice_omission', 'commission_discrepancy'],
                    weakArguments: ['jurisdiction']
                }
            }
        };
        
        this.negotiationScripts = {
            bolt: [
                {
                    phase: 'initial',
                    script: `A discrepância apurada de {value} ({percentage}%) configura violação do Art. 36.º n.º 11 do CIVA e Art. 104.º RGIT. 
                             A Bolt detém o monopólio da emissão documental, pelo que a omissão é imputável exclusivamente à plataforma.`,
                    pressurePoints: ['reputação', 'regulatório']
                },
                {
                    phase: 'escalation',
                    script: `A não regularização no prazo de 15 dias implicará comunicação à ASAE, AT e ação judicial com pedido de 
                             tutela antecipada. O impacto reputacional será considerado na petição inicial.`,
                    pressurePoints: ['media_sensitive', 'regulatory_scrutiny']
                }
            ],
            uber: [
                {
                    phase: 'initial',
                    script: `A divergência entre o reporte DAC7 ({dac7}) e o valor efetivamente creditado ({real}) demonstra subdeclaração sistemática.`,
                    pressurePoints: ['public_pressure']
                },
                {
                    phase: 'escalation',
                    script: `A Uber tem histórico de ações coletivas em diversos países. Este caso tem potencial para se tornar um precedente relevante em Portugal.`,
                    pressurePoints: ['class_action_risk']
                }
            ]
        };
    }
    
    getPlatformProfile(platform) {
        return this.platforms[platform] || null;
    }
    
    getNegotiationStrategy(platform, caseData) {
        const profile = this.getPlatformProfile(platform);
        if (!profile) return null;
        
        const strategy = {
            platform: profile.name,
            estimatedSettlement: this.calculateSettlementValue(profile, caseData),
            recommendedApproach: this.getRecommendedApproach(profile, caseData),
            scripts: this.getNegotiationScripts(platform, caseData),
            pressurePoints: this.getPressurePoints(profile, caseData),
            timeline: this.getTimeline(profile, caseData),
            fallback: this.getFallbackStrategy(profile, caseData)
        };
        
        return strategy;
    }
    
    calculateSettlementValue(profile, caseData) {
        const baseValue = profile.avgSettlementValue;
        const valueFactor = Math.min(caseData.value / 20000, 1.5);
        const percentageFactor = caseData.omissionPercentage / 100;
        
        let settlement = baseValue * valueFactor * percentageFactor;
        
        // Ajuste por histórico
        if (caseData.hasPreviousComplaints) settlement *= 1.2;
        if (caseData.isHighProfileClient) settlement *= 1.3;
        
        return Math.min(settlement, caseData.value * 0.6);
    }
    
    getRecommendedApproach(profile, caseData) {
        const approaches = {
            bolt: {
                aggressive: caseData.omissionPercentage > 70,
                balanced: caseData.omissionPercentage > 40,
                conservative: true
            },
            uber: {
                aggressive: caseData.omissionPercentage > 80,
                balanced: caseData.omissionPercentage > 50,
                conservative: true
            },
            freenow: {
                aggressive: false,
                balanced: caseData.omissionPercentage > 60,
                conservative: true
            }
        };
        
        const approach = approaches[profile.name];
        
        if (approach.aggressive) return 'aggressive';
        if (approach.balanced) return 'balanced';
        return 'conservative';
    }
    
    getNegotiationScripts(platform, caseData) {
        const scripts = this.negotiationScripts[platform] || [];
        
        return scripts.map(script => ({
            phase: script.phase,
            text: this.renderScript(script.script, caseData),
            pressurePoints: script.pressurePoints
        }));
    }
    
    renderScript(template, data) {
        return template
            .replace('{value}', window.UNIFEDElite.formatCurrency(data.discrepancy))
            .replace('{percentage}', data.omissionPercentage.toFixed(1))
            .replace('{dac7}', window.UNIFEDElite.formatCurrency(data.dac7 || 0))
            .replace('{real}', window.UNIFEDElite.formatCurrency(data.ganhos || 0));
    }
    
    getPressurePoints(profile, caseData) {
        const points = [];
        
        for (const weakness of profile.weaknesses) {
            points.push({
                type: weakness,
                description: this.getWeaknessDescription(weakness),
                effectiveness: this.getEffectiveness(weakness, profile.name, caseData)
            });
        }
        
        return points.sort((a, b) => b.effectiveness - a.effectiveness);
    }
    
    getWeaknessDescription(weakness) {
        const descriptions = {
            regulatory_scrutiny: 'Plataforma sob escrutínio da ASAE e AT',
            media_sensitive: 'Sensibilidade a cobertura mediática negativa',
            class_action_risk: 'Risco de ação coletiva com múltiplos parceiros',
            public_pressure: 'Pressão pública sobre o modelo de negócio',
            market_share: 'Perda de quota de mercado em Portugal',
            local_operation: 'Operação local dependente de boa imagem',
            regulatory_history: 'Histórico de conflitos com autoridades'
        };
        return descriptions[weakness] || weakness;
    }
    
    getEffectiveness(weakness, platform, caseData) {
        const effectiveness = {
            bolt: {
                regulatory_scrutiny: 0.85,
                media_sensitive: 0.9,
                class_action_risk: 0.75
            },
            uber: {
                public_pressure: 0.9,
                class_action_risk: 0.85,
                regulatory_history: 0.8
            },
            freenow: {
                market_share: 0.7,
                local_operation: 0.8,
                regulatory_scrutiny: 0.6
            }
        };
        
        let base = effectiveness[platform]?.[weakness] || 0.5;
        
        // Ajustar por valor do caso
        if (caseData.value > 50000) base += 0.1;
        if (caseData.omissionPercentage > 80) base += 0.1;
        
        return Math.min(base, 0.95);
    }
    
    getTimeline(profile, caseData) {
        const baseTimeline = {
            bolt: { initial: 15, escalation: 30, litigation: 90 },
            uber: { initial: 20, escalation: 45, litigation: 120 },
            freenow: { initial: 10, escalation: 25, litigation: 75 }
        };
        
        const timeline = baseTimeline[profile.name];
        
        return {
            initialResponse: `${timeline.initial} dias para primeira resposta`,
            escalation: `${timeline.escalation} dias para ação judicial`,
            litigation: `${timeline.litigation} dias para julgamento (estimativa)`
        };
    }
    
    getFallbackStrategy(profile, caseData) {
        return {
            action: 'Ação judicial com pedido de tutela antecipada',
            arguments: [
                'Art. 103.º/104.º RGIT',
                'Art. 36.º n.º 11 CIVA',
                'Art. 125.º CPP',
                'Art. 344.º CC (inversão do ónus)'
            ],
            probability: caseData.omissionPercentage > 70 ? 0.75 : 0.55
        };
    }
}

// Instância global
window.PlatformIntelligence = new PlatformIntelligence();