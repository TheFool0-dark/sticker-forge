module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "Missing OPENAI_API_KEY on the server." });
    return;
  }

  try {
    const { prompt, imageDataUrl, model = "gpt-5-mini", reasoningEffort = "low" } = req.body || {};
    if (!prompt || typeof prompt !== "string") {
      res.status(400).json({ error: "Prompt is required." });
      return;
    }

    const userContent = [{ type: "input_text", text: prompt }];
    if (imageDataUrl) {
      userContent.push({ type: "input_image", image_url: imageDataUrl });
    }

    const upstream = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        reasoning: { effort: reasoningEffort },
        input: [
          {
            role: "system",
            content: [
              {
                type: "input_text",
                text: "You are Sticker Orbit Agent. Help users create fun sticker ideas, captions, product packs, page copy, and image-aware sticker direction. Be practical, concise, and creative."
              }
            ]
          },
          {
            role: "user",
            content: userContent
          }
        ]
      })
    });

    const data = await upstream.json();
    if (!upstream.ok) {
      res.status(upstream.status).json({ error: data.error?.message || "OpenAI request failed." });
      return;
    }

    res.status(200).json({ output_text: data.output_text || "" });
  } catch (error) {
    res.status(500).json({ error: String(error.message || error) });
  }
};
