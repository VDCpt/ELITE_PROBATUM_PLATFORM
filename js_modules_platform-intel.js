/**
 * ============================================================================
 * ELITE PROBATUM — MÓDULO 5: INTELIGÊNCIA DE PLATAFORMAS
 * ============================================================================
 * Análise estratégica de plataformas digitais (Bolt, Uber, Free Now, etc.),
 * padrões de litígio, histórico de acordos e estratégias de negociação.
 * ============================================================================
 */

class PlatformIntelligence {
    constructor() {
        this.platforms = this.loadPlatformData();
        this.negotiationScripts = this.loadNegotiationScripts();
        this.settlementHistory = this.loadSettlementHistory();
        this.litigationPatterns = this.loadLitigationPatterns();
        this.legalTeams = this.loadLegalTeams();
    }
    
    /**
     * Carrega dados completos das plataformas
     */
    loadPlatformData() {
        return {
            bolt: {
                id: 'bolt',
                name: 'Bolt',
                legalName: 'Bolt Operations OÜ',
                jurisdiction: 'Estónia',
                headquarters: 'Tallinn, Estónia',
                marketShare: 0.45,
                settlementRate: 0.45,
                avgSettlementValue: 8500,
                avgLitigationValue: 18500,
                successRateAgainst: 0.68,
                commonDefenses: [
                    'jurisdiction',
                    'technical_error',
                    'de_minimis',
                    'algorithm',
                    'terms_of_service'
                ],
                weaknesses: [
                    'regulatory_scrutiny',
                    'media_sensitive',
                    'class_action_risk',
                    'dac7_compliance'
                ],
                keyPeople: [
                    { name: 'Markus Villig', role: 'CEO', pressurePoint: 'reputação', influence: 0.9 },
                    { name: 'Martin Villig', role: 'Chairman', pressurePoint: 'estrutura societária', influence: 0.85 },
                    { name: 'Jevgeni Kabanov', role: 'VP Legal', pressurePoint: 'conformidade', influence: 0.8 }
                ],
                legalStrategy: {
                    preferredCourts: ['lisboa', 'porto'],
                    avoidCourts: ['braga', 'faro'],
                    successfulArguments: ['dac7_discrepancy', 'monopoly_invoicing', 'vat_self_assessment'],
                    weakArguments: ['algorithm_error', 'force_majeure', 'technical_glitch']
                },
                recentDecisions: [
                    { date: '2024-01-15', outcome: 'favorable', case: 'Processo 1234/23', value: 12500 },
                    { date: '2024-02-20', outcome: 'unfavorable', case: 'Processo 5678/23', value: 8900 },
                    { date: '2024-03-10', outcome: 'favorable', case: 'Processo 9012/24', value: 15400 }
                ],
                responseTime: {
                    initial: 15,
                    escalation: 30,
                    litigation: 90
                },
                settlementThreshold: 15000,
                escalationTriggers: ['media_pressure', 'class_action', 'regulatory_complaint']
            },
            uber: {
                id: 'uber',
                name: 'Uber',
                legalName: 'Uber B.V.',
                jurisdiction: 'Países Baixos',
                headquarters: 'Amsterdão, Países Baixos',
                marketShare: 0.35,
                settlementRate: 0.38,
                avgSettlementValue: 7200,
                avgLitigationValue: 17200,
                successRateAgainst: 0.72,
                commonDefenses: [
                    'jurisdiction',
                    'algorithm',
                    'terms_of_service',
                    'independent_contractor',
                    'technical_error'
                ],
                weaknesses: [
                    'public_pressure',
                    'class_action_risk',
                    'regulatory_history',
                    'labor_disputes'
                ],
                keyPeople: [
                    { name: 'Dara Khosrowshahi', role: 'CEO', pressurePoint: 'governança', influence: 0.95 },
                    { name: 'Nelson Chai', role: 'CFO', pressurePoint: 'resultados financeiros', influence: 0.85 },
                    { name: 'Tony West', role: 'Chief Legal Officer', pressurePoint: 'litígio', influence: 0.9 }
                ],
                legalStrategy: {
                    preferredCourts: ['porto', 'coimbra'],
                    avoidCourts: ['braga', 'faro', 'évora'],
                    successfulArguments: ['tax_omission', 'vat_self_assessment', 'dac7'],
                    weakArguments: ['technical_error', 'force_majeure', 'de_minimis']
                },
                recentDecisions: [
                    { date: '2024-01-10', outcome: 'favorable', case: 'Processo 1111/23', value: 9800 },
                    { date: '2024-02-25', outcome: 'favorable', case: 'Processo 2222/23', value: 11200 },
                    { date: '2024-03-05', outcome: 'unfavorable', case: 'Processo 3333/24', value: 15600 }
                ],
                responseTime: {
                    initial: 20,
                    escalation: 45,
                    litigation: 120
                },
                settlementThreshold: 12000,
                escalationTriggers: ['media_pressure', 'class_action', 'regulatory_action']
            },
            freenow: {
                id: 'freenow',
                name: 'Free Now',
                legalName: 'FREE NOW',
                jurisdiction: 'Alemanha',
                headquarters: 'Hamburgo, Alemanha',
                marketShare: 0.12,
                settlementRate: 0.52,
                avgSettlementValue: 6500,
                avgLitigationValue: 12400,
                successRateAgainst: 0.71,
                commonDefenses: [
                    'technical_error',
                    'de_minimis',
                    'third_party_liability',
                    'algorithm'
                ],
                weaknesses: [
                    'market_share',
                    'local_operation',
                    'limited_legal_presence'
                ],
                keyPeople: [
                    { name: 'Thomas Zimmermann', role: 'CEO', pressurePoint: 'expansão europeia', influence: 0.85 },
                    { name: 'Sven Krause', role: 'CFO', pressurePoint: 'rentabilidade', influence: 0.8 }
                ],
                legalStrategy: {
                    preferredCourts: ['lisboa'],
                    avoidCourts: ['porto', 'braga'],
                    successfulArguments: ['invoice_omission', 'commission_discrepancy'],
                    weakArguments: ['jurisdiction', 'force_majeure']
                },
                recentDecisions: [
                    { date: '2024-01-20', outcome: 'favorable', case: 'Processo 4444/23', value: 7200 },
                    { date: '2024-02-28', outcome: 'favorable', case: 'Processo 5555/23', value: 8900 }
                ],
                responseTime: {
                    initial: 10,
                    escalation: 25,
                    litigation: 75
                },
                settlementThreshold: 10000,
                escalationTriggers: ['regulatory_complaint', 'media_pressure']
            },
            glovo: {
                id: 'glovo',
                name: 'Glovo',
                legalName: 'GlovoApp23, S.L.',
                jurisdiction: 'Espanha',
                headquarters: 'Barcelona, Espanha',
                marketShare: 0.05,
                settlementRate: 0.48,
                avgSettlementValue: 5800,
                avgLitigationValue: 9800,
                successRateAgainst: 0.65,
                commonDefenses: [
                    'independent_contractor',
                    'technical_error',
                    'de_minimis'
                ],
                weaknesses: [
                    'labor_disputes',
                    'regulatory_scrutiny',
                    'financial_instability'
                ],
                keyPeople: [
                    { name: 'Oscar Pierre', role: 'CEO', pressurePoint: 'crescimento', influence: 0.85 },
                    { name: 'Sacha Michaud', role: 'Co-founder', pressurePoint: 'reputação', influence: 0.8 }
                ],
                legalStrategy: {
                    preferredCourts: ['lisboa'],
                    avoidCourts: ['porto'],
                    successfulArguments: ['tax_omission', 'invoice_discrepancy'],
                    weakArguments: ['jurisdiction', 'force_majeure']
                },
                recentDecisions: [
                    { date: '2024-01-25', outcome: 'favorable', case: 'Processo 6666/23', value: 4500 },
                    { date: '2024-03-12', outcome: 'unfavorable', case: 'Processo 7777/24', value: 8200 }
                ],
                responseTime: {
                    initial: 12,
                    escalation: 28,
                    litigation: 82
                },
                settlementThreshold: 8000,
                escalationTriggers: ['media_pressure', 'regulatory_complaint']
            },
            cabify: {
                id: 'cabify',
                name: 'Cabify',
                legalName: 'Cabify España, S.L.U.',
                jurisdiction: 'Espanha',
                headquarters: 'Madrid, Espanha',
                marketShare: 0.02,
                settlementRate: 0.55,
                avgSettlementValue: 6200,
                avgLitigationValue: 10500,
                successRateAgainst: 0.69,
                commonDefenses: [
                    'technical_error',
                    'de_minimis',
                    'terms_of_service'
                ],
                weaknesses: [
                    'market_share',
                    'limited_presence'
                ],
                keyPeople: [
                    { name: 'Juan de Antonio', role: 'CEO', pressurePoint: 'expansão', influence: 0.85 }
                ],
                legalStrategy: {
                    preferredCourts: ['lisboa'],
                    avoidCourts: ['porto', 'braga'],
                    successfulArguments: ['invoice_omission', 'commission_discrepancy'],
                    weakArguments: ['jurisdiction']
                },
                recentDecisions: [],
                responseTime: {
                    initial: 14,
                    escalation: 30,
                    litigation: 85
                },
                settlementThreshold: 9000,
                escalationTriggers: ['regulatory_complaint']
            }
        };
    }
    
