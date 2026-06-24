import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      // Using withCredentials for cookie-based auth
      const res = await axios.get(`${import.meta.env.VITE_BACKENDURL}/admin/orders`, {
        withCredentials: true,
      });
      setOrders(res.data.orders);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_BACKENDURL}/admin/update-order-status/${orderId}`,
        { status: newStatus },
        { withCredentials: true }
      );

      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, orderStatus: newStatus } : o
        )
      );

      setToast("✅ Order status updated successfully!");
      setTimeout(() => setToast(null), 3000);
    } catch (err) {
      console.error("Failed to update status", err);
      alert("Failed to update status");
    }
  };

  return (
    <>
      <style>{`
        /* Original Styles Restored */
        .orders-page { width: 100%; max-width: 1100px; margin: auto; padding: 10px 24px 40px; }
        .admin-page-header { text-align: center; margin-top: 24px; margin-bottom: 36px; }
        .page-title { font-size: 26px; font-weight: 700; color: #0f172a; margin: 0 0 6px 0; }
        .page-subtitle { font-size: 14px; color: #64748b; margin: 0; }
        .premium-empty-container { background: #ffffff; border-radius: 14px; padding: 50px 40px; text-align: center; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02); border: 1px solid #e2e8f0; display: flex; flex-direction: column; align-items: center; max-width: 650px; margin: 40px auto 0; }
        .empty-icon-circle { width: 64px; height: 64px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; color: #64748b; margin-bottom: 20px; }
        .empty-dashboard-btn { background: #0f172a; color: white; border: none; padding: 10px 22px; border-radius: 8px; font-size: 13px; font-weight: 500; cursor: pointer; }
        .order-card { background: #fff; border-radius: 12px; padding: 20px; margin-bottom: 18px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; }
        .order-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
        .order-id { font-size: 13px; font-weight: 600; color: #334155; }
        .status-dropdown { padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; text-transform: uppercase; border: 1px solid #cbd5e1; cursor: pointer; background: #fff; }
        .order-meta { display: flex; gap: 20px; font-size: 12px; color: #64748b; margin-bottom: 12px; }
        .item-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; font-size: 13px; }
        .item-left { display: flex; align-items: center; gap: 10px; }
        .item-left img { width: 40px; height: 40px; object-fit: cover; border-radius: 6px; background: #f8fafc; }
        .price-summary { display: flex; justify-content: flex-end; margin-top: 15px; }
        .price-box { width: 220px; font-size: 13px; background: #f8fafc; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0; }
        .price-row { display: flex; justify-content: space-between; margin-bottom: 4px; color: #475569; }
        .total { border-top: 1px solid #e2e8f0; margin-top: 6px; padding-top: 6px; font-weight: 700; color: #0f172a; }
        .toast-popup { position: fixed; top: 150px; right: 20px; background: #0f172a; color: #fff; padding: 12px 20px; border-radius: 8px; font-size: 14px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 1000; }
      `}</style>

      <div className="orders-page">
        {toast && <div className="toast-popup">{toast}</div>}

        <div className="admin-page-header">
          <h2 className="page-title">Manage Orders</h2>
          <p className="page-subtitle">Track customer checkouts, fulfillment status, and transaction history</p>
        </div>

        {loading ? (
          <p style={{ textAlign: "center", color: "#64748b" }}>Loading database order entries...</p>
        ) : orders.length === 0 ? (
          <div className="premium-empty-container">
            <div className="empty-icon-circle">📦</div>
            <h5>No transaction database records found</h5>
            <p style={{ fontSize: "14px", color: "#64748b", margin: "0 0 24px 0" }}>The store transaction ledger is currently empty.</p>
            <button className="empty-dashboard-btn" onClick={() => navigate("/admin-dashboard")}>Return to Metrics</button>
          </div>
        ) : (
          orders.map((order) => (
            <div className="order-card" key={order._id}>
              <div className="order-header">
                <div className="order-id">Order ID: {order._id}</div>
                <select value={order.orderStatus} onChange={(e) => updateOrderStatus(order._id, e.target.value)} className="status-dropdown">
                  <option value="Placed">Placed</option>
                  <option value="Packed">Packed</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
              <div className="order-meta">
                <span>Date: {new Date(order.createdAt).toLocaleDateString()}</span>
                <span>Items: {order.items.length}</span>
              </div>
              <div className="items">
                {order.items.map((item, i) => (
                  <div className="item-row" key={i}>
                    <div className="item-left">
                      <img src={item.image} alt={item.name} />
                      <span>{item.name} × {item.quantity}</span>
                    </div>
                    <strong>₹{item.price * item.quantity}</strong>
                  </div>
                ))}
              </div>
              <div className="price-summary">
                <div className="price-box">
                  <div className="price-row"><span>Subtotal</span><span>₹{order.subtotal}</span></div>
                  <div className="price-row"><span>Shipping</span><span>₹{order.shippingFee}</span></div>
                  <div className="price-row total"><span>Total Amount</span><span>₹{order.totalAmount}</span></div>
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