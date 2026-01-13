/**
 * Utility functions for the application
 */

/**
 * Format file size in bytes to human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
}

/**
 * Validate image file type
 */
export function isValidImageType(file: File): boolean {
  const validTypes = ["image/jpeg", "image/png", "image/heic", "image/heif", "image/webp"];
  return validTypes.includes(file.type);
}

/**
 * Validate image file size (max 10MB)
 */
export function isValidImageSize(file: File): boolean {
  const maxSize = 10 * 1024 * 1024; // 10MB
  return file.size <= maxSize;
}

/**
 * Get error message for file validation
 */
export function getFileValidationError(file: File): string | null {
  if (!isValidImageType(file)) {
    return "Invalid file type. Please upload a JPEG, PNG, HEIC, or WebP image.";
  }
  if (!isValidImageSize(file)) {
    return `File too large (${formatFileSize(file.size)}). Maximum size is 10MB.`;
  }
  return null;
}
