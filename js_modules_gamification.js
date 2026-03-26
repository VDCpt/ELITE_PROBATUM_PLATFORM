/**
 * ============================================================================
 * ELITE PROBATUM — MÓDULO DE GAMIFICAÇÃO
 * ============================================================================
 * Sistema de recompensas, rankings, conquistas e gamificação para advogados,
 * incentivando performance, eficiência e colaboração.
 * ============================================================================
 */

class GamificationSystem {
    constructor() {
        this.users = [];
        this.achievements = [];
        this.leaderboard = [];
        this.badges = [];
        this.rewards = [];
        this.quests = [];
        this.activeChallenges = [];
        this.initialized = false;
        
        this.loadUsers();
        this.loadAchievements();
        this.loadLeaderboard();
        this.initBadges();
        this.initQuests();
    }
    
    /**
     * Inicializa o sistema de gamificação
     */
    initialize() {
        this.initialized = true;
        this.startChallengeMonitor();
        console.log('[ELITE] Gamification System inicializado -', this.users.length, 'utilizadores ativos');
        return this;
    }
    
    /**
     * Carrega utilizadores do localStorage
     */
    loadUsers() {
        const stored = localStorage.getItem('elite_gamification_users');
        if (stored) {
            try {
                this.users = JSON.parse(stored);
            } catch (e) {
                console.error('[ELITE] Erro ao carregar utilizadores:', e);
                this.initDemoUsers();
            }
        } else {
            this.initDemoUsers();
        }
    }
    
    /**
     * Inicializa utilizadores de demonstração
     */
    initDemoUsers() {
        this.users = [
            {
                id: 'user_001',
                name: 'Dra. Ana Silva',
                role: 'Sócia',
                team: 'Litígio',
                level: 12,
                xp: 2840,
                xpToNextLevel: 500,
                points: 1250,
                reputation: 98,
                casesWon: 24,
                casesLost: 6,
                hoursBilled: 1850,
                efficiency: 0.89,
                badges: ['gold_medal', 'litigation_master', 'client_satisfaction'],
                joinedAt: '2024-01-15',
                streak: 15,
                lastActive: new Date().toISOString()
            },
            {
                id: 'user_002',
                name: 'Dr. Pedro Santos',
                role: 'Advogado Sénior',
                team: 'Litígio',
                level: 9,
                xp: 1560,
                xpToNextLevel: 440,
                points: 890,
                reputation: 85,
                casesWon: 16,
                casesLost: 5,
                hoursBilled: 1250,
                efficiency: 0.82,
                badges: ['silver_medal', 'documentary_expert'],
                joinedAt: '2024-02-10',
                streak: 8,
                lastActive: new Date().toISOString()
            },
            {
                id: 'user_003',
                name: 'Dra. Maria Costa',
                role: 'Advogada',
                team: 'Arbitragem',
                level: 7,
                xp: 980,
                xpToNextLevel: 320,
                points: 560,
                reputation: 78,
                casesWon: 12,
                casesLost: 3,
                hoursBilled: 890,
                efficiency: 0.85,
                badges: ['bronze_medal', 'arbitration_specialist'],
                joinedAt: '2024-03-01',
                streak: 12,
                lastActive: new Date().toISOString()
            },
            {
                id: 'user_004',
                name: 'Dr. João Mendes',
                role: 'Advogado Sénior',
                team: 'Fiscal',
                level: 10,
                xp: 2120,
                xpToNextLevel: 380,
                points: 1120,
                reputation: 92,
                casesWon: 21,
                casesLost: 4,
                hoursBilled: 1680,
                efficiency: 0.91,
                badges: ['gold_medal', 'tax_expert', 'digital_forensics'],
                joinedAt: '2024-01-20',
                streak: 22,
                lastActive: new Date().toISOString()
            },
            {
                id: 'user_005',
                name: 'Dra. Sofia Rodrigues',
                role: 'Advogada',
                team: 'Laboral',
                level: 5,
                xp: 420,
                xpToNextLevel: 280,
                points: 245,
                reputation: 72,
                casesWon: 8,
                casesLost: 2,
                hoursBilled: 540,
                efficiency: 0.78,
                badges: [],
                joinedAt: '2024-04-15',
                streak: 5,
                lastActive: new Date().toISOString()
            }
        ];
        this.saveUsers();
    }
    
