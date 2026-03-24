import React from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination } from "swiper";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

const relatedPosts = [
  // Sample related posts
  { id: 7, title: "Emerging Markets Growth", image: "https://source.unsplash.com/featured/?emerging,markets" },
  { id: 8, title: "Global Trade Update", image: "https://source.unsplash.com/featured/?trade,global" },
  { id: 9, title: "Tech Disruption 2025", image: "https://source.unsplash.com/featured/?technology,disruption" },
];

const RelatedPosts = () => {
  return (
    <div className="mt-20 max-w-5xl mx-auto">
      <h3 className="text-3xl font-extrabold text-white mb-8">Related Posts</h3>
      <Swiper
        effect={"coverflow"}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={"auto"}
        coverflowEffect={{
          rotate: 30,
          stretch: 0,
          depth: 150,
          modifier: 1,
          slideShadows: true,
        }}
        pagination={{ clickable: true }}
        modules={[EffectCoverflow, Pagination]}
        className="w-full max-w-4xl"
      >
        {relatedPosts.map(({ id, title, image }) => (
          <SwiperSlide
            key={id}
            style={{ width: "300px" }}
            className="bg-gradient-to-br from-purple-800 via-indigo-900 to-pink-800 rounded-3xl shadow-2xl cursor-pointer"
          >
            <Link to={`/blog/${id}`} className="block overflow-hidden rounded-3xl">
              <img
                src={image}
                alt={title}
                className="w-full h-48 object-cover rounded-t-3xl transition-transform duration-300 hover:scale-105"
              />
              <div className="p-4">
                <h4 className="text-lg font-bold text-white">{title}</h4>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default RelatedPosts;
