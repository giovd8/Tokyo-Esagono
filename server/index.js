const path = require('path');
const logger = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const initDb = require('./db.js');
const initMiddleware = require('./middleware');
const initCommands = require('./commands');

const runServer = async () => {
  const app = express();
  const PORT = process.env.PORT || 8080;

  app.use(helmet());
  app.use(cors());
  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  const db = await initDb();
  const Players = db.collection('players');

  const mw = initMiddleware(db);
  const handleCommand = initCommands(db);

  // Routes
  app.post('/api/login', mw.login);
  app.get('/api/users/:userId', mw.getUser);
  app.get('/api/games', mw.getGames);
  app.get('/api/games/:gameId', mw.getGame);
  app.delete('/api/games/:gameId', mw.deleteGame);
  app.post('/api/roll-dice', mw.rollDice);

  if (process.env.NODE_ENV === 'production') {
    // Serve any static files
    app.use(express.static(path.join(__dirname, '../client/build')));

    // Handle React routing, return all requests to React app
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
    });
  }

  const server = http.Server(app);
  const socket = socketIO(server);

  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });


  socket.on('connection', (client) => {
    client.on('connected', async (player) => {
      console.log('\nclient connected', client.id);
      await Players.updateOne({ name: player }, { $set: { online: true, clientId: client.id } });
      const players = await Players.find({ online: true }).toArray();
      socket.emit('action', { type: 'SET_PLAYERS', payload: players });
    });

    client.on('command', handleCommand(socket));

    client.on('disconnect', async () => {
      console.log('\nclient disconnected', client.id);
      await Players.updateOne({ clientId: client.id }, { $set: { online: false } });
      const players = await Players.find({ online: true }).toArray();
      socket.emit('action', { type: 'SET_PLAYERS', payload: players });
    });
  });
};

runServer();
