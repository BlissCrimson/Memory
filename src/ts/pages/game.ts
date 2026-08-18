import { createGameField } from "../components/gameCards";

export function createGamePage() {
  let gameRef = document.querySelector("#app");
  if (!gameRef) return;
  createGameField();
}
