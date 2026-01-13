import { v } from "convex/values";
import { action, internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";
import type { PlantNetAPIResponse } from "@plant-recognizer/types";

const PLANTNET_API_URL = "https://my-api.plantnet.org/v2/identify/all";

/**
 * Action to identify a plant using the Pl@ntNet API
 */
export const identifyPlant = action({
  args: {
    identificationId: v.id("identifications"),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const apiKey = process.env.PLANTNET_API_KEY;

    if (!apiKey) {
      await ctx.runMutation(internal.plantnet.updateIdentificationStatus, {
        id: args.identificationId,
        status: "failed",
        errorMessage: "Pl@ntNet API key not configured",
      });
      return;
    }

    try {
      // Get the image URL from storage
      const imageUrl = await ctx.storage.getUrl(args.storageId);

      if (!imageUrl) {
        await ctx.runMutation(internal.plantnet.updateIdentificationStatus, {
          id: args.identificationId,
          status: "failed",
          errorMessage: "Could not retrieve uploaded image",
        });
        return;
      }

      // Fetch the image data
      const imageResponse = await fetch(imageUrl);
      const imageBlob = await imageResponse.blob();

      // Determine the correct file extension based on MIME type
      const mimeType = imageBlob.type;
      let filename = "plant.jpg";
      if (mimeType === "image/png") {
        filename = "plant.png";
      } else if (mimeType === "image/jpeg" || mimeType === "image/jpg") {
        filename = "plant.jpg";
      }

      // Prepare form data for Pl@ntNet API
      // Each image needs organs appended first, then the image
      const formData = new FormData();
      formData.append("organs", "auto");
      formData.append("images", imageBlob, filename);

      // Call Pl@ntNet API
      const url = new URL(PLANTNET_API_URL);
      url.searchParams.set("api-key", apiKey);
      url.searchParams.set("include-related-images", "true");
      url.searchParams.set("no-reject", "false");
      url.searchParams.set("nb-results", "5");
      url.searchParams.set("lang", "en");

      const response = await fetch(url.toString(), {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        let errorMessage = `Pl@ntNet API error: ${response.status}`;

        // Try to get error details from response body
        try {
          const errorBody = await response.text();
          console.error("PlantNet API error details:", errorBody);
          errorMessage += ` - ${errorBody}`;
        } catch (e) {
          // Ignore if we can't read the error body
        }

        if (response.status === 404) {
          // No match found - this is not an error, just no results
          await ctx.runMutation(internal.plantnet.updateIdentificationStatus, {
            id: args.identificationId,
            status: "no_match",
            errorMessage: "No plant matches found. Try a clearer photo.",
          });
          return;
        }

        if (response.status === 429) {
          errorMessage = "Rate limit exceeded. Please try again later.";
        } else if (response.status === 401) {
          errorMessage = "Invalid API key";
        }

        await ctx.runMutation(internal.plantnet.updateIdentificationStatus, {
          id: args.identificationId,
          status: "failed",
          errorMessage,
        });
        return;
      }

      const data = (await response.json()) as PlantNetAPIResponse;

      // Transform API response to our format
      const matches = data.results.slice(0, 5).map((result) => {
        // Construct full scientific name from parts
        const scientificName = result.species.scientificNameAuthorship
          ? `${result.species.scientificNameWithoutAuthor} ${result.species.scientificNameAuthorship}`
          : result.species.scientificNameWithoutAuthor;

        return {
          species: {
            scientificName,
            commonNames: result.species.commonNames || [],
            family:
              result.species.family?.scientificNameWithoutAuthor || "Unknown",
            genus:
              result.species.genus?.scientificNameWithoutAuthor || "Unknown",
          },
          score: result.score,
          images: result.images?.slice(0, 3).map((img) => ({
            url: img.url.m,
            citation: img.citation,
          })),
        };
      });

      if (matches.length === 0) {
        await ctx.runMutation(internal.plantnet.updateIdentificationStatus, {
          id: args.identificationId,
          status: "no_match",
          errorMessage: "No plant matches found. Try a clearer photo.",
        });
        return;
      }

      // Update the identification with results
      await ctx.runMutation(internal.plantnet.updateIdentificationWithResults, {
        id: args.identificationId,
        matches,
        rawApiResponse: data,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";

      await ctx.runMutation(internal.plantnet.updateIdentificationStatus, {
        id: args.identificationId,
        status: "failed",
        errorMessage,
      });
    }
  },
});

/**
 * Internal mutation to update identification status
 */
export const updateIdentificationStatus = internalMutation({
  args: {
    id: v.id("identifications"),
    status: v.union(
      v.literal("success"),
      v.literal("failed"),
      v.literal("no_match")
    ),
    errorMessage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: args.status,
      errorMessage: args.errorMessage,
    });
  },
});

/**
 * Internal mutation to update identification with full results
 */
export const updateIdentificationWithResults = internalMutation({
  args: {
    id: v.id("identifications"),
    matches: v.array(
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
    ),
    rawApiResponse: v.any(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: "success",
      matches: args.matches,
      rawApiResponse: args.rawApiResponse,
    });
  },
});
