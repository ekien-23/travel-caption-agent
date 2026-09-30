import OpenAI from "openai";

export default async function handler(req, res) {
  // 1. Check ob bezahlt wurde
  const payment = req.headers['x-payment'] || req.headers['X-PAYMENT'];

  if (!payment) {
    // Keine Bezahlung -> 402 zurückgeben - das ist das x402 Protokoll!
    return res.status(402).json({
      error: "Payment Required",
      accepts: {
        scheme: "exact",
        network: "base",
        price: "$0.01",
        payTo: process.env.CDP_WALLET_ADDRESS,
        maxTimeoutSeconds: 60
      },
      message: "Send 0.01 USDC on Base to access this caption. Set X-PAYMENT header with payment proof."
    });
  }

  // 2. Wenn X-PAYMENT da ist -> Caption generieren
  try {
    const image = req.query.image || req.body?.image || "a beautiful travel beach";
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: `Schreibe eine kurze Instagram Caption für: ${image}` }],
      max_tokens: 100,
    });

    return res.status(200).json({
      caption: response.choices[0].message.content,
      paid: true,
      payTo: process.env.CDP_WALLET_ADDRESS
    });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
