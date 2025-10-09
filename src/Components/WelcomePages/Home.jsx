import React from "react";
import { motion } from "framer-motion";

const WelcomePage = () => {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-between bg-white text-gray-800 font-sans relative overflow-hidden"
      style={{
        backgroundImage:
          "url('https://www.transparenttextures.com/patterns/food.png')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Floating Emojis */}
      <motion.div
        className="absolute text-4xl top-10 left-8"
        animate={{ y: [0, 15, 0], rotate: [0, 15, -15, 0] }}
        transition={{ repeat: Infinity, duration: 5 }}
      >
        🍔
      </motion.div>
      <motion.div
        className="absolute text-4xl bottom-28 right-10"
        animate={{ y: [0, -15, 0] }}
        transition={{ repeat: Infinity, duration: 6 }}
      >
        🍕
      </motion.div>
      <motion.div
        className="absolute text-3xl top-1/3 right-1/4"
        animate={{ rotate: [0, 15, -15, 0] }}
        transition={{ repeat: Infinity, duration: 7 }}
      >
        🍽️
      </motion.div>

      {/* Top Header */}
      <div className="w-full flex justify-between items-center px-6 pt-6 z-10">
        <motion.p
          className="text-gray-700 font-medium"
          animate={{ opacity: [0, 1, 0.8, 1], y: [0, -5, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          Welcome 🙂
        </motion.p>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="bg-yellow-400 text-gray-800 font-semibold px-4 py-1 rounded-full shadow hover:bg-yellow-500 transition-transform"
          style={{ fontSize: "14px" }}
        >
          Next
        </motion.button>
      </div>

      {/* Text Section */}
      <motion.div
        className="flex flex-col items-center text-center px-6 mt-10 space-y-4 z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <motion.h2
          className="text-3xl font-bold leading-snug text-gray-800"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          Campus Dining Life Made{" "}
          <span className="text-blue-700 font-extrabold">10x Easier</span>
        </motion.h2>

        <p
          className="text-gray-600 text-base max-w-sm leading-relaxed"
          style={{ fontSize: "15px" }}
        >
          No more dining hassles — Igifu makes campus meals digital, fast,
          secure & stress-free. Enjoy a smarter student experience.
        </p>

        {/* Interactive Animated Emoji */}
        <motion.div
          className="mt-4 text-3xl"
          animate={{ y: [0, -15, 0], rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          🍽️
        </motion.div>

        {/* Pagination Dots */}
        <div className="flex space-x-2 mt-6">
          <motion.span
            className="w-2.5 h-2.5 bg-blue-700 rounded-full"
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
          ></motion.span>
          <span className="w-2.5 h-2.5 bg-gray-300 rounded-full"></span>
          <span className="w-2.5 h-2.5 bg-gray-300 rounded-full"></span>
        </div>
      </motion.div>

      {/* Bottom Buttons */}
      <div className="flex flex-col items-center w-full px-8 pb-10 space-y-3 z-10">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full bg-white border border-blue-600 text-blue-700 font-semibold py-3 rounded-full shadow hover:bg-blue-50 transition-transform"
          style={{ maxWidth: "340px" }}
        >
          Sign Up
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-full shadow hover:bg-blue-700 transition-transform"
          style={{ maxWidth: "340px" }}
        >
          Log In
        </motion.button>
      </div>

      {/* Footer */}
      <footer className="w-full text-center pb-4 text-gray-500 text-xs z-10">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          © {new Date().getFullYear()} Igifu Digital Meals — All Rights Reserved 🍴
        </motion.p>
      </footer>
    </div>
  );
};

export default WelcomePage;
