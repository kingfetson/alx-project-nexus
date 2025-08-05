// src/utils/formatData.ts
import { MediaResult } from "@/services/movieApi";

export function formatMedia(data: any[]): MediaResult[] {
  return data.map((item) => ({
    id: Number(item.id),
    title: item.title || item.name || "Untitled",
    overview: item.overview ?? "No description available.",
    backdropPath: item.backdrop_path || "/placeholder-banner.jpg",
    posterPath: item.poster_path || "/placeholder-poster.png",
    type: item.media_type === "movie" || item.media_type === "tv"
      ? item.media_type
      : "movie",
  }));
}
