import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import _ from 'lodash'
import classnames from 'classnames'

export default class Comment extends Component {

  static propTypes = {
    comment: PropTypes.object,
    createTag: PropTypes.func,
    removeTag: PropTypes.func,
    resolveTag: PropTypes.func,
    activateTag: PropTypes.func,
    replyToComment: PropTypes.func,
    setPreparingStatusOff: PropTypes.func,
  }

  static defaultProps = {
    comment: {},
    createTag: () => {},
    removeTag: () => {},
    resolveTag: () => {},
    activateTag: () => {},
    replyToComment: () => {},
    setPreparingStatusOff: () => {},
  }

  constructor(props) {
    super(props)
    this.state = {
      isBtnDisabled: true
    }
  }

  componentDidMount() {
    this.areaFocusOn()
  }

  componentDidUpdate() {
    if (this.props.comment.isActive) {
      ReactDOM.findDOMNode(this).scrollIntoView(true)
    }
  }

  areaFocusOn() {
    if (this.commentArea) {
      this.commentArea.focus()
    }
  }

  _markResolved = () => {
    this.props.resolveTag(this.props.comment.id)
  }

  _activateTag = () => {
    if (!this.props.comment.isActive) {
      this.props.activateTag(this.props.comment.id)
    }
  }

  _reply = () => {
    this.props.replyToComment(this.props.comment.id, this.refs.replyInput.value, 'Anonymous')
    this.refs.replyInput.value = ''
  }

  _replyByEnter = (e) => {
    if (e.keyCode === 13 && e.target.value) {
      this._reply()
    }
  }

  _createComment = () => {
    this.props.setPreparingStatusOff()
    this.props.createTag(this.props.comment.id, this.commentArea.value)
  }

  _cancelComment = () => {
    this.props.setPreparingStatusOff()
    this.props.removeTag(this.props.comment.id)
  }

  _onAreaChange = (e) => {
    if (e.target.value) {
      this.setState({isBtnDisabled: false})
    } else {
      this.setState({isBtnDisabled: true})
    }
  }

  render() {
    const { comment } = this.props

    return (
      comment.createdAt ? this.renderComment(comment) : this.renderCommentForm(comment)
    )
  }

  renderCommentForm(comment) {
    return (
      <div
        className={classnames('comment', {active: comment.isActive})}
        onClick={this._activateTag}
      >
        <div className="head">
          <div className="id">{comment.id}</div>
          <div className="author">{comment.author}</div>
        </div>
        <div className="body">
          <div className="comment-form">
            <textarea
              className="comment-area"
              rows="6"
              ref={(area) => this.commentArea = area}
              onChange={this._onAreaChange}
            />
            <button className="btn-add" disabled={this.state.isBtnDisabled} onClick={this._createComment}>Add Comment</button>
            <button className="btn-cancel" onClick={this._cancelComment}>Cancel</button>
            <a href="#" className="invite">+ Invite others</a>
          </div>
        </div>
      </div>
    )
  }

  renderReplyForm() {
    return (
      <div className="reply-form">
        <textarea
          className="reply-area"
          rows="1"
          type="text"
          placeholder="Reply"
          ref="replyInput"
          onChange={this._onAreaChange}
          onKeyDown={this._replyByEnter}
        />
        <button className="btn-add" disabled={this.state.isBtnDisabled} onClick={this._reply}>Reply</button>
        <button className="btn-cancel">Cancel</button>
        <a href="#" className="invite">+ Invite others</a>
      </div>
    )
  }

  renderComment(comment) {
    return (
      <div className={classnames('comment', {active: comment.isActive})} onClick={this._activateTag}>
        <div className="head">
          <div className="id">{comment.id}</div>
          <div className="author">{comment.author}</div>
          <div className="operation">
            <label className="label">Mark resolved</label>
            <input type="checkbox" className="mark-resolve" onClick={this._markResolved}/>
          </div>
        </div>
        <div className="body">
          <div className="message">
            {comment.message}
          </div>
          <div className="replies">
            {_.map(comment.replies, (reply) =>
              this.renderReplies(reply)
            )}
          </div>
          {this.renderReplyForm()}
        </div>
      </div>
    )
  }

  renderReplies(reply) {
    return (
      <div className="reply" key={reply.id}>
        <div className="author">{reply.author}</div>
        <div className="message">{reply.message}</div>
      </div>
    )
  }
}