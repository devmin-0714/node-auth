const express = require('express');
const MongoServer = require('./config/db');

MongoServer();

const app = express();

// PORT
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.json({ message: 'API working' });
});

app.listen(PORT, (req, res) => {
    console.log(`Server Started at PORT ${PORT}`);
});