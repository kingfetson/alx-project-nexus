// services/movieApi.ts

export interface MediaResult {
  id: number;
  title: string;
  name?: string;
  overview: string;
  posterPath: string;
  backdropPath: string;
  type: "movie" | "tv";
}

const PLACEHOLDER_POSTER = "/images/placeholder-poster.jpg";
const PLACEHOLDER_BANNER = "/images/placeholder-banner.jpg";

// ✅ Use environment variables
const API_KEY = process.env.NEXT_PUBLIC_MOVIE_API_KEY!;
const API_HOST = process.env.NEXT_PUBLIC_MOVIE_API_HOST!;
const API_ENDPOINT = process.env.NEXT_PUBLIC_MOVIE_API_ENDPOINT!;
const API_BASE = process.env.NEXT_PUBLIC_MOVIE_API_BASE!;

const fetchData = async (
  endpoint: string,
  type?: "movie" | "tv"
): Promise<MediaResult[]> => {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: "GET",
      headers: {
        "x-apihub-key": API_KEY,
        "x-apihub-host": API_HOST,
        "x-apihub-endpoint": API_ENDPOINT,
      },
    });

    const data = await res.json();

    if (!data?.results) {
      console.warn("⚠️ No results found for:", endpoint);
      return [];
    }

    return data.results.map((item: any) => ({
      id: item.id,
      title: item.title || item.name || "Untitled",
      name: item.name,
      overview: item.overview || "No description available.",
      posterPath: item.poster_path
        ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
        : PLACEHOLDER_POSTER,
      backdropPath: item.backdrop_path
        ? `https://image.tmdb.org/t/p/original${item.backdrop_path}`
        : PLACEHOLDER_BANNER,
      type: type || item.media_type || (item.title ? "movie" : "tv"),
    }));
  } catch (error: any) {
    console.error("❌ API Fetch Error:", {
      message: error.message,
      url: endpoint,
    });
    return [];
  }
};

// ✅ Exported API functions
export const getTrendingAll = () => fetchData("/trending/all/week");
export const getPopularMovies = () => fetchData("/movie/popular", "movie");
export const getPopularTV = () => fetchData("/tv/popular", "tv");
