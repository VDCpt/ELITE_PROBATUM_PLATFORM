/**
 * ============================================================================
 * UNIFED-ELITE PLATFORM — MÓDULO 7: PORTAL DO CLIENTE
 * ============================================================================
 * Portal exclusivo para clientes com acompanhamento em tempo real,
 * simulação de cenários, comunicação segura e download de documentos.
 * ============================================================================
 */

class ClientPortal {
    constructor() {
        this.clients = new Map();
        this.activeSessions = new Map();
        this.messages = new Map();
        this.notifications = new Map();
    }
    
    async authenticate(clientId, accessToken) {
        // Verificar credenciais
        const client = await this.validateClient(clientId, accessToken);
        if (!client) return null;
        
        // Criar sessão segura
        const sessionId = this.createSession(clientId);
        this.activeSessions.set(sessionId, {
            clientId,
            createdAt: Date.now(),
            expiresAt: Date.now() + 24 * 60 * 60 * 1000,
            ip: 'client'
        });
        
        return {
            sessionId,
            client: this.sanitizeClientData(client),
            cases: await this.getClientCases(clientId)
        };
    }
    
    async validateClient(clientId, token) {
        // Em produção, validar com backend
        const clients = await this.fetchClients();
        const client = clients.find(c => c.id === clientId);
        
        if (client && client.token === token) {
            return client;
        }
        
        return null;
    }
    
    createSession(clientId) {
        return 'SESS_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 8);
    }
    
    async fetchClients() {
        return [
            {
                id: 'CL001',
                name: 'João Silva',
                nif: '123456789',
                email: 'joao.silva@email.com',
                phone: '912345678',
                token: 'demo_token_001',
                avatar: 'JS',
                since: '2024-01-15'
            },
            {
                id: 'CL002',
                name: 'Maria Santos',
                nif: '987654321',
                email: 'maria.santos@email.com',
                phone: '923456789',
                token: 'demo_token_002',
                avatar: 'MS',
                since: '2024-03-20'
            }
        ];
    }
    
    async getClientCases(clientId) {
        // Em produção, buscar da API
        return [
            {
                id: 'C001',
                platform: 'Bolt',
                status: 'active',
                statusText: 'Em andamento',
                value: 28450,
                discrepancy: 2184.95,
                percentage: 89.26,
                createdAt: '2024-09-15',
                lastUpdate: '2024-10-20',
                nextDeadline: '2024-11-15',
                lawyer: 'Dra. Ana Silva',
                probability: 0.82,
                documents: [
                    { name: 'Petição Inicial', date: '2024-09-20', type: 'pdf', size: '245 KB' },
                    { name: 'Relatório Pericial', date: '2024-09-18', type: 'pdf', size: '1.2 MB' },
                    { name: 'Notificação da AT', date: '2024-10-05', type: 'pdf', size: '89 KB' }
                ],
                timeline: [
                    { date: '2024-09-15', event: 'Início do processo', status: 'completed' },
                    { date: '2024-09-20', event: 'Petição inicial submetida', status: 'completed' },
                    { date: '2024-10-05', event: 'Citação da ré', status: 'completed' },
                    { date: '2024-11-15', event: 'Prazo para contestação', status: 'pending' },
                    { date: '2025-01-15', event: 'Previsão de julgamento', status: 'upcoming' }
                ]
            }
        ];
    }
    
    sanitizeClientData(client) {
        return {
            id: client.id,
            name: client.name,
            nif: client.nif.substring(0, 3) + '***' + client.nif.substring(6),
            email: client.email,
            avatar: client.avatar,
            since: client.since
        };
    }
    
    renderPortal(clientId) {
        const client = this.clients.get(clientId);
        if (!client) return '<div class="error">Cliente não encontrado</div>';
        
        return `
            <div class="client-portal">
                <div class="portal-header">
                    <div class="client-welcome">
                        <div class="client-avatar">${client.avatar}</div>
                        <div>
                            <h2>Olá, ${client.name}</h2>
                            <p>Cliente desde ${client.since}</p>
                        </div>
                    </div>
                    <div class="portal-stats">
                        <div class="stat">
                            <span class="stat-label">Casos Ativos</span>
                            <span class="stat-value">${client.cases?.length || 0}</span>
                        </div>
                        <div class="stat">
                            <span class="stat-label">Valor em Disputa</span>
                            <span class="stat-value">${window.UNIFEDElite?.formatCurrency(client.totalValue) || '€0'}</span>
                        </div>
                    </div>
                </div>
                
                <div class="portal-cases">
                    <h3>Meus Processos</h3>
                    <div class="cases-grid">
                        ${this.renderCases(client.cases)}
                    </div>
                </div>
                
                <div class="portal-communication">
                    <h3>Comunicação Segura</h3>
                    <div class="messages-container">
                        <div class="messages-list" id="messagesList">
                            ${this.renderMessages(clientId)}
                        </div>
                        <div class="message-input">
                            <textarea id="clientMessage" placeholder="Escreva uma mensagem para o seu advogado..."></textarea>
                            <button onclick="ClientPortal.sendMessage('${clientId}')">
                                <i class="fas fa-lock"></i> Enviar (criptografado)
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="portal-documents">
                    <h3>Documentos</h3>
                    <div class="documents-grid">
                        ${this.renderDocuments(client.cases)}
                    </div>
                </div>
            </div>
        `;
    }
    
