import { withBasePath } from "../scripts/base-path.js";

export const assetRegistry = {
  "hero-home-main-01.png": {
    fileName: "hero-home-main-01.png",
    fallback: "placeholder-hero.png",
    type: "hero",
    usedIn: "/home hero",
    size: "750x1296",
    status: "Placeholder",
    prompt:
      "Warm daylight editorial fashion picnic, two creators wearing summer dresses, premium resort garden mood."
  },
  "product-card-blue-bloom-01.png": {
    fileName: "product-card-blue-bloom-01.png",
    fallback: "placeholder-product.png",
    type: "product",
    usedIn: "/home product card and /product gallery",
    size: "640x860",
    status: "Placeholder",
    prompt:
      "Premium blue botanical resort dress, daylight editorial product photography, clean fashion catalog quality."
  },
  "product-card-rose-mini-01.png": {
    fileName: "product-card-rose-mini-01.png",
    fallback: "placeholder-product.png",
    type: "product",
    usedIn: "/home product card and /product gallery",
    size: "640x860",
    status: "Placeholder",
    prompt:
      "Black floral mini dress, resort patio editorial model image, premium creator fashion marketplace."
  },
  "product-card-botanical-midi-01.png": {
    fileName: "product-card-botanical-midi-01.png",
    fallback: "placeholder-product.png",
    type: "product",
    usedIn: "/home product card",
    size: "640x860",
    status: "Placeholder",
    prompt:
      "Green botanical midi dress, warm outdoor resort look, creator-led fashion product card."
  },
  "pattern-social-afro-chic-01.png": {
    fileName: "pattern-social-afro-chic-01.png",
    fallback: "placeholder-pattern.png",
    type: "pattern",
    usedIn: "/home trend section",
    size: "800x800",
    status: "Placeholder",
    prompt:
      "Bright floral textile pattern with orange, pink, and blue motifs, social trend mood board."
  },
  "avatar-creator-daisy-01.png": {
    fileName: "avatar-creator-daisy-01.png",
    fallback: "placeholder-avatar.png",
    type: "avatar",
    usedIn: "creator card",
    size: "512x512",
    status: "Placeholder",
    prompt:
      "Creator profile avatar, warm daylight, resortwear curator, premium fashion platform."
  }
};

export function resolveAsset(fileName) {
  const asset = assetRegistry[fileName];
  const target = asset?.status === "Approved" ? asset.fileName : asset?.fallback || fileName;
  return withBasePath(`/assets/${target}`);
}
