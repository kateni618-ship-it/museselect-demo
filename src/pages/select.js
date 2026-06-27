import { products } from "../data/mock-data.js";
import { pageShell } from "../components/layout.js";
import { productCard } from "../components/product-card.js";
import { icons } from "../components/icons.js";

const selectFeatures = [
  {
    id: "bestseller",
    label: "🔥 Bestseller",
    title: "Bestseller",
    subtitle: "Top converting pieces this week",
    productIds: ["rose-noir-mini", "botanical-resort-midi", "aurelia-blue-bloom"],
    heroProductId: "rose-noir-mini"
  },
  {
    id: "new-in",
    label: "New In",
    title: "New In",
    subtitle: "Fresh drops ready for content",
    productIds: ["aurelia-blue-bloom", "botanical-resort-midi", "rose-noir-mini"],
    heroProductId: "aurelia-blue-bloom"
  },
  {
    id: "trending",
    label: "Trending",
    title: "Trending",
    subtitle: "Styles gaining creator traction",
    productIds: ["botanical-resort-midi", "rose-noir-mini", "aurelia-blue-bloom"],
    heroProductId: "botanical-resort-midi"
  },
  {
    id: "high-commission",
    label: "Creator Picks",
    title: "Creator Picks",
    subtitle: "Best picks for stronger creator content",
    productIds: ["aurelia-blue-bloom", "rose-noir-mini", "botanical-resort-midi"],
    heroProductId: "aurelia-blue-bloom"
  },
  {
    id: "local-ship",
    label: "Local Ship",
    title: "Local Ship",
    subtitle: "Fast-turn products for urgent posts",
    productIds: ["rose-noir-mini", "aurelia-blue-bloom", "botanical-resort-midi"],
    heroProductId: "rose-noir-mini"
  }
];

function getFeature(topicId) {
  return selectFeatures.find((item) => item.id === topicId) || selectFeatures[0];
}

function getProductById(productId) {
  return products.find((product) => product.id === productId) || products[0];
}

function featureTile(feature, options = {}) {
  const heroProduct = getProductById(feature.heroProductId);
  return `
    <a class="select-feature-tile ${options.large ? "large" : ""}" href="/select/${feature.id}" data-link>
      <img src="${heroProduct.images[0]}" alt="" />
      ${feature.label && feature.label !== feature.title ? `<span>${feature.label}</span>` : ""}
      <strong>${feature.title}</strong>
      <em>${feature.subtitle}</em>
    </a>
  `;
}

function waterfallCard(product, index) {
  return `
    <article class="waterfall-product-card ${index % 2 ? "offset" : ""}">
      <a href="/product/${product.id}" data-link>
        <div class="waterfall-media">
          <img src="${product.images[0]}" alt="${product.name}" />
          ${product.tag ? `<span>${product.tag}</span>` : ""}
        </div>
        <div class="waterfall-copy">
          <strong>${product.shortName}</strong>
          <small>${product.price}</small>
          <em>Earn up to ${product.boostCommissionRate}</em>
          <b>Est. ${product.boostCommissionAmount}</b>
        </div>
      </a>
      <button type="button" data-promote-product="${product.id}">Promote</button>
    </article>
  `;
}

export function selectPage() {
  const chips = ["Category", "Style", "Color", "Price", "Ship", "Commission"];
  const sortOptions = ["Relevant", "High commission", "Best selling", "Price"];

  return pageShell(
    `
      <section class="select-page">
        <header class="library-header">
          <p class="app-time">9:41</p>
          <p class="eyebrow">SELECT</p>
          <h1>Products</h1>
          <label class="search-field">
            <input type="search" value="" placeholder="Search dresses, floral, linen, resort..." />
          </label>
        </header>

        <section class="select-feature-board" aria-label="Featured product edits">
          ${featureTile(selectFeatures[0], { large: true })}
          <div class="select-feature-side">
            ${selectFeatures.slice(1).map((feature) => featureTile(feature)).join("")}
          </div>
        </section>

        <div class="filter-strip compact-filter">
          ${chips.map((chip) => `<button type="button">${chip}</button>`).join("")}
        </div>

        <div class="sort-chip-row" aria-label="Sort products">
          ${sortOptions.map((item, index) => `<button class="${index === 0 ? "active" : ""}" type="button">${item}</button>`).join("")}
        </div>

        <section class="select-grid" aria-label="Products">
          ${products
            .map((product) =>
              productCard(product, {
                compact: true,
                showCreator: false,
                secondaryAction: "Pick",
                primaryLabel: "Promote"
              })
            )
            .join("")}
        </section>
      </section>
    `,
    "select"
  );
}

export function selectTopicPage({ topicId }) {
  const feature = getFeature(topicId);
  const heroProduct = getProductById(feature.heroProductId);
  const topicProducts = feature.productIds.map(getProductById);

  return pageShell(
    `
      <section class="select-topic-page">
        <header class="select-topic-hero">
          <a class="gallery-back-button select-topic-back" href="/select" data-link aria-label="Back">${icons.back}</a>
          <img src="${heroProduct.images[0]}" alt="" />
          <div>
            <p class="eyebrow">SELECT EDIT</p>
            <h1>${feature.title}</h1>
            <p>${feature.subtitle}</p>
          </div>
        </header>

        <section class="topic-waterfall" aria-label="${feature.title} products">
          ${topicProducts.map(waterfallCard).join("")}
        </section>
      </section>
    `,
    "select"
  );
}
