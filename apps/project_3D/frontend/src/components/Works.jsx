import React, { useState } from "react";
import Tilt from "react-parallax-tilt";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { github } from "../assets";
import { textVariant, fadeIn } from "../utils/motion";
import { projects } from "../constants";
import TechHeader from "../components/TechHeader";


// REMOVE this:
// import ProjectCard from "./ProjectCard";

// ProjectCard component definition
const ProjectCard = ({
  index,
  name,
  description,
  tags,
  image,
  source_code_link,
}) => (
  <motion.div variants={fadeIn("up", "spring", index * 0.5, 0.75)}>
    <Tilt
      options={{
        max: 45,
        scale: 1,
        speed: 450,
      }}
      className="bg-tertiary p-5 rounded-2xl sm:w-[360px] w-full"
    >
      <div className="relative w-full h-[230px]">
        <img
          src={image}
          alt="project_image"
          className="w-full h-full object-cover rounded-2xl"
        />
        <div className="absolute inset-0 flex justify-end m-3 card-img_hover">
          <div
            onClick={() => window.open(source_code_link, "_blank")}
            className="black-gradient w-10 h-10 rounded-full flex justify-center items-center cursor-pointer"
          >
            <img
              src={github}
              alt="source code"
              className="w-1/2 h-1/2 object-contain"
            />
          </div>
        </div>
      </div>

      <div className="mt-5">
        <h3 className="text-white font-bold text-[24px]">{name}</h3>
        <p className="mt-2 text-secondary text-[14px]">{description}</p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
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

// Works component
const categories = ["All", "Websites", "Market Research", "Data Science"];

const Works = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProjects =
    activeCategory === "All"
      ? projects
      : projects.filter((project) => project.category === activeCategory);

  return (
    <>
      {/* Section Header */}
      <motion.div variants={textVariant()}>
        <TechHeader title="My Projects" />
      </motion.div>

      {/* Category Filters */}
      <div className="mt-6 mb-10 flex flex-wrap gap-4 justify-center">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
              activeCategory === cat
                ? "bg-[#915EFF] text-white"
                : "bg-white text-[#915EFF] border border-[#915EFF]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Project Cards */}
      <div className="mt-10 flex flex-wrap gap-7 justify-center">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project, index) => (
            <ProjectCard
              key={`project-${index}`}
              index={index}
              {...project}
            />
          ))
        ) : (
          <p className="text-center text-gray-400">No projects found.</p>
        )}
      </div>
    </>
  );
};

export default Works;
