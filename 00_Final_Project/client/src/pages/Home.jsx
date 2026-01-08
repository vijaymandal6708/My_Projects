import React, { useEffect, useState } from "react";
import Slider from "../components/Slider";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  addToWishlist,
  increaseQuantity,
} from "../cartSlice";
import { FaRegHeart } from "react-icons/fa6";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Home = () => {
  const [mydata, setMydata] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector((state) => state.mycart.cart);

  const loadData = async () => {
    const { data } = await axios.get(
      `${import.meta.env.VITE_BACKENDURL}/product/product-display`
    );
    setMydata(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <>
      {/* ================= CSS ================= */}
      <style>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin-top: 165px;
          background: #f4f6f8;
        }

        .home-page {
          width: 100%;
        }

        /* ===== GRID ===== */
        .products-container {
          width: 100%;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 32px;
          padding: 60px 80px;
        }

        /* ===== CARD ===== */
        .product-card {
          background: #fff;
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 12px 30px rgba(0,0,0,0.08);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          display: flex;
          flex-direction: column;
          width: 320px;
          cursor: pointer;
        }

        .product-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.18);
        }

        /* ===== IMAGE ===== */
        .product-image {
          height: 260px;
          background: linear-gradient(145deg, #eef1f5, #ffffff);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .product-image img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          transition: transform 0.3s ease;
        }

        .product-card:hover img {
          transform: scale(1.06);
        }

        /* ===== INFO ===== */
        .product-info {
          padding: 8px 30px 25px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .product-info h4 {
          font-size: 18px;
          font-weight: 600;
          color: #222;
          line-height: 1.4;
          height: calc(1.4em * 2);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          margin-bottom: 6px;
        }

        .rating {
          font-size: 14px;
          color: #f5b301;
          margin-bottom: 6px;
        }

        .rating span {
          color: #666;
          font-size: 12px;
          margin-left: 6px;
        }

        .price-box {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 18px;
        }

        .mrp {
          font-size: 14px;
          color: #999;
          text-decoration: line-through;
        }

        .price {
          font-size: 18px;
          font-weight: 700;
          color: #4b0082;
        }

        .offer {
          font-size: 12px;
        }

        .add-cart-btn {
          width: 100%;
          background: linear-gradient(135deg, #020718ff, #131a3bff);
          border: none;
          color: white;
          padding: 10px 0;
          border-radius: 16px;
          cursor: pointer;
          font-size: 15px;
          font-weight: 600;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        .add-cart-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 22px rgba(75,0,130,0.45);
        }

        .section-header {
          width: 100%;
          padding: 40px 80px 10px;
          text-align: center;
          margin-bottom: -40px;
        }

        .section-header h2 {
          font-size: 28px;
          font-weight: bold;
          color: #222;
          margin-bottom: 4px;
          /* subtle tilt (less than italic) */
          transform: skewX(-6deg);

          /* 👇 stronger, visible shadow */
           text-shadow:
          1px 1px 0 rgba(0,0,0,0.25),
          2px 3px 6px rgba(0,0,0,0.35);

          letter-spacing: 0.6px;
        }

        .section-header p {
          font-size: 14px;
          color: #666;
          /* subtle tilt (less than italic) */
          transform: skewX(-6deg);
        }

        @media (max-width: 1200px) {
          .products-container {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 900px) {
          .products-container {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 600px) {
          .products-container {
            grid-template-columns: 1fr;
            padding: 30px 20px;
          }
        }
      `}</style>

      {/* ================= UI ================= */}
      <div className="home-page">
        <Slider />

        <div className="section-header">
          <h2>Featured Products</h2>
          <p>Top picks hand-selected for you</p>
        </div>

        <div className="products-container">
          {mydata.map((item) => {
            const existingItem = cart.find(
              (cartItem) => cartItem.id === item._id
            );

            return (
              <div
                className="product-card"
                key={item._id}
                onClick={() => navigate(`/product/${item._id}`)}
              >
                <div className="product-image">
                  <img src={item.defaultImage} alt={item.name} />
                </div>

                <div className="product-info">
                  <h4>{item.name}</h4>

                  <div className="rating">
                    {"★".repeat(Math.floor(item.starRating || 0))}
                    {"☆".repeat(5 - Math.floor(item.starRating || 0))}
                    <span>{item.starRating || 0} stars</span>
                  </div>

                  <div className="price-box">
                    <span className="price">₹{item.price}</span>
                    <span className="mrp">₹{item.MRP}</span>
                    <span className="offer">30% off</span>

                    <FaRegHeart
                      style={{
                        fontSize: "20px",
                        marginLeft: "30px",
                        cursor: "pointer",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch(addToWishlist({ ...item, qnty: 1 }));
                        toast.info("Added to wishlist ❤️", {
                          autoClose: 1200,
                        });
                      }}
                    />
                  </div>

                  <button
                    className="add-cart-btn"
                    onClick={(e) => {
                      e.stopPropagation();

                      if (existingItem) {
                        dispatch(increaseQuantity(existingItem));
                        toast.info("Quantity increased", {
                          autoClose: 1200,
                        });
                      } else {
                        dispatch(
                          addToCart({
                            id: item._id,
                            name: item.name,
                            description: item.description,
                            category: item.category,
                            price: item.price,
                            image: item.defaultImage,
                            qnty: 1,
                          })
                        );

                        toast.success("Item added to cart", {
                          autoClose: 1200,
                        });
                      }
                    }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={1500} />
    </>
  );
};

export default Home;
