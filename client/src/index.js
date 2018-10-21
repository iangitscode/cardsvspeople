import React from 'react';
import ReactDOM from 'react-dom';
import { SocketProvider } from 'socket.io-react';

const socket = io();
const root = document.querySelector('#game');

ReactDOM.render(
  <SocketProvider socket={socket}>
    Hello world
  </SocketProvider>,
  root,
);
