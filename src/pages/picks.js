import { collections, getProduct, lookJobs, pickedProductIds } from "../data/mock-data.js";
import { pageShell } from "../components/layout.js";
import { productListRow } from "../components/product-card.js";

function sectionToolbar(title, options = {}) {
  return `
    <div class="asset-section-toolbar">
      <span>${title}</span>
      <div>
        ${options.create ? `<button type="button" data-open-create-collection>Create</button>` : ""}
        <button type="button" data-toggle-manage>Manage</button>
      </div>
    </div>
  `;
}

function sectionSearch(placeholder) {
  return `
    <label class="asset-search">
      <input type="search" data-asset-search placeholder="${placeholder}" />
    </label>
  `;
}

function collectionCard(collection) {
  const products = collection.productIds.map(getProduct);
  const searchText = `${collection.title} ${collection.description} ${collection.productIds.length} ${collection.estimatedCommission} ${products
    .map((product) => `${product.name} ${product.shortName}`)
    .join(" ")}`.toLowerCase();
  return `
    <article class="collection-card" data-filter-item data-search="${searchText}">
      <a href="/picks/collections/${collection.id}" data-link>
        <div class="collection-cover">
          ${products.slice(0, 2).map((product) => `<img src="${product.images[0]}" alt="" />`).join("")}
        </div>
        <div>
          <h3>${collection.title}</h3>
          <p><span>${collection.productIds.length} products</span><em>Est. ${collection.estimatedCommission}</em></p>
        </div>
      </a>
      <div class="collection-actions normal-actions">
        <button type="button" data-promote-collection="${collection.id}">Promote</button>
      </div>
      <div class="collection-actions manage-actions">
        <button class="danger-row-action" type="button" data-delete-collection="${collection.id}">Delete</button>
      </div>
    </article>
  `;
}

function lookRow(job) {
  const firstProduct = getProduct(job.productIds[0]);
  const isReady = job.status === "Ready";
  const progressValue = Number(job.progress.replace("%", "")) || 0;
  const searchText = `${job.title} ${job.mode} ${job.status} ${job.channel} ${job.productIds
    .map((id) => {
      const product = getProduct(id);
      return `${product.name} ${product.shortName}`;
    })
    .join(" ")}`.toLowerCase();
  return `
    <article class="look-row" data-filter-item data-search="${searchText}" data-look-status="${job.status.toLowerCase()}">
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
        ${isReady ? `<em>Earn +5%</em>` : ""}
        <button class="${isReady ? "" : "disabled"}" type="button">${isReady ? "Publish" : job.status}</button>
      </div>
      <div class="look-actions manage-actions">
        <button class="danger-row-action" type="button" data-delete-look="${job.id}">Delete</button>
      </div>
    </article>
  `;
}

export function picksPage() {
  const pickedProducts = pickedProductIds.map(getProduct);

  return pageShell(
    `
      <section class="picks-page">
        <header class="library-header compact">
          <p class="app-time">9:41</p>
          <h1>PICKS</h1>
        </header>

        <div class="asset-tabs">
          <a class="active" href="#all-picks" data-picks-tab="all-picks">Picked Products</a>
          <a href="#collections" data-picks-tab="collections">Collection</a>
          <a href="#looks" data-picks-tab="looks">AI LOOKS</a>
        </div>

        <section id="all-picks" class="asset-section active">
          ${sectionToolbar("Picked Products")}
          ${sectionSearch("Search picked products...")}
          <div class="best-seller-list">
            ${pickedProducts
              .map((product) =>
                productListRow(product, {
                  actionLabel: "Promote",
                  secondaryLabel: "Add collection",
                  removeLabel: "Remove",
                  meta: `Sold ${product.salesCount}`,
                })
              )
              .join("")}
          </div>
        </section>

        <section id="collections" class="asset-section">
          ${sectionToolbar("Collection", { create: true })}
          ${sectionSearch("Search collections...")}
          <div class="collection-list">
            ${collections.map(collectionCard).join("")}
          </div>
        </section>

        <section id="looks" class="asset-section">
          ${sectionToolbar("AI LOOKS")}
          ${sectionSearch("Search AI looks...")}
          <div class="look-status-filter" aria-label="AI look status filter">
            <button class="active" type="button" data-look-filter="all">All</button>
            <button type="button" data-look-filter="ready">Ready</button>
            <button type="button" data-look-filter="generating">Generating</button>
          </div>
          <div class="look-list">
            ${lookJobs.map(lookRow).join("")}
          </div>
        </section>
      </section>
    `,
    "picks"
  );
}

