import FastClick from 'fastclick';
import UniversalRouter from 'universal-router';
import bunyan from 'browser-bunyan';
import qs from 'query-string';
import { createPath } from 'history/PathUtils';
import mixin from 'lego-starter-kit/utils/mixin';
import history from './core/history';
import { ErrorReporter, deepForceUpdate } from './core/devUtils';
import { autobind } from 'core-decorators';

export default class ClientApp {
  constructor(params = {}) {
    Object.assign(this, params);
  }
  getLogger(params) {
    const options = Object.assign({
      name: 'app',
      src: __DEV__,
      level: 'trace',
    }, this.config.logger || {}, params);
    return bunyan.createLogger(options);
  }

  async init() {
    if (!this.log) this.log = this.getLogger();
    this.log.trace('ClientApp init');
  }


  hmrUpdate() {
    if (this.reactDom) {
      try {
        deepForceUpdate(this.reactDom);
      } catch (error) {
        // this.reactDom = null;
        // document.title = `Hot Update Error: ${error.message}`;
        // ReactDOM.render(<ErrorReporter error={error} />, this.container);
        return;
      }
    }
    this.onLocationChange(this.currentLocation);
  }
  hmrInit() {
    this.log.warn('HMR NOT INITED');
  }

  async run() {
    await this.init();
  }

  async afterRun() {
    if (__DEV__) {
      console.log(`🎃  The client is running  [${global.timing()}ms]`);
    }
  }

  async start() {
    await this.run();
    await this.afterRun();
  }

}
