import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Treemap,
} from "recharts";

/* ================= CONSTANTS ================= */

const COLORS = ["#5b21b6", "#7c3aed", "#a78bfa", "#ddd6fe"];

const CATEGORY_ORDER = [
  "smartphones",
  "laptops",
  "accessories",
  "cameras",
];

/* ================= COMPONENT ================= */

const AdminDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const showDashboard = location.pathname === "/admin-dashboard";

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchStats = async () => {
    const admintoken = localStorage.getItem("admintoken");
    if (!admintoken) {
      navigate("/login");
      return;
    }

    const res = await axios.get(
      "http://localhost:8000/admin/dashboard-stats",
      {
        headers: {
          Authorization: `Bearer ${admintoken}`,
        },
      }
    );

    setStats(res.data.stats);
    setLoading(false);
  };

  fetchStats();
}, []);


  /*============== SAFE DATA ================= */

  const productCategoryData = CATEGORY_ORDER.map((cat) => {
    const found = stats?.productCategories?.find(
      (i) => i._id === cat
    );

    return {
      name: cat.toUpperCase(),
      value: found ? found.count : 0,
    };
  });

  const weekMap = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const weeklyOrdersData =
    stats?.weeklyOrders?.map((d) => ({
      day: weekMap[d._id - 1],
      orders: d.orders,
    })) || [];

  const revenueData =
    stats?.monthlyRevenue?.map((m) => ({
      month: new Date(2024, m._id - 1).toLocaleString("default", {
        month: "short",
      }),
      revenue: m.revenue,
    })) || [];

  const categoryPerformanceData = productCategoryData.map((c) => ({
    category: c.name,
    score: c.value * 10,
  }));

  const revenueTreeData = CATEGORY_ORDER.map((cat) => {
    const found = stats?.revenueByCategory?.find(
      (i) => i._id === cat
    );

    return {
      name: cat.toUpperCase(),
      size: found ? found.size : 1,
    };
  });

  /* ================= UI ================= */

  return (
    <>
      {/* ================= CSS ================= */}
      <style>{`
        * {
          box-sizing: border-box;
          font-family: Inter, system-ui, sans-serif;
        }

        body {
          background: #f6f7fb;
        }

        .admin-layout {
          min-height: 100vh;
        }

        .admin-sidebar {
          width: 260px;
          background: #0f172a;
          color: #fff;
          padding: 24px;

          position: fixed;
          top: 134px;
          left: 0;
          height: 100vh;
          overflow-y: auto;
        }

        .brand {
          font-size: 22px;
          margin-bottom: 40px;
        }

        .admin-sidebar nav a {
          display: block;
          padding: 12px;
          margin-bottom: 6px;
          border-radius: 8px;
          color: #cbd5f5;
          text-decoration: none;
        }

        .admin-sidebar nav .active,
        .admin-sidebar nav a:hover {
          background: rgba(255,255,255,0.12);
          color: #fff;
        }

        .admin-main {
          flex: 1;
          padding: 30px;
          margin-left: 260px;
        }

        .admin-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .charts-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        .content-card {
          background: #fff;
          padding: 20px;
          border-radius: 14px;
          box-shadow: 0 12px 30px rgba(0,0,0,0.06);
        }

        .content-card h3 {
          margin-bottom: 10px;
          font-size: 18px;
        }

        .loading {
          text-align: center;
          font-size: 18px;
          margin-top: 120px;
        }

        @media (max-width: 1024px) {
          .charts-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .charts-grid {
            grid-template-columns: 1fr;
          }
          .admin-layout {
            flex-direction: column;
          }
          .admin-sidebar {
            width: 100%;
          }
        }
      `}</style>

      <div className="admin-layout">
        {/* SIDEBAR */}
        <aside className="admin-sidebar">
          <h2 className="brand">Seller Dashboard</h2>
          <nav>
            <NavLink to="/admin-dashboard" end>
              Dashboard
            </NavLink>
            <NavLink to="products">Products</NavLink>
            <NavLink to="add-product">Add Product</NavLink>
            <NavLink to="orders">Orders</NavLink>
          </nav>
        </aside>

        {/* MAIN */}
        <section className="admin-main">
          {showDashboard && (
            <header className="admin-header">
              <h1 style={{fontSize:"28px"}}>Seller Dashboard</h1>
            </header>
          )}

          {showDashboard &&
            (loading ? (
              <p className="loading">Loading dashboard data...</p>
            ) : (
              <div className="charts-grid">
                <div className="content-card">
                  <h3>Products by Category</h3>
                  <ResponsiveContainer width="100%" height={240}>
                    <PieChart>
                      <Pie
                        data={productCategoryData}
                        dataKey="value"
                        innerRadius={60}
                        outerRadius={90}
                      >
                        {productCategoryData.map((_, i) => (
                          <Cell key={i} fill={COLORS[i]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="content-card">
                  <h3>Weekly Orders</h3>
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={weeklyOrdersData}>
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="orders" fill="#5b21b6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="content-card">
                  <h3>Revenue</h3>
                  <ResponsiveContainer width="100%" height={240}>
                    <LineChart data={revenueData}>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line dataKey="revenue" stroke="#5b21b6" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="content-card">
                  <h3>Order Trend</h3>
                  <ResponsiveContainer width="100%" height={240}>
                    <AreaChart data={weeklyOrdersData}>
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Area dataKey="orders" stroke="#7c3aed" fill="#ddd6fe" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="content-card">
                  <h3>Category Performance</h3>
                  <ResponsiveContainer width="100%" height={240}>
                    <RadarChart data={categoryPerformanceData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="category" />
                      <PolarRadiusAxis />
                      <Radar
                        dataKey="score"
                        stroke="#5b21b6"
                        fill="#a78bfa"
                        fillOpacity={0.6}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                <div className="content-card">
                  <h3>Revenue by Category</h3>
                  <ResponsiveContainer width="100%" height={240}>
                    <Treemap
                      data={revenueTreeData}
                      dataKey="size"
                      stroke="#fff"
                      fill="#5b21b6"
                    />
                  </ResponsiveContainer>
                </div>
              </div>
            ))}

          {/* CHILD ROUTES */}
          <Outlet />
        </section>
      </div>
    </>
  );
};

export default AdminDashboard;
