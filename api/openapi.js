export default function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  return res.status(200).json({
    openapi: "3.0.0",
    info: { title: "Travel Caption Agent", version: "1.0.0", description: "Travel Virality Pack $0.03" },
    servers: [{ url: "https://travel-caption-agent.vercel.app" }],
    paths: {
      "/api/virality": {
        get: {
          summary: "Generate virality pack",
          parameters: [
            { name: "image", in: "query", required: false, schema: { type: "string" }, description: "e.g. beach, jungle" }
          ],
          responses: {
            "402": { description: "Payment Required" },
            "200": { description: "Success" }
          }
        }
      }
    }
  });
}
