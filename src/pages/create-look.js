import { icons } from "../components/icons.js";
import { pageShell } from "../components/layout.js";
import { collections, getProduct, pickedProductIds, products } from "../data/mock-data.js";
import { navigate } from "../scripts/router.js";

const polishOptions = {
  avatar: ["Aria Avatar", "Studio Model", "Upload Mine"],
  pose: ["Standing", "Walking", "Mirror"],
  scene: ["Garden", "Studio", "Resort"],
  style: ["Soft Romantic", "Editorial", "Clean Try-on"]
};

function parseInitialProducts() {
  const search = typeof window === "undefined" ? "" : window.location.search;
  const params = new URLSearchParams(search);
  const collectionId = params.get("collection");
  const productId = params.get("product");
  const productParam = params.get("products");
  const fromCollection = collections.find((collection) => collection.id === collectionId);

  if (productParam) {
    return productParam.split(",").filter(Boolean).slice(0, 6);
  }

  if (fromCollection) {
    return fromCollection.productIds.slice(0, 4);
  }

  if (productId) {
    const rest = pickedProductIds.filter((id) => id !== productId).slice(0, 2);
    return [productId, ...rest];
  }

  return pickedProductIds.slice(0, 3);
}

function selectedEarn(productIds) {
  const value = productIds.reduce((sum, id) => {
    const product = getProduct(id);
    return sum + parseMoney(product.boostCommissionAmount);
  }, 0);
  return formatMoney(value);
}

function productThumbs(productIds) {
  return productIds
    .map((id) => {
      const product = getProduct(id);
      return `<img src="${product.images[0]}" alt="${product.shortName}" />`;
    })
    .join("");
}

function tryonProductButton(product, selectedZone) {
  const typeLabel = productType(product);
  return `
    <button class="tryon-product-pill ${selectedZone ? "assigned" : ""}" type="button" data-tryon-product="${product.id}" draggable="true">
      <img src="${product.images[0]}" alt="" />
      <span>
        <strong>${product.shortName}</strong>
        <small>${typeLabel} · ${selectedZone ? `Placed in ${selectedZone}` : "Tap or drag to place"}</small>
      </span>
      <em>${product.price}</em>
    </button>
  `;
}

function productType(product) {
  const text = `${product.category || ""} ${product.name || ""} ${product.shortName || ""}`.toLowerCase();
  if (text.includes("skirt") || text.includes("pant") || text.includes("short")) return "Bottoms";
  if (text.includes("dress") || text.includes("jumpsuit")) return "Dresses";
  return "Tops";
}

function productTypeKey(product) {
  return productType(product).toLowerCase();
}

function selectedProductGroups(productIds, placements) {
  const groups = [
    ["Tops", "tops"],
    ["Bottoms", "bottoms"],
    ["Dresses", "dresses"]
  ];
  return groups
    .map(([label, key]) => {
      const groupProducts = productIds.map(getProduct).filter((product) => productTypeKey(product) === key);
      return `
        <div class="tryon-product-group">
          <div class="tryon-product-group-title">
            <span>${label}</span>
            <em>${groupProducts.length}</em>
          </div>
          ${
            groupProducts.length
              ? groupProducts
                  .map((product) => {
                    const zone = placements.upper === product.id ? "upper" : placements.lower === product.id ? "lower" : "";
                    return tryonProductButton(product, zone);
                  })
                  .join("")
              : `<div class="empty-product-group">No ${label.toLowerCase()} selected</div>`
          }
        </div>
      `;
    })
    .join("");
}

function zoneProduct(productId, zone) {
  if (!productId) {
    return `
      <div class="drop-zone-empty">
        <strong>${zone === "upper" ? "Upper body" : "Lower body"}</strong>
        <span>Tap or drag product here</span>
      </div>
    `;
  }

  const product = getProduct(productId);
  return `
    <div class="drop-zone-product">
      <img src="${product.images[0]}" alt="" />
      <span>${product.shortName}</span>
    </div>
  `;
}

function savedLookCard(look) {
  return `
    <article class="saved-look-card saved-ai-look-card" data-saved-look="${look.id}">
      <div class="saved-look-media">
        ${productThumbs([look.upper, look.lower].filter(Boolean))}
      </div>
      <div>
        <strong>${look.name}</strong>
        <span>${look.upper ? "Upper set" : "Upper open"} · ${look.lower ? "Lower set" : "Lower open"} · ${look.polish.style}</span>
        <em>Est. Earn ${selectedEarn([look.upper, look.lower].filter(Boolean))}</em>
      </div>
      <div class="saved-look-actions">
        <button type="button" data-redesign-look="${look.id}">Redesign</button>
        <button type="button" data-delete-look="${look.id}">Delete</button>
      </div>
    </article>
  `;
}

