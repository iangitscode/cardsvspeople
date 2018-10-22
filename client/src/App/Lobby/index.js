import React from 'react';
import { socketConnect } from 'socket.io-react';
import { connect } from 'react-redux';
import { compose, dispatchers } from '../../helpers';
import * as ducks from '../../store/app';

export default compose(
  connect(null, dispatchers(ducks)),
  socketConnect,
  class Lobby extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        roomName: '',
        errorMsg: null,
      }
    }

    joinRoom() {
      this.props.socket.emit('joinRoom', this.state.roomName, ({ status, msg }) => {
        if (status === 'error') {
          this.setState({ errorMsg: msg });
        }
      });
    }

    createRoom() {
      this.props.socket.emit('createRoom', roomName => {
        this.props.setRoom(roomName);
      });
    }

    render() {
      return (
        <div>
          <input onChange={event => this.setState({ roomName: event.currentTarget.value })} />
          <button onClick={() => this.joinRoom()}>Join Room</button>
          <br />
          <button onClick={() => this.createRoom()}>Create Room</button>
          <br />
          { this.state.errorMsg }
        </div>
      );
    }
  }
)
