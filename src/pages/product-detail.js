import { accordion } from "../components/accordion.js";
import { icons } from "../components/icons.js";
import { pageShell } from "../components/layout.js";
import { collections, getCreator, getProduct } from "../data/mock-data.js";
import { navigate } from "../scripts/router.js";

export function productDetailPage({ productId }) {
  const product = getProduct(productId);
  const creator = getCreator(product.designerId);
  const thumbnails = [...product.images, product.images[0]].slice(0, 4);

  return pageShell(
    `
      <section class="product-detail-hero">
        <div class="gallery-main">
          <a class="gallery-back-button" href="/for-u" data-link aria-label="Back">${icons.back}</a>
          <img id="gallery-main-image" src="${product.images[0]}" alt="${product.name}" />
        </div>
        <div class="thumb-row" aria-label="Product image thumbnails">
          ${thumbnails
            .map(
              (image, index) => `
                <button type="button" data-gallery-thumb="${image}" aria-label="View product image ${index + 1}">
                  <img src="${image}" alt="" />
                </button>
              `
            )
            .join("")}
        </div>
      </section>

      <section class="product-info">
        <p class="silhouette-name">Aurelia</p>
        <h2>${product.name}</h2>
        <div class="price-row">
          <strong>${product.price}</strong>
          <span class="commission-badge static">Earn ${product.commissionRate}</span>
        </div>
        <div class="detail-commission-panel">
          <div class="standard-commission">
            <span>Promote content</span>
            <strong>Earn ${product.commissionAmount}</strong>
            <em>${product.commissionRate} standard</em>
          </div>
          <div class="ai-commission">
            <span class="ai-content-tag">${icons.sparkle}<i>AI Content</i></span>
            <b aria-hidden="true">↗</b>
            <span>Create look</span>
            <strong>Earn ${product.boostCommissionAmount}</strong>
            <em>${product.boostCommissionRate} commission</em>
          </div>
        </div>

        <div class="top-video-block">
          <p class="eyebrow">Top selling video</p>
          <div class="top-video-row">
            ${product.topVideos
              .map(
                (video) => `
                  <article>
                    <img src="${video.image}" alt="" />
                    <span>${video.views}</span>
                    <strong>${video.sold}</strong>
                  </article>
                `
              )
              .join("")}
          </div>
        </div>

        <p class="eyebrow">Size</p>
        <div class="size-row" aria-label="Size options">
          ${product.sizes.map((size) => `<button type="button">${size}</button>`).join("")}
        </div>

        <div class="designer-panel">
          <img src="${creator.avatar}" alt="${creator.name}" />
          <p>Designed<br /><span>By ${creator.name}</span></p>
          <span aria-hidden="true">${icons.back.replace('viewBox="0 0 24 24"', 'viewBox="0 0 24 24" style="transform: rotate(180deg)"')}</span>
        </div>
      </section>

      ${accordion(product.details)}

      <div class="product-action-bar">
        <button type="button" class="detail-action secondary" data-pick-product="${product.id}" aria-label="Pick">${icons.pick}<span>Pick</span></button>
        <button type="button" class="detail-action promote" data-promote-product="${product.id}">Promote</button>
      </div>
    `,
    "for-u"
  );
}

export function bindProductDetailInteractions(root) {
  const mainImage = root.querySelector("#gallery-main-image");
  if (mainImage) {
    root.querySelectorAll("[data-gallery-thumb]").forEach((button) => {
      button.addEventListener("click", () => {
        mainImage.src = button.dataset.galleryThumb;
      });
    });
  }

  root.querySelectorAll("[data-promote-product]").forEach((button) => {
    button.addEventListener("click", () => {
      showPromotionSheet(getProduct(button.dataset.promoteProduct));
    });
  });

  root.querySelectorAll("[data-promote-collection]").forEach((button) => {
    button.addEventListener("click", () => {
      const collection = collections.find((item) => item.id === button.dataset.promoteCollection) || collections[0];
      showPromotionSheet(null, collection);
    });
  });

  root.querySelectorAll("[data-pick-product]").forEach((button) => {
    button.addEventListener("click", () => {
      showToast("Added to Picks", "Add collection");
    });
  });
}

function showPromotionSheet(product, collection) {
  const existing = document.querySelector("[data-promotion-sheet]");
  existing?.remove();
  const title = collection ? collection.title : product.name;
  const commission = collection ? collection.estimatedCommission : product.commissionAmount;
  const boost = collection
    ? formatMoney(parseMoney(collection.estimatedCommission) / 3)
    : formatMoney(parseMoney(product.boostCommissionAmount) - parseMoney(product.commissionAmount));
  const target = collection ? "Collection Link" : "Product Link";
  const url = collection
    ? `museland.app/c/${collection.id}?uid=aria`
    : `museland.app/p/${product.id}?uid=aria`;

  document.body.insertAdjacentHTML(
    "beforeend",
    `
      <div class="sheet-backdrop" data-promotion-sheet></div>
      <section class="bottom-sheet promo-sheet" data-promotion-sheet role="dialog" aria-label="Generated link">
        <div class="sheet-header">
          <button class="sheet-icon" type="button" data-close-promotion aria-label="Close">×</button>
          <h2>Promote</h2>
          <span></span>
        </div>
        <div class="sheet-body">
          <h3>${title}</h3>
          <p class="promo-commission">Earn ${commission}</p>
          <button class="generated-link" type="button" data-copy-link>
            <span>${url}</span>
            <b>COPY LINK</b>
          </button>
          <div class="ai-earn-copy">
            <strong>Earn extra ${boost} with AI content</strong>
            <p>Create a look in 30 seconds · +5%</p>
          </div>
          <button class="primary-cta centered" type="button" data-promo-nav>CREATE AI LOOK</button>
        </div>
      </section>
    `
  );

  showToast("LINK COPIED", "Ready to share");

  document.querySelectorAll("[data-close-promotion]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-promotion-sheet]").forEach((node) => node.remove());
    });
  });

  document.querySelectorAll("[data-copy-link]").forEach((button) => {
    button.addEventListener("click", () => {
      showToast("LINK COPIED", "Ready to share");
    });
  });

  document.querySelector("[data-promo-nav]")?.addEventListener("click", (event) => {
    event.preventDefault();
    document.querySelectorAll("[data-promotion-sheet]").forEach((node) => node.remove());
    navigate("/picks");
  });
}

function parseMoney(value) {
  return Number(String(value).replace(/[^0-9.]/g, "")) || 0;
}

function formatMoney(value) {
  return `$${value.toFixed(2)}`;
}

function showToast(message, action) {
  document.querySelector(".app-toast")?.remove();
  document.body.insertAdjacentHTML(
    "beforeend",
    `<div class="app-toast"><strong>${message}</strong><span>${action}</span></div>`
  );
  window.setTimeout(() => document.querySelector(".app-toast")?.remove(), 2200);
}
