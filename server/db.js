const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://tokyoEsagono:alegaydh@tokyoesagono-wz2de.mongodb.net/Tokyo?retryWrites=true&w=majority';
const client = new MongoClient(uri, { useUnifiedTopology: true, useNewUrlParser: true });

module.exports = () => new Promise((resolve, reject) => {
  client.connect(err => {
    if (err) reject(err);
    const db = client.db('tokyo');
    db.collection('players').createIndex({ name: 1 }, { unique: true });
    // db.collection('game').createIndex({ code: 1 }, { unique: true });
    resolve(db);
  });
});
