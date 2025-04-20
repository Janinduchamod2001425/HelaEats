import { useAuthStore } from "./store/useAuthStore.js";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar.jsx";
import { Navigate, Route, Routes } from "react-router-dom";

// Lottie Animation
import Lottie from "lottie-react";
import burgerAnimation from "./assets/burger.json";

// Pages
import HomePage from "./pages/HomePage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import IntroPage from "./pages/IntroPage.jsx";

function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const [isAppLoading, setIsAppLoading] = useState(true); // Splash screen state

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

  return (
    <div>
      <Navbar />

      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <IntroPage />} />
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
      </Routes>
    </div>
  );
}

export default App;
