const startGame = require('./start-game');
const callPoints = require('./call-points');
const reply = require('./reply');

module.exports = db => socket => command => {
  switch (command.type) {
    case 'START_GAME':
      return startGame(command.payload, db, socket);
    case 'CALL_POINTS':
      return callPoints(command, db, socket);
    case 'REPLY':
      return reply(command, db, socket);
    default:
      return console.error('command not handled', command);
  }
};
