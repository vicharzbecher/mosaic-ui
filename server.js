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
  service: 'SendGrid', // no need to set host or port etc.
  auth: {
    user: process.env.SENDGRID_USERNAME,
    pass: process.env.SENDGRID_PASSWORD
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

app.get('/uuids', (req, res, next) => {
  connection.query('SELECT * from customer_notifications', (err, result) => {
    if (err) next(err)
    return res.send({ data: result });
  })
});

app.post('/admins/notificate', (req, res, next) => {
  const { uuid, eventType = 'No event', appSource = 'No source' } = req.body.request.data;
  connection.query('SELECT user.email, user.first_name, user.last_name FROM uuid_users INNER JOIN user ON user.id = uuid_users.user_id WHERE uuid = ?', [uuid], (err, result) => {
    if (err) next(err)

    const emails = result.map(user => user.email).join(', ');
    const mailOptions = {
      from: '"Mosaic Support" <support@mosaicui.com>',
      to: emails,
      subject: "Customer Notification Admin - Error Support",
      text: `There was an error ${uuid} during ${eventType} in ${appSource}`
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

app.get('/forms/:formId', (req, res, next) => {
  const formId = req.params.formId;
  const sql = `SELECT * FROM form WHERE id = ${formId}`
  
  connection.query(sql, (err, result) => {
    if (err) next(err)

    const schema = JSON.parse(result[0].schema);

    const jsonSchema = {
      _id: result[0].id,
      title:  schema.title,
      type: schema.display,
      display: schema.display,
      components: schema.components,
      name: result[0].name,
      path: schema.path,
    }

    res.send(jsonSchema);
  });
});

app.post('/forms', (req, res) => {
  const form = {
    name: req.body.name || "form",
    schema: JSON.stringify(req.body)
  };
  
  connection.query('INSERT INTO form SET ?', form, (err, result) => {
    if(err) next(err);

    res.send({ message: "Form successfully saved." })
  });
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: {
      message: err.message || "Internal Server Error"
    }
  })
})

app.post('/forms/update', (req, res, next) => {
  const formId = req.body._id;
  const schemaObj = {
    title:  req.body.title,
    type: req.body.type,
    display: req.body.display,
    components: req.body.components,
    name: req.body.name,
    path: req.body.path,
  }

  const form = {
    name: req.body.name,
    schema: JSON.stringify(schemaObj)
  };

  connection.query('UPDATE form SET ? WHERE id = ?', [form, formId], (err, result) => {
    if(err) next(err);

    res.send({ message: "Form successfully updated." })
  });
});

app.listen(8080, () => console.log("Server running on port 8080"));