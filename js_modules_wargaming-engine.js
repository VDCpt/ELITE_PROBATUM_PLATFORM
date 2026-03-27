/**
 * ============================================================================
 * ELITE PROBATUM v2.0.5 — MÓDULO DE RISK MITIGATION ENGINE
 * ANÁLISE DE RISCO ESTRATÉGICO E SIMULAÇÃO DE CENÁRIOS
 * ============================================================================
 * INOVAÇÃO ESTRATÉGICA:
 * Motor de Simulação de Risco (Stress Test de Prova)
 * 
 * Funcionalidades:
 * 1. IA atua como "Advogado da Parte Contrária" para testar evidências
 * 2. Geração automática dos 3 argumentos mais prováveis que a oposição usará
 * 3. Análise de fragilidades probatórias com score de vulnerabilidade
 * 4. Recomendações de reforço probatório antes da audiência
 * 5. Simulação de cross-examination com respostas otimizadas
 * ============================================================================
 */

class RiskMitigationEngine {
    constructor() {
        this.initialized = false;
        this.simulationHistory = [];
        this.attackPatterns = this.loadAttackPatterns();
        this.evidenceWeaknessDB = this.loadEvidenceWeaknesses();
        this.jurisprudenceAttacks = this.loadJurisprudenceAttacks();
        
        this.loadSimulationHistory();
    }
    
    /**
     * Inicializa o motor de análise de risco
     */
    initialize() {
        this.initialized = true;
        console.log('[ELITE] Risk Mitigation Engine inicializado - Simulação de Risco Ativa');
        return this;
    }
    
    /**
     * Carrega padrões de ataque comuns da oposição
     */
    loadAttackPatterns() {
        return {
            documentary: [
                {
                    id: 'ATT_DOC_001',
                    name: 'Impugnação de Autenticidade',
                    description: 'A parte contrária alega que o documento não foi assinado pelo representante legal',
                    likelihood: 0.85,
                    counterArguments: [
                        'Juntar procuração com poderes especiais',
                        'Apresentar testemunha da assinatura',
                        'Solicitar perícia grafotécnica'
                    ],
                    evidenceRequired: ['procuração', 'testemunha', 'perícia']
                },
                {
                    id: 'ATT_DOC_002',
                    name: 'Caducidade do Documento',
                    description: 'Alegação de que o documento perdeu validade por decurso de prazo',
                    likelihood: 0.72,
                    counterArguments: [
                        'Demonstrar que o prazo ainda não expirou',
                        'Apresentar prorrogação tácita',
                        'Invocar princípio da boa-fé'
                    ],
                    evidenceRequired: ['prazo_vigência', 'comunicações_posteriores']
                },
                {
                    id: 'ATT_DOC_003',
                    name: 'Falsidade Ideológica',
                    description: 'Alegação de que o conteúdo do documento não corresponde à realidade',
                    likelihood: 0.68,
                    counterArguments: [
                        'Apresentar documentos corroborantes',
                        'Juntar registos oficiais',
                        'Solicitar perícia contabilística'
                    ],
                    evidenceRequired: ['documentos_corroboração', 'registos_oficiais']
                }
            ],
            digital: [
                {
                    id: 'ATT_DIG_001',
                    name: 'Violação da Cadeia de Custódia',
                    description: 'Alegar que a prova digital foi adulterada durante a recolha',
                    likelihood: 0.92,
                    counterArguments: [
                        'Apresentar hash SHA-256 do momento da recolha',
                        'Demonstrar timestamp blockchain',
                        'Juntar relatório de perito forense'
                    ],
                    evidenceRequired: ['hash_original', 'timestamp', 'perícia_forense']
                },
                {
                    id: 'ATT_DIG_002',
                    name: 'Ausência de Metadados',
                    description: 'Contestar a origem do ficheiro por falta de metadados',
                    likelihood: 0.78,
                    counterArguments: [
                        'Extrair metadados com ferramenta forense',
                        'Apresentar logs do sistema de origem',
                        'Demonstrar continuidade de acesso'
                    ],
                    evidenceRequired: ['metadados_extraídos', 'logs_sistema']
                },
                {
                    id: 'ATT_DIG_003',
                    name: 'Manipulação de Timestamp',
                    description: 'Alegar que as datas foram alteradas',
                    likelihood: 0.65,
                    counterArguments: [
                        'Apresentar timestamp de terceiro confiável',
                        'Demonstrar consistência com outros ficheiros',
                        'Juntar certificado de autenticidade'
                    ],
                    evidenceRequired: ['timestamp_terceiro', 'consistência_cronológica']
                }
            ],
            testimonial: [
                {
                    id: 'ATT_TES_001',
                    name: 'Comprometimento da Testemunha',
                    description: 'Alegar que a testemunha tem interesse na causa',
                    likelihood: 0.88,
                    counterArguments: [
                        'Demonstrar imparcialidade',
                        'Apresentar outras testemunhas independentes',
                        'Reforçar com prova documental'
                    ],
                    evidenceRequired: ['declaração_imparcialidade', 'testemunhas_independentes']
                },
                {
                    id: 'ATT_TES_002',
                    name: 'Contradição em Depoimentos',
                    description: 'Explorar contradições entre depoimentos da mesma parte',
                    likelihood: 0.82,
                    counterArguments: [
                        'Sistematizar cronologia dos factos',
                        'Esclarecer pontos aparentemente contraditórios',
                        'Apresentar prova documental que resolve contradição'
                    ],
                    evidenceRequired: ['cronologia_sistematizada', 'documentos_corroboração']
                }
            ],
            expert: [
                {
                    id: 'ATT_EXP_001',
                    name: 'Falta de Especialização do Perito',
                    description: 'Contestar a qualificação técnica do perito',
                    likelihood: 0.75,
                    counterArguments: [
                        'Juntar currículo e credenciais',
                        'Demonstrar experiência na área',
                        'Apresentar publicações técnicas'
                    ],
                    evidenceRequired: ['currículo', 'credenciais', 'publicações']
                },
                {
                    id: 'ATT_EXP_002',
                    name: 'Metodologia Não Reconhecida',
                    description: 'Alegar que o método pericial não é aceite pela comunidade científica',
                    likelihood: 0.70,
                    counterArguments: [
                        'Citar normas técnicas aplicáveis',
                        'Demonstrar aceitação jurisprudencial',
                        'Apresentar literatura científica'
                    ],
                    evidenceRequired: ['normas_técnicas', 'jurisprudência', 'literatura']
                }
            ]
        };
    }
    
