/**
 * ============================================================================
 * ELITE PROBATUM — MÓDULO 8: INTELIGÊNCIA ESTRATÉGICA
 * ============================================================================
 * Monitorização de decisões judiciais, análise da concorrência,
 * identificação de oportunidades de mercado e relatórios de tendências.
 * ============================================================================
 */

class MarketIntelligence {
    constructor() {
        this.monitors = [];
        this.alerts = [];
        this.reports = [];
        this.competitors = this.loadCompetitors();
        this.courtDecisions = this.loadCourtDecisions();
        this.marketTrends = this.loadMarketTrends();
        this.regulatoryUpdates = this.loadRegulatoryUpdates();
        this.mediaMentions = this.loadMediaMentions();
        this.initialized = false;
        
        this.startMonitoring();
    }
    
    /**
     * Carrega dados dos concorrentes
     */
    loadCompetitors() {
        return [
            {
                id: 'plmj',
                name: 'PLMJ',
                type: 'Full Service',
                size: 300,
                foundingYear: 1967,
                offices: ['Lisboa', 'Porto', 'Faro', 'Luanda', 'Maputo'],
                focusAreas: ['Fiscal', 'Litígio', 'Corporate', 'Arbitragem', 'M&A'],
                recentCases: 12,
                successRate: 0.68,
                keyLawyers: ['Dr. Miguel Castro', 'Dra. Sofia Rodrigues', 'Dr. Luís Pais de Sousa'],
                marketShare: 0.25,
                revenue: 85000000,
                growth: 0.08,
                strengths: ['Rede internacional', 'Departamento fiscal robusto'],
                weaknesses: ['Resposta lenta em litígio de massa', 'Honorários elevados'],
                recentNews: ['Novo sócio na área fiscal', 'Expansão para o mercado angolano']
            },
            {
                id: 'vda',
                name: 'VdA',
                type: 'Full Service',
                size: 280,
                foundingYear: 1976,
                offices: ['Lisboa', 'Porto', 'Maputo', 'São Paulo'],
                focusAreas: ['Fiscal', 'Arbitragem', 'Regulatório', 'Banking', 'Energy'],
                recentCases: 10,
                successRate: 0.72,
                keyLawyers: ['Dr. João Martins', 'Dra. Ana Costa', 'Dr. Pedro Ferreira'],
                marketShare: 0.23,
                revenue: 78000000,
                growth: 0.09,
                strengths: ['Arbitragem de excelência', 'Setor energético'],
                weaknesses: ['Menor presença no norte', 'Rotatividade de associados'],
                recentNews: ['Vitória em arbitragem internacional', 'Novo managing partner']
            },
            {
                id: 'cuatrecasas',
                name: 'Cuatrecasas',
                type: 'Iberian',
                size: 200,
                foundingYear: 1917,
                offices: ['Lisboa', 'Porto', 'Madrid', 'Barcelona', 'São Paulo'],
                focusAreas: ['Fiscal', 'Litígio', 'M&A', 'Imobiliário'],
                recentCases: 8,
                successRate: 0.65,
                keyLawyers: ['Dr. Pedro Almeida', 'Dra. Marta Costa', 'Dr. João Garcia'],
                marketShare: 0.18,
                revenue: 62000000,
                growth: 0.06,
                strengths: ['Rede ibérica forte', 'Cultura de serviço'],
                weaknesses: ['Decisões centralizadas', 'Adaptação lenta a inovação'],
                recentNews: ['Integração de equipa de fiscal', 'Abertura de escritório no Porto']
            },
            {
                id: 'garrigues',
                name: 'Garrigues',
                type: 'Iberian',
                size: 180,
                foundingYear: 1941,
                offices: ['Lisboa', 'Madrid', 'Barcelona', 'Valência'],
                focusAreas: ['Fiscal', 'Processual', 'Comercial', 'Laboral'],
                recentCases: 7,
                successRate: 0.62,
                keyLawyers: ['Dra. Teresa Lopes', 'Dr. Rui Silva', 'Dra. Carla Mendes'],
                marketShare: 0.15,
                revenue: 54000000,
                growth: 0.05,
                strengths: ['Presença consolidada', 'Departamento fiscal'],
                weaknesses: ['Inovação limitada', 'Recursos humanos'],
                recentNews: ['Reestruturação da equipa de litígio', 'Parceria com startup legal tech']
            },
            {
                id: 'abreu',
                name: 'Abreu Advogados',
                type: 'Full Service',
                size: 150,
                foundingYear: 1988,
                offices: ['Lisboa', 'Porto', 'Funchal', 'Luanda'],
                focusAreas: ['Corporate', 'Fiscal', 'Litígio', 'Laboral'],
                recentCases: 6,
                successRate: 0.64,
                keyLawyers: ['Dr. José Miguel', 'Dra. Susana Estêvão'],
                marketShare: 0.10,
                revenue: 42000000,
                growth: 0.07,
                strengths: ['Relação com clientes', 'Equipa jovem'],
                weaknesses: ['Menor dimensão', 'Recursos limitados'],
                recentNews: ['Novo escritório no Porto', 'Expansão da área fiscal']
            },
            {
                id: 'morais_leitao',
                name: 'Morais Leitão',
                type: 'Full Service',
                size: 120,
                foundingYear: 1960,
                offices: ['Lisboa', 'Porto', 'Luanda'],
                focusAreas: ['Corporate', 'Litígio', 'Fiscal', 'Bancário'],
                recentCases: 5,
                successRate: 0.66,
                keyLawyers: ['Dr. Nuno Galvão Teles', 'Dra. Maria José'],
                marketShare: 0.09,
                revenue: 38000000,
                growth: 0.04,
                strengths: ['Tradição', 'Relações institucionais'],
                weaknesses: ['Estrutura tradicional', 'Inovação'],
                recentNews: ['Novo sócio na área de litígio', 'Parceria com escritório angolano']
            }
        ];
    }
    
