import { createGameField } from "../components/gameCards";
import { createErrorPage } from "./404";

/**
 * Show the game page.
 *
 * @returns {void}
 */
export function createGamePage() {
  let gameRef = document.querySelector("#app");
  if (!gameRef) return createErrorPage();
  gameRef.innerHTML = `
  <div id="gameField"></div>
  `;
  createGameField();
}
