import { navigate } from "../../router";
import { createFooter } from "../components/footer";
import { createErrorPage } from "./404";

interface HomeElements {
  playButton: Element | null;
  arrowIcon: HTMLImageElement | null;
  controllerIcon: HTMLImageElement | null;
}

function buildHomeMarkup(): string {
  const BASE_URL = import.meta.env.BASE_URL;
  return `
        <div class="container">
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
        </div>
        <footer id="imprint"></footer>
      `;
}

function queryHomeElements(cardRef: Element): HomeElements {
  return {
    playButton: cardRef.querySelector(".button__entry"),
    arrowIcon: cardRef.querySelector<HTMLImageElement>(".icon__entry--arrow"),
    controllerIcon: cardRef.querySelector<HTMLImageElement>(
      ".icon__entry--button",
    ),
  };
}

function registerHomeCardInteractions(elements: HomeElements): void {
  const BASE_URL = import.meta.env.BASE_URL;
  const { playButton, arrowIcon, controllerIcon } = elements;
  playButton?.addEventListener("click", () => navigate("/settings"));
  playButton?.addEventListener("mouseenter", () => {
    if (arrowIcon) arrowIcon.src = `${BASE_URL}assets/icons/arrow_big.svg`;
    if (controllerIcon)
      controllerIcon.src = `${BASE_URL}assets/icons/controller-hover.svg`;
  });
  playButton?.addEventListener("mouseleave", () => {
    if (arrowIcon) arrowIcon.src = `${BASE_URL}assets/icons/arrow.svg`;
    if (controllerIcon)
      controllerIcon.src = `${BASE_URL}assets/icons/stadia_controller.svg`;
  });
}

/**
 * Show the home page.
 *
 * @returns {void}
 */
export function createHomePage() {
  const cardRef = document.querySelector("#app");
  if (!cardRef) return createErrorPage();
  cardRef.innerHTML = buildHomeMarkup();
  createFooter();
  registerHomeCardInteractions(queryHomeElements(cardRef));
}
