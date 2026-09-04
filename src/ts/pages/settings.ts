import { navigate } from "../../router";
import { createErrorPage } from "./404";
import {
  buildSettingsMarkup,
  THEME_LABELS,
  PREVIEW_IMAGE_PATHS,
} from "./settings.templates";
import type {
  SettingsElements,
  SettingsSelection,
} from "../types/settings.types";

const THEME_MAP: Record<string, string> = {
  codes: "code",
  gaming: "games",
  "da-projects": "projects",
  food: "food",
};

const PLAYER_LABELS: Record<string, string> = {
  blue: "Blue",
  orange: "Orange",
};

/**
 * Queries the preview panel elements from the settings reference.
 *
 * @param settingsRef - The settings page container element.
 * @returns {Pick<SettingsElements, "previewRef" | "previewIconRef">} The preview panel elements.
 */
function queryPreviewElements(
  settingsRef: Element,
): Pick<SettingsElements, "previewRef" | "previewIconRef"> {
  return {
    previewRef: settingsRef.querySelector<HTMLElement>(".settings__preview"),
    previewIconRef: settingsRef.querySelector<HTMLImageElement>(
      "[data-preview-icon]",
    ),
  };
}

/**
 * Queries the settings bar elements from the settings reference.
 *
 * @param settingsRef - The settings page container element.
 * @returns {Pick<SettingsElements, "barThemeRef" | "barPlayerRef" | "barBoardSizeRef" | "slashThemeRef" | "slashPlayerRef">} The settings bar elements.
 */
function queryBarElements(
  settingsRef: Element,
): Pick<
  SettingsElements,
  | "barThemeRef"
  | "barPlayerRef"
  | "barBoardSizeRef"
  | "slashThemeRef"
  | "slashPlayerRef"
> {
  return {
    barThemeRef: settingsRef.querySelector<HTMLElement>("[data-bar-theme]"),
    barPlayerRef: settingsRef.querySelector<HTMLElement>("[data-bar-player]"),
    barBoardSizeRef: settingsRef.querySelector<HTMLElement>(
      "[data-bar-board-size]",
    ),
    slashThemeRef:
      settingsRef.querySelector<HTMLImageElement>("[data-slash-theme]"),
    slashPlayerRef: settingsRef.querySelector<HTMLImageElement>(
      "[data-slash-player]",
    ),
  };
}

/**
 * Queries the start button elements from the settings reference.
 *
 * @param settingsRef - The settings page container element.
 * @returns {Pick<SettingsElements, "startButtonRef" | "startIconRef">} The start button elements.
 */
function queryStartButtonElements(
  settingsRef: Element,
): Pick<SettingsElements, "startButtonRef" | "startIconRef"> {
  return {
    startButtonRef:
      settingsRef.querySelector<HTMLButtonElement>(".button__start"),
    startIconRef: settingsRef.querySelector<HTMLImageElement>(
      ".icon__entry--start",
    ),
  };
}

/**
 * Queries the DOM for the settings elements.
 *
 * @param settingsRef - The settings page container element.
 * @returns {SettingsElements} The settings elements.
 */
function querySettingsElements(settingsRef: Element): SettingsElements {
  return {
    ...queryPreviewElements(settingsRef),
    ...queryBarElements(settingsRef),
    ...queryStartButtonElements(settingsRef),
  };
}

/**
 * Registers the hover effect for the start button.
 *
 * @param elements - The settings elements.
 * @returns {void}
 */
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

/**
 * Applies the preview for the selected theme.
 *
 * @param elements - The settings elements.
 * @param themeValue - The raw settings theme value (e.g. "codes").
 * @returns {void}
 */
function applyPreview(elements: SettingsElements, themeValue: string): void {
  const BASE_URL = import.meta.env.BASE_URL;
  elements.previewRef?.setAttribute("data-theme", THEME_MAP[themeValue]);
  if (elements.previewIconRef) {
    elements.previewIconRef.src = `${BASE_URL}${PREVIEW_IMAGE_PATHS[themeValue]}`;
    elements.previewIconRef.alt = `${THEME_LABELS[themeValue]} preview`;
  }
}

