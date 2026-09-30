export default function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  return res.status(200).json({
    x402Version: 2,
    resources: [
      {
        resource: "https://travel-caption-agent.vercel.app/api/virality",
        openapiUrl: "https://travel-caption-agent.vercel.app/api/openapi",
        description: "Travel Virality Pack $0.03",
        accepts: [{
          scheme: "exact",
          network: "eip155:8453",
          maxAmountRequired: "30000",
          payTo: "0x1c92f0c2c63255840313d82b13295ecc83503c04",
          asset: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
          maxTimeoutSeconds: 60
        }]
      }
    ]
  });
}
