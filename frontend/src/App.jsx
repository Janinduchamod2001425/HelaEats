import { useAuthStore } from "./store/useAuthStore.js";
import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import Navbar from "./components/common/Navbar.jsx";
import PublicNavbar from "./components/common/PublicNavbar.jsx";
import RestaurantLayout from "./components/restaurant/RestaurantLayout.jsx";

// Lottie Animation
import Lottie from "lottie-react";
import burgerAnimation from "./assets/burger.json";

// Toast
import { Toaster } from "react-hot-toast";

// Pages
import HomePage from "./pages/common/HomePage.jsx";
import SignUpPage from "./pages/auth/SignUpPage.jsx";
import LoginPage from "./pages/auth/LoginPage.jsx";
import ProfilePage from "./pages/auth/ProfilePage.jsx";
import IntroPage from "./pages/common/IntroPage.jsx";
// import CartPage from "./components/order/CartPage.jsx";
import SystemAdminIntroPage from "./pages/common/SystemAdminIntroPage.jsx";
import SystemAdminSignUpPage from "./pages/auth/SystemAdminSignUpPage.jsx";
import SystemAdminLoginPage from "./pages/auth/SystemAdminLoginPage.jsx";
import SystemAdminDashboardPage from "./pages/common/SystemAdminDashboardPage.jsx";
import AdminNavbar from "./components/common/AdminNavbar.jsx";
import DeliveryDashboardPage from "./pages/delivery/DeliveryDashboardPage.jsx";
import RestaurantDashboardPage from "./pages/restaurant/RestaurantDashboardPage.jsx";
import RestaurantForm from "./components/restaurant/RestaurantForm";
import MenuItemForm from "./components/restaurant/MenuItemForm";
import MenuItemEditPage from "./pages/restaurant/MenuItemEditPage.jsx";
import RestaurantMenuPage from "./pages/common/RestaurantMenuPage";
import CartPage from "./pages/common/CartPage.jsx";
import CheckoutPage from "./pages/common/CheckoutPage.jsx";
import PaymentSuccessPage from "./pages/common/PaymentSuccessPage.jsx";
import RestaurantOrdersPage from "./pages/common/RestaurantOrdersPage.jsx";
import RestaurantSettingsPage from "./components/restaurant/RestaurantSettingsPage.jsx";
import EditMenuItem from "./pages/restaurant/editMenuItem.jsx";
import PaymentDashboard from "./components/payment/PaymentDashboard.jsx";

function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const [isAppLoading, setIsAppLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;

    const initializeApp = async () => {
      try {
        await checkAuth();
        console.log("Auth check complete");
      } catch (error) {
        console.error("Error checking auth:", error);
      } finally {
        if (isMounted) {
          // Delay splash screen for animation
          setTimeout(() => setIsAppLoading(false), 2000);
        }
      }
    };

    initializeApp();

    return () => {
      isMounted = false;
    };
  }, []);

  // Show splash screen during initial load
  if (isAppLoading || (isCheckingAuth && !authUser)) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <Lottie
          animationData={burgerAnimation}
          loop={true}
          style={{ width: "180px", height: "180px" }}
        />
      </div>
    );
  }

  const publicPaths = ["/intro", "/signup", "/login"];
  const adminPaths = [
    "/admin/intro",
    "/admin/login",
    "/admin/signup",
    "/systemadmin/dashboard",
    "/delivery/dashboard",
    "/restaurant/dashboard",
  ];

  const isPublicPath = publicPaths.includes(location.pathname) && !authUser;
  const isAdminPath = adminPaths.includes(location.pathname);
  const isRestaurantPath = location.pathname.startsWith("/restaurantadmin");

  return (
    <div className="min-h-screen flex flex-col">
      {isAdminPath ? (
        <AdminNavbar />
      ) : isPublicPath ? (
        <PublicNavbar />
      ) : (
        <Navbar />
      )}

      <Toaster position="top-right" reverseOrder={false} />

      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/intro" element={<IntroPage />} />
          <Route
            path="/"
            element={
              authUser?.role === "customer" ? (
                <HomePage />
              ) : authUser ? (
                <Navigate to={`/${authUser.role.replace("_", "")}/dashboard`} />
              ) : (
                <Navigate to="/intro" />
              )
            }
          />

          {/* Auth Routes */}
          <Route
            path="/signup"
            element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
          />
          <Route
            path="/login"
            element={!authUser ? <LoginPage /> : <Navigate to="/" />}
          />

          {/* Protected Customer Routes */}
          <Route
            path="/profile"
            element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
          />
          <Route
            path="/cart"
            element={authUser ? <CartPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/checkout"
            element={authUser ? <CheckoutPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/payment-success"
            element={
              authUser ? <PaymentSuccessPage /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/payment-cancel"
            element={
              authUser ? <PaymentSuccessPage /> : <Navigate to="/login" />
            }
          />

          {/* Admin Routes */}
          <Route path="/admin/intro" element={<SystemAdminIntroPage />} />
          <Route
            path="/admin/login"
            element={
              !authUser ? (
                <SystemAdminLoginPage />
              ) : (
                <Navigate to="/admin/dashboard" />
              )
            }
          />
          <Route
            path="/admin/signup"
            element={
              authUser ? (
                <SystemAdminSignUpPage />
              ) : (
                <Navigate to="/admin/login" />
              )
            }
          />

          {/* Role-Based Dashboard Routes */}
          <Route
            path="/systemadmin/dashboard"
            element={
              authUser?.role === "system_admin" ? (
                <SystemAdminDashboardPage />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/deliverypersonnel/dashboard"
            element={
              authUser?.role === "delivery_personnel" ? (
                <DeliveryDashboardPage />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          {/* <Route
            path="/restaurantadmin/dashboard"
            element={
              authUser?.role === "restaurant_admin" ? (
                <RestaurantDashboardPage />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route path="/menu-items/:id/edit" element={<MenuItemEditPage />} /> */}
          <Route
            path="/restaurantadmin/*"
            element={
              authUser?.role === "restaurant_admin" ? (
                <RestaurantLayout>
                  <Routes>
                    <Route
                      path="dashboard"
                      element={<RestaurantDashboardPage />}
                    />
                    <Route path="orders" element={<RestaurantOrdersPage />} />
                    <Route path="menu" element={<MenuItemEditPage />} />
                    <Route path="payments" element={<PaymentDashboard />} />
                    <Route
                      path="settings"
                      element={<RestaurantSettingsPage />}
                    />
                    <Route path="menu/:id/edit" element={<EditMenuItem />} />
                  </Routes>
                </RestaurantLayout>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/restaurants/:restaurantId/menu"
            element={<RestaurantMenuPage />}
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
