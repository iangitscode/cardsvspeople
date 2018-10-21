import React from 'react';
import { connect } from 'react-redux';
import { compose } from '../helpers';

import Lobby from './Lobby';

export default compose(
  connect(({
    app: { room },
  }) => ({ room })),
  function App({ room }) {
    if (!room) {
      return <Lobby/>;
    } else {
      return <div>I'm in a room called {room}</div>;
    }
  }
)
