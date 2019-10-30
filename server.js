const express = require('express');
const mysql = require('mysql');
const dotenv = require('dotenv').config();
const cors = require('cors');
const nodemailer = require('nodemailer');

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

const transporter = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_SMTP_USERNAME,
    pass: process.env.MAILTRAP_SMTP_PASSWORD
  }
});

connection.connect((err) => {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
 
  console.log('connected as id ' + connection.threadId);
});

app.get('/', (req, res) => res.send({ message: 'hello' }));

app.get('/codes', (req, res, next) => {
  connection.query('SELECT * from error', (err, result) => {
    if (err) next(err)
    return res.send({ data: result });
  })
});

app.get('/events', (req, res, next) => {
  connection.query('SELECT * from event', (err, result) => {
    if (err) next(err)
    return res.send({ data: result });
  })
});

app.get('/applications', (req, res, next) => {
  connection.query('SELECT * from application', (err, result) => {
    if (err) next(err)
    return res.send({ data: result });
  })
});

app.post('/admins/notificate', (req, res, next) => {
  const uuid = req.body.request.data.select;
  const sql = `SELECT user.email, user.first_name, user.last_name FROM error_user INNER JOIN user ON user.id = error_user.userId WHERE errorId = '${uuid}'`;
  connection.query(sql, (err, result) => {
    if (err) next(err)

    const emails = result.map(user => user.email).join(', ');
    const mailOptions = {
      from: '"Test Server" <support@mosaicui.com>',
      to: emails,
      subject: "Mosaic UI - Error Support",
      text: "This is an mosaic UI email test"
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if(err){
        console.log(err);
        next(err)
      }

      console.log('Message sent: %s', info.messageId);
      return res.send({ message: "Email successfully sent." });
    });
  });
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: {
      message: err.message || "Internal Server Error"
    }
  })
})

app.listen(8080, () => console.log("Server running on port 8080"));