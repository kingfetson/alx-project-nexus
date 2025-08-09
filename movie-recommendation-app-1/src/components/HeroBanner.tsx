"use client";
import React from "react";
import Image from "next/image";

interface HeroBannerProps {
  title: string;
  description: string;
  backgroundImage: string;
}

export default function HeroBanner({ title, description, backgroundImage }: HeroBannerProps) {
  return (
    <div className="relative w-full h-[70vh] bg-black text-white">
      {/* ✅ Ensure parent has relative position for 'fill' to work */}
      <div className="absolute inset-0">
        <Image
          src={backgroundImage}
          alt={title}
          fill
          priority
          className="object-cover object-center brightness-50"
        />
      </div>

      {/* ✅ Content Overlay */}
      <div className="relative z-10 h-full flex flex-col justify-center px-8 md:px-16 max-w-3xl">
        <h1 className="text-3xl md:text-5xl font-bold mb-4 drop-shadow-lg">{title}</h1>
        <p className="text-lg md:text-xl opacity-90">{description}</p>
      </div>
    </div>
  );
}
