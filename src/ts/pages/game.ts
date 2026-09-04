import { navigate } from "../../router";
import { createGameField } from "../components/gameCards";
import { createErrorPage } from "./404";
import { buildGameMarkup } from "./game.templates";
import type { Player } from "../types/player.types";
import type {
  GameSettings,
  GameElements,
  GameState,
  ScoreElements,
  ExitElements,
} from "../types/game.types";

const THEME_MAP: Record<string, string> = {
  codes: "code",
  gaming: "games",
  "da-projects": "projects",
  food: "food",
};

/**
 * Reads the game settings from session storage.
 *
 * @returns {GameSettings} The game settings, including the theme, starting player and board size.
 */
function readGameSettings(): GameSettings {
  const themeValue = sessionStorage.getItem("memory:theme") ?? "codes";
  const startPlayer =
    (sessionStorage.getItem("memory:player") as Player | null) ?? "blue";
  const boardSize = Number(
    sessionStorage.getItem("memory:boardSize") ?? "16",
  ) as 16 | 24 | 36;
  return {
    themeValue,
    theme: THEME_MAP[themeValue] ?? "code",
    startPlayer,
    boardSize,
  };
}

/**
 * Queries the score elements from the game reference and returns them as a ScoreElements object.
 *
 * @param gameRef - The game page container element.
 * @returns {ScoreElements} The score elements.
 */
function queryScoreElements(gameRef: HTMLElement): ScoreElements {
  return {
    scoreBlueRef: gameRef.querySelector<HTMLElement>("[data-score-blue]"),
    scoreOrangeRef: gameRef.querySelector<HTMLElement>("[data-score-orange]"),
    currentPlayerIconRef: gameRef.querySelector<HTMLImageElement>(
      "[data-current-player-icon]",
    ),
  };
}

/**
 * Queries the exit elements from the game reference and returns them as an ExitElements object.
 *
 * @param gameRef - The game page container element.
 * @returns {ExitElements} The exit elements.
 */
function queryExitElements(gameRef: HTMLElement): ExitElements {
  return {
    exitButtonRef: gameRef.querySelector<HTMLButtonElement>("[data-exit]"),
    exitDialogRef:
      gameRef.querySelector<HTMLDialogElement>("[data-exit-dialog]"),
    exitCancelRef:
      gameRef.querySelector<HTMLButtonElement>("[data-exit-cancel]"),
    exitConfirmRef: gameRef.querySelector<HTMLButtonElement>(
      "[data-exit-confirm]",
    ),
  };
}

/**
 * Queries the game elements (score and exit) from the game reference and returns them as a GameElements object.
 *
 * @param gameRef - The game page container element.
 * @returns {GameElements} The game elements.
 */
function queryGameElements(gameRef: HTMLElement): GameElements {
  return { ...queryScoreElements(gameRef), ...queryExitElements(gameRef) };
}

/**
 * Resets the current player icon classes and alt attribute based on the current player.
 *
 * @param icon - The current player icon element.
 * @param player - The current player.
 * @returns {void}
 */
function resetCurrentPlayerIconClasses(
  icon: HTMLImageElement,
  player: Player,
): void {
  icon.alt = player;
  icon.classList.remove(
    "game__current-icon--blue",
    "game__current-icon--orange",
  );
}

/**
 * Applies the current player icon for the code theme (arrow/flag icon per player).
 *
 * @param icon - The current player icon element.
 * @param player - The current player.
 * @returns {void}
 */
function applyCodeThemePlayerIcon(
  icon: HTMLImageElement,
  player: Player,
): void {
  const BASE_URL = import.meta.env.BASE_URL;
  icon.src = `${BASE_URL}assets/icons/player-${player}.svg`;
}

/**
 * Applies the current player icon for the non-code themes (shared pawn icon, colored via class).
 *
 * @param icon - The current player icon element.
 * @param player - The current player.
 * @returns {void}
 */
function applyDefaultThemePlayerIcon(
  icon: HTMLImageElement,
  player: Player,
): void {
  const BASE_URL = import.meta.env.BASE_URL;
  icon.src = `${BASE_URL}assets/icons/chess_pawn-white.svg`;
  icon.classList.add(`game__current-icon--${player}`);
}

/**
 * Updates the current player icon based on the current player and theme.
 *
 * @param elements - The game elements.
 * @param state - The current game state.
 * @param theme - The active game theme.
 * @returns {void}
 */
function updateCurrentPlayerIcon(
  elements: GameElements,
  state: GameState,
  theme: string,
): void {
  const { currentPlayerIconRef } = elements;
  if (!currentPlayerIconRef) return;
  resetCurrentPlayerIconClasses(currentPlayerIconRef, state.currentPlayer);

  if (theme === "code") {
    applyCodeThemePlayerIcon(currentPlayerIconRef, state.currentPlayer);
  } else {
    applyDefaultThemePlayerIcon(currentPlayerIconRef, state.currentPlayer);
  }
}

/**
 * Registers the event listeners for the exit dialog buttons and dialog itself.
 *
 * @param elements - The game elements.
 * @returns {void}
 */
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

/**
 * Handles the match callback by updating the score and current player based on the game state.
 *
 * @param elements - The game elements.
 * @param state - The current game state.
 * @returns {void}
 */
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

/**
 * Handles the mismatch callback by switching the current player and updating the current player icon based on the game state and theme.
 *
 * @param elements - The game elements.
 * @param state - The current game state.
 * @param theme - The active game theme.
 * @returns {void}
 */
function handleMismatchCallback(
  elements: GameElements,
  state: GameState,
  theme: string,
): void {
  state.currentPlayer = state.currentPlayer === "blue" ? "orange" : "blue";
  updateCurrentPlayerIcon(elements, state, theme);
}

/**
 * Handles the game end callback by storing the final scores in session storage and navigating to the game over page.
 *
 * @param state - The current game state.
 * @returns {void}
 */
function handleGameEndCallback(state: GameState): void {
  sessionStorage.setItem(
    "memory:result",
    JSON.stringify({ blue: state.scoreBlue, orange: state.scoreOrange }),
  );
  navigate("/game-over");
}

/**
 * Registers the callbacks for the game field events.
 *
 * @param gameSettings - The game settings.
 * @param elements - The game elements.
 * @param state - The current game state.
 * @returns {void}
 */
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
 * Creates the initial game state with the specified starting player.
 *
 * @param startPlayer - The player who starts the round.
 * @returns {GameState} The initial game state with scores set to 0 and the current player set to the specified starting player.
 */
function createInitialGameState(startPlayer: Player): GameState {
  return { scoreBlue: 0, scoreOrange: 0, currentPlayer: startPlayer };
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
  const state = createInitialGameState(settings.startPlayer);

  updateCurrentPlayerIcon(elements, state, settings.theme);
  registerExitDialogHandlers(elements);
  registerGameFieldCallbacks(settings, elements, state);
}
