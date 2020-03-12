const login = require('./login');
const getGames = require('./get-games');
const getGame = require('./get-game');
const deleteGame = require('./delete-game');
const getUser = require('./get-user');
const rollDice = require('./roll-dice');

module.exports = (db) => ({
  login: login(db),
  getGames: getGames(db),
  getGame: getGame(db),
  deleteGame: deleteGame(db),
  getUser: getUser(db),
  rollDice: rollDice(db),
});
