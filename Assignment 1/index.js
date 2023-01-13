const { response } = require("express");
const express = require("express");
const MongoClient = require("mongodb").MongoClient;

const app = express();

var database;

app.use(express.json());

app.get("/", (request, response) => {
  response.send(
    '<h1><a href="http://localhost:3000/customers"/>Customers</h1>'
  );
});

app.get("/customers", (request, response) => {
  database
    .collection("customer")
    .find({})
    .toArray((err, result) => {
      if (err) throw err;
      response.send(result);
    });
});

app.get("/customers/:firstName", (request, response) => {
  database
    .collection("customer")
    .find({ firstName: request.params.firstName })
    .toArray((err, result) => {
      if (err) throw err;
      response.send(result);
    });
});

app.get("/customers_id/:id", (request, response) => {
  database
    .collection("customer")
    .find({ id: parseInt(request.params.id) })
    .toArray((err, result) => {
      if (err) throw err;
      response.send(result);
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
