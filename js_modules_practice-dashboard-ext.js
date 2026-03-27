/**
 * ============================================================================
 * ELITE PROBATUM v2.0.5 — EXTENSÃO DO DASHBOARD PARA SÓCIOS
 * ARQUITETURA DE VERDADE E RELATÓRIO EXECUTIVO
 * ============================================================================
 * ADITAMENTO AO PracticeDashboard EXISTENTE:
 * 1. Nova rota "Arquitetura de Verdade" (antigo Relatórios)
 * 2. Integração com Shadow Dossier Manager
 * 3. Integração com Black Swan Predictor
 * 4. Integração com Forensic Decomposition
 * 5. Relatório de performance executiva com bónus meritocráticos
 * ============================================================================
 */

// EXTENSÃO DO PracticeDashboard EXISTENTE
(function() {
    'use strict';
    
    // Verificar se PracticeDashboard existe
    if (typeof window.PracticeDashboard === 'undefined') {
        console.error('[ELITE] PracticeDashboard não encontrado. A extensão não será carregada.');
        return;
    }
    
    const originalDashboard = window.PracticeDashboard;
    
    /**
     * Renderiza a nova view "Arquitetura de Verdade"
     * Substitui o antigo módulo de Relatórios
     */
    originalDashboard.renderTruthArchitecture = function() {
        const container = document.getElementById('viewContainer');
        if (!container) return;
        
        // Obter estatísticas do Shadow Dossier
        const shadowStats = window.ShadowDossier ? window.ShadowDossier.getStatistics() : null;
        
        // Obter estatísticas do Black Swan
        const blackSwanStats = window.BlackSwan ? window.BlackSwan.getSimulationHistory(1)[0] : null;
        
        // Obter relatório executivo
        const executiveReport = window.FeeOptimizer ? window.FeeOptimizer.generateExecutiveReport('quarterly') : null;
        
        container.innerHTML = `
            <div class="truth-architecture-dashboard">
                <div class="dashboard-header">
                    <h2><i class="fas fa-chess-queen"></i> ARQUITETURA DE VERDADE</h2>
                    <div class="header-badges">
                        <span class="badge badge-primary"><i class="fas fa-link"></i> Shadow Dossier Ativo</span>
                        <span class="badge badge-success"><i class="fas fa-chart-line"></i> Monte Carlo Online</span>
                        <span class="badge badge-info"><i class="fas fa-shield-alt"></i> Forensic Vault</span>
                    </div>
                </div>
                
                <div class="truth-summary">
                    <div class="summary-card">
                        <div class="summary-icon"><i class="fas fa-fingerprint"></i></div>
                        <div class="summary-content">
                            <div class="summary-value">${shadowStats ? shadowStats.totalBindings : 0}</div>
                            <div class="summary-label">Vínculos CITIUS</div>
                            <div class="summary-trend">${shadowStats ? `${shadowStats.validBindings} validados` : '0 validados'}</div>
                        </div>
                    </div>
                    <div class="summary-card">
                        <div class="summary-icon"><i class="fas fa-chart-simple"></i></div>
                        <div class="summary-content">
                            <div class="summary-value">${blackSwanStats ? blackSwanStats.parameters.iterations.toLocaleString() : '0'}</div>
                            <div class="summary-label">Simulações Monte Carlo</div>
                            <div class="summary-trend">Análise de ${blackSwanStats ? (blackSwanStats.riskMetrics.lossProbability * 100).toFixed(0) : '0'}% risco</div>
                        </div>
                    </div>
                    <div class="summary-card">
                        <div class="summary-icon"><i class="fas fa-file-alt"></i></div>
                        <div class="summary-content">
                            <div class="summary-value">${executiveReport ? executiveReport.bonusAutomation.length : 0}</div>
                            <div class="summary-label">Bónus Meritocráticos</div>
                            <div class="summary-trend">Total: €${executiveReport ? executiveReport.executiveSummary.totalBonusPool.toLocaleString() : '0'}</div>
                        </div>
                    </div>
                </div>
                
                <div class="truth-tabs">
                    <button class="tab-btn active" data-tab="shadow-dossier"><i class="fas fa-link"></i> Shadow Dossier</button>
                    <button class="tab-btn" data-tab="black-swan"><i class="fas fa-chart-line"></i> Black Swan Predictor</button>
                    <button class="tab-btn" data-tab="executive-report"><i class="fas fa-crown"></i> Relatório Executivo</button>
                    <button class="tab-btn" data-tab="forensic-decomposition"><i class="fas fa-microscope"></i> Decomposição Forense</button>
                </div>
                
                <div id="truth-tab-content" class="truth-tab-content">
                    ${this.renderShadowDossierTab()}
                </div>
            </div>
        `;
        
        // Estilos adicionais
        const style = document.createElement('style');
        style.textContent = `
            .truth-architecture-dashboard { padding: 0; }
            .dashboard-header { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; margin-bottom: 24px; }
            .header-badges { display: flex; gap: 8px; }
            .truth-summary { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 24px; }
            .summary-card { background: var(--bg-command); border-radius: 16px; padding: 20px; display: flex; align-items: center; gap: 16px; border: 1px solid var(--border-tactic); }
            .summary-icon { width: 48px; height: 48px; background: var(--elite-primary-dim); border-radius: 12px; display: flex; align-items: center; justify-content: center; }
            .summary-icon i { font-size: 1.5rem; color: var(--elite-primary); }
            .summary-value { font-size: 1.8rem; font-weight: 800; font-family: 'JetBrains Mono'; color: var(--elite-primary); }
            .summary-label { font-size: 0.7rem; color: #94a3b8; text-transform: uppercase; }
            .summary-trend { font-size: 0.65rem; color: #64748b; margin-top: 4px; }
            .truth-tabs { display: flex; gap: 8px; border-bottom: 1px solid var(--border-tactic); margin-bottom: 24px; padding-bottom: 0; }
            .tab-btn { background: transparent; border: none; padding: 12px 24px; color: #94a3b8; cursor: pointer; font-family: 'JetBrains Mono'; font-size: 0.8rem; transition: all 0.2s; border-bottom: 2px solid transparent; }
            .tab-btn:hover { color: var(--elite-primary); }
            .tab-btn.active { color: var(--elite-primary); border-bottom-color: var(--elite-primary); }
            .truth-tab-content { min-height: 500px; }
            @media (max-width: 768px) {
                .truth-summary { grid-template-columns: 1fr; }
                .truth-tabs { flex-wrap: wrap; }
                .tab-btn { padding: 8px 16px; font-size: 0.7rem; }
            }
        `;
        container.appendChild(style);
        
        // Event listeners para tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const tab = btn.dataset.tab;
                const contentDiv = document.getElementById('truth-tab-content');
                if (contentDiv) {
                    switch(tab) {
                        case 'shadow-dossier':
                            contentDiv.innerHTML = this.renderShadowDossierTab();
                            break;
                        case 'black-swan':
                            contentDiv.innerHTML = this.renderBlackSwanTab();
                            break;
                        case 'executive-report':
                            contentDiv.innerHTML = this.renderExecutiveReportTab();
                            break;
                        case 'forensic-decomposition':
                            contentDiv.innerHTML = this.renderForensicDecompositionTab();
                            break;
                        default:
                            contentDiv.innerHTML = this.renderShadowDossierTab();
                    }
                }
            });
        });
    };
    
    /**
     * Renderiza tab do Shadow Dossier
     */
    originalDashboard.renderShadowDossierTab = function() {
        const receipts = window.ShadowDossier ? window.ShadowDossier.getVerifiedReceipts() : [];
        
        return `
            <div class="shadow-dossier-panel">
                <div class="panel-header">
                    <h3><i class="fas fa-link"></i> Shadow Dossier - Vínculo CITIUS/SINOFE</h3>
                    <button id="newCitiusBinding" class="elite-btn small primary"><i class="fas fa-plus"></i> NOVO VÍNCULO</button>
                </div>
                
                ${receipts.length === 0 ? `
                    <div class="empty-state">
                        <i class="fas fa-inbox"></i>
                        <p>Nenhum vínculo CITIUS registado</p>
                        <small>Utilize o botão acima para vincular recibos oficiais do tribunal</small>
                    </div>
                ` : `
                    <table class="data-table">
                        <thead>
                            <tr><th>ID</th><th>Processo</th><th>Evidência</th><th>Data</th><th>Status</th><th>Ações</th> </thead>
                        <tbody>
                            ${receipts.slice(0, 10).map(r => `
                                <tr>
                                    <td><code>${r.bindingId.substring(0, 16)}...</code> </div>
                                    <td>${r.processId} </div>
                                    <td>${r.evidenceName} </div>
                                    <td>${new Date(r.bindingTimestamp).toLocaleDateString('pt-PT')} </div>
                                    <td><span class="status-badge ${r.hashMatch ? 'status-active' : 'status-critical'}">${r.hashMatch ? 'VERIFICADO' : 'INCONSISTENTE'}</span> </div>
                                    <td>
                                        <button class="action-btn view-binding" data-id="${r.bindingId}"><i class="fas fa-eye"></i></button>
                                        <button class="action-btn export-cert" data-id="${r.bindingId}"><i class="fas fa-file-pdf"></i></button>
                                     </div>
                                 </div>
                            `).join('')}
                        </tbody>
                     </div>
                `}
                
                <div class="shadow-stats">
                    <h4>Estatísticas de Sincronização</h4>
                    <div class="stats-grid">
                        <div class="stat">
                            <span class="stat-label">Total de Vínculos</span>
                            <span class="stat-value">${receipts.length}</span>
                        </div>
                        <div class="stat">
                            <span class="stat-label">Verificados</span>
                            <span class="stat-value">${receipts.filter(r => r.hashMatch).length}</span>
                        </div>
                        <div class="stat">
                            <span class="stat-label">Última Sincronização</span>
                            <span class="stat-value">${receipts[0] ? new Date(receipts[0].bindingTimestamp).toLocaleDateString('pt-PT') : 'N/A'}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    };
    
    /**
     * Renderiza tab do Black Swan Predictor
     */
    originalDashboard.renderBlackSwanTab = function() {
        // Usar um caso de exemplo para simulação
        const sampleCase = { id: 'SAMPLE', value: 12500000, successProbability: 68 };
        
        return `
            <div class="black-swan-panel">
                <div class="panel-header">
                    <h3><i class="fas fa-chart-line"></i> Black Swan Predictor - Simulação de Monte Carlo</h3>
                    <button id="runMonteCarlo" class="elite-btn small primary"><i class="fas fa-play"></i> EXECUTAR SIMULAÇÃO</button>
                </div>
                <div id="monteCarloResults"></div>
                <div class="black-swan-info">
                    <div class="info-card">
                        <i class="fas fa-info-circle"></i>
                        <div>
                            <strong>O que é o Black Swan Predictor?</strong>
                            <p>Motor de simulação estocástica que executa 10.000 iterações do desfecho processual, calculando o Value at Risk (VaR) Jurídico - o montante máximo que o cliente pode perder num cenário de "Cisne Negro".</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    };
    
    /**
     * Renderiza tab do Relatório Executivo
     */
    originalDashboard.renderExecutiveReportTab = function() {
        const report = window.FeeOptimizer ? window.FeeOptimizer.generateExecutiveReport('quarterly') : null;
        
        return `
            <div class="executive-report-panel">
                <div class="panel-header">
                    <h3><i class="fas fa-crown"></i> Relatório de Performance e Meritocracia Corporativa</h3>
                    <div class="report-actions">
                        <button id="exportExecutiveReport" class="elite-btn small secondary"><i class="fas fa-download"></i> EXPORTAR PDF</button>
                        <button id="refreshReport" class="elite-btn small primary"><i class="fas fa-sync-alt"></i> ATUALIZAR</button>
                    </div>
                </div>
                
                <div class="executive-summary">
                    <div class="summary-header">
                        <div class="period-badge">Período: ${report?.period || 'QUARTERLY'}</div>
                        <div class="total-bonus">Total de Bónus: €${report?.executiveSummary.totalBonusPool?.toLocaleString() || '0'}</div>
                    </div>
                    
                    <div class="rankings-grid">
                        <div class="ranking-card">
                            <h4><i class="fas fa-trophy"></i> Top Faturação</h4>
                            ${report?.rankings.topBilling.map((p, i) => `
                                <div class="ranking-item ${i === 0 ? 'first' : ''}">
                                    <span class="rank">${i + 1}º</span>
                                    <span class="name">${p.name}</span>
                                    <span class="value">€${p.revenue.toLocaleString()}</span>
                                    <span class="medal">🏅 ${p.medal}</span>
                                </div>
                            `).join('') || '<p>Nenhum dado disponível</p>'}
                        </div>
                        <div class="ranking-card">
                            <h4><i class="fas fa-gavel"></i> Resolução de Casos</h4>
                            ${report?.rankings.topResolution.map((p, i) => `
                                <div class="ranking-item ${i === 0 ? 'first' : ''}">
                                    <span class="rank">${i + 1}º</span>
                                    <span class="name">${p.name}</span>
                                    <span class="value">${p.casesClosed} casos</span>
                                    <span class="medal">🏅 ${p.medal}</span>
                                </div>
                            `).join('') || '<p>Nenhum dado disponível</p>'}
                        </div>
                        <div class="ranking-card">
                            <h4><i class="fas fa-chart-line"></i> Angariação</h4>
                            ${report?.rankings.topAcquisition.map((p, i) => `
                                <div class="ranking-item ${i === 0 ? 'first' : ''}">
                                    <span class="rank">${i + 1}º</span>
                                    <span class="name">${p.name}</span>
                                    <span class="value">€${p.pipelineValue.toLocaleString()}</span>
                                    <span class="medal">🏅 ${p.medal}</span>
                                </div>
                            `).join('') || '<p>Nenhum dado disponível</p>'}
                        </div>
                    </div>
                    
                    <div class="bonus-table">
                        <h4>Bónus Automatizados</h4>
                        <table class="data-table">
                            <thead>
                                <tr><th>Advogado</th><th>Categoria</th><th>Medalha</th><th>Métrica</th><th>Bónus Sugerido</th><th>Status</th> </thead>
                            <tbody>
                                ${report?.bonusAutomation.map(b => `
                                    <tr>
                                        <td><strong>${b.advogado}</strong> </div>
                                        <td>${b.categoria} </div>
                                        <td>🏅 ${b.medalha} </div>
                                        <td>${b.metric} </div>
                                        <td><strong>€${b.bonus_sugerido.toLocaleString()}</strong> </div>
                                        <td><span class="status-badge status-pending">${b.status}</span> </div>
                                     </div>
                                `).join('') || '<tr><td colspan="6" class="empty-state">Nenhum bónus calculado</td></tr>'}
                            </tbody>
                        </table>
                    </div>
                    
                    <div class="report-footer">
                        <div class="validation-hash">
                            <small>Hash de Validação: ${report?.auditTrail.masterHash?.substring(0, 32) || 'N/A'}...</small>
                        </div>
                        <div class="generated-at">
                            <small>Gerado em: ${new Date().toLocaleString('pt-PT')}</small>
                        </div>
                    </div>
                </div>
            </div>
        `;
    };
    
    /**
     * Renderiza tab de Decomposição Forense
     */
    originalDashboard.renderForensicDecompositionTab = function() {
        return `
            <div class="forensic-decomposition-panel">
                <div class="panel-header">
                    <h3><i class="fas fa-microscope"></i> Motor de Decomposição Forense</h3>
                    <div class="upload-area">
                        <input type="file" id="forensicFileUpload" accept=".pdf,.jpg,.png,.docx" style="display: none;">
                        <button id="uploadForensicFile" class="elite-btn small primary"><i class="fas fa-upload"></i> ANALISAR FICHEIRO</button>
                    </div>
                </div>
                
                <div id="forensicAnalysisResults" class="forensic-results">
                    <div class="info-card">
                        <i class="fas fa-shield-alt"></i>
                        <div>
                            <strong>Análise de Metadados em Tempo Real</strong>
                            <p>O Motor de Decomposição Forense analisa ficheiros em busca de:</p>
                            <ul>
                                <li>Software de edição (Adobe Photoshop, Acrobat Distiller, etc.)</li>
                                <li>Discrepâncias temporais entre criação e modificação</li>
                                <li>Camadas de sobreposição não aplanadas</li>
                                <li>Ausência de metadados GPS/Exif</li>
                                <li>Indícios de sanitização de metadados</li>
                            </ul>
                        </div>
                    </div>
                </div>
                
                <div class="recent-analyses">
                    <h4>Análises Recentes</h4>
                    <div id="recentAnalysesList" class="analyses-list">
                        <div class="empty-state">Nenhuma análise realizada. Faça upload de um ficheiro para iniciar.</div>
                    </div>
                </div>
            </div>
        `;
    };
    
    /**
     * Executa simulação de Monte Carlo e exibe resultados
     */
    originalDashboard.runMonteCarloSimulation = function() {
        const resultsContainer = document.getElementById('monteCarloResults');
        if (!resultsContainer) return;
        
        const sampleCase = { id: 'SAMPLE', value: 12500000, successProbability: 68 };
        
        if (window.BlackSwan && typeof window.BlackSwan.renderBlackSwanPanel === 'function') {
            window.BlackSwan.renderBlackSwanPanel('monteCarloResults', sampleCase);
        } else {
            resultsContainer.innerHTML = '<div class="error">Black Swan Predictor não disponível</div>';
        }
    };
    
    /**
     * Analisa ficheiro com Motor de Decomposição Forense
     */
    originalDashboard.analyzeForensicFile = async function(file) {
        const resultsContainer = document.getElementById('forensicAnalysisResults');
        if (!resultsContainer) return;
        
        if (window.ForensicVault && typeof window.ForensicVault.decomposeArtefact === 'function') {
            resultsContainer.innerHTML = '<div class="loading">Analisando ficheiro... <i class="fas fa-spinner fa-spin"></i></div>';
            
            try {
                const analysis = await window.ForensicVault.decomposeArtefact(file);
                
                const alertsHtml = analysis.alerts.map(a => `
                    <div class="alert-item ${a.severity.toLowerCase()}">
                        <span class="alert-badge">${a.severity}</span>
                        <div class="alert-content">
                            <strong>${a.title}</strong>
                            <p>${a.description}</p>
                            <small>${a.technical || ''}</small>
                        </div>
                    </div>
                `).join('');
                
                const recommendationsHtml = analysis.recommendations.map(r => `
                    <div class="recommendation-item priority-${r.priority.toLowerCase()}">
                        <i class="fas ${r.priority === 'IMMEDIATE' ? 'fa-skull' : 'fa-exclamation-triangle'}"></i>
                        <div>
                            <strong>${r.action}</strong>
                            <p>${r.description}</p>
                            <small>${r.legalStrategy || ''}</small>
                        </div>
                    </div>
                `).join('');
                
                resultsContainer.innerHTML = `
                    <div class="analysis-result">
                        <div class="analysis-header">
                            <h4>Análise de ${file.name}</h4>
                            <div class="integrity-score ${analysis.integrityScore >= 80 ? 'score-high' : analysis.integrityScore >= 50 ? 'score-medium' : 'score-low'}">
                                Score: ${analysis.integrityScore}%
                            </div>
                        </div>
                        
                        <div class="analysis-metadata">
                            <div class="metadata-row">
                                <span>Tamanho:</span>
                                <strong>${analysis.metadata.fileSizeFormatted}</strong>
                            </div>
                            <div class="metadata-row">
                                <span>Tipo:</span>
                                <strong>${analysis.metadata.mimeType}</strong>
                            </div>
                            <div class="metadata-row">
                                <span>Hash SHA-256:</span>
                                <code>${analysis.hash.substring(0, 32)}...</code>
                            </div>
                        </div>
                        
                        ${analysis.alerts.length > 0 ? `
                            <div class="alerts-section">
                                <h5>⚠️ Anomalias Detectadas (${analysis.alerts.length})</h5>
                                ${alertsHtml}
                            </div>
                        ` : `
                            <div class="success-message">
                                <i class="fas fa-check-circle"></i>
                                <strong>Nenhuma anomalia detectada</strong>
                                <p>O ficheiro apresenta integridade forense.</p>
                            </div>
                        `}
                        
                        ${analysis.recommendations.length > 0 ? `
                            <div class="recommendations-section">
                                <h5>📋 Recomendações Estratégicas</h5>
                                ${recommendationsHtml}
                            </div>
                        ` : ''}
                        
                        <div class="tactical-advantage">
                            <strong>Vantagem Tática:</strong> ${analysis.tacticalAdvantage}
                        </div>
                        
                        <div class="analysis-actions">
                            <button id="exportIntegrityReport" class="elite-btn small secondary" data-analysis='${JSON.stringify(analysis)}'>
                                <i class="fas fa-file-pdf"></i> EXPORTAR RELATÓRIO
                            </button>
                        </div>
                    </div>
                `;
                
                // Adicionar à lista de análises recentes
                this.addToRecentAnalyses(file.name, analysis);
                
                // Event listener para exportar relatório
                const exportBtn = document.getElementById('exportIntegrityReport');
                if (exportBtn) {
                    exportBtn.addEventListener('click', () => {
                        if (window.ForensicVault && typeof window.ForensicVault.exportIntegrityReport === 'function') {
                            // Simular evidência ID para exportação
                            const mockEvidenceId = `EVD_${Date.now()}`;
                            window.ForensicVault.exportIntegrityReport(mockEvidenceId);
                        } else {
                            alert('Funcionalidade de exportação em desenvolvimento');
                        }
                    });
                }
                
            } catch (error) {
                console.error('[ELITE] Erro na análise forense:', error);
                resultsContainer.innerHTML = `<div class="error">Erro ao analisar ficheiro: ${error.message}</div>`;
            }
        } else {
            resultsContainer.innerHTML = '<div class="error">Motor de Decomposição Forense não disponível</div>';
        }
    };
    
    /**
     * Adiciona análise à lista de análises recentes
     */
    originalDashboard.addToRecentAnalyses = function(fileName, analysis) {
        const container = document.getElementById('recentAnalysesList');
        if (!container) return;
        
        const existingEmpty = container.querySelector('.empty-state');
        if (existingEmpty) existingEmpty.remove();
        
        const analysisItem = document.createElement('div');
        analysisItem.className = `analysis-item ${analysis.valid ? 'valid' : 'invalid'}`;
        analysisItem.innerHTML = `
            <div class="analysis-item-header">
                <i class="fas ${analysis.valid ? 'fa-check-circle' : 'fa-exclamation-triangle'}"></i>
                <strong>${fileName}</strong>
                <span class="analysis-date">${new Date().toLocaleTimeString()}</span>
            </div>
            <div class="analysis-item-details">
                <span>Score: ${analysis.integrityScore}%</span>
                <span>Alertas: ${analysis.alerts.length}</span>
                <button class="action-btn view-analysis" data-analysis='${JSON.stringify(analysis)}' data-name="${fileName}">
                    <i class="fas fa-eye"></i> VER
                </button>
            </div>
        `;
        
        container.insertBefore(analysisItem, container.firstChild);
        
        // Manter apenas últimas 10 análises
        while (container.children.length > 10) {
            container.removeChild(container.lastChild);
        }
        
        // Event listener para ver análise
        const viewBtn = analysisItem.querySelector('.view-analysis');
        if (viewBtn) {
            viewBtn.addEventListener('click', () => {
                const analysisData = JSON.parse(viewBtn.dataset.analysis);
                const resultsContainer = document.getElementById('forensicAnalysisResults');
                if (resultsContainer) {
                    // Re-renderizar análise
                    const alertsHtml = analysisData.alerts.map(a => `
                        <div class="alert-item ${a.severity.toLowerCase()}">
                            <span class="alert-badge">${a.severity}</span>
                            <div class="alert-content">
                                <strong>${a.title}</strong>
                                <p>${a.description}</p>
                                <small>${a.technical || ''}</small>
                            </div>
                        </div>
                    `).join('');
                    
                    resultsContainer.innerHTML = `
                        <div class="analysis-result">
                            <div class="analysis-header">
                                <h4>Análise de ${viewBtn.dataset.name}</h4>
                                <div class="integrity-score ${analysisData.integrityScore >= 80 ? 'score-high' : analysisData.integrityScore >= 50 ? 'score-medium' : 'score-low'}">
                                    Score: ${analysisData.integrityScore}%
                                </div>
                            </div>
                            ${analysisData.alerts.length > 0 ? `
                                <div class="alerts-section">
                                    <h5>⚠️ Anomalias Detectadas (${analysisData.alerts.length})</h5>
                                    ${alertsHtml}
                                </div>
                            ` : '<div class="success-message"><i class="fas fa-check-circle"></i> Nenhuma anomalia detectada</div>'}
                        </div>
                    `;
                }
            });
        }
    };
    
    /**
     * Sobrescreve o método render original para incluir a nova rota
     */
    const originalRender = originalDashboard.render;
    originalDashboard.render = function() {
        const container = document.getElementById('viewContainer');
        if (!container) return;
        
        const currentView = window.EliteProbatum?.currentView || 'dashboard';
        
        if (currentView === 'truth-architecture') {
            this.renderTruthArchitecture();
            return;
        }
        
        // Chamar render original para outras views
        if (originalRender) {
            originalRender.call(this);
        }
    };
    
    /**
     * Configura event listeners para a nova view
     */
    originalDashboard.setupTruthArchitectureEvents = function() {
        // Upload de ficheiro forense
        const uploadBtn = document.getElementById('uploadForensicFile');
        const fileInput = document.getElementById('forensicFileUpload');
        
        if (uploadBtn && fileInput) {
            uploadBtn.addEventListener('click', () => fileInput.click());
            fileInput.addEventListener('change', (e) => {
                if (e.target.files && e.target.files[0]) {
                    this.analyzeForensicFile(e.target.files[0]);
                }
            });
        }
        
        // Botão de nova simulação Monte Carlo
        const runBtn = document.getElementById('runMonteCarlo');
        if (runBtn) {
            runBtn.addEventListener('click', () => this.runMonteCarloSimulation());
        }
        
        // Botão de exportar relatório executivo
        const exportBtn = document.getElementById('exportExecutiveReport');
        if (exportBtn && window.FeeOptimizer && typeof window.FeeOptimizer.exportExecutiveReport === 'function') {
            exportBtn.addEventListener('click', () => window.FeeOptimizer.exportExecutiveReport('quarterly'));
        }
        
        // Botão de refresh de relatório
        const refreshBtn = document.getElementById('refreshReport');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                const tabContent = document.getElementById('truth-tab-content');
                if (tabContent) {
                    tabContent.innerHTML = this.renderExecutiveReportTab();
                    this.setupTruthArchitectureEvents();
                }
            });
        }
        
        // Botão de novo vínculo CITIUS
        const newBindingBtn = document.getElementById('newCitiusBinding');
        if (newBindingBtn) {
            newBindingBtn.addEventListener('click', () => {
                if (window.EliteUtils) {
                    window.EliteUtils.showToast('Funcionalidade de vínculo CITIUS - Selecione um recibo PDF', 'info');
                }
            });
        }
        
        // View binding e export de certificados
        document.querySelectorAll('.view-binding').forEach(btn => {
            btn.addEventListener('click', () => {
                const bindingId = btn.dataset.id;
                if (window.ShadowDossier && typeof window.ShadowDossier.generateUnivocalCertificate === 'function') {
                    const cert = window.ShadowDossier.generateUnivocalCertificate(bindingId);
                    if (cert && window.EliteUtils) {
                        window.EliteUtils.showToast(`Certificado gerado: ${cert.certificateId}`, 'success');
                    }
                }
            });
        });
        
        document.querySelectorAll('.export-cert').forEach(btn => {
            btn.addEventListener('click', () => {
                const bindingId = btn.dataset.id;
                if (window.ShadowDossier && typeof window.ShadowDossier.exportUnivocalCertificate === 'function') {
                    window.ShadowDossier.exportUnivocalCertificate(bindingId);
                }
            });
        });
    };
    
    // Inicializar eventos quando a view for renderizada
    const originalRenderTruth = originalDashboard.renderTruthArchitecture;
    originalDashboard.renderTruthArchitecture = function() {
        if (originalRenderTruth) {
            originalRenderTruth.call(this);
        }
        setTimeout(() => this.setupTruthArchitectureEvents(), 100);
    };
    
    console.log('[ELITE] PracticeDashboard estendido com Arquitetura de Verdade v1.0');
    
})();