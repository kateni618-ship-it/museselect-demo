import {
  avatars,
  generationModes,
  patterns,
  silhouettes
} from "../data/mock-data.js";
import {
  creationState,
  getAllPatterns,
  getSelectedAvatar,
  getSelectedMode,
  getSelectedPattern,
  getSelectedSilhouette,
  isCreationReady
} from "../data/creation-store.js";
import { icons } from "../components/icons.js";
import { pageShell } from "../components/layout.js";
import { withBasePath } from "../scripts/base-path.js";
import { navigate } from "../scripts/router.js";

const steps = [
  {
    id: "silhouette",
    number: 1,
    eyebrow: "Silhouette",
    title: "Pick Silhouette"
  },
  {
    id: "pattern",
    number: 2,
    eyebrow: "Pattern Style",
    title: "Pick Pattern"
  },
  {
    id: "avatar",
    number: 3,
    eyebrow: "Avatar",
    title: "Avatar 1"
  },
  {
    id: "create",
    number: 4,
    eyebrow: "Pattern",
    title: "Start Creation"
  }
];

function stepPreview(stepId) {
  if (stepId === "silhouette") return getSelectedSilhouette()?.image;
  if (stepId === "pattern") return getSelectedPattern()?.image;
  if (stepId === "avatar") return getSelectedAvatar()?.image;
  return null;
}

function stepTitle(step) {
  if (step.id === "silhouette") return getSelectedSilhouette()?.name || step.title;
  if (step.id === "pattern") return getSelectedPattern()?.name || step.title;
  if (step.id === "avatar") return getSelectedAvatar()?.name || step.title;
  return step.title;
}

function hubCard(step) {
  const preview = stepPreview(step.id);
  return `
    <a class="creation-step-card" href="/museland/${step.id}" data-link>
      <span class="step-number">${step.number}</span>
      <span class="step-copy">
        <span>${step.eyebrow}</span>
        <strong>${stepTitle(step)}</strong>
      </span>
      <span class="step-arrow" aria-hidden="true">›</span>
      <span class="step-thumb ${preview ? "filled" : ""}">
        ${preview ? `<img src="${preview}" alt="" />` : icons.sparkle}
      </span>
    </a>
  `;
}

function hubContent() {
  return `
    <section class="museland-hub">
      <header class="museland-header museland-design-header">
        <a class="icon-button" href="/create#museland" data-link aria-label="Back">${icons.back}</a>
        <h1>MUSELAND</h1>
        <span></span>
      </header>

      <section class="museland-value-panel">
        <span>BASE COMMISSION + 3% ROYALTY</span>
        <h2>Customize your own dress.</h2>
        <p>Design the silhouette and print. Platform creators can sell your dress, and you earn extra upside.</p>
      </section>

      <section class="silhouette-pick-section">
        <div class="section-heading-row">
          <div>
            <h2>Choose a silhouette</h2>
          </div>
        </div>
        <div class="silhouette-choice-grid">
          ${silhouettes
            .map(
              (item) => `
                <button class="silhouette-choice-card ${creationState.silhouetteId === item.id ? "selected" : ""}" type="button" data-choose-silhouette="${item.id}">
                  <span class="white-dress-preview">
                    <img src="${item.image}" alt="" />
                  </span>
                  <strong>${item.name}</strong>
                  <small>${item.category}</small>
                  <em>DESIGN</em>
                </button>
              `
            )
            .join("")}
        </div>
      </section>
    </section>
  `;
}

function selectedSilhouettePreview() {
  const silhouette = getSelectedSilhouette() || silhouettes[0];
  const pattern = getSelectedPattern();
  return `
    <div class="pattern-dress-preview">
      <span>Try-on silhouette</span>
      <div class="white-tryon-stage">
        <div class="white-dress-figure">
          <span class="white-dress-head"></span>
          <span class="white-dress-body"></span>
          <span class="white-dress-skirt"></span>
          <span class="white-dress-leg left"></span>
          <span class="white-dress-leg right"></span>
        </div>
      </div>
      <strong>${silhouette.name}</strong>
      <p><b>${pattern.name}</b> · ${pattern.tag}</p>
      <button type="button" data-shuffle-pattern>Change print</button>
      <button class="polish-current-print" type="button" data-polish-current-pattern ${creationState.patternId ? "" : "disabled"}>Polish Print</button>
    </div>
  `;
}