    /**
     * Inicializa conquistas disponíveis
     */
    loadAchievements() {
        this.achievements = [
            {
                id: 'first_blood',
                name: 'Primeira Vitória',
                description: 'Vencer o primeiro caso',
                icon: 'fa-trophy',
                points: 50,
                xp: 100,
                condition: (user) => user.casesWon >= 1,
                rarity: 'common'
            },
            {
                id: 'decade_master',
                name: 'Mestre da Década',
                description: 'Vencer 10 casos',
                icon: 'fa-crown',
                points: 200,
                xp: 500,
                condition: (user) => user.casesWon >= 10,
                rarity: 'rare'
            },
            {
                id: 'perfectionist',
                name: 'Perfeccionista',
                description: 'Taxa de sucesso superior a 80% com mais de 10 casos',
                icon: 'fa-star',
                points: 150,
                xp: 300,
                condition: (user) => user.casesWon >= 10 && (user.casesWon / (user.casesWon + user.casesLost)) >= 0.8,
                rarity: 'epic'
            },
            {
                id: 'bill_hunter',
                name: 'Caçador de Honorários',
                description: 'Atingir 1000 horas faturadas',
                icon: 'fa-clock',
                points: 100,
                xp: 200,
                condition: (user) => user.hoursBilled >= 1000,
                rarity: 'rare'
            },
            {
                id: 'streak_master',
                name: 'Mestre da Sequência',
                description: 'Manter atividade por 30 dias consecutivos',
                icon: 'fa-fire',
                points: 75,
                xp: 150,
                condition: (user) => user.streak >= 30,
                rarity: 'rare'
            },
            {
                id: 'litigation_warlord',
                name: 'Senhor da Guerra',
                description: 'Vencer 20 casos de litígio',
                icon: 'fa-gavel',
                points: 300,
                xp: 600,
                condition: (user) => user.casesWon >= 20 && user.team === 'Litígio',
                rarity: 'legendary'
            },
            {
                id: 'tax_overseer',
                name: 'Oficial Fiscal',
                description: 'Vencer 10 casos fiscais',
                icon: 'fa-calculator',
                points: 200,
                xp: 400,
                condition: (user) => user.casesWon >= 10 && user.team === 'Fiscal',
                rarity: 'epic'
            },
            {
                id: 'efficiency_guru',
                name: 'Guru da Eficiência',
                description: 'Taxa de eficiência superior a 90%',
                icon: 'fa-chart-line',
                points: 125,
                xp: 250,
                condition: (user) => user.efficiency >= 0.9,
                rarity: 'epic'
            },
            {
                id: 'client_champion',
                name: 'Campeão do Cliente',
                description: 'Alta satisfação do cliente (reputação > 90)',
                icon: 'fa-handshake',
                points: 100,
                xp: 200,
                condition: (user) => user.reputation >= 90,
                rarity: 'rare'
            }
        ];
    }
    
    /**
     * Inicializa badges disponíveis
     */
    initBadges() {
        this.badges = [
            { id: 'gold_medal', name: 'Medalha de Ouro', icon: 'fa-medal', color: '#ffd700', description: 'Top 3 no ranking geral' },
            { id: 'silver_medal', name: 'Medalha de Prata', icon: 'fa-medal', color: '#c0c0c0', description: 'Top 10 no ranking geral' },
            { id: 'bronze_medal', name: 'Medalha de Bronze', icon: 'fa-medal', color: '#cd7f32', description: 'Top 20 no ranking geral' },
            { id: 'litigation_master', name: 'Mestre do Litígio', icon: 'fa-gavel', color: '#ff1744', description: 'Especialista em litígio' },
            { id: 'tax_expert', name: 'Expert Fiscal', icon: 'fa-calculator', color: '#00e676', description: 'Especialista em direito fiscal' },
            { id: 'arbitration_specialist', name: 'Especialista em Arbitragem', icon: 'fa-balance-scale', color: '#3b82f6', description: 'Especialista em arbitragem' },
            { id: 'documentary_expert', name: 'Expert em Prova Documental', icon: 'fa-file-alt', color: '#ffc107', description: 'Mestre em prova documental' },
            { id: 'digital_forensics', name: 'Perito Forense Digital', icon: 'fa-microchip', color: '#00e5ff', description: 'Especialista em prova digital' },
            { id: 'client_satisfaction', name: 'Satisfação do Cliente', icon: 'fa-smile', color: '#00e676', description: 'Excelência no atendimento' }
        ];
    }
    
