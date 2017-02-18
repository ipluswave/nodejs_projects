import React, { Component, PropTypes } from 'react'
import _ from 'lodash'
import classnames from 'classnames'
import '../theme/style/screen.styl'

export default class Screen extends Component {

  static propTypes = {
    tags: PropTypes.array,
    fullscreen: PropTypes.bool,
    statusPreparing: PropTypes.bool,
    setPreparingStatusOn: PropTypes.func,
    prepareTag: PropTypes.func,
    updateTag: PropTypes.func,
    activateTag: PropTypes.func
  }

  static defaultProps = {
    tags: [],
    fulscreen: false,
    statusPreparing: false,
    setPreparingStatusOn: () => {},
    prepareTag: () => {},
    updateTag: () => {},
    activateTag: () => {}
  }

  constructor(props) {
    super(props)
    this.state = {
      background: '#f6f6f6'
    }
  }

  _prepareTag = (e) => {
    if (!this.props.fullscreen) {
      if (this.props.statusPreparing) {
        this.props.updateTag({
          id: this.props.tags.length,
          left: e.pageX - 16,
          top: e.pageY - 16,
        })
      } else {
        this.props.setPreparingStatusOn()
        this.props.prepareTag({
          id: this.props.tags.length + 1,
          left: e.pageX - 16,
          top: e.pageY - 16,
        })
      }
    }
  }

  _activateTag = (e) => {
    e.stopPropagation()
    this.props.activateTag(e.target.id)
  }

  _changeBackground = (e) => {
    this.setState({
      background: e.target.dataset.color
    })
  }

  render() {
    const { tags, fullscreen } = this.props

    return (
      <div
        className={classnames('screen', {fullscreen: this.props.fullscreen})}
        style={{backgroundColor: this.state.background}}
      >
        <div className="image" onClick={this._prepareTag}>
          image

          {!fullscreen && _.map(tags, (tag) =>
            !tag.isResolved && this.renderTag(tag)
          )}

        </div>
        <div className="background-widget">
          <div className="control white" data-color="#fff" onClick={this._changeBackground}/>
          <div className="control white-two" data-color="#f6f6f6" onClick={this._changeBackground}/>
          <div className="control greyish" data-color="#b2b2b2" onClick={this._changeBackground}/>
          <div className="control greyish-brown" data-color="#515151" onClick={this._changeBackground}/>
          <div className="control black" data-color="#000" onClick={this._changeBackground}/>
        </div>
        <div className="zoom-widget">
          <button className="control zoom-out">
            <div className="minus"/>
          </button>
          <button className="control fit">Fit</button>
          <button className="control zoom-in">
            <div className="plus"/>
          </button>
        </div>
      </div>
    )
  }

  renderTag(tag) {
    return (
      <div
        className={classnames('tag', {'active': tag.isActive})}
        onClick={this._activateTag}
        onMouseEnter={this._activateTag}
        key={tag.id}
        id={tag.id}
        style={{
          left: tag.left,
          top: tag.top
        }}
      >
        {tag.id}
      </div>
    )
  }
}