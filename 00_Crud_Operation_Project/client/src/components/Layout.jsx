import { Link, Outlet } from "react-router-dom";
import "./style.css";

export const Layout = () => {
  return (
    <>
      <nav className="navbar">
        <Link to="/">Home</Link>
        <Link to="/insert">Insert</Link>
        <Link to="/display">Display</Link>
        <Link to="/search">Search</Link>
        <Link to="/update">Update</Link>
      </nav>

      <div className="container">
        <Outlet />
      </div>
    </>
  );
};
