import React, { Component, PropTypes } from 'react'
import CssTransitionGroup from 'react-addons-css-transition-group'
import _ from 'lodash'
import Comment from './comment'
import '../theme/style/comments.styl'

export default class Comments extends Component {

  static propTypes = {
    comments: PropTypes.array,
    createTag: PropTypes.func,
    removeTag: PropTypes.func,
    resolveTag: PropTypes.func,
    activateTag: PropTypes.func,
    replyToComment: PropTypes.func,
    setPreparingStatusOff: PropTypes.func,
  }

  static defaultProps = {
    comments: [],
    createTag: () => {},
    removeTag: () => {},
    resolveTag: () => {},
    activateTag: () => {},
    replyToComment: () => {},
    setPreparingStatusOff: () => {},
  }

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.props.activateTag(this.props.comments.length)
  }

  render() {
    return (
      <div className="comments">
        {_.map(this.props.comments, (item) =>
          !item.isResolved &&
            <CssTransitionGroup
              transitionName="example"
              transitionEnterTimeout={3000}
              transitionLeaveTimeout={3000}
              transitionAppearTimeout={3000}
              transitionAppear={true}
              component="div"
              key={item.id}
            >
              <Comment
                key={item.id}
                comment={item}
                createTag={this.props.createTag}
                removeTag={this.props.removeTag}
                resolveTag={this.props.resolveTag}
                activateTag={this.props.activateTag}
                replyToComment={this.props.replyToComment}
                setPreparingStatusOff={this.props.setPreparingStatusOff}
              />
            </CssTransitionGroup>
        )}
      </div>
    )
  }
}