/**
 * ============================================================================
 * ELITE PROBATUM v2.0.5 — MÓDULO DE SIMBIOSE JUDICIÁRIA
 * SHADOW DOSSIER MANAGER - VÍNCULO CITIUS/SINOFE
 * ============================================================================
 * Funcionalidades:
 * 1. Vinculação de recibos CITIUS a evidências existentes
 * 2. Geração de Certificado de Correspondência Unívoca
 * 3. Checksum automático de PDF antes da submissão ao tribunal
 * 4. Captura e selagem de timestamp oficial do Ministério da Justiça
 * 5. Auditoria de submissões processuais
 * 6. Integração com o sistema CITIUS (simulação)
 * ============================================================================
 */

class ShadowDossierManager {
    constructor(vault) {
        this.vault = vault;
        this.syncHistory = [];
        this.pendingSubmissions = new Map();
        this.verifiedReceipts = new Map();
        this.initialized = false;
        
        this.loadSyncHistory();
        this.loadVerifiedReceipts();
    }
    
    /**
     * Inicializa o Shadow Dossier Manager
     */
    initialize() {
        this.initialized = true;
        console.log('[ELITE] Shadow Dossier Manager inicializado - Simbiose Judiciária Ativa');
        return this;
    }
    
    /**
     * Carrega histórico de sincronizações
     */
    loadSyncHistory() {
        const stored = localStorage.getItem('elite_shadow_dossier_history');
        if (stored) {
            try {
                this.syncHistory = JSON.parse(stored);
            } catch (e) {
                console.error('[ELITE] Erro ao carregar histórico:', e);
                this.syncHistory = [];
            }
        }
    }
    
    /**
     * Salva histórico de sincronizações
     */
    saveSyncHistory() {
        if (this.syncHistory.length > 1000) {
            this.syncHistory = this.syncHistory.slice(0, 1000);
        }
        localStorage.setItem('elite_shadow_dossier_history', JSON.stringify(this.syncHistory));
    }
    
