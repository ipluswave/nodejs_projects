import React, { Component } from 'react'
import Screen from '../components/screen'
import Sidebar from '../components/sidebar'
import Comments from '../components/comments'
import '../theme/style/app.styl'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as tagsActions from '../redux/modules/tags'
import * as settingsActions from '../redux/modules/settings'

export class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      fullscreen: false
    }
  }

  componentWillMount() {
    this.props.tagsActions.getTags()
  }

  _changeScreenMode = () => {
    this.setState({
      fullscreen: !this.state.fullscreen
    })
  }

  render() {
    const { tags, settings } = this.props
    const {
      prepareTag,
      createTag,
      updateTag,
      removeTag,
      resolveTag,
      activateTag,
      replyToComment
    } = this.props.tagsActions
    const {
      setPreparingStatusOn,
      setPreparingStatusOff
    } = this.props.settingsActions

    return (
      <div className="app">
        <Screen
          tags={tags}
          prepareTag={prepareTag}
          updateTag={updateTag}
          activateTag={activateTag}
          fullscreen={this.state.fullscreen}
          statusPreparing={settings.statusPreparing}
          setPreparingStatusOn={setPreparingStatusOn}
        />

        <Sidebar
          isMinimized={this.state.fullscreen}
          changeScreenMode={this._changeScreenMode}
        >
          <Comments
            comments={tags}
            createTag={createTag}
            removeTag={removeTag}
            resolveTag={resolveTag}
            activateTag={activateTag}
            replyToComment={replyToComment}
            setPreparingStatusOff={setPreparingStatusOff}
          />
        </Sidebar>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    tags: state.tags.toJS(),
    settings: state.settings.toJS()
  }
}

function mapDispatchToProps(dispatch) {
  return {
    tagsActions: bindActionCreators(tagsActions, dispatch),
    settingsActions: bindActionCreators(settingsActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)