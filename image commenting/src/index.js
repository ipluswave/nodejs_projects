import React from 'react'
import { render } from 'react-dom'
import App from './containers/app'
import 'normalize-css'

import { Provider } from 'react-redux'
import configureStore from './redux/configureStore'

const store = configureStore()

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)