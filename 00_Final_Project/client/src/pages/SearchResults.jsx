import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  addToWishlist,
  increaseQuantity,
} from "../cartSlice";
import { FaRegHeart } from "react-icons/fa6";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SearchResults = () => {
  const [products, setProducts] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.mycart.cart);

  const query = new URLSearchParams(location.search).get("q");

  useEffect(() => {
    if (!query) return;

    const fetchResults = async () => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKENDURL}/product/search?q=${query}`
      );
      setProducts(data);
    };

    fetchResults();
  }, [query]);

  return (
    <>
      {/* ================= SAME CSS AS HOME ================= */}
      <style>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          background: #f4f6f8;
        }

        .page {
          width: 100%;
          min-height: 85vh;
        }

        /* ===== SECTION HEADER ===== */
        .section-header {
          width: 100%;
          padding: 20px 20px 10px;
          text-align: center;
        }

        .section-header h2 {
          font-size: 22px;
          font-weight: bold;
          color: #222;
          margin-bottom: 4px;
          transform: skewX(-6deg);
          text-shadow:
            1px 1px 0 rgba(0,0,0,0.25),
            2px 3px 6px rgba(0,0,0,0.35);
          letter-spacing: 0.6px;
        }

        .section-header p {
          font-size: 14px;
          color: #666;
          transform: skewX(-6deg);
        }

        /* ===== GRID ===== */
        .products-container {
          width: 100%;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 32px;
          padding: 0px 80px;
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
          font-size: 17px;
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

        .price {
          font-size: 18px;
          font-weight: 700;
          color: #4b0082;
        }

        .mrp {
          font-size: 14px;
          color: #999;
          text-decoration: line-through;
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

        .empty {
          text-align: center;
          padding: 80px;
          font-size: 18px;
          color: #666;
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
      <div className="page">
        <div className="section-header">
          <h2>Search Results</h2>
          <p>
            Showing results for <b>{query}</b>
          </p>
        </div>

        {products.length === 0 ? (
          <div className="empty">No products found</div>
        ) : (
          <div className="products-container">
            {products.map((item) => {
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
                        style={{ fontSize: 20, marginLeft: "auto" }}
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
        )}
      </div>

      <ToastContainer position="top-right" autoClose={1500} />
    </>
  );
};

export default SearchResults;
