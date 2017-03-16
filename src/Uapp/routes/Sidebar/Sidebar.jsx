import React, { Component } from 'react'
// import importcss from 'importcss'
// import A from '../../components/A'

// @importcss(require('./HomePage.css'))
export default class Sidebar extends Component {
  render() {
    return <div>
      <div>
          Sidebar
      </div>
      <div>
        {this.props.children}
      </div>
    </div>
  }
}
