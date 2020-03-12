module.exports = (db) => async (req, res) => {
  const Players = db.collection('players');
  const { userId } = req.params;
  const player = await Players.findOne({ name: userId });
  return res.json(player);
};
