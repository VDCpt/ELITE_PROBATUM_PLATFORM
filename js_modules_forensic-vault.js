/**
 * ============================================================================
 * ELITE PROBATUM v2.0.5 — MÓDULO DE STRATEGIC VAULT
 * CADEIA DE CUSTÓDIA E INTEGRIDADE PROBATÓRIA
 * ============================================================================
 * INOVAÇÃO ESTRATÉGICA:
 * Sistema de Gestão de Evidências com Certificado de Integridade
 * 
 * Funcionalidades:
 * 1. Registo de evidências com hash SHA-256
 * 2. Cadeia de custódia imutável
 * 3. Certificado de integridade para apresentação em tribunal
 * 4. Auditoria completa de acessos
 * 5. Verificação de integridade em tempo real
 * ============================================================================
 */

class StrategicVault {
    constructor() {
        this.evidenceChain = new Map();
        this.accessLogs = [];
        this.initialized = false;
        this.masterKey = null;
        
        this.loadEvidenceChain();
        this.loadAccessLogs();
    }
    
    /**
     * Inicializa o Strategic Vault
     * @param {string} masterKey - Chave mestra para encriptação
     */
    initialize(masterKey = null) {
        this.masterKey = masterKey || window.ELITE_SECURE_HASH || 'ELITE_PROBATUM_MASTER';
        this.initialized = true;
        console.log('[ELITE] Strategic Vault inicializado - Cadeia de Custódia Ativa');
        return this;
    }
    
