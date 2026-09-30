import OpenAI from "openai";
import { withPayment } from "x402-next";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function handler(req, res) {
  const { text } = req.query;
  if (!text) return res.status(400).json({ error: "text Parameter fehlt" });

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{
      role: "user",
      content: `Du bist Travel Tristan's Caption Tool. Aus diesem Reise-Text mach 3 kurze virale Instagram Captions auf Deutsch + 15 Hashtags. Text: ${text.slice(0,5000)}`
    }]
  });

  res.json({ captions: completion.choices[0].message.content });
}

export default withPayment(handler, {
  price: "$0.01",
  payTo: process.env.CDP_WALLET_ADDRESS,
  network: "base"
});
