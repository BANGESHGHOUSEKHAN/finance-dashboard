// ─── Mock Data ───────────────────────────────────────────────────────────────

export const CATEGORIES = {
  salary: { label: 'Salary', icon: '💼', color: '#34d399' },
  freelance: { label: 'Freelance', icon: '💻', color: '#60a5fa' },
  investment: { label: 'Investment', icon: '📈', color: '#a78bfa' },
  food: { label: 'Food & Dining', icon: '🍽️', color: '#fb923c' },
  transport: { label: 'Transport', icon: '🚗', color: '#f59e0b' },
  shopping: { label: 'Shopping', icon: '🛍️', color: '#ec4899' },
  utilities: { label: 'Utilities', icon: '💡', color: '#94a3b8' },
  entertainment: { label: 'Entertainment', icon: '🎬', color: '#818cf8' },
  health: { label: 'Health', icon: '❤️', color: '#f87171' },
  housing: { label: 'Housing', icon: '🏠', color: '#c084fc' },
  education: { label: 'Education', icon: '📚', color: '#2dd4bf' },
  travel: { label: 'Travel', icon: '✈️', color: '#38bdf8' },
};

const generateId = () => Math.random().toString(36).slice(2, 10);

const createTx = (date, type, category, description, amount, id) => ({
  id: id || generateId(),
  date,
  type,
  category,
  description,
  amount: parseFloat(amount.toFixed(2)),
});

