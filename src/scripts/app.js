import { homePage } from "../pages/home.js";
import { bindMuselandInteractions, muselandPage } from "../pages/museland.js";
import {
  analyticsPage,
  analyticsCollectionPage,
  bindMineInteractions,
  commissionPage,
  commissionRulesPage,
  creationDetailPage,
  designsPage,
  minePage,
  productsPage,
  rewardRulesPage,
  rewardOrdersPage,
  simpleMineSubpage
} from "../pages/mine.js";
import { bindCreateLookInteractions, createLookPage } from "../pages/create-look.js";
import { bindCreateVideoInteractions, createVideoPage } from "../pages/create-video.js";
import { bindPicksInteractions, collectionDetailPage, externalCollectionPage, picksPage } from "../pages/picks.js";
import { bindPublishInteractions, publishPage } from "../pages/publish.js";
import { bindProductDetailInteractions, productDetailPage } from "../pages/product-detail.js";
import { selectPage, selectTopicPage } from "../pages/select.js";
import { bindRouterLinks, navigate, registerRoute, renderCurrentRoute } from "./router.js";
import { bindCreateInteractions, createPage } from "../pages/create.js";
import { bindCreatorGuideInteractions, creatorGuidePage } from "../pages/creator-guide.js";

const app = document.querySelector("#app");
let onboardingPromptQueued = false;

function render(html, bind) {
  const appPath = window.location.pathname;
  if (!appPath.endsWith("/picks") && !appPath.includes("/picks/")) {
    document.querySelector("[data-tryon-cart-floating]")?.remove();
    document.querySelectorAll("[data-tryon-cart-sheet]").forEach((node) => node.remove());
  }
  app.innerHTML = html;
  bindRouterLinks(app);
  bind?.(app);
  window.scrollTo(0, 0);
  queueCreatorBoostOnboarding();
}

function queueCreatorBoostOnboarding() {
  if (!isForUEntryRoute() || onboardingPromptQueued) return;
  onboardingPromptQueued = true;
  window.setTimeout(showCreatorBoostOnboarding, 280);
}

function isForUEntryRoute() {
  const appPath = window.location.pathname.replace(/\/+$/, "") || "/";
  return appPath === "/" || appPath.endsWith("/for-u") || appPath.endsWith("/home");
}

function showCreatorBoostOnboarding() {
  if (!isForUEntryRoute() || document.querySelector("[data-boost-onboarding]")) return;
  document.body.insertAdjacentHTML(
    "beforeend",
    `
      <div class="boost-modal-backdrop" data-boost-onboarding></div>
      <section class="boost-modal onboarding" data-boost-onboarding role="dialog" aria-label="Creator commission activated">
        <button class="boost-modal-close" type="button" data-close-boost-onboarding aria-label="Close">×</button>
        <p class="eyebrow">Creator path</p>
        <h2>Start earning with MUSESELECT</h2>
        <p>Select → AI Tryon Looks → Promote → Get earned up to 30%</p>
        <div class="boost-modal-stats onboarding-path">
          <article>
            <span>1</span>
            <strong>Select</strong>
          </article>
          <article>
            <span>2</span>
            <strong>AI Tryon Looks</strong>
          </article>
          <article>
            <span>3</span>
            <strong>Promote</strong>
          </article>
          <article>
            <span>4</span>
            <strong>Earn 30%</strong>
          </article>
        </div>
        <button class="primary-cta" type="button" data-open-creator-guide>LEARN MORE</button>
        <button class="secondary-cta" type="button" data-close-boost-onboarding>EXPLORE NOW</button>
      </section>
    `
  );

  const close = () => {
    document.querySelectorAll("[data-boost-onboarding]").forEach((node) => node.remove());
  };

  document.querySelectorAll("[data-close-boost-onboarding]").forEach((button) => {
    button.addEventListener("click", close);
  });
  document.querySelector("[data-open-creator-guide]")?.addEventListener("click", () => {
    close();
    navigate("/creator-guide");
  });
}

registerRoute("/creator-guide", () => render(creatorGuidePage(), bindCreatorGuideInteractions));
registerRoute("/for-u", () => render(homePage(), bindProductDetailInteractions));
registerRoute("/home", () => render(homePage(), bindProductDetailInteractions));
registerRoute("/select", () => render(selectPage(), bindProductDetailInteractions));
registerRoute("/select/:topicId", (params) => render(selectTopicPage(params), bindProductDetailInteractions));
registerRoute("/product/:productId", (params) =>
  render(productDetailPage(params), bindProductDetailInteractions)
);
registerRoute("/museland", () => render(muselandPage(), bindMuselandInteractions));
registerRoute("/museland/:stepId", (params) => render(muselandPage(params), bindMuselandInteractions));
registerRoute("/create", () => render(createPage(), bindCreateInteractions));
registerRoute("/picks", () =>
  render(picksPage(), (root) => {
    bindProductDetailInteractions(root);
    bindPicksInteractions(root);
  })
);
registerRoute("/picks/collections/:collectionId", (params) =>
  render(collectionDetailPage(params), (root) => {
    bindProductDetailInteractions(root);
    bindPicksInteractions(root);
  })
);
registerRoute("/share/collections/:collectionId", (params) =>
  render(externalCollectionPage(params), bindProductDetailInteractions)
);
registerRoute("/create-look", () => render(createLookPage(), bindCreateLookInteractions));
registerRoute("/create-video", () => render(createVideoPage(), bindCreateVideoInteractions));
registerRoute("/mine", () => render(minePage(), bindMineInteractions));
registerRoute("/mine/rewards/orders", () => render(rewardOrdersPage(), bindMineInteractions));
registerRoute("/mine/rewards/rules", () => render(rewardRulesPage(), bindMineInteractions));
registerRoute("/mine/commission", () => render(commissionPage(), bindMineInteractions));
registerRoute("/mine/commission/rules", () => render(commissionRulesPage(), bindMineInteractions));
registerRoute("/mine/analytics", () =>
  render(analyticsPage(), (root) => {
    bindMineInteractions(root);
    bindProductDetailInteractions(root);
  })
);
registerRoute("/mine/analytics/collections/:collectionId", (params) =>
  render(analyticsCollectionPage(params), (root) => {
    bindMineInteractions(root);
    bindProductDetailInteractions(root);
  })
);
registerRoute("/mine/designs", () => render(designsPage()));
registerRoute("/mine/designs/:designId", () => render(creationDetailPage(), bindMineInteractions));
registerRoute("/mine/products", () => render(productsPage()));
registerRoute("/mine/avatar", () =>
  render(simpleMineSubpage("My Avatar", "Creator avatar management will be expanded after the core publishing flow."))
);
registerRoute("/publish/:designId", () => render(publishPage(), bindPublishInteractions));

renderCurrentRoute();
