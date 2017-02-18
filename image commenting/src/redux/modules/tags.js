import Immutable from 'immutable'

//action types
const GET_TAGS_REQUEST = 'GET_TAGS_REQUEST'
const GET_TAGS_SUCCESS = 'GET_TAGS_SUCCESS'
const PREPARE_TAG_REQUEST = 'PREPARE_TAG_REQUEST'
const CREATE_TAG_REQUEST = 'CREATE_TAG_REQUEST'
const UPDATE_TAG_REQUEST = 'UPDATE_TAG_REQUEST'
const REMOVE_TAG_REQUEST = 'REMOVE_TAG_REQUEST'
const RESOLVE_TAG_REQUEST = 'RESOLVE_TAG_REQUEST'
const ACTIVATE_TAG = 'ACTIVATE_TAG'
const REPLY_COMMENT_TAG_REQUEST = 'REPLY_COMMENT_TAG_REQUEST'

//initial
const initialState = {
  tags: Immutable.List()
}

//action creators
export function getTags() {
  return (dispatch) => {
    dispatch({
      type: GET_TAGS_REQUEST
    })
  }
}

export function prepareTag(tag) {
  return (dispatch) => {
    dispatch({
      type: PREPARE_TAG_REQUEST,
      response: {
        id: tag.id,
        left: tag.left,
        top: tag.top,
        author: 'Anonymous',
        message: '',
        isResolved: false,
        isActive: true,
        replies: [],
        createdAt: ''
      }
    })
  }
}

export function createTag(id, message) {
  return (dispatch) => {
    dispatch({
      type: CREATE_TAG_REQUEST,
      response: {
        id: id,
        message: message,
        createdAt: Date.now()
      }
    })
  }
}

export function updateTag(tag) {
  return (dispatch) => {
    dispatch({
      type: UPDATE_TAG_REQUEST,
      response: {
        id: tag.id,
        left: tag.left,
        top: tag.top,
        author: 'Anonymous',
        message: '',
        isResolved: false,
        isActive: true,
        replies: [],
        createdAt: ''
      }
    })
  }
}

export function removeTag(id) {
  return (dispatch) => {
    dispatch({
      type: REMOVE_TAG_REQUEST,
      response: {
        id: id
      }
    })
  }
}

export function resolveTag(id) {
  return (dispatch) => {
    dispatch({
      type: RESOLVE_TAG_REQUEST,
      response: {
        id: id
      }
    })
  }
}

export function activateTag(id) {
  return (dispatch) => {
    dispatch({
      type: ACTIVATE_TAG,
      response: {
        id: id
      }
    })
  }
}

export function replyToComment(id, message, author) {
  return (dispatch) => {
    dispatch({
      type: REPLY_COMMENT_TAG_REQUEST,
      response: {
        id: id,
        author: author,
        message: message
      }
    })
  }
}

//reducer
export default function reducer(state = initialState, action) {
  switch(action.type) {
    case GET_TAGS_REQUEST:
      return state.reverse()

    case GET_TAGS_SUCCESS:
      return state

    case PREPARE_TAG_REQUEST:
      return state.map((tag) => tag.setIn(['isActive'], false)).unshift(Immutable.fromJS(action.response))

    case CREATE_TAG_REQUEST: {
      const index = state.findIndex((item) => item.get('id') == action.response.id)
      return state.mergeIn([index], action.response)
    }

    case UPDATE_TAG_REQUEST: {
      const index = state.findIndex((item) => item.get('id') == action.response.id)
      return state.map((tag) => tag.setIn(['isActive'], false)).mergeIn([index], action.response)
    }

    case REMOVE_TAG_REQUEST: {
      const index = state.findIndex((item) => item.get('id') == action.response.id)
      return state.delete(index)
    }

    case RESOLVE_TAG_REQUEST: {
      const index = state.findIndex((item) => item.get('id') === action.response.id)
      return state.update(index, (item) => item.set('isResolved', true))
    }

    case ACTIVATE_TAG: {
      const index = state.findIndex((item) => item.get('id') == action.response.id)
      return state.map((tag) => tag.setIn(['isActive'], false))
                  .update(index, (item) => item.set('isActive', true))
    }

    case REPLY_COMMENT_TAG_REQUEST: {
      const index = state.findIndex((item) => item.get('id') === action.response.id)
      const replies = state.getIn([index, 'replies']).push(Immutable.fromJS({
        id: new Date().getTime(),
        author: action.response.author,
        message: action.response.message
      }))
      return state.mergeIn([index, 'replies'], replies)
    }

    default:
      return state
  }
}