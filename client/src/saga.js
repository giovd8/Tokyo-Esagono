import { all, takeEvery, put } from 'redux-saga/effects';
import request from 'axios';
import actions, { actionType } from './actions';
import { navigate } from '@reach/router';
import { startStopChannel } from './websocket';
import { SITE_URL } from './constants';

export default function* rootSaga() {
  yield all([
    startStopChannel(),
    logout(),
    ensureUser(),
    ensureGame(),
    getGames(),
    deleteGame(),
    gameStarted()
  ]);
}

export function* getGames() {
  yield takeEvery(actionType.GET_GAMES, function* (action) {
    const getGames = request.get(`${SITE_URL}/api/games`);
    const { data } = yield getGames;
    yield put(actions.setGames(data));
  });
}

export function* deleteGame() {
  yield takeEvery(actionType.DELETE_GAME, function* ({payload}) {
    yield request.delete(`${SITE_URL}/api/games/${payload._id}`);
  });
}

export function* ensureGame() {
  yield takeEvery(actionType.ENSURE_GAME, function* (action) {
    const getGame = request.get(`${SITE_URL}/api/games/${action.gameId}`);
    try {
      const { data } = yield getGame;
      if (!data) {
        yield navigate('/');
      } else {
        yield put(actions.setGame(data));
        setTimeout(() => navigate(`/tokyo/game/${data._id}`), 0);
      }
    } catch (err) {
      console.log('err', err);
    }
  });
}

export function* gameStarted() {
  yield takeEvery(actionType.GAME_STARTED, function* (action) {
    const game = action.payload;
    yield put(actions.setGame(game));
    setTimeout(() => navigate(`/tokyo/game/${game._id}`), 0);
  });
}

export function* ensureUser() {
  yield takeEvery(actionType.ENSURE_USER, function* () {
    const user = localStorage.getItem('user');
    const getUser = request.get(`${SITE_URL}/api/users/${user}`);
    if (user) {
      const { data } = yield getUser;
      yield put(actions.setUser(data));
      yield put(actions.startChannel());
    } else {
      setTimeout(() => navigate('/'), 0);
    }
  });
}

export function* logout() {
  yield takeEvery(actionType.LOGOUT, function* () {
    localStorage.removeItem('user');
    yield put(actions.removeUser());
    setTimeout(() => navigate('/'), 0);
  });
}






