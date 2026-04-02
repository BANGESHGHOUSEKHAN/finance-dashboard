import React from 'react';
import { useApp } from '../context/AppContext';
import { getInsights, getMonthlyData, formatCurrency, CATEGORIES } from '../data/mockData';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell
} from 'recharts';

function InsightCard({ title, value, subtitle, icon, color, delay = 0 }) {
  return (
    <div className="insight-card" style={{ '--accent': color, animationDelay: `${delay}s` }}>
      <div className="insight-icon">{icon}</div>
      <div className="insight-body">
        <span className="insight-title">{title}</span>
        <div className="insight-value">{value}</div>
        {subtitle && <span className="insight-subtitle">{subtitle}</span>}
      </div>
      <style>{`
        .insight-card {
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg);
          padding: 18px 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          animation: fadeUp 0.5s ease forwards;
          animation-fill-mode: both;
          transition: transform var(--transition);
          border-left: 3px solid var(--accent, var(--gold-bright));
        }
        .insight-card:hover { transform: translateX(4px); }
        .insight-icon {
          font-size: 24px;
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--radius-md);
          background: color-mix(in srgb, var(--accent, var(--gold-bright)) 12%, transparent);
          flex-shrink: 0;
        }
        .insight-body { flex: 1; min-width: 0; }
        .insight-title { font-size: 11px; letter-spacing: 1px; text-transform: uppercase; color: var(--text-muted); font-weight: 600; display: block; margin-bottom: 4px; }
        .insight-value { font-family: var(--font-display); font-size: 17px; font-weight: 700; color: var(--text-primary); letter-spacing: -0.3px; }
        .insight-subtitle { font-size: 12px; color: var(--text-secondary); display: block; margin-top: 2px; }
      `}</style>
    </div>
  );
}

