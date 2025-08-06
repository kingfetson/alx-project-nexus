// src/utils/formatData.ts
import { MediaResult } from "@/services/movieApi";

export function formatMedia(data: any[]): MediaResult[] {
  if (!Array.isArray(data)) return [];

  return data
    .filter((item) => item.id && (item.title || item.name)) // ensure valid data
    .map((item) => ({
      id: Number(item.id),
      title: item.title || item.name || "Untitled",
      posterPath: item.poster_path || item.posterPath || null,
      backdropPath: item.backdrop_path || item.backdropPath || null,
      overview: item.overview || "No description available.",
      type: item.media_type === "movie" || item.type === "movie" ? "movie" : "tv",
    }));
}
