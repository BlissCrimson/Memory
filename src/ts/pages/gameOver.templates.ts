import type { ResultScore } from "../types/score.types";

/** Code shows arrow/flag player icons + a "Blue"/"Orange" label; the other themes show plain pawn icons. */
const SCORE_ICON: Record<string, string> = {
  code: "assets/icons/player-{player}.svg",
  games: "assets/icons/chess_pawn-{player}.svg",
  projects: "assets/icons/chess_pawn-{player}.svg",
  food: "assets/icons/chess_pawn-{player}.svg",
};

/**
 * Builds the HTML markup for a single Game Over score item.
 *
 * @param theme - The active game over theme.
 * @param color - The player color the score belongs to.
 * @param iconSrc - The icon source URL for the score badge.
 * @param value - The score value.
 * @returns {string} The HTML markup for the score item.
 */
function scoreItemMarkup(
  theme: string,
  color: "blue" | "orange",
  iconSrc: string,
  value: number,
): string {
  return `
    <span class="game-over__score-item game-over__score-item--${color}">
      <img src="${iconSrc}" alt="${color}">
      ${theme === "code" ? `<span class="game-over__score-label">${color === "blue" ? "Blue" : "Orange"}</span>` : ""}
      ${value}
    </span>
  `;
}

/**
 * Builds the HTML markup for the Game Over score items, ordered per theme.
 *
 * Mockups order the score badges differently per theme: Code shows
 * Blue before Orange, the other 3 themes show Orange before Blue.
 *
 * @param theme - The active game over theme.
 * @param score - The final result score.
 * @returns {string} The HTML markup for the score items.
 */
function buildScoreItemsMarkup(theme: string, score: ResultScore): string {
  const BASE_URL = import.meta.env.BASE_URL;
  const blueIconSrc = `${BASE_URL}${SCORE_ICON[theme].replace("{player}", "blue")}`;
  const orangeIconSrc = `${BASE_URL}${SCORE_ICON[theme].replace("{player}", "orange")}`;
  return theme === "code"
    ? scoreItemMarkup(theme, "blue", blueIconSrc, score.blue) +
        scoreItemMarkup(theme, "orange", orangeIconSrc, score.orange)
    : scoreItemMarkup(theme, "orange", orangeIconSrc, score.orange) +
        scoreItemMarkup(theme, "blue", blueIconSrc, score.blue);
}

/**
 * Builds the HTML markup for the Game Over page.
 *
 * @param theme - The active game over theme.
 * @param score - The final result score.
 * @returns {string} The HTML markup for the Game Over page.
 */
export function buildGameOverMarkup(theme: string, score: ResultScore): string {
  return `
    <section class="game-over" data-theme="${theme}" role="button" tabindex="0" data-continue>
      <h2 class="game-over__title">Game over</h2>
      <p class="game-over__lead">Final score</p>
      <div class="game-over__score">
        ${buildScoreItemsMarkup(theme, score)}
      </div>
    </section>
  `;
}
