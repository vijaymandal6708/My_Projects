import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <>
      <Header />

      {/* MAIN CONTENT OFFSET */}
      <div style={{ marginTop: "135px" }}>
        <Outlet />
      </div>
    </>
  );
};

export default AdminLayout;
