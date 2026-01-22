import { useCallback, useEffect, useState } from "react";
import api from "../api/axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import "./Analytics.css";

const COLORS = ["#2563eb", "#16a34a", "#dc2626", "#f59e0b", "#7c3aed"];

const Analytics = () => {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const [summary, setSummary] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [trends, setTrends] = useState([]);

  const fetchAnalytics = useCallback(async () => {
    try {
      const [summaryRes, categoryRes, trendsRes] = await Promise.all([
        api.get(`/analytics/monthly-summary?month=${month}&year=${year}`),
        api.get(`/analytics/category-breakdown?month=${month}&year=${year}`),
        api.get("/analytics/trends?months=6"),
      ]);

      setSummary(summaryRes.data);

      // Convert category object → array for charts
      const formattedCategories = Object.entries(categoryRes.data).map(
        ([name, value]) => ({
          name,
          value,
        })
      );
      setCategoryData(formattedCategories);

      setTrends(trendsRes.data);
    } catch (err) {
      console.error("Analytics load failed", err);
    }
  }, [month, year]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return (
    <div className="analytics-container">
      {/* Header */}
      <div className="analytics-header">
        <h1 className="analytics-title">Analytics Dashboard</h1>
        <p className="analytics-subtitle">Visualize your spending patterns and trends</p>
      </div>

      {/* Filters */}
      <div className="analytics-filters">
        <input
          type="number"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          placeholder="Month (1-12)"
          className="filter-input"
          min="1"
          max="12"
        />
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          placeholder="Year"
          className="filter-input"
          min="2020"
          max="2030"
        />
        <button onClick={fetchAnalytics} className="filter-button">
          Refresh Data
        </button>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="summary-grid">
          <div className="summary-card">
            <p className="summary-label">Total Spent</p>
            <p className="summary-value">₹{summary.totalSpent.toLocaleString()}</p>
          </div>
          <div className="summary-card">
            <p className="summary-label">Total Transactions</p>
            <p className="summary-value">{summary.totalTransactions}</p>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="charts-grid">
        {/* Category Breakdown - Pie Chart */}
        <div className="chart-card">
          <h2 className="chart-title">Category Breakdown</h2>
          {categoryData.length === 0 ? (
            <div className="chart-empty">
              <svg className="chart-empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
              </svg>
              <p className="chart-empty-text">No category data available</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {categoryData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Spending Trend - Line Chart */}
        <div className="chart-card">
          <h2 className="chart-title">Spending Trend (6 Months)</h2>
          {trends.length === 0 ? (
            <div className="chart-empty">
              <svg className="chart-empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
              <p className="chart-empty-text">No trend data available</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={trends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="totalSpent"
                  stroke="#667eea"
                  strokeWidth={3}
                  dot={{ fill: '#667eea', r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Category Comparison - Bar Chart */}
        <div className="chart-card full-width">
          <h2 className="chart-title">Category Spend Comparison</h2>
          {categoryData.length === 0 ? (
            <div className="chart-empty">
              <svg className="chart-empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p className="chart-empty-text">No comparison data available</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