function sheetShell(stepId, title, body) {
  return `
    <div class="sheet-backdrop" data-close-sheet></div>
    <section class="bottom-sheet" aria-label="${title}">
      <header class="sheet-header">
        <a class="sheet-icon" href="/museland" data-link aria-label="Back">${icons.back}</a>
        <h2>${title}</h2>
        <a class="sheet-icon close" href="/museland" data-link aria-label="Close">×</a>
      </header>
      <div class="sheet-body ${stepId}-sheet">
        ${body}
      </div>
    </section>
  `;
}

function silhouetteSheet() {
  return sheetShell(
    "silhouette",
    "Step 1 : Pick Silhouette",
    `
      <div class="selection-grid">
        ${silhouettes
          .map(
            (item) => `
              <article class="selection-card ${creationState.silhouetteId === item.id ? "selected" : ""}">
                <img src="${item.image}" alt="${item.name}" />
                <div>
                  <strong>${item.name}</strong>
                  <button type="button" data-select-silhouette="${item.id}">Pick</button>
                </div>
              </article>
            `
          )
          .join("")}
      </div>
    `
  );
}

function patternDesignPage() {
  const tabItems = [
    ["socialTrend", "Social Trend"],
    ["bestSeller", "Bestseller"]
  ];
  const activePatternTab = tabItems.some(([id]) => id === creationState.patternTab) ? creationState.patternTab : "socialTrend";
  const activeItems = patterns[activePatternTab];
  const savedDesigns = creationState.savedDesigns;
  const countByPattern = savedDesigns.reduce((counts, design) => {
    counts[design.patternId] = (counts[design.patternId] || 0) + 1;
    return counts;
  }, {});
  return `
    <section class="museland-pattern-page">
      <header class="top-bar">
        <a class="icon-button" href="/museland" data-link aria-label="Back">${icons.back}</a>
        <h1>Design Print</h1>
        <span class="top-spacer" aria-hidden="true"></span>
      </header>

      <div class="pattern-design-layout">
        ${selectedSilhouettePreview()}
        <section class="pattern-design-panel">
          <p class="eyebrow">Print Studio</p>
          <h2>Try on a print style.</h2>
          <div class="pattern-tabs compact">
            ${tabItems
              .map(
                ([id, label]) => `
                  <button class="${activePatternTab === id ? "active" : ""}" type="button" data-pattern-tab="${id}">
                    ${label}
                  </button>
                `
              )
              .join("")}
          </div>
          ${
            activeItems.length
              ? `<div class="pattern-choice-list">
                  ${activeItems
                    .map(
                      (item) => `
                        <article class="pattern-choice-card ${creationState.patternId === item.id ? "selected" : ""}">
                          <img src="${item.image}" alt="${item.name}" />
                          <span>
                            <strong>${item.name}</strong>
                            <small>${item.tag}</small>
                          </span>
                          ${countByPattern[item.id] ? `<em>+${countByPattern[item.id]}</em>` : ""}
                          <div>
                            <button type="button" data-tryon-pattern="${item.id}">Try on</button>
                          </div>
                        </article>
                      `
                    )
                    .join("")}
                </div>`
              : ""
          }
        </section>
      </div>

      <div class="creation-fixed-action">
        <button class="saved-looks-trigger saved-designs-trigger" type="button" data-open-saved-designs><b>${savedDesigns.length}</b> DESIGNS</button>
        <button class="primary-cta centered" type="button" data-generate-product ${savedDesigns.length ? "" : "disabled"}>
          Generate Product Images
        </button>
      </div>
    </section>
  `;
}

