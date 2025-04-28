import { Link } from "react-router-dom";
import heroImage from "/logo/HelaEatsMask1.svg";
import logoImage from "/logo/CompanyLogo.svg";
import { motion } from "framer-motion";

const rightSideVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const SystemAdminIntroPage = () => {
  return (
    <div className="h-screen overflow-hidden flex flex-col md:flex-row bg-white pt-[50px]">
      {/* Left Side Image */}
      <div className="w-full md:w-1/2 h-64 md:h-full">
        <img
          src={heroImage}
          alt="Admin Management"
          className="w-[680px] object-contain sm:mt-0 mt-30"
        />
      </div>

      {/* Right Side Content */}
      <motion.div
        className="w-full md:w-1/2 flex flex-col justify-center items-center px-6 py-10 text-center sm:mr-16 sm:mt-[5px] mt-56"
        variants={rightSideVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Gradient Blobs */}
        <div className="absolute top-10 left-0 w-60 h-60 bg-gradient-to-br from-yellow-300 to-red-400 opacity-40 rounded-full blur-3xl z-0" />
        <div className="absolute bottom-10 right-0 w-72 h-72 bg-gradient-to-tr from-red-500 to-red-800 opacity-30 rounded-full blur-2xl z-0" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-red-800 via-yellow-400 to-red-300 opacity-10 rounded-full blur-3xl z-0" />

        {/* Company Logo */}
        <img
          src={logoImage}
          alt="Admin Panel"
          className="hidden lg:block sm:w-[110px] sm:h-[110px] w-[100px] h-[100px] object-cover mb-6 sm:mt-0 mt-28"
        />

        {/* Admin Tagline */}
        <span className="uppercase text-sm tracking-widest font-macondo font-bold text-red-900 bg-yellow-100 px-3 py-1.5 rounded-full mb-4">
          System Administration Panel
        </span>

        {/* Title and Description */}
        <h1 className="text-4xl font-semibold mb-4 font-inter">
          Manage the <span className="font-extrabold">Hela Eats</span> Ecosystem
        </h1>
        <p className="sm:text-2xl text-lg mb-6 max-w-md font-caveat">
          Oversee users, vendors, delivery partners, and platform health — all
          from one place.
        </p>

        {/* Admin Call-to-Action Buttons */}
        <div className="space-x-6 mt-2">
          <Link
            to="/admin/login"
            className="px-8 py-2 border-white bg-yellow-400 text-black rounded-3xl font-semibold transition-all duration-300 transform border border-transparent hover:bg-white hover:border-black hover:text-black"
          >
            Admin Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default SystemAdminIntroPage;
