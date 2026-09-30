export default function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'x-payment, payment-signature, content-type');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    return res.status(200).end();
  }

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'x-payment, payment-signature, content-type');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json');

  const hasPayment = req.headers['x-payment'] || req.headers['payment-signature'] || req.query.bypass;
  const host = req.headers.host || 'travel-caption-agent.vercel.app';
  const fullUrl = `https://${host}${req.url}`; // wichtig: mit ?image=beach wenn vorhanden

  const paymentObj = {
    x402Version: 2,
    resource: fullUrl,
    error: "Payment Required - $0.03 USDC on Base",
    accepts: [{
      scheme: "exact",
      network: "base",
      maxAmountRequired: "30000",
      amount: "30000",
      resource: fullUrl,
      description: "Travel Virality Pack",
      mimeType: "application/json",
      payTo: "0x1c92f0c2c63255840313d82b13295ecc83503c04",
      asset: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
      maxTimeoutSeconds: 300,
      extra: { name: "USDC", version: "2" }
    }]
  };

  if (!hasPayment) {
    const b64 = Buffer.from(JSON.stringify(paymentObj)).toString('base64url');
    res.setHeader('PAYMENT-REQUIRED', b64);
    res.setHeader('X-PAYMENT-REQUIRED', b64);
    return res.status(402).json(paymentObj);
  }

  const image = req.query.image || 'beach';
  return res.status(200).json({
    caption: `POV: ${image} paradise 🌴`,
    hashtags: ["#traveltok","#wanderlust"],
    alt: `View of ${image}`
  });
}
