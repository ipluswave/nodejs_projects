import { combineReducers } from 'redux'
import tags from './modules/tags'
import settings from './modules/settings'

export default combineReducers({
  tags,
  settings
})