    /**
     * Inicializa quests diárias/semanais
     */
    initQuests() {
        this.quests = [
            {
                id: 'daily_001',
                name: 'Atividade Diária',
                description: 'Registar atividade no sistema',
                type: 'daily',
                reward: { points: 10, xp: 20 },
                condition: () => true,
                progress: 0,
                target: 1,
                completed: false
            },
            {
                id: 'daily_002',
                name: 'Análise de Caso',
                description: 'Analisar 3 casos com ferramenta IA',
                type: 'daily',
                reward: { points: 25, xp: 50 },
                condition: () => true,
                progress: 0,
                target: 3,
                completed: false
            },
            {
                id: 'daily_003',
                name: 'Registo de Evidência',
                description: 'Registar 1 evidência no Forensic Vault',
                type: 'daily',
                reward: { points: 15, xp: 30 },
                condition: () => true,
                progress: 0,
                target: 1,
                completed: false
            },
            {
                id: 'weekly_001',
                name: 'Semana de Ouro',
                description: 'Completar 5 quests diárias na semana',
                type: 'weekly',
                reward: { points: 100, xp: 200 },
                condition: () => true,
                progress: 0,
                target: 5,
                completed: false
            },
            {
                id: 'weekly_002',
                name: 'Caçador de Vitórias',
                description: 'Vencer 2 casos na semana',
                type: 'weekly',
                reward: { points: 150, xp: 300 },
                condition: () => true,
                progress: 0,
                target: 2,
                completed: false
            },
            {
                id: 'monthly_001',
                name: 'Campeão do Mês',
                description: 'Alcançar top 5 no ranking mensal',
                type: 'monthly',
                reward: { points: 500, xp: 1000, badge: 'gold_medal' },
                condition: () => true,
                progress: 0,
                target: 5,
                completed: false
            }
        ];
    }
    
    /**
     * Inicializa challenges entre equipas
     */
    initChallenges() {
        this.activeChallenges = [
            {
                id: 'challenge_001',
                name: 'Guerra dos Escritórios',
                description: 'Equipa com mais vitórias no mês',
                type: 'team',
                teams: ['Litígio', 'Fiscal', 'Arbitragem', 'Laboral'],
                startDate: new Date().toISOString(),
                endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                reward: { points: 500, xp: 1000, badge: 'champion' },
                scores: { Litígio: 12, Fiscal: 8, Arbitragem: 6, Laboral: 4 }
            },
            {
                id: 'challenge_002',
                name: 'Eficiência Total',
                description: 'Equipa com maior eficiência média',
                type: 'team',
                teams: ['Litígio', 'Fiscal', 'Arbitragem', 'Laboral'],
                startDate: new Date().toISOString(),
                endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
                reward: { points: 300, xp: 600 },
                scores: { Litígio: 0.85, Fiscal: 0.91, Arbitragem: 0.82, Laboral: 0.78 }
            }
        ];
    }
    
    /**
     * Adiciona XP e pontos a um utilizador
     */
    addXP(userId, xp, points = 0, reason = '') {
        const user = this.users.find(u => u.id === userId);
        if (!user) return null;
        
        user.xp += xp;
        user.points += points;
        
        // Verificar level up
        let levelUps = 0;
        while (user.xp >= user.xpToNextLevel) {
            user.xp -= user.xpToNextLevel;
            user.level++;
            user.xpToNextLevel = Math.floor(user.xpToNextLevel * 1.2);
            levelUps++;
        }
        
        // Verificar conquistas
        const newAchievements = this.checkAchievements(user);
        
        // Atualizar streak
        const lastActiveDate = new Date(user.lastActive);
        const today = new Date();
        const diffDays = Math.floor((today - lastActiveDate) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
            user.streak++;
        } else if (diffDays > 1) {
            user.streak = 1;
        }
        
        user.lastActive = today.toISOString();
        
        this.saveUsers();
        this.updateLeaderboard();
        
        // Registrar evento
        this.logActivity(userId, `Ganhou ${xp} XP e ${points} pontos - ${reason}`);
        
        if (levelUps > 0 && window.EliteUtils) {
            window.EliteUtils.showToast(`🏆 ${user.name} subiu para nível ${user.level}!`, 'success');
        }
        
        if (newAchievements.length > 0 && window.EliteUtils) {
            window.EliteUtils.showToast(`🎖️ Nova conquista: ${newAchievements[0].name}`, 'success');
        }
        
        return { levelUps, newAchievements };
    }
    
