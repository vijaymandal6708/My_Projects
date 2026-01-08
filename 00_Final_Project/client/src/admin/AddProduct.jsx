import { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddProduct = () => {
  const [input, setInput] = useState({});
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  const handleInput = (e) => {
    setInput((values) => ({
      ...values,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImage = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);

    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  /* ❌ REMOVE IMAGE (UI ONLY) */
  const handleRemoveImage = (index) => {
    const updatedImages = [...images];
    const updatedPreviews = [...previewImages];

    updatedImages.splice(index, 1);
    updatedPreviews.splice(index, 1);

    setImages(updatedImages);
    setPreviewImages(updatedPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const toastId = toast.loading("Adding product...");

    try {
      const formData = new FormData();

      for (let key in input) {
        formData.append(key, input[key]);
      }

      for (let i = 0; i < images.length; i++) {
        formData.append("images", images[i]);
      }

      const admintoken = localStorage.getItem("admintoken");

      await axios.post(
        `${import.meta.env.VITE_BACKENDURL}/admin/add-product`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${admintoken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.update(toastId, {
        render: "Product added successfully ✅",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });

      setImages([]);
      setPreviewImages([]);

    } catch (error) {
      toast.update(toastId, {
        render: error.response?.data?.msg || "Add product failed ❌",
        type: "error",
        isLoading: false,
        autoClose: 2500,
      });
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} />

      <style>{`
        :root {
          --primary: #5b21b6;
          --bg: #f6f7fb;
          --card: #ffffff;
          --text: #1f2937;
          --border: #e5e7eb;
        }

        .add-product-page {
          background: var(--bg);
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 40px;
        }

        .page-title {
          font-size: 26px;
          font-weight: 600;
          margin-bottom: 45px;
          color: var(--text);
          text-align: center;
        }

        .product-form {
          background: var(--card);
          padding: 50px;
          border-radius: 16px;
          max-width: 900px;
          width: 100%;
          box-shadow: 0 12px 30px rgba(0,0,0,0.08);
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-group label {
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 6px;
          color: var(--text);
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          padding: 12px;
          border-radius: 10px;
          border: 1px solid var(--border);
          font-size: 14px;
          outline: none;
        }

        .file-input {
          text-align: center;
          cursor: pointer;
        }

        .file-input::file-selector-button {
          padding: 10px 16px;
          border-radius: 8px;
          border: none;
          background: var(--primary);
          color: #fff;
          cursor: pointer;
          margin-right: 12px;
        }

        .full-width {
          margin-top: 20px;
        }

        .submit-btn {
          margin-top: 30px;
          background: var(--primary);
          color: #fff;
          border: none;
          padding: 14px 28px;
          font-size: 15px;
          font-weight: 500;
          border-radius: 12px;
          cursor: pointer;
          width: 100%;
        }

        /* ===== IMAGE PREVIEW ===== */
        .image-preview-grid {
          margin-top: 18px;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
          gap: 8px;
        }

        .image-card {
          position: relative;
          background: #f1f1f1;
          border-radius: 12px;
          padding: 10px;
          height: 80px;
          width: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .image-card img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }

        /* ❌ CROSS BUTTON */
        .remove-btn {
          position: absolute;
          top: 6px;
          right: 6px;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          border: none;
          background: rgba(0,0,0,0.65);
          color: white;
          font-size: 14px;
          cursor: pointer;
        }

        .remove-btn:hover {
          background: red;
        }
      `}</style>

      <div className="add-product-page">
        <form className="product-form" onSubmit={handleSubmit}>
          <h1 className="page-title">Add New Product</h1>

          <div className="form-grid">
            <div className="form-group">
              <label>Product Name</label>
              <input name="name" onChange={handleInput} required />
            </div>

            <div className="form-group">
              <label>Category</label>
              <select name="category" onChange={handleInput} required>
                <option value="">Select category</option>
                <option>Smartphone</option>
                <option>Laptop</option>
                <option>Speaker</option>
                <option>Camera</option>
              </select>
            </div>

            <div className="form-group">
              <label>Price (₹)</label>
              <input type="number" name="price" onChange={handleInput} required />
            </div>

            <div className="form-group">
              <label>MRP (₹)</label>
              <input type="number" name="MRP" onChange={handleInput} required />
            </div>

            <div className="form-group">
              <label>Quantity</label>
              <input type="number" name="quantity" onChange={handleInput} required />
            </div>

            <div className="form-group">
              <label>Initial star rating</label>
              <select name="starRating" onChange={handleInput} required>
                <option value="">Select rating</option>
                <option value="0">0 Star</option>
                <option value="0.5">0.5 Star</option>
                <option value="1">1 Star</option>
                <option value="1.5">1.5 Star</option>
                <option value="2">2 Star</option>
                <option value="2.5">2.5 Star</option>
                <option value="3">3 Star</option>
                <option value="3.5">3.5 Star</option>
                <option value="4">4 Star</option>
                <option value="4.5">4.5 Star</option>
                <option value="5">5 Star</option>
              </select>
            </div>
          </div>

          <div className="form-group full-width">
            <label>Description</label>
            <textarea name="description" rows="3" onChange={handleInput}></textarea>
          </div>

          <div className="form-group full-width">
            <label>Product Images</label>
            <input
              type="file"
              multiple
              accept="image/*"
              className="file-input"
              onChange={handleImage}
            />

            <div className="image-preview-grid">
              {previewImages.map((img, index) => (
                <div key={index} className="image-card">
                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() => handleRemoveImage(index)}
                  >
                    ✕
                  </button>
                  <img src={img} alt="preview" />
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className="submit-btn">
            Add Product
          </button>
        </form>
      </div>
    </>
  );
};

export default AddProduct;