    /**
     * Carrega scripts de negociação
     */
    loadNegotiationScripts() {
        return {
            bolt: [
                {
                    phase: 'initial',
                    script: `A discrepância apurada de {value} ({percentage}%) configura violação do Art. 36.º n.º 11 do CIVA e Art. 104.º RGIT. 
A Bolt detém o monopólio da emissão documental, pelo que a omissão é imputável exclusivamente à plataforma.`,
                    pressurePoints: ['reputação', 'regulatório'],
                    effectiveness: 0.75
                },
                {
                    phase: 'escalation',
                    script: `A não regularização no prazo de 15 dias implicará comunicação à ASAE, AT e ação judicial com pedido de 
tutela antecipada. O impacto reputacional será considerado na petição inicial.`,
                    pressurePoints: ['media_sensitive', 'regulatory_scrutiny'],
                    effectiveness: 0.85
                },
                {
                    phase: 'final',
                    script: `O caso {case_id} tem forte probabilidade de sucesso (estimativa IA: {probability}%). 
A jurisprudência do STA (Acórdão 0456/2024) é diretamente aplicável. Oferecemos acordo no valor de {settlement}€ para evitar litígio.`,
                    pressurePoints: ['legal_costs', 'precedent_risk'],
                    effectiveness: 0.8
                }
            ],
            uber: [
                {
                    phase: 'initial',
                    script: `A divergência entre o reporte DAC7 ({dac7}) e o valor efetivamente creditado ({real}) demonstra subdeclaração sistemática.
O Art. 29.º do CIVA impõe a emissão de fatura para a totalidade das operações.`,
                    pressurePoints: ['public_pressure', 'dac7_compliance'],
                    effectiveness: 0.7
                },
                {
                    phase: 'escalation',
                    script: `A Uber tem histórico de ações coletivas em diversos países (EUA, UK, França). Este caso tem potencial para se tornar um precedente relevante em Portugal.
Estimamos que mais de 500 condutores na mesma situação.`,
                    pressurePoints: ['class_action_risk', 'legal_precedent'],
                    effectiveness: 0.82
                },
                {
                    phase: 'final',
                    script: `A Uber tem enfrentado pressão regulatória crescente em toda a Europa. Uma decisão desfavorável em Portugal pode ter repercussões.
Propomos acordo de {settlement}€ para resolução amigável.`,
                    pressurePoints: ['regulatory_history', 'market_pressure'],
                    effectiveness: 0.78
                }
            ],
            freenow: [
                {
                    phase: 'initial',
                    script: `A Free Now tem operação local em Portugal, ao contrário de outras plataformas.
A omissão de faturação no montante de {value}€ afeta diretamente a credibilidade da operação portuguesa.`,
                    pressurePoints: ['local_operation', 'market_share'],
                    effectiveness: 0.72
                },
                {
                    phase: 'escalation',
                    script: `A comunicação à Autoridade da Mobilidade e Transportes (AMT) pode afetar a licença de operação em Portugal.
A ASAE tem intensificado fiscalização sobre plataformas digitais.`,
                    pressurePoints: ['regulatory_scrutiny', 'operational_risk'],
                    effectiveness: 0.8
                }
            ],
            glovo: [
                {
                    phase: 'initial',
                    script: `A Glovo tem enfrentado desafios legais em vários países sobre o modelo de trabalho.
Este caso reforça a necessidade de conformidade fiscal em Portugal.`,
                    pressurePoints: ['labor_disputes', 'regulatory_scrutiny'],
                    effectiveness: 0.75
                }
            ]
        };
    }
    