    /**
     * Carrega base de fragilidades probatórias
     */
    loadEvidenceWeaknesses() {
        return {
            documental: {
                sem_original: { risk: 0.85, description: 'Ausência de documento original', mitigation: 'Juntar cópia autenticada ou justificar perda' },
                sem_assinatura: { risk: 0.90, description: 'Documento sem assinatura', mitigation: 'Obter assinatura ou testemunha' },
                rasura: { risk: 0.75, description: 'Rasuras ou emendas não ressalvadas', mitigation: 'Esclarecer rasuras com documento complementar' },
                sem_data: { risk: 0.70, description: 'Documento sem data', mitigation: 'Demonstrar data por outros meios' }
            },
            digital: {
                sem_hash: { risk: 0.95, description: 'Ausência de hash de integridade', mitigation: 'Recalcular hash e registar em blockchain' },
                sem_timestamp: { risk: 0.88, description: 'Sem prova de timestamp', mitigation: 'Obter timestamp de autoridade certificadora' },
                origem_duvidosa: { risk: 0.82, description: 'Origem do ficheiro não comprovada', mitigation: 'Documentar cadeia de custódia' }
            },
            pericial: {
                unica_pericia: { risk: 0.78, description: 'Única perícia sem contraditório', mitigation: 'Solicitar segunda perícia ou assistente técnico' },
                sem_fundamentacao: { risk: 0.85, description: 'Laudo sem fundamentação técnica', mitigation: 'Complementar laudo com fundamentação' }
            }
        };
    }
    