    renderCases(cases) {
        if (!cases || cases.length === 0) {
            return '<div class="empty-state">Nenhum processo ativo no momento</div>';
        }
        
        return cases.map(c => `
            <div class="case-card" onclick="ClientPortal.openCase('${c.id}')">
                <div class="case-header">
                    <span class="case-id">${c.id}</span>
                    <span class="case-status status-${c.status}">${c.statusText}</span>
                </div>
                <div class="case-details">
                    <div><i class="fas fa-building"></i> ${c.platform}</div>
                    <div><i class="fas fa-euro-sign"></i> ${window.UNIFEDElite?.formatCurrency(c.value)}</div>
                </div>
                <div class="case-progress">
                    <div class="progress-label">Probabilidade de sucesso</div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${c.probability * 100}%"></div>
                        <span class="progress-text">${(c.probability * 100).toFixed(0)}%</span>
                    </div>
                </div>
                <div class="case-footer">
                    <span><i class="fas fa-user"></i> ${c.lawyer}</span>
                    <span><i class="fas fa-calendar"></i> ${c.lastUpdate}</span>
                </div>
            </div>
        `).join('');
    }
    
    renderMessages(clientId) {
        const messages = this.messages.get(clientId) || [];
        
        if (messages.length === 0) {
            return '<div class="empty-messages">Nenhuma mensagem ainda. Envie uma mensagem para o seu advogado.</div>';
        }
        
        return messages.map(m => `
            <div class="message ${m.sender === 'client' ? 'sent' : 'received'}">
                <div class="message-header">
                    <strong>${m.sender === 'client' ? 'Você' : m.lawyerName}</strong>
                    <small>${m.timestamp}</small>
                </div>
                <div class="message-body">${m.text}</div>
                ${m.read ? '<span class="message-read">✓ Lida</span>' : '<span class="message-pending">✓ Enviada</span>'}
            </div>
        `).join('');
    }
    
    renderDocuments(cases) {
        if (!cases) return '<div class="empty-state">Nenhum documento disponível</div>';
        
        const allDocs = cases.flatMap(c => 
            c.documents.map(doc => ({ ...doc, caseId: c.id }))
        );
        
        if (allDocs.length === 0) {
            return '<div class="empty-state">Nenhum documento disponível</div>';
        }
        
        return allDocs.map(doc => `
            <div class="document-card" onclick="ClientPortal.downloadDocument('${doc.name}')">
                <i class="fas ${this.getDocIcon(doc.type)}"></i>
                <div>
                    <div class="doc-name">${doc.name}</div>
                    <div class="doc-meta">${doc.date} · ${doc.size}</div>
                </div>
                <i class="fas fa-download"></i>
            </div>
        `).join('');
    }
    
    getDocIcon(type) {
        const icons = {
            pdf: 'fa-file-pdf',
            docx: 'fa-file-word',
            xlsx: 'fa-file-excel',
            txt: 'fa-file-alt'
        };
        return icons[type] || 'fa-file';
    }
    
    async openCase(caseId) {
        window.UNIFEDElite?.showToast(`Abrindo detalhes do caso ${caseId}...`, 'info');
        
        // Em produção, abrir modal com detalhes do caso
        const modal = `
            <div class="case-detail-modal">
                <h3>Processo ${caseId}</h3>
                <div class="timeline">
                    <h4>Linha do Tempo</h4>
                    ${this.renderTimeline(caseId)}
                </div>
                <div class="simulator">
                    <h4>Simulador de Cenários</h4>
                    <div class="scenario-controls">
                        <label><input type="radio" name="scenario" value="litigate" checked> Litigar</label>
                        <label><input type="radio" name="scenario" value="negotiate"> Negociar</label>
                        <label><input type="radio" name="scenario" value="arbitration"> Arbitragem</label>
                    </div>
                    <div class="scenario-result" id="scenarioResult"></div>
                </div>
            </div>
        `;
        
        // Mostrar modal (simplificado)
        alert(`Detalhes do caso ${caseId} - Funcionalidade em desenvolvimento`);
    }
    
