import { motion } from "framer-motion";
import { styles } from "../styles";
import { ComputersCanvas } from "./canvas";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

const Hero = () => {
  return (
    <section className="relative w-full h-screen mx-auto flex flex-col lg:flex-row items-center justify-center px-4 lg:px-16 overflow-hidden">
      
      {/* Right Column: Text + Profile Card */}
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
        className="w-full lg:w-1/2 mt-10 lg:mt-0 flex flex-col items-center lg:items-start"
      >
        <div className="text-center lg:text-left">
          <h1 className="text-white text-4xl sm:text-5xl font-bold">
            Hi, I’m <span className="text-[#915EFF]">Francis Darko</span>
          </h1>
          <p className="mt-4 text-white-100 text-lg sm:text-xl">
          Data Analyst & Web Developer <br /> Helping businesses grow with data-driven tools and custom websites.
          </p>
        </div>

        {/* Profile Card with 3D Tilt Animation */}
        {/* Profile Card with Zoom Animation */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{
            scale: 1.05,
            transition: { type: "spring", stiffness: 300, damping: 15 },
          }}
          className="mt-8 w-full max-w-md p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl text-white cursor-pointer"
        >
          <h2 className="text-xl font-semibold mb-4">📬 Contact</h2>

          <div className="text-sm sm:text-base space-y-2">
            <p><span className="font-semibold">Email:</span> francisdarko@example.com</p>
            <p><span className="font-semibold">Phone:</span> +44 1234 567890</p>
            <p><span className="font-semibold">Location:</span> Manchester, UK</p>
          </div>

          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">🌐 Socials</h3>
            <div className="flex space-x-4">
              <a
                href="https://github.com/francisdarko"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#915EFF] transition-transform transform hover:scale-110"
              >
                <FaGithub size={24} />
              </a>
              <a
                href="https://linkedin.com/in/francisdarko"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#915EFF] transition-transform transform hover:scale-110"
              >
                <FaLinkedin size={24} />
              </a>
              <a
                href="https://twitter.com/francisdarko"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#915EFF] transition-transform transform hover:scale-110"
              >
                <FaTwitter size={24} />
              </a>
            </div>
          </div>
        </motion.div>

      </motion.div>

      {/* Left Column: 3D Canvas */}
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
        className="w-full lg:w-1/2 h-[500px] sm:h-[600px] md:h-[900px] lg:h-[800px] flex items-center justify-center"
      >
        <div className="w-full h-full flex items-center justify-center">
          <ComputersCanvas />
        </div>
      </motion.div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-6 w-full flex justify-center">
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
