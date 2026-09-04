import { navigate } from "../../router";
import { createErrorPage } from "./404";
import { buildImprintMarkup } from "./imprint.templates";

/**
 * Registers the click event listener for the "Back to start" button on the imprint page.
 *
 * @param imprintRef - The imprint page container element.
 * @returns {void}
 */
function registerImprintBackButton(imprintRef: HTMLElement): void {
  const backButtonRef = imprintRef.querySelector("[data-back]");
  backButtonRef?.addEventListener("click", () => navigate("/"));
}

/**
 * Show the Imprint (Impressum) page.
 *
 * @returns {void}
 */
export function createImprintPage() {
  const imprintRef = document.querySelector<HTMLElement>("#app");
  if (!imprintRef) return createErrorPage();

  imprintRef.innerHTML = buildImprintMarkup();
  registerImprintBackButton(imprintRef);
}
