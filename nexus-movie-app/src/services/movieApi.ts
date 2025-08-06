import axios from "axios";

export interface MediaResult {
  id: number;
  title: string;
  name?: string;
  overview: string;
  posterPath: string;
  backdropPath: string;
  type: "movie" | "tv";
}

const api = axios.create({
  baseURL:
    "https://TMDB-Movies-and-TV-Shows-API-by-APIRobots.proxy-production.allthingsdev.co/v1/tmdb",
  headers: {
    "x-apihub-key": process.env.NEXT_PUBLIC_APIHUB_KEY || "",
    "x-apihub-host": "TMDB-Movies-and-TV-Shows-API-by-APIRobots.allthingsdev.co",
    "x-apihub-endpoint": "85ffa74b-8298-40ac-908a-736892987ab1",
    Accept: "application/json",
  },
});

/**
 * ✅ Fetch and map movie data
 */
const fetchData = async (
  endpoint: string,
  type: "movie" | "tv"
): Promise<MediaResult[]> => {
  try {
    const res = await api.get(endpoint);

    if (!res.data?.items) {
      console.warn("⚠️ No results found for:", endpoint);
      return [];
    }

    return res.data.items.map((item: any) => ({
      id: item.id || Math.random(), // fallback if no id
      title: item.title || item.name || "Untitled",
      name: item.name,
      overview: item.overview || "No description available.",
      posterPath: item.poster_path
        ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
        : "/placeholder-poster.png",
      backdropPath: item.backdrop_path
        ? `https://image.tmdb.org/t/p/original${item.backdrop_path}`
        : "/placeholder-banner.jpg",
      type,
    }));
  } catch (error: any) {
    console.error("❌ API Fetch Error:", {
      message: error.message,
      status: error.response?.status,
      url: endpoint,
      data: error.response?.data,
    });
    return [];
  }
};

/**
 * ✅ Exported API functions
 */
export const getTrendingAll = () => fetchData("/", "movie");
export const getPopularMovies = () => fetchData("/", "movie");
export const getPopularTV = () => fetchData("/", "tv");
