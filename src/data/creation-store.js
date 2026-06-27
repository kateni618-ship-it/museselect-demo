import {
  avatars,
  defaultCreationPrompt,
  generationModes,
  patterns,
  silhouettes
} from "./mock-data.js";

export const creationState = {
  id: "aria-boldbloom",
  silhouetteId: null,
  patternId: null,
  avatarId: null,
  prompt: defaultCreationPrompt,
  mode: "auto",
  patternTab: "socialTrend",
  savedDesigns: [],
  productImageSource: "",
  complete: false,
  status: "Unpublished",
  createdAt: "2026.05.29 14:30"
};

export const publishState = {
  designId: "aria-boldbloom",
  title: "Boldbloom Resort Midi Dress",
  description:
    "A creator-led botanical resort dress with soft daylight styling, designed for warm-weather campaigns and effortless storefront publishing.",
  selectedLook: "Look 1",
  publishStatus: "Draft",
  publishedAt: ""
};

export function getAllPatterns() {
  return [...patterns.socialTrend, ...patterns.bestSeller, ...patterns.myPattern];
}

export function getSelectedSilhouette() {
  return silhouettes.find((item) => item.id === creationState.silhouetteId) || silhouettes[1];
}

export function getSelectedPattern() {
  return getAllPatterns().find((item) => item.id === creationState.patternId) || patterns.socialTrend[0];
}

export function getSelectedAvatar() {
  return avatars.find((item) => item.id === creationState.avatarId) || avatars[0];
}

export function getSelectedMode() {
  return generationModes.find((item) => item.id === creationState.mode) || generationModes[0];
}

export function isCreationReady() {
  return Boolean(
    creationState.silhouetteId &&
      creationState.patternId &&
      creationState.avatarId &&
      creationState.prompt.trim()
  );
}

export function hasDesigns() {
  return creationState.savedDesigns.length > 0 || creationState.complete;
}

export function getCreationRecord() {
  const silhouette = getSelectedSilhouette();
  const pattern = getSelectedPattern();
  const avatar = getSelectedAvatar();
  const mode = getSelectedMode();

  return {
    id: creationState.id,
    title: `${silhouette.name} ${pattern.name} Dress`,
    status: creationState.status,
    mode: mode.name,
    createdAt: creationState.createdAt,
    prompt: creationState.prompt,
    savedDesigns: creationState.savedDesigns,
    productImageSource: creationState.productImageSource,
    silhouette,
    pattern,
    avatar,
    assets: [
      {
        label: "Pattern",
        image: pattern.image
      },
      {
        label: "Product",
        image: silhouette.image
      }
    ],
    looks: [
      {
        label: "Look 1",
        image: avatar.image
      },
      {
        label: "Look 2",
        image: avatar.image
      },
      {
        label: "Look 3",
        image: avatar.image
      }
    ]
  };
}

export function getPublishListing() {
  const creation = getCreationRecord();
  return {
    ...publishState,
    creation,
    styles: creation.looks.map((look) => ({
      id: look.label,
      label: look.label,
      image: look.image
    }))
  };
}

export function updatePublishListing(updates) {
  Object.assign(publishState, updates);
}

export function markPublishing() {
  publishState.publishStatus = "Publishing";
  creationState.status = "Publishing";
}

export function markPublished() {
  publishState.publishStatus = "Published";
  publishState.publishedAt = "2026.05.29 15:10";
  creationState.status = "Published";
}
