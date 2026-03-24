import { motion } from "framer-motion";
import Lottie from "lottie-react";

import { styles } from "../styles";
import techLoop from "../assets/webbg.json";
import IntroCard from "../components/Introcard"; // ✅ Check path

const Hero = () => {
  return (
    <section className="relative w-full h-screen overflow-hidden bg-black-100">

      {/* Lottie Background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <Lottie animationData={techLoop} loop autoplay className="w-full h-full" />
      </div>

      {/* Main Content - Centered */}
      <div className="relative z-10 w-full h-full flex justify-center items-center px-4">
        <IntroCard />
      </div>

      {/* Scroll Indicator */}
      <div className="absolute xs:bottom-10 bottom-32 w-full flex justify-center items-center z-10">
        <a href="#about">
          <div className="w-[35px] h-[64px] rounded-3xl border-4 border-secondary flex justify-center items-start p-2">
            <motion.div
              animate={{ y: [0, 24, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "loop",
              }}
              className="w-3 h-3 rounded-full bg-secondary mb-1"
            />
          </div>
        </a>
      </div>
    </section>
  );
};

export default Hero;
