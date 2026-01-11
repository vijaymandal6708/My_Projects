import { Route, Routes } from "react-router-dom";

/* ===== LAYOUTS ===== */
import Layout from "./Layout";
import Layout2 from "./Layout2";
import AdminLayout from "./AdminLayout";

/* ===== USER PAGES ===== */
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProductDetails from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import OrderConfirmation from "./pages/OrderConfirmation";
import Smartphones from "./pages/categories/Smartphones";
import Laptops from "./pages/categories/Laptops";
import Speakers from "./pages/categories/Speakers";
import Cameras from "./pages/categories/Cameras";
import SearchResults from "./pages/SearchResults";
import Wishlist from "./Wishlist";

/* ===== ADMIN PAGES ===== */
import AdminDashboard from "./admin/AdminDashboard";
import AddProduct from "./admin/AddProduct";
import AdminOrders from "./admin/AdminOrders";
import AdminProducts from "./admin/AdminProducts";
import AdminEditProduct from "./admin/ProductEditPage";

/* ===== COMMON ===== */
import ScrollToTop from "./components/ScrollToTop";

function App() {
  return (
    <>
      <ScrollToTop />

      <Routes>
        {/* ================= USER WEBSITE ================= */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="product/:id" element={<ProductDetails />} />
          <Route path="order-confirmation" element={<OrderConfirmation />} />
          <Route path="orders" element={<Orders />} />
          <Route path="categories/smartphones" element={<Smartphones />} />
          <Route path="categories/laptops" element={<Laptops />} />
          <Route path="categories/speakers" element={<Speakers />} />
          <Route path="categories/cameras" element={<Cameras />} />
          <Route path="search" element={<SearchResults />} />
          <Route path="wishlist" element={<Wishlist />} />
        </Route>

        {/* ================= AUTH (NO HEADER / FOOTER) ================= */}
        <Route element={<Layout2 />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        {/* ================= ADMIN ================= */}
        <Route path="/admin-dashboard" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="add-product" element={<AddProduct />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="edit-product/:id" element={<AdminEditProduct />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
