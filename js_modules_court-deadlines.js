/**
 * ============================================================================
 * ELITE PROBATUM — MÓDULO DE PRAZOS JUDICIAIS
 * ============================================================================
 * CORREÇÃO v2.0.3:
 * 1. Implementação exata do algoritmo de Meeus/Jones/Butcher para cálculo da Páscoa
 * 2. Inclusão de feriados móveis (Carnaval, Corpo de Deus)
 * 3. Validação de datas com base no calendário judicial português
 * ============================================================================
 */

class CourtDeadlines {
    constructor() {
        this.deadlines = [];
        this.monitorInterval = null;
        this.notificationCallback = null;
        
        // Férias judiciais em Portugal (dias em que os prazos suspendem)
        this.judicialHolidays = {
            christmas: { start: '12-20', end: '01-07' },
            easter: { start: null, end: null }, // Calculado dinamicamente
            summer: { start: '07-15', end: '09-01' }
        };
        
        // Dias de feriado nacional (suspensão de prazos)
        this.nationalHolidays = [
            '01-01', // Ano Novo
            '04-25', // Dia da Liberdade
            '05-01', // Dia do Trabalhador
            '06-10', // Dia de Portugal
            '08-15', // Assunção de Nossa Senhora
            '10-05', // Implantação da República
            '11-01', // Dia de Todos os Santos
            '12-01', // Restauração da Independência
            '12-08', // Imaculada Conceição
            '12-25'  // Natal
        ];
        
        // Feriados móveis (calculados anualmente)
        this.movableHolidays = {
            carnival: null,      // Terça-feira de Carnaval (47 dias antes da Páscoa)
            goodFriday: null,    // Sexta-feira Santa (2 dias antes da Páscoa)
            easterSunday: null,  // Domingo de Páscoa
            corpusChristi: null  // Corpo de Deus (60 dias após a Páscoa)
        };
        
        this.loadDeadlines();
        this.calculateMovableHolidays(new Date().getFullYear());
    }
    
    /**
     * Inicializa o módulo e começa a monitorização
     */
    initialize() {
        this.loadDeadlines();
        this.startMonitoring();
        console.log('[ELITE] CourtDeadlines inicializado com', this.deadlines.length, 'prazos');
        return this;
    }
    
    /**
     * CORREÇÃO: Cálculo exato da Páscoa pelo algoritmo de Meeus/Jones/Butcher
     * Implementação validada para anos entre 1900 e 2099
     * @param {number} year - Ano para cálculo
     * @returns {Date} Data do Domingo de Páscoa
     */
    calculateEasterDate(year) {
        // Algoritmo de Meeus/Jones/Butcher (validação astronómica)
        const a = year % 19;
        const b = Math.floor(year / 100);
        const c = year % 100;
        const d = Math.floor(b / 4);
        const e = b % 4;
        const f = Math.floor((b + 8) / 25);
        const g = Math.floor((b - f + 1) / 3);
        const h = (19 * a + b - d - g + 15) % 30;
        const i = Math.floor(c / 4);
        const k = c % 4;
        const l = (32 + 2 * e + 2 * i - h - k) % 7;
        const m = Math.floor((a + 11 * h + 22 * l) / 451);
        const month = Math.floor((h + l - 7 * m + 114) / 31);
        const day = ((h + l - 7 * m + 114) % 31) + 1;
        
        return new Date(year, month - 1, day);
    }
    
    /**
     * CORREÇÃO: Calcula todos os feriados móveis para um determinado ano
     * @param {number} year - Ano para cálculo
     */
    calculateMovableHolidays(year) {
        const easterDate = this.calculateEasterDate(year);
        
        // Domingo de Páscoa
        this.movableHolidays.easterSunday = easterDate;
        
        // Sexta-feira Santa (2 dias antes da Páscoa)
        const goodFriday = new Date(easterDate);
        goodFriday.setDate(easterDate.getDate() - 2);
        this.movableHolidays.goodFriday = goodFriday;
        
        // Terça-feira de Carnaval (47 dias antes da Páscoa)
        const carnival = new Date(easterDate);
        carnival.setDate(easterDate.getDate() - 47);
        this.movableHolidays.carnival = carnival;
        
        // Corpo de Deus (60 dias após a Páscoa)
        const corpusChristi = new Date(easterDate);
        corpusChristi.setDate(easterDate.getDate() + 60);
        this.movableHolidays.corpusChristi = corpusChristi;
        
        // Atualizar férias judiciais da Páscoa (semana santa)
        const easterStart = new Date(easterDate);
        easterStart.setDate(easterDate.getDate() - 7); // Domingo de Ramos
        const easterEnd = new Date(easterDate);
        easterEnd.setDate(easterDate.getDate() + 7);   // Domingo da Misericórdia
        
        this.judicialHolidays.easter = {
            start: this.formatMonthDay(easterStart),
            end: this.formatMonthDay(easterEnd)
        };
        
        console.log(`[ELITE] Feriados móveis ${year}: Páscoa=${this.formatDate(easterDate)}, Carnaval=${this.formatDate(carnival)}, Corpo Deus=${this.formatDate(corpusChristi)}`);
    }
    
