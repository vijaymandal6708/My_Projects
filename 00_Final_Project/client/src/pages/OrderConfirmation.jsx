import { Link, useLocation } from "react-router-dom";

const OrderConfirmation = () => {
  const { state } = useLocation();

  // Extract variables safely sent over from Checkout.jsx
  const {
    orderId = "N/A",
    totalAmount = 0,
    items = [],
    shippingAddress = null,
    orderTime = "N/A", // ✅ Catches the exact timestamp recorded in your database
  } = state || {};

  // Dynamic totals calculations keeping fees synchronized across your application
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qnty, 0);
  const shippingFee = subtotal === 0 ? 0 : 29;

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
          font-family: "Inter", system-ui, sans-serif;
        }

        body {
          background: #f4f6f8;
        }

        .confirmation-page {
          min-height: 100vh;
          max-width: 960px;
          margin: auto;
          padding: 40px 20px 80px;
        }

        .confirmation-header {
          background: #e9f9f0;
          padding: 25px 30px;
          border-radius: 16px;
          margin-bottom: 30px;
          border: 1px solid #cdeedd;
        }

        .confirmation-header h1 {
          font-size: 24px;
          margin-bottom: 6px;
          color: #1e8449;
        }

        .confirmation-header p {
          color: #2c7a4b;
          font-size: 14px;
        }

        .confirmation-content {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 30px;
        }

        .card {
          background: white;
          padding: 28px 30px;
          margin-bottom: 24px;
          border-radius: 16px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.08);
        }

        .card h3 {
          font-size: 18px;
          margin-bottom: 18px;
          border-bottom: 1px solid #f0f0f0;
          padding-bottom: 10px;
        }

        .row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
          font-size: 14px;
        }

        .row span:last-child {
          font-weight: 600;
        }

        /* ===== PRODUCTS LIST ===== */
        .confirm-item-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 0;
          border-bottom: 1px solid #f9f9f9;
        }

        .confirm-item-details {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .confirm-item-img {
          width: 50px;
          height: 50px;
          object-fit: cover;
          border-radius: 8px;
          border: 1px solid #eee;
        }

        .summary {
          background: white;
          padding: 28px;
          border-radius: 16px;
          height: fit-content;
          box-shadow: 0 8px 24px rgba(0,0,0,0.08);
        }

        .summary h3 {
          margin-bottom: 18px;
          font-size: 18px;
        }

        .total {
          font-size: 20px;
          font-weight: 700;
          color: #0c0243;
        }

        .actions {
          margin-top: 22px;
          display: flex;
          gap: 14px;
        }

        .btn {
          padding: 12px 20px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
          font-size: 14px;
          text-align: center;
          flex: 1;
        }

        .btn-primary {
          background: #0c0243;
          color: white;
        }

        .btn-secondary {
          background: #f0f0f0;
          color: #333;
        }

        .btn:hover {
          opacity: 0.9;
        }

        @media (max-width: 900px) {
          .confirmation-content {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="confirmation-page">
        {/* HEADER */}
        <div className="confirmation-header">
          <h1>✅ Order Confirmation</h1>
          <p>
            Thank you for shopping with Gadget Galaxy. Your order has been placed
            successfully and payment is verified.
          </p>
        </div>

        {/* CONTENT */}
        <div className="confirmation-content">
          {/* LEFT SIDE CONTENT */}
          <div>
            {/* TRANSACTION DETAILS */}
            <div className="card">
              <h3>Order Metadata</h3>
              <div className="row">
                <span>Order ID (Server)</span>
                <span style={{ color: "#0c0243" }}>{orderId}</span>
              </div>
              <div className="row">
                <span>Timestamp</span>
                <span>{orderTime}</span> {/* ✅ Displays the exact timestamp stored in your DB */}
              </div>
            </div>

            {/* DYNAMIC PRODUCTS SUMMARY */}
            <div className="card">
              <h3>Items Purchased ({items.length})</h3>
              {items.map((item) => (
                <div className="confirm-item-row" key={item.id}>
                  <div className="confirm-item-details">
                    <img 
                      src={item.image || "/no-image.png"} 
                      alt={item.name} 
                      className="confirm-item-img" 
                    />
                    <div>
                      <div style={{ fontWeight: 600 }}>{item.name}</div>
                      <div style={{ fontSize: "12px", color: "#666" }}>Qty: {item.qnty}</div>
                    </div>
                  </div>
                  <strong>₹{item.price * item.qnty}</strong>
                </div>
              ))}
            </div>

            {/* SHIPPING DESTINATION */}
            <div className="card">
              <h3>Delivery Destination</h3>
              {shippingAddress ? (
                <div style={{ fontSize: "14px", color: "#333", lineHeight: "1.6" }}>
                  <strong>{shippingAddress.name}</strong><br />
                  {shippingAddress.addressLine}<br />
                  {shippingAddress.city} - {shippingAddress.pincode}<br />
                  <strong>Phone:</strong> {shippingAddress.phone}
                </div>
              ) : (
                <p style={{ fontSize: "14px", color: "#555" }}>
                  No address details present.
                </p>
              )}
            </div>
          </div>

          {/* RIGHT SIDE BREAKDOWN */}
          <div className="summary">
            <h3>Payment Status</h3>
            <div className="row">
              <span>Payment State</span>
              <span style={{ color: "#2ecc71" }}>PAID</span>
            </div>
            <div className="row">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="row">
              <span>Shipping Fee</span>
              <span>₹{shippingFee}</span>
            </div>
            <hr style={{ border: "0", borderTop: "1px solid #eee", margin: "15px 0" }} />
            <div className="row">
              <span>Total Amount</span>
              <span className="total">₹{totalAmount}</span>
            </div>

            <div className="actions">
              <Link to="/orders" className="btn btn-secondary">
                My Orders
              </Link>
              <Link to="/" className="btn btn-primary">
                Shop More
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderConfirmation;