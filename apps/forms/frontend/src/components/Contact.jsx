import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { styles } from "../styles";
import { EarthCanvas } from "./canvas";
import { SectionWrapper } from "../hoc";
import { slideIn } from "../utils/motion";
import api from "../api";

const Contact = () => {
  const formRef = useRef();
  // Added 'service' to the form state
  const [form, setForm] = useState({ name: "", email: "", message: "", service: "" });
  const [loading, setLoading] = useState(false);

  // Toast popup state
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Trick: Combine the selected service into the message string
    const finalMessage = form.service 
      ? `[Service Inquiry: ${form.service}]\n\n${form.message}`
      : form.message;

    // Create the payload exactly how the backend expects it (NO service field)
    const payload = {
      name: form.name,
      email: form.email,
      message: finalMessage,
    };

    api
      .post("/api/contact/", payload)
      .then((res) => {
        // Accept both 200 (OK) and 201 (Created) as successful responses!
        if (res.status === 200 || res.status === 201) {
          showToast("Message sent successfully!", "success");
          // Reset the form including the service field
          setForm({ name: "", email: "", message: "", service: "" });
        } else {
          showToast("Something went wrong. Please try again.", "error");
        }
      })
      .catch(() => {
        showToast("Something went wrong. Please try again.", "error");
      })
      .finally(() => setLoading(false));
  };

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  return (
    <div className={`xl:mt-12 flex xl:flex-row flex-col-reverse gap-10 overflow-hidden`}>
      <motion.div
        variants={slideIn("left", "tween", 0.2, 1)}
        className="flex-[0.75] bg-black-100 p-8 rounded-2xl"
      >
        <p className={styles.sectionSubText}>Get in touch</p>
        <h3 className={styles.sectionHeadText}>Contact.</h3>

        <form ref={formRef} onSubmit={handleSubmit} className="mt-12 flex flex-col gap-8">
          <label className="flex flex-col">
            <span className="text-white font-medium mb-4">Your Name</span>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="What's your good name?"
              className="bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none border-none font-medium"
              required
            />
          </label>
          <label className="flex flex-col">
            <span className="text-white font-medium mb-4">Your email</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="What's your web address?"
              className="bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none border-none font-medium"
              required
            />
          </label>
          
          {/* New Service Selection Dropdown */}
          <label className="flex flex-col">
            <span className="text-white font-medium mb-4">Service Interested In</span>
            <select
              name="service"
              value={form.service}
              onChange={handleChange}
              className="bg-tertiary py-4 px-6 text-white rounded-lg outline-none border-none font-medium appearance-none"
              required
            >
              <option value="" disabled className="text-secondary">Select a service...</option>
              <option value="Commercial Cleaning">Commercial Cleaning</option>
              <option value="Man and Van">Man and Van</option>
              <option value="Rubbish Removal">Rubbish Removal</option>
              <option value="Other">Other</option>
            </select>
          </label>

          <label className="flex flex-col">
            <span className="text-white font-medium mb-4">Your Message</span>
            <textarea
              rows={7}
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="What you want to say?"
              className="bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none border-none font-medium"
              required
            />
          </label>

          <button
            type="submit"
            className="bg-tertiary py-3 px-8 rounded-xl outline-none w-fit text-white font-bold shadow-md shadow-primary hover:bg-white/10 transition-colors"
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </form>
      </motion.div>

      <motion.div
        variants={slideIn("right", "tween", 0.2, 1)}
        className="xl:flex-1 xl:h-auto md:h-[550px] h-[350px]"
      >
        <EarthCanvas />
      </motion.div>

      {/* Toast Notification */}
      {toast.show && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3 }}
          className={`fixed bottom-5 right-5 px-6 py-3 rounded-lg shadow-lg text-white z-50 ${
            toast.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {toast.message}
        </motion.div>
      )}
    </div>
  );
};

export default SectionWrapper(Contact, "contact");