function avatarSheet() {
  return sheetShell(
    "avatar",
    "Step3 : Pick Avatar",
    `
      <div class="avatar-list">
        ${avatars
          .map(
            (item) => `
              <article class="avatar-card ${creationState.avatarId === item.id ? "selected" : ""}">
                <img src="${item.image}" alt="${item.name}" />
                <div>
                  <strong>${item.name}</strong>
                  <span>${item.persona}</span>
                </div>
                <button type="button" data-select-avatar="${item.id}">Pick</button>
              </article>
            `
          )
          .join("")}
      </div>
    `
  );
}

function createSheet() {
  const selectedMode = getSelectedMode();
  return sheetShell(
    "create",
    "Step4 : Start Creation",
    `
      <label class="prompt-label" for="design-prompt">Design Idea</label>
      <textarea id="design-prompt" data-design-prompt>${creationState.prompt}</textarea>

      <label class="prompt-label" for="generation-mode">Design Mode</label>
      <select id="generation-mode" data-generation-mode>
        ${generationModes
          .map(
            (mode) => `
              <option value="${mode.id}" ${creationState.mode === mode.id ? "selected" : ""}>${mode.name}</option>
            `
          )
          .join("")}
      </select>
      <p class="mode-description">${selectedMode.description}</p>

      <button class="primary-cta centered" type="button" data-start-creation ${isCreationReady() ? "" : "disabled"}>
        Start Creation
      </button>
    `
  );
}

function activeSheet(stepId) {
  if (stepId === "pattern") return "";
  if (stepId === "silhouette") return silhouetteSheet();
  if (stepId === "avatar") return avatarSheet();
  if (stepId === "create") return createSheet();
  return "";
}

function completionModal() {
  if (!creationState.complete) return "";
  return `
    <div class="completion-backdrop"></div>
    <section class="completion-modal" aria-label="Creation complete">
      <div class="completion-mark">${icons.sparkle}</div>
      <p class="eyebrow">Creation Complete</p>
      <h2>Your product design is ready.</h2>
      <p>
        Product assets, looks, and publishing details are ready for review in
        your creation detail page.
      </p>
      <button class="primary-cta centered" type="button" data-close-completion>View Result</button>
    </section>
  `;
}

export function muselandPage({ stepId } = {}) {
  const content = stepId === "pattern" ? patternDesignPage() : `${hubContent()}${activeSheet(stepId)}${completionModal()}`;
  return pageShell(content, "create");
}

