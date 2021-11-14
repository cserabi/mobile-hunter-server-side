const express = require('express');
const app = express();
require('dotenv').config();

const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;

const { MongoClient } = require('mongodb');
const port = process.env.PORT || 5000;



//middleware

app.use(cors());

// app.use
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_password}@cluster0.chwoh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
  try {
    await client.connect();
    const database = client.db("mobile-hunterDB");
    const userCollection = database.collection("mobile-list");

    // const database_tour = client.db("TourPlace");

    // const userCollection_tour = database_tour.collection("place");

    // create a document to insert

    //Get api



    //Get API

    app.get('/purchase', async (req, res) => {
      const cursor = userCollection.find({});
      const explo_product = await cursor.toArray();
      res.send(explo_product);
    })


    // single user display

    app.get('/users/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };

      console.log(query);
      const user = await userCollection.findOne(query);

      console.log('load user with id: ', id);
      res.send(user);
    })





  } finally {
    //await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Running my Curd server');

});


app.listen(port, () => {
  console.log('Running my curd server on port')
})

