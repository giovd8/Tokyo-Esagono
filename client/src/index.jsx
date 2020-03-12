import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from "@reach/router";
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import App from './containers/App/App';
import Login from './containers/Login/Login';
import PlayerList from './containers/PlayerList/PlayerList';
import Game from './containers/Game/Game';
import NotFound from './components/NotFound/NotFoundPage';
import reducer from './reducer';
import saga from './saga';
import './index.scss';

const initialState = {
  user: null,
  players: [],
  games: [],
  game: null,
  channelStatus: 'off',
  serverStatus: 'unknown',
  notification: null,
};

const sagaMiddleware = createSagaMiddleware();
const middleware = [sagaMiddleware];
const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middleware)));
sagaMiddleware.run(saga);

const Root = ({ store }) => (
  <Provider store={store}>
    <Router>
      <Login path="/" />
      <App path="/tokyo">
        <PlayerList path="players" />
        <Game path="game/:gameId" />
        <NotFound default />
      </App>
      <NotFound default />
    </Router>
  </Provider>
);

ReactDOM.render(<Root store={store}/>, document.getElementById('root'));
