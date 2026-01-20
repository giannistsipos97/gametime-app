// backend/server.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

// Middleware
app.use(cors()); // Allows requests from your Angular app
app.use(bodyParser.json());

// A simple test route
app.get("/api/message", (req, res) => {
  res.json({ message: "Hello from the Node.js Backend!" });
});

// Start server
app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});
