import { icons } from "../components/icons.js";
import { pageShell, topBar } from "../components/layout.js";
import { getProduct, analyticsOverview, commissionItems, commissionSummary, selectedCreator } from "../data/mock-data.js";
import { getCreationRecord } from "../data/creation-store.js";
import { withBasePath } from "../scripts/base-path.js";

function mineMenuItem(icon, title, subtitle, count, href) {
  return `
    <a class="mine-menu-item" href="${href}" data-link>
      <span class="mine-menu-icon">${icon}</span>
      <span>
        <strong>${title}</strong>
        <small>${subtitle}</small>
      </span>
      <em>${count}</em>
      <b aria-hidden="true">›</b>
    </a>
  `;
}

export function minePage() {
  return pageShell(
    `
      <section class="mine-page">
        <header class="mine-top">
          <p class="app-time">9:41</p>
          <h1>MINE</h1>
        </header>
        <div class="mine-hero"></div>
        <section class="profile-card">
          <h2>${selectedCreator.name}</h2>
          <div class="profile-row">
            <img src="${selectedCreator.avatar}" alt="${selectedCreator.name}" />
            <p>${selectedCreator.style}</p>
          </div>
        </section>

        <section class="earnings-section" aria-label="Commission summary">
          <div class="section-heading-row">
            <div>
              <p class="eyebrow">Commission</p>
              <h2>Earnings</h2>
            </div>
            <a href="/mine/commission" data-link>View Orders</a>
          </div>
          <div class="earnings-grid">
            <article><span>Estimated</span><strong>${commissionSummary.estimated}</strong></article>
            <article><span>Confirmed</span><strong>${commissionSummary.confirmed}</strong></article>
            <article><span>Pending</span><strong>${commissionSummary.pending}</strong></article>
            <article><span>Bonus</span><strong>${commissionSummary.bonus}</strong></article>
          </div>
        </section>

        <section class="mine-hub">
          <h2>Promotion Hub</h2>
          <div class="mine-menu">
            ${mineMenuItem(icons.chart, "Analytics", `${analyticsOverview.timeRange} performance`, analyticsOverview.orders, "/mine/analytics")}
            ${mineMenuItem(icons.sparkle, "My AI Looks", "Generated content", "2", "/picks#looks")}
            ${mineMenuItem(icons.collection, "My Collections", "Promoted shelves", "4", "/picks#collections")}
          </div>
        </section>

        <section class="mine-hub">
          <h2>Design Hub</h2>
          <div class="mine-menu">
            ${mineMenuItem(icons.sparkle, "My Design", "View all creations", "12", "/mine/designs")}
            ${mineMenuItem(icons.plus, "My Products", "View all products", "3", "/mine/products")}
          </div>
        </section>
      </section>
    `,
    "mine"
  );
}

export function commissionPage() {
  return pageShell(
    `
      ${topBar("Commission", "/mine")}
      <section class="mine-subpage">
        <div class="filter-strip">
          ${["7d", "30d", "90d", "Estimated", "Confirmed", "AI Look"].map((chip) => `<button type="button">${chip}</button>`).join("")}
        </div>
        <div class="commission-list full">
          ${commissionItems
            .map((item) => {
              const product = getProduct(item.productId);
              return `
                <article>
                  <img src="${product.images[0]}" alt="${product.name}" />
                  <span>
                    <strong>${product.shortName}</strong>
                    <small>${item.date} · ${item.orderStatus} · ${item.source}</small>
                    <em>${item.type} · ${item.settlementStatus}</em>
                  </span>
                  <b>${item.commission}</b>
                </article>
              `;
            })
            .join("")}
        </div>
      </section>
    `,
    "mine"
  );
}

