"use client";

import { useState, useRef, useCallback } from "react";
import { useMutation, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { getFileValidationError, formatFileSize } from "@/lib/utils";

interface UploadFormProps {
  onIdentificationCreated: (id: Id<"identifications">) => void;
}

export function UploadForm({ onIdentificationCreated }: UploadFormProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);
  const createIdentification = useMutation(api.identifications.create);
  const identifyPlant = useAction(api.plantnet.identifyPlant);

  const handleFile = useCallback(async (file: File) => {
    // Validate file
    const validationError = getFileValidationError(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setError(null);

    try {
      // Step 1: Get upload URL
      const uploadUrl = await generateUploadUrl();

      // Step 2: Upload file to storage
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": selectedFile.type },
        body: selectedFile,
      });

      if (!result.ok) {
        throw new Error("Failed to upload image");
      }

      const { storageId } = await result.json();

      // Step 3: Create identification record
      const identificationId = await createIdentification({
        uploadedImageId: storageId,
      });

      // Step 4: Trigger plant identification
      identifyPlant({
        identificationId,
        storageId,
      });

      // Notify parent
      onIdentificationCreated(identificationId);

      // Reset form
      setSelectedFile(null);
      setPreview(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreview(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      {/* Drop zone / Preview */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg transition-colors overflow-hidden
          ${isDragging ? "border-green-500 bg-green-50" : "border-gray-300 hover:border-green-500"}
          ${preview ? "p-0" : "p-12"}
        `}
      >
        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="w-full max-h-96 object-contain"
            />
            <button
              onClick={handleClear}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
              title="Remove image"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        ) : (
          <div className="text-center">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/heic,image/heif,image/webp"
              capture="environment"
              className="hidden"
              id="file-upload"
              onChange={handleFileSelect}
            />
            <label htmlFor="file-upload" className="cursor-pointer block">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="mt-2 text-sm text-gray-600">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-500 mt-1">
                JPEG, PNG, HEIC, WebP up to 10MB
              </p>
            </label>
          </div>
        )}
      </div>

      {/* File info */}
      {selectedFile && (
        <div className="flex items-center justify-between text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
          <span className="truncate">{selectedFile.name}</span>
          <span className="text-gray-400 ml-2">
            {formatFileSize(selectedFile.size)}
          </span>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Upload button */}
      {selectedFile && (
        <button
          onClick={handleUpload}
          disabled={isUploading}
          className={`
            w-full py-3 px-4 rounded-lg font-medium text-white transition-colors
            ${isUploading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
            }
          `}
        >
          {isUploading ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Uploading...
            </span>
          ) : (
            "Identify Plant"
          )}
        </button>
      )}
    </div>
  );
}
