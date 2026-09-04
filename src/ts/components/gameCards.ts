import { createErrorPage } from "../pages/404";
import { THEME_ASSET_FOLDERS, THEME_ASSET_FILES } from "../data/themeAssets";
import { buildGameFieldMarkup } from "./gameCards.templates";
import type {
  GameFieldCallbacks,
  DeckData,
  GameFieldState,
} from "../types/gameCards.types";

/**
 * Shuffles the items of an array using the Fisher-Yates algorithm.
 *
 * @param items - The items to shuffle.
 * @returns {T[]} A new, shuffled array.
 */
function shuffle<T>(items: T[]): T[] {
  const array = [...items];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/**
 * Builds the front-face image URLs for the given number of pairs and theme.
 *
 * Themes with fewer unique images than pairs reuse images (wrap around via modulo).
 *
 * @param pairCount - The number of pairs on the board.
 * @param themeValue - The raw settings theme value (e.g. "codes").
 * @returns {string[]} The front-face image URLs, indexed by pair id.
 */
function getPairImages(pairCount: number, themeValue: string): string[] {
  const BASE_URL = import.meta.env.BASE_URL;
  const folder =
    THEME_ASSET_FOLDERS[themeValue] ?? THEME_ASSET_FOLDERS.codes;
  const files = THEME_ASSET_FILES[folder] ?? THEME_ASSET_FILES.code;
  return Array.from(
    { length: pairCount },
    (_, i) =>
      `${BASE_URL}assets/img/themes/${folder}/cards/${encodeURIComponent(files[i % files.length])}`,
  );
}

/**
 * Builds a shuffled deck of pair ids and their front-face images for the given board size and theme.
 *
 * @param boardSize - Number of cards on the board (16, 24 or 36).
 * @param themeValue - The raw settings theme value (e.g. "codes").
 * @returns {DeckData} The shuffled deck and its pair images.
 */
function buildDeck(boardSize: number, themeValue: string): DeckData {
  const pairCount = boardSize / 2;
  const pairImages = getPairImages(pairCount, themeValue);
  const pairIds = Array.from({ length: pairCount }, (_, i) => i);
  const deck = shuffle([...pairIds, ...pairIds]);
  return { deck, pairImages };
}

/**
 * Flips a card face-up.
 *
 * @param card - The card element to reveal.
 * @returns {void}
 */
function revealCard(card: HTMLElement): void {
  card.classList.add("is-flipped");
}

/**
 * Marks the two selected cards as matched and resets the selection state.
 *
 * @param state - The current game field state.
 * @returns {void}
 */
function markCardsAsMatched(state: GameFieldState): void {
  state.firstCard?.classList.add("is-matched");
  state.secondCard?.classList.add("is-matched");
  state.matchedCount += 2;
  state.firstCard = null;
  state.secondCard = null;
  state.locked = false;
}

/**
 * Handles a matched pair: marks the cards as matched, reports the match, and
 * ends the game once every pair has been matched.
 *
 * @param state - The current game field state.
 * @param callbacks - Hooks the caller uses to react to match/mismatch/game-end events.
 * @param totalCards - The total number of cards on the board.
 * @returns {void}
 */
function handleMatch(
  state: GameFieldState,
  callbacks: GameFieldCallbacks,
  totalCards: number,
): void {
  markCardsAsMatched(state);
  callbacks.onMatch();
  // Delay by the card flip transition duration (.card__inner in _card.scss:
  // transition: transform 0.4s ease) so the last card is visibly finished
  // flipping before navigating away on game end.
  if (state.matchedCount === totalCards) {
    setTimeout(() => callbacks.onGameEnd(), 400);
  }
}

/**
 * Flips the two selected cards back face-down after a delay and reports the mismatch.
 *
 * @param state - The current game field state.
 * @param callbacks - Hooks the caller uses to react to match/mismatch/game-end events.
 * @returns {void}
 */
function scheduleMismatchReset(
  state: GameFieldState,
  callbacks: GameFieldCallbacks,
): void {
  setTimeout(() => {
    state.firstCard?.classList.remove("is-flipped");
    state.secondCard?.classList.remove("is-flipped");
    state.firstCard = null;
    state.secondCard = null;
    state.locked = false;
    callbacks.onMismatch();
  }, 900);
}

/**
 * Evaluates whether the two selected cards form a matching pair.
 *
 * @param state - The current game field state.
 * @param callbacks - Hooks the caller uses to react to match/mismatch/game-end events.
 * @param totalCards - The total number of cards on the board.
 * @returns {void}
 */
function evaluateCardPair(
  state: GameFieldState,
  callbacks: GameFieldCallbacks,
  totalCards: number,
): void {
  if (state.firstCard?.dataset.pairId === state.secondCard?.dataset.pairId) {
    handleMatch(state, callbacks, totalCards);
  } else {
    scheduleMismatchReset(state, callbacks);
  }
}

/**
 * Checks whether a card can currently be clicked.
 *
 * @param state - The current game field state.
 * @param cardRef - The card element to check.
 * @returns {boolean} Whether the card is clickable.
 */
function isCardClickable(state: GameFieldState, cardRef: HTMLElement): boolean {
  if (
    cardRef.classList.contains("is-flipped") ||
    cardRef.classList.contains("is-matched")
  ) {
    return false;
  }
  return !(state.firstCard && state.secondCard);
}

/**
 * Reveals a clicked card and stores it as the first or second selected card.
 *
 * @param state - The current game field state.
 * @param cardRef - The clicked card element.
 * @returns {boolean} Whether this was the first card of the pair.
 */
function selectCard(state: GameFieldState, cardRef: HTMLElement): boolean {
  revealCard(cardRef);
  if (!state.firstCard) {
    state.firstCard = cardRef;
    return true;
  }
  state.secondCard = cardRef;
  state.locked = true;
  return false;
}

/**
 * Handles a click on the card field: selects the clicked card and, once two
 * cards are selected, evaluates whether they match.
 *
 * @param event - The click event.
 * @param state - The current game field state.
 * @param callbacks - Hooks the caller uses to react to match/mismatch/game-end events.
 * @param totalCards - The total number of cards on the board.
 * @returns {void}
 */
function handleCardClick(
  event: Event,
  state: GameFieldState,
  callbacks: GameFieldCallbacks,
  totalCards: number,
): void {
  if (state.locked) return;
  const cardRef = (event.target as HTMLElement).closest<HTMLElement>(".card");
  if (!cardRef || !isCardClickable(state, cardRef)) return;

  const isFirstCard = selectCard(state, cardRef);
  if (isFirstCard) return;

  evaluateCardPair(state, callbacks, totalCards);
}

/**
 * Registers the click handler for the card field.
 *
 * @param fieldSectionRef - The card field section element.
 * @param state - The current game field state.
 * @param callbacks - Hooks the caller uses to react to match/mismatch/game-end events.
 * @param totalCards - The total number of cards on the board.
 * @returns {void}
 */
function registerCardClickHandler(
  fieldSectionRef: HTMLElement,
  state: GameFieldState,
  callbacks: GameFieldCallbacks,
  totalCards: number,
): void {
  fieldSectionRef.addEventListener("click", (event) =>
    handleCardClick(event, state, callbacks, totalCards),
  );
}

/**
 * Creates the initial, empty game field state.
 *
 * @returns {GameFieldState} The initial game field state.
 */
function createInitialFieldState(): GameFieldState {
  return { firstCard: null, secondCard: null, locked: false, matchedCount: 0 };
}

/**
 * Create the memory field for the selected board size and theme, and wire up
 * the flip/match game logic. Score and turn state stay owned by the caller
 * and are reported back through the callbacks.
 *
 * @param boardSize - number of cards on the board (16, 24 or 36)
 * @param themeValue - raw settings theme value (e.g. "codes")
 * @param callbacks - hooks the caller uses to react to match/mismatch/game-end events
 * @returns {void}
 */
export function createGameField(
  boardSize: 16 | 24 | 36 = 16,
  themeValue: string = "codes",
  callbacks: GameFieldCallbacks,
) {
  const fieldRef = document.querySelector<HTMLElement>("#gameField");
  if (!fieldRef) return createErrorPage();

  const deckData = buildDeck(boardSize, themeValue);
  fieldRef.innerHTML = buildGameFieldMarkup(deckData, boardSize);

  const fieldSectionRef = fieldRef.querySelector<HTMLElement>("#field");
  if (!fieldSectionRef) return;

  const state = createInitialFieldState();
  registerCardClickHandler(fieldSectionRef, state, callbacks, boardSize);
}
