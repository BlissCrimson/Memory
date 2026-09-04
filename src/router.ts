import { createHomePage } from "./ts/pages/home";
import { createSettingsPage } from "./ts/pages/settings";
import { createGamePage } from "./ts/pages/game";
import { createResultPage } from "./ts/pages/result";
import { createGameOverPage } from "./ts/pages/gameOver";
import { createImprintPage } from "./ts/pages/imprint";
import { createErrorPage } from "./ts/pages/404";

type RouteHandler = (...params: string[]) => unknown;

const routes: Record<string, RouteHandler> = {
  "/": createHomePage,
  "/settings": createSettingsPage,
  "/game": createGamePage,
  "/game-over": createGameOverPage,
  "/result": createResultPage,
  "/imprint": createImprintPage,
  "/404": createErrorPage,
};

/**
 * Renders the page corresponding to the given path.
 *
 * @param path - The path of the route to render.
 * @returns {void}
 */
export function renderRoute(path: string) {
  document.body.removeAttribute("data-theme");
  const BASE_URL = import.meta.env.BASE_URL;
  const fn = routes[path];
  if (fn) {
    fn();
    return;
  }
  startWithBaseUrl(path, BASE_URL);
}

/**
 * Strips the base URL from a path and normalizes it to a route key.
 *
 * @param path - The path of the route to render.
 * @param BASE_URL - The base URL the app is served from.
 * @returns {string} The normalized route key.
 */
function stripBaseUrl(path: string, BASE_URL: string): string {
  const stripped = path.slice(BASE_URL.length);
  return stripped === "" ? "/" : "/" + stripped;
}

/**
 * Checks whether the path starts with the base URL and renders the matching route.
 *
 * @param path - The path of the route to render.
 * @param BASE_URL - The base URL the app is served from.
 * @returns {void}
 */
function startWithBaseUrl(path: string, BASE_URL: string) {
  if (!path.startsWith(BASE_URL)) {
    render404Page();
    return;
  }
  const normalized = stripBaseUrl(path, BASE_URL);
  const fallbackFn = routes[normalized];
  if (fallbackFn) {
    fallbackFn();
  } else {
    render404Page();
  }
}

/**
 * Navigates to the specified route and renders the corresponding page.
 *
 * @param path - The path of the route to render.
 * @returns {void}
 */
export function navigate(path: string) {
  const BASE_URL = import.meta.env.BASE_URL;
  const strippedPath = path.slice(1);
  history.pushState(null, "", BASE_URL + strippedPath);
  renderRoute(path);
}

/**
 * Render the 404 error page.
 *
 * @returns {void}
 */
function render404Page() {
  routes["/404"]();
}

window.addEventListener("popstate", () => {
  renderRoute(window.location.pathname);
});