export function createLookPage() {
  const initialProductIds = parseInitialProducts();

  return pageShell(
    `
      <section class="create-look-page look-studio-page" data-create-look-page>
        <div class="top-bar compact-top-bar">
          <a class="icon-button" href="/create#looks" data-link aria-label="Back">${icons.back}</a>
          <h1>AI Tryon Looks</h1>
          <span></span>
        </div>

        <section class="look-studio-workspace">
          <div class="look-demo-panel">
            <div class="section-heading-row">
              <div>
                <p class="eyebrow">Live look demo</p>
                <h2>Place products by body area</h2>
              </div>
              <button type="button" data-clear-look>Reset demo</button>
            </div>

            <div class="look-model-stage">
              <div class="model-figure">
                <span class="model-head"></span>
                <span class="model-body"></span>
                <span class="model-leg left"></span>
                <span class="model-leg right"></span>
              </div>
              <div class="look-drop-zone upper-zone" data-drop-zone="upper">
                ${zoneProduct(initialProductIds[0], "upper")}
              </div>
              <div class="look-drop-zone lower-zone" data-drop-zone="lower">
                ${zoneProduct(initialProductIds[1], "lower")}
              </div>
              <span class="stage-label">AI generated try-on preview</span>
            </div>

            <div class="look-stage-actions">
              <button class="smart-polish-action" type="button" data-polish-look>${icons.sparkle}<span>Polish</span></button>
              <button type="button" data-save-look>Save look</button>
            </div>
          </div>

          <aside class="selected-tryon-panel">
            <div class="section-heading-row">
              <div>
                <p class="eyebrow">Selected Try-on Products</p>
                <h2>Tap or drag</h2>
              </div>
              <button type="button" data-open-add-products>Add products</button>
            </div>
            <div class="selected-tryon-products" data-selected-products>
              ${selectedProductGroups(initialProductIds, {
                upper: initialProductIds[0] || "",
                lower: initialProductIds[1] || ""
              })}
            </div>
          </aside>
        </section>

        <div class="tryon-bottom-action">
          <button class="saved-looks-trigger" type="button" data-open-saved-looks><b data-final-count>0</b> AI LOOKS</button>
          <button type="button" data-generate-tryon disabled>GENERATE TRY-ON MATERIALS</button>
        </div>
      </section>
    `,
    "create"
  );
}

