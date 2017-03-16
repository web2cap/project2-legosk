// import ssr from './ssr'
// import UniversalRouter from 'universal-router';
import { createMemoryHistory } from 'history';
import Core from 'lego-starter-kit/Core';
// import assets from './assets'; // eslint-disable-line import/no-unresolved
// import routes from './routes';
// import React, { Component, PropTypes } from 'react';
// import Html from './Html';
// import _ from 'lodash';
// import Provider from './Provider';


export default class DiffUapp extends Core {
  // constructor(params) {
  //   console.log('constructor!!!');
  //   Object.assign(this, params);
  // }

  // getAssets() {
  //   return assets.main;
  // }

  // static async createServerRoute(app)
  //
  static createServerRoute(app) {
    // console.log({app});
    const api = app.asyncRouter();
    // api.all('/', () => ({ ok: true, version: '1.0.1' }));
    // return api;
    // this.asyncRouter
    //

    // const uapp = new this.prototype.constructor({
    //   app,
    //   config: app.config.client || {},
    //   // req
    // });
    // await uapp.init();
    // uapp.init();
    api.get('*', async (req, res) => {
      const uapp = new this.prototype.constructor({
        app,
        config: app.config.client || {},
        _req: req,
      });
      await uapp.init();
      await uapp.run(req);
      const pack = await uapp.serverResolve();
      if (pack.status) res.status(pack.status);
      if (pack.redirect) return res.redirect(pack.redirect);
      res.send(pack.content);
    });
    return api;
  }


  getReq() {
    return {
      url: this._req.url,
      path: this._req.path,
      query: this._req.query,
      hostname: this._req.hostname,
    };
  }

  getUniversalRoutesParams() {
    const uparams = {
      ...this.getReq(),
      history: createMemoryHistory({
        initialEntries: [this._req.url],
      }),
      style: [],
      insertCss: (...styles) => {
        // console.log(ctx.style);
        // console.log('styles', styles);
        styles.forEach(style => uparams.style.push(style._getCss()));
      },
    }
    return uparams;
  }


  async init() {
    super.init()
    this.rootState = {
      token: this._req.token,
      user: this._req.user,
    };
  }


  async serverResolve() {



    // @TODO server render


    const page = await this.getPage();
    console.log({page});


    return {
      content: 'hello',
    };
  }


}