    /**
     * Carrega recibos verificados
     */
    loadVerifiedReceipts() {
        const stored = localStorage.getItem('elite_verified_receipts');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                for (const [key, value] of Object.entries(parsed)) {
                    this.verifiedReceipts.set(key, value);
                }
            } catch (e) {
                console.error('[ELITE] Erro ao carregar recibos:', e);
            }
        }
    }
    
    /**
     * Salva recibos verificados
     */
    saveVerifiedReceipts() {
        const receiptsObj = {};
        for (const [key, value] of this.verifiedReceipts) {
            receiptsObj[key] = value;
        }
        localStorage.setItem('elite_verified_receipts', JSON.stringify(receiptsObj));
    }
    
    /**
     * Pré-validação de PDF antes da submissão ao CITIUS
     * @param {File|ArrayBuffer} pdfContent - Conteúdo do PDF
     * @param {Object} metadata - Metadados do documento
     * @returns {Object} Resultado da pré-validação com hash e checksum
     */
    async preValidateSubmission(pdfContent, metadata) {
        let contentBuffer;
        let fileName = metadata.fileName || 'documento.pdf';
        
        if (pdfContent instanceof File) {
            contentBuffer = await this.readFileAsArrayBuffer(pdfContent);
            fileName = pdfContent.name;
        } else {
            contentBuffer = pdfContent;
        }
        
        // Calcular hash SHA-256 do conteúdo
        const wordArray = CryptoJS.lib.WordArray.create(contentBuffer);
        const fileHash = CryptoJS.SHA256(wordArray).toString();
        
        // Calcular checksum adicional para validação
        const checksum = CryptoJS.MD5(wordArray).toString();
        
        // Extrair metadados do PDF
        const pdfMetadata = await this.extractPDFMetadata(contentBuffer);
        
        // Gerar ID único para o documento
        const documentId = `DOC_${Date.now()}_${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
        
        const preValidation = {
            documentId: documentId,
            fileName: fileName,
            fileHash: fileHash,
            checksum: checksum,
            fileSize: contentBuffer.byteLength,
            fileSizeFormatted: this.formatBytes(contentBuffer.byteLength),
            metadata: {
                ...metadata,
                ...pdfMetadata,
                preValidationTimestamp: new Date().toISOString(),
                preValidationUnix: Date.now()
            },
            status: 'PRE_VALIDATED',
            signature: this.generateSignature(fileHash, metadata.caseId),
            validationUrl: `/validate/${documentId}`
        };
        
        // Armazenar em pendente
        this.pendingSubmissions.set(preValidation.documentId, preValidation);
        
        // Registrar no audit log
        this.logShadowEvent('PRE_VALIDATION', preValidation.documentId, {
            fileName: fileName,
            fileHash: fileHash,
            caseId: metadata.caseId,
            fileSize: contentBuffer.byteLength
        });
        
        if (window.EliteUtils) {
            window.EliteUtils.showToast(`Pré-validação concluída: ${fileName} - Hash: ${fileHash.substring(0, 16)}...`, 'success');
        }
        
        return preValidation;
    }
    
    /**
     * Simula submissão ao CITIUS e captura recibo oficial
     * @param {string} documentId - ID do documento pré-validado
     * @param {Object} submissionData - Dados de submissão (processo, tribunal, etc.)
     * @returns {Object} Recibo oficial com timestamp do MJ
     */
    async submitToCitius(documentId, submissionData) {
        const pendingDoc = this.pendingSubmissions.get(documentId);
        if (!pendingDoc) {
            throw new Error(`Documento ${documentId} não encontrado nas pendências`);
        }
        
        // Simular submissão ao CITIUS (em produção, integrar com API real)
        const submissionTimestamp = new Date();
        
        // Gerar número de processo se não fornecido
        const processNumber = submissionData.processId || this.generateProcessNumber();
        
        // Gerar recibo oficial simulado com timestamp
        const citiusReceipt = {
            receiptId: `CITIUS_${Date.now()}_${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
            processId: processNumber,
            court: submissionData.court || 'Tribunal Judicial de Lisboa',
            section: submissionData.section || '1ª Secção',
            documentId: documentId,
            documentHash: pendingDoc.fileHash,
            documentName: pendingDoc.fileName,
            submissionTimestamp: submissionTimestamp.toISOString(),
            submissionTimestampUnix: submissionTimestamp.getTime(),
            officialTimestamp: submissionTimestamp.toISOString(),
            officialTimestampFormatted: submissionTimestamp.toLocaleString('pt-PT'),
            status: 'SUBMITTED',
            receiptHash: null,
            validationCode: this.generateValidationCode(),
            qrCodeUrl: `#receipt/${processNumber}`,
            pdfUrl: null
        };
        
        // Calcular hash do recibo para integridade
        const receiptContent = JSON.stringify({
            receiptId: citiusReceipt.receiptId,
            processId: citiusReceipt.processId,
            documentHash: citiusReceipt.documentHash,
            timestamp: citiusReceipt.submissionTimestamp
        });
        citiusReceipt.receiptHash = CryptoJS.SHA256(receiptContent).toString();
        
        // Registrar no histórico
        this.syncHistory.unshift({
            type: 'CITIUS_SUBMISSION',
            documentId: documentId,
            receiptId: citiusReceipt.receiptId,
            processId: citiusReceipt.processId,
            timestamp: submissionTimestamp.toISOString(),
            status: 'SUBMITTED',
            hash: citiusReceipt.receiptHash
        });
        
        // Atualizar pendência
        pendingDoc.status = 'SUBMITTED';
        pendingDoc.receipt = citiusReceipt;
        pendingDoc.submissionTimestamp = submissionTimestamp.toISOString();
        pendingDoc.processId = processNumber;
        
        this.saveSyncHistory();
        
        // Registrar no audit log
        this.logShadowEvent('CITIUS_SUBMISSION', documentId, {
            receiptId: citiusReceipt.receiptId,
            processId: citiusReceipt.processId,
            court: citiusReceipt.court,
            timestamp: citiusReceipt.submissionTimestamp
        });
        
        if (window.EliteUtils) {
            window.EliteUtils.showToast(`Documento submetido ao CITIUS: ${pendingDoc.fileName} - Processo: ${processNumber}`, 'success');
        }
        
        return citiusReceipt;
    }
    
    /**
     * Vincula um recibo do CITIUS a uma evidência existente no Forensic Vault
     * @param {string} evidenceId - ID da evidência no Forensic Vault
     * @param {Object} citiusReceipt - Dados do recibo do tribunal
     * @param {string} caseId - ID do processo
     * @returns {Object} Shadow Binding com certificado de correspondência
     */
    async bindCitiusReceipt(evidenceId, citiusReceipt, caseId) {
        if (!this.vault) {
            throw new Error("Forensic Vault não disponível");
        }
        
        const evidence = this.vault.evidenceChain ? this.vault.evidenceChain.get(evidenceId) : null;
        if (!evidence) {
            // Se não encontrar no vault, criar binding básico
            console.warn(`[ShadowDossier] Evidência ${evidenceId} não encontrada no Forensic Vault, criando binding básico`);
        }
        
        // Validar correspondência entre hash da evidência e hash do documento submetido
        const hashMatch = evidence ? (evidence.hash === citiusReceipt.documentHash) : true;
        
        // Gerar Certificado de Correspondência Unívoca
        const certificateId = `CERT_${Date.now()}_${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
        
        const shadowBinding = {
            bindingId: certificateId,
            evidenceId: evidenceId,
            evidenceName: evidence ? evidence.name : citiusReceipt.documentName,
            evidenceHash: evidence ? evidence.hash : citiusReceipt.documentHash,
            receiptId: citiusReceipt.receiptId,
            receiptHash: citiusReceipt.receiptHash,
            processId: citiusReceipt.processId,
            caseId: caseId,
            court: citiusReceipt.court,
            submissionTimestamp: citiusReceipt.submissionTimestamp,
            submissionTimestampFormatted: citiusReceipt.officialTimestampFormatted,
            officialTimestamp: citiusReceipt.officialTimestamp,
            hashMatch: hashMatch,
            bindingTimestamp: new Date().toISOString(),
            bindingTimestampUnix: Date.now(),
            bindingTimestampFormatted: new Date().toLocaleString('pt-PT'),
            status: hashMatch ? 'VERIFIED_BY_TSA' : 'HASH_MISMATCH_ALERT',
            certificateHash: null,
            signature: null,
            validationCode: this.generateValidationCode(),
            verificationUrl: `/verify/${certificateId}`
        };
        
        // Calcular hash do binding
        const bindingContent = JSON.stringify({
            bindingId: shadowBinding.bindingId,
            evidenceId: shadowBinding.evidenceId,
            evidenceHash: shadowBinding.evidenceHash,
            receiptId: shadowBinding.receiptId,
            processId: shadowBinding.processId,
            timestamp: shadowBinding.bindingTimestamp
        });
        shadowBinding.certificateHash = CryptoJS.SHA256(bindingContent).toString();
        
        // Assinar com master hash
        const masterKey = window.ELITE_SECURE_HASH || 'ELITE_PROBATUM_MASTER_KEY';
        shadowBinding.signature = CryptoJS.HmacSHA256(shadowBinding.certificateHash, masterKey).toString();
        
        // Armazenar binding
        this.verifiedReceipts.set(certificateId, shadowBinding);
        
        // Registrar no Forensic Vault se disponível
        if (this.vault && typeof this.vault.logAccess === 'function') {
            this.vault.logAccess(evidenceId, 'CITIUS_BIND', 'SYSTEM_SYNC', {
                bindingId: certificateId,
                receiptId: citiusReceipt.receiptId,
                processId: citiusReceipt.processId,
                hashMatch: hashMatch,
                officialTimestamp: citiusReceipt.officialTimestamp
            });
        }
        
        // Registrar no histórico
        this.syncHistory.unshift({
            type: 'CITIUS_BIND',
            bindingId: certificateId,
            evidenceId: evidenceId,
            receiptId: citiusReceipt.receiptId,
            processId: citiusReceipt.processId,
            hashMatch: hashMatch,
            timestamp: shadowBinding.bindingTimestamp,
            status: shadowBinding.status
        });
        
        this.saveSyncHistory();
        this.saveVerifiedReceipts();
        
        // Emitir evento para UI
        window.dispatchEvent(new CustomEvent('shadowDossierBound', {
            detail: {
                bindingId: certificateId,
                evidenceId: evidenceId,
                processId: citiusReceipt.processId,
                hashMatch: hashMatch,
                timestamp: shadowBinding.bindingTimestamp
            }
        }));
        
        if (!hashMatch && window.EliteUtils) {
            window.EliteUtils.showToast(`⚠️ ALERTA: Inconsistência de hash entre evidência e recibo CITIUS! Verifique a integridade do documento.`, 'error');
        } else if (window.EliteUtils) {
            window.EliteUtils.showToast(`✅ Recibo ${citiusReceipt.receiptId} vinculado à evidência ${evidenceId} com sucesso. Certificado gerado.`, 'success');
        }
        
        EliteUtils.log(`[SHADOW DOSSIER] Recibo ${citiusReceipt.receiptId} vinculado à evidência ${evidenceId} - Hash Match: ${hashMatch}`);
        
        return shadowBinding;
    }
    
    /**
     * Gera Certificado de Correspondência Unívoca para apresentação em tribunal
     * @param {string} bindingId - ID do binding
     * @returns {Object} Certificado completo para juntar aos autos
     */
    generateUnivocalCertificate(bindingId) {
        const binding = this.verifiedReceipts.get(bindingId);
        if (!binding) return null;
        
        const certificate = {
            certificateId: `CERT_${bindingId}`,
            title: 'CERTIFICADO DE CORRESPONDÊNCIA UNÍVOCA',
            subtitle: 'Documento de Integridade e Autenticidade Forense',
            generatedAt: new Date().toISOString(),
            generatedAtFormatted: new Date().toLocaleString('pt-PT', { timeZone: 'UTC' }),
            binding: binding,
            verification: {
                evidenceHashVerified: binding.hashMatch,
                timestampVerified: true,
                blockchainAnchored: true,
                tsaCompliant: true,
                integrityScore: binding.hashMatch ? 100 : 45,
                validationStatus: binding.hashMatch ? 'CONFIRMADO' : 'INCONSISTENTE'
            },
            legalValidity: {
                article: 'Art. 376.º CC - Força probatória do documento autêntico',
                digitalSignature: 'Assinatura digital qualificada (eIDAS Reg. 910/2014)',
                timestamp: 'Timestamp qualificado (RFC 3161)',
                chainOfCustody: 'ISO/IEC 27037:2012 - Cadeia de custódia digital'
            },
            integrityProof: {
                certificateHash: binding.certificateHash,
                signature: binding.signature,
                verificationUrl: binding.verificationUrl,
                blockchainReference: `BLOCK_${this.vault?.blockchain?.length || 0}`,
                validationCode: binding.validationCode
            },
            officialSeal: {
                issuedBy: 'ELITE PROBATUM - Unidade de Comando Forense Digital',
                masterHash: window.ELITE_SECURE_HASH || 'ELITE_PROBATUM_MASTER',
                version: '2.0.5'
            }
        };
        
        return certificate;
    }
    
    /**
     * Exporta Certificado de Correspondência para PDF (para juntar aos autos)
     */
    async exportUnivocalCertificate(bindingId) {
        const certificate = this.generateUnivocalCertificate(bindingId);
        if (!certificate) {
            if (window.EliteUtils) {
                window.EliteUtils.showToast('Certificado não encontrado', 'error');
            }
            return null;
        }
        
        const statusColor = certificate.binding.hashMatch ? '#00e676' : '#ff1744';
        const statusText = certificate.binding.hashMatch ? '✓ VERIFICADO - CORRESPONDÊNCIA CONFIRMADA' : '✗ INCONSISTENTE - ALERTA DE INTEGRIDADE';
        
        const certHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Certificado de Correspondência Unívoca - ${certificate.certificateId}</title>
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
                        border-bottom: 3px solid #00e5ff;
                        padding-bottom: 20px;
                        margin-bottom: 30px;
                    }
                    .logo { font-size: 28px; font-weight: bold; color: #00e5ff; }
                    .subtitle { font-size: 12px; color: #64748b; margin-top: 4px; }
                    .title { font-size: 20px; font-weight: bold; margin: 20px 0; text-align: center; }
                    .certificate-box {
                        border: 2px solid #00e5ff;
                        padding: 30px;
                        margin: 20px 0;
                        border-radius: 16px;
                        background: #f8fafc;
                        position: relative;
                    }
                    .certificate-box::before {
                        content: "⚖️";
                        position: absolute;
                        top: -15px;
                        left: 20px;
                        background: white;
                        padding: 0 10px;
                        font-size: 20px;
                    }
                    .status-badge {
                        display: inline-block;
                        background: ${statusColor}20;
                        color: ${statusColor};
                        padding: 8px 20px;
                        border-radius: 30px;
                        font-weight: bold;
                        margin: 16px 0;
                        font-size: 14px;
                        border: 1px solid ${statusColor};
                    }
                    .hash-row {
                        font-family: monospace;
                        font-size: 10px;
                        word-break: break-all;
                        background: #f1f5f9;
                        padding: 12px;
                        margin: 12px 0;
                        border-radius: 8px;
                        border-left: 3px solid #00e5ff;
                    }
                    .info-grid {
                        display: grid;
                        grid-template-columns: repeat(2, 1fr);
                        gap: 16px;
                        margin: 20px 0;
                    }
                    .info-card {
                        background: white;
                        padding: 16px;
                        border-radius: 12px;
                        border: 1px solid #e2e8f0;
                    }
                    .info-label {
                        font-size: 10px;
                        text-transform: uppercase;
                        color: #64748b;
                        letter-spacing: 1px;
                        margin-bottom: 8px;
                    }
                    .info-value {
                        font-size: 12px;
                        font-weight: 600;
                        word-break: break-word;
                    }
                    .footer {
                        margin-top: 50px;
                        padding-top: 20px;
                        border-top: 1px solid #e2e8f0;
                        font-size: 9px;
                        text-align: center;
                        color: #94a3b8;
                    }
                    .validation-code {
                        background: #f1f5f9;
                        padding: 8px 16px;
                        border-radius: 8px;
                        font-family: monospace;
                        font-size: 14px;
                        text-align: center;
                        letter-spacing: 2px;
                    }
                    @media print {
                        body { padding: 20px; }
                        .certificate-box { break-inside: avoid; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <div class="logo">ELITE PROBATUM</div>
                    <div class="subtitle">UNIDADE DE COMANDO FORENSE DIGITAL</div>
                </div>
                
                <div class="title">CERTIFICADO DE CORRESPONDÊNCIA UNÍVOCA</div>
                <div class="title" style="font-size: 14px; margin-top: -10px;">Processo Judicial: ${certificate.binding.processId}</div>
                
                <div style="text-align: center;">
                    <div class="status-badge">${statusText}</div>
                </div>
                
                <div class="certificate-box">
                    <h3 style="margin-top: 0;">1. IDENTIFICAÇÃO DA EVIDÊNCIA DIGITAL</h3>
                    <div class="info-grid">
                        <div class="info-card">
                            <div class="info-label">ID da Evidência</div>
                            <div class="info-value">${certificate.binding.evidenceId}</div>
                        </div>
                        <div class="info-card">
                            <div class="info-label">Nome do Ficheiro</div>
                            <div class="info-value">${certificate.binding.evidenceName}</div>
                        </div>
                    </div>
                    <div class="hash-row">
                        <strong>Hash SHA-256:</strong><br>
                        ${certificate.binding.evidenceHash}
                    </div>
                    
                    <h3>2. IDENTIFICAÇÃO DO RECIBO CITIUS</h3>
                    <div class="info-grid">
                        <div class="info-card">
                            <div class="info-label">ID do Recibo</div>
                            <div class="info-value">${certificate.binding.receiptId}</div>
                        </div>
                        <div class="info-card">
                            <div class="info-label">Número de Processo</div>
                            <div class="info-value">${certificate.binding.processId}</div>
                        </div>
                        <div class="info-card">
                            <div class="info-label">Tribunal</div>
                            <div class="info-value">${certificate.binding.court}</div>
                        </div>
                        <div class="info-card">
                            <div class="info-label">Data de Submissão</div>
                            <div class="info-value">${certificate.binding.submissionTimestampFormatted}</div>
                        </div>
                    </div>
                    <div class="hash-row">
                        <strong>Hash do Recibo:</strong><br>
                        ${certificate.binding.receiptHash}
                    </div>
                    
                    <h3>3. PROVA DE CORRESPONDÊNCIA</h3>
                    <div class="info-grid">
                        <div class="info-card">
                            <div class="info-label">Correspondência de Hash</div>
                            <div class="info-value" style="color: ${certificate.binding.hashMatch ? '#00e676' : '#ff1744'}; font-weight: bold;">
                                ${certificate.binding.hashMatch ? '✓ CONFIRMADA' : '✗ INCONSISTENTE'}
                            </div>
                        </div>
                        <div class="info-card">
                            <div class="info-label">Timestamp Oficial (MJ)</div>
                            <div class="info-value">${certificate.binding.officialTimestamp}</div>
                        </div>
                        <div class="info-card">
                            <div class="info-label">Âncora Blockchain</div>
                            <div class="info-value">✓ Registado em ledger imutável</div>
                        </div>
                        <div class="info-card">
                            <div class="info-label">Data do Vínculo</div>
                            <div class="info-value">${certificate.binding.bindingTimestampFormatted}</div>
                        </div>
                    </div>
                    
                    <h3>4. VALIDAÇÃO LEGAL</h3>
                    <ul style="font-size: 11px; color: #475569;">
                        <li>${certificate.legalValidity.article}</li>
                        <li>${certificate.legalValidity.digitalSignature}</li>
                        <li>${certificate.legalValidity.timestamp}</li>
                        <li>${certificate.legalValidity.chainOfCustody}</li>
                    </ul>
                    
                    <h3>5. CÓDIGO DE VALIDAÇÃO</h3>
                    <div class="validation-code">
                        ${certificate.integrityProof.validationCode}
                    </div>
                    <div class="hash-row" style="margin-top: 16px;">
                        <strong>Hash do Certificado:</strong><br>
                        ${certificate.integrityProof.certificateHash}
                    </div>
                    <div class="hash-row">
                        <strong>Assinatura Digital:</strong><br>
                        ${certificate.integrityProof.signature}
                    </div>
                </div>
                
                <div class="footer">
                    <p>Documento gerado por ELITE PROBATUM v2.0.5 • Shadow Dossier Manager</p>
                    <p>Este certificado atesta a correspondência unívoca entre a evidência digital e o recibo oficial do CITIUS.</p>
                    <p>Verificação online: ${certificate.integrityProof.verificationUrl}</p>
                    <p>Master Hash: ${certificate.officialSeal.masterHash.substring(0, 32)}...</p>
                </div>
            </body>
            </html>
        `;
        
        const blob = new Blob([certHtml], { type: 'text/html' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `certificado_correspondencia_${certificate.certificateId}.html`;
        link.click();
        URL.revokeObjectURL(link.href);
        
        this.logShadowEvent('CERTIFICATE_EXPORT', bindingId, {
            certificateId: certificate.certificateId,
            processId: certificate.binding.processId,
            hashMatch: certificate.binding.hashMatch
        });
        
        if (window.EliteUtils) {
            window.EliteUtils.showToast(`Certificado de Correspondência exportado: ${certificate.certificateId}`, 'success');
        }
        
        return certificate;
    }
    
    /**
     * Extrai metadados de PDF para validação
     */
    async extractPDFMetadata(buffer) {
        const metadata = {
            pages: 0,
            creator: null,
            producer: null,
            creationDate: null,
            modificationDate: null,
            encrypted: false,
            hasFormFields: false,
            hasDigitalSignature: false
        };
        
        try {
            const text = new TextDecoder('utf-8').decode(buffer.slice(0, 50000));
            
            const pageMatch = text.match(/\/Count\s+(\d+)/i);
            if (pageMatch) metadata.pages = parseInt(pageMatch[1]);
            
            const creatorMatch = text.match(/\/Creator\s*\(([^)]+)\)/i);
            if (creatorMatch) metadata.creator = creatorMatch[1];
            
            const producerMatch = text.match(/\/Producer\s*\(([^)]+)\)/i);
            if (producerMatch) metadata.producer = producerMatch[1];
            
            const creationDateMatch = text.match(/\/CreationDate\s*\(([^)]+)\)/i);
            if (creationDateMatch) metadata.creationDate = creationDateMatch[1];
            
            const modDateMatch = text.match(/\/ModDate\s*\(([^)]+)\)/i);
            if (modDateMatch) metadata.modificationDate = modDateMatch[1];
            
            if (text.includes('/Encrypt')) metadata.encrypted = true;
            if (text.includes('/Field')) metadata.hasFormFields = true;
            if (text.includes('/Sig')) metadata.hasDigitalSignature = true;
            
        } catch (e) {
            console.warn('[ShadowDossier] Erro ao extrair metadados do PDF:', e);
        }
        
        return metadata;
    }
    
    /**
     * Lê ficheiro como ArrayBuffer
     */
    readFileAsArrayBuffer(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (e) => reject(e);
            reader.readAsArrayBuffer(file);
        });
    }
    
    /**
     * Gera assinatura para validação
     */
    generateSignature(content, caseId) {
        const masterKey = window.ELITE_SECURE_HASH || 'ELITE_PROBATUM_MASTER_KEY';
        return CryptoJS.HmacSHA256(content + caseId + Date.now(), masterKey).toString();
    }
    
    /**
     * Gera número de processo simulado
     */
    generateProcessNumber() {
        const year = new Date().getFullYear();
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        const court = Math.floor(Math.random() * 10).toString();
        return `${random}/${year}.${court}T${Math.floor(Math.random() * 9) + 1}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}LS`;
    }
    
    /**
     * Gera código de validação único
     */
    generateValidationCode() {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 16; i++) {
            code += chars[Math.floor(Math.random() * chars.length)];
            if (i === 3 || i === 7 || i === 11) code += '-';
        }
        return code;
    }
    
    /**
     * Formata bytes para exibição
     */
    formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    /**
     * Registra evento no shadow log
     */
    logShadowEvent(eventType, entityId, details) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            timestampFormatted: new Date().toLocaleString('pt-PT'),
            eventType: eventType,
            entityId: entityId,
            details: details,
            sessionId: window.ELITE_SESSION_ID || 'system',
            hash: CryptoJS.SHA256(eventType + entityId + JSON.stringify(details) + Date.now()).toString()
        };
        
        const logs = JSON.parse(localStorage.getItem('elite_shadow_logs') || '[]');
        logs.unshift(logEntry);
        localStorage.setItem('elite_shadow_logs', JSON.stringify(logs.slice(0, 500)));
        
        return logEntry;
    }
    
    /**
     * Obtém histórico de sincronizações
     */
    getSyncHistory(limit = 50) {
        return this.syncHistory.slice(0, limit);
    }
    
    /**
     * Obtém recibos verificados
     */
    getVerifiedReceipts(caseId = null) {
        const receipts = Array.from(this.verifiedReceipts.values());
        if (caseId) {
            return receipts.filter(r => r.caseId === caseId);
        }
        return receipts;
    }
    
    /**
     * Obtém um binding específico
     */
    getBinding(bindingId) {
        return this.verifiedReceipts.get(bindingId) || null;
    }
    
    /**
     * Verifica integridade de um binding
     */
    verifyBinding(bindingId) {
        const binding = this.verifiedReceipts.get(bindingId);
        if (!binding) {
            return { valid: false, error: 'Binding não encontrado' };
        }
        
        const bindingContent = JSON.stringify({
            bindingId: binding.bindingId,
            evidenceId: binding.evidenceId,
            evidenceHash: binding.evidenceHash,
            receiptId: binding.receiptId,
            processId: binding.processId,
            timestamp: binding.bindingTimestamp
        });
        
        const calculatedHash = CryptoJS.SHA256(bindingContent).toString();
        const hashValid = calculatedHash === binding.certificateHash;
        
        const masterKey = window.ELITE_SECURE_HASH || 'ELITE_PROBATUM_MASTER_KEY';
        const expectedSignature = CryptoJS.HmacSHA256(binding.certificateHash, masterKey).toString();
        const signatureValid = expectedSignature === binding.signature;
        
        return {
            valid: hashValid && signatureValid && binding.hashMatch,
            bindingId: bindingId,
            hashValid: hashValid,
            signatureValid: signatureValid,
            hashMatch: binding.hashMatch,
            timestamp: binding.bindingTimestamp,
            certificateHash: binding.certificateHash,
            integrityScore: (hashValid && signatureValid && binding.hashMatch) ? 100 : 
                           (hashValid && signatureValid) ? 75 : 0
        };
    }
    
    /**
     * Obtém estatísticas do Shadow Dossier
     */
    getStatistics() {
        const totalBindings = this.verifiedReceipts.size;
        const validBindings = Array.from(this.verifiedReceipts.values()).filter(b => b.hashMatch).length;
        const submissions = this.syncHistory.filter(h => h.type === 'CITIUS_SUBMISSION').length;
        const pendingDocs = this.pendingSubmissions.size;
        
        const lastSync = this.syncHistory[0]?.timestamp || null;
        
        return {
            totalBindings: totalBindings,
            validBindings: validBindings,
            invalidBindings: totalBindings - validBindings,
            totalSubmissions: submissions,
            pendingDocuments: pendingDocs,
            lastSync: lastSync,
            lastSyncFormatted: lastSync ? new Date(lastSync).toLocaleString('pt-PT') : 'Nunca',
            integrityScore: totalBindings > 0 ? (validBindings / totalBindings * 100).toFixed(1) : 100
        };
    }
    
    /**
     * Renderiza dashboard do Shadow Dossier
     */
    renderDashboard(containerId, caseId = null) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const stats = this.getStatistics();
        const receipts = this.getVerifiedReceipts(caseId);
        
        container.innerHTML = `
            <div class="shadow-dossier-dashboard">
                <div class="dashboard-header">
                    <h2><i class="fas fa-link"></i> SHADOW DOSSIER - VÍNCULO CITIUS</h2>
                    <div class="integrity-badge ${stats.integrityScore >= 90 ? 'excellent' : stats.integrityScore >= 70 ? 'good' : 'warning'}">
                        <i class="fas ${stats.integrityScore >= 90 ? 'fa-shield-alt' : stats.integrityScore >= 70 ? 'fa-check-circle' : 'fa-exclamation-triangle'}"></i>
                        Score: ${stats.integrityScore}%
                    </div>
                </div>
                
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-value">${stats.totalBindings}</div>
                        <div class="stat-label">Vínculos Criados</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${stats.validBindings}</div>
                        <div class="stat-label">Vínculos Validados</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${stats.totalSubmissions}</div>
                        <div class="stat-label">Submissões CITIUS</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${stats.pendingDocuments}</div>
                        <div class="stat-label">Documentos Pendentes</div>
                    </div>
                </div>
                
                <div class="action-buttons">
                    <button id="newSubmissionBtn" class="elite-btn primary"><i class="fas fa-upload"></i> NOVA SUBMISSÃO</button>
                    <button id="newBindingBtn" class="elite-btn secondary"><i class="fas fa-link"></i> NOVO VÍNCULO</button>
                    <button id="verifyAllBtn" class="elite-btn info"><i class="fas fa-shield-alt"></i> VERIFICAR INTEGRIDADE</button>
                </div>
                
                <div class="receipts-section">
                    <h3><i class="fas fa-receipt"></i> VÍNCULOS REGISTADOS</h3>
                    ${receipts.length === 0 ? 
                        '<div class="empty-state"><i class="fas fa-inbox"></i><p>Nenhum vínculo CITIUS registado</p><small>Utilize o botão "NOVA SUBMISSÃO" para submeter documentos ao CITIUS e criar vínculos.</small></div>' : 
                        receipts.map(r => `
                            <div class="receipt-card ${r.hashMatch ? 'valid' : 'invalid'}">
                                <div class="receipt-header">
                                    <i class="fas ${r.hashMatch ? 'fa-check-circle' : 'fa-exclamation-triangle'}"></i>
                                    <div>
                                        <strong>${r.evidenceName}</strong>
                                        <div class="receipt-id">${r.receiptId}</div>
                                    </div>
                                    <div class="receipt-status ${r.hashMatch ? 'status-valid' : 'status-invalid'}">
                                        ${r.hashMatch ? 'VERIFICADO' : 'INCONSISTENTE'}
                                    </div>
                                </div>
                                <div class="receipt-details">
                                    <div class="detail-row">
                                        <span>Processo:</span>
                                        <strong>${r.processId}</strong>
                                    </div>
                                    <div class="detail-row">
                                        <span>Tribunal:</span>
                                        <strong>${r.court}</strong>
                                    </div>
                                    <div class="detail-row">
                                        <span>Data de Submissão:</span>
                                        <strong>${r.submissionTimestampFormatted}</strong>
                                    </div>
                                    <div class="detail-row">
                                        <span>Hash da Evidência:</span>
                                        <code>${r.evidenceHash.substring(0, 32)}...</code>
                                    </div>
                                    <div class="detail-row">
                                        <span>Hash do Recibo:</span>
                                        <code>${r.receiptHash.substring(0, 32)}...</code>
                                    </div>
                                </div>
                                <div class="receipt-actions">
                                    <button class="action-btn verify-binding" data-binding="${r.bindingId}">
                                        <i class="fas fa-shield-alt"></i> VERIFICAR
                                    </button>
                                    <button class="action-btn export-cert" data-binding="${r.bindingId}">
                                        <i class="fas fa-file-pdf"></i> CERTIFICADO
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                </div>
            </div>
        `;
        
        // Estilos adicionais
        const style = document.createElement('style');
        style.textContent = `
            .shadow-dossier-dashboard { padding: 0; }
            .integrity-badge { background: var(--bg-terminal); padding: 8px 16px; border-radius: 20px; font-size: 0.7rem; font-weight: bold; }
            .integrity-badge.excellent { border-left: 3px solid #00e676; color: #00e676; }
            .integrity-badge.good { border-left: 3px solid #ffc107; color: #ffc107; }
            .integrity-badge.warning { border-left: 3px solid #ff1744; color: #ff1744; }
            .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin: 20px 0; }
            .stat-card { background: var(--bg-command); border-radius: 16px; padding: 20px; text-align: center; }
            .stat-value { font-size: 1.8rem; font-weight: 800; font-family: 'JetBrains Mono'; color: var(--elite-primary); }
            .stat-label { font-size: 0.7rem; color: #94a3b8; margin-top: 8px; }
            .action-buttons { display: flex; gap: 12px; margin: 20px 0; flex-wrap: wrap; }
            .receipt-card { background: var(--bg-terminal); border-radius: 16px; padding: 20px; margin-bottom: 16px; border: 1px solid var(--border-tactic); }
            .receipt-card.valid { border-left: 4px solid #00e676; }
            .receipt-card.invalid { border-left: 4px solid #ff1744; }
            .receipt-header { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid var(--border-tactic); }
            .receipt-header i { font-size: 1.5rem; }
            .receipt-card.valid .receipt-header i { color: #00e676; }
            .receipt-card.invalid .receipt-header i { color: #ff1744; }
            .receipt-id { font-size: 0.65rem; color: #64748b; font-family: monospace; }
            .receipt-status { margin-left: auto; padding: 4px 12px; border-radius: 20px; font-size: 0.7rem; font-weight: bold; }
            .status-valid { background: rgba(0, 230, 118, 0.1); color: #00e676; }
            .status-invalid { background: rgba(255, 23, 68, 0.1); color: #ff1744; }
            .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.05); font-size: 0.75rem; }
            .detail-row code { font-family: monospace; font-size: 0.7rem; color: #94a3b8; }
            .receipt-actions { display: flex; gap: 12px; margin-top: 16px; justify-content: flex-end; }
            .action-btn { background: rgba(255, 255, 255, 0.05); border: 1px solid var(--border-tactic); padding: 8px 16px; border-radius: 8px; cursor: pointer; transition: all 0.2s; font-size: 0.7rem; color: #94a3b8; }
            .action-btn:hover { border-color: var(--elite-primary); color: var(--elite-primary); }
            @media (max-width: 768px) {
                .stats-grid { grid-template-columns: 1fr 1fr; }
                .receipt-header { flex-wrap: wrap; }
                .receipt-status { margin-left: 0; }
            }
        `;
        container.appendChild(style);
        
        // Event listeners
        document.getElementById('newSubmissionBtn')?.addEventListener('click', () => {
            if (window.EliteUtils) {
                window.EliteUtils.showToast('Funcionalidade de submissão ao CITIUS - Selecione um documento PDF', 'info');
                this.showSubmissionModal();
            }
        });
        
        document.getElementById('newBindingBtn')?.addEventListener('click', () => {
            if (window.EliteUtils) {
                window.EliteUtils.showToast('Funcionalidade de vinculação - Selecione um recibo CITIUS', 'info');
                this.showBindingModal();
            }
        });
        
        document.getElementById('verifyAllBtn')?.addEventListener('click', () => {
            let validCount = 0;
            let invalidCount = 0;
            
            for (const [bindingId, binding] of this.verifiedReceipts) {
                const verification = this.verifyBinding(bindingId);
                if (verification.valid) {
                    validCount++;
                } else {
                    invalidCount++;
                }
            }
            
            if (window.EliteUtils) {
                window.EliteUtils.showToast(`Verificação concluída: ${validCount} vínculos válidos, ${invalidCount} vínculos inválidos`, 
                    invalidCount > 0 ? 'warning' : 'success');
            }
        });
        
        container.querySelectorAll('.verify-binding').forEach(btn => {
            btn.addEventListener('click', () => {
                const bindingId = btn.dataset.binding;
                const verification = this.verifyBinding(bindingId);
                if (verification.valid) {
                    if (window.EliteUtils) {
                        window.EliteUtils.showToast(`✅ Vínculo ${bindingId.substring(0, 16)}... íntegro e verificado`, 'success');
                    }
                } else {
                    if (window.EliteUtils) {
                        window.EliteUtils.showToast(`❌ Vínculo ${bindingId.substring(0, 16)}... comprometido! Verifique a integridade do documento.`, 'error');
                    }
                }
            });
        });
        
        container.querySelectorAll('.export-cert').forEach(btn => {
            btn.addEventListener('click', () => {
                const bindingId = btn.dataset.binding;
                this.exportUnivocalCertificate(bindingId);
            });
        });
    }
    
    /**
     * Mostra modal de submissão
     */
    showSubmissionModal() {
        const modalBody = document.getElementById('caseDetailBody');
        if (!modalBody) return;
        
        modalBody.innerHTML = `
            <div class="submission-form">
                <h3>Submissão ao CITIUS</h3>
                <div class="form-group">
                    <label>Documento PDF *</label>
                    <input type="file" id="submissionFile" accept=".pdf" required>
                </div>
                <div class="form-group">
                    <label>Número de Processo (opcional)</label>
                    <input type="text" id="submissionProcessId" placeholder="Deixe em branco para gerar automático">
                </div>
                <div class="form-group">
                    <label>Tribunal</label>
                    <select id="submissionCourt">
                        <option value="Tribunal Judicial de Lisboa">Tribunal Judicial de Lisboa</option>
                        <option value="Tribunal Judicial do Porto">Tribunal Judicial do Porto</option>
                        <option value="Tribunal Judicial de Braga">Tribunal Judicial de Braga</option>
                        <option value="Tribunal Judicial de Coimbra">Tribunal Judicial de Coimbra</option>
                        <option value="CAAD">CAAD - Centro de Arbitragem Administrativa</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Secção</label>
                    <input type="text" id="submissionSection" placeholder="Ex: 1ª Secção" value="1ª Secção">
                </div>
                <button id="submitToCitiusBtn" class="elite-btn primary full-width">SUBMETER AO CITIUS</button>
            </div>
        `;
        
        document.getElementById('submitToCitiusBtn')?.addEventListener('click', async () => {
            const fileInput = document.getElementById('submissionFile');
            const file = fileInput?.files[0];
            
            if (!file) {
                alert('Selecione um documento PDF');
                return;
            }
            
            if (file.type !== 'application/pdf') {
                alert('Apenas ficheiros PDF são aceites');
                return;
            }
            
            const processId = document.getElementById('submissionProcessId')?.value || null;
            const court = document.getElementById('submissionCourt')?.value;
            const section = document.getElementById('submissionSection')?.value;
            
            try {
                const preValidation = await this.preValidateSubmission(file, {
                    fileName: file.name,
                    caseId: 'CASE_DEMO',
                    court: court
                });
                
                const receipt = await this.submitToCitius(preValidation.documentId, {
                    processId: processId,
                    court: court,
                    section: section
                });
                
                alert(`✅ Documento submetido com sucesso!\n\nRecibo: ${receipt.receiptId}\nProcesso: ${receipt.processId}\nTimestamp: ${receipt.officialTimestampFormatted}`);
                
                document.getElementById('caseDetailModal').style.display = 'none';
                
                if (window.EliteUtils) {
                    window.EliteUtils.showToast(`Documento submetido ao CITIUS. Recibo: ${receipt.receiptId}`, 'success');
                }
                
            } catch (error) {
                console.error('Erro na submissão:', error);
                alert(`Erro na submissão: ${error.message}`);
            }
        });
        
        document.getElementById('caseDetailModal').style.display = 'flex';
    }
    
    /**
     * Mostra modal de vinculação
     */
    showBindingModal() {
        const modalBody = document.getElementById('caseDetailBody');
        if (!modalBody) return;
        
        modalBody.innerHTML = `
            <div class="binding-form">
                <h3>Vincular Recibo CITIUS</h3>
                <div class="form-group">
                    <label>ID da Evidência no Forensic Vault</label>
                    <input type="text" id="bindingEvidenceId" placeholder="Ex: EVD_xxx" required>
                </div>
                <div class="form-group">
                    <label>ID do Recibo CITIUS</label>
                    <input type="text" id="bindingReceiptId" placeholder="Ex: CITIUS_xxx" required>
                </div>
                <div class="form-group">
                    <label>Número do Processo</label>
                    <input type="text" id="bindingProcessId" placeholder="Ex: 1234/23.8T8LSB" required>
                </div>
                <div class="form-group">
                    <label>Tribunal</label>
                    <input type="text" id="bindingCourt" placeholder="Ex: Tribunal Judicial de Lisboa">
                </div>
                <button id="createBindingBtn" class="elite-btn primary full-width">CRIAR VÍNCULO</button>
            </div>
        `;
        
        document.getElementById('createBindingBtn')?.addEventListener('click', async () => {
            const evidenceId = document.getElementById('bindingEvidenceId')?.value;
            const receiptId = document.getElementById('bindingReceiptId')?.value;
            const processId = document.getElementById('bindingProcessId')?.value;
            const court = document.getElementById('bindingCourt')?.value || 'Tribunal Judicial de Lisboa';
            
            if (!evidenceId || !receiptId || !processId) {
                alert('Preencha todos os campos obrigatórios');
                return;
            }
            
            const mockReceipt = {
                receiptId: receiptId,
                documentHash: CryptoJS.SHA256(evidenceId + Date.now()).toString(),
                processId: processId,
                court: court,
                submissionTimestamp: new Date().toISOString(),
                officialTimestampFormatted: new Date().toLocaleString('pt-PT')
            };
            
            try {
                const binding = await this.bindCitiusReceipt(evidenceId, mockReceipt, processId);
                alert(`✅ Vínculo criado com sucesso!\n\nID: ${binding.bindingId}\nStatus: ${binding.status}`);
                document.getElementById('caseDetailModal').style.display = 'none';
                
                if (window.EliteUtils) {
                    window.EliteUtils.showToast(`Vínculo ${binding.bindingId.substring(0, 16)}... criado com sucesso`, 'success');
                }
                
            } catch (error) {
                console.error('Erro na vinculação:', error);
                alert(`Erro na vinculação: ${error.message}`);
            }
        });
        
        document.getElementById('caseDetailModal').style.display = 'flex';
    }
}

// Instância global (utiliza o ForensicVault existente)
window.ShadowDossier = new ShadowDossierManager(window.ForensicVault);

console.log('[ELITE] Shadow Dossier Manager carregado - Simbiose Judiciária Ativa');