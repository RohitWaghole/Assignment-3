const { response } = require("express");
const express = require("express");
const MongoClient = require("mongodb").MongoClient;

const app = express();

var database;

app.use(express.json());

// DEFAULT PAGE
app.get("/", (request, response) => {
  response.send('<h1><a href="http://localhost:3000/products"/>Products</h1>');
});

// GET ALL THE PRODUCTS
app.get("/products", (request, response) => {
  database
    .collection("products")
    .find({})
    .toArray((err, result) => {
      if (err) throw err;
      response.send(result);
    });
});

// GET PRODUCTS BY PRODUCT NAME
app.get("/products/:product", (request, response) => {
  database
    .collection("products")
    .find({ product: request.params.product })
    .toArray((err, result) => {
      if (err) throw err;
      response.send(result);
    });
});

// GET PRODUCTS BY PRODUCT ID
app.get("/products_id/:id", (request, response) => {
  database
    .collection("products")
    .find({ id: parseInt(request.params.id) })
    .toArray((err, result) => {
      if (err) throw err;
      response.send(result);
    });
});

// ADD/CREATE NEW PRODUCTS
app.post("/products/addproduct", (request, response) => {
  let res = database.collection("products").find({}).sort({ id: -1 }).limit(1);
  res.forEach((obj) => {
    if (obj) {
      let data = {
        id: obj.id + 1,
        product: request.body.product,
        price: request.body.price,
      };
      database.collection("products").insertOne(data, (err, result) => {
        if (err) throw err;
        response.send(data);
      });
    }
  });
});

// UPDATE THE PRODUCT
app.put("/products/:id", (request, response) => {
  let query = { id: parseInt(request.params.id) };
  let data = {
    id: parseInt(request.params.id),
    product: request.body.product,
    price: request.body.price,
  };
  let dataset = {
    $set: data,
  };
  database.collection("products").updateOne(query, dataset, (err, result) => {
    if (err) throw err;
    response.send(data);
  });
});

// DELETE THE PRODUCT
app.delete("/products/:id", (request, response) => {
  let query = { id: parseInt(request.params.id) };
  database.collection("products").deleteOne(query, (err, result) => {
    if (err) throw err;
    response.send("Delete Successfully!");
  });
});

app.listen(3000, () => {
  MongoClient.connect(
    "mongodb://127.0.0.1:27017",
    { useNewUrlParser: true },
    (err, result) => {
      if (err) throw err;
      database = result.db("customerDB");
    }
  );
});