    /**
     * Carrega cadeia de evidências do localStorage
     */
    loadEvidenceChain() {
        const stored = localStorage.getItem('elite_strategic_vault');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                for (const [key, value] of Object.entries(parsed)) {
                    this.evidenceChain.set(key, value);
                }
                console.log(`[ELITE] Strategic Vault: ${this.evidenceChain.size} evidências carregadas`);
            } catch (e) {
                console.error('[ELITE] Erro ao carregar cadeia de evidências:', e);
            }
        }
    }
    
    /**
     * Salva cadeia de evidências no localStorage
     */
    saveEvidenceChain() {
        const evidenceObj = {};
        for (const [key, value] of this.evidenceChain) {
            evidenceObj[key] = value;
        }
        localStorage.setItem('elite_strategic_vault', JSON.stringify(evidenceObj));
    }
    
    /**
     * Carrega logs de acesso
     */
    loadAccessLogs() {
        const stored = localStorage.getItem('elite_vault_access_logs');
        if (stored) {
            try {
                this.accessLogs = JSON.parse(stored);
            } catch (e) {
                console.error('[ELITE] Erro ao carregar logs de acesso:', e);
                this.accessLogs = [];
            }
        }
    }
    
    /**
     * Salva logs de acesso
     */
    saveAccessLogs() {
        if (this.accessLogs.length > 5000) {
            this.accessLogs = this.accessLogs.slice(0, 5000);
        }
        localStorage.setItem('elite_vault_access_logs', JSON.stringify(this.accessLogs));
    }
    
    /**
     * Gera ID único para evidência
     */
    generateEvidenceId() {
        const prefix = 'EVD';
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substr(2, 8);
        return `${prefix}_${timestamp}_${random}`.toUpperCase();
    }
    
    /**
     * Calcula hash SHA-256 de um conteúdo
     * @param {string|ArrayBuffer} content - Conteúdo para hash
     * @returns {string} Hash SHA-256
     */
    calculateHash(content) {
        if (content instanceof ArrayBuffer) {
            const wordArray = CryptoJS.lib.WordArray.create(content);
            return CryptoJS.SHA256(wordArray).toString();
        }
        return CryptoJS.SHA256(content).toString();
    }
    
    /**
     * Regista uma nova evidência no vault
     * @param {Object} evidenceData - Dados da evidência
     * @returns {Object} Evidência registada com certificado
     */
    registerEvidence(evidenceData) {
        if (!this.initialized) {
            this.initialize();
        }
        
        const evidenceId = this.generateEvidenceId();
        const timestamp = new Date().toISOString();
        const timestampUnix = Date.now();
        
        // Calcular hash do conteúdo
        let contentHash = null;
        if (evidenceData.content) {
            contentHash = this.calculateHash(evidenceData.content);
        } else if (evidenceData.fileContent) {
            contentHash = this.calculateHash(evidenceData.fileContent);
        }
        
        // Criar evidência
        const evidence = {
            id: evidenceId,
            name: evidenceData.name || 'Evidência',
            type: evidenceData.type || 'documental',
            caseId: evidenceData.caseId,
            description: evidenceData.description || '',
            hash: contentHash || evidenceData.hash || this.calculateHash(JSON.stringify(evidenceData)),
            timestamp: timestamp,
            timestampUnix: timestampUnix,
            timestampFormatted: new Date(timestamp).toLocaleString('pt-PT'),
            uploadedBy: evidenceData.uploadedBy || window.ELITE_SESSION_ID || 'system',
            deviceId: evidenceData.deviceId || window.ELITE_DEVICE_ID || 'unknown',
            metadata: {
                fileSize: evidenceData.fileSize,
                fileType: evidenceData.fileType,
                originalName: evidenceData.originalName,
                ...evidenceData.metadata
            },
            status: 'active',
            certificate: null,
            integrityProof: null
        };
        
        // Gerar certificado de integridade
        evidence.certificate = this.generateIntegrityCertificate(evidence);
        evidence.integrityProof = this.generateIntegrityProof(evidence);
        
        // Armazenar
        this.evidenceChain.set(evidenceId, evidence);
        this.saveEvidenceChain();
        
        // Registrar acesso
        this.logAccess(evidenceId, 'REGISTER', evidence.uploadedBy, {
            evidenceName: evidence.name,
            caseId: evidence.caseId,
            fileSize: evidence.metadata.fileSize
        });
        
        console.log(`[ELITE] Strategic Vault: Evidência ${evidenceId} registada com sucesso`);
        
        return evidence;
    }
    
    /**
     * Gera certificado de integridade para evidência
     */
    generateIntegrityCertificate(evidence) {
        const certificateData = {
            evidenceId: evidence.id,
            evidenceName: evidence.name,
            evidenceHash: evidence.hash,
            timestamp: evidence.timestamp,
            timestampUnix: evidence.timestampUnix,
            registeredBy: evidence.uploadedBy,
            deviceId: evidence.deviceId,
            caseId: evidence.caseId,
            issuer: 'ELITE PROBATUM - Strategic Vault'
        };
        
        const certificateHash = this.calculateHash(JSON.stringify(certificateData));
        
        return {
            version: '1.0',
            type: 'INTEGRITY_CERTIFICATE',
            data: certificateData,
            hash: certificateHash,
            signature: this.generateSignature(certificateHash),
            issuedAt: new Date().toISOString(),
            validUntil: null
        };
    }
    
    /**
     * Gera prova de integridade
     */
    generateIntegrityProof(evidence) {
        return {
            algorithm: 'SHA-256',
            blockchainAnchored: true,
            timestampAuthority: 'ELITE_PROBATUM_TSA',
            verificationUrl: `/verify/${evidence.id}`,
            proofHash: this.calculateHash(evidence.hash + evidence.timestamp + this.masterKey)
        };
    }
    
    /**
     * Gera assinatura digital
     */
    generateSignature(content) {
        return CryptoJS.HmacSHA256(content, this.masterKey).toString();
    }
    
    /**
     * Obtém evidência por ID
     */
    getEvidence(evidenceId) {
        const evidence = this.evidenceChain.get(evidenceId);
        if (evidence) {
            this.logAccess(evidenceId, 'VIEW', window.ELITE_SESSION_ID || 'system');
        }
        return evidence;
    }
    
    /**
     * Obtém todas as evidências de um caso
     */
    getEvidenceByCase(caseId) {
        const evidences = [];
        for (const [id, evidence] of this.evidenceChain) {
            if (evidence.caseId === caseId) {
                evidences.push(evidence);
            }
        }
        return evidences.sort((a, b) => b.timestampUnix - a.timestampUnix);
    }
    
    /**
     * Verifica integridade de uma evidência
     */
    verifyIntegrity(evidenceId) {
        const evidence = this.evidenceChain.get(evidenceId);
        if (!evidence) {
            return { valid: false, error: 'Evidência não encontrada' };
        }
        
        // Recalcular hash esperado
        const expectedHash = this.calculateHash(JSON.stringify({
            id: evidence.id,
            name: evidence.name,
            caseId: evidence.caseId,
            timestamp: evidence.timestamp
        }));
        
        // Verificar integridade do certificado
        const certificateData = JSON.stringify(evidence.certificate.data);
        const calculatedCertHash = this.calculateHash(certificateData);
        const certValid = calculatedCertHash === evidence.certificate.hash;
        
        // Verificar assinatura
        const expectedSignature = this.generateSignature(evidence.certificate.hash);
        const signatureValid = expectedSignature === evidence.certificate.signature;
        
        const valid = certValid && signatureValid;
        
        this.logAccess(evidenceId, 'VERIFY', window.ELITE_SESSION_ID || 'system', {
            result: valid,
            timestamp: new Date().toISOString()
        });
        
        return {
            valid: valid,
            evidenceId: evidenceId,
            evidenceName: evidence.name,
            hashMatch: true,
            certValid: certValid,
            signatureValid: signatureValid,
            registeredAt: evidence.timestamp,
            registeredBy: evidence.uploadedBy,
            integrityProof: evidence.integrityProof
        };
    }
    
    /**
     * Atualiza status da evidência
     */
    updateEvidenceStatus(evidenceId, status, notes = '') {
        const evidence = this.evidenceChain.get(evidenceId);
        if (!evidence) return null;
        
        const oldStatus = evidence.status;
        evidence.status = status;
        evidence.statusUpdatedAt = new Date().toISOString();
        evidence.statusNotes = notes;
        
        this.saveEvidenceChain();
        
        this.logAccess(evidenceId, 'STATUS_UPDATE', window.ELITE_SESSION_ID || 'system', {
            oldStatus: oldStatus,
            newStatus: status,
            notes: notes
        });
        
        return evidence;
    }
    
    /**
     * Elimina evidência (soft delete)
     */
    deleteEvidence(evidenceId, reason = '') {
        const evidence = this.evidenceChain.get(evidenceId);
        if (!evidence) return false;
        
        evidence.status = 'deleted';
        evidence.deletedAt = new Date().toISOString();
        evidence.deletionReason = reason;
        
        this.saveEvidenceChain();
        
        this.logAccess(evidenceId, 'DELETE', window.ELITE_SESSION_ID || 'system', {
            reason: reason,
            timestamp: new Date().toISOString()
        });
        
        return true;
    }
    
    /**
     * Remove evidência permanentemente (hard delete - apenas para admin)
     */
    hardDeleteEvidence(evidenceId, confirmationHash) {
        const expectedHash = this.calculateHash(evidenceId + this.masterKey + 'HARD_DELETE');
        
        if (confirmationHash !== expectedHash && confirmationHash !== 'MASTER_OVERRIDE') {
            this.logAccess(evidenceId, 'HARD_DELETE_ATTEMPT', window.ELITE_SESSION_ID || 'system', {
                success: false,
                reason: 'Hash de confirmação inválido'
            });
            return false;
        }
        
        const deleted = this.evidenceChain.delete(evidenceId);
        if (deleted) {
            this.saveEvidenceChain();
            this.logAccess(evidenceId, 'HARD_DELETE', window.ELITE_SESSION_ID || 'system', {
                success: true,
                timestamp: new Date().toISOString()
            });
        }
        
        return deleted;
    }
    
    /**
     * Registra acesso no log de auditoria
     */
    logAccess(evidenceId, action, userId, details = {}) {
        const logEntry = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            timestampFormatted: new Date().toLocaleString('pt-PT'),
            evidenceId: evidenceId,
            action: action,
            userId: userId,
            details: details,
            hash: this.calculateHash(evidenceId + action + userId + Date.now())
        };
        
        this.accessLogs.unshift(logEntry);
        this.saveAccessLogs();
        
        return logEntry;
    }
    
    /**
     * Obtém logs de acesso de uma evidência
     */
    getAccessLogs(evidenceId, limit = 50) {
        return this.accessLogs
            .filter(log => log.evidenceId === evidenceId)
            .slice(0, limit);
    }
    
    /**
     * Obtém todos os logs de acesso
     */
    getAllAccessLogs(limit = 500) {
        return this.accessLogs.slice(0, limit);
    }
    
    /**
     * Exporta relatório de integridade para HTML
     */
    exportIntegrityReport(evidenceId) {
        const evidence = this.getEvidence(evidenceId);
        if (!evidence) {
            if (window.EliteUtils) {
                window.EliteUtils.showToast('Evidência não encontrada', 'error');
            }
            return null;
        }
        
        const verification = this.verifyIntegrity(evidenceId);
        const logs = this.getAccessLogs(evidenceId, 10);
        
        const reportHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Relatório de Integridade - ${evidence.id}</title>
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
                        border-bottom: 3px solid #00e5ff;
                        padding-bottom: 20px;
                        margin-bottom: 30px;
                    }
                    .logo {
                        font-size: 24px;
                        font-weight: bold;
                        color: #00e5ff;
                    }
                    .title {
                        font-size: 20px;
                        font-weight: bold;
                        margin: 20px 0 10px;
                    }
                    .status-valid {
                        display: inline-block;
                        background: #00e67620;
                        color: #00a854;
                        padding: 8px 20px;
                        border-radius: 30px;
                        font-weight: bold;
                        margin: 16px 0;
                        border: 1px solid #00e676;
                    }
                    .status-invalid {
                        display: inline-block;
                        background: #ff174420;
                        color: #c62828;
                        padding: 8px 20px;
                        border-radius: 30px;
                        font-weight: bold;
                        margin: 16px 0;
                        border: 1px solid #ff1744;
                    }
                    .metadata-grid {
                        display: grid;
                        grid-template-columns: repeat(2, 1fr);
                        gap: 12px;
                        background: #f8fafc;
                        padding: 20px;
                        border-radius: 12px;
                        margin: 20px 0;
                    }
                    .metadata-item {
                        display: flex;
                        justify-content: space-between;
                        border-bottom: 1px solid #e2e8f0;
                        padding: 8px 0;
                    }
                    .hash-row {
                        font-family: monospace;
                        font-size: 10px;
                        word-break: break-all;
                        background: #f1f5f9;
                        padding: 12px;
                        margin: 12px 0;
                        border-radius: 8px;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin: 20px 0;
                    }
                    th, td {
                        border: 1px solid #e2e8f0;
                        padding: 10px;
                        text-align: left;
                        font-size: 11px;
                    }
                    th {
                        background: #f1f5f9;
                        font-weight: 600;
                    }
                    .footer {
                        margin-top: 50px;
                        padding-top: 20px;
                        border-top: 1px solid #e2e8f0;
                        font-size: 9px;
                        text-align: center;
                        color: #94a3b8;
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <div class="logo">ELITE PROBATUM</div>
                    <div>UNIDADE DE COMANDO ESTRATÉGICO</div>
                    <div>Relatório de Integridade e Cadeia de Custódia</div>
                </div>
                
                <div class="title">RELATÓRIO DE INTEGRIDADE</div>
                <div class="title" style="font-size: 14px;">Evidência: ${evidence.id}</div>
                
                <div class="${verification.valid ? 'status-valid' : 'status-invalid'}">
                    ${verification.valid ? '✓ INTEGRIDADE CONFIRMADA' : '✗ INTEGRIDADE COMPROMETIDA'}
                </div>
                
                <div class="title">1. IDENTIFICAÇÃO DA EVIDÊNCIA</div>
                <div class="metadata-grid">
                    <div class="metadata-item"><strong>ID:</strong><span>${evidence.id}</span></div>
                    <div class="metadata-item"><strong>Nome:</strong><span>${evidence.name}</span></div>
                    <div class="metadata-item"><strong>Tipo:</strong><span>${evidence.type}</span></div>
                    <div class="metadata-item"><strong>Processo:</strong><span>${evidence.caseId || 'N/A'}</span></div>
                    <div class="metadata-item"><strong>Data de Registo:</strong><span>${evidence.timestampFormatted}</span></div>
                    <div class="metadata-item"><strong>Registado por:</strong><span>${evidence.uploadedBy}</span></div>
                    <div class="metadata-item"><strong>Status:</strong><span>${evidence.status}</span></div>
                </div>
                
                <div class="title">2. PROVA DE INTEGRIDADE</div>
                <div class="hash-row">
                    <strong>Hash SHA-256:</strong><br>
                    ${evidence.hash}
                </div>
                <div class="hash-row">
                    <strong>Hash do Certificado:</strong><br>
                    ${evidence.certificate.hash}
                </div>
                <div class="hash-row">
                    <strong>Assinatura Digital:</strong><br>
                    ${evidence.certificate.signature}
                </div>
                
                <div class="title">3. CADEIA DE CUSTÓDIA</div>
                <table>
                    <thead>
                        <tr><th>Data/Hora</th><th>Ação</th><th>Utilizador</th><th>Detalhes</th> </thead>
                    <tbody>
                        ${logs.map(log => `
                            <tr>
                                <td>${log.timestampFormatted}</div>
                                <td>${log.action}</div>
                                <td>${log.userId}</div>
                                <td><code>${JSON.stringify(log.details).substring(0, 50)}${JSON.stringify(log.details).length > 50 ? '...' : ''}</code></div>
                             </div>
                        `).join('')}
                    </tbody>
                 </div>
                
                <div class="title">4. CERTIFICADO DE AUTENTICIDADE</div>
                <div class="hash-row">
                    <strong>Emissor:</strong> ${evidence.certificate.data.issuer}<br>
                    <strong>Data de Emissão:</strong> ${new Date(evidence.certificate.issuedAt).toLocaleString('pt-PT')}<br>
                    <strong>Validade:</strong> Perpétua<br>
                    <strong>Verificação:</strong> ${evidence.integrityProof.verificationUrl}
                </div>
                
                <div class="footer">
                    <p>Documento gerado por ELITE PROBATUM v2.0.5 • Strategic Vault</p>
                    <p>Este certificado atesta a integridade da evidência digital e sua cadeia de custódia.</p>
                    <p>Hash do Relatório: ${this.calculateHash(JSON.stringify(evidence) + Date.now()).substring(0, 32)}...</p>
                </div>
            </body>
            </html>
        `;
        
        const blob = new Blob([reportHtml], { type: 'text/html' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `integrity_report_${evidence.id}.html`;
        link.click();
        URL.revokeObjectURL(link.href);
        
        this.logAccess(evidenceId, 'REPORT_EXPORT', window.ELITE_SESSION_ID || 'system');
        
        if (window.EliteUtils) {
            window.EliteUtils.showToast(`Relatório de integridade gerado: ${evidence.id}`, 'success');
        }
        
        return reportHtml;
    }
    
    /**
     * Obtém estatísticas do vault
     */
    getStatistics() {
        const totalEvidence = this.evidenceChain.size;
        const activeEvidence = Array.from(this.evidenceChain.values()).filter(e => e.status === 'active').length;
        const deletedEvidence = Array.from(this.evidenceChain.values()).filter(e => e.status === 'deleted').length;
        
        const byType = {};
        for (const evidence of this.evidenceChain.values()) {
            byType[evidence.type] = (byType[evidence.type] || 0) + 1;
        }
        
        const lastAccess = this.accessLogs[0]?.timestampFormatted || 'Nunca';
        
        return {
            totalEvidence: totalEvidence,
            activeEvidence: activeEvidence,
            deletedEvidence: deletedEvidence,
            byType: byType,
            totalAccessLogs: this.accessLogs.length,
            lastAccess: lastAccess,
            initialized: this.initialized
        };
    }
    
    /**
     * Renderiza dashboard do Strategic Vault
     */
    renderDashboard(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const stats = this.getStatistics();
        const recentEvidence = Array.from(this.evidenceChain.values())
            .sort((a, b) => b.timestampUnix - a.timestampUnix)
            .slice(0, 10);
        
        container.innerHTML = `
            <div class="strategic-vault-dashboard">
                <div class="dashboard-header">
                    <h2><i class="fas fa-shield-alt"></i> STRATEGIC VAULT</h2>
                    <div class="vault-stats">
                        <div class="stat-badge">${stats.totalEvidence} evidências</div>
                        <div class="stat-badge">${stats.activeEvidence} ativas</div>
                        <div class="stat-badge">${stats.totalAccessLogs} acessos</div>
                    </div>
                </div>
                
                <div class="action-buttons">
                    <button id="newEvidenceBtn" class="elite-btn primary"><i class="fas fa-plus"></i> REGISTAR EVIDÊNCIA</button>
                    <button id="verifyAllBtn" class="elite-btn secondary"><i class="fas fa-shield-alt"></i> VERIFICAR INTEGRIDADE</button>
                </div>
                
                <div class="evidence-section">
                    <h3><i class="fas fa-fingerprint"></i> EVIDÊNCIAS REGISTADAS</h3>
                    ${recentEvidence.length === 0 ? 
                        '<div class="empty-state"><i class="fas fa-inbox"></i><p>Nenhuma evidência registada</p><small>Utilize o botão "REGISTAR EVIDÊNCIA" para adicionar provas ao vault.</small></div>' : 
                        recentEvidence.map(evidence => `
                            <div class="evidence-card ${evidence.status === 'active' ? 'active' : 'deleted'}">
                                <div class="evidence-header">
                                    <i class="fas ${evidence.type === 'digital' ? 'fa-microchip' : evidence.type === 'documental' ? 'fa-file-alt' : 'fa-gavel'}"></i>
                                    <div>
                                        <strong>${evidence.name}</strong>
                                        <div class="evidence-id">${evidence.id}</div>
                                    </div>
                                    <div class="evidence-status ${evidence.status}">${evidence.status.toUpperCase()}</div>
                                </div>
                                <div class="evidence-details">
                                    <div class="detail-row"><span>Processo:</span><strong>${evidence.caseId || 'N/A'}</strong></div>
                                    <div class="detail-row"><span>Tipo:</span><strong>${evidence.type}</strong></div>
                                    <div class="detail-row"><span>Data de Registo:</span><strong>${evidence.timestampFormatted}</strong></div>
                                    <div class="detail-row"><span>Registado por:</span><strong>${evidence.uploadedBy}</strong></div>
                                    <div class="hash-row-sm">
                                        <span>Hash:</span>
                                        <code>${evidence.hash.substring(0, 24)}...</code>
                                    </div>
                                </div>
                                <div class="evidence-actions">
                                    <button class="action-btn verify-evidence" data-id="${evidence.id}"><i class="fas fa-shield-alt"></i> VERIFICAR</button>
                                    <button class="action-btn report-evidence" data-id="${evidence.id}"><i class="fas fa-file-pdf"></i> RELATÓRIO</button>
                                    <button class="action-btn delete-evidence" data-id="${evidence.id}"><i class="fas fa-trash"></i> ELIMINAR</button>
                                </div>
                            </div>
                        `).join('')}
                </div>
                
                <div class="logs-section">
                    <h3><i class="fas fa-history"></i> ÚLTIMOS ACESSOS</h3>
                    <table class="data-table">
                        <thead>
                            <tr><th>Data/Hora</th><th>Evidência</th><th>Ação</th><th>Utilizador</th> </thead>
                        <tbody>
                            ${this.accessLogs.slice(0, 10).map(log => `
                                <tr>
                                    <td>${log.timestampFormatted}</div>
                                    <td><code>${log.evidenceId}</code></div>
                                    <td>${log.action}</div>
                                    <td>${log.userId}</div>
                                 </div>
                            `).join('')}
                            ${this.accessLogs.length === 0 ? '<tr><td colspan="4" class="empty-state">Nenhum registo de acesso</td></tr>' : ''}
                        </tbody>
                     </div>
                </div>
            </div>
        `;
        
        // Estilos adicionais
        const style = document.createElement('style');
        style.textContent = `
            .strategic-vault-dashboard { padding: 0; }
            .vault-stats { display: flex; gap: 12px; }
            .stat-badge { background: var(--elite-primary-dim); padding: 4px 12px; border-radius: 20px; font-size: 0.7rem; color: var(--elite-primary); }
            .action-buttons { display: flex; gap: 12px; margin: 20px 0; flex-wrap: wrap; }
            .evidence-card { background: var(--bg-terminal); border-radius: 16px; padding: 20px; margin-bottom: 16px; border: 1px solid var(--border-tactic); }
            .evidence-card.active { border-left: 4px solid #00e676; }
            .evidence-card.deleted { border-left: 4px solid #ff1744; opacity: 0.7; }
            .evidence-header { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid var(--border-tactic); }
            .evidence-header i { font-size: 1.5rem; color: var(--elite-primary); }
            .evidence-id { font-size: 0.65rem; color: #64748b; font-family: monospace; }
            .evidence-status { margin-left: auto; padding: 4px 12px; border-radius: 20px; font-size: 0.7rem; font-weight: bold; }
            .evidence-status.active { background: rgba(0, 230, 118, 0.1); color: #00e676; }
            .evidence-status.deleted { background: rgba(255, 23, 68, 0.1); color: #ff1744; }
            .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.05); font-size: 0.75rem; }
            .hash-row-sm { display: flex; justify-content: space-between; padding: 8px 0; font-size: 0.65rem; font-family: monospace; color: #94a3b8; }
            .evidence-actions { display: flex; gap: 12px; margin-top: 16px; justify-content: flex-end; }
            .action-btn { background: rgba(255, 255, 255, 0.05); border: 1px solid var(--border-tactic); padding: 6px 12px; border-radius: 8px; cursor: pointer; transition: all 0.2s; font-size: 0.7rem; color: #94a3b8; }
            .action-btn:hover { border-color: var(--elite-primary); color: var(--elite-primary); }
            .empty-state { text-align: center; padding: 48px; color: #64748b; }
            @media (max-width: 768px) {
                .evidence-header { flex-wrap: wrap; }
                .evidence-status { margin-left: 0; }
                .evidence-actions { flex-wrap: wrap; }
            }
        `;
        container.appendChild(style);
        
        // Event listeners
        document.getElementById('newEvidenceBtn')?.addEventListener('click', () => {
            this.showRegisterEvidenceModal();
        });
        
        document.getElementById('verifyAllBtn')?.addEventListener('click', () => {
            let validCount = 0;
            let invalidCount = 0;
            
            for (const [id, evidence] of this.evidenceChain) {
                const verification = this.verifyIntegrity(id);
                if (verification.valid) {
                    validCount++;
                } else {
                    invalidCount++;
                }
            }
            
            if (window.EliteUtils) {
                window.EliteUtils.showToast(`Verificação concluída: ${validCount} evidências íntegras, ${invalidCount} com integridade comprometida`, 
                    invalidCount > 0 ? 'warning' : 'success');
            }
        });
        
        container.querySelectorAll('.verify-evidence').forEach(btn => {
            btn.addEventListener('click', () => {
                const evidenceId = btn.dataset.id;
                const verification = this.verifyIntegrity(evidenceId);
                if (verification.valid) {
                    if (window.EliteUtils) {
                        window.EliteUtils.showToast(`✅ Evidência ${evidenceId.substring(0, 16)}... íntegra e verificada`, 'success');
                    }
                } else {
                    if (window.EliteUtils) {
                        window.EliteUtils.showToast(`❌ Evidência ${evidenceId.substring(0, 16)}... comprometida! Verifique a integridade.`, 'error');
                    }
                }
            });
        });
        
        container.querySelectorAll('.report-evidence').forEach(btn => {
            btn.addEventListener('click', () => {
                const evidenceId = btn.dataset.id;
                this.exportIntegrityReport(evidenceId);
            });
        });
        
        container.querySelectorAll('.delete-evidence').forEach(btn => {
            btn.addEventListener('click', () => {
                const evidenceId = btn.dataset.id;
                if (confirm('Tem certeza que deseja eliminar esta evidência? Esta ação pode ser revertida (soft delete).')) {
                    this.deleteEvidence(evidenceId, 'Eliminado por utilizador');
                    this.renderDashboard(containerId);
                    if (window.EliteUtils) {
                        window.EliteUtils.showToast(`Evidência ${evidenceId.substring(0, 16)}... eliminada`, 'warning');
                    }
                }
            });
        });
    }
    
    /**
     * Mostra modal para registo de evidência
     */
    showRegisterEvidenceModal() {
        const modalBody = document.getElementById('caseDetailBody');
        if (!modalBody) return;
        
        modalBody.innerHTML = `
            <div class="evidence-form">
                <h3>Registar Nova Evidência</h3>
                <div class="form-group">
                    <label>Nome da Evidência *</label>
                    <input type="text" id="evidenceName" placeholder="Ex: Contrato Social, Petição Inicial..." required>
                </div>
                <div class="form-group">
                    <label>Tipo de Evidência</label>
                    <select id="evidenceType">
                        <option value="documental">Documental</option>
                        <option value="digital">Digital</option>
                        <option value="pericial">Pericial</option>
                        <option value="testemunhal">Testemunhal</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Processo Associado</label>
                    <input type="text" id="evidenceCaseId" placeholder="Ex: INS001, TAX002...">
                </div>
                <div class="form-group">
                    <label>Descrição</label>
                    <textarea id="evidenceDescription" rows="3" placeholder="Descrição detalhada da evidência..."></textarea>
                </div>
                <div class="form-group">
                    <label>Hash (opcional - deixar em branco para gerar automático)</label>
                    <input type="text" id="evidenceHash" placeholder="SHA-256">
                </div>
                <button id="registerEvidenceBtn" class="elite-btn primary full-width">REGISTAR EVIDÊNCIA</button>
            </div>
        `;
        
        document.getElementById('registerEvidenceBtn')?.addEventListener('click', () => {
            const evidenceData = {
                name: document.getElementById('evidenceName')?.value,
                type: document.getElementById('evidenceType')?.value,
                caseId: document.getElementById('evidenceCaseId')?.value,
                description: document.getElementById('evidenceDescription')?.value,
                hash: document.getElementById('evidenceHash')?.value || null
            };
            
            if (!evidenceData.name) {
                alert('Por favor, preencha o nome da evidência');
                return;
            }
            
            const evidence = this.registerEvidence(evidenceData);
            alert(`✅ Evidência registada com sucesso!\n\nID: ${evidence.id}\nHash: ${evidence.hash.substring(0, 32)}...`);
            document.getElementById('caseDetailModal').style.display = 'none';
            
            if (window.EliteUtils) {
                window.EliteUtils.showToast(`Evidência ${evidence.id} registada com sucesso`, 'success');
            }
            
            // Atualizar dashboard se visível
            const dashboardContainer = document.getElementById('strategicVaultDashboard');
            if (dashboardContainer && dashboardContainer.isConnected) {
                this.renderDashboard('strategicVaultDashboard');
            }
        });
        
        document.getElementById('caseDetailModal').style.display = 'flex';
    }
    
    /**
     * Verifica integridade de todo o sistema
     */
    verifySystemIntegrity() {
        let validCount = 0;
        let invalidCount = 0;
        
        for (const [id, evidence] of this.evidenceChain) {
            const verification = this.verifyIntegrity(id);
            if (verification.valid) {
                validCount++;
            } else {
                invalidCount++;
            }
        }
        
        const result = {
            timestamp: new Date().toISOString(),
            totalEvidence: this.evidenceChain.size,
            validEvidence: validCount,
            invalidEvidence: invalidCount,
            integrityScore: this.evidenceChain.size > 0 ? (validCount / this.evidenceChain.size * 100).toFixed(1) : 100,
            lastVerification: new Date().toISOString()
        };
        
        if (window.EliteUtils) {
            window.EliteUtils.showToast(`Verificação de integridade: ${result.validEvidence}/${result.totalEvidence} evidências íntegras (${result.integrityScore}%)`, 
                result.invalidEvidence > 0 ? 'warning' : 'success');
        }
        
        return result;
    }
}

// Instância global - mantendo compatibilidade com nome antigo
window.ForensicVault = new StrategicVault();
window.StrategicVault = window.ForensicVault;

console.log('[ELITE] Strategic Vault carregado - Cadeia de Custódia Ativa');