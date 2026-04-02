const STORAGE_KEY = "sticker-forge-state-v4";

const stickerTypes = [
  { name: "Funny face stickers", price: "Free", badge: "Funny", description: "Reaction-first stickers with bold titles, speech bubbles, and fast visual contrast.", tags: ["meme", "reaction", "face", "free"] },
  { name: "Cute kawaii stickers", price: "Free", badge: "Cute", description: "Pastel stickers with blush, soft shadows, and rounded framing.", tags: ["cute", "pastel", "soft", "free"] },
  { name: "Comic burst stickers", price: "Free", badge: "Comic", description: "Loud action graphics built for merch drops and sticker packs.", tags: ["comic", "bold", "hero", "free"] },
  { name: "Retro badge stickers", price: "Free", badge: "Retro", description: "Warm gradients and badge silhouettes for storefront-ready sets.", tags: ["retro", "badge", "vintage", "free"] },
  { name: "Ghibli-style storybook stickers", price: "Free", badge: "Storybook", description: "Soft painterly stickers with calm skies, petals, and whimsical storybook energy.", tags: ["ghibli", "storybook", "anime", "free"] },
  { name: "Pet mood stickers", price: "Free", badge: "Pets", description: "Expressive built-in characters and pets for instant sticker sets.", tags: ["pets", "cats", "dogs", "free"] },
  { name: "Streamer reaction stickers", price: "Premium", badge: "Hype", description: "Neon-heavy stickers for creator communities and reactions.", tags: ["stream", "reaction", "neon", "premium"] },
  { name: "Custom photo stickers", price: "Free", badge: "Custom", description: "Upload any face photo and use the same live sticker engine.", tags: ["upload", "photo", "custom", "free"] }
];

const styles = [
  { id: "funny", label: "Funny Meme", filter: "contrast(1.2) saturate(1.25)", bg: ["#ffe26d", "#ff7b63"], deco: "laugh", bubble: true },
  { id: "cute", label: "Cute Pop", filter: "brightness(1.08) saturate(1.08)", bg: ["#ffd8ef", "#fff0a8"], deco: "hearts", bubble: false },
  { id: "comic", label: "Comic Burst", filter: "contrast(1.35) saturate(1.3)", bg: ["#7de1ff", "#6de5c2"], deco: "burst", bubble: true },
  { id: "retro", label: "Retro Badge", filter: "sepia(0.26) contrast(1.05) saturate(1.06)", bg: ["#ffcf71", "#ff735b"], deco: "sun", bubble: false },
  { id: "ghibli", label: "Ghibli Dream", filter: "brightness(1.04) saturate(0.92)", bg: ["#d5f1ff", "#9fd58d"], deco: "petals", bubble: false },
  { id: "neon", label: "Neon Hype", filter: "contrast(1.4) saturate(1.34) hue-rotate(-8deg)", bg: ["#583dff", "#ff4bc2"], deco: "stars", bubble: true }
];

const aiPresets = [
  { id: "comic-ink", label: "Comic Ink", tint: [56, 126, 255], sat: 1.25, contrast: 1.28, posterize: 6, edge: 1.25, glow: [97, 240, 214] },
  { id: "dream-wash", label: "Dream Wash", tint: [122, 226, 255], sat: 0.96, contrast: 1.06, posterize: 7, edge: 0.6, glow: [255, 173, 223] },
  { id: "neon-pulse", label: "Neon Pulse", tint: [255, 74, 195], sat: 1.42, contrast: 1.3, posterize: 5, edge: 1.15, glow: [111, 246, 223] },
  { id: "retro-print", label: "Retro Print", tint: [255, 182, 82], sat: 0.92, contrast: 1.16, posterize: 5, edge: 0.95, glow: [255, 233, 124] },
  { id: "kawaii-cloud", label: "Kawaii Cloud", tint: [255, 186, 233], sat: 1.04, contrast: 1.04, posterize: 8, edge: 0.5, glow: [175, 255, 241] },
  { id: "glitch-pop", label: "Glitch Pop", tint: [142, 104, 255], sat: 1.36, contrast: 1.34, posterize: 4, edge: 1.35, glow: [255, 92, 191] }
];

const shapes = [
  { id: "rounded", label: "Rounded" },
  { id: "circle", label: "Circle" },
  { id: "badge", label: "Badge" },
  { id: "ticket", label: "Ticket" }
];

const chars = {
  nova: { fill: "#ffc76d", hair: "#2c2340", eye: "#12233d", cheek: "#ff9bb0", shirt: "#ff6b57", acc: "spark" },
  pixel: { fill: "#f0b27a", hair: "#5a2e1f", eye: "#10213b", cheek: "#ff9fa8", shirt: "#3d71ff", acc: "headphones" },
  mochi: { fill: "#f9f1ea", hair: "#b07a44", eye: "#2d3655", cheek: "#ffbecd", shirt: "#ff8f66", acc: "bow" },
  bolt: { fill: "#c69162", hair: "#15131f", eye: "#111e36", cheek: "#e99c8f", shirt: "#6ee6c5", acc: "cap" },
  niblet: { fill: "#f4f6ff", hair: "#5d68ff", eye: "#16223f", cheek: "#f7adc0", shirt: "#ffd657", acc: "star" },
  comet: { fill: "#f6c3a1", hair: "#6d3048", eye: "#16223f", cheek: "#f29ab4", shirt: "#ff4bc2", acc: "glasses" },
  willow: { fill: "#f5d8b4", hair: "#556f4d", eye: "#243323", cheek: "#f1b6ad", shirt: "#90c27c", acc: "leaf" },
  sora: { fill: "#f8d3bc", hair: "#303f62", eye: "#24314a", cheek: "#f0b9b2", shirt: "#8fc8e8", acc: "cloud" }
};

