const express = require('express');
const MongoServer = require('./config/db');
const bodyParser = require('body-parser'); // 새로 추가
const user = require('./routes/user'); // 새로 추가

// Initiate Mongo server
MongoServer();

const app = express();

// PORT
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.json({ message: 'API working' });
});

/**
 * Router Middleware
 * Router - /user/*
 * Method - *
 */
app.use('/user', user); // 새로 추가


app.listen(PORT, (req, res) => {
    console.log(`Server Started at PORT ${PORT}`);
});