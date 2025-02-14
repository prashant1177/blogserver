const mongoose = require("mongoose");
const Post = require("./models/Post"); // Adjust the path based on your project structure

mongoose.connect("mongodb+srv://prashu49pj:LapM2eTQVg8glZN8@blog.blcl7.mongodb.net/?retryWrites=true&w=majority&appName=blog", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("Could not connect", err));

const posts = [
  {
    title: "Mastering JavaScript in 2024",
    summary: "A complete guide to learning JavaScript with modern frameworks.",
    content: "JavaScript is one of the most popular programming languages...",
    cover: "https://cdn.pixabay.com/photo/2021/11/23/13/32/forest-6818683_1280.jpg",
    author: "67a30b7ac52cfea983fcdda3"
  },{
    "title": "The Rise of AI in 2024",
    "summary": "Exploring how artificial intelligence is shaping the future.",
    "content": "Artificial intelligence is revolutionizing industries...",
    "cover": "https://cdn.pixabay.com/photo/2021/11/23/13/32/forest-6818683_1280.jpg",
    "author": "67a30b7ac52cfea983fcdda3"
  },
  {
    "title": "Web Development Trends in 2024",
    "summary": "A look at the latest technologies dominating web development.",
    "content": "Modern web development is driven by frameworks like Next.js...",
    "cover": "https://cdn.pixabay.com/photo/2021/11/23/13/32/forest-6818683_1280.jpg",
    "author": "67a30b7ac52cfea983fcdda3"
  },
  {
    "title": "Understanding TypeScript for Beginners",
    "summary": "A guide to getting started with TypeScript for safer JavaScript.",
    "content": "TypeScript is a superset of JavaScript that adds static typing...",
    "cover": "https://cdn.pixabay.com/photo/2021/11/23/13/32/forest-6818683_1280.jpg",
    "author": "67a30b7ac52cfea983fcdda3"
  },
  {
    "title": "Node.js Performance Optimization",
    "summary": "Best practices to enhance the speed and efficiency of Node.js apps.",
    "content": "Optimizing performance in Node.js involves caching, clustering...",
    "cover": "https://cdn.pixabay.com/photo/2021/11/23/13/32/forest-6818683_1280.jpg",
    "author": "67a30b7ac52cfea983fcdda3"
  },
  {
    "title": "React 18: What’s New?",
    "summary": "An overview of the new features and improvements in React 18.",
    "content": "React 18 introduces concurrent rendering, automatic batching...",
    "cover": "https://cdn.pixabay.com/photo/2021/11/23/13/32/forest-6818683_1280.jpg",
    "author": "67a30b7ac52cfea983fcdda3"
  },
  {
    "title": "Building Scalable APIs with Express.js",
    "summary": "A step-by-step guide to creating RESTful APIs using Express.js.",
    "content": "Express.js is a lightweight framework for building APIs...",
    "cover": "https://cdn.pixabay.com/photo/2021/11/23/13/32/forest-6818683_1280.jpg",
    "author": "67a30b7ac52cfea983fcdda3"
  },
  {
    "title": "Mastering Git and GitHub",
    "summary": "A deep dive into Git commands and GitHub workflows.",
    "content": "Version control is essential for developers, and Git...",
    "cover": "https://cdn.pixabay.com/photo/2021/11/23/13/32/forest-6818683_1280.jpg",
    "author": "67a30b7ac52cfea983fcdda3"
  },
  {
    "title": "The Power of Cloud Computing",
    "summary": "How cloud computing is transforming businesses worldwide.",
    "content": "Cloud platforms like AWS, Azure, and Google Cloud offer...",
    "cover": "https://cdn.pixabay.com/photo/2021/11/23/13/32/forest-6818683_1280.jpg",
    "author": "67a30b7ac52cfea983fcdda3"
  }
  // ...Add other posts here
];

Post.insertMany(posts)
  .then(() => console.log("Posts added successfully"))
  .catch(err => console.error(err))
  .finally(() => mongoose.connection.close());
