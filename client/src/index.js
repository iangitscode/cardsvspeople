import React from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';

import { SocketProvider } from 'socket.io-react';
import { Provider } from 'react-redux';

import store from './store';
import App from './App';

const socket = io();
const root = document.querySelector('#game');

ReactDOM.render(
  <SocketProvider socket={socket}>
    <Provider store={store}>
      <App />
    </Provider>
  </SocketProvider>,
  root,
);
