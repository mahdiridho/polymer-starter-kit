import { LitElement, html } from 'lit-element';
import { navigator } from 'lit-element-router';

class MyMaterial extends navigator(LitElement) {
  render() {
    return html`
      <h3>UI List</h3>
      <material-button ?hidden="${this.subroute=='button'?false:true}"></material-button>
      <material-checkbox ?hidden="${this.subroute=='checkbox'?false:true}"></material-checkbox>
    `;
  }

  static get properties() {
    return {
      subroute: { type: String }
    }
  }

  constructor() {
    super();
    this.subroute = '';
  }

  updated(updates) {
    if (updates.has('subroute'))
      this._subrouteChanged();
  }

  _subrouteChanged() {
    this.requestUpdate(); // call it to wait the page prop complete updated
    if (['button', 'checkbox'].indexOf(this.subroute) !== -1) {
      import('./material/material-' + this.subroute + '.js');
    } else {
      this.navigate("/material");
    }
  }
}

window.customElements.define('my-material', MyMaterial);
