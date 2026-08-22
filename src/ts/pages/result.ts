import { navigate } from "../../router";
import { createErrorPage } from "./404";

interface ResultScore {
  blue: number;
  orange: number;
}

/**
 * Show the result page: final score plus winner/draw text, read from the
 * score the game page wrote to sessionStorage when the round ended.
 *
 * @returns {void}
 */
export function createResultPage() {
  const resultRef = document.querySelector<HTMLElement>("#app");
  if (!resultRef) return createErrorPage();
  const BASE_URL = import.meta.env.BASE_URL;

  let score: ResultScore = { blue: 0, orange: 0 };
  const stored = sessionStorage.getItem("memory:result");
  if (stored) {
    try {
      score = JSON.parse(stored);
    } catch {
      score = { blue: 0, orange: 0 };
    }
  }

  const winnerText =
    score.blue === score.orange
      ? "It's a draw"
      : score.blue > score.orange
        ? "The winner is Blue Player"
        : "The winner is Orange Player";

  resultRef.innerHTML = `
    <section class="result">
        <h1>${winnerText}</h1>
        <div class="result__score">
            <span class="result__score-blue">
                <img src="${BASE_URL}assets/icons/chess_pawn-blue.svg" alt="Blue">
                ${score.blue}
            </span>
            <span class="result__score-orange">
                <img src="${BASE_URL}assets/icons/chess_pawn-orange.svg" alt="Orange">
                ${score.orange}
            </span>
        </div>
        <button class="button button__entry">
            <p>Back to start</p>
        </button>
    </section>
  `;

  const backButtonRef = resultRef.querySelector(".button__entry");
  backButtonRef?.addEventListener("click", () => navigate("/"));
}
