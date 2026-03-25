/**
 * ============================================================================
 * UNIFED-ELITE PLATFORM — COMPONENTES DE GRÁFICOS
 * ============================================================================
 */

class EliteCharts {
    constructor() {
        this.charts = {};
    }
    
    createLineChart(elementId, data, options = {}) {
        const ctx = document.getElementById(elementId);
        if (!ctx) return null;
        
        const defaultOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { labels: { color: '#94A3B8' } },
                tooltip: { mode: 'index', intersect: false }
            },
            scales: {
                y: { 
                    ticks: { color: '#94A3B8' },
                    grid: { color: 'rgba(255,255,255,0.05)' }
                },
                x: { 
                    ticks: { color: '#94A3B8' },
                    grid: { color: 'rgba(255,255,255,0.05)' }
                }
            }
        };
        
        const chart = new Chart(ctx, {
            type: 'line',
            data: data,
            options: { ...defaultOptions, ...options }
        });
        
        this.charts[elementId] = chart;
        return chart;
    }
    
    createBarChart(elementId, data, options = {}) {
        const ctx = document.getElementById(elementId);
        if (!ctx) return null;
        
        const defaultOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { labels: { color: '#94A3B8' } }
            },
            scales: {
                y: { 
                    ticks: { color: '#94A3B8' },
                    grid: { color: 'rgba(255,255,255,0.05)' }
                },
                x: { 
                    ticks: { color: '#94A3B8' },
                    grid: { color: 'rgba(255,255,255,0.05)' }
                }
            }
        };
        
        const chart = new Chart(ctx, {
            type: 'bar',
            data: data,
            options: { ...defaultOptions, ...options }
        });
        
        this.charts[elementId] = chart;
        return chart;
    }
    
    createDoughnutChart(elementId, data, options = {}) {
        const ctx = document.getElementById(elementId);
        if (!ctx) return null;
        
        const defaultOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { 
                    position: 'bottom',
                    labels: { color: '#94A3B8' }
                }
            }
        };
        
        const chart = new Chart(ctx, {
            type: 'doughnut',
            data: data,
            options: { ...defaultOptions, ...options }
        });
        
        this.charts[elementId] = chart;
        return chart;
    }
    
    updateChart(chartId, newData) {
        if (this.charts[chartId]) {
            this.charts[chartId].data = newData;
            this.charts[chartId].update();
        }
    }
    
    destroyChart(chartId) {
        if (this.charts[chartId]) {
            this.charts[chartId].destroy();
            delete this.charts[chartId];
        }
    }
}

// Instância global
window.EliteCharts = new EliteCharts();