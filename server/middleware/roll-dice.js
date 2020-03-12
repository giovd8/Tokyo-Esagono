const ObjectId = require('mongodb').ObjectID;

module.exports = (db) => async (req, res) => {
  const Game = db.collection('game');
  const { userId, gameId } = req.body;
  if (!userId || !gameId) {
    return res.status(400).json({ error: 'Missing params' });
  }
  try {
    const game = await Game.findOne({ _id: new ObjectId(gameId) });
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }
    if (game.match[0] !== userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const face1 = Math.ceil(Math.random() * 6);
    const face2 = Math.ceil(Math.random() * 6);
    let points;
    if (face1 < face2) {
      points = face2 * 10 + face1;
    } else if (face1 > face2) {
      points = face1 * 10 + face2;
    } else if (face1 === face2) {
      points = face1 * 100;
    }
    console.log('=> ROLL_DICE', points);
    const nextGame = await Game.updateOne({ _id: new ObjectId(gameId) }, { $set: { dicePoints: points } });
    console.log('nModified', nextGame.result.nModified);
    return res.json({ dice: [face1, face2], points });
  } catch (err) {
    console.log('err', err);
    return res.status(500).json({ error: err.message });
  }
};
