import { icons } from "../components/icons.js";
import { pageShell } from "../components/layout.js";
import { getProduct, lookJobs } from "../data/mock-data.js";
import { navigate } from "../scripts/router.js";

const templates = [
  { id: "quick-tryon", title: "Quick Try-on", detail: "Single look motion reveal" },
  { id: "rotation", title: "Outfit Rotation", detail: "Rotate through selected looks" },
  { id: "collection", title: "Collection Showcase", detail: "Shelf-style product story" },
  { id: "story", title: "Story Reel", detail: "Social-first vertical reel" },
  { id: "before-after", title: "Before / After", detail: "Plain to styled transition" }
];

function selectedLooks() {
  const search = typeof window === "undefined" ? "" : window.location.search;
  const ids = new URLSearchParams(search).get("looks")?.split(",").filter(Boolean) || [];
  const looks = ids.map((id) => lookJobs.find((look) => look.id === id)).filter(Boolean);
  return looks.length ? looks : lookJobs.filter((look) => look.status === "Ready").slice(0, 1);
}

function lookThumb(look) {
  const product = getProduct(look.productIds[0]);
  return `
    <article class="video-look-chip">
      <img src="${product.images[0]}" alt="" />
      <span>
        <strong>${look.title}</strong>
        <small>${look.productIds.length} products · ${look.extraEarn || "Earn +5%"}</small>
      </span>
    </article>
  `;
}

export function createVideoPage() {
  const looks = selectedLooks();

  return pageShell(
    `
      <section class="create-video-page">
        <div class="top-bar compact-top-bar">
          <a class="icon-button" href="/create#videos" data-link aria-label="Back">${icons.back}</a>
          <h1>Create Video</h1>
          <span></span>
        </div>

        <section class="video-builder-hero">
          <p class="eyebrow">AI video</p>
          <h2>Generate 5-15s try-on content</h2>
          <p>Build motion content from ready AI Looks. Affiliate links stay attached.</p>
        </section>

        <section class="video-builder-panel">
          <div class="section-heading-row">
            <div>
              <p class="eyebrow">Selected looks</p>
              <h2>${looks.length} ready look${looks.length > 1 ? "s" : ""}</h2>
            </div>
          </div>
          <div class="video-look-list">
            ${looks.map(lookThumb).join("")}
          </div>
        </section>

        <section class="video-builder-panel">
          <div class="section-heading-row">
            <div>
              <p class="eyebrow">Template</p>
              <h2>Choose motion style</h2>
            </div>
          </div>
          <div class="video-template-grid">
            ${templates
              .map(
                (template, index) => `
                  <button class="${index === 0 ? "active" : ""}" type="button" data-video-template="${template.id}">
                    <span class="template-preview ${template.id}"></span>
                    <strong>${template.title}</strong>
                    <small>${template.detail}</small>
                  </button>
                `
              )
              .join("")}
          </div>
        </section>

        <section class="video-builder-panel">
          <div class="video-setting-row">
            <span>Duration</span>
            <div>
              <button class="active" type="button" data-video-setting="duration">5s</button>
              <button type="button" data-video-setting="duration">10s</button>
              <button type="button" data-video-setting="duration">15s</button>
            </div>
          </div>
          <div class="video-setting-row">
            <span>Format</span>
            <div>
              <button class="active" type="button" data-video-setting="format">9:16</button>
              <button type="button" data-video-setting="format">1:1</button>
            </div>
          </div>
          <div class="video-setting-row">
            <span>Overlay</span>
            <div>
              <button class="active" type="button" data-video-setting="overlay">Earn up to 20%</button>
              <button type="button" data-video-setting="overlay">Price</button>
              <button type="button" data-video-setting="overlay">No text</button>
            </div>
          </div>
        </section>

        <div class="tryon-bottom-action">
          <span>${looks.length} LOOK${looks.length > 1 ? "S" : ""}</span>
          <button type="button" data-generate-video>GENERATE VIDEO</button>
        </div>
      </section>
    `,
    "create"
  );
}

export function bindCreateVideoInteractions(root) {
  root.querySelectorAll("[data-video-template]").forEach((button) => {
    button.addEventListener("click", () => {
      root.querySelectorAll("[data-video-template]").forEach((item) => item.classList.toggle("active", item === button));
    });
  });

  root.querySelectorAll("[data-video-setting]").forEach((button) => {
    button.addEventListener("click", () => {
      const group = button.dataset.videoSetting;
      root.querySelectorAll(`[data-video-setting="${group}"]`).forEach((item) => {
        item.classList.toggle("active", item === button);
      });
    });
  });

  root.querySelector("[data-generate-video]")?.addEventListener("click", () => {
    showToast("Video generating", "AI VIDEOS");
    showVideoFloating();
  });
}

function showVideoFloating() {
  document.querySelector("[data-look-floating]")?.remove();
  document.body.insertAdjacentHTML(
    "beforeend",
    `
      <button class="look-floating-window" type="button" data-look-floating>
        <span class="video-floating-thumb">▶</span>
        <span>
          <strong>AI VIDEO</strong>
          <small>Generating · 5-15s material</small>
        </span>
      </button>
    `
  );
  document.querySelector("[data-look-floating]")?.addEventListener("click", () => {
    document.querySelector("[data-look-floating]")?.remove();
    navigate("/create#videos");
  });
}

function showToast(message, action) {
  document.querySelector(".app-toast")?.remove();
  document.body.insertAdjacentHTML(
    "beforeend",
    `<div class="app-toast"><strong>${message}</strong><span>${action}</span></div>`
  );
  window.setTimeout(() => document.querySelector(".app-toast")?.remove(), 2200);
}
