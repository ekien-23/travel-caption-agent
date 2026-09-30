import OpenAI from "openai";

export default async function handler(req, res) {
  try {
    const image = req.query.image || req.body?.image || "a beautiful travel beach";

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: "OPENAI_API_KEY fehlt in Vercel" });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "user", content: `Schreibe eine kurze, coole Instagram Caption für: ${image}` }
      ],
      max_tokens: 100,
    });

    const caption = response.choices[0].message.content;

    return res.status(200).json({
      caption: caption,
      payTo: process.env.CDP_WALLET_ADDRESS || "not-set",
      status: "ok ohne x402 gerade"
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message, stack: error.stack });
  }
}