    /**
     * Verifica se uma data é feriado móvel
     * @param {Date} date - Data a verificar
     * @returns {boolean}
     */
    isMovableHoliday(date) {
        const year = date.getFullYear();
        
        // Garantir que os feriados móveis estão calculados para o ano correto
        if (!this.movableHolidays.easterSunday || this.movableHolidays.easterSunday.getFullYear() !== year) {
            this.calculateMovableHolidays(year);
        }
        
        const dateStr = this.formatDateISO(date);
        
        const movableDates = [
            this.movableHolidays.carnival,
            this.movableHolidays.goodFriday,
            this.movableHolidays.easterSunday,
            this.movableHolidays.corpusChristi
        ];
        
        return movableDates.some(holiday => 
            holiday && this.formatDateISO(holiday) === dateStr
        );
    }
    
    /**
     * Verifica se a data está dentro do período de férias judiciais
     * @param {Date} date - Data a verificar
     * @returns {boolean}
     */
    isJudicialHoliday(date) {
        const year = date.getFullYear();
        
        // Garantir que os feriados móveis estão calculados para o ano correto
        if (!this.movableHolidays.easterSunday || this.movableHolidays.easterSunday.getFullYear() !== year) {
            this.calculateMovableHolidays(year);
        }
        
        const month = date.getMonth() + 1;
        const day = date.getDate();
        
        // Natal/Ano Novo
        const christmasStart = this.parseMonthDay(this.judicialHolidays.christmas.start);
        const christmasEnd = this.parseMonthDay(this.judicialHolidays.christmas.end);
        if (this.isDateInRange(month, day, christmasStart, christmasEnd)) {
            return true;
        }
        
        // Verão
        const summerStart = this.parseMonthDay(this.judicialHolidays.summer.start);
        const summerEnd = this.parseMonthDay(this.judicialHolidays.summer.end);
        if (this.isDateInRange(month, day, summerStart, summerEnd)) {
            return true;
        }
        
        // CORREÇÃO: Férias da Páscoa usando datas calculadas dinamicamente
        const easterStart = this.parseMonthDay(this.judicialHolidays.easter.start);
        const easterEnd = this.parseMonthDay(this.judicialHolidays.easter.end);
        if (this.isDateInRange(month, day, easterStart, easterEnd)) {
            return true;
        }
        
        return false;
    }
    
    /**
     * Verifica se uma data é dia útil (não é fim de semana nem feriado)
     * @param {Date} date - Data a verificar
     * @returns {boolean}
     */
    isBusinessDay(date) {
        const dayOfWeek = date.getDay();
        // 0 = Domingo, 6 = Sábado
        if (dayOfWeek === 0 || dayOfWeek === 6) {
            return false;
        }
        
        // Verificar feriados nacionais
        const monthDay = this.formatMonthDay(date);
        if (this.nationalHolidays.includes(monthDay)) {
            return false;
        }
        
        // Verificar feriados móveis
        if (this.isMovableHoliday(date)) {
            return false;
        }
        
        // Verificar férias judiciais
        if (this.isJudicialHoliday(date)) {
            return false;
        }
        
        return true;
    }
    
    /**
     * Calcula a data da Páscoa para um determinado ano (método público)
     * @param {number} year - Ano
     * @returns {Date}
     */
    getEasterDate(year) {
        return this.calculateEasterDate(year);
    }
    
