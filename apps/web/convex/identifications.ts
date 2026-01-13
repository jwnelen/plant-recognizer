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
