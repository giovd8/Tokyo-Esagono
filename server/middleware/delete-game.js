const ObjectId = require('mongodb').ObjectID;

module.exports = (db) => async (req, res) => {
  const Game = db.collection('game');
  const { gameId } = req.params;
  const game = await Game.removeOne({ _id: new ObjectId(gameId) });
  return res.json(game);
};
