import { icons } from "../components/icons.js";
import { pageShell } from "../components/layout.js";

export function muselandPlaceholderPage() {
  return pageShell(
    `
      <section class="placeholder-page">
        <div>
          <div class="mark">${icons.sparkle}</div>
          <p class="eyebrow">Phase 1A Placeholder</p>
          <h1 class="section-title">Museland</h1>
          <p class="lead">
            The four-step creation flow will be implemented in Phase 1B. This
            route is active now so Home and Product Detail can complete their
            entry path.
          </p>
        </div>
      </section>
    `,
    "museland"
  );
}

export function minePlaceholderPage() {
  return pageShell(
    `
      <section class="placeholder-page">
        <div>
          <div class="mark">${icons.mine}</div>
          <p class="eyebrow">Phase 1A Placeholder</p>
          <h1 class="section-title">Mine</h1>
          <p class="lead">
            Mock logged-in Mine, creation detail, and publish flow will be added
            after the Museland creation path foundation.
          </p>
        </div>
      </section>
    `,
    "mine"
  );
}
