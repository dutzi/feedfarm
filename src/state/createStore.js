import { createStore, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import rootReducer from './reducer';
import thunk from 'redux-thunk';

export default function configureStore(initialState, history) {
  if (process.env.NODE_ENV === 'development') {
    // if (false && process.env.NODE_ENV === 'development') {
    return createStore(rootReducer, applyMiddleware(thunk, logger));
  } else {
    return createStore(rootReducer, applyMiddleware(thunk));
  }
}
