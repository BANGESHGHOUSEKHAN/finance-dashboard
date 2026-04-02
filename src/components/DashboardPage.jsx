import React from 'react';
import { useApp } from '../context/AppContext';
import SummaryCards from './SummaryCards';
import { BalanceTrendChart, BalanceAreaChart, SpendingPieChart } from './Charts';
import { formatCurrency, formatDate, CATEGORIES } from '../data/mockData';

export default function DashboardPage() {
  const { state, dispatch } = useApp();
  const txs = state.transactions;

  // Recent 6 transactions
  const recent = [...txs].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6);

  return (
    <div className="dashboard-page">
      <SummaryCards transactions={txs} />

      <div className="charts-grid">
        <div className="chart-col-main">
          <BalanceTrendChart transactions={txs} />
          <BalanceAreaChart transactions={txs} />
        </div>
        <div className="chart-col-side">
          <SpendingPieChart transactions={txs} />
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="recent-panel">
        <div className="panel-hdr">
          <h3>Recent Transactions</h3>
          <button className="view-all-btn" onClick={() => dispatch({ type: 'SET_TAB', payload: 'transactions' })}>
            View all →
          </button>
        </div>
        <div className="recent-list">
          {recent.length === 0 ? (
            <div className="no-data">No transactions yet</div>
          ) : (
            recent.map((tx, i) => {
              const cat = CATEGORIES[tx.category];
              return (
                <div key={tx.id} className="recent-item" style={{ animationDelay: `${i * 0.05}s` }}>
                  <div className="recent-cat-icon" style={{ '--cat-color': cat?.color }}>{cat?.icon}</div>
                  <div className="recent-info">
                    <span className="recent-desc">{tx.description}</span>
                    <span className="recent-meta">{formatDate(tx.date)} · {cat?.label}</span>
                  </div>
                  <span className={`recent-amount mono ${tx.type}`}>
                    {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>

      <style>{`
        .dashboard-page { display: flex; flex-direction: column; gap: 16px; }

        .charts-grid {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 16px;
          align-items: start;
        }

        .chart-col-main { display: flex; flex-direction: column; gap: 16px; }
        .chart-col-side { }

        .recent-panel {
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg);
          padding: 20px 22px;
          animation: fadeUp 0.5s ease forwards;
          animation-delay: 0.2s;
          animation-fill-mode: both;
        }

        .panel-hdr {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .panel-hdr h3 { font-size: 15px; font-weight: 700; }

        .view-all-btn {
          background: none;
          border: none;
          color: var(--gold-bright);
          font-family: var(--font-body);
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: opacity var(--transition);
        }

        .view-all-btn:hover { opacity: 0.8; }

        .recent-list { display: flex; flex-direction: column; gap: 4px; }

        .no-data {
          text-align: center;
          padding: 24px;
          color: var(--text-muted);
          font-size: 14px;
        }

        .recent-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 10px;
          border-radius: var(--radius-md);
          transition: background var(--transition);
          animation: fadeUp 0.4s ease forwards;
          animation-fill-mode: both;
        }

        .recent-item:hover { background: var(--bg-elevated); }

        .recent-cat-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          background: color-mix(in srgb, var(--cat-color, #888) 12%, transparent);
          flex-shrink: 0;
        }

        .recent-info { flex: 1; min-width: 0; }
        .recent-desc { display: block; font-size: 13px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .recent-meta { font-size: 11px; color: var(--text-muted); }

        .recent-amount { font-size: 13px; font-weight: 600; flex-shrink: 0; }
        .recent-amount.income { color: var(--income-color); }
        .recent-amount.expense { color: var(--expense-color); }

        @media (max-width: 1100px) {
          .charts-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
