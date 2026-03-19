import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { motion, AnimatePresence } from "framer-motion";
import api from "../api"; // your axios instance
import PostsGrid from "../components/PostsGrid";
import NewPostForm from "../components/NewPostForm";
import TopFeaturedSection from "../components/TopFeaturedSection";
import AnimatedHeadline from "../components/AnimatedHeadline";


// ────────────────────────── Blog Page ──────────────────────────
// This page displays blog posts, allows pagination, and has a form to create new posts

const POSTS_PER_PAGE = 3;

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tag, setTag] = useState("");
  const [snippet, setSnippet] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = () => {
    setLoading(true);
    api
      .get("/api/blogs/")
      .then((res) => {
        setPosts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Could not load blog posts");
        setLoading(false);
        console.error(err);
      });
  };

  const totalPages = Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE));
  const currentPosts = posts.slice(
    (page - 1) * POSTS_PER_PAGE,
    page * POSTS_PER_PAGE
  );

  const handlePrev = () => setPage((p) => Math.max(p - 1, 1));
  const handleNext = () => setPage((p) => Math.min(p + 1, totalPages));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    try {
      await api.post("/api/blogs/", { title, content, tag, snippet, image });
      setTitle("");
      setContent("");
      fetchPosts();
      setPage(1);
    } catch (err) {
      console.error(err);
      alert("Error creating post");
    }
  };

  // Get featured posts
  const latestThree = posts.slice(0, 3);
  const lastOne = posts[0]; // most recent post

  return (
    <div className="relative z-0 bg-primary">
      <div className="bg-hero-pattern bg-cover bg-no-repeat bg-center min-h-screen">
        <div className="min-h-screen bg-black text-white px-4 sm:px-6 lg:px-20 py-24 max-w-9xl mx-auto font-sans select-none rounded-3xl shadow-lg">
          <AnimatedHeadline />

          {/* Loading and error */}
          {loading && <p className="text-center text-indigo-200">Loading posts…</p>}
          {error && <p className="text-center text-red-400">{error}</p>}

          <TopFeaturedSection posts={posts} loading={loading} error={error} />


          {/* Posts grid (paginated) */}
          <PostsGrid
            posts={posts}
            page={page}
            postsPerPage={POSTS_PER_PAGE}
            loading={loading}
            error={error}
            onPrev={handlePrev}
            onNext={handleNext}
          />

          {/* New Post Form (optional if you want here) */}
          {/* <NewPostForm
            title={title}
            setTitle={setTitle}
            tag={tag}
            setTag={setTag}
            snippet={snippet}
            setSnippet={setSnippet}
            image={image}
            setImage={setImage}
            content={content}
            setContent={setContent}
            onSubmit={handleSubmit}
          /> */}
        </div>
      </div>
    </div>
  );
}
