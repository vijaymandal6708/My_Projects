import React from "react";
import Header from "./components/Header";
import { Outlet, NavLink } from "react-router-dom";

const AdminLayout = () => {
  return (
    <>
      <Header />

      {/* ================= GLOBAL ADMIN CONTAINER CSS ================= */}
      <style>{`
        * {
          box-sizing: border-box;
          font-family: Inter, system-ui, sans-serif;
        }
        body {
          background: #f6f7fb;
          margin: 0;
        }
        .admin-layout {
          display: flex;
          min-height: 100vh;
        }
        .admin-sidebar {
          width: 260px;
          background: #0f172a;
          color: #fff;
          padding: 24px;
          position: fixed;
          top: 134px; /* Sits perfectly below your 2-row AdminHeader */
          left: 0;
          height: calc(100vh - 134px);
          overflow-y: auto;
        }
        .brand {
          font-size: 22px;
          margin-bottom: 40px;
          font-weight: 700;
        }
        .admin-sidebar nav a {
          display: block;
          padding: 12px;
          margin-bottom: 6px;
          border-radius: 8px;
          color: #cbd5f5;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
        }
        .admin-sidebar nav .active,
        .admin-sidebar nav a:hover {
          background: rgba(255, 255, 255, 0.12);
          color: #fff;
        }
        .admin-main-content-window {
          flex: 1;
          padding: 30px;
          margin-left: 260px; /* Pushes the page view safely to the right side of the sidebar */
          margin-top: 134px;  /* Clears the top fixed AdminHeader offset space */
        }
        @media (max-width: 768px) {
          .admin-layout { flex-direction: column; }
          .admin-sidebar { width: 100%; position: relative; top: 0; height: auto; }
          .admin-main-content-window { margin-left: 0; margin-top: 0; }
        }
      `}</style>

      <div className="admin-layout">
        {/* PERSISTENT LEFT SIDEBAR */}
        <aside className="admin-sidebar">
          <h2 className="brand">Seller Dashboard</h2>
          <nav>
            {/* Navigating here will load the index component (AdminDashboard charts) */}
            <NavLink to="/admin-dashboard" end>Dashboard</NavLink>
            <NavLink to="products">Products</NavLink>
            <NavLink to="add-product">Add Product</NavLink>
            <NavLink to="orders">Orders</NavLink>
          </nav>
        </aside>

        {/* DYNAMIC RIGHT VIEW WINDOW SLOT */}
        <main className="admin-main-content-window">
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default AdminLayout;