const starters = [
  { id: "chaos", name: "Chaos Gremlin", price: "Free", description: "Fast-selling reaction sticker for meme packs and creator stores.", style: "funny", shape: "rounded", title: "Chaos Gremlin", caption: "Running on snacks and bad ideas", bubble: "oops", accent: "#ff6b57", outline: 24, rotation: -6, characterId: "nova" },
  { id: "soft", name: "Soft Mode", price: "Free", description: "Cute pastel sticker with a gift-shop look.", style: "cute", shape: "circle", title: "Soft Mode", caption: "Being adorable counts as productivity", bubble: "", accent: "#ff8bb3", outline: 28, rotation: 0, characterId: "mochi" },
  { id: "main", name: "Main Character", price: "Free", description: "Comic burst sticker for storefront hero art.", style: "comic", shape: "badge", title: "Main Character", caption: "Background energy not accepted", bubble: "look at me", accent: "#18b8ff", outline: 26, rotation: 5, characterId: "pixel" },
  { id: "meadow", name: "Meadow Spirit", price: "Free", description: "Soft storybook sticker with a gentle sky and leaf details.", style: "ghibli", shape: "rounded", title: "Meadow Spirit", caption: "Quiet magic, strong sticker energy", bubble: "", accent: "#8dcf7e", outline: 24, rotation: -2, characterId: "willow" },
  { id: "sky", name: "Sky Walk", price: "Free", description: "Airy storybook sticker inspired by animated travel scenes.", style: "ghibli", shape: "circle", title: "Sky Walk", caption: "A soft day for big adventures", bubble: "", accent: "#8fc8e8", outline: 26, rotation: 1, characterId: "sora" },
  { id: "retro", name: "Retro Vibes", price: "Free", description: "Warm merch-style badge with label-friendly composition.", style: "retro", shape: "badge", title: "Retro Vibes", caption: "Vintage energy only", bubble: "", accent: "#ff9a44", outline: 30, rotation: 0, characterId: "bolt" },
  { id: "zero", name: "Zero Thoughts", price: "Free", description: "Funny sticker that reads instantly on phones.", style: "funny", shape: "circle", title: "Zero Thoughts", caption: "Brain buffering, please wait", bubble: "uhh", accent: "#ffd657", outline: 25, rotation: 2, characterId: "niblet" },
  { id: "study", name: "Study Goblin", price: "Free", description: "Cute mood sticker for notebooks, chats, and digital planners.", style: "cute", shape: "ticket", title: "Study Goblin", caption: "Powered by tea and panic", bubble: "", accent: "#c0a7ff", outline: 22, rotation: -3, characterId: "mochi" },
  { id: "night", name: "Night Shift", price: "$3", description: "Late-night neon reaction sticker for creators.", style: "neon", shape: "ticket", title: "Night Shift", caption: "Replying in 4 to 6 business naps", bubble: "low battery", accent: "#7cf0ff", outline: 22, rotation: -4, characterId: "comet" },
  { id: "stream", name: "Stream Panic", price: "$4", description: "High-energy premium sticker for creator communities.", style: "neon", shape: "badge", title: "Stream Panic", caption: "Camera on. Brain off.", bubble: "we're live", accent: "#ff61df", outline: 24, rotation: 4, characterId: "pixel" }
];

const defaultState = {
  selectedStyle: starters[0].style,
  selectedShape: starters[0].shape,
  aiPreset: aiPresets[0].id,
  aiStrength: 72,
  glow: 28,
  title: starters[0].title,
  caption: starters[0].caption,
  bubble: starters[0].bubble,
  accent: starters[0].accent,
  outline: starters[0].outline,
  rotation: starters[0].rotation,
  photoDataUrl: "",
  characterId: starters[0].characterId,
  gallery: []
};

const $ = (selector) => document.querySelector(selector);
const els = {
  typeGrid: $("#typeGrid"),
  inventoryGrid: $("#inventoryGrid"),
  aiPresetPicker: $("#aiPresetPicker"),
  stylePicker: $("#stylePicker"),
  shapePicker: $("#shapePicker"),
  photoInput: $("#photoInput"),
  useDemoButton: $("#useDemoButton"),
  aiStrengthInput: $("#aiStrengthInput"),
  glowInput: $("#glowInput"),
  titleInput: $("#titleInput"),
  captionInput: $("#captionInput"),
  bubbleInput: $("#bubbleInput"),
  accentInput: $("#accentInput"),
  outlineInput: $("#outlineInput"),
  rotationInput: $("#rotationInput"),
  randomizeButton: $("#randomizeButton"),
  downloadButton: $("#downloadButton"),
  saveDesignButton: $("#saveDesignButton"),
  previewName: $("#previewName"),
  aiModeLabel: $("#aiModeLabel"),
  photoStatusLabel: $("#photoStatusLabel"),
  galleryGrid: $("#galleryGrid"),
  galleryItemTemplate: $("#galleryItemTemplate"),
  inventoryItemTemplate: $("#inventoryItemTemplate"),
  typeCardTemplate: $("#typeCardTemplate"),
  toast: $("#toast"),
  canvas: $("#stickerCanvas")
};

