import { Link, useLocation } from "react-router-dom";

const OrderConfirmation = () => {
  const { state } = useLocation();

  const {
    orderId = "ORD_" + Date.now(),
    paymentId = "N/A",
    amount = 0,
    itemsCount = 0,
  } = state || {};

  const date = new Date().toLocaleString();

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

        /* ===== PAGE (MATCH CHECKOUT WIDTH) ===== */
        .confirmation-page {
          min-height: 100vh;
          max-width: 960px;
          margin: auto;
          padding: 40px 20px 80px;
        }

        /* ===== HEADER ===== */
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

        /* ===== CONTENT ===== */
        .confirmation-content {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 30px;
        }

        /* ===== CARD ===== */
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

        /* ===== SUMMARY ===== */
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

        /* ===== ACTIONS ===== */
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

        /* ===== RESPONSIVE ===== */
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
            successfully.
          </p>
        </div>

        {/* CONTENT */}
        <div className="confirmation-content">
          {/* LEFT */}
          <div>
            <div className="card">
              <h3>Order Details</h3>

              <div className="row">
                <span>Order ID</span>
                <span>{orderId}</span>
              </div>

              <div className="row">
                <span>Payment ID</span>
                <span>{paymentId}</span>
              </div>

              <div className="row">
                <span>Order Date</span>
                <span>{date}</span>
              </div>

              <div className="row">
                <span>Total Items</span>
                <span>{itemsCount}</span>
              </div>
            </div>

            <div className="card">
              <h3>Delivery Address</h3>
              <p style={{ fontSize: "14px", color: "#555" }}>
                Address will be displayed here once order storage is connected.
              </p>
            </div>
          </div>

          {/* RIGHT */}
          <div className="summary">
            <h3>Payment Summary</h3>

            <div className="row">
              <span>Amount Paid</span>
              <span className="total">₹{amount}</span>
            </div>

            <div className="actions">
              <Link to="/orders" className="btn btn-secondary">
                View Orders
              </Link>

              <Link to="/home" className="btn btn-primary">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderConfirmation;
