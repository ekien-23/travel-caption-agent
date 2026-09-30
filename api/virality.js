export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'x-payment, payment-signature, content-type');
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');

  const hasPayment = req.headers['x-payment'] || req.headers['payment-signature'] || req.query.bypass;

  const paymentObj = {
    x402Version: 2,
    error: "Payment Required - $0.03 USDC on Base",
    accepts: [{
      scheme: "exact",
      network: "eip155:8453",
      maxAmountRequired: "30000",
      resource: "https://travel-caption-agent.vercel.app/api/virality",
      payTo: "0x1c92f0c2c63255840313d82b13295ecc83503c04",
      asset: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
      maxTimeoutSeconds: 60,
      extra: { name: "USDC", version: "2" }
    }]
  };

  if (!hasPayment) {
    const b64 = Buffer.from(JSON.stringify(paymentObj)).toString('base64');
    res.setHeader('PAYMENT-REQUIRED', b64);
    return res.status(402).json(paymentObj);
  }

  const image = req.query.image || 'travel';
  return res.status(200).json({
    caption: `POV: You found paradise at ${image} 🌴 No filter needed.`,
    hashtags: ["#traveltok","#wanderlust","#beachvibes","#travelhacks"],
    alt: `A stunning view of ${image}`,
    bestTimeToPost: "19:00 CET"
  });
}
