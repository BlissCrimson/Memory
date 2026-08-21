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

/**
 * Show the Settings page.
 *
 * @returns {void}
 */
export function createSettingsPage() {
  const settingsRef = document.querySelector("#app");
  if (!settingsRef) return createErrorPage();
  const BASE_URL = import.meta.env.BASE_URL;

  const previewImgs: Record<string, string> = {
    codes: `${BASE_URL}assets/img/themes/theme-codelogos.svg`,
    gaming: `${BASE_URL}assets/img/themes/theme-game.svg`,
    "da-projects": `${BASE_URL}assets/img/themes/theme-projects.svg`,
    food: `${BASE_URL}assets/img/themes/theme-foods.svg`,
  };

  settingsRef.innerHTML = `
    <section class="settings">
        <div class="settings__form">
            <div class="settings__heading">
                <h1>Settings</h1>
                <img class="icon__settings--headline" src="${BASE_URL}assets/icons/line-big.svg" alt="">
            </div>

            <fieldset class="settings__group">
                <legend>
                    <img class="icon icon__entry icon__entry--legend" src="${BASE_URL}assets/icons/palette.svg" alt="">
                    Game themes
                </legend>
                <label class="settings__option">
                    <input type="radio" name="theme" value="codes" checked>
                    <span class="settings__radio"></span>
                    <span class="settings__option-text">Code vibes theme</span>
                    <img class="icon icon__entry icon__entry--connector" src="${BASE_URL}assets/icons/line.svg" alt="">
                </label>
                <label class="settings__option">
                    <input type="radio" name="theme" value="gaming">
                    <span class="settings__radio"></span>
                    <span class="settings__option-text">Gaming theme</span>
                    <img class="icon icon__entry icon__entry--connector" src="${BASE_URL}assets/icons/line.svg" alt="">
                </label>
                <label class="settings__option">
                    <input type="radio" name="theme" value="da-projects">
                    <span class="settings__radio"></span>
                    <span class="settings__option-text">DA Projects theme</span>
                    <img class="icon icon__entry icon__entry--connector" src="${BASE_URL}assets/icons/line.svg" alt="">
                </label>
                <label class="settings__option">
                    <input type="radio" name="theme" value="food">
                    <span class="settings__radio"></span>
                    <span class="settings__option-text">Foods theme</span>
                    <img class="icon icon__entry icon__entry--connector" src="${BASE_URL}assets/icons/line.svg" alt="">
                </label>
            </fieldset>

            <fieldset class="settings__group">
                <legend>
                    <img class="icon icon__entry icon__entry--legend" src="${BASE_URL}assets/icons/chess_pawn-settings.svg" alt="">
                    Choose player
                </legend>
                <label class="settings__option">
                    <input type="radio" name="player" value="blue" checked>
                    <span class="settings__radio"></span>
                    <span class="settings__option-text">Blue</span>
                    <img class="icon icon__entry icon__entry--connector" src="${BASE_URL}assets/icons/line.svg" alt="">
                </label>
                <label class="settings__option">
                    <input type="radio" name="player" value="orange">
                    <span class="settings__radio"></span>
                    <span class="settings__option-text">Orange</span>
                    <img class="icon icon__entry icon__entry--connector" src="${BASE_URL}assets/icons/line.svg" alt="">
                </label>
            </fieldset>

            <fieldset class="settings__group">
                <legend>Board size</legend>
                <label class="settings__option">
                    <input type="radio" name="boardSize" value="16" checked>
                    <span class="settings__radio"></span>
                    <span class="settings__option-text">16 cards</span>
                    <img class="icon icon__entry icon__entry--connector" src="${BASE_URL}assets/icons/line.svg" alt="">
                </label>
                <label class="settings__option">
                    <input type="radio" name="boardSize" value="24">
                    <span class="settings__radio"></span>
                    <span class="settings__option-text">24 cards</span>
                    <img class="icon icon__entry icon__entry--connector" src="${BASE_URL}assets/icons/line.svg" alt="">
                </label>
                <label class="settings__option">
                    <input type="radio" name="boardSize" value="36">
                    <span class="settings__radio"></span>
                    <span class="settings__option-text">36 cards</span>
                    <img class="icon icon__entry icon__entry--connector" src="${BASE_URL}assets/icons/line.svg" alt="">
                </label>
            </fieldset>
        </div>

        <div class="settings__preview" data-theme="code">
            <img class="img img__preview" data-preview-icon src="${previewImgs["codes"]}" alt="">            
        </div>

        <div class="settings__bar">
            <span data-bar-theme>${THEME_LABELS["codes"]} Theme</span>
            <img class="icon icon__entry icon__entry--slash" src="${BASE_URL}assets/icons/slash-line.svg" alt="">
            <span data-bar-player>${PLAYER_LABELS["blue"]} Player</span>
            <img class="icon icon__entry icon__entry--slash" src="${BASE_URL}assets/icons/slash-line.svg" alt="">
            <span data-bar-board-size>Board-16 Cards</span>
            <button class="button button__start">
                <img class="icon icon__entry icon__entry--start" src="${BASE_URL}assets/icons/arrow.svg" alt="">
                Start
            </button>
        </div>
    </section>
  `;

  const previewRef =
    settingsRef.querySelector<HTMLElement>(".settings__preview");
  const previewIconRef = settingsRef.querySelector<HTMLImageElement>(
    "[data-preview-icon]",
  );
  const barThemeRef = settingsRef.querySelector<HTMLElement>(
    "[data-bar-theme]",
  );
  const barPlayerRef = settingsRef.querySelector<HTMLElement>(
    "[data-bar-player]",
  );
  const barBoardSizeRef = settingsRef.querySelector<HTMLElement>(
    "[data-bar-board-size]",
  );

  settingsRef
    .querySelectorAll<HTMLInputElement>('input[name="theme"]')
    .forEach((input) => {
      input.addEventListener("change", () => {
        if (!input.checked) return;
        previewRef?.setAttribute("data-theme", THEME_MAP[input.value]);
        if (previewIconRef) previewIconRef.src = previewImgs[input.value];
        if (barThemeRef)
          barThemeRef.textContent = `${THEME_LABELS[input.value]} Theme`;
      });
    });

  settingsRef
    .querySelectorAll<HTMLInputElement>('input[name="player"]')
    .forEach((input) => {
      input.addEventListener("change", () => {
        if (!input.checked) return;
        if (barPlayerRef)
          barPlayerRef.textContent = `${PLAYER_LABELS[input.value]} Player`;
      });
    });

  settingsRef
    .querySelectorAll<HTMLInputElement>('input[name="boardSize"]')
    .forEach((input) => {
      input.addEventListener("change", () => {
        if (!input.checked) return;
        if (barBoardSizeRef)
          barBoardSizeRef.textContent = `Board-${input.value} Cards`;
      });
    });

  const startButtonRef = settingsRef.querySelector(".button__start");
  startButtonRef?.addEventListener("click", () => navigate("/game"));
}
