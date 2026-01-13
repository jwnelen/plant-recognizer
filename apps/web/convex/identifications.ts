import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

/**
 * Query to get all identifications, sorted by most recent
 */
export const list = query({
  handler: async (ctx) => {
    const identifications = await ctx.db
      .query("identifications")
      .order("desc")
      .collect();

    // Get URLs for uploaded images
    const identificationsWithUrls = await Promise.all(
      identifications.map(async (identification) => {
        const url = await ctx.storage.getUrl(identification.uploadedImageId);
        return {
          ...identification,
          uploadedImageUrl: url,
        };
      })
    );

    return identificationsWithUrls;
  },
});

/**
 * Query to get a single identification by ID
 */
export const get = query({
  args: { id: v.id("identifications") },
  handler: async (ctx, args) => {
    const identification = await ctx.db.get(args.id);
    if (!identification) return null;

    const url = await ctx.storage.getUrl(identification.uploadedImageId);
    return {
      ...identification,
      uploadedImageUrl: url,
    };
  },
});

/**
 * Mutation to create a new identification record
 */
export const create = mutation({
  args: {
    uploadedImageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const identificationId = await ctx.db.insert("identifications", {
      uploadedImageId: args.uploadedImageId,
      timestamp: Date.now(),
      status: "pending",
    });

    return identificationId;
  },
});

/**
 * Mutation to update identification with results
 */
export const updateWithResults = mutation({
  args: {
    id: v.id("identifications"),
    status: v.union(
      v.literal("success"),
      v.literal("failed"),
      v.literal("no_match")
    ),
    matches: v.optional(v.any()),
    rawApiResponse: v.optional(v.any()),
    errorMessage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

/**
 * Mutation to delete an identification and its associated image
 */
export const deleteIdentification = mutation({
  args: {
    id: v.id("identifications"),
  },
  handler: async (ctx, args) => {
    // 1. Get the identification record
    const identification = await ctx.db.get(args.id);

    // 2. Return error if not found
    if (!identification) {
      return { success: false, error: "Identification not found" };
    }

    // 3. Store storage ID for cleanup
    const storageId = identification.uploadedImageId;

    // 4. Delete database record first (critical data)
    await ctx.db.delete(args.id);

    // 5. Delete storage file (best effort)
    try {
      await ctx.storage.delete(storageId);
    } catch (error) {
      console.error("Failed to delete storage file:", storageId, error);
      // Don't fail the operation - DB record is already gone
    }

    return { success: true };
  },
});
