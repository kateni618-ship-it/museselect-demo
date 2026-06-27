import { icons } from "../components/icons.js";
import { pageShell, topBar } from "../components/layout.js";
import { collections, getProduct, analyticsOverview, commissionItems, commissionSummary, products, rewardOrders, selectedCreator } from "../data/mock-data.js";
import { creationState, getCreationRecord, hasDesigns } from "../data/creation-store.js";
import { boostState, saveBoostState, setBoostStage } from "../data/boost-state.js";
import { navigate } from "../scripts/router.js";

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

function boostProgressValue(value, target) {
  return Math.min(100, Math.round((value / target) * 100));
}

const boostProgressModes = [
  { id: "estimate", label: "Estimate" },
  { id: "confirmed", label: "Confirmed" }
];

const rewardTaskTabs = [
  { id: "firstSale", stage: "new", label: "First-Order Bonus" },
  { id: "monthlyBoost", stage: "firstSaleDone", label: "Promo Milestone" },
  { id: "blowUpBonus", stage: "monthlyDone", label: "Power Seller" }
];

const rewardStatusFilters = [
  { id: "estimate", label: "Estimate" },
  { id: "confirmed", label: "Confirmed" }
];

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const firstSaleWindowDays = 90;
const monthlyRewardCycle = {
  label: "July cycle",
  endLabel: "Jul 31"
};

function recentRewardMonths() {
  const now = new Date();
  return [0, 1, 2].map((offset) => {
    const date = new Date(now.getFullYear(), now.getMonth() - offset, 1);
    const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    return {
      value,
      label: `${monthNames[date.getMonth()]} ${date.getFullYear()}`
    };
  });
}

function currentRewardMonth(months) {
  return months.some((month) => month.value === boostState.rewardMonth) ? boostState.rewardMonth : months[0].value;
}

function metricValue(values, index) {
  return values[Math.min(index, values.length - 1)];
}

function daysUntil(date) {
  const today = new Date();
  const target = new Date(date);
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target - today) / 86400000);
}

function addDays(dateString, days) {
  const date = new Date(dateString);
  date.setDate(date.getDate() + days);
  return date;
}

function firstSaleWindowLabel() {
  const deadline = addDays(selectedCreator.registeredAt, firstSaleWindowDays);
  const remainingDays = daysUntil(deadline);
  if (remainingDays < 0) return "90-day window · expired";
  if (remainingDays === 0) return "90-day window · ends today";
  return `90-day window · ${remainingDays} days left`;
}

function isFirstOrderBonusEarned() {
  return true;
}

function boostRewardBadge(mission) {
  const content = `<b>${mission.reward}</b><em>${mission.status}${mission.earned ? '<span aria-hidden="true">›</span>' : ""}</em>`;
  if (!mission.earned) return `<strong>${content}</strong>`;
  return `
    <a class="boost-reward-pill earned" href="/mine/commission?type=bonus" data-link aria-label="View earned bonus">
      ${content}
    </a>
  `;
}

function boostRows(stage, mode, monthOffset) {
  const progress = {
    firstSaleDone: {
      estimate: {
        orders: [12, 15, 9],
        gmv: [430, 520, 310]
      },
      confirmed: {
        orders: [8, 15, 7],
        gmv: [286, 520, 240]
      }
    },
    monthlyDone: {
      estimate: {
        orders: [28, 43, 36],
        gmv: [920, 1280, 1100]
      },
      confirmed: {
        orders: [21, 38, 29],
        gmv: [760, 1110, 940]
      }
    }
  };
  if (stage === "new") {
    const value = isFirstOrderBonusEarned() ? 1 : mode === "confirmed" ? 0 : boostState.ordersThisMonth;
    return [{ label: "Orders", value, target: 1, display: `${value} / 1` }];
  }
  const stageProgress = progress[stage]?.[mode] || progress.firstSaleDone.estimate;
  const orderValue = metricValue(stageProgress.orders, monthOffset);
  const gmvValue = metricValue(stageProgress.gmv, monthOffset);
  const orderTarget = stage === "monthlyDone" ? 50 : 15;
  const gmvTarget = stage === "monthlyDone" ? 1500 : 500;
  return [
    { label: "Orders", value: orderValue, target: orderTarget, display: `${orderValue} / ${orderTarget}` },
    { label: "GMV", value: gmvValue, target: gmvTarget, display: `$${gmvValue.toLocaleString()} / $${gmvTarget.toLocaleString()}` }
  ];
}

