import { pageShell } from "../components/layout.js";
import { getProduct, lookJobs, videoJobs } from "../data/mock-data.js";
import {
  creationState,
  getSelectedAvatar,
  getSelectedPattern,
  getSelectedSilhouette,
  hasDesigns
} from "../data/creation-store.js";
import { withBasePath } from "../scripts/base-path.js";
import { navigate } from "../scripts/router.js";

function createIntro(text, actionLabel, actionAttr) {
  return `
    <div class="create-tab-intro">
      <p>${text}</p>
      <button type="button" ${actionAttr}>${actionLabel}</button>
    </div>
  `;
}

function muselandShowcaseCard(label, title, body) {
  return `
    <article class="museland-showcase-card">
      <span>${label}</span>
      <strong>${title}</strong>
      <p>${body}</p>
    </article>
  `;
}

function designStatusCard({ title, subtitle, actionLabel, href, badge = "", generating = false }) {
  const silhouette = getSelectedSilhouette();
  const pattern = getSelectedPattern();
  return `
    <article class="museland-status-card">
      <div class="design-pair-preview">
        <img src="${silhouette.image}" alt="" />
        <img src="${pattern.image}" alt="" />
      </div>
      <span>
        ${badge ? `<em>${badge}</em>` : ""}
        <strong>${title}</strong>
        <small>${subtitle}</small>
        ${generating ? `<i><b style="width: 58%"></b></i>` : ""}
      </span>
      <a href="${href}" data-link>${actionLabel}</a>
    </article>
  `;
}

function productPublishCard() {
  const silhouette = getSelectedSilhouette();
  const pattern = getSelectedPattern();
  const baseProduct = getProduct("aurelia-blue-bloom");
  const images = [silhouette.image, pattern.image, getSelectedAvatar().image, baseProduct.images[0]];
  return `
    <article class="museland-product-card">
      <div class="product-image-strip">
        ${images.map((image) => `<img src="${image}" alt="" />`).join("")}
      </div>
      <div>
        <strong>${silhouette.name} ${pattern.name} Dress</strong>
        <small>${baseProduct.price} · Base commission +3%</small>
      </div>
      <a href="/publish/${creationState.id}" data-link>PUBLISH</a>
    </article>
  `;
}

function muselandEmptyState() {
  return `
    <section class="create-museland-empty">
      <div class="museland-showcase-hero">
        <img src="${withBasePath("/assets/placeholder-hero.png")}" alt="" />
        <div>
          <span>MUSELAND SHOWCASE</span>
          <h2>Design your own dress.</h2>
          <p>Create an original dress, publish it to the creator marketplace, and earn on every sale.</p>
        </div>
      </div>
      <div class="museland-market-points">
        ${muselandShowcaseCard("Create", "Design your own dress", "Choose the silhouette, try on print styles, and polish the final pattern.")}
        ${muselandShowcaseCard("Earn", "Creators sell it for you", "Your design can be picked by platform creators, with 3% royalty paid to you.")}
        ${muselandShowcaseCard("Boost", "Sell it yourself for more", "When you promote your own product, your base commission gets an extra +3%.")}
      </div>
      <div class="create-bottom-action">
        <button class="primary-cta centered" type="button" data-open-design-create>START MY FIRST DESIGN</button>
      </div>
    </section>
  `;
}

