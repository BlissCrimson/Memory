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
  const theme = THEME_MAP[themeValue] ?? "code";
  const startPlayer =
    (sessionStorage.getItem("memory:player") as Player | null) ?? "blue";
  const boardSize = Number(
    sessionStorage.getItem("memory:boardSize") ?? "16",
  ) as 16 | 24 | 36;

  document.body.dataset.theme = theme;

  gameRef.innerHTML = `
    <div class="game" data-theme="${theme}">
        <div class="game__bar">
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
                <img class="game__current-icon" data-current-player-icon alt="${startPlayer}">
            </p>
            <button class="button game__exit" data-exit>Exit game</button>
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
      navigate("/result");
    },
  });
}