function boostMission() {
  const progressMode = boostState.progressMode === "confirmed" ? "confirmed" : "estimate";
  const rewardMonths = recentRewardMonths();
  const rewardMonth = currentRewardMonth(rewardMonths);
  const activeRewardTask = rewardTaskTabs.find((task) => task.stage === boostState.stage) || rewardTaskTabs[0];
  const firstSaleEarned = isFirstOrderBonusEarned();
  const taskStages = [
    { stage: "new", label: "First-Order Bonus", completed: boostState.stage !== "new" },
    { stage: "firstSaleDone", label: "Promo Milestone", completed: boostState.stage === "monthlyDone" },
    { stage: "monthlyDone", label: "Power Seller", completed: false }
  ];
  const missions = {
    new: {
      title: "First-Order Bonus",
      timing: firstSaleWindowLabel(),
      reward: "$5 bonus",
      status: firstSaleEarned ? "Earned" : "Not earned",
      earned: firstSaleEarned,
      rows: boostRows("new", progressMode, 0)
    },
    firstSaleDone: {
      title: "Promo Milestone",
      timing: `${monthlyRewardCycle.label} · ends ${monthlyRewardCycle.endLabel}`,
      reward: "$30 bonus",
      status: boostState.cashBonusEarned >= 35 ? "Earned" : "Not earned",
      earned: boostState.cashBonusEarned >= 35,
      rows: boostRows("firstSaleDone", progressMode, 0)
    },
    monthlyDone: {
      title: "Power Seller",
      timing: `${monthlyRewardCycle.label} · ended ${monthlyRewardCycle.endLabel}`,
      reward: "$80 bonus",
      status: boostState.cashBonusEarned >= 85 ? "Earned" : "Not earned",
      earned: boostState.cashBonusEarned >= 85,
      ended: true,
      rows: boostRows("monthlyDone", progressMode, 0)
    }
  };
  const mission = missions[boostState.stage] || missions.new;

  return `
    <section class="boost-mission-card ${mission.ended ? "ended" : ""}" data-boost-mission>
      <div class="boost-card-topline">
        <span>Creator rewards</span>
        <a href="/mine/rewards/rules" data-link>Rules</a>
      </div>
      <div class="boost-task-line" aria-label="Sales boost missions">
        ${taskStages
          .map(
            (task) => `
              <button class="${boostState.stage === task.stage ? "active" : ""} ${task.completed ? "completed" : ""}" type="button" data-boost-stage="${task.stage}">
                ${task.completed ? "<span>Earned</span>" : ""}
                <b>${task.label}</b>
              </button>
            `
          )
          .join("")}
      </div>
      <div class="boost-mission-head">
        <div>
          <h2>${mission.title}</h2>
          <p>${mission.timing}</p>
        </div>
        ${boostRewardBadge(mission)}
      </div>
      <div class="boost-progress-tools">
        <div class="boost-progress-tabs" role="tablist" aria-label="Progress status">
          ${boostProgressModes
            .map(
              (mode) => `
                <button class="${progressMode === mode.id ? "active" : ""}" type="button" role="tab" aria-selected="${progressMode === mode.id}" data-boost-progress-mode="${mode.id}">
                  ${mode.label}
                </button>
              `
            )
            .join("")}
        </div>
      </div>
      <div class="boost-progress-list">
        ${mission.rows
          .map(
            (row) => `
              <div class="boost-progress">
                <span><b>${row.label}</b><em>${row.display}</em></span>
                <i><u style="width: ${boostProgressValue(row.value, row.target)}%"></u></i>
              </div>
            `
          )
          .join("")}
      </div>
      <a class="boost-order-link" href="/mine/rewards/orders?task=${activeRewardTask.id}&status=${progressMode}&month=${rewardMonth}" data-link>
        <span>Reward order details</span>
        <b aria-hidden="true">›</b>
      </a>
    </section>
  `;
}

function rewardQueryState() {
  const params = new URLSearchParams(window.location.search);
  const rewardMonths = recentRewardMonths();
  const task = rewardTaskTabs.some((item) => item.id === params.get("task")) ? params.get("task") : "monthlyBoost";
  const month = rewardMonths.some((item) => item.value === params.get("month")) ? params.get("month") : rewardMonths[0].value;
  const status = rewardStatusFilters.some((item) => item.id === params.get("status")) ? params.get("status") : "estimate";
  return { task, month, status, rewardMonths };
}

function rewardOrdersHref(updates = {}) {
  const state = { ...rewardQueryState(), ...updates };
  const params = new URLSearchParams({ task: state.task });
  if (state.task !== "firstSale") {
    params.set("month", state.month);
    params.set("status", state.status);
  }
  return `/mine/rewards/orders?${params.toString()}`;
}

function rewardTaskLabel(taskId) {
  return rewardTaskTabs.find((task) => task.id === taskId)?.label || rewardTaskTabs[0].label;
}

function filteredRewardOrders({ task, month, status }) {
  return rewardOrders.filter((order) => {
    const matchesTask = order.rewardTask === task;
    const matchesMonth = task === "firstSale" || order.rewardMonth === month;
    const matchesStatus = task === "firstSale" || order.rewardStatus === status;
    return matchesTask && matchesMonth && matchesStatus;
  });
}

function rewardOrderRow(order) {
  const product = getProduct(order.productId);
  return `
    <article class="reward-order-item">
      <img src="${product.images[0]}" alt="${product.name}" />
      <span>
        <strong>${product.shortName}</strong>
        <small>${order.id} · ${order.date}</small>
        <em>${rewardTaskLabel(order.rewardTask)}</em>
      </span>
      <span class="reward-order-meta">
        <i class="settlement-tag ${order.rewardStatus === "confirmed" ? "settled" : "pending"}">${order.rewardStatus}</i>
        <b>$${order.gmv.toLocaleString()}</b>
      </span>
    </article>
  `;
}

const earningTypeTabs = [
  { id: "orderCommission", label: "Order Commission" },
  { id: "bonus", label: "Bonus" }
];

function earningQueryState() {
  const params = new URLSearchParams(window.location.search);
  const type = earningTypeTabs.some((item) => item.id === params.get("type")) ? params.get("type") : "orderCommission";
  return { type };
}

function earningHref(type) {
  return `/mine/commission?type=${type}`;
}