function muselandAssetState() {
  const silhouette = getSelectedSilhouette();
  const pattern = getSelectedPattern();
  const designCount = Math.max(creationState.savedDesigns.length, hasDesigns() ? 1 : 0);
  const tabs = ["Designing", "To Generate", "To Publish", "Published", "Failed"];
  return `
    <section class="create-museland-assets">
      <div class="museland-asset-header">
        <div>
          <p class="eyebrow">Museland</p>
          <h2>Your design business</h2>
        </div>
        <button type="button" data-open-design-create>+ New Design</button>
      </div>
      <div class="museland-status-tabs" aria-label="Design status">
        ${tabs.map((item, index) => `<button class="${index === 0 ? "active" : ""}" type="button" data-museland-status-tab="${item.toLowerCase().replace(/\s+/g, "-")}">${item}</button>`).join("")}
      </div>

      <div class="museland-status-pane active" data-museland-status-pane="designing">
        ${designStatusCard({
          title: `${silhouette.name} print direction`,
          subtitle: "Print options are still generating. Continue when ready.",
          actionLabel: "CONTINUE",
          href: "/museland/pattern",
          badge: "Generating print",
          generating: true
        })}
      </div>

      <div class="museland-status-pane" data-museland-status-pane="to-generate">
        ${designStatusCard({
          title: `${silhouette.name} ${pattern.name} Dress`,
          subtitle: "Design is ready. Upload avatar or generate model product images.",
          actionLabel: "GENERATE",
          href: `/mine/designs/${creationState.id}`,
          badge: "Avatar needed"
        })}
        ${designStatusCard({
          title: `${silhouette.name} avatar image set`,
          subtitle: "Avatar uploaded. Product images are being generated.",
          actionLabel: "GENERATE",
          href: `/mine/products`,
          badge: "Producing",
          generating: true
        })}
      </div>

      <div class="museland-status-pane" data-museland-status-pane="to-publish">
        ${productPublishCard()}
      </div>

      <div class="museland-status-pane" data-museland-status-pane="published">
        <div class="empty-state compact-empty-state">
          <p class="eyebrow">Published</p>
          <h3>No published products yet.</h3>
          <p>Published products will appear here after review.</p>
        </div>
      </div>

      <div class="museland-status-pane" data-museland-status-pane="failed">
        <div class="empty-state compact-empty-state">
          <p class="eyebrow">Failed</p>
          <h3>No failed products.</h3>
          <p>Generation or publish failures will appear here.</p>
        </div>
      </div>
    </section>
  `;
}

function lookRow(job) {
  const firstProduct = getProduct(job.productIds[0]);
  const isReady = job.status === "Ready";
  const progressValue = Number(job.progress.replace("%", "")) || 0;
  return `
    <article class="look-row" data-filter-item data-look-status="${job.status.toLowerCase()}">
      <div class="look-thumb">
        <img src="${firstProduct.images[0]}" alt="${job.title}" />
        <span class="${job.status.toLowerCase()}">${job.status}</span>
      </div>
      <div>
        <strong>${job.title}</strong>
        <span class="look-mode-tag">${job.mode}</span>
        <p>${job.productIds.length} product${job.productIds.length > 1 ? "s" : ""}</p>
        ${
          isReady
            ? ""
            : `<div class="look-progress" aria-label="${job.progress} generated"><span style="width: ${progressValue}%"></span></div><small>${job.progress} generating</small>`
        }
      </div>
      <div class="look-actions normal-actions">
        ${isReady ? `<button class="ghost-look-action" type="button" data-polish-look="${job.id}">Polish</button>` : ""}
        ${isReady ? `<button class="ghost-look-action video" type="button" data-create-video-look="${job.id}">Create Video</button>` : ""}
        <button class="${isReady ? "" : "disabled"}" type="button">${isReady ? "Publish" : job.status}</button>
      </div>
    </article>
  `;
}

function videoRow(video) {
  const product = getProduct(video.thumbnailProductId);
  const isReady = video.status === "Ready";
  const progressValue = Number(video.progress.replace("%", "")) || 0;
  return `
    <article class="look-row video-row" data-filter-item data-video-status="${video.status.toLowerCase()}">
      <div class="look-thumb video-thumb">
        <img src="${product.images[0]}" alt="${video.title}" />
        <span class="${video.status.toLowerCase()}">${video.status}</span>
        <b>▶</b>
      </div>
      <div>
        <strong>${video.title}</strong>
        <span class="look-mode-tag">${video.template}</span>
        <p>${video.duration} · ${video.lookIds.length} look${video.lookIds.length > 1 ? "s" : ""}</p>
        ${
          isReady
            ? ""
            : `<div class="look-progress" aria-label="${video.progress} generated"><span style="width: ${progressValue}%"></span></div><small>${video.progress} generating</small>`
        }
      </div>
      <div class="look-actions normal-actions">
        ${isReady ? `<button class="ghost-look-action" type="button">Download</button>` : ""}
        <button class="${isReady ? "" : "disabled"}" type="button">${isReady ? "Publish" : video.status}</button>
      </div>
    </article>
  `;
}

