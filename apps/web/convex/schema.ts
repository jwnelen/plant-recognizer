import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  identifications: defineTable({
    uploadedImageId: v.id("_storage"),
    timestamp: v.number(),
    status: v.union(
      v.literal("pending"),
      v.literal("success"),
      v.literal("failed"),
      v.literal("no_match")
    ),
    matches: v.optional(
      v.array(
        v.object({
          species: v.object({
            scientificName: v.string(),
            commonNames: v.array(v.string()),
            family: v.string(),
            genus: v.string(),
          }),
          score: v.number(),
          images: v.optional(
            v.array(
              v.object({
                url: v.string(),
                citation: v.optional(v.string()),
              })
            )
          ),
        })
      )
    ),
    rawApiResponse: v.optional(v.any()),
    errorMessage: v.optional(v.string()),
  }).index("by_timestamp", ["timestamp"]),
});
