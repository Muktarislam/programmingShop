const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()

const port = process.env.PORT || 5055;

app.use(cors());
app.use(bodyParser.json());


app.get('/', (req, res) => {
  res.send('Hello World!')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ze1ys.mongodb.net/${process.env.DB_Name}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })
client.connect(err => {
  console.log('connection err', err)
  const eventCollection = client.db("book").collection("events");


    app.get('/events', (req, res) => {
      eventCollection.find()
      .toArray((err, items) => {
        res.send(items)
        console.log('data from database', items);
      })
    })
  app.post('/admin', (req, res) => {
    const newEvent = req.body;
    console.log('adding new event: ', newEvent)
    eventCollection.insertOne(newEvent)
    .then(result => {
      console.log('inserted count', result.insertedCount);
      res.send(result.insertedCount > 0)
    })
  })
});



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})