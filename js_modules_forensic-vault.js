/**
 * ============================================================================
 * ELITE PROBATUM — MÓDULO DE FORENSIC VAULT
 * ============================================================================
 * Cadeia de custódia imutável com blockchain simulada,
 * verificação de integridade por hash SHA-256, timestamping
 * e auditoria completa de acessos.
 * ============================================================================
 */

class ForensicVault {
    constructor() {
        this.blockchain = [];
        this.pendingTransactions = [];
        this.evidenceChain = new Map();
        this.accessLogs = [];
        this.difficulty = 4; // Número de zeros iniciais para proof-of-work
        this.initialized = false;
        
        // Genesis Block
        this.createGenesisBlock();
    }
    
    /**
     * Inicializa o Forensic Vault
     */
    initialize() {
        this.loadBlockchain();
        this.loadEvidenceChain();
        this.loadAccessLogs();
        this.initialized = true;
        console.log('[ELITE] Forensic Vault inicializado - Blockchain com', this.blockchain.length, 'blocos');
        return this;
    }
    
    /**
     * Cria o bloco genesis (primeiro bloco da cadeia)
     */
    createGenesisBlock() {
        const genesisBlock = {
            index: 0,
            timestamp: new Date().toISOString(),
            transactions: [{
                id: 'GENESIS',
                type: 'system',
                data: 'ELITE PROBATUM FORENSIC VAULT INITIALIZED',
                hash: this.calculateHash('GENESIS_DATA')
            }],
            previousHash: '0',
            hash: '',
            nonce: 0,
            proof: ''
        };
        
        genesisBlock.hash = this.calculateBlockHash(genesisBlock);
        genesisBlock.proof = this.mineBlock(genesisBlock);
        
        this.blockchain = [genesisBlock];
        this.saveBlockchain();
    }
    
    /**
     * Calcula hash de um conteúdo
     * @param {string} content - Conteúdo a hashear
     * @returns {string} Hash SHA-256
     */
    calculateHash(content) {
        return CryptoJS.SHA256(content + Date.now().toString()).toString();
    }
    
    /**
     * Calcula hash do bloco completo
     */
    calculateBlockHash(block) {
        const blockString = block.index + block.timestamp + JSON.stringify(block.transactions) + block.previousHash + block.nonce;
        return CryptoJS.SHA256(blockString).toString();
    }
    
    /**
     * Proof-of-work simples
     */
    mineBlock(block) {
        let nonce = 0;
        let hash = '';
        const target = '0'.repeat(this.difficulty);
        
        while (!hash.startsWith(target)) {
            nonce++;
            block.nonce = nonce;
            hash = this.calculateBlockHash(block);
        }
        
        return hash;
    }
    
    /**
     * Adiciona novo bloco à cadeia
     */
    addBlock(transactions) {
        const previousBlock = this.blockchain[this.blockchain.length - 1];
        const newBlock = {
            index: this.blockchain.length,
            timestamp: new Date().toISOString(),
            transactions: Array.isArray(transactions) ? transactions : [transactions],
            previousHash: previousBlock.hash,
            hash: '',
            nonce: 0,
            proof: ''
        };
        
        newBlock.hash = this.calculateBlockHash(newBlock);
        newBlock.proof = this.mineBlock(newBlock);
        
        this.blockchain.push(newBlock);
        this.saveBlockchain();
        
        return newBlock;
    }
    
    /**
     * Verifica integridade da blockchain
     */
    verifyBlockchain() {
        for (let i = 1; i < this.blockchain.length; i++) {
            const currentBlock = this.blockchain[i];
            const previousBlock = this.blockchain[i - 1];
            
            // Verificar hash anterior
            if (currentBlock.previousHash !== previousBlock.hash) {
                return { valid: false, error: `Bloco ${i}: Hash anterior inválido` };
            }
            
            // Verificar hash atual
            const calculatedHash = this.calculateBlockHash(currentBlock);
            if (currentBlock.hash !== calculatedHash) {
                return { valid: false, error: `Bloco ${i}: Hash inválido` };
            }
            
            // Verificar proof-of-work
            const target = '0'.repeat(this.difficulty);
            if (!currentBlock.hash.startsWith(target)) {
                return { valid: false, error: `Bloco ${i}: Proof-of-work inválido` };
            }
        }
        
        return { valid: true, blocks: this.blockchain.length };
    }
    
