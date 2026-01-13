"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-white border-b border-green-100 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="text-xl font-bold text-green-700 hover:text-green-800 transition-colors"
          >
            🌿 Plant Recognizer
          </Link>

          <div className="flex items-center gap-6">
            <Link
              href="/"
              className={`font-medium transition-colors ${
                pathname === "/"
                  ? "text-green-700 border-b-2 border-green-700"
                  : "text-gray-600 hover:text-green-700"
              }`}
            >
              Upload
            </Link>
            <Link
              href="/history"
              className={`font-medium transition-colors ${
                pathname === "/history" || pathname?.startsWith("/results")
                  ? "text-green-700 border-b-2 border-green-700"
                  : "text-gray-600 hover:text-green-700"
              }`}
            >
              History
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
