export function createGameField(boardSize: 16 | 24 | 36 = 16) {
  let fieldRef = document.querySelector("#app");
  if (!fieldRef) return;

  const cards = Array.from(
    { length: boardSize },
    () => `
        <button class="card">
            <div class="card__inner">
                <div class="card__face card__face--front"></div>
                <div class="card__face card__face--back"></div>
            </div>
        </button>
    `,
  ).join("");

  fieldRef.innerHTML = `
    <section id="field" class="field field--${boardSize}">
        ${cards}
    </section>
  `;
}
