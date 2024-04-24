const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 4000;

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.tyigyp7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

app.use(cors());
app.use(express.json());

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    const database = client.db("espressoCoffee");
    const coffeeShop = database.collection("coffeeShop");

    app.get("/items", async (req, res) => {
      const cursor = coffeeShop.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/items/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeShop.findOne(query);
      res.send(result);
    });

    app.post("/add", async (req, res) => {
      const data = req.body;
      console.log(data);
      const myCoffee = {
        name: data.coffeeName,
        type: data.coffeeType,
        test: data.coffeeTest,
        photo: data.photo,
      };
      const result = await coffeeShop.insertOne(myCoffee);
      res.send(result);
    });

    app.put("/items/:id", async (req, res) => {
      const id = req.params.id;
      const coffee = req.body;
      const query = { _id: new ObjectId(id) };
      const options= {upsert: true}
      const updatedCoffee ={
        $set:{
          name: coffee.name,
          type: coffee.type,
          test: coffee.test,
          photo: coffee.photo
        }
      };
      const result = await coffeeShop.updateOne(query, updatedCoffee, options)
      res.send(result);
    });

    app.delete("/items/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeShop.deleteOne(query);
      res.send(result);
    });

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("my express server is running");
});

app.listen(port, () => {
  console.log(`my express server is running on port ${port} `);
});