export function analyticsPage() {
  return pageShell(
    `
      ${topBar("Analytics", "/mine")}
      <section class="mine-subpage">
        <div class="time-tabs" aria-label="Time range">
          <button class="active" type="button">7d</button>
          <button type="button">30d</button>
          <button type="button">90d</button>
        </div>
        <div class="analytics-cards large">
          <article><span>Clicks</span><strong>${analyticsOverview.clicks}</strong></article>
          <article><span>Views</span><strong>${analyticsOverview.productViews}</strong></article>
          <article><span>Orders</span><strong>${analyticsOverview.orders}</strong></article>
          <article><span>Est.</span><strong>${analyticsOverview.estimatedCommission}</strong></article>
        </div>
        <div class="trend-chart">
          ${analyticsOverview.trend.map((item, index) => `<i style="height:${48 + index * 14}px"><span>${item}</span></i>`).join("")}
        </div>
        <div class="funnel-list">
          ${analyticsOverview.funnel.map(([label, value]) => `<article><span>${label}</span><strong>${value}</strong></article>`).join("")}
        </div>
      </section>
    `,
    "mine"
  );
}

export function designsPage() {
  const creation = getCreationRecord();
  return pageShell(
    `
      ${topBar("My Designs", "/mine")}
      <section class="design-list-page">
        <article class="design-card">
          <a href="/mine/designs/${creation.id}" data-link>
            <img src="${creation.assets[1].image}" alt="${creation.title}" />
            <div>
              <span class="status-pill">${creation.status}</span>
              <h2>${creation.title}</h2>
              <p>${creation.mode} · ${creation.createdAt}</p>
            </div>
          </a>
        </article>
        <article class="design-card muted-card">
          <a href="/mine/designs/${creation.id}" data-link>
            <img src="${withBasePath("/assets/placeholder-product.png")}" alt="" />
            <div>
              <span class="status-pill creating">Creating</span>
              <h2>Aurelia Garden Story Dress</h2>
              <p>Auto Mode · 2026.05.28 18:12</p>
            </div>
          </a>
        </article>
      </section>
    `,
    "mine"
  );
}

function assetCard(asset) {
  return `
    <article class="creation-asset-card">
      <img src="${asset.image}" alt="${asset.label}" />
      <span>${asset.label}</span>
    </article>
  `;
}

function processRow(image, eyebrow, title) {
  return `
    <div class="process-row">
      <img src="${image}" alt="" />
      <div>
        <span>${eyebrow}</span>
        <strong>${title}</strong>
      </div>
    </div>
  `;
}

export function creationDetailPage() {
  const creation = getCreationRecord();
  return pageShell(
    `
      ${topBar("Creation Details", "/mine/designs")}
      <section class="creation-detail-page">
        <div class="progress-row">
          <span>✓ Product Design</span>
          <i></i>
          <span>✓ Look Generate</span>
        </div>

        <div class="creation-meta">
          <strong>${creation.mode}</strong>
          <span>${creation.createdAt}</span>
        </div>

        <section class="detail-block">
          <h2>Product Assets</h2>
          <div class="creation-assets">
            ${creation.assets.map(assetCard).join("")}
          </div>
        </section>

        <section class="detail-block">
          <h2>Looks</h2>
          <div class="looks-row">
            ${creation.looks.map(assetCard).join("")}
          </div>
        </section>

        <section class="detail-block process-block">
          <h2>Creation Process</h2>
          ${processRow(creation.silhouette.image, "Silhouette Selection", creation.silhouette.name)}
          ${processRow(creation.pattern.image, "Pattern Selection", creation.pattern.name)}
          ${processRow(creation.avatar.image, "Avatar", creation.avatar.name)}
        </section>

        <section class="detail-block">
          <h2>Prompt</h2>
          <p class="prompt-box">${creation.prompt}</p>
        </section>

        <div class="creation-action-bar">
          <a class="secondary-cta" href="/museland" data-link>Use Template</a>
          <a class="primary-cta" href="/publish/${creation.id}" data-link>Publish</a>
        </div>
      </section>
    `,
    "mine"
  );
}

export function simpleMineSubpage(title, copy) {
  return pageShell(
    `
      ${topBar(title, "/mine")}
      <section class="placeholder-page">
        <div>
          <div class="mark">${icons.mine}</div>
          <p class="eyebrow">Phase 1C Placeholder</p>
          <h1 class="section-title">${title}</h1>
          <p class="lead">${copy}</p>
        </div>
      </section>
    `,
    "mine"
  );
}
