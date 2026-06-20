import { useDispatch, useSelector } from "react-redux";
import {
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
} from "../cartSlice";
import { FiPlus, FiMinus, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector((state) => state.mycart.cart || []);

  // login check
  const isLoggedIn = localStorage.getItem("user") || localStorage.getItem("token");

  // Pricing calculations
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qnty, 0);
  const totalQty = cart.reduce((sum, item) => sum + item.qnty, 0);
  
  // 🚚 Shipping fee updated to ₹29
  const shippingFee = 29; 
  const total = subtotal + shippingFee;

  return (
    <>
      {/* ===== CART CSS ===== */}
      <style>{`
        * { box-sizing: border-box; font-family: "Inter", system-ui, sans-serif; }
        body { background: #f4f6f8; }

        .cart-page {
          min-height: 72vh;
          max-width: 1000px;
          margin: auto;
          padding: 40px 20px 80px;
        }

        .cart-title {
          font-size: 26px;
          font-weight: 700;
          text-align: center;
          margin-bottom: 30px;
        }

        .empty-cart {
          text-align: center;
          margin-top: 80px;
          font-size: 18px;
          color: #555;
        }

        /* ===== ITEM CARD ===== */
        .cart-item {
          background: #fff;
          border-radius: 16px;
          padding: 32px 40px;
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 20px;
          box-shadow: 0 6px 18px rgba(0,0,0,0.08);
        }

        .cart-item img {
          width: 90px;
          height: 90px;
          object-fit: contain;
        }

        .cart-info { flex: 1; }
        .cart-info h4 { font-size: 16px; font-weight: 600; margin-bottom: 6px; }
        .cart-info p { font-size: 13px; color: #777; margin-bottom: 6px; }
        .cart-info .price { font-weight: 600; font-size: 15px; }

        /* ===== QUANTITY ===== */
        .quantity { display: flex; align-items: center; gap: 10px; }
        .quantity button {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          border: none;
          background: #eee;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .quantity button:disabled { opacity: 0.4; cursor: not-allowed; }
        .quantity span { font-weight: 600; min-width: 22px; text-align: center; }
        .item-total { font-weight: 700; min-width: 90px; text-align: right; }
        .remove-btn { background: transparent; border: none; color: #c00; font-size: 18px; cursor: pointer; }

        /* ===== SUMMARY ===== */
        .cart-summary {
          background: #fff;
          border-radius: 18px;
          padding: 26px;
          margin-top: 35px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.1);
        }

        .cart-summary h3 { font-size: 15px; margin-bottom: 20px; }
        .summary-row { display: flex; justify-content: space-between; margin-bottom: 14px; font-size: 13.5px; }
        .summary-row.total { font-size: 16px; font-weight: 600; margin-top: 18px; }

        .checkout-btn {
          margin-top: 0px;
          width: 30%;
          margin-left: 300px;
          height: 45px;
          border-radius: 12px;
          border: none;
          background: #0c0243;
          color: white;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
        }

        .checkout-btn:hover { background: #1b0f6f; }

        @media (max-width: 600px) {
          .cart-item { flex-direction: column; align-items: flex-start; }
          .item-total { text-align: left; }
        }
      `}</style>

      {/* ===== JSX ===== */}
      <div className="cart-page">
        <h2 className="cart-title">My Cart</h2>

        {cart.length === 0 ? (
          <p className="empty-cart" style={{background:"#0c0243",height:"300px",color:"white", padding:"115px",borderRadius:"25px"}}>
            Your cart is empty<span style={{fontSize:"30px"}}>🛒</span>
          </p>
        ) : (
          <>
            {cart.map((item) => (
              <div className="cart-item" key={item.id}>
                <img src={item.image} alt={item.name} />

                <div className="cart-info">
                  <h4>{item.name}</h4>
                  <p>{item.description}</p>
                  <p className="price">₹{item.price}</p>
                </div>

                <div className="quantity">
                  <button
                    disabled={item.qnty === 1}
                    onClick={() => dispatch(decreaseQuantity(item))}
                  >
                    <FiMinus />
                  </button>
                  <span>{item.qnty}</span>
                  <button onClick={() => dispatch(increaseQuantity(item))}>
                    <FiPlus />
                  </button>
                </div>

                <div className="item-total">₹{item.price * item.qnty}</div>

                <button className="remove-btn" onClick={() => dispatch(removeFromCart(item))}>
                  <FiTrash2 />
                </button>
              </div>
            ))}

            {/* ===== SUMMARY ===== */}
            <div className="cart-summary">
              <h3>Order Summary</h3>

              <div className="summary-row">
                <span>Total Quantity</span>
                <span>{totalQty}</span>
              </div>

              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>

              <div className="summary-row">
                <span>Shipping Fee</span>
                <span>₹{shippingFee}</span>
              </div>

              <div className="summary-row total">
                <span>Total</span>
                <span>₹{total}</span>
              </div>

              <button
                className="checkout-btn"
                onClick={() => {
                  if (!isLoggedIn) {
                    toast.warning("Please login to continue checkout", {
                      position: "top-right",
                      autoClose: 2000,
                    });

                    setTimeout(() => { navigate("/login"); }, 2000);
                    return;
                  }
                  navigate("/checkout");
                }}
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>

      <ToastContainer />
    </>
  );
};

export default Cart;