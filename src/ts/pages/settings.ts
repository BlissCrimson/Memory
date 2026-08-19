import { createErrorPage } from "./404";

/**
 * Show the Settings page.
 *
 * @returns {void}
 */
export function createSettingsPage() {
  const settingsRef = document.querySelector("#app");
  if (!settingsRef) return createErrorPage();
  settingsRef.innerHTML = `
    <section class="settings">
        <div class="settings__form">
            <h1>Settings</h1>

            <fieldset class="settings__group">
                <legend>Game themes</legend>
                <label>
                    <input type="radio" name="theme" value="code-vibes">
                    Code vibes theme
                </label>
                <label>
                    <input type="radio" name="theme" value="gaming">
                    Gaming theme
                </label>
                <label>
                    <input type="radio" name="theme" value="da-projects">
                    DA Projects theme
                </label>
                <label>
                    <input type="radio" name="theme" value="food">
                    Foods theme
                </label>
            </fieldset>

            <fieldset class="settings__group">
                <legend>Choose player</legend>
                <label>
                    <input type="radio" name="player" value="blue">
                    Blue
                </label>
                <label>
                    <input type="radio" name="player" value="orange">
                    Orange
                </label>
            </fieldset>

            <fieldset class="settings__group">
                <legend>Board size</legend>
                <label>
                    <input type="radio" name="boardSize" value="16">
                    16 cards
                </label>
                <label>
                    <input type="radio" name="boardSize" value="24">
                    24 cards
                </label>
                <label>
                    <input type="radio" name="boardSize" value="36">
                    36 cards
                </label>
            </fieldset>
        </div>

        <div class="settings__preview"></div>

        <div class="settings__bar">
            <span>Game theme</span>
            <span>Player</span>
            <span>Board size</span>
            <button class="button button__start">Start</button>
        </div>
    </section>
  `;
}