    /**
     * Carrega decisões judiciais
     */
    loadCourtDecisions() {
        return [
            {
                id: 'STA_01080_2023',
                court: 'STA',
                date: '2023-09-27',
                caseNumber: '01080/17.3BELRS',
                summary: 'Plataforma falha no reporte DAC7 configura omissão tributária',
                fullText: '...',
                relevance: 0.92,
                outcome: 'favorable',
                impact: 'high',
                tags: ['DAC7', 'plataforma', 'omissão', 'reporte'],
                area: 'fiscal',
                judge: 'Dr. António Costa',
                link: '#'
            },
            {
                id: 'STA_0456_2024',
                court: 'STA',
                date: '2024-03-14',
                caseNumber: '0456/19.8BEPRT',
                summary: 'Discrepância entre extrato e fatura é preço de transferência dissimulado',
                fullText: '...',
                relevance: 0.95,
                outcome: 'favorable',
                impact: 'high',
                tags: ['preço_transferência', 'comissões', 'dissimulação', 'extrato'],
                area: 'fiscal',
                judge: 'Dra. Sofia Mendes',
                link: '#'
            },
            {
                id: 'TCA_0237_2023',
                court: 'TCA Sul',
                date: '2023-11-08',
                caseNumber: '0237/21.5BELRS',
                summary: 'Prova digital com hash SHA-256 é admissível nos termos do Art. 125 CPP',
                fullText: '...',
                relevance: 0.88,
                outcome: 'favorable',
                impact: 'medium',
                tags: ['prova_digital', 'hash', 'admissibilidade', 'SHA-256'],
                area: 'processual',
                judge: 'Dr. Pedro Martins',
                link: '#'
            },
            {
                id: 'STA_0891_2024',
                court: 'STA',
                date: '2024-05-22',
                caseNumber: '0891/20.0BESNT',
                summary: 'Reincidência de omissões configura dolo para fraude fiscal qualificada',
                fullText: '...',
                relevance: 0.91,
                outcome: 'favorable',
                impact: 'high',
                tags: ['reincidência', 'dolo', 'fraude_qualificada', 'RGIT'],
                area: 'fiscal',
                judge: 'Dr. Ricardo Alves',
                link: '#'
            },
            {
                id: 'CAAD_01234_2025',
                court: 'CAAD',
                date: '2025-01-15',
                caseNumber: '01234/22.7BELRS',
                summary: 'Regularização Art. 78 CIVA é obrigatória quando há omissão',
                fullText: '...',
                relevance: 0.85,
                outcome: 'favorable',
                impact: 'medium',
                tags: ['regularização', 'CIVA_78', 'omissão', 'IVA'],
                area: 'fiscal',
                judge: 'Dr. Pedro Santos',
                link: '#'
            },
            {
                id: 'STA_1122_2024',
                court: 'STA',
                date: '2024-08-30',
                caseNumber: '1122/20.3BELRS',
                summary: 'Inversão do ónus da prova aplicável quando plataforma detém monopólio da informação',
                fullText: '...',
                relevance: 0.89,
                outcome: 'favorable',
                impact: 'high',
                tags: ['inversão_ónus', 'prova', 'monopólio', 'Art_344_CC'],
                area: 'processual',
                judge: 'Dr. António Costa',
                link: '#'
            },
            {
                id: 'TCA_0456_2024',
                court: 'TCA Norte',
                date: '2024-07-18',
                caseNumber: '0456/21.1BEPRT',
                summary: 'Despedimento ilícito de trabalhador de plataforma digital',
                fullText: '...',
                relevance: 0.82,
                outcome: 'favorable',
                impact: 'medium',
                tags: ['despedimento', 'plataforma', 'laboral', 'vínculo'],
                area: 'laboral',
                judge: 'Dra. Teresa Lopes',
                link: '#'
            }
        ];
    }
    
    /**
     * Carrega tendências de mercado
     */
    loadMarketTrends() {
        return {
            platforms: {
                bolt: { marketShare: 0.45, growth: 0.12, litigationRate: 0.32, avgCaseValue: 18500, driverCount: 25000 },
                uber: { marketShare: 0.35, growth: 0.08, litigationRate: 0.28, avgCaseValue: 17200, driverCount: 19500 },
                freenow: { marketShare: 0.12, growth: 0.05, litigationRate: 0.15, avgCaseValue: 12400, driverCount: 6700 },
                glovo: { marketShare: 0.05, growth: 0.20, litigationRate: 0.22, avgCaseValue: 9800, driverCount: 2800 },
                others: { marketShare: 0.03, growth: 0.15, litigationRate: 0.10, avgCaseValue: 7500, driverCount: 1700 }
            },
            courts: {
                lisboa: { casesFiled: 45, successRate: 0.62, avgDuration: 135, judgeCount: 12, favorableRate: 0.58 },
                porto: { casesFiled: 38, successRate: 0.68, avgDuration: 110, judgeCount: 10, favorableRate: 0.65 },
                braga: { casesFiled: 25, successRate: 0.55, avgDuration: 125, judgeCount: 8, favorableRate: 0.52 },
                coimbra: { casesFiled: 22, successRate: 0.58, avgDuration: 140, judgeCount: 9, favorableRate: 0.55 },
                faro: { casesFiled: 18, successRate: 0.61, avgDuration: 130, judgeCount: 7, favorableRate: 0.60 }
            },
            sectors: {
                tvde: { totalCases: 380, avgValue: 18500, successRate: 0.64, growth: 0.12, marketPotential: 0.85 },
                ecommerce: { totalCases: 125, avgValue: 12400, successRate: 0.58, growth: 0.08, marketPotential: 0.70 },
                delivery: { totalCases: 95, avgValue: 8900, successRate: 0.61, growth: 0.15, marketPotential: 0.75 },
                hospitality: { totalCases: 210, avgValue: 11200, successRate: 0.59, growth: 0.06, marketPotential: 0.65 }
            },
            quarters: [
                { quarter: 'Q1 2024', cases: 85, revenue: 245000, successRate: 0.68 },
                { quarter: 'Q2 2024', cases: 98, revenue: 312000, successRate: 0.71 },
                { quarter: 'Q3 2024', cases: 112, revenue: 398000, successRate: 0.73 },
                { quarter: 'Q4 2024', cases: 128, revenue: 452000, successRate: 0.74 }
            ],
            forecasts: {
                q1_2025: { cases: 142, revenue: 510000, growth: 0.11 },
                q2_2025: { cases: 158, revenue: 575000, growth: 0.13 },
                q3_2025: { cases: 175, revenue: 645000, growth: 0.12 },
                q4_2025: { cases: 195, revenue: 720000, growth: 0.12 }
            }
        };
    }
    
