import { createErrorPage } from "../pages/404";

export function createFooter() {
  let footerRef = document.querySelector("#imprint");
  if (!footerRef) return createErrorPage();
  footerRef.innerHTML = `
        <a class="link" href="imprint.html">Impressum</a>
    `;
}
