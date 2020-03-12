module.exports = async (players, db, socket) => {
  console.log('=> START_GAME');
  const Game = db.collection('game');
  const { ops: [game] } = await Game.insertOne({
    active: true,
    players: players.map(player => ({
      ...player,
      lives: 3,
      shots: 0,
    })),
    match: players.map(player => player.name).slice(0, 2),
    turn: 0,
    dicePoints: 0,
    callPoints: 0,
    lastPoints: 0,
    createdAt: new Date(),
  });
  socket.emit('action', { type: 'GAME_STARTED', payload: game });
};
