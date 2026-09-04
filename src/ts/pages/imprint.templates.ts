/**
 * Builds the HTML markup for the Imprint (Impressum) page.
 *
 * @returns {string} The HTML markup for the imprint page.
 */
export function buildImprintMarkup(): string {
  const BASE_URL = import.meta.env.BASE_URL;
  return `
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
}
