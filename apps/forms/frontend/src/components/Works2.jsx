import React from "react";
import Tilt from "react-parallax-tilt";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { github } from "../assets";
import { SectionWrapper } from "../hoc";
import { projects } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";



const ProjectCard = ({
  index,
  name,
  description,
  tags,
  image,
  source_code_link,
}) => {
  return (
    <motion.div variants={fadeIn("up", "spring", index * 0.5, 0.75)}>
      <Tilt
        options={{
          max: 45,
          scale: 1,
          speed: 450,
        }}
        className='bg-tertiary p-5 rounded-2xl sm:w-[360px] w-full'
      >
        <div className='relative w-full h-[230px]'>
          <img
            src={image}
            alt='project_image'
            className='w-full h-full object-cover rounded-2xl'
          />

          <div className='absolute inset-0 flex justify-end m-3 card-img_hover'>
            <div
              onClick={() => window.open(source_code_link, "_blank")}
              className='black-gradient w-10 h-10 rounded-full flex justify-center items-center cursor-pointer'
            >
              <img
                src={github}
                alt='source code'
                className='w-1/2 h-1/2 object-contain'
              />
            </div>
          </div>
        </div>

        <div className='mt-5'>
          <h3 className='text-white font-bold text-[24px]'>{name}</h3>
          <p className='mt-2 text-secondary text-[14px]'>{description}</p>
        </div>

        <div className='mt-4 flex flex-wrap gap-2'>
          {tags.map((tag) => (
            <p
              key={`${name}-${tag.name}`}
              className={`text-[14px] ${tag.color}`}
            >
              #{tag.name}
            </p>
          ))}
        </div>
      </Tilt>
    </motion.div>
  );
};

const Works = () => {
  return (
    <>
      <motion.div variants={textVariant()}>

        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, type: "spring" }}
          className="text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 text-[28px] font-semibold tracking-wide underline decoration-[#915EFF] decoration-2 underline-offset-4"
        >
          My Work
        </motion.p>

        
        <h2 className={`${styles.sectionHeadText}`}>Data Science/Machine Learning Projects.</h2>
      </motion.div>

      <div className='w-full flex'>
        <motion.p
          variants={fadeIn("", "", 0.1, 1)}
          className='mt-3 text-secondary text-[17px] max-w-3xl leading-[30px]'
        >
          Following projects showcases my skills and experience through
          real-world examples of my work. Each project is briefly described with
          links to code repositories and live demos in it. It reflects my
          ability to solve complex problems, work with different technologies,
          and manage projects effectively.
        </motion.p>
      </div>

      <div className='mt-20 flex flex-wrap gap-7'>
        {projects.map((project, index) => (
          <ProjectCard key={`project-${index}`} index={index} {...project} />
        ))}
      </div>

      {/* Motion line divider */}
      <motion.div
        variants={fadeIn("up", "spring", 0.2, 1)}
        className="my-12 w-full flex justify-center"
      >
        <div className="h-[2px] w-2/3 bg-gradient-to-r from-[#915EFF] via-white to-[#915EFF]" />
      </motion.div>

      <motion.div variants={textVariant()}>
        <h2 className={`${styles.sectionHeadText}`}>Market Research Projects</h2>
      </motion.div>


      <div className="w-full flex">
        <motion.p
          variants={fadeIn("", "", 0.1, 1)}
          className="mt-6 text-secondary text-[18px] max-w-3xl leading-[32px]"
        >
          Here you'll find a selection of market research projects that demonstrate 
          my ability to analyse industries, assess competitors, 
          and uncover data-driven insights for strategic decision-making. 
          From customer profiling and demand forecasting to visual dashboards 
          and business reports, each project highlights my commitment to helping 
          businesses make informed, confident moves in their markets.


        </motion.p>
      </div>

      <div className='mt-20 flex flex-wrap gap-7'>
        {projects.map((project, index) => (
          <ProjectCard key={`project-${index}`} index={index} {...project} />
        ))}
      </div>


       {/* Motion line divider */}
      <motion.div
        variants={fadeIn("up", "spring", 0.2, 1)}
        className="my-12 w-full flex justify-center"
      >
        <div className="h-[2px] w-2/3 bg-gradient-to-r from-[#915EFF] via-white to-[#915EFF]" />
      </motion.div>

      <motion.div variants={textVariant()}>
        <h2 className={`${styles.sectionHeadText}`}>Website Projects</h2>
      </motion.div>


      <div className="w-full flex">
        <motion.p
          variants={fadeIn("", "", 0.1, 1)}
          className="mt-6 text-secondary text-[18px] max-w-3xl leading-[32px]"
        >
          Here you'll find a selection of projects that showcase my work as a web designer and data analyst. 
          From clean, responsive websites to data-driven dashboards and market research tools, each example includes 
          code repositories and live demos. These projects reflect my ability to solve real-world problems, design 
          with users in mind, and deliver insights that drive results.
        </motion.p>
      </div>

      <div className='mt-20 flex flex-wrap gap-7'>
        {projects.map((project, index) => (
          <ProjectCard key={`project-${index}`} index={index} {...project} />
        ))}
      </div>



    </>
  );
};

export default SectionWrapper(Works, "");
