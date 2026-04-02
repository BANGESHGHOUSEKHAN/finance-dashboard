import React from 'react';
import { useApp, ROLES } from '../context/AppContext';

const NAV_ITEMS = [
  { id: 'dashboard', icon: '◈', label: 'Dashboard' },
  { id: 'transactions', icon: '≡', label: 'Transactions' },
  { id: 'insights', icon: '◎', label: 'Insights' },
];

export default function Sidebar({ onClose }) {
  const { state, dispatch } = useApp();

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="logo-mark">F</span>
        <span className="logo-text">Finova</span>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            className={`nav-item ${state.activeTab === item.id ? 'active' : ''}`}
            onClick={() => {
              dispatch({ type: 'SET_TAB', payload: item.id });
              onClose?.();
            }}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
            {state.activeTab === item.id && <span className="nav-active-pip" />}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="role-section">
          <span className="role-label">Role</span>
          <select
            className="role-select"
            value={state.role}
            onChange={e => dispatch({ type: 'SET_ROLE', payload: e.target.value })}
          >
            <option value={ROLES.VIEWER}>👁 Viewer</option>
            <option value={ROLES.ADMIN}>⚡ Admin</option>
          </select>
        </div>
        <div className={`role-badge ${state.role}`}>
          {state.role === ROLES.ADMIN ? '⚡ Admin Access' : '👁 View Only'}
        </div>
      </div>

      <style>{`
        .sidebar {
          width: var(--sidebar-width);
          height: 100%;
          background: var(--bg-deep);
          border-right: 1px solid var(--border-subtle);
          display: flex;
          flex-direction: column;
          padding: 0;
          flex-shrink: 0;
        }

        .sidebar-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 20px 20px 24px;
          border-bottom: 1px solid var(--border-subtle);
        }

        .logo-mark {
          width: 34px;
          height: 34px;
          background: linear-gradient(135deg, var(--gold-mid), var(--gold-bright));
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-display);
          font-size: 18px;
          font-weight: 800;
          color: var(--bg-void);
          flex-shrink: 0;
        }

        .logo-text {
          font-family: var(--font-display);
          font-size: 20px;
          font-weight: 700;
          letter-spacing: -0.5px;
          background: linear-gradient(90deg, var(--gold-bright), var(--text-primary));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .sidebar-nav {
          flex: 1;
          padding: 16px 12px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border-radius: var(--radius-md);
          border: none;
          background: transparent;
          color: var(--text-secondary);
          cursor: pointer;
          font-family: var(--font-body);
          font-size: 14px;
          font-weight: 500;
          transition: all var(--transition);
          position: relative;
          text-align: left;
          width: 100%;
        }

        .nav-item:hover {
          background: var(--bg-hover);
          color: var(--text-primary);
        }

        .nav-item.active {
          background: var(--gold-glow);
          color: var(--gold-bright);
          border: 1px solid var(--border-gold);
        }

        .nav-icon {
          font-size: 16px;
          width: 20px;
          text-align: center;
          flex-shrink: 0;
        }

        .nav-label { flex: 1; }

        .nav-active-pip {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--gold-bright);
          flex-shrink: 0;
          animation: pulse-gold 2s ease-in-out infinite;
        }

        .sidebar-footer {
          padding: 16px;
          border-top: 1px solid var(--border-subtle);
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .role-section {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .role-label {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: var(--text-muted);
        }

        .role-select {
          background: var(--bg-surface);
          border: 1px solid var(--border-soft);
          border-radius: var(--radius-sm);
          color: var(--text-primary);
          font-family: var(--font-body);
          font-size: 13px;
          padding: 8px 10px;
          cursor: pointer;
          outline: none;
          appearance: none;
          transition: border-color var(--transition);
        }

        .role-select:hover, .role-select:focus {
          border-color: var(--gold-mid);
        }

        .role-badge {
          font-size: 11px;
          font-weight: 600;
          padding: 5px 10px;
          border-radius: 20px;
          text-align: center;
          letter-spacing: 0.3px;
        }

        .role-badge.admin {
          background: rgba(240, 180, 41, 0.1);
          color: var(--gold-bright);
          border: 1px solid var(--border-gold);
        }

        .role-badge.viewer {
          background: var(--neutral-dim);
          color: var(--neutral-color);
          border: 1px solid rgba(96, 165, 250, 0.2);
        }
      `}</style>
    </aside>
  );
}
