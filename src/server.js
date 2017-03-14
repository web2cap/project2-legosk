import polyfill from 'lego-starter-kit/utils/polyfill';
import App from 'lego-starter-kit/ReactApp';
// import App from 'lego-starter-kit/CoreApp';
polyfill();
const app = new App();
app.start();
// console.log = (...args) => app.getLogger({ name: 'console' }).info(...args);
// log('adasd')
// console.log('asdasdas');
