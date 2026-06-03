import { icons } from "./icons.js";

export function bottomNav(active) {
  const items = [
    { id: "for-u", href: "/for-u", label: "FOR U", icon: icons.home },
    { id: "select", href: "/select", label: "SELECT", icon: icons.search },
    { id: "museland", href: "/museland", label: "MUSELAND", icon: icons.sparkle },
    { id: "picks", href: "/picks", label: "PICKS", icon: icons.pick },
    { id: "mine", href: "/mine", label: "MINE", icon: icons.mine }
  ];

  return `
    <nav class="bottom-tab" aria-label="Primary navigation">
      ${items
        .map(
          (item) => `
            <a class="tab ${active === item.id ? "active" : ""}" href="${item.href}" data-link>
              <span class="tab-icon">${item.icon}</span>
              <span>${item.label}</span>
            </a>
          `
        )
        .join("")}
    </nav>
  `;
}

export function pageShell(content, active = "for-u") {
  return `
    <main class="phone-canvas">
      <div class="page-content">
        ${content}
      </div>
      ${bottomNav(active)}
    </main>
  `;
}

export function topBar(title, backHref = "/for-u") {
  return `
    <header class="top-bar">
      <a class="icon-button" href="${backHref}" data-link aria-label="Back">${icons.back}</a>
      <h1>${title}</h1>
      <span class="top-spacer" aria-hidden="true"></span>
    </header>
  `;
}
