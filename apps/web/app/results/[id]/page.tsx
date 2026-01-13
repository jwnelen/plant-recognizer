"use client";

import { use, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { ResultCard } from "@/components/results/ResultCard";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

export default function ResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const identification = useQuery(api.identifications.get, {
    id: id as Id<"identifications">,
  });

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const deleteIdentification = useMutation(
    api.identifications.deleteIdentification
  );

  const handleDelete = async () => {
    setIsDeleting(true);
    setDeleteError(null);

    try {
      const result = await deleteIdentification({
        id: id as Id<"identifications">,
      });

      if (result.success) {
        window.location.href = "/history";
      } else {
        setDeleteError(result.error || "Failed to delete identification");
        setIsDeleting(false);
      }
    } catch (error) {
      setDeleteError(
        error instanceof Error ? error.message : "Failed to delete"
      );
      setIsDeleting(false);
    }
  };

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-green-700">
              Identification Result
            </h1>
            <p className="text-gray-500 mt-1">
              {date.toLocaleDateString()} at {date.toLocaleTimeString()}
            </p>
          </div>
          <button
            onClick={() => setShowDeleteDialog(true)}
            className="flex items-center gap-2 px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
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
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Delete
          </button>
        </div>
      </header>

      {deleteError && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {deleteError}
        </div>
      )}

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

      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="Delete Identification?"
        message="Are you sure you want to delete this identification? This action cannot be undone, and the uploaded image will be permanently removed."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteDialog(false)}
        isLoading={isDeleting}
        variant="danger"
      />
    </div>
  );
}
