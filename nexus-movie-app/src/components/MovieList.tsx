"use client";

import React from "react";
import MovieCard from "./movieCard";
import { MediaResult } from "@/services/movieApi";

interface MoviesListProps {
  title: string;
  items: MediaResult[];
  onCardClick?: (id: number, type: "movie" | "tv") => void;
}

const MoviesList: React.FC<MoviesListProps> = ({ title, items, onCardClick }) => {
  return (
    <div className="w-full mb-6">
      {/* Section Title */}
      <h2 className="text-white text-lg md:text-xl font-semibold px-2 mb-2">
        {title}
      </h2>

      {/* Horizontal Scroll Container */}
      <div className="flex overflow-x-auto gap-3 px-2 scrollbar-hide">
        {items.length > 0 ? (
          items.map((item) => (
            <MovieCard
              key={item.id}
              item={item}
              onClick={onCardClick}
            />
          ))
        ) : (
          <p className="text-gray-400 text-sm px-2">No results available</p>
        )}
      </div>
    </div>
  );
};

export default MoviesList;
