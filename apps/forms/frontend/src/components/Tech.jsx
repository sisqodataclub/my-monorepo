import React from "react";
import { motion } from "framer-motion";

import { BallCanvas } from "./canvas";
import { SectionWrapper } from "../hoc";
import { technologies } from "../constants";
import TechHeader from "../components/TechHeader";
import { fadeIn } from "../utils/motion";

const Tech = () => {
  return (
    <>
      <TechHeader />

      {/* Tech grid as before */}
      <motion.div
        variants={fadeIn("", "", 0.3, 1)}
        initial="hidden"
        whileInView="show"
        className="flex flex-row flex-wrap justify-center gap-10"
      >
        {technologies.map((technology, index) => (
          <motion.div
            variants={fadeIn("up", "spring", index * 0.15, 0.75)}
            key={technology.name}
            className="flex flex-col items-center w-28 h-32"
          >
            <BallCanvas icon={technology.icon} />
            <p className="mt-2 text-center text-sm text-white">{technology.name}</p>
          </motion.div>
        ))}
      </motion.div>
    </>
  );
};


export default SectionWrapper(Tech, "");
