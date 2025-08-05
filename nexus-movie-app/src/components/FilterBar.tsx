"use client";

interface FilterBarProps {
  genres: string[];
  selected: string;
  onSelect: (genre: string) => void;
}

export default function FilterBar({ genres, selected, onSelect }: FilterBarProps) {
  return (
    <div className="flex gap-3 my-4 overflow-x-auto no-scrollbar">
      {genres.map((genre) => (
        <button
          key={genre}
          onClick={() => onSelect(genre)}
          className={`px-4 py-2 rounded ${
            selected === genre
              ? "bg-red-600 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          {genre}
        </button>
      ))}
    </div>
  );
}
