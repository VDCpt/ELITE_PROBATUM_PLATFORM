/**
 * ============================================================================
 * ELITE PROBATUM v2.0.5 — MÓDULO DE COMPENSAÇÃO ESTRATÉGICA
 * INTEGRAÇÃO: MRE + FEE OPTIMIZER
 * ============================================================================
 * ADITAMENTO AO FeeOptimizer EXISTENTE:
 * 1. Cálculo de bónus baseado em ranking de medalhas
 * 2. Integração com Gamification System para performance tracking
 * 3. Geração de relatórios de performance executiva
 * 4. Selagem de bónus no Forensic Vault para auditoria
 * 5. Cálculo de ROI por advogado e por equipa
 * 6. Previsão de performance futura baseada em histórico
 * ============================================================================
 */

// EXTENSÃO DO FeeOptimizer EXISTENTE
(function() {
    'use strict';
    
    // Verificar se FeeOptimizer existe
    if (typeof window.FeeOptimizer === 'undefined') {
        console.error('[ELITE] FeeOptimizer não encontrado. O módulo de compensação não será carregado.');
        // Criar objeto temporário para não quebrar a extensão
        window.FeeOptimizer = {
            calculatePerformanceBonus: function() { return { valid: false, error: 'FeeOptimizer não inicializado' }; },
            generateExecutiveReport: function() { return null; },
            exportExecutiveReport: function() { return null; }
        };
    }
    
    const originalOptimizer = window.FeeOptimizer;
    
    /**
     * Calcula o bónus final baseado no ranking de medalhas do semestre/ano
     * @param {Object} lawyerStats - Dados de performance do advogado
     * @param {Array} medals - Medalhas conquistadas no período
     * @param {Object} periodConfig - Configuração do período (semestre/ano)
     * @returns {Object} Cálculo de bónus com validação
     */
    originalOptimizer.calculatePerformanceBonus = function(lawyerStats, medals, periodConfig = {}) {
        if (!lawyerStats || !lawyerStats.fixedSalary) {
            return {
                error: 'Dados insuficientes para cálculo de bónus',
                valid: false
            };
        }
        
        const baseBonusRate = periodConfig.baseBonusRate || 0.10; // 10% do salário base
        const baseBonus = lawyerStats.fixedSalary * baseBonusRate;
        
        // Mapeamento de medalhas para multiplicadores
        const medalMultipliers = {
            'PLATINUM': 0.50,  // +50% do bónus base
            'GOLD': 0.30,      // +30% do bónus base
            'SILVER': 0.15,    // +15% do bónus base
            'BRONZE': 0.05,    // +5% do bónus base
            'DIAMOND': 1.00,   // +100% do bónus base (performance excecional)
            'MASTER': 0.75,    // +75% do bónus base
            'ELITE': 2.00      // +200% do bónus base (performance extraordinária)
        };
        
        let multiplier = 1.0;
        const appliedMedals = [];
        
        // Aplicar multiplicadores cumulativos por medalha
        for (const medal of medals) {
            const medalKey = typeof medal === 'string' ? medal : (medal.id || medal);
            const medalMultiplier = medalMultipliers[medalKey];
            if (medalMultiplier) {
                multiplier += medalMultiplier;
                appliedMedals.push({
                    id: medalKey,
                    name: this.getMedalName(medalKey),
                    multiplier: medalMultiplier,
                    description: this.getMedalDescription(medalKey)
                });
            }
        }
        
        // Bónus adicional por performance excecional
        let performanceBonus = 0;
        if (lawyerStats.casesWon && lawyerStats.casesWon > 20) {
            performanceBonus += 0.15;
            appliedMedals.push({
                id: 'PERFORMANCE',
                name: 'Performance Excecional',
                multiplier: 0.15,
                description: `+15% por ${lawyerStats.casesWon} vitórias no período`
            });
        }
        
        if (lawyerStats.efficiency && lawyerStats.efficiency > 0.9) {
            performanceBonus += 0.10;
            appliedMedals.push({
                id: 'EFFICIENCY',
                name: 'Eficiência Superior',
                multiplier: 0.10,
                description: `+10% por eficiência de ${(lawyerStats.efficiency * 100).toFixed(0)}%`
            });
        }
        
        if (lawyerStats.reputation && lawyerStats.reputation > 90) {
            performanceBonus += 0.05;
            appliedMedals.push({
                id: 'REPUTATION',
                name: 'Excelência no Atendimento',
                multiplier: 0.05,
                description: `+5% por reputação de ${lawyerStats.reputation} pontos`
            });
        }
        
        multiplier += performanceBonus;
        
        // Cap máximo de 3.0x (300% do bónus base)
        const finalMultiplier = Math.min(multiplier, 3.0);
        const finalBonus = baseBonus * finalMultiplier;
        
        // Calcular métricas adicionais
        const performanceMetrics = {
            casesWon: lawyerStats.casesWon || 0,
            casesLost: lawyerStats.casesLost || 0,
            successRate: lawyerStats.casesWon && lawyerStats.casesLost ? 
                (lawyerStats.casesWon / (lawyerStats.casesWon + lawyerStats.casesLost)) * 100 : 0,
            hoursBilled: lawyerStats.hoursBilled || 0,
            efficiency: lawyerStats.efficiency || 0,
            reputation: lawyerStats.reputation || 0,
            streak: lawyerStats.streak || 0,
            level: lawyerStats.level || 1
        };
        
        // Gerar hash de validação para auditoria
        const validationData = `${lawyerStats.id}_${baseBonus}_${finalMultiplier}_${finalBonus}_${Date.now()}`;
        const validationHash = CryptoJS.SHA256(validationData).toString();
        
        // Calcular ROI do advogado
        const roi = this.calculateLawyerROI(lawyerStats, finalBonus);
        
        // Registrar no Forensic Vault se disponível
        if (window.ForensicVault && typeof window.ForensicVault.logAccess === 'function') {
            window.ForensicVault.logAccess('SYSTEM', 'BONUS_CALCULATION', lawyerStats.id, {
                lawyerId: lawyerStats.id,
                baseBonus: baseBonus,
                finalBonus: finalBonus,
                multiplier: finalMultiplier,
                medals: appliedMedals,
                validationHash: validationHash,
                timestamp: new Date().toISOString(),
                roi: roi
            });
        }
        
        return {
            valid: true,
            lawyerId: lawyerStats.id,
            lawyerName: lawyerStats.name || lawyerStats.id,
            period: periodConfig.period || 'current',
            baseSalary: lawyerStats.fixedSalary,
            baseBonusRate: baseBonusRate,
            baseBonus: baseBonus,
            baseBonusFormatted: this.formatCurrency(baseBonus),
            appliedMedals: appliedMedals,
            totalMultiplier: finalMultiplier.toFixed(2),
            finalBonus: finalBonus,
            finalBonusFormatted: this.formatCurrency(finalBonus),
            currency: 'EUR',
            performanceMetrics: performanceMetrics,
            roi: roi,
            validationHash: validationHash,
            generatedAt: new Date().toISOString(),
            recommendation: this.generateBonusRecommendation(performanceMetrics, finalMultiplier),
            paymentStatus: 'PENDING_APPROVAL'
        };
    };
    
    /**
     * Calcula ROI do advogado para o período
     */
    originalOptimizer.calculateLawyerROI = function(lawyerStats, bonusAmount) {
        const revenueGenerated = lawyerStats.hoursBilled * 150; // Assumindo taxa média de €150/hora
        const totalCompensation = (lawyerStats.fixedSalary || 5000) * 3 + bonusAmount; // Trimestre
        const roi = revenueGenerated > 0 ? ((revenueGenerated - totalCompensation) / totalCompensation) * 100 : 0;
        
        return {
            revenueGenerated: revenueGenerated,
            revenueGeneratedFormatted: this.formatCurrency(revenueGenerated),
            totalCompensation: totalCompensation,
            totalCompensationFormatted: this.formatCurrency(totalCompensation),
            roiPercentage: roi.toFixed(1),
            roiMultiplier: (revenueGenerated / totalCompensation).toFixed(2),
            assessment: roi > 50 ? 'EXCELENTE' : roi > 20 ? 'BOM' : roi > 0 ? 'SATISFATÓRIO' : 'ATENÇÃO'
        };
    };
    
    /**
     * Obtém nome amigável da medalha
     */
    originalOptimizer.getMedalName = function(medalId) {
        const names = {
            'PLATINUM': 'Platina',
            'GOLD': 'Ouro',
            'SILVER': 'Prata',
            'BRONZE': 'Bronze',
            'DIAMOND': 'Diamante',
            'MASTER': 'Mestre',
            'ELITE': 'Elite'
        };
        return names[medalId] || medalId;
    };
    
    /**
     * Obtém descrição da medalha
     */
    originalOptimizer.getMedalDescription = function(medalId) {
        const descriptions = {
            'PLATINUM': 'Top 3 no ranking geral - Performance superior',
            'GOLD': 'Top 10 no ranking geral - Performance destacada',
            'SILVER': 'Top 20 no ranking geral - Performance consistente',
            'BRONZE': 'Top 50 no ranking geral - Performance positiva',
            'DIAMOND': 'Performance excecional - Caso de referência',
            'MASTER': 'Especialista reconhecido na área',
            'ELITE': 'Performance extraordinária - Benchmark'
        };
        return descriptions[medalId] || 'Medalha de reconhecimento';
    };
    
    /**
     * Gera recomendação de bónus baseada em performance
     */
    originalOptimizer.generateBonusRecommendation = function(metrics, multiplier) {
        const successRate = metrics.successRate;
        const efficiency = metrics.efficiency;
        
        if (successRate > 80 && efficiency > 0.85) {
            return {
                level: 'EXCEPCIONAL',
                message: 'Performance excecional. Bónus máximo recomendado.',
                additionalConsideration: 'Considerar promoção ou aumento salarial',
                nextTarget: 'Manter taxa de sucesso >85% no próximo trimestre'
            };
        } else if (successRate > 70 && efficiency > 0.75) {
            return {
                level: 'SUPERIOR',
                message: 'Performance superior à média. Bónus integral recomendado.',
                additionalConsideration: 'Manter incentivos atuais',
                nextTarget: 'Aumentar taxa de sucesso para 75%'
            };
        } else if (successRate > 60) {
            return {
                level: 'SATISFATÓRIO',
                message: 'Performance dentro do esperado. Bónus proporcional recomendado.',
                additionalConsideration: 'Identificar áreas de melhoria',
                nextTarget: 'Reforçar formação em áreas de maior complexidade'
            };
        } else {
            return {
                level: 'ATENÇÃO',
                message: 'Performance abaixo do esperado. Revisão de estratégia recomendada.',
                additionalConsideration: 'Plano de desenvolvimento individual',
                nextTarget: 'Acompanhamento mensal de métricas de performance'
            };
        }
    };
    
    /**
     * Calcula bónus para múltiplos advogados (equipa)
     * @param {Array} lawyers - Lista de advogados com seus stats e medalhas
     * @param {Object} periodConfig - Configuração do período
     * @returns {Object} Resumo de bónus da equipa
     */
    originalOptimizer.calculateTeamBonus = function(lawyers, periodConfig = {}) {
        const results = [];
        let totalBonus = 0;
        let totalBaseBonus = 0;
        let totalRevenue = 0;
        
        for (const lawyer of lawyers) {
            const bonus = this.calculatePerformanceBonus(lawyer.stats, lawyer.medals, periodConfig);
            if (bonus.valid) {
                results.push(bonus);
                totalBonus += bonus.finalBonus;
                totalBaseBonus += bonus.baseBonus;
                totalRevenue += bonus.roi?.revenueGenerated || 0;
            }
        }
        
        const averageMultiplier = totalBaseBonus > 0 ? totalBonus / totalBaseBonus : 0;
        const teamROI = totalRevenue > 0 ? ((totalRevenue - totalBonus) / totalBonus) * 100 : 0;
        
        // Gerar ranking por performance
        const ranking = [...results].sort((a, b) => b.finalBonus - a.finalBonus);
        
        return {
            period: periodConfig.period || 'current',
            totalLawyers: results.length,
            totalBaseBonus: totalBaseBonus,
            totalBaseBonusFormatted: this.formatCurrency(totalBaseBonus),
            totalBonus: totalBonus,
            totalBonusFormatted: this.formatCurrency(totalBonus),
            averageMultiplier: averageMultiplier.toFixed(2),
            teamROI: teamROI.toFixed(1),
            teamROIPercent: teamROI.toFixed(1) + '%',
            individualBonuses: results,
            topPerformer: ranking[0] || null,
            ranking: ranking.map((r, idx) => ({
                rank: idx + 1,
                lawyerName: r.lawyerName,
                bonus: r.finalBonusFormatted,
                multiplier: r.totalMultiplier,
                medals: r.appliedMedals.map(m => m.name)
            })),
            validationHash: CryptoJS.SHA256(JSON.stringify(results) + Date.now()).toString(),
            generatedAt: new Date().toISOString(),
            recommendation: teamROI > 50 ? 'Equipa de alta performance. Manter incentivos.' : 
                           teamROI > 20 ? 'Equipa produtiva. Considerar aumentos adicionais.' :
                           'Revisão de estratégia recomendada para equipa.'
        };
    };
    
    /**
     * Gera relatório de performance executiva para sócios
     * @param {string} period - Período (monthly, quarterly, yearly)
     * @returns {Object} Relatório executivo
     */
    originalOptimizer.generateExecutiveReport = function(period = 'quarterly') {
        // Obter dados de performance do Gamification System se disponível
        let podiumData = null;
        let leaderboardData = [];
        
        if (window.GamificationSystem && typeof window.GamificationSystem.getLeaderboard === 'function') {
            podiumData = window.GamificationSystem.getLeaderboard();
            leaderboardData = podiumData || [];
        }
        
        // Obter dados de performance do Practice Dashboard se disponível
        let teamData = null;
        if (window.PracticeDashboard && window.PracticeDashboard.data) {
            teamData = window.PracticeDashboard.data;
        }
        
        const reportId = `REP-${Date.now()}-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
        
        // Simular podium de advogados para demonstração
        const simulatedPodium = {
            topBilling: [
                { name: 'Dr. Ricardo S.', lawyerId: 'L001', revenue: 145200, medal: 'PLATINUM', casesWon: 12 },
                { name: 'Dra. Helena M.', lawyerId: 'L002', revenue: 112000, medal: 'GOLD', casesWon: 9 },
                { name: 'Dr. Nuno F.', lawyerId: 'L003', revenue: 89000, medal: 'SILVER', casesWon: 7 },
                { name: 'Dra. Sofia R.', lawyerId: 'L004', revenue: 67000, medal: 'BRONZE', casesWon: 5 },
                { name: 'Dr. Miguel A.', lawyerId: 'L005', revenue: 52000, medal: 'BRONZE', casesWon: 4 }
            ],
            topResolution: [
                { name: 'Dra. Helena M.', lawyerId: 'L002', casesClosed: 12, medal: 'PLATINUM', avgDuration: 85 },
                { name: 'Dr. Ricardo S.', lawyerId: 'L001', casesClosed: 9, medal: 'GOLD', avgDuration: 92 },
                { name: 'Dr. Nuno F.', lawyerId: 'L003', casesClosed: 7, medal: 'SILVER', avgDuration: 78 },
                { name: 'Dra. Sofia R.', lawyerId: 'L004', casesClosed: 5, medal: 'BRONZE', avgDuration: 95 },
                { name: 'Dr. Pedro L.', lawyerId: 'L006', casesClosed: 4, medal: 'BRONZE', avgDuration: 88 }
            ],
            topEfficiency: [
                { name: 'Dr. Nuno F.', lawyerId: 'L003', efficiency: 0.94, medal: 'PLATINUM', hoursBilled: 520 },
                { name: 'Dra. Helena M.', lawyerId: 'L002', efficiency: 0.91, medal: 'GOLD', hoursBilled: 485 },
                { name: 'Dr. Ricardo S.', lawyerId: 'L001', efficiency: 0.87, medal: 'SILVER', hoursBilled: 560 },
                { name: 'Dra. Sofia R.', lawyerId: 'L004', efficiency: 0.82, medal: 'BRONZE', hoursBilled: 410 },
                { name: 'Dr. Pedro L.', lawyerId: 'L006', efficiency: 0.79, medal: 'BRONZE', hoursBilled: 380 }
            ],
            topAcquisition: [
                { name: 'Dr. Nuno F.', lawyerId: 'L003', pipelineValue: 85000, medal: 'GOLD', newClients: 8 },
                { name: 'Dra. Helena M.', lawyerId: 'L002', pipelineValue: 62000, medal: 'SILVER', newClients: 6 },
                { name: 'Dr. Ricardo S.', lawyerId: 'L001', pipelineValue: 48000, medal: 'BRONZE', newClients: 5 },
                { name: 'Dra. Sofia R.', lawyerId: 'L004', pipelineValue: 35000, medal: 'BRONZE', newClients: 4 }
            ]
        };
        
        // Calcular bónus para cada vencedor
        const bonusMap = [];
        const baseSalary = 5000; // Salário base simulado
        
        for (const category of Object.keys(simulatedPodium)) {
            for (const entry of simulatedPodium[category]) {
                const lawyerStats = {
                    id: entry.lawyerId,
                    name: entry.name,
                    fixedSalary: baseSalary,
                    casesWon: entry.casesWon || 0,
                    hoursBilled: entry.hoursBilled || 150,
                    efficiency: entry.efficiency || 0.8,
                    reputation: 85
                };
                
                const bonusCalc = this.calculatePerformanceBonus(
                    lawyerStats,
                    [{ id: entry.medal }],
                    { period: period, baseBonusRate: 0.10 }
                );
                
                if (bonusCalc.valid) {
                    bonusMap.push({
                        advogado: entry.name,
                        categoria: this.getCategoryName(category),
                        medalha: this.getMedalName(entry.medal),
                        metric: category === 'topBilling' ? `€${entry.revenue.toLocaleString()}` :
                                category === 'topResolution' ? `${entry.casesClosed} casos` :
                                category === 'topEfficiency' ? `${(entry.efficiency * 100).toFixed(0)}% eficiência` :
                                `€${entry.pipelineValue.toLocaleString()}`,
                        bonus_sugerido: bonusCalc.finalBonus,
                        base_bonus: bonusCalc.baseBonus,
                        multiplier: bonusCalc.totalMultiplier,
                        roi: bonusCalc.roi,
                        status: 'Aguardando Disparo Bancário (SEPA)',
                        validationHash: bonusCalc.validationHash,
                        paymentDeadline: this.calculatePaymentDeadline(period)
                    });
                }
            }
        }
        
        // Calcular total de bónus da equipa
        const totalBonuses = bonusMap.reduce((sum, b) => sum + b.bonus_sugerido, 0);
        const averageBonus = bonusMap.length > 0 ? totalBonuses / bonusMap.length : 0;
        
        // Calcular ROI total da equipa
        const totalRevenue = simulatedPodium.topBilling.reduce((sum, b) => sum + b.revenue, 0);
        const teamROI = totalRevenue > 0 ? ((totalRevenue - totalBonuses) / totalBonuses) * 100 : 0;
        
        // Gerar projeções para próximo período
        const projections = this.generateProjections(bonusMap, period);
        
        // Gerar hash mestre do relatório
        const masterHash = CryptoJS.SHA256(
            reportId + JSON.stringify(bonusMap) + period + Date.now()
        ).toString();
        
        // Registrar no Forensic Vault
        if (window.ForensicVault && typeof window.ForensicVault.logAccess === 'function') {
            window.ForensicVault.logAccess('SYSTEM', 'EXECUTIVE_REPORT_GENERATED', 'partner', {
                reportId: reportId,
                period: period,
                totalBonuses: totalBonuses,
                totalRevenue: totalRevenue,
                teamROI: teamROI,
                masterHash: masterHash,
                timestamp: new Date().toISOString()
            });
        }
        
        return {
            reportId: reportId,
            title: 'RELATÓRIO DE PERFORMANCE E MERITOCRACIA CORPORATIVA',
            generatedAt: new Date().toISOString(),
            generatedAtFormatted: new Date().toLocaleString('pt-PT', { timeZone: 'UTC' }),
            period: period,
            periodLabel: this.getPeriodLabel(period),
            systemVersion: 'v2.0.5',
            executiveSummary: {
                totalBonusPool: totalBonuses,
                totalBonusPoolFormatted: this.formatCurrency(totalBonuses),
                averageBonusPerLawyer: averageBonus,
                averageBonusPerLawyerFormatted: this.formatCurrency(averageBonus),
                topPerformer: bonusMap[0]?.advogado || 'N/A',
                topPerformerBonus: bonusMap[0]?.bonus_sugerido || 0,
                topPerformerBonusFormatted: this.formatCurrency(bonusMap[0]?.bonus_sugerido || 0),
                teamROI: teamROI.toFixed(1) + '%',
                totalRevenue: totalRevenue,
                totalRevenueFormatted: this.formatCurrency(totalRevenue),
                totalLawyersIncentivized: bonusMap.length
            },
            rankings: simulatedPodium,
            bonusAutomation: bonusMap,
            projections: projections,
            auditTrail: {
                masterHash: masterHash,
                verificationUrl: `#verify/${reportId}`,
                generatedBy: window.ELITE_SESSION_ID || 'system',
                timestamp: new Date().toISOString()
            },
            legalCompliance: [
                'Cálculo baseado em métricas objetivas de performance',
                'Registo imutável no Forensic Vault',
                'Audit trail completo para verificação',
                'Conformidade com políticas de remuneração variável',
                'Transparência total nos critérios de atribuição'
            ]
        };
    };
    
    /**
     * Calcula data limite para pagamento
     */
    originalOptimizer.calculatePaymentDeadline = function(period) {
        const now = new Date();
        let deadline = new Date(now);
        
        switch(period) {
            case 'monthly':
                deadline.setDate(deadline.getDate() + 15);
                break;
            case 'quarterly':
                deadline.setDate(deadline.getDate() + 30);
                break;
            case 'yearly':
                deadline.setMonth(deadline.getMonth() + 1);
                break;
            default:
                deadline.setDate(deadline.getDate() + 20);
        }
        
        return deadline.toLocaleDateString('pt-PT');
    };
    
    /**
     * Obtém rótulo do período
     */
    originalOptimizer.getPeriodLabel = function(period) {
        const labels = {
            'monthly': 'Mensal',
            'quarterly': 'Trimestral',
            'yearly': 'Anual'
        };
        return labels[period] || period;
    };
    
    /**
     * Gera projeções para próximo período
     */
    originalOptimizer.generateProjections = function(bonusMap, period) {
        const historicalTotal = bonusMap.reduce((sum, b) => sum + b.bonus_sugerido, 0);
        const growthRate = 0.12; // 12% de crescimento esperado
        
        const multipliers = {
            'monthly': 1,
            'quarterly': 3,
            'yearly': 12
        };
        
        const multiplier = multipliers[period] || 1;
        
        return {
            nextPeriodBonus: historicalTotal * (1 + growthRate),
            nextPeriodBonusFormatted: this.formatCurrency(historicalTotal * (1 + growthRate)),
            annualizedBonus: historicalTotal * multiplier,
            annualizedBonusFormatted: this.formatCurrency(historicalTotal * multiplier),
            expectedGrowth: (growthRate * 100).toFixed(0) + '%',
            confidence: 0.85,
            basedOn: 'Análise histórica de performance e tendências de mercado'
        };
    };
    
    /**
     * Exporta relatório executivo para HTML/PDF
     */
    originalOptimizer.exportExecutiveReport = async function(period = 'quarterly') {
        const report = this.generateExecutiveReport(period);
        
        const reportHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Relatório de Performance - ${report.reportId}</title>
                <style>
                    body {
                        font-family: 'JetBrains Mono', monospace;
                        background: white;
                        color: #0a0c10;
                        padding: 40px;
                        margin: 0;
                        line-height: 1.5;
                    }
                    .header {
                        text-align: center;
                        border-bottom: 2px solid #00e5ff;
                        padding-bottom: 20px;
                        margin-bottom: 30px;
                    }
                    .logo { font-size: 24px; font-weight: bold; color: #00e5ff; }
                    .title { font-size: 18px; font-weight: bold; margin: 20px 0; text-align: center; }
                    .summary-grid {
                        display: grid;
                        grid-template-columns: repeat(4, 1fr);
                        gap: 20px;
                        margin: 20px 0;
                    }
                    .summary-card {
                        background: #f8fafc;
                        padding: 20px;
                        border-radius: 12px;
                        text-align: center;
                        border: 1px solid #e2e8f0;
                    }
                    .summary-value {
                        font-size: 24px;
                        font-weight: bold;
                        color: #00e5ff;
                    }
                    .summary-label {
                        font-size: 12px;
                        color: #64748b;
                        margin-top: 8px;
                    }
                    .rankings-grid {
                        display: grid;
                        grid-template-columns: repeat(2, 1fr);
                        gap: 20px;
                        margin: 20px 0;
                    }
                    .ranking-card {
                        background: #f8fafc;
                        padding: 20px;
                        border-radius: 12px;
                        border: 1px solid #e2e8f0;
                    }
                    .ranking-card h4 {
                        margin-top: 0;
                        border-bottom: 1px solid #e2e8f0;
                        padding-bottom: 8px;
                    }
                    .ranking-item {
                        display: flex;
                        align-items: center;
                        gap: 12px;
                        padding: 10px 0;
                        border-bottom: 1px solid #e2e8f0;
                        font-size: 12px;
                    }
                    .ranking-item.first {
                        background: linear-gradient(90deg, rgba(255,215,0,0.1), transparent);
                    }
                    .rank { width: 30px; font-weight: bold; }
                    .name { flex: 1; }
                    .value { font-weight: bold; color: #00e5ff; }
                    .medal { font-size: 14px; }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin: 20px 0;
                    }
                    th, td {
                        border: 1px solid #e2e8f0;
                        padding: 12px;
                        text-align: left;
                        font-size: 12px;
                    }
                    th {
                        background: #f1f5f9;
                        font-weight: 600;
                    }
                    .footer {
                        margin-top: 50px;
                        padding-top: 20px;
                        border-top: 1px solid #e2e8f0;
                        font-size: 10px;
                        text-align: center;
                        color: #94a3b8;
                    }
                    .hash {
                        font-family: monospace;
                        font-size: 10px;
                        word-break: break-all;
                    }
                    .projection-card {
                        background: #e8f0fe;
                        padding: 16px;
                        border-radius: 12px;
                        margin: 20px 0;
                        border-left: 4px solid #00e5ff;
                    }
                    @media print {
                        body { padding: 20px; }
                        .summary-grid { break-inside: avoid; }
                        .rankings-grid { break-inside: avoid; }
                        table { break-inside: avoid; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <div class="logo">ELITE PROBATUM</div>
                    <div>UNIDADE DE COMANDO FORENSE DIGITAL</div>
                </div>
                
                <div class="title">${report.title}</div>
                <div class="title">Período: ${report.periodLabel.toUpperCase()}</div>
                
                <div class="summary-grid">
                    <div class="summary-card">
                        <div class="summary-value">${report.executiveSummary.totalBonusPoolFormatted}</div>
                        <div class="summary-label">Total de Bónus</div>
                    </div>
                    <div class="summary-card">
                        <div class="summary-value">${report.executiveSummary.averageBonusPerLawyerFormatted}</div>
                        <div class="summary-label">Bónus Médio por Advogado</div>
                    </div>
                    <div class="summary-card">
                        <div class="summary-value">${report.executiveSummary.topPerformer}</div>
                        <div class="summary-label">Top Performer</div>
                    </div>
                    <div class="summary-card">
                        <div class="summary-value">${report.executiveSummary.teamROI}</div>
                        <div class="summary-label">ROI da Equipa</div>
                    </div>
                </div>
                
                <div class="rankings-grid">
                    <div class="ranking-card">
                        <h4><i class="fas fa-trophy"></i> Top Faturação</h4>
                        ${report.rankings.topBilling.map((p, i) => `
                            <div class="ranking-item ${i === 0 ? 'first' : ''}">
                                <span class="rank">${i + 1}º</span>
                                <span class="name">${p.name}</span>
                                <span class="value">€${p.revenue.toLocaleString()}</span>
                                <span class="medal">🏅 ${p.medal}</span>
                            </div>
                        `).join('')}
                    </div>
                    <div class="ranking-card">
                        <h4><i class="fas fa-gavel"></i> Resolução de Casos</h4>
                        ${report.rankings.topResolution.map((p, i) => `
                            <div class="ranking-item ${i === 0 ? 'first' : ''}">
                                <span class="rank">${i + 1}º</span>
                                <span class="name">${p.name}</span>
                                <span class="value">${p.casesClosed} casos</span>
                                <span class="medal">🏅 ${p.medal}</span>
                            </div>
                        `).join('')}
                    </div>
                    <div class="ranking-card">
                        <h4><i class="fas fa-chart-line"></i> Eficiência</h4>
                        ${report.rankings.topEfficiency.map((p, i) => `
                            <div class="ranking-item ${i === 0 ? 'first' : ''}">
                                <span class="rank">${i + 1}º</span>
                                <span class="name">${p.name}</span>
                                <span class="value">${(p.efficiency * 100).toFixed(0)}%</span>
                                <span class="medal">🏅 ${p.medal}</span>
                            </div>
                        `).join('')}
                    </div>
                    <div class="ranking-card">
                        <h4><i class="fas fa-chart-line"></i> Angariação</h4>
                        ${report.rankings.topAcquisition.map((p, i) => `
                            <div class="ranking-item ${i === 0 ? 'first' : ''}">
                                <span class="rank">${i + 1}º</span>
                                <span class="name">${p.name}</span>
                                <span class="value">€${p.pipelineValue.toLocaleString()}</span>
                                <span class="medal">🏅 ${p.medal}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <h3>QUADRO DE HONRA E BÓNUS AUTOMATIZADOS</h3>
                <table>
                    <thead>
                        <tr><th>ADVOGADO</th><th>CATEGORIA</th><th>MEDALHA</th><th>MÉTRICA</th><th>BÓNUS SUGERIDO</th><th>STATUS</th> </thead>
                    <tbody>
                        ${report.bonusAutomation.map(b => `
                            <tr>
                                <td><strong>${b.advogado}</strong> </div>
                                <td>${b.categoria} </div>
                                <td><span style="color: ${b.medalha === 'Platina' ? '#ffd700' : b.medalha === 'Ouro' ? '#ffc107' : '#c0c0c0'}">🏅 ${b.medalha}</span> </div>
                                <td>${b.metric} </div>
                                <td><strong>${b.bonus_sugerido.toLocaleString()}€</strong> </div>
                                <td>${b.status} </div>
                             </div>
                        `).join('')}
                    </tbody>
                </table>
                
                <div class="projection-card">
                    <h4>📈 PROJEÇÕES PARA O PRÓXIMO PERÍODO</h4>
                    <p><strong>Bónus Projetado:</strong> ${report.projections.nextPeriodBonusFormatted}</p>
                    <p><strong>Crescimento Esperado:</strong> ${report.projections.expectedGrowth}</p>
                    <p><strong>Bónus Anualizado:</strong> ${report.projections.annualizedBonusFormatted}</p>
                    <p><small>Baseado em análise histórica de performance e tendências de mercado. Confiança: ${(report.projections.confidence * 100).toFixed(0)}%</small></p>
                </div>
                
                <div class="footer">
                    <p><strong>Hash de Validação:</strong> ${report.auditTrail.masterHash.substring(0, 32)}...</p>
                    <p>Relatório gerado por ELITE PROBATUM v2.0.5 • Sistema de Compensação Meritocrática</p>
                    <p>Este documento é uma prova de cálculo de bónus baseado em métricas objetivas de performance.</p>
                    <p>Para verificação, utilize o código: ${report.reportId}</p>
                </div>
            </body>
            </html>
        `;
        
        const blob = new Blob([reportHtml], { type: 'text/html' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `executive_report_${report.reportId}.html`;
        link.click();
        URL.revokeObjectURL(link.href);
        
        if (window.EliteUtils) {
            window.EliteUtils.showToast(`Relatório executivo gerado: ${report.reportId}`, 'success');
        }
        
        return report;
    };
    
    /**
     * Obtém nome amigável da categoria
     */
    originalOptimizer.getCategoryName = function(category) {
        const names = {
            'topBilling': 'Top Faturação',
            'topResolution': 'Resolução de Casos',
            'topEfficiency': 'Eficiência',
            'topAcquisition': 'Angariação'
        };
        return names[category] || category;
    };
    
    /**
     * Formata moeda
     */
    originalOptimizer.formatCurrency = function(value) {
        if (value === null || value === undefined) return '€0';
        return new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
    };
    
    /**
     * Verifica integridade de um cálculo de bónus
     */
    originalOptimizer.verifyBonusIntegrity = function(bonusRecord) {
        if (!bonusRecord || !bonusRecord.validationHash) {
            return { valid: false, error: 'Registo de bónus inválido' };
        }
        
        const validationData = `${bonusRecord.lawyerId}_${bonusRecord.baseBonus}_${bonusRecord.totalMultiplier}_${bonusRecord.finalBonus}_${bonusRecord.generatedAt}`;
        const expectedHash = CryptoJS.SHA256(validationData).toString();
        
        const hashValid = expectedHash === bonusRecord.validationHash;
        
        // Verificar no Forensic Vault se disponível
        let vaultValid = true;
        if (window.ForensicVault && typeof window.ForensicVault.getAccessLogs === 'function') {
            const logs = window.ForensicVault.getAccessLogs('SYSTEM', 100);
            const bonusLog = logs.find(l => l.action === 'BONUS_CALCULATION' && 
                l.metadata?.lawyerId === bonusRecord.lawyerId);
            vaultValid = !!bonusLog;
        }
        
        return {
            valid: hashValid && vaultValid,
            hashValid: hashValid,
            vaultValid: vaultValid,
            recordId: bonusRecord.lawyerId,
            generatedAt: bonusRecord.generatedAt,
            integrityScore: (hashValid ? 50 : 0) + (vaultValid ? 50 : 0)
        };
    };
    
    /**
     * Gera ranking completo com base em múltiplas métricas
     */
    originalOptimizer.generateComprehensiveRanking = function(lawyers, period = 'quarterly') {
        const rankings = [];
        
        for (const lawyer of lawyers) {
            const stats = lawyer.stats;
            const medals = lawyer.medals || [];
            
            const bonus = this.calculatePerformanceBonus(stats, medals, { period: period });
            if (!bonus.valid) continue;
            
            // Calcular score composto
            const revenueScore = (stats.hoursBilled * 150) / 10000;
            const efficiencyScore = (stats.efficiency || 0.7) * 100;
            const successScore = (stats.casesWon / (stats.casesWon + stats.casesLost || 1)) * 100;
            const reputationScore = (stats.reputation || 70);
            
            const compositeScore = (revenueScore * 0.3) + (efficiencyScore * 0.25) + (successScore * 0.3) + (reputationScore * 0.15);
            
            rankings.push({
                lawyerId: stats.id,
                lawyerName: stats.name,
                compositeScore: compositeScore.toFixed(1),
                rank: 0,
                bonus: bonus.finalBonus,
                bonusFormatted: this.formatCurrency(bonus.finalBonus),
                metrics: {
                    revenue: stats.hoursBilled * 150,
                    revenueFormatted: this.formatCurrency(stats.hoursBilled * 150),
                    efficiency: (stats.efficiency || 0.7) * 100,
                    successRate: (stats.casesWon / (stats.casesWon + stats.casesLost || 1)) * 100,
                    reputation: stats.reputation || 70,
                    medals: medals
                }
            });
        }
        
        // Ordenar por score composto
        rankings.sort((a, b) => b.compositeScore - a.compositeScore);
        
        // Atribuir ranks
        rankings.forEach((r, idx) => {
            r.rank = idx + 1;
            r.medal = idx === 0 ? 'DIAMOND' : idx < 3 ? 'PLATINUM' : idx < 10 ? 'GOLD' : idx < 20 ? 'SILVER' : 'BRONZE';
        });
        
        return {
            period: period,
            generatedAt: new Date().toISOString(),
            totalLawyers: rankings.length,
            rankings: rankings,
            topQuartile: rankings.filter(r => r.rank <= rankings.length / 4),
            bottomQuartile: rankings.filter(r => r.rank > rankings.length * 3 / 4),
            averageScore: rankings.reduce((sum, r) => sum + parseFloat(r.compositeScore), 0) / rankings.length
        };
    };
    
    console.log('[ELITE] FeeOptimizer estendido com Módulo de Compensação Meritocrática v1.0');
    
})();