export function bindPicksInteractions(root) {
  const tabs = root.querySelectorAll("[data-picks-tab], .asset-tabs a[href='#looks']");
  const sections = root.querySelectorAll(".picks-page .asset-section");
  const activateTab = (id) => {
    tabs.forEach((item) => item.classList.toggle("active", item.getAttribute("href") === `#${id}`));
    sections.forEach((section) => section.classList.toggle("active", section.id === id));
  };
  tabs.forEach((tab) => {
    tab.addEventListener("click", (event) => {
      event.preventDefault();
      const id = tab.getAttribute("href").replace("#", "");
      activateTab(id);
    });
  });

  const initialTab = window.location.hash.replace("#", "");
  if (initialTab && root.querySelector(`#${initialTab}`)) {
    activateTab(initialTab);
  }

  root.querySelectorAll("[data-toggle-manage]").forEach((button) => {
    button.addEventListener("click", () => {
      const section = button.closest(".asset-section");
      const isManaging = section.classList.toggle("is-managing");
      button.textContent = isManaging ? "Done" : "Manage";
    });
  });

  root.querySelectorAll("[data-open-create-collection]").forEach((button) => {
    button.addEventListener("click", () => {
      showCreateCollectionSheet();
    });
  });

  root.querySelectorAll("[data-asset-search]").forEach((input) => {
    input.addEventListener("input", () => applyAssetFilters(input.closest(".asset-section")));
  });

  root.querySelectorAll("[data-look-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      const filterBar = button.closest(".look-status-filter");
      filterBar.querySelectorAll("[data-look-filter]").forEach((item) => {
        item.classList.toggle("active", item === button);
      });
      applyAssetFilters(button.closest(".asset-section"));
    });
  });

  root.querySelectorAll("[data-add-collection]").forEach((button) => {
    button.addEventListener("click", () => {
      showAddCollectionSheet(getProduct(button.dataset.addCollection));
    });
  });

  root.querySelectorAll("[data-remove-pick]").forEach((button) => {
    button.addEventListener("click", () => {
      showConfirmSheet({
        title: "Remove picked product?",
        body: "This product will leave Picked Products. Existing collection links are not changed in this demo.",
        confirmLabel: "Remove",
        onConfirm: () => {
          button.closest(".product-list-row")?.remove();
          showToast("Removed", "Picked product");
        }
      });
    });
  });

  root.querySelectorAll("[data-delete-collection]").forEach((button) => {
    button.addEventListener("click", () => {
      showConfirmSheet({
        title: "Delete collection?",
        body: "The collection card will be removed from this demo list. Product picks remain available.",
        confirmLabel: "Delete",
        onConfirm: () => {
          button.closest(".collection-card")?.remove();
          showToast("Deleted", "Collection");
        }
      });
    });
  });

  root.querySelectorAll("[data-delete-look]").forEach((button) => {
    button.addEventListener("click", () => {
      showConfirmSheet({
        title: "Delete AI look?",
        body: "This generated look will be removed from AI LOOKS.",
        confirmLabel: "Delete",
        onConfirm: () => {
          button.closest(".look-row")?.remove();
          showToast("Deleted", "AI look");
        }
      });
    });
  });
}

function applyAssetFilters(section) {
  const query = section.querySelector("[data-asset-search]")?.value.trim().toLowerCase() || "";
  const status = section.querySelector("[data-look-filter].active")?.dataset.lookFilter || "all";

  section.querySelectorAll("[data-filter-item]").forEach((item) => {
    const matchesQuery = !query || item.dataset.search.includes(query);
    const matchesStatus = status === "all" || item.dataset.lookStatus === status;
    item.hidden = !(matchesQuery && matchesStatus);
  });
}

