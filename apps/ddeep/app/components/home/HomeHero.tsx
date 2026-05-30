import { FaHome, FaBriefcase, FaShieldAlt, FaCertificate, FaLeaf, FaChild, FaStar } from "react-icons/fa";
import HeroImage from "../../assets/Image_1.png";
import { useContactModal } from "../../context/ContactModalContext";

export default function HomeHero() {
  const { openModal } = useContactModal();

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) section.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative w-full min-h-screen lg:min-h-[110vh] flex items-center justify-center overflow-hidden bg-slate-900">

      {/* Background Layer */}
      <img
        src={HeroImage}
        alt="Professional cleaner at work in a modern kitchen"
        className="absolute inset-0 w-full h-full object-cover z-0"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

      {/* Ambient Glow */}
      <div className="absolute top-0 right-0 w-[300px] lg:w-[500px] h-[300px] lg:h-[500px] bg-green-500/10 rounded-full blur-[80px] lg:blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-0 left-0 w-[300px] lg:w-[500px] h-[300px] lg:h-[500px] bg-teal-600/10 rounded-full blur-[80px] lg:blur-[120px] pointer-events-none mix-blend-screen" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 lg:pt-20 lg:pb-32 flex flex-col justify-center h-full">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 lg:gap-16">

          {/* Left Column: Text & CTA */}
          <div className="flex-1 text-center lg:text-left">

            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30 backdrop-blur-md mb-3 lg:mb-6 mx-auto lg:mx-0">
              <span className="flex h-2 w-2 rounded-full bg-green-400"></span>
              <span className="text-green-300 text-[10px] sm:text-sm font-semibold tracking-wide uppercase">
                #1 Professional Cleaners in Manchester & Liverpool
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight">
              Expert Deep Cleaning, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-300">
                Manchester & Liverpool.
              </span>
            </h1>

            {/* Subheadline */}
            <p className="mt-3 lg:mt-6 text-sm sm:text-xl text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
              Premium hospital-grade hygiene for homes and offices. We specialize in end of tenancy, commercial, and specialist residential deep cleans across the North West.
            </p>

            {/* CTA Buttons */}
            <div className="mt-5 lg:mt-8 flex flex-row items-center justify-center lg:justify-start gap-3">
              {/* Get Free Quote → opens modal */}
              <button
                onClick={openModal}
                className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-bold text-sm sm:text-base shadow-lg transition-all"
                aria-label="Get a free deep cleaning quote"
              >
                Get Free Quote
              </button>

              <button
                onClick={() => scrollToSection("services")}
                className="flex-1 sm:flex-none border border-white/20 hover:bg-white/5 text-white px-4 py-3 rounded-lg font-medium text-sm sm:text-base transition-all"
                aria-label="View our professional cleaning services"
              >
                Our Services
              </button>
            </div>

            {/* Trust Statement */}
            <p className="mt-4 lg:mt-8 text-xs sm:text-sm text-slate-400 flex items-center justify-center lg:justify-start gap-2">
              <FaStar className="text-yellow-400" aria-hidden="true" />
              <span>5-Star Rated Cleaners - Trusted Local Expertise</span>
            </p>
          </div>

          {/* Right Column: Features Grid */}
          <div className="w-full lg:w-5/12">
            <div className="grid grid-cols-2 gap-2 lg:gap-4">
              <FeatureCard icon={FaHome} title="5k+ Homes" subtitle="Deep Cleaned" />
              <FeatureCard icon={FaBriefcase} title="2k+ Businesses" subtitle="Commercial" />
              <FeatureCard icon={FaShieldAlt} title="Fully Insured" subtitle="100% Bonded" />
              <FeatureCard icon={FaCertificate} title="DBS Checked" subtitle="Vetted Team" />
              <FeatureCard icon={FaLeaf} title="Eco-Friendly" subtitle="Non-toxic" />
              <FeatureCard icon={FaChild} title="Safe" subtitle="Kids & Pets" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  subtitle: string;
}

function FeatureCard({ icon: Icon, title, subtitle }: FeatureCardProps) {
  return (
    <div className="flex flex-row items-center text-left gap-3 p-2 lg:p-4 rounded-xl bg-white/10 border border-white/10 backdrop-blur-md hover:-translate-y-0.5 hover:bg-white/15 transition-all cursor-default">
      <div className="flex-shrink-0 w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
        <Icon className="w-4 h-4 lg:w-5 lg:h-5" aria-hidden="true" />
      </div>
      <div className="flex flex-col justify-center">
        <h3 className="text-white font-semibold text-xs lg:text-sm leading-none mb-0.5">{title}</h3>
        <p className="text-slate-400 text-[10px] lg:text-xs leading-none">{subtitle}</p>
      </div>
    </div>
  );
}
