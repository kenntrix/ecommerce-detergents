import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Homepage from "./pages/Homepage.jsx";
import LoginPage from "./pages/authentication/LoginPage.jsx";
import RegisterPage from "./pages/authentication/RegisterPage.jsx";
import NavbarHeader from "./components/NavbarHeader.jsx";
import OnlyUserPrivateRoute from "./components/OnlyUserPrivateRoute.jsx";
import OrdersPage from "./pages/users/OrdersPage.jsx";
import UserProfilePage from "./pages/users/UserProfilePage.jsx";
import TrackOrder from "./pages/users/TrackOrder.jsx";
import CheckoutPage from "./pages/products/CheckoutPage.jsx";
import FooterSection from "./components/FooterSection.jsx";
import CartPage from "./pages/products/CartPage.jsx";
import ProductItemsPage from "./pages/products/ProductItemsPage.jsx";
import ProductPage from "./pages/products/ProductsPage.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <NavbarHeader />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/product/:id" element={<ProductItemsPage />} />
        <Route path="/products" element={<ProductPage />} />

        <Route element={<OnlyUserPrivateRoute />}>
          <Route path="/my-orders" element={<OrdersPage />} />
          <Route path="/track-orders" element={<TrackOrder />} />
          <Route path="/user-profile" element={<UserProfilePage />} />
        </Route>
      </Routes>
      <FooterSection />
    </BrowserRouter>
  );
}