function showConfirmSheet({ title, body, confirmLabel, onConfirm }) {
  document.querySelectorAll("[data-confirm-sheet]").forEach((node) => node.remove());
  document.body.insertAdjacentHTML(
    "beforeend",
    `
      <div class="sheet-backdrop" data-confirm-sheet></div>
      <section class="bottom-sheet confirm-sheet" data-confirm-sheet role="dialog" aria-label="${title}">
        <div class="sheet-header">
          <button class="sheet-icon" type="button" data-close-confirm aria-label="Close">×</button>
          <h2>Confirm</h2>
          <span></span>
        </div>
        <div class="sheet-body">
          <h3>${title}</h3>
          <p>${body}</p>
          <button class="danger-confirm" type="button" data-confirm-action>${confirmLabel}</button>
          <button class="secondary-link-button" type="button" data-close-confirm>Cancel</button>
        </div>
      </section>
    `
  );

  document.querySelectorAll("[data-close-confirm]").forEach((button) => {
    button.addEventListener("click", () => closeConfirmSheet());
  });

  document.querySelector("[data-confirm-action]")?.addEventListener("click", () => {
    onConfirm();
    closeConfirmSheet();
  });
}

function closeConfirmSheet() {
  document.querySelectorAll("[data-confirm-sheet]").forEach((node) => node.remove());
}

function showAddCollectionSheet(product) {
  document.querySelectorAll("[data-add-collection-sheet]").forEach((node) => node.remove());
  document.body.insertAdjacentHTML(
    "beforeend",
    `
      <div class="sheet-backdrop" data-add-collection-sheet></div>
      <section class="bottom-sheet add-collection-sheet" data-add-collection-sheet role="dialog" aria-label="Add to collection">
        <div class="sheet-header">
          <button class="sheet-icon" type="button" data-close-add-collection aria-label="Close">×</button>
          <h2>Add collection</h2>
          <span></span>
        </div>
        <div class="sheet-body">
          <div class="add-product-summary">
            <img src="${product.images[0]}" alt="" />
            <div>
              <span>Picked product</span>
              <strong>${product.shortName}</strong>
            </div>
          </div>

          <p class="eyebrow">Choose existing</p>
          <label class="asset-search collection-choice-search">
            <input type="search" data-collection-choice-search placeholder="Search collections..." />
          </label>
          <div class="collection-choice-list">
            ${collections
              .map(
                (collection) => `
                  <button type="button" data-choose-collection="${collection.id}" data-collection-choice-item data-search="${`${collection.title} ${collection.description}`.toLowerCase()}">
                    <span>${collection.title}</span>
                    <em>${collection.productIds.length} products</em>
                  </button>
                `
              )
              .join("")}
          </div>

          <div class="new-collection-box">
            <button class="primary-cta centered" type="button" data-open-create-from-add>Create new collection</button>
          </div>
        </div>
      </section>
    `
  );

  document.querySelectorAll("[data-close-add-collection]").forEach((button) => {
    button.addEventListener("click", () => closeAddCollectionSheet());
  });

  document.querySelector("[data-collection-choice-search]")?.addEventListener("input", (event) => {
    const query = event.currentTarget.value.trim().toLowerCase();
    document.querySelectorAll("[data-collection-choice-item]").forEach((item) => {
      item.hidden = query && !item.dataset.search.includes(query);
    });
  });

  document.querySelectorAll("[data-choose-collection]").forEach((button) => {
    button.addEventListener("click", () => {
      const collection = collections.find((item) => item.id === button.dataset.chooseCollection);
      showToast("Added", collection?.title || "Collection");
      closeAddCollectionSheet();
    });
  });

  document.querySelector("[data-open-create-from-add]")?.addEventListener("click", () => {
    closeAddCollectionSheet();
    showCreateCollectionSheet(product);
  });
}

function closeAddCollectionSheet() {
  document.querySelectorAll("[data-add-collection-sheet]").forEach((node) => node.remove());
}

