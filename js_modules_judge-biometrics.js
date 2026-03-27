/**
 * ============================================================================
 * ELITE PROBATUM — MÓDULO DE BIOMETRIA DE MAGISTRADOS
 * ============================================================================
 * INOVAÇÃO DISRUPTIVA #2:
 * Digital Twin de Magistrados - Análise de Padrões Decisórios
 * 
 * Funcionalidades:
 * 1. Análise de semântica processual para identificar padrões de decisão
 * 2. Perfil biométrico do magistrado (extensão, tom, jurisprudência preferida)
 * 3. Sugestão adaptativa de escrita processual
 * 4. Previsão de reação a argumentos específicos
 * 5. Score de alinhamento entre peça processual e perfil do juiz
 * ============================================================================
 */

class JudgeBiometrics {
    constructor() {
        this.judgeProfiles = this.loadJudgeProfiles();
        this.decisionPatterns = this.loadDecisionPatterns();
        this.writingSuggestions = this.loadWritingSuggestions();
        this.initialized = false;
        
        this.loadJudgeHistory();
    }
    
    /**
     * Inicializa o módulo de biometria de magistrados
     */
    initialize() {
        this.initialized = true;
        console.log('[ELITE] Judge Biometrics inicializado - Digital Twin de Magistrados Ativo');
        return this;
    }
    
    /**
     * Carrega perfis biométricos de magistrados
     */
    loadJudgeProfiles() {
        return {
            'Dr. António Costa': {
                id: 'judge_001',
                name: 'Dr. António Costa',
                court: 'Tribunal Judicial de Lisboa',
                biometrics: {
                    // Preferências de extensão (0-100, onde 0 = conciso, 100 = extenso)
                    preferredLength: 65,
                    // Tolerância a linguagem técnica (0-100)
                    technicalTolerance: 85,
                    // Preferência por jurisprudência de tribunais superiores (0-100)
                    higherCourtPreference: 90,
                    // Sensibilidade a argumentos de equidade (0-100)
                    equitySensitivity: 45,
                    // Rigor formal (0-100)
                    formalityRigor: 80,
                    // Preferência por prova documental vs testemunhal (0=testemunhal, 100=documental)
                    evidencePreference: 85,
                    // Tempo médio de decisão (dias)
                    avgDecisionTime: 120,
                    // Taxa de concessão de tutelas antecipadas
                    injunctionRate: 0.72
                },
                semanticProfile: {
                    preferredKeywords: [
                        'prova documental', 'art. 376.º CC', 'força probatória', 'documento autêntico',
                        'jurisprudência consolidada', 'STA', 'STJ', 'acórdão uniformizador'
                    ],
                    avoidedKeywords: [
                        'equidade', 'justiça social', 'solidariedade', 'interpretação extensiva'
                    ],
                    preferredCitations: ['STA', 'STJ', 'Constitucional'],
                    argumentStructure: 'deductive', // dedutivo: tese → fundamentos → conclusão
                    rejectionTriggers: [
                        'falta de fundamentação', 'ausência de prova documental', 'mera alegação'
                    ]
                },
                decisionHistory: {
                    total: 156,
                    favorable: 106,
                    unfavorable: 50,
                    byArea: {
                        fiscal: { total: 68, favorable: 48, unfavorable: 20 },
                        comercial: { total: 42, favorable: 30, unfavorable: 12 },
                        civil: { total: 46, favorable: 28, unfavorable: 18 }
                    },
                    byPageCount: {
                        '1-10': { cases: 12, favorable: 8, unfavorable: 4 },
                        '11-20': { cases: 28, favorable: 22, unfavorable: 6 },
                        '21-30': { cases: 42, favorable: 30, unfavorable: 12 },
                        '31+': { cases: 74, favorable: 46, unfavorable: 28 }
                    }
                }
            },
            'Dra. Sofia Mendes': {
                id: 'judge_002',
                name: 'Dra. Sofia Mendes',
                court: 'Tribunal Judicial do Porto',
                biometrics: {
                    preferredLength: 45,
                    technicalTolerance: 70,
                    higherCourtPreference: 65,
                    equitySensitivity: 75,
                    formalityRigor: 55,
                    evidencePreference: 60,
                    avgDecisionTime: 95,
                    injunctionRate: 0.85
                },
                semanticProfile: {
                    preferredKeywords: [
                        'trabalhador', 'despedimento ilícito', 'contrato de trabalho', 'boa-fé',
                        'princípio da proteção', 'justiça social', 'equidade'
                    ],
                    avoidedKeywords: [
                        'formalismo excessivo', 'interpretação restritiva', 'caducidade'
                    ],
                    preferredCitations: ['Trabalho', 'Constitucional', 'TJUE'],
                    argumentStructure: 'inductive', // indutivo: factos → tese → conclusão
                    rejectionTriggers: [
                        'falta de prova testemunhal', 'formalismo', 'desconsideração da realidade social'
                    ]
                },
                decisionHistory: {
                    total: 98,
                    favorable: 71,
                    unfavorable: 27,
                    byArea: {
                        labor: { total: 45, favorable: 36, unfavorable: 9 },
                        civil: { total: 32, favorable: 22, unfavorable: 10 },
                        family: { total: 21, favorable: 13, unfavorable: 8 }
                    },
                    byPageCount: {
                        '1-10': { cases: 24, favorable: 20, unfavorable: 4 },
                        '11-20': { cases: 38, favorable: 28, unfavorable: 10 },
                        '21-30': { cases: 22, favorable: 15, unfavorable: 7 },
                        '31+': { cases: 14, favorable: 8, unfavorable: 6 }
                    }
                }
            },
            'Dr. Ricardo Alves': {
                id: 'judge_003',
                name: 'Dr. Ricardo Alves',
                court: 'Tribunal Judicial de Braga',
                biometrics: {
                    preferredLength: 35,
                    technicalTolerance: 55,
                    higherCourtPreference: 60,
                    equitySensitivity: 40,
                    formalityRigor: 75,
                    evidencePreference: 50,
                    avgDecisionTime: 110,
                    injunctionRate: 0.45
                },
                semanticProfile: {
                    preferredKeywords: [
                        'precedente', 'jurisprudência', 'acórdão', 'súmula', 'orientação consolidada'
                    ],
                    avoidedKeywords: [
                        'inovação', 'interpretação evolutiva', 'teoria geral do direito'
                    ],
                    preferredCitations: ['STJ', 'Relação'],
                    argumentStructure: 'deductive',
                    rejectionTriggers: [
                        'teses inovadoras', 'ausência de precedente', 'argumentação especulativa'
                    ]
                },
                decisionHistory: {
                    total: 210,
                    favorable: 122,
                    unfavorable: 88,
                    byArea: {
                        penal: { total: 85, favorable: 48, unfavorable: 37 },
                        civil: { total: 125, favorable: 74, unfavorable: 51 }
                    },
                    byPageCount: {
                        '1-10': { cases: 68, favorable: 45, unfavorable: 23 },
                        '11-20': { cases: 82, favorable: 48, unfavorable: 34 },
                        '21-30': { cases: 42, favorable: 22, unfavorable: 20 },
                        '31+': { cases: 18, favorable: 7, unfavorable: 11 }
                    }
                }
            },
            'Dr. Pedro Santos': {
                id: 'judge_005',
                name: 'Dr. Pedro Santos',
                court: 'Tribunal Arbitral (CAAD)',
                biometrics: {
                    preferredLength: 25,
                    technicalTolerance: 90,
                    higherCourtPreference: 85,
                    equitySensitivity: 30,
                    formalityRigor: 70,
                    evidencePreference: 95,
                    avgDecisionTime: 65,
                    injunctionRate: 0.92
                },
                semanticProfile: {
                    preferredKeywords: [
                        'eficiência', 'celeridade', 'prova digital', 'normas técnicas',
                        'ISO', 'algoritmo', 'hash', 'blockchain'
                    ],
                    avoidedKeywords: [
                        'formalismo', 'dilação probatória', 'questões prévias'
                    ],
                    preferredCitations: ['CAAD', 'arbitragem', 'normas técnicas'],
                    argumentStructure: 'analytical',
                    rejectionTriggers: [
                        'dilações', 'falta de prova pericial', 'complexidade desnecessária'
                    ]
                },
                decisionHistory: {
                    total: 48,
                    favorable: 39,
                    unfavorable: 9,
                    byArea: {
                        fiscal: { total: 32, favorable: 27, unfavorable: 5 },
                        arbitragem: { total: 16, favorable: 12, unfavorable: 4 }
                    },
                    byPageCount: {
                        '1-10': { cases: 28, favorable: 24, unfavorable: 4 },
                        '11-20': { cases: 15, favorable: 11, unfavorable: 4 },
                        '21+': { cases: 5, favorable: 4, unfavorable: 1 }
                    }
                }
            }
        };
    }
    
