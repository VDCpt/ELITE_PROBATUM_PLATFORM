/**
 * ============================================================================
 * ELITE PROBATUM — COMPONENTES DE GRÁFICOS
 * ============================================================================
 * Módulo unificado para criação e gestão de gráficos interativos
 * com Chart.js, incluindo gráficos de linha, barra, doughnut, radar e área.
 * ============================================================================
 */

class EliteCharts {
    constructor() {
        this.charts = {};
        this.defaultColors = {
            primary: '#00e5ff',
            secondary: '#ff1744',
            success: '#00e676',
            warning: '#ffc107',
            info: '#3b82f6',
            purple: '#8b5cf6',
            pink: '#ec489a',
            teal: '#14b8a6',
            orange: '#f97316',
            gray: '#64748b'
        };
        
        this.chartInstances = new Map();
    }
    
    /**
     * Cria gráfico de linha
     * @param {string} elementId - ID do elemento canvas
     * @param {Object} data - Dados do gráfico
     * @param {Object} options - Opções adicionais
     * @returns {Chart} Instância do gráfico
     */
    createLineChart(elementId, data, options = {}) {
        const ctx = document.getElementById(elementId);
        if (!ctx) {
            console.warn(`[EliteCharts] Elemento ${elementId} não encontrado`);
            return null;
        }
        
        // Destruir gráfico existente
        this.destroyChart(elementId);
        
        const defaultOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: '#94a3b8',
                        font: {
                            family: 'JetBrains Mono',
                            size: 10
                        },
                        usePointStyle: true,
                        boxWidth: 8
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: '#0a0c10',
                    titleColor: '#00e5ff',
                    bodyColor: '#e2e8f0',
                    borderColor: '#00e5ff',
                    borderWidth: 1,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                const value = context.parsed.y;
                                if (options.currency) {
                                    label += new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(value);
                                } else if (options.percentage) {
                                    label += value.toFixed(1) + '%';
                                } else {
                                    label += value.toLocaleString();
                                }
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                y: {
                    ticks: {
                        color: '#94a3b8',
                        font: { family: 'JetBrains Mono', size: 10 },
                        callback: function(value) {
                            if (options.currency) {
                                return '€' + value.toLocaleString();
                            }
                            if (options.percentage) {
                                return value.toFixed(0) + '%';
                            }
                            return value;
                        }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)',
                        drawBorder: false
                    },
                    border: {
                        dash: [4, 4]
                    }
                },
                x: {
                    ticks: {
                        color: '#94a3b8',
                        font: { family: 'JetBrains Mono', size: 10 }
                    },
                    grid: {
                        display: false
                    }
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            },
            elements: {
                point: {
                    radius: 3,
                    hoverRadius: 6,
                    backgroundColor: '#00e5ff',
                    borderColor: '#00e5ff'
                },
                line: {
                    tension: 0.3,
                    borderWidth: 2
                }
            }
        };
        
        const mergedOptions = this.mergeDeep(defaultOptions, options);
        
        const chart = new Chart(ctx, {
            type: 'line',
            data: data,
            options: mergedOptions
        });
        
        this.chartInstances.set(elementId, chart);
        return chart;
    }
    
    /**
     * Cria gráfico de barras
     * @param {string} elementId - ID do elemento canvas
     * @param {Object} data - Dados do gráfico
     * @param {Object} options - Opções adicionais
     * @returns {Chart} Instância do gráfico
     */
    createBarChart(elementId, data, options = {}) {
        const ctx = document.getElementById(elementId);
        if (!ctx) {
            console.warn(`[EliteCharts] Elemento ${elementId} não encontrado`);
            return null;
        }
        
        this.destroyChart(elementId);
        
        const defaultOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: '#94a3b8',
                        font: { family: 'JetBrains Mono', size: 10 },
                        usePointStyle: true
                    }
                },
                tooltip: {
                    backgroundColor: '#0a0c10',
                    titleColor: '#00e5ff',
                    bodyColor: '#e2e8f0',
                    borderColor: '#00e5ff',
                    borderWidth: 1
                }
            },
            scales: {
                y: {
                    ticks: {
                        color: '#94a3b8',
                        font: { family: 'JetBrains Mono', size: 10 },
                        callback: function(value) {
                            if (options.currency) {
                                return '€' + value.toLocaleString();
                            }
                            if (options.percentage) {
                                return value.toFixed(0) + '%';
                            }
                            return value;
                        }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)'
                    }
                },
                x: {
                    ticks: {
                        color: '#94a3b8',
                        font: { family: 'JetBrains Mono', size: 10 }
                    },
                    grid: {
                        display: false
                    }
                }
            }
        };
        
        const mergedOptions = this.mergeDeep(defaultOptions, options);
        
        const chart = new Chart(ctx, {
            type: 'bar',
            data: data,
            options: mergedOptions
        });
        
        this.chartInstances.set(elementId, chart);
        return chart;
    }
    
    /**
     * Cria gráfico de doughnut (rosca)
     * @param {string} elementId - ID do elemento canvas
     * @param {Object} data - Dados do gráfico
     * @param {Object} options - Opções adicionais
     * @returns {Chart} Instância do gráfico
     */
    createDoughnutChart(elementId, data, options = {}) {
        const ctx = document.getElementById(elementId);
        if (!ctx) {
            console.warn(`[EliteCharts] Elemento ${elementId} não encontrado`);
            return null;
        }
        
        this.destroyChart(elementId);
        
        const defaultOptions = {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '60%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#94a3b8',
                        font: { family: 'JetBrains Mono', size: 10 },
                        usePointStyle: true,
                        boxWidth: 10
                    }
                },
                tooltip: {
                    backgroundColor: '#0a0c10',
                    titleColor: '#00e5ff',
                    bodyColor: '#e2e8f0',
                    borderColor: '#00e5ff',
                    borderWidth: 1,
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                            return `${label}: ${value} (${percentage}%)`;
                        }
                    }
                }
            }
        };
        
        const mergedOptions = this.mergeDeep(defaultOptions, options);
        
        const chart = new Chart(ctx, {
            type: 'doughnut',
            data: data,
            options: mergedOptions
        });
        
        this.chartInstances.set(elementId, chart);
        return chart;
    }
    
    /**
     * Cria gráfico de radar
     * @param {string} elementId - ID do elemento canvas
     * @param {Object} data - Dados do gráfico
     * @param {Object} options - Opções adicionais
     * @returns {Chart} Instância do gráfico
     */
    createRadarChart(elementId, data, options = {}) {
        const ctx = document.getElementById(elementId);
        if (!ctx) {
            console.warn(`[EliteCharts] Elemento ${elementId} não encontrado`);
            return null;
        }
        
        this.destroyChart(elementId);
        
        const defaultOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: '#94a3b8',
                        font: { family: 'JetBrains Mono', size: 10 }
                    }
                },
                tooltip: {
                    backgroundColor: '#0a0c10',
                    titleColor: '#00e5ff',
                    bodyColor: '#e2e8f0'
                }
            },
            scales: {
                r: {
                    ticks: {
                        color: '#94a3b8',
                        backdropColor: 'transparent',
                        font: { family: 'JetBrains Mono', size: 9 }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    angleLines: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    pointLabels: {
                        color: '#94a3b8',
                        font: { family: 'JetBrains Mono', size: 9 }
                    }
                }
            }
        };
        
        const mergedOptions = this.mergeDeep(defaultOptions, options);
        
        const chart = new Chart(ctx, {
            type: 'radar',
            data: data,
            options: mergedOptions
        });
        
        this.chartInstances.set(elementId, chart);
        return chart;
    }
    
    /**
     * Cria gráfico de área (line com fill)
     * @param {string} elementId - ID do elemento canvas
     * @param {Object} data - Dados do gráfico
     * @param {Object} options - Opções adicionais
     * @returns {Chart} Instância do gráfico
     */
    createAreaChart(elementId, data, options = {}) {
        const ctx = document.getElementById(elementId);
        if (!ctx) {
            console.warn(`[EliteCharts] Elemento ${elementId} não encontrado`);
            return null;
        }
        
        // Garantir que os datasets tenham fill ativado
        const areaData = {
            ...data,
            datasets: data.datasets.map(dataset => ({
                ...dataset,
                fill: true,
                backgroundColor: dataset.backgroundColor || 'rgba(0, 229, 255, 0.1)',
                tension: 0.3
            }))
        };
        
        return this.createLineChart(elementId, areaData, options);
    }
    
    /**
     * Cria gráfico de barras horizontais
     * @param {string} elementId - ID do elemento canvas
     * @param {Object} data - Dados do gráfico
     * @param {Object} options - Opções adicionais
     * @returns {Chart} Instância do gráfico
     */
    createHorizontalBarChart(elementId, data, options = {}) {
        const ctx = document.getElementById(elementId);
        if (!ctx) {
            console.warn(`[EliteCharts] Elemento ${elementId} não encontrado`);
            return null;
        }
        
        this.destroyChart(elementId);
        
        const defaultOptions = {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: '#94a3b8',
                        font: { family: 'JetBrains Mono', size: 10 }
                    }
                },
                tooltip: {
                    backgroundColor: '#0a0c10',
                    titleColor: '#00e5ff',
                    bodyColor: '#e2e8f0'
                }
            },
            scales: {
                y: {
                    ticks: {
                        color: '#94a3b8',
                        font: { family: 'JetBrains Mono', size: 10 }
                    },
                    grid: {
                        display: false
                    }
                },
                x: {
                    ticks: {
                        color: '#94a3b8',
                        font: { family: 'JetBrains Mono', size: 10 }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)'
                    }
                }
            }
        };
        
        const mergedOptions = this.mergeDeep(defaultOptions, options);
        
        const chart = new Chart(ctx, {
            type: 'bar',
            data: data,
            options: mergedOptions
        });
        
        this.chartInstances.set(elementId, chart);
        return chart;
    }
    
    /**
     * Atualiza dados de um gráfico existente
     * @param {string} elementId - ID do elemento canvas
     * @param {Object} newData - Novos dados
     * @param {boolean} updateOptions - Se deve atualizar opções
     */
    updateChart(elementId, newData, updateOptions = false) {
        const chart = this.chartInstances.get(elementId);
        if (!chart) {
            console.warn(`[EliteCharts] Gráfico ${elementId} não encontrado`);
            return false;
        }
        
        if (updateOptions) {
            chart.data = newData;
            chart.update();
        } else {
            // Atualizar apenas os datasets
            if (newData.datasets) {
                chart.data.datasets = newData.datasets;
            }
            if (newData.labels) {
                chart.data.labels = newData.labels;
            }
            chart.update();
        }
        
        return true;
    }
    
    /**
     * Adiciona dataset a um gráfico existente
     * @param {string} elementId - ID do elemento canvas
     * @param {Object} dataset - Novo dataset
     */
    addDataset(elementId, dataset) {
        const chart = this.chartInstances.get(elementId);
        if (!chart) {
            console.warn(`[EliteCharts] Gráfico ${elementId} não encontrado`);
            return false;
        }
        
        chart.data.datasets.push(dataset);
        chart.update();
        return true;
    }
    
    /**
     * Remove dataset de um gráfico
     * @param {string} elementId - ID do elemento canvas
     * @param {number} index - Índice do dataset a remover
     */
    removeDataset(elementId, index) {
        const chart = this.chartInstances.get(elementId);
        if (!chart) {
            console.warn(`[EliteCharts] Gráfico ${elementId} não encontrado`);
            return false;
        }
        
        if (index >= 0 && index < chart.data.datasets.length) {
            chart.data.datasets.splice(index, 1);
            chart.update();
            return true;
        }
        
        return false;
    }
    
    /**
     * Destroi um gráfico
     * @param {string} elementId - ID do elemento canvas
     */
    destroyChart(elementId) {
        const chart = this.chartInstances.get(elementId);
        if (chart) {
            chart.destroy();
            this.chartInstances.delete(elementId);
        }
    }
    
    /**
     * Destroi todos os gráficos
     */
    destroyAllCharts() {
        for (const [elementId, chart] of this.chartInstances) {
            chart.destroy();
        }
        this.chartInstances.clear();
    }
    
    /**
     * Gera dados para gráfico de evolução temporal
     * @param {Array} data - Dados originais
     * @param {string} dateField - Campo de data
     * @param {string} valueField - Campo de valor
     * @param {string} groupBy - Agrupamento (day, week, month)
     * @returns {Object} Dados formatados para gráfico
     */
    generateTimeSeriesData(data, dateField, valueField, groupBy = 'month') {
        const grouped = {};
        
        data.forEach(item => {
            const date = moment(item[dateField]);
            let key;
            
            switch(groupBy) {
                case 'day':
                    key = date.format('DD/MM');
                    break;
                case 'week':
                    key = `Sem ${date.week()}`;
                    break;
                case 'month':
                    key = date.format('MMM');
                    break;
                default:
                    key = date.format('MMM');
            }
            
            if (!grouped[key]) {
                grouped[key] = 0;
            }
            grouped[key] += item[valueField];
        });
        
        const labels = Object.keys(grouped);
        const values = Object.values(grouped);
        
        return { labels, values };
    }
    
    /**
     * Gera dados para gráfico de distribuição por categoria
     * @param {Array} data - Dados originais
     * @param {string} categoryField - Campo de categoria
     * @param {string} valueField - Campo de valor (opcional)
     * @returns {Object} Dados formatados para gráfico
     */
    generateCategoryDistribution(data, categoryField, valueField = null) {
        const distribution = {};
        
        data.forEach(item => {
            const category = item[categoryField];
            const value = valueField ? item[valueField] : 1;
            
            if (!distribution[category]) {
                distribution[category] = 0;
            }
            distribution[category] += value;
        });
        
        const labels = Object.keys(distribution);
        const values = Object.values(distribution);
        
        // Cores padrão para categorias
        const colors = [
            '#00e5ff', '#ff1744', '#00e676', '#ffc107', '#3b82f6',
            '#8b5cf6', '#ec489a', '#14b8a6', '#f97316', '#64748b'
        ];
        
        return {
            labels,
            datasets: [{
                data: values,
                backgroundColor: colors.slice(0, labels.length),
                borderWidth: 0,
                hoverOffset: 10
            }]
        };
    }
    
    /**
     * Gera dados para gráfico de comparação
     * @param {Array} data - Dados originais
     * @param {string} labelField - Campo de rótulo
     * @param {Array} valueFields - Campos de valores
     * @param {Array} colors - Cores dos datasets
     * @returns {Object} Dados formatados para gráfico
     */
    generateComparisonData(data, labelField, valueFields, colors = null) {
        const labels = data.map(item => item[labelField]);
        const datasets = [];
        
        const defaultColors = [this.defaultColors.primary, this.defaultColors.secondary, this.defaultColors.success];
        
        valueFields.forEach((field, index) => {
            const values = data.map(item => item[field]);
            datasets.push({
                label: field.charAt(0).toUpperCase() + field.slice(1),
                data: values,
                backgroundColor: colors ? colors[index] : defaultColors[index % defaultColors.length],
                borderColor: colors ? colors[index] : defaultColors[index % defaultColors.length],
                borderWidth: 1
            });
        });
        
        return { labels, datasets };
    }
    
    /**
     * Gera cores para gráfico baseado em gradiente
     * @param {CanvasRenderingContext2D} ctx - Contexto do canvas
     * @param {string} startColor - Cor inicial
     * @param {string} endColor - Cor final
     * @returns {CanvasGradient} Gradiente linear
     */
    createGradient(ctx, startColor, endColor) {
        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, startColor);
        gradient.addColorStop(1, endColor);
        return gradient;
    }
    
    /**
     * Exporta gráfico como imagem
     * @param {string} elementId - ID do elemento canvas
     * @param {string} format - Formato (png, jpeg)
     * @returns {string} Data URL da imagem
     */
    exportAsImage(elementId, format = 'png') {
        const canvas = document.getElementById(elementId);
        if (!canvas) {
            console.warn(`[EliteCharts] Elemento ${elementId} não encontrado`);
            return null;
        }
        
        return canvas.toDataURL(`image/${format}`);
    }
    
    /**
     * Cria gráfico de sparkline (mini gráfico)
     * @param {string} elementId - ID do elemento canvas
     * @param {Array} data - Dados numéricos
     * @param {Object} options - Opções
     * @returns {Chart} Instância do gráfico
     */
    createSparkline(elementId, data, options = {}) {
        const ctx = document.getElementById(elementId);
        if (!ctx) {
            console.warn(`[EliteCharts] Elemento ${elementId} não encontrado`);
            return null;
        }
        
        this.destroyChart(elementId);
        
        const defaultOptions = {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: false },
                tooltip: { enabled: false }
            },
            scales: {
                x: { display: false },
                y: { display: false }
            },
            elements: {
                point: { radius: 0 },
                line: { borderWidth: 1.5, tension: 0.2 }
            }
        };
        
        const mergedOptions = this.mergeDeep(defaultOptions, options);
        
        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.map((_, i) => i),
                datasets: [{
                    data: data,
                    borderColor: options.color || this.defaultColors.primary,
                    backgroundColor: 'transparent',
                    fill: false
                }]
            },
            options: mergedOptions
        });
        
        this.chartInstances.set(elementId, chart);
        return chart;
    }
    
    /**
     * Mescla objetos profundamente
     * @param {Object} target - Objeto alvo
     * @param {Object} source - Objeto fonte
     * @returns {Object} Objeto mesclado
     */
    mergeDeep(target, source) {
        const output = { ...target };
        
        if (this.isObject(target) && this.isObject(source)) {
            Object.keys(source).forEach(key => {
                if (this.isObject(source[key])) {
                    if (!(key in target)) {
                        output[key] = source[key];
                    } else {
                        output[key] = this.mergeDeep(target[key], source[key]);
                    }
                } else {
                    output[key] = source[key];
                }
            });
        }
        
        return output;
    }
    
    /**
     * Verifica se valor é objeto
     * @param {*} item - Valor a verificar
     * @returns {boolean}
     */
    isObject(item) {
        return item && typeof item === 'object' && !Array.isArray(item);
    }
    
    /**
     * Obtém instância de um gráfico
     * @param {string} elementId - ID do elemento canvas
     * @returns {Chart|null} Instância do gráfico
     */
    getChart(elementId) {
        return this.chartInstances.get(elementId) || null;
    }
    
    /**
     * Lista todos os gráficos ativos
     * @returns {Array} Lista de IDs dos gráficos
     */
    listCharts() {
        return Array.from(this.chartInstances.keys());
    }
}

// Instância global
window.EliteCharts = new EliteCharts();