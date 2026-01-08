import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, increaseQuantity } from "../cartSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const VISIBLE_THUMBS = 5;

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.mycart.cart);

  const [data, setData] = useState({});
  const [activeImage, setActiveImage] = useState("");
  const [hover, setHover] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [thumbStart, setThumbStart] = useState(0);

  /* ===== FETCH PRODUCT ===== */
  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKENDURL}/product/${id}`
      );
      setData(res.data);
      setActiveImage(res.data.defaultImage || res.data.images?.[0]);
    };

    fetchProduct();
  }, [id]);

  /* ===== ZOOM MOVE ===== */
  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  const images = data.images || [];
  const canPrev = thumbStart > 0;
  const canNext = thumbStart + VISIBLE_THUMBS < images.length;
  const starRating = Number(data.starRating) || 0;

  /* ===== ADD TO CART ===== */
  const handleAddToCart = () => {
    const existingItem = cart.find((item) => item.id === data._id);

    if (existingItem) {
      dispatch(increaseQuantity(existingItem));
      toast.info("Item quantity increased 🛒", { autoClose: 1200 });
    } else {
      dispatch(
        addToCart({
          id: data._id,
          name: data.name,
          category: data.category,
          price: data.price,
          image: data.defaultImage,
          qnty: 1,
        })
      );
      toast.success("Added to cart 🛒", { autoClose: 1200 });
    }
  };

  /* ===== BUY NOW (SAME LOGIC + REDIRECT) ===== */
  const handleBuyNow = () => {
    const existingItem = cart.find((item) => item.id === data._id);

    if (existingItem) {
      dispatch(increaseQuantity(existingItem));
    } else {
      dispatch(
        addToCart({
          id: data._id,
          name: data.name,
          price: data.price,
          image: data.defaultImage,
          qnty: 1,
        })
      );
    }

    toast.success("Proceeding to checkout 🧾", { autoClose: 1000 });

    setTimeout(() => {
      navigate("/checkout");
    }, 600);
  };

  return (
    <>
      {/* ================= CSS ================= */}
      <style>{`
        body {
          background: #f4f6f8;
        }

        .product-page {
          width: 100%;
          padding: 40px 80px;
        }

        .product-container {
          background: #fff;
          border-radius: 28px;
          padding: 50px;
          display: flex;
          gap: 60px;
        }

        .image-zone {
          display: flex;
          gap: 38px;
          position: relative;
        }

        .thumb-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }

        .arrow-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 1px solid #ddd;
          background: #ffffff;
          cursor: pointer;
          font-size: 18px;
        }

        .thumbs {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .thumbs img {
          width: 55px;
          height: 55px;
          object-fit: cover;
          border-radius: 14px;
          border: 1px solid #ddd;
          cursor: pointer;
          padding: 7px;
          background: #fff;
        }

        .thumbs img.active {
          border: 2px solid #5f23c6;
        }

        .image-box {
          width: 420px;
          height: 420px;
          background: #f2f3f5;
          border-radius: 26px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: zoom-in;
          overflow: hidden;
        }

        .image-box img {
          max-width: 90%;
          max-height: 90%;
          object-fit: contain;
        }

        .zoom-overlay {
          position: absolute;
          top: -60px;
          left: 618px;
          width: 645px;
          height: 530px;
          background-repeat: no-repeat;
          background-size: 160%;
          background-color: #fff;
          border-radius: 26px;
          border: 1px solid #ddd;
          box-shadow: 0 35px 80px rgba(0,0,0,0.35);
          z-index: 999;
        }

        .details {
          flex: 1;
          padding-left: 20px;
        }

        .details h1 {
          font-size: 34px;
          font-weight: 700;
          margin-bottom: 12px;
        }

        .rating {
          color: #f5b301;
          font-size: 18px;
          margin-bottom: 14px;
        }

        .rating span {
          color: #333;
          font-size: 14px;
          margin-left: 10px;
        }

        .price {
          display: flex;
          gap: 18px;
          align-items: center;
          margin-bottom: 18px;
        }

        .price .sell {
          font-size: 26px;
          font-weight: 700;
          color: #5f23c6;
        }

        .price .mrp {
          text-decoration: line-through;
          color: #777;
        }

        .offer {
          color: #1a7f37;
          font-weight: 600;
          font-size: 14px;
        }

        .desc {
          font-size: 17px;
          color: #444;
          margin-bottom: 20px;
          line-height: 1.6;
        }

        .meta {
          font-size: 14px;
          color: #2f7a42;
          margin-bottom: 8px;
          font-weight: 600;
        }

        .meta-muted {
          font-size: 14px;
          color: #666;
          margin-bottom: 26px;
        }

        .actions {
          display: flex;
          gap: 22px;
        }

        .btn {
          flex: 1;
          height: 48px;
          border-radius: 16px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.25s ease, transform 0.15s ease, box-shadow 0.25s ease;
        }

        .cart {
          background: #2e0b6a;
          color: #fff;
          border: none;
        }

        .buy {
          background: #0f172a;
          color: #fff;
          border: none;
        }

        .btn.cart:hover {
          background: #3b1391;
          box-shadow: 0 10px 25px rgba(46, 11, 106, 0.35);
          transform: translateY(-1px);
          color: white;
        }

        .btn.buy:hover {
          background: #1e293b;
          box-shadow: 0 10px 25px rgba(15, 23, 42, 0.4);
          transform: translateY(-1px);
          color: white;
        }
      `}</style>

      {/* ================= UI ================= */}
      <div className="product-page">
        <div className="product-container">
          {/* IMAGE SECTION */}
          <div className="image-zone">
            <div className="thumb-wrapper">
              <button className="arrow-btn" onClick={() => canPrev && setThumbStart((p) => p - 1)}>
                ‹
              </button>

              <div className="thumbs">
                {images.slice(thumbStart, thumbStart + VISIBLE_THUMBS).map((img, i) => {
                  const remaining = images.length - (thumbStart + VISIBLE_THUMBS);
                  const isLast = i === VISIBLE_THUMBS - 1;

                  return (
                    <div key={thumbStart + i} style={{ position: "relative" }}>
                      <img
                        src={img}
                        className={activeImage === img ? "active" : ""}
                        onClick={() => setActiveImage(img)}
                      />
                      {isLast && remaining > 0 && (
                        <div
                          style={{
                            position: "absolute",
                            inset: 0,
                            background: "rgba(0,0,0,0.55)",
                            borderRadius: "14px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#fff",
                            fontSize: "13px",
                            fontWeight: "600",
                            pointerEvents: "none",
                          }}
                        >
                          +{remaining} more
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <button className="arrow-btn" onClick={() => canNext && setThumbStart((p) => p + 1)}>
                ›
              </button>
            </div>

            <div
              className="image-box"
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
              onMouseMove={handleMove}
            >
              {activeImage && <img src={activeImage} alt={data.name} />}
            </div>

            {hover && activeImage && (
              <div
                className="zoom-overlay"
                style={{
                  backgroundImage: `url(${activeImage})`,
                  backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                }}
              />
            )}
          </div>

          {/* DETAILS */}
          <div className="details">
            <h1>{data.name}</h1>

            <div className="rating">
              {"★".repeat(Math.floor(starRating))}
              {"☆".repeat(5 - Math.floor(starRating))}
              <span>{starRating} stars</span>
            </div>

            <div className="price">
              <span className="sell">₹{data.price}</span>
              <span className="mrp">₹{data.MRP}</span>
              <span className="offer">30% OFF</span>
            </div>

            <p className="desc">{data.description}</p>

            <p className="meta">✔ In stock • Free delivery • Easy returns</p>
            <p className="meta-muted">🛡 1-year warranty • Secure payments • 7-day replacement</p>

            <div className="actions">
              <button className="btn cart" onClick={handleAddToCart}>
                Add to Cart
              </button>
              <button className="btn buy" onClick={handleBuyNow}>
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={1500} />
    </>
  );
};

export default ProductDetail;
