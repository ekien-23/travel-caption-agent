export default function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  return res.status(200).json({
    openapi: "3.0.0",
    info: {
      title: "Travel Caption Agent",
      version: "1.0.0",
      description: "Travel Virality Pack $0.03 - caption + hashtags",
      contact: { name: "Tristan", email: "tristan@travel-caption-agent.vercel.app" }
    },
    servers: [{ url: "https://travel-caption-agent.vercel.app" }],
    paths: {
      "/api/virality": {
        get: {
          summary: "Generate virality pack",
          operationId: "getVirality",
          parameters: [
            {
              name: "image",
              in: "query",
              required: false,
              description: "Image theme - e.g. beach, jungle, city, mountain",
              schema: { type: "string", example: "beach" }
            }
          ],
          responses: {
            "200": {
              description: "Success - virality pack",
              content: { "application/json": { schema: { type: "object", properties: { caption: { type: "string" }, hashtags: { type: "array", items: { type: "string" } } } } } }
            },
            "402": { description: "Payment Required - $0.03 USDC on Base" }
          }
        },
        post: {
          summary: "Generate virality pack (POST)",
          operationId: "postVirality",
          requestBody: {
            required: false,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { image: { type: "string", description: "Image theme", example: "beach" } }
                }
              }
            }
          },
          responses: {
            "200": { description: "Success" },
            "402": { description: "Payment Required" }
          }
        }
      }
    }
  });
}
