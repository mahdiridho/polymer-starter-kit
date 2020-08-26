import { LitElement, html } from 'lit-element';

class MyHome extends LitElement {
  render() {
    return html`
      <h1>Welcome to litelement starter kit!</h1>
    `;
  }
}

window.customElements.define('my-home', MyHome);