    /**
     * Carrega ataques baseados em jurisprudência
     */
    loadJurisprudenceAttacks() {
        return [
            {
                id: 'JUR_001',
                title: 'Precedente Desfavorável',
                description: 'A oposição pode citar acórdão do STA que decidiu contra tese similar',
                citation: 'Acórdão do STA nº 0456/2024',
                applicableTo: ['tax', 'commercial'],
                counterStrategy: 'Diferenciar factualmente o caso ou invocar evolução legislativa',
                successProbability: 0.65
            },
            {
                id: 'JUR_002',
                title: 'Inversão do Ónus da Prova',
                description: 'A oposição pode invocar Art. 344 CC para inverter o ónus da prova',
                citation: 'Art. 344.º do Código Civil',
                applicableTo: ['all'],
                counterStrategy: 'Demonstrar que a parte contrária tem melhor acesso à prova',
                successProbability: 0.72
            },
            {
                id: 'JUR_003',
                title: 'Prescrição',
                description: 'A oposição pode alegar prescrição do direito',
                citation: 'Art. 309.º e ss. do Código Civil',
                applicableTo: ['civil', 'commercial', 'tax'],
                counterStrategy: 'Demonstrar interrupção ou suspensão da prescrição',
                successProbability: 0.58
            },
            {
                id: 'JUR_004',
                title: 'Caducidade do Direito',
                description: 'Alegar que o prazo para exercício do direito expirou',
                citation: 'Art. 328.º do Código Civil',
                applicableTo: ['labor', 'civil'],
                counterStrategy: 'Demonstrar que o prazo ainda não decorreu',
                successProbability: 0.62
            }
        ];
    }
    
    /**
     * Carrega histórico de simulações
     */
    loadSimulationHistory() {
        const stored = localStorage.getItem('elite_risk_mitigation_history');
        if (stored) {
            try {
                this.simulationHistory = JSON.parse(stored);
            } catch (e) {
                console.error('[ELITE] Erro ao carregar histórico:', e);
                this.simulationHistory = [];
            }
        }
    }
    
    /**
     * Salva histórico de simulações
     */
    saveSimulationHistory() {
        if (this.simulationHistory.length > 100) {
            this.simulationHistory = this.simulationHistory.slice(0, 100);
        }
        localStorage.setItem('elite_risk_mitigation_history', JSON.stringify(this.simulationHistory));
    }
    
    /**
     * Analisa evidências e gera ataques simulados da oposição
     * @param {Object} caseData - Dados do caso
     * @param {Array} evidenceList - Lista de evidências
     * @returns {Object} Resultado da simulação
     */
    simulateOppositionAttack(caseData, evidenceList) {
        if (!this.initialized) {
            this.initialize();
        }
        
        const attacks = [];
        const vulnerabilities = [];
        const recommendedReinforcements = [];
        
        // Analisar cada evidência
        for (const evidence of evidenceList) {
            const evidenceType = evidence.type || this.classifyEvidence(evidence);
            const attackPatterns = this.attackPatterns[evidenceType] || [];
            
            // Avaliar ataques aplicáveis
            for (const attack of attackPatterns) {
                const likelihood = this.calculateAttackLikelihood(attack, evidence, caseData);
                if (likelihood > 0.3) {
                    attacks.push({
                        attack: attack,
                        evidenceId: evidence.id,
                        evidenceName: evidence.name,
                        likelihood: likelihood,
                        severity: this.calculateSeverity(attack, evidence),
                        counterArguments: attack.counterArguments,
                        evidenceRequired: attack.evidenceRequired
                    });
                }
            }
            
            // Identificar vulnerabilidades
            const evidenceWeaknesses = this.identifyWeaknesses(evidence);
            if (evidenceWeaknesses.length > 0) {
                vulnerabilities.push({
                    evidenceId: evidence.id,
                    evidenceName: evidence.name,
                    weaknesses: evidenceWeaknesses,
                    overallRisk: this.calculateOverallRisk(evidenceWeaknesses)
                });
                
                // Gerar recomendações de reforço
                for (const weakness of evidenceWeaknesses) {
                    recommendedReinforcements.push({
                        evidenceId: evidence.id,
                        evidenceName: evidence.name,
                        weakness: weakness.description,
                        mitigation: weakness.mitigation,
                        priority: weakness.risk > 0.7 ? 'high' : 'medium'
                    });
                }
            }
        }
        
        // Analisar ataques baseados em jurisprudência
        const jurisprudenceAttacks = this.analyzeJurisprudenceAttacks(caseData);
        attacks.push(...jurisprudenceAttacks);
        
        // Ordenar ataques por probabilidade e severidade
        const sortedAttacks = attacks.sort((a, b) => {
            const scoreA = a.likelihood * (a.severity === 'high' ? 1.5 : 1);
            const scoreB = b.likelihood * (b.severity === 'high' ? 1.5 : 1);
            return scoreB - scoreA;
        });
        
        // Selecionar top 3 ataques mais prováveis
        const top3Attacks = sortedAttacks.slice(0, 3);
        
        // Gerar script de cross-examination simulado
        const crossExaminationScript = this.generateCrossExaminationScript(top3Attacks, caseData);
        
        // Gerar respostas otimizadas
        const optimizedResponses = this.generateOptimizedResponses(top3Attacks);
        
        const simulationResult = {
            simulationId: Date.now(),
            caseId: caseData.id,
            timestamp: new Date().toISOString(),
            attacks: top3Attacks,
            allAttacks: sortedAttacks,
            vulnerabilities: vulnerabilities,
            recommendedReinforcements: recommendedReinforcements,
            crossExaminationScript: crossExaminationScript,
            optimizedResponses: optimizedResponses,
            overallRiskScore: this.calculateOverallRiskScore(vulnerabilities, attacks),
            summary: this.generateSummary(top3Attacks, vulnerabilities)
        };
        
        // Registrar simulação no histórico
        this.simulationHistory.unshift(simulationResult);
        this.saveSimulationHistory();
        
        return simulationResult;
    }
    