    /**
     * Registra uma nova evidência na cadeia de custódia
     * @param {Object} evidence - Dados da evidência
     * @returns {Object} Evidência registrada com hash
     */
    registerEvidence(evidence) {
        const evidenceId = this.generateEvidenceId();
        const timestamp = new Date().toISOString();
        
        // Calcular hash da evidência
        const evidenceContent = JSON.stringify({
            id: evidenceId,
            name: evidence.name,
            type: evidence.type,
            caseId: evidence.caseId,
            metadata: evidence.metadata || {},
            timestamp: timestamp
        });
        
        const evidenceHash = CryptoJS.SHA256(evidenceContent).toString();
        
        const evidenceRecord = {
            id: evidenceId,
            name: evidence.name,
            type: evidence.type,
            caseId: evidence.caseId,
            fileSize: evidence.fileSize || 0,
            fileType: evidence.fileType || 'unknown',
            hash: evidenceHash,
            timestamp: timestamp,
            metadata: {
                ...evidence.metadata,
                uploadedBy: evidence.uploadedBy || window.ELITE_SESSION_ID || 'system',
                ipAddress: evidence.ipAddress || '127.0.0.1',
                userAgent: evidence.userAgent || navigator.userAgent
            },
            status: 'registered',
            chain: []
        };
        
        // Adicionar à cadeia de evidências
        this.evidenceChain.set(evidenceId, evidenceRecord);
        
        // Adicionar transação à blockchain
        const transaction = {
            id: evidenceId,
            type: 'evidence_registration',
            data: {
                evidenceId: evidenceId,
                name: evidence.name,
                type: evidence.type,
                caseId: evidence.caseId,
                hash: evidenceHash,
                timestamp: timestamp
            },
            hash: evidenceHash
        };
        
        this.addBlock(transaction);
        
        // Registrar acesso
        this.logAccess(evidenceId, 'REGISTER', evidence.uploadedBy || 'system');
        
        // Salvar
        this.saveEvidenceChain();
        
        return evidenceRecord;
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
        return evidences.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }
    
    /**
     * Verifica integridade de uma evidência
     * @param {string} evidenceId - ID da evidência
     * @returns {Object} Resultado da verificação
     */
    verifyEvidence(evidenceId) {
        const evidence = this.evidenceChain.get(evidenceId);
        if (!evidence) {
            return { valid: false, error: 'Evidência não encontrada' };
        }
        
        // Recalcular hash
        const evidenceContent = JSON.stringify({
            id: evidence.id,
            name: evidence.name,
            type: evidence.type,
            caseId: evidence.caseId,
            metadata: evidence.metadata,
            timestamp: evidence.timestamp
        });
        
        const calculatedHash = CryptoJS.SHA256(evidenceContent).toString();
        const isValid = calculatedHash === evidence.hash;
        
        this.logAccess(evidenceId, 'VERIFY', window.ELITE_SESSION_ID || 'system', isValid);
        
        return {
            valid: isValid,
            evidenceId: evidenceId,
            originalHash: evidence.hash,
            calculatedHash: calculatedHash,
            timestamp: evidence.timestamp,
            lastModified: evidence.lastModified || evidence.timestamp,
            chainOfCustody: evidence.chain.length
        };
    }
    
