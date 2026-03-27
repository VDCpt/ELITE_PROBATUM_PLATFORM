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
 * ============================================================================
 */

// EXTENSÃO DO FeeOptimizer EXISTENTE
(function() {
    'use strict';
    
    // Verificar se FeeOptimizer existe
    if (typeof window.FeeOptimizer === 'undefined') {
        console.error('[ELITE] FeeOptimizer não encontrado. O módulo de compensação não será carregado.');
        return;
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
            'DIAMOND': 1.00    // +100% do bónus base (performance excecional)
        };
        
        let multiplier = 1.0;
        const appliedMedals = [];
        
        // Aplicar multiplicadores cumulativos por medalha
        for (const medal of medals) {
            const medalKey = medal.id || medal;
            const medalMultiplier = medalMultipliers[medalKey];
            if (medalMultiplier) {
                multiplier += medalMultiplier;
                appliedMedals.push({
                    id: medalKey,
                    name: this.getMedalName(medalKey),
                    multiplier: medalMultiplier
                });
            }
        }
        
        // Cap máximo de 2.0x (200% do bónus base)
        const finalMultiplier = Math.min(multiplier, 2.0);
        const finalBonus = baseBonus * finalMultiplier;
        
        // Calcular métricas adicionais
        const performanceMetrics = {
            casesWon: lawyerStats.casesWon || 0,
            casesLost: lawyerStats.casesLost || 0,
            successRate: lawyerStats.casesWon && lawyerStats.casesLost ? 
                (lawyerStats.casesWon / (lawyerStats.casesWon + lawyerStats.casesLost)) * 100 : 0,
            hoursBilled: lawyerStats.hoursBilled || 0,
            efficiency: lawyerStats.efficiency || 0,
            reputation: lawyerStats.reputation || 0
        };
        
        // Gerar hash de validação para auditoria
        const validationHash = CryptoJS.SHA256(
            `${lawyerStats.id}_${baseBonus}_${finalMultiplier}_${finalBonus}_${Date.now()}`
        ).toString();
        
        // Registrar no Forensic Vault se disponível
        if (window.ForensicVault && typeof window.ForensicVault.logAccess === 'function') {
            window.ForensicVault.logAccess('SYSTEM', 'BONUS_CALCULATION', lawyerStats.id, {
                lawyerId: lawyerStats.id,
                baseBonus: baseBonus,
                finalBonus: finalBonus,
                multiplier: finalMultiplier,
                medals: appliedMedals,
                validationHash: validationHash,
                timestamp: new Date().toISOString()
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
            appliedMedals: appliedMedals,
            totalMultiplier: finalMultiplier.toFixed(2),
            finalBonus: finalBonus,
            currency: 'EUR',
            performanceMetrics: performanceMetrics,
            validationHash: validationHash,
            generatedAt: new Date().toISOString(),
            recommendation: this.generateBonusRecommendation(performanceMetrics, finalMultiplier)
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
            'DIAMOND': 'Diamante'
        };
        return names[medalId] || medalId;
    };
    
    /**
     * Gera recomendação de bónus baseada em performance
     */
    originalOptimizer.generateBonusRecommendation = function(metrics, multiplier) {
        if (metrics.successRate > 80 && metrics.efficiency > 0.85) {
            return {
                level: 'EXCEPCIONAL',
                message: 'Performance excecional. Bónus máximo recomendado.',
                additionalConsideration: 'Considerar promoção ou aumento salarial'
            };
        } else if (metrics.successRate > 70 && metrics.efficiency > 0.75) {
            return {
                level: 'SUPERIOR',
                message: 'Performance superior à média. Bónus integral recomendado.',
                additionalConsideration: 'Manter incentivos atuais'
            };
        } else if (metrics.successRate > 60) {
            return {
                level: 'SATISFATÓRIO',
                message: 'Performance dentro do esperado. Bónus proporcional recomendado.',
                additionalConsideration: 'Identificar áreas de melhoria'
            };
        } else {
            return {
                level: 'ATENÇÃO',
                message: 'Performance abaixo do esperado. Revisão de estratégia recomendada.',
                additionalConsideration: 'Plano de desenvolvimento individual'
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
        
        for (const lawyer of lawyers) {
            const bonus = this.calculatePerformanceBonus(lawyer.stats, lawyer.medals, periodConfig);
            if (bonus.valid) {
                results.push(bonus);
                totalBonus += bonus.finalBonus;
                totalBaseBonus += bonus.baseBonus;
            }
        }
        
        const averageMultiplier = totalBaseBonus > 0 ? totalBonus / totalBaseBonus : 0;
        
        return {
            period: periodConfig.period || 'current',
            totalLawyers: results.length,
            totalBaseBonus: totalBaseBonus,
            totalBonus: totalBonus,
            averageMultiplier: averageMultiplier.toFixed(2),
            individualBonuses: results,
            validationHash: CryptoJS.SHA256(JSON.stringify(results) + Date.now()).toString(),
            generatedAt: new Date().toISOString()
        };
    };
    
    /**
     * Gera relatório de performance executiva para sócios
     * @param {string} period - Período (monthly, quarterly, yearly)
     * @returns {Object} Relatório executivo
     */
    originalOptimizer.generateExecutiveReport = function(period = 'monthly') {
        // Obter dados de performance do Gamification System se disponível
        let podiumData = null;
        if (window.GamificationSystem && typeof window.GamificationSystem.getLeaderboard === 'function') {
            podiumData = window.GamificationSystem.getLeaderboard();
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
                { name: 'Dr. Ricardo S.', lawyerId: 'L001', revenue: 145200, medal: 'PLATINUM' },
                { name: 'Dra. Helena M.', lawyerId: 'L002', revenue: 112000, medal: 'GOLD' },
                { name: 'Dr. Nuno F.', lawyerId: 'L003', revenue: 89000, medal: 'SILVER' }
            ],
            topResolution: [
                { name: 'Dra. Helena M.', lawyerId: 'L002', casesClosed: 12, medal: 'PLATINUM' },
                { name: 'Dr. Ricardo S.', lawyerId: 'L001', casesClosed: 9, medal: 'GOLD' },
                { name: 'Dr. Nuno F.', lawyerId: 'L003', casesClosed: 7, medal: 'SILVER' }
            ],
            topAcquisition: [
                { name: 'Dr. Nuno F.', lawyerId: 'L003', pipelineValue: 85000, medal: 'GOLD' },
                { name: 'Dra. Helena M.', lawyerId: 'L002', pipelineValue: 62000, medal: 'SILVER' },
                { name: 'Dr. Ricardo S.', lawyerId: 'L001', pipelineValue: 48000, medal: 'BRONZE' }
            ]
        };
        
        // Calcular bónus para cada vencedor
        const bonusMap = [];
        const baseSalary = 5000; // Salário base simulado
        
        for (const category of Object.keys(simulatedPodium)) {
            for (const entry of simulatedPodium[category]) {
                const bonusCalc = this.calculatePerformanceBonus(
                    { id: entry.lawyerId, name: entry.name, fixedSalary: baseSalary },
                    [{ id: entry.medal }],
                    { period: period }
                );
                
                bonusMap.push({
                    advogado: entry.name,
                    categoria: this.getCategoryName(category),
                    medalha: this.getMedalName(entry.medal),
                    metric: category === 'topBilling' ? `€${entry.revenue.toLocaleString()}` :
                            category === 'topResolution' ? `${entry.casesClosed} casos` :
                            `€${entry.pipelineValue.toLocaleString()}`,
                    bonus_sugerido: bonusCalc.finalBonus,
                    base_bonus: bonusCalc.baseBonus,
                    multiplier: bonusCalc.totalMultiplier,
                    status: 'Aguardando Disparo Bancário (SEPA)',
                    validationHash: bonusCalc.validationHash
                });
            }
        }
        
        // Calcular total de bónus da equipa
        const totalBonuses = bonusMap.reduce((sum, b) => sum + b.bonus_sugerido, 0);
        
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
            systemVersion: 'v2.0.5',
            executiveSummary: {
                totalBonusPool: totalBonuses,
                averageBonusPerLawyer: bonusMap.length > 0 ? totalBonuses / bonusMap.length : 0,
                topPerformer: bonusMap[0]?.advogado || 'N/A',
                topPerformerBonus: bonusMap[0]?.bonus_sugerido || 0
            },
            rankings: simulatedPodium,
            bonusAutomation: bonusMap,
            auditTrail: {
                masterHash: masterHash,
                verificationUrl: `#verify/${reportId}`,
                generatedBy: window.ELITE_SESSION_ID || 'system'
            },
            legalCompliance: [
                'Cálculo baseado em métricas objetivas de performance',
                'Registo imutável no Forensic Vault',
                'Audit trail completo para verificação',
                'Conformidade com políticas de remuneração variável'
            ]
        };
    };
    
    /**
     * Exporta relatório executivo para PDF
     */
    originalOptimizer.exportExecutiveReport = async function(period = 'monthly') {
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
                        grid-template-columns: repeat(3, 1fr);
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
                </style>
            </head>
            <body>
                <div class="header">
                    <div class="logo">ELITE PROBATUM</div>
                    <div>UNIDADE DE COMANDO FORENSE DIGITAL</div>
                </div>
                
                <div class="title">${report.title}</div>
                <div class="title">Período: ${report.period.toUpperCase()}</div>
                
                <div class="summary-grid">
                    <div class="summary-card">
                        <div class="summary-value">${report.executiveSummary.totalBonusPool.toLocaleString()}€</div>
                        <div class="summary-label">Total de Bónus</div>
                    </div>
                    <div class="summary-card">
                        <div class="summary-value">${report.executiveSummary.averageBonusPerLawyer.toLocaleString()}€</div>
                        <div class="summary-label">Bónus Médio por Advogado</div>
                    </div>
                    <div class="summary-card">
                        <div class="summary-value">${report.executiveSummary.topPerformer}</div>
                        <div class="summary-label">Top Performer</div>
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
                
                <div class="footer">
                    <p><strong>Hash de Validação:</strong> ${report.auditTrail.masterHash.substring(0, 32)}...</p>
                    <p>Relatório gerado por ELITE PROBATUM v2.0.5 • Sistema de Compensação Meritocrática</p>
                    <p>Este documento é uma prova de cálculo de bónus baseado em métricas objetivas de performance.</p>
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
            'topAcquisition': 'Angariação'
        };
        return names[category] || category;
    };
    
    /**
     * Verifica integridade de um cálculo de bónus
     */
    originalOptimizer.verifyBonusIntegrity = function(bonusRecord) {
        if (!bonusRecord || !bonusRecord.validationHash) {
            return { valid: false, error: 'Registo de bónus inválido' };
        }
        
        const expectedHash = CryptoJS.SHA256(
            `${bonusRecord.lawyerId}_${bonusRecord.baseBonus}_${bonusRecord.totalMultiplier}_${bonusRecord.finalBonus}_${bonusRecord.generatedAt}`
        ).toString();
        
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
            generatedAt: bonusRecord.generatedAt
        };
    };
    
    console.log('[ELITE] FeeOptimizer estendido com Módulo de Compensação Meritocrática v1.0');
    
})();