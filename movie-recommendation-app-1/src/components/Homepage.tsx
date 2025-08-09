"use client";

import React, { useEffect, useState } from "react";
import { getTrendingAll, getPopularMovies, getPopularTV, MediaResult } from "@/services/movieApi";
import MoviesList from "@/components/MovieList";
import { useRouter } from "next/navigation";

const HomePage: React.FC = () => {
  const router = useRouter();
  const [trending, setTrending] = useState<MediaResult[]>([]);
  const [movies, setMovies] = useState<MediaResult[]>([]);
  const [tvShows, setTvShows] = useState<MediaResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [trend, mov, tv] = await Promise.all([
          getTrendingAll(),
          getPopularMovies(),
          getPopularTV(),
        ]);
        setTrending(trend);
        setMovies(mov);
        setTvShows(tv);
      } catch (err) {
        console.error("❌ Error fetching data:", err);
        setError("Failed to fetch data. Please try again later.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return <p className="text-white text-center mt-10">Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500 text-center mt-10">{error}</p>;
  }

  return (
    <main className="bg-black min-h-screen p-4 text-white">
      <MoviesList
        title="Trending Now"
        items={trending}
        onCardClick={(id, type) => router.push(`/details/${type}/${id}`)}
      />
      <MoviesList
        title="Popular Movies"
        items={movies}
        onCardClick={(id, type) => router.push(`/details/${type}/${id}`)}
      />
      <MoviesList
        title="Popular TV Shows"
        items={tvShows}
        onCardClick={(id, type) => router.push(`/details/${type}/${id}`)}
      />
    </main>
  );
};

export default HomePage;
