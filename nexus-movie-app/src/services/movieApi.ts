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

// ✅ Axios instance
const api = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_BEARER}`, // Use v4 token
    Accept: "application/json",
  },
});

/**
 * ✅ Fetch and format TMDB data
 */
const fetchData = async (
  endpoint: string,
  type?: "movie" | "tv"
): Promise<MediaResult[]> => {
  try {
    const res = await api.get(endpoint);

    if (!res.data?.results) {
      console.warn("⚠️ No results found for:", endpoint);
      return [];
    }

    return res.data.results.map((item: any) => ({
      id: item.id,
      title: item.title || item.name || "Untitled",
      name: item.name,
      overview: item.overview || "No description available.",
      posterPath: item.poster_path
        ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
        : "/placeholder-poster.png",
      backdropPath: item.backdrop_path
        ? `https://image.tmdb.org/t/p/original${item.backdrop_path}`
        : "/placeholder-banner.jpg",
      type: type || item.media_type || (item.title ? "movie" : "tv"),
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
export const getTrendingAll = () => fetchData("/trending/all/week");
export const getPopularMovies = () => fetchData("/movie/popular", "movie");
export const getPopularTV = () => fetchData("/tv/popular", "tv");
