export default async function handler(req, res) {
  // --- x402 Check - das fehlt dem Scanner ---
  const paymentHeader = req.headers['x-payment'] || req.headers['payment-signature'];
  
  if (!paymentHeader) {
    res.setHeader('Content-Type', 'application/json');
    return res.status(402).json({
      x402Version: 2,
      error: "Payment Required - $0.03 USDC on Base",
      accepts: [
        {
          scheme: "exact",
          network: "eip155:8453", // Base
          maxAmountRequired: "30000", // $0.03 = 30000 mit 6 decimals
          resource: "https://travel-caption-agent.vercel.app/api/virality",
          payTo: "0x1c92f0c2c63255840313d82b13295ecc83503c04",
          asset: "0x036CbD53842c5426634e7929541eC2318f3dCF7e", // USDC on Base
          maxTimeoutSeconds: 60,
          extra: {
            name: "USDC",
            version: "2"
          }
        }
      ]
    });
  }


import OpenAI from "openai";

const PAY_TO = "0x1c92f0c2c63255840313d82b13295ecc83503c04";
const USDC_BASE = "0x036CbD53842c5426634e7929541eC2318f3dCF7e"; // USDC auf Base
const FACILITATOR = "https://x402.org/facilitator";
const PRICE = "30000"; // $0.03 = 30000 (USDC hat 6 Dezimalstellen)

export default async function handler(req, res) {
  const paymentHeader = req.headers['x-payment'];
  const resourceUrl = `https://${req.headers.host}${req.url}`;

  // 1. Keine Zahlung -> 402 mit $0.03
  if (!paymentHeader) {
    return res.status(402).json({
      x402Version: 2,
      error: "Payment Required - Travel Virality Pack $0.03",
      accepts: [{
        scheme: "exact",
        network: "base",
        maxAmountRequired: PRICE,
        resource: resourceUrl,
        payTo: PAY_TO,
        asset: USDC_BASE,
        maxTimeoutSeconds: 300,
        description: "Travel Virality Pack: caption + 25 hashtags + alt + best time"
      }]
    });
  }

  try {
    // 2. Zahlung prüfen
    const verifyRes = await fetch(`${FACILITATOR}/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        xPayment: paymentHeader,
        resourceUrl: resourceUrl,
        acceptance: {
          scheme: "exact",
          network: "base",
          maxAmountRequired: PRICE,
          payTo: PAY_TO,
          asset: USDC_BASE
        }
      })
    });
    const verify = await verifyRes.json();
    
    if (!verify.isValid) {
      return res.status(402).json({ error: "Zahlung ungültig", details: verify });
    }

    // 3. Wirklich abbuchen - hier fließen die $0.03 an dich!
    await fetch(`${FACILITATOR}/settle`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        xPayment: paymentHeader,
        resourceUrl: resourceUrl,
        acceptance: {
          scheme: "exact",
          network: "base",
          maxAmountRequired: PRICE,
          payTo: PAY_TO,
          asset: USDC_BASE
        }
      })
    });

    // 4. Virality Pack generieren
    const image = req.query.image || req.body?.image || "sunset beach Costa Rica jungle";
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [{
        role: "user",
        content: `You are a viral travel Instagram expert in style of travel_with_tristan - Pura Vida, jungle, beach, Costa Rica.
        Topic: ${image}
        Return JSON with:
        - caption: 1-2 sentence viral caption with 2 emojis
        - hashtags: array of 25 viral travel hashtags
        - altText: SEO alt text 1 sentence
        - bestTime: best posting time CET like "19:30 CET"`
      }],
      max_tokens: 400,
    });

    const data = JSON.parse(completion.choices[0].message.content);

    res.setHeader("X-PAYMENT-RESPONSE", JSON.stringify(verify));
    return res.status(200).json({
      ...data,
      paid: true,
      amount: "$0.03",
      payTo: PAY_TO,
      network: "base",
      settlement: verify
    });

  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
  }
