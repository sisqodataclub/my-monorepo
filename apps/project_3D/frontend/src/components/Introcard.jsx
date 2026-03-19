import { motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope } from "react-icons/fa"; // Added FaEnvelope icon

import Lottie from "lottie-react";

import helloAnimation from "../assets/hello.json"; 

const IntroCard = () => {
  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{
        // Removed scale on hover for a cleaner, more professional feel
        // while it's a nice effect, professional sites often opt for subtler interactions
        scale: 1, 
        transition: { type: "spring", stiffness: 300, damping: 25 },
      }}
      // Changed bg-transparent to a dark, slightly opaque bg for contrast
      // Removed border for a cleaner aesthetic
      className="mx-auto mt-12 w-full max-w-2xl p-8 rounded-xl bg-gray-800/70 shadow-2xl text-white backdrop-blur-sm"
    >
      <div className="mb-8">
        <div className="flex items-center mb-4">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mr-3">
                Hi, I’m <span className="text-[#915EFF]">Francis.</span>
            </h1>
            {/* Integrated the Lottie animation as a subtle greeting accent */}
            <div className="w-12 h-12 flex-shrink-0"> 
                <Lottie animationData={helloAnimation} loop={true} />
            </div>
        </div>

        {/* Updated title and added better line spacing */}
        <p className="text-xl font-semibold mb-4 text-white/90">Data Analytics and Web Developer</p>
        <p className="text-white/90 text-base sm:text-lg max-w-xl leading-relaxed">
            I build custom, scalable websites and data tools that help businesses optimize decisions and accelerate growth.
        </p>
    </div>


      <div className="mt-6 pt-4 border-t border-white/10">
        {/* Using icons for email and socials for a cleaner look */}
        <div className="flex items-center text-sm sm:text-base mb-4">
            <FaEnvelope className="mr-3 text-[#915EFF]" size={20} />
            <a href="mailto:francis@dataclubcenter.com" className="hover:text-[#915EFF] transition duration-300">
                francis@dataclubcenter.com
            </a>
        </div>
        
        <h3 className="text-lg font-semibold mb-3">Connect</h3>
        <div className="flex space-x-5">
          <a
            href="https://github.com/adrian"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#915EFF] transition duration-300 transform hover:scale-110"
            aria-label="Visit GitHub profile"
          >
            <FaGithub size={28} />
          </a>
          <a
            href="https://linkedin.com/in/adrian"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#915EFF] transition duration-300 transform hover:scale-110"
            aria-label="Visit LinkedIn profile"
          >
            <FaLinkedin size={28} />
          </a>
          <a
            href="https://twitter.com/adrian"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#915EFF] transition duration-300 transform hover:scale-110"
            aria-label="Visit Twitter profile"
          >
            <FaTwitter size={28} />
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export default IntroCard;