const earningsSummaryCards = [
  {
    id: "estimated",
    label: "EST. EARNINGS",
    value: commissionSummary.estimated,
    info: "Estimated commission from promoted orders. Final payout may change after cancellations, refunds, or settlement review."
  },
  {
    id: "pending",
    label: "PENDING",
    value: commissionSummary.pending,
    info: "Commission that has been generated but not settled yet. It usually waits for order confirmation and the refund window to close."
  },
  {
    id: "total-orders",
    label: "TOTAL ORDERS",
    value: analyticsOverview.orders,
    info: "Total orders created through your promotion links, including pending and settled orders."
  },
  {
    id: "settled",
    label: "SETTLED",
    value: commissionSummary.settled,
    info: "Commission that has completed settlement and is counted as confirmed earnings."
  }
];

function earningsSummaryCard(card) {
  return `
    <article>
      <span class="earnings-card-label">
        ${card.label}
        <button type="button" data-earnings-info="${card.id}" aria-label="${card.label} info">i</button>
      </span>
      <strong>${card.value}</strong>
    </article>
  `;
}

const filterIcon = `
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M4 7h16" />
    <path d="M7 12h10" />
    <path d="M10 17h4" />
  </svg>
`;

const analyticsMetrics = [
  {
    id: "clicks",
    label: "Clicks",
    value: analyticsOverview.clicks,
    info: "Total clicks generated from your promotion links during the selected time range."
  },
  {
    id: "views",
    label: "Views",
    value: analyticsOverview.productViews,
    info: "Total product page views driven by your promoted products or collections."
  },
  {
    id: "orders",
    label: "Orders",
    value: analyticsOverview.orders,
    info: "Total orders created through your promotion links, including pending and settled orders."
  },
  {
    id: "gmv",
    label: "GMV",
    value: "$18.6K",
    info: "Gross merchandise value from orders generated through your promotion links before refunds or cancellations."
  }
];

const analyticsFunnelInfo = {
  Clicks: "Customers who clicked your promotion links.",
  "Product Views": "Customers who reached a product detail page after clicking your promotion links.",
  "Add to Cart": "Customers who added promoted products to cart.",
  Checkout: "Customers who started checkout for promoted products.",
  Purchase: "Customers who completed an order through your promotion links."
};

const promotedAssetMetrics = [
  {
    id: "units",
    label: "Units sold",
    info: "Number of units sold through this promoted product or collection."
  },
  {
    id: "clicks",
    label: "Clicks",
    info: "Clicks generated by this product or collection promotion link."
  },
  {
    id: "gmv",
    label: "GMV",
    info: "Gross merchandise value generated by this promoted asset before refunds or cancellations."
  },
  {
    id: "commission",
    label: "Est. commission",
    info: "Estimated commission from this promoted asset. Final payout may change after settlement review."
  }
];

const analyticsTrends = {
  clicks: [1800, 2100, 2700, 2300, 3100, 2600, 3400],
  views: [1200, 1550, 1700, 1900, 2200, 2050, 2500],
  orders: [18, 24, 31, 28, 42, 39, 51],
  gmv: [2200, 2600, 3100, 2800, 3600, 3300, 4100]
};

function analyticsLineChart(metricId = "clicks") {
  const values = analyticsTrends[metricId] || analyticsTrends.clicks;
  const max = Math.max(...values);
  const points = values
    .map((value, index) => {
      const x = 8 + (index / (values.length - 1)) * 84;
      const y = 82 - (value / max) * 64;
      return `${x},${y}`;
    })
    .join(" ");
  return `
    <div class="analytics-line-chart" data-analytics-chart>
      <svg viewBox="0 0 100 90" preserveAspectRatio="none" aria-label="${metricId} trend">
        <polyline points="${points}" />
      </svg>
      <div>${["D1", "D15", "D30", "D45", "D60", "D75", "D90"].map((label) => `<span>${label}</span>`).join("")}</div>
    </div>
  `;
}

function promoteRows() {
  const productRows = products.map((product, index) => ({
    id: product.id,
    type: "Product",
    title: product.shortName,
    image: product.images[0],
    clicks: [4200, 3600, 3100][index] || 1800,
    units: [126, 104, 86][index] || 42,
    gmv: [56700, 43680, 33540][index] || 12000,
    commission: [8505, 6552, 5031][index] || 1800
  }));
  const collectionRows = collections.slice(0, 3).map((collection, index) => {
    const product = getProduct(collection.productIds[0]);
    return {
      id: collection.id,
      type: "Collection",
      title: collection.title,
      image: product.images[0],
      clicks: [2800, 2400, 1900][index] || 1000,
      units: [74, 61, 48][index] || 24,
      gmv: [28600, 23100, 18400][index] || 8000,
      commission: [4290, 3465, 2760][index] || 1200
    };
  });
  return [...productRows, ...collectionRows];
}

