require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const mongoUri = process.env.MONGO_URI;
const secretCode = process.env.JWT_SECRET;

const UserModel = require("./models/User");
const PostModel = require("./models/Post");

const salt = bcrypt.genSaltSync(10);

app.use(
  cors({
    methods: "GET,POST,PUT,DELETE",
    credentials: true, // If using cookies/session-based auth
    origin: "https://blogclient-three.vercel.app",
  })
);
app.use(express.json());
app.use(cookieParser());

mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const userDoc = await UserModel.create({
      username,
      password: bcrypt.hashSync(password, salt),
    });
    res.json(userDoc);
  } catch (e) {
    console.log(e);
    res.status(400).json(e);
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const userDoc = await UserModel.findOne({ username });
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      jwt.sign({ username, id: userDoc._id }, secretCode, {}, (err, token) => {
        if (err) throw err;
        res.cookie("token", token,{
          httpOnly: true,  // This helps mitigate XSS attacks
          secure: false,  // Set to true in production (HTTPS only)
          // Prevents cross-site request forgery
          maxAge: 24 * 60 * 60 * 1000,  // Cookie expiration (1 day)
        }).json({
          id: userDoc._id,
          username,
        });
      });
    } else {
      res.status(400).json("Wrong Password");
    }
  } catch (e) {
    console.log(e);
    res.status(400).json(e);
  }
});

app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  console.log(token);
  jwt.verify(token, secretCode, {}, (err, info) => {
    if (err) throw err;
    res.json(info);
  });
});

app.post("/logout", (req, res) => {
  res.cookie("token", "").json("ok");
});

app.post("/post", async (req, res) => {
 
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({ error: "Token not provided" });
  }

  jwt.verify(token, secretCode, {}, async (err, info) => {
    if (err) return res.status(403).json({ error: "Invalid token" }); // <-- Error Handling

    const { title, summary, content,cover } = req.body;
    const postDoc = await PostModel.create({
      title,
      summary,
      content,
      cover,
      author: info.id,
    });

    res.json(postDoc);
  });
});

app.put("/post",  async (req, res) => {
 

  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ error: "Token not provided" });
  }

  jwt.verify(token, secretCode, {}, async (err, info) => {
    if (err) throw err;
    const { id, title, summary, content,cover } = req.body;
    const postDoc = await PostModel.findById(id);

    if (JSON.stringify(postDoc.author) !== JSON.stringify(info.id)) {
      return res.status(400).json("You are not the author");
    }
    await postDoc.updateOne({
      title,
      summary,
      content,
      cover,
    });

    res.json(postDoc);
  });
});

app.get("/post", async (req, res) => {
  const posts = await PostModel.find()
    .populate("author", ["username"])
    .sort({ createdAt: -1 })
    .limit(20);
  res.json(posts);
});

app.get("/post/:id", async (req, res) => {
  const post = await PostModel.findById(req.params.id).populate("author", [
    "username",
  ]);
  res.json(post);
});

app.listen(3001);

// mongodb+srv://prashu49pj:LapM2eTQVg8glZN8@blog.blcl7.mongodb.net/?retryWrites=true&w=majority&appName=blog
