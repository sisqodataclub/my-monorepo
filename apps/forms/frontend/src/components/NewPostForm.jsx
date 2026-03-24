import { motion } from "framer-motion";

/**
 * Props (all required)
 * ─ title, setTitle
 * ─ tag, setTag
 * ─ snippet, setSnippet
 * ─ image, setImage
 * ─ content, setContent
 * ─ onSubmit      – callback handling the final submit
 * ─ fadeVariants  – optional Framer‑Motion variants (default below)
 */
export default function NewPostForm({
  title,     setTitle,
  tag,       setTag,
  snippet,   setSnippet,
  image,     setImage,
  content,   setContent,
  onSubmit,
  fadeVariants = {
    hidden: { opacity: 0, y: 20 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.6 } },
  },
}) {
  return (
    <motion.section
      variants={fadeVariants}
      initial="hidden"
      animate="show"
      className="mt-24 max-w-3xl mx-auto bg-indigo-800/50 backdrop-blur
                 rounded-3xl p-10 shadow-2xl"
    >
      <h2 className="text-3xl font-extrabold mb-6 tracking-tight text-pink-300 drop-shadow-lg">
        Add a new post
      </h2>

      <form onSubmit={onSubmit} className="grid gap-6">
        {/* Title */}
        <FormGroup label="Title" id="title">
          <input
            id="title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="rounded-xl bg-indigo-900/40 px-4 py-3 focus:outline-none
                       focus:ring-2 focus:ring-pink-400 placeholder-indigo-300"
            placeholder="Post title"
            required
          />
        </FormGroup>

        {/* Tag */}
        <FormGroup label="Tag" id="tag">
          <input
            id="tag"
            value={tag}
            onChange={e => setTag(e.target.value)}
            className="rounded-xl bg-indigo-900/40 px-4 py-3 focus:outline-none
                       focus:ring-2 focus:ring-pink-400 placeholder-indigo-300"
            placeholder="Economy, Finance, Business..."
          />
        </FormGroup>

        {/* Snippet */}
        <FormGroup label="Snippet" id="snippet">
          <input
            id="snippet"
            value={snippet}
            onChange={e => setSnippet(e.target.value)}
            className="rounded-xl bg-indigo-900/40 px-4 py-3 focus:outline-none
                       focus:ring-2 focus:ring-pink-400 placeholder-indigo-300"
            placeholder="Short preview of the article..."
          />
        </FormGroup>

        {/* Image URL */}
        <FormGroup label="Image URL" id="image">
          <input
            id="image"
            value={image}
            onChange={e => setImage(e.target.value)}
            className="rounded-xl bg-indigo-900/40 px-4 py-3 focus:outline-none
                       focus:ring-2 focus:ring-pink-400 placeholder-indigo-300"
            placeholder="https://example.com/image.jpg"
          />
        </FormGroup>

        {/* Content */}
        <FormGroup label="Content" id="content" full>
          <textarea
            id="content"
            rows={5}
            value={content}
            onChange={e => setContent(e.target.value)}
            className="rounded-xl bg-indigo-900/40 px-4 py-3 focus:outline-none
                       focus:ring-2 focus:ring-pink-400 placeholder-indigo-300
                       resize-none"
            placeholder="Full blog content..."
            required
          />
        </FormGroup>

        {/* Submit */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="col-span-full mt-4 w-full py-3 rounded-2xl bg-pink-500
                     hover:bg-pink-600 font-semibold shadow-lg
                     shadow-pink-500/30 transition-colors"
        >
          Publish
        </motion.button>
      </form>
    </motion.section>
  );
}

/* small wrapper for label + control */
const FormGroup = ({ label, id, children, full = false }) => (
  <div className={`flex flex-col gap-2 ${full ? "col-span-full" : ""}`}>
    <label htmlFor={id} className="font-semibold">
      {label}
    </label>
    {children}
  </div>
);
