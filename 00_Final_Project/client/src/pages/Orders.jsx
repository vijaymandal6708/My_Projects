import { useEffect, useState } from "react";
import axios from "axios";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          "http://localhost:8000/orders/my-orders",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setOrders(res.data.orders);
      } catch (err) {
        console.error("Failed to fetch orders", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

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

        /* ===== PAGE ===== */
        .orders-page {
          min-height: 100vh;
          max-width: 960px;
          margin: auto;
          padding: 28px 20px 60px;
        }

        .orders-title {
          font-size: 25px;
          font-weight: 700;
          text-align: center;
          margin-bottom: 24px;
        }

        /* ===== CARD ===== */
        .order-card {
          background: #ffffff;
          border-radius: 14px;
          padding: 16px 20px; /* compact */
          margin-bottom: 20px;
          box-shadow: 0 6px 18px rgba(0,0,0,0.08);
        }

        .order-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 6px;
        }

        .order-id {
          font-size: 13.5px;
          font-weight: 600;
        }

        .order-status {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          background: #eefaf3;
          color: #2ecc71;
          text-transform: capitalize;
        }

        /* ===== META ===== */
        .order-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          font-size: 13px;
          color: #666;
          margin-bottom: 8px;
        }

        .paid-badge {
          background: rgba(157, 253, 152, 0.2);
          color: #1f9d55;
          padding: 2px 12px 3px;
          border-radius: 10px;
          font-weight: 600;
          font-size: 12px;
          margin-left: 6px;
        }

        /* ===== DELIVERY STATUS ===== */
        .delivery-badge {
          padding: 3px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
          margin-left: 6px;
          text-transform: capitalize;
        }

        .status-placed {
          background: #fff4e5;
          color: #d9822b;
        }

        .status-processing {
          background: #e8f0fe;
          color: #1a73e8;
        }

        .status-shipped {
          background: #e6f4ea;
          color: #137333;
        }

        .status-delivered {
          background: #e6f9ef;
          color: #1f9d55;
        }

        .status-cancelled {
          background: #fdecea;
          color: #d93025;
        }

        /* ===== ITEMS ===== */
        .items {
          border-top: 1px solid #eee;
          padding-top: 8px;
        }

        .item-row {
          display: grid;
          grid-template-columns: 44px 1fr auto;
          align-items: center;
          gap: 10px;
          margin-bottom: 6px;
          font-size: 13px;
        }

        .item-image {
          width: 44px;
          height: 44px;
          border-radius: 8px;
          object-fit: cover;
          border: 1px solid #eee;
          background: #fafafa;
        }

        .item-info {
          display: flex;
          flex-direction: column;
          gap: 1px;
        }

        .item-name {
          font-weight: 500;
          color: #333;
        }

        .item-qty {
          font-size: 12px;
          color: #777;
        }

        /* ===== PRICE ===== */
        .price-summary {
          border-top: 1px solid #eee;
          padding-top: 8px;
          margin-top: 10px;
          font-size: 13px;
        }

        .price-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 4px;
        }

        .total {
          font-size: 15px;
          font-weight: 700;
        }

        .empty {
          text-align: center;
          margin-top: 90px;
          font-size: 17px;
          color: #555;
        }

        @media (max-width: 600px) {
          .order-meta {
            flex-direction: column;
            gap: 6px;
          }
        }
      `}</style>

      <div className="orders-page">
        <h2 className="orders-title">My Orders</h2>

        {loading ? (
          <p className="empty">Loading orders...</p>
        ) : orders.length === 0 ? (
          <p className="empty">You have no orders yet 📦</p>
        ) : (
          orders.map((order) => (
            <div className="order-card" key={order._id}>
              {/* HEADER */}
              <div className="order-header">
                <div className="order-id">Order ID: {order._id}</div>
                <div className="order-status">{order.orderStatus}</div>
              </div>

              {/* META */}
              <div className="order-meta">
                <span>
                  Date: {new Date(order.createdAt).toLocaleDateString()}
                </span>

                <span>Items: {order.items.length}</span>

                <span>
                  Payment:
                  <span className="paid-badge">PAID</span>
                </span>

                <span>
                  Delivery:
                  <span
                    className={`delivery-badge status-${order.orderStatus}`}
                  >
                    {order.orderStatus}
                  </span>
                </span>
              </div>

              {/* ITEMS */}
              <div className="items">
                {order.items.map((item, index) => (
                  <div className="item-row" key={index}>
                    <img
                      src={item.image || "/no-image.png"}
                      alt={item.name}
                      className="item-image"
                    />

                    <div className="item-info">
                      <span className="item-name">{item.name}</span>
                      <span className="item-qty">Qty: {item.quantity}</span>
                    </div>

                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              {/* PRICE */}
              <div className="price-summary">
                <div className="price-row">
                  <span>Subtotal</span>
                  <span>₹{order.subtotal}</span>
                </div>

                <div className="price-row">
                  <span>Shipping</span>
                  <span>₹{order.shippingFee}</span>
                </div>

                <div className="price-row total">
                  <span>Total</span>
                  <span>₹{order.totalAmount}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default Orders;
