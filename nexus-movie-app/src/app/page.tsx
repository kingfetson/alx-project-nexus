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

  // ✅ Debug logs (will show up in server console)
  console.log("Trending raw:", trendingData);
  console.log("Movies raw:", popularMoviesData);
  console.log("TV raw:", popularTVData);

  // ✅ Format data
  const trending = formatMedia(trendingData);
  const popularMovies = formatMedia(popularMoviesData);
  const popularTV = formatMedia(popularTVData);

  console.log("Trending formatted:", trending);

  // ✅ Pick a static featured item
  const featured = trending.length > 0 ? trending[0] : null;

  return (
    <main className="bg-black text-white min-h-screen">
      {/* ✅ Hero Banner */}
      {featured && (
        <HeroBanner
          title={featured.title}
          description={featured.overview}
          backgroundImage={
            featured.backdropPath
              ? `https://image.tmdb.org/t/p/original${featured.backdropPath}`
              : "/placeholder-banner.jpg"
          }
        />
      )}

      {/* ✅ Carousels */}
      <section className="px-6 mt-[-50px] relative z-10">
        <Carousel title="Trending Now" items={trending} />
        <Carousel title="Popular Movies" items={popularMovies} />
        <Carousel title="Popular TV Shows" items={popularTV} />
      </section>
    </main>
  );
}
