import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { INITIAL_TRANSACTIONS } from '../data/mockData';

// ─── Types ────────────────────────────────────────────────────────────────────

const ROLES = {
  VIEWER: 'viewer',
  ADMIN: 'admin',
};

const initialFilters = {
  search: '',
  type: 'all',
  category: 'all',
  dateFrom: '',
  dateTo: '',
  sortBy: 'date',
  sortDir: 'desc',
};

const initialState = {
  transactions: [],
  filters: initialFilters,
  role: ROLES.ADMIN,
  theme: 'dark',
  activeTab: 'dashboard',
};

// ─── Reducer ──────────────────────────────────────────────────────────────────

function reducer(state, action) {
  switch (action.type) {
    case 'INIT_TRANSACTIONS':
      return { ...state, transactions: action.payload };

    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [action.payload, ...state.transactions],
      };

    case 'UPDATE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map(tx =>
          tx.id === action.payload.id ? { ...tx, ...action.payload } : tx
        ),
      };

    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter(tx => tx.id !== action.payload),
      };

    case 'SET_FILTER':
      return {
        ...state,
        filters: { ...state.filters, [action.key]: action.value },
      };

    case 'RESET_FILTERS':
      return { ...state, filters: initialFilters };

    case 'SET_ROLE':
      return { ...state, role: action.payload };

    case 'SET_THEME':
      return { ...state, theme: action.payload };

    case 'SET_TAB':
      return { ...state, activeTab: action.payload };

    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AppContext = createContext(null);

const STORAGE_KEY = 'finova_state';

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState, (init) => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...init, ...parsed };
      }
    } catch {}
    return { ...init, transactions: INITIAL_TRANSACTIONS };
  });

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        transactions: state.transactions,
        role: state.role,
        theme: state.theme,
      }));
    } catch {}
  }, [state.transactions, state.role, state.theme]);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme);
  }, [state.theme]);

  // Derived: filtered & sorted transactions
  const filteredTransactions = React.useMemo(() => {
    let txs = [...state.transactions];

    if (state.filters.search) {
      const q = state.filters.search.toLowerCase();
      txs = txs.filter(tx =>
        tx.description.toLowerCase().includes(q) ||
        tx.category.toLowerCase().includes(q) ||
        tx.amount.toString().includes(q)
      );
    }
    if (state.filters.type !== 'all') {
      txs = txs.filter(tx => tx.type === state.filters.type);
    }
    if (state.filters.category !== 'all') {
      txs = txs.filter(tx => tx.category === state.filters.category);
    }
    if (state.filters.dateFrom) {
      txs = txs.filter(tx => tx.date >= state.filters.dateFrom);
    }
    if (state.filters.dateTo) {
      txs = txs.filter(tx => tx.date <= state.filters.dateTo);
    }

    txs.sort((a, b) => {
      let val;
      if (state.filters.sortBy === 'date') val = a.date.localeCompare(b.date);
      else if (state.filters.sortBy === 'amount') val = a.amount - b.amount;
      else val = a.description.localeCompare(b.description);
      return state.filters.sortDir === 'desc' ? -val : val;
    });

    return txs;
  }, [state.transactions, state.filters]);

  return (
    <AppContext.Provider value={{ state, dispatch, filteredTransactions, ROLES }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export { ROLES };