    /**
     * Carrega padrões de decisão
     */
    loadDecisionPatterns() {
        return {
            lengthCorrelation: [
                { range: [0, 15], impact: -0.05, description: 'Peças muito curtas podem ser vistas como superficiais' },
                { range: [15, 30], impact: 0.08, description: 'Extensão ideal para maioria dos magistrados' },
                { range: [30, 50], impact: 0.03, description: 'Extensão aceitável para casos complexos' },
                { range: [50, 100], impact: -0.10, description: 'Peças excessivamente longas podem prejudicar aceitação' }
            ],
            technicalLanguageCorrelation: {
                low: { impact: -0.15, judges: ['Dra. Sofia Mendes'] },
                medium: { impact: 0, judges: [] },
                high: { impact: 0.12, judges: ['Dr. António Costa', 'Dr. Pedro Santos'] }
            },
            citationPreference: {
                STA: { impact: 0.08, judges: ['Dr. António Costa'] },
                STJ: { impact: 0.05, judges: ['Dr. António Costa', 'Dr. Ricardo Alves'] },
                Constitucional: { impact: 0.03, judges: ['Dra. Sofia Mendes'] },
                TJUE: { impact: 0.04, judges: ['Dra. Sofia Mendes'] },
                Doutrina: { impact: -0.05, judges: ['Dr. Ricardo Alves'] }
            }
        };
    }
    
