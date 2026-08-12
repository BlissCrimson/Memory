export function createGameCards() {
  let cardRef = document.querySelector("#app)");
  if (!cardRef) return;
  cardRef.innerHTML = `
  <section id="field">
        <button class="card">
            <div class="card__inner">
                <div class="card__face card__face--front"></div>
                <div class="card__face card__face--back"></div>
            </div>
        </button>
    </section>
  `;
}