    /**
     * Classifica tipo de evidência
     */
    classifyEvidence(evidence) {
        if (evidence.fileType === 'pdf' || evidence.fileType === 'docx' || evidence.type === 'documental') {
            return 'documentary';
        }
        if (evidence.fileType === 'jpg' || evidence.fileType === 'png' || evidence.type === 'digital') {
            return 'digital';
        }
        if (evidence.type === 'pericial' || evidence.fileName?.includes('pericia')) {
            return 'expert';
        }
        if (evidence.type === 'testemunhal') {
            return 'testimonial';
        }
        return 'documentary';
    }
    
    /**
     * Calcula probabilidade de um ataque ser usado
     */
    calculateAttackLikelihood(attack, evidence, caseData) {
        let likelihood = attack.likelihood;
        
        // Ajustar por força da evidência
        if (evidence.hash && evidence.timestampProof) {
            likelihood -= 0.2;
        }
        
        // Ajustar por tipo de caso
        if (caseData.category === 'tax' && attack.id === 'ATT_DOC_001') {
            likelihood += 0.1;
        }
        
        // Ajustar por valor da causa
        if (caseData.value > 1000000) {
            likelihood += 0.15;
        }
        
        return Math.min(Math.max(likelihood, 0.1), 0.95);
    }
    
    /**
     * Calcula severidade do ataque
     */
    calculateSeverity(attack, evidence) {
        if (attack.id === 'ATT_DIG_001' || attack.id === 'ATT_DOC_001') {
            return 'high';
        }
        if (attack.id === 'ATT_EXP_001' || attack.id === 'ATT_TES_001') {
            return 'high';
        }
        return 'medium';
    }
    
    /**
     * Identifica fragilidades da evidência
     */
    identifyWeaknesses(evidence) {
        const weaknesses = [];
        const evidenceType = this.classifyEvidence(evidence);
        const weaknessDB = this.evidenceWeaknesses[evidenceType];
        
        if (!weaknessDB) return weaknesses;
        
        // Verificar cada fragilidade conhecida
        if (evidenceType === 'digital') {
            if (!evidence.hash) {
                weaknesses.push(weaknessDB.sem_hash);
            }
            if (!evidence.timestampProof) {
                weaknesses.push(weaknessDB.sem_timestamp);
            }
        }
        
        if (evidenceType === 'documentary') {
            if (!evidence.originalFile && !evidence.isOriginal) {
                weaknesses.push(weaknessDB.sem_original);
            }
            if (!evidence.signature) {
                weaknesses.push(weaknessDB.sem_assinatura);
            }
        }
        
        if (evidenceType === 'expert') {
            if (!evidence.expertCredentials) {
                weaknesses.push(weaknessDB.sem_fundamentacao);
            }
        }
        
        return weaknesses;
    }
    
    /**
     * Calcula risco global da evidência
     */
    calculateOverallRisk(weaknesses) {
        if (weaknesses.length === 0) return 0;
        const totalRisk = weaknesses.reduce((sum, w) => sum + w.risk, 0);
        return totalRisk / weaknesses.length;
    }
    
