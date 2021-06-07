// Package Import
const express = require('express');
const cors = require('cors');

var bodyParser = require('body-parser');
var path = require ('path');
var appRouter = require('./routes/app.router')
require('dotenv').config({path: '.env'})

//app
const app = express();

//app.use()
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

if (process.env.NODE_ENV == 'development'){
    app.use(cors({origin: process.env.CLIENT_URL}));
    const morgan = require('morgan');
    app.use(morgan("dev"));
}

//Api(s)
app.use("/v1", appRouter);

//Static Route
if (process.env.NODE_ENV == 'production'){
    var frontEndPath = path.join(__dirname,'../','build');
    app.use("/", express.static(frontEndPath));
}

//404 route
app.use("*", (req, res) => res.status(404).json({ error: "not found" }));

//ERROR Handler
app.use((error, req, res,next) => {

    if (!error.statusCode) error.statusCode = 500;

    return res
      .status(error.statusCode)
      .json({ error: error.toString() });
  });


module.exports = app;