import { useEffect, useState } from "react";
import api from "../api/axios";
import "./Budgets.css";

const Budgets = () => {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    categoryId: "",
    amount: "",
    month: "",
    year: "",
  });
  const [status, setStatus] = useState(null);
  const [budgetStatus, setBudgetStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load categories
  useEffect(() => {
    api.get("/categories").then((res) => setCategories(res.data));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreateBudget = async (e) => {
    e.preventDefault();
    setStatus(null);
    setLoading(true);

    try {
      await api.post("/budgets", {
        categoryId: form.categoryId,
        amount: Number(form.amount),
        month: Number(form.month),
        year: Number(form.year),
      });

      setStatus({
        type: "success",
        message: "Budget set successfully",
      });
      setBudgetStatus(null);
    } catch (err) {
      setStatus({
        type: "error",
        message:
          err.response?.data?.message || "Failed to set budget",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchBudgetStatus = async () => {
    if (!form.categoryId || !form.month || !form.year) return;

    try {
      const res = await api.get(
        `/budgets/status?categoryId=${form.categoryId}&month=${form.month}&year=${form.year}`
      );
      setBudgetStatus(res.data);
    } catch (err) {
      setBudgetStatus(null);
      setStatus({
        type: "error",
        message:
          err.response?.data?.message ||
          "Failed to fetch budget status",
      });
    }
  };

  const getProgressPercentage = () => {
    if (!budgetStatus) return 0;
    return Math.min((budgetStatus.spent / budgetStatus.budget) * 100, 100);
  };

  return (
    <div className="budgets-container">
      {/* Header */}
      <div className="budgets-header">
        <h1 className="budgets-title">Budget Management</h1>
        <p className="budgets-subtitle">Set and track your spending limits</p>
      </div>

      {/* Budget Form */}
      <div className="budget-form">
        <form onSubmit={handleCreateBudget}>
          <div className="budget-form-grid">
            <select
              name="categoryId"
              value={form.categoryId}
              onChange={handleChange}
              required
              className="budget-select"
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <input
              name="amount"
              type="number"
              placeholder="Budget Amount (₹)"
              value={form.amount}
              onChange={handleChange}
              required
              className="budget-input"
              min="0"
            />

            <input
              name="month"
              type="number"
              placeholder="Month (1-12)"
              value={form.month}
              onChange={handleChange}
              required
              className="budget-input"
              min="1"
              max="12"
            />

            <input
              name="year"
              type="number"
              placeholder="Year"
              value={form.year}
              onChange={handleChange}
              required
              className="budget-input"
              min="2020"
              max="2030"
            />
          </div>

          <button type="submit" disabled={loading} className="budget-button">
            {loading ? "Setting Budget..." : "Set Budget"}
          </button>
        </form>
      </div>

      {/* Status Message */}
      {status && (
        <div className={`budget-status-message ${status.type}`}>
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
            {status.type === "success" ? (
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            ) : (
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            )}
          </svg>
          {status.message}
        </div>
      )}

      {/* Budget Status Card */}
      <div className="budget-status-card">
        <div className="status-card-header">
          <h2 className="status-card-title">Budget Status</h2>
          <button
            onClick={fetchBudgetStatus}
            disabled={!form.categoryId || !form.month || !form.year}
            className="check-status-button"
          >
            Check Status
          </button>
        </div>

        {!budgetStatus ? (
          <div className="status-placeholder">
            <svg className="status-placeholder-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <p className="status-placeholder-text">Select category, month, and year, then click "Check Status" to view your budget.</p>
          </div>
        ) : (
          <div className={`budget-status-display ${budgetStatus.overBudget ? 'over-budget' : 'within-budget'}`}>
            <div className="status-metrics">
              <div className="status-metric">
                <span className="metric-label">Budget</span>
                <span className="metric-value">₹{budgetStatus.budget.toLocaleString()}</span>
              </div>
              <div className="status-metric">
                <span className="metric-label">Spent</span>
                <span className="metric-value">₹{budgetStatus.spent.toLocaleString()}</span>
              </div>
              <div className="status-metric">
                <span className="metric-label">Remaining</span>
                <span className="metric-value">₹{budgetStatus.remaining.toLocaleString()}</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="budget-progress">
              <div className="progress-label">
                <span>Spending Progress</span>
                <span>{Math.round(getProgressPercentage())}%</span>
              </div>
              <div className="progress-bar-container">
                <div 
                  className={`progress-bar ${budgetStatus.overBudget ? 'over-budget' : 'within-budget'}`}
                  style={{ width: `${getProgressPercentage()}%` }}
                ></div>
              </div>
            </div>

            {/* Alert */}
            <div className={`status-alert ${budgetStatus.overBudget ? 'warning' : 'success'}`}>
              <svg className="alert-icon" fill="currentColor" viewBox="0 0 20 20">
                {budgetStatus.overBudget ? (
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                ) : (
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                )}
              </svg>
              <span className="alert-text">
                {budgetStatus.overBudget ? 'Over Budget!' : 'Within Budget'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Budgets;
