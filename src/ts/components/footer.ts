import { navigate } from "../../router";
import { createErrorPage } from "../pages/404";

function buildFooterMarkup(): string {
  const BASE_URL = import.meta.env.BASE_URL;
  return `
        <a class="link" href="${BASE_URL}imprint" data-imprint>Impressum</a>
    `;
}

function registerFooterLinkHandler(footerRef: Element): void {
  const imprintLinkRef = footerRef.querySelector("[data-imprint]");
  imprintLinkRef?.addEventListener("click", (event) => {
    event.preventDefault();
    navigate("/imprint");
  });
}

/**
 * Show the footer on pages with footer.
 *
 * @returns {void}
 */
export function createFooter() {
  const footerRef = document.querySelector("#imprint");
  if (!footerRef) return createErrorPage();
  footerRef.innerHTML = buildFooterMarkup();
  registerFooterLinkHandler(footerRef);
}
