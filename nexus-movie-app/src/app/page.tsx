import HeroBanner from "@/components/HeroBanner";
import Carousel from "@/components/Carousel";
import {
  getTrendingAll,
  getPopularMovies,
  getPopularTV,
  MediaResult,
} from "@/services/movieApi";

export default async function HomePage() {
  // ✅ Fetch data from APIHub proxy
  const [trendingData, popularMoviesData, popularTVData]: [
    MediaResult[],
    MediaResult[],
    MediaResult[]
  ] = await Promise.all([
    getTrendingAll(),
    getPopularMovies(),
    getPopularTV(),
  ]);

  // ✅ Debug logs
  console.log("📌 Trending Raw Data:", trendingData);
  console.log("📌 Popular Movies Raw Data:", popularMoviesData);
  console.log("📌 Popular TV Raw Data:", popularTVData);

  // ✅ Pick a featured item (fallback to first available)
  const featured =
    trendingData.length > 0
      ? trendingData[0]
      : popularMoviesData.length > 0
      ? popularMoviesData[0]
      : null;

  return (
    <main className="bg-black text-white min-h-screen">
      {/* ✅ Hero Banner */}
      {featured && (
        <HeroBanner
          title={featured.title}
          description={featured.overview}
          backgroundImage={featured.backdropPath}
        />
      )}

      {/* ✅ Carousels */}
      <section className="px-6 mt-[-50px] relative z-10">
        <Carousel title="Trending Now" items={trendingData} />
        <Carousel title="Popular Movies" items={popularMoviesData} />
        <Carousel title="Popular TV Shows" items={popularTVData} />
      </section>
    </main>
  );
}
