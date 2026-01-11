import { useEffect, useState } from "react";
import axios from "axios";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("admintoken");

        const res = await axios.get(
          "http://localhost:8000/admin/orders",
          {
            headers: { Authorization: `Bearer ${token}` },
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
      {/* ================= CSS ================= */}
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
          max-width: 1100px;
          margin: auto;
          padding: 30px 20px 60px;
        }

        .orders-title {
          font-size: 26px;
          font-weight: 700;
          text-align: center;
          margin-bottom: 30px;
        }

        /* ===== CARD ===== */
        .order-card {
          background: #fff;
          border-radius: 14px;
          padding: 16px 20px;
          margin-bottom: 18px;
          box-shadow: 0 6px 18px rgba(0,0,0,0.08);
        }

        /* ===== HEADER ===== */
        .order-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .order-id {
          font-size: 13px;
          font-weight: 600;
          color: #333;
        }

        .status-badge {
          font-size: 12px;
          padding: 4px 12px;
          border-radius: 20px;
          font-weight: 600;
          text-transform: capitalize;
        }

        .status-placed {
          background: #fff4e5;
          color: #d9822b;
        }

        .status-delivered {
          background: #e6f9ef;
          color: #1f9d55;
        }

        /* ===== META ===== */
        .order-meta {
          display: flex;
          gap: 22px;
          font-size: 12px;
          color: #666;
          margin-bottom: 10px;
        }

        .paid-badge {
          background: rgba(46, 204, 113, 0.15);
          color: #2ecc71;
          padding: 2px 10px;
          border-radius: 10px;
          font-weight: 600;
          margin-left: 6px;
        }

        /* ===== ITEMS ===== */
        .items {
          border-top: 1px solid #eee;
          padding-top: 10px;
        }

        .item-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
          font-size: 13px;
        }

        .item-left {
          display: flex;
          align-items: center;
          gap: 10px;
          max-width: 75%;
        }

        .item-left img {
          width: 40px;
          height: 40px;
          object-fit: contain;
          border-radius: 6px;
          background: #f1f1f1;
        }

        .item-name {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* ===== PRICE SUMMARY ===== */
        .price-summary {
          display: flex;
          justify-content: flex-end;
          margin-top: 10px;
        }

        .price-box {
          width: 200px;
          font-size: 13px;
          background: #fafafa;
          padding: 10px 14px;
          border-radius: 10px;
          border: 1px solid #eee;
        }

        .price-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 4px;
          color: #555;
        }

        .price-row.total {
          margin-top: 6px;
          padding-top: 6px;
          border-top: 1px dashed #ddd;
          font-weight: 700;
          font-size: 14px;
          color: #111;
        }

        .empty {
          text-align: center;
          margin-top: 120px;
          font-size: 18px;
          color: #555;
        }

        @media (max-width: 600px) {
          .order-meta {
            flex-direction: column;
            gap: 4px;
          }

          .item-left {
            max-width: 65%;
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
                <div className={`status-badge status-${order.orderStatus}`}>
                  {order.orderStatus}
                </div>
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
              </div>

              {/* ITEMS */}
              <div className="items">
                {order.items.map((item, i) => (
                  <div className="item-row" key={i}>
                    <div className="item-left">
                      <img src={item.image} alt={item.name} />
                      <div className="item-name">
                        {item.name} × {item.quantity}
                      </div>
                    </div>
                    <strong>₹{item.price * item.quantity}</strong>
                  </div>
                ))}
              </div>

              {/* PRICE */}
              <div className="price-summary">
                <div className="price-box">
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
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default AdminOrders;
