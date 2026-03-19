// src/components/PostsGrid.jsx
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Props
 * ─ posts        → array  (full list; slicing happens here)
 * ─ page         → number (current page, 1‑based)
 * ─ postsPerPage → number
 * ─ loading      → boolean
 * ─ error        → string | null
 * ─ onPrev       → () => void
 * ─ onNext       → () => void
 */
export default function PostsGrid({
  posts             = [],
  page              = 1,
  postsPerPage      = 3,
  loading           = false,
  error             = null,
  onPrev            = () => {},
  onNext            = () => {},
}) {
  /* slice once here so parent stays simple */
  const totalPages  = Math.max(1, Math.ceil(posts.length / postsPerPage));
  const current     = posts.slice((page - 1) * postsPerPage, page * postsPerPage);

  return (
    <>
      {/* Loading / error messages */}
      {loading && (
        <p className="text-center text-indigo-200">Loading posts…</p>
      )}
      {error && (
        <p className="text-center text-red-400">{error}</p>
      )}

      {/* Posts grid */}
      {!loading && !error && (
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="grid gap-12 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          >
            {current.map(({ id, title, content, tag, snippet, image, created }) => (
              <motion.article
                key={id}
                className="bg-gradient-to-br from-purple-800 via-indigo-900 to-pink-800
                           rounded-3xl overflow-hidden shadow-2xl cursor-pointer
                           hover:shadow-4xl transition-shadow duration-300"
                whileHover={{ scale: 1.05 }}
              >
                <Link to={`/blog/${id}`}>
                  {image && (
                    <img
                      src={image}
                      alt={title}
                      className="w-full h-48 object-cover rounded-t-3xl"
                      loading="lazy"
                    />
                  )}
                  <div className="p-6">
                    {tag && (
                      <span className="inline-block bg-gradient-to-r from-pink-500 to-yellow-400
                                        text-black text-xs font-bold px-3 py-1 rounded-full uppercase
                                        tracking-widest drop-shadow-lg mb-3">
                        {tag}
                      </span>
                    )}
                    <h2 className="text-2xl font-bold mb-2 leading-snug">{title}</h2>
                    {snippet && (
                      <p className="text-indigo-300 text-sm mb-4 line-clamp-3">{snippet}</p>
                    )}
                    {created && (
                      <p className="text-indigo-400 text-xs tracking-wide">
                        {new Date(created).toLocaleDateString()}
                      </p>
                    )}
                    <button className="mt-4 inline-block px-5 py-2 bg-pink-500 hover:bg-pink-600
                                       rounded-full font-semibold text-white shadow-md transition-colors">
                      Read More →
                    </button>
                  </div>
                </Link>
              </motion.article>
            ))}
          </motion.div>
        </AnimatePresence>
      )}

      {/* Pagination */}
      {!loading && posts.length > postsPerPage && (
        <div className="flex justify-center items-center gap-6 mt-16">
          <button
            onClick={onPrev}
            disabled={page === 1}
            className={`px-6 py-2 rounded-full font-semibold ${
              page === 1
                ? "bg-gray-700 cursor-not-allowed"
                : "bg-pink-500 hover:bg-pink-600 shadow-md transition-colors"
            }`}
          >
            Prev
          </button>

          <span className="text-indigo-300 font-semibold">
            Page {page} of {totalPages}
          </span>

          <button
            onClick={onNext}
            disabled={page === totalPages}
            className={`px-6 py-2 rounded-full font-semibold ${
              page === totalPages
                ? "bg-gray-700 cursor-not-allowed"
                : "bg-pink-500 hover:bg-pink-600 shadow-md transition-colors"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </>
  );
}
