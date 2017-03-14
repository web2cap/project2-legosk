import polyfill from 'lego-starter-kit/utils/polyfill';
// import App from 'lego-starter-skit/MobxApp'
import App from 'lego-starter-kit/ReactApp';
polyfill();
const app = new App();
app.start()
