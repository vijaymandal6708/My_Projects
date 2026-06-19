import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  addToCart,
  increaseQuantity,
  removeFromWishlist,
} from "../cartSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Wishlist = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const wishlist = useSelector((state) => state.mycart.wishlist);
  const cart = useSelector((state) => state.mycart.cart);

  const moveToCart = (item) => {
    const itemId = item.id || item._id; 
    const existingItem = cart.find((c) => c.id === itemId);

    if (existingItem) {
      dispatch(increaseQuantity(existingItem));
      toast.info("Quantity increased in cart");
    } else {
      dispatch(
        addToCart({
          id: itemId,
          name: item.name,
          price: item.price,
          image: item.image,
          qnty: 1,
        })
      );
      toast.success("Moved to cart 🛒");
    }

    dispatch(removeFromWishlist(itemId));
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={1500} />

      <style>{`
        * {
          box-sizing: border-box;
          font-family: "Inter", system-ui, sans-serif;
        }

        html {
          scrollbar-gutter: stable;
        }

        body {
          background: #f4f6f8;
        }

        .wishlist-page {
          min-height: 72vh;
          max-width: 1000px;
          margin: auto;
          padding: 40px 20px 80px;
        }

        .wishlist-title {
          font-size: 26px;
          font-weight: 700;
          text-align: center;
          margin-bottom: 80px;
        }

        .empty-wishlist {
          text-align: center;
          background: #0c0243;
          height: 300px;
          color: white;
          padding: 115px;
          border-radius: 25px;
          font-size: 18px;
        }

        /* ===== BALANCED ITEM CARD (MATCHES CART GEOMETRY) ===== */
        .wishlist-item {
          background: #fff;
          border-radius: 16px;
          padding: 32px 40px;
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 20px;
          box-shadow: 0 6px 18px rgba(0,0,0,0.08);
        }

        .wishlist-item img {
          width: 90px;
          height: 90px;
          object-fit: contain;
          cursor: pointer;
        }

        .wishlist-info {
          flex: 1.5; /* Slightly larger share to hold text comfortably */
        }

        .wishlist-info h4 {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 6px;
        }

        .wishlist-info p {
          font-size: 13px;
          color: #777;
          margin-bottom: 6px;
        }

        .wishlist-info .price {
          font-weight: 600;
          font-size: 15px;
        }

        /* ===== THE BALANCE SPACER ===== 
           Matches the space occupied by quantity toggles in Cart */
        .wishlist-spacer {
          flex: 1; 
          display: flex;
          justify-content: center;
        }

        /* ===== ACTIONS REBALANCED ===== */
        .wishlist-actions {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 25px;
          min-width: 180px; /* Forces buttons to sit exactly like total/delete columns */
        }

        .btn-cart {
          height: 45px;
          padding: 0 24px;
          border-radius: 12px;
          border: none;
          background: #0c0243;
          color: white;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
          white-space: nowrap;
        }

        .btn-cart:hover {
          background: #1b0f6f;
        }

        .btn-remove {
          background: transparent;
          border: none;
          color: #c00;
          font-size: 18px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 768px) {
          .wishlist-spacer {
            display: none; /* Hide placeholder on tablets/mobile */
          }
        }

        @media (max-width: 600px) {
          .wishlist-item {
            flex-direction: column;
            align-items: flex-start;
            padding: 24px;
          }

          .wishlist-actions {
            width: 100%;
            justify-content: space-between;
            margin-top: 10px;
            min-width: 0;
          }
        }
      `}</style>

      {/* ===== JSX ===== */}
      <div className="wishlist-page">
        <h2 className="wishlist-title">My Wishlist</h2>

        {wishlist.length === 0 ? (
          <p className="empty-wishlist">
            Your wishlist is empty <span style={{ fontSize: "30px" }}>❤️</span>
          </p>
        ) : (
          <>
            {wishlist.map((item) => {
              const itemId = item.id || item._id;
              return (
                <div className="wishlist-item" key={itemId}>
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    onClick={() => navigate(`/product/${itemId}`)}
                  />

                  <div className="wishlist-info">
                    <h4>{item.name}</h4>
                    <p>{item.description || "No description available"}</p>
                    <p className="price">₹{item.price}</p>
                  </div>

                  {/* ⚖️ This structural placeholder fills the visual column gap of the cart's quantity tools */}
                  <div className="wishlist-spacer"></div>

                  <div className="wishlist-actions">
                    <button
                      className="btn-cart"
                      onClick={() => moveToCart(item)}
                    >
                      Move to Cart
                    </button>

                    <button
                      className="btn-remove"
                      onClick={() => {
                        dispatch(removeFromWishlist(itemId));
                        toast.info("Removed from wishlist");
                      }}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </>
  );
};

export default Wishlist;