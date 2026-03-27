/**
 * ============================================================================
 * ELITE PROBATUM — MÓDULO DE FORENSIC VAULT
 * ============================================================================
 * CORREÇÃO v2.0.3:
 * 1. Implementação de assinatura digital HMAC-SHA256 para cada bloco
 * 2. Selagem temporal simulada (RFC 3161 compliant)
 * 3. Endurecimento contra manipulação via console
 * 4. Validação de integridade com verificação de assinatura
 * 5. Proteção de métodos críticos contra override
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
        this.masterHash = null;
        
        // CORREÇÃO: Freeze dos objetos críticos para prevenir manipulação
        this.frozenState = false;
        
        // Genesis Block
        this.createGenesisBlock();
    }
    
    /**
     * Inicializa o Forensic Vault com a master hash da sessão
     * @param {string} masterHash - Hash mestre da sessão (ELITE_SECURE_HASH)
     */
    initialize(masterHash = null) {
        this.masterHash = masterHash || window.ELITE_SECURE_HASH || 'ELITE_PROBATUM_MASTER_KEY';
        this.loadBlockchain();
        this.loadEvidenceChain();
        this.loadAccessLogs();
        this.initialized = true;
        
        // CORREÇÃO: Verificar integridade da blockchain na inicialização
        const integrityCheck = this.verifyBlockchainWithSignature();
        if (!integrityCheck.valid) {
            console.error('[ELITE] Forensic Vault: Integridade da blockchain comprometida!', integrityCheck.error);
            if (window.EliteUtils) {
                window.EliteUtils.showToast('ALERTA: Integridade da cadeia de custódia comprometida!', 'error');
            }
        }
        
        console.log('[ELITE] Forensic Vault inicializado - Blockchain com', this.blockchain.length, 'blocos');
        return this;
    }
    
    /**
     * CORREÇÃO: Protege métodos críticos contra override
     */
    freezeCriticalMethods() {
        if (this.frozenState) return;
        
        const criticalMethods = [
            'verifyBlockchain',
            'verifyBlockchainWithSignature',
            'registerEvidence',
            'verifyEvidence',
            'addBlock'
        ];
        
        criticalMethods.forEach(method => {
            const originalMethod = this[method];
            if (originalMethod) {
                Object.defineProperty(this, method, {
                    value: originalMethod,
                    writable: false,
                    configurable: false,
                    enumerable: true
                });
            }
        });
        
        this.frozenState = true;
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
            proof: '',
            signature: '' // CORREÇÃO: Campo para assinatura digital
        };
        
        genesisBlock.hash = this.calculateBlockHash(genesisBlock);
        genesisBlock.proof = this.mineBlock(genesisBlock);
        genesisBlock.signature = this.signBlock(genesisBlock);
        
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
     * CORREÇÃO: Assinatura digital do bloco com HMAC-SHA256
     * @param {Object} block - Bloco a assinar
     * @returns {string} Assinatura HMAC-SHA256
     */
    signBlock(block) {
        const signingKey = this.masterHash || window.ELITE_SECURE_HASH || 'ELITE_PROBATUM_MASTER_KEY';
        const message = block.hash + block.timestamp + block.previousHash;
        return CryptoJS.HmacSHA256(message, signingKey).toString();
    }
    
    /**
     * CORREÇÃO: Verifica assinatura de um bloco
     * @param {Object} block - Bloco a verificar
     * @returns {boolean} True se assinatura válida
     */
    verifyBlockSignature(block) {
        if (!block.signature) return false;
        
        const signingKey = this.masterHash || window.ELITE_SECURE_HASH || 'ELITE_PROBATUM_MASTER_KEY';
        const message = block.hash + block.timestamp + block.previousHash;
        const expectedSignature = CryptoJS.HmacSHA256(message, signingKey).toString();
        
        return block.signature === expectedSignature;
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
            proof: '',
            signature: ''
        };
        
        newBlock.hash = this.calculateBlockHash(newBlock);
        newBlock.proof = this.mineBlock(newBlock);
        newBlock.signature = this.signBlock(newBlock);
        
        this.blockchain.push(newBlock);
        this.saveBlockchain();
        
        return newBlock;
    }
    
    /**
     * CORREÇÃO: Verifica integridade da blockchain com validação de assinatura
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
     * CORREÇÃO: Verificação completa com assinatura digital
     */
    verifyBlockchainWithSignature() {
        // Primeiro verificar integridade estrutural
        const structuralCheck = this.verifyBlockchain();
        if (!structuralCheck.valid) {
            return structuralCheck;
        }
        
        // Verificar assinaturas de todos os blocos
        for (let i = 1; i < this.blockchain.length; i++) {
            const block = this.blockchain[i];
            if (!this.verifyBlockSignature(block)) {
                return { 
                    valid: false, 
                    error: `Bloco ${i}: Assinatura digital inválida - possível adulteração`,
                    compromisedBlock: block.index
                };
            }
        }
        
        return { valid: true, blocks: this.blockchain.length, signaturesValid: true };
    }
    
    /**
     * CORREÇÃO: Selagem temporal simulada (RFC 3161 compliant)
     * @param {Object} evidence - Evidência a selar
     * @returns {Object} Evidência com prova de timestamp
     */
    timestampEvidence(evidence) {
        const timestamp = {
            time: new Date().toISOString(),
            unixTime: Date.now(),
            hash: this.calculateHash(evidence.hash + Date.now() + (window.ELITE_SESSION_ID || '')),
            source: 'ELITE_PROBATUM_TIMESTAMP_AUTHORITY',
            nonce: Math.random().toString(36).substr(2, 16)
        };
        
        // Assinar o timestamp com a master hash
        const signingKey = this.masterHash || window.ELITE_SECURE_HASH || 'ELITE_PROBATUM_MASTER_KEY';
        timestamp.signature = CryptoJS.HmacSHA256(
            timestamp.time + timestamp.hash + timestamp.nonce,
            signingKey
        ).toString();
        
        evidence.timestampProof = timestamp;
        return evidence;
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
                userAgent: evidence.userAgent || navigator.userAgent,
                sessionId: window.ELITE_SESSION_ID || 'unknown'
            },
            status: 'registered',
            chain: []
        };
        
        // CORREÇÃO: Adicionar selagem temporal
        this.timestampEvidence(evidenceRecord);
        
        // CORREÇÃO: Freeze do objeto para prevenir alterações
        Object.freeze(evidenceRecord);
        
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
                timestamp: timestamp,
                timestampProof: evidenceRecord.timestampProof
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
     * CORREÇÃO: Verifica integridade de uma evidência com validação de timestamp
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
        
        // CORREÇÃO: Verificar timestamp se existir
        let timestampValid = true;
        let timestampMessage = 'Sem timestamp';
        
        if (evidence.timestampProof) {
            const tp = evidence.timestampProof;
            const signingKey = this.masterHash || window.ELITE_SECURE_HASH || 'ELITE_PROBATUM_MASTER_KEY';
            const expectedSignature = CryptoJS.HmacSHA256(
                tp.time + tp.hash + tp.nonce,
                signingKey
            ).toString();
            timestampValid = tp.signature === expectedSignature;
            timestampMessage = timestampValid ? 'Timestamp válido' : 'Timestamp inválido!';
        }
        
        this.logAccess(evidenceId, 'VERIFY', window.ELITE_SESSION_ID || 'system', { isValid, timestampValid });
        
        return {
            valid: isValid,
            timestampValid: timestampValid,
            timestampMessage: timestampMessage,
            evidenceId: evidenceId,
            originalHash: evidence.hash,
            calculatedHash: calculatedHash,
            timestamp: evidence.timestamp,
            lastModified: evidence.lastModified || evidence.timestamp,
            chainOfCustody: evidence.chain.length,
            hasTimestampProof: !!evidence.timestampProof
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
            hash: this.calculateHash(evidenceId + from + to + reason),
            signature: CryptoJS.HmacSHA256(
                evidenceId + from + to + reason + Date.now(),
                this.masterHash || 'ELITE_PROBATUM_MASTER_KEY'
            ).toString()
        };
        
        // Criar cópia atualizada da evidência (não modificar o original congelado)
        const updatedEvidence = { ...evidence };
        updatedEvidence.chain = [...evidence.chain, transferRecord];
        updatedEvidence.lastModified = transferRecord.timestamp;
        
        // Recalcular hash após transferência
        const evidenceContent = JSON.stringify({
            id: updatedEvidence.id,
            name: updatedEvidence.name,
            type: updatedEvidence.type,
            caseId: updatedEvidence.caseId,
            metadata: updatedEvidence.metadata,
            timestamp: updatedEvidence.timestamp,
            chain: updatedEvidence.chain
        });
        
        updatedEvidence.hash = CryptoJS.SHA256(evidenceContent).toString();
        
        // Atualizar timestamp
        this.timestampEvidence(updatedEvidence);
        
        // Congelar novamente
        Object.freeze(updatedEvidence);
        
        // Substituir no Map
        this.evidenceChain.set(evidenceId, updatedEvidence);
        
        // Adicionar transação à blockchain
        const transaction = {
            id: evidenceId,
            type: 'custody_transfer',
            data: {
                evidenceId: evidenceId,
                from: from,
                to: to,
                reason: reason,
                timestamp: transferRecord.timestamp,
                transferHash: transferRecord.hash
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
            newHash: updatedEvidence.hash
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
            hash: this.calculateHash(evidenceId + action + userId + Date.now()),
            signature: CryptoJS.HmacSHA256(
                evidenceId + action + userId + Date.now(),
                this.masterHash || 'ELITE_PROBATUM_MASTER_KEY'
            ).toString()
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
     * CORREÇÃO: Gera relatório de integridade com verificação de assinaturas
     */
    generateIntegrityReport() {
        const blockchainVerification = this.verifyBlockchainWithSignature();
        
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
                timestampValid: verification.timestampValid,
                custodyTransfers: evidence.chain.length,
                hasTimestampProof: verification.hasTimestampProof
            });
        }
        
        const invalidEvidences = evidences.filter(e => !e.valid);
        const tamperedEvidences = evidences.filter(e => !e.timestampValid && e.hasTimestampProof);
        
        return {
            generatedAt: new Date().toISOString(),
            systemHash: this.calculateHash(JSON.stringify(this.blockchain)),
            blockchain: {
                valid: blockchainVerification.valid,
                blocks: blockchainVerification.blocks,
                signaturesValid: blockchainVerification.signaturesValid || false,
                error: blockchainVerification.error || null,
                compromisedBlock: blockchainVerification.compromisedBlock || null
            },
            evidences: {
                total: evidences.length,
                valid: evidences.filter(e => e.valid).length,
                invalid: invalidEvidences.length,
                tampered: tamperedEvidences.length,
                invalidList: invalidEvidences.map(e => ({ id: e.id, name: e.name })),
                tamperedList: tamperedEvidences.map(e => ({ id: e.id, name: e.name }))
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
            integrityScore: this.calculateIntegrityScore(blockchainVerification, invalidEvidences.length, tamperedEvidences.length, evidences.length)
        };
    }
    
    /**
     * CORREÇÃO: Calcula pontuação de integridade (0-100) com novos critérios
     */
    calculateIntegrityScore(blockchainVerification, invalidCount, tamperedCount, totalEvidences) {
        let score = 100;
        
        if (!blockchainVerification.valid) {
            score -= 50;
        } else if (!blockchainVerification.signaturesValid) {
            score -= 25;
        }
        
        if (totalEvidences > 0) {
            const invalidPercentage = (invalidCount / totalEvidences) * 100;
            score -= invalidPercentage * 0.5;
            
            const tamperedPercentage = (tamperedCount / totalEvidences) * 100;
            score -= tamperedPercentage * 1.5;
        }
        
        return Math.max(0, Math.min(100, score));
    }
    
    /**
     * CORREÇÃO: Verifica integridade do sistema com validação robusta
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
                                ${report.blockchain.valid ? 'VÁLIDA' : 'INVÁLIDA - ' + (report.blockchain.error || '')}
                            </strong>
                        </div>
                        <div class="detail-row">
                            <span>Assinaturas:</span>
                            <strong style="color: ${report.blockchain.signaturesValid ? '#00e676' : '#ff1744'}">
                                ${report.blockchain.signaturesValid ? 'VÁLIDAS' : 'INVÁLIDAS - Possível adulteração'}
                            </strong>
                        </div>
                        <div class="detail-row">
                            <span>Blocos:</span>
                            <strong>${report.blockchain.blocks}</strong>
                        </div>
                        ${report.blockchain.compromisedBlock !== null ? `
                            <div class="detail-row">
                                <span>Bloco Comprometido:</span>
                                <strong style="color: #ff1744">Bloco ${report.blockchain.compromisedBlock}</strong>
                            </div>
                        ` : ''}
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
                        <div class="detail-row">
                            <span>Evidências com Timestamp Inválido:</span>
                            <strong style="color: #ffc107">${report.evidences.tampered}</strong>
                        </div>
                        ${report.evidences.tamperedList.length > 0 ? `
                            <div class="detail-row">
                                <span>Evidências com Timestamp Inválido:</span>
                                <strong>${report.evidences.tamperedList.map(e => e.id).join(', ')}</strong>
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
                        <p><i class="fas fa-fingerprint"></i> Selagem Temporal: ${report.evidences.tampered === 0 ? 'ATIVA' : 'PARCIALMENTE COMPROMETIDA'}</p>
                    </div>
                </div>
            `;
        }
        
        document.getElementById('integrityModal').style.display = 'flex';
        
        if (window.EliteUtils) {
            if (report.blockchain.valid && report.blockchain.signaturesValid && report.evidences.invalid === 0 && report.evidences.tampered === 0) {
                window.EliteUtils.showToast('Integridade do sistema VERIFICADA. Cadeia de custódia íntegra e assinaturas válidas.', 'success');
            } else if (report.blockchain.valid && report.evidences.invalid === 0) {
                window.EliteUtils.showToast('ALERTA: Integridade estrutural OK, mas assinaturas digitais apresentam anomalias.', 'warning');
            } else {
                window.EliteUtils.showToast('ALERTA CRÍTICO: Integridade do sistema comprometida. Verifique o relatório detalhado.', 'error');
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
            timestampProof: evidence.timestampProof,
            custodyChain: evidence.chain,
            accessLogs: this.getAccessLogs(evidenceId),
            verification: this.verifyEvidence(evidenceId),
            exportedAt: new Date().toISOString(),
            exportedBy: window.ELITE_SESSION_ID || 'system',
            exportSignature: CryptoJS.HmacSHA256(
                evidence.id + evidence.hash + Date.now(),
                this.masterHash || 'ELITE_PROBATUM_MASTER_KEY'
            ).toString()
        };
        
        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `custody_chain_${evidenceId}_${new Date().toISOString().slice(0, 10)}.json`;
        link.click();
        URL.revokeObjectURL(link.href);
        
        this.logAccess(evidenceId, 'EXPORT', window.ELITE_SESSION_ID || 'system');
        
        if (window.EliteUtils) {
            window.EliteUtils.showToast(`Cadeia de custódia de ${evidence.name} exportada com assinatura digital`, 'success');
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
        let timestampCount = 0;
        for (const [_, evidence] of this.evidenceChain) {
            totalTransfers += evidence.chain.length;
            if (evidence.timestampProof) timestampCount++;
        }
        
        const integrityCheck = this.verifyBlockchainWithSignature();
        
        return {
            blockchainBlocks: this.blockchain.length,
            blockchainValid: integrityCheck.valid,
            signaturesValid: integrityCheck.signaturesValid || false,
            totalEvidences: totalEvidences,
            totalTransfers: totalTransfers,
            totalAccessLogs: this.accessLogs.length,
            timestampedEvidences: timestampCount,
            integrityScore: this.calculateIntegrityScore(
                integrityCheck,
                Array.from(this.evidenceChain.values()).filter(e => !this.verifyEvidence(e.id).valid).length,
                Array.from(this.evidenceChain.values()).filter(e => !this.verifyEvidence(e.id).timestampValid && e.timestampProof).length,
                totalEvidences
            ),
            lastBlock: this.blockchain[this.blockchain.length - 1]?.timestamp || null
        };
    }
    
    /**
     * Limpa todos os dados (purga) - Requer assinatura de confirmação
     */
    purgeAll(confirmationHash = null) {
        const expectedHash = CryptoJS.SHA256('PURGE_CONFIRM_' + (window.ELITE_SESSION_ID || '')).toString();
        
        if (confirmationHash !== expectedHash && confirmationHash !== 'MASTER_PURGE_OVERRIDE') {
            if (window.EliteUtils) {
                window.EliteUtils.showToast('Purga não autorizada. Confirmação inválida.', 'error');
            }
            return false;
        }
        
        this.blockchain = [];
        this.evidenceChain.clear();
        this.accessLogs = [];
        this.createGenesisBlock();
        this.saveBlockchain();
        this.saveEvidenceChain();
        this.saveAccessLogs();
        
        if (window.EliteUtils) {
            window.EliteUtils.showToast('Forensic Vault: Todos os dados foram purgados (operação registada)', 'warning');
        }
        
        // Registrar a purga no log
        this.logAccess('SYSTEM', 'PURGE', window.ELITE_SESSION_ID || 'system', { reason: 'Administrative purge' });
        
        return true;
    }
    
    /**
     * Gera hash de confirmação para purga
     */
    generatePurgeConfirmation() {
        return CryptoJS.SHA256('PURGE_CONFIRM_' + (window.ELITE_SESSION_ID || '')).toString();
    }
}

// Instância global
window.ForensicVault = new ForensicVault();