import { forUCollections, getProduct, products, selectedCreator, topicTabs } from "../data/mock-data.js";
import { pageShell } from "../components/layout.js";
import { productListRow } from "../components/product-card.js";

function forUCollectionCard(collection) {
  const products = collection.productIds.map(getProduct);
  return `
    <article class="for-u-collection-card">
      <div class="collection-preview">
        ${products.slice(0, 2).map((product) => `<img src="${product.images[0]}" alt="" />`).join("")}
      </div>
      <h3>${collection.title}</h3>
      <p>${collection.productCount}</p>
      <a href="/picks/collections/${collection.id}" data-link>View more</a>
    </article>
  `;
}

export function homePage() {
  const bestSellers = products
    .filter((product) => product.tag === "Best Seller")
    .sort((a, b) => Number(b.salesCount) - Number(a.salesCount));

  return pageShell(
    `
      <section class="for-u-page">
        <header class="creator-home-header">
          <p class="app-time">9:41</p>
          <div>
            <p class="eyebrow">FOR U</p>
            <h1>For ${selectedCreator.name}'s <span>${selectedCreator.style}</span></h1>
          </div>
          <img src="${selectedCreator.avatar}" alt="${selectedCreator.name}" />
        </header>

        <section class="creator-section">
          <div class="section-heading-row">
            <div>
              <p class="eyebrow">Personalized Collections</p>
              <h2>Creator Edits</h2>
            </div>
          </div>
          <div class="horizontal-collections" aria-label="Personalized collections">
            ${forUCollections.map(forUCollectionCard).join("")}
          </div>
        </section>

        <section class="creator-section">
          <div class="topic-tabs" aria-label="Product topics">
            ${topicTabs
              .map(
                (topic, index) => `
                  <button class="${index === 0 ? "active" : ""}" type="button">${topic.label}</button>
                `
              )
              .join("")}
          </div>
          <div class="best-seller-list">
            ${bestSellers
              .map((product, index) =>
                productListRow(product, {
                  actionLabel: "Promote",
                  meta: `Sold ${product.salesCount}`,
                  rank: index + 1
                })
              )
              .join("")}
          </div>
        </section>
      </section>
    `,
    "for-u"
  );
}
