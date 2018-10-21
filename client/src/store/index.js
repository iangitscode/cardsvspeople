import { createStore, combineReducers } from 'redux';
import app from './app';

const store = createStore(combineReducers({
  app,
}));

export default store;
