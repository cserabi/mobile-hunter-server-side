const express = require('express');
const app = express();
require('dotenv').config();

const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;

const { MongoClient } = require('mongodb');
const port = process.env.PORT || 5000;



//middleware

app.use(cors());


app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_password}@cluster0.chwoh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
  try {
    await client.connect();
    const database = client.db("mobile-hunterDB");
    const userCollection = database.collection("mobile-list");
    const reviewCollection = database.collection("reviews");



    //POST API

    app.post('/reviews', async (req, res) => {
      const addReview = req.body;
      const result = await reviewCollection.insertOne(addReview);

      console.log('added review ', result)
      res.send(result);
    })


    // get API
    app.get('/reviews', async (req, res) => {

      const reviewcursor = reviewCollection.find({});
      const reviewService = await reviewcursor.toArray();
      res.send(reviewService);
    })


    //Get API

    app.get('/products', async (req, res) => {
      const cursor = userCollection.find({});
      const explo_product = await cursor.toArray();
      res.send(explo_product);
    })


    // post API
    app.post('/addProducts', async (req, res) => {
      const newProduct = req.body;
      const result = await userCollection.insertOne(newProduct);

      res.send(result);
    })

    app.get('/products/:id', async (req, res) => {
      const cursor = userCollection.find({});
      const explo_product = await cursor.toArray();
      res.send(explo_product);
    })


    // single user display

    app.get('/products/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };


      const productName = await userCollection.findOne(query);

      console.log('load user with id: ', id);
      res.send(productName);
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