export function bindCreateLookInteractions(root) {
  const selectedIds = new Set(parseInitialProducts());
  const placements = {
    upper: parseInitialProducts()[0] || "",
    lower: parseInitialProducts()[1] || ""
  };
  const savedLooks = [];
  const polish = {
    avatar: polishOptions.avatar[0],
    pose: polishOptions.pose[0],
    scene: polishOptions.scene[0],
    style: polishOptions.style[0]
  };
  let draggedProduct = "";

  const renderSelectedProducts = () => {
    root.querySelector("[data-selected-products]").innerHTML = selectedProductGroups([...selectedIds], placements);
    bindProductButtons();
  };

  const renderZones = () => {
    root.querySelector('[data-drop-zone="upper"]').innerHTML = zoneProduct(placements.upper, "upper");
    root.querySelector('[data-drop-zone="lower"]').innerHTML = zoneProduct(placements.lower, "lower");
    renderSelectedProducts();
  };

  const placeProduct = (productId) => {
    if (!placements.upper) {
      placements.upper = productId;
    } else if (!placements.lower && placements.upper !== productId) {
      placements.lower = productId;
    } else if (placements.upper === productId) {
      placements.upper = "";
    } else if (placements.lower === productId) {
      placements.lower = "";
    } else {
      placements.upper = productId;
    }
    renderZones();
  };

  const placeProductInZone = (productId, zone) => {
    const otherZone = zone === "upper" ? "lower" : "upper";
    if (placements[otherZone] === productId) {
      placements[otherZone] = "";
    }
    placements[zone] = productId;
    selectedIds.add(productId);
    renderZones();
  };

  const renderSavedLooks = () => {
    root.querySelector("[data-final-count]").textContent = String(savedLooks.length);
    root.querySelector("[data-generate-tryon]").disabled = savedLooks.length === 0;
  };

  const openSavedLooksSheet = () => {
    showSavedLooksSheet(savedLooks, {
      onDelete: (lookId) => {
        const index = savedLooks.findIndex((look) => look.id === lookId);
        if (index >= 0) {
          savedLooks.splice(index, 1);
          renderSavedLooks();
          openSavedLooksSheet();
        }
      },
      onRedesign: (lookId) => {
        const look = savedLooks.find((item) => item.id === lookId);
        if (!look) return;
        placements.upper = look.upper;
        placements.lower = look.lower;
        Object.assign(polish, look.polish);
        renderZones();
        closeSavedLooksSheet();
        showToast("Loaded for redesign", look.name);
      }
    });
  };

  const bindProductButtons = () => {
    root.querySelectorAll("[data-tryon-product]").forEach((button) => {
      button.addEventListener("click", () => placeProduct(button.dataset.tryonProduct));
      button.addEventListener("dragstart", (event) => {
        draggedProduct = button.dataset.tryonProduct;
        event.dataTransfer?.setData("text/plain", draggedProduct);
      });
    });
  };

  root.querySelectorAll("[data-drop-zone]").forEach((zone) => {
    zone.addEventListener("dragover", (event) => {
      event.preventDefault();
      zone.classList.add("drag-over");
    });
    zone.addEventListener("dragleave", () => {
      zone.classList.remove("drag-over");
    });
    zone.addEventListener("drop", (event) => {
      event.preventDefault();
      zone.classList.remove("drag-over");
      const productId = event.dataTransfer?.getData("text/plain") || draggedProduct;
      if (productId) {
        placeProductInZone(productId, zone.dataset.dropZone);
      }
    });
  });

  root.querySelector("[data-clear-look]")?.addEventListener("click", () => {
    placements.upper = "";
    placements.lower = "";
    renderZones();
    showToast("Demo reset", "Design next look");
  });

  root.querySelector("[data-save-look]")?.addEventListener("click", () => {
    if (!placements.upper && !placements.lower) {
      showToast("Place a product", "Upper or lower");
      return;
    }
    savedLooks.push({
      id: `look-${Date.now()}`,
      name: `Look ${savedLooks.length + 1}`,
      upper: placements.upper,
      lower: placements.lower,
      polish: { ...polish }
    });
    placements.upper = "";
    placements.lower = "";
    renderZones();
    renderSavedLooks();
    showToast("Saved to AI LOOKS", `Look ${savedLooks.length}`);
  });

  root.querySelector("[data-polish-look]")?.addEventListener("click", () => showPolishSheet(polish));

  root.querySelector("[data-open-saved-looks]")?.addEventListener("click", () => openSavedLooksSheet());

  root.querySelector("[data-open-add-products]")?.addEventListener("click", () => {
    showAddProductsSheet({
      selectedIds,
      onAdd: (ids) => {
        ids.forEach((id) => selectedIds.add(id));
        renderSelectedProducts();
        showToast("Added products", `${ids.length} selected`);
      }
    });
  });

  root.querySelector("[data-generate-tryon]")?.addEventListener("click", () => {
    const firstLook = savedLooks[0];
    const products = [firstLook?.upper, firstLook?.lower].filter(Boolean);
    savedLooks.splice(0, savedLooks.length);
    renderSavedLooks();
    showToast("Try-on materials generating", "AI CONTENT");
    showLookFloating(products);
  });

  renderZones();
  renderSavedLooks();
}

function showPolishSheet(polish) {
  document.querySelectorAll("[data-polish-sheet]").forEach((node) => node.remove());
  document.body.insertAdjacentHTML(
    "beforeend",
    `
      <div class="sheet-backdrop" data-polish-sheet></div>
      <section class="bottom-sheet polish-sheet" data-polish-sheet role="dialog" aria-label="Polish look">
        <div class="sheet-header">
          <button class="sheet-icon" type="button" data-close-polish aria-label="Close">×</button>
          <h2>Polish Look</h2>
          <span></span>
        </div>
        <div class="sheet-body">
          <div class="ai-polish-note">
            <strong>AI generated try-on</strong>
            <p>Set avatar, pose, scene, and style. MUSELAND will generate final try-on materials from your saved looks.</p>
          </div>
          ${Object.entries(polishOptions)
            .map(
              ([group, values]) => `
                <div class="polish-group">
                  <span>${group}</span>
                  <div>
                    ${values
                      .map(
                        (value) => `
                          <button class="${polish[group] === value ? "active" : ""}" type="button" data-polish-option="${group}" data-value="${value}">
                            ${value}
                          </button>
                        `
                      )
                      .join("")}
                  </div>
                </div>
              `
            )
            .join("")}
          <button class="primary-cta centered" type="button" data-apply-polish>Apply polish</button>
        </div>
      </section>
    `
  );

  document.querySelectorAll("[data-close-polish]").forEach((button) => {
    button.addEventListener("click", () => closePolishSheet());
  });

  document.querySelectorAll("[data-polish-option]").forEach((button) => {
    button.addEventListener("click", () => {
      polish[button.dataset.polishOption] = button.dataset.value;
      const group = button.closest(".polish-group");
      group.querySelectorAll("[data-polish-option]").forEach((item) => item.classList.toggle("active", item === button));
    });
  });

  document.querySelector("[data-apply-polish]")?.addEventListener("click", () => {
    showToast("Polish applied", `${polish.avatar} · ${polish.style}`);
    closePolishSheet();
  });
}