export default function InsightsPage() {
  const { state } = useApp();
  const txs = state.transactions;
  const insights = getInsights(txs);
  const monthlyData = getMonthlyData(txs);

  // Category radar data
  const radarData = insights.catBreakdown.slice(0, 6).map(d => ({
    category: CATEGORIES[d.category]?.label || d.category,
    amount: d.amount,
  }));

  // Savings rate
  const totalIncome = txs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpenses = txs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const savingsRate = totalIncome > 0 ? (((totalIncome - totalExpenses) / totalIncome) * 100) : 0;

  // Top 5 transactions
  const top5Expenses = [...txs].filter(t => t.type === 'expense').sort((a, b) => b.amount - a.amount).slice(0, 5);

  const TooltipStyle = {
    background: 'var(--bg-elevated)',
    border: '1px solid var(--border-soft)',
    borderRadius: '8px',
    padding: '10px 14px',
    fontFamily: 'var(--font-body)',
    fontSize: '13px',
    color: 'var(--text-primary)',
  };

  return (
    <div className="insights-page">
      {/* KPI Cards */}
      <div className="insights-kpis">
        <InsightCard
          title="Top Spending Category"
          value={`${insights.topCategory?.icon} ${insights.topCategory?.label || 'N/A'}`}
          subtitle={`${insights.topCategoryPct}% of total expenses · ${formatCurrency(insights.topCategory?.amount || 0)}`}
          icon="🏆"
          color="#f0b429"
          delay={0}
        />
        <InsightCard
          title="Savings Rate"
          value={`${savingsRate.toFixed(1)}%`}
          subtitle={savingsRate > 20 ? 'Great savings discipline!' : savingsRate > 10 ? 'Room to improve' : 'Consider cutting expenses'}
          icon={savingsRate > 20 ? '🌟' : savingsRate > 10 ? '📊' : '⚠️'}
          color={savingsRate > 20 ? '#34d399' : savingsRate > 10 ? '#f0b429' : '#f87171'}
          delay={0.05}
        />
        {insights.mom && (
          <InsightCard
            title="Month-over-Month"
            value={`${insights.mom.diff >= 0 ? '+' : ''}${formatCurrency(insights.mom.diff)}`}
            subtitle={`Spending ${insights.mom.diff >= 0 ? 'up' : 'down'} ${Math.abs(insights.mom.pct)}% vs ${insights.mom.prevLabel}`}
            icon={insights.mom.diff >= 0 ? '📈' : '📉'}
            color={insights.mom.diff >= 0 ? '#f87171' : '#34d399'}
            delay={0.1}
          />
        )}
        <InsightCard
          title="Avg Monthly Expenses"
          value={formatCurrency(insights.avgMonthlyExpense)}
          subtitle="Based on all tracked months"
          icon="📅"
          color="#60a5fa"
          delay={0.15}
        />
        {insights.bestMonth && (
          <InsightCard
            title="Best Month"
            value={insights.bestMonth.label}
            subtitle={`Net savings of ${formatCurrency(insights.bestMonth.net)}`}
            icon="⭐"
            color="#a78bfa"
            delay={0.2}
          />
        )}
      </div>

      <div className="insights-charts">
        {/* Monthly Net Savings */}
        <div className="chart-panel">
          <div className="panel-header">
            <h3>Monthly Net Savings</h3>
            <span className="panel-subtitle">Income minus expenses per month</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyData} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11, fontFamily: 'var(--font-mono)' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;
                  const v = payload[0].value;
                  return (
                    <div style={TooltipStyle}>
                      <div style={{ color: 'var(--text-muted)', fontSize: 11, marginBottom: 6 }}>{label}</div>
                      <div style={{ fontFamily: 'var(--font-mono)', color: v >= 0 ? 'var(--income-color)' : 'var(--expense-color)', fontWeight: 600 }}>
                        {v >= 0 ? '+' : ''}{formatCurrency(v)}
                      </div>
                    </div>
                  );
                }}
              />
              <Bar dataKey="net" name="Net" radius={[4, 4, 0, 0]} maxBarSize={44}>
                {monthlyData.map((entry, i) => (
                  <Cell key={i} fill={entry.net >= 0 ? '#34d399' : '#f87171'} opacity={0.85} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Breakdown */}
        <div className="chart-panel">
          <div className="panel-header">
            <h3>Category Analysis</h3>
            <span className="panel-subtitle">Spending by category</span>
          </div>
          <div className="cat-bars">
            {insights.catBreakdown.map((d, i) => {
              const maxAmt = insights.catBreakdown[0]?.amount || 1;
              const pct = (d.amount / maxAmt) * 100;
              return (
                <div key={d.category} className="cat-bar-item" style={{ animationDelay: `${i * 0.06}s` }}>
                  <div className="cat-bar-label">
                    <span>{d.icon} {d.label}</span>
                    <span className="mono" style={{ color: d.color }}>{formatCurrency(d.amount)}</span>
                  </div>
                  <div className="cat-bar-track">
                    <div className="cat-bar-fill" style={{ width: `${pct}%`, background: d.color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Largest Expenses */}
      <div className="chart-panel top-expenses">
        <div className="panel-header">
          <h3>Largest Transactions</h3>
          <span className="panel-subtitle">Top 5 expenses all time</span>
        </div>
        <div className="top-list">
          {top5Expenses.map((tx, i) => {
            const cat = CATEGORIES[tx.category];
            return (
              <div key={tx.id} className="top-item" style={{ animationDelay: `${i * 0.06}s` }}>
                <span className="top-rank">#{i + 1}</span>
                <span className="top-cat-icon" style={{ '--cat-color': cat?.color }}>{cat?.icon}</span>
                <div className="top-info">
                  <span className="top-desc">{tx.description}</span>
                  <span className="top-meta">{tx.date} · {cat?.label}</span>
                </div>
                <span className="top-amount mono" style={{ color: 'var(--expense-color)' }}>
                  -{formatCurrency(tx.amount)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .insights-page { display: flex; flex-direction: column; gap: 16px; }

        .insights-kpis {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 12px;
        }

        .insights-charts {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .chart-panel {
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg);
          padding: 20px 22px;
          animation: fadeUp 0.5s ease forwards;
          animation-fill-mode: both;
        }

        .panel-header {
          display: flex;
          align-items: baseline;
          gap: 10px;
          margin-bottom: 16px;
        }

        .panel-header h3 { font-size: 15px; font-weight: 700; }
        .panel-subtitle { font-size: 12px; color: var(--text-muted); }

        /* Category bars */
        .cat-bars { display: flex; flex-direction: column; gap: 10px; }

        .cat-bar-item {
          animation: fadeUp 0.4s ease forwards;
          animation-fill-mode: both;
        }

        .cat-bar-label {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          margin-bottom: 5px;
          color: var(--text-secondary);
        }

        .cat-bar-track {
          height: 6px;
          background: var(--bg-elevated);
          border-radius: 3px;
          overflow: hidden;
        }

        .cat-bar-fill {
          height: 100%;
          border-radius: 3px;
          transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
          opacity: 0.85;
        }

        /* Top expenses */
        .top-expenses { }
        .top-list { display: flex; flex-direction: column; gap: 10px; }

        .top-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          background: var(--bg-elevated);
          border-radius: var(--radius-md);
          animation: fadeUp 0.4s ease forwards;
          animation-fill-mode: both;
          transition: background var(--transition);
        }

        .top-item:hover { background: var(--bg-hover); }

        .top-rank {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--text-muted);
          width: 24px;
          flex-shrink: 0;
        }

        .top-cat-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          background: color-mix(in srgb, var(--cat-color, #888) 12%, transparent);
          flex-shrink: 0;
        }

        .top-info { flex: 1; min-width: 0; }
        .top-desc { display: block; font-size: 13px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .top-meta { font-size: 11px; color: var(--text-muted); }
        .top-amount { font-size: 14px; font-weight: 600; flex-shrink: 0; }

        @media (max-width: 900px) {
          .insights-charts { grid-template-columns: 1fr; }
        }

        @media (max-width: 600px) {
          .insights-kpis { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
