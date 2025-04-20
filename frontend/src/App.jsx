import { useAuthStore } from "./store/useAuthStore.js";
import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import Navbar from "./components/common/Navbar.jsx";
import PublicNavbar from "./components/common/PublicNavbar.jsx";

// Lottie Animation
import Lottie from "lottie-react";
import burgerAnimation from "./assets/burger.json";

// Pages
import HomePage from "./pages/common/HomePage.jsx";
import SignUpPage from "./pages/auth/SignUpPage.jsx";
import LoginPage from "./pages/auth/LoginPage.jsx";
import ProfilePage from "./pages/auth/ProfilePage.jsx";
import IntroPage from "./pages/common/IntroPage.jsx";
import CartPage from "./components/order/CartPage.jsx";

function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const [isAppLoading, setIsAppLoading] = useState(true); // Splash screen state
  const location = useLocation();

  // Initial mount effect
  useEffect(() => {
    // Splash animation: show for 1.8 s
    const timer = setTimeout(() => {
      setIsAppLoading(false);
    }, 3000);

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
  const isPublicPath = publicPaths.includes(location.pathname) && !authUser;

  return (
    <div className="min-h-screen flex flex-col">
      {isPublicPath ? <PublicNavbar /> : <Navbar />}

      <main className="flex-grow">
        <Routes>
          <Route path="/intro" element={<IntroPage />} />
          <Route
            path="/"
            element={authUser ? <HomePage /> : <Navigate to="/intro" />}
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
        </Routes>
      </main>
    </div>
  );
}

export default App;