    /**
     * Analisa ataques baseados em jurisprudência
     */
    analyzeJurisprudenceAttacks(caseData) {
        const attacks = [];
        
        for (const jur of this.jurisprudenceAttacks) {
            if (jur.applicableTo.includes('all') || jur.applicableTo.includes(caseData.category)) {
                attacks.push({
                    attack: {
                        id: jur.id,
                        name: jur.title,
                        description: jur.description,
                        counterArguments: [jur.counterStrategy],
                        evidenceRequired: []
                    },
                    evidenceId: 'jurisprudence',
                    evidenceName: 'Jurisprudência',
                    likelihood: jur.successProbability,
                    severity: 'high',
                    counterArguments: [jur.counterStrategy],
                    evidenceRequired: [],
                    citation: jur.citation
                });
            }
        }
        
        return attacks;
    }
    
    /**
     * Gera script de cross-examination simulado
     */
    generateCrossExaminationScript(attacks, caseData) {
        if (attacks.length === 0) {
            return 'Nenhum ataque significativo previsto. A prova parece robusta.';
        }
        
        let script = `=== SIMULAÇÃO DE CROSS-EXAMINATION ===\n\n`;
        script += `Caso: ${caseData.id} - ${caseData.client}\n`;
        script += `Tribunal: ${caseData.court}\n`;
        script += `Juiz: ${caseData.judge || 'A designar'}\n\n`;
        script += `A oposição provavelmente adotará a seguinte estratégia de ataque:\n\n`;
        
        for (let i = 0; i < attacks.length; i++) {
            const attack = attacks[i];
            script += `[ATAQUE ${i + 1}] ${attack.attack.name}\n`;
            script += `Probabilidade: ${(attack.likelihood * 100).toFixed(0)}%\n`;
            script += `"${attack.attack.description}"\n`;
            script += `Evidência alvo: ${attack.evidenceName}\n`;
            script += `\n`;
            script += `> COMO RESPONDER:\n`;
            script += attack.counterArguments.map(arg => `   - ${arg}`).join('\n');
            script += `\n\n`;
        }
        
        script += `\n=== ESTRATÉGIA RECOMENDADA ===\n`;
        script += `1. Reforçar as evidências identificadas como vulneráveis antes da audiência\n`;
        script += `2. Preparar testemunhas para responder aos ataques previstos\n`;
        script += `3. Ter à disposição os documentos contra-argumentativos durante a sessão\n`;
        
        return script;
    }
    
    /**
     * Gera respostas otimizadas para cada ataque
     */
    generateOptimizedResponses(attacks) {
        const responses = [];
        
        for (const attack of attacks) {
            responses.push({
                attack: attack.attack.name,
                likelihood: attack.likelihood,
                recommendedResponse: this.generateResponseText(attack),
                legalBasis: this.getLegalBasis(attack),
                supportingEvidence: attack.evidenceRequired
            });
        }
        
        return responses;
    }
    
    /**
     * Gera texto de resposta recomendada
     */
    generateResponseText(attack) {
        const responses = {
            'Impugnação de Autenticidade': 'Senhor Juiz, o documento em questão foi assinado eletronicamente com certificado qualificado, conforme comprovativo anexo (Doc. X), e a representante legal tinha poderes para o fazer, conforme procuração junta aos autos.',
            'Violação da Cadeia de Custódia': 'Excelência, o ficheiro foi recolhido com observância da norma ISO/IEC 27037, com hash SHA-256 registado em blockchain no momento exato da extração, conforme certificado de integridade anexo.',
            'Comprometimento da Testemunha': 'A testemunha não tem qualquer interesse na causa, sendo terceiro independente, e seu depoimento é corroborado por prova documental robusta (Docs. X, Y, Z).',
            'Falta de Especialização do Perito': 'O perito é engenheiro informático com 15 anos de experiência em forense digital, credenciado pela ENFSI, e já atuou como perito em mais de 50 processos similares, conforme curriculum anexo.',
            'Precedente Desfavorável': 'O acórdão citado pela oposição é distinguível do presente caso, pois os factos são substancialmente diferentes, nomeadamente [diferenciar factualmente].'
        };
        
        return responses[attack.attack.name] || 'A oposição provavelmente tentará este ataque. A estratégia recomendada é reforçar a evidência com documentação complementar e preparar testemunha para esclarecer o ponto.';
    }
    
