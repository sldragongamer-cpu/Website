const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const cors = require('cors');
const path = require("path");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "..")));

app.get("/home", (req, res) => {
  res.sendFile(path.join(__dirname, "../home/index.html"));
});

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

const https = require('https');

app.post('/generate-pc-image', async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'No prompt provided' });
    }

    const apiKey = process.env.TOGETHER_API_KEY || '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';
    
    if (!apiKey || apiKey === 'sk-proj-YOUR_KEY_HERE') {
      return res.status(500).json({ error: 'API key not configured' });
    }

    const data = JSON.stringify({
      model: 'black-forest-labs/FLUX.1-pro',
      prompt: prompt,
      image_size: '768x768',
      steps: 25,
      seed: Math.floor(Math.random() * 1000000)
    });

    const options = {
      hostname: 'api.together.xyz',
      path: '/inference',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      }
    };

    const request = https.request(options, (response) => {
      let body = '';
      response.on('data', (chunk) => body += chunk);
      response.on('end', () => {
        try {
          const result = JSON.parse(body);
          if (result.error) {
            return res.status(400).json({ error: result.error.message || 'API Error' });
          }
          const imageUrl = result.output?.choices?.[0]?.image_url || result.data?.[0];
          if (!imageUrl) {
            return res.status(500).json({ error: 'No image generated' });
          }
          res.json({ imageUrl });
        } catch (e) {
          res.status(500).json({ error: 'Failed to parse response' });
        }
      });
    });

    request.on('error', (e) => {
      res.status(500).json({ error: e.message });
    });

    request.write(data);
    request.end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});