import React from 'react';
import { useApp } from '../context/AppContext';

export default function Header({ onMenuClick }) {
  const { state, dispatch } = useApp();

  const TAB_LABELS = {
    dashboard: 'Dashboard Overview',
    transactions: 'Transactions',
    insights: 'Spending Insights',
  };

  return (
    <header className="header">
      <div className="header-left">
        <button className="menu-btn" onClick={onMenuClick} aria-label="Menu">
          <span /><span /><span />
        </button>
        <div className="page-title">
          <h1>{TAB_LABELS[state.activeTab] || 'Dashboard'}</h1>
          <span className="page-subtitle">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>
      </div>

      <div className="header-right">
        <button
          className="theme-toggle"
          onClick={() => dispatch({ type: 'SET_THEME', payload: state.theme === 'dark' ? 'light' : 'dark' })}
          title="Toggle theme"
        >
          {state.theme === 'dark' ? '☀' : '◑'}
        </button>
        <div className="header-avatar">
          <span>{state.role === 'admin' ? 'A' : 'V'}</span>
        </div>
      </div>

      <style>{`
        .header {
          height: var(--header-height);
          background: var(--bg-deep);
          border-bottom: 1px solid var(--border-subtle);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          position: sticky;
          top: 0;
          z-index: 10;
          flex-shrink: 0;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .menu-btn {
          display: none;
          flex-direction: column;
          gap: 5px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
        }

        .menu-btn span {
          display: block;
          width: 22px;
          height: 2px;
          background: var(--text-secondary);
          border-radius: 2px;
          transition: background var(--transition);
        }

        .menu-btn:hover span { background: var(--text-primary); }

        .page-title h1 {
          font-size: 18px;
          font-weight: 700;
          letter-spacing: -0.3px;
        }

        .page-subtitle {
          display: block;
          font-size: 12px;
          color: var(--text-muted);
          font-weight: 400;
          margin-top: 1px;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .theme-toggle {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-soft);
          background: var(--bg-surface);
          color: var(--text-secondary);
          cursor: pointer;
          font-size: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--transition);
        }

        .theme-toggle:hover {
          border-color: var(--gold-mid);
          color: var(--gold-bright);
        }

        .header-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--gold-mid), var(--gold-bright));
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 14px;
          color: var(--bg-void);
          font-family: var(--font-display);
          cursor: pointer;
          transition: transform var(--transition);
        }

        .header-avatar:hover { transform: scale(1.05); }

        @media (max-width: 768px) {
          .menu-btn { display: flex; }
          .page-subtitle { display: none; }
          .header { padding: 0 16px; }
        }
      `}</style>
    </header>
  );
}