    /**
     * Obtém base legal para resposta
     */
    getLegalBasis(attack) {
        const legalBasis = {
            'Impugnação de Autenticidade': 'Art. 376.º CC - Força probatória plena do documento autêntico',
            'Violação da Cadeia de Custódia': 'ISO/IEC 27037:2012 - Diretrizes para prova digital; Art. 125.º CPP',
            'Comprometimento da Testemunha': 'Art. 252.º CPC - Arguição de impedimento e suspeição',
            'Falta de Especialização do Perito': 'Art. 468.º CPC - Nomeação e qualificação do perito',
            'Precedente Desfavorável': 'Art. 8.º CPC - Jurisprudência como elemento de integração'
        };
        
        return legalBasis[attack.attack.name] || 'Fundamentação legal conforme Código de Processo Civil e legislação aplicável';
    }
    
    /**
     * Calcula score de risco global
     */
    calculateOverallRiskScore(vulnerabilities, attacks) {
        let riskScore = 0;
        
        for (const vuln of vulnerabilities) {
            riskScore += vuln.overallRisk * 0.4;
        }
        
        for (const attack of attacks) {
            riskScore += attack.likelihood * 0.6;
        }
        
        return Math.min(Math.max(riskScore * 100, 0), 100);
    }
    
    /**
     * Gera sumário executivo
     */
    generateSummary(attacks, vulnerabilities) {
        const highRiskAttacks = attacks.filter(a => a.severity === 'high');
        const criticalVulnerabilities = vulnerabilities.filter(v => v.overallRisk > 0.7);
        
        let summary = '';
        
        if (highRiskAttacks.length > 0) {
            summary += `⚠️ ATAQUES DE ALTA SEVERIDADE DETECTADOS: ${highRiskAttacks.length}\n`;
            summary += `   ${highRiskAttacks.map(a => `- ${a.attack.name}`).join('\n   ')}\n\n`;
        }
        
        if (criticalVulnerabilities.length > 0) {
            summary += `🔴 VULNERABILIDADES CRÍTICAS: ${criticalVulnerabilities.length}\n`;
            summary += `   ${criticalVulnerabilities.map(v => `- ${v.evidenceName}: ${v.weaknesses.map(w => w.description).join(', ')}`).join('\n   ')}\n\n`;
        }
        
        if (highRiskAttacks.length === 0 && criticalVulnerabilities.length === 0) {
            summary += `✅ PROVA ROBUSTA: Nenhum ataque de alta severidade ou vulnerabilidade crítica identificada.\n`;
        } else {
            summary += `📋 RECOMENDAÇÃO: Reforçar as evidências identificadas antes da audiência. Prioridade máxima para:\n`;
            summary += `   ${criticalVulnerabilities.slice(0, 3).map(v => `- ${v.evidenceName}`).join('\n   ')}`;
        }
        
        return summary;
    }
    
    /**
     * Obtém histórico de simulações
     */
    getSimulationHistory(limit = 10) {
        return this.simulationHistory.slice(0, limit);
    }
    
    /**
     * Gera relatório completo de simulação
     */
    generateReport(caseData, evidenceList) {
        const simulation = this.simulateOppositionAttack(caseData, evidenceList);
        
        return {
            generatedAt: new Date().toISOString(),
            caseId: caseData.id,
            caseValue: caseData.value,
            evidenceAnalyzed: evidenceList.length,
            attackCount: simulation.attacks.length,
            top3Attacks: simulation.attacks.map(a => ({
                name: a.attack.name,
                likelihood: (a.likelihood * 100).toFixed(0) + '%',
                severity: a.severity,
                counterArguments: a.counterArguments
            })),
            vulnerabilities: simulation.vulnerabilities.map(v => ({
                evidence: v.evidenceName,
                weaknesses: v.weaknesses.map(w => w.description),
                riskLevel: v.overallRisk > 0.7 ? 'Alto' : v.overallRisk > 0.4 ? 'Médio' : 'Baixo'
            })),
            recommendedActions: simulation.recommendedReinforcements.slice(0, 5),
            crossExaminationScript: simulation.crossExaminationScript,
            overallRiskScore: simulation.overallRiskScore.toFixed(0) + '%',
            recommendation: simulation.overallRiskScore > 70 ? 'REVISÃO URGENTE RECOMENDADA' :
                           simulation.overallRiskScore > 40 ? 'REFORÇO PROBATÓRIO RECOMENDADO' :
                           'PROVA ROBUSTA - SEGUIR ESTRATÉGIA ATUAL'
        };
    }
    