    /**
     * Transfere custódia de uma evidência
     */
    transferCustody(evidenceId, from, to, reason) {
        const evidence = this.evidenceChain.get(evidenceId);
        if (!evidence) {
            return { success: false, error: 'Evidência não encontrada' };
        }
        
        const transferRecord = {
            from: from,
            to: to,
            reason: reason,
            timestamp: new Date().toISOString(),
            hash: this.calculateHash(evidenceId + from + to + reason)
        };
        
        evidence.chain.push(transferRecord);
        evidence.lastModified = transferRecord.timestamp;
        
        // Recalcular hash após transferência
        const evidenceContent = JSON.stringify({
            id: evidence.id,
            name: evidence.name,
            type: evidence.type,
            caseId: evidence.caseId,
            metadata: evidence.metadata,
            timestamp: evidence.timestamp,
            chain: evidence.chain
        });
        
        evidence.hash = CryptoJS.SHA256(evidenceContent).toString();
        
        // Adicionar transação à blockchain
        const transaction = {
            id: evidenceId,
            type: 'custody_transfer',
            data: {
                evidenceId: evidenceId,
                from: from,
                to: to,
                reason: reason,
                timestamp: transferRecord.timestamp
            },
            hash: transferRecord.hash
        };
        
        this.addBlock(transaction);
        
        // Registrar acesso
        this.logAccess(evidenceId, 'TRANSFER', to, { from: from, reason: reason });
        
        this.saveEvidenceChain();
        
        return {
            success: true,
            evidenceId: evidenceId,
            transfer: transferRecord,
            newHash: evidence.hash
        };
    }
    
