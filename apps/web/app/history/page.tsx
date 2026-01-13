"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { HistoryItem } from "@/components/history/HistoryItem";

export default function HistoryPage() {
  const identifications = useQuery(api.identifications.list);

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-green-700">
          Identification History
        </h1>
        <p className="text-gray-600 mt-2">
          View all your past plant identifications
        </p>
      </header>

      {identifications === undefined ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-green-500 border-t-transparent rounded-full" />
        </div>
      ) : identifications.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <svg
            className="w-16 h-16 text-gray-300 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <h2 className="text-xl font-medium text-gray-700 mb-2">
            No identifications yet
          </h2>
          <p className="text-gray-500 mb-6">
            Upload a plant photo to get started!
          </p>
          <a
            href="/"
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            Identify a Plant
          </a>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {identifications.map((identification) => (
            <HistoryItem
              key={identification._id}
              identification={identification as any}
            />
          ))}
        </div>
      )}
    </div>
  );
}