    /**
     * Carrega atualizações regulatórias
     */
    loadRegulatoryUpdates() {
        return [
            {
                id: 'REG_001',
                date: '2024-10-15',
                title: 'Nova diretiva DAC7 - Prazo de reporte alargado',
                summary: 'A UE alargou o prazo para reporte DAC7 até 31 de janeiro de 2025',
                source: 'UE',
                impact: 'medium',
                area: 'fiscal',
                actionRequired: 'Atualizar procedimentos de reporte',
                deadline: '2025-01-31'
            },
            {
                id: 'REG_002',
                date: '2024-11-01',
                title: 'Lei dos Motoristas de Plataforma',
                summary: 'Nova lei estabelece presunção de vínculo laboral para motoristas TVDE',
                source: 'AR',
                impact: 'high',
                area: 'laboral',
                actionRequired: 'Revisar estratégia de litígio laboral',
                deadline: '2025-03-01'
            },
            {
                id: 'REG_003',
                date: '2024-09-20',
                title: 'Alteração ao RGIT - Novos limites de fraude qualificada',
                summary: 'Limiar de fraude fiscal qualificada alterado para €20.000',
                source: 'AR',
                impact: 'medium',
                area: 'fiscal',
                actionRequired: 'Atualizar análise de casos',
                deadline: '2024-12-01'
            }
        ];
    }
    
    /**
     * Carrega menções na media
     */
    loadMediaMentions() {
        return [
            {
                id: 'MEDIA_001',
                date: '2024-11-10',
                title: 'ELITE PROBATUM vence caso inédito contra plataforma digital',
                outlet: 'Jornal de Negócios',
                summary: 'Tribunal reconhece validade da prova digital com hash SHA-256',
                sentiment: 'positive',
                reach: 'high',
                link: '#'
            },
            {
                id: 'MEDIA_002',
                date: '2024-10-25',
                title: 'PLMJ anuncia nova área de tecnologia e inovação',
                outlet: 'Economico',
                summary: 'Escritório concorrente investe em legal tech',
                sentiment: 'neutral',
                reach: 'medium',
                link: '#'
            },
            {
                id: 'MEDIA_003',
                date: '2024-11-05',
                title: 'VdA lidera ranking de arbitragem em Portugal',
                outlet: 'Expresso',
                summary: 'Escritório vence 12 arbitragens internacionais',
                sentiment: 'neutral',
                reach: 'high',
                link: '#'
            }
        ];
    }
    
    /**
     * Inicia monitorização
     */
    startMonitoring() {
        // Monitorizar novas decisões (simulado a cada 6 horas)
        setInterval(() => {
            this.checkNewDecisions();
        }, 6 * 60 * 60 * 1000);
        
        // Monitorizar concorrentes (simulado a cada 12 horas)
        setInterval(() => {
            this.checkCompetitorMovements();
        }, 12 * 60 * 60 * 1000);
        
        // Monitorizar tendências de mercado (simulado a cada 24 horas)
        setInterval(() => {
            this.updateMarketTrends();
        }, 24 * 60 * 60 * 1000);
        
        console.log('[ELITE] Market Intelligence iniciado');
    }
    
    /**
     * Verifica novas decisões
     */
    async checkNewDecisions() {
        console.log('[ELITE] Verificando novas decisões judiciais...');
        
        // Simular nova decisão
        const hasNew = Math.random() < 0.3;
        if (hasNew) {
            const newDecision = {
                id: `NEW_${Date.now()}`,
                court: ['STA', 'TCA Sul', 'TCA Norte', 'CAAD'][Math.floor(Math.random() * 4)],
                date: new Date().toISOString().slice(0, 10),
                caseNumber: `XXXX/${Math.floor(Math.random() * 100)}/${Math.floor(Math.random() * 100)}`,
                summary: 'Nova decisão relevante sobre litígio com plataformas digitais',
                relevance: 0.75 + Math.random() * 0.2,
                outcome: Math.random() > 0.3 ? 'favorable' : 'unfavorable',
                impact: Math.random() > 0.6 ? 'high' : 'medium',
                tags: ['plataforma', 'DAC7', 'prova_digital'],
                area: 'fiscal'
            };
            
            this.courtDecisions.unshift(newDecision);
            this.createAlert('new_decision', newDecision);
        }
    }
    
    /**
     * Verifica movimentos da concorrência
     */
    checkCompetitorMovements() {
        const competitor = this.competitors[Math.floor(Math.random() * this.competitors.length)];
        const actions = ['nova_contratação', 'novo_escritório', 'nova_área', 'parceria', 'aquisição'];
        const action = actions[Math.floor(Math.random() * actions.length)];
        
        const movement = {
            competitor: competitor.name,
            action: action,
            date: new Date().toISOString(),
            impact: Math.random() > 0.7 ? 'high' : 'medium'
        };
        
        this.createAlert('competitor_movement', movement);
    }
    
    /**
     * Atualiza tendências de mercado
     */
    updateMarketTrends() {
        // Simular atualização de tendências
        for (const platform in this.marketTrends.platforms) {
            const fluctuation = (Math.random() - 0.5) * 0.03;
            this.marketTrends.platforms[platform].marketShare += fluctuation;
            this.marketTrends.platforms[platform].marketShare = Math.max(0.01, Math.min(0.6, this.marketTrends.platforms[platform].marketShare));
            
            const growthFluctuation = (Math.random() - 0.5) * 0.02;
            this.marketTrends.platforms[platform].growth += growthFluctuation;
        }
    }
    