/**
 * Updates the state of the start button based on the current settings selection.
 *
 * @param elements - The settings elements.
 * @param selection - The current settings selection.
 * @returns {void}
 */
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

/**
 * Switches both bar separators to the "used" line once every field
 * (theme, player, board size) is selected; resets them to the default
 * line otherwise.
 *
 * @param elements - The settings elements.
 * @param selection - The current settings selection.
 * @returns {void}
 */
function updateSeparatorState(
  elements: SettingsElements,
  selection: SettingsSelection,
): void {
  const BASE_URL = import.meta.env.BASE_URL;
  const isComplete = Boolean(
    selection.theme && selection.player && selection.boardSize,
  );
  const slashSrc = `${BASE_URL}assets/icons/slash-line${isComplete ? "-used" : ""}.svg`;
  if (elements.slashThemeRef) elements.slashThemeRef.src = slashSrc;
  if (elements.slashPlayerRef) elements.slashPlayerRef.src = slashSrc;
}

/**
 * Registers the change event for theme radio buttons.
 *
 * @param input - The theme radio input.
 * @param elements - The settings elements.
 * @param selection - The current settings selection.
 * @returns {void}
 */
function registerThemeRadioChange(
  input: HTMLInputElement,
  elements: SettingsElements,
  selection: SettingsSelection,
): void {
  input.addEventListener("change", () => {
    if (!input.checked) return;
    selection.theme = input.value;
    applyPreview(elements, input.value);
    if (elements.barThemeRef)
      elements.barThemeRef.textContent = `${THEME_LABELS[input.value]} Theme`;
    updateStartButtonState(elements, selection);
    updateSeparatorState(elements, selection);
  });
}

/**
 * Registers the hover effect for theme radio buttons.
 *
 * @param input - The theme radio input.
 * @param elements - The settings elements.
 * @param selection - The current settings selection.
 * @returns {void}
 */
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

/**
 * Registers the change and hover events for theme radio buttons.
 *
 * @param settingsRef - The settings page container element.
 * @param elements - The settings elements.
 * @param selection - The current settings selection.
 * @returns {void}
 */
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

/**
 * Registers the change event for player radio buttons.
 *
 * @param input - The player radio input.
 * @param elements - The settings elements.
 * @param selection - The current settings selection.
 * @returns {void}
 */
function registerPlayerRadioChange(
  input: HTMLInputElement,
  elements: SettingsElements,
  selection: SettingsSelection,
): void {
  input.addEventListener("change", () => {
    if (!input.checked) return;
    selection.player = input.value;
    if (elements.barPlayerRef)
      elements.barPlayerRef.textContent = `${PLAYER_LABELS[input.value]} Player`;
    updateStartButtonState(elements, selection);
    updateSeparatorState(elements, selection);
  });
}

/**
 * Registers the change and hover events for player radio buttons.
 *
 * @param settingsRef - The settings page container element.
 * @param elements - The settings elements.
 * @param selection - The current settings selection.
 * @returns {void}
 */
function registerPlayerRadios(
  settingsRef: Element,
  elements: SettingsElements,
  selection: SettingsSelection,
): void {
  settingsRef
    .querySelectorAll<HTMLInputElement>('input[name="player"]')
    .forEach((input) => {
      registerPlayerRadioChange(input, elements, selection);
    });
}

/**
 * Registers the change event for board size radio buttons.
 *
 * @param input - The board size radio input.
 * @param elements - The settings elements.
 * @param selection - The current settings selection.
 * @returns {void}
 */
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
    updateSeparatorState(elements, selection);
  });
}

/**
 * Registers the change and hover events for board size radio buttons.
 *
 * @param settingsRef - The settings page container element.
 * @param elements - The settings elements.
 * @param selection - The current settings selection.
 * @returns {void}
 */
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

/**
 * Registers the click event for the start button.
 *
 * @param elements - The settings elements.
 * @param selection - The current settings selection.
 * @returns {void}
 */
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

/**
 * Creates an empty settings selection.
 *
 * @returns {SettingsSelection} The empty settings selection.
 */
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
