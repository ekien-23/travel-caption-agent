export default function handler(req, res) {
  // CORS damit Scanner und Agents drauf dürfen
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'x-payment, payment-signature, content-type');
  res.setHeader('Content-Type', 'application/json');

  const hasPayment = req.headers['x-payment'] || req.headers['payment-signature'] || req.query.bypass;

  // Kein Payment -> 402 zurückgeben - DAS will x402scan sehen
  if (!hasPayment) {
    return res.status(402).json({
      x402Version: 2,
      error: "Payment Required - $0.03 USDC on Base",
      accepts: [
        {
          scheme: "exact",
          network: "eip155:8453",
          maxAmountRequired: "30000",
          resource: "https://travel-caption-agent.vercel.app/api/virality",
          payTo: "0x1c92f0c2c63255840313d82b13295ecc83503c04",
          asset: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
          maxTimeoutSeconds: 60,
          extra: { name: "USDC", version: "2" }
        }
      ]
    });
  }

  // Mit Payment (oder ?bypass=1 zum Testen) -> dein echtes Produkt
  const image = req.query.image || 'travel';
  return res.status(200).json({
    caption: `POV: You found paradise at ${image} 🌴 No filter needed for this view. Who would you bring here? 👇`,
    hashtags: ["#traveltok","#wanderlust","#beachvibes","#hiddenparadise","#travelhacks","#solotravel","#povtravel","#sunsetlovers","#bucketlist","#travelinspo","#islandlife","#explorepage","#travelgram","#adventuretime","#vacaymode","#travelreels","#paradisefound","#traveltip","#beachlife","#travelwithme","#globetrotter","#traveladdict","#tropicalvibes","#travelcreator","#viraltravel"],
    alt: `A stunning view of ${image} with turquoise water and palm trees`,
    bestTimeToPost: "19:00 CET",
    hook: "This place looks unreal..."
  });
}
