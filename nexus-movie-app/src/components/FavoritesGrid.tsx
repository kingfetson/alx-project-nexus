"use client";

import { useMediaStore } from "@/store/mediaStore";

import MovieCard from "./movieCard";

export default function FavoritesGrid() {
  const { favorites } = useMediaStore();

  if (favorites.length === 0) {
    return <p className="text-white mt-6">Your list is empty.</p>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-6">
      {favorites.map((item) => (
        <MovieCard
          key={item.id}
          id={item.id}
          title={item.title || "Untitled"}
          posterPath={item.poster_path}
          type={item.type}
        />
      ))}
    </div>
  );
}
