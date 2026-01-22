import { useEffect, useState } from "react";
import api from "../api/axios";
import "./Categories.css";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    const res = await api.get("/categories");
    setCategories(res.data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    setStatus(null);
    setLoading(true);

    try {
      await api.post("/categories", { name });
      setName("");
      setStatus({ type: "success", message: "Category added successfully" });
      fetchCategories();
    } catch (err) {
      setStatus({
        type: "error",
        message: err.response?.data?.message || "Failed to add category",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;

    try {
      await api.delete(`/categories/${id}`);
      fetchCategories();
    } catch {
      alert("Failed to delete category");
    }
  };

  return (
    <div className="categories-container">
      {/* Header */}
      <div className="categories-header">
        <h1 className="categories-title">Expense Categories</h1>
        <p className="categories-subtitle">Organize your expenses into categories</p>
      </div>

      {/* Stats Summary */}
      <div className="categories-stats">
        <div className="category-stat-box">
          <div className="stat-box-label">Total Categories</div>
          <div className="stat-box-value">{categories.length}</div>
        </div>
      </div>

      {/* Add Category Form */}
      <form onSubmit={handleCreateCategory} className="category-form">
        <input
          type="text"
          placeholder="Enter new category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="category-input"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="category-add-button"
        >
          {loading ? "Adding..." : "Add Category"}
        </button>
      </form>

      {/* Status Message */}
      {status && (
        <div className={`category-status-message ${status.type}`}>
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

      {/* Category List */}
      {categories.length === 0 ? (
        <div className="categories-empty">
          <svg className="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          <p className="empty-text">No categories created yet</p>
          <p className="empty-subtext">Add your first category using the form above</p>
        </div>
      ) : (
        <div className="categories-grid">
          {categories.map((cat) => (
            <div key={cat.id} className="category-card">
              <div className="category-info">
                <div className="category-icon">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <span className="category-name">{cat.name}</span>
              </div>
              <button
                onClick={() => handleDelete(cat.id)}
                className="category-delete-button"
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Categories;
