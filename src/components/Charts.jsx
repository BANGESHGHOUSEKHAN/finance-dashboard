import React, { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { getMonthlyData, getBalanceTrend, getCategoryBreakdown, formatCurrency } from '../data/mockData';

// Custom tooltip style
const TooltipStyle = {
  background: 'var(--bg-elevated)',
  border: '1px solid var(--border-soft)',
  borderRadius: '8px',
  padding: '10px 14px',
  fontFamily: 'var(--font-body)',
  fontSize: '13px',
  color: 'var(--text-primary)',
  boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
};

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={TooltipStyle}>
      <div style={{ color: 'var(--text-muted)', fontSize: '11px', marginBottom: 6, letterSpacing: '0.5px' }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: p.color, flexShrink: 0 }} />
          <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{p.name}:</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}>{formatCurrency(p.value)}</span>
        </div>
      ))}
    </div>
  );
}

export function BalanceTrendChart({ transactions }) {
  const data = getMonthlyData(transactions);

  return (
    <div className="chart-card">
      <div className="chart-header">
        <h3>Monthly Cash Flow</h3>
        <span className="chart-subtitle">Income vs Expenses</span>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 4, right: 4, left: -10, bottom: 0 }} barGap={4}>
          <defs>
            <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#34d399" stopOpacity={1} />
              <stop offset="100%" stopColor="#34d399" stopOpacity={0.6} />
            </linearGradient>
            <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f87171" stopOpacity={1} />
              <stop offset="100%" stopColor="#f87171" stopOpacity={0.6} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
          <XAxis dataKey="label" tick={{ fill: 'var(--text-muted)', fontSize: 11, fontFamily: 'var(--font-body)' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11, fontFamily: 'var(--font-mono)' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="income" name="Income" fill="url(#incomeGrad)" radius={[4, 4, 0, 0]} maxBarSize={40} />
          <Bar dataKey="expenses" name="Expenses" fill="url(#expenseGrad)" radius={[4, 4, 0, 0]} maxBarSize={40} />
        </BarChart>
      </ResponsiveContainer>
      <style>{`
        .chart-card {
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg);
          padding: 20px 22px;
          animation: fadeUp 0.5s ease forwards;
          animation-delay: 0.1s;
          animation-fill-mode: both;
        }
        .chart-header {
          display: flex;
          align-items: baseline;
          gap: 10px;
          margin-bottom: 16px;
        }
        .chart-header h3 {
          font-size: 15px;
          font-weight: 700;
          letter-spacing: -0.2px;
        }
        .chart-subtitle {
          font-size: 12px;
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
}

export function BalanceAreaChart({ transactions }) {
  const data = getBalanceTrend(transactions);
  // Sample to keep it readable
  const step = Math.max(1, Math.floor(data.length / 20));
  const sampled = data.filter((_, i) => i % step === 0 || i === data.length - 1);

  return (
    <div className="chart-card">
      <div className="chart-header">
        <h3>Balance Trend</h3>
        <span className="chart-subtitle">Running total over time</span>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={sampled} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f0b429" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#f0b429" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
          <XAxis dataKey="label" tick={{ fill: 'var(--text-muted)', fontSize: 10, fontFamily: 'var(--font-body)' }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
          <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10, fontFamily: 'var(--font-mono)' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="balance" name="Balance" stroke="#f0b429" strokeWidth={2} fill="url(#balanceGrad)" dot={false} activeDot={{ r: 4, fill: '#f0b429', stroke: 'var(--bg-surface)', strokeWidth: 2 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function SpendingPieChart({ transactions }) {
  const data = getCategoryBreakdown(transactions).slice(0, 7);
  const [active, setActive] = useState(null);
  const total = data.reduce((s, d) => s + d.amount, 0);

  return (
    <div className="chart-card pie-card">
      <div className="chart-header">
        <h3>Spending Breakdown</h3>
        <span className="chart-subtitle">By category</span>
      </div>
      <div className="pie-content">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data}
              dataKey="amount"
              nameKey="label"
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={3}
              onMouseEnter={(_, i) => setActive(i)}
              onMouseLeave={() => setActive(null)}
            >
              {data.map((entry, i) => (
                <Cell
                  key={entry.category}
                  fill={entry.color}
                  opacity={active === null || active === i ? 1 : 0.4}
                  stroke="var(--bg-surface)"
                  strokeWidth={2}
                  style={{ cursor: 'pointer', transition: 'opacity 0.2s' }}
                />
              ))}
            </Pie>
            <Tooltip
              content={({ active: a, payload: p }) => {
                if (!a || !p?.length) return null;
                const d = p[0];
                return (
                  <div style={TooltipStyle}>
                    <div style={{ color: 'var(--text-secondary)', marginBottom: 4 }}>{d.payload.icon} {d.name}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', color: d.payload.color }}>{formatCurrency(d.value)}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: 11 }}>{((d.value / total) * 100).toFixed(1)}% of total</div>
                  </div>
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="pie-legend">
          {data.map((d, i) => (
            <div key={d.category} className={`legend-item ${active === i ? 'active' : ''}`} onMouseEnter={() => setActive(i)} onMouseLeave={() => setActive(null)}>
              <span className="legend-dot" style={{ background: d.color }} />
              <span className="legend-label">{d.icon} {d.label}</span>
              <span className="legend-pct mono">{((d.amount / total) * 100).toFixed(0)}%</span>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .pie-card { }
        .pie-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          align-items: center;
        }
        .pie-legend {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 4px 6px;
          border-radius: 6px;
          cursor: pointer;
          transition: background var(--transition);
          font-size: 12px;
        }
        .legend-item:hover, .legend-item.active {
          background: var(--bg-hover);
        }
        .legend-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .legend-label { flex: 1; color: var(--text-secondary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .legend-pct { color: var(--text-muted); font-size: 11px; }

        @media (max-width: 500px) {
          .pie-content { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