export function bindMuselandInteractions(root) {
  root.querySelectorAll("[data-select-silhouette]").forEach((button) => {
    button.addEventListener("click", () => {
      creationState.silhouetteId = button.dataset.selectSilhouette;
      navigate("/museland");
    });
  });

  root.querySelectorAll("[data-choose-silhouette]").forEach((button) => {
    button.addEventListener("click", () => {
      creationState.silhouetteId = button.dataset.chooseSilhouette;
      navigate("/museland/pattern");
    });
  });

  root.querySelectorAll("[data-select-pattern]").forEach((button) => {
    button.addEventListener("click", () => {
      creationState.patternId = button.dataset.selectPattern;
      navigate("/museland/pattern");
    });
  });

  root.querySelectorAll("[data-use-pattern]").forEach((button) => {
    button.addEventListener("click", () => savePatternDesign(button.dataset.usePattern));
  });

  root.querySelectorAll("[data-tryon-pattern]").forEach((button) => {
    button.addEventListener("click", () => {
      creationState.patternId = button.dataset.tryonPattern;
      navigate("/museland/pattern");
    });
  });

  root.querySelector("[data-polish-current-pattern]")?.addEventListener("click", () => {
    if (!creationState.patternId) return;
    showPolishPatternSheet(creationState.patternId);
  });

  root.querySelector("[data-shuffle-pattern]")?.addEventListener("click", () => {
    const activeItems = patterns[creationState.patternTab] || patterns.socialTrend;
    const currentIndex = activeItems.findIndex((item) => item.id === creationState.patternId);
    const next = activeItems[(currentIndex + 1) % activeItems.length] || activeItems[0];
    creationState.patternId = next.id;
    navigate("/museland/pattern");
  });

  root.querySelectorAll("[data-select-avatar]").forEach((button) => {
    button.addEventListener("click", () => {
      creationState.avatarId = button.dataset.selectAvatar;
      navigate("/museland");
    });
  });

  root.querySelectorAll("[data-pattern-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      creationState.patternTab = button.dataset.patternTab;
      navigate("/museland/pattern");
    });
  });

  root.querySelectorAll("[data-go-pattern]").forEach((button) => {
    button.addEventListener("click", () => {
      if (!getSelectedSilhouette()) return;
      navigate("/museland/pattern");
    });
  });

  root.querySelector("[data-open-saved-designs]")?.addEventListener("click", () => showSavedDesignsSheet());

  root.querySelector("[data-generate-product]")?.addEventListener("click", () => {
    if (!creationState.savedDesigns.length) return;
    const firstDesign = creationState.savedDesigns[0];
    creationState.patternId = firstDesign.patternId;
    creationState.avatarId = creationState.avatarId || avatars[0].id;
    creationState.complete = true;
    creationState.status = "Unpublished";
    navigate(`/mine/designs/${creationState.id}`);
  });

  const prompt = root.querySelector("[data-design-prompt]");
  prompt?.addEventListener("input", () => {
    creationState.prompt = prompt.value;
  });

  const mode = root.querySelector("[data-generation-mode]");
  mode?.addEventListener("change", () => {
    creationState.mode = mode.value;
    navigate("/museland/create");
  });

  root.querySelectorAll("[data-start-creation]").forEach((button) => {
    button.addEventListener("click", () => {
      if (!isCreationReady()) return;
      creationState.complete = true;
      creationState.status = "Unpublished";
      navigate("/museland");
    });
  });

  root.querySelector("[data-close-completion]")?.addEventListener("click", () => {
    creationState.complete = false;
    navigate(`/mine/designs/${creationState.id}`);
  });

  root.querySelector("[data-close-sheet]")?.addEventListener("click", () => {
    navigate("/museland");
  });
}

function savePatternDesign(patternId, polishNote = "") {
  const pattern = getAllPatterns().find((item) => item.id === patternId) || patterns.socialTrend[0];
  creationState.patternId = pattern.id;
  creationState.savedDesigns.push({
    id: `design-${Date.now()}-${creationState.savedDesigns.length + 1}`,
    silhouetteId: creationState.silhouetteId,
    patternId: pattern.id,
    patternName: pattern.name,
    polishNote
  });
  navigate("/museland/pattern");
}

function showPolishPatternSheet(patternId) {
  const pattern = getAllPatterns().find((item) => item.id === patternId) || patterns.socialTrend[0];
  document.querySelectorAll("[data-polish-pattern-sheet]").forEach((node) => node.remove());
  document.body.insertAdjacentHTML(
    "beforeend",
    `
      <div class="sheet-backdrop" data-polish-pattern-sheet></div>
      <section class="bottom-sheet polish-sheet" data-polish-pattern-sheet role="dialog" aria-label="Polish pattern">
        <div class="sheet-header">
          <button class="sheet-icon" type="button" data-close-polish-pattern aria-label="Close">×</button>
          <h2>Polish Print</h2>
          <span></span>
        </div>
        <div class="sheet-body">
          <div class="add-product-summary">
            <img src="${pattern.image}" alt="" />
            <div>
              <span>Base print</span>
              <strong>${pattern.name}</strong>
            </div>
          </div>
          <div class="polish-chip-row">
            ${["Softer", "More floral", "Vintage", "Resort"].map((item) => `<button type="button" data-polish-chip="${item}">${item}</button>`).join("")}
          </div>
          <textarea class="polish-pattern-textarea" data-polish-pattern-note placeholder="Add your design idea, e.g. smaller blue florals with a softer romantic mood."></textarea>
          <button class="primary-cta centered" type="button" data-apply-polish-pattern>Save Design</button>
        </div>
      </section>
    `
  );

  document.querySelectorAll("[data-close-polish-pattern]").forEach((button) => {
    button.addEventListener("click", () => closePolishPatternSheet());
  });
  document.querySelectorAll("[data-polish-chip]").forEach((button) => {
    button.addEventListener("click", () => {
      const input = document.querySelector("[data-polish-pattern-note]");
      input.value = `${input.value ? `${input.value}, ` : ""}${button.dataset.polishChip}`;
    });
  });
  document.querySelector("[data-apply-polish-pattern]")?.addEventListener("click", () => {
    const note = document.querySelector("[data-polish-pattern-note]")?.value.trim() || "";
    closePolishPatternSheet();
    savePatternDesign(pattern.id, note);
  });
}

