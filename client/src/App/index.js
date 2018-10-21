import React from 'react';
import { connect } from 'react-redux';
import { compose } from '../helpers';

export default compose(
  connect(({ room }) => ({ room })),
  function App({ room }) {
    return <div>Hello world</div>;
  }
)
