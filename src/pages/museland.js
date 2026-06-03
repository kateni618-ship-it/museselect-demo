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
      <header class="museland-header">
        <p class="app-time">9:41</p>
        <h1>MUSELAND</h1>
      </header>
      <div class="museland-banner">
        <img src="${withBasePath("/assets/placeholder-hero.png")}" alt="MUSELAND creation banner placeholder" />
      </div>
      <div class="creation-steps">
        ${steps.map(hubCard).join("")}
      </div>
      <div class="creation-fixed-action">
        <button class="primary-cta centered" type="button" data-start-creation ${isCreationReady() ? "" : "disabled"}>
          Start Creation
        </button>
      </div>
    </section>
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

function patternSheet() {
  const tabItems = [
    ["socialTrend", "Social Trend"],
    ["bestSeller", "Best Seller"],
    ["myPattern", "My Pattern"]
  ];
  const activeItems = patterns[creationState.patternTab];
  return sheetShell(
    "pattern",
    "Step2 : Pick Pattern",
    `
      <div class="pattern-tabs">
        ${tabItems
          .map(
            ([id, label]) => `
              <button class="${creationState.patternTab === id ? "active" : ""}" type="button" data-pattern-tab="${id}">
                ${label}
              </button>
            `
          )
          .join("")}
      </div>
      ${
        activeItems.length
          ? `<div class="pattern-list">
              ${activeItems
                .map(
                  (item) => `
                    <article class="pattern-card ${creationState.patternId === item.id ? "selected" : ""}">
                      <img src="${item.image}" alt="${item.name}" />
                      <div class="pattern-overlay">
                        <strong>${item.tag}</strong>
                        <div>${item.metrics.map((metric) => `<span>${metric}</span>`).join("")}</div>
                      </div>
                      <button type="button" data-select-pattern="${item.id}">Pick</button>
                    </article>
                  `
                )
                .join("")}
            </div>`
          : `<div class="empty-state">
              <p class="eyebrow">My Pattern</p>
              <h3>No Saved Patterns</h3>
              <p>Approved pattern assets will appear here after they are uploaded to the asset library.</p>
            </div>`
      }
    `
  );
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
  if (stepId === "silhouette") return silhouetteSheet();
  if (stepId === "pattern") return patternSheet();
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
  return pageShell(`${hubContent()}${activeSheet(stepId)}${completionModal()}`, "museland");
}

export function bindMuselandInteractions(root) {
  root.querySelectorAll("[data-select-silhouette]").forEach((button) => {
    button.addEventListener("click", () => {
      creationState.silhouetteId = button.dataset.selectSilhouette;
      navigate("/museland");
    });
  });

  root.querySelectorAll("[data-select-pattern]").forEach((button) => {
    button.addEventListener("click", () => {
      creationState.patternId = button.dataset.selectPattern;
      navigate("/museland");
    });
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
