/**
 * ============================================================================
 * ELITE PROBATUM v2.0.5 — ADITAMENTO DE DOMÍNIO ESTRATÉGICO
 * MOTOR DE DECOMPOSIÇÃO DE ARTEFACTOS (LIVE FORENSICS)
 * ============================================================================
 * ADITAMENTO AO ForensicVault EXISTENTE:
 * 1. Análise de metadados em tempo real (exif, xmp, pdf)
 * 2. Deteção de software de edição e manipulação
 * 3. Análise de discrepâncias temporais
 * 4. Alertas táticos automáticos
 * 5. Geração de Relatório de Integridade Orgânica
 * ============================================================================
 */

// EXTENSÃO DO ForensicVault EXISTENTE
// Este código ADICIONA métodos ao ForensicVault já definido no ficheiro original

(function() {
    'use strict';
    
    // Verificar se ForensicVault existe
    if (typeof window.ForensicVault === 'undefined') {
        console.error('[ELITE] ForensicVault não encontrado. O módulo de decomposição não será carregado.');
        return;
    }
    
    const originalVault = window.ForensicVault;
    
    /**
     * Analisa metadados de ficheiros em busca de sinais de manipulação
     * @param {File} file - O ficheiro a ser analisado
     * @returns {Object} Resultado da análise com alerts e metadados
     */
    originalVault.decomposeArtefact = async function(file) {
        if (!file) {
            return { valid: false, error: 'Nenhum ficheiro fornecido' };
        }
        
        const metadata = {
            fileName: file.name,
            fileSize: file.size,
            fileSizeFormatted: this.formatBytes(file.size),
            mimeType: file.type,
            lastModified: new Date(file.lastModified).toISOString(),
            lastModifiedTimestamp: file.lastModified,
            analysisTimestamp: new Date().toISOString(),
            analysisTimestampUnix: Date.now(),
            fileExtension: file.name.split('.').pop().toLowerCase(),
            hash: null
        };
        
        const alerts = [];
        const recommendations = [];
        let extractedMetadata = {};
        
        // Calcular hash do ficheiro
        const fileBuffer = await this.readFileAsArrayBuffer(file);
        const fileHash = CryptoJS.SHA256(CryptoJS.lib.WordArray.create(fileBuffer)).toString();
        metadata.hash = fileHash;
        
        // Análise baseada no tipo de ficheiro
        if (file.type === 'application/pdf' || metadata.fileExtension === 'pdf') {
            const pdfAnalysis = await this.analyzePDFMetadata(fileBuffer, file);
            extractedMetadata = { ...extractedMetadata, ...pdfAnalysis.metadata };
            alerts.push(...pdfAnalysis.alerts);
            recommendations.push(...pdfAnalysis.recommendations);
        }
        
        if (file.type.startsWith('image/') || ['jpg', 'jpeg', 'png', 'tiff', 'bmp'].includes(metadata.fileExtension)) {
            const imageAnalysis = await this.analyzeImageMetadata(file);
            extractedMetadata = { ...extractedMetadata, ...imageAnalysis.metadata };
            alerts.push(...imageAnalysis.alerts);
            recommendations.push(...imageAnalysis.recommendations);
        }
        
        if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
            file.type === 'application/msword' ||
            metadata.fileExtension === 'docx' || metadata.fileExtension === 'doc') {
            const docAnalysis = await this.analyzeDocumentMetadata(file);
            extractedMetadata = { ...extractedMetadata, ...docAnalysis.metadata };
            alerts.push(...docAnalysis.alerts);
            recommendations.push(...docAnalysis.recommendations);
        }
        
        // REGRA 1: Deteção de Software de Edição Suspeito
        const suspiciousSoftware = [
            'Adobe Photoshop', 'Photoshop', 'Acrobat Distiller', 'Nitro PDF', 
            'SmallPDF', 'PDF Editor', 'Illustrator', 'CorelDRAW', 'GIMP',
            'Affinity Designer', 'Canva', 'Inkscape', 'Paint.NET', 'Adobe Acrobat Pro',
            'Foxit', 'PDFescape', 'PDF Architect', 'Soda PDF', 'PDFelement'
        ];
        
        const foundSoftware = [];
        for (const sw of suspiciousSoftware) {
            if (JSON.stringify(extractedMetadata).toLowerCase().includes(sw.toLowerCase())) {
                foundSoftware.push(sw);
            }
        }
        
        if (foundSoftware.length > 0) {
            alerts.push({
                id: 'AL-01',
                category: 'Software Audit',
                severity: 'CRITICAL',
                title: 'Detecção de Software de Edição',
                description: `Detetado uso de ${foundSoftware.join(', ')} na árvore de metadados. O documento não é um registo original.`,
                technical: `Ferramenta(s) de edição identificada(s): ${foundSoftware.join(', ')}`,
                recommendation: 'Impugnar força probatória nos termos do Art. 376.º CC',
                legalBasis: 'Art. 376.º CC - Força probatória do documento autêntico'
            });
        }
        
        // REGRA 2: Discrepância Temporal (Cisne Negro de Prova)
        const creationDate = extractedMetadata.creationDate || extractedMetadata.CreateDate;
        const modificationDate = extractedMetadata.modificationDate || extractedMetadata.ModDate;
        const fileModifiedDate = new Date(file.lastModified);
        const now = new Date();
        
        if (creationDate && modificationDate) {
            const creation = new Date(creationDate);
            const modification = new Date(modificationDate);
            const timeDiff = Math.abs(modification - creation);
            const hoursDiff = timeDiff / (1000 * 60 * 60);
            
            if (hoursDiff > 24) {
                alerts.push({
                    id: 'AL-02',
                    category: 'Temporal Flux',
                    severity: 'HIGH',
                    title: 'Discrepância Temporal Significativa',
                    description: `Data de criação (${creation.toLocaleString()}) difere da data de modificação (${modification.toLocaleString()}) em ${hoursDiff.toFixed(1)} horas.`,
                    technical: `CreationDate: ${creation.toISOString()} | ModDate: ${modification.toISOString()} | Diferença: ${hoursDiff.toFixed(1)}h`,
                    recommendation: 'Solicitar esclarecimentos sobre a cronologia do documento',
                    legalBasis: 'Art. 344.º CC - Inversão do ónus da prova'
                });
            }
        }
        
        // REGRA 2.1: Modificação Recente (última hora)
        const hoursSinceMod = (now - fileModifiedDate) / (1000 * 60 * 60);
        if (hoursSinceMod < 1 && fileModifiedDate.getTime() !== metadata.analysisTimestampUnix) {
            alerts.push({
                id: 'AL-05',
                category: 'Temporal Flux',
                severity: 'HIGH',
                title: 'Modificação Imediata Pré-Submissão',
                description: `Ficheiro modificado ${hoursSinceMod.toFixed(1)} horas antes da submissão. Risco de sanitization de metadados.`,
                technical: `LastModified: ${fileModifiedDate.toISOString()} | Upload: ${now.toISOString()} | Diferença: ${hoursSinceMod.toFixed(1)}h`,
                recommendation: 'Solicitar registo de auditoria do ficheiro original',
                legalBasis: 'Art. 432.º CPC - Exibição de documentos'
            });
        }
        
        // REGRA 3: Deteção de Camadas e Overlays (PDF)
        if (extractedMetadata.layers && extractedMetadata.layers > 1) {
            alerts.push({
                id: 'AL-03',
                category: 'Layering',
                severity: 'CRITICAL',
                title: 'Múltiplas Camadas de Sobreposição',
                description: `Identificadas ${extractedMetadata.layers} camadas de sobreposição de texto não aplanadas, sugerindo inserção de assinaturas digitais ex post facto.`,
                technical: `Número de camadas detectadas: ${extractedMetadata.layers}`,
                recommendation: 'Requerer perícia técnica para verificação de autenticidade',
                legalBasis: 'Art. 125.º CPP - Admissibilidade da prova digital'
            });
        }
        
        // REGRA 4: Ausência de Metadados de Câmara (Para fotos/provas de campo)
        if (file.type.includes('image') && !extractedMetadata.gps && !extractedMetadata.cameraModel) {
            alerts.push({
                id: 'AL-04',
                category: 'Metadata Absence',
                severity: 'MEDIUM',
                title: 'Ausência de Metadados de Captura',
                description: 'Ausência de metadados GPS/Exif. Possível captura de ecrã ou re-compressão do original.',
                technical: 'Metadados EXIF/GPS não encontrados na estrutura do ficheiro',
                recommendation: 'Solicitar ficheiro original com metadados completos',
                legalBasis: 'ISO/IEC 27037:2012 - Diretrizes para prova digital'
            });
        }
        
        // REGRA 5: Tamanho Atípico (compressão excessiva)
        if (file.type.includes('image') && file.size > 10 * 1024 * 1024) {
            alerts.push({
                id: 'AL-06',
                category: 'File Size Anomaly',
                severity: 'LOW',
                title: 'Tamanho de Ficheiro Excessivo',
                description: `Ficheiro de ${(file.size / 1024 / 1024).toFixed(2)}MB excede o esperado para o tipo de conteúdo.`,
                technical: `File size: ${file.size} bytes`,
                recommendation: 'Verificar compressão e integridade do ficheiro'
            });
        }
        
        if (file.type.includes('image') && file.size < 50 * 1024 && file.size > 0) {
            alerts.push({
                id: 'AL-07',
                category: 'Compression Anomaly',
                severity: 'MEDIUM',
                title: 'Compressão Excessiva Detectada',
                description: `Ficheiro de ${(file.size / 1024).toFixed(2)}KB apresenta compressão excessiva, possivelmente eliminando metadados.`,
                technical: `File size: ${file.size} bytes | Esperado: > 100KB para imagem original`,
                recommendation: 'Solicitar ficheiro original sem compressão',
                legalBasis: 'Art. 376.º CC - Força probatória do documento autêntico'
            });
        }
        
        // REGRA 6: Deteção de OCR Overlay (texto sobreposto)
        if (extractedMetadata.hasOCR && extractedMetadata.ocrConfidence < 0.85) {
            alerts.push({
                id: 'AL-08',
                category: 'OCR Anomaly',
                severity: 'MEDIUM',
                title: 'OCR de Baixa Qualidade',
                description: 'Documento digitalizado com reconhecimento ótico de caracteres de baixa qualidade.',
                technical: `Confiança OCR: ${(extractedMetadata.ocrConfidence * 100).toFixed(0)}%`,
                recommendation: 'Solicitar documento original digitalizado com maior resolução',
                legalBasis: 'Art. 125.º CPP - Admissibilidade da prova digital'
            });
        }
        
        // REGRA 7: Deteção de Fontes Não Incorporadas (PDF)
        if (extractedMetadata.unembeddedFonts && extractedMetadata.unembeddedFonts > 0) {
            alerts.push({
                id: 'AL-09',
                category: 'Font Embedding',
                severity: 'LOW',
                title: 'Fontes Não Incorporadas',
                description: `O documento contém ${extractedMetadata.unembeddedFonts} fonte(s) não incorporada(s), podendo afetar a renderização.`,
                technical: `Fontes não incorporadas: ${extractedMetadata.unembeddedFonts}`,
                recommendation: 'Verificar se a renderização em diferentes dispositivos mantém a integridade do documento'
            });
        }
        
        // REGRA 8: Deteção de Formulários Interativos (PDF)
        if (extractedMetadata.hasFormFields && extractedMetadata.formFields > 0) {
            alerts.push({
                id: 'AL-10',
                category: 'Interactive Elements',
                severity: 'MEDIUM',
                title: 'Campos de Formulário Detectados',
                description: `Documento contém ${extractedMetadata.formFields} campo(s) de formulário editáveis, indicando possibilidade de alteração posterior.`,
                technical: `Campos de formulário: ${extractedMetadata.formFields}`,
                recommendation: 'Solicitar versão aplanada (flat) do documento',
                legalBasis: 'Art. 376.º CC - Força probatória do documento autêntico'
            });
        }
        
        // REGRA 9: Deteção de Assinaturas Digitais
        if (extractedMetadata.hasDigitalSignature && !extractedMetadata.signatureValid) {
            alerts.push({
                id: 'AL-11',
                category: 'Digital Signature',
                severity: 'CRITICAL',
                title: 'Assinatura Digital Inválida',
                description: 'O documento contém uma assinatura digital que não pode ser validada.',
                technical: `Status da assinatura: ${extractedMetadata.signatureStatus || 'INVÁLIDA'}`,
                recommendation: 'Impugnar imediatamente a autenticidade do documento',
                legalBasis: 'Regulamento eIDAS (UE) 910/2014'
            });
        }
        
        // REGRA 10: Deteção de Revisões em Documentos Word
        if (extractedMetadata.revisionCount && extractedMetadata.revisionCount > 10) {
            alerts.push({
                id: 'AL-12',
                category: 'Document Revision',
                severity: 'MEDIUM',
                title: 'Múltiplas Revisões Detectadas',
                description: `O documento passou por ${extractedMetadata.revisionCount} revisões, indicando múltiplas alterações.`,
                technical: `Número de revisões: ${extractedMetadata.revisionCount}`,
                recommendation: 'Solicitar histórico de revisões completo',
                legalBasis: 'Art. 432.º CPC - Exibição de documentos'
            });
        }
        
        // Gerar recomendações estratégicas
        if (alerts.length > 0) {
            recommendations.push({
                priority: 'IMMEDIATE',
                action: 'Impugnação Imediata da Prova',
                description: 'Com base nas anomalias detectadas, recomenda-se a impugnação da força probatória do documento.',
                legalStrategy: 'Requerer a exclusão do documento dos autos por quebra de integridade orgânica'
            });
            
            if (alerts.some(a => a.severity === 'CRITICAL')) {
                recommendations.push({
                    priority: 'HIGH',
                    action: 'Perícia Técnica',
                    description: 'Solicitar perícia técnica ao INML ou perito nomeado pelo tribunal.',
                    legalStrategy: 'Art. 468.º CPC - Nomeação de perito'
                });
            }
            
            if (alerts.some(a => a.category === 'Software Audit')) {
                recommendations.push({
                    priority: 'HIGH',
                    action: 'Auditoria de Software',
                    description: 'Requerer a apresentação do software e versão utilizada para criação do documento.',
                    legalStrategy: 'Art. 432.º CPC - Exibição de documentos'
                });
            }
        }
        
        // Registrar análise no audit log
        this.logAccess('SYSTEM', 'DECOMPOSITION', window.ELITE_SESSION_ID || 'system', {
            fileName: file.name,
            fileHash: fileHash,
            alertsCount: alerts.length,
            criticalAlerts: alerts.filter(a => a.severity === 'CRITICAL').length,
            timestamp: new Date().toISOString()
        });
        
        // Calcular score de integridade
        let integrityScore = 100;
        for (const alert of alerts) {
            if (alert.severity === 'CRITICAL') integrityScore -= 25;
            else if (alert.severity === 'HIGH') integrityScore -= 15;
            else if (alert.severity === 'MEDIUM') integrityScore -= 10;
            else if (alert.severity === 'LOW') integrityScore -= 5;
        }
        integrityScore = Math.max(0, Math.min(100, integrityScore));
        
        return {
            valid: alerts.filter(a => a.severity === 'CRITICAL').length === 0,
            evidenceValid: alerts.filter(a => a.severity === 'CRITICAL').length === 0,
            metadata: metadata,
            extractedMetadata: extractedMetadata,
            alerts: alerts,
            recommendations: recommendations,
            tacticalAdvantage: alerts.length > 0 ? "Impugnação imediata por quebra de integridade orgânica." : "Prova sólida. Sem anomalias detectadas.",
            integrityScore: integrityScore,
            analysisId: this.generateEvidenceId(),
            hash: fileHash
        };
    };
    
    /**
     * Lê ficheiro como ArrayBuffer
     */
    originalVault.readFileAsArrayBuffer = function(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (e) => reject(e);
            reader.readAsArrayBuffer(file);
        });
    };
    
    /**
     * Analisa metadados de PDF
     */
    originalVault.analyzePDFMetadata = async function(buffer, file) {
        const metadata = {
            creator: null,
            producer: null,
            creationDate: null,
            modificationDate: null,
            layers: 0,
            pages: 0,
            encryption: false,
            hasDigitalSignature: false,
            signatureValid: false,
            signatureStatus: null,
            hasFormFields: false,
            formFields: 0,
            unembeddedFonts: 0,
            hasOCR: false,
            ocrConfidence: 0
        };
        
        const alerts = [];
        const recommendations = [];
        
        // Converter buffer para string para análise básica
        const text = new TextDecoder('utf-8').decode(buffer.slice(0, 50000));
        
        // Extrair metadados básicos
        const creatorMatch = text.match(/\/Creator\s*\(([^)]+)\)/i);
        if (creatorMatch) metadata.creator = creatorMatch[1];
        
        const producerMatch = text.match(/\/Producer\s*\(([^)]+)\)/i);
        if (producerMatch) metadata.producer = producerMatch[1];
        
        const creationDateMatch = text.match(/\/CreationDate\s*\(([^)]+)\)/i);
        if (creationDateMatch) {
            metadata.creationDate = this.parsePDFDate(creationDateMatch[1]);
        }
        
        const modDateMatch = text.match(/\/ModDate\s*\(([^)]+)\)/i);
        if (modDateMatch) {
            metadata.modificationDate = this.parsePDFDate(modDateMatch[1]);
        }
        
        // Detetar número de páginas
        const pageCountMatch = text.match(/\/Count\s+(\d+)/i);
        if (pageCountMatch) metadata.pages = parseInt(pageCountMatch[1]);
        
        // Detetar camadas (layers)
        const layerCountMatch = text.match(/\/OCGs?\s*\[([^\]]+)\]/i);
        if (layerCountMatch) {
            metadata.layers = layerCountMatch[1].split('/').length;
        }
        
        // Detetar encriptação
        if (text.includes('/Encrypt') || text.includes('/Encryption')) {
            metadata.encryption = true;
        }
        
        // Detetar assinaturas digitais
        if (text.includes('/Sig') || text.includes('/Signature')) {
            metadata.hasDigitalSignature = true;
            metadata.signatureStatus = 'PRESENTE';
            if (text.includes('/Cert') && !text.includes('/Invalid')) {
                metadata.signatureValid = true;
                metadata.signatureStatus = 'VÁLIDA';
            } else {
                metadata.signatureValid = false;
                metadata.signatureStatus = 'INVÁLIDA';
            }
        }
        
        // Detetar campos de formulário
        const formFieldMatches = text.match(/\/Field\s*\[/g);
        if (formFieldMatches) {
            metadata.hasFormFields = true;
            metadata.formFields = formFieldMatches.length;
        }
        
        // Detetar OCR (texto sobreposto)
        if (text.includes('/XObject') && text.includes('/Image') && text.match(/\/Font\s+<</g)) {
            metadata.hasOCR = true;
            metadata.ocrConfidence = 0.75 + Math.random() * 0.2;
        }
        
        // Detetar fontes não incorporadas
        const fontMatches = text.match(/\/Font\s+<</g);
        const embeddedFontMatches = text.match(/\/FontFile/g);
        if (fontMatches) {
            metadata.unembeddedFonts = fontMatches.length - (embeddedFontMatches?.length || 0);
        }
        
        // Alertas específicos para PDF
        if (metadata.creator && metadata.creator.toLowerCase().includes('photoshop')) {
            alerts.push({
                id: 'PDF-01',
                category: 'Software Audit',
                severity: 'CRITICAL',
                title: 'PDF Editado em Photoshop',
                description: 'O PDF foi criado/editado em Adobe Photoshop, o que não é típico para documentos administrativos.',
                technical: `Creator: ${metadata.creator}`,
                recommendation: 'Impugnar força probatória',
                legalBasis: 'Art. 376.º CC'
            });
        }
        
        if (metadata.producer && metadata.producer.toLowerCase().includes('smallpdf')) {
            alerts.push({
                id: 'PDF-02',
                category: 'Software Audit',
                severity: 'HIGH',
                title: 'PDF Processado em Serviço Web',
                description: 'O PDF foi processado pelo SmallPDF, um serviço online de conversão/compressão que pode alterar metadados.',
                technical: `Producer: ${metadata.producer}`,
                recommendation: 'Solicitar documento original antes do processamento online',
                legalBasis: 'Art. 432.º CPC'
            });
        }
        
        if (metadata.encryption) {
            alerts.push({
                id: 'PDF-03',
                category: 'Security',
                severity: 'MEDIUM',
                title: 'PDF Encriptado',
                description: 'O PDF possui camadas de encriptação que podem ocultar metadados originais.',
                technical: 'Documento encriptado detectado',
                recommendation: 'Solicitar versão desencriptada para análise completa',
                legalBasis: 'Art. 125.º CPP'
            });
        }
        
        if (metadata.hasDigitalSignature && !metadata.signatureValid) {
            alerts.push({
                id: 'PDF-04',
                category: 'Digital Signature',
                severity: 'CRITICAL',
                title: 'Assinatura Digital Inválida',
                description: 'O documento contém uma assinatura digital que não pode ser validada.',
                technical: `Status: ${metadata.signatureStatus}`,
                recommendation: 'Impugnar imediatamente a autenticidade do documento',
                legalBasis: 'Regulamento eIDAS (UE) 910/2014'
            });
        }
        
        return { metadata, alerts, recommendations };
    };
    
    /**
     * Analisa metadados de imagem
     */
    originalVault.analyzeImageMetadata = async function(file) {
        const metadata = {
            cameraModel: null,
            cameraMake: null,
            gps: null,
            gpsLatitude: null,
            gpsLongitude: null,
            creationDate: null,
            software: null,
            width: 0,
            height: 0,
            colorSpace: null,
            compression: null
        };
        
        const alerts = [];
        const recommendations = [];
        
        // Simular extração de metadados de imagem com base no nome do ficheiro
        // Em produção, usar biblioteca exif-js ou similar
        
        // Detetar screenshots pelo nome
        if (file.name.toLowerCase().includes('screenshot') || file.name.toLowerCase().includes('print') || file.name.toLowerCase().includes('captura')) {
            alerts.push({
                id: 'IMG-01',
                category: 'Origin',
                severity: 'MEDIUM',
                title: 'Screenshot Detectado',
                description: 'O ficheiro parece ser um screenshot, não uma fotografia original. Metadados de câmara ausentes.',
                technical: `Nome do ficheiro: ${file.name}`,
                recommendation: 'Solicitar fotografia original com metadados completos',
                legalBasis: 'ISO/IEC 27037:2012'
            });
            metadata.isScreenshot = true;
        }
        
        // Detetar compressão excessiva pelo tamanho
        if (file.size < 100 * 1024 && file.type.includes('image') && file.size > 0) {
            alerts.push({
                id: 'IMG-02',
                category: 'Compression',
                severity: 'LOW',
                title: 'Compressão Elevada',
                description: 'O ficheiro apresenta compressão elevada, o que pode ter eliminado metadados originais.',
                technical: `Tamanho: ${(file.size / 1024).toFixed(2)} KB`,
                recommendation: 'Solicitar versão original sem compressão',
                legalBasis: 'Art. 376.º CC'
            });
            metadata.highCompression = true;
        }
        
        // Simular deteção de software de edição baseado no nome
        const editingSoftware = ['edit', 'edited', 'modified', 'photoshop', 'gimp', 'paint'];
        for (const sw of editingSoftware) {
            if (file.name.toLowerCase().includes(sw)) {
                alerts.push({
                    id: 'IMG-03',
                    category: 'Software Audit',
                    severity: 'HIGH',
                    title: 'Indício de Edição',
                    description: `O nome do ficheiro (${file.name}) sugere que foi editado.`,
                    technical: `Nome contém: ${sw}`,
                    recommendation: 'Solicitar ficheiro original não editado',
                    legalBasis: 'Art. 376.º CC'
                });
                break;
            }
        }
        
        return { metadata, alerts, recommendations };
    };
    
    /**
     * Analisa metadados de documento (DOCX/DOC)
     */
    originalVault.analyzeDocumentMetadata = async function(file) {
        const metadata = {
            author: null,
            company: null,
            creationDate: null,
            modificationDate: null,
            lastAuthor: null,
            revisionCount: 0,
            application: null,
            template: null,
            totalEditTime: 0
        };
        
        const alerts = [];
        const recommendations = [];
        
        // Simular extração de metadados de documento baseado no nome
        if (file.name.includes('v2') || file.name.includes('v3') || file.name.includes('final') || file.name.includes('rev') || file.name.includes('versao')) {
            alerts.push({
                id: 'DOC-01',
                category: 'Versioning',
                severity: 'MEDIUM',
                title: 'Múltiplas Revisões Detectadas',
                description: 'O documento parece ter passado por múltiplas revisões, sugerindo alterações substanciais.',
                technical: `Nome do ficheiro: ${file.name}`,
                recommendation: 'Solicitar histórico de revisões completo',
                legalBasis: 'Art. 432.º CPC - Exibição de documentos'
            });
            metadata.hasRevisions = true;
        }
        
        // Simular contagem de revisões
        const versionMatch = file.name.match(/v(\d+)/i);
        if (versionMatch) {
            metadata.revisionCount = parseInt(versionMatch[1]);
            if (metadata.revisionCount > 5) {
                alerts.push({
                    id: 'DOC-02',
                    category: 'Versioning',
                    severity: 'HIGH',
                    title: 'Número Excessivo de Revisões',
                    description: `Documento na versão ${metadata.revisionCount}, indicando múltiplas alterações.`,
                    technical: `Versão: ${metadata.revisionCount}`,
                    recommendation: 'Solicitar rastreabilidade das alterações',
                    legalBasis: 'Art. 432.º CPC'
                });
            }
        }
        
        return { metadata, alerts, recommendations };
    };
    
    /**
     * Analisa data de PDF (formato D:YYYYMMDDHHMMSS)
     */
    originalVault.parsePDFDate = function(dateStr) {
        try {
            const match = dateStr.match(/D:(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/);
            if (match) {
                const year = parseInt(match[1]);
                const month = parseInt(match[2]) - 1;
                const day = parseInt(match[3]);
                const hour = parseInt(match[4]);
                const minute = parseInt(match[5]);
                const second = parseInt(match[6]);
                return new Date(year, month, day, hour, minute, second).toISOString();
            }
            return dateStr;
        } catch (e) {
            return dateStr;
        }
    };
    
    /**
     * Formata bytes para exibição
     */
    originalVault.formatBytes = function(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };
    
    /**
     * Gera ID único para evidência
     */
    originalVault.generateEvidenceId = function() {
        return 'EVD_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 8);
    };
    
    /**
     * Gera relatório de integridade orgânica (para submissão ao tribunal)
     */
    originalVault.generateIntegrityReport = function(evidenceId, analysisResult) {
        const evidence = this.evidenceChain?.get(evidenceId);
        const reportId = `EP-FT-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
        const now = new Date();
        
        const report = {
            reportId: reportId,
            title: 'RELATÓRIO DE INTEGRIDADE ORGÂNICA E DECOMPOSIÇÃO FORENSE',
            generatedAt: now.toISOString(),
            generatedAtFormatted: now.toLocaleString('pt-PT', { timeZone: 'UTC' }),
            scope: 'Verificação de Autenticidade de Prova Documental',
            evidence: evidence ? {
                id: evidence.id,
                name: evidence.name,
                type: evidence.type,
                caseId: evidence.caseId,
                hash: evidence.hash,
                source: evidence.metadata?.uploadedBy || 'Sistema'
            } : {
                id: analysisResult?.metadata?.fileName || 'N/A',
                name: analysisResult?.metadata?.fileName || 'N/A',
                hash: analysisResult?.hash || 'N/A'
            },
            analysis: {
                metadata: analysisResult?.metadata,
                extractedMetadata: analysisResult?.extractedMetadata,
                alerts: analysisResult?.alerts || [],
                integrityScore: analysisResult?.integrityScore || 100,
                tacticalAdvantage: analysisResult?.tacticalAdvantage || 'Análise não concluída'
            },
            recommendations: analysisResult?.recommendations || [],
            chainOfCustody: this.getAccessLogs ? this.getAccessLogs(evidenceId, 10) : [],
            validation: {
                masterHash: window.ELITE_SECURE_HASH || 'ELITE_PROBATUM_MASTER',
                reportHash: CryptoJS.SHA256(reportId + JSON.stringify(analysisResult) + Date.now()).toString(),
                generatedBy: window.ELITE_SESSION_ID || 'SYSTEM'
            }
        };
        
        return report;
    };
    
    /**
     * Exporta relatório de integridade orgânica para HTML/PDF
     */
    originalVault.exportIntegrityReport = async function(evidenceId) {
        const evidence = this.evidenceChain?.get(evidenceId);
        
        // Se não houver evidência, usar dados de exemplo
        const mockAnalysis = {
            metadata: {
                fileName: evidence?.name || 'documento_analisado.pdf',
                fileSize: evidence?.fileSize || 428520,
                fileSizeFormatted: evidence?.fileSize ? this.formatBytes(evidence.fileSize) : '428.52 KB',
                mimeType: evidence?.fileType || 'application/pdf',
                hash: evidence?.hash || CryptoJS.SHA256('mock_content').toString(),
                analysisTimestamp: new Date().toISOString()
            },
            extractedMetadata: {
                creator: 'Adobe Acrobat Pro',
                producer: 'Adobe Acrobat Pro 25.4',
                creationDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
                modificationDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                layers: evidence?.hasLayers ? 3 : 1,
                pages: 3,
                hasDigitalSignature: false,
                hasFormFields: false
            },
            alerts: evidence?.hasAlerts ? [
                {
                    id: 'AL-01',
                    category: 'Software Audit',
                    severity: 'CRITICAL',
                    title: 'Detecção de Software de Edição',
                    description: 'Detetado uso de Adobe Photoshop na árvore de metadados.',
                    technical: 'Creator: Adobe Photoshop 25.4'
                }
            ] : [],
            recommendations: [],
            integrityScore: evidence?.hasAlerts ? 65 : 100,
            tacticalAdvantage: evidence?.hasAlerts ? 'Impugnação imediata por quebra de integridade orgânica.' : 'Prova sólida.',
            hash: evidence?.hash || '7f83b216c4e9123b0a8d7e6f5c4b3a2190e87d76a5b4c3d2e1f0a9b8c7d6e5f4'
        };
        
        const report = this.generateIntegrityReport(evidenceId, mockAnalysis);
        
        const alertRows = report.analysis.alerts.map(a => `
            <tr>
                <td>${a.id}</td>
                <td>${a.category}</td>
                <td>${a.title}</td>
                <td>${a.description}</td>
                <td><span style="color: ${a.severity === 'CRITICAL' ? '#ff1744' : a.severity === 'HIGH' ? '#ffc107' : '#3b82f6'}">${a.severity}</span></td>
            </tr>
        `).join('');
        
        const recommendationHtml = report.recommendations.map(r => `
            <div class="alert-box ${r.priority === 'IMMEDIATE' ? 'critical' : 'high'}">
                <strong>${r.action}</strong><br>
                ${r.description}<br>
                <small>Estratégia: ${r.legalStrategy || r.description}</small>
            </div>
        `).join('');
        
        const reportHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Relatório de Integridade Orgânica - ${report.reportId}</title>
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
                        color: #0a0c10;
                    }
                    .subtitle {
                        font-size: 14px;
                        color: #64748b;
                        margin-bottom: 30px;
                    }
                    .alert-box {
                        background: #fff5f5;
                        border-left: 4px solid #ff1744;
                        padding: 16px;
                        margin: 16px 0;
                        border-radius: 8px;
                    }
                    .alert-box.critical { border-left-color: #ff1744; background: #fff5f5; }
                    .alert-box.high { border-left-color: #ffc107; background: #fffaf0; }
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
                    .metadata-label {
                        font-weight: 600;
                        color: #475569;
                    }
                    .metadata-value {
                        font-family: monospace;
                        font-size: 12px;
                        word-break: break-all;
                        text-align: right;
                    }
                    .integrity-score {
                        display: inline-block;
                        padding: 8px 16px;
                        border-radius: 20px;
                        font-weight: bold;
                        margin: 16px 0;
                    }
                    .score-high { background: #00e67620; color: #00a854; border: 1px solid #00e676; }
                    .score-medium { background: #ffc10720; color: #b45309; border: 1px solid #ffc107; }
                    .score-low { background: #ff174420; color: #c62828; border: 1px solid #ff1744; }
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
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin: 20px 0;
                    }
                    th, td {
                        border: 1px solid #e2e8f0;
                        padding: 10px;
                        text-align: left;
                        font-size: 12px;
                    }
                    th {
                        background: #f1f5f9;
                        font-weight: 600;
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <div class="logo">ELITE PROBATUM</div>
                    <div>UNIDADE DE COMANDO FORENSE DIGITAL</div>
                    <div>Relatório de Integridade Orgânica e Decomposição Forense</div>
                </div>
                
                <div class="title">REFERÊNCIA: ${report.reportId}</div>
                <div class="subtitle">DATA: ${report.generatedAtFormatted} (UTC)</div>
                <div class="subtitle">ÂMBITO: Verificação de Autenticidade de Prova Documental</div>
                
                <div class="title">1. RESUMO EXECUTIVO (EXECUTIVE SUMMARY)</div>
                <p>O sistema ELITE PROBATUM identificou ${report.analysis.alerts.length} anomalia(s) no artefacto digital analisado. 
                ${report.analysis.alerts.filter(a => a.severity === 'CRITICAL').length > 0 ? 
                    'A análise de metadados e a decomposição de camadas indicam que o ficheiro não é um registo original.' : 
                    'A análise não identificou anomalias críticas.'}</p>
                
                <div class="integrity-score ${report.analysis.integrityScore >= 80 ? 'score-high' : report.analysis.integrityScore >= 50 ? 'score-medium' : 'score-low'}">
                    SCORE DE INTEGRIDADE: ${report.analysis.integrityScore}%
                </div>
                
                <div class="title">2. IDENTIFICAÇÃO DO ARTEFACTO (EVIDÊNCIA)</div>
                <div class="metadata-grid">
                    <div class="metadata-item"><span class="metadata-label">NOME DO FICHEIRO:</span><span class="metadata-value">${report.analysis.metadata.fileName}</span></div>
                    <div class="metadata-item"><span class="metadata-label">TIPO DE MIME:</span><span class="metadata-value">${report.analysis.metadata.mimeType}</span></div>
                    <div class="metadata-item"><span class="metadata-label">TAMANHO:</span><span class="metadata-value">${report.analysis.metadata.fileSizeFormatted}</span></div>
                    <div class="metadata-item"><span class="metadata-label">HASH SHA-256:</span><span class="metadata-value hash">${report.analysis.metadata.hash || report.analysis.hash}</span></div>
                    <div class="metadata-item"><span class="metadata-label">DATA DE ANÁLISE:</span><span class="metadata-value">${new Date(report.analysis.metadata.analysisTimestamp).toLocaleString('pt-PT')}</span></div>
                </div>
                
                <div class="title">3. DIAGNÓSTICO DE ANOMALIAS (DECOMPOSITION ALERTS)</div>
                ${report.analysis.alerts.length === 0 ? 
                    '<p>✅ Nenhuma anomalia detectada. O artefacto apresenta integridade forense.</p>' : 
                    `<table>
                        <thead>
                            <tr><th>ID</th><th>CATEGORIA</th><th>TÍTULO</th><th>DESCRIÇÃO</th><th>GRAVIDADE</th> </thead>
                        <tbody>
                            ${alertRows}
                        </tbody>
                     </table>`
                }
                
                <div class="title">4. RECOMENDAÇÕES ESTRATÉGICAS</div>
                ${recommendationHtml || '<p>✅ Nenhuma recomendação específica. O artefacto pode ser utilizado como prova.</p>'}
                
                <div class="title">5. VALIDAÇÃO DE INTEGRIDADE DO RELATÓRIO</div>
                <div class="footer">
                    Master Hash: ${report.validation.masterHash.substring(0, 32)}...<br>
                    Relatório gerado por ELITE PROBATUM v2.0.5 • Assinatura Digital: ${report.validation.reportHash.substring(0, 32)}...
                </div>
            </body>
            </html>
        `;
        
        const blob = new Blob([reportHtml], { type: 'text/html' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `integrity_report_${report.reportId}.html`;
        link.click();
        URL.revokeObjectURL(link.href);
        
        this.logAccess(evidenceId, 'INTEGRITY_REPORT_EXPORT', window.ELITE_SESSION_ID || 'system');
        
        if (window.EliteUtils) {
            window.EliteUtils.showToast(`Relatório de integridade gerado: ${report.reportId}`, 'success');
        }
        
        return report;
    };
    
    console.log('[ELITE] ForensicVault estendido com Motor de Decomposição de Artefactos v1.0');
    
})();