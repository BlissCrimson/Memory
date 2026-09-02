import { navigate } from "../../router";
import { createErrorPage } from "../pages/404";

/**
 * Show the footer on pages with footer.
 *
 * @returns {void}
 */
export function createFooter() {
  let footerRef = document.querySelector("#imprint");
  if (!footerRef) return createErrorPage();
  const BASE_URL = import.meta.env.BASE_URL;
  footerRef.innerHTML = `
        <a class="link" href="${BASE_URL}imprint" data-imprint>Impressum</a>
    `;

  const imprintLinkRef = footerRef.querySelector("[data-imprint]");
  imprintLinkRef?.addEventListener("click", (event) => {
    event.preventDefault();
    navigate("/imprint");
  });
}
