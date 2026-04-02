# Finova — Finance Dashboard

A clean, interactive personal finance dashboard built with **React + Vite**. Track transactions, visualize spending patterns, and gain actionable insights — with role-based UI and full dark/light theming.

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🗂 Project Structure

```
finance-dashboard/
├── public/
│   └── favicon.svg
├── src/
│   ├── App.jsx                  # Root shell with layout + routing
│   ├── App.css                  # Shell layout (sidebar + main area)
│   ├── main.jsx                 # React entry point
│   ├── index.css                # Global design system (CSS variables, animations)
│   │
│   ├── context/
│   │   └── AppContext.jsx       # Global state via useReducer + Context
│   │
│   ├── data/
│   │   └── mockData.js          # 62 mock transactions + data helpers
│   │
│   └── components/
│       ├── Sidebar.jsx          # Navigation + role switcher
│       ├── Header.jsx           # Top bar (page title, theme toggle, avatar)
│       ├── SummaryCards.jsx     # KPI cards (Balance, Income, Expenses)
│       ├── Charts.jsx           # Recharts visualizations
│       ├── DashboardPage.jsx    # Main overview page
│       ├── TransactionsPage.jsx # Full transaction table with CRUD
│       ├── TransactionModal.jsx # Add / Edit transaction modal
│       └── InsightsPage.jsx     # Spending analysis & insights
├── index.html
├── vite.config.js
└── package.json
```

---

## ✨ Features

### 1. Dashboard Overview
- **Summary cards** — Net Balance (gold), Total Income (green), Total Expenses (red) with month-over-month trend indicators
- **Monthly Cash Flow** bar chart — income vs expenses side-by-side per month
- **Balance Trend** area chart — running balance over time
- **Spending Breakdown** donut chart — top 7 expense categories with interactive legend
- **Recent Transactions** — last 6 transactions at a glance with quick "View all" link

### 2. Transactions
- Full table with **62 pre-loaded mock transactions** spanning Jan–Apr 2025
- **Search** by description, category, or amount
- **Filter** by type (income/expense), category, and date range
- **Sort** by date, amount, or description (click column headers)
- **Export to CSV** — downloads all currently filtered transactions
- **Admin only:** Add, edit, delete transactions via modal form
- Empty state handling when filters return no results

### 3. Role-Based UI
Switch roles via the **dropdown in the sidebar footer**:

| Role | Capabilities |
|------|-------------|
| **👁 Viewer** | Read-only — can browse, filter, and export data |
| **⚡ Admin** | Full access — can add, edit, and delete transactions |

No backend auth — role is toggled on the frontend for demonstration. The role is persisted to `localStorage`.

### 4. Insights
- **Top spending category** with % share and total amount
- **Savings rate** with contextual feedback (Great / Room to improve / Cut expenses)
- **Month-over-month** spending change (amount + percentage)
- **Average monthly expenses** across all tracked months
- **Best month** by net savings
- **Monthly Net Savings** bar chart — green for positive, red for negative months
- **Category analysis** — horizontal bar breakdown for all expense categories
- **Top 5 largest expenses** — ranked list with category, description, and date

### 5. State Management
All application state lives in a single `useReducer` + React Context (`AppContext.jsx`):

```
state = {
  transactions: Transaction[]   // All transaction records
  filters: FilterState          // Search, type, category, dates, sort
  role: 'viewer' | 'admin'      // Current user role
  theme: 'dark' | 'light'       // UI theme
  activeTab: string             // Current page
}
```

Actions: `ADD_TRANSACTION`, `UPDATE_TRANSACTION`, `DELETE_TRANSACTION`, `SET_FILTER`, `RESET_FILTERS`, `SET_ROLE`, `SET_THEME`, `SET_TAB`

Filtered/sorted transactions are computed via `useMemo` as a derived value — no duplicate state.

### 6. Persistence
State is automatically saved to `localStorage` (key: `finova_state`) and restored on page load. This includes transactions, theme, and role. A reset is possible by clearing localStorage.

### 7. Theming
- **Dark mode** (default) — deep navy/charcoal with gold accents
- **Light mode** — clean whites/grays with warm gold
- Toggled via the ☀/◑ button in the header
- Implemented entirely via CSS custom properties (`--bg-*`, `--text-*`, etc.)

### 8. Responsive Design
- Sidebar collapses to a slide-in drawer on mobile (≤ 768px)
- Dashboard grid reflows from 2-column → 1-column at ≤ 1100px
- Summary cards reflow: 3-col → 2-col → 1-col
- Transaction table hides secondary columns on small screens
- Touch-friendly tap targets throughout

---

## 🛠 Tech Stack

| Tool | Purpose |
|------|---------|
| **React 18** | UI framework |
| **Vite 5** | Build tool + dev server |
| **Recharts** | Charts (BarChart, AreaChart, PieChart) |
| **CSS Custom Properties** | Design system + theming (no CSS framework) |
| **React Context + useReducer** | State management |
| **localStorage** | Data persistence |

No external UI component library — all components are hand-crafted with scoped `<style>` blocks for zero CSS conflicts.

---

## 🎨 Design Decisions

**Typography:** Syne (display/headings) + DM Sans (body) + DM Mono (numbers/code) — chosen for a premium fintech feel without relying on overused defaults like Inter.

**Color system:** Deep navy backgrounds (`#080b14` → `#1c2842`) with a gold accent system (`#c9933a` → `#f0b429`) for hierarchy and emphasis. Semantic colors: green for income, red for expenses, blue for neutral info.

**Component architecture:** Each component owns its styles via inline `<style>` tags. This keeps styles co-located with markup, avoids global CSS bleed, and makes each file self-contained.

**No external icon library:** Unicode symbols (`◈`, `≡`, `↑`, `↓`) keep the bundle lean while maintaining visual consistency.

---

## 📦 Dependencies

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "recharts": "^2.12.7",
  "lucide-react": "^0.383.0",
  "date-fns": "^3.6.0"
}
```

---

## 🔮 Potential Enhancements

- Connect to a real backend/API (replace `mockData.js` with fetch calls)
- Add budget goals per category with progress bars
- Multi-currency support
- Date range picker component
- PDF export for monthly statements
- Notifications/alerts for overspending
- Authentication with real RBAC (JWT + protected routes)
