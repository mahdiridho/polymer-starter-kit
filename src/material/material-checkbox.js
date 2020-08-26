import { LitElement, html } from 'lit-element';
import '@material/mwc-checkbox';

class MaterialCheckbox extends LitElement {
  render() {
    return html`
      <mwc-checkbox></mwc-checkbox>
      <mwc-checkbox checked></mwc-checkbox>
      <mwc-checkbox indeterminate></mwc-checkbox>
    `;
  }
}

window.customElements.define('material-checkbox', MaterialCheckbox);
