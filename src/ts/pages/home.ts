import { navigate } from "../../router";
import { createFooter } from "../components/footer";
import { createErrorPage } from "./404";
import { buildHomeMarkup } from "./home.templates";
import type { HomeElements } from "../types/home.types";

/**
 * Queries the home page elements and returns them as an object.
 *
 * @param cardRef - The home page container element.
 * @returns {HomeElements} The home page elements.
 */
function queryHomeElements(cardRef: Element): HomeElements {
  return {
    playButton: cardRef.querySelector(".button__entry"),
    arrowIcon: cardRef.querySelector<HTMLImageElement>(".icon__entry--arrow"),
    controllerIcon: cardRef.querySelector<HTMLImageElement>(
      ".icon__entry--button",
    ),
  };
}

/**
 * Registers the event listeners for the home page card interactions, including the play button click and hover effects.
 *
 * @param elements - The home page elements to wire up.
 * @returns {void}
 */
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
