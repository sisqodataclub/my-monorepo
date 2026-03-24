import python from "../assets/python.png";
import sql from "../assets/sql.png";



import {
  mobile,
  backend,
  creator,
  web,
  javascript,
  typescript,
  html,
  css,
  reactjs,
  redux,
  tailwind,
  nodejs,
  mongodb,
  git,
  figma,
  docker,
  meta,
  starbucks,
  tesla,
  shopify,
  carrent,
  jobit,
  tripguide,
  threejs,

} from "../assets";

export const navLinks = [
  {
    id: "about",
    title: "About",
  },
  {
    id: "wor",
    title: "Work",
  },

  {
    id: "feedbacks",
    title: "Feedbacks",
  },


  {
    id: "contact",
    title: "Contact",
  },

  



/*
  {
    id: "https://www.google.com",
    title: "Google",
    external: true, 
  },

  {
    id: "/blog",
    title: "Blog",
    external: false, // or simply remove this line
    internal: true   // optional, for clarity
  },

  {
    id: "/logout",
    title: "Logout",
    external: false, // or simply remove this line
    internal: true   // optional, for clarity
  },

  {
    id: "/login",
    title: "Login/Register",
    external: false, // or simply remove this line
    internal: true   // optional, for clarity
  },

  
{
  id: "/profile",
  title: "Profile",
  external: false, // or simply remove this line
  internal: true   // optional, for clarity
}

*/
  


];

const services = [
  {
    title: "Website Developer",
    icon: web,
  },
  {
    title: "Data Analyst/Engineer",
    icon: mobile,
  },
  {
    title: "Market Researcher",
    icon: backend,
  },
  {
    title: "Content Creator",
    icon: creator,
  },
];

const technologies = [
  {
    name: "Python",
    icon: python,
  },
  {
    name: "SQL",
    icon: sql,
  },
  {
    name: "Three JS",
    icon: threejs,
  },
  {
    name: "git",
    icon: git,
  },
  {
    name: "Html/Css",
    icon: html,
  },
  {
    name: "docker",
    icon: docker,
  },
];

const experiences = [
  {
    title: "React.js Developer",
    company_name: "Starbucks",
    icon: starbucks,
    iconBg: "#383E56",
    date: "March 2020 - April 2021",
    points: [
      "Developing and maintaining web applications using React.js and other related technologies.",
      "Collaborating with cross-functional teams including designers, product managers, and other developers to create high-quality products.",
      "Implementing responsive design and ensuring cross-browser compatibility.",
      "Participating in code reviews and providing constructive feedback to other developers.",
    ],
  },
  {
    title: "React Native Developer",
    company_name: "Tesla",
    icon: tesla,
    iconBg: "#E6DEDD",
    date: "Jan 2021 - Feb 2022",
    points: [
      "Developing and maintaining web applications using React.js and other related technologies.",
      "Collaborating with cross-functional teams including designers, product managers, and other developers to create high-quality products.",
      "Implementing responsive design and ensuring cross-browser compatibility.",
      "Participating in code reviews and providing constructive feedback to other developers.",
    ],
  },
  {
    title: "Web Developer",
    company_name: "Shopify",
    icon: shopify,
    iconBg: "#383E56",
    date: "Jan 2022 - Jan 2023",
    points: [
      "Developing and maintaining web applications using React.js and other related technologies.",
      "Collaborating with cross-functional teams including designers, product managers, and other developers to create high-quality products.",
      "Implementing responsive design and ensuring cross-browser compatibility.",
      "Participating in code reviews and providing constructive feedback to other developers.",
    ],
  },
  {
    title: "Full stack Developer",
    company_name: "Meta",
    icon: meta,
    iconBg: "#E6DEDD",
    date: "Jan 2023 - Present",
    points: [
      "Developing and maintaining web applications using React.js and other related technologies.",
      "Collaborating with cross-functional teams including designers, product managers, and other developers to create high-quality products.",
      "Implementing responsive design and ensuring cross-browser compatibility.",
      "Participating in code reviews and providing constructive feedback to other developers.",
    ],
  },
];






