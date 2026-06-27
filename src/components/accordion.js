import { icons } from "./icons.js";

export function accordion(items) {
  return `
    <div class="accordion-list">
      ${items
        .map(
          (item, index) => `
            <details class="accordion-item" ${index === 0 ? "open" : ""}>
              <summary>
                <span>${item.title}</span>
                <span class="accordion-icon">${icons.plus}</span>
              </summary>
              <p>${item.body}</p>
            </details>
          `
        )
        .join("")}
    </div>
  `;
}
