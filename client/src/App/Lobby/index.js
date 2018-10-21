import React from 'react';
import { socketConnect } from 'socket.io-react';
import { connect } from 'react-redux';
import { compose } from '../../helpers';

export default compose(
  socketConnect,
  class Lobby extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        roomName: '',
      }
      this.props.socket.on('receiveRoomName', (roomName) => {
        console.log(roomName);
      })
    }

    joinRoom() {
      this.props.socket.emit('joinRoom', this.state.roomName);
    }

    createRoom() {
      this.props.socket.emit('createRoom');
    }

    render() {
      return (
        <div>
          <input onChange={event => this.setState({ roomName: event.currentTarget.value })} />
          <button onClick={() => this.joinRoom()}>Join Room</button>
          <br/>
          <button onClick={() => this.createRoom()}>Create Room</button>
        </div>
      )
    }
  }
)