function promoteRow(row) {
  const href = row.type === "Collection" ? `/mine/analytics/collections/${row.id}` : `/product/${row.id}`;
  const promoteAttr = row.type === "Collection" ? `data-promote-collection="${row.id}"` : `data-promote-product="${row.id}"`;
  return `
    <article class="promote-analytics-row" data-promote-row data-promote-type="${row.type.toLowerCase()}" data-search="${`${row.title} ${row.type}`.toLowerCase()}" data-clicks="${row.clicks}" data-units="${row.units}" data-gmv="${row.gmv}" data-commission="${row.commission}">
      <a class="promote-analytics-main" href="${href}" data-link>
        <img src="${row.image}" alt="" />
        <span>
          <strong>${row.title}</strong>
          <small>${row.type}</small>
        </span>
      </a>
      <div class="promote-analytics-metrics">
        <span><em>Units sold</em><strong>${row.units}</strong></span>
        <span><em>Clicks</em><strong>${row.clicks.toLocaleString()}</strong></span>
        <span><em>GMV</em><strong>$${row.gmv.toLocaleString()}</strong></span>
        <span class="commission"><em>Est. commission</em><strong>$${row.commission.toLocaleString()}</strong></span>
      </div>
      <button type="button" ${promoteAttr}>PROMOTE AGAIN</button>
    </article>
  `;
}

