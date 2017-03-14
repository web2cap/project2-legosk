import bunyan from 'bunyan';
import express from 'express';
import _ from 'lodash';
import { Server as httpServer } from 'http';
import mixin from 'lego-starter-kit/utils/mixin';
import AsyncRouter from 'lego-starter-kit/utils/AsyncRouter';
import Core from 'lego-starter-kit/Core';

export default class ExpressApp extends Core {
  static mixin = mixin;
  asyncRouter = AsyncRouter;

  createExpress() {
    return express();
  }

  async init() {
    super.init();
    this.log.trace('ExpressApp init');
    this.express = this.createExpress();
    this.httpServer = httpServer(this.express);
    if (this.config.express) {
      this.log.trace('express config:', this.config.express);
      _.forEach((this.config.express || {}), (value, key) => {
        this.express.set(key, value);
      });
    }
  }

  get app() {
    this.log.info('this.app DEPRECATED');
    return this.express;
  }

  // async initExpress() {
  //   this.log.trace('ExpressApp initExpress');
  //   this.useMiddlewares();
  //   this.useRoutes();
  //   this.useStatics();
  //   this.useDefaultRoute();
  //   return this;
  // }
  async runExpress() {
    this.log.trace('ExpressApp.runExpress');
    this.useMiddlewares();
    this.useRoutes();
    this.useStatics();
    this.useDefaultRoute();
    // this.useExpress();
    // this.log.trace('ExpressApp runExpress');
    return new Promise((resolve) => {
      this.httpInstance = this.httpServer.listen(this.config.port, () => {
        this.log.info(`App running on port ${this.config.port}!`);
        resolve(this);
      });
    });
  }

  useMiddlewares() {}
  useStatics() {}
  useRoutes() {}
  useDefaultRoute() {
    this.express.use((req, res) => {
      return res.send('ExpressApp: Hello World');
    });
  }

  async run() {
    // await this.initExpress();
    await this.runExpress();
  }

}
