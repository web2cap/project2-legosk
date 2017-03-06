import { observable, action, computed, toJS } from 'mobx';
import set from 'lodash/set';

export default class UserStore {

  @observable username;
  @observable firstName;
  @observable lastName;
  @observable fullname;
  @observable info = {
    phone: '',
    company: '',
  };

  constructor(store, user) {
    this.store = store;
    if (user) {
      this.update(user);
      if (__CLIENT__) this.init(user);
    }
  }

  async init(data) {
    console.log('init');
    const user = await this.store.api.getUser(data);
    console.log(user);
    this.update(user);
  }

  update(user) {
    console.log(user, 'update');
    for (const item in user) {
      set(this, item, user[item]);
    }
  }

  @action
  editField(field = null, text) {
    if (field) set(this, field, text);
  }

  @action
  editUser() {
    this.store.api.userEdit(this.toJS);
  }

  @computed get fullName() {
    return `${this.firstName} ${this.lastName}`;
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