    /**
     * Verifica e atribui conquistas
     */
    checkAchievements(user) {
        const newAchievements = [];
        
        for (const achievement of this.achievements) {
            if (!user.badges.includes(achievement.id) && achievement.condition(user)) {
                user.badges.push(achievement.id);
                user.points += achievement.points;
                user.xp += achievement.xp;
                newAchievements.push(achievement);
                
                this.logActivity(user.id, `Desbloqueou conquista: ${achievement.name}`);
            }
        }
        
        return newAchievements;
    }
    
    /**
     * Regista vitória em caso
     */
    registerCaseWin(userId, caseData) {
        const user = this.users.find(u => u.id === userId);
        if (!user) return null;
        
        user.casesWon++;
        
        // Pontuação baseada na complexidade do caso
        let xpGain = 100;
        let pointsGain = 50;
        
        if (caseData.value > 50000) {
            xpGain += 50;
            pointsGain += 25;
        }
        if (caseData.complexity === 'high') {
            xpGain += 75;
            pointsGain += 35;
        }
        
        this.addXP(userId, xpGain, pointsGain, `Vitória no caso ${caseData.id}`);
        
        return { xpGain, pointsGain };
    }
    
    /**
     * Regista derrota em caso (pontuação reduzida)
     */
    registerCaseLoss(userId, caseData) {
        const user = this.users.find(u => u.id === userId);
        if (!user) return null;
        
        user.casesLost++;
        
        // Pontos de aprendizagem mesmo em derrota
        const xpGain = 25;
        const pointsGain = 10;
        
        this.addXP(userId, xpGain, pointsGain, `Aprendizagem no caso ${caseData.id}`);
        
        return { xpGain, pointsGain };
    }
    
    /**
     * Regista horas faturadas
     */
    registerBilledHours(userId, hours) {
        const user = this.users.find(u => u.id === userId);
        if (!user) return null;
        
        user.hoursBilled += hours;
        
        const xpGain = Math.floor(hours * 10);
        const pointsGain = Math.floor(hours * 5);
        
        this.addXP(userId, xpGain, pointsGain, `${hours} horas faturadas`);
        
        return { xpGain, pointsGain };
    }
    
    /**
     * Atualiza ranking
     */
    updateLeaderboard() {
        this.leaderboard = [...this.users]
            .sort((a, b) => {
                // Ordenar por pontos, depois por nível, depois por reputação
                if (a.points !== b.points) return b.points - a.points;
                if (a.level !== b.level) return b.level - a.level;
                return b.reputation - a.reputation;
            })
            .map((user, index) => ({
                ...user,
                rank: index + 1,
                badge: index === 0 ? 'gold_medal' : index < 3 ? 'silver_medal' : index < 10 ? 'bronze_medal' : null
            }));
        
        // Atribuir badges baseadas no rank
        for (const user of this.leaderboard) {
            if (user.rank === 1 && !user.badges.includes('gold_medal')) {
                user.badges.push('gold_medal');
            } else if (user.rank <= 3 && !user.badges.includes('silver_medal')) {
                user.badges.push('silver_medal');
            } else if (user.rank <= 10 && !user.badges.includes('bronze_medal')) {
                user.badges.push('bronze_medal');
            }
        }
        
        this.saveLeaderboard();
        return this.leaderboard;
    }
    
