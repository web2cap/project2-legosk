import { computed, action } from 'mobx';
import cookie from 'react-cookie';

export default class AuthStore {

  token = null;

  constructor(store, data) {
    this.store = store;
    this.data = data;
    this.authenticate();
  }

  authenticate() {
    if (__CLIENT__) return this.authOnClient();
    if (__SERVER__) return this.authOnServer();
    return null;
  }

  authOnServer() {
    if (!this.isErrorJWT && this.isToken && this.isUser) {
      this.setToken(this.data.req.token);
      this.updateUser(this.data.req.user);
    } else {
      this.logout();
    }
  }

  authOnClient() {
    if (this.isToken && this.isUser) {
      this.setToken(cookie.load('token'));
      this.updateUser(this.data.state.user);
    } else {
      this.logout();
    }
  }

  async checkAuthData() {
    if (!this.isToken || !this.isUser) {
      await this.logout();
      return false;
    }
    return true;
  }

  async logout() {
    await this.unsetToken();
    this.updateUser();
  }

  async unsetToken() {
    await this.store.api.setAuthToken(null);
    cookie.remove('token');
    this.token = null;
  }

  async setToken(token) {
    console.log('setToken', token);
    this.store.api.setAuthToken(token);
    cookie.save('token', token);
    this.token = token;
  }

  async signup(data) {
    const res = await this.store.api.authSignup(data);
    await this.setToken(res.token);
    await this.updateUser(res.user);
    return res;
  }

  async login(data) {
    const res = await this.store.api.authLogin(data);
    await this.setToken(res.token);
    await this.updateUser(res.user);
    return res;
  }

  async recovery(data) {
    const res = await this.store.api.authRecovery(data);
    return res;
  }
  // social networks
  async signupSocial(data) {
    this.promise = this.store.api.signupSocial(data);
    const res = await this.promise;
    console.log(res, 'signupSocial');
    await this.setToken(res.data.token);
    await this.updateUser(res.data.user);
    return res;
  }
  async loginSocial(data) {
    this.promise = this.store.api.loginSocial(data);
    const res = await this.promise;
    console.log(res, 'loginSocial');
    await this.setToken(res.data.token);
    await this.updateUser(res.data.user);
    return res;
  }

  @action
  async updateUser(data = null) {
    console.log('updateUser', data);
    console.log(this.store.user);
    if (this.store.user) {
      console.log(true);
      this.store.user.update(data);
    }
  }

  @computed get isAuth() {
    return this.store.user._id;
  }

  @computed get isErrorJWT() {
    return this.data.req._errJwt;
  }

  @computed get isToken() {
    return this.data.req.token !== 'undefined' || !this.data.req.token || cookie.load('token');
  }

  @computed get isUser() {
    return this.data.req.user && this.data.req.user._id || this.data.state.user && this.data.state.user._id;
  }

}