const hasCatalog = Boolean(els.typeGrid && els.typeCardTemplate);
const hasInventory = Boolean(els.inventoryGrid && els.inventoryItemTemplate);
const hasBuilder = Boolean(
  els.stylePicker &&
  els.shapePicker &&
  els.titleInput &&
  els.captionInput &&
  els.bubbleInput &&
  els.accentInput &&
  els.outlineInput &&
  els.rotationInput &&
  els.canvas
);
const hasGallery = Boolean(els.galleryGrid && els.galleryItemTemplate);

const state = loadState();
let uploadedImage = null;
let toastTimer = null;
const ctx = els.canvas ? els.canvas.getContext("2d") : null;

if (hasCatalog) renderCatalog();
if (hasBuilder) renderControls();
loadUploadedImage().then(renderAll);

if (els.photoInput) {
els.photoInput.addEventListener("change", (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async () => {
    state.photoDataUrl = String(reader.result);
    await loadUploadedImage();
    changed();
    toast("Photo loaded into the live sticker preview.");
  };
  reader.readAsDataURL(file);
});
}

if (els.useDemoButton) {
els.useDemoButton.addEventListener("click", async () => {
  state.photoDataUrl = "";
  if (els.photoInput) els.photoInput.value = "";
  await loadUploadedImage();
  changed();
  toast("Switched back to built-in sticker art.");
});
}

if (els.aiStrengthInput) els.aiStrengthInput.addEventListener("input", () => setState("aiStrength", Number(els.aiStrengthInput.value)));
if (els.glowInput) els.glowInput.addEventListener("input", () => setState("glow", Number(els.glowInput.value)));
if (els.titleInput) els.titleInput.addEventListener("input", () => setState("title", els.titleInput.value));
if (els.captionInput) els.captionInput.addEventListener("input", () => setState("caption", els.captionInput.value));
if (els.bubbleInput) els.bubbleInput.addEventListener("input", () => setState("bubble", els.bubbleInput.value));
if (els.accentInput) els.accentInput.addEventListener("input", () => setState("accent", els.accentInput.value));
if (els.outlineInput) els.outlineInput.addEventListener("input", () => setState("outline", Number(els.outlineInput.value)));
if (els.rotationInput) els.rotationInput.addEventListener("input", () => setState("rotation", Number(els.rotationInput.value)));

if (els.randomizeButton) {
els.randomizeButton.addEventListener("click", () => {
  const current = pick(styles);
  state.selectedStyle = current.id;
  state.selectedShape = pick(shapes).id;
  state.aiPreset = pick(aiPresets).id;
  state.characterId = pick(Object.keys(chars));
  state.accent = current.bg[1];
  state.rotation = rand(-12, 12);
  state.aiStrength = rand(38, 96);
  state.glow = rand(12, 60);
  state.bubble = current.bubble ? pick(["wow", "help", "certified icon", "no thoughts", "main character"]) : "";
  state.title = pick(["Absolute Mood", "Certified Icon", "No Notes", "Snack Boss", "Sky Wanderer", "Tea Powered"]);
  state.caption = pick(["This one actually sells", "Built for sticker packs and socials", "Exported straight from the browser", "Real-time edits, no backend drama", "Soft storybook vibes included"]);
  renderControls();
  changed();
  toast("Random sticker applied.");
});
}

if (els.downloadButton) {
els.downloadButton.addEventListener("click", () => {
  renderCanvas();
  if (!els.canvas) return;
  const link = document.createElement("a");
  link.href = els.canvas.toDataURL("image/png");
  link.download = `${slug(state.title || "sticker-orbit")}.png`;
  link.click();
  toast("Sticker downloaded.");
});
}

