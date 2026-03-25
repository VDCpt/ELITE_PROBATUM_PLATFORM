/**
 * ============================================================================
 * UNIFED-ELITE PLATFORM — MÓDULO 8: INTELIGÊNCIA ESTRATÉGICA
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
        
        this.startMonitoring();
    }
    
    loadCompetitors() {
        return [
            {
                name: 'PLMJ',
                type: 'Full Service',
                size: 300,
                focusAreas: ['Fiscal', 'Litígio', 'Corporate'],
                recentCases: 12,
                successRate: 0.68,
                keyLawyers: ['Dr. Miguel Castro', 'Dra. Sofia Rodrigues'],
                marketShare: 0.25
            },
            {
                name: 'VdA',
                type: 'Full Service',
                size: 280,
                focusAreas: ['Fiscal', 'Arbitragem', 'Regulatório'],
                recentCases: 10,
                successRate: 0.72,
                keyLawyers: ['Dr. João Martins', 'Dra. Ana Costa'],
                marketShare: 0.23
            },
            {
                name: 'Cuatrecasas',
                type: 'Iberian',
                size: 200,
                focusAreas: ['Fiscal', 'Litígio', 'M&A'],
                recentCases: 8,
                successRate: 0.65,
                keyLawyers: ['Dr. Pedro Almeida'],
                marketShare: 0.18
            },
            {
                name: 'Garrigues',
                type: 'Iberian',
                size: 180,
                focusAreas: ['Fiscal', 'Processual'],
                recentCases: 7,
                successRate: 0.62,
                keyLawyers: ['Dra. Teresa Lopes'],
                marketShare: 0.15
            }
        ];
    }
    
    loadCourtDecisions() {
        return [
            {
                id: 'STA_01080_2023',
                court: 'STA',
                date: '2023-09-27',
                caseNumber: '01080/17.3BELRS',
                summary: 'Plataforma falha no reporte DAC7 configura omissão tributária',
                relevance: 0.92,
                outcome: 'favorable',
                impact: 'high',
                tags: ['DAC7', 'plataforma', 'omissão']
            },
            {
                id: 'STA_0456_2024',
                court: 'STA',
                date: '2024-03-14',
                caseNumber: '0456/19.8BEPRT',
                summary: 'Discrepância entre extrato e fatura é preço de transferência dissimulado',
                relevance: 0.95,
                outcome: 'favorable',
                impact: 'high',
                tags: ['preço_transferência', 'comissões', 'dissimulação']
            },
            {
                id: 'TCA_0237_2023',
                court: 'TCA Sul',
                date: '2023-11-08',
                caseNumber: '0237/21.5BELRS',
                summary: 'Prova digital com hash SHA-256 é admissível nos termos do Art. 125 CPP',
                relevance: 0.88,
                outcome: 'favorable',
                impact: 'medium',
                tags: ['prova_digital', 'hash', 'admissibilidade']
            },
            {
                id: 'STA_0891_2024',
                court: 'STA',
                date: '2024-05-22',
                caseNumber: '0891/20.0BESNT',
                summary: 'Reincidência de omissões configura dolo para fraude fiscal qualificada',
                relevance: 0.91,
                outcome: 'favorable',
                impact: 'high',
                tags: ['reincidência', 'dolo', 'fraude_qualificada']
            },
            {
                id: 'CAAD_01234_2025',
                court: 'CAAD',
                date: '2025-01-15',
                caseNumber: '01234/22.7BELRS',
                summary: 'Regularização Art. 78 CIVA é obrigatória quando há omissão',
                relevance: 0.85,
                outcome: 'favorable',
                impact: 'medium',
                tags: ['regularização', 'CIVA_78', 'omissão']
            }
        ];
    }
    
    loadMarketTrends() {
        return {
            platforms: {
                bolt: { marketShare: 0.45, growth: 0.12, litigationRate: 0.32 },
                uber: { marketShare: 0.35, growth: 0.08, litigationRate: 0.28 },
                freenow: { marketShare: 0.12, growth: 0.05, litigationRate: 0.15 },
                others: { marketShare: 0.08, growth: 0.15, litigationRate: 0.10 }
            },
            courts: {
                lisboa: { casesFiled: 45, successRate: 0.62, avgDuration: 135 },
                porto: { casesFiled: 38, successRate: 0.68, avgDuration: 110 },
                braga: { casesFiled: 25, successRate: 0.55, avgDuration: 125 },
                coimbra: { casesFiled: 22, successRate: 0.58, avgDuration: 140 }
            },
            sectors: {
                tvde: { totalCases: 380, avgValue: 18500, successRate: 0.64 },
                ecommerce: { totalCases: 125, avgValue: 12400, successRate: 0.58 },
                delivery: { totalCases: 95, avgValue: 8900, successRate: 0.61 }
            }
        };
    }
    
    startMonitoring() {
        // Monitorizar novas decisões (simulado)
        setInterval(() => {
            this.checkNewDecisions();
        }, 6 * 60 * 60 * 1000); // A cada 6 horas
    }
    
    async checkNewDecisions() {
        // Em produção, consultar API do STA/TCA/CAAD
        console.log('[ELITE] Verificando novas decisões...');
        
        // Simular nova decisão
        const newDecision = {
            id: 'NEW_' + Date.now(),
            court: 'STA',
            date: new Date().toISOString().slice(0, 10),
            caseNumber: 'XXXX/XX.X',
            summary: 'Nova decisão sobre responsabilidade das plataformas',
            relevance: 0.75,
            outcome: 'favorable',
            impact: 'medium',
            tags: ['plataforma', 'responsabilidade']
        };
        
        if (Math.random() < 0.3) { // 30% de chance de nova decisão
            this.courtDecisions.unshift(newDecision);
            this.createAlert('new_decision', newDecision);
        }
    }
    
    createAlert(type, data) {
        const alert = {
            id: 'ALERT_' + Date.now(),
            type: type,
            createdAt: new Date().toISOString(),
            data: data,
            read: false
        };
        
        this.alerts.unshift(alert);
        
        // Notificar
        window.UNIFEDElite?.showToast(this.getAlertMessage(type, data), 'info');
        
        // Emitir evento
        window.dispatchEvent(new CustomEvent('marketIntelligenceAlert', { detail: alert }));
    }
    
    getAlertMessage(type, data) {
        const messages = {
            new_decision: `Nova decisão relevante: ${data.caseNumber} - ${data.summary.substring(0, 60)}...`,
            competitor_movement: `Movimento da concorrência: ${data.competitor} anunciou ${data.action}`,
            market_opportunity: `Oportunidade de mercado: ${data.description}`,
            regulatory_change: `Mudança regulatória: ${data.description}`
        };
        return messages[type] || 'Novo alerta de inteligência de mercado';
    }
    
    async getIntelligenceReport(period = 'monthly') {
        const report = {
            period: period,
            generatedAt: new Date().toISOString(),
            summary: this.generateSummary(),
            decisions: this.analyzeDecisions(period),
            competitors: this.analyzeCompetitors(),
            opportunities: this.identifyOpportunities(),
            threats: this.identifyThreats(),
            recommendations: this.generateRecommendations()
        };
        
        this.reports.push(report);
        
        return report;
    }
    
    generateSummary() {
        const recentDecisions = this.courtDecisions.slice(0, 5);
        const favorableDecisions = recentDecisions.filter(d => d.outcome === 'favorable').length;
        const favorableRate = (favorableDecisions / recentDecisions.length) * 100;
        
        return {
            totalDecisionsAnalyzed: this.courtDecisions.length,
            favorableRate: favorableRate.toFixed(1),
            emergingTrends: this.identifyEmergingTrends(),
            marketMomentum: this.calculateMarketMomentum()
        };
    }
    
    analyzeDecisions(period) {
        const cutoff = new Date();
        if (period === 'monthly') cutoff.setMonth(cutoff.getMonth() - 1);
        else if (period === 'quarterly') cutoff.setMonth(cutoff.getMonth() - 3);
        
        const recentDecisions = this.courtDecisions.filter(d => new Date(d.date) >= cutoff);
        
        return {
            total: recentDecisions.length,
            favorable: recentDecisions.filter(d => d.outcome === 'favorable').length,
            unfavorable: recentDecisions.filter(d => d.outcome === 'unfavorable').length,
            byCourt: this.groupByCourt(recentDecisions),
            byTag: this.groupByTag(recentDecisions),
            keyPrecedents: this.extractKeyPrecedents(recentDecisions)
        };
    }
    
    groupByCourt(decisions) {
        const groups = {};
        decisions.forEach(d => {
            if (!groups[d.court]) groups[d.court] = [];
            groups[d.court].push(d);
        });
        return groups;
    }
    
    groupByTag(decisions) {
        const groups = {};
        decisions.forEach(d => {
            d.tags.forEach(tag => {
                if (!groups[tag]) groups[tag] = [];
                groups[tag].push(d);
            });
        });
        return groups;
    }
    
    extractKeyPrecedents(decisions) {
        return decisions
            .filter(d => d.impact === 'high' && d.relevance > 0.8)
            .map(d => ({
                caseNumber: d.caseNumber,
                court: d.court,
                summary: d.summary,
                date: d.date
            }));
    }
    
    analyzeCompetitors() {
        const analysis = [];
        
        for (const competitor of this.competitors) {
            const marketPosition = this.getMarketPosition(competitor);
            const threatLevel = this.assessThreat(competitor);
            const opportunities = this.identifyCompetitorWeaknesses(competitor);
            
            analysis.push({
                name: competitor.name,
                marketPosition,
                threatLevel,
                opportunities,
                keyLawyers: competitor.keyLawyers,
                successRate: competitor.successRate * 100,
                marketShare: competitor.marketShare * 100
            });
        }
        
        return analysis.sort((a, b) => b.threatLevel - a.threatLevel);
    }
    
    getMarketPosition(competitor) {
        if (competitor.marketShare > 0.2) return 'Líder';
        if (competitor.marketShare > 0.1) return 'Seguidor';
        return 'Nicho';
    }
    
    assessThreat(competitor) {
        let threat = 0.5;
        
        if (competitor.successRate > 0.7) threat += 0.2;
        if (competitor.marketShare > 0.2) threat += 0.2;
        if (competitor.focusAreas.includes('Fiscal')) threat += 0.1;
        if (competitor.focusAreas.includes('Litígio')) threat += 0.1;
        
        return Math.min(threat, 0.95);
    }
    
    identifyCompetitorWeaknesses(competitor) {
        const weaknesses = [];
        
        if (competitor.successRate < 0.65) {
            weaknesses.push('Taxa de sucesso abaixo da média do mercado');
        }
        
        if (!competitor.focusAreas.includes('Digital')) {
            weaknesses.push('Fraca presença em litígio digital');
        }
        
        if (competitor.recentCases < 10) {
            weaknesses.push('Baixo volume de casos recentes');
        }
        
        return weaknesses;
    }
    
    identifyOpportunities() {
        const opportunities = [];
        
        // Oportunidade 1: Nova plataforma entrando no mercado
        opportunities.push({
            type: 'new_platform',
            description: 'Novas plataformas de entrega estão a entrar no mercado português',
            potentialCases: 'Alta',
            firstMoverAdvantage: true,
            action: 'Produzir conteúdo educativo e contactar parceiros',
            timeline: 'Imediato'
        });
        
        // Oportunidade 2: Tendência jurisprudencial favorável
        const favorableTrend = this.courtDecisions.filter(d => d.outcome === 'favorable').length > 10;
        if (favorableTrend) {
            opportunities.push({
                type: 'judicial_trend',
                description: 'Tendência favorável em tribunais superiores',
                potentialCases: 'Muito Alta',
                firstMoverAdvantage: false,
                action: 'Aumentar marketing e captação de casos',
                timeline: '30 dias'
            });
        }
        
        // Oportunidade 3: Fraqueza da concorrência
        const weakCompetitors = this.competitors.filter(c => c.successRate < 0.65);
        if (weakCompetitors.length > 0) {
            opportunities.push({
                type: 'competitive_gap',
                description: `${weakCompetitors.length} concorrentes com taxa de sucesso abaixo da média`,
                potentialCases: 'Média',
                firstMoverAdvantage: false,
                action: 'Destacar diferenciais e resultados',
                timeline: '60 dias'
            });
        }
        
        return opportunities;
    }
    
    identifyThreats() {
        const threats = [];
        
        // Ameaça 1: Concorrente agressivo
        const aggressiveCompetitors = this.competitors.filter(c => c.marketShare > 0.2);
        if (aggressiveCompetitors.length > 0) {
            threats.push({
                type: 'competition',
                description: `${aggressiveCompetitors[0].name} está a ganhar quota de mercado`,
                severity: 'Médio',
                action: 'Monitorizar e reforçar diferenciação'
            });
        }
        
        // Ameaça 2: Mudança regulatória
        threats.push({
            type: 'regulatory',
            description: 'Possível alteração na legislação TVDE em análise na AR',
            severity: 'Alto',
            action: 'Acompanhar processo legislativo e preparar posicionamento'
        });
        
        // Ameaça 3: Jurisprudência desfavorável
        const unfavorableRecent = this.courtDecisions
            .filter(d => new Date(d.date) > new Date(Date.now() - 90 * 24 * 60 * 60 * 1000))
            .filter(d => d.outcome === 'unfavorable');
        
        if (unfavorableRecent.length > 0) {
            threats.push({
                type: 'jurisprudence',
                description: `${unfavorableRecent.length} decisões desfavoráveis nos últimos 90 dias`,
                severity: 'Médio',
                action: 'Revisar estratégia argumentativa'
            });
        }
        
        return threats;
    }
    
    generateRecommendations() {
        const recommendations = [];
        
        // Recomendação 1: Foco em áreas de alta relevância
        const highRelevanceTags = this.identifyHighRelevanceTags();
        if (highRelevanceTags.length > 0) {
            recommendations.push({
                area: 'Conteúdo',
                description: `Produzir conteúdo especializado em ${highRelevanceTags.slice(0, 3).join(', ')}`,
                priority: 'Alta',
                timeline: '30 dias'
            });
        }
        
        // Recomendação 2: Reforçar equipa
        if (this.marketTrends.sectors.tvde.totalCases > 100) {
            recommendations.push({
                area: 'Recursos Humanos',
                description: 'Reforçar equipa de litígio TVDE com mais 2 advogados',
                priority: 'Média',
                timeline: '90 dias'
            });
        }
        
        // Recomendação 3: Marketing direcionado
        recommendations.push({
            area: 'Marketing',
            description: 'Campanha direcionada a motoristas TVDE com discrepâncias >50%',
            priority: 'Alta',
            timeline: '45 dias'
        });
        
        return recommendations;
    }
    
    identifyEmergingTrends() {
        const trends = [];
        
        // Analisar tags mais frequentes
        const tagCount = {};
        this.courtDecisions.forEach(d => {
            d.tags.forEach(tag => {
                tagCount[tag] = (tagCount[tag] || 0) + 1;
            });
        });
        
        const sortedTags = Object.entries(tagCount).sort((a, b) => b[1] - a[1]);
        
        for (const [tag, count] of sortedTags.slice(0, 5)) {
            trends.push({
                tag: tag,
                frequency: count,
                trend: count > 5 ? 'ascending' : 'stable',
                description: this.getTagDescription(tag)
            });
        }
        
        return trends;
    }
    
    identifyHighRelevanceTags() {
        const highRelevance = this.courtDecisions
            .filter(d => d.relevance > 0.85)
            .flatMap(d => d.tags);
        
        const unique = [...new Set(highRelevance)];
        return unique;
    }
    
    getTagDescription(tag) {
        const descriptions = {
            'DAC7': 'Obrigações de reporte de plataformas digitais',
            'preço_transferência': 'Dissimulação de comissões',
            'comissões': 'Retenção indevida de valores',
            'prova_digital': 'Admissibilidade de hash SHA-256 e perícia técnica',
            'fraude_qualificada': 'Art. 104 RGIT - valores >15.000€ ou reincidência',
            'inversão_ónus': 'Art. 344 CC - proximidade da prova',
            'responsabilidade': 'Responsabilidade solidária da plataforma'
        };
        return descriptions[tag] || tag;
    }
    
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
    
    async generateQuarterlyReport() {
        const report = await this.getIntelligenceReport('quarterly');
        
        // Gerar PDF (simulado)
        window.UNIFEDElite?.showToast('Relatório trimestral gerado com sucesso!', 'success');
        
        return report;
    }
    
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
}

// Instância global
window.MarketIntelligence = new MarketIntelligence();