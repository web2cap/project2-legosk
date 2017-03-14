import logger from './logger';
import config from './config';

export default class Core {
  constructor(params = {}) {
    Object.assign(this, params);
  }

  getLogger(params) {
    const options = Object.assign({
      name: 'app',
      src: __DEV__,
      level: 'trace',
    }, this.config.logger || {}, params);
    return logger.createLogger(options);
  }

  async init() {
    if (!this.config) this.config = config;
    if (!this.log) this.log = this.getLogger();
    // this.log.trace('Core init');
  }

  async run() {}

  async started() {
    if (__DEV__) {
      console.log(`🎃  The server is running at http://127.0.0.1${this.config.port ? ':' + this.config.port : ''}/ [${global.timing()}ms]`);
    }
  }

  async start() {
    await this.init();
    await this.run();
    await this.started();
  }
}
