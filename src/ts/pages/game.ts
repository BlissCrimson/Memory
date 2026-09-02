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

const PLAYER_NAMES: Record<Player, string> = {
  blue: "Blue",
  orange: "Orange",
};

interface GameSettings {
  themeValue: string;
  theme: string;
  startPlayer: Player;
  boardSize: 16 | 24 | 36;
}

interface GameElements {
  scoreBlueRef: HTMLElement | null;
  scoreOrangeRef: HTMLElement | null;
  currentPlayerIconRef: HTMLImageElement | null;
  currentPlayerNameRef: HTMLElement | null;
  exitButtonRef: HTMLButtonElement | null;
  exitDialogRef: HTMLDialogElement | null;
  exitCancelRef: HTMLButtonElement | null;
  exitConfirmRef: HTMLButtonElement | null;
}

interface GameState {
  scoreBlue: number;
  scoreOrange: number;
  currentPlayer: Player;
}

function readGameSettings(): GameSettings {
  const themeValue = sessionStorage.getItem("memory:theme") ?? "codes";
  const startPlayer =
    (sessionStorage.getItem("memory:player") as Player | null) ?? "blue";
  const boardSize = Number(
    sessionStorage.getItem("memory:boardSize") ?? "16",
  ) as 16 | 24 | 36;
  return { themeValue, theme: THEME_MAP[themeValue] ?? "code", startPlayer, boardSize };
}

function scoreMarkup(color: "blue" | "orange", iconSrc: string): string {
  return `
                <span class="game__score game__score--${color}">
                    <img src="${iconSrc}" alt="${color === "blue" ? "Blue" : "Orange"}">
                    <span data-score-${color}>0</span>
                </span>
  `;
}

// Mockups order the score badges differently per theme: Code shows Blue
// before Orange, the other 3 themes show Orange before Blue (same
// distinction as gameOver.ts/result.ts).
function buildScoresMarkup(theme: string): string {
  const BASE_URL = import.meta.env.BASE_URL;
  const blueIconSrc = `${BASE_URL}${SCORE_ICON[theme].replace("{player}", "blue")}`;
  const orangeIconSrc = `${BASE_URL}${SCORE_ICON[theme].replace("{player}", "orange")}`;
  return theme === "code"
    ? scoreMarkup("blue", blueIconSrc) + scoreMarkup("orange", orangeIconSrc)
    : scoreMarkup("orange", orangeIconSrc) + scoreMarkup("blue", blueIconSrc);
}

function buildGameMarkup(theme: string, startPlayer: Player): string {
  return `
    <div class="game" data-theme="${theme}">
        <div class="game__bar">
            <div class="game__scores">
                ${buildScoresMarkup(theme)}
            </div>
            <p class="game__current">
                Current player:
                <img class="game__current-icon" data-current-player-icon alt="${startPlayer}">
                <span class="game__current-name" data-current-player-name></span>
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

function queryGameElements(gameRef: HTMLElement): GameElements {
  return {
    scoreBlueRef: gameRef.querySelector<HTMLElement>("[data-score-blue]"),
    scoreOrangeRef: gameRef.querySelector<HTMLElement>("[data-score-orange]"),
    currentPlayerIconRef: gameRef.querySelector<HTMLImageElement>(
      "[data-current-player-icon]",
    ),
    currentPlayerNameRef: gameRef.querySelector<HTMLElement>(
      "[data-current-player-name]",
    ),
    exitButtonRef: gameRef.querySelector<HTMLButtonElement>("[data-exit]"),
    exitDialogRef: gameRef.querySelector<HTMLDialogElement>(
      "[data-exit-dialog]",
    ),
    exitCancelRef: gameRef.querySelector<HTMLButtonElement>(
      "[data-exit-cancel]",
    ),
    exitConfirmRef: gameRef.querySelector<HTMLButtonElement>(
      "[data-exit-confirm]",
    ),
  };
}

function updateCurrentPlayerIcon(
  elements: GameElements,
  state: GameState,
  theme: string,
): void {
  const BASE_URL = import.meta.env.BASE_URL;
  const { currentPlayerIconRef, currentPlayerNameRef } = elements;
  if (!currentPlayerIconRef) return;
  currentPlayerIconRef.alt = state.currentPlayer;
  currentPlayerIconRef.classList.remove(
    "game__current-icon--blue",
    "game__current-icon--orange",
  );
  if (currentPlayerNameRef)
    currentPlayerNameRef.textContent = PLAYER_NAMES[state.currentPlayer];

  if (theme === "code") {
    currentPlayerIconRef.src = `${BASE_URL}assets/icons/player-${state.currentPlayer}.svg`;
  } else {
    currentPlayerIconRef.src = `${BASE_URL}assets/icons/chess_pawn-white.svg`;
    currentPlayerIconRef.classList.add(
      `game__current-icon--${state.currentPlayer}`,
    );
  }
}

function registerExitDialogHandlers(elements: GameElements): void {
  const { exitButtonRef, exitDialogRef, exitCancelRef, exitConfirmRef } =
    elements;
  exitButtonRef?.addEventListener("click", () => exitDialogRef?.showModal());
  exitCancelRef?.addEventListener("click", () => exitDialogRef?.close());
  exitConfirmRef?.addEventListener("click", () => navigate("/settings"));
  exitDialogRef?.addEventListener("click", (event) => {
    if (event.target === exitDialogRef) exitDialogRef.close();
  });
}

function handleMatchCallback(elements: GameElements, state: GameState): void {
  if (state.currentPlayer === "blue") {
    state.scoreBlue += 1;
    if (elements.scoreBlueRef)
      elements.scoreBlueRef.textContent = String(state.scoreBlue);
  } else {
    state.scoreOrange += 1;
    if (elements.scoreOrangeRef)
      elements.scoreOrangeRef.textContent = String(state.scoreOrange);
  }
}

function handleMismatchCallback(
  elements: GameElements,
  state: GameState,
  theme: string,
): void {
  state.currentPlayer = state.currentPlayer === "blue" ? "orange" : "blue";
  updateCurrentPlayerIcon(elements, state, theme);
}

function handleGameEndCallback(state: GameState): void {
  sessionStorage.setItem(
    "memory:result",
    JSON.stringify({ blue: state.scoreBlue, orange: state.scoreOrange }),
  );
  navigate("/game-over");
}

function registerGameFieldCallbacks(
  gameSettings: GameSettings,
  elements: GameElements,
  state: GameState,
): void {
  createGameField(gameSettings.boardSize, gameSettings.themeValue, {
    onMatch: () => handleMatchCallback(elements, state),
    onMismatch: () =>
      handleMismatchCallback(elements, state, gameSettings.theme),
    onGameEnd: () => handleGameEndCallback(state),
  });
}

/**
 * Show the game page: header bar (scores, current player, exit) plus the
 * playable card field for the theme/board size/player chosen in Settings.
 *
 * @returns {void}
 */
export function createGamePage() {
  const gameRef = document.querySelector<HTMLElement>("#app");
  if (!gameRef) return createErrorPage();

  const settings = readGameSettings();
  document.body.dataset.theme = settings.theme;
  gameRef.innerHTML = buildGameMarkup(settings.theme, settings.startPlayer);

  const elements = queryGameElements(gameRef);
  const state: GameState = {
    scoreBlue: 0,
    scoreOrange: 0,
    currentPlayer: settings.startPlayer,
  };

  updateCurrentPlayerIcon(elements, state, settings.theme);
  registerExitDialogHandlers(elements);
  registerGameFieldCallbacks(settings, elements, state);
}
