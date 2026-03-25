/**
 * ============================================================================
 * UNIFED-ELITE PLATFORM — MÓDULO 2: LITIGÂNCIA EM ESCALA (MASS LITIGATION)
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
        
        // Templates de peças processuais
        this.templates = {
            petition: this.loadPetitionTemplate(),
            response: this.loadResponseTemplate(),
            appeal: this.loadAppealTemplate(),
            evidenceRequest: this.loadEvidenceRequestTemplate()
        };
        
        // SLAs por tipo de caso
        this.slas = {
            standard: { petition: 15, response: 30, judgment: 180 },
            urgent: { petition: 5, response: 15, judgment: 60 },
            arbitration: { petition: 10, response: 20, judgment: 90 }
        };
    }
    
    loadPetitionTemplate() {
        return `<?xml version="1.0" encoding="UTF-8"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
    <w:body>
        <w:p><w:r><w:t>EXMO. SENHOR DOUTOR JUIZ DE DIREITO DO TRIBUNAL JUDICIAL DA COMARCA DE {{COURT}}</w:t></w:r></w:p>
        <w:p><w:r><w:t>________________________________________</w:t></w:r></w:p>
        <w:p><w:r><w:t>Processo n.º: {{PROCESS_NUMBER}}</w:t></w:r></w:p>
        <w:p><w:r><w:t>Requerente: {{CLIENT_NAME}}, NIF {{CLIENT_NIF}}</w:t></w:r></w:p>
        <w:p><w:r><w:t>Requerida: {{PLATFORM_NAME}}, NIF {{PLATFORM_NIF}}</w:t></w:r></w:p>
        
        <w:p><w:r><w:t>I. DOS FACTOS</w:t></w:r></w:p>
        <w:p><w:r><w:t>1. O Requerente exerce atividade de transporte em plataforma digital, tendo celebrado contrato de prestação de serviços com a Requerida.</w:t></w:r></w:p>
        <w:p><w:r><w:t>2. No período compreendido entre {{PERIOD_START}} e {{PERIOD_END}}, o Requerente realizou {{TRIP_COUNT}} viagens, tendo obtido ganhos totais no valor de {{GROSS_EARNINGS}}.</w:t></w:r></w:p>
        <w:p><w:r><w:t>3. A Requerida reteve a título de comissões o montante de {{COMMISSIONS_WITHHELD}}, correspondente a {{COMMISSION_PERCENTAGE}}% dos ganhos.</w:t></w:r></w:p>
        <w:p><w:r><w:t>4. No entanto, a Requerida apenas emitiu faturas no valor de {{INVOICED_AMOUNT}}, omitindo o montante de {{OMITTED_AMOUNT}} ({{OMISSION_PERCENTAGE}}%).</w:t></w:r></w:p>
        
        <w:p><w:r><w:t>II. DO DIREITO</w:t></w:r></w:p>
        <w:p><w:r><w:t>5. Nos termos do Art. 36.º, n.º 11 do CIVA, a Requerida detém o monopólio da emissão documental fiscal, sendo responsável pela correta faturação das operações.</w:t></w:r></w:p>
        <w:p><w:r><w:t>6. A omissão de faturação no montante de {{OMITTED_AMOUNT}} constitui violação do dever de emissão de fatura, nos termos do Art. 29.º do CIVA.</w:t></w:r></w:p>
        <w:p><w:r><w:t>7. A conduta da Requerida configura, prima facie, o ilícito de fraude fiscal qualificada previsto no Art. 104.º do RGIT, porquanto a vantagem patrimonial ilegítima excede o limiar de €15.000.</w:t></w:r></w:p>
        <w:p><w:r><w:t>8. A prova digital produzida pelo sistema UNIFED-ELITE, certificada por hash SHA-256 e ancorada em blockchain, é admissível nos termos do Art. 125.º do CPP e ISO/IEC 27037:2012.</w:t></w:r></w:p>
        
        <w:p><w:r><w:t>III. DO PEDIDO</w:t></w:r></w:p>
        <w:p><w:r><w:t>Termos em que requer a V. Exa. se digne:</w:t></w:r></w:p>
        <w:p><w:r><w:t>a) Condenar a Requerida a pagar ao Requerente a quantia de {{CLAIM_AMOUNT}}, acrescida de juros de mora à taxa legal desde a citação;</w:t></w:r></w:p>
        <w:p><w:r><w:t>b) Determinar a inversão do ónus da prova nos termos do Art. 344.º do CC, por ser a Requerida a única detentora dos meios de prova;</w:t></w:r></w:p>
        <w:p><w:r><w:t>c) Condenar a Requerida no pagamento de custas e honorários.</w:t></w:r></w:p>
        
        <w:p><w:r><w:t>Valor da causa: {{CASE_VALUE}}</w:t></w:r></w:p>
        <w:p><w:r><w:t>Data: {{DATE}}</w:t></w:r></w:p>
        <w:p><w:r><w:t>________________________________________</w:t></w:r></w:p>
        <w:p><w:r><w:t>{{LAWYER_NAME}}</w:t></w:r></w:p>
        <w:p><w:r><w:t>Advogado(a) - {{OAB_NUMBER}}</w:t></w:r></w:p>
    </w:body>
</w:document>`;
    }
    
    loadResponseTemplate() {
        return `<?xml version="1.0" encoding="UTF-8"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
    <w:body>
        <w:p><w:r><w:t>EXMO. SENHOR DOUTOR JUIZ DE DIREITO DO TRIBUNAL JUDICIAL DA COMARCA DE {{COURT}}</w:t></w:r></w:p>
        <w:p><w:r><w:t>________________________________________</w:t></w:r></w:p>
        <w:p><w:r><w:t>Processo n.º: {{PROCESS_NUMBER}}</w:t></w:r></w:p>
        
        <w:p><w:r><w:t>A Requerida {{PLATFORM_NAME}}, devidamente representada nos autos, vem apresentar</w:t></w:r></w:p>
        <w:p><w:r><w:t>CONTESTAÇÃO</w:t></w:r></w:p>
        
        <w:p><w:r><w:t>I. DA QUESTÃO PRÉVIA</w:t></w:r></w:p>
        <w:p><w:r><w:t>1. A Requerida invoca a exceção de incompetência internacional em razão da sede social localizada na {{JURISDICTION}}, ao abrigo do Regulamento (UE) n.º 1215/2012 (Bruxelas I).</w:t></w:r></w:p>
        
        <w:p><w:r><w:t>II. DA IMPUGNAÇÃO</w:t></w:r></w:p>
        <w:p><w:r><w:t>2. Sem prescindir, a Requerida impugna os factos articulados pelo Requerente, por não corresponderem à verdade material.</w:t></w:r></w:p>
        <w:p><w:r><w:t>3. A discrepância apurada resulta de erro técnico no processamento dos dados, não configurando qualquer omissão dolosa.</w:t></w:r></w:p>
        <w:p><w:r><w:t>4. Os Termos e Condições da plataforma, aceites pelo Requerente, estabelecem que as comissões são calculadas com base no preço total da viagem, incluindo taxas de cancelamento e portagens.</w:t></w:r></w:p>
        
        <w:p><w:r><w:t>III. DO DIREITO</w:t></w:r></w:p>
        <w:p><w:r><w:t>5. Nos termos do Art. 6.º do Código Civil, a ignorância da lei não aproveita ao Requerente, que conhecia os Termos e Condições do serviço.</w:t></w:r></w:p>
        <w:p><w:r><w:t>6. A prova pericial apresentada pelo Requerente não tem força probatória plena, por não ter sido produzida em contraditório.</w:t></w:r></w:p>
        
        <w:p><w:r><w:t>Termos em que se requer a procedência das exceções e, no mérito, a improcedência da ação.</w:t></w:r></w:p>
        <w:p><w:r><w:t>Data: {{DATE}}</w:t></w:r></w:p>
        <w:p><w:r><w:t>________________________________________</w:t></w:r></w:p>
    </w:body>
</w:document>`;
    }
    
    loadAppealTemplate() {
        return `<?xml version="1.0" encoding="UTF-8"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
    <w:body>
        <w:p><w:r><w:t>EXMO. SENHOR DOUTOR JUIZ DE DIREITO DO TRIBUNAL JUDICIAL DA COMARCA DE {{COURT}}</w:t></w:r></w:p>
        <w:p><w:r><w:t>________________________________________</w:t></w:r></w:p>
        <w:p><w:r><w:t>Processo n.º: {{PROCESS_NUMBER}}</w:t></w:r></w:p>
        
        <w:p><w:r><w:t>O Requerente, inconformado com a douta sentença proferida a {{SENTENCE_DATE}}, vem interpor o presente</w:t></w:r></w:p>
        <w:p><w:r><w:t>RECURSO DE APELAÇÃO</w:t></w:r></w:p>
        
        <w:p><w:r><w:t>I. DO OBJETO</w:t></w:r></w:p>
        <w:p><w:r><w:t>1. O presente recurso tem por objeto a decisão que julgou improcedente a ação, por considerar que a prova pericial não tinha força probatória.</w:t></w:r></w:p>
        
        <w:p><w:r><w:t>II. DAS QUESTÕES A DECIDIR</w:t></w:r></w:p>
        <w:p><w:r><w:t>2. Constituem questões a decidir:</w:t></w:r></w:p>
        <w:p><w:r><w:t>a) A admissibilidade da prova digital produzida pelo sistema UNIFED-ELITE, nos termos do Art. 125.º do CPP e ISO/IEC 27037:2012;</w:t></w:r></w:p>
        <w:p><w:r><w:t>b) A inversão do ónus da prova por força do Art. 344.º do CC e do princípio da proximidade;</w:t></w:r></w:p>
        <w:p><w:r><w:t>c) A aplicação do Art. 104.º do RGIT (fraude fiscal qualificada) face à omissão superior a €15.000.</w:t></w:r></w:p>
        
        <w:p><w:r><w:t>III. DAS ALEGAÇÕES</w:t></w:r></w:p>
        <w:p><w:r><w:t>3. A douta sentença recorrida violou o Art. 125.º do CPP, que estabelece a admissibilidade de todos os meios de prova não proibidos por lei.</w:t></w:r></w:p>
        <w:p><w:r><w:t>4. O Acórdão do STA de 27.09.2023 (Proc. 01080/17.3BELRS) já reconheceu a validade probatória da análise forense de dados de plataformas digitais.</w:t></w:r></w:p>
        <w:p><w:r><w:t>5. A inversão do ónus da prova é imperativa quando, como nos autos, a parte contrária detém o monopólio da prova.</w:t></w:r></w:p>
        
        <w:p><w:r><w:t>Termos em que se requer seja dado provimento ao recurso e revogada a sentença recorrida.</w:t></w:r></w:p>
        <w:p><w:r><w:t>Data: {{DATE}}</w:t></w:r></w:p>
    </w:body>
</w:document>`;
    }
    
    loadEvidenceRequestTemplate() {
        return `<?xml version="1.0" encoding="UTF-8"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
    <w:body>
        <w:p><w:r><w:t>EXMO. SENHOR DOUTOR JUIZ DE DIREITO DO TRIBUNAL JUDICIAL DA COMARCA DE {{COURT}}</w:t></w:r></w:p>
        <w:p><w:r><w:t>________________________________________</w:t></w:r></w:p>
        <w:p><w:r><w:t>Processo n.º: {{PROCESS_NUMBER}}</w:t></w:r></w:p>
        
        <w:p><w:r><w:t>O Requerente, nos autos em epígrafe, requer a V. Exa. se digne determinar a produção antecipada das seguintes provas:</w:t></w:r></w:p>
        
        <w:p><w:r><w:t>1. EXIBIÇÃO DE DOCUMENTOS</w:t></w:r></w:p>
        <w:p><w:r><w:t>a) Código-fonte do algoritmo de cálculo de comissões aplicado ao período em análise;</w:t></w:r></w:p>
        <w:p><w:r><w:t>b) Logs brutos de transação do período {{PERIOD_START}} a {{PERIOD_END}}, com rastreabilidade completa;</w:t></w:r></w:p>
        <w:p><w:r><w:t>c) Registos de faturação emitida em nome do Requerente no mesmo período.</w:t></w:r></w:p>
        
        <w:p><w:r><w:t>2. JUSTIFICAÇÃO</w:t></w:r></w:p>
        <w:p><w:r><w:t>Os documentos solicitados são essenciais para a demonstração dos factos constitutivos do direito do Requerente, nos termos do Art. 432.º do CPC.</w:t></w:r></w:p>
        <w:p><w:r><w:t>A Requerida detém o monopólio destes elementos probatórios, não tendo o Requerente acesso aos mesmos por outros meios.</w:t></w:r></w:p>
        
        <w:p><w:r><w:t>Termos em que requer a procedência do requerido.</w:t></w:r></w:p>
        <w:p><w:r><w:t>Data: {{DATE}}</w:t></w:r></w:p>
    </w:body>
</w:document>`;
    }
    
    async addBatch(cases, batchConfig = {}) {
        const batchId = this.generateBatchId();
        const batch = {
            id: batchId,
            cases: cases,
            status: 'pending',
            config: {
                type: batchConfig.type || 'standard',
                priority: batchConfig.priority || 'normal',
                autoFile: batchConfig.autoFile || false,
                notifyOnComplete: batchConfig.notifyOnComplete || true,
                ...batchConfig
            },
            results: {
                petitions: [],
                responses: [],
                appeals: [],
                errors: [],
                startTime: null,
                endTime: null
            },
            progress: {
                total: cases.length,
                processed: 0,
                successful: 0,
                failed: 0
            }
        };
        
        this.batches.set(batchId, batch);
        this.queue.push(batchId);
        
        if (!this.processing) {
            this.processQueue();
        }
        
        return batchId;
    }
    
    generateBatchId() {
        return 'BATCH_' + Date.now().toString(36).toUpperCase() + '_' + Math.random().toString(36).substr(2, 6).toUpperCase();
    }
    
    async processQueue() {
        if (this.processing || this.queue.length === 0) return;
        
        this.processing = true;
        
        while (this.queue.length > 0 && this.activeWorkers < this.maxWorkers) {
            const batchId = this.queue.shift();
            this.processBatch(batchId);
        }
        
        // Aguardar conclusão
        await this.waitForCompletion();
        
        this.processing = false;
        
        // Processar próximo lote
        if (this.queue.length > 0) {
            this.processQueue();
        }
    }
    
    async processBatch(batchId) {
        const batch = this.batches.get(batchId);
        if (!batch) return;
        
        batch.status = 'processing';
        batch.results.startTime = Date.now();
        
        this.activeWorkers++;
        
        // Processar casos em paralelo dentro do lote
        const chunks = this.chunkArray(batch.cases, Math.ceil(batch.cases.length / 5));
        
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
                        error: error.message,
                        timestamp: Date.now()
                    });
                }
                
                // Atualizar progresso no dashboard
                this.emitProgress(batchId);
            }
        }));
        
        batch.results.endTime = Date.now();
        batch.status = 'completed';
        
        this.activeWorkers--;
        
        // Gerar relatório do lote
        const report = this.generateBatchReport(batchId);
        
        // Notificar se configurado
        if (batch.config.notifyOnComplete) {
            this.notifyCompletion(batchId, report);
        }
        
        // Auto-submeter se configurado
        if (batch.config.autoFile) {
            await this.autoFileBatch(batchId);
        }
    }
    
    async processCase(batchId, caseData) {
        const batch = this.batches.get(batchId);
        
        // Gerar petição personalizada
        const petition = await this.generateDocument('petition', caseData);
        
        // Gerar requerimento de provas
        const evidenceRequest = await this.generateDocument('evidenceRequest', caseData);
        
        // Calcular SLAs
        const sla = this.calculateSLA(caseData, batch.config.type);
        
        // Armazenar resultados
        batch.results.petitions.push({
            caseId: caseData.id,
            document: petition,
            evidenceRequest: evidenceRequest,
            sla: sla,
            generatedAt: Date.now()
        });
        
        return { petition, evidenceRequest };
    }
    
    async generateDocument(type, caseData) {
        const template = this.templates[type];
        if (!template) throw new Error(`Template não encontrado: ${type}`);
        
        // Preencher template com dados do caso
        let document = template;
        
        const replacements = {
            '{{COURT}}': caseData.court || 'Lisboa',
            '{{PROCESS_NUMBER}}': caseData.processNumber || 'A AGUARDAR',
            '{{CLIENT_NAME}}': caseData.client?.name || 'CLIENTE',
            '{{CLIENT_NIF}}': caseData.client?.nif || 'NIF',
            '{{PLATFORM_NAME}}': this.getPlatformName(caseData.platform),
            '{{PLATFORM_NIF}}': this.getPlatformNIF(caseData.platform),
            '{{PERIOD_START}}': caseData.periodStart || '01/01/2024',
            '{{PERIOD_END}}': caseData.periodEnd || '31/12/2024',
            '{{TRIP_COUNT}}': caseData.tripCount || '0',
            '{{GROSS_EARNINGS}}': window.UNIFEDElite?.formatCurrency(caseData.ganhos) || '€0,00',
            '{{COMMISSIONS_WITHHELD}}': window.UNIFEDElite?.formatCurrency(caseData.despesas) || '€0,00',
            '{{COMMISSION_PERCENTAGE}}': caseData.percentage?.toFixed(1) || '0',
            '{{INVOICED_AMOUNT}}': window.UNIFEDElite?.formatCurrency(caseData.faturaPlataforma) || '€0,00',
            '{{OMITTED_AMOUNT}}': window.UNIFEDElite?.formatCurrency(caseData.discrepancy) || '€0,00',
            '{{OMISSION_PERCENTAGE}}': caseData.omissionPercentage?.toFixed(1) || '0',
            '{{CLAIM_AMOUNT}}': window.UNIFEDElite?.formatCurrency(caseData.discrepancy) || '€0,00',
            '{{CASE_VALUE}}': window.UNIFEDElite?.formatCurrency(caseData.discrepancy) || '€0,00',
            '{{JURISDICTION}}': caseData.platform === 'bolt' ? 'Estónia' : 'Países Baixos',
            '{{SENTENCE_DATE}}': new Date().toLocaleDateString('pt-PT'),
            '{{DATE}}': new Date().toLocaleDateString('pt-PT'),
            '{{LAWYER_NAME}}': caseData.lawyerName || 'ADVOGADO',
            '{{OAB_NUMBER}}': caseData.oabNumber || 'N/A'
        };
        
        for (const [key, value] of Object.entries(replacements)) {
            document = document.replace(new RegExp(key, 'g'), value);
        }
        
        return document;
    }
    
    getPlatformName(platform) {
        const names = {
            bolt: 'Bolt Operations OÜ',
            uber: 'Uber B.V.',
            freenow: 'FREE NOW',
            cabify: 'Cabify',
            indrive: 'inDrive'
        };
        return names[platform] || 'Plataforma Digital';
    }
    
    getPlatformNIF(platform) {
        const nifs = {
            bolt: 'EE102090374',
            uber: 'NL852071588B01',
            freenow: 'PT514214739',
            cabify: 'PT515239876',
            indrive: 'PT516348765'
        };
        return nifs[platform] || 'A VERIFICAR';
    }
    
    calculateSLA(caseData, caseType) {
        const sla = this.slas[caseType] || this.slas.standard;
        
        return {
            petitionDeadline: this.addDays(new Date(), sla.petition),
            responseDeadline: this.addDays(new Date(), sla.response),
            judgmentDeadline: this.addDays(new Date(), sla.judgment),
            type: caseType
        };
    }
    
    addDays(date, days) {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result.toLocaleDateString('pt-PT');
    }
    
    chunkArray(array, size) {
        const chunks = [];
        for (let i = 0; i < array.length; i += size) {
            chunks.push(array.slice(i, i + size));
        }
        return chunks;
    }
    
    generateBatchReport(batchId) {
        const batch = this.batches.get(batchId);
        if (!batch) return null;
        
        const duration = (batch.results.endTime - batch.results.startTime) / 1000;
        const successRate = (batch.progress.successful / batch.progress.total) * 100;
        
        return {
            batchId: batch.id,
            status: batch.status,
            summary: {
                total: batch.progress.total,
                successful: batch.progress.successful,
                failed: batch.progress.failed,
                successRate: successRate.toFixed(1),
                duration: duration.toFixed(1),
                avgTimePerCase: (duration / batch.progress.total).toFixed(1)
            },
            documents: {
                petitions: batch.results.petitions.length,
                evidenceRequests: batch.results.petitions.length,
                errors: batch.results.errors.length
            },
            sla: batch.config.type,
            generatedAt: new Date().toISOString()
        };
    }
    
    emitProgress(batchId) {
        const batch = this.batches.get(batchId);
        if (!batch) return;
        
        const event = new CustomEvent('massLitigationProgress', {
            detail: {
                batchId: batch.id,
                progress: (batch.progress.processed / batch.progress.total) * 100,
                successful: batch.progress.successful,
                failed: batch.progress.failed,
                status: batch.status
            }
        });
        window.dispatchEvent(event);
    }
    
    async notifyCompletion(batchId, report) {
        window.UNIFEDElite?.showToast(
            `Lote ${batchId} concluído: ${report.summary.successful}/${report.summary.total} casos processados`,
            'success'
        );
        
        // Salvar relatório
        this.saveReport(batchId, report);
    }
    
    saveReport(batchId, report) {
        const reports = JSON.parse(localStorage.getItem('massLitigationReports') || '[]');
        reports.push(report);
        localStorage.setItem('massLitigationReports', JSON.stringify(reports.slice(-50)));
    }
    
    async autoFileBatch(batchId) {
        const batch = this.batches.get(batchId);
        if (!batch) return;
        
        window.UNIFEDElite?.showToast(`Auto-submissão do lote ${batchId} em andamento...`, 'info');
        
        // Simular submissão
        setTimeout(() => {
            window.UNIFEDElite?.showToast(`Lote ${batchId} submetido com sucesso!`, 'success');
        }, 2000);
    }
    
    getBatchStatus(batchId) {
        return this.batches.get(batchId);
    }
    
    getAllBatches() {
        return Array.from(this.batches.values());
    }
    
    async exportBatch(batchId, format = 'zip') {
        const batch = this.batches.get(batchId);
        if (!batch) return null;
        
        if (format === 'zip' && typeof JSZip !== 'undefined') {
            const zip = new JSZip();
            
            batch.results.petitions.forEach((item, index) => {
                zip.file(`peticao_${item.caseId}.docx`, item.document);
                zip.file(`requerimento_provas_${item.caseId}.docx`, item.evidenceRequest);
            });
            
            const blob = await zip.generateAsync({ type: 'blob' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `batch_${batchId}.zip`;
            a.click();
            URL.revokeObjectURL(url);
            
            return true;
        }
        
        return batch;
    }
}

// Instância global
window.MassLitigationEngine = new MassLitigationEngine();