    /**
     * Cria alerta
     */
    createAlert(type, data) {
        const alert = {
            id: `ALERT_${Date.now()}`,
            type: type,
            createdAt: new Date().toISOString(),
            data: data,
            read: false,
            severity: this.getAlertSeverity(type, data)
        };
        
        this.alerts.unshift(alert);
        
        // Notificar
        if (window.EliteUtils) {
            window.EliteUtils.showToast(this.getAlertMessage(type, data), this.getAlertSeverity(type, data));
        }
        
        // Emitir evento
        window.dispatchEvent(new CustomEvent('marketIntelligenceAlert', { detail: alert }));
        
        return alert;
    }
    
    /**
     * Obtém severidade do alerta
     */
    getAlertSeverity(type, data) {
        if (type === 'new_decision' && data.impact === 'high') return 'error';
        if (type === 'competitor_movement' && data.impact === 'high') return 'warning';
        if (type === 'market_opportunity') return 'success';
        return 'info';
    }
    
    /**
     * Obtém mensagem do alerta
     */
    getAlertMessage(type, data) {
        const messages = {
            new_decision: `📜 Nova decisão: ${data.court} - ${data.summary.substring(0, 60)}...`,
            competitor_movement: `🏢 Movimento concorrência: ${data.competitor} - ${this.getActionName(data.action)}`,
            market_opportunity: `💡 Oportunidade: ${data.description}`,
            regulatory_change: `⚖️ Mudança regulatória: ${data.title}`
        };
        return messages[type] || 'Novo alerta de inteligência de mercado';
    }
    
    /**
     * Obtém nome da ação
     */
    getActionName(action) {
        const names = {
            nova_contratação: 'Nova contratação de sócio',
            novo_escritório: 'Abertura de novo escritório',
            nova_área: 'Criação de nova área de prática',
            parceria: 'Nova parceria estratégica',
            aquisição: 'Aquisição de escritório'
        };
        return names[action] || action;
    }
    
    /**
     * Gera relatório de inteligência
     */
    async getIntelligenceReport(period = 'monthly') {
        const report = {
            period: period,
            generatedAt: new Date().toISOString(),
            summary: this.generateSummary(),
            decisions: this.analyzeDecisions(period),
            competitors: this.analyzeCompetitors(),
            opportunities: this.identifyOpportunities(),
            threats: this.identifyThreats(),
            recommendations: this.generateRecommendations(),
            trends: this.getMarketTrends(),
            regulatory: this.getRegulatoryUpdates(),
            media: this.getMediaMentions()
        };
        
        this.reports.push(report);
        
        return report;
    }
    
    /**
     * Gera sumário executivo
     */
    generateSummary() {
        const recentDecisions = this.courtDecisions.slice(0, 10);
        const favorableDecisions = recentDecisions.filter(d => d.outcome === 'favorable').length;
        const favorableRate = (favorableDecisions / recentDecisions.length) * 100;
        
        const topCompetitor = this.competitors.sort((a, b) => b.marketShare - a.marketShare)[0];
        const marketMomentum = this.calculateMarketMomentum();
        
        return {
            totalDecisionsAnalyzed: this.courtDecisions.length,
            favorableRate: favorableRate.toFixed(1),
            emergingTrends: this.identifyEmergingTrends(),
            marketMomentum: marketMomentum,
            topCompetitor: topCompetitor.name,
            marketShareLead: (topCompetitor.marketShare * 100).toFixed(0),
            opportunitiesCount: this.identifyOpportunities().length,
            threatsCount: this.identifyThreats().length
        };
    }
    
    /**
     * Analisa decisões
     */
    analyzeDecisions(period) {
        const cutoff = new Date();
        if (period === 'monthly') cutoff.setMonth(cutoff.getMonth() - 1);
        else if (period === 'quarterly') cutoff.setMonth(cutoff.getMonth() - 3);
        else if (period === 'yearly') cutoff.setFullYear(cutoff.getFullYear() - 1);
        
        const recentDecisions = this.courtDecisions.filter(d => new Date(d.date) >= cutoff);
        
        const byCourt = {};
        const byArea = {};
        const byTag = {};
        
        for (const d of recentDecisions) {
            byCourt[d.court] = (byCourt[d.court] || 0) + 1;
            byArea[d.area] = (byArea[d.area] || 0) + 1;
            for (const tag of d.tags) {
                byTag[tag] = (byTag[tag] || 0) + 1;
            }
        }
        
        return {
            total: recentDecisions.length,
            favorable: recentDecisions.filter(d => d.outcome === 'favorable').length,
            unfavorable: recentDecisions.filter(d => d.outcome === 'unfavorable').length,
            byCourt: byCourt,
            byArea: byArea,
            byTag: byTag,
            keyPrecedents: recentDecisions.filter(d => d.impact === 'high').map(d => ({
                id: d.id,
                court: d.court,
                summary: d.summary,
                date: d.date
            }))
        };
    }
    
    /**
     * Analisa concorrentes
     */
    analyzeCompetitors() {
        const analysis = [];
        
        for (const competitor of this.competitors) {
            const marketPosition = this.getMarketPosition(competitor);
            const threatLevel = this.assessThreat(competitor);
            const opportunities = this.identifyCompetitorWeaknesses(competitor);
            
            analysis.push({
                id: competitor.id,
                name: competitor.name,
                type: competitor.type,
                marketPosition: marketPosition,
                threatLevel: threatLevel,
                threatScore: (threatLevel * 100).toFixed(0),
                opportunities: opportunities,
                keyLawyers: competitor.keyLawyers,
                successRate: (competitor.successRate * 100).toFixed(0),
                marketShare: (competitor.marketShare * 100).toFixed(0),
                growth: (competitor.growth * 100).toFixed(0),
                strengths: competitor.strengths,
                weaknesses: competitor.weaknesses,
                recentNews: competitor.recentNews
            });
        }
        
        return analysis.sort((a, b) => b.threatLevel - a.threatLevel);
    }
    
