import { createErrorPage } from "../pages/404";

export type Player = "blue" | "orange";

export interface GameFieldCallbacks {
  onMatch: () => void;
  onMismatch: () => void;
  onGameEnd: () => void;
}

const THEME_ASSET_FOLDERS: Record<string, string> = {
  codes: "code",
  gaming: "gaming",
  "da-projects": "projects",
  food: "food",
};

const THEME_ASSET_FILES: Record<string, string[]> = {
  code: [
    "logo-ts.svg",
    "logo-js.svg",
    "logo-html.svg",
    "logo-vscode.svg",
    "logo-django.svg",
    "logo-css.svg",
    "logo-angular.svg",
    "logo-cli.svg",
    "logo-python.svg",
    "logo-github.svg",
    "logo-nodejs.svg",
    "logo-bootstrap.svg",
    "logo-react.svg",
    "logo-sql.svg",
    "logo-vuejs.svg",
    "logo-sass.svg",
    "logo-firebase.svg",
    "logo-git.svg",
  ],
  gaming: [
    "card-01.svg",
    "card-02.svg",
    "card-03.svg",
    "card-04.svg",
    "card-05.svg",
    "card-06.svg",
    "card-07.svg",
    "card-08.svg",
    "card-09.svg",
    "card-10.svg",
    "card-11.svg",
    "card-12.svg",
    "card-13.svg",
    "card-14.svg",
    "card-15.svg",
    "card-16.svg",
    "card-17.svg",
  ],
  projects: [
    "card-01.svg",
    "card-02.svg",
    "sakura-flower.svg",
    "card-03.svg",
    "card-04.svg",
    "card-05.svg",
    "basket.svg",
    "pokeball.svg",
    "tictactoe.svg",
    "card-06.svg",
    "card-07.svg",
    "card-08.svg",
    "sombrero.svg",
    "card-09.svg",
    "card-10.svg",
    "card-11.svg",
  ],
  food: [
    "card-01.svg",
    "card-02.svg",
    "card-03.svg",
    "card-04.svg",
    "card-05.svg",
    "card-06.svg",
    "card-07.svg",
    "card-08.svg",
    "card-09.svg",
    "card-10.svg",
    "card-11.svg",
    "card-12.svg",
    "card-13.svg",
    "card-14.svg",
    "card-15.svg",
    "card-16.svg",
    "card-17.svg",
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
  const files = THEME_ASSET_FILES[folder] ?? THEME_ASSET_FILES.code;
  return Array.from(
    { length: pairCount },
    (_, i) =>
      `${BASE_URL}assets/img/themes/${folder}/cards/${encodeURIComponent(files[i % files.length])}`,
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
                    <img class="icon__card-back" src="${BASE_URL}assets/img/shared/card-back.svg" alt="">
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
