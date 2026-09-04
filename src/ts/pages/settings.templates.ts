export const THEME_LABELS: Record<string, string> = {
  codes: "Code vibes",
  gaming: "Gaming",
  "da-projects": "DA Projects",
  food: "Foods",
};

export const PREVIEW_IMAGE_PATHS: Record<string, string> = {
  codes: "assets/img/themes/code/preview.svg",
  gaming: "assets/img/themes/gaming/preview.svg",
  "da-projects": "assets/img/themes/projects/preview.svg",
  food: "assets/img/themes/food/preview.svg",
};

/**
 * Builds the HTML markup for the settings heading.
 *
 * @returns {string} The HTML markup for the settings heading.
 */
export function buildSettingsHeadingMarkup(): string {
  const BASE_URL = import.meta.env.BASE_URL;
  return `
            <div class="settings__heading">
                <h2>Settings</h2>
                <img class="icon__settings--headline" src="${BASE_URL}assets/icons/line-big.svg" alt="">
            </div>
  `;
}

/**
 * Builds the HTML markup for a settings option.
 *
 * @param groupName - The radio group name.
 * @param value - The option's value.
 * @param labelText - The label text shown to the user.
 * @returns {string} The HTML markup for the settings option.
 */
export function buildSettingsOptionMarkup(
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

/**
 * Builds the HTML markup for the theme fieldset.
 *
 * @returns {string} The HTML markup for the theme fieldset.
 */
export function buildThemeFieldsetMarkup(): string {
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

/**
 * Builds the HTML markup for the player fieldset.
 *
 * @returns {string} The HTML markup for the player fieldset.
 */
export function buildPlayerFieldsetMarkup(): string {
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

/**
 * Builds the HTML markup for the board size fieldset.
 *
 * @returns {string} The HTML markup for the board size fieldset.
 */
export function buildBoardSizeFieldsetMarkup(): string {
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

/**
 * Builds the HTML markup for the settings bar.
 *
 * @returns {string} The HTML markup for the settings bar.
 */
export function buildSettingsBarMarkup(): string {
  const BASE_URL = import.meta.env.BASE_URL;
  return `
            <div class="settings__bar">
                <div class="settings__bar-labels">
                    <span class="settings__bar-label" data-bar-theme>GameTheme</span>
                    <span class="settings__bar-slash">
                        <img class="icon icon__entry icon__entry--slash" data-slash-theme src="${BASE_URL}assets/icons/slash-line.svg" alt="">
                    </span>
                    <span class="settings__bar-label" data-bar-player>Player</span>
                    <span class="settings__bar-slash">
                        <img class="icon icon__entry icon__entry--slash" data-slash-player src="${BASE_URL}assets/icons/slash-line.svg" alt="">
                    </span>
                    <span class="settings__bar-label" data-bar-board-size>Board-Size</span>
                </div>
                <button class="button button__start" disabled>
                    <img class="icon icon__entry icon__entry--start" src="${BASE_URL}assets/icons/smart_display.svg" alt="">
                    Start
                </button>
            </div>
  `;
}

/**
 * Builds the HTML markup for the preview panel.
 *
 * @returns {string} The HTML markup for the preview panel.
 */
export function buildPreviewPanelMarkup(): string {
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

/**
 * Builds the HTML markup for the main settings container.
 *
 * @returns {string} The HTML markup for the settings page.
 */
export function buildSettingsMarkup(): string {
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
