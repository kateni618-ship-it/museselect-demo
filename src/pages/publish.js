import { pageShell, topBar } from "../components/layout.js";
import {
  getPublishListing,
  markPublished,
  markPublishing,
  updatePublishListing
} from "../data/creation-store.js";
import { navigate } from "../scripts/router.js";

let modalState = "idle";

function styleOption(style, selectedLook) {
  return `
    <button class="publish-style ${selectedLook === style.id ? "selected" : ""}" type="button" data-select-look="${style.id}">
      <img src="${style.image}" alt="${style.label}" />
      <span>${style.label}</span>
    </button>
  `;
}

function publishModal() {
  if (modalState === "idle") return "";
  const isDone = modalState === "done";
  return `
    <div class="completion-backdrop"></div>
    <section class="publish-modal" aria-label="${isDone ? "Published" : "Publishing"}">
      <div class="publish-loader ${isDone ? "done" : ""}">${isDone ? "✓" : ""}</div>
      <p class="eyebrow">${isDone ? "Published" : "Publishing"}</p>
      <h2>${isDone ? "Product is live." : "Publishing your product."}</h2>
      <p>
        ${
          isDone
            ? "Your mock listing status has been updated to Published."
            : "MUSELAND is preparing product information, creator assets, and listing details."
        }
      </p>
      ${
        isDone
          ? `<button class="primary-cta centered" type="button" data-finish-publish>View Creation</button>`
          : ""
      }
    </section>
  `;
}

export function publishPage() {
  const listing = getPublishListing();
  const creation = listing.creation;
  return pageShell(
    `
      ${topBar("Publish Product", `/mine/designs/${creation.id}`)}
      <section class="publish-page">
        <section class="publish-preview">
          <img src="${creation.assets[1].image}" alt="${listing.title}" />
          <div>
            <span class="status-pill ${listing.publishStatus.toLowerCase()}">${listing.publishStatus}</span>
            <h2>${listing.title}</h2>
            <p>${creation.mode} · ${creation.createdAt}</p>
          </div>
        </section>

        <section class="publish-panel">
          <label for="listing-title">Product Title</label>
          <input id="listing-title" data-publish-title value="${listing.title}" />

          <label for="listing-description">Product Description</label>
          <textarea id="listing-description" data-publish-description>${listing.description}</textarea>
        </section>

        <section class="publish-panel">
          <h2>Choose Publish Style</h2>
          <div class="publish-style-grid">
            ${listing.styles.map((style) => styleOption(style, listing.selectedLook)).join("")}
          </div>
        </section>

        <section class="publish-panel publish-summary">
          <h2>Listing Summary</h2>
          <dl>
            <div>
              <dt>Price</dt>
              <dd>$450</dd>
            </div>
            <div>
              <dt>Commission</dt>
              <dd>Earn 15% / $67.50</dd>
            </div>
            <div>
              <dt>Supplier</dt>
              <dd>MUSELAND verified production</dd>
            </div>
          </dl>
        </section>

        <div class="publish-action-bar">
          <button class="primary-cta centered" type="button" data-publish-submit ${
            listing.publishStatus === "Published" ? "disabled" : ""
          }>
            ${listing.publishStatus === "Published" ? "Published" : "Publish"}
          </button>
        </div>
      </section>
      ${publishModal()}
    `,
    "mine"
  );
}

export function bindPublishInteractions(root) {
  const title = root.querySelector("[data-publish-title]");
  title?.addEventListener("input", () => {
    updatePublishListing({ title: title.value });
  });

  const description = root.querySelector("[data-publish-description]");
  description?.addEventListener("input", () => {
    updatePublishListing({ description: description.value });
  });

  root.querySelectorAll("[data-select-look]").forEach((button) => {
    button.addEventListener("click", () => {
      updatePublishListing({ selectedLook: button.dataset.selectLook });
      navigate("/publish/aria-boldbloom");
    });
  });

  root.querySelector("[data-publish-submit]")?.addEventListener("click", () => {
    markPublishing();
    modalState = "publishing";
    navigate("/publish/aria-boldbloom");
    window.setTimeout(() => {
      markPublished();
      modalState = "done";
      navigate("/publish/aria-boldbloom");
    }, 900);
  });

  root.querySelector("[data-finish-publish]")?.addEventListener("click", () => {
    modalState = "idle";
    navigate("/mine/designs/aria-boldbloom");
  });
}
