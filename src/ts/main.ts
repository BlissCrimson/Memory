import { renderRoute } from "../router";
import "/src/styles/main.scss";

init();

/**
 * Start the router to change pages.
 *
 * @returns {void}
 */
function init() {
  renderRoute(window.location.pathname);
}
