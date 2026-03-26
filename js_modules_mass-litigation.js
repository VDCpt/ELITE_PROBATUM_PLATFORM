/**
 * ============================================================================
 * ELITE PROBATUM — MÓDULO 2: LITIGÂNCIA EM ESCALA (MASS LITIGATION)
 * ============================================================================
 * Processamento paralelo de lotes de casos, geração automatizada de peças
 * processuais, gestão de carteira e monitorização de SLAs.
 * ============================================================================
 */

class MassLitigationEngine {
    constructor() {
        this.batches = new Map();
        this.activeWorkers = 0;
        this.maxWorkers = 10;
        this.queue = [];
        this.processing = false;
        this.batchCounter = 0;
        this.templates = this.loadTemplates();
        this.slas = this.loadSLAs();
        this.documentCache = new Map();
        
        this.loadBatches();
    }
    
    /**
     * Carrega templates de peças processuais
     */
    loadTemplates() {
        return {
            petition: {
                name: 'Petição Inicial',
                sections: [
                    'cabecalho',
                    'factos',
                    'direito',
                    'pedido',
                    'valor_causa',
                    'fecho'
                ],
                requiredFields: ['court', 'client_name', 'platform', 'period_start', 'period_end', 'trip_count', 'gross_earnings', 'commissions', 'invoiced', 'omitted', 'claim_amount']
            },
            response: {
                name: 'Contestação',
                sections: [
                    'cabecalho',
                    'questoes_preliminares',
                    'impugnacao',
                    'direito',
                    'pedido'
                ],
                requiredFields: ['court', 'process_number', 'platform', 'jurisdiction']
            },
            appeal: {
                name: 'Recurso de Apelação',
                sections: [
                    'cabecalho',
                    'objeto',
                    'questoes',
                    'alegacoes',
                    'pedido'
                ],
                requiredFields: ['court', 'process_number', 'sentence_date']
            },
            evidenceRequest: {
                name: 'Requerimento de Provas',
                sections: [
                    'cabecalho',
                    'documentos',
                    'justificacao',
                    'pedido'
                ],
                requiredFields: ['court', 'process_number', 'period_start', 'period_end']
            }
        };
    }
    
    /**
     * Carrega SLAs por tipo de caso
     */
    loadSLAs() {
        return {
            standard: {
                name: 'Procedimento Comum',
                petition: 15,
                response: 30,
                judgment: 180,
                appeal: 30,
                urgency: false
            },
            urgent: {
                name: 'Procedimento Urgente',
                petition: 5,
                response: 15,
                judgment: 60,
                appeal: 15,
                urgency: true
            },
            arbitration: {
                name: 'Arbitragem',
                petition: 10,
                response: 20,
                judgment: 90,
                appeal: 20,
                urgency: false
            },
            injunctive: {
                name: 'Procedimento Cautelar',
                petition: 3,
                response: 10,
                judgment: 30,
                appeal: 10,
                urgency: true
            }
        };
    }
    
