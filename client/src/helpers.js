import React from 'react';

export function compose(...functions) {
  const [item, ...funcs] = functions.reverse();
  return funcs.reduce((o, f) => f(o), item);
}

export function dispatchers(dispatchers) {
  return dispatch => Object.entries(dispatchers)
    .reduce((ducks, [name, duck]) => Object.assign(ducks, { [name]: (...args) => dispatch(duck(...args)) }), {})
}

export function socketHandlers(handlers) {
  return Component => class extends React.Component {
    constructor(props) {
      super(props);
      if (!this.props.socket) {
        throw new Error('Socket prop is not defined');
      }
    }

    componentDidMount() {
      Object.entries(handlers)
        .map(([name, handler]) => {
          this.props.socket.on(name, handler);
        });
    }

    componentWillUnmount() {
      Object.entries(handlers)
        .map(([name, handler]) => {
          this.props.socket.removeListener(name, handler);
        });
    }

    render() {
      return <Component {...this.props} />
    }
  }
}
