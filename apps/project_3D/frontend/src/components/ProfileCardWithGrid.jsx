// src/components/ProfileCardWithGrid.jsx
import React from "react";
import ProfileCard from "./ProfileCard";
import { BoxesBackground } from "./BoxesBackground.jsx";

/**
 * Renders the animated Boxes background *inside* its own block
 * and places the ProfileCard on top.
 */
export default function ProfileCardWithGrid({ username, likes, comments }) {
  return (
    <div className="relative mx-auto mb-16 max-w-sm">
      {/* animated background */}
      <BoxesContainer />

      {/* mask‑gradient – soft fade towards edges (optional) */}
      <div className="absolute inset-0 bg-black/80 [mask-image:radial-gradient(transparent,black)] z-[1]" />

      {/* card */}
      <div className="relative z-10">
        <ProfileCard username={username} likes={likes} comments={comments} />
      </div>
    </div>
  );
}