    /**
     * Carrega sugestões de escrita adaptativa
     */
    loadWritingSuggestions() {
        return {
            opening: {
                formal: 'Excelentíssimo Senhor Doutor Juiz de Direito do Tribunal Judicial da Comarca de {court}',
                concise: 'Exmo. Senhor Juiz do Tribunal Judicial de {court}',
                direct: 'Ao Juiz do Tribunal Judicial de {court}'
            },
            facts: {
                deductive: 'Os factos relevantes para a decisão da causa são os seguintes:',
                inductive: 'Da análise dos autos resulta a seguinte factualidade:',
                analytical: 'Considerando os elementos probatórios juntos, verifica-se que:'
            },
            law: {
                deductive: 'Nos termos do disposto no artigo {article}, impõe-se concluir que:',
                inductive: 'A factualidade descrita subsume-se ao preceituado no artigo {article}, pois:',
                analytical: 'À luz do regime jurídico aplicável (art. {article}), a solução é:'
            },
            conclusion: {
                formal: 'Termos em que requer a V. Exa. se digne:',
                concise: 'Pelo exposto, requer-se:',
                direct: 'Assim, requer:'
            }
        };
    }
    
    /**
     * Carrega histórico de decisões
     */
    loadJudgeHistory() {
        const stored = localStorage.getItem('elite_judge_history');
        if (stored) {
            try {
                const history = JSON.parse(stored);
                for (const [key, value] of Object.entries(history)) {
                    if (this.judgeProfiles[key]) {
                        this.judgeProfiles[key].decisionHistory = value;
                    }
                }
            } catch (e) {
                console.error('[ELITE] Erro ao carregar histórico de juízes:', e);
            }
        }
    }
    
    /**
     * Salva histórico de decisões
     */
    saveJudgeHistory() {
        const history = {};
        for (const [key, profile] of Object.entries(this.judgeProfiles)) {
            history[key] = profile.decisionHistory;
        }
        localStorage.setItem('elite_judge_history', JSON.stringify(history));
    }
    
    /**
     * Obtém perfil biométrico completo de um magistrado
     */
    getJudgeBiometricProfile(judgeName) {
        return this.judgeProfiles[judgeName] || null;
    }
    
