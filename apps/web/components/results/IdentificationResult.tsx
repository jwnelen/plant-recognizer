"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { ResultCard } from "./ResultCard";

interface IdentificationResultProps {
  identificationId: Id<"identifications">;
  onNewIdentification: () => void;
}

export function IdentificationResult({
  identificationId,
  onNewIdentification,
}: IdentificationResultProps) {
  const identification = useQuery(api.identifications.get, {
    id: identificationId,
  });

  if (identification === undefined) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-green-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (identification === null) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Identification not found</p>
        <button
          onClick={onNewIdentification}
          className="mt-4 text-green-600 hover:text-green-700 font-medium"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Uploaded image */}
      {identification.uploadedImageUrl && (
        <div className="rounded-lg overflow-hidden shadow-lg">
          <img
            src={identification.uploadedImageUrl}
            alt="Uploaded plant"
            className="w-full max-h-64 object-contain bg-gray-100"
          />
        </div>
      )}

      {/* Status-based content */}
      {identification.status === "pending" && (
        <div className="text-center py-8 bg-white rounded-lg shadow">
          <div className="animate-spin h-10 w-10 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600">Identifying your plant...</p>
          <p className="text-sm text-gray-400 mt-1">
            This may take a few seconds
          </p>
        </div>
      )}

      {identification.status === "success" && identification.matches && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Identification Results
          </h2>
          <div className="space-y-4">
            {identification.matches.map((match, index) => (
              <ResultCard key={index} match={match} rank={index + 1} />
            ))}
          </div>
        </div>
      )}

      {identification.status === "no_match" && (
        <div className="text-center py-8 bg-yellow-50 rounded-lg border border-yellow-200">
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
          <h3 className="text-lg font-medium text-yellow-800">No Match Found</h3>
          <p className="text-yellow-700 mt-1">
            {identification.errorMessage || "We couldn't identify this plant."}
          </p>
          <p className="text-sm text-yellow-600 mt-2">
            Try uploading a clearer photo of the leaves, flowers, or fruit.
          </p>
        </div>
      )}

      {identification.status === "failed" && (
        <div className="text-center py-8 bg-red-50 rounded-lg border border-red-200">
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
            {identification.errorMessage || "An error occurred during identification."}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-center">
        <button
          onClick={onNewIdentification}
          className="py-3 px-6 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
        >
          Identify Another Plant
        </button>
      </div>
    </div>
  );
}