    renderTimeline(caseId) {
        const caseData = this.getClientCases('CL001').then(cases => {
            const caseInfo = cases.find(c => c.id === caseId);
            if (!caseInfo) return '';
            
            return caseInfo.timeline.map(event => `
                <div class="timeline-event ${event.status}">
                    <div class="event-date">${event.date}</div>
                    <div class="event-description">${event.event}</div>
                    <div class="event-status">${this.getStatusIcon(event.status)}</div>
                </div>
            `).join('');
        });
        
        return '<div>Carregando...</div>';
    }
    
    getStatusIcon(status) {
        const icons = {
            completed: '✅',
            pending: '⏳',
            upcoming: '📅',
            cancelled: '❌'
        };
        return icons[status] || '●';
    }
    
    async sendMessage(clientId) {
        const textarea = document.getElementById('clientMessage');
        const message = textarea?.value.trim();
        
        if (!message) {
            window.UNIFEDElite?.showToast('Digite uma mensagem antes de enviar', 'warning');
            return;
        }
        
        // Criptografar mensagem
        const encrypted = await this.encryptMessage(message);
        
        // Salvar mensagem
        const messages = this.messages.get(clientId) || [];
        messages.push({
            id: Date.now(),
            text: message,
            encrypted,
            sender: 'client',
            timestamp: new Date().toLocaleString(),
            read: false
        });
        this.messages.set(clientId, messages);
        
        // Limpar textarea
        textarea.value = '';
        
        // Atualizar UI
        this.renderMessages(clientId);
        
        // Notificar advogado (em produção, via WebSocket)
        window.UNIFEDElite?.showToast('Mensagem enviada com sucesso!', 'success');
        
        // Simular resposta do advogado
        setTimeout(() => {
            const lawyerResponse = {
                id: Date.now() + 1,
                text: 'Recebi a sua mensagem. Analisarei e responderei em breve.',
                sender: 'lawyer',
                lawyerName: 'Dra. Ana Silva',
                timestamp: new Date().toLocaleString(),
                read: true
            };
            messages.push(lawyerResponse);
            this.messages.set(clientId, messages);
            this.renderMessages(clientId);
        }, 3000);
    }
    
    async encryptMessage(message) {
        // Simular criptografia
        return btoa(message);
    }
    
    async downloadDocument(docName) {
        window.UNIFEDElite?.showToast(`A descarregar ${docName}...`, 'info');
        
        // Simular download
        setTimeout(() => {
            window.UNIFEDElite?.showToast(`${docName} descarregado com sucesso!`, 'success');
        }, 1000);
    }
    
    simulateScenario(caseId, scenario) {
        const scenarios = {
            litigate: {
                probability: 0.82,
                duration: '8-12 meses',
                expectedValue: 28450,
                risk: 'Alto'
            },
            negotiate: {
                probability: 0.95,
                duration: '2-3 meses',
                expectedValue: 12500,
                risk: 'Baixo'
            },
            arbitration: {
                probability: 0.78,
                duration: '4-6 meses',
                expectedValue: 22000,
                risk: 'Moderado'
            }
        };
        
        const result = scenarios[scenario];
        const resultDiv = document.getElementById('scenarioResult');
        
        if (resultDiv) {
            resultDiv.innerHTML = `
                <div class="scenario-details">
                    <div><strong>Probabilidade:</strong> ${result.probability * 100}%</div>
                    <div><strong>Duração:</strong> ${result.duration}</div>
                    <div><strong>Valor Esperado:</strong> ${window.UNIFEDElite?.formatCurrency(result.expectedValue)}</div>
                    <div><strong>Risco:</strong> ${result.risk}</div>
                </div>
                <button class="elite-btn primary" onclick="ClientPortal.selectScenario('${caseId}', '${scenario}')">
                    Selecionar esta estratégia
                </button>
            `;
        }
    }
    
    selectScenario(caseId, scenario) {
        window.UNIFEDElite?.showToast(`Estratégia de ${scenario} selecionada. O seu advogado será notificado.`, 'success');
    }
}

// Instância global
window.ClientPortal = new ClientPortal();