"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [search, setSearch] = useState("");

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-black text-white fixed top-0 left-0 w-full z-50">
      {/* Logo */}
      <Link href="/" className="text-red-600 font-extrabold text-2xl">
        NETFLIX
      </Link>

      {/* Navigation Links */}
      <div className="hidden md:flex gap-6">
        <Link href="/">Home</Link>
        <Link href="/tv-shows">TV Shows</Link>
        <Link href="/movies">Movies</Link>
        <Link href="/new-popular">New & Popular</Link>
        <Link href="/my-list">My List</Link>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search"
        className="bg-gray-800 rounded px-3 py-1 ml-4 text-sm"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </nav>
  );
}
