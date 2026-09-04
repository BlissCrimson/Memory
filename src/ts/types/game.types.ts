import type { Player } from "./player.types";

export interface GameSettings {
  themeValue: string;
  theme: string;
  startPlayer: Player;
  boardSize: 16 | 24 | 36;
}

export interface GameElements {
  scoreBlueRef: HTMLElement | null;
  scoreOrangeRef: HTMLElement | null;
  currentPlayerIconRef: HTMLImageElement | null;
  exitButtonRef: HTMLButtonElement | null;
  exitDialogRef: HTMLDialogElement | null;
  exitCancelRef: HTMLButtonElement | null;
  exitConfirmRef: HTMLButtonElement | null;
}

export interface GameState {
  scoreBlue: number;
  scoreOrange: number;
  currentPlayer: Player;
}

export type ScoreElements = Pick<
  GameElements,
  "scoreBlueRef" | "scoreOrangeRef" | "currentPlayerIconRef"
>;

export type ExitElements = Pick<
  GameElements,
  "exitButtonRef" | "exitDialogRef" | "exitCancelRef" | "exitConfirmRef"
>;
