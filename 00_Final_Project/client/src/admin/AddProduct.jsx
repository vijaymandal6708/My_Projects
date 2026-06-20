import { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const navigate = useNavigate();

  // 1. STATE MANAGEMENT
  const [productData, setProductData] = useState({});
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  // 2. INPUT HANDLERS
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    // Create temporary URLs for previewing images in the browser
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
  };

  // 3. SUBMISSION LOGIC
  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading("Uploading product...");

    try {
      // Use FormData to handle both text inputs and file uploads
      const formData = new FormData();
      Object.keys(productData).forEach((key) => formData.append(key, productData[key]));
      images.forEach((file) => formData.append("images", file));

      const token = localStorage.getItem("admintoken");
      await axios.post(`${import.meta.env.VITE_BACKENDURL}/admin/add-product`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data" 
        },
      });

      toast.update(loadingToast, { 
        render: "Product added successfully! ✅", 
        type: "success", 
        isLoading: false, 
        autoClose: 2000 
      });
      
      // Reset form
      setProductData({});
      setImages([]);
      setPreviewImages([]);
    } catch (error) {
      toast.update(loadingToast, { 
        render: error.response?.data?.msg || "Failed to add product ❌", 
        type: "error", 
        isLoading: false, 
        autoClose: 2500 
      });
    }
  };

  return (
    <div className="add-product-page">
      <ToastContainer position="top-right" autoClose={2000} />
      
      {/* HEADER SECTION */}
      <div className="admin-page-header">
        <h1 className="page-title">Add New Product</h1>
        <p className="page-subtitle">Add a new item to your store inventory.</p>
      </div>

      {/* FORM SECTION */}
      <form className="product-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          {/* Basic Info Fields */}
          <div className="form-group"><label>Product Name</label><input name="name" onChange={handleInputChange} required /></div>
          <div className="form-group">
            <label>Category</label>
            <select name="category" onChange={handleInputChange} required>
              <option value="">Select category</option>
              <option>Smartphone</option><option>Laptop</option><option>Speaker</option><option>Camera</option>
            </select>
          </div>
          <div className="form-group"><label>Price (₹)</label><input type="number" name="price" onChange={handleInputChange} required /></div>
          <div className="form-group"><label>MRP (₹)</label><input type="number" name="MRP" onChange={handleInputChange} required /></div>
          <div className="form-group"><label>Quantity</label><input type="number" name="quantity" onChange={handleInputChange} required /></div>
          <div className="form-group">
            <label>Star Rating</label>
            <select name="starRating" onChange={handleInputChange} required>
              <option value="">Select rating</option>
              {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} Star</option>)}
            </select>
          </div>
        </div>

        {/* Text Area & Image Upload */}
        <div className="form-group full-width" style={{ marginTop: '20px' }}>
          <label>Description</label>
          <textarea name="description" rows="3" onChange={handleInputChange} required></textarea>
        </div>

        <div className="form-group full-width" style={{ marginTop: '20px' }}>
          <label>Product Images</label>
          <input type="file" multiple accept="image/*" onChange={handleImageChange} />
          
          <div className="image-preview-grid">
            {previewImages.map((img, index) => (
              <div key={index} className="image-card">
                <button type="button" className="remove-btn" onClick={() => handleRemoveImage(index)}>✕</button>
                <img src={img} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
              </div>
            ))}
          </div>
        </div>

        <button type="submit" className="submit-btn">Publish to Inventory</button>
      </form>

      {/* STYLES (Kept as requested) */}
      <style>{`
        .add-product-page { width: 100%; max-width: 1100px; margin: auto; padding: 10px 24px 40px; }
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

export default AddProduct;