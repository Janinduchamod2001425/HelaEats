import { Link } from "react-router-dom";
import heroImage from "/logo/HelaEatsMask1.svg"; // Update with your image path
import logoImage from "/logo/CompanyLogo.svg"; // Update with your image path
import { motion } from "framer-motion";

const rightSideVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const IntroPage = () => {
  return (
    <div className="h-screen overflow-hidden flex flex-col md:flex-row bg-white pt-[60px]">
      {/* Left Side Image */}
      <div className="w-full md:w-1/2 h-64 md:h-full">
        <img
          src={heroImage}
          alt="Food delivery"
          className="w-[680px] h-[] object-cover sm:mt-0 mt-30"
        />
      </div>

      {/* Right Side Content */}
      <motion.div
        className="w-full md:w-1/2 flex flex-col justify-center items-center px-6 py-10 text-center sm:mr-16"
        variants={rightSideVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Gradient Blobs */}
        <div className="absolute top-10 left-0 w-60 h-60 bg-gradient-to-br from-yellow-300 to-red-400 opacity-40 rounded-full blur-3xl z-0" />
        <div className="absolute bottom-10 right-0 w-72 h-72 bg-gradient-to-tr from-red-500 to-red-800 opacity-30 rounded-full blur-2xl z-0" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-red-800 via-yellow-400 to-red-300 opacity-10 rounded-full blur-3xl z-0" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-red-800 via-yellow-400 to-red-300 opacity-10 rounded-full blur-3xl z-0" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-red-900 via-yellow-400 to-red-600 opacity-10 rounded-full blur-3xl z-0" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-red-200 via-yellow-200 to-red-900 opacity-10 rounded-full blur-3xl z-0" />

        {/*Logo of the company*/}
        <img
          src={logoImage}
          alt="Food delivery"
          className="sm:w-[150px] sm:h-[150px] w-[100px] h-[100px] object-cover mb-8 sm:mt-0 mt-28"
        />

        {/* Tagline */}
        <span className="uppercase text-sm tracking-widest font-macondo font-bold text-red-900 bg-yellow-100 px-3 py-1.5 rounded-full mb-4">
          Sri Lankan Flavor, Delivered
        </span>

        {/* Title and Description */}
        <h1 className="text-5xl font-bold mb-4 font-inter">
          Welcome to Hela Eats!
        </h1>
        <p className="sm:text-3xl text-xl mb-6 max-w-md font-caveat">
          Explore, order, and enjoy delicious food <br /> delivered to your door
          with speed and ease.
        </p>

        {/* Call-to-Action Buttons */}
        <div className="space-x-6 mt-2">
          <Link
            to="/login"
            className="px-8 py-3 border-white bg-yellow-400 text-black rounded-xl font-semibold transition-all duration-300 transform border border-transparent hover:bg-white hover:border-black hover:text-black"
          >
            Log In
          </Link>

          <Link
            to="/signup"
            className="px-8 py-3 border border-white bg-black rounded-xl text-white hover:bg-white hover:border-black hover:text-black transform transition-all duration-300"
          >
            Sign Up
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default IntroPage;
