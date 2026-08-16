export function createWelcomePage() {
  let cardRef = document.querySelector("#app");
  if (!cardRef) return;
  cardRef.innerHTML = `
    <section class="welcome">
        <span>It's play time.</span>
        <h1>Ready to play?</h1>
    </section>
    <button class="button button__entry">
        <img src="./public/assets/icons/stadia_controller.svg" alt="controller">
        <p>Play</p>
        <img src="./public/assets/icons/arrow.svg" alt="arrow">
    </button>
  `;
}