    /**
     * Analisa compatibilidade de uma peça processual com o perfil do juiz
     * @param {Object} judgeProfile - Perfil do magistrado
     * @param {Object} document - Estrutura da peça processual
     * @returns {Object} Score de alinhamento e recomendações
     */
    analyzeDocumentCompatibility(judgeProfile, document) {
        if (!judgeProfile) return null;
        
        const biometrics = judgeProfile.biometrics;
        const semanticProfile = judgeProfile.semanticProfile;
        
        let score = 0;
        let recommendations = [];
        let adjustments = [];
        
        // 1. Análise de extensão
        const pageCount = document.pageCount || 20;
        const lengthIdeal = biometrics.preferredLength;
        const lengthDeviation = Math.abs(pageCount - lengthIdeal) / 50;
        const lengthScore = Math.max(0, 100 - (lengthDeviation * 100));
        score += lengthScore * 0.2;
        
        if (pageCount > lengthIdeal + 20) {
            recommendations.push({
                type: 'length',
                severity: 'warning',
                message: `Peça muito extensa (${pageCount} páginas). O magistrado tende a preferir documentos mais concisos (${lengthIdeal} páginas ideal).`,
                suggestion: 'Reduzir a extensão mantendo os argumentos essenciais; remover repetições.'
            });
            adjustments.push({
                field: 'length',
                current: pageCount,
                recommended: lengthIdeal,
                action: 'condensar'
            });
        } else if (pageCount < lengthIdeal - 15) {
            recommendations.push({
                type: 'length',
                severity: 'info',
                message: `Peça muito concisa (${pageCount} páginas). Pode ser necessário maior detalhamento para este magistrado.`,
                suggestion: 'Adicionar fundamentação complementar e jurisprudência relevante.'
            });
            adjustments.push({
                field: 'length',
                current: pageCount,
                recommended: lengthIdeal,
                action: 'expandir'
            });
        }
        
        // 2. Análise de linguagem técnica
        const technicalLevel = document.technicalLevel || 70;
        const technicalDeviation = Math.abs(technicalLevel - biometrics.technicalTolerance) / 50;
        const technicalScore = Math.max(0, 100 - (technicalDeviation * 100));
        score += technicalScore * 0.15;
        
        if (technicalLevel > biometrics.technicalTolerance + 20) {
            recommendations.push({
                type: 'technical',
                severity: 'warning',
                message: 'Linguagem excessivamente técnica para o perfil deste magistrado.',
                suggestion: 'Simplificar a linguagem, explicar conceitos técnicos de forma acessível.'
            });
        } else if (technicalLevel < biometrics.technicalTolerance - 20) {
            recommendations.push({
                type: 'technical',
                severity: 'info',
                message: 'Linguagem pode ser insuficientemente técnica para este magistrado.',
                suggestion: 'Reforçar a fundamentação técnica com citações doutrinárias e normas.'
            });
        }
        
        // 3. Análise de keywords preferidas
        const keywordMatch = this.analyzeKeywords(document.text || '', semanticProfile.preferredKeywords);
        const keywordScore = (keywordMatch / semanticProfile.preferredKeywords.length) * 100;
        score += keywordScore * 0.2;
        
        if (keywordMatch < semanticProfile.preferredKeywords.length * 0.5) {
            recommendations.push({
                type: 'keywords',
                severity: 'medium',
                message: 'Ausência de keywords preferidas pelo magistrado.',
                suggestion: `Incluir referências a: ${semanticProfile.preferredKeywords.slice(0, 3).join(', ')}.`
            });
            adjustments.push({
                field: 'keywords',
                missing: semanticProfile.preferredKeywords.slice(0, 5),
                action: 'add_keywords'
            });
        }
        
        // 4. Análise de keywords evitadas
        const avoidedMatch = this.analyzeKeywords(document.text || '', semanticProfile.avoidedKeywords);
        if (avoidedMatch > 0) {
            const avoidedScore = Math.max(0, 100 - (avoidedMatch * 20));
            score += avoidedScore * 0.1;
            recommendations.push({
                type: 'avoided',
                severity: 'warning',
                message: `Utilização de ${avoidedMatch} termos que o magistrado tende a evitar.`,
                suggestion: `Substituir ou remover: ${semanticProfile.avoidedKeywords.slice(0, 3).join(', ')}.`
            });
        }
        
        // 5. Análise de citações jurisprudenciais
        const citations = document.citations || [];
        const preferredCitations = semanticProfile.preferredCitations;
        const citationMatch = citations.filter(c => preferredCitations.includes(c.court)).length;
        const citationScore = (citationMatch / Math.max(citations.length, 1)) * 100;
        score += citationScore * 0.15;
        
        if (citationMatch === 0 && citations.length > 0) {
            recommendations.push({
                type: 'citations',
                severity: 'medium',
                message: 'Citações de tribunais não preferidos por este magistrado.',
                suggestion: `Priorizar citações de: ${preferredCitations.join(', ')}.`
            });
        }
        
        // 6. Análise de estrutura argumentativa
        const structureMatch = document.argumentStructure === semanticProfile.argumentStructure;
        const structureScore = structureMatch ? 100 : 50;
        score += structureScore * 0.1;
        
        if (!structureMatch) {
            recommendations.push({
                type: 'structure',
                severity: 'info',
                message: `Estrutura argumentativa diferente da preferida.`,
                suggestion: `O magistrado prefere estrutura ${semanticProfile.argumentStructure === 'deductive' ? 'dedutiva (tese → fundamentos → conclusão)' : 'indutiva (factos → tese → conclusão)'}.`
            });
        }
        
        // 7. Análise de probabilidade de tutela antecipada
        const injunctionProbability = this.predictInjunctionProbability(judgeProfile, document);
        
        // Calcular score final (0-100)
        const finalScore = Math.min(Math.max(score, 0), 100);
        
        // Gerar versão adaptada da peça
        const adaptedVersion = this.generateAdaptedVersion(document, judgeProfile, adjustments);
        
        return {
            judge: judgeProfile.name,
            court: judgeProfile.court,
            compatibilityScore: finalScore,
            injunctionProbability: injunctionProbability,
            recommendations: recommendations,
            adjustments: adjustments,
            adaptedVersion: adaptedVersion,
            metrics: {
                lengthScore: lengthScore.toFixed(0),
                technicalScore: technicalScore.toFixed(0),
                keywordScore: keywordScore.toFixed(0),
                citationScore: citationScore.toFixed(0),
                structureScore: structureScore
            },
            summary: this.generateCompatibilitySummary(finalScore, recommendations, injunctionProbability)
        };
    }
    
    /**
     * Analisa keywords no texto
     */
    analyzeKeywords(text, keywords) {
        if (!text) return 0;
        const lowerText = text.toLowerCase();
        let matchCount = 0;
        for (const keyword of keywords) {
            if (lowerText.includes(keyword.toLowerCase())) {
                matchCount++;
            }
        }
        return matchCount;
    }
    
    /**
     * Prediz probabilidade de concessão de tutela antecipada
     */
    predictInjunctionProbability(judgeProfile, document) {
        let probability = judgeProfile.biometrics.injunctionRate;
        
        // Ajustar por urgência do caso
        if (document.hasUrgency) {
            probability += 0.1;
        }
        
        // Ajustar por qualidade da prova
        if (document.hasStrongEvidence) {
            probability += 0.08;
        }
        
        // Ajustar por adequação da peça
        if (document.hasProperInjunctionRequest) {
            probability += 0.05;
        }
        
        return Math.min(Math.max(probability, 0.1), 0.98);
    }
    
