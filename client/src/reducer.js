import { actionType } from './actions';

export default (state, action) => {
  switch(action.type) {
    case actionType.SET_USER:
      return { ...state, user: action.payload };
    case actionType.REMOVE_USER:
      return { ...state, user: null };
    case actionType.SET_PLAYERS:
      return { ...state, players: action.payload };
    case actionType.SET_GAME:
      return { ...state, game: action.payload };
    case actionType.SET_GAMES:
        return { ...state, games: action.payload };
    case actionType.CHANNEL_ON:
      return { ...state, channelStatus: 'on' };
    case actionType.CHANNEL_OFF:
      return { ...state, channelStatus: 'off', serverStatus: 'unknown' };
    case actionType.SERVER_OFF:
      return { ...state, serverStatus: 'off' };
    case actionType.SERVER_ON:
      return { ...state, serverStatus: 'on' };
    case actionType.NOTIFY:
      return { ...state, notification: action.payload };
    default:
      return state;
  }
};
