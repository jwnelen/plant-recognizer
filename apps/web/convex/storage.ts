import { mutation } from "./_generated/server";

/**
 * Generate a signed URL for uploading a file to Convex storage
 */
export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});
