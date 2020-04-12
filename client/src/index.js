import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import {persistStore, persistReducer } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react'
import storage from 'redux-persist/lib/storage';
import userReducer from './redux/reducers/userReducer';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

const persistConfig = {
  key: 'root',
  storage,
}

const persistantReducer = persistReducer(persistConfig, userReducer);

const store = createStore(combineReducers({userReducer: persistantReducer}));
let persistor = persistStore(store)

ReactDOM.render(<Provider store={store}>
  <PersistGate loading={null} persistor={persistor}>
    <App />
  </PersistGate>
  </Provider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