    /**
     * Renderiza dashboard de simulação de risco
     */
    renderDashboard(containerId, caseData, evidenceList) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const report = this.generateReport(caseData, evidenceList);
        
        container.innerHTML = `
            <div class="risk-mitigation-dashboard">
                <div class="dashboard-header">
                    <h2><i class="fas fa-chart-line"></i> ANÁLISE DE RISCO ESTRATÉGICO</h2>
                    <div class="risk-score ${report.overallRiskScore > 70 ? 'critical' : report.overallRiskScore > 40 ? 'warning' : 'safe'}">
                        <span class="score-value">${report.overallRiskScore}</span>
                        <span class="score-label">Risco Global</span>
                    </div>
                </div>
                
                <div class="summary-card">
                    <div class="summary-item">
                        <div class="summary-value">${report.attackCount}</div>
                        <div class="summary-label">Ataques Previstos</div>
                    </div>
                    <div class="summary-item">
                        <div class="summary-value">${report.vulnerabilities.length}</div>
                        <div class="summary-label">Vulnerabilidades</div>
                    </div>
                    <div class="summary-item">
                        <div class="summary-value">${report.evidenceAnalyzed}</div>
                        <div class="summary-label">Evidências Analisadas</div>
                    </div>
                </div>
                
                <div class="recommendation-banner ${report.overallRiskScore > 70 ? 'critical' : report.overallRiskScore > 40 ? 'warning' : 'safe'}">
                    <i class="fas ${report.overallRiskScore > 70 ? 'fa-skull' : report.overallRiskScore > 40 ? 'fa-exclamation-triangle' : 'fa-shield-alt'}"></i>
                    <span>${report.recommendation}</span>
                </div>
                
                <div class="attacks-section">
                    <h3><i class="fas fa-bullhorn"></i> TOP 3 ATAQUES PREVISTOS DA OPOSIÇÃO</h3>
                    ${report.top3Attacks.map((attack, idx) => `
                        <div class="attack-card severity-${attack.severity}">
                            <div class="attack-header">
                                <span class="attack-number">${idx + 1}</span>
                                <strong>${attack.name}</strong>
                                <span class="attack-likelihood">${attack.likelihood}</span>
                            </div>
                            <div class="attack-counter">
                                <strong>Como responder:</strong>
                                <ul>${attack.counterArguments.map(arg => `<li>${arg}</li>`).join('')}</ul>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="vulnerabilities-section">
                    <h3><i class="fas fa-shield-hooded"></i> VULNERABILIDADES IDENTIFICADAS</h3>
                    ${report.vulnerabilities.length === 0 ? 
                        '<div class="empty-state">✅ Nenhuma vulnerabilidade crítica identificada</div>' : 
                        report.vulnerabilities.map(v => `
                            <div class="vulnerability-card risk-${v.riskLevel.toLowerCase()}">
                                <div class="vulnerability-header">
                                    <strong>${v.evidence}</strong>
                                    <span class="risk-badge">${v.riskLevel}</span>
                                </div>
                                <ul>${v.weaknesses.map(w => `<li>${w}</li>`).join('')}</ul>
                            </div>
                        `).join('')}
                </div>
                
                <div class="actions-section">
                    <h3><i class="fas fa-tasks"></i> AÇÕES RECOMENDADAS</h3>
                    ${report.recommendedActions.map(action => `
                        <div class="action-card priority-${action.priority}">
                            <div class="action-header">
                                <i class="fas ${action.priority === 'high' ? 'fa-urgent' : 'fa-clock'}"></i>
                                <strong>${action.evidenceName}</strong>
                                <span class="priority-badge">${action.priority === 'high' ? 'URGENTE' : 'PRIORIDADE MÉDIA'}</span>
                            </div>
                            <p><strong>Vulnerabilidade:</strong> ${action.weakness}</p>
                            <p><strong>Mitigação:</strong> ${action.mitigation}</p>
                        </div>
                    `).join('')}
                </div>
                
