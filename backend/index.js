const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");

app.use(cors());
app.listen(3001);
app.use(express.json());
mongoose.connect(
  "mongodb://localhost/plants",
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (err) throw err;
    console.log("Connected To DB");
  }
);

const plant = new mongoose.Schema({
  name: { type: String, required: true },
  ref: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
});
const plants = mongoose.model("plants", plant);

const category = new mongoose.Schema({
  CategoryRef: { type: String, required: true },
});
const categories = mongoose.model("categories", category);

app.get("/allCategories", async (req, res) => {
  const allCats = await categories.find();
  res.status(200).send(allCats);
});

app.get("/allPlants", async (req, res) => {
  const allPlants = await plants.find();
  res.status(200).send(allPlants);
});

app.post("/plants/category", async (req, res) => {
  const newCategory = new categories({
    CategoryRef: req.body.CategoryRef,
  });
  await newCategory.save();
  res.status(200).send("Category Created");
});

app.post("/plants/add", async (req, res) => {
  const newPlant = new plants({
    name: req.body.name,
    category: req.body.category,
    ref: req.body.ref,
    description: req.body.description,
    price: req.body.price,
    image: req.body.image,
  });
  await newPlant.save();
  res.status(200).send(newPlant);
});

app.post("/plants/remove/:id", async (req, res) => {
  await plants.findOneAndDelete({ _id: req.params.id });
  res.status(200).send("Plant Deleted");
});
