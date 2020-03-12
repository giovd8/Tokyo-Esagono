module.exports = (db) => async (req, res) => {
  const Game = db.collection('game');
  const games = await Game.find({}).toArray();
  console.log('games', games);
  return res.json(games);
};