    /**
     * Obtém posição de mercado
     */
    getMarketPosition(competitor) {
        if (competitor.marketShare > 0.2) return 'Líder';
        if (competitor.marketShare > 0.1) return 'Seguidor';
        if (competitor.marketShare > 0.05) return 'Niche';
        return 'Emergente';
    }
    
    /**
     * Avalia nível de ameaça
     */
    assessThreat(competitor) {
        let threat = 0.5;
        
        if (competitor.successRate > 0.7) threat += 0.15;
        if (competitor.marketShare > 0.2) threat += 0.15;
        if (competitor.growth > 0.08) threat += 0.1;
        if (competitor.focusAreas.includes('Fiscal')) threat += 0.05;
        if (competitor.focusAreas.includes('Litígio')) threat += 0.05;
        
        return Math.min(threat, 0.95);
    }
    
    /**
     * Identifica fraquezas do concorrente
     */
    identifyCompetitorWeaknesses(competitor) {
        const weaknesses = [];
        
        if (competitor.successRate < 0.65) {
            weaknesses.push('Taxa de sucesso abaixo da média do mercado');
        }
        
        if (!competitor.focusAreas.some(a => a.includes('Digital') || a.includes('Tech'))) {
            weaknesses.push('Fraca presença em litígio digital');
        }
        
        if (competitor.recentCases < 8) {
            weaknesses.push('Baixo volume de casos recentes');
        }
        
        if (competitor.weaknesses) {
            weaknesses.push(...competitor.weaknesses);
        }
        
        return weaknesses;
    }
    
    /**
     * Identifica oportunidades
     */
    identifyOpportunities() {
        const opportunities = [];
        
        // Oportunidade 1: Jurisprudência favorável
        const favorableTrend = this.courtDecisions.filter(d => d.outcome === 'favorable').length > 5;
        if (favorableTrend) {
            opportunities.push({
                id: 'OPP_JURIS_001',
                type: 'judicial_trend',
                title: 'Tendência jurisprudencial favorável',
                description: 'Decisões favoráveis consistentes em litígios com plataformas digitais',
                potentialCases: 'Muito Alta',
                estimatedValue: 1250000,
                action: 'Aumentar marketing e captação de casos',
                timeline: '30 dias',
                roi: 3.5
            });
        }
        
        // Oportunidade 2: Nova plataforma
        const newPlatform = this.marketTrends.platforms.glovo;
        if (newPlatform.growth > 0.15) {
            opportunities.push({
                id: 'OPP_PLAT_001',
                type: 'new_platform',
                title: 'Crescimento da Glovo',
                description: `Glovo cresceu ${(newPlatform.growth * 100).toFixed(0)}% no último ano. Potencial para litígio.`,
                potentialCases: 'Alta',
                estimatedValue: 450000,
                action: 'Produzir conteúdo educativo e contactar parceiros',
                timeline: 'Imediato',
                roi: 2.8
            });
        }
        
        // Oportunidade 3: Fraqueza da concorrência
        const weakCompetitors = this.competitors.filter(c => c.successRate < 0.65);
        if (weakCompetitors.length > 0) {
            opportunities.push({
                id: 'OPP_COMP_001',
                type: 'competitive_gap',
                title: 'Oportunidade competitiva',
                description: `${weakCompetitors.length} concorrentes com taxa de sucesso abaixo da média`,
                potentialCases: 'Média',
                estimatedValue: 320000,
                action: 'Destacar diferenciais e resultados',
                timeline: '60 dias',
                roi: 2.2
            });
        }
        
        // Oportunidade 4: Nova regulamentação
        const newReg = this.regulatoryUpdates.find(r => r.impact === 'high');
        if (newReg) {
            opportunities.push({
                id: 'OPP_REG_001',
                type: 'regulatory',
                title: `Oportunidade: ${newReg.title}`,
                description: newReg.summary,
                potentialCases: 'Alta',
                estimatedValue: 680000,
                action: newReg.actionRequired,
                timeline: newReg.deadline ? `${newReg.deadline}` : '90 dias',
                roi: 3.0
            });
        }
        
        return opportunities;
    }
    
    /**
     * Identifica ameaças
     */
    identifyThreats() {
        const threats = [];
        
        // Ameaça 1: Concorrente agressivo
        const aggressiveCompetitors = this.competitors.filter(c => c.growth > 0.1 && c.marketShare > 0.15);
        if (aggressiveCompetitors.length > 0) {
            threats.push({
                id: 'THREAT_COMP_001',
                type: 'competition',
                title: `Ameaça: ${aggressiveCompetitors[0].name}`,
                description: `${aggressiveCompetitors[0].name} está a ganhar quota de mercado (${(aggressiveCompetitors[0].growth * 100).toFixed(0)}% crescimento)`,
                severity: 'Médio',
                action: 'Monitorizar e reforçar diferenciação',
                impact: 'medium'
            });
        }
        
        // Ameaça 2: Mudança regulatória adversa
        const adverseReg = this.regulatoryUpdates.find(r => r.impact === 'high' && r.area === 'laboral');
        if (adverseReg) {
            threats.push({
                id: 'THREAT_REG_001',
                type: 'regulatory',
                title: 'Mudança regulatória adversa',
                description: adverseReg.summary,
                severity: 'Alto',
                action: 'Acompanhar processo legislativo e preparar posicionamento',
                impact: 'high'
            });
        }
        
        // Ameaça 3: Jurisprudência desfavorável
        const unfavorableRecent = this.courtDecisions
            .filter(d => new Date(d.date) > new Date(Date.now() - 90 * 24 * 60 * 60 * 1000))
            .filter(d => d.outcome === 'unfavorable');
        
        if (unfavorableRecent.length > 0) {
            threats.push({
                id: 'THREAT_JURIS_001',
                type: 'jurisprudence',
                title: 'Jurisprudência desfavorável',
                description: `${unfavorableRecent.length} decisões desfavoráveis nos últimos 90 dias`,
                severity: 'Médio',
                action: 'Revisar estratégia argumentativa',
                impact: 'medium'
            });
        }
        
        return threats;
    }
    
