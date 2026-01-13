"use client";

interface PlantMatch {
  species: {
    scientificName: string;
    commonNames: string[];
    family: string;
    genus: string;
  };
  score: number;
}

interface HistoryItemProps {
  identification: {
    _id: string;
    uploadedImageUrl?: string | null;
    timestamp: number;
    status: "pending" | "success" | "failed" | "no_match";
    matches?: PlantMatch[];
    errorMessage?: string;
  };
}

export function HistoryItem({ identification }: HistoryItemProps) {
  const date = new Date(identification.timestamp);
  const topMatch = identification.matches?.[0];

  const getStatusBadge = () => {
    switch (identification.status) {
      case "pending":
        return (
          <span className="absolute top-2 right-2 bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full">
            Processing...
          </span>
        );
      case "failed":
        return (
          <span className="absolute top-2 right-2 bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full">
            Failed
          </span>
        );
      case "no_match":
        return (
          <span className="absolute top-2 right-2 bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
            No Match
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <a
      href={`/results/${identification._id}`}
      className="block bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden"
    >
      <div className="aspect-square bg-gray-200 relative">
        {identification.uploadedImageUrl ? (
          <img
            src={identification.uploadedImageUrl}
            alt="Uploaded plant"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <svg
              className="w-12 h-12 text-gray-400"
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
        {getStatusBadge()}
      </div>

      <div className="p-4">
        {identification.status === "success" && topMatch ? (
          <>
            <h3 className="font-semibold text-gray-900 truncate">
              {topMatch.species.scientificName}
            </h3>
            {topMatch.species.commonNames && topMatch.species.commonNames.length > 0 && (
              <p className="text-sm text-gray-600 truncate">
                {topMatch.species.commonNames[0]}
              </p>
            )}
          </>
        ) : identification.status === "pending" ? (
          <h3 className="font-semibold text-gray-500">Identifying...</h3>
        ) : identification.status === "no_match" ? (
          <h3 className="font-semibold text-gray-500">No match found</h3>
        ) : (
          <h3 className="font-semibold text-red-600">Identification failed</h3>
        )}

        <p className="text-xs text-gray-500 mt-2">
          {date.toLocaleDateString()} {date.toLocaleTimeString()}
        </p>

        {topMatch && identification.status === "success" && (
          <div className="mt-2">
            <span className="text-xs font-medium text-green-600">
              {Math.round(topMatch.score * 100)}% confidence
            </span>
          </div>
        )}
      </div>
    </a>
  );
}
