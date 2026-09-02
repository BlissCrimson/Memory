import { navigate } from "../../router";
import { createErrorPage } from "./404";

/**
 * Show the Imprint (Impressum) page.
 *
 * @returns {void}
 */
export function createImprintPage() {
  const imprintRef = document.querySelector<HTMLElement>("#app");
  if (!imprintRef) return createErrorPage();
  const BASE_URL = import.meta.env.BASE_URL;

  imprintRef.innerHTML = `
    <section class="imprint">
        <h2>Impressum</h2>

        <h3>Verantwortliche(r)</h3>
        <p>Matthias Tausch</p>

        <h3>Postanschrift</h3>
        <p>Eikammsweg 10<br>25821 Breklum</p>

        <h3>Kontakt</h3>
        <p>E-Mail: m.tausch89@gmail.com</p>
        <p>Telefon: +49 170 3828724</p>

        <h3>Urheberrechtliche Hinweise</h3>
        <p>[Bitte Informationen ergänzen]</p>

        <h3>Verantwortlich für journalistisch-redaktionelle Inhalte</h3>
        <p>[Bitte Informationen ergänzen]</p>

        <button class="button button__entry" data-back>
            <img class="icon icon__entry icon__entry--button" src="${BASE_URL}assets/icons/arrow.svg" alt="">
            <p>Back to start</p>
        </button>
    </section>
  `;

  const backButtonRef = imprintRef.querySelector("[data-back]");
  backButtonRef?.addEventListener("click", () => navigate("/"));
}
