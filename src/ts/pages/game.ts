import { navigate } from "../../router";
import { createGameField, type Player } from "../components/gameCards";
import { createErrorPage } from "./404";

const THEME_MAP: Record<string, string> = {
  codes: "code",
  gaming: "games",
  "da-projects": "projects",
  food: "food",
};

/** Code shows arrow/flag player icons for the score badges; the other themes show plain pawn icons (same distinction as gameOver.ts/result.ts). */
const SCORE_ICON: Record<string, string> = {
  code: "assets/icons/player-{player}.svg",
  games: "assets/icons/chess_pawn-{player}.svg",
  projects: "assets/icons/chess_pawn-{player}.svg",
  food: "assets/icons/chess_pawn-{player}.svg",
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
  const theme = THEME_MAP[themeValue] ?? "code";
  const startPlayer =
    (sessionStorage.getItem("memory:player") as Player | null) ?? "blue";
  const boardSize = Number(
    sessionStorage.getItem("memory:boardSize") ?? "16",
  ) as 16 | 24 | 36;

  document.body.dataset.theme = theme;

  const blueIconSrc = `${BASE_URL}${SCORE_ICON[theme].replace("{player}", "blue")}`;
  const orangeIconSrc = `${BASE_URL}${SCORE_ICON[theme].replace("{player}", "orange")}`;

  const scoreMarkup = (color: "blue" | "orange", iconSrc: string) => `
                <span class="game__score game__score--${color}">
                    <img src="${iconSrc}" alt="${color === "blue" ? "Blue" : "Orange"}">
                    <span data-score-${color}>0</span>
                </span>
  `;

  // Mockups order the score badges differently per theme: Code shows Blue
  // before Orange, the other 3 themes show Orange before Blue (same
  // distinction as gameOver.ts/result.ts).
  const scoresMarkup =
    theme === "code"
      ? scoreMarkup("blue", blueIconSrc) + scoreMarkup("orange", orangeIconSrc)
      : scoreMarkup("orange", orangeIconSrc) + scoreMarkup("blue", blueIconSrc);

  gameRef.innerHTML = `
    <div class="game" data-theme="${theme}">
        <div class="game__bar">
            <div class="game__scores">
                ${scoresMarkup}
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
  const exitDialogRef =
    gameRef.querySelector<HTMLDialogElement>("[data-exit-dialog]");
  const exitCancelRef = gameRef.querySelector<HTMLButtonElement>(
    "[data-exit-cancel]",
  );
  const exitConfirmRef = gameRef.querySelector<HTMLButtonElement>(
    "[data-exit-confirm]",
  );

  function updateCurrentPlayerIcon() {
    if (!currentPlayerIconRef) return;
    currentPlayerIconRef.alt = currentPlayer;
    currentPlayerIconRef.classList.remove(
      "game__current-icon--blue",
      "game__current-icon--orange",
    );

    if (theme === "code") {
      currentPlayerIconRef.src = `${BASE_URL}assets/icons/player-${currentPlayer}.svg`;
    } else {
      currentPlayerIconRef.src = `${BASE_URL}assets/icons/chess_pawn-white.svg`;
      currentPlayerIconRef.classList.add(`game__current-icon--${currentPlayer}`);
    }
  }

  updateCurrentPlayerIcon();

  exitButtonRef?.addEventListener("click", () => exitDialogRef?.showModal());
  exitCancelRef?.addEventListener("click", () => exitDialogRef?.close());
  exitConfirmRef?.addEventListener("click", () => navigate("/settings"));
  exitDialogRef?.addEventListener("click", (event) => {
    if (event.target === exitDialogRef) exitDialogRef.close();
  });

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
      navigate("/game-over");
    },
  });
}
