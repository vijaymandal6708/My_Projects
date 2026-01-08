import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  /* ================= FETCH PRODUCTS ================= */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const admintoken = localStorage.getItem("admintoken");

        const res = await axios.get(
          "http://localhost:8000/admin/products",
          {
            headers: {
              Authorization: `Bearer ${admintoken}`,
            },
          }
        );

        setProducts(res.data.products);
      } catch (err) {
        console.error("Failed to load products", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  /* ================= DELETE CONFIRM TOAST ================= */
const handleDelete = async (id) => {
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

              // 🔄 Loader toast
              const toastId = toast.loading("Deleting product...");

              try {
                const admintoken = localStorage.getItem("admintoken");

                await axios.delete(
                  `http://localhost:8000/admin/delete-product/${id}`,
                  {
                    headers: {
                      Authorization: `Bearer ${admintoken}`,
                    },
                  }
                );

                // ✅ Update toast to success
                toast.update(toastId, {
                  render: "Product deleted successfully ✅",
                  type: "success",
                  isLoading: false,
                  autoClose: 2000,
                });

                // ✅ Remove from UI
                setProducts((prev) =>
                  prev.filter((p) => p._id !== id)
                );
              } catch (err) {
                toast.update(toastId, {
                  render: "Failed to delete product ❌",
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
    {
      autoClose: false,
      closeOnClick: false,
      draggable: false,
    }
  );
};

  /* ================= DELETE API ================= */
  const confirmDeleteProduct = async (id) => {
    try {
      const admintoken = localStorage.getItem("admintoken");

      await axios.delete(
        `http://localhost:8000/admin/delete-product/${id}`,
        {
          headers: {
            Authorization: `Bearer ${admintoken}`,
          },
        }
      );

      setProducts((prev) => prev.filter((p) => p._id !== id));

      toast.success("Product deleted successfully 🗑️");
    } catch (err) {
      console.error("Delete product failed", err);
      toast.error("Failed to delete product ❌");
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      <style>{`
        * {
          box-sizing: border-box;
          font-family: "Inter", system-ui, sans-serif;
        }

        body {
          background: #f4f6fb;
        }

        .page {
          max-width: 1400px;
          margin: auto;
          padding: 0px 30px 20px;
        }

        .title {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 30px;
          text-align: center;
        }

        .table-container {
          background: #fff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.08);
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        thead {
          background: #0f172a;
          color: #fff;
        }

        th {
          padding: 16px 18px;
          font-size: 14px;
          font-weight: 600;
          text-align: left;
        }

        .product-text-heading {
          padding-left: 130px;
        }

        td {
          padding: 20px 18px;
          vertical-align: middle;
          border-bottom: 1px solid #eee;
          font-size: 14px;
        }

        tbody tr:hover {
          background: #f9fafb;
        }

        .product-cell {
          display: flex;
          align-items: center;
          gap: 26px;
          margin-left: 20px;
        }

        .product-cell img {
          width: 60px;
          height: 60px;
          object-fit: contain;
          border-radius: 10px;
          background: #f1f1f1;
          padding: 6px;
        }

        .product-info {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .product-name {
          font-size: 16px;
          font-weight: 600;
          color: #111827;
        }

        .sku {
          font-size: 12px;
          color: #6b7280;
        }

        .meta-row {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .badge {
          padding: 4px 10px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 600;
        }

        .category {
          background: #e0e7ff;
          color: #3730a3;
        }

        .active {
          background: #dcfce7;
          color: #166534;
        }

        .out {
          background: #fee2e2;
          color: #b91c1c;
        }

        .price {
          font-weight: 600;
        }

        .stock {
          font-weight: 600;
        }

        .action-buttons {
          display: flex;
          gap: 10px;
        }

        .edit-btn {
          padding: 8px 14px;
          border-radius: 8px;
          border: none;
          background: #0f172a;
          color: #fff;
          font-size: 13px;
          cursor: pointer;
        }

        .edit-btn:hover {
          background: #1e293b;
        }

        .delete-btn {
          padding: 8px 14px;
          border-radius: 8px;
          border: none;
          background: #dc2626;
          color: #fff;
          font-size: 13px;
          cursor: pointer;
        }

        .delete-btn:hover {
          background: #b91c1c;
        }

        .empty {
          text-align: center;
          padding: 100px;
          color: #555;
          font-size: 16px;
        }
      `}</style>

      <div className="page">
        <h2 className="title">Products & Stocks</h2>

        {loading ? (
          <p className="empty">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="empty">No products found</p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th className="product-text-heading">Product</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {products.map((p) => (
                  <tr key={p._id}>
                    <td>
                      <div className="product-cell">
                        <img src={p.defaultImage} alt={p.name} />
                        <div className="product-info">
                          <div className="product-name">{p.name}</div>
                          <div className="sku">Product id : {p._id}</div>
                          <div className="meta-row">
                            <span className="badge category">{p.category}</span>
                            <span
                              className={`badge ${
                                p.quantity === 0 ? "out" : "active"
                              }`}
                            >
                              {p.quantity === 0 ? "Out of Stock" : "Active"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="price">₹{p.price}</td>
                    <td className="stock">{p.quantity}</td>

                    <td>
                      <div className="action-buttons">
                        <button
                          className="edit-btn"
                          onClick={() =>
                            navigate(
                              `/admin-dashboard/edit-product/${p._id}`
                            )
                          }
                        >
                          Edit
                        </button>

                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(p._id)}
                        >
                          Delete
                        </button>
                      </div>
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