    /**
     * Obtém ranking por equipa
     */
    getTeamLeaderboard() {
        const teamStats = {};
        
        for (const user of this.users) {
            if (!teamStats[user.team]) {
                teamStats[user.team] = {
                    name: user.team,
                    totalPoints: 0,
                    totalWins: 0,
                    totalEfficiency: 0,
                    members: 0
                };
            }
            
            teamStats[user.team].totalPoints += user.points;
            teamStats[user.team].totalWins += user.casesWon;
            teamStats[user.team].totalEfficiency += user.efficiency;
            teamStats[user.team].members++;
        }
        
        // Calcular médias
        for (const team in teamStats) {
            teamStats[team].avgEfficiency = teamStats[team].totalEfficiency / teamStats[team].members;
        }
        
        return Object.values(teamStats).sort((a, b) => b.totalPoints - a.totalPoints);
    }
    
    /**
     * Completa uma quest
     */
    completeQuest(userId, questId) {
        const quest = this.quests.find(q => q.id === questId);
        if (!quest || quest.completed) return null;
        
        const user = this.users.find(u => u.id === userId);
        if (!user) return null;
        
        quest.completed = true;
        quest.completedAt = new Date().toISOString();
        
        this.addXP(userId, quest.reward.xp, quest.reward.points, `Quest completada: ${quest.name}`);
        
        if (quest.reward.badge && !user.badges.includes(quest.reward.badge)) {
            user.badges.push(quest.reward.badge);
        }
        
        this.saveQuests();
        
        return quest;
    }
    
    /**
     * Atualiza progresso de quest
     */
    updateQuestProgress(questId, increment = 1) {
        const quest = this.quests.find(q => q.id === questId);
        if (!quest || quest.completed) return null;
        
        quest.progress += increment;
        
        if (quest.progress >= quest.target) {
            return this.completeQuest(questId);
        }
        
        this.saveQuests();
        return { progress: quest.progress, target: quest.target };
    }
    
