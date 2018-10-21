import React from 'react';
import { connect } from 'react-redux';
import { compose } from '../helpers';

export default compose(
  connect(({
    app: { room },
  }) => ({ room })),
  function App({ room }) {
    if (room) {
      return <div>Find a room</div>;
    } else {
      return <div>I'm in a room called {room}</div>;
    }
  }
)
