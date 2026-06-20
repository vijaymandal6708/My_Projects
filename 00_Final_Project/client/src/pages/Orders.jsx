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

        const orderData = Array.isArray(res.data) ? res.data : res.data.orders || [];
        setOrders(orderData);
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
          min-height: 70vh;
          max-width: 1000px;
          margin: auto;
          padding: 40px 20px 80px;
        }

        .orders-title {
          font-size: 26px;
          font-weight: 700;
          text-align: center;
          margin-bottom: 30px;
        }

        /* ===== COMPACT ORDER CARD ===== */
        .order-card {
          background: #ffffff;
          border-radius: 10px;
          padding: 20px 54px; /* Reduced vertical & horizontal padding */
          margin-bottom: 10px; /* Reduced space between cards */
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }

        /* Combined header into a clean horizontal line */
        .order-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 10px;
          padding-bottom: 6px;
          border-bottom: 1px dashed #f0f0f0;
          margin-bottom: 6px;
        }

        .order-left-meta {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 12px;
          color: #555;
        }

        .order-id-label {
          font-weight: 700;
          color: #333;
        }

        .order-right-badges {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .paid-badge {
          background: rgba(46, 204, 113, 0.15);
          color: #1f9d55;
          padding: 2px 8px;
          border-radius: 4px;
          font-weight: 600;
          font-size: 11px;
        }

        /* ===== DELIVERY BADGES ===== */
        .delivery-badge {
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 600;
          text-transform: capitalize;
        }

        .status-placed { background: #fff4e5; color: #d9822b; }
        .status-packed { background: #fef9e7; color: #b7950b; }
        .status-shipped { background: #e6f4ea; color: #137333; }
        .status-delivered { background: #e6f9ef; color: #1f9d55; }
        .status-cancelled { background: #fdecea; color: #d93025; }

        /* ===== ITEMS CONTAINER ===== */
        .items {
          margin-bottom: 4px;
        }

        .item-row {
          display: grid;
          grid-template-columns: 32px 1fr auto; /* Smaller thumbnail image space */
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
          font-size: 12px;
        }

        .item-image {
          width: 32px;
          height: 32px;
          border-radius: 4px;
          object-fit: cover;
          border: 1px solid #eee;
          background: #fafafa;
        }

        .item-info {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 8px;
        }

        .item-name {
          font-weight: 500;
          color: #333;
        }

        .item-qty {
          color: #777;
          font-size: 11px;
          background: #f0f2f5;
          padding: 1px 5px;
          border-radius: 3px;
        }

        /* ===== PRICE SUMMARY LAYOUT ===== */
        .price-summary {
          border-top: 1px solid #f0f0f0;
          padding-top: 6px;
          margin-top: 4px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
        }

        .price-left-details {
          display: flex;
          gap: 12px;
          color: #666;
        }

        .total-price-display {
          font-size: 14px;
          font-weight: 700;
          color: #0c0243;
        }

        /* ===== EMPTY RECEPTACLE LAYOUTS ===== */
        .empty-orders {
          text-align: center;
          margin-top: 80px;
          font-size: 18px;
          color: #555;
        }

        @media (max-width: 650px) {
          .order-header-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 4px;
          }
          .price-summary {
            flex-direction: column;
            align-items: flex-end;
            gap: 4px;
          }
        }
      `}</style>

      <div className="orders-page">
        <h2 className="orders-title">My Orders</h2>

        {loading ? (
          <p className="empty-orders" style={{background:"#0c0243", height:"200px", color:"white", padding:"65px", borderRadius:"12px"}}>Loading orders...</p>
        ) : orders.length === 0 ? (
          <p className="empty-orders" style={{background:"#0c0243", height:"300px", color:"white", padding:"115px", borderRadius:"25px"}}>
            Your have not placed any order yet <span style={{fontSize:"30px"}}>🛍️</span>
          </p>
        ) : (
          orders.map((order) => (
            <div className="order-card" key={order._id}>
              
              {/* HEADER CONTAINER FIXED AS A SLIM METADATA ROW */}
              <div className="order-header-row">
                <div className="order-left-meta">
                  <span className="order-id-label">ID: {order._id}</span>
                  <span>•</span>
                  <span>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"}</span>
                  <span>•</span>
                  <span>{order.items?.length || 0} Item(s)</span>
                </div>
                
                <div className="order-right-badges">
                  <span className="paid-badge">PAID</span>
                  <span className={`delivery-badge status-${order.orderStatus?.toLowerCase() || "placed"}`}>
                    {order.orderStatus || "placed"}
                  </span>
                </div>
              </div>

              {/* COMPACTED ITEMS LIST */}
              <div className="items">
                {order.items?.map((item, index) => (
                  <div className="item-row" key={index}>
                    <img
                      src={item.image || "/no-image.png"}
                      alt={item.name}
                      className="item-image"
                    />
                    <div className="item-info">
                      <span className="item-name">{item.name}</span>
                      <span className="item-qty">x{item.quantity || item.qnty || 1}</span>
                    </div>
                    <strong>₹{item.price * (item.quantity || item.qnty || 1)}</strong>
                  </div>
                ))}
              </div>

              {/* DESTINATION INFORMATION */}
              {order.shippingAddress && (
                <div style={{ fontSize: "11px", color: "#777", marginBottom: "4px", background: "#f8f9fa", padding: "4px 8px", borderRadius: "4px" }}>
                  <strong>Deliver To: </strong> 
                  {order.shippingAddress.name} — {order.shippingAddress.addressLine}, {order.shippingAddress.city}
                </div>
              )}

              {/* INTEGRATED CONDENSED PRICING BLOCK */}
              <div className="price-summary">
                <div className="price-left-details">
                  <span>Subtotal: ₹{order.subtotal || (order.totalAmount - (order.shippingFee || 0))}</span>
                  <span>Shipping: ₹{order.shippingFee !== undefined ? order.shippingFee : 29}</span>
                </div>
                <div className="total-price-display">
                  Total: ₹{order.totalAmount}
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