function collectionProductRows(collectionId) {
  const collection = collections.find((item) => item.id === collectionId) || collections[0];
  return collection.productIds.map((productId, index) => {
    const product = getProduct(productId);
    const gmv = [18600, 14200, 9800][index] || 6400;
    return {
      id: product.id,
      type: "Product",
      title: product.shortName,
      image: product.images[0],
      clicks: [1260, 980, 720][index] || 420,
      units: [42, 32, 24][index] || 12,
      gmv,
      commission: Math.round(gmv * 0.15)
    };
  });
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

        ${boostMission()}

        <section class="earnings-section" aria-label="Commission summary">
          <div class="section-heading-row">
            <div>
              <p class="eyebrow">Commission</p>
              <h2>Earning</h2>
            </div>
            <a href="/mine/commission" data-link>View Earnings</a>
          </div>
          <div class="earnings-grid">
            ${earningsSummaryCards.map(earningsSummaryCard).join("")}
          </div>
        </section>

        <section class="mine-hub">
          <h2>PROMOTION HUB</h2>
          <div class="mine-menu">
            ${mineMenuItem(icons.chart, "Analytics", `${analyticsOverview.timeRange} performance`, analyticsOverview.orders, "/mine/analytics")}
            ${mineMenuItem(icons.pick, "My Picks", "Selected products", "3", "/picks#all-picks")}
            ${mineMenuItem(icons.collection, "My Collection", "Promoted shelves", "4", "/picks#collections")}
            ${mineMenuItem(icons.sparkle, "My AI Looks", "Generated content", "2", "/create#looks")}
            ${mineMenuItem(icons.sparkle, "My AI Videos", "Video content", "1", "/create#videos")}
          </div>
        </section>

        <section class="mine-hub">
          <h2>DESIGN HUB</h2>
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
  const state = earningQueryState();
  const rows = commissionItems.filter((item) => {
    const isBonus = item.type.toLowerCase().includes("bonus");
    return state.type === "bonus" ? isBonus : !isBonus;
  });
  return pageShell(
    `
      <header class="top-bar earnings-top-bar">
        <a class="icon-button" href="/mine" data-link aria-label="Back">${icons.back}</a>
        <h1>View Earnings</h1>
        <a class="top-bar-text-link" href="/mine/commission/rules" data-link>Rules</a>
      </header>
      <section class="mine-subpage">
        <div class="earning-type-tabs" aria-label="Earning type">
          ${earningTypeTabs
            .map(
              (tab) => `
                <a class="${state.type === tab.id ? "active" : ""}" href="${earningHref(tab.id)}" data-link>
                  ${tab.label}
                </a>
              `
            )
            .join("")}
        </div>
        <div class="order-filter-bar">
          <div class="time-tabs order-time-tabs" aria-label="Order time range">
            ${["7d", "30d", "90d", "Total"].map((chip) => `<button class="${chip === "90d" ? "active" : ""}" type="button">${chip}</button>`).join("")}
          </div>
          <button class="filter-icon-button" type="button" data-open-order-filters aria-label="More filters">${filterIcon}</button>
        </div>
        <div class="commission-list full">
          ${rows
            .map((item) => {
              const product = getProduct(item.productId);
              const settlementClass = item.settlementStatus.toLowerCase();
              const orderClass = item.orderStatus.toLowerCase().replace(/\s+/g, "-");
              const orderStatus = item.orderStatus
                ? `<i class="order-status-tag ${orderClass}">${item.orderStatus}</i>`
                : "";
              const amount = item.settlementStatus === "Closed"
                ? `<b>${item.commission}</b><del>${item.originalCommission}</del>`
                : `<b>${item.commission}</b>`;
              return `
                <article class="commission-order-item">
                  <img src="${product.images[0]}" alt="${product.name}" />
                  <span class="commission-order-copy">
                    <strong>${product.shortName}</strong>
                    <small>${item.date}${orderStatus ? ` ${orderStatus}` : ""}</small>
                    <em>${item.type}</em>
                  </span>
                  <span class="commission-order-amount">
                    <i class="settlement-tag ${settlementClass}">${item.settlementStatus}</i>
                    ${amount}
                  </span>
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

export function commissionRulesPage() {
  return pageShell(
    `
      ${topBar("Commission Rules", "/mine/commission")}
      <section class="mine-subpage commission-rules-page">
        <article>
          <h2>Commission settlement rules</h2>
          <p>This page is a static placeholder for the business commission settlement document.</p>
        </article>
        <article>
          <h3>Order commission</h3>
          <p>Order commission rules, settlement timing, valid order definition, refunds, cancellations, and payout status will be provided by the business team.</p>
        </article>
        <article>
          <h3>Bonus</h3>
          <p>Bonus eligibility, stacking rules, monthly task calculation, and payment timing will be provided by the business team.</p>
        </article>
      </section>
    `,
    "mine"
  );
}

export function rewardOrdersPage() {
  const state = rewardQueryState();
  const isFirstSale = state.task === "firstSale";
  const rows = filteredRewardOrders(state);
  const totalGmv = rows.reduce((sum, order) => sum + order.gmv, 0);
  return pageShell(
    `
      ${topBar("Reward Order Details", "/mine")}
      <section class="mine-subpage reward-orders-page">
        <div class="reward-task-tabs" aria-label="Reward task type">
          ${rewardTaskTabs
            .map(
              (task) => `
                <a class="${state.task === task.id ? "active" : ""}" href="${rewardOrdersHref({ task: task.id })}" data-link>
                  ${task.label}
                </a>
              `
            )
            .join("")}
        </div>

        ${
          isFirstSale
            ? ""
            : `
              <label class="reward-month-top">
                <span>Month</span>
                <select data-reward-orders-filter="month" aria-label="Reward order month">
                  ${state.rewardMonths
                    .map((month) => `<option value="${month.value}" ${state.month === month.value ? "selected" : ""}>${month.label}</option>`)
                    .join("")}
                </select>
              </label>
            `
        }

        ${
          isFirstSale
            ? ""
            : `
              <div class="reward-status-tabs" aria-label="Reward order status">
                ${rewardStatusFilters
                  .map(
                    (status) => `
                      <a class="${state.status === status.id ? "active" : ""}" href="${rewardOrdersHref({ status: status.id })}" data-link>
                        ${status.label}
                      </a>
                    `
                  )
                  .join("")}
              </div>
            `
        }

        <div class="reward-order-summary">
          <article>
            <span>GMV</span>
            <strong>$${totalGmv.toLocaleString()}</strong>
          </article>
          <article>
            <span>Orders</span>
            <strong>${rows.length}</strong>
          </article>
        </div>

        <div class="reward-order-list">
          ${
            rows.length
              ? rows.map(rewardOrderRow).join("")
              : `
                <div class="empty-state compact">
                  <p class="eyebrow">No orders</p>
                  <h3>No matching reward orders.</h3>
                  <p>Try another month or status.</p>
                </div>
              `
          }
        </div>
      </section>
    `,
    "mine"
  );
}

export function rewardRulesPage() {
  return pageShell(
    `
      ${topBar("Reward Rules", "/mine")}
      <section class="mine-subpage reward-rules-page">
        <article>
          <h2>Creator reward bonus</h2>
          <p>After First-Order Bonus is completed, Promo Milestone and Power Seller are unlocked for every calendar month.</p>
          <strong>Up to $80 bonus per month</strong>
        </article>
        <article>
          <span>1</span>
          <div>
            <h3>First-Order Bonus</h3>
            <b>$5 USD</b>
          </div>
          <p>When the creator's first valid order, past the refund window, is placed via their unique link, they receive an extra $5 USD bonus.</p>
        </article>
        <article>
          <span>2</span>
          <div>
            <h3>Promo Milestone</h3>
            <b>$30 USD</b>
          </div>
          <p>When monthly orders reach 15 or GMV reaches $500, a one-time $30 cash bonus is awarded.</p>
        </article>
        <article>
          <span>3</span>
          <div>
            <h3>Power Seller</h3>
            <b>+$50 USD</b>
          </div>
          <p>When monthly orders reach 50 or GMV reaches $1,500, an additional stacked one-time $50 cash bonus is awarded.</p>
        </article>
        <article>
          <h3>How orders count</h3>
          <p>Valid orders and GMV decide bonus eligibility. Estimated orders can be checked in Reward Order Details before they are confirmed.</p>
        </article>
      </section>
    `,
    "mine"
  );
}

export function bindMineInteractions(root) {
  root.querySelectorAll("[data-boost-stage]").forEach((button) => {
    button.addEventListener("click", () => {
      setBoostStage(button.dataset.boostStage);
      navigate("/mine");
    });
  });

  root.querySelectorAll("[data-boost-progress-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      saveBoostState({ progressMode: button.dataset.boostProgressMode });
      navigate("/mine");
    });
  });

  root.querySelectorAll("[data-reward-orders-filter]").forEach((select) => {
    select.addEventListener("change", () => {
      const key = select.dataset.rewardOrdersFilter;
      navigate(rewardOrdersHref({ [key]: select.value }));
    });
  });

  if (root.querySelector(".mine-page")) {
    window.setTimeout(maybeShowMineBoostModal, 180);
  }

  root.querySelector("[data-open-order-filters]")?.addEventListener("click", () => {
    showOrderFiltersSheet();
  });

  root.querySelectorAll("[data-earnings-info]").forEach((button) => {
    button.addEventListener("click", () => {
      showEarningsInfoModal(button.dataset.earningsInfo);
    });
  });

  root.querySelectorAll(".product-image-option").forEach((option) => {
    option.addEventListener("click", () => {
      root.querySelectorAll(".product-image-option").forEach((item) => item.classList.toggle("selected", item === option));
      option.querySelector("input").checked = true;
    });
  });

  root.querySelectorAll(".model-avatar-grid button").forEach((button) => {
    button.addEventListener("click", () => {
      root.querySelectorAll(".model-avatar-grid button").forEach((item) => item.classList.toggle("selected", item === button));
      const modelOption = [...root.querySelectorAll(".product-image-option")].find((option) =>
        option.textContent.includes("Use Model Images")
      );
      if (modelOption) {
        root.querySelectorAll(".product-image-option").forEach((item) => item.classList.toggle("selected", item === modelOption));
        modelOption.querySelector("input").checked = true;
      }
    });
  });

  root.querySelector("[data-generate-product-submit]")?.addEventListener("click", () => {
    creationState.status = "Producing";
    navigate("/create#museland-to-generate");
  });

  root.querySelectorAll("[data-analytics-metric]").forEach((card) => {
    card.addEventListener("click", () => {
      root.querySelectorAll("[data-analytics-metric]").forEach((item) => item.classList.toggle("active", item === card));
      const chart = root.querySelector("[data-analytics-chart]");
      if (chart) {
        chart.outerHTML = analyticsLineChart(card.dataset.analyticsMetric);
      }
    });
  });

  root.querySelectorAll("[data-analytics-info]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      showAnalyticsInfoModal(button.dataset.analyticsInfo);
    });
  });

  root.querySelectorAll("[data-promote-sort]").forEach((button) => {
    button.addEventListener("click", () => {
      root.querySelectorAll("[data-promote-sort]").forEach((item) => item.classList.toggle("active", item === button));
      sortPromoteRows(root, button.dataset.promoteSort);
      filterPromoteRows(root);
    });
  });

  root.querySelectorAll("[data-promote-type]").forEach((button) => {
    button.addEventListener("click", () => {
      root.querySelectorAll("[data-promote-type]").forEach((item) => item.classList.toggle("active", item === button));
      filterPromoteRows(root);
    });
  });

  root.querySelector("[data-promote-search]")?.addEventListener("input", () => filterPromoteRows(root));

}

