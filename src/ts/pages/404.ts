import { navigate } from "../../router";
import { buildErrorPageMarkup } from "./404.templates";

/**
 * Registers the click event listener for the "Back to start" button on the error page.
 *
 * @returns {void}
 */
function registerErrorPageBackLink(): void {
  const backButtonRef = document.querySelector(".error .button__entry");
  backButtonRef?.addEventListener("click", () => navigate("/"));
}

/**
 * Show the error page.
 *
 * This does not rely on "#app" being present, since it is also used as a
 * fallback when "#app" itself could not be found (e.g. on imprint.html).
 * It writes directly into the body and recreates "#app" so subsequent
 * navigation keeps working.
 *
 * @returns {void}
 */
export function createErrorPage() {
  document.body.innerHTML = buildErrorPageMarkup();
  registerErrorPageBackLink();
}
