import { extendObservable, observable, action, computed, toJS } from 'mobx';
import { set, clone } from 'lodash';

export default class UserStore {

  @observable _id;
  @observable role;
  @observable profile = {
    avatar: undefined,
    firstName: undefined,
    lastName: undefined,
    middleName: undefined,
    city: undefined,
    bdate: undefined,
    sex: undefined,
    about: undefined,
    phone: undefined,
    email: undefined,
  };

  constructor(store, user) {
    this.store = store;
    if (user) {
      this.update(user);
      if (__CLIENT__) this.init(user);
    }
  }

  async init(data) {
    const user = await this.store.api.getUser(data);
    this.update(user);
  }

  update(user) {
    console.log('ingoing user', user);
    if (!user) return this.reset();
    for (const item in user) {
      set(this, item, user[item]);
    }
  }

  reset() {
    extendObservable(this, {
      _id: undefined,
      role: undefined,
      profile: {
        avatar: undefined,
        firstName: undefined,
        lastName: undefined,
        middleName: undefined,
        city: undefined,
        bdate: undefined,
        sex: undefined,
        about: undefined,
        phone: undefined,
        email: undefined,
      },
    });
  }

  @action
  async editUser(data) {
    this.store.ui.status('wait');
    const backup = clone(this.toJS);
    const res = await this.store.api.userEdit(data);
    this.update(res.data);
    this.store.ui.status(res.message);
    console.log(res);
    if (res.message !== 'ok') {
      this.update(backup);
    }
  }

  @computed get fullName() {
    return `${this.profile.firstName || 'Нет данных'} ${this.profile.lastName || ''}`;
  }

  @computed get toJS() {
    const self = toJS(this);
    delete self.store;
    return self;
  }

  @computed get profileLink() {
    return `/user/${this._id}`;
  }

}