function maybeShowMineBoostModal() {
  if (document.querySelector("[data-boost-mission-modal]")) return;
  if (!boostState.onboardingSeen || document.querySelector("[data-boost-onboarding]")) {
    window.setTimeout(maybeShowMineBoostModal, 400);
    return;
  }

  if (boostState.stage === "new" && !boostState.mineFirstSaleSeen) {
    showBoostMissionModal({
      eyebrow: "First-Order Bonus",
      title: "Get $5 after your first completed order.",
      copy: "Pick a product or collection to promote. Your base 15% commission stays active, and the First-Order Bonus is added on top.",
      stat: "$5 extra reward",
      onClose: () => saveBoostState({ mineFirstSaleSeen: true })
    });
    return;
  }

  if (boostState.stage === "firstSaleDone" && !boostState.firstSaleRewardSeen) {
    showBoostMissionModal({
      eyebrow: "Reward issued",
      title: "First-Order Bonus completed.",
      copy: "Your $5 bonus has been issued. Promo Milestone and Power Seller are now unlocked. Complete monthly tasks to earn up to $80 bonus every month.",
      stat: "Up to $80 monthly bonus",
      onClose: () => saveBoostState({ firstSaleRewardSeen: true })
    });
    return;
  }
}

function showBoostMissionModal({ eyebrow, title, copy, stat, onClose }) {
  document.body.insertAdjacentHTML(
    "beforeend",
    `
      <div class="boost-modal-backdrop" data-boost-mission-modal></div>
      <section class="boost-modal mission" data-boost-mission-modal role="dialog" aria-label="${title}">
        <button class="boost-modal-close" type="button" data-close-boost-mission aria-label="Close">×</button>
        <p class="eyebrow">${eyebrow}</p>
        <h2>${title}</h2>
        <p>${copy}</p>
        <div class="boost-modal-reward">${stat}</div>
        <button class="secondary-cta" type="button" data-close-boost-mission>Got it</button>
      </section>
    `
  );

  const close = () => {
    onClose?.();
    document.querySelectorAll("[data-boost-mission-modal]").forEach((node) => node.remove());
  };

  document.querySelectorAll("[data-close-boost-mission]").forEach((button) => {
    button.addEventListener("click", close);
  });
}

function showEarningsInfoModal(cardId) {
  const card = earningsSummaryCards.find((item) => item.id === cardId);
  if (!card) return;
  document.querySelectorAll("[data-earnings-info-modal]").forEach((node) => node.remove());
  document.body.insertAdjacentHTML(
    "beforeend",
    `
      <div class="boost-modal-backdrop" data-earnings-info-modal></div>
      <section class="boost-modal earnings-info-modal" data-earnings-info-modal role="dialog" aria-label="${card.label}">
        <button class="boost-modal-close" type="button" data-close-earnings-info aria-label="Close">×</button>
        <p class="eyebrow">Earnings</p>
        <h2>${card.label}</h2>
        <p>${card.info}</p>
        <button class="secondary-cta" type="button" data-close-earnings-info>Got it</button>
      </section>
    `
  );

  document.querySelectorAll("[data-close-earnings-info]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-earnings-info-modal]").forEach((node) => node.remove());
    });
  });
}

function analyticsInfoById(infoId) {
  const metric = analyticsMetrics.find((item) => `metric-${item.id}` === infoId);
  if (metric) return { title: metric.label, copy: metric.info };
  const assetMetric = promotedAssetMetrics.find((item) => `asset-${item.id}` === infoId);
  if (assetMetric) return { title: assetMetric.label, copy: assetMetric.info };
  const funnelLabel = Object.keys(analyticsFunnelInfo).find((label) => `funnel-${label.toLowerCase().replace(/\s+/g, "-")}` === infoId);
  if (funnelLabel) return { title: funnelLabel, copy: analyticsFunnelInfo[funnelLabel] };
  return null;
}

