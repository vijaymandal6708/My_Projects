import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <Header />

      {/* MAIN CONTENT OFFSET */}
      <div style={{ marginTop: "135px" }}>
        <Outlet />
      </div>

      <Footer />
    </>
  );
};

export default Layout;
