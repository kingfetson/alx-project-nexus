"use client";

import React from "react";
import MovieCard from "./movieCard";
import { MediaResult } from "@/services/movieApi";

interface CarouselProps {
  title: string;
  items?: MediaResult[]; // Optional to avoid errors if undefined
  onCardClick?: (id: number, type: "movie" | "tv") => void;
}

const Carousel: React.FC<CarouselProps> = ({ title, items = [], onCardClick }) => {
  return (
    <section className="my-6">
      <h2 className="text-xl font-semibold text-white mb-3">{title}</h2>
      <div className="flex gap-4 overflow-x-auto scrollbar-hide">
        {items.length > 0 ? (
          items.map((item) => (
            <MovieCard
              key={item.id}
              item={item}
              onClick={onCardClick}
            />
          ))
        ) : (
          <p className="text-gray-400">No data available.</p>
        )}
      </div>
    </section>
  );
};

export default Carousel;
