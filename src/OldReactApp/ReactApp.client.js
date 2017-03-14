import React from 'react';
import ReactDOM from 'react-dom';
import FastClick from 'fastclick';
import UniversalRouter from 'universal-router';
import qs from 'query-string';
import { createPath } from 'history/PathUtils';
import mixin from 'lego-starter-kit/utils/mixin';
import history from './core/history';
import { ErrorReporter, deepForceUpdate } from './core/devUtils';
import { autobind } from 'core-decorators';
import ClientApp from 'lego-starter-kit/ClientApp';
import routes from './routes';
import Html from './Html';
import AppStore from './AppStore';


const LOGGING = false;

function parseLocation() {
  return {
    path: location.pathname, // eslint-disable-line
    query: qs.parse(location.search), // eslint-disable-line
  };
}

export default class ReactApp extends ClientApp {
  static Html = Html;

  restoreScrollPosition(state) {
    LOGGING && console.log('restoreScrollPosition');
    if (state && state.scrollY !== undefined) {
      window.scrollTo(state.scrollX, state.scrollY);
    } else {
      window.scrollTo(0, 0);
    }
  }

  renderCount = 0
  postRender() {
    LOGGING && console.log('postRender', this.renderCount);
    if (this.renderCount === 0) {
      const elem = document.getElementById('css');
      if (elem) elem.parentNode.removeChild(elem);
      return;
    }
    // @TODO: change document title
    // document.title = 'route.title';
    //
    // @TODO: restore scroll Positions
    // @TODO: Hit yandex metric
    if (window.ga) {
      window.ga('send', 'pageview', createPath(location));
    }
  }

  getUniversalRoutes() {
    return routes;
  }


  currentLocation = null
  @autobind
  async onLocationChange(location) {
    const Root = this.constructor.Html.Root;
    LOGGING && console.log('onLocationChange', location);
    // this.scrollPositionsHistory[this.currentLocation.key] = {
    //   scrollX: window.pageXOffset,
    //   scrollY: window.pageYOffset,
    // };
    // if (history.action === 'PUSH') {
    //   delete this.scrollPositionsHistory[location.key];
    // }
    this.currentLocation = location;


    try {
      const props = await this.getHtmlProps();

      // console.log('??', this.currentLocation.key , location.key);
      if (this.currentLocation.key !== location.key) {
        return;
      }

      if (props.redirect) {
        history.replace(props.redirect);
        return;
      }
      this.reactDom = ReactDOM.render(
        <Root {...props} />,
        this.container,
        () => {
          this.postRender();
          this.renderCount += 1;
        },
      );
    } catch (error) {
      console.error('ReactApp.client render error', error); // eslint-disable-line no-console

      // Current url has been changed during navigation process, do nothing
      if (this.currentLocation.key !== location.key) {
        return;
      }

      // Display the error in full-screen for development mode
      if (__DEV__) {
        this.reactDom = null;
        document.title = `Error: ${error.message}`;
        try {
          ReactDOM.render(<ErrorReporter error={error} />, this.container);
        } catch (err) {
          ReactDOM.render(<div children={JSON.stringify(error)} />, this.container);
        }
        return;
      }

      // Avoid broken navigation in production mode by a full page reload on error
      window.location.reload();
    }
  }

  @autobind
  async init() {
    await super.init();
    FastClick.attach(document.body);
    this.container = document.getElementById('root');
    // @TODO: window.history.scrollRestoration = 'manual';
    this.currentLocation = history.location;
    history.listen(this.onLocationChange.bind(this));
    this.onLocationChange(this.currentLocation);
    this.hmrInit();
  }

  async run() {
    await super.run();
    // @TODO: Run the application when both DOM is ready and page content is loaded
    return Promise.resolve();
  }

  hmrUpdate() {
    if (this.reactDom) {
      try {
        deepForceUpdate(this.reactDom);
      } catch (error) {
        this.reactDom = null;
        document.title = `Hot Update Error: ${error.message}`;
        ReactDOM.render(<ErrorReporter error={error} />, this.container);
        return;
      }
    }
    this.onLocationChange(this.currentLocation);
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


  // session storage for rootState
  rootState = {
    // config: this.config,
    ...(window.__ROOT_STATE__ || {}),
  };


  // / Synonims
  //
  // На клиете получает rootState,
  // на сервере создает rootState
  getRootState(req) {
    return this.rootState;
  }

  AppStore = AppStore;
  createAppStore() {
    return new this.AppStore();
  }

  // getUreq
  getReqCtx(req) {
    const rootState = this.getReqRootState(req);
    if (req.provider == null) {
      req.provider = this.createAppStore(rootState, req);
      this.provider = req.provider;
    }
    const ctx = {
      config: this.config,
      rootState,
      req,
      provider: req.provider,
      history,
      style: [],
      insertCss: (...styles) => {
        const removeCss = styles.map(x => x._insertCss());
        return () => { removeCss.forEach(f => f()); };
      },
    };
    return ctx;
  }


  // getUniversalRouterParams
  getUniversalRouterParams(req) {
    const reqCtx = this.getReqCtx(req);
    return {
      ...parseLocation(),

      app: this,
      ctx: reqCtx,
      appStore: reqCtx && reqCtx.provider,
      status: 200,
    };
  }

  async getHtmlProps(req) {
    const params = await this.getUniversalRouterParams(req);
    const route = await UniversalRouter.resolve(this.getUniversalRoutes(), params);
    return {
      ...params,
      ...route,
      params,
      route,
      children: route.component,
    };
  }
}
