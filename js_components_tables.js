/**
 * ============================================================================
 * UNIFED-ELITE PLATFORM — COMPONENTES DE TABELAS
 * ============================================================================
 */

class EliteTables {
    constructor() {
        this.tables = {};
    }
    
    renderTable(containerId, columns, data, options = {}) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const table = document.createElement('table');
        table.className = 'data-table';
        
        // Header
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        columns.forEach(col => {
            const th = document.createElement('th');
            th.textContent = col.label;
            if (col.width) th.style.width = col.width;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);
        
        // Body
        const tbody = document.createElement('tbody');
        data.forEach((row, index) => {
            const tr = document.createElement('tr');
            tr.dataset.index = index;
            
            columns.forEach(col => {
                const td = document.createElement('td');
                const value = this.getNestedValue(row, col.key);
                
                if (col.render) {
                    td.innerHTML = col.render(value, row);
                } else {
                    td.textContent = value;
                }
                
                if (col.class) td.className = col.class;
                tr.appendChild(td);
            });
            
            tbody.appendChild(tr);
        });
        table.appendChild(tbody);
        
        container.innerHTML = '';
        container.appendChild(table);
        
        this.tables[containerId] = { columns, data, table, options };
        
        return table;
    }
    
    getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => current?.[key], obj) ?? '';
    }
    
    sortTable(containerId, columnKey, direction = 'asc') {
        const table = this.tables[containerId];
        if (!table) return;
        
        const sorted = [...table.data].sort((a, b) => {
            const aVal = this.getNestedValue(a, columnKey);
            const bVal = this.getNestedValue(b, columnKey);
            
            if (typeof aVal === 'number') {
                return direction === 'asc' ? aVal - bVal : bVal - aVal;
            }
            return direction === 'asc' 
                ? String(aVal).localeCompare(String(bVal))
                : String(bVal).localeCompare(String(aVal));
        });
        
        this.renderTable(containerId, table.columns, sorted, table.options);
    }
    
    filterTable(containerId, filterFn) {
        const table = this.tables[containerId];
        if (!table) return;
        
        const filtered = table.data.filter(filterFn);
        this.renderTable(containerId, table.columns, filtered, table.options);
    }
    
    exportToCSV(containerId, filename = 'export.csv') {
        const table = this.tables[containerId];
        if (!table) return;
        
        const headers = table.columns.map(col => col.label).join(',');
        const rows = table.data.map(row => {
            return table.columns.map(col => {
                let value = this.getNestedValue(row, col.key);
                if (typeof value === 'string' && value.includes(',')) {
                    value = `"${value}"`;
                }
                return value;
            }).join(',');
        });
        
        const csv = [headers, ...rows].join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
}

window.EliteTables = new EliteTables();