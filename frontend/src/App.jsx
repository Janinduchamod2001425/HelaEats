import {useAuthStore} from "./store/useAuthStore.js";
import {useEffect} from "react";
import Navbar from "./components/Navbar.jsx";
import {Navigate, Route, Routes} from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import {Loader} from "lucide-react";
import SignUpPage from "./pages/SignUpPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import Lottie from "lottie-react";
import burgerAnimation from "./assets/burger.json";

function App() {

    const {authUser, checkAuth, isCheckingAuth} = useAuthStore();

    useEffect(() => {
        checkAuth().then(r =>
            console.log("Auth check complete", r)
        ).catch(e => {
            console.error("Error checking auth", e);
        })
    }, [checkAuth]);

    console.log({authUser});

    if (isCheckingAuth && !authUser)
        return (
            <div className="flex items-center justify-center h-screen">
                <Lottie
                    animationData={burgerAnimation}
                    loop={true}
                    style={{width: "180px", height: "180px"}}
                />
            </div>
        )

    return (
        <div>
            <Navbar/>

            <Routes>

                {/*Home Page*/}
                <Route
                    path="/"
                    element={authUser ? <HomePage/> : <Navigate to="/login"/>}
                />

                {/*Signup Page*/}
                <Route
                    path="/signup"
                    element={!authUser ? <SignUpPage/> : <Navigate to="/"/>}
                />

                {/*Login Page*/}
                <Route
                    path="/login"
                    element={!authUser ? <LoginPage/> : <Navigate to="/"/>}
                />

                {/*Profile Page*/}
                <Route
                    path="/profile"
                    element={authUser ? <ProfilePage/> : <Navigate to="/login"/>}
                />
            </Routes>
        </div>
    )
}

export default App
