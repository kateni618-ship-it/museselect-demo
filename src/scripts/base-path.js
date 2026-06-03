const marker = "/src/scripts/base-path.js";
const modulePath = new URL(import.meta.url).pathname;
const markerIndex = modulePath.indexOf(marker);

export const appBasePath = markerIndex > 0 ? modulePath.slice(0, markerIndex) : "";

export function withBasePath(path) {
  if (!path || !path.startsWith("/")) {
    return path;
  }
  return `${appBasePath}${path}`;
}
