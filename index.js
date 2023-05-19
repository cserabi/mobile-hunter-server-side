const express = require("express");
const app = express();
require("dotenv").config();

const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;

const { MongoClient } = require("mongodb");
const { query } = require("express");
const port = process.env.PORT || 5000;

//middleware

app.use(cors());

app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_user}:${process.env.DB_password}@cluster0.chwoh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
async function run() {
  try {
    await client.connect();
    const database = client.db("mobile-hunterDB");
    const userCollection = database.collection("mobile-list");
    const buyerCollection = database.collection("user");

    const reviewCollection = database.collection("reviews");
    const ordersCollection = database.collection("currentOrder");
    const updateStatus = database.collection("status");

    //orders post api
    app.post("/orders", async (req, res) => {
      const orders = req.body;
      const result = await ordersCollection.insertOne(orders);
      console.log(result);
      res.json(result);
    });

    // Delivery Status

    app.get("/deliverystatus/:id", async (req, res) => {
      const cursor = ordersCollection.find({});
      const product_Status = await cursor.toArray();
      res.send(product_Status);
    });

    //all orders get api
    app.get("/orders", async (req, res) => {
      const cursor = ordersCollection.find({});
      const orders = await cursor.toArray();
      res.json(orders);
    });

    // Delete API

    app.delete("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };

      const result = await ordersCollection.deleteOne(query);
      console.log("deleting user with id", result);
      res.json(result);
    });

    //POST API

    app.post("/reviews", async (req, res) => {
      const addReview = req.body;
      const result = await reviewCollection.insertOne(addReview);

      console.log(addReview);

      res.send(result);
    });

    // get API
    app.get("/reviews", async (req, res) => {
      const reviewcursor = reviewCollection.find({});
      const reviewService = await reviewcursor.toArray();
      res.json(reviewService);
    });

    //  Post Update Status

    app.post("/status/:id", async (req, res) => {
      const status = req.body;
      const status_result = await updateStatus.insertOne(status);

      console.log(status.length);
      res.json(status_result);
    });

    // Get update status
    app.get("/status/:id", async (req, res) => {
      const cursor = updateStatus.find({});
      const newStatus = await cursor.toArray();
      res.send(newStatus);
    });

    //Get API for product

    app.get("/products", async (req, res) => {
      const cursor = userCollection.find({});
      const explo_product = await cursor.toArray();
      res.send(explo_product);
    });
    //GET API for manage product

    app.get("/manageProducts", async (req, res) => {
      const cursor = userCollection.find({});
      const manage_product = await cursor.toArray();
      res.send(manage_product);
    });
    //  DELETE API for delete product

    app.delete("/manageProducts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };

      const result = await userCollection.deleteOne(query);
      console.log("deleting user with id", result);
      res.json(result);
    });

    ///Update Product
    app.put("/manageProducts/:id", (req, res) => {
      userCollection
        .updateOne(
          {_id:ObjectId(req.params.id)},
          { $set: {
             Name: req.body.Name,
             des: req.body.des ,
             price:req.body.price,
             warranty:req.body.warranty,
             piclink:req.body.piclink
            
            } }
        )
        .then(result => {
          res.send(result.modifiedCount>0);
        });
    });

    //user(admin) get api
    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;

      // console.log(email);
      const query = { email: email };
      const user = await buyerCollection.findOne(query);
      let isAdmin = false;
      if (user?.role === "admin") {
        isAdmin = true;
      }
      res.json({ admin: isAdmin });
    });

    //users post api
    app.post("/users", async (req, res) => {
      const users = req.body;
      // console.log(users);
      const result = await buyerCollection.insertOne(users);
      res.json(result);

      
    });

    //users put api

    app.put("/users", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const options = { upsert: true };
      const updateDoc = { $set: user };
      const result = await buyerCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.json(result);
    });

    //admin
    app.put("/users/admin", async (req, res) => {
      const user = req.body;
      console.log(user);
      const filter = { email: user.email };
      const updateDoc = { $set: { role: "admin" } };
      
      const result = await buyerCollection.updateOne(filter, updateDoc);
      res.json(result);
    });

    // post API for add product
    app.post("/addProducts", async (req, res) => {
      const newProduct = req.body;
      const result = await userCollection.insertOne(newProduct);

      res.send(result);
    });
    //GET api from add r

    app.get("/products/:id", async (req, res) => {
      const cursor = userCollection.find({});
      const explo_product = await cursor.toArray();
      res.send(explo_product);
    });

    // single user display

    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };

      const productName = await userCollection.findOne(query);

      console.log("load user with id: ", id);
      res.send(productName);
    });
  } finally {
    //await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Running my Curd server");
});

app.listen(port, () => {
  console.log("Running my curd server on port");
});
