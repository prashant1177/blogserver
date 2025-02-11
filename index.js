require('dotenv').config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const fs = require("fs");

const mongoUri = process.env.MONGO_URI;
const secretCode = process.env.JWT_SECRET;

const UserModel = require("./models/User");
const PostModel = require("./models/Post");

const salt = bcrypt.genSaltSync(10);

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));

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
        res.cookie("token", token).json({
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
  jwt.verify(token, secretCode, {}, (err, info) => {
    if (err) throw err;
    res.json(info);
  });
});

app.post("/logout", (req, res) => {
  res.cookie("token", "").json("ok");
});

app.post("/post", upload.single("file"), async (req, res) => {
  const { originalname, path } = req.file;
  const parts = originalname.split(".");
  const ext = parts[parts.length - 1];
  const newPath = path + "." + ext;
  fs.renameSync(path, newPath);

  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ error: 'Token not provided' });
  }

   jwt.verify(token, secretCode, {}, async (err, info) => {
    const { title, summary, content } = req.body;
    const postDoc = await PostModel.create({
      title,
      summary,
      content,
      cover: newPath,
      author: info.id,
    });

    res.json(postDoc);
  });
});


app.put("/post", upload.single("file"), async (req, res) => {
  let newPath = null;
  if(req.file){
    const { originalname, path } = req.file;
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    newPath = path + "." + ext;
    fs.renameSync(path, newPath);
  }
  
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ error: 'Token not provided' });
  }

  jwt.verify(token, secretCode, {}, async (err, info) => {
    if (err) throw err;
    const {id, title, summary, content } = req.body;
    const postDoc = await PostModel.findById(id);
    
    if(JSON.stringify(postDoc.author) !== JSON.stringify(info.id)){
      return res.status(400).json('You are not the author');
    }
    await postDoc.updateOne({
      title,
      summary,
      content,
      cover: newPath ? newPath : postDoc.cover,
    });

    res.json(postDoc);
  });
});

app.get("/post", async (req, res) => {
  const posts = await PostModel.find().populate('author', ['username']).sort({createdAt: -1}).limit(20);
  res.json(posts);
});


app.get("/post/:id", async (req, res) => {
  
  const post = await PostModel.findById(req.params.id).populate('author', ['username']);
  res.json(post);
});


app.listen(3001);

// mongodb+srv://prashu49pj:LapM2eTQVg8glZN8@blog.blcl7.mongodb.net/?retryWrites=true&w=majority&appName=blog
