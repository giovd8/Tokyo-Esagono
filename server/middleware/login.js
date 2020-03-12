module.exports = (db) => async (req, res) => {
  const Players = db.collection('players');
  const { name } = req.body;

  let player = await Players.findOne({ name });
  if (player) {
    if (player.online) {
      return res.status(401).json({ error: 'Player already online' });
    }
  } else {
    // create new player
    let avatar;
    // console.log(player.name);
    if (name === 'jolly') {
      avatar = '/fotoFioi/Jolly.png';
    } else if (name === 'fallo') {
      avatar = '/fotoFioi/Fallo.png';
    } else if (name === 'alle') {
      avatar = '/fotoFioi/Alle.png';
    } else if (name === 'nico') {
      avatar = '/fotoFioi/Nico.png';
    } else if (name === 'donnie') {
      avatar = '/fotoFioi/Donnie.png';
    } else if (name === 'marcello') {
      avatar = '/fotoFioi/Marcello.png';
    } else if (name === 'cik') {
      avatar = '/fotoFioi/Cik.png';
    } else {
      avatar = `/monster/${Math.ceil(Math.random() * 50) + 1}.png`;
    }
    ({ ops: [player] } = await Players.insertOne({
      name,
      avatar,
      lives: 3,
      shots: 0,
      online: true,
    }));
  }
  return res.json(player);
};
