import type { Player } from "../types/player.types";

const WINNER_ICON: Record<string, string> = {
  code: "assets/icons/chess_pawn-{player}.svg",
  games: "assets/icons/pockal 1.svg",
  projects: "assets/icons/chess_pawn-{player}.svg",
  food: "assets/icons/chess_pawn-{player}.svg",
};

const DRAW_ICON: Record<string, string> = {
  code: "assets/icons/scale_codeTheme.svg",
  games: "assets/icons/scale_gameTheme.svg",
  projects: "assets/icons/scale_projectsTheme.svg",
  food: "assets/icons/scale_foodTheme.svg",
};

const DRAW_TITLE_ASSET: Partial<Record<string, string>> = {
  code: "assets/img/themes/code/draw-white.svg",
  projects: "assets/img/themes/projects/draw.svg",
};

const PLAYER_LABELS: Record<Player, string> = {
  blue: "Blue Player",
  orange: "Orange Player",
};

const BUTTON_LABELS: Record<string, string> = {
  code: "Back to start",
  games: "Home",
  projects: "Home",
  food: "Home",
};

const CONFETTI_PIECE_COUNT = 12;

/**
 * Builds the HTML markup for the draw title based on the theme.
 *
 * @param theme - The active result theme.
 * @returns {string} The HTML markup for the draw title.
 */
export function buildDrawTitleMarkup(theme: string): string {
  const BASE_URL = import.meta.env.BASE_URL;
  const drawTitleAsset = DRAW_TITLE_ASSET[theme];
  return drawTitleAsset
    ? `<img class="result__title-img" src="${BASE_URL}${drawTitleAsset}" alt="DRAW">`
    : `<h2 class="result__title result__title--draw">DRAW</h2>`;
}

/**
 * Builds the HTML markup for the result headline based on the theme, winner, and draw status.
 *
 * @param theme - The active result theme.
 * @param winner - The winning player (ignored when isDraw is true).
 * @param isDraw - Whether the round ended in a draw.
 * @returns {string} The HTML markup for the result headline.
 */
export function buildHeadlineMarkup(
  theme: string,
  winner: Player,
  isDraw: boolean,
): string {
  const BASE_URL = import.meta.env.BASE_URL;
  if (isDraw) {
    const drawIconSrc = `${BASE_URL}${DRAW_ICON[theme]}`;
    return `
      <img class="result__icon result__icon--draw" src="${drawIconSrc}" alt="">
      <p class="result__lead">It's a</p>
      ${buildDrawTitleMarkup(theme)}
    `;
  }
  const winnerIconSrc = `${BASE_URL}${WINNER_ICON[theme].replace("{player}", winner)}`;
  return `
      <p class="result__lead">The winner is</p>
      <h2 class="result__title result__title--winner result__title--${winner}">${PLAYER_LABELS[winner]}</h2>
      <div class="result__icon-panel">
        <img class="result__icon result__icon--winner" src="${winnerIconSrc}" alt="${PLAYER_LABELS[winner]}">
      </div>
    `;
}

/**
 * Builds the HTML markup for the confetti effect.
 *
 * @returns {string} The HTML markup for the confetti effect.
 */
export function buildConfettiMarkup(): string {
  const piece = `<span class="result__confetti-piece"></span>`;
  return `<div class="result__confetti" aria-hidden="true">${piece.repeat(CONFETTI_PIECE_COUNT)}</div>`;
}

/**
 * Builds the HTML markup for the result page based on the theme, draw status, and winner.
 *
 * @param theme - The active result theme.
 * @param isDraw - Whether the round ended in a draw.
 * @param winner - The winning player (ignored when isDraw is true).
 * @returns {string} The HTML markup for the result page.
 */
export function buildResultMarkup(
  theme: string,
  isDraw: boolean,
  winner: Player,
): string {
  return `
    <section class="result" data-theme="${theme}" data-outcome="${isDraw ? "draw" : "winner"}">
        ${buildConfettiMarkup()}
        <div class="result__headline">
            ${buildHeadlineMarkup(theme, winner, isDraw)}
        </div>
        <button class="result__button" data-back>${BUTTON_LABELS[theme]}</button>
    </section>
  `;
}
