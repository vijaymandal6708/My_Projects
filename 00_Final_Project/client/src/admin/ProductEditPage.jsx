import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminEditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [product, setProduct] = useState({
    name: "",
    category: "",
    price: "",
    quantity: "",
    description: "",
    images: [],
    defaultImage: "",
  });

  const [deletedImages, setDeletedImages] = useState([]);
  const [newImages, setNewImages] = useState([]);

  /* ================= FETCH PRODUCT ================= */
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const admintoken = localStorage.getItem("admintoken");

        const res = await axios.get(
          `http://localhost:8000/admin/get-product-for-edit/${id}`,
          {
            headers: {
              Authorization: `Bearer ${admintoken}`,
            },
          }
        );

        setProduct(res.data.product);
      } catch (err) {
        toast.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  /* ================= REMOVE IMAGE (UI ONLY) ================= */
  const handleRemoveImage = (img) => {
    setDeletedImages((prev) => [...prev, img]);
    setProduct((prev) => ({
      ...prev,
      images: prev.images.filter((i) => i !== img),
    }));
  };

  const confirmSave = (e) => {
  e.preventDefault();

  toast(
    ({ closeToast }) => (
      <div>
        <p style={{ fontWeight: 600, marginBottom: 10 }}>
          Are you sure you want to save changes?
        </p>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={() => {
              closeToast();
              handleUpdate(); // 👈 ACTUAL SAVE
            }}
            style={{
              background: "#0f172a",
              color: "#fff",
              border: "none",
              padding: "6px 14px",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            Yes, Save
          </button>

          <button
            onClick={closeToast}
            style={{
              background: "#e5e7eb",
              border: "none",
              padding: "6px 14px",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    ),
    { autoClose: false }
  );
};


  /* ================= UPDATE PRODUCT ================= */
  const handleUpdate = async () => {
    setSaving(true);

    try {
      const admintoken = localStorage.getItem("admintoken");
      const formData = new FormData();

      formData.append("name", product.name);
      formData.append("category", product.category);
      formData.append("price", product.price);
      formData.append("quantity", product.quantity);
      formData.append("description", product.description);

      deletedImages.forEach((img) => {
        formData.append("deletedImages", img);
      });

      newImages.forEach((file) => {
        formData.append("images", file);
      });

      await axios.put(
        `http://localhost:8000/admin/update-product/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${admintoken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Product updated successfully ✅");
      setTimeout(() => navigate("/admin-dashboard/products"), 1500);
    } catch (err) {
      toast.error("Failed to update product ❌");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p style={{ padding: 40 }}>Loading product...</p>;
  }

  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} />

      <style>{`
        * { box-sizing: border-box; font-family: "Inter", system-ui, sans-serif; }
        body { background: #f4f6fb; }

        .page {
          max-width: 1000px;
          margin: auto;
          padding: 30px 20px 60px;
        }

        .title {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 25px;
          text-align: center;
        }

        .card {
          background: #fff;
          border-radius: 16px;
          padding: 30px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.08);
        }

        .form-group {
          margin-bottom: 20px;
        }

        label {
          font-size: 14px;
          font-weight: 600;
          display: block;
          margin-bottom: 6px;
        }

        input, textarea, select {
          width: 100%;
          padding: 10px 14px;
          border-radius: 10px;
          border: 1px solid #d1d5db;
          font-size: 14px;
        }

        textarea {
          min-height: 100px;
          resize: vertical;
        }

        .grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        /* ===== IMAGE SECTION ===== */
        .images-section {
          margin-top: 30px;
        }

        .images-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          gap: 16px;
          margin-top: 14px;
        }

        .image-box {
          position: relative;
          background: #f1f1f1;
          border-radius: 12px;
          padding: 8px;
        }

        .image-box img {
          width: 100%;
          height: 110px;
          object-fit: contain;
        }

        .delete-img {
          position: absolute;
          top: 6px;
          right: 6px;
          background: rgba(0,0,0,0.65);
          color: white;
          border: none;
          border-radius: 50%;
          width: 22px;
          height: 22px;
          font-size: 12px;
          cursor: pointer;
        }

        .delete-img:hover {
          background: red;
        }

        .actions {
          display: flex;
          justify-content: space-between;
          margin-top: 30px;
        }

        .btn {
          padding: 12px 22px;
          border-radius: 10px;
          border: none;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
        }

        .save {
          background: #0f172a;
          color: white;
        }

        .save:hover {
          background: #1e293b;
        }

        .cancel {
          background: #e5e7eb;
        }

        .cancel:hover {
          background: #d1d5db;
        }
      `}</style>

      <div className="page">
        <h2 className="title">Edit Product</h2>

        <form className="card" onSubmit={confirmSave}>
          <div className="form-group">
            <label>Product Name</label>
            <input
              value={product.name}
              onChange={(e) =>
                setProduct({ ...product, name: e.target.value })
              }
              required
            />
          </div>

          {/* ===== IMAGE SECTION ===== */}
          <div className="images-section">
            <label>Product Images</label>

            <div className="images-grid">
              {product.images.map((img) => (
                <div key={img} className="image-box">
                  <img src={img} alt="Product" />
                  <button
                    type="button"
                    className="delete-img"
                    onClick={() => handleRemoveImage(img)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <div className="form-group" style={{ marginTop: 20 }}>
              <label>Add More Images</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setNewImages([...e.target.files])}
              />
            </div>
          </div>


          <div className="grid">
            <div className="form-group">
              <label>Category</label>
              <select
                value={product.category}
                onChange={(e) =>
                  setProduct({ ...product, category: e.target.value })
                }
              >
                <option value="smartphones">Smartphones</option>
                <option value="laptops">Laptops</option>
                <option value="speakers">Speakers</option>
                <option value="cameras">Cameras</option>
              </select>
            </div>

            <div className="form-group">
              <label>Price (₹)</label>
              <input
                type="number"
                value={product.price}
                onChange={(e) =>
                  setProduct({ ...product, price: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="grid">
            <div className="form-group">
              <label>Stock Quantity</label>
              <input
                type="number"
                value={product.quantity}
                onChange={(e) =>
                  setProduct({ ...product, quantity: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={product.description}
              onChange={(e) =>
                setProduct({ ...product, description: e.target.value })
              }
            />
          </div>

          <div className="actions">
            <button
              type="button"
              className="btn cancel"
              onClick={() => navigate("/admin/products")}
            >
              Cancel
            </button>

            <button type="submit" className="btn save" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AdminEditProduct;