function closePolishSheet() {
  document.querySelectorAll("[data-polish-sheet]").forEach((node) => node.remove());
}

function showSavedLooksSheet(savedLooks, handlers) {
  document.querySelectorAll("[data-saved-looks-sheet]").forEach((node) => node.remove());
  document.body.insertAdjacentHTML(
    "beforeend",
    `
      <div class="sheet-backdrop" data-saved-looks-sheet></div>
      <section class="bottom-sheet saved-looks-sheet" data-saved-looks-sheet role="dialog" aria-label="Saved AI looks">
        <div class="sheet-header">
          <button class="sheet-icon" type="button" data-close-saved-looks aria-label="Close">×</button>
          <h2>${savedLooks.length} AI Looks</h2>
          <span></span>
        </div>
        <div class="sheet-body">
          <div class="saved-look-list sheet-saved-look-list">
            ${
              savedLooks.length
                ? savedLooks.map(savedLookCard).join("")
                : `<div class="empty-saved-look">No AI looks yet. Save a design from the live look demo first.</div>`
            }
          </div>
        </div>
      </section>
    `
  );

  document.querySelectorAll("[data-close-saved-looks]").forEach((button) => {
    button.addEventListener("click", () => closeSavedLooksSheet());
  });

  document.querySelectorAll("[data-delete-look]").forEach((button) => {
    button.addEventListener("click", () => handlers.onDelete(button.dataset.deleteLook));
  });

  document.querySelectorAll("[data-redesign-look]").forEach((button) => {
    button.addEventListener("click", () => handlers.onRedesign(button.dataset.redesignLook));
  });
}

function closeSavedLooksSheet() {
  document.querySelectorAll("[data-saved-looks-sheet]").forEach((node) => node.remove());
}

