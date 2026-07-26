import { Link } from "react-router";
import {
  FaBroom, FaHome, FaBoxOpen, FaSnowflake, FaLayerGroup,
  FaBuilding, FaHardHat, FaUtensils, FaGraduationCap, FaArrowRight, FaHospitalSymbol
} from "react-icons/fa";

const services = [
  {
    title: "Deep Cleaning",
    description: "Professional deep cleaning services for Manchester & Liverpool homes. A total top-to-bottom hygiene reset.",
    slug: "/services/deep-cleaning/",
    icon: FaBroom
  },
  {
    title: "Regular Cleaning",
    description: "Weekly or fortnightly domestic cleaning. Reliable housekeeping to keep your sanctuary consistent.",
    slug: "/services/regular-cleaning/",
    icon: FaHome
  },
  {
    title: "End of Tenancy",
    description: "Guaranteed move-out cleaning to secure your deposit. Agency-approved checklists for tenants and landlords.",
    slug: "/services/end-of-tenancy-cleaning/",
    icon: FaBoxOpen
  },
  {
    title: "Appliance Cleaning",
    description: "Specialist oven, hob, and fridge cleaning. Professional degreasing for all domestic and commercial machinery.",
    slug: "/services/appliances-cleaning/",
    icon: FaSnowflake
  },
  {
    title: "Carpet Cleaning",
    description: "Professional hot water extraction carpet cleaning. Deep stain removal and allergen neutralisation.",
    slug: "/services/carpet-cleaning/",
    icon: FaLayerGroup
  },
  {
    title: "Office Cleaning",
    description: "Commercial office cleaning services. Boost productivity with a spotless, professional work environment.",
    slug: "/services/office-cleaning/",
    icon: FaBuilding
  },
  {
    title: "After Builders Cleaning",
    description: "Specialist post-construction cleaning. Removing dust, debris, and fine particles after the builders leave.",
    slug: "/services/post-construction/",
    icon: FaHardHat
  },
  {
    title: "Hospitality Hygiene",
    description: "Deep cleaning for bars, restaurants, and kitchens. Ensure hygiene compliance and food safety standards.",
    slug: "/services/bars-restaurants/",
    icon: FaUtensils
  },
  {
    title: "Student Accommodation",
    description: "Turnaround cleaning for student halls and HMO shared flats across Manchester and Liverpool.",
    slug: "/services/student-accommodation/",
    icon: FaGraduationCap
  },
  {
    title: "Healthcare & Clinical Cleaning",
    description: "CQC-compliant clinical cleaning for hospitals, dental clinics, and medical facilities.",
    slug: "/services/healthcare-cleaning/",
    icon: FaHospitalSymbol
  },
];

export default function HomeServices() {
  return (
    <section id="services" className="relative w-full py-20 lg:py-32 bg-white overflow-hidden">
      {/* Background Accents */}
      <div className="absolute inset-0 bg-gradient-to-b from-green-50/50 via-white to-teal-50/30 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header Section */}
        <div className="mb-12 md:mb-20 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
            <span className="h-0.5 w-6 bg-green-500 rounded-full"></span>
            <span className="text-green-600 font-bold tracking-widest text-xs uppercase">
              Our Services
            </span>
          </div>

          <h2 className="text-4xl md:text-6xl font-extrabold text-green-950 tracking-tight leading-tight">
            Professional <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-500">
              Cleaning Services.
            </span>
          </h2>
          <p className="mt-6 text-slate-600 max-w-2xl text-lg font-light">
            Comprehensive cleaning solutions tailored for residential and commercial spaces across Manchester and Liverpool.
          </p>
        </div>

        {/* Services Grid – No animations, loads instantly */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {services.map((service, index) => (
            <div
              key={service.title}
              className="relative group"
            >
              <Link
                to={service.slug}
                className="flex flex-col h-full bg-white border border-green-100 rounded-3xl p-8 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-green-900/5 hover:-translate-y-2 hover:border-green-200 overflow-hidden"
              >
                {/* Number Accent */}
                <span className="absolute -right-4 -top-6 text-7xl font-bold text-slate-50 opacity-50 group-hover:text-green-50 transition-colors pointer-events-none select-none z-0">
                  {String(index + 1).padStart(2, '0')}
                </span>

                <div className="relative z-10 flex flex-col h-full">
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-50 to-teal-50 text-green-600 flex items-center justify-center mb-6 text-2xl shadow-inner group-hover:scale-110 transition-transform duration-300">
                    <service.icon />
                  </div>

                  <h3 className="text-2xl font-bold text-green-950 mb-3 group-hover:text-green-700 transition-colors">
                    {service.title}
                  </h3>

                  <p className="text-slate-500 leading-relaxed mb-8">
                    {service.description}
                  </p>

                  <div className="mt-auto flex items-center gap-2 text-sm font-bold text-green-700 uppercase tracking-widest group-hover:gap-4 transition-all">
                    Explore Service <FaArrowRight className="text-green-400" />
                  </div>
                </div>

                {/* Bottom Border Accent */}
                <div className="absolute bottom-0 left-0 w-0 h-1.5 bg-gradient-to-r from-green-500 to-teal-500 group-hover:w-full transition-all duration-500" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