    /**
     * Gera versão adaptada da peça processual
     */
    generateAdaptedVersion(document, judgeProfile, adjustments) {
        const biometrics = judgeProfile.biometrics;
        const semanticProfile = judgeProfile.semanticProfile;
        const writingStyle = this.writingSuggestions;
        
        let adapted = '';
        
        // Adaptar abertura
        if (biometrics.formalityRigor > 70) {
            adapted += writingStyle.opening.formal.replace('{court}', judgeProfile.court) + '\n\n';
        } else if (biometrics.formalityRigor > 50) {
            adapted += writingStyle.opening.concise.replace('{court}', judgeProfile.court) + '\n\n';
        } else {
            adapted += writingStyle.opening.direct.replace('{court}', judgeProfile.court) + '\n\n';
        }
        
        // Adaptar estrutura argumentativa
        if (semanticProfile.argumentStructure === 'deductive') {
            adapted += writingStyle.facts.deductive + '\n\n';
            adapted += '[SÍNTESE DOS FACTOS ESSENCIAIS]\n\n';
            adapted += writingStyle.law.deductive.replace('{article}', 'XX') + '\n\n';
            adapted += '[FUNDAMENTAÇÃO JURÍDICA]\n\n';
        } else if (semanticProfile.argumentStructure === 'inductive') {
            adapted += writingStyle.facts.inductive + '\n\n';
            adapted += '[NARRATIVA DETALHADA DOS FACTOS]\n\n';
            adapted += writingStyle.law.inductive.replace('{article}', 'XX') + '\n\n';
            adapted += '[ANÁLISE JURÍDICA]\n\n';
        } else {
            adapted += writingStyle.facts.analytical + '\n\n';
            adapted += '[ANÁLISE FACTUAL E PROBATÓRIA]\n\n';
            adapted += writingStyle.law.analytical.replace('{article}', 'XX') + '\n\n';
            adapted += '[SUBSUNÇÃO JURÍDICA]\n\n';
        }
        
        // Adicionar keywords preferidas
        if (semanticProfile.preferredKeywords.length > 0) {
            adapted += `\n**Termos de referência:** ${semanticProfile.preferredKeywords.slice(0, 5).join(', ')}\n\n`;
        }
        
        // Adaptar conclusão
        if (biometrics.formalityRigor > 70) {
            adapted += writingStyle.conclusion.formal + '\n\n';
        } else if (biometrics.formalityRigor > 50) {
            adapted += writingStyle.conclusion.concise + '\n\n';
        } else {
            adapted += writingStyle.conclusion.direct + '\n\n';
        }
        
        adapted += '[PEDIDOS]\n\n';
        adapted += `${judgeProfile.court}, ${new Date().toLocaleDateString('pt-PT')}\n`;
        adapted += `O Advogado, [NOME]\n`;
        
        return adapted;
    }
    
    /**
     * Gera sumário de compatibilidade
     */
    generateCompatibilitySummary(score, recommendations, injunctionProbability) {
        let status = '';
        let color = '';
        
        if (score >= 80) {
            status = 'ALTA COMPATIBILIDADE';
            color = '#00e676';
        } else if (score >= 60) {
            status = 'COMPATIBILIDADE MODERADA';
            color = '#ffc107';
        } else {
            status = 'BAIXA COMPATIBILIDADE - REVISÃO NECESSÁRIA';
            color = '#ff1744';
        }
        
        const highPriorityRecs = recommendations.filter(r => r.severity === 'warning').length;
        
        return {
            status: status,
            color: color,
            score: score.toFixed(0),
            injunctionProbability: (injunctionProbability * 100).toFixed(0),
            priorityActions: highPriorityRecs,
            recommendation: highPriorityRecs > 0 ? 'Revisão recomendada antes da submissão' : 'Peça alinhada com perfil do magistrado'
        };
    }
    
    /**
     * Obtém previsão de reação a um argumento específico
     */
    predictReaction(judgeProfile, argument, argumentType) {
        if (!judgeProfile) return null;
        
        const semanticProfile = judgeProfile.semanticProfile;
        let acceptanceProbability = 0.5;
        let reasoning = [];
        
        // Analisar argumento por keywords
        const argumentLower = argument.toLowerCase();
        
        // Verificar keywords preferidas
        const preferredMatches = semanticProfile.preferredKeywords.filter(k => 
            argumentLower.includes(k.toLowerCase())
        );
        if (preferredMatches.length > 0) {
            acceptanceProbability += 0.1 * Math.min(preferredMatches.length, 3);
            reasoning.push(`+ Contém ${preferredMatches.length} termo(s) preferido(s): ${preferredMatches.join(', ')}`);
        }
        
        // Verificar keywords evitadas
        const avoidedMatches = semanticProfile.avoidedKeywords.filter(k => 
            argumentLower.includes(k.toLowerCase())
        );
        if (avoidedMatches.length > 0) {
            acceptanceProbability -= 0.15 * avoidedMatches.length;
            reasoning.push(`- Contém termo(s) evitado(s): ${avoidedMatches.join(', ')}`);
        }
        
        // Analisar tipo de argumento
        if (argumentType === 'jurisprudential') {
            if (semanticProfile.preferredCitations.includes('STA') && argumentLower.includes('sta')) {
                acceptanceProbability += 0.12;
                reasoning.push('+ Citação de STA (preferido pelo magistrado)');
            }
            if (semanticProfile.preferredCitations.includes('STJ') && argumentLower.includes('stj')) {
                acceptanceProbability += 0.08;
                reasoning.push('+ Citação de STJ (aceito pelo magistrado)');
            }
        }
        
        if (argumentType === 'doctrinal') {
            if (semanticProfile.argumentStructure === 'deductive') {
                acceptanceProbability -= 0.05;
                reasoning.push('- Argumento doutrinário em estrutura dedutiva pode ser menos valorizado');
            }
        }
        
        if (argumentType === 'evidentiary') {
            if (judgeProfile.biometrics.evidencePreference > 70) {
                acceptanceProbability += 0.1;
                reasoning.push('+ Magistrado valoriza prova documental');
            }
        }
        
        acceptanceProbability = Math.min(Math.max(acceptanceProbability, 0.1), 0.95);
        
        return {
            argument: argument.substring(0, 100) + (argument.length > 100 ? '...' : ''),
            acceptanceProbability: (acceptanceProbability * 100).toFixed(0) + '%',
            reasoning: reasoning,
            recommendation: acceptanceProbability > 0.7 ? 'Argumento bem alinhado' : 
                           acceptanceProbability > 0.4 ? 'Argumento com potencial, mas requer ajustes' : 
                           'Argumento com baixa probabilidade de aceitação - reconsiderar abordagem'
        };
    }
    
