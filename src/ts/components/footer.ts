import { createErrorPage } from "../pages/404";

/**
 * Show the footer on pages with footer.
 *
 * @returns {void}
 */
export function createFooter() {
  let footerRef = document.querySelector("#imprint");
  if (!footerRef) return createErrorPage();
  footerRef.innerHTML = `
        <a class="link" href="imprint.html">Impressum</a>
    `;
}
