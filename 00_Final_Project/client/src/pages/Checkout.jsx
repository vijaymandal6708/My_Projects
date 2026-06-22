import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { clearCart } from "../cartSlice";

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.mycart.cart || []);

  const [useNewAddress, setUseNewAddress] = useState(false);
  const [address, setAddress] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    pincode: "",
    addressLine: "",
  });

  /* ================= FETCH USER ================= */
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          toast.warning("Please login to continue");
          navigate("/login");
          return;
        }

        const res = await axios.get("http://localhost:8000/user/fetch-user", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setAddress({
          name: res.data.name || "",
          email: res.data.email || "",
          phone: res.data.phone || "",
          city: res.data.city || "",
          pincode: res.data.pincode || "",
          addressLine: res.data.address || "",
        });
      } catch (err) {
        toast.error("Failed to load user address");
      }
    };

    fetchUser();
  }, [navigate]);

  /* ================= PRICE ================= */
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.qnty,
    0
  );

  // 🚚 Shipping fee flat rate of ₹29
  const shipping = 29;
  const total = subtotal + shipping;

  /* ================= SAVE ALTERNATE ADDRESS ================= */
  const saveAlternateAddress = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:8000/user/add-address",
        {
          name: address.name,
          phone: address.phone,
          city: address.city,
          pincode: address.pincode,
          addressLine: address.addressLine,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch {
      console.log("Alternate address not saved");
    }
  };

  /* ================= CREATE ORDER ================= */
  // 🕒 Accepts the exact order time so it can be saved in the DB
  const createOrder = async (orderTime) => {
    const token = localStorage.getItem("token");

    return axios.post(
      "http://localhost:8000/orders/place-order",
      {
        items: cartItems.map((item) => ({
          productId: item.id,
          name: item.name,
          category: item.category,
          price: item.price,
          quantity: item.qnty,
          image: item.image,
        })),
        shippingAddress: {
          name: address.name,
          phone: address.phone,
          city: address.city,
          pincode: address.pincode,
          addressLine: address.addressLine,
        },
        subtotal,
        shippingFee: shipping,
        totalAmount: total,
        createdAt: orderTime, // ✅ Sends timestamp string to database
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  };

  /* ================= PAYMENT ================= */
  const handlePay = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.isDemo === true) {
      toast.error("Demo accounts cannot place orders.");
      console.log("DEBUG: Blocked: User is a demo user.");
      return; 
    }
    if (!address.addressLine || !address.city) {
      toast.warning("Please complete shipping address");
      return;
    }

    try {
      const orderRes = await axios.post(
        "http://localhost:8000/api/payment/orders",
        { amount: total * 100 }
      );

      new window.Razorpay({
        key: `${import.meta.env.VITE_RAZORPAY_KEY_ID}`,
        amount: orderRes.data.data.amount,
        currency: "INR",
        name: "Gadget Galaxy",
        order_id: orderRes.data.data.id,
        handler: async (response) => {
          try {
            await axios.post(
              "http://localhost:8000/api/payment/verify",
              response
            );

            if (useNewAddress) {
              await saveAlternateAddress();
            }

            // 🕒 Generate standard unified local timestamp string right at verification success
            const preciseOrderTime = new Date().toLocaleString();

            const dbOrderRes = await createOrder(preciseOrderTime);
            const realOrderId = dbOrderRes.data?.orderId;
            
            dispatch(clearCart());
            window.scrollTo({ top: 0, behavior: "smooth" });
            toast.success("Order placed successfully ✅");
            
            setTimeout(() => {
              navigate("/order-confirmation", { 
                state: { 
                  orderId: realOrderId,
                  items: cartItems,
                  totalAmount: total,
                  shippingAddress: address,
                  orderTime: preciseOrderTime // ✅ Passes exact database timestamp to confirmation screen
                } 
              });
            }, 2000);
          } catch (err) {
            toast.error("Failed to place order ❌");
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

        {/* ================= ADDRESS ================= */}
        <div className="section">
          <h3>Shipping Address</h3>

          <label style={{ display: "block", marginBottom: 12 }}>
            <input
              type="checkbox"
              checked={useNewAddress}
              onChange={() => setUseNewAddress(!useNewAddress)}
            />{" "}
            Use a different shipping address
          </label>

          <div className="form-grid">
            <input 
              value={address.name} 
              disabled={!useNewAddress} 
              onChange={(e) => setAddress({ ...address, name: e.target.value })}
            />
            <input value={address.email} disabled />
            <input
              value={address.phone}
              disabled={!useNewAddress}
              onChange={(e) => setAddress({ ...address, phone: e.target.value })}
            />
            <input
              value={address.city}
              disabled={!useNewAddress}
              onChange={(e) => setAddress({ ...address, city: e.target.value })}
            />
            <input
              className="full"
              value={address.addressLine}
              disabled={!useNewAddress}
              onChange={(e) => setAddress({ ...address, addressLine: e.target.value })}
            />
            <input
              value={address.pincode}
              disabled={!useNewAddress}
              onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
            />
          </div>
        </div>

        {/* ================= SUMMARY ================= */}
        <div className="section">
          <h3>Order Summary</h3>

          {cartItems.map((item) => (
            <div key={item.id} className="summary-item">
              <span>
                {item.name} × {item.qnty}
              </span>
              <strong>₹{item.price * item.qnty}</strong>
            </div>
          ))}

          <div className="summary-item">
            <span>Shipping Fee</span>
            <strong>₹{shipping}</strong>
          </div>

          <div className="summary-item summary-total">
            <span>Total</span>
            <span>₹{total}</span>
          </div>

          <button className="pay-btn" onClick={handlePay}>
            Pay Securely ₹{total}
          </button>
        </div>
      </div>
    </>
  );
};

export default Checkout;