import React from "react";
import { Link } from "react-router-dom";

export default function TopFeaturedSection({ posts, loading, error }) {
  if (loading || error || posts.length === 0) return null;

  // Latest 3 posts except the last one (if posts length > 1)
  const latestThree = posts.slice(0, 3);

  // Last (most recent) post
  const lastOne = posts[posts.length - 1];

  return (
    <div className="mb-16 grid grid-cols-1 md:grid-cols-12 gap-8">
      {/* Left smaller col: 3 latest blogs in a row */}
      <div className="md:col-span-4 flex flex-col gap-6">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 border-b border-pink-500 pb-2">
          Latest 3 Blogs
        </h2>
        <div className="flex space-x-4 overflow-x-auto md:flex-col md:space-x-0 md:space-y-6">
          {latestThree.map(({ id, title, snippet, image }) => (
            <article
              key={id}
              className="min-w-[200px] md:min-w-full bg-gradient-to-br from-purple-800 via-indigo-900 to-pink-800
                         rounded-2xl shadow-lg cursor-pointer hover:shadow-2xl transition-shadow duration-300"
            >
              <Link to={`/blog/${id}`} className="block p-4">
                {image && (
                  <img
                    src={image}
                    alt={title}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                    loading="lazy"
                  />
                )}
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">{title}</h3>
                {snippet && (
                  <p className="text-indigo-300 text-sm line-clamp-3">{snippet}</p>
                )}
              </Link>
            </article>
          ))}
        </div>
      </div>

      {/* Right bigger col: last (most recent) blog bigger */}
      <div className="md:col-span-8 bg-gradient-to-br from-purple-900 via-indigo-900 to-pink-900 rounded-3xl shadow-2xl overflow-hidden cursor-pointer hover:shadow-4xl transition-shadow duration-300">
        <Link to={`/blog/${lastOne.id}`} className="block h-full">
          {lastOne.image && (
            <img
              src={lastOne.image}
              alt={lastOne.title}
              className="w-full h-48 sm:h-64 object-cover rounded-t-3xl"
              loading="lazy"
            />
          )}
          <div className="p-6 sm:p-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-4">
              {lastOne.title}
            </h2>
            {lastOne.snippet && (
              <p className="text-indigo-300 text-base sm:text-lg mb-6 line-clamp-4">
                {lastOne.snippet}
              </p>
            )}
            {lastOne.created && (
              <p className="text-indigo-400 text-xs sm:text-sm tracking-wide">
                {new Date(lastOne.created).toLocaleDateString()}
              </p>
            )}
            <button className="mt-6 sm:mt-8 inline-block px-6 sm:px-8 py-2 sm:py-3 bg-pink-500 hover:bg-pink-600 rounded-full font-semibold text-white shadow-md transition-colors">
              Read More →
            </button>
          </div>
        </Link>
      </div>
    </div>
  );
}
