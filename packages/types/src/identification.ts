/**
 * Core types for plant identification
 */

export interface PlantMatch {
  species: {
    scientificName: string;
    commonNames: string[];
    family: string;
    genus: string;
  };
  score: number; // Confidence score (0-1)
  images?: {
    url: string;
    citation?: string;
  }[];
}

export interface IdentificationResult {
  _id: string;
  uploadedImageId: string; // Reference to Convex file storage
  uploadedImageUrl?: string;
  timestamp: number;
  matches: PlantMatch[];
  rawApiResponse?: any; // Full Pl@ntNet API response for debugging
  status: "pending" | "success" | "failed" | "no_match";
  errorMessage?: string;
}

export interface UploadedImage {
  _id: string;
  storageId: string; // Convex file storage ID
  filename: string;
  mimeType: string;
  size: number;
  uploadedAt: number;
}
