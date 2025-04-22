import { useAuthStore } from "./store/useAuthStore.js";
import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import Navbar from "./components/common/Navbar.jsx";
import PublicNavbar from "./components/common/PublicNavbar.jsx";

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
import CartPage from "./components/order/CartPage.jsx";
import SystemAdminIntroPage from "./pages/common/SystemAdminIntroPage.jsx";
import SystemAdminSignUpPage from "./pages/auth/SystemAdminSignUpPage.jsx";
import SystemAdminLoginPage from "./pages/auth/SystemAdminLoginPage.jsx";
import SystemAdminDashboardPage from "./pages/common/SystemAdminDashboardPage.jsx";
import AdminNavbar from "./components/common/AdminNavbar.jsx";
import DeliveryDashboardPage from "./pages/delivery/DeliveryDashboardPage.jsx";
import RestaurantDashboardPage from "./pages/restaurant/RestaurantDashboardPage.jsx";

function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const [isAppLoading, setIsAppLoading] = useState(true); // Splash screen state
  const location = useLocation();

  // Initial mount effect
  useEffect(() => {
    // Splash animation: show for 1.8 s
    const timer = setTimeout(() => {
      setIsAppLoading(false);
    }, 2000);

    checkAuth()
      .then(() => console.log("Auth check complete"))
      .catch((e) => console.error("Error checking auth", e));

    return () => clearTimeout(timer); // cleanup
  }, [checkAuth]);

  // Lottie splash screen (shown only once when the app loads)
  if (isAppLoading)
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <Lottie
          animationData={burgerAnimation}
          loop={true}
          style={{ width: "180px", height: "180px" }}
        />
      </div>
    );

  // Auth loading (if still checking after splash ends)
  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <Lottie
          animationData={burgerAnimation}
          loop={true}
          style={{ width: "180px", height: "180px" }}
        />
      </div>
    );

  const publicPaths = ["/intro", "/signup", "/login"];

  const adminPaths = [
    "/admin/intro",
    "/admin/login",
    "/admin/signup",
    "/admin/dashboard",
    "/delivery/dashboard",
    "/restaurant/dashboard",
  ];

  const isPublicPath = publicPaths.includes(location.pathname) && !authUser;
  const isAdminPath = adminPaths.includes(location.pathname);

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
          {/*Customer Routes*/}
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
          <Route
            path="/signup"
            element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
          />
          <Route
            path="/login"
            element={!authUser ? <LoginPage /> : <Navigate to="/" />}
          />
          <Route
            path="/profile"
            element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
          />
          <Route
            path="/cart"
            element={authUser ? <CartPage /> : <Navigate to="/login" />}
          />

          {/*System Admin Routes*/}
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
          <Route
            path="/admin/dashboard"
            element={
              authUser?.role === "system_admin" ? (
                <SystemAdminDashboardPage />
              ) : (
                <Navigate to="/" />
              )
            }
          />

          {/*Delivery and Restaurant Admin Routes*/}
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
          <Route
            path="/restaurantadmin/dashboard"
            element={
              authUser?.role === "restaurant_admin" ? (
                <RestaurantDashboardPage />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
