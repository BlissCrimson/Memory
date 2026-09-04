import type { Player } from "../types/player.types";

/** Code shows arrow/flag player icons for the score badges; the other themes show plain pawn icons (same distinction as gameOver.ts/result.ts). */
export const SCORE_ICON: Record<string, string> = {
  code: "assets/icons/player-{player}.svg",
  games: "assets/icons/chess_pawn-{player}.svg",
  projects: "assets/icons/chess_pawn-{player}.svg",
  food: "assets/icons/chess_pawn-{player}.svg",
};

/**
 * Generates the HTML markup for a score element based on the theme, color, and icon source.
 *
 * @param theme - The active game theme.
 * @param color - The player color the score belongs to.
 * @param iconSrc - The icon source URL for the score badge.
 * @returns {string} The HTML markup for the score element.
 */
export function scoreMarkup(
  theme: string,
  color: "blue" | "orange",
  iconSrc: string,
): string {
  const label =
    theme === "code"
      ? `<span class="game__score-label">${color === "blue" ? "Blue" : "Orange"}</span>`
      : "";
  return `
                <span class="game__score game__score--${color}">
                    <img src="${iconSrc}" alt="${color === "blue" ? "Blue" : "Orange"}">
                    ${label}
                    <span data-score-${color}>0</span>
                </span>
  `;
}

/**
 * Builds the HTML markup for the score elements based on the theme.
 *
 * @param theme - The active game theme.
 * @returns {string} The HTML markup for the score elements.
 */
export function buildScoresMarkup(theme: string): string {
  const BASE_URL = import.meta.env.BASE_URL;
  const blueIconSrc = `${BASE_URL}${SCORE_ICON[theme].replace("{player}", "blue")}`;
  const orangeIconSrc = `${BASE_URL}${SCORE_ICON[theme].replace("{player}", "orange")}`;
  return theme === "code"
    ? scoreMarkup(theme, "blue", blueIconSrc) +
        scoreMarkup(theme, "orange", orangeIconSrc)
    : scoreMarkup(theme, "orange", orangeIconSrc) +
        scoreMarkup(theme, "blue", blueIconSrc);
}

/**
 * Builds the HTML markup for the game page based on the theme and starting player.
 *
 * @param theme - The active game theme.
 * @param startPlayer - The player who starts the round.
 * @returns {string} The HTML markup for the game page.
 */
export function buildGameMarkup(theme: string, startPlayer: Player): string {
  return `
    <div class="game" data-theme="${theme}">
        <div class="game__bar">
            <div class="game__scores">
                ${buildScoresMarkup(theme)}
            </div>
            <p class="game__current">
                Current player:
                <img class="game__current-icon" data-current-player-icon alt="${startPlayer}">
            </p>
            <button class="button button__${theme} button__${theme}--exit game__exit" data-exit>
                <span class="game__exit-icon" aria-hidden="true"></span>
                Exit game
            </button>
        </div>
        <div id="gameField"></div>

        <dialog class="game__exit-dialog" data-exit-dialog>
            <p class="game__exit-dialog-text">Are you sure you want to exit the game?</p>
            <div class="game__exit-dialog-actions">
                <button class="game__exit-dialog-cancel" data-exit-cancel>Back to game</button>
                <button class="game__exit-dialog-confirm" data-exit-confirm>Exit game</button>
            </div>
        </dialog>
    </div>
  `;
}
