export interface GameFieldCallbacks {
  onMatch: () => void;
  onMismatch: () => void;
  onGameEnd: () => void;
}

export interface DeckData {
  deck: number[];
  pairImages: string[];
}

export interface GameFieldState {
  firstCard: HTMLElement | null;
  secondCard: HTMLElement | null;
  locked: boolean;
  matchedCount: number;
}