    /**
     * Gera recomendações
     */
    generateRecommendations() {
        const recommendations = [];
        const opportunities = this.identifyOpportunities();
        const threats = this.identifyThreats();
        
        // Recomendação 1: Aproveitar oportunidades
        const topOpportunity = opportunities[0];
        if (topOpportunity) {
            recommendations.push({
                id: 'REC_OPP_001',
                area: 'Marketing',
                title: `Aproveitar oportunidade: ${topOpportunity.title}`,
                description: topOpportunity.description,
                action: topOpportunity.action,
                priority: 'Alta',
                timeline: topOpportunity.timeline,
                roi: topOpportunity.roi
            });
        }
        
        // Recomendação 2: Mitigar ameaças
        const topThreat = threats[0];
        if (topThreat) {
            recommendations.push({
                id: 'REC_THREAT_001',
                area: 'Estratégia',
                title: `Mitigar ameaça: ${topThreat.title}`,
                description: topThreat.description,
                action: topThreat.action,
                priority: 'Alta',
                timeline: 'Imediato',
                roi: null
            });
        }
        
        // Recomendação 3: Conteúdo especializado
        const highRelevanceTags = this.identifyHighRelevanceTags();
        if (highRelevanceTags.length > 0) {
            recommendations.push({
                id: 'REC_CONTENT_001',
                area: 'Conteúdo',
                title: 'Produzir conteúdo especializado',
                description: `Produzir conteúdo sobre ${highRelevanceTags.slice(0, 3).join(', ')}`,
                action: 'Webinar, artigos e case studies',
                priority: 'Média',
                timeline: '45 dias',
                roi: 2.0
            });
        }
        
        // Recomendação 4: Reforçar equipa
        const marketGrowth = this.calculateMarketMomentum();
        if (marketGrowth.growth > 10) {
            recommendations.push({
                id: 'REC_HR_001',
                area: 'Recursos Humanos',
                title: 'Reforçar equipa de litígio',
                description: `Crescimento de ${marketGrowth.growth}% no volume de casos`,
                action: 'Contratar 2 advogados seniores e 1 associado',
                priority: 'Média',
                timeline: '90 dias',
                roi: 2.5
            });
        }
        
        return recommendations;
    }
    
    /**
     * Identifica tendências emergentes
     */
    identifyEmergingTrends() {
        const trends = [];
        
        // Analisar tags mais frequentes
        const tagCount = {};
        for (const d of this.courtDecisions) {
            for (const tag of d.tags) {
                tagCount[tag] = (tagCount[tag] || 0) + 1;
            }
        }
        
        const sortedTags = Object.entries(tagCount).sort((a, b) => b[1] - a[1]);
        
        for (const [tag, count] of sortedTags.slice(0, 5)) {
            trends.push({
                tag: tag,
                frequency: count,
                trend: count > 3 ? 'ascending' : 'stable',
                description: this.getTagDescription(tag)
            });
        }
        
        return trends;
    }
    
    /**
     * Identifica tags de alta relevância
     */
    identifyHighRelevanceTags() {
        const highRelevance = this.courtDecisions
            .filter(d => d.relevance > 0.85)
            .flatMap(d => d.tags);
        
        return [...new Set(highRelevance)];
    }
    
    /**
     * Obtém descrição da tag
     */
    getTagDescription(tag) {
        const descriptions = {
            'DAC7': 'Obrigações de reporte de plataformas digitais - Diretiva Europeia',
            'preço_transferência': 'Dissimulação de comissões como preço de transferência',
            'comissões': 'Retenção indevida de valores por plataformas',
            'prova_digital': 'Admissibilidade de hash SHA-256 e perícia técnica',
            'fraude_qualificada': 'Art. 104 RGIT - valores >15.000€ ou reincidência',
            'inversão_ónus': 'Art. 344 CC - proximidade da prova com a plataforma',
            'responsabilidade': 'Responsabilidade solidária da plataforma',
            'reincidência': 'Agravamento por conduta reiterada',
            'regularização': 'Art. 78 CIVA - obrigação de regularização',
            'despedimento': 'Vínculo laboral com plataformas digitais'
        };
        return descriptions[tag] || tag;
    }
    
    /**
     * Calcula momentum de mercado
     */
    calculateMarketMomentum() {
        const lastMonth = this.courtDecisions.filter(d => {
            const date = new Date(d.date);
            const oneMonthAgo = new Date();
            oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
            return date >= oneMonthAgo;
        }).length;
        
        const previousMonth = this.courtDecisions.filter(d => {
            const date = new Date(d.date);
            const twoMonthsAgo = new Date();
            twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
            const oneMonthAgo = new Date();
            oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
            return date >= twoMonthsAgo && date < oneMonthAgo;
        }).length;
        
        const growth = previousMonth > 0 ? ((lastMonth - previousMonth) / previousMonth) * 100 : 0;
        
        return {
            current: lastMonth,
            previous: previousMonth,
            growth: growth.toFixed(1),
            trend: growth > 0 ? 'positive' : growth < 0 ? 'negative' : 'stable'
        };
    }
    
    /**
     * Obtém tendências de mercado
     */
    getMarketTrends() {
        return {
            platforms: this.marketTrends.platforms,
            courts: this.marketTrends.courts,
            sectors: this.marketTrends.sectors,
            quarters: this.marketTrends.quarters,
            forecasts: this.marketTrends.forecasts
        };
    }
    
