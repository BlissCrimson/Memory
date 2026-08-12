import { createWelcomePage } from "./ts/pages/start";
import { createSettingsPage } from "./ts/pages/settings";
import { createGamePage } from "./ts/pages/game";

type RouteHandler = (...params: string[]) => unknown;

const routes: Record<string, RouteHandler> = {
  "/": createWelcomePage,
  "/settings": createSettingsPage,
  "/game": createGamePage,
};

/**
 * Renders the page corresponding to the given path.
 *
 * @param {string} path - The path of the route to render.
 */
export function renderRoute(path: string) {
  const fn = routes[path];
  if (fn) {
    fn();
    return;
  }
}

/**
 * Navigates to the specified route and renders the corresponding page.
 *
 * @param {string} route - The route to navigate to (e.g., 'home', 'search'),
 */
export function navigate(path: string) {
  history.pushState(null, "", path);
  renderRoute(path);
}
