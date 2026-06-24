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
    name: "", category: "", price: "", quantity: "", description: "", images: []
  });
  const [deletedImages, setDeletedImages] = useState([]);
  const [newImages, setNewImages] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKENDURL}/admin/get-product-for-edit/${id}`, {
          withCredentials: true,
        });
        setProduct(res.data.product);
      } catch (err) {
        toast.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleUpdate = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", product.name);
      formData.append("category", product.category);
      formData.append("price", product.price);
      formData.append("quantity", product.quantity);
      formData.append("description", product.description);
      deletedImages.forEach((img) => formData.append("deletedImages", img));
      newImages.forEach((file) => formData.append("images", file));

      await axios.put(`${import.meta.env.VITE_BACKENDURL}/admin/update-product/${id}`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Product updated successfully ✅");
      setTimeout(() => navigate("/admin-dashboard/products"), 1500);
    } catch (err) {
      toast.error("Failed to update product ❌");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p style={{ padding: 40, textAlign: 'center' }}>Loading product data...</p>;

  return (
    <div className="add-product-page">
      <ToastContainer position="top-right" autoClose={2000} />
      
      {/* HEADER SECTION (Updated to match AddProduct) */}
      <div className="admin-page-header">
        <h1 className="page-title">Edit Product</h1>
        <p className="page-subtitle">Update the details of your inventory item.</p>
      </div>

      <form className="product-form" onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
        <div className="form-grid">
          <div className="form-group">
            <label>Product Name</label>
            <input value={product.name} onChange={(e) => setProduct({...product, name: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>Category</label>
            <select value={product.category} onChange={(e) => setProduct({...product, category: e.target.value})}>
              <option value="smartphones">Smartphones</option>
              <option value="laptops">Laptops</option>
              <option value="speakers">Speakers</option>
              <option value="cameras">Cameras</option>
            </select>
          </div>
          <div className="form-group">
            <label>Price (₹)</label>
            <input type="number" value={product.price} onChange={(e) => setProduct({...product, price: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>Quantity</label>
            <input type="number" value={product.quantity} onChange={(e) => setProduct({...product, quantity: e.target.value})} required />
          </div>
        </div>

        <div className="form-group full-width" style={{ marginTop: '20px' }}>
          <label>Product Images</label>
          <div className="image-preview-grid">
            {product.images.map((img) => (
              <div key={img} className="image-card">
                <button type="button" className="remove-btn" onClick={() => {
                  setDeletedImages([...deletedImages, img]);
                  setProduct({...product, images: product.images.filter(i => i !== img)});
                }}>✕</button>
                <img src={img} alt="Product" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
              </div>
            ))}
          </div>
          <input style={{marginTop: 15}} type="file" multiple accept="image/*" onChange={(e) => setNewImages([...e.target.files])} />
        </div>

        <div className="form-group full-width" style={{ marginTop: '20px' }}>
          <label>Description</label>
          <textarea rows="3" value={product.description} onChange={(e) => setProduct({...product, description: e.target.value})} />
        </div>

        <button type="submit" className="submit-btn" disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>

      {/* STYLES (Kept consistent with AddProduct) */}
      <style>{`
        .add-product-page { width: 100%; max-width: 900px; margin: auto; padding: 10px 24px 40px; }
        .admin-page-header { text-align: center; margin-top: 24px; margin-bottom: 32px; }
        .page-title { font-size: 26px; font-weight: 700; color: #0f172a; margin: 0 0 6px 0; }
        .page-subtitle { font-size: 14px; color: #64748b; margin: 0; }
        .product-form { background: #ffffff; padding: 32px 24px; border-radius: 12px; border: 1px solid #e2e8f0; }
        .form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
        .form-group { display: flex; flex-direction: column; gap: 6px; }
        .form-group label { font-size: 12px; font-weight: 600; text-transform: uppercase; color: #475569; }
        .form-group input, .form-group select, .form-group textarea { padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0; font-size: 14px; }
        .full-width { grid-column: span 2; }
        .submit-btn { margin-top: 24px; background: #0f172a; color: #fff; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; width: 100%; }
        .image-preview-grid { margin-top: 15px; display: flex; gap: 10px; flex-wrap: wrap; }
        .image-card { position: relative; border-radius: 8px; width: 80px; height: 80px; background: #f8fafc; border: 1px solid #e2e8f0; }
        .remove-btn { position: absolute; top: 4px; right: 4px; width: 20px; height: 20px; border-radius: 50%; border: none; background: rgba(0,0,0,0.5); color: white; cursor: pointer; }
      `}</style>
    </div>
  );
};

export default AdminEditProduct;