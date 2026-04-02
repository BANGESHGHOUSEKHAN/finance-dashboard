import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES, formatCurrency, formatDate } from '../data/mockData';
import TransactionModal from './TransactionModal';

function exportToCSV(transactions) {
  const header = 'ID,Date,Type,Category,Description,Amount';
  const rows = transactions.map(t =>
    `${t.id},${t.date},${t.type},${t.category},"${t.description}",${t.amount}`
  );
  const csv = [header, ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'finova_transactions.csv';
  a.click();
  URL.revokeObjectURL(url);
}

export default function TransactionsPage() {
  const { state, dispatch, filteredTransactions, ROLES } = useApp();
  const isAdmin = state.role === ROLES.ADMIN;
  const [modalTx, setModalTx] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const f = state.filters;

  const handleDelete = (id) => {
    dispatch({ type: 'DELETE_TRANSACTION', payload: id });
    setDeleteConfirm(null);
  };

  const handleSort = (col) => {
    if (f.sortBy === col) {
      dispatch({ type: 'SET_FILTER', key: 'sortDir', value: f.sortDir === 'asc' ? 'desc' : 'asc' });
    } else {
      dispatch({ type: 'SET_FILTER', key: 'sortBy', value: col });
      dispatch({ type: 'SET_FILTER', key: 'sortDir', value: 'desc' });
    }
  };

  const SortIcon = ({ col }) => {
    if (f.sortBy !== col) return <span style={{ color: 'var(--text-muted)' }}>⇅</span>;
    return <span style={{ color: 'var(--gold-bright)' }}>{f.sortDir === 'asc' ? '↑' : '↓'}</span>;
  };

  return (
    <div className="tx-page">
      {/* Toolbar */}
      <div className="tx-toolbar">
        <div className="search-wrap">
          <span className="search-icon">⌕</span>
          <input
            className="search-input"
            placeholder="Search transactions..."
            value={f.search}
            onChange={e => dispatch({ type: 'SET_FILTER', key: 'search', value: e.target.value })}
          />
          {f.search && (
            <button className="search-clear" onClick={() => dispatch({ type: 'SET_FILTER', key: 'search', value: '' })}>✕</button>
          )}
        </div>

        <div className="filters-row">
          <select className="filter-select" value={f.type} onChange={e => dispatch({ type: 'SET_FILTER', key: 'type', value: e.target.value })}>
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <select className="filter-select" value={f.category} onChange={e => dispatch({ type: 'SET_FILTER', key: 'category', value: e.target.value })}>
            <option value="all">All Categories</option>
            {Object.entries(CATEGORIES).map(([k, v]) => (
              <option key={k} value={k}>{v.icon} {v.label}</option>
            ))}
          </select>

          <input type="date" className="filter-select" value={f.dateFrom} onChange={e => dispatch({ type: 'SET_FILTER', key: 'dateFrom', value: e.target.value })} title="From date" />
          <input type="date" className="filter-select" value={f.dateTo} onChange={e => dispatch({ type: 'SET_FILTER', key: 'dateTo', value: e.target.value })} title="To date" />

          {(f.search || f.type !== 'all' || f.category !== 'all' || f.dateFrom || f.dateTo) && (
            <button className="reset-btn" onClick={() => dispatch({ type: 'RESET_FILTERS' })}>✕ Clear</button>
          )}
        </div>

        <div className="toolbar-actions">
          <span className="tx-count">{filteredTransactions.length} transactions</span>
          <button className="action-btn export" onClick={() => exportToCSV(filteredTransactions)} title="Export CSV">
            ↓ Export
          </button>
          {isAdmin && (
            <button className="action-btn add" onClick={() => { setModalTx(null); setShowModal(true); }}>
              + Add
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="tx-table-wrap">
        {filteredTransactions.length === 0 ? (
          <div className="tx-empty">
            <span className="empty-icon">◈</span>
            <p>No transactions found</p>
            <span>Try adjusting your filters</span>
          </div>
        ) : (
          <table className="tx-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('date')} className="sortable">Date <SortIcon col="date" /></th>
                <th onClick={() => handleSort('description')} className="sortable">Description <SortIcon col="description" /></th>
                <th>Category</th>
                <th>Type</th>
                <th onClick={() => handleSort('amount')} className="sortable text-right">Amount <SortIcon col="amount" /></th>
                {isAdmin && <th className="text-center">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((tx, i) => {
                const cat = CATEGORIES[tx.category];
                return (
                  <tr key={tx.id} style={{ animationDelay: `${i * 0.02}s` }} className="tx-row">
                    <td className="mono date-cell">{formatDate(tx.date)}</td>
                    <td className="desc-cell">{tx.description}</td>
                    <td>
                      <span className="cat-badge" style={{ '--cat-color': cat?.color }}>
                        {cat?.icon} {cat?.label || tx.category}
                      </span>
                    </td>
                    <td>
                      <span className={`type-badge ${tx.type}`}>
                        {tx.type === 'income' ? '↑' : '↓'} {tx.type}
                      </span>
                    </td>
                    <td className={`mono amount-cell ${tx.type}`}>
                      {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                    </td>
                    {isAdmin && (
                      <td className="action-cell">
                        <button className="row-action edit" onClick={() => { setModalTx(tx); setShowModal(true); }} title="Edit">✎</button>
                        <button className="row-action delete" onClick={() => setDeleteConfirm(tx.id)} title="Delete">✕</button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Delete confirm */}
      {deleteConfirm && (
        <div className="modal-overlay confirm-overlay" onClick={e => e.target === e.currentTarget && setDeleteConfirm(null)}>
          <div className="confirm-dialog">
            <h3>Delete Transaction?</h3>
            <p>This action cannot be undone.</p>
            <div className="confirm-actions">
              <button className="btn-secondary" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="btn-danger" onClick={() => handleDelete(deleteConfirm)}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <TransactionModal
          tx={modalTx}
          onClose={() => { setShowModal(false); setModalTx(null); }}
        />
      )}

      <style>{`
        .tx-page { display: flex; flex-direction: column; gap: 16px; }

        .tx-toolbar {
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg);
          padding: 16px 18px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          animation: fadeUp 0.4s ease forwards;
        }

        .search-wrap {
          position: relative;
          max-width: 360px;
        }

        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
          font-size: 18px;
          pointer-events: none;
        }

        .search-input {
          width: 100%;
          background: var(--bg-elevated);
          border: 1px solid var(--border-soft);
          border-radius: var(--radius-md);
          color: var(--text-primary);
          font-family: var(--font-body);
          font-size: 14px;
          padding: 9px 36px 9px 36px;
          outline: none;
          transition: border-color var(--transition);
        }

        .search-input:focus { border-color: var(--gold-mid); }

        .search-clear {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          font-size: 12px;
          padding: 4px;
        }

        .filters-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          align-items: center;
        }

        .filter-select {
          background: var(--bg-elevated);
          border: 1px solid var(--border-soft);
          border-radius: var(--radius-md);
          color: var(--text-primary);
          font-family: var(--font-body);
          font-size: 13px;
          padding: 7px 10px;
          outline: none;
          cursor: pointer;
          transition: border-color var(--transition);
          color-scheme: dark;
        }

        .filter-select:focus, .filter-select:hover { border-color: var(--gold-mid); }

        .reset-btn {
          background: var(--expense-dim);
          border: 1px solid rgba(248, 113, 113, 0.2);
          border-radius: var(--radius-md);
          color: var(--expense-color);
          font-size: 12px;
          font-weight: 600;
          padding: 7px 12px;
          cursor: pointer;
          transition: all var(--transition);
        }

        .reset-btn:hover { filter: brightness(1.1); }

        .toolbar-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .tx-count {
          font-size: 12px;
          color: var(--text-muted);
          margin-right: auto;
        }

        .action-btn {
          padding: 8px 16px;
          border-radius: var(--radius-md);
          border: none;
          font-family: var(--font-display);
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all var(--transition);
        }

        .action-btn.export {
          background: var(--bg-elevated);
          border: 1px solid var(--border-soft);
          color: var(--text-secondary);
        }
        .action-btn.export:hover { color: var(--text-primary); border-color: var(--gold-mid); }

        .action-btn.add {
          background: linear-gradient(135deg, var(--gold-mid), var(--gold-bright));
          color: var(--bg-void);
        }
        .action-btn.add:hover { filter: brightness(1.05); transform: translateY(-1px); }

        .tx-table-wrap {
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg);
          overflow: hidden;
          animation: fadeUp 0.4s ease forwards;
          animation-delay: 0.1s;
          animation-fill-mode: both;
        }

        .tx-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 24px;
          gap: 8px;
        }

        .empty-icon { font-size: 32px; color: var(--text-muted); }
        .tx-empty p { font-weight: 600; color: var(--text-secondary); }
        .tx-empty span { font-size: 13px; color: var(--text-muted); }

        .tx-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
        }

        .tx-table thead tr {
          border-bottom: 1px solid var(--border-subtle);
        }

        .tx-table th {
          padding: 12px 14px;
          text-align: left;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: var(--text-muted);
          white-space: nowrap;
        }

        .tx-table th.sortable {
          cursor: pointer;
          user-select: none;
          transition: color var(--transition);
        }

        .tx-table th.sortable:hover { color: var(--text-primary); }
        .tx-table th.text-right { text-align: right; }
        .tx-table th.text-center { text-align: center; }

        .tx-row {
          border-bottom: 1px solid var(--border-subtle);
          transition: background var(--transition);
          animation: fadeIn 0.3s ease forwards;
          animation-fill-mode: both;
        }

        .tx-row:last-child { border-bottom: none; }
        .tx-row:hover { background: var(--bg-elevated); }

        .tx-table td {
          padding: 11px 14px;
          vertical-align: middle;
        }

        .date-cell { color: var(--text-secondary); font-size: 12px; white-space: nowrap; }
        .desc-cell { color: var(--text-primary); font-weight: 500; max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

        .cat-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 3px 8px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
          background: color-mix(in srgb, var(--cat-color) 12%, transparent);
          color: var(--cat-color);
          border: 1px solid color-mix(in srgb, var(--cat-color) 25%, transparent);
          white-space: nowrap;
        }

        .type-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 3px 8px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          text-transform: capitalize;
        }

        .type-badge.income { background: var(--income-dim); color: var(--income-color); }
        .type-badge.expense { background: var(--expense-dim); color: var(--expense-color); }

        .amount-cell { text-align: right; font-size: 13px; font-weight: 500; }
        .amount-cell.income { color: var(--income-color); }
        .amount-cell.expense { color: var(--expense-color); }

        .action-cell { text-align: center; white-space: nowrap; }

        .row-action {
          width: 28px;
          height: 28px;
          border-radius: 6px;
          border: 1px solid var(--border-subtle);
          background: transparent;
          cursor: pointer;
          font-size: 13px;
          transition: all var(--transition);
          margin: 0 2px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
        }

        .row-action.edit:hover { background: var(--gold-glow); color: var(--gold-bright); border-color: var(--border-gold); }
        .row-action.delete:hover { background: var(--expense-dim); color: var(--expense-color); border-color: rgba(248,113,113,0.3); }

        /* Delete confirm */
        .confirm-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(4px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
        }

        .confirm-dialog {
          background: var(--bg-base);
          border: 1px solid var(--border-soft);
          border-radius: var(--radius-xl);
          padding: 28px;
          max-width: 340px;
          width: 100%;
          text-align: center;
          animation: fadeUp 0.2s ease;
        }

        .confirm-dialog h3 { font-size: 18px; margin-bottom: 8px; }
        .confirm-dialog p { color: var(--text-secondary); font-size: 14px; margin-bottom: 20px; }

        .confirm-actions { display: flex; gap: 10px; justify-content: center; }

        .btn-danger {
          padding: 9px 20px;
          border-radius: var(--radius-md);
          border: none;
          background: var(--expense-color);
          color: #fff;
          font-family: var(--font-display);
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: filter var(--transition);
        }

        .btn-danger:hover { filter: brightness(1.1); }

        .btn-secondary {
          padding: 9px 20px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-soft);
          background: transparent;
          color: var(--text-secondary);
          font-family: var(--font-body);
          font-size: 14px;
          cursor: pointer;
          transition: all var(--transition);
        }

        .btn-secondary:hover { background: var(--bg-hover); color: var(--text-primary); }

        @media (max-width: 768px) {
          .tx-table .desc-cell { max-width: 120px; }
          .filters-row { gap: 6px; }
          .filter-select { font-size: 12px; padding: 6px 8px; }
        }

        @media (max-width: 600px) {
          .tx-table th:nth-child(4),
          .tx-table td:nth-child(4) { display: none; }
        }
      `}</style>
    </div>
  );
}