const testimonials = [
  {
    testimonial:
      "I had never fully grasped the value of data and market research for small businesses until I worked with Francis—his insights were transformative.",
    name: "Dennis",
    designation: "OWNER",
    company: "Ddeep Cleaning Services",
    image: "https://randomuser.me/api/portraits/women/4.jpg",
  },
  {
    testimonial:
      "I've never met a web developer who truly cares about their clients' success like Francis does.",
    name: "Derrick",
    designation: "OWNER",
    company: "DERRICK DESIGNS",
    image: "https://randomuser.me/api/portraits/men/5.jpg",
  },
  {
    testimonial:
      "Francis helped me launch my business from the ground up—from building a stunning website to conducting in-depth market research. His support was instrumental every step of the way.",
    name: "Lisa",
    designation: "CTO",
    company: "COMPLEX PROPERTIES",
    image: "https://randomuser.me/api/portraits/women/6.jpg",
  },
];

const projects = [
  {
    name: "Data Club Center",
    category: "Websites", // new field
    description:
      "Data Club Center offers comprehensive support solutions for small businesses...",
    tags: [
      { name: "react", color: "blue-text-gradient" },
      { name: "mongodb", color: "green-text-gradient" },
      { name: "tailwind", color: "pink-text-gradient" },
    ],
    image: carrent,
    source_code_link: "https://www.dataclubcenter.com/",
  },
 



 

  {
    name: "Data Overview",
    category: "Data Science",
    description:
      "Data Overview: Summarize and Preview Your Dataset Like a Pro...",
    tags: [
      { name: "react", color: "blue-text-gradient" },
      { name: "django", color: "green-text-gradient" },
      { name: "dataoverview", color: "pink-text-gradient" },
    ],
    image: jobit,
    source_code_link: "https://github.com/sisqodataclub/ml-ds/blob/e1881098af0298f8b932c7b066e5cb75214c0233/Data_Overview.ipynb/",
  },

/*

  {
    name: "Trip Guide",
    category: "Market Research",
    description:
      "A comprehensive travel booking platform that allows users to book flights...",
    tags: [
      { name: "nextjs", color: "blue-text-gradient" },
      { name: "supabase", color: "green-text-gradient" },
      { name: "css", color: "pink-text-gradient" },
    ],
    image: tripguide,
    source_code_link: "https://github.com/",
  },

*/
];

export { services, technologies, experiences, testimonials, projects };

export const ACCESS_TOKEN = "access";
export const REFRESH_TOKEN = "refresh"


export const PRICES = {
  // ⭐ Standard Areas
  "Living Room": 25,
  "Bedroom": 20, // base (non-sized)
  "En-Suite": 25,
  "Extra Room": 20,
  "Dining Room": 20,
  "Bathroom": 25,
  "Separate Toilet": 10,
  "Kitchen": 20, // base (non-sized)
  "Staircases": 15,
  "Conservatory": 25,
  "Hallway": 10,
  "Porch": 10,
  "Balcony": 15,
  "Built-in Wardrobe": 15,

  // ⭐ Size-Based Areas (requested)
  "Kitchen_Small": 40,
  "Kitchen_Medium": 55,
  "Kitchen_Large": 70,

  "Bedroom_Small": 20,
  "Bedroom_Medium": 25,
  "Bedroom_Large": 30,

  // ⭐ Appliances
  fridge_freezer: 15,
  fridge: 10,
  freezer: 10,
  american_fridge: 20,
  built_in_single_oven: 40,
  built_in_double_oven: 45,
  freestanding_single_cooker: 45,
  freestanding_double_cooker: 50,
  range_cooker: 70,
  microwave: 10,
  washing_machine: 10,
  dishwasher: 10,
  hob: 15,
  extractor_hood: 15,

  // ⭐ Carpets
  carpet_bedroom: 20,
  carpet_living: 25,
  carpet_dining: 20,
  carpet_hallway: 15,
  carpet_landing: 15,
  carpet_stairs: 20,

  // ⭐ Rugs
  rug_small: 20,
  rug_medium: 35,
  rug_large: 40,

  // ⭐ Sofas
  sofa_single: 25,
  sofa_double: 35,
  sofa_triple: 55,
  sofa_lshape: 80,

  // ⭐ Mattresses
  mattress_single: 20,
  mattress_double: 25,
  mattress_king: 30,
  mattress_superking: 5,

  // ⭐ Chairs
  dining_chairs: 5,
  office_chairs: 5,
};




// ⭐ Coupons Database (Auto-Apply System)
export const couponsDB = [
  {
    code: "SAVE10",
    type: "flat",       // subtract £10
    amount: 10,
    expires: "2025-12-31",
  },
  {
    code: "FIRST20",
    type: "percent",    // 20% off
    amount: 20,
    expires: "2025-12-31",
  },
  {
    code: "WELCOME5",
    type: "flat",       // subtract £5
    amount: 5,
    expires: "2025-06-01",
  },
];