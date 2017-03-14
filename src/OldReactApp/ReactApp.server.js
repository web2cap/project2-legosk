import CoreApp from 'lego-starter-kit/CoreApp';
import Uapp from 'lego-starter-kit/Uapp';

export default class ReactApp extends CoreApp {

  init() {
    if (!this.Uapp && this.config.ssr) this.Uapp = Uapp;
  }

  useDefaultRoute() {
    if (this.config.ssr) {
      this.express.use(this.config.ssr.route, Uapp.createServerRoute(this));
    }
  }

}
