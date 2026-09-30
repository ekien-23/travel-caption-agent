import OpenAI from "openai";

const PAY_TO = process.env.CDP_WALLET_ADDRESS;
const FACILITATOR = "https://x402.org/facilitator";
const USDC_BASE = "0x036CbD53842c5426634e7929541eC2318f3dCF7e"; // USDC auf Base

export default async function handler(req, res) {
  const paymentHeader = req.headers['x-payment'];
  const resourceUrl = `https://${req.headers.host}${req.url}`;

  // 1. Keine Zahlung -> 402 mit echten x402 V2 Daten
  if (!paymentHeader) {
    return res.status(402).json({
      x402Version: 2,
      error: "Payment Required",
      accepts: [{
        scheme: "exact",
        network: "base",
        maxAmountRequired: "10000", // $0.01 = 10000 bei 6 Dezimalstellen
        resource: resourceUrl,
        payTo: PAY_TO,
        asset: USDC_BASE,
        maxTimeoutSeconds: 300,
        description: "AI Travel Caption $0.01"
      }]
    });
  }

  try {
    // 2. Zahlung beim Facilitator prüfen
    const verifyRes = await fetch(`${FACILITATOR}/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        xPayment: paymentHeader,
        resourceUrl: resourceUrl,
        acceptance: {
          scheme: "exact",
          network: "base",
          maxAmountRequired: "10000",
          payTo: PAY_TO,
          asset: USDC_BASE
        }
      })
    });
    const verify = await verifyRes.json();

    if (!verify.isValid) {
      return res.status(402).json({ error: "Zahlung ungültig", details: verify });
    }

    // 3. Zahlung settle - jetzt fließen die $0.01 wirklich an dich!
    await fetch(`${FACILITATOR}/settle`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        xPayment: paymentHeader,
        resourceUrl: resourceUrl,
        acceptance: {
          scheme: "exact",
          network: "base",
          maxAmountRequired: "10000",
          payTo: PAY_TO,
          asset: USDC_BASE
        }
      })
    });

    // 4. Erst jetzt Caption generieren
    const image = req.query.image || req.body?.image || "a beautiful travel beach";
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: `Schreibe eine kurze Instagram Caption für: ${image}` }],
      max_tokens: 100,
    });

    res.setHeader("X-PAYMENT-RESPONSE", JSON.stringify(verify));
    return res.status(200).json({
      caption: completion.choices[0].message.content,
      paid: true,
      payTo: PAY_TO,
      network: "base",
      amount: "$0.01"
    });

  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
