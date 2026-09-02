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
        <section class="welcome">
            <span class="welcome__intro">It's play time.</span>
            <h1>Ready to play?</h1>
            <button class="button button__entry">
                <span class="button__entry-label">
                    <img class="icon icon__entry icon__entry--button" src="${BASE_URL}assets/icons/stadia_controller.svg" alt="">
                    <p>Play</p>
                </span>
                <img class="icon icon__entry icon__entry--arrow" src="${BASE_URL}assets/icons/arrow.svg" alt="">
            </button>
        </section>
        <img class="icon icon__entry icon__entry--big" src="${BASE_URL}assets/icons/stadia_controller.svg" alt="">
        <footer id="imprint"></footer>
      `;
  createFooter();
  const playButtonRef = cardRef.querySelector(".button__entry");
  const arrowIconRef = cardRef.querySelector<HTMLImageElement>(
    ".icon__entry--arrow",
  );
  const controllerIconRef = cardRef.querySelector<HTMLImageElement>(
    ".icon__entry--button",
  );
  playButtonRef?.addEventListener("click", () => navigate("/settings"));
  playButtonRef?.addEventListener("mouseenter", () => {
    if (arrowIconRef)
      arrowIconRef.src = `${BASE_URL}assets/icons/arrow_big.svg`;
    if (controllerIconRef)
      controllerIconRef.src = `${BASE_URL}assets/icons/controller-hover.svg`;
  });
  playButtonRef?.addEventListener("mouseleave", () => {
    if (arrowIconRef) arrowIconRef.src = `${BASE_URL}assets/icons/arrow.svg`;
    if (controllerIconRef)
      controllerIconRef.src = `${BASE_URL}assets/icons/stadia_controller.svg`;
  });
}
