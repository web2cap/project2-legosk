// import ssr from './ssr'
// import UniversalRouter from 'universal-router';
// import { createMemoryHistory } from 'history';
// import CoreApp from 'lego-starter-kit/CoreApp';
// import assets from './assets'; // eslint-disable-line import/no-unresolved
// import routes from './routes';
// import React, { Component, PropTypes } from 'react';
// import Html from './Html';
// import _ from 'lodash';
// import Provider from './Provider';
import qs from 'query-string';
import history from './core/history';

export default class DiffUapp extends Core {
  static createClient(app) {
    console.log('DiffUapp', app);
  }

  async init() {
    super.init();
    this.rootState = window.__ROOT_STATE__ || {};
  }

  getReq() {
    return {
      url: window.location.href,
      hostname: window.location.hostname,
      path: window.location.pathname,
      query: qs.parse(window.location.search),
    };
  }

  getUniversalRoutesParams() {
    const uparams = {
      history,
      style: [],
      insertCss: (...styles) => {
        const removeCss = styles.map(x => x._insertCss());
        return () => { removeCss.forEach(f => f()); };
      },
    };
    return uparams;
  }


  async onLocationChange(location) {
    const Root = this.constructor.Html.Root;
    LOGGING && console.log('onLocationChange', location);
    this.scrollPositionsHistory[this.currentLocation.key] = {
      scrollX: window.pageXOffset,
      scrollY: window.pageYOffset,
    };
    if (history.action === 'PUSH') {
      delete this.scrollPositionsHistory[location.key];
    }
    this.currentLocation = location;


    try {
      const props = await this.getHtmlProps(this.req);

      // console.log('??', this.currentLocation.key , location.key);
      if (this.currentLocation.key !== location.key) {
        return;
      }

      if (props.redirect) {
        history.replace(props.redirect);
        return;
      }
      if (__CLIENT__ && window.__CSR__) return false;
      this.appInstance = ReactDOM.render(
        <Root {...props} />,
        this.container,
        () => {
          this.postRender();
          this.renderCount += 1;
        },
      );
    } catch (error) {
      console.error('error!!@', error); // eslint-disable-line no-console

      // Current url has been changed during navigation process, do nothing
      if (this.currentLocation.key !== location.key) {
        return;
      }

      // Display the error in full-screen for development mode
      if (__DEV__) {
        this.appInstance = null;
        document.title = `Error: ${error.message}`;
        ReactDOM.render(<ErrorReporter error={error} />, this.container);
        return;
      }

      // Avoid broken navigation in production mode by a full
      //
      //   reload on error
      window.location.reload();
    }
  }

}
