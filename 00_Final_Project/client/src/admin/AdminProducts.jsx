import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
  const fetchProducts = async () => {
    try {
      // REMOVE localStorage usage. Use withCredentials: true instead.
      const res = await axios.get(`${import.meta.env.VITE_BACKENDURL}/admin/products`, {
        withCredentials: true, // This sends your HttpOnly session cookie
      });
      setProducts(res.data.products);
    } catch (err) {
      console.error("Failed to load products", err);
      // Optional: Redirect if unauthorized
      if (err.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };
  fetchProducts();
}, []);

  const handleDelete = async (id) => {
    toast.warn(
      ({ closeToast }) => (
        <div>
          <p style={{ marginBottom: "10px", fontWeight: 600 }}>Are you sure you want to delete this product?</p>
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              style={{ background: "#dc2626", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer" }}
              onClick={async () => {
                closeToast();
                const toastId = toast.loading("Deleting...");
                try {
                  const admintoken = localStorage.getItem("admintoken");
                  await axios.delete(`http://localhost:8000/admin/delete-product/${id}`, {
                    headers: { Authorization: `Bearer ${admintoken}` },
                  });
                  toast.update(toastId, { render: "Product deleted ✅", type: "success", isLoading: false, autoClose: 2000 });
                  setProducts((prev) => prev.filter((p) => p._id !== id));
                } catch (err) {
                  toast.update(toastId, { render: "Failed to delete ❌", type: "error", isLoading: false, autoClose: 2500 });
                }
              }}
            >
              Yes, Delete
            </button>
            <button style={{ background: "#e5e7eb", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer" }} onClick={closeToast}>
              Cancel
            </button>
          </div>
        </div>
      ),
      { autoClose: false, closeOnClick: false, draggable: false }
    );
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      <style>{`
        .admin-page-container { width: 100%; max-width: 1100px; margin: auto; padding: 10px 24px 40px; }
        
        /* Centered Header */
        .admin-page-header { text-align: center; margin-top: 24px; margin-bottom: 36px; }
        .page-title { font-size: 26px; font-weight: 700; color: #0f172a; margin: 0 0 6px 0; letter-spacing: -0.02em; }
        .page-subtitle { font-size: 14px; color: #64748b; margin: 0; font-weight: 400; }

        /* Table */
        .table-container { background: #fff; border-radius: 14px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.02); border: 1px solid #e2e8f0; }
        table { width: 100%; border-collapse: collapse; }
        thead { background: #f8fafc; border-bottom: 1px solid #e2e8f0; }
        th { padding: 16px 20px; font-size: 12px; font-weight: 700; text-transform: uppercase; color: #475569; text-align: left; }
        td { padding: 16px 20px; vertical-align: middle; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
        
        .product-cell { display: flex; align-items: center; gap: 15px; }
        .product-cell img { width: 50px; height: 50px; object-fit: contain; border-radius: 8px; border: 1px solid #e2e8f0; }
        .product-name { font-weight: 600; color: #0f172a; }
        
        .badge { padding: 4px 10px; border-radius: 999px; font-size: 11px; font-weight: 600; }
        .category { background: #e0e7ff; color: #3730a3; }
        .active { background: #dcfce7; color: #166534; }
        .out { background: #fee2e2; color: #b91c1c; }
        
        .edit-btn { padding: 6px 12px; border-radius: 6px; border: none; background: #0f172a; color: #fff; font-size: 12px; cursor: pointer; }
        .delete-btn { padding: 6px 12px; border-radius: 6px; border: none; background: #ef4444; color: #fff; font-size: 12px; cursor: pointer; margin-left: 8px; }
        .empty { text-align: center; padding: 60px; color: #64748b; }
      `}</style>

      <div className="admin-page-container">
        <div className="admin-page-header">
          <h2 className="page-title">Products & Stocks List</h2>
          <p className="page-subtitle">Manage your digital inventory, pricing, and stock metrics</p>
        </div>

        {loading ? (
          <p className="empty">Loading inventory database...</p>
        ) : products.length === 0 ? (
          <p className="empty">No products found.</p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Product Details</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id}>
                    <td>
                      <div className="product-cell">
                        <img src={p.defaultImage} alt={p.name} />
                        <div>
                          <div className="product-name">{p.name}</div>
                          <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                            <span className="badge category">{p.category}</span>
                            <span className={`badge ${p.quantity === 0 ? "out" : "active"}`}>
                              {p.quantity === 0 ? "Out of Stock" : "In Stock"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontWeight: 600 }}>₹{p.price}</td>
                    <td style={{ fontWeight: 600 }}>{p.quantity}</td>
                    <td>
                      <button className="edit-btn" onClick={() => navigate(`/admin-dashboard/edit-product/${p._id}`)}>Edit</button>
                      <button className="delete-btn" onClick={() => handleDelete(p._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminProducts;