import { navigate } from "../../router";

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
  const BASE_URL = import.meta.env.BASE_URL;
  document.body.innerHTML = `
    <div id="app">
      <section class="error">
          <h1>404</h1>
          <span>This page does not exist.</span>
          <button class="button button__entry">
              <img class="icon icon__entry icon__entry--button" src="${BASE_URL}assets/icons/arrow.svg" alt="arrow">
              <p>Back to start</p>
          </button>
      </section>
      <img class="icon icon__entry icon__entry--big" src="${BASE_URL}assets/icons/stadia_controller.svg" alt="controller">
    </div>
  `;
  const backButtonRef = document.querySelector(".error .button__entry");
  backButtonRef?.addEventListener("click", () => navigate("/"));
}
