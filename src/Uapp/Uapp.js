// import FastClick from 'fastclick';
import UniversalRouter from 'universal-router';
// import bunyan from 'browser-bunyan';
// import qs from 'query-string';
// import { createPath } from 'history/PathUtils';
// import mixin from 'lego-starter-kit/utils/mixin';
// import history from './core/history';
// import { ErrorReporter, deepForceUpdate } from './core/devUtils';
// import { autobind } from 'core-decorators';
//
//
import DiffUapp from './DiffUapp';
// import assets from './assets';
//
// console.log({assets});

// import assets from './assets';
// console.log({assets});

export default class Uapp extends DiffUapp {
  async started() {
    if (__DEV__) {
      console.log(`🎃 Uapp started`);
    }
  }

  init() {

  }
  init2(rootState, req) {
    this.api = new ApiClient({ base: '/api/v1' });
    this.auth = new AuthStore(this);
    //
    // if (__SERVER__) {
    //   this.app.models
    // }
    // console.log({req, rootState});

    if (__SERVER__) {
      if (!req._errJwt && req.user && req.user._id) {
        this.auth.init({
          token: req.token,
          user: req.user,
        });
      }
    } else {
      this.auth.init({
        token: cookie.load('token'),
        user: rootState.user,
      });
    }
  }

  provide() {
    return {
      app: this,
    }
    return {
      uapp: this,
      auth: this.auth,
      user: this.auth && this.auth.user,
      api: this.api,
    };
  }


  getUniversalRoutes() {
    return require('./routes').default;
  }

  createPage() {
    return {};
  }
  getRootState() {
    return this.rootState || {};
  }

  getUniversalRoutesParams() {
    const req = this.getReq();
    return {
      path: req.path, // for universal routing

      // history
      // style
      // insertCss
      ...super.getUniversalRoutesParams(), // depends of cos-env

      req,
      app: this.app,
      uapp: this,
      rootState: this.getRootState(),
      page: this.createPage(),
    };
  }

  getPage() {
    console.log(this.getUniversalRoutes());
    return UniversalRouter.resolve(this.getUniversalRoutes(), this.getUniversalRoutesParams());
  }
}
