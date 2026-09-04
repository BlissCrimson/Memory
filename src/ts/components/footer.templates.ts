/**
 * Builds the HTML markup for the footer.
 *
 * @returns {string} The HTML markup for the footer.
 */
export function buildFooterMarkup(): string {
  const BASE_URL = import.meta.env.BASE_URL;
  return `
        <a class="link" href="${BASE_URL}imprint" data-imprint>Impressum</a>
    `;
}