function showAddProductsSheet({ selectedIds, onAdd }) {
  document.querySelectorAll("[data-add-products-sheet]").forEach((node) => node.remove());
  const typeFilters = ["All", "Tops", "Bottoms", "Dresses"];
  const sourceProducts = {
    picks: pickedProductIds.map(getProduct),
    all: products
  };
  const productChoice = (product) => `
    <button class="${selectedIds.has(product.id) ? "selected" : ""}" type="button" data-add-product-choice="${product.id}" data-product-type="${productType(product)}" data-search="${`${product.name} ${product.shortName} ${productType(product)} ${product.tag || ""}`.toLowerCase()}">
      <img src="${product.images[0]}" alt="" />
      <span>
        <strong>${product.shortName}</strong>
        <small>${productType(product)} · ${product.price}</small>
      </span>
      <i>${selectedIds.has(product.id) ? "Selected" : "Add"}</i>
    </button>
  `;

  document.body.insertAdjacentHTML(
    "beforeend",
    `
      <div class="sheet-backdrop" data-add-products-sheet></div>
      <section class="bottom-sheet add-products-sheet" data-add-products-sheet role="dialog" aria-label="Add products">
        <div class="sheet-header">
          <button class="sheet-icon" type="button" data-close-add-products aria-label="Close">×</button>
          <h2>Add products</h2>
          <span></span>
        </div>
        <div class="sheet-body">
          <div class="add-products-tabs" aria-label="Product sources">
            <button class="active" type="button" data-add-products-tab="my-picks">My Picks</button>
            <button type="button" data-add-products-tab="my-collection">My Collection</button>
            <button type="button" data-add-products-tab="all-products">All Products</button>
          </div>

          <section class="add-products-pane active" data-add-products-pane="my-picks">
            <label class="asset-search"><input type="search" data-product-picker-search placeholder="Search my picks..." /></label>
            <div class="product-type-filter">
              ${typeFilters.map((item, index) => `<button class="${index === 0 ? "active" : ""}" type="button" data-product-type-filter="${item}">${item}</button>`).join("")}
            </div>
            <div class="product-picker-list">${sourceProducts.picks.map(productChoice).join("")}</div>
          </section>

          <section class="add-products-pane" data-add-products-pane="my-collection">
            <div class="collection-picker-list">
              ${collections
                .map(
                  (collection) => `
                    <button type="button" data-add-collection-products="${collection.id}">
                      <span>
                        <strong>${collection.title}</strong>
                        <small>${collection.productIds.length} products · one tap add</small>
                      </span>
                      <i>Add all</i>
                    </button>
                  `
                )
                .join("")}
            </div>
          </section>

          <section class="add-products-pane" data-add-products-pane="all-products">
            <label class="asset-search"><input type="search" data-product-picker-search placeholder="Search all products..." /></label>
            <div class="product-type-filter">
              ${typeFilters.map((item, index) => `<button class="${index === 0 ? "active" : ""}" type="button" data-product-type-filter="${item}">${item}</button>`).join("")}
            </div>
            <div class="product-picker-list">${sourceProducts.all.map(productChoice).join("")}</div>
          </section>

          <button class="primary-cta centered" type="button" data-apply-add-products>ADD SELECTED</button>
        </div>
      </section>
    `
  );

  const stagedIds = new Set();

  const activePane = () => document.querySelector(".add-products-pane.active");
  const applyPickerFilters = (pane) => {
    const query = pane.querySelector("[data-product-picker-search]")?.value.trim().toLowerCase() || "";
    const type = pane.querySelector("[data-product-type-filter].active")?.dataset.productTypeFilter || "All";
    pane.querySelectorAll("[data-add-product-choice]").forEach((button) => {
      const matchesQuery = !query || button.dataset.search.includes(query);
      const matchesType = type === "All" || button.dataset.productType === type;
      button.hidden = !(matchesQuery && matchesType);
    });
  };

  document.querySelectorAll("[data-close-add-products]").forEach((button) => {
    button.addEventListener("click", () => closeAddProductsSheet());
  });

  document.querySelectorAll("[data-add-products-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-add-products-tab]").forEach((item) => item.classList.toggle("active", item === button));
      document.querySelectorAll("[data-add-products-pane]").forEach((pane) => {
        pane.classList.toggle("active", pane.dataset.addProductsPane === button.dataset.addProductsTab);
      });
    });
  });

  document.querySelectorAll("[data-product-picker-search]").forEach((input) => {
    input.addEventListener("input", () => applyPickerFilters(input.closest(".add-products-pane")));
  });

  document.querySelectorAll("[data-product-type-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      const pane = button.closest(".add-products-pane");
      pane.querySelectorAll("[data-product-type-filter]").forEach((item) => item.classList.toggle("active", item === button));
      applyPickerFilters(pane);
    });
  });

  document.querySelectorAll("[data-add-product-choice]").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.addProductChoice;
      const selected = button.classList.toggle("selected");
      if (selected) {
        stagedIds.add(id);
      } else {
        stagedIds.delete(id);
      }
      button.querySelector("i").textContent = selected || selectedIds.has(id) ? "Selected" : "Add";
    });
  });

  document.querySelectorAll("[data-add-collection-products]").forEach((button) => {
    button.addEventListener("click", () => {
      const collection = collections.find((item) => item.id === button.dataset.addCollectionProducts);
      if (!collection) return;
      onAdd(collection.productIds);
      closeAddProductsSheet();
    });
  });

  document.querySelector("[data-apply-add-products]")?.addEventListener("click", () => {
    onAdd([...stagedIds]);
    closeAddProductsSheet();
  });

  applyPickerFilters(activePane());
}

function closeAddProductsSheet() {
  document.querySelectorAll("[data-add-products-sheet]").forEach((node) => node.remove());
}

function showLookFloating(productIds) {
  document.querySelector("[data-look-floating]")?.remove();
  const firstProduct = getProduct(productIds[0] || pickedProductIds[0]);
  document.body.insertAdjacentHTML(
    "beforeend",
    `
      <button class="look-floating-window" type="button" data-look-floating>
        <img src="${firstProduct.images[0]}" alt="" />
        <span>
          <strong>AI CONTENT</strong>
          <small>Generating try-on materials</small>
        </span>
      </button>
    `
  );
  document.querySelector("[data-look-floating]")?.addEventListener("click", () => {
    document.querySelector("[data-look-floating]")?.remove();
    navigate("/create#looks");
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
