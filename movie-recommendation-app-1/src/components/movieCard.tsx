"use client";

import React from "react";
import Image from "next/image";
import { MediaResult } from "@/services/movieApi";

interface MovieCardProps {
  item: MediaResult;
  onClick?: (id: number, type: "movie" | "tv") => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ item, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick(item.id, item.type);
    }
  };

  return (
    <div
      className="relative w-[160px] sm:w-[200px] md:w-[220px] lg:w-[240px] cursor-pointer hover:scale-105 transition-transform duration-300"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
    >
      {/* ✅ Poster with fallback */}
      <div className="rounded-md overflow-hidden shadow-md bg-gray-800 aspect-[2/3] relative">
        <Image
          src={
            item.posterPath?.startsWith("http")
              ? item.posterPath
              : `https://image.tmdb.org/t/p/w500${item.posterPath}`
          }
          alt={item.title || "Untitled Movie"}
          fill
          className="object-cover rounded-md"
          sizes="(max-width: 768px) 160px, 240px"
          priority={false}
          unoptimized
        />
      </div>

      {/* ✅ Title */}
      <p className="mt-2 text-sm text-white truncate w-full">
        {item.title || "Untitled Movie"}
      </p>
    </div>
  );
};

export default MovieCard;
