import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import "./Dashboard.css";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalExpenses: 0,
    totalCategories: 0,
    totalTransactions: 0,
    avgExpense: 0,
    recentExpenses: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [expensesRes, categoriesRes] = await Promise.all([
          api.get("/expenses"),
          api.get("/categories"),
        ]);

        const expenses = expensesRes.data;
        const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
        const avgExpense = expenses.length > 0 ? totalExpenses / expenses.length : 0;

        setStats({
          totalExpenses,
          totalCategories: categoriesRes.data.length,
          totalTransactions: expenses.length,
          avgExpense,
          recentExpenses: expenses.slice(0, 5),
        });
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard Overview</h1>
        <p className="dashboard-subtitle">Welcome back! Here's what's happening with your finances.</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-content">
            <div className="stat-info">
              <p className="stat-label">Total Spent</p>
              <p className="stat-value">₹{stats.totalExpenses.toLocaleString()}</p>
            </div>
            <div className="stat-icon blue">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="stat-card green">
          <div className="stat-content">
            <div className="stat-info">
              <p className="stat-label">Categories</p>
              <p className="stat-value">{stats.totalCategories}</p>
            </div>
            <div className="stat-icon green">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="stat-card purple">
          <div className="stat-content">
            <div className="stat-info">
              <p className="stat-label">Transactions</p>
              <p className="stat-value">{stats.totalTransactions}</p>
            </div>
            <div className="stat-icon purple">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
        </div>

        <div className="stat-card orange">
          <div className="stat-content">
            <div className="stat-info">
              <p className="stat-label">Avg. Expense</p>
              <p className="stat-value">₹{Math.round(stats.avgExpense).toLocaleString()}</p>
            </div>
            <div className="stat-icon orange">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <Link to="/expenses" className="action-button">
          <div className="action-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div className="action-text">
            <div className="action-title">Add Expense</div>
            <div className="action-subtitle">Track new spending</div>
          </div>
        </Link>

        <Link to="/categories" className="action-button">
          <div className="action-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
          <div className="action-text">
            <div className="action-title">Manage Categories</div>
            <div className="action-subtitle">Organize expenses</div>
          </div>
        </Link>

        <Link to="/budgets" className="action-button">
          <div className="action-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="action-text">
            <div className="action-title">Set Budget</div>
            <div className="action-subtitle">Plan your spending</div>
          </div>
        </Link>

        <Link to="/analytics" className="action-button">
          <div className="action-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div className="action-text">
            <div className="action-title">View Analytics</div>
            <div className="action-subtitle">Insights & reports</div>
          </div>
        </Link>
      </div>

      {/* Content Grid */}
      <div className="content-grid">
        {/* Recent Activity */}
        <div className="activity-card">
          <div className="card-header">
            <h2 className="card-title">Recent Expenses</h2>
            <Link to="/expenses" className="view-all-link">View All</Link>
          </div>

          {stats.recentExpenses.length === 0 ? (
            <div className="empty-state">
              <svg className="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="empty-text">No expenses recorded yet. Start tracking your spending!</p>
            </div>
          ) : (
            <div className="activity-list">
              {stats.recentExpenses.map((expense) => (
                <div key={expense.id} className="activity-item">
                  <div className="activity-info">
                    <div className="activity-title">{expense.title}</div>
                    <div className="activity-meta">{expense.category}</div>
                  </div>
                  <div className="activity-amount">
                    <div className="amount-value">₹{expense.amount}</div>
                    <div className="amount-date">{new Date(expense.date).toLocaleDateString()}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Summary Card */}
        <div className="summary-card">
          <h3 className="summary-title">Monthly Summary</h3>
          <div className="summary-items">
            <div className="summary-item">
              <span className="summary-label">Total Spent</span>
              <span className="summary-value">₹{stats.totalExpenses.toLocaleString()}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Categories</span>
              <span className="summary-value">{stats.totalCategories}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Transactions</span>
              <span className="summary-value">{stats.totalTransactions}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Avg. Transaction</span>
              <span className="summary-value">₹{Math.round(stats.avgExpense)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
