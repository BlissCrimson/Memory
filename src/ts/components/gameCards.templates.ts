import type { DeckData } from "../types/gameCards.types";

/**
 * Builds the HTML markup for a single memory card.
 *
 * @param pairId - The id shared by the two cards of a matching pair.
 * @param pairImages - The front-face image URLs indexed by pair id.
 * @returns {string} The HTML markup for the card.
 */
export function buildCardMarkup(pairId: number, pairImages: string[]): string {
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

/**
 * Builds the HTML markup for the whole card field.
 *
 * @param deckData - The shuffled deck and its pair images.
 * @param boardSize - Number of cards on the board (16, 24 or 36).
 * @returns {string} The HTML markup for the card field.
 */
export function buildGameFieldMarkup(
  deckData: DeckData,
  boardSize: number,
): string {
  const cards = deckData.deck
    .map((pairId) => buildCardMarkup(pairId, deckData.pairImages))
    .join("");
  return `
    <section id="field" class="field field--${boardSize}">
        ${cards}
    </section>
  `;
}
