"use client";

import React from "react";
import Image from "next/image";
import { MediaResult } from "@/services/movieApi";

interface MovieCardProps {
  item: MediaResult;
  onClick?: (id: number, type: "movie" | "tv") => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ item, onClick }) => {
  return (
    <div
      className="relative w-[160px] sm:w-[200px] md:w-[220px] lg:w-[240px] cursor-pointer hover:scale-105 transition-transform duration-300"
      onClick={() => onClick && onClick(item.id, item.type)}
    >
      {/* ✅ Poster Image with fallback */}
      <div className="rounded-md overflow-hidden shadow-md bg-gray-800">
        <Image
          src={
            item.posterPath
              ? `https://image.tmdb.org/t/p/w500${item.posterPath}`
              : "/placeholder-poster.png"
          }
          alt={item.title || "Untitled Movie"}
          width={240}
          height={360}
          className="object-cover rounded-md"
          priority={false}
          unoptimized
        />
      </div>

      {/* ✅ Movie/TV title with fallback */}
      <p className="mt-2 text-sm text-white truncate w-full">
        {item.title || "Untitled Movie"}
      </p>
    </div>
  );
};

export default MovieCard;
