import { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const AddProduct = () => {
  const navigate = useNavigate();
  
  // Guard: Check demo status from Redux
  const currentUser = useSelector((state) => state.auth.user);
  const isDemoAdmin = currentUser?.isDemo === true;

  const [productData, setProductData] = useState({
    name: "", category: "", price: "", MRP: "", quantity: "", starRating: "", description: ""
  });
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  const handleInputChange = (e) => {
    if (isDemoAdmin) return;
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    if (isDemoAdmin) return;
    const files = Array.from(e.target.files);
    setImages(files);
    setPreviewImages(files.map((file) => URL.createObjectURL(file)));
  };

  const handleRemoveImage = (index) => {
    if (isDemoAdmin) return;
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isDemoAdmin) {
      toast.error("Demo Mode: Adding products is disabled.");
      return;
    }

    const loadingToast = toast.loading("Uploading product...");
    try {
      const formData = new FormData();
      Object.keys(productData).forEach((key) => formData.append(key, productData[key]));
      images.forEach((file) => formData.append("images", file));

      await axios.post(`${import.meta.env.VITE_BACKENDURL}/admin/add-product`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.update(loadingToast, { render: "Product added! ✅", type: "success", isLoading: false, autoClose: 2000 });
      setProductData({ name: "", category: "", price: "", MRP: "", quantity: "", starRating: "", description: "" });
      setImages([]);
      setPreviewImages([]);
    } catch (error) {
      toast.update(loadingToast, { render: "Failed to add product ❌", type: "error", isLoading: false, autoClose: 2500 });
    }
  };

  return (
    <div className="add-product-page">
      <ToastContainer position="top-right" autoClose={2000} />
      <div className="admin-page-header">
        <h1 className="page-title">Add New Product</h1>
        <p className="page-subtitle">Add a new item to your store inventory.</p>
        {isDemoAdmin && <p className="demo-alert">⚠️ Demo Mode Active: Edits are disabled.</p>}
      </div>

      <form className="product-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group"><label>Product Name</label><input name="name" value={productData.name} onChange={handleInputChange} disabled={isDemoAdmin} required /></div>
          <div className="form-group"><label>Category</label><select name="category" value={productData.category} onChange={handleInputChange} disabled={isDemoAdmin} required><option value="">Select</option><option>Smartphone</option><option>Laptop</option><option>Speaker</option><option>Camera</option></select></div>
          <div className="form-group"><label>Price (₹)</label><input type="number" name="price" value={productData.price} onChange={handleInputChange} disabled={isDemoAdmin} required /></div>
          <div className="form-group"><label>MRP (₹)</label><input type="number" name="MRP" value={productData.MRP} onChange={handleInputChange} disabled={isDemoAdmin} required /></div>
          <div className="form-group"><label>Quantity</label><input type="number" name="quantity" value={productData.quantity} onChange={handleInputChange} disabled={isDemoAdmin} required /></div>
          <div className="form-group"><label>Rating</label><select name="starRating" value={productData.starRating} onChange={handleInputChange} disabled={isDemoAdmin} required><option value="">Select</option>{[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} Star</option>)}</select></div>
        </div>
        <div className="form-group full-width" style={{ marginTop: '20px' }}>
          <label>Description</label>
          <textarea name="description" value={productData.description} rows="3" onChange={handleInputChange} disabled={isDemoAdmin} required></textarea>
        </div>
        <div className="form-group full-width" style={{ marginTop: '20px' }}>
          <label>Product Images</label>
          <input type="file" multiple accept="image/*" onChange={handleImageChange} disabled={isDemoAdmin} />
          <div className="image-preview-grid">
            {previewImages.map((img, index) => (
              <div key={index} className="image-card">
                {!isDemoAdmin && <button type="button" className="remove-btn" onClick={() => handleRemoveImage(index)}>✕</button>}
                <img src={img} alt="preview" />
              </div>
            ))}
          </div>
        </div>
        <button type="submit" className={`submit-btn ${isDemoAdmin ? "disabled-btn" : ""}`} disabled={isDemoAdmin}>
          {isDemoAdmin ? "Demo Mode Active" : "Publish to Inventory"}
        </button>
      </form>

      <style>{`
        .add-product-page { width: 100%; max-width: 1000px; margin: auto; padding: 10px 24px 40px; }
        .admin-page-header { text-align: center; margin: 24px 0 32px; }
        .page-title { font-size: 26px; font-weight: 700; color: #0f172a; margin: 0 0 6px 0; }
        .page-subtitle { font-size: 14px; color: #64748b; margin: 0; }
        .demo-alert { color: #ef4444; font-size: 12px; font-weight: bold; margin-top: 10px; }
        .product-form { background: #ffffff; padding: 32px 24px; border-radius: 12px; border: 1px solid #e2e8f0; }
        .form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
        .form-group { display: flex; flex-direction: column; gap: 6px; }
        .form-group label { font-size: 12px; font-weight: 600; text-transform: uppercase; color: #475569; }
        .form-group input, .form-group select, .form-group textarea { padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0; font-size: 14px; }
        .full-width { grid-column: span 2; }
        .submit-btn { margin-top: 24px; margin-left: 230px; background: #0f172a; color: #fff; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; width: 50%; }
        .disabled-btn { background: #cbd5e1 !important; cursor: not-allowed !important; }
        .image-preview-grid { margin-top: 15px; display: flex; gap: 10px; flex-wrap: wrap; }
        .image-card { position: relative; border-radius: 8px; width: 80px; height: 80px; background: #f8fafc; border: 1px solid #e2e8f0; }
        .image-card img { width: 100%; height: 100%; object-fit: cover; border-radius: 8px; }
        .remove-btn { position: absolute; top: 4px; right: 4px; width: 20px; height: 20px; border-radius: 50%; border: none; background: rgba(0,0,0,0.5); color: white; cursor: pointer; }
      `}</style>
    </div>
  );
};

export default AddProduct;