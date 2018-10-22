function init() {
  return {
    room: null,
  };
}

const SET_ROOM = Symbol('lobby/set-room');

export const setRoom = room => ({ type: SET_ROOM, room });

export default function appReducer(state = init(), action) {
  switch (action.type) {
  case SET_ROOM:
    return { ...state, room };
  default:
    return state;
  }
}
