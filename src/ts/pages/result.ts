import { navigate } from "../../router";
import { createErrorPage } from "./404";

interface ResultScore {
  blue: number;
  orange: number;
}

type Player = "blue" | "orange";

const THEME_MAP: Record<string, string> = {
  codes: "code",
  gaming: "games",
  "da-projects": "projects",
  food: "food",
};

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

/** Themes that ship a dedicated "DRAW" wordmark asset; the rest render styled text. */
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

  const isDraw = score.blue === score.orange;
  const winner: Player = score.blue > score.orange ? "blue" : "orange";

  const winnerIconSrc = `${BASE_URL}${WINNER_ICON[theme].replace("{player}", winner)}`;
  const drawIconSrc = `${BASE_URL}${DRAW_ICON[theme]}`;
  const drawTitleAsset = DRAW_TITLE_ASSET[theme];
  const drawTitleMarkup = drawTitleAsset
    ? `<img class="result__title-img" src="${BASE_URL}${drawTitleAsset}" alt="DRAW">`
    : `<h1 class="result__title result__title--draw">DRAW</h1>`;

  const headlineMarkup = isDraw
    ? `
      <img class="result__icon result__icon--draw" src="${drawIconSrc}" alt="">
      <p class="result__lead">It's a</p>
      ${drawTitleMarkup}
    `
    : `
      ${theme === "code" ? `<div class="result__confetti" aria-hidden="true"></div>` : ""}
      <p class="result__lead">The winner is</p>
      <h1 class="result__title result__title--winner result__title--${winner}">${PLAYER_LABELS[winner]}</h1>
      <div class="result__icon-panel">
        <img class="result__icon result__icon--winner" src="${winnerIconSrc}" alt="${PLAYER_LABELS[winner]}">
      </div>
    `;

  resultRef.innerHTML = `
    <section class="result" data-theme="${theme}" data-outcome="${isDraw ? "draw" : "winner"}">
        <div class="result__headline">
            ${headlineMarkup}
        </div>
        <div class="result__score">
            <span class="result__score-item result__score-item--blue">
                <img src="${BASE_URL}assets/icons/chess_pawn-blue.svg" alt="Blue">
                ${score.blue}
            </span>
            <span class="result__score-item result__score-item--orange">
                <img src="${BASE_URL}assets/icons/chess_pawn-orange.svg" alt="Orange">
                ${score.orange}
            </span>
        </div>
        <button class="result__button" data-back>${BUTTON_LABELS[theme]}</button>
    </section>
  `;

  const backButtonRef = resultRef.querySelector("[data-back]");
  backButtonRef?.addEventListener("click", () => navigate("/"));
}
