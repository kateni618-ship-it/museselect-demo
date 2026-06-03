import { homePage } from "../pages/home.js";
import { bindMuselandInteractions, muselandPage } from "../pages/museland.js";
import {
  analyticsPage,
  commissionPage,
  creationDetailPage,
  designsPage,
  minePage,
  simpleMineSubpage
} from "../pages/mine.js";
import { bindPicksInteractions, collectionDetailPage, picksPage } from "../pages/picks.js";
import { bindPublishInteractions, publishPage } from "../pages/publish.js";
import { bindProductDetailInteractions, productDetailPage } from "../pages/product-detail.js";
import { selectPage } from "../pages/select.js";
import { bindRouterLinks, registerRoute, renderCurrentRoute } from "./router.js";

const app = document.querySelector("#app");

function render(html, bind) {
  app.innerHTML = html;
  bindRouterLinks(app);
  bind?.(app);
  window.scrollTo(0, 0);
}

registerRoute("/for-u", () => render(homePage(), bindProductDetailInteractions));
registerRoute("/home", () => render(homePage(), bindProductDetailInteractions));
registerRoute("/select", () => render(selectPage(), bindProductDetailInteractions));
registerRoute("/product/:productId", (params) =>
  render(productDetailPage(params), bindProductDetailInteractions)
);
registerRoute("/museland", () => render(muselandPage(), bindMuselandInteractions));
registerRoute("/museland/:stepId", (params) => render(muselandPage(params), bindMuselandInteractions));
registerRoute("/picks", () =>
  render(picksPage(), (root) => {
    bindProductDetailInteractions(root);
    bindPicksInteractions(root);
  })
);
registerRoute("/picks/collections/:collectionId", (params) =>
  render(collectionDetailPage(params), bindProductDetailInteractions)
);
registerRoute("/mine", () => render(minePage()));
registerRoute("/mine/commission", () => render(commissionPage()));
registerRoute("/mine/analytics", () => render(analyticsPage()));
registerRoute("/mine/designs", () => render(designsPage()));
registerRoute("/mine/designs/:designId", () => render(creationDetailPage()));
registerRoute("/mine/products", () =>
  render(simpleMineSubpage("My Products", "Published and draft products will be expanded in Phase 1D."))
);
registerRoute("/mine/avatar", () =>
  render(simpleMineSubpage("My Avatar", "Creator avatar management will be expanded after the core publishing flow."))
);
registerRoute("/publish/:designId", () => render(publishPage(), bindPublishInteractions));

renderCurrentRoute();
