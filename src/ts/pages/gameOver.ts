import { navigate } from "../../router";
import { createErrorPage } from "./404";

interface ResultScore {
  blue: number;
  orange: number;
}

const THEME_MAP: Record<string, string> = {
  codes: "code",
  gaming: "games",
  "da-projects": "projects",
  food: "food",
};

/** Code shows arrow/flag player icons + a "Blue"/"Orange" label; the other themes show plain pawn icons. */
const SCORE_ICON: Record<string, string> = {
  code: "assets/icons/player-{player}.svg",
  games: "assets/icons/chess_pawn-{player}.svg",
  projects: "assets/icons/chess_pawn-{player}.svg",
  food: "assets/icons/chess_pawn-{player}.svg",
};

const AUTO_CONTINUE_DELAY_MS = 2500;

/**
 * Show the Game Over screen: theme-specific "Game over" wordmark plus the
 * final score, read from the score the game page wrote to sessionStorage
 * when the round ended. Clicking/tapping anywhere continues to /result.
 *
 * @returns {void}
 */
export function createGameOverPage() {
  const gameOverRef = document.querySelector<HTMLElement>("#app");
  if (!gameOverRef) return createErrorPage();
  const BASE_URL = import.meta.env.BASE_URL;

  let score: ResultScore = { blue: 0, orange: 0 };
  const storedScore = sessionStorage.getItem("memory:result");
  if (storedScore) {
    try {
      score = JSON.parse(storedScore);
    } catch {
      score = { blue: 0, orange: 0 };
    }
  }

  const themeValue = sessionStorage.getItem("memory:theme") ?? "codes";
  const theme = THEME_MAP[themeValue] ?? "code";

  const blueIconSrc = `${BASE_URL}${SCORE_ICON[theme].replace("{player}", "blue")}`;
  const orangeIconSrc = `${BASE_URL}${SCORE_ICON[theme].replace("{player}", "orange")}`;

  const scoreItemMarkup = (
    color: "blue" | "orange",
    iconSrc: string,
    value: number,
  ) => `
    <span class="game-over__score-item game-over__score-item--${color}">
      <img src="${iconSrc}" alt="${color}">
      ${theme === "code" ? `<span class="game-over__score-label">${color === "blue" ? "Blue" : "Orange"}</span>` : ""}
      ${value}
    </span>
  `;

  // Mockups order the score badges differently per theme: Code shows
  // Blue before Orange, the other 3 themes show Orange before Blue.
  const scoreItemsMarkup =
    theme === "code"
      ? scoreItemMarkup("blue", blueIconSrc, score.blue) +
        scoreItemMarkup("orange", orangeIconSrc, score.orange)
      : scoreItemMarkup("orange", orangeIconSrc, score.orange) +
        scoreItemMarkup("blue", blueIconSrc, score.blue);

  gameOverRef.innerHTML = `
    <section class="game-over" data-theme="${theme}" role="button" tabindex="0" data-continue>
      <h2 class="game-over__title">Game over</h2>
      <p class="game-over__lead">Final score</p>
      <div class="game-over__score">
        ${scoreItemsMarkup}
      </div>
      <p class="game-over__hint">Tap to continue</p>
    </section>
  `;

  registerGameOverAutoContinue(gameOverRef);
}

// Advances to /result on its own after AUTO_CONTINUE_DELAY_MS (mentor
// feedback: this used to require a tap). Tapping/pressing Enter still skips
// ahead immediately; the hasStarted guard keeps whichever trigger fires
// first from double-navigating.
function registerGameOverAutoContinue(gameOverRef: HTMLElement): void {
  const continueRef = gameOverRef.querySelector<HTMLElement>("[data-continue]");
  let hasStarted = false;

  function goToResult() {
    if (hasStarted) return;
    hasStarted = true;
    // Fade out before navigating so the switch to the winner/draw screen
    // reads as one animated transition instead of an instant cut.
    continueRef?.classList.add("is-leaving");
    setTimeout(() => navigate("/result"), 250);
  }

  setTimeout(goToResult, AUTO_CONTINUE_DELAY_MS);
  continueRef?.addEventListener("click", goToResult);
  continueRef?.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      goToResult();
    }
  });
}
