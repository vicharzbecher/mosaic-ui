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
  connection.query('SELECT uuid, source_applications, event_type FROM customer_notification', (err, result) => {
    if (err) next(err)
    return res.send({ data: result });
  })
});

app.post('/admins/notificate', (req, res, next) => {
  const { uuid: { uuid }, eventType = 'No event', sourceApplication = 'No source' } = req.body.data;
  connection.query('SELECT user.email, user.first_name, user.last_name FROM uuid_users INNER JOIN user ON user.id = uuid_users.user_id WHERE uuid = ?', [uuid], (err, result) => {
    if (err) next(err)

    const emails = result.map(user => user.email).join(', ');
    const mailOptions = {
      from: '"Mosaic Support" <support@mosaicui.com>',
      to: emails,
      subject: "Customer Notification Admin - Error Support",
      text: `There was an error ${uuid} during ${eventType} from ${sourceApplication} application`
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

app.get('/forms/:formId(\\d+)', (req, res, next) => {
  const formId = req.params.formId;
  const sql = `SELECT * FROM form WHERE id = ${formId}`
  
  connection.query(sql, (err, result) => {
    if (err) next(err)

    if (result.length > 0){
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
  
      return res.send(jsonSchema);
    } else{
      return res.send({ message: "Not results." });
    }
  });
});

app.get('/forms', (req, res) => {
  connection.query('SELECT * FROM form', (err, results) => {
    if(err) next(err);

    res.send({ data: results });
  });
});

app.post('/forms', (req, res) => {
  const form = {
    name: req.body.name || "form",
    schema: JSON.stringify(req.body)
  };
  
  connection.query('INSERT INTO form SET ?', form, (err, result) => {
    if(err) next(err);

    res.send({ id: result.insertId, message: "Form successfully saved." });
  });
});

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

app.get('/licenses', (req, res, next) => {
  connection.query('SELECT * from licenses', (err, result) => {
    if (err) next(err);
    return res.send({ data: result });
  })
});

app.post('/licenses', (req, res, next) => {
  const licenseId = req.body.data.license.license_id;
  const seats = req.body.data.seats;

  connection.query('UPDATE licenses SET seats = ? WHERE license_id = ?', [seats, licenseId], (err, result) => {
    if(err) next(err);

    res.send({ message: "License successfully updated." });
  });
});

app.get('/customer/notifications', (req, res, next) => {
  connection.query('SELECT * from customer_notification', (err, result) => {
    if (err) next(err);

    if(result.length > 0){
      const response = result.map(item => ({
        uuid: item.uuid,
        event_type: item.event_type,
        source_application: item.source_applications,
        email: (JSON.parse(item.comunication_payload)).to.emailAddress
      }));

      return res.send({ data: response });
    } else {
      return res.send({ message: 'No results.'});
    }
  })
});

app.post('/customer/notifications', (req, res, next) => {
  const { email: { email }, eventType = 'No event', sourceApplication = 'No source' } = req.body.data;
  
  const mailOptions = {
    from: '"Mosaic Support" <support@mosaicui.com>',
    to: email,
    subject: "Customer Notification Admin - Error Support",
    text: `There was an error during ${eventType} from ${sourceApplication} Application`
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

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: {
      message: err.message || "Internal Server Error"
    }
  })
})

app.listen(8080, () => console.log('Server running on port 8080'));
