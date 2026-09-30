import OpenAI from "openai";
import { withX402 } from "x402-next";

const handler = async (req, res) => {
  try {
    const image = req.query.image || req.body?.image || "a beautiful travel beach";

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "user", content: `Schreibe eine kurze, coole Instagram Caption für: ${image}. Max 2 Sätze + Hashtags.` }
      ],
      max_tokens: 100,
    });

    const caption = response.choices[0].message.content;

    return res.status(200).json({
      caption: caption,
      payTo: process.env.CDP_WALLET_ADDRESS,
      network: "base",
      price: "$0.01"
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

// Das ist die Bezahlschranke - $0.01 auf Base an deine blaue Wallet
export default withX402(
  handler,
  process.env.CDP_WALLET_ADDRESS,
  {
    price: "$0.01",
    network: "base",
    config: {
      description: "AI Travel Caption - $0.01 per caption"
    }
  }
);