    /**
     * Renderiza dashboard de gamificação
     */
    renderDashboard(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        this.updateLeaderboard();
        const topUsers = this.leaderboard.slice(0, 5);
        const teamRanking = this.getTeamLeaderboard();
        
        container.innerHTML = `
            <div class="gamification-dashboard">
                <div class="dashboard-header">
                    <h2><i class="fas fa-gamepad"></i> GAMIFICAÇÃO & RECOMPENSAS</h2>
                    <div class="header-stats">
                        <div class="stat"><span>🏆 Total Jogadores</span><strong>${this.users.length}</strong></div>
                        <div class="stat"><span>🎖️ Conquistas</span><strong>${this.achievements.length}</strong></div>
                        <div class="stat"><span>⚡ Quests Ativas</span><strong>${this.quests.filter(q => !q.completed).length}</strong></div>
                    </div>
                </div>
                
                <div class="leaderboard-section">
                    <h3><i class="fas fa-crown"></i> RANKING DE ADVOGADOS</h3>
                    <table class="data-table">
                        <thead>
                            <tr><th>#</th><th>Advogado</th><th>Equipa</th><th>Nível</th><th>Pontos</th><th>Vitórias</th><th>Eficiência</th><th>Insígnias</th> </tr>
                        </thead>
                        <tbody>
                            ${topUsers.map(user => `
                                <tr class="${user.rank === 1 ? 'rank-first' : user.rank <= 3 ? 'rank-top' : ''}">
                                    <td><strong>${user.rank}º</strong> ${user.rank === 1 ? '👑' : ''} </div>
                                    <td><strong>${user.name}</strong> </div>
                                    <td><span class="badge badge-primary">${user.team}</span> </div>
                                    <td>${user.level}</div>
                                    <td>${user.points}</div>
                                    <td>${user.casesWon}</div>
                                    <td>
                                        <div class="progress-bar" style="width: 80px;">
                                            <div class="progress-fill" style="width: ${user.efficiency * 100}%"></div>
                                            <span class="progress-text">${(user.efficiency * 100).toFixed(0)}%</span>
                                        </div>
                                     </div>
                                    <td>${user.badges.slice(0, 3).map(b => {
                                        const badge = this.badges.find(bdg => bdg.id === b);
                                        return badge ? `<span class="badge-tooltip" title="${badge.description}"><i class="fas ${badge.icon}" style="color: ${badge.color}"></i></span>` : '';
                                    }).join('')}</div>
                                 </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                
                <div class="team-ranking-section">
                    <h3><i class="fas fa-users"></i> RANKING POR EQUIPA</h3>
                    <div class="team-grid">
                        ${teamRanking.map(team => `
                            <div class="team-card">
                                <div class="team-header">
                                    <strong>${team.name}</strong>
                                    <span>${team.totalPoints} pts</span>
                                </div>
                                <div class="team-stats">
                                    <div>🎯 Vitórias: ${team.totalWins}</div>
                                    <div>⚡ Eficiência: ${(team.avgEfficiency * 100).toFixed(0)}%</div>
                                    <div>👥 Membros: ${team.members}</div>
                                </div>
                                <div class="team-progress">
                                    <div class="progress-bar">
                                        <div class="progress-fill" style="width: ${(team.totalPoints / (teamRanking[0]?.totalPoints || 1)) * 100}%"></div>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="achievements-section">
                    <h3><i class="fas fa-medal"></i> CONQUISTAS DISPONÍVEIS</h3>
                    <div class="achievements-grid">
                        ${this.achievements.map(ach => `
                            <div class="achievement-card rarity-${ach.rarity}">
                                <i class="fas ${ach.icon}"></i>
                                <div class="achievement-info">
                                    <strong>${ach.name}</strong>
                                    <p>${ach.description}</p>
                                    <small>🏆 ${ach.points} pts | ⚡ ${ach.xp} XP</small>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="quests-section">
                    <h3><i class="fas fa-tasks"></i> QUESTS DIÁRIAS</h3>
                    <div class="quests-grid">
                        ${this.quests.filter(q => q.type === 'daily' && !q.completed).map(quest => `
                            <div class="quest-card">
                                <div class="quest-header">
                                    <strong>${quest.name}</strong>
                                    <span class="quest-reward">+${quest.reward.xp} XP</span>
                                </div>
                                <p>${quest.description}</p>
                                <div class="quest-progress">
                                    <div class="progress-bar">
                                        <div class="progress-fill" style="width: ${(quest.progress / quest.target) * 100}%"></div>
                                        <span class="progress-text">${quest.progress}/${quest.target}</span>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                        ${this.quests.filter(q => q.type === 'daily' && !q.completed).length === 0 ? '<div class="empty-state">Todas as quests diárias completadas! 🎉</div>' : ''}
                    </div>
                </div>
            </div>
        `;
        
        // Estilos adicionais via CSS inline para elementos dinâmicos
        const style = document.createElement('style');
        style.textContent = `
            .rank-first { background: linear-gradient(90deg, rgba(255,215,0,0.1), transparent); border-left: 3px solid #ffd700; }
            .rank-top { background: linear-gradient(90deg, rgba(192,192,192,0.1), transparent); border-left: 3px solid #c0c0c0; }
            .team-card { background: var(--bg-terminal); border-radius: 12px; padding: 16px; border: 1px solid var(--border-tactic); }
            .team-header { display: flex; justify-content: space-between; margin-bottom: 12px; font-family: 'JetBrains Mono'; }
            .team-stats { display: flex; gap: 16px; font-size: 0.7rem; color: #94a3b8; margin-bottom: 12px; }
            .achievement-card { display: flex; gap: 12px; background: var(--bg-terminal); border-radius: 12px; padding: 12px; align-items: center; border-left: 3px solid; }
            .achievement-card.rarity-common { border-left-color: #94a3b8; }
            .achievement-card.rarity-rare { border-left-color: #3b82f6; }
            .achievement-card.rarity-epic { border-left-color: #8b5cf6; }
            .achievement-card.rarity-legendary { border-left-color: #ffd700; }
            .achievement-card i { font-size: 1.5rem; color: var(--elite-primary); }
            .achievement-info strong { display: block; font-size: 0.8rem; }
            .achievement-info p { font-size: 0.7rem; color: #94a3b8; margin: 4px 0; }
            .achievement-info small { font-size: 0.6rem; color: #64748b; }
            .quest-card { background: var(--bg-terminal); border-radius: 12px; padding: 16px; border: 1px solid var(--border-tactic); }
            .quest-header { display: flex; justify-content: space-between; margin-bottom: 8px; }
            .quest-reward { color: var(--elite-success); font-size: 0.7rem; font-weight: bold; }
            .quest-card p { font-size: 0.7rem; color: #94a3b8; margin-bottom: 12px; }
            .badge-tooltip { cursor: help; margin-right: 4px; }
            .achievements-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 12px; }
            .quests-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; }
            .team-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 16px; }
        `;
        container.appendChild(style);
    }
    
    /**
     * Inicia monitorização de challenges
     */
    startChallengeMonitor() {
        setInterval(() => {
            this.checkChallenges();
        }, 24 * 60 * 60 * 1000); // A cada 24 horas
    }
    
    /**
     * Verifica challenges ativos
     */
    checkChallenges() {
        const now = new Date();
        
        for (const challenge of this.activeChallenges) {
            const endDate = new Date(challenge.endDate);
            if (now >= endDate && !challenge.completed) {
                this.resolveChallenge(challenge);
            }
        }
    }
    
    /**
     * Resolve challenge e atribui recompensas
     */
    resolveChallenge(challenge) {
        const winners = Object.entries(challenge.scores)
            .sort((a, b) => b[1] - a[1]);
        
        const winnerTeam = winners[0][0];
        
        // Atribuir recompensa aos membros da equipa vencedora
        const teamMembers = this.users.filter(u => u.team === winnerTeam);
        
        for (const member of teamMembers) {
            this.addXP(member.id, challenge.reward.xp, challenge.reward.points, `Vitória no challenge: ${challenge.name}`);
            
            if (challenge.reward.badge && !member.badges.includes(challenge.reward.badge)) {
                member.badges.push(challenge.reward.badge);
            }
        }
        
        challenge.completed = true;
        challenge.winner = winnerTeam;
        
        if (window.EliteUtils) {
            window.EliteUtils.showToast(`🏆 Challenge "${challenge.name}" vencido por ${winnerTeam}!`, 'success');
        }
        
        this.saveChallenges();
    }
    
    /**
     * Regista atividade no log
     */
    logActivity(userId, action) {
        const logEntry = {
            timestamp: new Date().toLocaleString(),
            user: userId,
            action: `Gamificação: ${action}`,
            entity: 'gamification',
            hash: window.EliteUtils ? window.EliteUtils.generateHash(userId + action) : null
        };
        
        const logs = JSON.parse(localStorage.getItem('elite_activity_log') || '[]');
        logs.unshift(logEntry);
        localStorage.setItem('elite_activity_log', JSON.stringify(logs.slice(0, 500)));
    }
    
    /**
     * Salva utilizadores no localStorage
     */
    saveUsers() {
        localStorage.setItem('elite_gamification_users', JSON.stringify(this.users));
    }
    
    /**
     * Salva leaderboard no localStorage
     */
    saveLeaderboard() {
        localStorage.setItem('elite_gamification_leaderboard', JSON.stringify(this.leaderboard));
    }
    
    /**
     * Carrega leaderboard do localStorage
     */
    loadLeaderboard() {
        const stored = localStorage.getItem('elite_gamification_leaderboard');
        if (stored) {
            try {
                this.leaderboard = JSON.parse(stored);
            } catch (e) {
                this.leaderboard = [];
            }
        }
    }
    
    /**
     * Salva quests no localStorage
     */
    saveQuests() {
        localStorage.setItem('elite_gamification_quests', JSON.stringify(this.quests));
    }
    
    /**
     * Salva challenges no localStorage
     */
    saveChallenges() {
        localStorage.setItem('elite_gamification_challenges', JSON.stringify(this.activeChallenges));
    }
    
    /**
     * Obtém estatísticas de gamificação
     */
    getStatistics() {
        const totalUsers = this.users.length;
        const totalPoints = this.users.reduce((sum, u) => sum + u.points, 0);
        const totalWins = this.users.reduce((sum, u) => sum + u.casesWon, 0);
        const avgLevel = this.users.reduce((sum, u) => sum + u.level, 0) / totalUsers;
        const totalAchievements = this.users.reduce((sum, u) => sum + u.badges.length, 0);
        
        return {
            totalUsers,
            totalPoints,
            totalWins,
            avgLevel: avgLevel.toFixed(1),
            totalAchievements,
            topUser: this.leaderboard[0],
            activeQuests: this.quests.filter(q => !q.completed).length,
            activeChallenges: this.activeChallenges.filter(c => !c.completed).length
        };
    }
}

// Instância global
window.GamificationSystem = new GamificationSystem();