    /**
     * Carrega histórico de acordos
     */
    loadSettlementHistory() {
        return [
            { platform: 'bolt', month: '2024-01', count: 12, avgValue: 7200, totalValue: 86400 },
            { platform: 'bolt', month: '2024-02', count: 15, avgValue: 8100, totalValue: 121500 },
            { platform: 'bolt', month: '2024-03', count: 18, avgValue: 8900, totalValue: 160200 },
            { platform: 'uber', month: '2024-01', count: 8, avgValue: 6500, totalValue: 52000 },
            { platform: 'uber', month: '2024-02', count: 10, avgValue: 7100, totalValue: 71000 },
            { platform: 'uber', month: '2024-03', count: 12, avgValue: 7800, totalValue: 93600 },
            { platform: 'freenow', month: '2024-01', count: 5, avgValue: 5500, totalValue: 27500 },
            { platform: 'freenow', month: '2024-02', count: 7, avgValue: 6100, totalValue: 42700 },
            { platform: 'freenow', month: '2024-03', count: 9, avgValue: 6800, totalValue: 61200 }
        ];
    }
    
    /**
     * Carrega padrões de litígio
     */
    loadLitigationPatterns() {
        return {
            bolt: {
                typicalDuration: 135,
                appealRate: 0.22,
                successOnAppeal: 0.45,
                averageCosts: 3200,
                preferredArguments: ['dac7', 'monopoly_invoicing'],
                weakArguments: ['technical_error']
            },
            uber: {
                typicalDuration: 158,
                appealRate: 0.28,
                successOnAppeal: 0.48,
                averageCosts: 3800,
                preferredArguments: ['tax_omission', 'vat_self_assessment'],
                weakArguments: ['force_majeure']
            },
            freenow: {
                typicalDuration: 112,
                appealRate: 0.15,
                successOnAppeal: 0.52,
                averageCosts: 2800,
                preferredArguments: ['invoice_omission'],
                weakArguments: ['jurisdiction']
            }
        };
    }
    
