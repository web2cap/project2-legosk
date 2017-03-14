import React, { Component, PropTypes  } from 'react';
import { Provider } from 'react-tunnel'
// import useragent from 'useragent'
import _ from 'lodash'
import util from 'util'
import ReactDOM from 'react-dom/server';
import Root from './Root';

export default class Html {

  constructor(props) {
    this.props = props || {}
  }

  getHtmlClass(req) {
    const ua = {}//useragent.is(req.headers['user-agent'])
    ua.js = false
    return _.map(ua, (val, key) => `ua_${key}_${val ? 'yes' : 'no'}`).join(' ') || ''
  }

  getRootState() {
    return this.props.ctx.rootState
  }

  renderStyle() {
    // console.log('this.props.ctx', this.props.ctx);
    const styles = this.props.ctx.style || []
    return `<style id="css">${(styles).join("\n")}</style>`
  }
  renderHead() {
    return `\
<title>${this.props.title}</title>
<meta charset="utf-8">
<meta http-equiv="x-ua-compatible" content="ie=edge" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
${this.renderAssets('css')}
${this.renderStyle()}
<!--[if lt IE 9]>
  <script src="https://oss.maxcdn.com/html5shiv/3.7.3/html5shiv.min.js"></script>
  <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
<![endif]-->
`
  }
  renderRoot() {
    const Root = this.props.Root || Root
    const component = <Root {...this.props} rootState={this.getRootState()}>
      {this.props.children}
    </Root>
    return ReactDOM.renderToStaticMarkup(component);
  }

  renderAssets(type) {
    const props = this.props

    if (type === 'css' && props.assets && props.assets.css) {
      return `<link rel="stylesheet" href="${props.assets.css}">`
    }
    if (type === 'js' && props.assets && props.assets.js) {
      return `<script id="js" src="${props.assets.js}"></script>`
    }
    return ''

  }

  renderFooter() {
    const debug = __DEV__ && __SERVER__ ? `<!-- ${util.inspect({...this.props,style:undefined, req: undefined, ctx: null})} -->` : ''
    return `\
${this.props.footerHtml || ''}
${debug}
    `
  }

  render() {
    const root = this.renderRoot() // because async style render
    return `\
<!doctype html>
<html class="${this.getHtmlClass(this.props.req)}">
  <head>
    ${this.renderHead()}
  </head>
  <body>
    <div id="root"/>
      ${root}
    </div>
    <script>
      window.__ROOT_STATE__ = ${JSON.stringify(this.getRootState())};
    </script>
    ${this.renderAssets('js')}
    ${this.renderFooter()}
  </body>
</html>
    `
  }


  static render(props) {
    return (new this.constructor(props)).render()
  }
}
