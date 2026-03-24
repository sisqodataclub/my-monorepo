import { motion } from "framer-motion";
import BoxesBackground from "./BoxesBackground"; // ✅ Make sure the path is correct

export default function ProfileCard({
  username = "John Doe",
  likes = 0,
  comments = 0,
  about = "Passionate software developer with 5 years of experience in web technologies. I love creating user‑friendly applications and solving complex problems.",
  email = "john.doe@example.com",
  phone = "+1 (555) 123‑4567",
  city = "San Francisco, CA",
}) {
  return (
    <div className="relative w-full max-w-sm mx-auto">
      {/* 🔳 Animated grid background */}
      <BoxesBackground className="absolute inset-0 z-0 rounded-3xl overflow-hidden" />

      {/* 💳 Profile card content */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative z-10 bg-indigo-800/60 backdrop-blur
                   rounded-3xl shadow-2xl p-6 flex flex-col gap-6 text-white"
      >
        {/* Avatar + Name */}
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-pink-500 flex items-center justify-center text-xl font-bold">
            {username.slice(0, 1).toUpperCase()}
          </div>
          <h2 className="text-xl font-extrabold tracking-tight">{username}</h2>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Stat label="Blogs Liked" value={likes} />
          <Stat label="Comments" value={comments} />
        </div>

        {/* About */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-indigo-300 mb-1">
            About Me
          </h3>
          <p className="text-sm leading-relaxed">{about}</p>
        </div>

        {/* Contact */}
        <div className="space-y-1 pt-2">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-indigo-300">
            Contact Information
          </h3>
          <ContactLine icon="📧" text={email} />
          <ContactLine icon="📞" text={phone} />
          <ContactLine icon="📍" text={city} />
        </div>
      </motion.div>
    </div>
  );
}

/* ——— Helpers ——— */
const Stat = ({ label, value }) => (
  <div className="flex flex-col">
    <span className="text-xs uppercase tracking-wider text-indigo-300">
      {label}
    </span>
    <span className="text-2xl font-bold">{value}</span>
  </div>
);

const ContactLine = ({ icon, text }) => (
  <p className="text-sm flex items-center gap-2">
    <span>{icon}</span> {text}
  </p>
);
