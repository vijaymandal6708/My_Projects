import { Link, useNavigate, useLocation } from "react-router-dom";
import { IoSearchOutline } from "react-icons/io5";
import { FaRegHeart } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

const Header = () => {
  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const cartData = useSelector((state) => state.mycart.cart);
  const wishlistData = useSelector((state) => state.mycart.wishlist);

  const debounceRef = useRef(null);
  const hideTimeoutRef = useRef(null);

  /* ===== RESET SEARCH (USED EVERYWHERE) ===== */
  const resetSearch = () => {
    setSearchText("");
    setSuggestions([]);
    setShowSuggestions(false);
  };

  /* ===== KEEP SEARCH TEXT ONLY ON SEARCH PAGE ===== */
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("q");

    if (location.pathname === "/search" && q) {
      setSearchText(q);
    } else {
      resetSearch();
    }
  }, [location.pathname, location.search]);

  /* ===== AUTO SUGGEST ===== */
  useEffect(() => {
    if (!searchText.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKENDURL}/product/search?q=${searchText}`
        );
        setSuggestions(data);
        setShowSuggestions(true);
      } catch (err) {
        console.error(err);
      }
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [searchText]);

  /* ===== SEARCH ACTION ===== */
  const handleSearch = () => {
    if (!searchText.trim()) return;
    setShowSuggestions(false);
    navigate(`/search?q=${encodeURIComponent(searchText)}`);
  };

  /* ===== SUGGESTION CLICK ===== */
  const handleSuggestionClick = (name) => {
    setShowSuggestions(false);
    navigate(`/search?q=${encodeURIComponent(name)}`);
  };

  /* ===== PREVENT FLICKER ON SLOW MOUSE ===== */
  const handleMouseLeave = () => {
    hideTimeoutRef.current = setTimeout(() => {
      setShowSuggestions(false);
    }, 120);
  };

  const handleMouseEnter = () => {
    clearTimeout(hideTimeoutRef.current);
    if (searchText && suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  return (
    <>
      <style>{`
        * { box-sizing: border-box; font-family: sans-serif; }

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
        }

        .top-header-container {
          height: 65px;
          display: flex;
          padding: 12px 225px;
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
          font-weight: 900;
          font-size: 20px;
          padding-top: 5px;
          margin-left: -10px;
          cursor: pointer;
        }

        .circle {
          height: 17px;
          width: 17px;
          background: #0987f5cf;
          border-radius: 50%;
          position: relative;
          top: -3px;
          left: 10px;
          opacity: 0.4;
        }

        .right-container {
          display: flex;
          width: 90px;
        }

        .wishlist-container,
        .cart-container {
          width: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          cursor: pointer;
          font-size: 20px;
        }

        .wishlist-container span,
        .cart-container span {
          position: absolute;
          top: -4px;
          right: -2px;
          font-size: 7px;
          background: red;
          color: white;
          border-radius: 50%;
          padding: 2px 5px;
          font-weight: 700;
        }

        .bottom-header-container {
          position: relative;
          height: 69px;
          display: flex;
          padding: 17px 220px;
          background: #0c0243;
          gap: 25px;
          overflow: visible;
        }

        .bottom-header-container a {
          color: white;
          font-weight: 600;
        }

        /* ===== SEARCH BAR ===== */
        .search-bar {
          height: 35px;
          width: 700px;
          border-radius: 5px;
          background: white;
          display: flex;
          align-items: center;
          font-size: 14px;
          margin-right: 430px;
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
          background-color: red;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
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
        }

        .suggestion-item:hover {
          background: #f5f5f5;
        }

        .profile {
          width: 35px;
          background: white;
          aspect-ratio: 1 / 1;
          border-radius: 50%;
        }
      `}</style>

      <div className="header-container">
        <div className="top-header-container">
          <div className="left-container">
            <div
              className="logo"
              onClick={() => {
                resetSearch();
                navigate("/home");
              }}
            >
              <div className="circle"></div>
              <p>.Gadget Galaxy</p>
            </div>

            <Link to="/home" onClick={resetSearch}>Home</Link>
            <Link to="/categories/smartphones" onClick={resetSearch}>Smartphones</Link>
            <Link to="/categories/laptops" onClick={resetSearch}>Laptops</Link>
            <Link to="/categories/speakers" onClick={resetSearch}>Speakers</Link>
            <Link to="/categories/cameras" onClick={resetSearch}>Cameras</Link>
          </div>

          <div className="right-container">
            <div className="wishlist-container">
              <span>{wishlistData.length}</span>
              <FaRegHeart />
            </div>

            <div
              className="cart-container"
              onClick={() => {
                resetSearch();
                navigate("/cart");
              }}
            >
              <span>{cartData.length}</span>
              <FiShoppingCart />
            </div>
          </div>
        </div>

        <div className="bottom-header-container">
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
              placeholder="Search products"
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />

            <div className="search-button" onClick={handleSearch}>
              Search
            </div>

            {showSuggestions && suggestions.length > 0 && (
              <div className="suggestions">
                {suggestions.map((item) => (
                  <div
                    key={item._id}
                    className="suggestion-item"
                    onMouseDown={() =>
                      handleSuggestionClick(item.name.toLowerCase())
                    }
                  >
                    {item.name.toLowerCase()}
                  </div>
                ))}
              </div>
            )}
          </div>

          <Link to="/login" onClick={resetSearch}>Login</Link>
          <div className="profile"></div>
        </div>
      </div>
    </>
  );
};

export default Header;