if (els.saveDesignButton) {
els.saveDesignButton.addEventListener("click", () => {
  renderCanvas();
  if (!els.canvas) return;
  state.gallery.unshift({
    id: safeRandomId(),
    title: state.title || style().label,
    style: style().label,
    image: els.canvas.toDataURL("image/png"),
    config: config()
  });
  state.gallery = state.gallery.slice(0, 12);
  saveState();
  renderGallery();
  toast("Saved to gallery.");
});
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => toast("Offline cache could not be enabled."));
  });
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return clone(defaultState);
    const parsed = JSON.parse(raw);
    return {
      ...clone(defaultState),
      ...parsed,
      gallery: Array.isArray(parsed.gallery) ? parsed.gallery : []
    };
  } catch {
    return clone(defaultState);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

async function loadUploadedImage() {
  if (!state.photoDataUrl) {
    uploadedImage = null;
    return;
  }

  try {
    uploadedImage = await image(state.photoDataUrl);
  } catch {
    uploadedImage = null;
    state.photoDataUrl = "";
  }
}

function setState(key, value) {
  state[key] = value;
  changed();
}

function changed() {
  saveState();
  renderCanvas();
  renderInventory();
  renderGallery();
}

function renderAll() {
  if (hasBuilder) renderControls();
  renderCanvas();
  renderInventory();
  renderGallery();
}

function renderCatalog() {
  if (!hasCatalog) return;
  els.typeGrid.innerHTML = "";
  for (const item of stickerTypes) {
    const fragment = els.typeCardTemplate.content.cloneNode(true);
    fragment.querySelector(".type-badge").textContent = item.badge;
    fragment.querySelector(".type-price").textContent = item.price;
    fragment.querySelector(".type-title").textContent = item.name;
    fragment.querySelector(".type-description").textContent = item.description;
    const tags = fragment.querySelector(".type-tags");
    for (const tag of item.tags) {
      const li = document.createElement("li");
      li.textContent = tag;
      tags.append(li);
    }
    els.typeGrid.append(fragment);
  }
}

function renderControls() {
  if (!hasBuilder) return;
  els.aiPresetPicker.innerHTML = "";
  for (const item of aiPresets) {
    const button = chip(item.label, item.id === state.aiPreset, () => {
      state.aiPreset = item.id;
      renderControls();
      changed();
    });
    els.aiPresetPicker.append(button);
  }

  els.stylePicker.innerHTML = "";
  for (const item of styles) {
    const button = chip(item.label, item.id === state.selectedStyle, () => {
      state.selectedStyle = item.id;
      if (!state.accent) state.accent = item.bg[1];
      renderControls();
      changed();
    });
    els.stylePicker.append(button);
  }

  els.shapePicker.innerHTML = "";
  for (const item of shapes) {
    const button = chip(item.label, item.id === state.selectedShape, () => {
      state.selectedShape = item.id;
      renderControls();
      changed();
    });
    els.shapePicker.append(button);
  }

  els.titleInput.value = state.title;
  els.captionInput.value = state.caption;
  els.bubbleInput.value = state.bubble;
  els.accentInput.value = state.accent;
  els.aiStrengthInput.value = String(state.aiStrength);
  els.glowInput.value = String(state.glow);
  els.outlineInput.value = String(state.outline);
  els.rotationInput.value = String(state.rotation);
  els.previewName.textContent = state.title || "Sticker preview";
  els.aiModeLabel.textContent = `AI mode: ${findAiPreset(state.aiPreset).label}`;
  els.photoStatusLabel.textContent = state.photoDataUrl ? "Using uploaded portrait" : "Using built-in orbit character";
}

function renderInventory() {
  if (!hasInventory) return;
  els.inventoryGrid.innerHTML = "";

  for (const starter of starters) {
    const fragment = els.inventoryItemTemplate.content.cloneNode(true);
    const root = fragment.querySelector(".inventory-card");
    const imageEl = fragment.querySelector(".inventory-image");
    const button = fragment.querySelector(".inventory-load");

    imageEl.src = renderPreview(starter);
    fragment.querySelector(".inventory-title").textContent = starter.name;
    fragment.querySelector(".inventory-price").textContent = starter.price;
    fragment.querySelector(".inventory-description").textContent = starter.description;
    fragment.querySelector(".inventory-style").textContent = findStyle(starter.style).label;
    fragment.querySelector(".inventory-shape").textContent = findShape(starter.shape).label;

    if (
      starter.title === state.title &&
      starter.style === state.selectedStyle &&
      starter.shape === state.selectedShape &&
      starter.characterId === state.characterId &&
      !state.photoDataUrl
    ) {
      root.classList.add("inventory-card-live");
      button.disabled = true;
      button.textContent = "Loaded";
    }

    button.addEventListener("click", async () => {
      applyStarter(starter);
      await loadUploadedImage();
      renderControls();
      changed();
      toast(`${starter.name} loaded into the builder.`);
      if (!hasBuilder) {
        window.location.href = "./studio.html";
      }
    });

    els.inventoryGrid.append(fragment);
  }
}

function renderGallery() {
  if (!hasGallery) return;
  els.galleryGrid.innerHTML = "";

  if (!state.gallery.length) {
    const empty = document.createElement("article");
    empty.className = "gallery-card";
    empty.innerHTML = '<div class="gallery-copy"><strong class="gallery-title">No saved stickers yet</strong><span class="gallery-meta">Save a design from the builder to keep it here.</span></div>';
    els.galleryGrid.append(empty);
    return;
  }

  for (const item of state.gallery) {
    const fragment = els.galleryItemTemplate.content.cloneNode(true);
    fragment.querySelector(".gallery-image").src = item.image;
    fragment.querySelector(".gallery-title").textContent = item.title;
    fragment.querySelector(".gallery-meta").textContent = item.style;

    fragment.querySelector(".gallery-load").addEventListener("click", async () => {
      Object.assign(state, clone(defaultState), item.config || {});
      await loadUploadedImage();
      renderControls();
      changed();
      toast(`${item.title} loaded from your gallery.`);
    });

    fragment.querySelector(".gallery-delete").addEventListener("click", () => {
      state.gallery = state.gallery.filter((entry) => entry.id !== item.id);
      saveState();
      renderGallery();
      toast("Saved sticker removed.");
    });

    els.galleryGrid.append(fragment);
  }
}

function renderCanvas() {
  if (!ctx || !els.canvas) return;
  ctx.clearRect(0, 0, els.canvas.width, els.canvas.height);
  drawSticker(ctx, config(), els.canvas.width, els.canvas.height, uploadedImage);
}

function config() {
  return {
    selectedStyle: state.selectedStyle,
    selectedShape: state.selectedShape,
    aiPreset: state.aiPreset,
    aiStrength: Number(state.aiStrength),
    glow: Number(state.glow),
    title: state.title,
    caption: state.caption,
    bubble: state.bubble,
    accent: state.accent,
    outline: Number(state.outline),
    rotation: Number(state.rotation),
    photoDataUrl: state.photoDataUrl,
    characterId: state.characterId
  };
}

function applyStarter(starter) {
  state.selectedStyle = starter.style;
  state.selectedShape = starter.shape;
  state.aiPreset = aiPresets[0].id;
  state.aiStrength = 72;
  state.glow = 28;
  state.title = starter.title;
  state.caption = starter.caption;
  state.bubble = starter.bubble;
  state.accent = starter.accent;
  state.outline = starter.outline;
  state.rotation = starter.rotation;
  state.photoDataUrl = "";
  state.characterId = starter.characterId;
  uploadedImage = null;
  els.photoInput.value = "";
}

function drawSticker(targetCtx, sticker, width, height, sourceImage = null) {
  const currentStyle = findStyle(sticker.selectedStyle);
  const character = chars[sticker.characterId] || chars.nova;
  const outline = Math.max(10, Number(sticker.outline) || 24);
  const radius = 110;
  const cardX = 80;
  const cardY = 78;
  const cardW = width - 160;
  const cardH = height - 156;

  targetCtx.save();
  targetCtx.translate(width / 2, height / 2);
  targetCtx.rotate((Number(sticker.rotation) || 0) * Math.PI / 180);
  targetCtx.translate(-width / 2, -height / 2);

  const bg = targetCtx.createLinearGradient(0, 0, width, height);
  bg.addColorStop(0, currentStyle.bg[0]);
  bg.addColorStop(1, currentStyle.bg[1]);
  targetCtx.fillStyle = bg;
  targetCtx.beginPath();
  shapePath(targetCtx, sticker.selectedShape, cardX, cardY, cardW, cardH, radius);
  targetCtx.fill();

  targetCtx.lineWidth = outline;
  targetCtx.strokeStyle = "rgba(255,255,255,0.96)";
  targetCtx.stroke();

  drawDecor(targetCtx, currentStyle, sticker, width, height);
  drawAura(targetCtx, sticker, currentStyle, width, height);

  if (sourceImage) {
    drawUploadedPhoto(targetCtx, currentStyle, cardX, cardY, cardW, cardH, sourceImage);
  } else {
    drawCharacter(targetCtx, character, sticker, width, height);
  }

  if (sticker.bubble) {
    drawBubble(targetCtx, sticker.bubble, sticker.accent, width);
  }

  drawText(targetCtx, sticker, width, height);
  targetCtx.restore();
}

function drawAura(targetCtx, sticker, currentStyle, width, height) {
  const glowPower = Number(sticker.glow || 0) / 100;
  if (!glowPower) return;

  const gradient = targetCtx.createRadialGradient(width / 2, height / 2, 60, width / 2, height / 2, 320);
  gradient.addColorStop(0, rgba(currentStyle.bg[1], 0.28 * glowPower));
  gradient.addColorStop(0.55, rgba(sticker.accent || currentStyle.bg[0], 0.2 * glowPower));
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  targetCtx.save();
  targetCtx.fillStyle = gradient;
  targetCtx.beginPath();
  targetCtx.arc(width / 2, height / 2, 320, 0, Math.PI * 2);
  targetCtx.fill();
  targetCtx.restore();
}

function drawDecor(targetCtx, currentStyle, sticker, width, height) {
  targetCtx.save();
  targetCtx.globalAlpha = 0.22;
  targetCtx.fillStyle = sticker.accent || currentStyle.bg[1];
  targetCtx.strokeStyle = "rgba(255,255,255,0.55)";
  targetCtx.lineWidth = 8;

  if (currentStyle.deco === "burst") {
    for (let i = 0; i < 10; i += 1) {
      const angle = (Math.PI * 2 * i) / 10;
      const x = width / 2 + Math.cos(angle) * 280;
      const y = height / 2 + Math.sin(angle) * 280;
      targetCtx.beginPath();
      targetCtx.moveTo(width / 2, height / 2);
      targetCtx.lineTo(x, y);
      targetCtx.stroke();
    }
  } else if (currentStyle.deco === "hearts") {
    for (let i = 0; i < 8; i += 1) {
      drawHeart(targetCtx, rand(130, width - 130), rand(130, height - 130), rand(18, 34));
    }
  } else if (currentStyle.deco === "petals") {
    for (let i = 0; i < 12; i += 1) {
      targetCtx.beginPath();
      targetCtx.ellipse(rand(120, width - 120), rand(120, height - 120), 12, 26, rand(-80, 80) * Math.PI / 180, 0, Math.PI * 2);
      targetCtx.fill();
    }
  } else if (currentStyle.deco === "stars" || currentStyle.deco === "spark") {
    for (let i = 0; i < 10; i += 1) {
      drawStar(targetCtx, rand(130, width - 130), rand(130, height - 130), rand(10, 22), rand(5, 10));
    }
  } else if (currentStyle.deco === "sun" || currentStyle.deco === "laugh") {
    for (let i = 0; i < 7; i += 1) {
      targetCtx.beginPath();
      targetCtx.arc(rand(130, width - 130), rand(120, height - 120), rand(12, 26), 0, Math.PI * 2);
      targetCtx.fill();
    }
  }

  targetCtx.restore();
}

function drawUploadedPhoto(targetCtx, currentStyle, cardX, cardY, cardW, cardH, sourceImage) {
  const photoW = cardW * 0.52;
  const photoH = cardH * 0.5;
  const x = cardX + (cardW - photoW) / 2;
  const y = cardY + 140;
  const processed = buildAiStickerImage(sourceImage, findAiPreset(state.aiPreset), Number(state.aiStrength), Number(state.glow), currentStyle);

  targetCtx.save();
  targetCtx.shadowColor = rgba(state.accent || currentStyle.bg[1], 0.38);
  targetCtx.shadowBlur = 24 + Number(state.glow) * 0.45;
  targetCtx.beginPath();
  shapePath(targetCtx, "rounded", x, y, photoW, photoH, 56);
  targetCtx.clip();
  targetCtx.drawImage(processed, x, y, photoW, photoH);
  targetCtx.restore();

  targetCtx.save();
  targetCtx.strokeStyle = rgba(state.accent || currentStyle.bg[1], 0.45);
  targetCtx.lineWidth = 8;
  targetCtx.beginPath();
  shapePath(targetCtx, "rounded", x, y, photoW, photoH, 56);
  targetCtx.stroke();
  targetCtx.restore();
}

function drawCharacter(targetCtx, character, sticker, width, height) {
  const cx = width / 2;
  const cy = height / 2 + 25;

  targetCtx.save();
  targetCtx.fillStyle = character.shirt;
  targetCtx.beginPath();
  targetCtx.roundRect(cx - 140, cy + 95, 280, 180, 120);
  targetCtx.fill();

  targetCtx.fillStyle = character.fill;
  targetCtx.beginPath();
  targetCtx.arc(cx, cy - 20, 120, 0, Math.PI * 2);
  targetCtx.fill();

  targetCtx.fillStyle = character.hair;
  targetCtx.beginPath();
  targetCtx.arc(cx, cy - 45, 126, Math.PI, Math.PI * 2);
  targetCtx.lineTo(cx + 110, cy - 10);
  targetCtx.quadraticCurveTo(cx, cy - 120, cx - 110, cy - 10);
  targetCtx.closePath();
  targetCtx.fill();

  targetCtx.fillStyle = "#fff";
  targetCtx.beginPath();
  targetCtx.arc(cx - 42, cy - 20, 26, 0, Math.PI * 2);
  targetCtx.arc(cx + 42, cy - 20, 26, 0, Math.PI * 2);
  targetCtx.fill();

  targetCtx.fillStyle = character.eye;
  targetCtx.beginPath();
  targetCtx.arc(cx - 42, cy - 18, 11, 0, Math.PI * 2);
  targetCtx.arc(cx + 42, cy - 18, 11, 0, Math.PI * 2);
  targetCtx.fill();

  targetCtx.strokeStyle = character.eye;
  targetCtx.lineWidth = 8;
  targetCtx.beginPath();
  targetCtx.arc(cx, cy + 18, 46, 0.15 * Math.PI, 0.85 * Math.PI);
  targetCtx.stroke();

  targetCtx.fillStyle = character.cheek;
  targetCtx.globalAlpha = 0.8;
  targetCtx.beginPath();
  targetCtx.arc(cx - 72, cy + 22, 16, 0, Math.PI * 2);
  targetCtx.arc(cx + 72, cy + 22, 16, 0, Math.PI * 2);
  targetCtx.fill();
  targetCtx.globalAlpha = 1;

  if (character.acc === "headphones") {
    targetCtx.strokeStyle = sticker.accent;
    targetCtx.lineWidth = 14;
    targetCtx.beginPath();
    targetCtx.arc(cx, cy - 46, 120, Math.PI * 1.05, Math.PI * 1.95);
    targetCtx.stroke();
  } else if (character.acc === "bow") {
    drawBow(targetCtx, cx + 58, cy - 118, sticker.accent);
  } else if (character.acc === "leaf") {
    targetCtx.fillStyle = sticker.accent;
    targetCtx.beginPath();
    targetCtx.ellipse(cx + 86, cy - 118, 20, 40, -0.45, 0, Math.PI * 2);
    targetCtx.fill();
  } else if (character.acc === "cloud") {
    targetCtx.fillStyle = "rgba(255,255,255,0.88)";
    drawCloud(targetCtx, cx + 92, cy - 124, 48);
  } else if (character.acc === "star" || character.acc === "spark") {
    targetCtx.fillStyle = sticker.accent;
    drawStar(targetCtx, cx + 94, cy - 104, 22, 10);
  } else if (character.acc === "glasses") {
    targetCtx.strokeStyle = character.eye;
    targetCtx.lineWidth = 7;
    targetCtx.strokeRect(cx - 70, cy - 46, 50, 40);
    targetCtx.strokeRect(cx + 20, cy - 46, 50, 40);
    targetCtx.beginPath();
    targetCtx.moveTo(cx - 20, cy - 26);
    targetCtx.lineTo(cx + 20, cy - 26);
    targetCtx.stroke();
  } else if (character.acc === "cap") {
    targetCtx.fillStyle = sticker.accent;
    targetCtx.beginPath();
    targetCtx.arc(cx, cy - 95, 78, Math.PI, Math.PI * 2);
    targetCtx.fill();
    targetCtx.fillRect(cx - 88, cy - 95, 176, 18);
  }

  targetCtx.restore();
}

function drawBubble(targetCtx, text, accent, width) {
  targetCtx.save();
  targetCtx.fillStyle = "rgba(255,255,255,0.92)";
  targetCtx.strokeStyle = accent;
  targetCtx.lineWidth = 10;
  targetCtx.beginPath();
  targetCtx.roundRect(width / 2 - 170, 108, 340, 102, 40);
  targetCtx.fill();
  targetCtx.stroke();

  targetCtx.beginPath();
  targetCtx.moveTo(width / 2 + 50, 210);
  targetCtx.lineTo(width / 2 + 16, 246);
  targetCtx.lineTo(width / 2 + 6, 204);
  targetCtx.closePath();
  targetCtx.fill();
  targetCtx.stroke();

  targetCtx.fillStyle = "#12233d";
  targetCtx.font = "800 34px Outfit, sans-serif";
  targetCtx.textAlign = "center";
  targetCtx.fillText(text.toUpperCase(), width / 2, 171);
  targetCtx.restore();
}

function drawText(targetCtx, sticker, width, height) {
  targetCtx.save();
  targetCtx.textAlign = "center";
  targetCtx.fillStyle = "#10213b";
  targetCtx.strokeStyle = "rgba(255,255,255,0.85)";
  targetCtx.lineJoin = "round";

  targetCtx.font = "800 66px Bricolage Grotesque, sans-serif";
  targetCtx.lineWidth = 12;
  targetCtx.strokeText(sticker.title.toUpperCase(), width / 2, height - 184);
  targetCtx.fillText(sticker.title.toUpperCase(), width / 2, height - 184);

  targetCtx.font = "700 28px Outfit, sans-serif";
  targetCtx.lineWidth = 8;
  targetCtx.strokeText(sticker.caption, width / 2, height - 126);
  targetCtx.fillText(sticker.caption, width / 2, height - 126);
  targetCtx.restore();
}

function renderPreview(starter) {
  const canvas = document.createElement("canvas");
  canvas.width = 420;
  canvas.height = 420;
  const previewCtx = canvas.getContext("2d");
  drawSticker(previewCtx, {
    selectedStyle: starter.style,
    selectedShape: starter.shape,
    aiPreset: aiPresets[0].id,
    aiStrength: 72,
    glow: 28,
    title: starter.title,
    caption: starter.caption,
    bubble: starter.bubble,
    accent: starter.accent,
    outline: starter.outline,
    rotation: starter.rotation,
    photoDataUrl: "",
    characterId: starter.characterId
  }, canvas.width, canvas.height, null);
  return canvas.toDataURL("image/png");
}

function shapePath(targetCtx, id, x, y, width, height, radius) {
  if (id === "circle") {
    targetCtx.ellipse(x + width / 2, y + height / 2, width / 2, height / 2, 0, 0, Math.PI * 2);
    return;
  }

  if (id === "badge") {
    const inset = 52;
    targetCtx.moveTo(x + inset, y);
    targetCtx.lineTo(x + width - inset, y);
    targetCtx.lineTo(x + width, y + inset);
    targetCtx.lineTo(x + width, y + height - inset);
    targetCtx.lineTo(x + width - inset, y + height);
    targetCtx.lineTo(x + inset, y + height);
    targetCtx.lineTo(x, y + height - inset);
    targetCtx.lineTo(x, y + inset);
    targetCtx.closePath();
    return;
  }

  if (id === "ticket") {
    const notch = 38;
    targetCtx.moveTo(x + radius, y);
    targetCtx.arcTo(x + width, y, x + width, y + height, radius);
    targetCtx.arcTo(x + width, y + height, x, y + height, radius);
    targetCtx.arcTo(x, y + height, x, y, radius);
    targetCtx.arcTo(x, y, x + width, y, radius);
    targetCtx.closePath();
    targetCtx.moveTo(x, y + height / 2 - notch);
    targetCtx.arc(x, y + height / 2, notch, -Math.PI / 2, Math.PI / 2, false);
    targetCtx.moveTo(x + width, y + height / 2 - notch);
    targetCtx.arc(x + width, y + height / 2, notch, -Math.PI / 2, Math.PI / 2, true);
    return;
  }

  targetCtx.roundRect(x, y, width, height, radius);
}

function chip(label, active, onClick) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `chip${active ? " is-active" : ""}`;
  button.textContent = label;
  button.addEventListener("click", onClick);
  return button;
}

