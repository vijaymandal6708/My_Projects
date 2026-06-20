import { Link, useNavigate, useLocation } from "react-router-dom";
import { IoSearchOutline, IoCheckmarkCircleSharp, IoNotificationsOutline } from "react-icons/io5";
import { FaRegHeart } from "react-icons/fa";
import { FiShoppingCart, FiShoppingBag, FiPlusCircle, FiExternalLink } from "react-icons/fi"; 
import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

const Header = () => {
  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  /* ===== ROLE CHECK STATE ===== */
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminAlerts] = useState(3); // Real-time metric notifications fallback

  const navigate = useNavigate();
  const location = useLocation();

  const cartData = useSelector((state) => state.mycart.cart || []);
  const wishlistData = useSelector((state) => state.mycart.wishlist || []);

  const debounceRef = useRef(null);
  const hideTimeoutRef = useRef(null);

  /* ===== VERIFY AUTH STATUS & ROLE ON MOUNT / NAVIGATION ===== */
  useEffect(() => {
    const adminToken = localStorage.getItem("admintoken");
    if (adminToken) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [location.pathname]);

  /* ===== RESET SEARCH ===== */
  const resetSearch = () => {
    setSearchText("");
    setSuggestions([]);
    setShowSuggestions(false);
  };

  /* ===== KEEP SEARCH TEXT ONLY ON LIVE SEARCH PAGES ===== */
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("q");

    if ((location.pathname === "/search" || location.pathname.includes("search")) && q) {
      setSearchText(q);
    } else {
      resetSearch();
    }
  }, [location.pathname, location.search]);

  /* ===== AUTO SUGGEST (Disabled while on Admin paths) ===== */
  useEffect(() => {
    if (!searchText.trim() || isAdmin) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKENDURL}/product/search?q=${searchText}`,
        );
        setSuggestions(data);
        setShowSuggestions(true);
      } catch (err) {
        console.error(err);
      }
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [searchText, isAdmin]);

  /* ===== DYNAMIC ROUTING VIA GLOBAL INPUT FIELD ===== */
  const handleSearch = () => {
    if (!searchText.trim()) return;
    setShowSuggestions(false);

    if (isAdmin) {
      // Internal system filtering rules
      if (searchText.toLowerCase().startsWith("order")) {
        navigate(`/admin-dashboard/orders?q=${encodeURIComponent(searchText)}`);
      } else {
        navigate(`/admin-dashboard/products?q=${encodeURIComponent(searchText)}`);
      }
    } else {
      navigate(`/search?q=${encodeURIComponent(searchText)}`);
    }
  };

  const handleSuggestionClick = (name) => {
    setShowSuggestions(false);
    navigate(`/search?q=${encodeURIComponent(name)}`);
  };

  const handleMouseLeave = () => {
    hideTimeoutRef.current = setTimeout(() => {
      setShowSuggestions(false);
    }, 120);
  };

  const handleMouseEnter = () => {
    clearTimeout(hideTimeoutRef.current);
    if (searchText && suggestions.length > 0 && !isAdmin) {
      setShowSuggestions(true);
    }
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

        a {
          text-decoration: none;
          font-style: italic;
        }

        .header-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 2000;
          background: white;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }

        .top-header-row {
          width: 100%;
          border-bottom: 1px solid #eee;
        }

        .top-header-content {
          max-width: 1200px; 
          margin: 0 auto;
          height: 65px;
          display: flex;
          padding: 0 20px;
          align-items: center;
          justify-content: space-between;
        }

        .left-container {
          display: flex;
          align-items: center;
          gap: 25px;
          font-size: 14px;
        }

        .left-container a {
          color: black;
          font-weight: 500;
        }

        .logo {
          height: 40px;
          width: 190px;
          display: flex;
          align-items: center;
          margin-left: -20px;
          cursor: pointer;
        }

        .logo p {
          font-weight: 900;
          font-size: 20px;
          margin: 0;
          color: black;
          font-style: normal;
        }

        .circle {
          height: 17px;
          width: 17px;
          background: ${isAdmin ? "#7c3aed" : "#0987f5cf"}; /* Purple tone if Admin */
          border-radius: 50%;
          position: relative;
          top: -1px;
          left: 10px;
          opacity: 0.4;
        }

        .badge-pill {
          background: #7c3aed;
          color: white;
          font-size: 11px;
          font-weight: bold;
          font-style: normal;
          padding: 3px 8px;
          border-radius: 12px;
          margin-left: -10px;
        }

        .right-container {
          display: flex;
          align-items: center;
          gap: 15px;
          justify-content: flex-end;
        }

        .orders-container,
        .wishlist-container,
        .cart-container,
        .admin-action-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          cursor: pointer;
          font-size: 20px;
          width: 35px;
          height: 35px;
          color: black;
          transition: color 0.2s;
        }

        .orders-container:hover,
        .wishlist-container:hover,
        .cart-container:hover,
        .admin-action-icon:hover {
          color: #4b0082;
        }

        .wishlist-container span,
        .cart-container span,
        .admin-action-icon .count-badge {
          position: absolute;
          top: -2px;
          right: -4px;
          font-size: 8px;
          background: red;
          color: white;
          border-radius: 50%;
          padding: 2px 5px;
          font-weight: 700;
        }

        .orders-success-badge {
          position: absolute;
          top: -1px;
          right: -2px;
          color: #2ecc71;
          background: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 1px 4px rgba(0,0,0,0.15);
        }

        .bottom-header-row {
          width: 100%;
          background: ${isAdmin ? "#0f172a" : "#0c0243"}; /* Swaps to Slate Dark for Admin Layout */
          transition: background 0.3s;
        }

        .bottom-header-content {
          max-width: 1200px;
          margin: 0 auto;
          height: 69px;
          display: flex;
          padding: 0 20px;
          align-items: center;
          justify-content: space-between;
          overflow: visible;
        }

        .bottom-header-links {
          display: flex;
          align-items: center;
          gap: 25px;
        }

        .bottom-header-content a {
          color: white;
          font-weight: 600;
          cursor: pointer;
          font-size: 16px;
        }

        /* ===== SEARCH BAR ===== */
        .search-bar {
          height: 35px;
          width: 100%;
          max-width: 600px;
          border-radius: 5px;
          background: white;
          display: flex;
          align-items: center;
          font-size: 14px;
          position: relative;
        }

        .search-icon {
          font-size: 18px;
          padding-left: 10px;
        }

        .search-bar input {
          flex: 1;
          border: none;
          padding: 5px 15px;
          outline: none;
        }

        .search-button {
          height: 35px;
          width: 80px;
          background-color: ${isAdmin ? "#7c3aed" : "red"};
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          border-top-right-radius: 5px;
          border-bottom-right-radius: 5px;
        }

        /* ===== SUGGESTIONS ===== */
        .suggestions {
          position: absolute;
          top: 38px;
          left: 0;
          width: 100%;
          background: white;
          border-radius: 6px;
          box-shadow: 0 8px 30px rgba(0,0,0,0.25);
          max-height: 250px;
          overflow-y: auto;
          z-index: 9999;
        }

        .suggestion-item {
          padding: 10px 16px;
          cursor: pointer;
          font-size: 14px;
          border-bottom: 1px solid #eee;
          text-transform: lowercase;
          color: #333;
        }

        .suggestion-item:hover {
          background: #f5f5f5;
        }

        .profile {
          width: 35px;
          background: #e2e8f0;
          aspect-ratio: 1 / 1;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: bold;
          color: #334155;
        }
      `}</style>

      <div className="header-container">
        {/* TOP ROW */}
        <div className="top-header-row">
          <div className="top-header-content">
            <div className="left-container">
              <div
                className="logo"
                onClick={() => {
                  resetSearch();
                  navigate(isAdmin ? "/admin-dashboard" : "/home");
                }}
              >
                <div className="circle"></div>
                <p>.Gadget Galaxy</p>
              </div>
              
              {!isAdmin ? (
                <>
                  <Link to="/home" onClick={resetSearch}>Home</Link>
                  <Link to="/categories/smartphones" onClick={resetSearch}>Smartphones</Link>
                  <Link to="/categories/laptops" onClick={resetSearch}>Laptops</Link>
                  <Link to="/categories/speakers" onClick={resetSearch}>Speakers</Link>
                  <Link to="/categories/cameras" onClick={resetSearch}>Cameras</Link>
                </>
              ) : (
                <>
                </>
              )}
            </div>

            <div className="right-container">
              {!isAdmin ? (
                <>
                  {/* Customer Options */}
                  <div className="wishlist-container" title="Wishlist" onClick={() => { resetSearch(); navigate("/wishlist"); }}>
                    <span>{wishlistData.length}</span>
                    <FaRegHeart />
                  </div>

                  <div className="cart-container" title="Cart" onClick={() => { resetSearch(); navigate("/cart"); }}>
                    <span>{cartData.length}</span>
                    <FiShoppingCart />
                  </div>

                  <div className="orders-container" title="My Orders" onClick={() => { resetSearch(); navigate("/orders"); }}>
                    <span className="orders-success-badge">
                      <IoCheckmarkCircleSharp style={{ fontSize: "14px" }} />
                    </span>
                    <FiShoppingBag style={{ fontSize: "22px" }} />
                  </div>
                </>
              ) : (
                <>
                  {/* Admin Tools */}

                  <div className="admin-action-icon" title="System Alerts">
                    {adminAlerts > 0 && <span className="count-badge">{adminAlerts}</span>}
                    <IoNotificationsOutline style={{ fontSize: "22px" }} />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* BOTTOM ROW */}
        <div className="bottom-header-row">
          <div className="bottom-header-content">
            <div
              className="search-bar"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div className="search-icon">
                <IoSearchOutline />
              </div>

              <input
                value={searchText}
                placeholder={isAdmin ? "Search database matching SKUs, Order IDs..." : "Search products"}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />

              <div className="search-button" onClick={handleSearch}>
                {isAdmin ? "Query" : "Search"}
              </div>

              {/* Dynamic Customer Search Suggest Dropdowns */}
              {showSuggestions && suggestions.length > 0 && !isAdmin && (
                <div className="suggestions">
                  {suggestions.map((item) => (
                    <div
                      key={item._id}
                      className="suggestion-item"
                      onMouseDown={() => handleSuggestionClick(item.name.toLowerCase())}
                    >
                      {item.name.toLowerCase()}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bottom-header-links">
              <span style={{ cursor: "pointer", color: "white", fontWeight: 600 }} onClick={handleLogout}>
                ⏻ Logout
              </span>
              <div className="profile">{isAdmin ? "A" : "U"}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;