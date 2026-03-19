"use client";
import { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { Sidebar, SidebarBody, SidebarLink } from "../components/sidebar";
import {
  IconBrandTabler,
  IconSettings,
  IconLogout,
} from "@tabler/icons-react";
import { AuthContext } from "../context/AuthContext";
import api from "../api";
import ProfileCard from "../components/ProfileCard";
import BoxesBackground from "../components/BoxesBackground";

// ───────────────────────── animation helpers ──────────────────────────
const fadeIn = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

// ───────────────────────── component ──────────────────────────
export default function AdminDashboard() {
  const { user } = useContext(AuthContext);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notes, setNotes] = useState([]);
  const [selected, setSel] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setCont] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  const username = currentUser?.username;
  const totalLikes = 12;
  const totalComments = 34;

  useEffect(() => {
    api
      .get("/api/user/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("ACCESS_TOKEN")}`,
        },
      })
      .then((res) => setCurrentUser(res.data))
      .catch((err) => {
        console.error("Failed to fetch user info:", err);
        setCurrentUser(null);
      });
  }, []);

  useEffect(() => {
    api
      .get("/api/notes/")
      .then((res) => setNotes(res.data))
      .catch(() => alert("Error"));
  }, []);

  const create = (e) => {
    e.preventDefault();
    api.post("/api/notes/", { title, content }).then((res) => {
      if (res.status === 201) {
        setNotes((p) => [res.data, ...p]);
        setTitle("");
        setCont("");
      }
    });
  };

  const navLinks = [
    {
      label: "Profile",
      href: "#overview",
      icon: <IconBrandTabler className="h-5 w-5" />,
    },
    {
      label: "Customer-Support",
      href: "#Customer-Support",
      icon: <IconSettings className="h-5 w-5" />,
    },
    {
      label: "Logout",
      href: "/logout",
      icon: <IconLogout className="h-5 w-5" />,
    },
  ];

  return (
    <div className="relative flex min-h-screen bg-gradient-to-tr from-indigo-950 via-purple-900 to-pink-950 text-white">
     

      {/* Foreground Content */}
      <div className="relative z-10 flex w-full">
        {/* Sidebar */}
        <Sidebar
          open={sidebarOpen}
          setOpen={setSidebarOpen}
          className="bg-gradient-to-b from-indigo-900 to-purple-900 shadow-lg"
        >
          <SidebarBody className="flex flex-col justify-between h-full p-6">
            <div>
              <a
                href="/"
                className="flex items-center gap-2 text-xl font-bold text-pink-300"
              >
                <div className="h-7 w-7 rounded-full bg-white shadow-md" />
                <span className="drop-shadow-sm">Dashboard</span>
              </a>
              <div className="mt-8 flex flex-col gap-3">
                {navLinks.map((ln, i) => (
                  <SidebarLink key={i} link={ln} />
                ))}
              </div>
            </div>

            <SidebarLink
              link={{
                label: currentUser?.username || "User",
                href: "#",
                icon: (
                  <img
                    src="https://assets.aceternity.com/manu.png"
                    alt="avatar"
                    className="h-7 w-7 rounded-full object-cover"
                  />
                ),
              }}
            />
          </SidebarBody>
        </Sidebar>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Top Header */}
          <header className="flex items-center justify-between px-6 py-4 bg-hero-pattern bg-cover bg-center shadow-md" />

          {/* Mobile Sidebar Toggle */}
          <button
            onClick={() => setSidebarOpen((o) => !o)}
            className="fixed top-16 left-4 z-50 lg:hidden text-pink-400 hover:text-pink-300 p-2 rounded-full bg-neutral-900/80 backdrop-blur shadow-lg transition-colors"
            aria-label="Toggle sidebar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 5.25h16.5M3.75 11.25h16.5M3.75 17.25h16.5"
              />
            </svg>
          </button>

          {/* Main Sections */}
          <main className="flex-1 overflow-y-auto p-6 sm:p-8 lg:p-12">
            {/* Profile Section */}
            <div className="relative flex justify-center mb-16">
              <ProfileCard
                username={username}
                likes={totalLikes}
                comments={totalComments}
              />
            </div>

            {/* Stats Section */}
            <motion.section
              id="overview"
              variants={fadeIn}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20"
            >
              <MetricCard title="Total Notes" value={notes.length} />
              <MetricCard
                title="Selected Note"
                value={selected ? 1 : 0}
              />
              <MetricCard
                title="Logged In As"
                value={currentUser?.username || "Guest"}
              />
            </motion.section>

            {/* Notes Table */}
            <motion.section
              id="activities"
              variants={fadeIn}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              className="mb-20"
            >
              <SectionHeading text="Previous Enquiries" />

              {notes.length === 0 ? (
                <p className="opacity-70 text-indigo-200">
                  No enquiries yet. Start writing!
                </p>
              ) : (
                <div className="overflow-x-auto rounded-3xl shadow-2xl ring-1 ring-indigo-800/50">
                  <motion.table
                    layout
                    className="min-w-full divide-y divide-indigo-700 text-left"
                  >
                    <thead className="bg-indigo-800/70 backdrop-blur-sm">
                      <tr>
                        <th className="px-6 py-4 text-sm font-semibold uppercase tracking-wider">
                          Title
                        </th>
                        <th className="px-6 py-4 text-sm font-semibold uppercase tracking-wider">
                          Preview
                        </th>
                        <th className="px-6 py-4 text-sm font-semibold uppercase tracking-wider whitespace-nowrap">
                          Created
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-indigo-800">
                      {notes.map((n) => (
                        <motion.tr
                          key={n.id}
                          whileHover={{
                            backgroundColor: "rgba(79, 70, 229, 0.3)",
                          }}
                          onClick={() => setSel(n)}
                          className={`cursor-pointer transition-colors ${
                            selected?.id === n.id
                              ? "bg-indigo-800/50"
                              : "bg-indigo-800/30"
                          }`}
                        >
                          <td className="px-6 py-4 text-sm font-medium text-pink-200 line-clamp-1">
                            {n.title}
                          </td>
                          <td className="px-6 py-4 text-sm text-indigo-100 line-clamp-2">
                            {n.content}
                          </td>
                          <td className="px-6 py-4 text-sm text-indigo-300 whitespace-nowrap">
                            {new Date(n.created_at).toLocaleDateString()}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </motion.table>
                </div>
              )}
            </motion.section>

            {/* Contact Form */}
            <motion.section
              id="Customer-Support"
              variants={fadeIn}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              className="bg-indigo-800/50 backdrop-blur rounded-3xl p-8 sm:p-10 shadow-2xl"
            >
              <SectionHeading text="Customer Support" />
              <form onSubmit={create} className="grid gap-6 md:grid-cols-2">
                <Input
                  label="Title"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <Textarea
                  label="Content"
                  id="content"
                  value={content}
                  onChange={(e) => setCont(e.target.value)}
                />
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="md:col-span-2 mt-2 w-full py-3 rounded-2xl bg-pink-500 hover:bg-pink-600 font-semibold shadow-lg shadow-pink-500/30 transition-colors"
                >
                  Contact Us
                </motion.button>
              </form>
            </motion.section>
          </main>
        </div>
      </div>
    </div>
  );
}

// ────────── Reusable UI Components ──────────

const MetricCard = ({ title, value }) => (
  <div className="bg-indigo-800/50 backdrop-blur rounded-3xl p-6 shadow-2xl flex flex-col">
    <p className="text-sm uppercase tracking-wider text-indigo-300 mb-1">
      {title}
    </p>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

const SectionHeading = ({ text }) => (
  <h2 className="text-3xl font-extrabold mb-6 text-pink-300">{text}</h2>
);

const Input = ({ label, id, value, onChange }) => (
  <div className="flex flex-col gap-2">
    <label htmlFor={id} className="font-semibold">
      {label}
    </label>
    <input
      id={id}
      value={value}
      onChange={onChange}
      required
      className="rounded-xl bg-indigo-900/40 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400 placeholder-indigo-300"
      placeholder={label}
    />
  </div>
);

const Textarea = ({ label, id, value, onChange }) => (
  <div className="flex flex-col gap-2 md:col-span-2">
    <label htmlFor={id} className="font-semibold">
      {label}
    </label>
    <textarea
      id={id}
      rows="4"
      value={value}
      onChange={onChange}
      required
      className="rounded-xl bg-indigo-900/40 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400 placeholder-indigo-300 resize-none"
      placeholder={label}
    />
  </div>
);
