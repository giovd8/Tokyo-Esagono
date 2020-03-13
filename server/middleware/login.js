module.exports = (db) => async (req, res) => {
  const Players = db.collection('players');
  const { name } = req.body;

  let player = await Players.findOne({ name });
  if (player) {
    if (player.online) {
      return res.status(401).json({ error: `${name} è già online` });
    }
  } else {
    // create new player
    const avatar = `/monster/${Math.ceil(Math.random() * 50) + 1}.png`;
    ({ ops: [player] } = await Players.insertOne({
      name,
      avatar,
      lifes: 3,
      shots: 0,
      online: true,
    }));
  }
  return res.json(player);
};
