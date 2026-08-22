import { createErrorPage } from "../pages/404";

export type Player = "blue" | "orange";

export interface GameFieldCallbacks {
  onMatch: () => void;
  onMismatch: () => void;
  onGameEnd: () => void;
}

const THEME_ASSET_FOLDERS: Record<string, string> = {
  codes: "codeVibeTheme",
  gaming: "gameThemeCards",
  "da-projects": "DaProjectsTheme",
  food: "foodTheme",
};

const THEME_ASSET_FILES: Record<string, string[]> = {
  codeVibeTheme: [
    "logo__ts.svg",
    "logo__js.svg",
    "logo__html.svg",
    "logo__vsCode.svg",
    "logo__django.svg",
    "logo__css.svg",
    "logo__angular.svg",
    "logo__cli.svg",
    "logo__python.svg",
    "logo__github.svg",
    "logo__nodeJs.svg",
    "logo__bootstrap.svg",
    "logo__react.svg",
    "logo__sql.svg",
    "logo__vueJs.svg",
    "logo__sass.svg",
    "logo__firebase.svg",
    "logo__git.svg",
  ],
  gameThemeCards: [
    "Front.svg",
    "Front (1).svg",
    "Front (2).svg",
    "Front (3).svg",
    "Front (4).svg",
    "Front (5).svg",
    "Front (6).svg",
    "Front (7).svg",
    "Front (8).svg",
    "Front (9).svg",
    "Front (10).svg",
    "Front (11).svg",
    "Front (12).svg",
    "Front (13).svg",
    "Front (14).svg",
    "Front (15).svg",
    "Front (16).svg",
  ],
  DaProjectsTheme: [
    "front.svg",
    "front (1).svg",
    "sakura__flower.svg",
    "front (3).svg",
    "front (4).svg",
    "front (5).svg",
    "basket.svg",
    "pokeball.svg",
    "tictactoe.svg",
    "front (9).svg",
    "front (10).svg",
    "front (11).svg",
    "sombrero.svg",
    "front (13).svg",
    "front (14).svg",
    "front (15).svg",
  ],
  foodTheme: [
    "frond.svg",
    "frond (1).svg",
    "frond (2).svg",
    "frond (3).svg",
    "frond (4).svg",
    "frond (5).svg",
    "frond (6).svg",
    "frond (7).svg",
    "frond (8).svg",
    "frond (9).svg",
    "frond (10).svg",
    "frond (11).svg",
    "frond (12).svg",
    "frond (13).svg",
    "frond (14).svg",
    "frond (15).svg",
    "frond (16).svg",
    "frond (17).svg",
  ],
};

/**
 * Shuffles an array using the Fisher-Yates algorithm (does not mutate the input).
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
 * Builds one image URL per card pair for the given theme.
 * Themes with fewer unique images than pairs reuse images (wrap around via modulo).
 */
function getPairImages(pairCount: number, themeValue: string): string[] {
  const BASE_URL = import.meta.env.BASE_URL;
  const folder =
    THEME_ASSET_FOLDERS[themeValue] ?? THEME_ASSET_FOLDERS.codes;
  const files = THEME_ASSET_FILES[folder] ?? THEME_ASSET_FILES.codeVibeTheme;
  return Array.from(
    { length: pairCount },
    (_, i) =>
      `${BASE_URL}assets/img/cards/${folder}/${encodeURIComponent(files[i % files.length])}`,
  );
}

/**
 * Create the memory field for the selected board size and theme, and wire up
 * the flip/match game logic. Score and turn state stay owned by the caller
 * and are reported back through the callbacks.
 *
 * @param boardSize
 * @param themeValue - raw settings theme value (e.g. "codes")
 * @param callbacks
 * @returns {void}
 */
export function createGameField(
  boardSize: 16 | 24 | 36 = 16,
  themeValue: string = "codes",
  callbacks: GameFieldCallbacks,
) {
  const fieldRef = document.querySelector<HTMLElement>("#gameField");
  if (!fieldRef) return createErrorPage();
  const BASE_URL = import.meta.env.BASE_URL;

  const pairCount = boardSize / 2;
  const pairImages = getPairImages(pairCount, themeValue);
  const pairIds = Array.from({ length: pairCount }, (_, i) => i);
  const deck = shuffle([...pairIds, ...pairIds]);

  const cards = deck
    .map(
      (pairId) => `
        <button class="card" data-pair-id="${pairId}">
            <div class="card__inner">
                <div class="card__face card__face--front">
                    <img src="${pairImages[pairId]}" alt="">
                </div>
                <div class="card__face card__face--back">
                    <img class="icon__card-back" src="${BASE_URL}assets/img/cards/card__back.svg" alt="">
                </div>
            </div>
        </button>
    `,
    )
    .join("");

  fieldRef.innerHTML = `
    <section id="field" class="field field--${boardSize}">
        ${cards}
    </section>
  `;

  const fieldSectionRef = fieldRef.querySelector<HTMLElement>("#field");
  if (!fieldSectionRef) return;

  let firstCard: HTMLElement | null = null;
  let secondCard: HTMLElement | null = null;
  let locked = false;
  let matchedCount = 0;

  fieldSectionRef.addEventListener("click", (event) => {
    if (locked) return;
    const cardRef = (event.target as HTMLElement).closest<HTMLElement>(
      ".card",
    );
    if (!cardRef) return;
    if (
      cardRef.classList.contains("is-flipped") ||
      cardRef.classList.contains("is-matched")
    )
      return;
    if (firstCard && secondCard) return;

    cardRef.classList.add("is-flipped");

    if (!firstCard) {
      firstCard = cardRef;
      return;
    }

    secondCard = cardRef;
    locked = true;

    if (firstCard.dataset.pairId === secondCard.dataset.pairId) {
      firstCard.classList.add("is-matched");
      secondCard.classList.add("is-matched");
      matchedCount += 2;
      firstCard = null;
      secondCard = null;
      locked = false;
      callbacks.onMatch();
      if (matchedCount === boardSize) callbacks.onGameEnd();
    } else {
      setTimeout(() => {
        firstCard?.classList.remove("is-flipped");
        secondCard?.classList.remove("is-flipped");
        firstCard = null;
        secondCard = null;
        locked = false;
        callbacks.onMismatch();
      }, 900);
    }
  });
}
