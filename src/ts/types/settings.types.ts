export interface SettingsElements {
  previewRef: HTMLElement | null;
  previewIconRef: HTMLImageElement | null;
  barThemeRef: HTMLElement | null;
  barPlayerRef: HTMLElement | null;
  barBoardSizeRef: HTMLElement | null;
  slashThemeRef: HTMLImageElement | null;
  slashPlayerRef: HTMLImageElement | null;
  startButtonRef: HTMLButtonElement | null;
  startIconRef: HTMLImageElement | null;
}

export interface SettingsSelection {
  theme: string | null;
  player: string | null;
  boardSize: string | null;
}