function showAnalyticsInfoModal(infoId) {
  const info = analyticsInfoById(infoId);
  if (!info) return;
  document.querySelectorAll("[data-analytics-info-modal]").forEach((node) => node.remove());
  document.body.insertAdjacentHTML(
    "beforeend",
    `
      <div class="boost-modal-backdrop" data-analytics-info-modal></div>
      <section class="boost-modal analytics-info-modal" data-analytics-info-modal role="dialog" aria-label="${info.title}">
        <button class="boost-modal-close" type="button" data-close-analytics-info aria-label="Close">×</button>
        <p class="eyebrow">Analytics</p>
        <h2>${info.title}</h2>
        <p>${info.copy}</p>
        <button class="secondary-cta" type="button" data-close-analytics-info>Got it</button>
      </section>
    `
  );

  document.querySelectorAll("[data-close-analytics-info]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-analytics-info-modal]").forEach((node) => node.remove());
    });
  });
}

function sortPromoteRows(root, key) {
  const list = root.querySelector("[data-promote-list]");
  if (!list) return;
  const rows = [...list.querySelectorAll("[data-promote-row]")];
  rows
    .sort((a, b) => Number(b.dataset[key]) - Number(a.dataset[key]))
    .forEach((row) => list.appendChild(row));
}

function filterPromoteRows(root) {
  const query = root.querySelector("[data-promote-search]")?.value.trim().toLowerCase() || "";
  const type = root.querySelector("[data-promote-type].active")?.dataset.promoteType || "all";
  root.querySelectorAll("[data-promote-row]").forEach((row) => {
    const matchesQuery = !query || row.dataset.search.includes(query);
    const matchesType = type === "all" || row.dataset.promoteType === type;
    row.hidden = !(matchesQuery && matchesType);
  });
}

function showOrderFiltersSheet() {
  document.querySelectorAll("[data-order-filters-sheet]").forEach((node) => node.remove());
  document.body.insertAdjacentHTML(
    "beforeend",
    `
      <div class="sheet-backdrop" data-order-filters-sheet></div>
      <section class="bottom-sheet order-filters-sheet" data-order-filters-sheet role="dialog" aria-label="Order filters">
        <div class="sheet-header">
          <button class="sheet-icon" type="button" data-close-order-filters aria-label="Close">×</button>
          <h2>More Filters</h2>
          <span></span>
        </div>
        <div class="sheet-body">
          <div class="filter-group">
            <span>Settlement status</span>
            <div>
              ${["Settled", "Pending", "Closed"].map((item) => `<button type="button">${item}</button>`).join("")}
            </div>
          </div>
          <div class="filter-group">
            <span>Type</span>
            <div>
              ${["Standard", "AI Look Boost", "Bonus"].map((item) => `<button type="button">${item}</button>`).join("")}
            </div>
          </div>
          <button class="primary-cta centered" type="button" data-close-order-filters>Apply Filters</button>
        </div>
      </section>
    `
  );

  document.querySelectorAll("[data-close-order-filters]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-order-filters-sheet]").forEach((node) => node.remove());
    });
  });
}

export function analyticsPage() {
  return pageShell(
    `
      ${topBar("Analytics", "/mine")}
      <section class="mine-subpage analytics-page">
        <div class="time-tabs analytics-time-tabs" aria-label="Time range">
          ${["7d", "30d", "90d", "Total"].map((chip, index) => `<button class="${index === 0 ? "active" : ""}" type="button">${chip}</button>`).join("")}
        </div>

        <div class="analytics-cards large" data-analytics-metrics>
          ${analyticsMetrics
            .map(
              (metric, index) => `
                <article class="${index === 0 ? "active" : ""}" data-analytics-metric="${metric.id}">
                  <span class="analytics-card-label">
                    ${metric.label}
                    <button type="button" data-analytics-info="metric-${metric.id}" aria-label="${metric.label} info">i</button>
                  </span>
                  <strong>${metric.value}</strong>
                </article>
              `
            )
            .join("")}
        </div>

        ${analyticsLineChart("clicks")}

        <div class="analytics-section-heading">
          <p class="eyebrow">Funnel</p>
          <h2>Full promotion funnel</h2>
        </div>
        <div class="funnel-list">
          ${analyticsOverview.funnel
            .map(([label, value]) => {
              const infoId = `funnel-${label.toLowerCase().replace(/\s+/g, "-")}`;
              return `
                <article>
                  <span>
                    ${label}
                    <button type="button" data-analytics-info="${infoId}" aria-label="${label} info">i</button>
                  </span>
                  <strong>${value}</strong>
                </article>
              `;
            })
            .join("")}
        </div>

        <div class="analytics-section-heading">
          <p class="eyebrow">Promoted assets</p>
          <h2>Products & collections</h2>
        </div>
        <label class="asset-search analytics-search">
          <input type="search" data-promote-search placeholder="Search products or collections..." />
        </label>
        <div class="sort-chip-row analytics-type-row" aria-label="Filter promoted assets">
          <button type="button" data-promote-type="all" class="active">All</button>
          <button type="button" data-promote-type="product">Product</button>
          <button type="button" data-promote-type="collection">Collection</button>
        </div>
        <div class="sort-chip-row analytics-sort-row" aria-label="Sort promoted assets">
          ${promotedAssetMetrics
            .map(
              (metric) => `
                <button type="button" data-promote-sort="${metric.id}" class="${metric.id === "units" ? "active" : ""}">
                  ${metric.label}
                </button>
              `
            )
            .join("")}
        </div>
        <div class="promote-analytics-list" data-promote-list>
          ${promoteRows()
            .sort((a, b) => b.units - a.units)
            .map(promoteRow)
            .join("")}
        </div>
      </section>
    `,
    "mine"
  );
}