function style() {
  return findStyle(state.selectedStyle);
}

function findStyle(id) {
  return styles.find((item) => item.id === id) || styles[0];
}

function findShape(id) {
  return shapes.find((item) => item.id === id) || shapes[0];
}

function findAiPreset(id) {
  return aiPresets.find((item) => item.id === id) || aiPresets[0];
}

function toast(message) {
  els.toast.textContent = message;
  els.toast.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    els.toast.hidden = true;
  }, 2200);
}

function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function slug(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function safeRandomId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function image(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function drawHeart(targetCtx, x, y, size) {
  targetCtx.beginPath();
  targetCtx.moveTo(x, y + size / 4);
  targetCtx.bezierCurveTo(x, y, x - size, y, x - size, y + size / 2);
  targetCtx.bezierCurveTo(x - size, y + size, x, y + size * 1.2, x, y + size * 1.5);
  targetCtx.bezierCurveTo(x, y + size * 1.2, x + size, y + size, x + size, y + size / 2);
  targetCtx.bezierCurveTo(x + size, y, x, y, x, y + size / 4);
  targetCtx.fill();
}

function drawStar(targetCtx, x, y, outerRadius, innerRadius) {
  targetCtx.beginPath();
  for (let i = 0; i < 10; i += 1) {
    const angle = -Math.PI / 2 + i * Math.PI / 5;
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const px = x + Math.cos(angle) * radius;
    const py = y + Math.sin(angle) * radius;
    if (i === 0) targetCtx.moveTo(px, py);
    else targetCtx.lineTo(px, py);
  }
  targetCtx.closePath();
  targetCtx.fill();
}

function drawBow(targetCtx, x, y, color) {
  targetCtx.save();
  targetCtx.fillStyle = color;
  targetCtx.beginPath();
  targetCtx.ellipse(x - 22, y, 28, 18, 0.5, 0, Math.PI * 2);
  targetCtx.ellipse(x + 22, y, 28, 18, -0.5, 0, Math.PI * 2);
  targetCtx.fill();
  targetCtx.beginPath();
  targetCtx.arc(x, y, 11, 0, Math.PI * 2);
  targetCtx.fill();
  targetCtx.restore();
}

function drawCloud(targetCtx, x, y, size) {
  targetCtx.beginPath();
  targetCtx.arc(x - size * 0.35, y, size * 0.22, 0, Math.PI * 2);
  targetCtx.arc(x, y - size * 0.1, size * 0.28, 0, Math.PI * 2);
  targetCtx.arc(x + size * 0.3, y, size * 0.2, 0, Math.PI * 2);
  targetCtx.fill();
}

function buildAiStickerImage(sourceImage, preset, strength, glow, currentStyle) {
  const canvas = document.createElement("canvas");
  canvas.width = 520;
  canvas.height = 520;
  const localCtx = canvas.getContext("2d", { willReadFrequently: true });
  localCtx.fillStyle = "#fff";
  localCtx.fillRect(0, 0, canvas.width, canvas.height);
  localCtx.filter = currentStyle.filter;

  const crop = coverRect(sourceImage.width, sourceImage.height, canvas.width, canvas.height);
  localCtx.drawImage(sourceImage, crop.sx, crop.sy, crop.sw, crop.sh, 0, 0, canvas.width, canvas.height);

  const imageData = localCtx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const power = strength / 100;
  const glowPower = glow / 100;
  const levels = Math.max(3, preset.posterize);

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const avg = (r + g + b) / 3;
    const edgeBoost = avg < 104 ? preset.edge * 24 * power : 0;

    let nr = mix(r, preset.tint[0], 0.1 + power * 0.22);
    let ng = mix(g, preset.tint[1], 0.08 + power * 0.18);
    let nb = mix(b, preset.tint[2], 0.08 + power * 0.18);

    nr = adjustContrast(nr + edgeBoost, preset.contrast);
    ng = adjustContrast(ng + edgeBoost, preset.contrast);
    nb = adjustContrast(nb + edgeBoost, preset.contrast);

    [nr, ng, nb] = saturate(nr, ng, nb, preset.sat + power * 0.15);
    nr = posterize(nr, levels);
    ng = posterize(ng, levels);
    nb = posterize(nb, levels);

    if (avg > 210) {
      nr = mix(nr, 255, 0.25 * glowPower);
      ng = mix(ng, 255, 0.25 * glowPower);
      nb = mix(nb, 255, 0.25 * glowPower);
    }

    data[i] = clamp(nr);
    data[i + 1] = clamp(ng);
    data[i + 2] = clamp(nb);
  }

  localCtx.putImageData(imageData, 0, 0);

  localCtx.save();
  localCtx.globalCompositeOperation = "screen";
  localCtx.fillStyle = rgba(preset.glow, 0.08 + glowPower * 0.15);
  localCtx.fillRect(0, 0, canvas.width, canvas.height);
  localCtx.restore();

  localCtx.save();
  localCtx.globalAlpha = 0.12 + power * 0.18;
  for (let i = 0; i < 1800; i += 1) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const size = Math.random() * 1.6;
    localCtx.fillStyle = i % 2 === 0 ? "rgba(255,255,255,0.24)" : "rgba(10,16,32,0.12)";
    localCtx.fillRect(x, y, size, size);
  }
  localCtx.restore();

  return canvas;
}

