import { navigate } from "../../router";
import { createGameField, type Player } from "../components/gameCards";
import { createErrorPage } from "./404";

const THEME_MAP: Record<string, string> = {
  codes: "code",
  gaming: "games",
  "da-projects": "projects",
  food: "food",
};

/**
 * Show the game page: header bar (scores, current player, exit) plus the
 * playable card field for the theme/board size/player chosen in Settings.
 *
 * @returns {void}
 */
export function createGamePage() {
  const gameRef = document.querySelector<HTMLElement>("#app");
  if (!gameRef) return createErrorPage();
  const BASE_URL = import.meta.env.BASE_URL;

  const themeValue = sessionStorage.getItem("memory:theme") ?? "codes";
  const startPlayer =
    (sessionStorage.getItem("memory:player") as Player | null) ?? "blue";
  const boardSize = Number(
    sessionStorage.getItem("memory:boardSize") ?? "16",
  ) as 16 | 24 | 36;

  gameRef.innerHTML = `
    <div class="game" data-theme="${THEME_MAP[themeValue] ?? "code"}">
        <header class="game__bar">
            <div class="game__scores">
                <span class="game__score game__score--blue">
                    <img src="${BASE_URL}assets/icons/chess_pawn-blue.svg" alt="Blue">
                    <span data-score-blue>0</span>
                </span>
                <span class="game__score game__score--orange">
                    <img src="${BASE_URL}assets/icons/chess_pawn-orange.svg" alt="Orange">
                    <span data-score-orange>0</span>
                </span>
            </div>
            <p class="game__current">
                Current player:
                <img data-current-player-icon src="${BASE_URL}assets/icons/chess_pawn-${startPlayer}.svg" alt="${startPlayer}">
            </p>
            <button class="button game__exit" data-exit>Exit game</button>
        </header>
        <div id="gameField"></div>
    </div>
  `;

  let scoreBlue = 0;
  let scoreOrange = 0;
  let currentPlayer: Player = startPlayer;

  const scoreBlueRef = gameRef.querySelector<HTMLElement>(
    "[data-score-blue]",
  );
  const scoreOrangeRef = gameRef.querySelector<HTMLElement>(
    "[data-score-orange]",
  );
  const currentPlayerIconRef = gameRef.querySelector<HTMLImageElement>(
    "[data-current-player-icon]",
  );
  const exitButtonRef =
    gameRef.querySelector<HTMLButtonElement>("[data-exit]");

  function updateCurrentPlayerIcon() {
    if (!currentPlayerIconRef) return;
    currentPlayerIconRef.src = `${BASE_URL}assets/icons/chess_pawn-${currentPlayer}.svg`;
    currentPlayerIconRef.alt = currentPlayer;
  }

  exitButtonRef?.addEventListener("click", () => navigate("/"));

  createGameField(boardSize, themeValue, {
    onMatch: () => {
      if (currentPlayer === "blue") {
        scoreBlue += 1;
        if (scoreBlueRef) scoreBlueRef.textContent = String(scoreBlue);
      } else {
        scoreOrange += 1;
        if (scoreOrangeRef) scoreOrangeRef.textContent = String(scoreOrange);
      }
    },
    onMismatch: () => {
      currentPlayer = currentPlayer === "blue" ? "orange" : "blue";
      updateCurrentPlayerIcon();
    },
    onGameEnd: () => {
      sessionStorage.setItem(
        "memory:result",
        JSON.stringify({ blue: scoreBlue, orange: scoreOrange }),
      );
      navigate("/result");
    },
  });
}
