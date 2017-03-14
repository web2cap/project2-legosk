// import React from 'react';
// import ReactDOM from 'react-dom';
import FastClick from 'fastclick';
// import UniversalRouter from 'universal-router';
// import mixin from 'lego-starter-kit/utils/mixin';
// import history from './core/history';
// import { ErrorReporter, deepForceUpdate } from './core/devUtils';
// import ClientApp from 'lego-starter-kit/ClientApp';
// import Uapp from 'lego-starter-kit/Uapp';
import Uapp from '../Uapp';

export default class ReactApp { // extends ClientApp {

  @autobind
  async init() {
    await super.init();
    FastClick.attach(document.body);
    // this.hmrInit();

    if (!this.Uapp) this.Uapp = Uapp;
    this.uapp = Uapp.createClient(this);
    this.uapp.init();
    // this.container = document.getElementById('root');
    // // @TODO: window.history.scrollRestoration = 'manual';
    // this.currentLocation = history.location;
    // history.listen(this.onLocationChange.bind(this));
    // this.onLocationChange(this.currentLocation);
  }

  async run() {
    await super.run();
    if (this.uapp) await this.uapp.run();
  }

  hmrUpdate() {
    // if (this.reactDom) {
    //   try {
    //     deepForceUpdate(this.reactDom);
    //   } catch (error) {
    //     this.reactDom = null;
    //     document.title = `Hot Update Error: ${error.message}`;
    //     ReactDOM.render(<ErrorReporter error={error} />, this.container);
    //     return;
    //   }
    // }
    // this.onLocationChange(this.currentLocation);
  }
  hmrInit() {
    // if (module.hot) {
    // module.hot.accept('./routes', () => {
    //   // const routes = this.getUniversalRoutes();
    //   if (this.reactDom) {
    //     try {
    //       deepForceUpdate(this.reactDom);
    //     } catch (error) {
    //       this.reactDom = null;
    //       document.title = `Hot Update Error: ${error.message}`;
    //       ReactDOM.render(<ErrorReporter error={error} />, this.container);
    //       return;
    //     }
    //   }
    //   this.onLocationChange(this.currentLocation);
    // });
  }

  // client = session
  // server = req
  // req = { // middlewares.req
  //   // storage
  //   // session
  //   // token: 2345476857,
  //   // api: new Api(),
  //   rootState: window.__ROOT_STATE__ || {},
  // }

  //
  // // session storage for rootState
  // rootState = {
  //   // config: this.config,
  //   ...(window.__ROOT_STATE__ || {}),
  // };
  //
  //
  // // / Synonims
  // //
  // // На клиете получает rootState,
  // // на сервере создает rootState
  // getRootState(req) {
  //   return this.rootState;
  // }
  //
  // AppStore = AppStore;
  // createAppStore() {
  //   return new this.AppStore();
  // }
  //
  // // getUreq
  // getReqCtx(req) {
  //   const rootState = this.getReqRootState(req);
  //   if (req.provider == null) {
  //     req.provider = this.createAppStore(rootState, req);
  //     this.provider = req.provider;
  //   }
  //   const ctx = {
  //     config: this.config,
  //     rootState,
  //     req,
  //     provider: req.provider,
  //     history,
  //     style: [],
  //     insertCss: (...styles) => {
  //       const removeCss = styles.map(x => x._insertCss());
  //       return () => { removeCss.forEach(f => f()); };
  //     },
  //   };
  //   return ctx;
  // }
  //
  //
  // // getUniversalRouterParams
  // getUniversalRouterParams(req) {
  //   const reqCtx = this.getReqCtx(req);
  //   return {
  //     ...parseLocation(),
  //
  //     app: this,
  //     ctx: reqCtx,
  //     appStore: reqCtx && reqCtx.provider,
  //     status: 200,
  //   };
  // }
  //
  // async getHtmlProps(req) {
  //   const params = await this.getUniversalRouterParams(req);
  //   const route = await UniversalRouter.resolve(this.getUniversalRoutes(), params);
  //   return {
  //     ...params,
  //     ...route,
  //     params,
  //     route,
  //     children: route.component,
  //   };
  // }
}
