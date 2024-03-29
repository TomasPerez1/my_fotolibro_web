const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const router = require("./routes/index.js");
require("dotenv").config();
const { CLIENT_URL } = process.env;
const cors = require("cors")
require("./db.js");

const server = express();

server.name = "API";

server.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
server.use(bodyParser.json({ limit: "50mb" }));
server.use(cookieParser());
server.use(morgan("dev"));

// Update CORS middleware
// CORS anteriores: 
/* res.header("Access-Control-Allow-Origin", "http://localhost:5173/");
  res.header("Access-Control-Allow-Credentials", "true"); 
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE"); */
server.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", CLIENT_URL);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});
server.use(cors())
server.use(router);

// Error catching endware.
server.use((err, req, res, next) => {
  // eslint-disable-line no-unused-vars
  const status = err.status || 500;
  const message = err.message || err;
  console.error(err);
  res.status(status).send(message);
});

module.exports = server;
