"use client";

interface PlantMatch {
  species: {
    scientificName: string;
    commonNames: string[];
    family: string;
    genus: string;
  };
  score: number;
  images?: {
    url: string;
    citation?: string;
  }[];
}

interface ResultCardProps {
  match: PlantMatch;
  rank: number;
}

export function ResultCard({ match, rank }: ResultCardProps) {
  const confidencePercent = Math.round(match.score * 100);

  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">
            {match.species.scientificName}
          </h3>
          {match.species.commonNames.length > 0 && (
            <p className="text-sm text-gray-600 mt-1">
              {match.species.commonNames.join(", ")}
            </p>
          )}
        </div>
        <span className="text-2xl font-bold text-green-600">#{rank}</span>
      </div>

      <div className="space-y-2">
        <div>
          <span className="text-sm text-gray-500">Confidence:</span>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${confidencePercent}%` }}
              />
            </div>
            <span className="text-sm font-medium">{confidencePercent}%</span>
          </div>
        </div>

        <div className="text-sm text-gray-500">
          <span className="font-medium">Family:</span> {match.species.family}
        </div>
        <div className="text-sm text-gray-500">
          <span className="font-medium">Genus:</span> {match.species.genus}
        </div>
      </div>

      {/* Reference images from API */}
      {match.images && match.images.length > 0 && (
        <div className="mt-4">
          <p className="text-sm text-gray-500 mb-2">Reference images:</p>
          <div className="flex gap-2 overflow-x-auto">
            {match.images.map((img, index) => (
              <img
                key={index}
                src={img.url}
                alt={`${match.species.scientificName} reference ${index + 1}`}
                className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