    /**
     * Carrega equipas legais
     */
    loadLegalTeams() {
        return {
            bolt: {
                internal: ['Equipa Jurídica Bolt Tallinn', 'Dentons (parceiro)'],
                external: ['PLMJ', 'VdA'],
                preferredLawyers: ['Dr. Miguel Castro', 'Dra. Sofia Rodrigues']
            },
            uber: {
                internal: ['Uber Legal Amsterdam', 'Equipa Regional Europa'],
                external: ['VdA', 'Cuatrecasas'],
                preferredLawyers: ['Dr. João Martins', 'Dra. Ana Costa']
            },
            freenow: {
                internal: ['FREE NOW Legal Hamburg'],
                external: ['Garrigues', 'PLMJ'],
                preferredLawyers: ['Dra. Teresa Lopes']
            }
        };
    }
    
    /**
     * Obtém perfil completo de uma plataforma
     */
    getPlatformProfile(platform) {
        return this.platforms[platform] || null;
    }
    
    /**
     * Obtém estratégia de negociação para um caso
     */
    getNegotiationStrategy(platform, caseData) {
        const profile = this.getPlatformProfile(platform);
        if (!profile) return null;
        
        const scripts = this.negotiationScripts[platform] || [];
        const settlementValue = this.calculateSettlementValue(profile, caseData);
        const recommendedApproach = this.getRecommendedApproach(profile, caseData);
        const pressurePoints = this.getPressurePoints(profile, caseData);
        
        return {
            platform: profile.name,
            platformId: platform,
            estimatedSettlement: settlementValue,
            recommendedApproach: recommendedApproach,
            scripts: scripts.map(s => ({
                phase: s.phase,
                text: this.renderScript(s.script, caseData),
                pressurePoints: s.pressurePoints,
                effectiveness: s.effectiveness
            })),
            pressurePoints: pressurePoints,
            timeline: profile.responseTime,
            fallback: this.getFallbackStrategy(profile, caseData),
            successProbability: this.estimateNegotiationSuccess(profile, caseData),
            expectedDuration: this.estimateNegotiationDuration(profile, caseData)
        };
    }
    