    /**
     * Analisa tendências de decisão por tipo de caso
     */
    analyzeTrends(judgeName, caseCategory, timeFrame = 12) {
        const profile = this.getJudgeBiometricProfile(judgeName);
        if (!profile) return null;
        
        const history = profile.decisionHistory.byArea[caseCategory];
        if (!history) return null;
        
        const total = history.total;
        const favorable = history.favorable;
        const rate = (favorable / total) * 100;
        
        // Analisar por extensão
        const byLength = [];
        for (const [range, data] of Object.entries(profile.decisionHistory.byPageCount || {})) {
            byLength.push({
                range: range,
                favorableRate: (data.favorable / data.cases) * 100,
                cases: data.cases
            });
        }
        
        return {
            judge: judgeName,
            category: caseCategory,
            totalCases: total,
            favorableRate: rate.toFixed(1) + '%',
            trend: rate > 70 ? 'Favorável' : rate > 50 ? 'Neutro' : 'Desfavorável',
            byLength: byLength,
            optimalLength: this.findOptimalLength(profile, caseCategory),
            recommendation: rate > 65 ? 'Foro favorável para litígio' :
                           rate > 45 ? 'Foro neutro - reforçar estratégia' :
                           'Foro desfavorável - considerar arbitragem'
        };
    }
    
    /**
     * Encontra extensão ótima para o magistrado
     */
    findOptimalLength(profile, caseCategory) {
        const byLength = profile.decisionHistory.byPageCount;
        if (!byLength) return { range: 'N/A', rate: 0 };
        
        let bestRange = null;
        let bestRate = 0;
        
        for (const [range, data] of Object.entries(byLength)) {
            const rate = (data.favorable / data.cases) * 100;
            if (rate > bestRate && data.cases > 5) {
                bestRate = rate;
                bestRange = range;
            }
        }
        
        return {
            range: bestRange || 'N/A',
            rate: bestRate.toFixed(1) + '%',
            description: bestRange ? `Peças com ${bestRange} páginas têm maior taxa de sucesso` : 'Dados insuficientes'
        };
    }
    
    /**
     * Gera relatório completo de biometria
     */
    generateBiometricReport(judgeName, document = null) {
        const profile = this.getJudgeBiometricProfile(judgeName);
        if (!profile) return null;
        
        const biometrics = profile.biometrics;
        const semanticProfile = profile.semanticProfile;
        
        const report = {
            generatedAt: new Date().toISOString(),
            judge: {
                name: profile.name,
                court: profile.court,
                totalDecisions: profile.decisionHistory.total,
                favorableRate: (profile.decisionHistory.favorable / profile.decisionHistory.total * 100).toFixed(1) + '%'
            },
            biometricProfile: {
                preferredLength: `${biometrics.preferredLength} páginas`,
                technicalTolerance: `${biometrics.technicalTolerance}%`,
                formalityRigor: `${biometrics.formalityRigor}%`,
                evidencePreference: biometrics.evidencePreference > 70 ? 'Documental' : 
                                    biometrics.evidencePreference > 40 ? 'Equilibrada' : 'Testemunhal',
                avgDecisionTime: `${biometrics.avgDecisionTime} dias`,
                injunctionRate: `${(biometrics.injunctionRate * 100).toFixed(0)}%`
            },
            semanticProfile: {
                preferredKeywords: semanticProfile.preferredKeywords,
                avoidedKeywords: semanticProfile.avoidedKeywords,
                preferredCitations: semanticProfile.preferredCitations,
                argumentStructure: semanticProfile.argumentStructure === 'deductive' ? 'Dedutiva' : 'Indutiva'
            },
            decisionAnalysis: this.analyzeTrends(judgeName, 'all'),
            writingRecommendations: this.generateWritingRecommendations(profile)
        };
        
        if (document) {
            report.compatibility = this.analyzeDocumentCompatibility(profile, document);
        }
        
        return report;
    }
    
