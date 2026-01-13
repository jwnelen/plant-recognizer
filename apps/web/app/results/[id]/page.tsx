"use client";

import { use } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { ResultCard } from "@/components/results/ResultCard";

export default function ResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const identification = useQuery(api.identifications.get, {
    id: id as Id<"identifications">,
  });

  if (identification === undefined) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-green-500 border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  if (identification === null) {
    return (
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-red-600">Not Found</h1>
        </header>
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <p className="text-gray-600">This identification could not be found.</p>
          <a
            href="/"
            className="inline-block mt-4 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700"
          >
            Identify a Plant
          </a>
        </div>
      </div>
    );
  }

  const date = new Date(identification.timestamp);

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-green-700">
          Identification Result
        </h1>
        <p className="text-gray-500 mt-1">
          {date.toLocaleDateString()} at {date.toLocaleTimeString()}
        </p>
      </header>

      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Uploaded image */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Your Photo
            </h2>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {identification.uploadedImageUrl ? (
                <img
                  src={identification.uploadedImageUrl}
                  alt="Uploaded plant"
                  className="w-full object-contain max-h-96"
                />
              ) : (
                <div className="aspect-square bg-gray-200 flex items-center justify-center">
                  <svg
                    className="w-16 h-16 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* Results */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Identification Results
            </h2>

            {identification.status === "pending" && (
              <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                <div className="animate-spin h-10 w-10 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4" />
                <p className="text-gray-600">Identifying your plant...</p>
              </div>
            )}

            {identification.status === "success" && identification.matches && (
              <div className="space-y-4">
                {identification.matches.map((match, index) => (
                  <ResultCard
                    key={index}
                    match={match as any}
                    rank={index + 1}
                  />
                ))}
              </div>
            )}

            {identification.status === "no_match" && (
              <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-8 text-center">
                <svg
                  className="w-12 h-12 text-yellow-500 mx-auto mb-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <h3 className="text-lg font-medium text-yellow-800">
                  No Match Found
                </h3>
                <p className="text-yellow-700 mt-1">
                  {identification.errorMessage ||
                    "We couldn't identify this plant."}
                </p>
              </div>
            )}

            {identification.status === "failed" && (
              <div className="bg-red-50 rounded-lg border border-red-200 p-8 text-center">
                <svg
                  className="w-12 h-12 text-red-500 mx-auto mb-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="text-lg font-medium text-red-800">
                  Identification Failed
                </h3>
                <p className="text-red-700 mt-1">
                  {identification.errorMessage ||
                    "An error occurred during identification."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