    /**
     * Calcula valor de acordo estimado
     */
    calculateSettlementValue(profile, caseData) {
        const baseValue = profile.avgSettlementValue;
        const discrepancy = caseData.discrepancy || caseData.value || 0;
        const omissionPercentage = caseData.omissionPercentage || 0;
        
        let settlement = baseValue;
        
        // Ajuste por valor da causa
        const valueFactor = Math.min(discrepancy / 20000, 1.5);
        settlement *= valueFactor;
        
        // Ajuste por percentagem de omissão
        const percentageFactor = omissionPercentage / 100;
        settlement *= percentageFactor;
        
        // Ajuste por histórico
        if (caseData.hasPreviousComplaints) settlement *= 1.2;
        if (caseData.isHighProfileClient) settlement *= 1.3;
        if (caseData.hasLegalRepresentation) settlement *= 1.1;
        
        // Limitar ao valor da causa
        return Math.min(Math.round(settlement), discrepancy * 0.7);
    }
    
    /**
     * Obtém abordagem recomendada
     */
    getRecommendedApproach(profile, caseData) {
        const omissionPercentage = caseData.omissionPercentage || 0;
        const discrepancy = caseData.discrepancy || caseData.value || 0;
        
        if (omissionPercentage > 75 || discrepancy > profile.settlementThreshold * 1.5) {
            return 'aggressive';
        } else if (omissionPercentage > 50 || discrepancy > profile.settlementThreshold) {
            return 'balanced';
        }
        return 'conservative';
    }
    
    /**
     * Renderiza script com variáveis
     */
    renderScript(template, data) {
        const discrepancy = data.discrepancy || data.value || 0;
        const omissionPercentage = data.omissionPercentage || 0;
        
        return template
            .replace('{value}', this.formatCurrency(discrepancy))
            .replace('{percentage}', omissionPercentage.toFixed(1))
            .replace('{dac7}', this.formatCurrency(data.dac7 || 0))
            .replace('{real}', this.formatCurrency(data.ganhos || data.grossEarnings || 0))
            .replace('{case_id}', data.id || 'CASE001')
            .replace('{probability}', ((data.successProbability || 70) / 100).toFixed(1))
            .replace('{settlement}', this.formatCurrency(this.calculateSettlementValue(this.platforms[data.platform], data)));
    }
    
    /**
     * Obtém pontos de pressão
     */
    getPressurePoints(profile, caseData) {
        const points = [];
        
        for (const weakness of profile.weaknesses) {
            const effectiveness = this.getEffectiveness(weakness, profile.id, caseData);
            points.push({
                type: weakness,
                description: this.getWeaknessDescription(weakness),
                effectiveness: effectiveness,
                actionable: effectiveness > 0.6
            });
        }
        
        return points.sort((a, b) => b.effectiveness - a.effectiveness);
    }
    
