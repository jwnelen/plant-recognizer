/**
 * Types for Pl@ntNet API integration
 */

export interface PlantNetImage {
  organ: string;
  author?: string;
  license?: string;
  date?: {
    timestamp: number;
  };
  citation?: string;
  url: {
    o: string; // original
    m: string; // medium
    s: string; // small
  };
}

export interface PlantNetSpecies {
  scientificNameWithoutAuthor: string;
  scientificNameAuthorship?: string;
  genus?: {
    scientificNameWithoutAuthor: string;
    scientificNameAuthorship?: string;
  };
  family?: {
    scientificNameWithoutAuthor: string;
    scientificNameAuthorship?: string;
  };
  commonNames?: string[];
}

export interface PlantNetResult {
  score: number;
  species: PlantNetSpecies;
  images?: PlantNetImage[];
  gbif?: {
    id: string;
  };
}

export interface PlantNetAPIResponse {
  query: {
    project: string;
    images: string[];
    organs: string[];
    includeRelatedImages: boolean;
  };
  language: string;
  preferedReferential: string;
  bestMatch?: string;
  results: PlantNetResult[];
  version: string;
  remainingIdentificationRequests: number;
}

export interface PlantNetAPIError {
  statusCode: number;
  message: string;
  error?: string;
}
