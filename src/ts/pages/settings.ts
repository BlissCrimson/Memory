import { navigate } from "../../router";
import { createErrorPage } from "./404";

const THEME_MAP: Record<string, string> = {
  codes: "code",
  gaming: "games",
  "da-projects": "projects",
  food: "food",
};

const THEME_LABELS: Record<string, string> = {
  codes: "Code vibes",
  gaming: "Gaming",
  "da-projects": "DA Projects",
  food: "Foods",
};

const PLAYER_LABELS: Record<string, string> = {
  blue: "Blue",
  orange: "Orange",
};

const PREVIEW_IMAGE_PATHS: Record<string, string> = {
  codes: "assets/img/themes/code/preview.svg",
  gaming: "assets/img/themes/gaming/preview.svg",
  "da-projects": "assets/img/themes/projects/preview.svg",
  food: "assets/img/themes/food/preview.svg",
};

interface SettingsElements {
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

interface SettingsSelection {
  theme: string | null;
  player: string | null;
  boardSize: string | null;
}

function buildSettingsHeadingMarkup(): string {
  const BASE_URL = import.meta.env.BASE_URL;
  return `
            <div class="settings__heading">
                <h2>Settings</h2>
                <img class="icon__settings--headline" src="${BASE_URL}assets/icons/line-big.svg" alt="">
            </div>
  `;
}

function buildSettingsOptionMarkup(
  groupName: string,
  value: string,
  labelText: string,
): string {
  const BASE_URL = import.meta.env.BASE_URL;
  return `
                <label class="settings__option">
                    <input type="radio" name="${groupName}" value="${value}">
                    <span class="settings__radio"></span>
                    <span class="settings__option-text">${labelText}</span>
                    <img class="icon icon__entry icon__entry--connector" src="${BASE_URL}assets/icons/line.svg" alt="">
                </label>
  `;
}

function buildThemeFieldsetMarkup(): string {
  const BASE_URL = import.meta.env.BASE_URL;
  const options = [
    buildSettingsOptionMarkup("theme", "codes", "Code vibes theme"),
    buildSettingsOptionMarkup("theme", "gaming", "Gaming theme"),
    buildSettingsOptionMarkup("theme", "da-projects", "DA Projects theme"),
    buildSettingsOptionMarkup("theme", "food", "Foods theme"),
  ].join("");
  return `
            <fieldset class="settings__group">
                <legend>
                    <img class="icon icon__entry icon__entry--legend" src="${BASE_URL}assets/icons/palette.svg" alt="">
                    Game themes
                </legend>
                ${options}
            </fieldset>
  `;
}

function buildPlayerFieldsetMarkup(): string {
  const BASE_URL = import.meta.env.BASE_URL;
  const options = [
    buildSettingsOptionMarkup("player", "blue", "Blue"),
    buildSettingsOptionMarkup("player", "orange", "Orange"),
  ].join("");
  return `
            <fieldset class="settings__group">
                <legend>
                    <img class="icon icon__entry icon__entry--legend" src="${BASE_URL}assets/icons/chess_pawn-settings.svg" alt="">
                    Choose player
                </legend>
                ${options}
            </fieldset>
  `;
}

function buildBoardSizeFieldsetMarkup(): string {
  const BASE_URL = import.meta.env.BASE_URL;
  const options = [
    buildSettingsOptionMarkup("boardSize", "16", "16 cards"),
    buildSettingsOptionMarkup("boardSize", "24", "24 cards"),
    buildSettingsOptionMarkup("boardSize", "36", "36 cards"),
  ].join("");
  return `
            <fieldset class="settings__group">
                <legend>
                    <img class="icon icon__entry icon__entry--legend" src="${BASE_URL}assets/icons/board-size.svg" alt="">
                    Board size
                </legend>
                ${options}
            </fieldset>
  `;
}

function buildSettingsBarMarkup(): string {
  const BASE_URL = import.meta.env.BASE_URL;
  return `
            <div class="settings__bar">
                <div class="settings__bar-labels">
                    <span data-bar-theme>GameTheme</span>
                    <img class="icon icon__entry icon__entry--slash" data-slash-theme src="${BASE_URL}assets/icons/slash-line.svg" alt="">
                    <span data-bar-player>Player</span>
                    <img class="icon icon__entry icon__entry--slash" data-slash-player src="${BASE_URL}assets/icons/slash-line.svg" alt="">
                    <span data-bar-board-size>Board-Size</span>
                </div>
                <button class="button button__start" disabled>
                    <img class="icon icon__entry icon__entry--start" src="${BASE_URL}assets/icons/smart_display.svg" alt="">
                    Start
                </button>
            </div>
  `;
}

function buildPreviewPanelMarkup(): string {
  const BASE_URL = import.meta.env.BASE_URL;
  const previewSrc = `${BASE_URL}${PREVIEW_IMAGE_PATHS.codes}`;
  return `
        <div class="settings__right">
            <div class="settings__preview" data-theme="code">
                <img class="img img__preview" data-preview-icon src="${previewSrc}" alt="${THEME_LABELS.codes} preview">
            </div>
            ${buildSettingsBarMarkup()}
        </div>
  `;
}

function buildSettingsMarkup(): string {
  return `
    <section class="settings">
        <div class="settings__form">
            ${buildSettingsHeadingMarkup()}
            ${buildThemeFieldsetMarkup()}
            ${buildPlayerFieldsetMarkup()}
            ${buildBoardSizeFieldsetMarkup()}
        </div>
        ${buildPreviewPanelMarkup()}
    </section>
  `;
}

function querySettingsElements(settingsRef: Element): SettingsElements {
  return {
    previewRef: settingsRef.querySelector<HTMLElement>(".settings__preview"),
    previewIconRef: settingsRef.querySelector<HTMLImageElement>(
      "[data-preview-icon]",
    ),
    barThemeRef: settingsRef.querySelector<HTMLElement>("[data-bar-theme]"),
    barPlayerRef: settingsRef.querySelector<HTMLElement>("[data-bar-player]"),
    barBoardSizeRef: settingsRef.querySelector<HTMLElement>(
      "[data-bar-board-size]",
    ),
    slashThemeRef: settingsRef.querySelector<HTMLImageElement>(
      "[data-slash-theme]",
    ),
    slashPlayerRef: settingsRef.querySelector<HTMLImageElement>(
      "[data-slash-player]",
    ),
    startButtonRef:
      settingsRef.querySelector<HTMLButtonElement>(".button__start"),
    startIconRef: settingsRef.querySelector<HTMLImageElement>(
      ".icon__entry--start",
    ),
  };
}

function registerStartButtonHover(elements: SettingsElements): void {
  const BASE_URL = import.meta.env.BASE_URL;
  const { startButtonRef, startIconRef } = elements;
  startButtonRef?.addEventListener("mouseenter", () => {
    if (startIconRef)
      startIconRef.src = `${BASE_URL}assets/icons/smart_display-hover.svg`;
  });
  startButtonRef?.addEventListener("mouseleave", () => {
    if (startIconRef)
      startIconRef.src = `${BASE_URL}assets/icons/smart_display.svg`;
  });
}

function applyPreview(elements: SettingsElements, themeValue: string): void {
  const BASE_URL = import.meta.env.BASE_URL;
  elements.previewRef?.setAttribute("data-theme", THEME_MAP[themeValue]);
  if (elements.previewIconRef) {
    elements.previewIconRef.src = `${BASE_URL}${PREVIEW_IMAGE_PATHS[themeValue]}`;
    elements.previewIconRef.alt = `${THEME_LABELS[themeValue]} preview`;
  }
}

function updateStartButtonState(
  elements: SettingsElements,
  selection: SettingsSelection,
): void {
  if (!elements.startButtonRef) return;
  elements.startButtonRef.disabled = !(
    selection.theme &&
    selection.player &&
    selection.boardSize
  );
}

function registerThemeRadioChange(
  input: HTMLInputElement,
  elements: SettingsElements,
  selection: SettingsSelection,
): void {
  const BASE_URL = import.meta.env.BASE_URL;
  input.addEventListener("change", () => {
    if (!input.checked) return;
    selection.theme = input.value;
    applyPreview(elements, input.value);
    if (elements.barThemeRef)
      elements.barThemeRef.textContent = `${THEME_LABELS[input.value]} Theme`;
    if (elements.slashThemeRef)
      elements.slashThemeRef.src = `${BASE_URL}assets/icons/slash-line-used.svg`;
    updateStartButtonState(elements, selection);
  });
}

function registerThemeRadioHover(
  input: HTMLInputElement,
  elements: SettingsElements,
  selection: SettingsSelection,
): void {
  const optionRef = input.closest<HTMLElement>(".settings__option");
  optionRef?.addEventListener("mouseenter", () =>
    applyPreview(elements, input.value),
  );
  optionRef?.addEventListener("mouseleave", () =>
    applyPreview(elements, selection.theme ?? "codes"),
  );
}

function registerThemeRadios(
  settingsRef: Element,
  elements: SettingsElements,
  selection: SettingsSelection,
): void {
  settingsRef
    .querySelectorAll<HTMLInputElement>('input[name="theme"]')
    .forEach((input) => {
      registerThemeRadioChange(input, elements, selection);
      registerThemeRadioHover(input, elements, selection);
    });
}

function registerPlayerRadioChange(
  input: HTMLInputElement,
  elements: SettingsElements,
  selection: SettingsSelection,
): void {
  const BASE_URL = import.meta.env.BASE_URL;
  input.addEventListener("change", () => {
    if (!input.checked) return;
    selection.player = input.value;
    if (elements.barPlayerRef)
      elements.barPlayerRef.textContent = `${PLAYER_LABELS[input.value]} Player`;
    if (elements.slashPlayerRef)
      elements.slashPlayerRef.src = `${BASE_URL}assets/icons/slash-line-used.svg`;
    updateStartButtonState(elements, selection);
  });
}

function registerPlayerRadios(
  settingsRef: Element,
  elements: SettingsElements,
  selection: SettingsSelection,
): void {
  settingsRef
    .querySelectorAll<HTMLInputElement>('input[name="player"]')
    .forEach((input) => registerPlayerRadioChange(input, elements, selection));
}

function registerBoardSizeRadioChange(
  input: HTMLInputElement,
  elements: SettingsElements,
  selection: SettingsSelection,
): void {
  input.addEventListener("change", () => {
    if (!input.checked) return;
    selection.boardSize = input.value;
    if (elements.barBoardSizeRef)
      elements.barBoardSizeRef.textContent = `Board-${input.value} Cards`;
    updateStartButtonState(elements, selection);
  });
}

function registerBoardSizeRadios(
  settingsRef: Element,
  elements: SettingsElements,
  selection: SettingsSelection,
): void {
  settingsRef
    .querySelectorAll<HTMLInputElement>('input[name="boardSize"]')
    .forEach((input) =>
      registerBoardSizeRadioChange(input, elements, selection),
    );
}

function registerStartButtonClick(
  elements: SettingsElements,
  selection: SettingsSelection,
): void {
  elements.startButtonRef?.addEventListener("click", () => {
    if (!selection.theme || !selection.player || !selection.boardSize) return;
    sessionStorage.setItem("memory:theme", selection.theme);
    sessionStorage.setItem("memory:player", selection.player);
    sessionStorage.setItem("memory:boardSize", selection.boardSize);
    navigate("/game");
  });
}

function createEmptySelection(): SettingsSelection {
  return { theme: null, player: null, boardSize: null };
}

/**
 * Show the Settings page.
 *
 * @returns {void}
 */
export function createSettingsPage() {
  const settingsRef = document.querySelector("#app");
  if (!settingsRef) return createErrorPage();
  settingsRef.innerHTML = buildSettingsMarkup();

  const elements = querySettingsElements(settingsRef);
  const selection = createEmptySelection();

  registerStartButtonHover(elements);
  registerThemeRadios(settingsRef, elements, selection);
  registerPlayerRadios(settingsRef, elements, selection);
  registerBoardSizeRadios(settingsRef, elements, selection);
  registerStartButtonClick(elements, selection);
}