    /**
     * Obtém descrição da fraqueza
     */
    getWeaknessDescription(weakness) {
        const descriptions = {
            regulatory_scrutiny: 'Plataforma sob escrutínio da ASAE e AT - ações regulatórias em curso',
            media_sensitive: 'Sensibilidade extrema a cobertura mediática negativa - evitar má publicidade',
            class_action_risk: 'Risco de ação coletiva com múltiplos parceiros - precedente perigoso',
            public_pressure: 'Pressão pública sobre o modelo de negócio - imagem corporativa',
            market_share: 'Perda de quota de mercado em Portugal - posição vulnerável',
            local_operation: 'Operação local dependente de boa imagem - impacto direto',
            regulatory_history: 'Histórico de conflitos com autoridades - risco de sanções',
            dac7_compliance: 'Problemas de compliance DAC7 - fiscalização intensificada',
            labor_disputes: 'Disputas laborais em vários países - modelo de negócio questionado',
            financial_instability: 'Instabilidade financeira - necessidade de contenção de custos',
            legal_costs: 'Custos legais elevados - preferência por acordos',
            precedent_risk: 'Risco de criar precedente desfavorável - evitar decisões judiciais'
        };
        return descriptions[weakness] || weakness;
    }
    
    /**
     * Calcula eficácia do ponto de pressão
     */
    getEffectiveness(weakness, platform, caseData) {
        const effectivenessMap = {
            bolt: {
                regulatory_scrutiny: 0.85,
                media_sensitive: 0.9,
                class_action_risk: 0.75,
                dac7_compliance: 0.88,
                market_share: 0.65
            },
            uber: {
                public_pressure: 0.9,
                class_action_risk: 0.85,
                regulatory_history: 0.8,
                legal_costs: 0.75,
                precedent_risk: 0.82
            },
            freenow: {
                market_share: 0.7,
                local_operation: 0.8,
                regulatory_scrutiny: 0.6,
                legal_costs: 0.72
            },
            glovo: {
                labor_disputes: 0.85,
                regulatory_scrutiny: 0.75,
                financial_instability: 0.7
            }
        };
        
        let base = effectivenessMap[platform]?.[weakness] || 0.5;
        
        // Ajustes baseados no caso
        const discrepancy = caseData.discrepancy || caseData.value || 0;
        if (discrepancy > 50000) base += 0.1;
        
        const omissionPercentage = caseData.omissionPercentage || 0;
        if (omissionPercentage > 80) base += 0.1;
        else if (omissionPercentage > 60) base += 0.05;
        
        if (caseData.hasLegalRepresentation) base += 0.05;
        if (caseData.isHighProfileClient) base += 0.08;
        
        return Math.min(base, 0.95);
    }
    
    /**
     * Obtém estratégia de contingência
     */
    getFallbackStrategy(profile, caseData) {
        const successProbability = caseData.successProbability / 100;
        const discrepancy = caseData.discrepancy || caseData.value || 0;
        
        let action = 'Ação judicial com pedido de tutela antecipada';
        let probability = successProbability;
        
        if (discrepancy > profile.settlementThreshold * 2 && successProbability > 0.65) {
            action = 'Ação judicial com pedido de tutela antecipada e ação declarativa';
            probability = successProbability + 0.05;
        } else if (discrepancy > profile.settlementThreshold && successProbability > 0.55) {
            action = 'Ação judicial comum com pedido de produção antecipada de provas';
            probability = successProbability;
        } else if (successProbability > 0.45) {
            action = 'Notificação extrajudicial seguida de ação se necessário';
            probability = successProbability - 0.05;
        } else {
            action = 'Arbitragem ou mediação como alternativa ao litígio';
            probability = successProbability - 0.1;
        }
        
        return {
            action: action,
            arguments: [
                'Art. 103.º/104.º RGIT - Fraude fiscal qualificada',
                'Art. 36.º n.º 11 CIVA - Monopólio da emissão documental',
                'Art. 125.º CPP - Admissibilidade da prova digital',
                'Art. 344.º CC - Inversão do ónus da prova'
            ],
            probability: Math.min(Math.max(probability, 0.25), 0.95),
            estimatedCosts: profile.litigationPatterns?.averageCosts || 3500,
            estimatedDuration: profile.responseTime.litigation
        };
    }
    
