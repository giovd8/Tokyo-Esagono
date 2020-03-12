import io from 'socket.io-client';
import { eventChannel } from 'redux-saga';
import { take, call, put, fork, race, cancelled } from 'redux-saga/effects';
import { SITE_URL } from './constants';
import { actionType } from './actions';

let socket;
const createSocketConnection = () => {
  socket = io.connect(SITE_URL, {
    transports: ['websocket'],
    rejectUnauthorized: false,
    secure: true
  });
  return Promise.resolve(socket);
};

const createSocketChannel = socket => eventChannel((emit) => {
  const actionHandler = (event) => {
    console.log('incoming action:', event);
    emit(event);
  };
  const connectHandler = () => {
    const player = localStorage.getItem('user');
    socket.emit('connected', player);
    emit({type: actionType.SERVER_ON});
  };

  socket.on('action', actionHandler);
  socket.on('connect', connectHandler);
  socket.on('disconnect', () => emit({ type: actionType.SERVER_OFF }));
  socket.on('reconnect', () => emit({ type: actionType.SERVER_ON }));
  socket.on('notify', (payload) => emit({ type: actionType.NOTIFY, payload }));
  return () => {
    socket.off('action', actionHandler);
    socket.off('connect', connectHandler);
  };
});

const writeSocket = function* (socket) {
  while (true) {
    const action = yield take(actionType.COMMAND);
    const user = localStorage.getItem('user');
    console.log('send command', { ...action.command, user });
    socket.emit('command', { ...action.command, user });
  }
}

// Saga to switch on channel.
const connectSocketSaga = function* () {
  try {
    yield put({type: actionType.CHANNEL_ON});
    const socket = yield call(createSocketConnection);
    const socketChannel = yield call(createSocketChannel, socket);
    yield fork(writeSocket, socket);
    while (true) {
      const action = yield take(socketChannel);
      yield put(action);
    }
  } catch (error) {
    console.log(error);
  } finally {
    if (yield cancelled()) {
      socket.disconnect(true);
      yield put({type: actionType.CHANNEL_OFF});
    }
  }
};

// saga listens for start and stop actions
export const startStopChannel = function* () {
  while (true) {
    yield take(actionType.START_CHANNEL);
    yield race({
      socket: call(connectSocketSaga),
      cancel: take(actionType.STOP_CHANNEL),
    });
  }
};
