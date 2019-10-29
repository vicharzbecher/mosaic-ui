const express = require('express');
const mysql = require('mysql');
const dotenv = require('dotenv').config();

const connection = mysql.createConnection({
  host: process.env.HOST,
  port: process.env.PORT,
  user: process.env.USERNAME,
  password: process.env.PASSWORD,
  database: process.env.DATABASE
});
connection.connect();

const app = express();

app.get('/', function (req, res) {
  return res.send({ error: true, message: 'hello' })
});

app.get('/users', function (req, res) {
  connection.query('SELECT * from user', function (err, result) {
    if (err) throw err
    return res.send({ error: false, data: result, message: 'users list.' });
  })
});

app.listen(8080, function() {
  console.log("Server running on port 8080");
});