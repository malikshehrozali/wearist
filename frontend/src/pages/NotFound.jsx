/*eslint no-unused-vars: "off"*/

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-black px-6">
      {/* Animated 404 */}
      <motion.h1
        initial={{ scale: 0.8, opacity: 0, rotate: -20 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ duration: 0.6 }}
        className="text-[6rem] font-extrabold tracking-widest text-[#FE9B36]"
      >
        404
      </motion.h1>

      {/* Message */}
      <p className="mt-4 text-lg md:text-xl text-center">
        Oops! The page you’re looking for doesn’t exist.
      </p>

      {/* Button */}
      <Link
        to="/"
        className="mt-8 flex items-center gap-2 bg-[#FE9B36] hover:bg-black hover:text-white transition-all duration-300 px-6 py-3 rounded-2xl font-semibold shadow-lg"
      >
        <Home size={20} />
        Go Back Home
      </Link>
    </div>
  );
}
