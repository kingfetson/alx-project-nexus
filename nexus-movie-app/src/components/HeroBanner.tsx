"use client";

import React from "react";
import Image from "next/image";

interface HeroProps {
  title: string;
  description?: string;
  backgroundImage: string;
}

const HeroBanner: React.FC<HeroProps> = ({ title, description, backgroundImage }) => {
  return (
    <section className="relative w-full h-[60vh] sm:h-[70vh] lg:h-[80vh]">
      {/* ✅ Background Image */}
      <Image
        src={backgroundImage || "/placeholder-banner.jpg"}
        alt="Hero Banner"
        fill
        className="object-cover"
        priority
        unoptimized
      />

      {/* ✅ Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center px-6 sm:px-12">
        <h1 className="text-3xl sm:text-5xl font-bold text-white">{title}</h1>
        <p className="mt-4 text-sm sm:text-lg max-w-2xl text-gray-300">
          {description ?? "No description available."}
        </p>
      </div>
    </section>
  );
};

export default HeroBanner;
