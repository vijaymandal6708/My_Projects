import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Treemap,
} from "recharts";

const COLORS = ["#5b21b6", "#7c3aed", "#a78bfa", "#ddd6fe"];
const CATEGORY_ORDER = ["smartphones", "laptops", "accessories", "cameras"];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKENDURL}/admin/dashboard-stats`, {
          withCredentials: true,
        });
        setStats(res.data.stats);
      } catch (err) {
        console.error("Dashboard fetch failed:", err);
        if (err.response?.status === 401) navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [navigate]);

  if (loading) return <p style={{ textAlign: "center", fontSize: "18px", marginTop: "120px" }}>Loading analytics...</p>;
  if (!stats) return <p style={{ textAlign: "center" }}>No data available.</p>;

  // --- DATA PREPARATION ---
  const productCategoryData = CATEGORY_ORDER.map((cat) => {
    const found = stats.productCategories?.find((i) => i._id === cat);
    return { name: cat.toUpperCase(), value: found ? found.count : 0 };
  });

  const weeklyOrdersData = stats.weeklyOrders?.map((d) => ({
    day: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d._id - 1],
    orders: d.orders,
  })) || [];

  const revenueData = stats.monthlyRevenue?.map((m) => ({
    month: new Date(2024, m._id - 1).toLocaleString("default", { month: "short" }),
    revenue: m.revenue,
  })) || [];

  const revenueTreeData = CATEGORY_ORDER.map((cat) => {
    const found = stats.revenueByCategory?.find((i) => i._id === cat);
    return { name: cat.toUpperCase(), size: found ? found.size : 1 };
  });

  return (
    <div style={{ padding: "40px", fontFamily: "Poppins, sans-serif", background: "#f9f3fa", minHeight: "100vh" }}>
      <style>{`
        .charts-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .content-card { background: #fff; padding: 20px; border-radius: 14px; box-shadow: 0 12px 30px rgba(0,0,0,0.06); }
        .content-card h3 { margin-top: 0; margin-bottom: 15px; font-size: 16px; font-weight: 600; color: #1e293b; }
        @media (max-width: 1024px) { .charts-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 768px) { .charts-grid { grid-template-columns: 1fr; } }
      `}</style>

      <header style={{ marginBottom: "30px", textAlign: "center" }}>
        <h1 style={{ fontSize: "28px", color: "#0f172a" }}>Overview Metrics</h1>
      </header>

      <div className="charts-grid">
        <div className="content-card">
          <h3>Products by Category</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart><Pie data={productCategoryData} dataKey="value" innerRadius={60} outerRadius={90}>{productCategoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart>
          </ResponsiveContainer>
        </div>
        <div className="content-card">
          <h3>Weekly Orders</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={weeklyOrdersData}><XAxis dataKey="day" /><YAxis /><Tooltip /><Bar dataKey="orders" fill="#5b21b6" /></BarChart>
          </ResponsiveContainer>
        </div>
        <div className="content-card">
          <h3>Revenue</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={revenueData}><XAxis dataKey="month" /><YAxis /><Tooltip /><Line dataKey="revenue" stroke="#5b21b6" strokeWidth={3} /></LineChart>
          </ResponsiveContainer>
        </div>
        <div className="content-card">
          <h3>Order Trend</h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={weeklyOrdersData}><XAxis dataKey="day" /><YAxis /><Tooltip /><Area dataKey="orders" stroke="#7c3aed" fill="#ddd6fe" /></AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="content-card">
          <h3>Category Performance</h3>
          <ResponsiveContainer width="100%" height={240}>
            <RadarChart data={productCategoryData.map(c => ({ category: c.name, score: c.value * 10 }))}>
              <PolarGrid /><PolarAngleAxis dataKey="category" /><PolarRadiusAxis /><Radar dataKey="score" stroke="#5b21b6" fill="#a78bfa" fillOpacity={0.6} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <div className="content-card">
          <h3>Revenue by Category</h3>
          <ResponsiveContainer width="100%" height={240}>
            <Treemap data={revenueTreeData} dataKey="size" stroke="#fff" fill="#5b21b6" />
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;