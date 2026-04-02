import React from 'react';
import { formatCurrency } from '../data/mockData';

function SummaryCard({ title, amount, icon, type, trend }) {
  const isIncome = type === 'income';
  const isBalance = type === 'balance';
  const isExpense = type === 'expense';

  return (
    <div className={`summary-card ${type}`}>
      <div className="card-header">
        <span className="card-icon">{icon}</span>
        <span className="card-title">{title}</span>
      </div>
      <div className="card-amount">
        <span className="amount-value mono">{formatCurrency(amount)}</span>
      </div>
      {trend !== undefined && (
        <div className={`card-trend ${trend >= 0 ? 'up' : 'down'}`}>
          <span className="trend-arrow">{trend >= 0 ? '↑' : '↓'}</span>
          <span className="trend-text">{Math.abs(trend).toFixed(1)}% vs last month</span>
        </div>
      )}
      <div className="card-bg-decoration" />
      <style>{`
        .summary-card {
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg);
          padding: 20px 22px;
          position: relative;
          overflow: hidden;
          transition: transform var(--transition), box-shadow var(--transition);
          animation: fadeUp 0.5s ease forwards;
          animation-fill-mode: both;
        }

        .summary-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-card);
        }

        .summary-card.balance {
          border-color: var(--border-gold);
          background: linear-gradient(135deg, var(--bg-surface), rgba(240, 180, 41, 0.04));
        }

        .summary-card.income { border-color: rgba(52, 211, 153, 0.15); }
        .summary-card.expense { border-color: rgba(248, 113, 113, 0.15); }

        .card-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
        }

        .card-icon {
          font-size: 18px;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--radius-sm);
        }

        .summary-card.balance .card-icon { background: var(--gold-glow); }
        .summary-card.income .card-icon { background: var(--income-dim); }
        .summary-card.expense .card-icon { background: var(--expense-dim); }

        .card-title {
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: var(--text-muted);
        }

        .card-amount {
          margin-bottom: 10px;
        }

        .amount-value {
          font-size: clamp(20px, 3vw, 26px);
          font-weight: 500;
          letter-spacing: -0.5px;
        }

        .summary-card.balance .amount-value { color: var(--gold-bright); }
        .summary-card.income .amount-value { color: var(--income-color); }
        .summary-card.expense .amount-value { color: var(--expense-color); }

        .card-trend {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          font-weight: 500;
        }

        .card-trend.up { color: var(--income-color); }
        .card-trend.down { color: var(--expense-color); }

        .trend-arrow { font-size: 14px; }

        .card-bg-decoration {
          position: absolute;
          right: -20px;
          bottom: -20px;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          opacity: 0.04;
          pointer-events: none;
        }

        .summary-card.balance .card-bg-decoration { background: var(--gold-bright); opacity: 0.08; }
        .summary-card.income .card-bg-decoration { background: var(--income-color); }
        .summary-card.expense .card-bg-decoration { background: var(--expense-color); }
      `}</style>
    </div>
  );
}

export default function SummaryCards({ transactions }) {
  // Compute current and previous month
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const prevDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const prevMonth = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}`;

  const curr = transactions.filter(t => t.date.startsWith(currentMonth));
  const prev = transactions.filter(t => t.date.startsWith(prevMonth));

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const balance = totalIncome - totalExpenses;

  const prevExpenses = prev.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const currExpenses = curr.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const expenseTrend = prevExpenses ? ((currExpenses - prevExpenses) / prevExpenses) * 100 : 0;

  const prevIncome = prev.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const currIncome = curr.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const incomeTrend = prevIncome ? ((currIncome - prevIncome) / prevIncome) * 100 : 0;

  return (
    <div className="summary-grid">
      <SummaryCard title="Net Balance" amount={balance} icon="◈" type="balance" />
      <SummaryCard title="Total Income" amount={totalIncome} icon="↑" type="income" trend={incomeTrend} />
      <SummaryCard title="Total Expenses" amount={totalExpenses} icon="↓" type="expense" trend={expenseTrend} />

      <style>{`
        .summary-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        @media (max-width: 900px) {
          .summary-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 600px) {
          .summary-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
