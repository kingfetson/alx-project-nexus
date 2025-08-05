interface HeroProps {
  title: string;
  description: string;
  backgroundImage: string;
}

export default function HeroBanner({ title, description, backgroundImage }: HeroProps) {
  return (
    <div className="relative h-[60vh] w-full mb-8 text-white">
      <img
        src={backgroundImage}
        alt={title}
        className="absolute w-full h-full object-cover opacity-60"
      />
      <div className="absolute bottom-20 left-10 max-w-xl">
        <h1 className="text-4xl font-bold">{title}</h1>
        <p className="mt-3 text-sm text-gray-200">{description}</p>
        <div className="mt-4 flex gap-3">
          <button className="bg-red-600 px-4 py-2 rounded">▶ Play</button>
          <button className="bg-gray-600 px-4 py-2 rounded">+ My List</button>
        </div>
      </div>
    </div>
  );
}