    /**
     * Obtém atualizações regulatórias
     */
    getRegulatoryUpdates() {
        return this.regulatoryUpdates.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    
    /**
     * Obtém menções na mídia
     */
    getMediaMentions() {
        return this.mediaMentions.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    
    /**
     * Obtém alertas não lidos
     */
    getUnreadAlerts() {
        return this.alerts.filter(a => !a.read);
    }
    
    /**
     * Marca alerta como lido
     */
    markAlertRead(alertId) {
        const alert = this.alerts.find(a => a.id === alertId);
        if (alert) {
            alert.read = true;
        }
        return alert;
    }
    
    /**
     * Exporta relatório
     */
    async exportReport(format = 'json') {
        const report = await this.getIntelligenceReport();
        
        if (format === 'json') {
            const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `market_intelligence_${new Date().toISOString().slice(0, 10)}.json`;
            a.click();
            URL.revokeObjectURL(url);
        }
        
        return report;
    }
    
    /**
     * Renderiza dashboard
     */
    renderDashboard(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const summary = this.generateSummary();
        const opportunities = this.identifyOpportunities();
        const threats = this.identifyThreats();
        const recommendations = this.generateRecommendations();
        
        container.innerHTML = `
            <div class="market-intelligence-dashboard">
                <div class="dashboard-header">
                    <h2><i class="fas fa-chart-line"></i> INTELIGÊNCIA DE MERCADO</h2>
                    <div class="header-stats">
                        <div class="stat"><span>📊 Decisões</span><strong>${summary.totalDecisionsAnalyzed}</strong></div>
                        <div class="stat"><span>🎯 Oportunidades</span><strong>${summary.opportunitiesCount}</strong></div>
                        <div class="stat"><span>⚠️ Ameaças</span><strong>${summary.threatsCount}</strong></div>
                    </div>
                </div>
                
                <div class="summary-cards">
                    <div class="summary-card">
                        <div class="card-icon"><i class="fas fa-gavel"></i></div>
                        <div class="card-content">
                            <div class="card-value">${summary.favorableRate}%</div>
                            <div class="card-label">Taxa Favorável Decisões</div>
                            <div class="card-trend ${summary.marketMomentum.trend === 'positive' ? 'trend-up' : 'trend-down'}">${summary.marketMomentum.growth > 0 ? '+' : ''}${summary.marketMomentum.growth}% vs mês anterior</div>
                        </div>
                    </div>
                    <div class="summary-card">
                        <div class="card-icon"><i class="fas fa-chart-simple"></i></div>
                        <div class="card-content">
                            <div class="card-value">${summary.marketShareLead}%</div>
                            <div class="card-label">Market Share Líder</div>
                            <div class="card-text">${summary.topCompetitor}</div>
                        </div>
                    </div>
                    <div class="summary-card">
                        <div class="card-icon"><i class="fas fa-chart-line"></i></div>
                        <div class="card-content">
                            <div class="card-value">${summary.marketMomentum.growth}%</div>
                            <div class="card-label">Crescimento do Mercado</div>
                            <div class="card-text">${summary.marketMomentum.current} casos este mês</div>
                        </div>
                    </div>
                </div>
                
                <div class="two-columns">
                    <div class="column">
                        <h3><i class="fas fa-lightbulb"></i> Oportunidades</h3>
                        <div class="opportunities-list">
                            ${opportunities.map(opp => `
                                <div class="opportunity-card">
                                    <div class="opp-header">
                                        <i class="fas fa-chart-line"></i>
                                        <strong>${opp.title}</strong>
                                        <span class="roi-badge">ROI ${opp.roi}x</span>
                                    </div>
                                    <p>${opp.description}</p>
                                    <div class="opp-details">
                                        <span><i class="fas fa-users"></i> ${opp.potentialCases}</span>
                                        <span><i class="fas fa-euro-sign"></i> ${this.formatCurrency(opp.estimatedValue)}</span>
                                        <span><i class="fas fa-clock"></i> ${opp.timeline}</span>
                                    </div>
                                    <button class="elite-btn small opp-action" onclick="MarketIntelligence.handleOpportunity('${opp.id}')">
                                        VER ESTRATÉGIA
                                    </button>
                                </div>
                            `).join('')}
                            ${opportunities.length === 0 ? '<div class="empty-state">Nenhuma oportunidade identificada</div>' : ''}
                        </div>
                    </div>
                    <div class="column">
                        <h3><i class="fas fa-exclamation-triangle"></i> Ameaças</h3>
                        <div class="threats-list">
                            ${threats.map(threat => `
                                <div class="threat-card severity-${threat.severity.toLowerCase()}">
                                    <div class="threat-header">
                                        <i class="fas fa-shield-alt"></i>
                                        <strong>${threat.title}</strong>
                                    </div>
                                    <p>${threat.description}</p>
                                    <div class="threat-action">
                                        <span>⚠️ ${threat.severity}</span>
                                        <button class="action-btn" onclick="MarketIntelligence.handleThreat('${threat.id}')">MITIGAR</button>
                                    </div>
                                </div>
                            `).join('')}
                            ${threats.length === 0 ? '<div class="empty-state">Nenhuma ameaça identificada</div>' : ''}
                        </div>
                    </div>
                </div>
                
                <div class="recommendations-section">
                    <h3><i class="fas fa-clipboard-list"></i> Recomendações Estratégicas</h3>
                    <div class="recommendations-list">
                        ${recommendations.map(rec => `
                            <div class="recommendation-card priority-${rec.priority.toLowerCase()}">
                                <div class="rec-header">
                                    <i class="fas ${rec.area === 'Marketing' ? 'fa-bullhorn' : rec.area === 'Estratégia' ? 'fa-chess' : 'fa-users'}"></i>
                                    <div>
                                        <strong>${rec.title}</strong>
                                        <span class="priority-badge">${rec.priority}</span>
                                    </div>
                                </div>
                                <p>${rec.description}</p>
                                <div class="rec-details">
                                    <span><i class="fas fa-rocket"></i> ${rec.action}</span>
                                    <span><i class="fas fa-clock"></i> ${rec.timeline}</span>
                                    ${rec.roi ? `<span><i class="fas fa-chart-line"></i> ROI ${rec.roi}x</span>` : ''}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="recent-decisions">
                    <h3><i class="fas fa-gavel"></i> Decisões Recentes</h3>
                    <table class="data-table">
                        <thead>
                            <tr><th>Data</th><th>Tribunal</th><th>Resumo</th><th>Área</th><th>Impacto</th>  </thead>
                        <tbody>
                            ${this.courtDecisions.slice(0, 5).map(d => `
                                <tr>
                                    <td>${new Date(d.date).toLocaleDateString('pt-PT')}</td>
                                    <td>${d.court}</td>
                                    <td>${d.summary.substring(0, 60)}...</td>
                                    <td><span class="badge badge-primary">${d.area}</span></td>
                                    <td><span class="status-badge ${d.impact === 'high' ? 'status-critical' : 'status-pending'}">${d.impact === 'high' ? 'ALTO' : 'MÉDIO'}</span></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                
                <div class="competitors-section">
                    <h3><i class="fas fa-building"></i> Análise de Concorrentes</h3>
                    <div class="competitors-grid">
                        ${this.competitors.slice(0, 4).map(c => `
                            <div class="competitor-card">
                                <div class="competitor-header">
                                    <strong>${c.name}</strong>
                                    <span class="market-share">${(c.marketShare * 100).toFixed(0)}%</span>
                                </div>
                                <div class="competitor-stats">
                                    <div>📈 Sucesso: ${(c.successRate * 100).toFixed(0)}%</div>
                                    <div>📊 Crescimento: ${(c.growth * 100).toFixed(0)}%</div>
                                    <div>⚖️ Casos: ${c.recentCases}</div>
                                </div>
                                <div class="competitor-weakness">
                                    <strong>Fraqueza:</strong> ${c.weaknesses[0] || 'Não identificada'}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        
        // Estilos adicionais
        const style = document.createElement('style');
        style.textContent = `
            .market-intelligence-dashboard { padding: 0; }
            .summary-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin-bottom: 24px; }
            .summary-card { background: var(--bg-command); border-radius: 16px; padding: 20px; display: flex; gap: 16px; align-items: center; border: 1px solid var(--border-tactic); }
            .card-icon { width: 48px; height: 48px; background: var(--elite-primary-dim); border-radius: 12px; display: flex; align-items: center; justify-content: center; }
            .card-icon i { font-size: 1.5rem; color: var(--elite-primary); }
            .card-value { font-size: 1.8rem; font-weight: 800; font-family: 'JetBrains Mono'; color: var(--elite-primary); }
            .card-label { font-size: 0.7rem; color: #94a3b8; text-transform: uppercase; }
            .two-columns { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px; }
            .opportunity-card, .threat-card { background: var(--bg-terminal); border-radius: 12px; padding: 16px; margin-bottom: 12px; border: 1px solid var(--border-tactic); }
            .opportunity-card:hover, .threat-card:hover { border-color: var(--elite-primary); }
            .opp-header, .threat-header { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
            .roi-badge { background: var(--elite-success); color: #000; padding: 2px 8px; border-radius: 12px; font-size: 0.6rem; margin-left: auto; }
            .opp-details { display: flex; gap: 16px; margin: 12px 0; font-size: 0.7rem; color: #94a3b8; }
            .threat-card.severity-alto { border-left: 3px solid var(--elite-danger); }
            .threat-card.severity-médio { border-left: 3px solid var(--elite-warning); }
            .threat-action { display: flex; justify-content: space-between; align-items: center; margin-top: 12px; }
            .recommendation-card { background: var(--bg-terminal); border-radius: 12px; padding: 16px; margin-bottom: 12px; border-left: 3px solid; }
            .recommendation-card.priority-alta { border-left-color: var(--elite-danger); }
            .recommendation-card.priority-média { border-left-color: var(--elite-warning); }
            .rec-header { display: flex; gap: 12px; margin-bottom: 8px; }
            .rec-header i { font-size: 1.2rem; color: var(--elite-primary); }
            .priority-badge { background: var(--elite-primary-dim); color: var(--elite-primary); padding: 2px 8px; border-radius: 12px; font-size: 0.6rem; margin-left: 8px; }
            .rec-details { display: flex; gap: 16px; margin-top: 12px; font-size: 0.7rem; color: #94a3b8; }
            .competitors-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; margin-top: 16px; }
            .competitor-card { background: var(--bg-terminal); border-radius: 12px; padding: 16px; border: 1px solid var(--border-tactic); }
            .competitor-header { display: flex; justify-content: space-between; margin-bottom: 12px; }
            .market-share { background: var(--elite-primary-dim); padding: 2px 8px; border-radius: 12px; font-size: 0.7rem; }
            .competitor-stats { display: flex; gap: 16px; font-size: 0.7rem; color: #94a3b8; margin-bottom: 12px; }
            .competitor-weakness { font-size: 0.7rem; color: var(--elite-danger); border-top: 1px solid var(--border-tactic); padding-top: 8px; }
            @media (max-width: 768px) { .two-columns { grid-template-columns: 1fr; } .summary-cards { grid-template-columns: 1fr; } }
        `;
        container.appendChild(style);
    }
    
    /**
     * Manipula oportunidade
     */
    handleOpportunity(opportunityId) {
        if (window.EliteUtils) {
            window.EliteUtils.showToast(`A processar oportunidade ${opportunityId}...`, 'info');
        }
    }
    
    /**
     * Manipula ameaça
     */
    handleThreat(threatId) {
        if (window.EliteUtils) {
            window.EliteUtils.showToast(`A processar mitigação de ameaça ${threatId}...`, 'info');
        }
    }
    
    /**
     * Formata moeda
     */
    formatCurrency(value) {
        return new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
    }
}

// Instância global
window.MarketIntelligence = new MarketIntelligence();