function showCreateCollectionSheet(preselectedProduct) {
  document.querySelectorAll("[data-create-collection-sheet]").forEach((node) => node.remove());
  const pickedProducts = pickedProductIds.map(getProduct);
  const preselectedId = preselectedProduct?.id || "";
  document.body.insertAdjacentHTML(
    "beforeend",
    `
      <div class="sheet-backdrop" data-create-collection-sheet></div>
      <section class="bottom-sheet create-collection-sheet" data-create-collection-sheet role="dialog" aria-label="Create collection">
        <div class="sheet-header">
          <button class="sheet-icon" type="button" data-close-create-collection aria-label="Close">×</button>
          <h2>Create collection</h2>
          <span></span>
        </div>
        <div class="sheet-body">
          <label class="collection-form-field">
            <span>Name</span>
            <input type="text" data-new-collection-name required placeholder="e.g. Summer wedding guest edit" />
          </label>

          <div class="picked-product-picker">
            <div class="picker-heading">
              <span>Add products</span>
              <em>Optional · from Picked Products</em>
            </div>
            <div class="picked-product-choice-list">
              ${pickedProducts
                .map(
                  (product) => `
                    <button class="${product.id === preselectedId ? "selected" : ""}" type="button" data-product-choice="${product.id}">
                      <img src="${product.images[0]}" alt="" />
                      <span>
                        <strong>${product.shortName}</strong>
                        <small>Est. ${product.commissionAmount}</small>
                      </span>
                      <i>${product.id === preselectedId ? "Selected" : "Add"}</i>
                    </button>
                  `
                )
                .join("")}
            </div>
          </div>

          <button class="primary-cta centered" type="button" data-submit-new-collection disabled>Create collection</button>
        </div>
      </section>
    `
  );

  const nameInput = document.querySelector("[data-new-collection-name]");
  const submitButton = document.querySelector("[data-submit-new-collection]");

  nameInput?.addEventListener("input", () => {
    submitButton.disabled = !nameInput.value.trim();
  });

  document.querySelectorAll("[data-product-choice]").forEach((button) => {
    button.addEventListener("click", () => {
      const isSelected = button.classList.toggle("selected");
      button.querySelector("i").textContent = isSelected ? "Selected" : "Add";
    });
  });

  document.querySelectorAll("[data-close-create-collection]").forEach((button) => {
    button.addEventListener("click", () => closeCreateCollectionSheet());
  });

  submitButton?.addEventListener("click", () => {
    const name = nameInput.value.trim();
    const selectedCount = document.querySelectorAll("[data-product-choice].selected").length;
    showToast("Created", `${name} · ${selectedCount} products`);
    closeCreateCollectionSheet();
  });
}

function closeCreateCollectionSheet() {
  document.querySelectorAll("[data-create-collection-sheet]").forEach((node) => node.remove());
}

function showToast(message, action) {
  document.querySelector(".app-toast")?.remove();
  document.body.insertAdjacentHTML(
    "beforeend",
    `<div class="app-toast"><strong>${message}</strong><span>${action}</span></div>`
  );
  window.setTimeout(() => document.querySelector(".app-toast")?.remove(), 2200);
}

export function collectionDetailPage({ collectionId }) {
  const collection = collections.find((item) => item.id === collectionId) || collections[0];
  const products = collection.productIds.map(getProduct);

  return pageShell(
    `
      <section class="collection-detail-page">
        <header class="collection-detail-hero">
          <a class="text-back" href="/picks" data-link>Back</a>
          <div class="collection-cover large">
            ${products.slice(0, 2).map((product) => `<img src="${product.images[0]}" alt="" />`).join("")}
          </div>
          <p class="eyebrow">Collection</p>
          <h1>${collection.title}</h1>
        </header>

        <section class="asset-section">
          <div class="section-heading-row">
            <div>
              <p class="eyebrow">Products</p>
              <h2>Create Looks</h2>
            </div>
          </div>
          <div class="best-seller-list">
            ${products
              .map((product) =>
                productListRow(product, {
                  actionLabel: "PROMOTE",
                  meta: `Sold ${product.salesCount}`
                })
              )
              .join("")}
          </div>
        </section>
        <div class="collection-floating-action">
          <button type="button" class="primary-cta" data-promote-collection="${collection.id}">Promote this collection</button>
        </div>
      </section>
    `,
    "picks"
  );
}
