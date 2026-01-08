import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  addToCart,
  increaseQuantity,
  removeFromWishlist,
} from "./cartSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Wishlist = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const wishlist = useSelector((state) => state.mycart.wishlist);
  const cart = useSelector((state) => state.mycart.cart);

  const moveToCart = (item) => {
    const existingItem = cart.find((c) => c.id === item.id);

    if (existingItem) {
      dispatch(increaseQuantity(existingItem));
      toast.info("Quantity increased in cart");
    } else {
      dispatch(
        addToCart({
          id: item.id,
          name: item.name,
          price: item.price,
          image: item.image,
          qnty: 1,
        })
      );
      toast.success("Moved to cart 🛒");
    }

    dispatch(removeFromWishlist(item.id));
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={1500} />

      <style>{`
        body {
          background: #f4f6f8;
        }

        .wishlist-page {
          max-width: 1200px;
          margin: auto;
          padding: 40px 20px 80px;
        }

        .wishlist-title {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 30px;
          text-align: center;
        }

        .wishlist-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 28px;
        }

        .wishlist-card {
          background: #fff;
          border-radius: 18px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.08);
          overflow: hidden;
          transition: transform 0.25s ease;
        }

        .wishlist-card:hover {
          transform: translateY(-6px);
        }

        .wishlist-image {
          height: 220px;
          background: #f1f3f6;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
        }

        .wishlist-image img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          cursor: pointer;
        }

        .wishlist-info {
          padding: 16px 22px 22px;
        }

        .wishlist-info h4 {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 8px;
          height: 42px;
        }

        .wishlist-price {
          font-size: 17px;
          font-weight: 700;
          color: #4b0082;
          margin-bottom: 16px;
        }

        .wishlist-actions {
          display: flex;
          gap: 10px;
        }

        .btn-cart {
          flex: 1;
          background: linear-gradient(135deg, #020718, #131a3b);
          color: white;
          border: none;
          padding: 10px;
          border-radius: 14px;
          font-size: 14px;
          cursor: pointer;
        }

        .btn-remove {
          background: #f1f1f1;
          border: none;
          padding: 10px 14px;
          border-radius: 14px;
          cursor: pointer;
          font-size: 14px;
        }

        .empty {
          text-align: center;
          color: #666;
          margin-top: 80px;
        }
      `}</style>

      <div className="wishlist-page">
        <h2 className="wishlist-title">My Wishlist ❤️</h2>

        {wishlist.length === 0 ? (
          <div className="empty">
            <h3>Your wishlist is empty</h3>
            <p>Save items you like and come back later</p>
          </div>
        ) : (
          <div className="wishlist-grid">
            {wishlist.map((item) => (
              <div key={item.id} className="wishlist-card">
                <div
                  className="wishlist-image"
                  onClick={() => navigate(`/product/${item.id}`)}
                >
                  <img src={item.image} alt={item.name} />
                </div>

                <div className="wishlist-info">
                  <h4>{item.name}</h4>
                  <div className="wishlist-price">₹{item.price}</div>

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
                        dispatch(removeFromWishlist(item.id));
                        toast.info("Removed from wishlist");
                      }}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Wishlist;
