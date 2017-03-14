import React, { Component, PropTypes } from 'react';
import { Provider } from 'react-tunnel';

export default class Root extends Component {
  static childContextTypes = {
    history: PropTypes.object.isRequired,
    insertCss: PropTypes.func.isRequired,
    rootState: PropTypes.object.isRequired,
    setRootState: PropTypes.func.isRequired,
  };
  constructor(props) {
    super(props);
    this.state = props.ctx.rootState || {};
  }

  componentDidMount() {
    const html = document.getElementsByTagName('html')[0];
    html.className = html.className.replace('ua_js_no', 'ua_js_yes');
  }

  getChildContext() {
    return {
      history: this.props.ctx && this.props.ctx.history || (() => {}),
      insertCss: this.props.ctx && this.props.ctx.insertCss || (() => {}),
      rootState: this.state,
      setRootState: (...args) => {
        this.setState(...args);
      },
    };
  }
  render() {
    const provider = this.props.ctx.provider;
    return (<Provider provide={provider.provide.bind(provider)}>
      {() => this.props.component}
    </Provider>);
  }
}