    /**
     * Registra acesso a evidência
     */
    logAccess(evidenceId, action, userId, metadata = {}) {
        const logEntry = {
            id: Date.now(),
            evidenceId: evidenceId,
            action: action,
            userId: userId || 'anonymous',
            timestamp: new Date().toISOString(),
            ipAddress: metadata.ipAddress || '127.0.0.1',
            sessionId: window.ELITE_SESSION_ID || 'unknown',
            metadata: metadata,
            hash: this.calculateHash(evidenceId + action + userId + Date.now())
        };
        
        this.accessLogs.unshift(logEntry);
        
        // Manter apenas últimos 10.000 logs
        if (this.accessLogs.length > 10000) {
            this.accessLogs = this.accessLogs.slice(0, 10000);
        }
        
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
    getAllAccessLogs(limit = 200) {
        return this.accessLogs.slice(0, limit);
    }
    
    /**
     * Gera relatório de integridade do sistema
     */
    generateIntegrityReport() {
        const blockchainVerification = this.verifyBlockchain();
        
        const evidences = [];
        for (const [id, evidence] of this.evidenceChain) {
            const verification = this.verifyEvidence(id);
            evidences.push({
                id: id,
                name: evidence.name,
                type: evidence.type,
                caseId: evidence.caseId,
                timestamp: evidence.timestamp,
                valid: verification.valid,
                custodyTransfers: evidence.chain.length
            });
        }
        
        const invalidEvidences = evidences.filter(e => !e.valid);
        
        return {
            generatedAt: new Date().toISOString(),
            systemHash: this.calculateHash(JSON.stringify(this.blockchain)),
            blockchain: {
                valid: blockchainVerification.valid,
                blocks: blockchainVerification.blocks,
                error: blockchainVerification.error || null
            },
            evidences: {
                total: evidences.length,
                valid: evidences.filter(e => e.valid).length,
                invalid: invalidEvidences.length,
                invalidList: invalidEvidences.map(e => ({ id: e.id, name: e.name }))
            },
            accessLogs: {
                total: this.accessLogs.length,
                last24h: this.accessLogs.filter(log => {
                    const logDate = new Date(log.timestamp);
                    const dayAgo = new Date();
                    dayAgo.setDate(dayAgo.getDate() - 1);
                    return logDate > dayAgo;
                }).length
            },
            integrityScore: this.calculateIntegrityScore(blockchainVerification, invalidEvidences.length, evidences.length)
        };
    }
    
    /**
     * Calcula pontuação de integridade (0-100)
     */
    calculateIntegrityScore(blockchainVerification, invalidCount, totalEvidences) {
        let score = 100;
        
        if (!blockchainVerification.valid) {
            score -= 50;
        }
        
        if (totalEvidences > 0) {
            const invalidPercentage = (invalidCount / totalEvidences) * 100;
            score -= invalidPercentage * 0.5;
        }
        
        return Math.max(0, Math.min(100, score));
    }
    
    /**
     * Verifica integridade do sistema (para botão de integridade)
     */
    verifySystemIntegrity() {
        const report = this.generateIntegrityReport();
        
        const modalBody = document.getElementById('integrityBody');
        if (modalBody) {
            const integrityScoreColor = report.integrityScore >= 90 ? '#00e676' : 
                                        report.integrityScore >= 70 ? '#ffc107' : '#ff1744';
            
            modalBody.innerHTML = `
                <div class="integrity-report">
                    <div class="integrity-header">
                        <h3>RELATÓRIO DE INTEGRIDADE FORENSE</h3>
                        <div class="integrity-score" style="color: ${integrityScoreColor}">
                            ${report.integrityScore}%
                        </div>
                    </div>
                    
                    <div class="integrity-section">
                        <h4><i class="fas fa-link"></i> BLOCKCHAIN</h4>
                        <div class="detail-row">
                            <span>Estado:</span>
                            <strong style="color: ${report.blockchain.valid ? '#00e676' : '#ff1744'}">
                                ${report.blockchain.valid ? 'VÁLIDA' : 'INVÁLIDA - ' + report.blockchain.error}
                            </strong>
                        </div>
                        <div class="detail-row">
                            <span>Blocos:</span>
                            <strong>${report.blockchain.blocks}</strong>
                        </div>
                    </div>
                    
                    <div class="integrity-section">
                        <h4><i class="fas fa-fingerprint"></i> EVIDÊNCIAS</h4>
                        <div class="detail-row">
                            <span>Total:</span>
                            <strong>${report.evidences.total}</strong>
                        </div>
                        <div class="detail-row">
                            <span>Integridade Verificada:</span>
                            <strong style="color: #00e676">${report.evidences.valid}</strong>
                        </div>
                        <div class="detail-row">
                            <span>Integridade Comprometida:</span>
                            <strong style="color: #ff1744">${report.evidences.invalid}</strong>
                        </div>
                        ${report.evidences.invalidList.length > 0 ? `
                            <div class="detail-row">
                                <span>Evidências Inválidas:</span>
                                <strong>${report.evidences.invalidList.map(e => e.id).join(', ')}</strong>
                            </div>
                        ` : ''}
                    </div>
                    
                    <div class="integrity-section">
                        <h4><i class="fas fa-history"></i> REGISTOS DE ACESSO</h4>
                        <div class="detail-row">
                            <span>Total de Acessos:</span>
                            <strong>${report.accessLogs.total}</strong>
                        </div>
                        <div class="detail-row">
                            <span>Últimas 24h:</span>
                            <strong>${report.accessLogs.last24h}</strong>
                        </div>
                    </div>
                    
                    <div class="integrity-footer">
                        <p><i class="fas fa-shield-alt"></i> Sistema verificado em: ${report.generatedAt}</p>
                        <p><i class="fas fa-hashtag"></i> Hash do Sistema: ${report.systemHash.substring(0, 32)}...</p>
                    </div>
                </div>
            `;
        }
        
        document.getElementById('integrityModal').style.display = 'flex';
        
        if (window.EliteUtils) {
            if (report.blockchain.valid && report.evidences.invalid === 0) {
                window.EliteUtils.showToast('Integridade do sistema VERIFICADA. Cadeia de custódia íntegra.', 'success');
            } else {
                window.EliteUtils.showToast('ALERTA: Integridade comprometida. Verifique o relatório detalhado.', 'error');
            }
        }
        
        return report;
    }
    
    /**
     * Exporta cadeia de custódia completa
     */
    exportChainOfCustody(evidenceId) {
        const evidence = this.getEvidence(evidenceId);
        if (!evidence) {
            if (window.EliteUtils) {
                window.EliteUtils.showToast('Evidência não encontrada', 'error');
            }
            return null;
        }
        
        const report = {
            evidenceId: evidence.id,
            name: evidence.name,
            type: evidence.type,
            caseId: evidence.caseId,
            registeredAt: evidence.timestamp,
            hash: evidence.hash,
            custodyChain: evidence.chain,
            accessLogs: this.getAccessLogs(evidenceId),
            verification: this.verifyEvidence(evidenceId),
            exportedAt: new Date().toISOString(),
            exportedBy: window.ELITE_SESSION_ID || 'system'
        };
        
        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `custody_chain_${evidenceId}_${new Date().toISOString().slice(0, 10)}.json`;
        link.click();
        URL.revokeObjectURL(link.href);
        
        this.logAccess(evidenceId, 'EXPORT', window.ELITE_SESSION_ID || 'system');
        
        if (window.EliteUtils) {
            window.EliteUtils.showToast(`Cadeia de custódia de ${evidence.name} exportada`, 'success');
        }
        
        return report;
    }
    
    /**
     * Salva blockchain no localStorage
     */
    saveBlockchain() {
        localStorage.setItem('elite_forensic_blockchain', JSON.stringify(this.blockchain));
    }
    
    /**
     * Carrega blockchain do localStorage
     */
    loadBlockchain() {
        const stored = localStorage.getItem('elite_forensic_blockchain');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                if (parsed.length > 0) {
                    this.blockchain = parsed;
                }
            } catch (e) {
                console.error('[ELITE] Erro ao carregar blockchain:', e);
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
        localStorage.setItem('elite_forensic_evidence', JSON.stringify(evidenceObj));
    }
    
    /**
     * Carrega cadeia de evidências do localStorage
     */
    loadEvidenceChain() {
        const stored = localStorage.getItem('elite_forensic_evidence');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                for (const [key, value] of Object.entries(parsed)) {
                    this.evidenceChain.set(key, value);
                }
            } catch (e) {
                console.error('[ELITE] Erro ao carregar evidências:', e);
            }
        }
    }
    
    /**
     * Salva logs de acesso no localStorage
     */
    saveAccessLogs() {
        localStorage.setItem('elite_forensic_logs', JSON.stringify(this.accessLogs));
    }
    
    /**
     * Carrega logs de acesso do localStorage
     */
    loadAccessLogs() {
        const stored = localStorage.getItem('elite_forensic_logs');
        if (stored) {
            try {
                this.accessLogs = JSON.parse(stored);
            } catch (e) {
                console.error('[ELITE] Erro ao carregar logs:', e);
                this.accessLogs = [];
            }
        }
    }
    
    /**
     * Adiciona evidência via UI (para integração com módulo de evidências)
     */
    addEvidence(evidence) {
        return this.registerEvidence(evidence);
    }
    
    /**
     * Obtém estatísticas do vault
     */
    getStatistics() {
        const totalEvidences = this.evidenceChain.size;
        let totalTransfers = 0;
        for (const [_, evidence] of this.evidenceChain) {
            totalTransfers += evidence.chain.length;
        }
        
        return {
            blockchainBlocks: this.blockchain.length,
            totalEvidences: totalEvidences,
            totalTransfers: totalTransfers,
            totalAccessLogs: this.accessLogs.length,
            integrityScore: this.calculateIntegrityScore(
                this.verifyBlockchain(),
                Array.from(this.evidenceChain.values()).filter(e => !this.verifyEvidence(e.id).valid).length,
                totalEvidences
            ),
            lastBlock: this.blockchain[this.blockchain.length - 1]?.timestamp || null
        };
    }
    
    /**
     * Limpa todos os dados (purga)
     */
    purgeAll() {
        this.blockchain = [];
        this.evidenceChain.clear();
        this.accessLogs = [];
        this.createGenesisBlock();
        this.saveBlockchain();
        this.saveEvidenceChain();
        this.saveAccessLogs();
        
        if (window.EliteUtils) {
            window.EliteUtils.showToast('Forensic Vault: Todos os dados foram purgados', 'warning');
        }
        
        return this;
    }
}

// Instância global
window.ForensicVault = new ForensicVault();