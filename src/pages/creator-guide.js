import { navigate } from "../scripts/router.js";

const guideSteps = [
  {
    number: "01",
    title: "Select",
    body: "Choose products that match your audience, style, and commission goal.",
    visual: "select"
  },
  {
    number: "02",
    title: "AI Tryon Looks",
    body: "No sample needed. Create AI Tryon Looks first and test what your audience likes.",
    visual: "tryon"
  },
  {
    number: "03",
    title: "Promote",
    body: "Tap Promote to get your unique short link and post it with your content.",
    visual: "promote"
  },
  {
    number: "04",
    title: "Get Earned",
    body: "Earn commission from orders. Creator tasks and selected products can increase earnings up to 30%.",
    visual: "earned"
  }
];

function guideStepCard(step) {
  return `
    <article class="creator-guide-step">
      <span>${step.number}</span>
      <h2>${step.title}</h2>
      <p>${step.body}</p>
      <div class="creator-guide-visual ${step.visual}" aria-label="${step.title} UI placeholder"></div>
    </article>
  `;
}

export function creatorGuidePage() {
  return `
    <main class="phone-canvas creator-guide-shell">
      <div class="page-content">
        <section class="creator-guide-page">
          <header class="creator-guide-hero">
            <p class="app-time">9:41</p>
            <p class="eyebrow">MUSESELECT</p>
            <h1>Creator Guide</h1>
            <p>Select products. Create AI Tryon Looks. Promote your link. Get earned up to 30%.</p>
          </header>

          <section class="creator-guide-path" aria-label="Creator earning path">
            <strong>Select</strong>
            <i></i>
            <strong>AI Tryon Looks</strong>
            <i></i>
            <strong>Promote</strong>
            <i></i>
            <strong>Get Earned</strong>
          </section>

          <section class="creator-guide-steps">
            ${guideSteps.map(guideStepCard).join("")}
          </section>
        </section>
      </div>
      <div class="creator-guide-action">
        <a class="primary-cta centered" href="/for-u" data-link data-explore-home>EXPLORE NOW</a>
      </div>
    </main>
  `;
}

export function bindCreatorGuideInteractions(root) {
  root.querySelector("[data-explore-home]")?.addEventListener("click", (event) => {
    event.preventDefault();
    navigate("/for-u");
  });
}