export const INITIAL_TRANSACTIONS = [
  // April 2025
  createTx('2025-04-01', 'income',  'salary',        'Monthly Salary',          8500,   'tx001'),
  createTx('2025-04-03', 'expense', 'housing',       'Rent Payment',            1800,   'tx002'),
  createTx('2025-04-05', 'expense', 'food',          'Grocery Store',           124.50, 'tx003'),
  createTx('2025-04-07', 'expense', 'transport',     'Fuel & Parking',          68.00,  'tx004'),
  createTx('2025-04-08', 'expense', 'entertainment', 'Netflix Subscription',    15.99,  'tx005'),
  createTx('2025-04-10', 'income',  'freelance',     'UI Design Project',       1200,   'tx006'),
  createTx('2025-04-12', 'expense', 'shopping',      'Online Shopping',         230.40, 'tx007'),
  createTx('2025-04-14', 'expense', 'food',          'Restaurant Dinner',       87.60,  'tx008'),
  createTx('2025-04-15', 'expense', 'utilities',     'Internet Bill',           59.99,  'tx009'),
  createTx('2025-04-17', 'expense', 'health',        'Pharmacy',                42.30,  'tx010'),
  createTx('2025-04-18', 'income',  'investment',    'Dividend Payout',         340,    'tx011'),
  createTx('2025-04-20', 'expense', 'education',     'Online Course',           79.00,  'tx012'),
  createTx('2025-04-22', 'expense', 'food',          'Supermarket Run',         95.20,  'tx013'),
  createTx('2025-04-24', 'expense', 'transport',     'Cab Rides',               34.50,  'tx014'),
  createTx('2025-04-26', 'expense', 'entertainment', 'Concert Tickets',         120.00, 'tx015'),
  createTx('2025-04-28', 'expense', 'shopping',      'Clothing Purchase',       185.00, 'tx016'),
  createTx('2025-04-30', 'expense', 'utilities',     'Electricity Bill',        78.40,  'tx017'),

  // March 2025
  createTx('2025-03-01', 'income',  'salary',        'Monthly Salary',          8500,   'tx018'),
  createTx('2025-03-03', 'expense', 'housing',       'Rent Payment',            1800,   'tx019'),
  createTx('2025-03-05', 'expense', 'food',          'Weekly Groceries',        108.30, 'tx020'),
  createTx('2025-03-07', 'income',  'freelance',     'Brand Identity Project',  950,    'tx021'),
  createTx('2025-03-09', 'expense', 'transport',     'Monthly Transit Pass',    95.00,  'tx022'),
  createTx('2025-03-10', 'expense', 'entertainment', 'Spotify + Netflix',       28.99,  'tx023'),
  createTx('2025-03-12', 'expense', 'shopping',      'Electronics',             349.99, 'tx024'),
  createTx('2025-03-14', 'expense', 'food',          'Restaurant Brunch',       62.40,  'tx025'),
  createTx('2025-03-15', 'expense', 'utilities',     'Internet + Phone',        89.98,  'tx026'),
  createTx('2025-03-17', 'expense', 'health',        'Gym Membership',          45.00,  'tx027'),
  createTx('2025-03-19', 'income',  'investment',    'Stock Dividend',          280,    'tx028'),
  createTx('2025-03-20', 'expense', 'travel',        'Weekend Getaway',         420.00, 'tx029'),
  createTx('2025-03-22', 'expense', 'food',          'Coffee Shop',             28.50,  'tx030'),
  createTx('2025-03-25', 'expense', 'utilities',     'Gas Bill',                55.00,  'tx031'),
  createTx('2025-03-27', 'expense', 'entertainment', 'Movie Night',             42.00,  'tx032'),
  createTx('2025-03-29', 'expense', 'shopping',      'Home Decor',              155.60, 'tx033'),

  // February 2025
  createTx('2025-02-01', 'income',  'salary',        'Monthly Salary',          8500,   'tx034'),
  createTx('2025-02-02', 'expense', 'housing',       'Rent Payment',            1800,   'tx035'),
  createTx('2025-02-04', 'expense', 'food',          'Groceries',               132.80, 'tx036'),
  createTx('2025-02-06', 'income',  'freelance',     'Web Dev Contract',        1800,   'tx037'),
  createTx('2025-02-08', 'expense', 'transport',     'Fuel',                    55.00,  'tx038'),
  createTx('2025-02-10', 'expense', 'health',        'Doctor Visit',            150.00, 'tx039'),
  createTx('2025-02-12', 'expense', 'food',          "Valentine's Dinner",      210.00, 'tx040'),
  createTx('2025-02-14', 'expense', 'shopping',      'Gift Purchase',           280.00, 'tx041'),
  createTx('2025-02-16', 'expense', 'utilities',     'Utilities Bundle',        122.50, 'tx042'),
  createTx('2025-02-18', 'income',  'investment',    'Crypto Gains',            620,    'tx043'),
  createTx('2025-02-20', 'expense', 'education',     'Workshop Fee',            199.00, 'tx044'),
  createTx('2025-02-22', 'expense', 'food',          'Meal Prep Delivery',      89.00,  'tx045'),
  createTx('2025-02-24', 'expense', 'entertainment', 'Gaming Subscription',     14.99,  'tx046'),
  createTx('2025-02-26', 'expense', 'travel',        'Flight Booking',          380.00, 'tx047'),
  createTx('2025-02-28', 'expense', 'shopping',      'Wardrobe Update',         310.00, 'tx048'),

  // January 2025
  createTx('2025-01-01', 'income',  'salary',        'Monthly Salary',          8500,   'tx049'),
  createTx('2025-01-02', 'expense', 'housing',       'Rent Payment',            1800,   'tx050'),
  createTx('2025-01-04', 'expense', 'shopping',      'New Year Shopping',       520.00, 'tx051'),
  createTx('2025-01-06', 'expense', 'food',          'Groceries',               118.40, 'tx052'),
  createTx('2025-01-08', 'income',  'freelance',     'Logo Design',             600,    'tx053'),
  createTx('2025-01-10', 'expense', 'utilities',     'Annual Subscriptions',    299.00, 'tx054'),
  createTx('2025-01-12', 'expense', 'entertainment', 'Streaming Services',      44.97,  'tx055'),
  createTx('2025-01-15', 'income',  'investment',    'Year-end Dividend',       890,    'tx056'),
  createTx('2025-01-17', 'expense', 'health',        'Health Checkup',          220.00, 'tx057'),
  createTx('2025-01-20', 'expense', 'education',     'Books & Materials',       95.00,  'tx058'),
  createTx('2025-01-22', 'expense', 'food',          'Restaurant Visit',        74.20,  'tx059'),
  createTx('2025-01-25', 'expense', 'transport',     'Car Maintenance',         185.00, 'tx060'),
  createTx('2025-01-28', 'expense', 'travel',        'Hotel Booking',           250.00, 'tx061'),
  createTx('2025-01-30', 'expense', 'shopping',      'Electronics Accessories', 139.00, 'tx062'),
];

