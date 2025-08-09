"use client";
import Image from "next/image";
import { MediaResult } from "@/services/movieApi";

interface CarouselProps {
  title: string;
  items: MediaResult[];
}

export default function Carousel({ title, items }: CarouselProps) {
  if (!items || items.length === 0) {
    return (
      <section className="my-8">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p className="text-gray-400">No data available.</p>
      </section>
    );
  }

  return (
    <section className="my-8">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
        {items.map((item) => (
          <div
            key={item.id}
            className="min-w-[150px] bg-gray-800 rounded-lg overflow-hidden shadow-md flex-shrink-0"
          >
            <div className="relative w-[150px] h-[225px]">
              <Image
                src={
                  item.posterPath && !item.posterPath.includes("placeholder")
                    ? item.posterPath
                    : "/placeholder-poster.png"
                }
                alt={item.title}
                fill
                priority={false}
                sizes="150px"
                className="object-cover"
              />
            </div>
            <div className="p-2">
              <h3 className="text-sm font-semibold truncate">{item.title}</h3>
              <p className="text-xs text-gray-400 truncate">
                {item.overview}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
