import { createErrorPage } from "../pages/404";
import { THEME_ASSET_FOLDERS, THEME_ASSET_FILES } from "../data/themeAssets";

export type Player = "blue" | "orange";

export interface GameFieldCallbacks {
  onMatch: () => void;
  onMismatch: () => void;
  onGameEnd: () => void;
}

interface DeckData {
  deck: number[];
  pairImages: string[];
}

interface GameFieldState {
  firstCard: HTMLElement | null;
  secondCard: HTMLElement | null;
  locked: boolean;
  matchedCount: number;
}

function shuffle<T>(items: T[]): T[] {
  const array = [...items];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Themes with fewer unique images than pairs reuse images (wrap around via modulo).
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

function buildDeck(boardSize: number, themeValue: string): DeckData {
  const pairCount = boardSize / 2;
  const pairImages = getPairImages(pairCount, themeValue);
  const pairIds = Array.from({ length: pairCount }, (_, i) => i);
  const deck = shuffle([...pairIds, ...pairIds]);
  return { deck, pairImages };
}

function buildCardMarkup(pairId: number, pairImages: string[]): string {
  const BASE_URL = import.meta.env.BASE_URL;
  return `
        <button class="card" data-pair-id="${pairId}">
            <div class="card__inner">
                <div class="card__face card__face--front">
                    <img src="${pairImages[pairId]}" alt="">
                </div>
                <div class="card__face card__face--back">
                    <img class="icon__card-back" src="${BASE_URL}assets/img/shared/card-back.svg" alt="">
                </div>
            </div>
        </button>
    `;
}

function buildGameFieldMarkup(deckData: DeckData, boardSize: number): string {
  const cards = deckData.deck
    .map((pairId) => buildCardMarkup(pairId, deckData.pairImages))
    .join("");
  return `
    <section id="field" class="field field--${boardSize}">
        ${cards}
    </section>
  `;
}

function revealCard(card: HTMLElement): void {
  card.classList.add("is-flipped");
}

function handleMatch(
  state: GameFieldState,
  callbacks: GameFieldCallbacks,
  totalCards: number,
): void {
  state.firstCard?.classList.add("is-matched");
  state.secondCard?.classList.add("is-matched");
  state.matchedCount += 2;
  state.firstCard = null;
  state.secondCard = null;
  state.locked = false;
  callbacks.onMatch();
  // Delay by the card flip transition duration (.card__inner in _card.scss:
  // transition: transform 0.4s ease) so the last card is visibly finished
  // flipping before navigating away on game end.
  if (state.matchedCount === totalCards) {
    setTimeout(() => callbacks.onGameEnd(), 400);
  }
}

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

function handleCardClick(
  event: Event,
  state: GameFieldState,
  callbacks: GameFieldCallbacks,
  totalCards: number,
): void {
  if (state.locked) return;
  const cardRef = (event.target as HTMLElement).closest<HTMLElement>(".card");
  if (!cardRef) return;
  if (
    cardRef.classList.contains("is-flipped") ||
    cardRef.classList.contains("is-matched") ||
    (state.firstCard && state.secondCard)
  )
    return;

  revealCard(cardRef);
  if (!state.firstCard) {
    state.firstCard = cardRef;
    return;
  }

  state.secondCard = cardRef;
  state.locked = true;
  evaluateCardPair(state, callbacks, totalCards);
}

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

  const state: GameFieldState = {
    firstCard: null,
    secondCard: null,
    locked: false,
    matchedCount: 0,
  };
  registerCardClickHandler(fieldSectionRef, state, callbacks, boardSize);
}
