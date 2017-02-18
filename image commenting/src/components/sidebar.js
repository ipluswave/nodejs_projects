import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import '../theme/style/sidebar.styl'

export default class Sidebar extends Component {

  static propTypes = {
    isMinimized: PropTypes.bool,
    changeScreenMode: PropTypes.func,
  }

  static defaultProps = {
    isMinimized: false,
    changeScreenMode: () => {}
  }

  constructor(props) {
    super(props)
    this.state = {
      isMinimized: false
    }
  }

  _toggleSidebar = () => {
    this.props.changeScreenMode()
  }

  render() {
    const { isMinimized } = this.props

    return (
      <div className={classnames('sidebar', {
        minimized: isMinimized
      })}>

        <div className="top-menu">
          <div className="donut"></div>
          <div className="image-name">Invoices.jpg</div>
          <div className="inner">
            <div className="share-wrapper">
              <button className="share">Share</button>
              <button className="share-context"><div className="arrow" /></button>
            </div>
            <button className="toggle" onClick={this._toggleSidebar}>
              <div className={classnames('arrow', {minimized: isMinimized})}/>
            </button>
            <button className="close"><div className="cross"/></button>
          </div>
        </div>

        {this.props.children}

      </div>
    )
  }
}