import { Link, useNavigate, useLocation } from "react-router-dom";
import { IoSearchOutline, IoCheckmarkCircleSharp, IoNotificationsOutline } from "react-icons/io5";
import { FaRegHeart } from "react-icons/fa";
import { FiShoppingCart, FiShoppingBag } from "react-icons/fi";
import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

const Header = () => {
  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminAlerts] = useState(3);

  const navigate = useNavigate();
  const location = useLocation();

  const cartData = useSelector((state) => state.mycart.cart || []);
  const wishlistData = useSelector((state) => state.mycart.wishlist || []);
  const user = useSelector((state) => state.auth.user);

  const debounceRef = useRef(null);
  const hideTimeoutRef = useRef(null);

  // Logic for First Initial
  const getFirstInitial = (name) => {
    if (!name) return "U";
    return name.trim().split(" ")[0].charAt(0).toUpperCase();
  };

  useEffect(() => {
    setIsAdmin(!!localStorage.getItem("admintoken"));
  }, [location.pathname]);

  const resetSearch = () => {
    setSearchText("");
    setSuggestions([]);
    setShowSuggestions(false);
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("q");
    if ((location.pathname === "/search" || location.pathname.includes("search")) && q) {
      setSearchText(q);
    } else {
      resetSearch();
    }
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (!searchText.trim() || isAdmin) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_BACKENDURL}/product/search?q=${searchText}`);
        setSuggestions(data);
        setShowSuggestions(true);
      } catch (err) { console.error(err); }
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [searchText, isAdmin]);

  const handleSearch = () => {
    if (!searchText.trim()) return;
    setShowSuggestions(false);
    isAdmin 
      ? navigate(searchText.toLowerCase().startsWith("order") ? `/admin-dashboard/orders?q=${searchText}` : `/admin-dashboard/products?q=${searchText}`)
      : navigate(`/search?q=${encodeURIComponent(searchText)}`);
  };

  const handleLogout = () => {
    resetSearch();
    if (isAdmin) {
      localStorage.removeItem("admintoken");
      setIsAdmin(false);
    }
    navigate("/login");
  };

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        a { text-decoration: none; font-style: italic; }
        .header-container { position: fixed; top: 0; left: 0; width: 100%; z-index: 2000; background: white; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
        .top-header-row { width: 100%; border-bottom: 1px solid #eee; }
        .top-header-content { max-width: 1200px; margin: 0 auto; height: 65px; display: flex; padding: 0 20px; align-items: center; justify-content: space-between; }
        .left-container { display: flex; align-items: center; gap: 25px; font-size: 14px; }
        .left-container a { color: black; font-weight: 500; }
        .logo { height: 40px; width: 190px; display: flex; align-items: center; margin-left: -20px; cursor: pointer; }
        .logo p { font-weight: 900; font-size: 20px; margin: 0; color: black; font-style: normal; }
        .circle { height: 17px; width: 17px; background: ${isAdmin ? "#7c3aed" : "#0987f5cf"}; border-radius: 50%; position: relative; top: -1px; left: 10px; opacity: 0.4; }
        .right-container { display: flex; align-items: center; gap: 15px; justify-content: flex-end; }
        .orders-container, .wishlist-container, .cart-container, .admin-action-icon { display: flex; align-items: center; justify-content: center; position: relative; cursor: pointer; font-size: 20px; width: 35px; height: 35px; color: black; transition: color 0.2s; }
        .wishlist-container span, .cart-container span, .admin-action-icon .count-badge { position: absolute; top: -2px; right: -4px; font-size: 8px; background: red; color: white; border-radius: 50%; padding: 2px 5px; font-weight: 700; }
        .orders-success-badge { position: absolute; top: -1px; right: -2px; color: #2ecc71; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 1px 4px rgba(0,0,0,0.15); }
        .bottom-header-row { width: 100%; background: ${isAdmin ? "#0f172a" : "#0c0243"}; transition: background 0.3s; }
        .bottom-header-content { max-width: 1200px; margin: 0 auto; height: 69px; display: flex; padding: 0 20px; align-items: center; justify-content: space-between; }
        .search-bar { height: 35px; width: 100%; max-width: 600px; border-radius: 5px; background: white; display: flex; align-items: center; font-size: 14px; position: relative; }
        .search-bar input { flex: 1; border: none; padding: 5px 15px; outline: none; }
        .search-button { height: 35px; width: 80px; background-color: ${isAdmin ? "#7c3aed" : "red"}; color: white; display: flex; align-items: center; justify-content: center; cursor: pointer; border-top-right-radius: 5px; border-bottom-right-radius: 5px; }
        .profile { width: 35px; background: #e2e8f0; aspect-ratio: 1 / 1; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: bold; color: #334155; }
        .suggestions { position: absolute; top: 38px; left: 0; width: 100%; background: white; border-radius: 6px; box-shadow: 0 8px 30px rgba(0,0,0,0.25); max-height: 250px; overflow-y: auto; z-index: 9999; }
        .suggestion-item { padding: 10px 16px; cursor: pointer; font-size: 14px; border-bottom: 1px solid #eee; text-transform: lowercase; color: #333; }
      `}</style>

      <div className="header-container">
        <div className="top-header-row">
          <div className="top-header-content">
            <div className="left-container">
              <div className="logo" onClick={() => { resetSearch(); navigate(isAdmin ? "/admin-dashboard" : "/home"); }}>
                <div className="circle"></div>
                <p>.Gadget Galaxy</p>
              </div>
              {!isAdmin && (
                <>
                  <Link to="/home" onClick={resetSearch}>Home</Link>
                  <Link to="/categories/smartphones" onClick={resetSearch}>Smartphones</Link>
                  <Link to="/categories/laptops" onClick={resetSearch}>Laptops</Link>
                  <Link to="/categories/speakers" onClick={resetSearch}>Speakers</Link>
                  <Link to="/categories/cameras" onClick={resetSearch}>Cameras</Link>
                </>
              )}
            </div>
            <div className="right-container">
              {!isAdmin ? (
                <>
                  <div className="wishlist-container" title="Wishlist" onClick={() => navigate("/wishlist")}><FaRegHeart /><span>{wishlistData.length}</span></div>
                  <div className="cart-container" title="Cart" onClick={() => navigate("/cart")}><FiShoppingCart /><span>{cartData.length}</span></div>
                  <div className="orders-container" title="My Orders" onClick={() => navigate("/orders")}><span className="orders-success-badge"><IoCheckmarkCircleSharp style={{ fontSize: "14px" }} /></span><FiShoppingBag style={{ fontSize: "22px" }} /></div>
                </>
              ) : (
                <div className="admin-action-icon"><IoNotificationsOutline />{adminAlerts > 0 && <span className="count-badge">{adminAlerts}</span>}</div>
              )}
            </div>
          </div>
        </div>

        <div className="bottom-header-row">
          <div className="bottom-header-content">
            <div className="search-bar" onMouseEnter={() => setShowSuggestions(true)} onMouseLeave={() => setShowSuggestions(false)}>
              <div style={{ paddingLeft: 10 }}><IoSearchOutline /></div>
              <input value={searchText} placeholder={isAdmin ? "Search database..." : "Search products"} onChange={(e) => setSearchText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()} />
              <div className="search-button" onClick={handleSearch}>{isAdmin ? "Query" : "Search"}</div>
              {showSuggestions && suggestions.length > 0 && !isAdmin && (
                <div className="suggestions">{suggestions.map((item) => (<div key={item._id} className="suggestion-item" onClick={() => navigate(`/search?q=${item.name}`)}>{item.name}</div>))}</div>
              )}
            </div>
            <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
              <span style={{ cursor: "pointer", color: "white", fontWeight: 600 }} onClick={handleLogout}>⏻ Logout</span>
              <div className="profile" title={user?.name || "User"}>{isAdmin ? "A" : getFirstInitial(user?.name)}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;