                <div class="cross-examination-section">
                    <h3><i class="fas fa-gavel"></i> SIMULAÇÃO DE CROSS-EXAMINATION</h3>
                    <div class="script-box">
                        <pre>${report.crossExaminationScript}</pre>
                    </div>
                    <button id="copyScriptBtn" class="elite-btn secondary"><i class="fas fa-copy"></i> COPIAR SCRIPT</button>
                </div>
            </div>
        `;
        
        // Estilos adicionais
        const style = document.createElement('style');
        style.textContent = `
            .risk-mitigation-dashboard { padding: 0; }
            .risk-score { text-align: center; padding: 16px; border-radius: 16px; background: var(--bg-terminal); }
            .risk-score.critical { border-left: 4px solid #ff1744; }
            .risk-score.warning { border-left: 4px solid #ffc107; }
            .risk-score.safe { border-left: 4px solid #00e676; }
            .score-value { font-size: 2.5rem; font-weight: 800; font-family: 'JetBrains Mono'; }
            .score-label { font-size: 0.7rem; color: #94a3b8; }
            .summary-card { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; background: var(--bg-command); border-radius: 16px; padding: 20px; margin: 20px 0; }
            .summary-item { text-align: center; }
            .summary-value { font-size: 1.8rem; font-weight: 800; color: var(--elite-primary); }
            .summary-label { font-size: 0.7rem; color: #94a3b8; }
            .recommendation-banner { padding: 16px; border-radius: 12px; margin: 20px 0; display: flex; align-items: center; gap: 12px; font-weight: 600; }
            .recommendation-banner.critical { background: rgba(255, 23, 68, 0.1); border-left: 4px solid #ff1744; color: #ff1744; }
            .recommendation-banner.warning { background: rgba(255, 193, 7, 0.1); border-left: 4px solid #ffc107; color: #ffc107; }
            .recommendation-banner.safe { background: rgba(0, 230, 118, 0.1); border-left: 4px solid #00e676; color: #00e676; }
            .attack-card { background: var(--bg-terminal); border-radius: 12px; padding: 16px; margin-bottom: 12px; border-left: 4px solid; }
            .attack-card.severity-high { border-left-color: #ff1744; }
            .attack-card.severity-medium { border-left-color: #ffc107; }
            .attack-header { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
            .attack-number { width: 28px; height: 28px; background: var(--elite-primary-dim); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: bold; }
            .attack-likelihood { margin-left: auto; background: rgba(0, 229, 255, 0.1); padding: 2px 8px; border-radius: 12px; font-size: 0.7rem; }
            .attack-counter ul { margin: 8px 0 0 20px; font-size: 0.75rem; color: #94a3b8; }
            .vulnerability-card { background: var(--bg-terminal); border-radius: 12px; padding: 16px; margin-bottom: 12px; }
            .vulnerability-card.risk-alto { border-left: 3px solid #ff1744; }
            .vulnerability-card.risk-médio { border-left: 3px solid #ffc107; }
            .vulnerability-card.risk-baixo { border-left: 3px solid #00e676; }
            .vulnerability-header { display: flex; justify-content: space-between; margin-bottom: 8px; }
            .risk-badge { font-size: 0.6rem; padding: 2px 8px; border-radius: 12px; }
            .action-card { background: var(--bg-terminal); border-radius: 12px; padding: 16px; margin-bottom: 12px; }
            .action-card.priority-high { border-left: 3px solid #ff1744; }
            .action-card.priority-medium { border-left: 3px solid #ffc107; }
            .action-header { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; }
            .priority-badge { margin-left: auto; font-size: 0.6rem; padding: 2px 8px; border-radius: 12px; background: rgba(255, 23, 68, 0.1); color: #ff1744; }
            .script-box { background: var(--bg-terminal); border-radius: 12px; padding: 16px; margin: 16px 0; font-family: 'JetBrains Mono'; font-size: 0.75rem; white-space: pre-wrap; max-height: 400px; overflow-y: auto; }
            #copyScriptBtn { margin-top: 8px; }
        `;
        container.appendChild(style);
        
        document.getElementById('copyScriptBtn')?.addEventListener('click', () => {
            const scriptText = document.querySelector('.script-box pre')?.innerText;
            if (scriptText) {
                navigator.clipboard.writeText(scriptText);
                if (window.EliteUtils) window.EliteUtils.showToast('Script copiado para área de transferência', 'success');
            }
        });
    }
}

// Instância global - mantendo compatibilidade com nome antigo para não quebrar referências
window.WargamingEngine = new RiskMitigationEngine();
window.RiskMitigationEngine = window.WargamingEngine;

console.log('[ELITE] Risk Mitigation Engine carregado - Análise de Risco Estratégico Ativa');