    /**
     * Gera recomendações de escrita
     */
    generateWritingRecommendations(profile) {
        const biometrics = profile.biometrics;
        const semanticProfile = profile.semanticProfile;
        const recommendations = [];
        
        if (biometrics.preferredLength < 30) {
            recommendations.push('Priorizar concisão: estruturar argumentos de forma direta, evitar repetições');
        } else {
            recommendations.push('Detalhar fundamentação: incluir desenvolvimento analítico completo');
        }
        
        if (biometrics.technicalTolerance > 70) {
            recommendations.push('Utilizar linguagem técnica precisa, com citações doutrinárias e normativas');
        } else {
            recommendations.push('Evitar excesso de tecnicismo; explicar conceitos jurídicos complexos');
        }
        
        if (biometrics.evidencePreference > 70) {
            recommendations.push('Reforçar prova documental; evitar argumentação baseada exclusivamente em testemunhas');
        }
        
        if (semanticProfile.preferredKeywords.length > 0) {
            recommendations.push(`Incluir referências a: ${semanticProfile.preferredKeywords.slice(0, 4).join(', ')}`);
        }
        
        if (semanticProfile.preferredCitations.length > 0) {
            recommendations.push(`Citar predominantemente: ${semanticProfile.preferredCitations.join(', ')}`);
        }
        
        return recommendations;
    }
    
    /**
     * Renderiza dashboard de biometria
     */
    renderDashboard(containerId, judgeName, document = null) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const report = this.generateBiometricReport(judgeName, document);
        if (!report) {
            container.innerHTML = '<div class="error">Magistrado não encontrado na base de dados</div>';
            return;
        }
        
        const compatibility = report.compatibility;
        
        container.innerHTML = `
            <div class="judge-biometrics-dashboard">
                <div class="dashboard-header">
                    <h2><i class="fas fa-robot"></i> DIGITAL TWIN: ${report.judge.name}</h2>
                    <div class="court-badge">${report.judge.court}</div>
                </div>
                
                <div class="biometric-profile">
                    <div class="profile-stats">
                        <div class="stat">
                            <div class="stat-value">${report.judge.totalDecisions}</div>
                            <div class="stat-label">Decisões Analisadas</div>
                        </div>
                        <div class="stat">
                            <div class="stat-value ${report.judge.favorableRate > 65 ? 'positive' : report.judge.favorableRate > 45 ? 'neutral' : 'negative'}">${report.judge.favorableRate}</div>
                            <div class="stat-label">Taxa Favorável</div>
                        </div>
                        <div class="stat">
                            <div class="stat-value">${report.biometricProfile.avgDecisionTime}</div>
                            <div class="stat-label">Tempo Médio</div>
                        </div>
                    </div>
                    
                    <div class="biometric-metrics">
                        <div class="metric">
                            <div class="metric-label">Extensão Ideal</div>
                            <div class="metric-value">${report.biometricProfile.preferredLength}</div>
                            <div class="metric-bar"><div class="fill" style="width: ${report.biometricProfile.preferredLength.split(' ')[0] / 50 * 100}%"></div></div>
                        </div>
                        <div class="metric">
                            <div class="metric-label">Tolerância Técnica</div>
                            <div class="metric-value">${report.biometricProfile.technicalTolerance}</div>
                            <div class="metric-bar"><div class="fill" style="width: ${report.biometricProfile.technicalTolerance.split('%')[0]}%"></div></div>
                        </div>
                        <div class="metric">
                            <div class="metric-label">Preferência Probatória</div>
                            <div class="metric-value">${report.biometricProfile.evidencePreference}</div>
                            <div class="metric-bar"><div class="fill" style="width: ${report.biometricProfile.evidencePreference.split('%')[0]}%"></div></div>
                        </div>
                        <div class="metric">
                            <div class="metric-label">Taxa Tutela Antecipada</div>
                            <div class="metric-value">${report.biometricProfile.injunctionRate}</div>
                            <div class="metric-bar"><div class="fill" style="width: ${report.biometricProfile.injunctionRate.split('%')[0]}%"></div></div>
                        </div>
                    </div>
                </div>
                
                <div class="semantic-profile">
                    <h3><i class="fas fa-comment-dots"></i> Perfil Semântico</h3>
                    <div class="keywords-section">
                        <div class="preferred">
                            <strong>Keywords Preferidas:</strong>
                            <div class="keyword-tags">${report.semanticProfile.preferredKeywords.map(k => `<span class="tag preferred">${k}</span>`).join('')}</div>
                        </div>
                        <div class="avoided">
                            <strong>Keywords a Evitar:</strong>
                            <div class="keyword-tags">${report.semanticProfile.avoidedKeywords.map(k => `<span class="tag avoided">${k}</span>`).join('')}</div>
                        </div>
                        <div class="citations">
                            <strong>Citações Preferidas:</strong>
                            <div class="citation-tags">${report.semanticProfile.preferredCitations.map(c => `<span class="tag citation">${c}</span>`).join('')}</div>
                        </div>
                        <div class="structure">
                            <strong>Estrutura Argumentativa:</strong> ${report.semanticProfile.argumentStructure}
                        </div>
                    </div>
                </div>
                
                ${compatibility ? `
                    <div class="compatibility-section">
                        <h3><i class="fas fa-chart-line"></i> Análise de Compatibilidade</h3>
                        <div class="compatibility-score" style="border-color: ${compatibility.summary.color}">
                            <div class="score-circle" style="background: conic-gradient(${compatibility.summary.color} 0deg ${compatibility.compatibilityScore * 3.6}deg, #1f2937 ${compatibility.compatibilityScore * 3.6}deg 360deg)">
                                <div class="score-value">${compatibility.summary.score}</div>
                            </div>
                            <div class="score-info">
                                <div class="score-status" style="color: ${compatibility.summary.color}">${compatibility.summary.status}</div>
                                <div class="injunction-rate">Tutela Antecipada: ${compatibility.summary.injunctionProbability}%</div>
                            </div>
                        </div>
                        
