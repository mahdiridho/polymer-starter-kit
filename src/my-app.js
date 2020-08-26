/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import { html, LitElement } from 'lit-element';
import { router, navigator, outlet } from 'lit-element-router';
import { setPassiveTouchGestures, setRootPath } from '../utils/settings.js';
import { installMediaQueryWatcher } from "../utils/media-query";
import { Layouts } from '@collaborne/lit-flexbox-literals';

// These are the elements needed by this element.
import '@material/mwc-drawer';
import '@material/mwc-top-app-bar';
import '@material/mwc-icon-button';
import '@material/mwc-icon';
import '@material/mwc-list/mwc-list';
import '@material/mwc-list/mwc-list-item';
import '@material/mwc-snackbar';

class MyApp extends router(navigator(outlet(LitElement))) {
  static get styles() {
    return [
      Layouts
    ];
  }

  render() {
    // Anything that's related to rendering should be done in here.
    return html`
      <style>
        :host {
          --app-primary-color: #4285f4;
          --app-secondary-color: black;
          display: block;
        }

        mwc-drawer {
          height: 100vh;
        }

        mwc-icon-button.menu[hidden] {
          display: none;
        }

        .main-content {
          padding-left: 20px;
        }

        .sublist {
          padding-left: 20px;
        }

        .sublist[hidden] {
          display: none;
        }
        mwc-top-app-bar {
          --mdc-top-app-bar-width: ${this.desktop?'calc(100% - 256px)':'100%'};
        }
      </style>
      <!-- Header -->
      <mwc-drawer hasHeader .type="${this.desktop ? '' : 'modal'}" ?open=${this.drawerState} @MDCDrawer:closed="${() => this.drawerState = !this.drawerState}">
        <span slot="title">Menu</span>
        <span slot="subtitle">subtitle</span>
        <div>
          <mwc-list>
            <mwc-list-item graphic="avatar" @click="${() => this.linkClick('/home')}">
              <span>Home</span>
              <mwc-icon slot="graphic">home</mwc-icon>
            </mwc-list-item>
            <mwc-list-item graphic="avatar" @click="${this.material}">
              <span>
                Material
              </span>
              <mwc-icon slot="graphic">category</mwc-icon>
            </mwc-list-item>
            <mwc-list class="sublist" ?hidden="${!this.collapse}">
              <mwc-list-item graphic="avatar" @click="${() => this.linkClick('/material/button')}">
                <span>mwc-button</span>
                <mwc-icon slot="graphic">code</mwc-icon>
              </mwc-list-item>
              <mwc-list-item graphic="avatar" @click="${() => this.linkClick('/material/checkbox')}">
                <span>mwc-checkbox</span>
                <mwc-icon slot="graphic">code</mwc-icon>
              </mwc-list-item>
            </mwc-list>
          </mwc-list>
        </div>
        <div slot="appContent">
          <mwc-top-app-bar>
            <mwc-icon-button slot="navigationIcon" class="menu" icon="menu" ?hidden="${this.desktop}" @click="${() => this.drawerState = !this.drawerState}"></mwc-icon-button>
            <div slot="title">${this.headTitle}</div>
            <mwc-icon-button slot="actionItems" icon="account_circle" title="Profile"></mwc-icon-button>
          </mwc-top-app-bar>
          <div class="main-content">
            <my-home route='home'></my-home>
            <my-material route='material' .subroute="${this.params.name}"></my-material>
            <my-view404 route='view404'></my-view404>
          </div>
          <mwc-snackbar labelText="You are now ${this._offline ? 'offline' : 'online'}."></mwc-snackbar>
        </div>
      </mwc-drawer>
    `;
  }

  static get properties() {
    return {
      page: { type: String },
      params: { type: Object },
      query: { type: Object },
      data: { type: Object },
      appTitle: { type: String },
      headTitle: { type: String },
      _drawerOpened: { type: Boolean },
      _offline: { type: Boolean },
      desktop: { type: Boolean },
      drawerState: { type: Boolean },
      collapse: { type: Boolean }
    };
  }

  static get routes() {
    return [{
      name: 'home',
      pattern: '',
      data: { title: 'Home' }
    }, {
      name: 'home',
      pattern: 'home',
      data: { title: 'Home' }
    }, {
      name: 'profile',
      pattern: 'profile',
      data: { title: 'Profile' }
    }, {
      name: 'material',
      pattern: 'material'
    }, {
      name: 'material',
      pattern: 'material/:name'
    }, {
      name: 'view404',
      pattern: '*'
    }];
  }

  constructor() {
    super();
    // To force all event listeners for gestures to be passive.
    // See https://www.polymer-project.org/3.0/docs/devguide/settings#setting-passive-touch-gestures
    setPassiveTouchGestures(true);
    setRootPath(MyAppGlobals.rootPath);
    this.page = "";
    this.params = {};
    this.query = {};
    this.data = {};
    this.drawerState = false;
  }

  firstUpdated() {
    window.addEventListener('online', () => this._offline = false);
    window.addEventListener('offline', () => this._offline = true);
    installMediaQueryWatcher(`(min-width: 460px)`, desktop => this.desktop = desktop);
    fetch("./src/config.json").then((response)=>{ // load the file data
      return response.json()
    }).then((json)=>{
      console.log(json)
      window.MyAppGlobals = {
        ...window.MyAppGlobals,
        ...json
      };
      this.appTitle = MyAppGlobals.appTitle;
    }).catch((e)=>{
      console.log("ERROR : ",e)
      return reject(e)
    })
  }

  updated(updates) {
    if (updates.has('_offline'))
      this.shadowRoot.querySelector("mwc-snackbar").show();
    if (updates.has('page') || updates.has('params'))
      this._pageChanged();
  }

  router(route, params, query, data) {
    this.activeRoute = route;
    this.params = params;
    this.query = query;
    this.data = data;
    this._routeChanged();
    console.log(route, params, query, data)
  }

  material() {
    this.linkClick('/material');
    this.collapse = !this.collapse;
  }

  linkClick(path) {
    this.navigate(path);
  }

  _routeChanged() {
    // Show the corresponding page according to the route.
    //
    // If no page was found in the route data, page will be an empty string.
    // Show 'home' in that case. And if the page doesn't exist, show 'view404'.
    if (this.activeRoute == "") {
      this.page = "home";
    } else if (['home', 'material','view404'].indexOf(this.activeRoute) !== -1) {
      this.page = this.activeRoute;
    } else {
      this.navigate("/view404");
    }
  }

  _pageChanged() {
    this.requestUpdate(); // call it to wait the page prop complete updated
    // Import the page component on demand.
    //
    // Note: `polymer build` doesn't like string concatenation in the import
    // statement, so break it up.
    switch (this.page) {
      case 'home':
        this.headTitle = "Home";
        import('./my-home');
        break;
      case 'material':
        this.headTitle = "Material";
        import('./my-material');
        if (['button', 'checkbox'].indexOf(this.params.name) !== -1)
          this.headTitle += " - " + this.params.name;
        break;
      case 'view404':
        this.headTitle = "404";
        import('./my-view404');
        break;
    }

    document.title = this.appTitle + ' - ' + this.page;
    // Set open graph metadata
    this._setMeta('name', 'application-name', document.title);
    this._setMeta('name', 'apple-mobile-web-app-title', document.title);
  }

  _setMeta(attrName, attrValue, content) {
    let element = document.head.querySelector(`meta[${attrName}="${attrValue}"]`);
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute(attrName, attrValue);
      document.head.appendChild(element);
    }
    element.setAttribute('content', content || '');
  }
}

window.customElements.define('my-app', MyApp);
