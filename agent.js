const AGENT_STORAGE_KEY = "sticker-orbit-agent-key-v1";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#agentForm");
  if (!form) return;

  const els = {
    form,
    apiKey: document.querySelector("#agentApiKey"),
    model: document.querySelector("#agentModel"),
    photo: document.querySelector("#agentPhoto"),
    prompt: document.querySelector("#agentPrompt"),
    messages: document.querySelector("#agentMessages"),
    status: document.querySelector("#agentStatus"),
    clear: document.querySelector("#clearAgentChat"),
    quickPrompts: Array.from(document.querySelectorAll(".quick-prompt"))
  };

  const config = window.STICKER_ORBIT_OPENAI || {};
  const savedKey = sessionStorage.getItem(AGENT_STORAGE_KEY) || "";
  els.apiKey.value = savedKey;
  els.model.value = config.model || "gpt-5-mini";
  setStatus(els.status, "Offline creative mode");

  els.quickPrompts.forEach((button) => {
    button.addEventListener("click", () => {
      els.prompt.value = button.dataset.prompt || "";
      els.prompt.focus();
    });
  });

  els.clear.addEventListener("click", () => {
    els.messages.innerHTML = '<article class="agent-bubble agent-bubble-assistant">Ask for captions, pack ideas, launch copy, or image-aware sticker direction.</article>';
  });

  els.form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const prompt = els.prompt.value.trim();
    if (!prompt) return;

    const apiKey = (els.apiKey.value || config.apiKey || "").trim();
    if (apiKey) {
      sessionStorage.setItem(AGENT_STORAGE_KEY, apiKey);
    }
    appendMessage(els.messages, "user", prompt);
    els.prompt.value = "";
    setStatus(els.status, "Thinking...");

    try {
      const imageDataUrl = await maybeReadImageFile(els.photo.files?.[0]);
      const answer = await runStickerAgent({
        apiEndpoint: config.apiEndpoint || "/api/agent",
        preferProxy: Boolean(config.preferProxy),
        apiKey,
        model: (els.model.value || config.model || "gpt-5-mini").trim(),
        reasoningEffort: config.reasoningEffort || "low",
        prompt,
        imageDataUrl
      });
      appendMessage(els.messages, "assistant", answer);
      setStatus(els.status, apiKey ? "Done" : "Offline creative mode");
    } catch (error) {
      const fallback = buildOfflineReply({
        prompt,
        hasImage: Boolean(imageDataUrl)
      });
      appendMessage(els.messages, "assistant", fallback);
      setStatus(els.status, "Offline creative mode");
    }
  });
});

async function runStickerAgent({ apiEndpoint, preferProxy, apiKey, model, reasoningEffort, prompt, imageDataUrl }) {
  if (preferProxy) {
    const proxyResult = await tryProxyRequest({ apiEndpoint, model, reasoningEffort, prompt, imageDataUrl });
    if (proxyResult.ok) return proxyResult.text;
    if (!apiKey) {
      return buildOfflineReply({ prompt, hasImage: Boolean(imageDataUrl) });
    }
  }

  if (!apiKey) {
    return buildOfflineReply({ prompt, hasImage: Boolean(imageDataUrl) });
  }

  return runDirectRequest({ apiKey, model, reasoningEffort, prompt, imageDataUrl });
}

async function tryProxyRequest({ apiEndpoint, model, reasoningEffort, prompt, imageDataUrl }) {
  try {
    const response = await fetch(apiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        reasoningEffort,
        prompt,
        imageDataUrl
      })
    });

    const data = await response.json();
    if (!response.ok) {
      return { ok: false, error: data.error || `Proxy failed with ${response.status}.` };
    }

    return { ok: true, text: data.output_text || "The agent returned no text output." };
  } catch {
    return { ok: false, error: "Proxy endpoint unavailable." };
  }
}

async function runDirectRequest({ apiKey, model, reasoningEffort, prompt, imageDataUrl }) {
  const userContent = [{ type: "input_text", text: prompt }];
  if (imageDataUrl) {
    userContent.push({ type: "input_image", image_url: imageDataUrl });
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
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

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `HTTP ${response.status}`);
  }

  const data = await response.json();
  return data.output_text || "The agent returned no text output.";
}

function appendMessage(container, role, text) {
  const article = document.createElement("article");
  article.className = `agent-bubble ${role === "user" ? "agent-bubble-user" : "agent-bubble-assistant"}`;
  article.textContent = text;
  container.append(article);
  container.scrollTop = container.scrollHeight;
}

function setStatus(node, text) {
  node.textContent = text;
}

function maybeReadImageFile(file) {
  if (!file) return Promise.resolve("");
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function buildOfflineReply({ prompt, hasImage }) {
  const topic = prompt.toLowerCase();
  if (topic.includes("caption")) {
    return [
      "Offline caption set:",
      "1. Running on vibes and poor decisions",
      "2. Certified chaos, still adorable",
      "3. Low battery, high drama",
      "4. Main character on snack break",
      "5. Too cute to stay quiet"
    ].join("\n");
  }

  if (topic.includes("price") || topic.includes("premium") || topic.includes("pack")) {
    return [
      "Offline pack plan:",
      "- Pack theme: Neon reaction pack",
      "- Audience: streamers, Discord communities, meme-heavy chats",
      "- 6 sticker names: Lag Panic, Clip It, Low Battery, W Key Mood, No Notes, Stream Goblin",
      "- Suggested entry price: $3 to $5",
      "- Upsell: creator bundle with alternate colorways and transparent PNG set"
    ].join("\n");
  }

  if (hasImage || topic.includes("image") || topic.includes("photo")) {
    return [
      "Offline image direction:",
      "- Best preset: Comic Ink for sharp faces, Dream Wash for softer portraits",
      "- Title idea: Certified Icon",
      "- Caption idea: Built different, exporting now",
      "- Accent color: cyan or hot pink",
      "- Shape: rounded for portraits, badge for reaction stickers"
    ].join("\n");
  }

  return [
    "Offline creative response:",
    "- Sticker title: Absolute Mood",
    "- Caption: Too iconic to crop",
    "- Style preset: Neon Pulse",
    "- Shape: Badge",
    "- Pack idea: 8 reaction stickers built around hype, panic, sleep, and snack energy"
  ].join("\n");
}
