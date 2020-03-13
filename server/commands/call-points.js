const { ObjectID } = require('mongodb');

module.exports = async (command, db, socket) => {
  console.log('=> CALL_POINTS', command);
  const { user, payload: { gameId, callPoints } } = command;
  const Game = db.collection('game');
  const game = await Game.findOne({ _id: new ObjectID(gameId) });
  if (!game) {
    return socket.emit('notify', { type: 'error', message: 'Gioco non trovato!' });
  }
  if (game.match[0] !== user) {
    return socket.emit('notify', { type: 'error', message: 'Cazzo fai? Non tocca te!' });
  }
  if (callPoints < game.lastPoints && callPoints !== 21) {
    return socket.emit('notify', { type: 'error', message: `Devi chiamare un numero maggiore di ${game.lastPoints}!` });
  }

  const nextGame = await Game.findOneAndUpdate(
    { _id: new ObjectID(gameId) },
    { $set: { callPoints, turn: 1 } },
    { returnOriginal: false },
  );
  console.log('game', nextGame.value);
  socket.emit('action', { type: 'SET_GAME', payload: nextGame.value });
};