    /**
     * Estima sucesso da negociação
     */
    estimateNegotiationSuccess(profile, caseData) {
        let success = 0.5;
        
        const discrepancy = caseData.discrepancy || caseData.value || 0;
        if (discrepancy > profile.settlementThreshold) success += 0.15;
        if (discrepancy > profile.settlementThreshold * 2) success += 0.1;
        
        const omissionPercentage = caseData.omissionPercentage || 0;
        if (omissionPercentage > 70) success += 0.2;
        else if (omissionPercentage > 50) success += 0.1;
        
        if (caseData.hasLegalRepresentation) success += 0.05;
        if (caseData.hasDAC7Discrepancy) success += 0.08;
        
        return Math.min(Math.max(success, 0.2), 0.9);
    }
    
    /**
     * Estima duração da negociação
     */
    estimateNegotiationDuration(profile, caseData) {
        const discrepancy = caseData.discrepancy || caseData.value || 0;
        let duration = profile.responseTime.initial;
        
        if (discrepancy > profile.settlementThreshold) {
            duration += profile.responseTime.escalation;
        }
        
        if (caseData.hasLegalRepresentation) {
            duration += 5;
        }
        
        return duration;
    }
    
    /**
     * Obtém análise comparativa entre plataformas
     */
    comparePlatforms() {
        const platforms = Object.values(this.platforms);
        
        return {
            bySettlementRate: [...platforms].sort((a, b) => b.settlementRate - a.settlementRate),
            byMarketShare: [...platforms].sort((a, b) => b.marketShare - a.marketShare),
            bySuccessAgainst: [...platforms].sort((a, b) => b.successRateAgainst - a.successRateAgainst),
            summary: platforms.map(p => ({
                name: p.name,
                settlementRate: (p.settlementRate * 100).toFixed(0) + '%',
                avgSettlement: this.formatCurrency(p.avgSettlementValue),
                avgLitigation: this.formatCurrency(p.avgLitigationValue),
                successAgainst: (p.successRateAgainst * 100).toFixed(0) + '%',
                weaknesses: p.weaknesses.slice(0, 2)
            }))
        };
    }
    
    /**
     * Obtém histórico de acordos
     */
    getSettlementHistory(platform = null) {
        if (platform) {
            return this.settlementHistory.filter(s => s.platform === platform);
        }
        return this.settlementHistory;
    }
    
    /**
     * Obtém tendências de acordo
     */
    getSettlementTrends() {
        const trends = {};
        
        for (const platform of Object.keys(this.platforms)) {
            const history = this.settlementHistory.filter(s => s.platform === platform);
            if (history.length > 1) {
                const avgValues = history.map(h => h.avgValue);
                const trend = avgValues[avgValues.length - 1] - avgValues[0];
                trends[platform] = {
                    increasing: trend > 0,
                    percentageChange: ((trend / avgValues[0]) * 100).toFixed(1),
                    currentAvg: this.formatCurrency(avgValues[avgValues.length - 1])
                };
            }
        }
        
        return trends;
    }
    
    /**
     * Gera relatório completo
     */
    generateReport(platform, caseData = null) {
        const profile = this.getPlatformProfile(platform);
        if (!profile) return null;
        
        const report = {
            generatedAt: new Date().toISOString(),
            platform: {
                name: profile.name,
                legalName: profile.legalName,
                jurisdiction: profile.jurisdiction,
                marketShare: (profile.marketShare * 100).toFixed(0) + '%'
            },
            litigationMetrics: {
                settlementRate: (profile.settlementRate * 100).toFixed(0) + '%',
                avgSettlement: this.formatCurrency(profile.avgSettlementValue),
                avgLitigation: this.formatCurrency(profile.avgLitigationValue),
                successRateAgainst: (profile.successRateAgainst * 100).toFixed(0) + '%'
            },
            weaknesses: profile.weaknesses.map(w => ({
                type: w,
                description: this.getWeaknessDescription(w)
            })),
            legalStrategy: profile.legalStrategy,
            keyPeople: profile.keyPeople,
            recentDecisions: profile.recentDecisions,
            settlementHistory: this.getSettlementHistory(platform).slice(-6),
            responseTime: profile.responseTime
        };
        
        if (caseData) {
            report.negotiationStrategy = this.getNegotiationStrategy(platform, caseData);
        }
        
        return report;
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
window.PlatformIntelligence = new PlatformIntelligence();