const { ObjectID } = require('mongodb');
const { INITIAL_LIVES } = require('../constants');

const getNextMatch = (players, match) => {
  const idx = players.findIndex(player => player.name === match[1]);
  const player1 = match[1];
  const player2 = idx + 1 < players.length ? players[idx + 1].name : players[0].name;
  return [player1, player2];
};

const loseLife = (numLife, match, players) => {
  const playerIdx = players.findIndex(player => player.name === match);
  const player = players[playerIdx];
  const lives = player.lives - numLife > 0 ? player.lives - numLife : INITIAL_LIVES;
  const shots = player.lives - numLife > 0 ? player.shots : player.shots + 1;
  return { playerIdx, lives, shots };
};


module.exports = async (command, db, socket) => {
  console.log('=> REPLY', command);
  const { user, payload: { gameId, reply } } = command;
  const Game = db.collection('game');
  const game = await Game.findOne({ _id: new ObjectID(gameId) });
  if (!game) {
    return socket.emit('notify', { type: 'error', message: 'game not found' });
  }
  if (game.match[1] !== user) {
    return socket.emit('notify', { type: 'error', message: 'you are not allow to do this action!' });
  }

  let nextGame = {
    match: getNextMatch(game.players, game.match),
    turn: 0,
    dicePoints: 0,
    callPoints: 0,
  };

  console.log('callPoints', game.callPoints, 'dicePoints', game.dicePoints);

  if (reply === 'accept') {
    if (game.callPoints === 21) {
      console.log('A1', game.match[1], 'lose life');
      const { playerIdx, lives, shots } = loseLife(1, game.match[1], game.players);
      nextGame = {
        ...nextGame,
        lastPoints: 0,
        [`players.${playerIdx}.lives`]: lives,
        [`players.${playerIdx}.shots`]: shots,
      };
    } else {
      console.log('A2');
      nextGame = {
        ...nextGame,
        lastPoints: game.callPoints,
      };
    }
    socket.emit('notify', { type: 'success', message: `${user} ha accettato ${game.callPoints}` });
    if (game.callPoints === 21) {
      socket.emit('notify', { type: 'info', message: `${user} perde una vita 💔` });
    }
  }

  if (reply === 'decline') {
    let playerIdx;
    let lives;
    let shots;

    socket.emit('notify', { type: 'error', message: `${user} rifiuta ${game.callPoints}!` });
    socket.emit('notify', { type: 'info', message: `${game.match[0]} scopre i dadi: ${game.dicePoints}` });

    if (game.callPoints === 21 && game.callPoints === game.dicePoints) {
      ({ playerIdx, lives, shots } = loseLife(2, game.match[1], game.players));
      socket.emit('notify', { type: 'info', message: `${game.match[1]} perde 2 vite 💔💔` });
    } else if (game.callPoints === 21 || game.callPoints > game.dicePoints) {
      ({ playerIdx, lives, shots } = loseLife(1, game.match[0], game.players));
      socket.emit('notify', { type: 'info', message: `${game.match[0]} perde una vita 💔` });
    } else {
      ({ playerIdx, lives, shots } = loseLife(1, game.match[1], game.players));
      socket.emit('notify', { type: 'info', message: `${game.match[1]} perde una vita 💔` });
    }

    nextGame = {
      ...nextGame,
      lastPoints: 0,
      [`players.${playerIdx}.lives`]: lives,
      [`players.${playerIdx}.shots`]: shots,
    };
  }

  const data = await Game.findOneAndUpdate(
    { _id: new ObjectID(gameId) },
    { $set: nextGame },
    { returnOriginal: false },
  );
  return socket.emit('action', { type: 'SET_GAME', payload: data.value });
};
