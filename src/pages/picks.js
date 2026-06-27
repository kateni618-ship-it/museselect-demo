import { collections, getProduct, pickedProductIds } from "../data/mock-data.js";
import { pageShell } from "../components/layout.js";
import { productListRow } from "../components/product-card.js";
import { navigate } from "../scripts/router.js";

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
                  tryonLabel: "+ Try-on look",
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
      </section>
    `,
    "picks"
  );
}

export function bindPicksInteractions(root) {
  const tryonCart = new Set();
  const showCurrentTryonCartFloating = () => {
    showTryonCartFloating([...tryonCart], {
      onOpen: () => document.querySelector("[data-tryon-cart-floating]")?.remove(),
      onRemove: removeTryonProduct,
      onClose: showCurrentTryonCartFloating
    });
  };
  const tabs = root.querySelectorAll("[data-picks-tab]");
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

  root.querySelectorAll("[data-tryon-product]").forEach((button) => {
    button.addEventListener("click", () => {
      const productId = button.dataset.tryonProduct;
      if (tryonCart.has(productId)) {
        tryonCart.delete(productId);
      } else {
        tryonCart.add(productId);
      }
      syncTryonButtons();
      showCurrentTryonCartFloating();
    });
  });

  function syncTryonButtons() {
    root.querySelectorAll("[data-tryon-product]").forEach((button) => {
      const isSelected = tryonCart.has(button.dataset.tryonProduct);
      button.classList.toggle("selected", isSelected);
      button.textContent = isSelected ? "In try-on" : "+ Try-on look";
    });
  }

  function removeTryonProduct(productId) {
    tryonCart.delete(productId);
    syncTryonButtons();
  }

  root.querySelectorAll("[data-create-look-collection]").forEach((button) => {
    button.addEventListener("click", () => {
      navigate(`/create-look?collection=${button.dataset.createLookCollection}`);
    });
  });

  root.querySelectorAll("[data-asset-search]").forEach((input) => {
    input.addEventListener("input", () => applyAssetFilters(input.closest(".asset-section")));
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

}

function applyAssetFilters(section) {
  const query = section.querySelector("[data-asset-search]")?.value.trim().toLowerCase() || "";

  section.querySelectorAll("[data-filter-item]").forEach((item) => {
    const matchesQuery = !query || item.dataset.search.includes(query);
    item.hidden = !matchesQuery;
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

function showTryonCartFloating(productIds, handlers = {}) {
  document.querySelector("[data-tryon-cart-floating]")?.remove();
  document.querySelectorAll("[data-tryon-cart-sheet]").forEach((node) => node.remove());

  if (!productIds.length) {
    showToast("Removed", "Try-on cart");
    return;
  }

  const firstProduct = getProduct(productIds[0]);
  document.body.insertAdjacentHTML(
    "beforeend",
    `
      <button class="tryon-cart-floating" type="button" data-tryon-cart-floating>
        <img src="${firstProduct.images[0]}" alt="" />
        <span>
          <strong>${productIds.length} try-on product${productIds.length > 1 ? "s" : ""}</strong>
          <small>Tap to start AI Tryon Looks</small>
        </span>
      </button>
    `
  );

  document.querySelector("[data-tryon-cart-floating]")?.addEventListener("click", () => {
    handlers.onOpen?.();
    showTryonCartSheet(productIds, handlers);
  });
  showToast("Added to try-on cart", `${productIds.length} selected`);
}

function showTryonCartSheet(productIds, handlers = {}) {
  document.querySelectorAll("[data-tryon-cart-sheet]").forEach((node) => node.remove());
  const activeIds = [...productIds];
  const renderItems = () => {
    const list = document.querySelector("[data-tryon-cart-items]");
    const startButton = document.querySelector("[data-start-tryon]");
    if (!list) return;
    if (!activeIds.length) {
      list.innerHTML = `<div class="empty-saved-look">No products in try-on cart.</div>`;
      if (startButton) startButton.disabled = true;
      return;
    }
    list.innerHTML = activeIds
      .map((id) => {
        const product = getProduct(id);
        return `
          <article>
            <img src="${product.images[0]}" alt="" />
            <span>
              <strong>${product.shortName}</strong>
              <small>${product.price} · Earn up to ${product.boostCommissionRate}</small>
            </span>
            <button class="danger-row-action" type="button" data-remove-tryon-cart-item="${product.id}">Remove</button>
          </article>
        `;
      })
      .join("");
    if (startButton) startButton.disabled = false;
    document.querySelectorAll("[data-remove-tryon-cart-item]").forEach((button) => {
      button.addEventListener("click", () => {
        const id = button.dataset.removeTryonCartItem;
        const index = activeIds.indexOf(id);
        if (index >= 0) activeIds.splice(index, 1);
        handlers.onRemove?.(id);
        renderItems();
      });
    });
  };

  document.body.insertAdjacentHTML(
    "beforeend",
    `
      <div class="sheet-backdrop" data-tryon-cart-sheet></div>
      <section class="bottom-sheet tryon-cart-sheet" data-tryon-cart-sheet role="dialog" aria-label="Try-on cart">
        <div class="sheet-header">
          <button class="sheet-icon" type="button" data-close-tryon-cart aria-label="Close">×</button>
          <h2>Try-on Cart</h2>
          <span></span>
        </div>
        <div class="sheet-body">
          <div class="ai-polish-note">
            <strong>For AI content only</strong>
            <p>This cart is not checkout. It sends selected products into AI Tryon Looks.</p>
          </div>
          <div class="tryon-cart-items" data-tryon-cart-items>
          </div>
          <button class="primary-cta centered" type="button" data-start-tryon>START TRY-ON</button>
        </div>
      </section>
    `
  );

  document.querySelectorAll("[data-close-tryon-cart]").forEach((button) => {
    button.addEventListener("click", () => {
      closeTryonCartSheet();
      handlers.onClose?.(activeIds);
    });
  });

  document.querySelector("[data-start-tryon]")?.addEventListener("click", () => {
    closeTryonCartSheet();
    document.querySelector("[data-tryon-cart-floating]")?.remove();
    navigate(`/create-look?products=${activeIds.join(",")}`);
  });

  renderItems();
}

function closeTryonCartSheet() {
  document.querySelectorAll("[data-tryon-cart-sheet]").forEach((node) => node.remove());
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

export function externalCollectionPage({ collectionId }) {
  const collection = collections.find((item) => item.id === collectionId) || collections[0];
  const products = collection.productIds.map(getProduct);

  return pageShell(
    `
      <section class="external-collection-page">
        <header class="external-shelf-hero">
          <a class="text-back" href="/picks/collections/${collection.id}" data-link>Back</a>
          <p class="eyebrow">Creator shelf</p>
          <h1>${collection.title}</h1>
          <div class="external-creator">
            <img src="${selectedCreator.avatar}" alt="" />
            <span>Curated by Aria</span>
          </div>
        </header>

        <div class="external-product-list">
          ${products
            .map(
              (product) => `
                <article>
                  <img src="${product.images[0]}" alt="${product.shortName}" />
                  <div>
                    <strong>${product.shortName}</strong>
                    <span>${product.price}</span>
                    <em>Earn up to ${product.boostCommissionRate}</em>
                  </div>
                  <button type="button" data-promote-product="${product.id}">Shop</button>
                </article>
              `
            )
            .join("")}
        </div>
      </section>
    `,
    "picks"
  );
}