    /**
     * Carrega batches salvos
     */
    loadBatches() {
        const stored = localStorage.getItem('elite_mass_litigation_batches');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                for (const [key, value] of Object.entries(parsed)) {
                    this.batches.set(key, value);
                }
                console.log('[ELITE] Carregados', this.batches.size, 'batches');
            } catch (e) {
                console.error('[ELITE] Erro ao carregar batches:', e);
            }
        }
    }
    
    /**
     * Salva batches
     */
    saveBatches() {
        const batchesObj = {};
        for (const [key, value] of this.batches) {
            batchesObj[key] = value;
        }
        localStorage.setItem('elite_mass_litigation_batches', JSON.stringify(batchesObj));
    }
    
    /**
     * Adiciona novo lote de casos
     * @param {Array} cases - Lista de casos
     * @param {Object} batchConfig - Configuração do lote
     * @returns {string} ID do lote
     */
    async addBatch(cases, batchConfig = {}) {
        const batchId = this.generateBatchId();
        const now = new Date();
        
        const batch = {
            id: batchId,
            name: batchConfig.name || `Lote ${batchId}`,
            cases: cases.map((c, idx) => ({
                ...c,
                batchIndex: idx,
                status: 'pending',
                id: c.id || this.generateCaseId(batchId, idx),
                errors: [],
                generatedDocuments: []
            })),
            status: 'pending',
            config: {
                type: batchConfig.type || 'standard',
                priority: batchConfig.priority || 'normal',
                autoFile: batchConfig.autoFile || false,
                notifyOnComplete: batchConfig.notifyOnComplete !== false,
                generatePetitions: batchConfig.generatePetitions !== false,
                generateEvidenceRequests: batchConfig.generateEvidenceRequests !== false,
                generateAppeals: batchConfig.generateAppeals || false,
                language: batchConfig.language || 'pt',
                template: batchConfig.template || 'default'
            },
            results: {
                petitions: [],
                evidenceRequests: [],
                appeals: [],
                errors: [],
                startTime: null,
                endTime: null,
                summary: null
            },
            progress: {
                total: cases.length,
                processed: 0,
                successful: 0,
                failed: 0,
                percentage: 0
            },
            createdAt: now.toISOString(),
            updatedAt: now.toISOString(),
            completedAt: null
        };
        
        this.batches.set(batchId, batch);
        this.queue.push(batchId);
        this.saveBatches();
        
        if (!this.processing) {
            this.processQueue();
        }
        
        return batchId;
    }
    
    /**
     * Gera ID único para lote
     */
    generateBatchId() {
        this.batchCounter++;
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substr(2, 4);
        return `BATCH_${timestamp}_${random}_${this.batchCounter}`.toUpperCase();
    }
    
    /**
     * Gera ID para caso dentro do lote
     */
    generateCaseId(batchId, index) {
        const batchShort = batchId.split('_')[1]?.substr(0, 6) || Date.now().toString(36);
        return `CASE_${batchShort}_${index.toString().padStart(3, '0')}`;
    }
    
    /**
     * Processa fila de batches
     */
    async processQueue() {
        if (this.processing || this.queue.length === 0) return;
        
        this.processing = true;
        
        while (this.queue.length > 0 && this.activeWorkers < this.maxWorkers) {
            const batchId = this.queue.shift();
            this.processBatch(batchId);
        }
        
        // Aguardar conclusão dos workers ativos
        await this.waitForCompletion();
        
        this.processing = false;
        
        // Processar próximo lote se houver
        if (this.queue.length > 0) {
            this.processQueue();
        }
    }
    
    /**
     * Aguarda conclusão dos workers
     */
    waitForCompletion() {
        return new Promise((resolve) => {
            const checkInterval = setInterval(() => {
                if (this.activeWorkers === 0) {
                    clearInterval(checkInterval);
                    resolve();
                }
            }, 100);
        });
    }
    
    /**
     * Processa um lote
     */
    async processBatch(batchId) {
        const batch = this.batches.get(batchId);
        if (!batch) return;
        
        batch.status = 'processing';
        batch.results.startTime = Date.now();
        this.saveBatches();
        
        this.activeWorkers++;
        
        // Processar casos em paralelo com limite de concorrência
        const chunkSize = Math.max(1, Math.floor(batch.cases.length / Math.min(this.maxWorkers, 5)));
        const chunks = this.chunkArray(batch.cases, chunkSize);
        
        await Promise.all(chunks.map(async (chunk) => {
            for (const caseData of chunk) {
                try {
                    await this.processCase(batchId, caseData);
                    batch.progress.processed++;
                    batch.progress.successful++;
                } catch (error) {
                    batch.progress.processed++;
                    batch.progress.failed++;
                    batch.results.errors.push({
                        caseId: caseData.id,
                        caseName: caseData.client?.name || caseData.id,
                        error: error.message,
                        timestamp: new Date().toISOString(),
                        stack: error.stack
                    });
                }
                
                batch.progress.percentage = (batch.progress.processed / batch.progress.total) * 100;
                batch.updatedAt = new Date().toISOString();
                this.saveBatches();
                this.emitProgress(batchId);
            }
        }));
        
        batch.results.endTime = Date.now();
        batch.status = 'completed';
        batch.completedAt = new Date().toISOString();
        
        // Gerar relatório do lote
        batch.results.summary = this.generateBatchReport(batchId);
        
        this.activeWorkers--;
        this.saveBatches();
        
        // Notificar se configurado
        if (batch.config.notifyOnComplete) {
            this.notifyCompletion(batchId, batch.results.summary);
        }
        
        // Auto-submeter se configurado
        if (batch.config.autoFile) {
            await this.autoFileBatch(batchId);
        }
        
        this.emitCompletion(batchId);
    }
    
    /**
     * Processa um caso individual
     */
    async processCase(batchId, caseData) {
        const batch = this.batches.get(batchId);
        if (!batch) throw new Error(`Batch ${batchId} não encontrado`);
        
        const results = {
            caseId: caseData.id,
            generatedAt: new Date().toISOString(),
            documents: []
        };
        
        // Gerar petição inicial
        if (batch.config.generatePetitions) {
            const petition = await this.generateDocument('petition', caseData, batch.config);
            results.documents.push({
                type: 'petition',
                name: `Petição_Inicial_${caseData.id}.docx`,
                content: petition,
                generatedAt: new Date().toISOString()
            });
            batch.results.petitions.push({
                caseId: caseData.id,
                caseName: caseData.client?.name || caseData.id,
                document: petition,
                generatedAt: results.generatedAt
            });
        }
        
        // Gerar requerimento de provas
        if (batch.config.generateEvidenceRequests) {
            const evidenceRequest = await this.generateDocument('evidenceRequest', caseData, batch.config);
            results.documents.push({
                type: 'evidenceRequest',
                name: `Requerimento_Provas_${caseData.id}.docx`,
                content: evidenceRequest,
                generatedAt: new Date().toISOString()
            });
            batch.results.evidenceRequests.push({
                caseId: caseData.id,
                caseName: caseData.client?.name || caseData.id,
                document: evidenceRequest,
                generatedAt: results.generatedAt
            });
        }
        
        // Gerar recurso (se aplicável)
        if (batch.config.generateAppeals && caseData.hasAppeal) {
            const appeal = await this.generateDocument('appeal', caseData, batch.config);
            results.documents.push({
                type: 'appeal',
                name: `Recurso_Apelacao_${caseData.id}.docx`,
                content: appeal,
                generatedAt: new Date().toISOString()
            });
            batch.results.appeals.push({
                caseId: caseData.id,
                caseName: caseData.client?.name || caseData.id,
                document: appeal,
                generatedAt: results.generatedAt
            });
        }
        
        // Calcular SLAs
        const sla = this.calculateSLA(caseData, batch.config.type);
        results.sla = sla;
        
        // Armazenar resultados no caso
        const caseIndex = batch.cases.findIndex(c => c.id === caseData.id);
        if (caseIndex !== -1) {
            batch.cases[caseIndex].status = 'processed';
            batch.cases[caseIndex].generatedDocuments = results.documents;
            batch.cases[caseIndex].sla = sla;
            batch.cases[caseIndex].processedAt = results.generatedAt;
        }
        
        return results;
    }
    
    /**
     * Gera documento a partir de template
     */
    async generateDocument(type, caseData, config) {
        const template = this.templates[type];
        if (!template) {
            throw new Error(`Template não encontrado: ${type}`);
        }
        
        let document = this.getCachedTemplate(type);
        if (!document) {
            document = await this.loadTemplate(type);
            this.cacheTemplate(type, document);
        }
        
        // Preencher template com dados do caso
        const replacements = this.getReplacements(caseData, config);
        
        for (const [key, value] of Object.entries(replacements)) {
            const regex = new RegExp(`{{${key}}}`, 'g');
            document = document.replace(regex, value || 'N/A');
        }
        
        // Validar campos obrigatórios
        const missingFields = [];
        for (const field of template.requiredFields) {
            if (!replacements[field] && replacements[field] !== 0) {
                missingFields.push(field);
            }
        }
        
        if (missingFields.length > 0) {
            console.warn(`[ELITE] Documento ${type} - Campos obrigatórios faltando: ${missingFields.join(', ')}`);
        }
        
        return document;
    }
    
    /**
     * Carrega template do cache ou localStorage
     */
    getCachedTemplate(type) {
        return this.documentCache.get(type);
    }
    
    /**
     * Cacheia template
     */
    cacheTemplate(type, content) {
        this.documentCache.set(type, content);
    }
    
    /**
     * Carrega template (simulado - em produção, carregaria de arquivo)
     */
    async loadTemplate(type) {
        // Templates embutidos (em produção, seriam arquivos externos)
        const templates = {
            petition: `<?xml version="1.0" encoding="UTF-8"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
    <w:body>
        <w:p><w:r><w:t>EXMO. SENHOR DOUTOR JUIZ DE DIREITO DO TRIBUNAL JUDICIAL DA COMARCA DE {{court}}</w:t></w:r></w:p>
        <w:p><w:r><w:t>________________________________________</w:t></w:r></w:p>
        <w:p><w:r><w:t>Processo n.º: {{process_number}}</w:t></w:r></w:p>
        <w:p><w:r><w:t>Requerente: {{client_name}}, NIF {{client_nif}}</w:t></w:r></w:p>
        <w:p><w:r><w:t>Requerida: {{platform_name}}, NIF {{platform_nif}}</w:t></w:r></w:p>
        
        <w:p><w:r><w:t>I. DOS FACTOS</w:t></w:r></w:p>
        <w:p><w:r><w:t>1. O Requerente exerce atividade de transporte em plataforma digital, tendo celebrado contrato de prestação de serviços com a Requerida.</w:t></w:r></w:p>
        <w:p><w:r><w:t>2. No período compreendido entre {{period_start}} e {{period_end}}, o Requerente realizou {{trip_count}} viagens, tendo obtido ganhos totais no valor de {{gross_earnings}}.</w:t></w:r></w:p>
        <w:p><w:r><w:t>3. A Requerida reteve a título de comissões o montante de {{commissions_withheld}}, correspondente a {{commission_percentage}}% dos ganhos.</w:t></w:r></w:p>
        <w:p><w:r><w:t>4. No entanto, a Requerida apenas emitiu faturas no valor de {{invoiced_amount}}, omitindo o montante de {{omitted_amount}} ({{omission_percentage}}%).</w:t></w:r></w:p>
        
        <w:p><w:r><w:t>II. DO DIREITO</w:t></w:r></w:p>
        <w:p><w:r><w:t>5. Nos termos do Art. 36.º, n.º 11 do CIVA, a Requerida detém o monopólio da emissão documental fiscal, sendo responsável pela correta faturação das operações.</w:t></w:r></w:p>
        <w:p><w:r><w:t>6. A omissão de faturação no montante de {{omitted_amount}} constitui violação do dever de emissão de fatura, nos termos do Art. 29.º do CIVA.</w:t></w:r></w:p>
        <w:p><w:r><w:t>7. A conduta da Requerida configura, prima facie, o ilícito de fraude fiscal qualificada previsto no Art. 104.º do RGIT, porquanto a vantagem patrimonial ilegítima excede o limiar de €15.000.</w:t></w:r></w:p>
        <w:p><w:r><w:t>8. A prova digital produzida pelo sistema UNIFED-ELITE, certificada por hash SHA-256 e ancorada em blockchain, é admissível nos termos do Art. 125.º do CPP e ISO/IEC 27037:2012.</w:t></w:r></w:p>
        
        <w:p><w:r><w:t>III. DO PEDIDO</w:t></w:r></w:p>
        <w:p><w:r><w:t>Termos em que requer a V. Exa. se digne:</w:t></w:r></w:p>
        <w:p><w:r><w:t>a) Condenar a Requerida a pagar ao Requerente a quantia de {{claim_amount}}, acrescida de juros de mora à taxa legal desde a citação;</w:t></w:r></w:p>
        <w:p><w:r><w:t>b) Determinar a inversão do ónus da prova nos termos do Art. 344.º do CC, por ser a Requerida a única detentora dos meios de prova;</w:t></w:r></w:p>
        <w:p><w:r><w:t>c) Condenar a Requerida no pagamento de custas e honorários.</w:t></w:r></w:p>
        
        <w:p><w:r><w:t>Valor da causa: {{case_value}}</w:t></w:r></w:p>
        <w:p><w:r><w:t>Data: {{date}}</w:t></w:r></w:p>
        <w:p><w:r><w:t>________________________________________</w:t></w:r></w:p>
        <w:p><w:r><w:t>{{lawyer_name}}</w:t></w:r></w:p>
        <w:p><w:r><w:t>Advogado(a) - {{oab_number}}</w:t></w:r></w:p>
    </w:body>
</w:document>`,
            evidenceRequest: `<?xml version="1.0" encoding="UTF-8"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
    <w:body>
        <w:p><w:r><w:t>EXMO. SENHOR DOUTOR JUIZ DE DIREITO DO TRIBUNAL JUDICIAL DA COMARCA DE {{court}}</w:t></w:r></w:p>
        <w:p><w:r><w:t>________________________________________</w:t></w:r></w:p>
        <w:p><w:r><w:t>Processo n.º: {{process_number}}</w:t></w:r></w:p>
        
        <w:p><w:r><w:t>O Requerente, nos autos em epígrafe, requer a V. Exa. se digne determinar a produção antecipada das seguintes provas:</w:t></w:r></w:p>
        
        <w:p><w:r><w:t>1. EXIBIÇÃO DE DOCUMENTOS</w:t></w:r></w:p>
        <w:p><w:r><w:t>a) Código-fonte do algoritmo de cálculo de comissões aplicado ao período em análise;</w:t></w:r></w:p>
        <w:p><w:r><w:t>b) Logs brutos de transação do período {{period_start}} a {{period_end}}, com rastreabilidade completa;</w:t></w:r></w:p>
        <w:p><w:r><w:t>c) Registos de faturação emitida em nome do Requerente no mesmo período.</w:t></w:r></w:p>
        
        <w:p><w:r><w:t>2. JUSTIFICAÇÃO</w:t></w:r></w:p>
        <w:p><w:r><w:t>Os documentos solicitados são essenciais para a demonstração dos factos constitutivos do direito do Requerente, nos termos do Art. 432.º do CPC.</w:t></w:r></w:p>
        <w:p><w:r><w:t>A Requerida detém o monopólio destes elementos probatórios, não tendo o Requerente acesso aos mesmos por outros meios.</w:t></w:r></w:p>
        
        <w:p><w:r><w:t>Termos em que requer a procedência do requerido.</w:t></w:r></w:p>
        <w:p><w:r><w:t>Data: {{date}}</w:t></w:r></w:p>
        <w:p><w:r><w:t>________________________________________</w:t></w:r></w:p>
        <w:p><w:r><w:t>{{lawyer_name}}</w:t></w:r></w:p>
    </w:body>
</w:document>`
        };
        
        return templates[type] || '';
    }
    
    /**
     * Obtém mapeamento de substituições para template
     */
    getReplacements(caseData, config) {
        const platformNames = {
            bolt: 'Bolt Operations OÜ',
            uber: 'Uber B.V.',
            freenow: 'FREE NOW',
            cabify: 'Cabify',
            glovo: 'Glovo',
            indrive: 'inDrive'
        };
        
        const platformNifs = {
            bolt: 'EE102090374',
            uber: 'NL852071588B01',
            freenow: 'PT514214739',
            cabify: 'PT515239876',
            glovo: 'ESB87654321',
            indrive: 'PT516348765'
        };
        
        const platform = caseData.platform || 'unknown';
        
        return {
            court: caseData.court || 'Lisboa',
            process_number: caseData.processNumber || 'A AGUARDAR',
            client_name: caseData.client?.name || caseData.client_name || 'CLIENTE',
            client_nif: caseData.client?.nif || caseData.client_nif || 'NIF',
            platform_name: platformNames[platform] || 'Plataforma Digital',
            platform_nif: platformNifs[platform] || 'A VERIFICAR',
            period_start: caseData.periodStart || '01/01/2024',
            period_end: caseData.periodEnd || '31/12/2024',
            trip_count: caseData.tripCount || '0',
            gross_earnings: this.formatCurrency(caseData.grossEarnings || caseData.ganhos || 0),
            commissions_withheld: this.formatCurrency(caseData.commissions || caseData.despesas || 0),
            commission_percentage: (caseData.percentage || 0).toFixed(1),
            invoiced_amount: this.formatCurrency(caseData.invoiced || caseData.faturaPlataforma || 0),
            omitted_amount: this.formatCurrency(caseData.discrepancy || 0),
            omission_percentage: (caseData.omissionPercentage || 0).toFixed(1),
            claim_amount: this.formatCurrency(caseData.discrepancy || 0),
            case_value: this.formatCurrency(caseData.discrepancy || caseData.value || 0),
            jurisdiction: platform === 'bolt' ? 'Estónia' : 'Países Baixos',
            sentence_date: caseData.sentenceDate || new Date().toLocaleDateString('pt-PT'),
            date: new Date().toLocaleDateString('pt-PT'),
            lawyer_name: caseData.lawyerName || config.lawyerName || 'ADVOGADO',
            oab_number: caseData.oabNumber || config.oabNumber || 'N/A'
        };
    }
    
    /**
     * Formata moeda
     */
    formatCurrency(value) {
        if (value === null || value === undefined) return '€0,00';
        return new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2 }).format(value);
    }
    
    /**
     * Calcula SLA para um caso
     */
    calculateSLA(caseData, caseType) {
        const sla = this.slas[caseType] || this.slas.standard;
        const startDate = new Date();
        
        return {
            type: caseType,
            name: sla.name,
            petitionDeadline: this.addBusinessDays(startDate, sla.petition),
            responseDeadline: this.addBusinessDays(startDate, sla.response),
            judgmentDeadline: this.addBusinessDays(startDate, sla.judgment),
            appealDeadline: sla.appeal ? this.addBusinessDays(startDate, sla.appeal) : null,
            urgency: sla.urgency,
            estimatedDuration: sla.judgment,
            startDate: startDate.toISOString()
        };
    }
    
    /**
     * Adiciona dias úteis a uma data
     */
    addBusinessDays(date, days) {
        const result = new Date(date);
        let remainingDays = days;
        
        while (remainingDays > 0) {
            result.setDate(result.getDate() + 1);
            if (this.isBusinessDay(result)) {
                remainingDays--;
            }
        }
        
        return result.toISOString();
    }
    
    /**
     * Verifica se é dia útil
     */
    isBusinessDay(date) {
        const dayOfWeek = date.getDay();
        if (dayOfWeek === 0 || dayOfWeek === 6) return false;
        
        // Simplificado - em produção, considerar feriados
        return true;
    }
    
    /**
     * Divide array em chunks
     */
    chunkArray(array, size) {
        const chunks = [];
        for (let i = 0; i < array.length; i += size) {
            chunks.push(array.slice(i, i + size));
        }
        return chunks;
    }
    
    /**
     * Gera relatório do lote
     */
    generateBatchReport(batchId) {
        const batch = this.batches.get(batchId);
        if (!batch) return null;
        
        const duration = batch.results.endTime && batch.results.startTime
            ? (batch.results.endTime - batch.results.startTime) / 1000
            : 0;
        
        const successRate = batch.progress.total > 0
            ? (batch.progress.successful / batch.progress.total) * 100
            : 0;
        
        const report = {
            batchId: batch.id,
            batchName: batch.name,
            status: batch.status,
            createdAt: batch.createdAt,
            completedAt: batch.completedAt,
            durationSeconds: duration,
            summary: {
                total: batch.progress.total,
                successful: batch.progress.successful,
                failed: batch.progress.failed,
                successRate: successRate.toFixed(1),
                avgTimePerCase: batch.progress.processed > 0 ? (duration / batch.progress.processed).toFixed(1) : 0
            },
            documents: {
                petitions: batch.results.petitions.length,
                evidenceRequests: batch.results.evidenceRequests.length,
                appeals: batch.results.appeals.length,
                total: batch.results.petitions.length + batch.results.evidenceRequests.length + batch.results.appeals.length
            },
            errors: batch.results.errors.map(e => ({
                caseId: e.caseId,
                caseName: e.caseName,
                error: e.error,
                timestamp: e.timestamp
            })),
            config: batch.config,
            slaType: batch.config.type
        };
        
        return report;
    }
    
    /**
     * Emite evento de progresso
     */
    emitProgress(batchId) {
        const batch = this.batches.get(batchId);
        if (!batch) return;
        
        const event = new CustomEvent('massLitigationProgress', {
            detail: {
                batchId: batch.id,
                batchName: batch.name,
                progress: batch.progress.percentage,
                processed: batch.progress.processed,
                total: batch.progress.total,
                successful: batch.progress.successful,
                failed: batch.progress.failed,
                status: batch.status,
                timestamp: new Date().toISOString()
            }
        });
        window.dispatchEvent(event);
    }
    
    /**
     * Emite evento de conclusão
     */
    emitCompletion(batchId) {
        const batch = this.batches.get(batchId);
        if (!batch) return;
        
        const event = new CustomEvent('massLitigationComplete', {
            detail: {
                batchId: batch.id,
                batchName: batch.name,
                summary: batch.results.summary,
                timestamp: new Date().toISOString()
            }
        });
        window.dispatchEvent(event);
    }
    
    /**
     * Notifica conclusão do lote
     */
    notifyCompletion(batchId, report) {
        if (window.EliteUtils) {
            const message = report.errors.length > 0
                ? `Lote ${batchId} concluído com ${report.summary.successful}/${report.summary.total} sucessos e ${report.summary.failed} erros`
                : `Lote ${batchId} concluído com sucesso! ${report.summary.successful} casos processados`;
            
            const type = report.errors.length > 0 ? 'warning' : 'success';
            window.EliteUtils.showToast(message, type);
        }
        
        // Salvar relatório
        this.saveReport(batchId, report);
    }
    
    /**
     * Salva relatório
     */
    saveReport(batchId, report) {
        const reports = JSON.parse(localStorage.getItem('elite_mass_litigation_reports') || '[]');
        reports.unshift({
            batchId,
            report,
            savedAt: new Date().toISOString()
        });
        
        // Manter apenas últimos 100 relatórios
        while (reports.length > 100) {
            reports.pop();
        }
        
        localStorage.setItem('elite_mass_litigation_reports', JSON.stringify(reports));
    }
    
    /**
     * Auto-submete lote
     */
    async autoFileBatch(batchId) {
        const batch = this.batches.get(batchId);
        if (!batch) return;
        
        if (window.EliteUtils) {
            window.EliteUtils.showToast(`Auto-submissão do lote ${batchId} iniciada...`, 'info');
        }
        
        // Simular submissão (em produção, integrar com API do tribunal)
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        batch.status = 'filed';
        batch.filedAt = new Date().toISOString();
        this.saveBatches();
        
        if (window.EliteUtils) {
            window.EliteUtils.showToast(`Lote ${batchId} submetido com sucesso!`, 'success');
        }
    }
    
    /**
     * Obtém status de um lote
     */
    getBatchStatus(batchId) {
        const batch = this.batches.get(batchId);
        if (!batch) return null;
        
        return {
            id: batch.id,
            name: batch.name,
            status: batch.status,
            progress: batch.progress,
            createdAt: batch.createdAt,
            completedAt: batch.completedAt,
            errors: batch.results.errors.length
        };
    }
    
    /**
     * Obtém todos os batches
     */
    getAllBatches() {
        return Array.from(this.batches.values()).sort((a, b) => 
            new Date(b.createdAt) - new Date(a.createdAt)
        );
    }
    
    /**
     * Obtém relatórios de batches
     */
    getBatchReports(limit = 20) {
        const reports = JSON.parse(localStorage.getItem('elite_mass_litigation_reports') || '[]');
        return reports.slice(0, limit);
    }
    
    /**
     * Exporta lote como ZIP
     */
    async exportBatch(batchId, format = 'zip') {
        const batch = this.batches.get(batchId);
        if (!batch) return null;
        
        if (format === 'zip' && typeof JSZip !== 'undefined') {
            const zip = new JSZip();
            const batchFolder = zip.folder(`batch_${batchId}`);
            
            // Adicionar relatório
            const report = this.generateBatchReport(batchId);
            batchFolder.file('relatorio.json', JSON.stringify(report, null, 2));
            
            // Adicionar documentos
            for (const petition of batch.results.petitions) {
                batchFolder.file(`peticao_${petition.caseId}.docx`, petition.document);
            }
            
            for (const evidence of batch.results.evidenceRequests) {
                batchFolder.file(`requerimento_provas_${evidence.caseId}.docx`, evidence.document);
            }
            
            for (const appeal of batch.results.appeals) {
                batchFolder.file(`recurso_${appeal.caseId}.docx`, appeal.document);
            }
            
            // Adicionar resumo
            const summary = {
                batchId: batch.id,
                batchName: batch.name,
                totalCases: batch.cases.length,
                generatedAt: new Date().toISOString(),
                summary: report.summary
            };
            batchFolder.file('resumo.json', JSON.stringify(summary, null, 2));
            
            const blob = await zip.generateAsync({ type: 'blob' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `batch_${batchId}_${new Date().toISOString().slice(0, 10)}.zip`;
            link.click();
            URL.revokeObjectURL(url);
            
            return true;
        }
        
        return batch;
    }
    
    /**
     * Cancela um lote em processamento
     */
    cancelBatch(batchId) {
        const batch = this.batches.get(batchId);
        if (!batch) return false;
        
        if (batch.status === 'processing') {
            batch.status = 'cancelled';
            batch.cancelledAt = new Date().toISOString();
            this.saveBatches();
            
            if (window.EliteUtils) {
                window.EliteUtils.showToast(`Lote ${batchId} cancelado`, 'warning');
            }
            
            return true;
        }
        
        return false;
    }
    
    /**
     * Remove um lote
     */
    deleteBatch(batchId) {
        const deleted = this.batches.delete(batchId);
        if (deleted) {
            this.saveBatches();
            
            if (window.EliteUtils) {
                window.EliteUtils.showToast(`Lote ${batchId} removido`, 'info');
            }
        }
        return deleted;
    }
    
    /**
     * Obtém estatísticas gerais
     */
    getStatistics() {
        const batches = Array.from(this.batches.values());
        const totalBatches = batches.length;
        const completedBatches = batches.filter(b => b.status === 'completed').length;
        const processingBatches = batches.filter(b => b.status === 'processing').length;
        const totalCases = batches.reduce((sum, b) => sum + b.progress.total, 0);
        const totalSuccess = batches.reduce((sum, b) => sum + b.progress.successful, 0);
        const totalErrors = batches.reduce((sum, b) => sum + b.progress.failed, 0);
        const totalDocuments = batches.reduce((sum, b) => 
            sum + b.results.petitions.length + b.results.evidenceRequests.length + b.results.appeals.length, 0);
        
        return {
            totalBatches,
            completedBatches,
            processingBatches,
            totalCases,
            totalSuccess,
            totalErrors,
            totalDocuments,
            successRate: totalCases > 0 ? (totalSuccess / totalCases * 100).toFixed(1) : 0,
            avgDocumentsPerBatch: totalBatches > 0 ? (totalDocuments / totalBatches).toFixed(1) : 0
        };
    }
}

// Instância global
window.MassLitigationEngine = new MassLitigationEngine();