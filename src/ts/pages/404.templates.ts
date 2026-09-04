/**
 * Builds the HTML markup for the 404 error page.
 *
 * Inline styles duplicate the core _404.scss values (centered layout,
 * background/text colors) as a fallback in case the SCSS bundle fails to
 * load - the page stays readable/centered either way.
 *
 * @returns {string} The HTML markup for the 404 error page.
 */
export function buildErrorPageMarkup(): string {
  const BASE_URL = import.meta.env.BASE_URL;
  return `
    <div id="app" style="min-height:100vh;">
      <section class="error" style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;min-height:100vh;background:#303131;color:#ffffff;text-align:center;font-family:sans-serif;">
          <h2 style="margin:0;font-size:72px;">404</h2>
          <span style="color:#c9c9c9;font-size:20px;">This page does not exist.</span>
          <button class="button button__entry">
              <img class="icon icon__entry icon__entry--button" src="${BASE_URL}assets/icons/arrow.svg" alt="arrow">
              <p>Back to start</p>
          </button>
      </section>
      <img class="icon icon__entry icon__entry--big" src="${BASE_URL}assets/icons/stadia_controller.svg" alt="controller">
    </div>
  `;
}
