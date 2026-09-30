import OpenAI from "openai";

export default async function handler(req, res) {
  try {
    const image = req.query.image || req.body?.image || "a beautiful travel beach";
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: `Schreibe eine kurze Instagram Caption für: ${image}` }],
      max_tokens: 100,
    });
    return res.status(200).json({ caption: response.choices[0].message.content, payTo: process.env.CDP_WALLET_ADDRESS });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
