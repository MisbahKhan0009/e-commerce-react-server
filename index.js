const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.krtt2d2.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const productCollection = client.db("emajohn").collection("products");

    app.get("/products", async (req, res) => {
      const page = parseInt(req.query.page);
      const size = parseInt(req.query.size);
      //   console.log(page, size);
      const query = {};
      const cursor = productCollection.find(query);
      const products = await cursor
        .skip(page * size)
        .limit(size)
        .toArray();
      const count = await productCollection.estimatedDocumentCount();

      res.send({ count, products });
    });

    app.post("/productsByIds", async (req, res) => {
      const ids = req.body;
      const objectIds = ids.map((id) => new ObjectId(id));
      const query = { _id: { $in: objectIds } };
      const cursor = productCollection.find(query);
      const products = await cursor.toArray();
      res.send(products);
    });

    // app.post("/productsByIds", async (req, res) => {
    //   const ids = req.body;
    //   const objectIds = ids.map((id) => ObjectId(id));
    //   const query = { _id: { $in: objectIds } };
    //   const cursor = productCollection.find(query);
    //   const products = await cursor.toArray();
    //   res.send(products);
    // });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Ema John Server running");
});

app.listen(port, () => {
  console.log(`Ema John Running on ${port}`);
});
