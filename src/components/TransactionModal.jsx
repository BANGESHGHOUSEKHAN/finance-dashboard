import React, { useState, useEffect } from 'react';
import { CATEGORIES } from '../data/mockData';
import { useApp } from '../context/AppContext';

const generateId = () => Math.random().toString(36).slice(2, 10);

const emptyForm = {
  date: new Date().toISOString().slice(0, 10),
  type: 'expense',
  category: 'food',
  description: '',
  amount: '',
};

export default function TransactionModal({ tx, onClose }) {
  const { dispatch } = useApp();
  const [form, setForm] = useState(tx ? { ...tx, amount: String(tx.amount) } : emptyForm);
  const [errors, setErrors] = useState({});

  const isEdit = !!tx;

  useEffect(() => {
    const handleKey = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const validate = () => {
    const errs = {};
    if (!form.description.trim()) errs.description = 'Description is required';
    if (!form.amount || isNaN(parseFloat(form.amount)) || parseFloat(form.amount) <= 0)
      errs.amount = 'Enter a valid positive amount';
    if (!form.date) errs.date = 'Date is required';
    return errs;
  };

  const handleSubmit = () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const payload = { ...form, amount: parseFloat(parseFloat(form.amount).toFixed(2)) };

    if (isEdit) {
      dispatch({ type: 'UPDATE_TRANSACTION', payload });
    } else {
      dispatch({ type: 'ADD_TRANSACTION', payload: { ...payload, id: generateId() } });
    }
    onClose();
  };

  const set = (key, val) => {
    setForm(f => ({ ...f, [key]: val }));
    setErrors(e => ({ ...e, [key]: undefined }));
  };

  const expenseCategories = Object.entries(CATEGORIES).filter(([k]) => !['salary', 'freelance', 'investment'].includes(k));
  const incomeCategories = Object.entries(CATEGORIES).filter(([k]) => ['salary', 'freelance', 'investment'].includes(k));
  const currentCats = form.type === 'income' ? incomeCategories : expenseCategories;

  // Reset category if switching type and category doesn't match
  useEffect(() => {
    const valid = currentCats.map(([k]) => k);
    if (!valid.includes(form.category)) set('category', valid[0]);
  }, [form.type]);

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2>{isEdit ? 'Edit Transaction' : 'New Transaction'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {/* Type toggle */}
          <div className="form-group">
            <label>Type</label>
            <div className="type-toggle">
              <button className={`type-btn income ${form.type === 'income' ? 'active' : ''}`} onClick={() => set('type', 'income')}>
                ↑ Income
              </button>
              <button className={`type-btn expense ${form.type === 'expense' ? 'active' : ''}`} onClick={() => set('type', 'expense')}>
                ↓ Expense
              </button>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Amount (USD)</label>
              <div className="input-prefix-wrap">
                <span className="input-prefix">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className={`form-input ${errors.amount ? 'error' : ''}`}
                  value={form.amount}
                  onChange={e => set('amount', e.target.value)}
                  placeholder="0.00"
                />
              </div>
              {errors.amount && <span className="field-error">{errors.amount}</span>}
            </div>

            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                className={`form-input ${errors.date ? 'error' : ''}`}
                value={form.date}
                onChange={e => set('date', e.target.value)}
              />
              {errors.date && <span className="field-error">{errors.date}</span>}
            </div>
          </div>

          <div className="form-group">
            <label>Category</label>
            <select className="form-input" value={form.category} onChange={e => set('category', e.target.value)}>
              {currentCats.map(([key, cat]) => (
                <option key={key} value={key}>{cat.icon} {cat.label}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Description</label>
            <input
              type="text"
              className={`form-input ${errors.description ? 'error' : ''}`}
              value={form.description}
              onChange={e => set('description', e.target.value)}
              placeholder="e.g. Monthly salary, Coffee shop..."
            />
            {errors.description && <span className="field-error">{errors.description}</span>}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className={`btn-primary ${form.type}`} onClick={handleSubmit}>
            {isEdit ? 'Save Changes' : 'Add Transaction'}
          </button>
        </div>
      </div>

      <style>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          animation: fadeIn 0.2s ease;
        }

        .modal {
          background: var(--bg-base);
          border: 1px solid var(--border-soft);
          border-radius: var(--radius-xl);
          width: 100%;
          max-width: 480px;
          box-shadow: var(--shadow-elevated);
          animation: fadeUp 0.25s ease;
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 24px 0;
        }

        .modal-header h2 {
          font-size: 18px;
          font-weight: 700;
          letter-spacing: -0.3px;
        }

        .modal-close {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 1px solid var(--border-soft);
          background: transparent;
          color: var(--text-muted);
          cursor: pointer;
          font-size: 13px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--transition);
        }

        .modal-close:hover {
          background: var(--expense-dim);
          color: var(--expense-color);
          border-color: transparent;
        }

        .modal-body {
          padding: 20px 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-group label {
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.5px;
          color: var(--text-muted);
          text-transform: uppercase;
        }

        .form-input {
          background: var(--bg-surface);
          border: 1px solid var(--border-soft);
          border-radius: var(--radius-md);
          color: var(--text-primary);
          font-family: var(--font-body);
          font-size: 14px;
          padding: 10px 12px;
          outline: none;
          transition: border-color var(--transition);
          width: 100%;
        }

        .form-input:focus { border-color: var(--gold-mid); }
        .form-input.error { border-color: var(--expense-color); }
        .form-input[type="date"] { color-scheme: dark; }

        .input-prefix-wrap {
          position: relative;
        }

        .input-prefix {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
          font-size: 14px;
          pointer-events: none;
          font-family: var(--font-mono);
        }

        .input-prefix-wrap .form-input {
          padding-left: 26px;
          font-family: var(--font-mono);
        }

        .field-error {
          font-size: 11px;
          color: var(--expense-color);
        }

        .type-toggle {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .type-btn {
          padding: 10px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-soft);
          background: var(--bg-surface);
          color: var(--text-secondary);
          font-family: var(--font-body);
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all var(--transition);
        }

        .type-btn.income.active {
          background: var(--income-dim);
          color: var(--income-color);
          border-color: rgba(52, 211, 153, 0.3);
        }

        .type-btn.expense.active {
          background: var(--expense-dim);
          color: var(--expense-color);
          border-color: rgba(248, 113, 113, 0.3);
        }

        .modal-footer {
          padding: 16px 24px 20px;
          display: flex;
          gap: 10px;
          justify-content: flex-end;
          border-top: 1px solid var(--border-subtle);
        }

        .btn-secondary {
          padding: 10px 18px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-soft);
          background: transparent;
          color: var(--text-secondary);
          font-family: var(--font-body);
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all var(--transition);
        }

        .btn-secondary:hover {
          background: var(--bg-hover);
          color: var(--text-primary);
        }

        .btn-primary {
          padding: 10px 20px;
          border-radius: var(--radius-md);
          border: none;
          font-family: var(--font-display);
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all var(--transition);
          letter-spacing: 0.3px;
        }

        .btn-primary.income {
          background: var(--income-color);
          color: #0a2a1e;
        }
        .btn-primary.income:hover { filter: brightness(1.1); }

        .btn-primary.expense {
          background: linear-gradient(135deg, var(--gold-mid), var(--gold-bright));
          color: var(--bg-void);
        }
        .btn-primary.expense:hover { filter: brightness(1.05); transform: translateY(-1px); }

        @media (max-width: 480px) {
          .form-row { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
