/* ------------- CommentBox.jsx ------------- */
import { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import api from "../api";
import { AuthContext } from "../context/AuthContext";

export default function CommentBox({ blogId }) {
  const { isAuthenticated } = useContext(AuthContext);
  const [comments, setComments] = useState([]);
  const [text, setText]         = useState("");

  // fetch
  useEffect(() => {
    api.get(`/api/blogs/${blogId}/comments/`)
       .then(res => setComments(res.data))
       .catch(console.error);
  }, [blogId]);

  const submit = e => {
    e.preventDefault();
    if (!text.trim()) return;
    api.post(`/api/blogs/${blogId}/comments/`, { text })
       .then(res => setComments(prev => [res.data, ...prev]))
       .finally(() => setText(""));
  };

  return (
    <section className="mt-20 max-w-3xl mx-auto bg-indigo-800/70 p-8 rounded-3xl shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center">Comments</h2>

      {/* form – **no name field** */}
      <form onSubmit={submit} className="flex flex-col gap-4 mb-8">
        <textarea
          rows={4}
          placeholder="Write your comment…"
          className="rounded-lg px-4 py-2 text-black resize-none focus:ring-2 focus:ring-pink-500"
          value={text}
          onChange={e => setText(e.target.value)}
          required
        />
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 rounded-full shadow-md"
        >
          {isAuthenticated ? "Post Comment" : "Post as Guest"}
        </motion.button>
      </form>

      {/* list */}
      {comments.length === 0 ? (
        <p className="text-indigo-200 text-center italic">No comments yet.</p>
      ) : (
        <ul className="flex flex-col gap-6 max-h-96 overflow-y-auto">
          {comments.map(c => (
            <li key={c.id} className="bg-indigo-700/90 p-4 rounded-xl shadow-inner">
              <p className="font-semibold text-pink-400">
                {c.author || c.guest_name}
              </p>
              <p className="mt-1 text-indigo-100 whitespace-pre-wrap">{c.text}</p>
              <p className="mt-2 text-xs text-indigo-300 italic">
                {new Date(c.created).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