function closePolishPatternSheet() {
  document.querySelectorAll("[data-polish-pattern-sheet]").forEach((node) => node.remove());
}

function showSavedDesignsSheet() {
  document.querySelectorAll("[data-saved-designs-sheet]").forEach((node) => node.remove());
  document.body.insertAdjacentHTML(
    "beforeend",
    `
      <div class="sheet-backdrop" data-saved-designs-sheet></div>
      <section class="bottom-sheet saved-looks-sheet" data-saved-designs-sheet role="dialog" aria-label="Saved designs">
        <div class="sheet-header">
          <button class="sheet-icon" type="button" data-close-saved-designs aria-label="Close">×</button>
          <h2>${creationState.savedDesigns.length} Designs</h2>
          <span></span>
        </div>
        <div class="sheet-body">
          <div class="saved-look-list sheet-saved-look-list">
            ${
              creationState.savedDesigns.length
                ? creationState.savedDesigns
                    .map((design, index) => {
                      const pattern = getAllPatterns().find((item) => item.id === design.patternId) || patterns.socialTrend[0];
                      return `
                        <article class="saved-look-card saved-ai-look-card">
                          <div class="saved-look-media"><img src="${pattern.image}" alt="" /></div>
                          <div>
                            <strong>Design ${index + 1}</strong>
                            <span>${design.patternName}${design.polishNote ? ` · ${design.polishNote}` : ""}</span>
                          </div>
                          <div class="saved-look-actions">
                            <button type="button" data-redesign-saved-design="${design.id}">Redesign</button>
                            <button type="button" data-delete-saved-design="${design.id}">Delete</button>
                          </div>
                        </article>
                      `;
                    })
                    .join("")
                : `<div class="empty-saved-look">No saved designs yet. Use or polish a print first.</div>`
            }
          </div>
        </div>
      </section>
    `
  );

  document.querySelectorAll("[data-close-saved-designs]").forEach((button) => {
    button.addEventListener("click", () => closeSavedDesignsSheet());
  });
  document.querySelectorAll("[data-delete-saved-design]").forEach((button) => {
    button.addEventListener("click", () => {
      const index = creationState.savedDesigns.findIndex((item) => item.id === button.dataset.deleteSavedDesign);
      if (index >= 0) creationState.savedDesigns.splice(index, 1);
      closeSavedDesignsSheet();
      navigate("/museland/pattern");
    });
  });
  document.querySelectorAll("[data-redesign-saved-design]").forEach((button) => {
    button.addEventListener("click", () => {
      const design = creationState.savedDesigns.find((item) => item.id === button.dataset.redesignSavedDesign);
      if (design) creationState.patternId = design.patternId;
      closeSavedDesignsSheet();
      navigate("/museland/pattern");
    });
  });
}

function closeSavedDesignsSheet() {
  document.querySelectorAll("[data-saved-designs-sheet]").forEach((node) => node.remove());
}
