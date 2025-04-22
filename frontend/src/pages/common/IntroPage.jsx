import { Link } from "react-router-dom";
import heroImage from "/logo/HelaEatsMask1.svg";
import logoImage from "/logo/CompanyLogo.svg";
import { motion } from "framer-motion";

import { UtensilsCrossed, Bike } from "lucide-react";

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
        className="w-full md:w-1/2 flex flex-col justify-center items-center px-6 py-10 text-center sm:mr-16 sm:mt-[5px] mt-16"
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
          className="hidden lg:block sm:w-[110px] sm:h-[110px] w-[100px] h-[100px] object-cover mb-6 sm:mt-2 mt-28"
        />

        {/* Tagline */}
        <span className="uppercase text-sm tracking-widest font-macondo font-bold text-red-900 bg-yellow-100 px-3 py-1.5 rounded-full mb-4">
          Sri Lankan Flavor, Delivered
        </span>

        {/* Title and Description */}
        <h1 className="text-5xl font-semibold mb-4 font-inter">
          Welcome to Hela <span className="font-extrabold">Eats!</span>
        </h1>
        <p className="sm:text-3xl text-xl mb-6 max-w-md font-caveat">
          Explore, order, and enjoy delicious food <br /> delivered to your door
          with speed and ease.
        </p>

        {/* Call-to-Action Buttons */}
        <div className="space-x-6 mt-2">
          <Link
            to="/login"
            className="px-8 py-2 border-white bg-yellow-400 text-black rounded-3xl font-semibold transition-all duration-300 transform border border-transparent hover:bg-white hover:border-black hover:text-black"
          >
            Log In
          </Link>

          <Link
            to="/signup"
            className="px-8 py-2 border border-white bg-black rounded-3xl text-white hover:bg-white hover:border-black hover:text-black transform transition-all duration-300"
          >
            Sign Up
          </Link>
        </div>

        {/* Divider Line */}
        <div className="w-full max-w-md my-6 border-t border-gray-400"></div>

        {/* Partner With Us Section */}
        <div className="text-center z-10 w-full max-w-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-2 sm:mt-0 mt-3">
            🚚🍕 Partner With Us
          </h2>
          <p className="text-sm text-gray-600 mb-4 font-comfort">
            Join our fast-growing platform as a restaurant or a delivery partner
            and grow your business with us!
          </p>
          <div className="flex sm:flex-row gap-4 justify-center sm:mt-0 mt-4">
            <a
              href="https://forms.gle/Fi9cCfkVNSdhHtok6"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-1 text-sm font-semibold rounded-xl bg-gray-200 text-black border-2 hover:bg-black hover:text-white transition ease-in duration-300"
            >
              <UtensilsCrossed size={16} />
              Register Restaurant
            </a>
            <a
              href="https://forms.gle/TYqeu8t9mqci6PzH6"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-1 text-sm font-semibold rounded-xl bg-gray-200 text-black border-2 hover:bg-black hover:text-white transition ease-in duration-300"
            >
              <Bike size={16} />
              Delivery Partner
            </a>
          </div>
        </div>

        {/* Hidden Admin Portal Link */}
        <div className="text-xs text-gray-400 sm:mt-6 mt-3 hover:text-gray-600 transition z-10">
          <Link to="/admin/intro" className="underline">
            Admin Portal
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default IntroPage;
