import { navigate } from "../../router";
import { createErrorPage } from "./404";
import { buildGameOverMarkup } from "./gameOver.templates";
import type { ResultScore } from "../types/score.types";

const THEME_MAP: Record<string, string> = {
  codes: "code",
  gaming: "games",
  "da-projects": "projects",
  food: "food",
};

const AUTO_CONTINUE_DELAY_MS = 3500;

/**
 * Reads the result score from session storage. If the score is not found or
 * cannot be parsed, it returns a default score of { blue: 0, orange: 0 }.
 *
 * @returns {ResultScore} The result score.
 */
function readGameOverScore(): ResultScore {
  const storedScore = sessionStorage.getItem("memory:result");
  if (!storedScore) return { blue: 0, orange: 0 };
  try {
    return JSON.parse(storedScore);
  } catch {
    return { blue: 0, orange: 0 };
  }
}

/**
 * Advances to /result on its own after a delay; tap/Enter still skip ahead
 * immediately (hasStarted guards against both firing).
 *
 * @param gameOverRef - The Game Over page container element.
 * @returns {void}
 */
function registerGameOverAutoContinue(gameOverRef: HTMLElement): void {
  const continueRef = gameOverRef.querySelector<HTMLElement>("[data-continue]");
  let hasStarted = false;

  function goToResult() {
    if (hasStarted) return;
    hasStarted = true;
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

  const score = readGameOverScore();
  const themeValue = sessionStorage.getItem("memory:theme") ?? "codes";
  const theme = THEME_MAP[themeValue] ?? "code";

  gameOverRef.innerHTML = buildGameOverMarkup(theme, score);
  registerGameOverAutoContinue(gameOverRef);
}
