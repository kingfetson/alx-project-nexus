interface DetailProps {
  title: string;
  description: string;
  posterPath: string;
  releaseDate: string;
}

export default function DetailBanner({ title, description, posterPath, releaseDate }: DetailProps) {
  return (
    <div className="flex flex-col md:flex-row items-center gap-6 p-6 bg-black text-white">
      <img
        src={`https://image.tmdb.org/t/p/w500${posterPath}`}
        alt={title}
        className="w-60 rounded"
      />
      <div>
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="mt-2 text-gray-300">{description}</p>
        <p className="mt-2 text-sm text-gray-400">Release Date: {releaseDate}</p>
        <button className="bg-red-600 px-4 py-2 mt-4 rounded">▶ Play</button>
      </div>
    </div>
  );
}
