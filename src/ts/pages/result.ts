import { navigate } from "../../router";
import { createErrorPage } from "./404";
import { buildResultMarkup } from "./result.templates";
import type { Player } from "../types/player.types";
import type { ResultScore } from "../types/score.types";

const THEME_MAP: Record<string, string> = {
  codes: "code",
  gaming: "games",
  "da-projects": "projects",
  food: "food",
};

/**
 * Reads the result score from session storage and returns it as a ResultScore object. If the score is not found or cannot be parsed, it returns a default score of { blue: 0, orange: 0 }.
 *
 * @returns {ResultScore} The result score.
 */
function readResultScore(): ResultScore {
  const storedScore = sessionStorage.getItem("memory:result");
  if (!storedScore) return { blue: 0, orange: 0 };
  try {
    return JSON.parse(storedScore);
  } catch {
    return { blue: 0, orange: 0 };
  }
}

/**
 * Registers the event listener for the result page back button.
 *
 * @param resultRef - The result page container element.
 * @returns {void}
 */
function registerResultBackButton(resultRef: HTMLElement): void {
  const backButtonRef = resultRef.querySelector("[data-back]");
  backButtonRef?.addEventListener("click", () => navigate("/"));
}

/**
 * Show the result page: themed winner/draw announcement plus the final
 * score, read from the score the game page wrote to sessionStorage when
 * the round ended.
 *
 * @returns {void}
 */
export function createResultPage() {
  const resultRef = document.querySelector<HTMLElement>("#app");
  if (!resultRef) return createErrorPage();

  const score = readResultScore();
  const themeValue = sessionStorage.getItem("memory:theme") ?? "codes";
  const theme = THEME_MAP[themeValue] ?? "code";
  const isDraw = score.blue === score.orange;
  const winner: Player = score.blue > score.orange ? "blue" : "orange";

  resultRef.innerHTML = buildResultMarkup(theme, isDraw, winner);
  registerResultBackButton(resultRef);
}
