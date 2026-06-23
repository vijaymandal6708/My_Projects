import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { clearCart } from "../Redux-toolkit/cartSlice";

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Accessing state from Redux
  const cartItems = useSelector((state) => state.mycart.cart || []);
  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const [useNewAddress, setUseNewAddress] = useState(false);
  const [address, setAddress] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    pincode: "",
    addressLine: "",
  });

  /* ================= INITIALIZATION ================= */
  useEffect(() => {
    if (!isAuthenticated || !user) {
      toast.warning("Please login to continue");
      navigate("/login");
      return;
    }

    setAddress({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      city: user.city || "",
      pincode: user.pincode || "",
      addressLine: user.address || "",
    });
  }, [user, isAuthenticated, navigate]);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qnty, 0);
  const shipping = 29;
  const total = subtotal + shipping;

  const handlePay = async () => {
    if (user?.isDemo) {
      toast.error("Demo accounts cannot place orders.");
      return;
    }
    if (!address.addressLine || !address.city) {
      toast.warning("Please complete shipping address");
      return;
    }

    try {
      const orderRes = await axios.post("http://localhost:8000/api/payment/orders", { amount: total * 100 });

      new window.Razorpay({
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderRes.data.data.amount,
        currency: "INR",
        name: "Gadget Galaxy",
        order_id: orderRes.data.data.id,
        handler: async (response) => {
          try {
            await axios.post("http://localhost:8000/api/payment/verify", response);
            await axios.post("http://localhost:8000/orders/place-order", {
              items: cartItems,
              shippingAddress: address,
              totalAmount: total,
            });
            dispatch(clearCart());
            toast.success("Order placed successfully ✅");
            setTimeout(() => navigate("/order-confirmation"), 2000);
          } catch (err) {
            toast.error("Order verification failed ❌");
          }
        },
        theme: { color: "#0c0243" },
      }).open();
    } catch (err) {
      toast.error("Payment failed ❌");
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} />

      <style>{`
        * { box-sizing: border-box; font-family: "Inter", system-ui, sans-serif; }
        body { background: #f4f6f8; }

        .checkout-page {
          min-height: 100vh;
          max-width: 960px;
          margin: auto;
          padding: 40px 20px 80px;
        }

        .checkout-title { font-size: 30px; font-weight: 700; margin-bottom: 30px; text-align: center; }

        .section {
          background: #fff;
          border-radius: 16px;
          padding: 28px 35px;
          margin-bottom: 26px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.08);
        }

        .section h3 { font-size: 20px; margin-bottom: 20px; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .form-grid input { height: 44px; padding: 10px 14px; border-radius: 8px; border: 1px solid #ccc; }
        .form-grid input:disabled { background: #f1f1f1; }
        .form-grid .full { grid-column: span 2; }
        .summary-item { display: flex; justify-content: space-between; margin-bottom: 12px; }
        .summary-total { font-size: 18px; font-weight: 700; }

        .pay-btn {
          margin-top: 22px;
          width: 40%;
          height: 48px;
          border-radius: 12px;
          border: none;
          background: #0c0243;
          color: white;
          font-size: 16px;
          cursor: pointer;
          margin-left: 250px;
        }

        .pay-btn:hover { background: #1b0f6f; }
      `}</style>

      <div className="checkout-page">
        <h2 className="checkout-title">Checkout</h2>
        <div className="section">
          <h3>Shipping Address</h3>
          <label style={{ display: "block", marginBottom: 12 }}>
            <input type="checkbox" checked={useNewAddress} onChange={() => setUseNewAddress(!useNewAddress)} /> Use a different shipping address
          </label>
          <div className="form-grid">
            <input value={address.name} disabled={!useNewAddress} onChange={(e) => setAddress({ ...address, name: e.target.value })} placeholder="Full Name" />
            <input value={address.email} disabled placeholder="Email" />
            <input value={address.phone} disabled={!useNewAddress} onChange={(e) => setAddress({ ...address, phone: e.target.value })} placeholder="Phone" />
            <input value={address.city} disabled={!useNewAddress} onChange={(e) => setAddress({ ...address, city: e.target.value })} placeholder="City" />
            <input className="full" value={address.addressLine} disabled={!useNewAddress} onChange={(e) => setAddress({ ...address, addressLine: e.target.value })} placeholder="Address" />
            <input value={address.pincode} disabled={!useNewAddress} onChange={(e) => setAddress({ ...address, pincode: e.target.value })} placeholder="Pincode" />
          </div>
        </div>

        <div className="section">
          <h3>Order Summary</h3>
          {cartItems.map((item) => (
            <div key={item.id} className="summary-item">
              <span>{item.name} × {item.qnty}</span>
              <strong>₹{item.price * item.qnty}</strong>
            </div>
          ))}
          <div className="summary-item"><span>Shipping Fee</span><strong>₹{shipping}</strong></div>
          <div className="summary-item summary-total"><span>Total</span><span>₹{total}</span></div>
          <button className="pay-btn" onClick={handlePay}>Pay Securely ₹{total}</button>
        </div>
      </div>
    </>
  );
};

export default Checkout;