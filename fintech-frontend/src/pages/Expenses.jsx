import { useEffect, useState } from "react";
import api from "../api/axios";
import "./Expenses.css";

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "",
    date: "",
  });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch categories & expenses
  useEffect(() => {
    const loadData = async () => {
      const [catRes, expRes] = await Promise.all([
        api.get("/categories"),
        api.get("/expenses"),
      ]);
      setCategories(catRes.data);
      setExpenses(expRes.data);
    };
    loadData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreateExpense = async (e) => {
    e.preventDefault();
    setStatus(null);
    setLoading(true);

    try {
      await api.post("/expenses", {
        title: form.title,
        amount: Number(form.amount),
        category: form.category,
        date: form.date,
      });

      setForm({ title: "", amount: "", category: "", date: "" });
      setStatus({ type: "success", message: "Expense added successfully" });

      const res = await api.get("/expenses");
      setExpenses(res.data);
    } catch (err) {
      setStatus({
        type: "error",
        message: err.response?.data?.message || "Failed to add expense",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this expense?")) return;

    try {
      await api.delete(`/expenses/${id}`);
      setExpenses(expenses.filter((e) => e.id !== id));
    } catch {
      alert("Failed to delete expense");
    }
  };

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const avgExpense = expenses.length > 0 ? totalExpenses / expenses.length : 0;

  return (
    <div className="expenses-container">
      {/* Header */}
      <div className="expenses-header">
        <h1 className="expenses-title">Expenses</h1>
        <p className="expenses-subtitle">Track and manage your spending</p>
      </div>

      {/* Stats Summary */}
      <div className="expenses-stats">
        <div className="stat-box">
          <div className="stat-label">Total Expenses</div>
          <div className="stat-value">₹{totalExpenses.toLocaleString()}</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Total Transactions</div>
          <div className="stat-value">{expenses.length}</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Average Expense</div>
          <div className="stat-value">₹{Math.round(avgExpense).toLocaleString()}</div>
        </div>
      </div>

      {/* Add Expense Form */}
      <div className="expense-form">
        <form onSubmit={handleCreateExpense}>
          <div className="form-grid">
            <input
              name="title"
              placeholder="Expense Title"
              value={form.title}
              onChange={handleChange}
              required
              className="form-input"
            />

            <input
              name="amount"
              type="number"
              placeholder="Amount (₹)"
              value={form.amount}
              onChange={handleChange}
              required
              className="form-input"
              min="0"
              step="0.01"
            />

            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              className="form-select"
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>

            <input
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <button type="submit" disabled={loading} className="form-button">
            {loading ? "Adding Expense..." : "Add Expense"}
          </button>
        </form>
      </div>

      {/* Status Message */}
      {status && (
        <div className={`status-message ${status.type}`}>
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

      {/* Expense List */}
      <div className="expenses-table-wrapper">
        <table className="expenses-table">
          <thead className="table-header">
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="table-body">
            {expenses.length === 0 ? (
              <tr>
                <td colSpan="5">
                  <div className="empty-state">
                    <svg className="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <p className="empty-text">No expenses recorded yet</p>
                    <p className="empty-subtext">Add your first expense using the form above</p>
                  </div>
                </td>
              </tr>
            ) : (
              expenses.map((e) => (
                <tr key={e.id}>
                  <td className="table-title">{e.title}</td>
                  <td>
                    <span className="table-category">{e.category}</span>
                  </td>
                  <td className="table-amount">₹{e.amount.toLocaleString()}</td>
                  <td className="table-date">
                    {new Date(e.date).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </td>
                  <td>
                    <button
                      onClick={() => handleDelete(e.id)}
                      className="delete-button"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Expenses;
