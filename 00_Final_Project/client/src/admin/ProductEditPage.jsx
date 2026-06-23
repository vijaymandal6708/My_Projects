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
    <div className="page">
      <ToastContainer position="top-right" />
      <style>{`
        .page { max-width: 900px; margin: auto; padding: 40px 20px; }
        .card { background: #fff; padding: 30px; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
        .form-group { margin-bottom: 20px; }
        label { display: block; font-weight: 600; margin-bottom: 8px; font-size: 14px; }
        input, select, textarea { width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 8px; }
        
        .images-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 12px; margin-top: 10px; }
        .image-box { 
            position: relative; background: #f9f9f9; border-radius: 8px; border: 1px solid #eee;
            aspect-ratio: 1/1; display: flex; align-items: center; justify-content: center; overflow: hidden; 
        }
        .image-box img { max-width: 100%; max-height: 100%; object-fit: contain; }
        
        .delete-img { 
            position: absolute; top: 5px; right: 5px; background: rgba(0,0,0,0.5); color: white; 
            border: none; border-radius: 50%; width: 20px; height: 20px; cursor: pointer; font-size: 10px;
        }
        .btn { padding: 12px 24px; border-radius: 8px; border: none; cursor: pointer; font-weight: 600; }
        .save { background: #0f172a; color: #fff; }
      `}</style>

      <h2 style={{ textAlign: 'center', marginBottom: 30 }}>Edit Product</h2>
      <form className="card" onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
        <div className="form-group">
          <label>Product Name</label>
          <input value={product.name} onChange={(e) => setProduct({...product, name: e.target.value})} required />
        </div>

        <div className="form-group">
          <label>Product Images</label>
          <div className="images-grid">
            {product.images.map((img) => (
              <div key={img} className="image-box">
                <img src={img} alt="Product" />
                <button type="button" className="delete-img" onClick={() => {
                  setDeletedImages([...deletedImages, img]);
                  setProduct({...product, images: product.images.filter(i => i !== img)});
                }}>✕</button>
              </div>
            ))}
          </div>
          <input style={{marginTop: 15}} type="file" multiple accept="image/*" onChange={(e) => setNewImages([...e.target.files])} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
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
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea rows="4" value={product.description} onChange={(e) => setProduct({...product, description: e.target.value})} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 15 }}>
          <button type="button" className="btn" onClick={() => navigate(-1)}>Cancel</button>
          <button type="submit" className="btn save" disabled={saving}>{saving ? "Saving..." : "Save Changes"}</button>
        </div>
      </form>
    </div>
  );
};

export default AdminEditProduct;