    /**
     * Obtém todos os feriados móveis para um ano
     * @param {number} year - Ano
     * @returns {Object}
     */
    getMovableHolidays(year) {
        this.calculateMovableHolidays(year);
        return {
            carnival: this.movableHolidays.carnival,
            goodFriday: this.movableHolidays.goodFriday,
            easterSunday: this.movableHolidays.easterSunday,
            corpusChristi: this.movableHolidays.corpusChristi
        };
    }
    
    /**
     * Formata mês-dia para comparação (MM-DD)
     */
    formatMonthDay(date) {
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${month}-${day}`;
    }
    
    /**
     * Formata data no formato ISO (YYYY-MM-DD)
     */
    formatDateISO(date) {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    
    /**
     * Analisa string mês-dia (MM-DD)
     */
    parseMonthDay(str) {
        if (!str) return { month: 1, day: 1 };
        const parts = str.split('-');
        return { month: parseInt(parts[0]), day: parseInt(parts[1]) };
    }
    
    /**
     * Verifica se uma data está dentro de um intervalo (considerando ano)
     */
    isDateInRange(month, day, start, end) {
        const dateValue = month * 100 + day;
        const startValue = start.month * 100 + start.day;
        const endValue = end.month * 100 + end.day;
        
        if (startValue <= endValue) {
            return dateValue >= startValue && dateValue <= endValue;
        } else {
            // Intervalo que cruza o ano (ex: Dezembro a Janeiro)
            return dateValue >= startValue || dateValue <= endValue;
        }
    }
    
    /**
     * Calcula a data limite com base em dias úteis
     * @param {Date|string} startDate - Data de início
     * @param {number} businessDays - Número de dias úteis
     * @returns {Date} Data limite
     */
    calculateDueDate(startDate, businessDays) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        
        let current = new Date(start);
        let remaining = businessDays;
        
        while (remaining > 0) {
            current.setDate(current.getDate() + 1);
            if (this.isBusinessDay(current)) {
                remaining--;
            }
        }
        
        return current;
    }
    
    /**
     * Calcula prioridade do prazo (1-5, onde 5 é mais urgente)
     * @param {Date|string} dueDate - Data de vencimento
     * @returns {number}
     */
    calculatePriority(dueDate) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const due = new Date(dueDate);
        due.setHours(0, 0, 0, 0);
        
        const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) return 5; // Vencido
        if (diffDays === 0) return 5; // Hoje
        if (diffDays <= 3) return 4;
        if (diffDays <= 7) return 3;
        if (diffDays <= 15) return 2;
        return 1;
    }
    
    /**
     * Analisa string de data no formato DD/MM/YYYY
     */
    parseDate(dateStr) {
        if (!dateStr) return null;
        const parts = dateStr.split('/');
        if (parts.length === 3) {
            return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
        }
        return new Date(dateStr);
    }
    
    /**
     * Formata data no formato DD/MM/YYYY
     */
    formatDate(date) {
        if (!date) return '';
        const d = new Date(date);
        const day = d.getDate().toString().padStart(2, '0');
        const month = (d.getMonth() + 1).toString().padStart(2, '0');
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
    }
    
    /**
     * Carrega prazos do localStorage
     */
    loadDeadlines() {
        const stored = localStorage.getItem('elite_deadlines');
        if (stored) {
            try {
                this.deadlines = JSON.parse(stored);
            } catch (e) {
                console.error('[ELITE] Erro ao carregar prazos:', e);
                this.deadlines = [];
            }
        } else {
            this.deadlines = [];
        }
        return this.deadlines;
    }
    
    /**
     * Persiste prazos no localStorage
     */
    saveDeadlines() {
        localStorage.setItem('elite_deadlines', JSON.stringify(this.deadlines));
        return this;
    }
    
    /**
     * Adiciona um novo prazo
     * @param {Object} deadline - Objeto com dados do prazo
     * @returns {Object} Prazo adicionado
     */
    addDeadline(deadline) {
        const newDeadline = {
            id: Date.now(),
            caseId: deadline.caseId,
            description: deadline.description,
            dueDate: deadline.dueDate,
            dueDateRaw: deadline.dueDateRaw || this.parseDate(deadline.dueDate),
            type: deadline.type || 'judicial',
            priority: deadline.priority || this.calculatePriority(deadline.dueDate),
            notes: deadline.notes || '',
            status: 'pending',
            createdAt: new Date().toISOString(),
            notified: false,
            reminderSent: false
        };
        
        this.deadlines.push(newDeadline);
        this.saveDeadlines();
        this.checkUrgentDeadlines();
        
        return newDeadline;
    }
    
    /**
     * Atualiza um prazo existente
     * @param {number} id - ID do prazo
     * @param {Object} updates - Campos a atualizar
     */
    updateDeadline(id, updates) {
        const index = this.deadlines.findIndex(d => d.id === id);
        if (index !== -1) {
            this.deadlines[index] = { ...this.deadlines[index], ...updates };
            if (updates.dueDate) {
                this.deadlines[index].dueDateRaw = this.parseDate(updates.dueDate);
                this.deadlines[index].priority = this.calculatePriority(updates.dueDate);
            }
            this.saveDeadlines();
        }
        return this;
    }
    
    /**
     * Remove um prazo
     * @param {number} id - ID do prazo
     */
    deleteDeadline(id) {
        this.deadlines = this.deadlines.filter(d => d.id !== id);
        this.saveDeadlines();
        return this;
    }
    
    /**
     * Obtém prazos de um caso específico
     * @param {string} caseId - ID do processo
     * @returns {Array} Lista de prazos
     */
    getDeadlinesByCase(caseId) {
        return this.deadlines.filter(d => d.caseId === caseId);
    }
    
    /**
     * Obtém prazos pendentes
     * @param {number} days - Dias para frente (opcional)
     * @returns {Array} Lista de prazos pendentes
     */
    getPendingDeadlines(days = null) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        let filtered = this.deadlines.filter(d => {
            const dueDate = new Date(d.dueDateRaw);
            dueDate.setHours(0, 0, 0, 0);
            return d.status === 'pending' && dueDate >= today;
        });
        
        if (days) {
            const limit = new Date();
            limit.setDate(limit.getDate() + days);
            limit.setHours(23, 59, 59, 999);
            filtered = filtered.filter(d => new Date(d.dueDateRaw) <= limit);
        }
        
        return filtered.sort((a, b) => new Date(a.dueDateRaw) - new Date(b.dueDateRaw));
    }
    
    /**
     * Obtém prazos vencidos
     * @returns {Array} Lista de prazos vencidos
     */
    getOverdueDeadlines() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        return this.deadlines.filter(d => {
            const dueDate = new Date(d.dueDateRaw);
            dueDate.setHours(0, 0, 0, 0);
            return d.status === 'pending' && dueDate < today;
        }).sort((a, b) => new Date(a.dueDateRaw) - new Date(b.dueDateRaw));
    }
    
    /**
     * Calcula dias úteis entre duas datas
     * @param {Date|string} startDate - Data inicial
     * @param {Date|string} endDate - Data final
     * @returns {number} Número de dias úteis
     */
    calculateBusinessDays(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        start.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);
        
        let businessDays = 0;
        let current = new Date(start);
        
        while (current <= end) {
            if (this.isBusinessDay(current)) {
                businessDays++;
            }
            current.setDate(current.getDate() + 1);
        }
        
        return businessDays;
    }
    
    /**
     * Inicia monitorização de prazos (verifica a cada hora)
     */
    startMonitoring() {
        if (this.monitorInterval) {
            clearInterval(this.monitorInterval);
        }
        
        // Atualizar feriados móveis anualmente
        const currentYear = new Date().getFullYear();
        this.calculateMovableHolidays(currentYear);
        
        // Verificar mudança de ano a cada dia
        setInterval(() => {
            const now = new Date();
            if (now.getFullYear() !== currentYear) {
                this.calculateMovableHolidays(now.getFullYear());
            }
        }, 24 * 60 * 60 * 1000);
        
        this.monitorInterval = setInterval(() => {
            this.checkUrgentDeadlines();
        }, 60 * 60 * 1000); // A cada hora
        
        // Primeira verificação imediata
        setTimeout(() => this.checkUrgentDeadlines(), 1000);
        
        return this;
    }
    
    /**
     * Para monitorização de prazos
     */
    stopMonitoring() {
        if (this.monitorInterval) {
            clearInterval(this.monitorInterval);
            this.monitorInterval = null;
        }
        return this;
    }
    
    /**
     * Verifica prazos urgentes e dispara notificações
     */
    checkUrgentDeadlines() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const urgentThreshold = new Date();
        urgentThreshold.setDate(urgentThreshold.getDate() + 3);
        urgentThreshold.setHours(23, 59, 59, 999);
        
        const urgentDeadlines = this.deadlines.filter(d => {
            if (d.status !== 'pending') return false;
            const dueDate = new Date(d.dueDateRaw);
            dueDate.setHours(0, 0, 0, 0);
            return dueDate <= urgentThreshold;
        });
        
        for (const deadline of urgentDeadlines) {
            const dueDate = new Date(deadline.dueDateRaw);
            const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
            
            if (!deadline.notified && diffDays <= 3 && diffDays >= 0) {
                this.notifyDeadline(deadline, diffDays);
                deadline.notified = true;
            }
            
            if (!deadline.reminderSent && diffDays === 1) {
                this.sendReminder(deadline);
                deadline.reminderSent = true;
            }
            
            if (diffDays < 0 && deadline.status === 'pending') {
                this.notifyOverdue(deadline);
                deadline.status = 'overdue';
            }
        }
        
        this.saveDeadlines();
        return urgentDeadlines;
    }
    
    /**
     * Notifica sobre prazo próximo
     */
    notifyDeadline(deadline, daysLeft) {
        const message = `⚠️ PRAZO JUDICIAL: ${deadline.description}\nProcesso: ${deadline.caseId}\nVence em ${daysLeft} ${daysLeft === 1 ? 'dia' : 'dias'} (${this.formatDate(deadline.dueDateRaw)})`;
        
        if (window.EliteUtils && window.EliteUtils.showToast) {
            window.EliteUtils.showToast(message, daysLeft <= 1 ? 'error' : 'warning');
        } else {
            console.warn('[ELITE] Prazo próximo:', message);
        }
        
        // Emitir evento para outros módulos
        window.dispatchEvent(new CustomEvent('deadlineUrgent', {
            detail: { deadline, daysLeft, message }
        }));
        
        // Registrar no log de atividades
        this.logActivity(deadline, `Prazo próximo (${daysLeft} dias)`);
        
        return this;
    }
    
    /**
     * Notifica sobre prazo vencido
     */
    notifyOverdue(deadline) {
        const overdueDays = Math.ceil((new Date() - new Date(deadline.dueDateRaw)) / (1000 * 60 * 60 * 24));
        const message = `🔴 PRAZO VENCIDO: ${deadline.description}\nProcesso: ${deadline.caseId}\nVencido há ${overdueDays} ${overdueDays === 1 ? 'dia' : 'dias'}`;
        
        if (window.EliteUtils && window.EliteUtils.showToast) {
            window.EliteUtils.showToast(message, 'error');
        } else {
            console.error('[ELITE] Prazo vencido:', message);
        }
        
        window.dispatchEvent(new CustomEvent('deadlineOverdue', {
            detail: { deadline, overdueDays, message }
        }));
        
        this.logActivity(deadline, `Prazo vencido (${overdueDays} dias)`);
        
        return this;
    }
    
    /**
     * Envia lembrete de prazo (dia anterior)
     */
    sendReminder(deadline) {
        const message = `📢 LEMBRETE: ${deadline.description}\nProcesso: ${deadline.caseId}\nVence AMANHÃ (${this.formatDate(deadline.dueDateRaw)})`;
        
        if (window.EliteUtils && window.EliteUtils.showToast) {
            window.EliteUtils.showToast(message, 'warning');
        }
        
        window.dispatchEvent(new CustomEvent('deadlineReminder', {
            detail: { deadline, message }
        }));
        
        this.logActivity(deadline, 'Lembrete enviado (D-1)');
        
        return this;
    }
    
    /**
     * Registra atividade no log RGPD
     */
    logActivity(deadline, action) {
        const logEntry = {
            timestamp: new Date().toLocaleString(),
            user: 'Sistema',
            action: `Prazo: ${action}`,
            entity: `${deadline.caseId} - ${deadline.description}`,
            hash: window.EliteUtils ? window.EliteUtils.generateHash(deadline.id + action) : null
        };
        
        const logs = JSON.parse(localStorage.getItem('elite_activity_log') || '[]');
        logs.unshift(logEntry);
        localStorage.setItem('elite_activity_log', JSON.stringify(logs.slice(0, 500)));
        
        return this;
    }
    
    /**
     * Marca prazo como concluído
     */
    markAsCompleted(id) {
        const deadline = this.deadlines.find(d => d.id === id);
        if (deadline) {
            deadline.status = 'completed';
            deadline.completedAt = new Date().toISOString();
            this.saveDeadlines();
            
            if (window.EliteUtils) {
                window.EliteUtils.showToast(`Prazo "${deadline.description}" concluído`, 'success');
            }
            
            this.logActivity(deadline, 'Prazo concluído');
        }
        return this;
    }
    
    /**
     * Renderiza o calendário de prazos para o dashboard
     */
    renderCalendar(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const pendingDeadlines = this.getPendingDeadlines(30);
        const overdueDeadlines = this.getOverdueDeadlines();
        
        container.innerHTML = `
            <div class="court-deadlines-widget">
                <div class="deadlines-summary">
                    <div class="summary-card">
                        <div class="summary-value">${pendingDeadlines.length}</div>
                        <div class="summary-label">Prazos Pendentes</div>
                    </div>
                    <div class="summary-card urgent">
                        <div class="summary-value">${overdueDeadlines.length}</div>
                        <div class="summary-label">Prazos Vencidos</div>
                    </div>
                    <div class="summary-card">
                        <div class="summary-value">${this.deadlines.filter(d => d.status === 'completed').length}</div>
                        <div class="summary-label">Concluídos</div>
                    </div>
                </div>
                <div class="deadlines-list">
                    <h4>Próximos Prazos</h4>
                    ${pendingDeadlines.slice(0, 5).map(d => `
                        <div class="deadline-row priority-${d.priority}">
                            <div class="deadline-date">${this.formatDate(d.dueDateRaw)}</div>
                            <div class="deadline-info">
                                <strong>${d.description}</strong>
                                <small>${d.caseId}</small>
                            </div>
                            <button class="complete-btn" data-id="${d.id}" title="Marcar como concluído">✓</button>
                        </div>
                    `).join('')}
                    ${pendingDeadlines.length === 0 ? '<div class="empty-state">Nenhum prazo pendente</div>' : ''}
                </div>
            </div>
        `;
        
        container.querySelectorAll('.complete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(btn.dataset.id);
                this.markAsCompleted(id);
                this.renderCalendar(containerId);
            });
        });
    }
    
    /**
     * Exporta prazos para CSV
     */
    exportToCSV() {
        const headers = ['ID', 'Processo', 'Descrição', 'Data Vencimento', 'Tipo', 'Prioridade', 'Status', 'Notas'];
        const rows = this.deadlines.map(d => [
            d.id,
            d.caseId,
            d.description,
            this.formatDate(d.dueDateRaw),
            d.type,
            d.priority,
            d.status,
            d.notes || ''
        ]);
        
        const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
        const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `prazos_judiciais_${new Date().toISOString().slice(0, 10)}.csv`;
        link.click();
        URL.revokeObjectURL(link.href);
        
        if (window.EliteUtils) {
            window.EliteUtils.showToast('Prazos exportados com sucesso', 'success');
        }
        
        return this;
    }
    
    /**
     * Define callback para notificações personalizadas
     */
    setNotificationCallback(callback) {
        this.notificationCallback = callback;
        return this;
    }
    
    /**
     * Obtém estatísticas de prazos
     */
    getStatistics() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const pending = this.deadlines.filter(d => d.status === 'pending');
        const overdue = this.getOverdueDeadlines();
        const urgent = this.getPendingDeadlines(3);
        
        const byPriority = {
            1: pending.filter(d => d.priority === 1).length,
            2: pending.filter(d => d.priority === 2).length,
            3: pending.filter(d => d.priority === 3).length,
            4: pending.filter(d => d.priority === 4).length,
            5: pending.filter(d => d.priority === 5).length
        };
        
        const byType = {
            judicial: pending.filter(d => d.type === 'judicial').length,
            civil: pending.filter(d => d.type === 'civil').length,
            procedural: pending.filter(d => d.type === 'procedural').length
        };
        
        return {
            total: this.deadlines.length,
            pending: pending.length,
            completed: this.deadlines.filter(d => d.status === 'completed').length,
            overdue: overdue.length,
            urgent: urgent.length,
            byPriority,
            byType,
            nextDeadline: pending.length > 0 ? this.formatDate(pending.sort((a, b) => new Date(a.dueDateRaw) - new Date(b.dueDateRaw))[0].dueDateRaw) : null
        };
    }
}

// Instância global
window.CourtDeadlines = new CourtDeadlines();