// ─── Computed Helpers ─────────────────────────────────────────────────────────

export function calcSummary(transactions) {
  const income = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  return { income, expenses, balance: income - expenses };
}

export function getMonthlyData(transactions) {
  const months = {};
  transactions.forEach(tx => {
    const key = tx.date.slice(0, 7); // YYYY-MM
    if (!months[key]) months[key] = { income: 0, expenses: 0 };
    if (tx.type === 'income') months[key].income += tx.amount;
    else months[key].expenses += tx.amount;
  });

  return Object.entries(months)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, data]) => ({
      month,
      label: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
      income: parseFloat(data.income.toFixed(2)),
      expenses: parseFloat(data.expenses.toFixed(2)),
      net: parseFloat((data.income - data.expenses).toFixed(2)),
    }));
}

export function getCategoryBreakdown(transactions) {
  const cats = {};
  transactions.filter(t => t.type === 'expense').forEach(tx => {
    if (!cats[tx.category]) cats[tx.category] = 0;
    cats[tx.category] += tx.amount;
  });
  return Object.entries(cats)
    .sort(([, a], [, b]) => b - a)
    .map(([cat, amount]) => ({
      category: cat,
      label: CATEGORIES[cat]?.label || cat,
      color: CATEGORIES[cat]?.color || '#888',
      icon: CATEGORIES[cat]?.icon || '📌',
      amount: parseFloat(amount.toFixed(2)),
    }));
}

export function formatCurrency(amount, compact = false) {
  if (compact && Math.abs(amount) >= 1000) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(amount);
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateStr) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function getBalanceTrend(transactions) {
  const sorted = [...transactions].sort((a, b) => a.date.localeCompare(b.date));
  let running = 0;
  return sorted.map(tx => {
    running += tx.type === 'income' ? tx.amount : -tx.amount;
    return {
      date: tx.date,
      label: new Date(tx.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      balance: parseFloat(running.toFixed(2)),
    };
  });
}

export function getInsights(transactions) {
  const catBreakdown = getCategoryBreakdown(transactions);
  const monthlyData = getMonthlyData(transactions);
  const expenseTxs = transactions.filter(t => t.type === 'expense');
  const totalExpenses = expenseTxs.reduce((s, t) => s + t.amount, 0);

  const topCategory = catBreakdown[0] || null;
  const topCategoryPct = topCategory ? ((topCategory.amount / totalExpenses) * 100).toFixed(1) : 0;

  // Month over month
  const lastTwo = monthlyData.slice(-2);
  let mom = null;
  if (lastTwo.length === 2) {
    const diff = lastTwo[1].expenses - lastTwo[0].expenses;
    mom = { diff, pct: ((diff / lastTwo[0].expenses) * 100).toFixed(1), label: lastTwo[1].label, prevLabel: lastTwo[0].label };
  }

  // Best month (highest net)
  const bestMonth = [...monthlyData].sort((a, b) => b.net - a.net)[0];

  // Avg monthly spend
  const totalMonths = monthlyData.length || 1;
  const avgMonthlyExpense = totalExpenses / totalMonths;

  return { topCategory, topCategoryPct, mom, bestMonth, avgMonthlyExpense, catBreakdown };
}
