/**
 * Represents a single movie or TV show item
 */
export interface Media {
  id: number;
  title?: string;        // For movies
  name?: string;         // For TV shows
  overview: string;
  poster_path: string;
  backdrop_path?: string;
  release_date?: string;
  first_air_date?: string;
  media_type?: "movie" | "tv";
  vote_average?: number;
  genre_ids?: number[];
}

/**
 * Represents a standardized media card used in components
 */
export interface MediaCard {
  id: number;
  title: string;
  posterPath: string;
  type: "movie" | "tv";
}

/**
 * Represents the API response from TMDB
 */
export interface ApiResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

/**
 * Represents the favorite media item saved in Zustand store
 */
export interface FavoriteItem {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  type: "movie" | "tv";
}

/**
 * Represents the Zustand media store structure
 */
export interface MediaStoreState {
  favorites: FavoriteItem[];
  addFavorite: (item: FavoriteItem) => void;
  removeFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;
}
