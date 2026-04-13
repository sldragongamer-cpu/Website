const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const uri = "mongodb://Unetadmin:Fao%40321@ac-l7thjp3-shard-00-00.ridbddz.mongodb.net:27017,ac-l7thjp3-shard-00-01.ridbddz.mongodb.net:27017,ac-l7thjp3-shard-00-02.ridbddz.mongodb.net:27017/unetDB?ssl=true&replicaSet=atlas-5ql69r-shard-0&authSource=admin&retryWrites=true&w=majority";

mongoose.connect(uri)
  .then(() => console.log("MongoDB Atlas connected"))
  .catch(err => console.error("MongoDB connection error:", err));


const ProductSchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: String
});
const Product = mongoose.model('Product', ProductSchema);

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});
const User = mongoose.model("User", UserSchema);

app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/products', async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.json(newProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    res.json({ message: "Login successful" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});