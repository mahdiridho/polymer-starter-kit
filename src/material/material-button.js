import { LitElement, html } from 'lit-element';
import '@material/mwc-button';

class MaterialButton extends LitElement {
  render() {
    return html`
      <mwc-button raised label="mwc-button"></mwc-button>
    `;
  }
}

window.customElements.define('material-button', MaterialButton);
