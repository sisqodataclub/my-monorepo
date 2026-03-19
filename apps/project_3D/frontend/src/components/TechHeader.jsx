import React from "react";
import { motion } from "framer-motion";
import { textVariant } from "../utils/motion";

const TechHeader = ({ title = "Technical Skills" }) => {
  return (
    <motion.div
      variants={textVariant()}
      initial="hidden"
      animate="show"
      className="flex flex-col items-center justify-center mb-12"
    >
      <div className="flex items-center gap-4">
        {/* Left Decoration */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="flex flex-col justify-center items-center"
        >
          <div className="w-4 h-4 rounded-full bg-[#915EFF]" />
          <div className="w-1 h-20 sm:h-28 violet-gradient mt-1" />
        </motion.div>

        {/* Animated Title */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="relative"
        >
          <h2 className="text-white text-4xl sm:text-5xl font-extrabold text-center">
            {title.split(" ").slice(0, -1).join(" ")}{" "}
            <span className="text-[#915EFF]">{title.split(" ").slice(-1)}</span>
          </h2>

          {/* Underline Animation */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 1, delay: 0.6 }}
            className="h-1 bg-[#915EFF] mt-2 rounded"
          />
        </motion.div>

        {/* Right Decoration */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="flex flex-col justify-center items-center"
        >
          <div className="w-4 h-4 rounded-full bg-[#915EFF]" />
          <div className="w-1 h-20 sm:h-28 violet-gradient mt-1" />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default TechHeader;
