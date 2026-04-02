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
    if (!apiKey) {
      appendMessage(els.messages, "assistant", "Add an OpenAI API key to use the live agent. For a public site, you should move this call behind your own backend.");
      setStatus(els.status, "Missing API key");
      return;
    }

    sessionStorage.setItem(AGENT_STORAGE_KEY, apiKey);
    appendMessage(els.messages, "user", prompt);
    els.prompt.value = "";
    setStatus(els.status, "Thinking...");

    try {
      const imageDataUrl = await maybeReadImageFile(els.photo.files?.[0]);
      const answer = await runStickerAgent({
        apiKey,
        model: (els.model.value || config.model || "gpt-5-mini").trim(),
        reasoningEffort: config.reasoningEffort || "low",
        prompt,
        imageDataUrl
      });
      appendMessage(els.messages, "assistant", answer);
      setStatus(els.status, "Done");
    } catch (error) {
      appendMessage(els.messages, "assistant", `Agent error: ${String(error.message || error)}`);
      setStatus(els.status, "Error");
    }
  });
});

async function runStickerAgent({ apiKey, model, reasoningEffort, prompt, imageDataUrl }) {
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
