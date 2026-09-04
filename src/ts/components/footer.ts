import { navigate } from "../../router";
import { createErrorPage } from "../pages/404";
import { buildFooterMarkup } from "./footer.templates";

/**
 * Registers the click handler for the imprint link in the footer.
 *
 * @param footerRef - The footer container element.
 * @returns {void}
 */
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
