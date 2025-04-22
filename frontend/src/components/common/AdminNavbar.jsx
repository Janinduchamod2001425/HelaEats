import { Link } from "react-router-dom";

function AdminNavbar() {
  return (
    <div className="w-full px-4 md:px-6 py-3 shadow-md bg-black flex flex-wrap items-center justify-between fixed top-0 left-0 z-50">
      {/* Left: Menu + Logo + Toggle */}
      <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0 w-full sm:w-auto mb-3 sm:mb-0">
        <Link
          to="/systemadmin/dashboard"
          className="flex items-center space-x-2"
        >
          <h1 className="text-lg md:text-xl font-bold tracking-tight">
            <span className="font-bold text-white">Hela</span>{" "}
            <span className="font-extrabold text-yellow-300">
              Eats{" "}
              <span className="text-gray-400 font-caveat">Administration</span>
            </span>
          </h1>
        </Link>
      </div>

      {/* Right: Cart + Profile */}
      <div className="hidden md:flex items-center gap-5 mt-3 sm:mt-0">
        <Link
          to="/profile"
          className="px-4 py-2 bg-yellow-300 rounded-xl font-semibold hover:bg-yellow-400 transition-all"
        >
          Profile
        </Link>
      </div>
    </div>
  );
}

export default AdminNavbar;
