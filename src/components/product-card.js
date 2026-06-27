import { getCreator } from "../data/mock-data.js";
import { icons } from "./icons.js";

export function productCard(product, options = {}) {
  const creator = getCreator(product.designerId);
  const topCommissionRate = product.boostCommissionRate || product.commissionRate;
  const {
    compact = false,
    showCreator = true,
    showSales = false,
    secondaryAction = "Pick",
    primaryLabel = "Promote"
  } = options;

  return `
    <article class="product-card ${compact ? "compact-product-card" : ""}">
      <a href="/product/${product.id}" data-link aria-label="Open ${product.name}">
        <div class="product-media">
          <img src="${product.images[0]}" alt="${product.name}" />
          ${product.tag ? `<span class="product-tag">${product.tag}</span>` : ""}
          <span class="commission-badge">Earn up to ${topCommissionRate}</span>
        </div>
        <div class="product-card-body">
          <h3>${product.shortName}</h3>
          <div class="product-money-row">
            <strong>${product.price}</strong>
            <span>Est. ${product.commissionAmount}</span>
          </div>
          ${showSales ? `<p class="product-sales">Sold ${product.salesCount}</p>` : ""}
          ${
            showCreator
              ? `
                <div class="designer-row">
                  <img src="${creator.avatar}" alt="${creator.name}" />
                  <p>Designed<br /><span>By ${creator.name}</span></p>
                </div>
              `
              : ""
          }
        </div>
      </a>
      <div class="product-card-actions">
        <button type="button" class="product-mini-icon" data-pick-product="${product.id}" aria-label="${secondaryAction} ${product.name}">
          ${icons.pick}
        </button>
        <button type="button" class="mini-primary" data-promote-product="${product.id}">${primaryLabel}</button>
      </div>
    </article>
  `;
}

export function productListRow(product, options = {}) {
  const {
    actionLabel = "Promote",
    meta = `Sold ${product.salesCount}`,
    manage = "",
    rank = "",
    secondaryLabel = "",
    tryonLabel = "",
    removeLabel = ""
  } = options;
  const topCommissionRate = product.boostCommissionRate || product.commissionRate;
  const searchText = `${product.name} ${product.shortName} ${product.price} ${product.commissionRate} ${product.commissionAmount} ${product.salesCount} ${product.tag || ""} ${product.shipType || ""} ${product.stockStatus || ""}`.toLowerCase();

  return `
    <article class="product-list-row ${rank ? "ranked-product-row" : ""}" data-filter-item data-search="${searchText}">
      <a href="/product/${product.id}" data-link aria-label="Open ${product.name}">
        <span class="list-image-wrap">
          <img src="${product.images[0]}" alt="${product.name}" />
          ${rank ? `<b class="rank-badge">#${rank}</b>` : ""}
        </span>
        <span>
          <strong>${product.shortName}</strong>
          <small class="list-price">${product.price}</small>
          <span class="list-commission-badge">Earn up to ${topCommissionRate}</span>
          <em class="list-est">Est. ${product.commissionAmount}</em>
          <em>${meta}</em>
        </span>
      </a>
      <div class="row-actions normal-actions">
        ${secondaryLabel ? `<button class="ghost-row-action" type="button" data-add-collection="${product.id}">${secondaryLabel}</button>` : ""}
        ${tryonLabel ? `<button class="ghost-row-action tryon-row-action" type="button" data-tryon-product="${product.id}">${tryonLabel}</button>` : ""}
        <button type="button" data-promote-product="${product.id}">${actionLabel}</button>
      </div>
      ${
        removeLabel
          ? `<div class="row-actions manage-actions"><button class="danger-row-action" type="button" data-remove-pick="${product.id}">${removeLabel}</button></div>`
          : ""
      }
      ${manage ? `<p class="row-manage">${manage}</p>` : ""}
    </article>
  `;
}
