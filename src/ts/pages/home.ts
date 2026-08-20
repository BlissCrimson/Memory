import { navigate } from "../../router";
import { createFooter } from "../components/footer";
import { createErrorPage } from "./404";

/**
 * Show the home page.
 *
 * @returns {void}
 */
export function createHomePage() {
  let cardRef = document.querySelector("#app");
  if (!cardRef) return createErrorPage();
  const BASE_URL = import.meta.env.BASE_URL;
  cardRef.innerHTML = `
    <div class="container">
        <section class="welcome">
            <span>It's play time.</span>
            <h1>Ready to play?</h1>
            <button class="button button__entry">
                <img class="img img__entry img__entry--button" src="${BASE_URL}assets/icons/stadia_controller.svg" alt="controller">
                <p>Play</p>
                <img class="img img__entry img__entry--arrow" src="${BASE_URL}assets/icons/arrow.svg" alt="arrow">
            </button>
        </section>
        <img class="img img__entry img__entry--big" src="${BASE_URL}assets/icons/stadia_controller.svg" alt="controller">
        <footer id="imprint"></footer>
    </div>
  `;
  createFooter();
  const playButtonRef = cardRef.querySelector(".button__entry");
  playButtonRef?.addEventListener("click", () => navigate("/settings"));
}
