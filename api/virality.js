export default async function handler(req, res) {
  // CORS
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'x-payment, payment-signature, X-PAYMENT, content-type');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    return res.status(200).end();
  }
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'x-payment, payment-signature, X-PAYMENT, content-type');
  res.setHeader('Cache-Control', 'no-store');

  const FACILITATOR = "https://x402.org/facilitator";
  const host = req.headers.host || 'travel-caption-agent.vercel.app';
  const fullUrl = `https://${host}${req.url}`;

  const paymentRequirements = {
    scheme: "exact",
    network: "eip155:8453", // CAIP-2 Base
    amount: "30000", // $0.03 in USDC atomic (6 decimals)
    asset: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", // USDC Base
    payTo: "0x1c92f0c2c63255840313d82b13295ecc83503c04", // DEINE Wallet
    maxTimeoutSeconds: 300,
    extra: { name: "USDC", version: "2" }
  };

  const paymentObj = {
    x402Version: 2,
    resource: {
      url: fullUrl,
      description: "Travel Virality Pack - caption + hashtags",
      mimeType: "application/json"
    },
    error: "Payment Required - $0.03 USDC on Base",
    accepts: [paymentRequirements]
  };

  const paymentHeader = req.headers['x-payment'] || req.headers['payment-signature'] || req.headers['X-PAYMENT'] || req.headers['x-PAYMENT'];

  if (!paymentHeader) {
    const b64 = Buffer.from(JSON.stringify(paymentObj)).toString('base64url');
