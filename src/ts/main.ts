import { renderRoute } from "../router";
import "/src/styles/style.scss";

init();

function init() {
  renderRoute(window.location.pathname);
  // const fieldRef = document.getElementById("field");
  // if (fieldRef) {
  //   fieldRef.addEventListener("click", (e) => {
  //     const card = (e.target as HTMLElement).closest(       ".card",     ) as HTMLButtonElement;
  //     if (card) {
  //       card.classList.toggle("is-flipped");
  //     }
  //   });
  // }
}
