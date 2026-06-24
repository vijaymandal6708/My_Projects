import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // With this (much safer and stable):
  const currentUser = useSelector((state) => state.auth.user);
  const isDemoAdmin = currentUser?.isDemo === true;
  useEffect(() => {
    console.log("Is Demo Admin Mode Active:", isDemoAdmin);
  }, [isDemoAdmin]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKENDURL}/admin/products`,
          { withCredentials: true },
        );
        setProducts(res.data.products);
      } catch (err) {
        if (err.response?.status === 401) navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [navigate]);

  const handleDelete = async (id) => {
    if (isDemoAdmin) {
      toast.error("Demo Mode: Deletion is disabled.");
      return;
    }

    toast.warn(
      ({ closeToast }) => (
        <div>
          <p style={{ marginBottom: "10px", fontWeight: 600 }}>
            Are you sure you want to delete this product?
          </p>
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              style={{
                background: "#dc2626",
                color: "#fff",
                border: "none",
                padding: "6px 12px",
                borderRadius: "6px",
                cursor: "pointer",
              }}
              onClick={async () => {
                closeToast();
                const toastId = toast.loading("Deleting...");
                try {
                  await axios.delete(
                    `${import.meta.env.VITE_BACKENDURL}/admin/delete-product/${id}`,
                    { withCredentials: true },
                  );
                  toast.update(toastId, {
                    render: "Product deleted ✅",
                    type: "success",
                    isLoading: false,
                    autoClose: 2000,
                  });
                  setProducts((prev) => prev.filter((p) => p._id !== id));
                } catch (err) {
                  toast.update(toastId, {
                    render: "Failed to delete ❌",
                    type: "error",
                    isLoading: false,
                    autoClose: 2500,
                  });
                }
              }}
            >
              Yes, Delete
            </button>
            <button
              style={{
                background: "#e5e7eb",
                border: "none",
                padding: "6px 12px",
                borderRadius: "6px",
                cursor: "pointer",
              }}
              onClick={closeToast}
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { autoClose: false, closeOnClick: false, draggable: false },
    );
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <style>{`
        .admin-page-container { width: 100%; max-width: 1100px; margin: auto; padding: 10px 24px 40px; }
        .admin-page-header { text-align: center; margin-top: 24px; margin-bottom: 36px; }
        .page-title { font-size: 26px; font-weight: 700; color: #0f172a; margin: 0 0 6px 0; }
        .page-subtitle { font-size: 14px; color: #64748b; margin: 0; }
        .table-container { background: #fff; border-radius: 14px; overflow: hidden; border: 1px solid #e2e8f0; }
        table { width: 100%; border-collapse: collapse; }
        th { padding: 16px 20px; font-size: 12px; font-weight: 700; text-transform: uppercase; color: #475569; text-align: left; background: #f8fafc; }
        td { padding: 16px 20px; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
        .product-cell { display: flex; align-items: center; gap: 15px; }
        .product-cell img { width: 50px; height: 50px; object-fit: contain; border-radius: 8px; border: 1px solid #e2e8f0; }
        .badge { padding: 4px 10px; border-radius: 999px; font-size: 11px; font-weight: 600; }
        .edit-btn, .delete-btn { padding: 6px 12px; border-radius: 6px; border: none; font-size: 12px; cursor: pointer; }
        .edit-btn { background: #0f172a; color: #fff; }
        .delete-btn { background: #ef4444; color: #fff; margin-left: 8px; }
        .disabled-btn { background: #cbd5e1 !important; cursor: not-allowed !important; opacity: 0.7; }
        .empty { text-align: center; padding: 60px; color: #64748b; }
      `}</style>

      <div className="admin-page-container">
        <div className="admin-page-header">
          <h2 className="page-title">Products & Stocks List</h2>
          <p className="page-subtitle">
            Manage your digital inventory, pricing, and stock metrics
          </p>
          {isDemoAdmin && (
            <p
              style={{
                color: "#ef4444",
                fontSize: "12px",
                marginTop: "10px",
                fontWeight: "bold",
              }}
            >
              ⚠️ Demo Mode Active: Edit & Delete are disabled.
            </p>
          )}
        </div>

        {loading ? (
          <p className="empty">Loading inventory...</p>
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
                          <div style={{ fontWeight: 600 }}>{p.name}</div>
                          <span
                            className="badge"
                            style={{ background: "#e0e7ff", color: "#3730a3" }}
                          >
                            {p.category}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>₹{p.price}</td>
                    <td>{p.quantity}</td>
                    <td>
                      <button
                        className={`edit-btn ${isDemoAdmin ? "disabled-btn" : ""}`}
                        disabled={isDemoAdmin}
                        onClick={() =>
                          navigate(`/admin-dashboard/edit-product/${p._id}`)
                        }
                      >
                        Edit
                      </button>
                      <button
                        className={`delete-btn ${isDemoAdmin ? "disabled-btn" : ""}`}
                        disabled={isDemoAdmin}
                        onClick={() => handleDelete(p._id)}
                      >
                        Delete
                      </button>
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