export function createPage() {
  return pageShell(
    `
      <section class="create-page">
        <header class="create-header">
          <p class="app-time">9:41</p>
          <h1>CREATE</h1>
        </header>

        <div class="asset-tabs create-tabs">
          <a class="active" href="#looks" data-create-tab="looks">AI Looks</a>
          <a href="#videos" data-create-tab="videos">AI Videos</a>
          <a href="#museland" data-create-tab="museland">Museland</a>
        </div>

        <section id="looks" class="asset-section active">
          ${createIntro("Generate creator-ready lookbook materials from products or collections.", "Create Look", "data-open-create-look")}
          <div class="look-status-filter" aria-label="AI look status filter">
            <button class="active" type="button" data-look-filter="all">All</button>
            <button type="button" data-look-filter="ready">Ready</button>
            <button type="button" data-look-filter="generating">Generating</button>
          </div>
          <div class="look-list">
            ${lookJobs.map(lookRow).join("")}
          </div>
        </section>

        <section id="videos" class="asset-section">
          ${createIntro("Turn saved looks into short videos for Reels, TikTok, and stories.", "Create Video", "data-open-create-video")}
          <div class="look-status-filter" aria-label="AI video status filter">
            <button class="active" type="button" data-video-filter="all">All</button>
            <button type="button" data-video-filter="ready">Ready</button>
            <button type="button" data-video-filter="generating">Generating</button>
          </div>
          <div class="look-list">
            ${videoJobs.map(videoRow).join("")}
          </div>
        </section>

        <section id="museland" class="asset-section">
          ${hasDesigns() ? muselandAssetState() : muselandEmptyState()}
        </section>
      </section>
    `,
    "create"
  );
}

export function bindCreateInteractions(root) {
  const tabs = root.querySelectorAll("[data-create-tab]");
  const sections = root.querySelectorAll(".create-page .asset-section");
  const activateTab = (id) => {
    tabs.forEach((item) => item.classList.toggle("active", item.getAttribute("href") === `#${id}`));
    sections.forEach((section) => section.classList.toggle("active", section.id === id));
  };

  tabs.forEach((tab) => {
    tab.addEventListener("click", (event) => {
      event.preventDefault();
      activateTab(tab.getAttribute("href").replace("#", ""));
    });
  });

  const initialTab = window.location.hash.replace("#", "");
  if (initialTab && root.querySelector(`#${initialTab}`)) {
    activateTab(initialTab);
  } else if (initialTab?.startsWith("museland-")) {
    activateTab("museland");
  }

  root.querySelector("[data-open-create-look]")?.addEventListener("click", () => navigate("/create-look"));
  root.querySelector("[data-open-create-video]")?.addEventListener("click", () => navigate("/create-video"));
  root.querySelectorAll("[data-open-design-create]").forEach((button) => {
    button.addEventListener("click", () => navigate("/museland"));
  });
  root.querySelectorAll("[data-create-video-look]").forEach((button) => {
    button.addEventListener("click", () => navigate(`/create-video?looks=${button.dataset.createVideoLook}`));
  });

  root.querySelectorAll(".museland-status-tabs button").forEach((button) => {
    button.addEventListener("click", () => {
      activateMuselandStatus(button.dataset.muselandStatusTab);
    });
  });

  const requestedStatus = initialTab?.startsWith("museland-") ? initialTab.replace("museland-", "") : "";
  if (requestedStatus) {
    activateMuselandStatus(requestedStatus);
  }

  root.querySelectorAll("[data-look-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      const filterBar = button.closest(".look-status-filter");
      filterBar.querySelectorAll("[data-look-filter]").forEach((item) => item.classList.toggle("active", item === button));
      applyCreateFilters(button.closest(".asset-section"));
    });
  });

  root.querySelectorAll("[data-video-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      const filterBar = button.closest(".look-status-filter");
      filterBar.querySelectorAll("[data-video-filter]").forEach((item) => item.classList.toggle("active", item === button));
      applyCreateFilters(button.closest(".asset-section"));
    });
  });
}

function activateMuselandStatus(status) {
  document.querySelectorAll("[data-museland-status-tab]").forEach((item) => {
    item.classList.toggle("active", item.dataset.muselandStatusTab === status);
  });
  document.querySelectorAll("[data-museland-status-pane]").forEach((pane) => {
    pane.classList.toggle("active", pane.dataset.muselandStatusPane === status);
  });
}

function applyCreateFilters(section) {
  const status = section.querySelector("[data-look-filter].active")?.dataset.lookFilter || "all";
  const videoStatus = section.querySelector("[data-video-filter].active")?.dataset.videoFilter || "all";

  section.querySelectorAll("[data-filter-item]").forEach((item) => {
    const matchesStatus = status === "all" || item.dataset.lookStatus === status;
    const matchesVideoStatus = videoStatus === "all" || item.dataset.videoStatus === videoStatus;
    item.hidden = !(matchesStatus && matchesVideoStatus);
  });
}
