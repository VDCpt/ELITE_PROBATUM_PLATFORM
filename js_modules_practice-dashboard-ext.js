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
        
        // Obter estatísticas do Forensic Vault
        const vaultStats = window.ForensicVault ? window.ForensicVault.getStatistics() : null;
        
        container.innerHTML = `
            <div class="truth-architecture-dashboard">
                <div class="dashboard-header">
                    <h2><i class="fas fa-chess-queen"></i> ARQUITETURA DE VERDADE</h2>
                    <div class="header-badges">
                        <span class="badge badge-primary"><i class="fas fa-link"></i> Shadow Dossier ${shadowStats && shadowStats.totalBindings > 0 ? `(${shadowStats.totalBindings})` : 'Ativo'}</span>
                        <span class="badge badge-success"><i class="fas fa-chart-line"></i> Monte Carlo Online</span>
                        <span class="badge badge-info"><i class="fas fa-shield-alt"></i> Forensic Vault ${vaultStats ? `(${vaultStats.evidenceCount || 0})` : 'Ativo'}</span>
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
            .badge { display: inline-flex; align-items: center; gap: 6px; padding: 4px 12px; border-radius: 20px; font-size: 0.7rem; font-weight: 600; }
            .badge-primary { background: var(--elite-primary-dim); color: var(--elite-primary); border: 1px solid var(--elite-primary); }
            .badge-success { background: var(--elite-success-dim); color: var(--elite-success); border: 1px solid var(--elite-success); }
            .badge-info { background: var(--elite-info-dim); color: var(--elite-info); border: 1px solid var(--elite-info); }
            .truth-summary { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 24px; }
            .summary-card { background: var(--bg-command); border-radius: 16px; padding: 20px; display: flex; align-items: center; gap: 16px; border: 1px solid var(--border-tactic); transition: all 0.2s; }
            .summary-card:hover { border-color: var(--elite-primary); transform: translateY(-2px); }
            .summary-icon { width: 48px; height: 48px; background: var(--elite-primary-dim); border-radius: 12px; display: flex; align-items: center; justify-content: center; }
            .summary-icon i { font-size: 1.5rem; color: var(--elite-primary); }
            .summary-value { font-size: 1.8rem; font-weight: 800; font-family: 'JetBrains Mono'; color: var(--elite-primary); }
            .summary-label { font-size: 0.7rem; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; }
            .summary-trend { font-size: 0.65rem; color: #64748b; margin-top: 4px; }
            .truth-tabs { display: flex; gap: 8px; border-bottom: 1px solid var(--border-tactic); margin-bottom: 24px; padding-bottom: 0; }
            .tab-btn { background: transparent; border: none; padding: 12px 24px; color: #94a3b8; cursor: pointer; font-family: 'JetBrains Mono'; font-size: 0.8rem; transition: all 0.2s; border-bottom: 2px solid transparent; }
            .tab-btn:hover { color: var(--elite-primary); }
            .tab-btn.active { color: var(--elite-primary); border-bottom-color: var(--elite-primary); }
            .truth-tab-content { min-height: 500px; }
            .empty-state { text-align: center; padding: 48px; color: #64748b; background: var(--bg-terminal); border-radius: 16px; border: 1px dashed var(--border-tactic); }
            .empty-state i { font-size: 3rem; margin-bottom: 16px; color: #475569; }
            .loading-shimmer { background: linear-gradient(90deg, #1f2937 25%, #2d3748 50%, #1f2937 75%); background-size: 1000px 100%; animation: shimmer 2s infinite; border-radius: 12px; }
            @keyframes shimmer { 0% { background-position: -1000px 0; } 100% { background-position: 1000px 0; } }
            @media (max-width: 768px) {
                .truth-summary { grid-template-columns: 1fr; }
                .truth-tabs { flex-wrap: wrap; }
                .tab-btn { padding: 8px 16px; font-size: 0.7rem; }
                .dashboard-header { flex-direction: column; align-items: flex-start; }
                .header-badges { width: 100%; justify-content: space-between; }
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
                    this.setupTabEvents();
                }
            });
        });
        
        this.setupTabEvents();
    };
    
    /**
     * Configura eventos da tab ativa
     */
    originalDashboard.setupTabEvents = function() {
        // Botão de novo vínculo CITIUS
        const newBindingBtn = document.getElementById('newCitiusBinding');
        if (newBindingBtn && window.ShadowDossier) {
            newBindingBtn.addEventListener('click', () => {
                this.showCitiusBindingModal();
            });
        }
        
        // Botão de upload para decomposição forense
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
        
        // Botão de execução Monte Carlo
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
                if (tabContent && document.querySelector('.tab-btn.active')?.dataset.tab === 'executive-report') {
                    tabContent.innerHTML = this.renderExecutiveReportTab();
                    this.setupTabEvents();
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
        
        // Botão de nova simulação
        const newSimulationBtn = document.getElementById('newMonteCarloSimulation');
        if (newSimulationBtn) {
            newSimulationBtn.addEventListener('click', () => {
                this.runMonteCarloSimulation();
            });
        }
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
                    <div class="receipts-grid">
                        ${receipts.slice(0, 10).map(r => `
                            <div class="receipt-card ${r.hashMatch ? 'valid' : 'invalid'}">
                                <div class="receipt-header">
                                    <i class="fas ${r.hashMatch ? 'fa-check-circle' : 'fa-exclamation-triangle'}"></i>
                                    <div>
                                        <strong>${r.evidenceName || 'Evidência'}</strong>
                                        <div class="receipt-id">${r.receiptId?.substring(0, 24) || r.bindingId?.substring(0, 24)}...</div>
                                    </div>
                                    <div class="receipt-status ${r.hashMatch ? 'status-valid' : 'status-invalid'}">
                                        ${r.hashMatch ? 'VERIFICADO' : 'INCONSISTENTE'}
                                    </div>
                                </div>
                                <div class="receipt-details">
                                    <div class="detail-row"><span>Processo:</span><strong>${r.processId || 'N/A'}</strong></div>
                                    <div class="detail-row"><span>Tribunal:</span><strong>${r.court || 'N/A'}</strong></div>
                                    <div class="detail-row"><span>Data:</span><strong>${r.bindingTimestampFormatted || new Date(r.bindingTimestamp).toLocaleDateString('pt-PT')}</strong></div>
                                    <div class="detail-row"><span>Hash:</span><code>${(r.evidenceHash || r.certificateHash || '').substring(0, 24)}...</code></div>
                                </div>
                                <div class="receipt-actions">
                                    <button class="action-btn view-binding" data-id="${r.bindingId || r.receiptId}"><i class="fas fa-eye"></i> VERIFICAR</button>
                                    <button class="action-btn export-cert" data-id="${r.bindingId || r.receiptId}"><i class="fas fa-file-pdf"></i> CERTIFICADO</button>
                                </div>
                            </div>
                        `).join('')}
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
        const sampleCase = window.EliteProbatum?.mockCases?.[0] || { id: 'SAMPLE', value: 12500000, successProbability: 68 };
        
        return `
            <div class="black-swan-panel">
                <div class="panel-header">
                    <h3><i class="fas fa-chart-line"></i> Black Swan Predictor - Simulação de Monte Carlo</h3>
                    <button id="runMonteCarlo" class="elite-btn small primary"><i class="fas fa-play"></i> EXECUTAR SIMULAÇÃO</button>
                </div>
                <div id="monteCarloResults" class="monte-carlo-results">
                    <div class="loading-shimmer" style="height: 300px; border-radius: 12px;"></div>
                    <div class="loading-text">A carregar motor de simulação estocástica...</div>
                </div>
                <div class="black-swan-info">
                    <div class="info-card">
                        <i class="fas fa-info-circle"></i>
                        <div>
                            <strong>O que é o Black Swan Predictor?</strong>
                            <p>Motor de simulação estocástica que executa 10.000 iterações do desfecho processual, calculando o Value at Risk (VaR) Jurídico - o montante máximo que o cliente pode perder num cenário de "Cisne Negro" (ex: inversão de jurisprudência no STJ, substituição de magistrado, mudança legislativa).</p>
                            <p><strong>Métricas calculadas:</strong> VaR 95%, VaR 99%, Expected Shortfall, Probabilidade de Perda, Probabilidade de Cisne Negro.</p>
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
                        <div class="period-badge">Período: ${report?.period?.toUpperCase() || 'QUARTERLY'}</div>
                        <div class="total-bonus">Total de Bónus: €${report?.executiveSummary.totalBonusPool?.toLocaleString() || '0'}</div>
                    </div>
                    
                    <div class="rankings-grid">
                        <div class="ranking-card">
                            <h4><i class="fas fa-trophy"></i> Top Faturação</h4>
                            ${report?.rankings?.topBilling?.length ? report.rankings.topBilling.map((p, i) => `
                                <div class="ranking-item ${i === 0 ? 'first' : ''}">
                                    <span class="rank">${i + 1}º</span>
                                    <span class="name">${p.name}</span>
                                    <span class="value">€${p.revenue.toLocaleString()}</span>
                                    <span class="medal">🏅 ${p.medal}</span>
                                </div>
                            `).join('') : '<p class="empty-message">Nenhum dado disponível</p>'}
                        </div>
                        <div class="ranking-card">
                            <h4><i class="fas fa-gavel"></i> Resolução de Casos</h4>
                            ${report?.rankings?.topResolution?.length ? report.rankings.topResolution.map((p, i) => `
                                <div class="ranking-item ${i === 0 ? 'first' : ''}">
                                    <span class="rank">${i + 1}º</span>
                                    <span class="name">${p.name}</span>
                                    <span class="value">${p.casesClosed} casos</span>
                                    <span class="medal">🏅 ${p.medal}</span>
                                </div>
                            `).join('') : '<p class="empty-message">Nenhum dado disponível</p>'}
                        </div>
                        <div class="ranking-card">
                            <h4><i class="fas fa-chart-line"></i> Angariação</h4>
                            ${report?.rankings?.topAcquisition?.length ? report.rankings.topAcquisition.map((p, i) => `
                                <div class="ranking-item ${i === 0 ? 'first' : ''}">
                                    <span class="rank">${i + 1}º</span>
                                    <span class="name">${p.name}</span>
                                    <span class="value">€${p.pipelineValue.toLocaleString()}</span>
                                    <span class="medal">🏅 ${p.medal}</span>
                                </div>
                            `).join('') : '<p class="empty-message">Nenhum dado disponível</p>'}
                        </div>
                    </div>
                    
                    <div class="bonus-table">
                        <h4>Bónus Automatizados</h4>
                        <table class="data-table">
                            <thead>
                                <tr><th>Advogado</th><th>Categoria</th><th>Medalha</th><th>Métrica</th><th>Bónus Sugerido</th><th>Status</th> </thead>
                            <tbody>
                                ${report?.bonusAutomation?.length ? report.bonusAutomation.map(b => `
                                    <tr>
                                        <td><strong>${b.advogado}</strong> </div>
                                        <td>${b.categoria} </div>
                                        <td>🏅 ${b.medalha} </div>
                                        <td>${b.metric} </div>
                                        <td><strong>€${b.bonus_sugerido.toLocaleString()}</strong> </div>
                                        <td><span class="status-badge status-pending">${b.status}</span> </div>
                                     </div>
                                `).join('') : '<tr><td colspan="6" class="empty-state">Nenhum bónus calculado</td></tr>'}
                            </tbody>
                         </div>
                    </div>
                    
                    <div class="report-footer">
                        <div class="validation-hash">
                            <small>Hash de Validação: ${report?.auditTrail?.masterHash?.substring(0, 32) || 'N/A'}...</small>
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
        // Carregar análises recentes
        const recentAnalyses = JSON.parse(localStorage.getItem('elite_forensic_analyses') || '[]');
        
        return `
            <div class="forensic-decomposition-panel">
                <div class="panel-header">
                    <h3><i class="fas fa-microscope"></i> Motor de Decomposição Forense</h3>
                    <div class="upload-area">
                        <input type="file" id="forensicFileUpload" accept=".pdf,.jpg,.jpeg,.png,.docx,.doc" style="display: none;">
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
                                <li>Software de edição (Adobe Photoshop, Acrobat Distiller, SmallPDF, etc.)</li>
                                <li>Discrepâncias temporais entre criação e modificação (>24h)</li>
                                <li>Camadas de sobreposição não aplanadas (OCR Overlays)</li>
                                <li>Ausência de metadados GPS/Exif (possível screenshot)</li>
                                <li>Indícios de sanitização de metadados</li>
                                <li>Assinaturas digitais inválidas</li>
                                <li>Revisões excessivas em documentos</li>
                            </ul>
                        </div>
                    </div>
                </div>
                
                <div class="recent-analyses">
                    <h4>Análises Recentes</h4>
                    <div id="recentAnalysesList" class="analyses-list">
                        ${recentAnalyses.length === 0 ? 
                            '<div class="empty-state">Nenhuma análise realizada. Faça upload de um ficheiro para iniciar.</div>' : 
                            recentAnalyses.slice(0, 5).map(a => `
                                <div class="analysis-item ${a.valid ? 'valid' : 'invalid'}">
                                    <div class="analysis-item-header">
                                        <i class="fas ${a.valid ? 'fa-check-circle' : 'fa-exclamation-triangle'}"></i>
                                        <strong>${a.fileName}</strong>
                                        <span class="analysis-date">${new Date(a.timestamp).toLocaleTimeString()}</span>
                                    </div>
                                    <div class="analysis-item-details">
                                        <span>Score: ${a.integrityScore}%</span>
                                        <span>Alertas: ${a.alertsCount}</span>
                                        <button class="action-btn view-analysis" data-analysis='${JSON.stringify(a)}' data-name="${a.fileName}">
                                            <i class="fas fa-eye"></i> VER
                                        </button>
                                    </div>
                                </div>
                            `).join('')
                        }
                    </div>
                </div>
            </div>
        `;
    };
    
    /**
     * Mostra modal para vincular recibo CITIUS
     */
    originalDashboard.showCitiusBindingModal = function() {
        const modalBody = document.getElementById('caseDetailBody');
        if (!modalBody) return;
        
        modalBody.innerHTML = `
            <div class="binding-form">
                <h3>Vincular Recibo CITIUS</h3>
                <div class="form-group">
                    <label>ID da Evidência no Forensic Vault *</label>
                    <input type="text" id="bindingEvidenceId" placeholder="Ex: EVD_xxx" required>
                </div>
                <div class="form-group">
                    <label>ID do Recibo CITIUS *</label>
                    <input type="text" id="bindingReceiptId" placeholder="Ex: CITIUS_xxx" required>
                </div>
                <div class="form-group">
                    <label>Número do Processo *</label>
                    <input type="text" id="bindingProcessId" placeholder="Ex: 1234/23.8T8LSB" required>
                </div>
                <div class="form-group">
                    <label>Tribunal</label>
                    <input type="text" id="bindingCourt" placeholder="Ex: Tribunal Judicial de Lisboa" value="Tribunal Judicial de Lisboa">
                </div>
                <div class="form-group">
                    <label>Data de Submissão</label>
                    <input type="text" id="bindingDate" placeholder="DD/MM/YYYY" value="${new Date().toLocaleDateString('pt-PT')}">
                </div>
                <button id="createBindingBtn" class="elite-btn primary full-width">CRIAR VÍNCULO</button>
            </div>
        `;
        
        document.getElementById('createBindingBtn')?.addEventListener('click', async () => {
            const evidenceId = document.getElementById('bindingEvidenceId')?.value;
            const receiptId = document.getElementById('bindingReceiptId')?.value;
            const processId = document.getElementById('bindingProcessId')?.value;
            const court = document.getElementById('bindingCourt')?.value || 'Tribunal Judicial de Lisboa';
            const dateStr = document.getElementById('bindingDate')?.value;
            
            if (!evidenceId || !receiptId || !processId) {
                alert('Preencha todos os campos obrigatórios');
                return;
            }
            
            const submissionDate = dateStr ? new Date(dateStr.split('/').reverse().join('-')) : new Date();
            
            const mockReceipt = {
                receiptId: receiptId,
                documentHash: CryptoJS.SHA256(evidenceId + receiptId + Date.now()).toString(),
                processId: processId,
                court: court,
                submissionTimestamp: submissionDate.toISOString(),
                officialTimestampFormatted: submissionDate.toLocaleString('pt-PT')
            };
            
            try {
                if (window.ShadowDossier && typeof window.ShadowDossier.bindCitiusReceipt === 'function') {
                    const binding = await window.ShadowDossier.bindCitiusReceipt(evidenceId, mockReceipt, processId);
                    alert(`✅ Vínculo criado com sucesso!\n\nID: ${binding.bindingId}\nStatus: ${binding.status}`);
                    document.getElementById('caseDetailModal').style.display = 'none';
                    
                    // Atualizar a tab atual
                    const activeTab = document.querySelector('.tab-btn.active')?.dataset.tab;
                    if (activeTab === 'shadow-dossier') {
                        const tabContent = document.getElementById('truth-tab-content');
                        if (tabContent) {
                            tabContent.innerHTML = this.renderShadowDossierTab();
                            this.setupTabEvents();
                        }
                    }
                    
                    if (window.EliteUtils) {
                        window.EliteUtils.showToast(`Vínculo ${binding.bindingId.substring(0, 16)}... criado com sucesso`, 'success');
                    }
                }
            } catch (error) {
                console.error('Erro na vinculação:', error);
                alert(`Erro na vinculação: ${error.message}`);
            }
        });
        
        document.getElementById('caseDetailModal').style.display = 'flex';
    };
    
    /**
     * Executa simulação de Monte Carlo e exibe resultados
     */
    originalDashboard.runMonteCarloSimulation = function() {
        const resultsContainer = document.getElementById('monteCarloResults');
        if (!resultsContainer) return;
        
        const sampleCase = window.EliteProbatum?.mockCases?.[0] || { id: 'SAMPLE', value: 12500000, successProbability: 68 };
        
        if (window.BlackSwan && typeof window.BlackSwan.renderBlackSwanPanel === 'function') {
            // Criar um container temporário para renderizar o painel
            const tempContainer = document.createElement('div');
            tempContainer.id = 'tempMonteCarloContainer';
            resultsContainer.innerHTML = '';
            resultsContainer.appendChild(tempContainer);
            window.BlackSwan.renderBlackSwanPanel('tempMonteCarloContainer', sampleCase);
            tempContainer.id = 'monteCarloResults';
            tempContainer.style.width = '100%';
        } else {
            resultsContainer.innerHTML = `
                <div class="error-state">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Black Swan Predictor não disponível</p>
                    <small>Verifique se o módulo js_modules_black-swan.js foi carregado corretamente.</small>
                </div>
            `;
        }
    };
    
    /**
     * Analisa ficheiro com Motor de Decomposição Forense
     */
    originalDashboard.analyzeForensicFile = async function(file) {
        const resultsContainer = document.getElementById('forensicAnalysisResults');
        if (!resultsContainer) return;
        
        if (window.ForensicVault && typeof window.ForensicVault.decomposeArtefact === 'function') {
            resultsContainer.innerHTML = `
                <div class="loading-analysis">
                    <i class="fas fa-spinner fa-spin"></i>
                    <span>Analisando ficheiro "${file.name}"...</span>
                </div>
            `;
            
            try {
                const analysis = await window.ForensicVault.decomposeArtefact(file);
                
                const alertsHtml = analysis.alerts.map(a => `
                    <div class="alert-item ${a.severity.toLowerCase()}">
                        <span class="alert-badge">${a.severity}</span>
                        <div class="alert-content">
                            <strong>${a.title}</strong>
                            <p>${a.description}</p>
                            <small>${a.technical || ''}</small>
                            <div class="alert-recommendation">📋 ${a.recommendation || 'Solicitar esclarecimentos'}</div>
                        </div>
                    </div>
                `).join('');
                
                const recommendationsHtml = analysis.recommendations.map(r => `
                    <div class="recommendation-item priority-${r.priority.toLowerCase()}">
                        <i class="fas ${r.priority === 'IMMEDIATE' ? 'fa-skull' : r.priority === 'HIGH' ? 'fa-exclamation-triangle' : 'fa-info-circle'}"></i>
                        <div>
                            <strong>${r.action}</strong>
                            <p>${r.description}</p>
                            <small>${r.legalStrategy || ''}</small>
                        </div>
                    </div>
                `).join('');
                
                const metadataHtml = `
                    <div class="metadata-section">
                        <h5>Metadados Extraídos</h5>
                        <div class="metadata-grid">
                            <div class="metadata-row"><span>Tamanho:</span><strong>${analysis.metadata.fileSizeFormatted}</strong></div>
                            <div class="metadata-row"><span>Tipo:</span><strong>${analysis.metadata.mimeType}</strong></div>
                            <div class="metadata-row"><span>Última Modificação:</span><strong>${new Date(analysis.metadata.lastModified).toLocaleString('pt-PT')}</strong></div>
                            <div class="metadata-row"><span>Análise:</span><strong>${new Date(analysis.metadata.analysisTimestamp).toLocaleString('pt-PT')}</strong></div>
                        </div>
                        <div class="hash-row">
                            <span>Hash SHA-256:</span>
                            <code>${analysis.hash}</code>
                        </div>
                    </div>
                `;
                
                resultsContainer.innerHTML = `
                    <div class="analysis-result">
                        <div class="analysis-header">
                            <h4>Análise Forense: ${file.name}</h4>
                            <div class="integrity-score ${analysis.integrityScore >= 80 ? 'score-high' : analysis.integrityScore >= 50 ? 'score-medium' : 'score-low'}">
                                <span class="score-value">${analysis.integrityScore}%</span>
                                <span class="score-label">Integridade</span>
                            </div>
                        </div>
                        
                        ${metadataHtml}
                        
                        ${analysis.alerts.length > 0 ? `
                            <div class="alerts-section">
                                <h5><i class="fas fa-exclamation-triangle"></i> Anomalias Detectadas (${analysis.alerts.length})</h5>
                                ${alertsHtml}
                            </div>
                        ` : `
                            <div class="success-message">
                                <i class="fas fa-check-circle"></i>
                                <div>
                                    <strong>Nenhuma anomalia detectada</strong>
                                    <p>O ficheiro apresenta integridade forense. Pode ser utilizado como prova.</p>
                                </div>
                            </div>
                        `}
                        
                        ${analysis.recommendations.length > 0 ? `
                            <div class="recommendations-section">
                                <h5><i class="fas fa-gavel"></i> Recomendações Estratégicas</h5>
                                ${recommendationsHtml}
                            </div>
                        ` : ''}
                        
                        <div class="tactical-advantage">
                            <i class="fas fa-chess-queen"></i>
                            <div>
                                <strong>Vantagem Tática:</strong>
                                <p>${analysis.tacticalAdvantage}</p>
                            </div>
                        </div>
                        
                        <div class="analysis-actions">
                            <button id="exportIntegrityReport" class="elite-btn small secondary" data-analysis='${JSON.stringify(analysis)}'>
                                <i class="fas fa-file-pdf"></i> EXPORTAR RELATÓRIO DE INTEGRIDADE
                            </button>
                        </div>
                    </div>
                `;
                
                // Salvar análise no histórico
                this.saveForensicAnalysis({
                    fileName: file.name,
                    fileSize: analysis.metadata.fileSize,
                    mimeType: analysis.metadata.mimeType,
                    integrityScore: analysis.integrityScore,
                    alertsCount: analysis.alerts.length,
                    valid: analysis.valid,
                    timestamp: new Date().toISOString(),
                    analysisId: analysis.analysisId,
                    hash: analysis.hash
                });
                
                // Atualizar lista de análises recentes
                this.updateRecentAnalysesList();
                
                // Event listener para exportar relatório
                const exportBtn = document.getElementById('exportIntegrityReport');
                if (exportBtn && window.ForensicVault && typeof window.ForensicVault.exportIntegrityReport === 'function') {
                    exportBtn.addEventListener('click', () => {
                        window.ForensicVault.exportIntegrityReport(analysis.analysisId);
                    });
                }
                
            } catch (error) {
                console.error('[ELITE] Erro na análise forense:', error);
                resultsContainer.innerHTML = `
                    <div class="error-state">
                        <i class="fas fa-exclamation-circle"></i>
                        <p>Erro ao analisar ficheiro</p>
                        <small>${error.message}</small>
                    </div>
                `;
            }
        } else {
            resultsContainer.innerHTML = `
                <div class="error-state">
                    <i class="fas fa-microscope-slash"></i>
                    <p>Motor de Decomposição Forense não disponível</p>
                    <small>Verifique se o módulo js_modules_forensic-vault-ext.js foi carregado corretamente.</small>
                </div>
            `;
        }
    };
    
    /**
     * Salva análise forense no histórico
     */
    originalDashboard.saveForensicAnalysis = function(analysis) {
        const analyses = JSON.parse(localStorage.getItem('elite_forensic_analyses') || '[]');
        analyses.unshift(analysis);
        while (analyses.length > 20) analyses.pop();
        localStorage.setItem('elite_forensic_analyses', JSON.stringify(analyses));
    };
    
    /**
     * Atualiza lista de análises recentes
     */
    originalDashboard.updateRecentAnalysesList = function() {
        const container = document.getElementById('recentAnalysesList');
        if (!container) return;
        
        const analyses = JSON.parse(localStorage.getItem('elite_forensic_analyses') || '[]');
        
        if (analyses.length === 0) {
            container.innerHTML = '<div class="empty-state">Nenhuma análise realizada. Faça upload de um ficheiro para iniciar.</div>';
            return;
        }
        
        container.innerHTML = analyses.slice(0, 5).map(a => `
            <div class="analysis-item ${a.valid ? 'valid' : 'invalid'}">
                <div class="analysis-item-header">
                    <i class="fas ${a.valid ? 'fa-check-circle' : 'fa-exclamation-triangle'}"></i>
                    <strong>${a.fileName}</strong>
                    <span class="analysis-date">${new Date(a.timestamp).toLocaleTimeString()}</span>
                </div>
                <div class="analysis-item-details">
                    <span>Score: ${a.integrityScore}%</span>
                    <span>Alertas: ${a.alertsCount}</span>
                    <button class="action-btn view-analysis" data-analysis='${JSON.stringify(a)}' data-name="${a.fileName}">
                        <i class="fas fa-eye"></i> VER
                    </button>
                </div>
            </div>
        `).join('');
        
        // Re-anexar eventos
        container.querySelectorAll('.view-analysis').forEach(btn => {
            btn.addEventListener('click', () => {
                const analysisData = JSON.parse(btn.dataset.analysis);
                const resultsContainer = document.getElementById('forensicAnalysisResults');
                if (resultsContainer) {
                    resultsContainer.innerHTML = `
                        <div class="analysis-result">
                            <div class="analysis-header">
                                <h4>Análise Forense: ${analysisData.fileName}</h4>
                                <div class="integrity-score ${analysisData.integrityScore >= 80 ? 'score-high' : analysisData.integrityScore >= 50 ? 'score-medium' : 'score-low'}">
                                    <span class="score-value">${analysisData.integrityScore}%</span>
                                    <span class="score-label">Integridade</span>
                                </div>
                            </div>
                            <div class="metadata-section">
                                <div class="metadata-row"><span>Tamanho:</span><strong>${analysisData.fileSize ? (analysisData.fileSize / 1024).toFixed(2) + ' KB' : 'N/A'}</strong></div>
                                <div class="metadata-row"><span>Tipo:</span><strong>${analysisData.mimeType || 'N/A'}</strong></div>
                                <div class="metadata-row"><span>Data da Análise:</span><strong>${new Date(analysisData.timestamp).toLocaleString('pt-PT')}</strong></div>
                            </div>
                            <div class="hash-row">
                                <span>Hash SHA-256:</span>
                                <code>${analysisData.hash || 'N/A'}</code>
                            </div>
                            <div class="tactical-advantage">
                                <i class="fas fa-chess-queen"></i>
                                <div>
                                    <strong>Status:</strong>
                                    <p>${analysisData.valid ? '✅ Evidência válida. Pode ser utilizada como prova.' : '⚠️ Evidência comprometida. Recomenda-se impugnação.'}</p>
                                </div>
                            </div>
                        </div>
                    `;
                }
            });
        });
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
    
    console.log('[ELITE] PracticeDashboard estendido com Arquitetura de Verdade v1.0');
    
})();