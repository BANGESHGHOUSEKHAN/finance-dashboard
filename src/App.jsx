import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardPage from './components/DashboardPage';
import TransactionsPage from './components/TransactionsPage';
import InsightsPage from './components/InsightsPage';
import './App.css';

function AppShell() {
  const { state } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderPage = () => {
    switch (state.activeTab) {
      case 'transactions': return <TransactionsPage />;
      case 'insights': return <InsightsPage />;
      default: return <DashboardPage />;
    }
  };

  return (
    <div className="app-shell">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <div className={`sidebar-wrapper ${sidebarOpen ? 'open' : ''}`}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      <div className="main-area">
        <Header onMenuClick={() => setSidebarOpen(v => !v)} />
        <main className="page-content">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
