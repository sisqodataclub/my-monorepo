// src/pages/BlogPost.jsx
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api";
import CommentBox from "../components/CommentBox";

/* ───────────────────────── helpers ───────────────────────── */
const fadeUp = { hidden: { opacity: 0, y: 30 }, show: i => ({
  opacity: 1, y: 0, transition: { delay: i * .2, duration: .6 }
})};

/* ───────────────────────── component ─────────────────────── */
export default function BlogPost() {
  const { id }           = useParams();
  const navigate         = useNavigate();
  const [post,    setPost]    = useState(null);
  const [loading, setLoad]    = useState(true);
  const [error,   setError]   = useState(null);

  /* comments – local‑only */
  const [comments,     setComments]   = useState([]);
  const [commentName,  setName]       = useState("");
  const [commentInput, setComment]    = useState("");

  /* fetch once */
  useEffect(() => {
    api.get(`/api/blogs/${id}/`)
       .then(res => { setPost(res.data); setLoad(false); })
       .catch(() => { setError("Post not found"); setLoad(false); });
  }, [id]);

  /* comment submit */
  const addComment = e => {
    e.preventDefault();
    if (!commentInput.trim() || !commentName.trim()) return;
    const newC = { id: Date.now(), name: commentName.trim(),
                   text: commentInput.trim(),
                   date: new Date().toLocaleString() };
    setComments([newC, ...comments]);
    setName(""); setComment("");
  };

  /* loading / error guard */
  if (loading) return (
    <div className="py-32 text-center text-indigo-200">Loading…</div>
  );
  if (error || !post) return (
    <div className="py-32 text-center">
      <p className="text-red-400 mb-6">{error || "Error"}</p>
      <button onClick={() => navigate(-1)}
              className="px-5 py-2 rounded-full bg-pink-500 hover:bg-pink-600">
        ← Back
      </button>
    </div>
  );

  /* latest data */
  const { title, tag, image, author, created, blocks = [] } = post;

  return (
    <div className="min-h-screen bg-gradient-to-tr from-indigo-900 via-purple-900 to-pink-900
                    text-white px-4 sm:px-6 lg:px-32 py-24 max-w-5xl mx-auto font-sans select-none">
      {/* back */}
      <Link to="/blog"
        className="inline-block mb-6 text-indigo-300 hover:text-indigo-100 font-semibold">
        ← Back to Blog
      </Link>

      {/* tag */}
      {tag && (
        <span className="inline-block mb-4 bg-gradient-to-r from-pink-500 to-yellow-400
                         text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
          {tag}
        </span>
      )}

      {/* headline */}
      <motion.h1
        initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
        transition={{ duration:.8, ease:"easeOut" }}
        className="text-5xl font-extrabold tracking-tight mb-4 relative">
        {title}
        <span className="block h-1 mt-1 rounded-full bg-gradient-to-r
                         from-pink-400 via-purple-400 to-indigo-400
                         animate-gradient-underline"/>
      </motion.h1>

      {/* meta */}
      <motion.p
        initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
        transition={{ delay:.3, duration:.6 }}
        className="text-indigo-300 text-sm mb-10">
        By <span className="font-semibold">{author}</span> •{" "}
        {new Date(created).toLocaleDateString()}
      </motion.p>

      {/* hero */}
      {image && (
        <motion.img
          src={image} alt={title}
          initial={{ scale:.98 }} whileHover={{ scale:1.05, rotateY:5 }}
          transition={{ type:"spring", stiffness:100 }}
          className="rounded-3xl w-full h-80 object-cover mb-12 shadow-2xl cursor-pointer"/>
      )}

      {/* content blocks */}
      <article className="prose lg:prose-lg max-w-none text-indigo-100 leading-relaxed font-light">
        {blocks.map((blk, i) => {
          const isQuote = blk.text?.trim().startsWith('"');
          return (
            <motion.section key={blk.id || i}
              className="mb-16 rounded-xl bg-gradient-to-r
                         from-purple-800 via-indigo-900 to-pink-800 p-6 shadow-lg"
              variants={fadeUp} initial="hidden" whileInView="show"
              custom={i} viewport={{ once:true, amount:.3 }}>
              {blk.image && (
                <motion.img src={blk.image}
                  alt={`block-${i}`} className="rounded-lg w-full h-64 object-cover mb-6 shadow-xl"
                  initial={{ scale:.95 }} whileHover={{ scale:1.05, rotate:1 }}
                  transition={{ type:"spring", stiffness:120 }}/>
              )}
              {isQuote ? (
                <blockquote className="border-l-4 border-pink-400 pl-6 italic
                                       text-pink-200 bg-indigo-900/40 py-3 px-4 rounded-md shadow-md">
                  {blk.text}
                </blockquote>
              ) : (
                <p>{blk.text}</p>
              )}
            </motion.section>
          );
        })}
      </article>

      {/* footer */}
      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}
        transition={{ delay:1.2 }}
        className="mt-20 text-indigo-400 border-t border-indigo-700 pt-8 text-sm text-center">
        © {new Date().getFullYear()} Financial Insights. All rights reserved.
      </motion.div>

      {/* gradient underline keyframes */}
      <style>
        {`@keyframes gradient-underline {
            0%,100%{background-position:0% 50%}
            50%   {background-position:100% 50%}}
          .animate-gradient-underline{
            background-size:200% 200%;
            animation:gradient-underline 4s ease infinite;}`}
      </style>

      <CommentBox blogId={id} />

      
    </div>
  );
}