function coverRect(srcW, srcH, destW, destH) {
  const srcRatio = srcW / srcH;
  const destRatio = destW / destH;
  if (srcRatio > destRatio) {
    const sw = srcH * destRatio;
    return { sx: (srcW - sw) / 2, sy: 0, sw, sh: srcH };
  }
  const sh = srcW / destRatio;
  return { sx: 0, sy: (srcH - sh) / 2, sw: srcW, sh };
}

function mix(a, b, amount) {
  return a + (b - a) * amount;
}

function adjustContrast(value, contrast) {
  return (value - 128) * contrast + 128;
}

function posterize(value, levels) {
  return Math.round((levels * value) / 255) * (255 / levels);
}

function saturate(r, g, b, amount) {
  const avg = (r + g + b) / 3;
  return [
    avg + (r - avg) * amount,
    avg + (g - avg) * amount,
    avg + (b - avg) * amount
  ];
}

function clamp(value) {
  return Math.max(0, Math.min(255, value));
}

function rgba(rgb, alpha) {
  if (Array.isArray(rgb)) return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`;
  const hex = rgb.replace("#", "");
  const value = hex.length === 3
    ? hex.split("").map((item) => item + item).join("")
    : hex;
  const int = Number.parseInt(value, 16);
  return `rgba(${(int >> 16) & 255}, ${(int >> 8) & 255}, ${int & 255}, ${alpha})`;
}
