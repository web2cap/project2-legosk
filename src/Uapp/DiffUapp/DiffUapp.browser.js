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


export default class DiffUapp {
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

}
