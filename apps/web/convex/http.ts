import { httpRouter } from "convex/server";

const http = httpRouter();

/**
 * HTTP endpoint to trigger plant identification
 * This will be implemented to call the Pl@ntNet API
 */
// http.route({
//   path: "/identify",
//   method: "POST",
//   handler: async (ctx, request) => {
//     // TODO: Implement Pl@ntNet API integration
//     return new Response(JSON.stringify({ message: "Not implemented yet" }), {
//       status: 501,
//     });
//   },
// });

export default http;
