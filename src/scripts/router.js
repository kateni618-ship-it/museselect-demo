import { appBasePath, withBasePath } from "./base-path.js";

const routes = [];

export function registerRoute(pattern, handler) {
  const keys = [];
  const regex = new RegExp(
    `^${pattern
      .replace(/\/+$/, "")
      .replace(/:[^/]+/g, (match) => {
        keys.push(match.slice(1));
        return "([^/]+)";
      })}/?$`
  );
  routes.push({ regex, keys, handler });
}

export function navigate(path) {
  window.history.pushState({}, "", withBasePath(path));
  renderCurrentRoute();
}

export function renderCurrentRoute() {
  const appPath = stripBasePath(window.location.pathname);
  const path = appPath === "/" ? "/for-u" : appPath;
  const match = routes.find((route) => route.regex.test(path));
  if (!match) {
    navigate("/home");
    return;
  }

  const values = path.match(match.regex).slice(1);
  const params = Object.fromEntries(match.keys.map((key, index) => [key, values[index]]));
  match.handler(params);
}

function stripBasePath(pathname) {
  if (appBasePath && pathname.startsWith(appBasePath)) {
    return pathname.slice(appBasePath.length) || "/";
  }
  return pathname;
}

export function bindRouterLinks(root = document) {
  root.querySelectorAll("[data-link]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      navigate(link.getAttribute("href"));
    });
  });
}

if (typeof window !== "undefined") {
  window.addEventListener("popstate", renderCurrentRoute);
}
