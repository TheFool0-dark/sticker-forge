const STORAGE_KEY = "sticker-forge-state-v3";

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

const state = loadState();
let uploadedImage = null;

const $ = (selector) => document.querySelector(selector);
const els = {
  typeGrid: $("#typeGrid"),
  inventoryGrid: $("#inventoryGrid"),
  stylePicker: $("#stylePicker"),
  shapePicker: $("#shapePicker"),
  photoInput: $("#photoInput"),
  useDemoButton: $("#useDemoButton"),
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
  galleryGrid: $("#galleryGrid"),
  galleryItemTemplate: $("#galleryItemTemplate"),
  inventoryItemTemplate: $("#inventoryItemTemplate"),
  typeCardTemplate: $("#typeCardTemplate"),
  toast: $("#toast"),
  canvas: $("#stickerCanvas")
};

const ctx = els.canvas.getContext("2d");

renderCatalog();
renderControls();
loadUploadedImage().then(renderAll);

els.photoInput.addEventListener("change", (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = async () => {
    state.photoDataUrl = String(reader.result);
    await loadUploadedImage();
    saveState();
    renderAll();
    toast("Photo loaded into the live sticker preview.");
  };
  reader.readAsDataURL(file);
});

els.useDemoButton.addEventListener("click", async () => {
  state.photoDataUrl = "";
  await loadUploadedImage();
  changed();
  toast("Switched back to built-in sticker art.");
});

els.titleInput.addEventListener("input", () => setState("title", els.titleInput.value));
els.captionInput.addEventListener("input", () => setState("caption", els.captionInput.value));
els.bubbleInput.addEventListener("input", () => setState("bubble", els.bubbleInput.value));
els.accentInput.addEventListener("input", () => setState("accent", els.accentInput.value));
els.outlineInput.addEventListener("input", () => setState("outline", Number(els.outlineInput.value)));
els.rotationInput.addEventListener("input", () => setState("rotation", Number(els.rotationInput.value)));

els.randomizeButton.addEventListener("click", () => {
  const current = pick(styles);
  state.selectedStyle = current.id;
  state.selectedShape = pick(shapes).id;
  state.characterId = pick(Object.keys(chars));
  state.accent = current.bg[1];
  state.rotation = rand(-12, 12);
  state.bubble = current.bubble ? pick(["wow", "help", "certified icon", "no thoughts", "main character"]) : "";
  state.title = pick(["Absolute Mood", "Certified Icon", "No Notes", "Snack Boss", "Sky Wanderer", "Tea Powered"]);
  state.caption = pick(["This one actually sells", "Built for sticker packs and socials", "Exported straight from the browser", "Real-time edits, no backend drama", "Soft storybook vibes included"]);
  renderControls();
  changed();
  toast("Random sticker applied.");
});

els.downloadButton.addEventListener("click", () => {
  renderCanvas();
  const link = document.createElement("a");
  link.href = els.canvas.toDataURL("image/png");
  link.download = `${slug(state.title || "sticker-forge")}.png`;
  link.click();
  toast("Sticker downloaded.");
});

els.saveDesignButton.addEventListener("click", () => {
  renderCanvas();
  state.gallery.unshift({ id: crypto.randomUUID(), title: state.title || style().label, style: style().label, image: els.canvas.toDataURL("image/png"), config: config() });
  state.gallery = state.gallery.slice(0, 12);
  saveState();
  renderGallery();
  toast("Saved to gallery.");
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => toast("Offline cache could not be enabled."));
  });
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(defaultState);
    const parsed = JSON.parse(raw);
    return { ...structuredClone(defaultState), ...parsed, gallery: Array.isArray(parsed.gallery) ? parsed.gallery : [] };
  } catch {
    return structuredClone(defaultState);
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
  uploadedImage = await image(state.photoDataUrl);
}

function setState(key, value) {
  state[key] = value;
  changed();
}

function changed() {
  saveState();
  renderCanvas();
  renderInventory();
}

function renderAll() {
  renderControls();
  renderCanvas();
  renderInventory();
  renderGallery();
}

function renderCatalog() {
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
