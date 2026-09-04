/**
 * Builds the HTML markup for the home page.
 *
 * @returns {string} The HTML markup for the home page.
 */
export function buildHomeMarkup(): string {
  const BASE_URL = import.meta.env.BASE_URL;
  return `
        <div class="container">
        <section class="welcome">
            <span class="welcome__intro">It's play time.</span>
            <h1>Ready to play?</h1>
            <button class="button button__entry">
                <span class="button__entry-label">
                    <img class="icon icon__entry icon__entry--button" src="${BASE_URL}assets/icons/stadia_controller.svg" alt="">
                    <p>Play</p>
                </span>
                <img class="icon icon__entry icon__entry--arrow" src="${BASE_URL}assets/icons/arrow.svg" alt="">
            </button>
        </section>
        <img class="icon icon__entry icon__entry--big" src="${BASE_URL}assets/icons/stadia_controller.svg" alt="">
        </div>
        <footer id="imprint"></footer>
      `;
}