                        <div class="recommendations-list">
                            <h4>Recomendações de Ajuste</h4>
                            ${compatibility.recommendations.map(rec => `
                                <div class="recommendation severity-${rec.severity}">
                                    <i class="fas ${rec.severity === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle'}"></i>
                                    <div>
                                        <strong>${rec.message}</strong>
                                        <p>${rec.suggestion}</p>
                                    </div>
                                </div>
                            `).join('')}
                            ${compatibility.recommendations.length === 0 ? '<div class="empty-state">✅ Peça alinhada com o perfil do magistrado</div>' : ''}
                        </div>
                        
                        <div class="adapted-version">
                            <h4><i class="fas fa-file-alt"></i> Versão Adaptada (Sugestão)</h4>
                            <div class="adapted-content">
                                <pre>${compatibility.adaptedVersion}</pre>
                            </div>
                            <button id="copyAdaptedBtn" class="elite-btn secondary"><i class="fas fa-copy"></i> COPIAR VERSÃO ADAPTADA</button>
                        </div>
                    </div>
                ` : ''}
                
                <div class="writing-recommendations">
                    <h3><i class="fas fa-pen-fancy"></i> Recomendações de Redação</h3>
                    <ul>
                        ${report.writingRecommendations.map(rec => `<li><i class="fas fa-check-circle"></i> ${rec}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
        
        // Estilos adicionais
        const style = document.createElement('style');
        style.textContent = `
            .judge-biometrics-dashboard { padding: 0; }
            .court-badge { background: var(--elite-primary-dim); color: var(--elite-primary); padding: 4px 12px; border-radius: 20px; font-size: 0.7rem; }
            .profile-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; background: var(--bg-command); border-radius: 16px; padding: 20px; margin: 20px 0; }
            .stat-value { font-size: 1.5rem; font-weight: 800; font-family: 'JetBrains Mono'; }
            .stat-value.positive { color: #00e676; }
            .stat-value.neutral { color: #ffc107; }
            .stat-value.negative { color: #ff1744; }
            .stat-label { font-size: 0.7rem; color: #94a3b8; }
            .biometric-metrics { background: var(--bg-terminal); border-radius: 16px; padding: 20px; margin: 20px 0; }
            .metric { margin-bottom: 16px; }
            .metric-label { font-size: 0.7rem; color: #94a3b8; margin-bottom: 4px; }
            .metric-value { font-size: 0.9rem; font-weight: 600; margin-bottom: 4px; }
            .metric-bar { height: 6px; background: #1f2937; border-radius: 3px; overflow: hidden; }
            .metric-bar .fill { height: 100%; background: linear-gradient(90deg, var(--elite-primary), var(--elite-success)); width: 0; }
            .keyword-tags { display: flex; flex-wrap: wrap; gap: 8px; margin: 8px 0; }
            .tag { padding: 4px 12px; border-radius: 20px; font-size: 0.7rem; }
            .tag.preferred { background: rgba(0, 230, 118, 0.1); border: 1px solid #00e676; color: #00e676; }
            .tag.avoided { background: rgba(255, 23, 68, 0.1); border: 1px solid #ff1744; color: #ff1744; }
            .tag.citation { background: rgba(0, 229, 255, 0.1); border: 1px solid #00e5ff; color: #00e5ff; }
            .compatibility-score { display: flex; gap: 24px; align-items: center; padding: 20px; background: var(--bg-terminal); border-radius: 16px; margin: 20px 0; }
            .score-circle { width: 100px; height: 100px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: conic-gradient(#00e5ff 0deg, #1f2937 0deg); }
            .score-circle .score-value { width: 80px; height: 80px; background: var(--bg-command); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: 800; }
            .recommendation { display: flex; gap: 12px; padding: 12px; background: var(--bg-command); border-radius: 12px; margin-bottom: 8px; }
            .recommendation.severity-warning { border-left: 3px solid #ffc107; }
            .recommendation.severity-info { border-left: 3px solid #00e5ff; }
            .adapted-content { background: var(--bg-terminal); border-radius: 12px; padding: 16px; margin: 16px 0; font-family: 'JetBrains Mono'; font-size: 0.7rem; white-space: pre-wrap; max-height: 400px; overflow-y: auto; }
            .writing-recommendations ul { list-style: none; padding: 0; }
            .writing-recommendations li { padding: 8px 0; display: flex; align-items: center; gap: 8px; color: #94a3b8; }
            .writing-recommendations li i { color: var(--elite-success); }
        `;
        container.appendChild(style);
        
        document.getElementById('copyAdaptedBtn')?.addEventListener('click', () => {
            const adaptedText = document.querySelector('.adapted-content pre')?.innerText;
            if (adaptedText) {
                navigator.clipboard.writeText(adaptedText);
                if (window.EliteUtils) window.EliteUtils.showToast('Versão adaptada copiada para área de transferência', 'success');
            }
        });
    }
}

// Instância global
window.JudgeBiometrics = new JudgeBiometrics();