export function analyticsCollectionPage({ collectionId }) {
  const collection = collections.find((item) => item.id === collectionId) || collections[0];
  const rows = collectionProductRows(collection.id).sort((a, b) => b.units - a.units);
  return pageShell(
    `
      ${topBar("Collection Analytics", "/mine/analytics")}
      <section class="mine-subpage analytics-page">
        <div class="collection-analytics-hero">
          <p class="eyebrow">Collection</p>
          <h1>${collection.title}</h1>
          <p>Product-level performance inside this promoted collection.</p>
        </div>
        <label class="asset-search analytics-search">
          <input type="search" data-promote-search placeholder="Search products..." />
        </label>
        <div class="sort-chip-row analytics-sort-row" aria-label="Sort collection products">
          ${promotedAssetMetrics
            .map(
              (metric) => `
                <button type="button" data-promote-sort="${metric.id}" class="${metric.id === "units" ? "active" : ""}">
                  ${metric.label}
                </button>
              `
            )
            .join("")}
        </div>
        <div class="promote-analytics-list" data-promote-list>
          ${rows.map(promoteRow).join("")}
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
        ${
          hasDesigns()
            ? `
              <article class="design-card">
                <a href="/mine/designs/${creation.id}" data-link>
                  <img src="${creation.assets[1].image}" alt="${creation.title}" />
                  <div>
                    <span class="status-pill">${creation.status}</span>
                    <h2>${creation.title}</h2>
                    <p>${creation.savedDesigns.length || 1} generated design${(creation.savedDesigns.length || 1) > 1 ? "s" : ""} · ${creation.createdAt}</p>
                  </div>
                </a>
              </article>
            `
            : `
              <div class="empty-state design-empty-state">
                <p class="eyebrow">No designs yet</p>
                <h3>Start your first dress.</h3>
                <p>Choose a silhouette, design a print, and generate product images.</p>
                <a class="primary-cta centered" href="/museland" data-link>+ New Design</a>
              </div>
            `
        }
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
  const generatedCount = Math.max(creation.savedDesigns.length, 1);
  const designedProducts = Array.from({ length: generatedCount }, (_, index) => ({
    label: `Designed product ${index + 1}`,
    image: index % 2 ? creation.pattern.image : creation.silhouette.image
  }));
  return pageShell(
    `
      ${topBar("Generate Product", "/mine/designs")}
      <section class="creation-detail-page">
        <section class="publish-ready-hero">
          <p class="eyebrow">${generatedCount} designed product${generatedCount > 1 ? "s" : ""}</p>
          <div class="designed-product-closet" aria-label="Designed products">
            ${designedProducts
              .map(
                (item) => `
                  <article class="designed-product-tile">
                    <img src="${item.image}" alt="${item.label}" />
                  </article>
                `
              )
              .join("")}
          </div>
        </section>

        <section class="product-image-source">
          <div class="section-heading-row">
            <div>
              <h2>Choose product Avatar</h2>
            </div>
          </div>
          <label class="product-image-option selected">
            <input type="radio" name="product-image-source" checked />
            <img src="${creation.avatar.image}" alt="" />
            <span>
              <strong>Use My Avatar</strong>
              <small>Use Aria's creator image for product photos.</small>
            </span>
          </label>
          <button class="upload-avatar-action" type="button">Upload New Avatar</button>
          <label class="product-image-option">
            <input type="radio" name="product-image-source" />
            <img src="${creation.silhouette.image}" alt="" />
            <span>
              <strong>Use Model Images</strong>
              <small>Choose platform model images for faster product generation.</small>
            </span>
          </label>
          <div class="model-avatar-grid">
            ${[
              ["White", creation.silhouette.image],
              ["Black", creation.avatar.image],
              ["Asian", creation.silhouette.image],
              ["Petite", creation.avatar.image],
              ["Tall", creation.silhouette.image],
              ["Curvy", creation.avatar.image]
            ]
              .map(([label, image], index) => `
                <button class="${index === 0 ? "selected" : ""}" type="button">
                  <img src="${image}" alt="" />
                  <span>${label}</span>
                </button>
              `)
              .join("")}
          </div>
        </section>

        <div class="creation-action-bar">
          <button class="primary-cta" type="button" data-generate-product-submit>Generate Product</button>
        </div>
      </section>
    `,
    "mine"
  );
}

export function productsPage() {
  const creation = getCreationRecord();
  return pageShell(
    `
      ${topBar("My Products", "/mine")}
      <section class="design-list-page">
        <article class="design-card">
          <a href="/publish/${creation.id}" data-link>
            <img src="${creation.silhouette.image}" alt="${creation.title}" />
            <div>
              <span class="status-pill creating">${creationState.status === "Producing" ? "Producing" : "Draft"}</span>
              <h2>${creation.title}</h2>
              <p>${creationState.status === "Producing" ? "Product images and listing are being generated." : "Ready to generate product listing."}</p>
            </div>
          </a>
        </article>
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
