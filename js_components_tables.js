/**
 * ============================================================================
 * ELITE PROBATUM — COMPONENTES DE TABELAS
 * ============================================================================
 * Módulo unificado para criação e gestão de tabelas de dados,
 * com suporte a ordenação, filtragem, paginação e exportação.
 * ============================================================================
 */

class EliteTables {
    constructor() {
        this.tables = new Map();
        this.defaultPageSize = 25;
    }
    
    /**
     * Renderiza uma tabela de dados
     * @param {string} containerId - ID do elemento container
     * @param {Array} columns - Definição das colunas
     * @param {Array} data - Dados da tabela
     * @param {Object} options - Opções adicionais
     * @returns {Object} Referência da tabela
     */
    renderTable(containerId, columns, data, options = {}) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.warn(`[EliteTables] Container ${containerId} não encontrado`);
            return null;
        }
        
        // Configurações padrão
        const config = {
            pageSize: options.pageSize || this.defaultPageSize,
            currentPage: options.currentPage || 1,
            sortColumn: options.sortColumn || null,
            sortDirection: options.sortDirection || 'asc',
            searchable: options.searchable !== false,
            paginable: options.paginable !== false,
            exportable: options.exportable || false,
            selectable: options.selectable || false,
            responsive: options.responsive !== false,
            className: options.className || '',
            onRowClick: options.onRowClick || null,
            onSelectionChange: options.onSelectionChange || null,
            filters: options.filters || {}
        };
        
        // Estado da tabela
        const tableState = {
            id: containerId,
            columns: columns,
            originalData: [...data],
            filteredData: [...data],
            currentData: [],
            config: config,
            selectedRows: new Set(),
            sortState: { column: config.sortColumn, direction: config.sortDirection }
        };
        
        // Aplicar ordenação inicial se definida
        if (config.sortColumn) {
            this.applySort(tableState, config.sortColumn, config.sortDirection);
        }
        
        // Aplicar filtros
        this.applyFilters(tableState);
        
        // Renderizar
        this.renderTableContent(tableState, container);
        
        // Armazenar referência
        this.tables.set(containerId, tableState);
        
        return {
            id: containerId,
            refresh: () => this.refreshTable(containerId),
            setData: (newData) => this.setTableData(containerId, newData),
            setFilters: (filters) => this.setTableFilters(containerId, filters),
            exportCSV: () => this.exportToCSV(containerId),
            getSelected: () => this.getSelectedRows(containerId),
            clearSelection: () => this.clearSelection(containerId)
        };
    }
    
    /**
     * Renderiza o conteúdo da tabela
     * @param {Object} tableState - Estado da tabela
     * @param {HTMLElement} container - Elemento container
     */
    renderTableContent(tableState, container) {
        const { columns, filteredData, config, currentPage, sortState } = tableState;
        const pageSize = config.pageSize;
        const startIndex = (config.currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        
        // Paginar dados
        tableState.currentData = filteredData.slice(startIndex, endIndex);
        const totalPages = Math.ceil(filteredData.length / pageSize);
        
        // Construir HTML da tabela
        let html = `
            <div class="elite-table-container ${config.responsive ? 'responsive-table' : ''}">
                ${this.renderTableControls(tableState, totalPages)}
                <table class="data-table ${config.className}">
                    <thead>
                        <tr>
                            ${config.selectable ? '<th class="select-col"><input type="checkbox" id="select-all"></th>' : ''}
                            ${columns.map(col => `
                                <th data-column="${col.key}" class="${col.sortable !== false ? 'sortable' : ''} ${sortState.column === col.key ? `sorted-${sortState.direction}` : ''}">
                                    ${col.label}
                                    ${col.sortable !== false ? '<i class="fas fa-sort"></i>' : ''}
                                </th>
                            `).join('')}
                        </tr>
                    </thead>
                    <tbody>
                        ${this.renderTableRows(tableState)}
                    </tbody>
                </table>
                ${config.paginable && totalPages > 1 ? this.renderPagination(tableState, totalPages) : ''}
            </div>
        `;
        
        container.innerHTML = html;
        
        // Anexar event listeners
        this.attachTableEvents(tableState, container);
    }
    
    /**
     * Renderiza controles da tabela (busca, exportação)
     */
    renderTableControls(tableState, totalPages) {
        const { config, filteredData } = tableState;
        const controls = [];
        
        if (config.searchable) {
            controls.push(`
                <div class="table-search">
                    <input type="text" id="table-search-${tableState.id}" placeholder="Pesquisar..." class="search-input">
                    <i class="fas fa-search"></i>
                </div>
            `);
        }
        
        if (config.exportable) {
            controls.push(`
                <button id="table-export-${tableState.id}" class="elite-btn small secondary">
                    <i class="fas fa-download"></i> Exportar CSV
                </button>
            `);
        }
        
        controls.push(`
            <div class="table-info">
                Mostrando ${filteredData.length} registos
            </div>
        `);
        
        return controls.length ? `<div class="table-controls">${controls.join('')}</div>` : '';
    }
    
    /**
     * Renderiza linhas da tabela
     */
    renderTableRows(tableState) {
        const { columns, currentData, config, id } = tableState;
        
        if (currentData.length === 0) {
            return `<tr><td colspan="${columns.length + (config.selectable ? 1 : 0)}" class="empty-state">Nenhum dado encontrado</td></tr>`;
        }
        
        return currentData.map((row, rowIndex) => {
            const rowId = this.getRowId(row);
            const isSelected = tableState.selectedRows.has(rowId);
            
            return `
                <tr data-row-id="${rowId}" data-row-index="${rowIndex}" class="${isSelected ? 'selected' : ''}">
                    ${config.selectable ? `
                        <td class="select-col">
                            <input type="checkbox" class="row-select" data-row-id="${rowId}" ${isSelected ? 'checked' : ''}>
                        </td>
                    ` : ''}
                    ${columns.map(col => {
                        let value = this.getNestedValue(row, col.key);
                        
                        // Aplicar formatação
                        if (col.format) {
                            value = col.format(value, row);
                        } else if (col.type === 'currency' && typeof value === 'number') {
                            value = new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(value);
                        } else if (col.type === 'percentage' && typeof value === 'number') {
                            value = value.toFixed(1) + '%';
                        } else if (col.type === 'date' && value) {
                            value = moment(value).format('DD/MM/YYYY');
                        } else if (col.type === 'badge') {
                            const badgeClass = col.badgeMap ? col.badgeMap[value] || 'default' : 'default';
                            value = `<span class="status-badge status-${badgeClass}">${value}</span>`;
                        } else if (col.type === 'progress' && typeof value === 'number') {
                            value = `
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: ${value * 100}%"></div>
                                    <span class="progress-text">${(value * 100).toFixed(0)}%</span>
                                </div>
                            `;
                        }
                        
                        return `<td data-column="${col.key}" ${col.width ? `style="width: ${col.width}"` : ''}>${value || '-'}</td>`;
                    }).join('')}
                </tr>
            `;
        }).join('');
    }
    
    /**
     * Renderiza paginação
     */
    renderPagination(tableState, totalPages) {
        const { config, filteredData } = tableState;
        const currentPage = config.currentPage;
        
        let pages = [];
        const maxVisible = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let endPage = Math.min(totalPages, startPage + maxVisible - 1);
        
        if (endPage - startPage + 1 < maxVisible) {
            startPage = Math.max(1, endPage - maxVisible + 1);
        }
        
        for (let i = startPage; i <= endPage; i++) {
            pages.push(`<button class="page-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`);
        }
        
        return `
            <div class="table-pagination">
                <button class="page-btn first" ${currentPage === 1 ? 'disabled' : ''} data-page="1">
                    <i class="fas fa-angle-double-left"></i>
                </button>
                <button class="page-btn prev" ${currentPage === 1 ? 'disabled' : ''} data-page="${currentPage - 1}">
                    <i class="fas fa-angle-left"></i>
                </button>
                ${pages.join('')}
                <button class="page-btn next" ${currentPage === totalPages ? 'disabled' : ''} data-page="${currentPage + 1}">
                    <i class="fas fa-angle-right"></i>
                </button>
                <button class="page-btn last" ${currentPage === totalPages ? 'disabled' : ''} data-page="${totalPages}">
                    <i class="fas fa-angle-double-right"></i>
                </button>
                <span class="page-info">Página ${currentPage} de ${totalPages}</span>
            </div>
        `;
    }
    
    /**
     * Anexa eventos à tabela
     */
    attachTableEvents(tableState, container) {
        const { id, columns, config } = tableState;
        
        // Eventos de ordenação
        container.querySelectorAll('th.sortable').forEach(th => {
            th.addEventListener('click', () => {
                const column = th.dataset.column;
                const currentSort = tableState.sortState;
                let newDirection = 'asc';
                
                if (currentSort.column === column) {
                    newDirection = currentSort.direction === 'asc' ? 'desc' : 'asc';
                }
                
                this.applySort(tableState, column, newDirection);
                this.renderTableContent(tableState, container);
            });
        });
        
        // Evento de busca
        const searchInput = document.getElementById(`table-search-${id}`);
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.applySearch(tableState, e.target.value);
                this.renderTableContent(tableState, container);
            });
        }
        
        // Evento de exportação
        const exportBtn = document.getElementById(`table-export-${id}`);
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportToCSV(id));
        }
        
        // Eventos de paginação
        container.querySelectorAll('.page-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const page = parseInt(btn.dataset.page);
                if (page && !isNaN(page) && page !== config.currentPage) {
                    tableState.config.currentPage = page;
                    this.renderTableContent(tableState, container);
                }
            });
        });
        
        // Eventos de seleção
        if (config.selectable) {
            const selectAll = container.querySelector('#select-all');
            if (selectAll) {
                selectAll.addEventListener('change', (e) => {
                    const checked = e.target.checked;
                    tableState.selectedRows.clear();
                    
                    if (checked) {
                        tableState.currentData.forEach(row => {
                            tableState.selectedRows.add(this.getRowId(row));
                        });
                    }
                    
                    this.updateSelectionUI(tableState, container);
                    
                    if (config.onSelectionChange) {
                        config.onSelectionChange(Array.from(tableState.selectedRows));
                    }
                });
            }
            
            container.querySelectorAll('.row-select').forEach(cb => {
                cb.addEventListener('change', (e) => {
                    const rowId = cb.dataset.rowId;
                    if (e.target.checked) {
                        tableState.selectedRows.add(rowId);
                    } else {
                        tableState.selectedRows.delete(rowId);
                    }
                    
                    this.updateSelectAllState(tableState, container);
                    
                    if (config.onSelectionChange) {
                        config.onSelectionChange(Array.from(tableState.selectedRows));
                    }
                });
            });
        }
        
        // Eventos de clique na linha
        if (config.onRowClick) {
            container.querySelectorAll('tbody tr').forEach(row => {
                row.addEventListener('click', (e) => {
                    // Evitar trigger quando clica em checkbox
                    if (e.target.type !== 'checkbox') {
                        const rowId = row.dataset.rowId;
                        const rowData = tableState.currentData.find(r => this.getRowId(r) === rowId);
                        if (rowData) {
                            config.onRowClick(rowData, rowId);
                        }
                    }
                });
            });
        }
    }
    
    /**
     * Atualiza UI de seleção
     */
    updateSelectionUI(tableState, container) {
        container.querySelectorAll('tbody tr').forEach(row => {
            const rowId = row.dataset.rowId;
            const isSelected = tableState.selectedRows.has(rowId);
            row.classList.toggle('selected', isSelected);
            
            const checkbox = row.querySelector('.row-select');
            if (checkbox) {
                checkbox.checked = isSelected;
            }
        });
    }
    
    /**
     * Atualiza estado do checkbox "selecionar todos"
     */
    updateSelectAllState(tableState, container) {
        const selectAll = container.querySelector('#select-all');
        if (!selectAll) return;
        
        const totalVisible = tableState.currentData.length;
        const selectedVisible = tableState.currentData.filter(row => 
            tableState.selectedRows.has(this.getRowId(row))
        ).length;
        
        if (selectedVisible === 0) {
            selectAll.checked = false;
            selectAll.indeterminate = false;
        } else if (selectedVisible === totalVisible) {
            selectAll.checked = true;
            selectAll.indeterminate = false;
        } else {
            selectAll.checked = false;
            selectAll.indeterminate = true;
        }
    }
    
    /**
     * Aplica ordenação aos dados
     */
    applySort(tableState, columnKey, direction) {
        const { originalData, columns } = tableState;
        const column = columns.find(c => c.key === columnKey);
        
        if (!column) return;
        
        const sorted = [...originalData].sort((a, b) => {
            let aVal = this.getNestedValue(a, columnKey);
            let bVal = this.getNestedValue(b, columnKey);
            
            // Ordenação personalizada
            if (column.sort) {
                return column.sort(aVal, bVal, direction);
            }
            
            // Ordenação padrão
            if (aVal === null || aVal === undefined) aVal = '';
            if (bVal === null || bVal === undefined) bVal = '';
            
            if (typeof aVal === 'number' && typeof bVal === 'number') {
                return direction === 'asc' ? aVal - bVal : bVal - aVal;
            }
            
            const comparison = String(aVal).localeCompare(String(bVal), 'pt', { sensitivity: 'base' });
            return direction === 'asc' ? comparison : -comparison;
        });
        
        tableState.originalData = sorted;
        tableState.sortState = { column: columnKey, direction };
        tableState.config.currentPage = 1;
        
        this.applyFilters(tableState);
    }
    
    /**
     * Aplica busca aos dados
     */
    applySearch(tableState, searchTerm) {
        tableState.searchTerm = searchTerm;
        this.applyFilters(tableState);
    }
    
    /**
     * Aplica filtros aos dados
     */
    applyFilters(tableState) {
        let filtered = [...tableState.originalData];
        const { searchTerm, config, columns } = tableState;
        
        // Aplicar busca
        if (searchTerm && searchTerm.trim()) {
            const term = searchTerm.toLowerCase().trim();
            filtered = filtered.filter(row => {
                return columns.some(col => {
                    const value = this.getNestedValue(row, col.key);
                    if (value === null || value === undefined) return false;
                    return String(value).toLowerCase().includes(term);
                });
            });
        }
        
        // Aplicar filtros personalizados
        if (config.filters) {
            Object.entries(config.filters).forEach(([key, filterValue]) => {
                if (filterValue !== null && filterValue !== undefined && filterValue !== '') {
                    filtered = filtered.filter(row => {
                        const value = this.getNestedValue(row, key);
                        if (typeof filterValue === 'function') {
                            return filterValue(value, row);
                        }
                        return String(value).toLowerCase().includes(String(filterValue).toLowerCase());
                    });
                }
            });
        }
        
        tableState.filteredData = filtered;
        tableState.config.currentPage = 1;
    }
    
    /**
     * Obtém valor aninhado de objeto
     */
    getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => {
            if (current === null || current === undefined) return null;
            return current[key];
        }, obj);
    }
    
    /**
     * Obtém ID único para linha
     */
    getRowId(row) {
        return row.id || row._id || JSON.stringify(row);
    }
    
    /**
     * Atualiza dados da tabela
     */
    setTableData(tableId, newData) {
        const tableState = this.tables.get(tableId);
        if (!tableState) return false;
        
        tableState.originalData = [...newData];
        this.applyFilters(tableState);
        this.renderTableContent(tableState, document.getElementById(tableId));
        
        return true;
    }
    
    /**
     * Atualiza filtros da tabela
     */
    setTableFilters(tableId, filters) {
        const tableState = this.tables.get(tableId);
        if (!tableState) return false;
        
        tableState.config.filters = { ...tableState.config.filters, ...filters };
        this.applyFilters(tableState);
        this.renderTableContent(tableState, document.getElementById(tableId));
        
        return true;
    }
    
    /**
     * Atualiza tabela
     */
    refreshTable(tableId) {
        const tableState = this.tables.get(tableId);
        if (!tableState) return false;
        
        this.renderTableContent(tableState, document.getElementById(tableId));
        return true;
    }
    
    /**
     * Exporta tabela para CSV
     */
    exportToCSV(tableId, filename = null) {
        const tableState = this.tables.get(tableId);
        if (!tableState) return false;
        
        const { columns, filteredData } = tableState;
        const headers = columns.map(col => col.label);
        
        const rows = filteredData.map(row => {
            return columns.map(col => {
                let value = this.getNestedValue(row, col.key);
                if (value === null || value === undefined) value = '';
                if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                    value = `"${value.replace(/"/g, '""')}"`;
                }
                return value;
            });
        });
        
        const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
        const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.download = filename || `tabela_${tableId}_${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        return true;
    }
    
    /**
     * Obtém linhas selecionadas
     */
    getSelectedRows(tableId) {
        const tableState = this.tables.get(tableId);
        if (!tableState) return [];
        
        const selectedIds = Array.from(tableState.selectedRows);
        return tableState.filteredData.filter(row => selectedIds.includes(this.getRowId(row)));
    }
    
    /**
     * Limpa seleção
     */
    clearSelection(tableId) {
        const tableState = this.tables.get(tableId);
        if (!tableState) return false;
        
        tableState.selectedRows.clear();
        this.refreshTable(tableId);
        
        if (tableState.config.onSelectionChange) {
            tableState.config.onSelectionChange([]);
        }
        
        return true;
    }
    
    /**
     * Remove tabela
     */
    destroyTable(tableId) {
        const tableState = this.tables.get(tableId);
        if (!tableState) return false;
        
        this.tables.delete(tableId);
        const container = document.getElementById(tableId);
        if (container) {
            container.innerHTML = '';
        }
        
        return true;
    }
    
    /**
     * Obtém todas as tabelas
     */
    getAllTables() {
        return Array.from(this.tables.keys());
    }
}

// Instância global
window.EliteTables = new EliteTables();