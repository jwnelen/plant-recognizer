"use client";

import { useState } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { UploadForm } from "@/components/upload/UploadForm";
import { IdentificationResult } from "@/components/results/IdentificationResult";

export default function Home() {
  const [currentIdentificationId, setCurrentIdentificationId] =
    useState<Id<"identifications"> | null>(null);

  const handleIdentificationCreated = (id: Id<"identifications">) => {
    setCurrentIdentificationId(id);
  };

  const handleNewIdentification = () => {
    setCurrentIdentificationId(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-green-700 mb-2">
          Plant Recognizer
        </h1>
        <p className="text-gray-600">
          Upload a photo of a plant to identify it
        </p>
      </header>

      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {currentIdentificationId ? (
            <IdentificationResult
              identificationId={currentIdentificationId}
              onNewIdentification={handleNewIdentification}
            />
          ) : (
            <UploadForm onIdentificationCreated={handleIdentificationCreated} />
          )}
        </div>
      </div>
    </div>
  );
}
