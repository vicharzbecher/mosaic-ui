const express = require('express');
const mysql = require('mysql');
const dotenv = require('dotenv').config();
const cors = require('cors');

const app = express();
app.use(express.json())
app.use(cors());

const connection = mysql.createConnection({
  host: process.env.HOST,
  port: process.env.PORT,
  user: process.env.USERNAME,
  password: process.env.PASSWORD,
  database: process.env.DATABASE
});

connection.connect((err) => {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
 
  console.log('connected as id ' + connection.threadId);
});

app.get('/', (req, res) => res.send({ message: 'hello' }));

app.get('/codes', (req, res) => {
  connection.query('SELECT * from error', (err, result) => {
    if (err) throw err
    return res.send({ data: result });
  })
});

app.post('/admins/notificate', (req, res) => {
  const uuid = req.body.request.data.select;
  const sql = `SELECT user.email, user.first_name, user.last_name FROM error_user INNER JOIN user ON user.id = error_user.userId WHERE errorId = '${uuid}'`;
  connection.query(sql, (err, result) => {
    if (err) throw err
    console.log(result);
    return res.send({ data: { code: { uuid }, admins: result } });
  });
});

app.listen(8080, () => console.log("Server running on port 8080"));