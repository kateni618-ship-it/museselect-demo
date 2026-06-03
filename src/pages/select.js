import { products } from "../data/mock-data.js";
import { pageShell } from "../components/layout.js";
import { productCard } from "../components/product-card.js";

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
