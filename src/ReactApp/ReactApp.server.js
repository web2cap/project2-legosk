import CoreApp from 'lego-starter-kit/CoreApp';
// import Uapp from 'lego-starter-kit/Uapp';
import Uapp from '../Uapp';


export default class ReactApp extends CoreApp {

  async init() {
    await super.init();
    if (!this.Uapp && this.config.ssr) this.Uapp = Uapp;
  }

  useDefaultRoute() {
    if (this.config.ssr) {
      this.express.use(this.config.ssr.route, Uapp.createServerRoute(this));
    }
  }

}
