import HeroBanner from "@/components/HeroBanner";
import Carousel from "@/components/Carousel";
import {
  getTrendingAll,
  getPopularMovies,
  getPopularTV,
  MediaResult,
} from "@/services/movieApi";
import { formatMedia } from "@/utils/formatData";

export default async function HomePage() {
  // ✅ Fetch data from API
  const [trendingData, popularMoviesData, popularTVData]: [
    MediaResult[],
    MediaResult[],
    MediaResult[]
  ] = await Promise.all([
    getTrendingAll(),
    getPopularMovies(),
    getPopularTV(),
  ]);

  console.log("📌 Trending Raw Data:", trendingData);
  console.log("📌 Popular Movies Raw Data:", popularMoviesData);
  console.log("📌 Popular TV Raw Data:", popularTVData);

  // ✅ Format data
  const trending = formatMedia(trendingData);
  const popularMovies = formatMedia(popularMoviesData);
  const popularTV = formatMedia(popularTVData);

  // ✅ Default fallback movie (prevents hydration mismatch)
  const defaultFeatured = {
    id: 0,
    title: "Welcome to CineSeek",
    name: "Welcome to CineSeek",
    overview:
      "Discover trending movies, popular TV shows, and the latest entertainment news – all in one place!",
    posterPath: "/placeholder-poster.png",
    backdropPath: "/placeholder-banner.jpg",
    type: "movie" as const,
  };

  // ✅ Pick first trending movie or fallback
  const featured = trending.length > 0 ? trending[0] : defaultFeatured;

  return (
    <main className="bg-black text-white min-h-screen">
      {/* ✅ Hero Banner */}
      <HeroBanner
        title={featured.title}
        description={featured.overview}
        backgroundImage={featured.backdropPath}
      />

      {/* ✅ Carousels */}
      <section className="px-6 mt-[-50px] relative z-10">
        <Carousel title="Trending Now" items={trending} />
        <Carousel title="Popular Movies" items={popularMovies} />
        <Carousel title="Popular TV Shows" items={popularTV} />
      </section>
    </main>
  );
}
