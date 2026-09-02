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

/** Code shows arrow/flag player icons + a "Blue"/"Orange" label; the other themes show plain pawn icons. */
const SCORE_ICON: Record<string, string> = {
  code: "assets/icons/player-{player}.svg",
  games: "assets/icons/chess_pawn-{player}.svg",
  projects: "assets/icons/chess_pawn-{player}.svg",
  food: "assets/icons/chess_pawn-{player}.svg",
};

const CONFETTI_PIECE_COUNT = 12;

function readResultScore(): ResultScore {
  const storedScore = sessionStorage.getItem("memory:result");
  if (!storedScore) return { blue: 0, orange: 0 };
  try {
    return JSON.parse(storedScore);
  } catch {
    return { blue: 0, orange: 0 };
  }
}

function buildDrawTitleMarkup(theme: string): string {
  const BASE_URL = import.meta.env.BASE_URL;
  const drawTitleAsset = DRAW_TITLE_ASSET[theme];
  return drawTitleAsset
    ? `<img class="result__title-img" src="${BASE_URL}${drawTitleAsset}" alt="DRAW">`
    : `<h2 class="result__title result__title--draw">DRAW</h2>`;
}

function buildHeadlineMarkup(
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

function scoreItemMarkup(theme: string, color: Player, value: number): string {
  const BASE_URL = import.meta.env.BASE_URL;
  const iconSrc = `${BASE_URL}${SCORE_ICON[theme].replace("{player}", color)}`;
  const label =
    theme === "code"
      ? `<span class="result__score-label">${color === "blue" ? "Blue" : "Orange"}</span>`
      : "";
  return `
            <span class="result__score-item result__score-item--${color}">
                <img src="${iconSrc}" alt="${color}">
                ${label}
                ${value}
            </span>
  `;
}

// Mockups order the score badges differently per theme: Code shows Blue
// before Orange, the other 3 themes show Orange before Blue.
function buildScoreMarkup(theme: string, score: ResultScore): string {
  return theme === "code"
    ? scoreItemMarkup(theme, "blue", score.blue) +
        scoreItemMarkup(theme, "orange", score.orange)
    : scoreItemMarkup(theme, "orange", score.orange) +
        scoreItemMarkup(theme, "blue", score.blue);
}

function buildConfettiMarkup(): string {
  const piece = `<span class="result__confetti-piece"></span>`;
  return `<div class="result__confetti" aria-hidden="true">${piece.repeat(CONFETTI_PIECE_COUNT)}</div>`;
}

function buildResultMarkup(
  theme: string,
  isDraw: boolean,
  winner: Player,
  score: ResultScore,
): string {
  return `
    <section class="result" data-theme="${theme}" data-outcome="${isDraw ? "draw" : "winner"}">
        ${buildConfettiMarkup()}
        <div class="result__headline">
            ${buildHeadlineMarkup(theme, winner, isDraw)}
        </div>
        <div class="result__score">
            ${buildScoreMarkup(theme, score)}
        </div>
        <button class="result__button" data-back>${BUTTON_LABELS[theme]}</button>
    </section>
  `;
}

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

  resultRef.innerHTML = buildResultMarkup(theme, isDraw, winner, score);
  registerResultBackButton(resultRef);
}
