import Immutable from 'immutable'

//action types
const SET_PREPARING_STATUS_ON = 'SET_PREPARING_STATUS_ON'
const SET_PREPARING_STATUS_OFF = 'SET_PREPARING_STATUS_OFF'

//initial
const initialState = {
  settings: Immutable.Map()
}

//action creators
export function setPreparingStatusOn() {
  return (dispatch) => {
    dispatch({
      type: SET_PREPARING_STATUS_ON
    })
  }
}

export function setPreparingStatusOff() {
  return (dispatch) => {
    dispatch({
      type: SET_PREPARING_STATUS_OFF
    })
  }
}

//reducer
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_PREPARING_STATUS_ON:
      return state.set('statusPreparing', true)

    case SET_PREPARING_STATUS_OFF:
      return state.set('statusPreparing', false)

    default:
      return state
  }
}