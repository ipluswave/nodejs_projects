import { createStore, applyMiddleware } from 'redux'
import rootReducer from './rootReducer'
import createLogger from 'redux-logger'
import thunk from 'redux-thunk'
import Immutable from 'immutable'

export default function configureStore() {
  const logger = createLogger()
  const initialState = {
    tags: Immutable.fromJS([
      {
        id: 1,
        left: 100,
        top: 100,
        author: 'John Doe',
        message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        isResolved: false,
        isActive: false,
        replies: [
          {
            id: 1,
            author: 'Sally',
            message: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.'
          }
        ],
        createdAt: '25.01.2015'
      },
      {
        id: 2,
        left: 250,
        top: 150,
        author: 'Sally',
        message: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
        isResolved: false,
        isActive: false,
        replies: [
          {
            id: 1,
            author: 'John Doe',
            message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit'
          }
        ],
        createdAt: '25.01.2015'
      }
    ]),
    settings: Immutable.fromJS({
      statusPreparing: false
    })
  }

  const store = createStore(
    rootReducer,
    initialState,
    applyMiddleware(thunk, logger)
  )

  if (module.hot) {
    module.hot.accept('./rootReducer', () => {
      const nextRootReducer = require('./rootReducer').default
      store.replaceReducer(nextRootReducer)
    })
  }

  return store
}