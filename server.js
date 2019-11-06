const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const pool = require('./database');
const bodyParser = require('body-parser')

const app = express();
app.use(bodyParser.json({ type: ['text/plain', 'application/json'] }));
app.use(cors());

const transporter = nodemailer.createTransport({
  service: 'SendGrid',
  auth: {
    user: process.env.SENDGRID_USERNAME,
    pass: process.env.SENDGRID_PASSWORD
  }
});

app.get('/', (req, res) => res.send({ message: 'hello' }));

app.get('/uuids', (req, res, next) => {
  const sql = 'SELECT uuid, source_applications, event_type FROM customer_notifications';
  pool.query(sql, (error, results) => {
    if (error) next(error);
    return res.send({ data: results });
  });
});

app.post('/admins/notificate', (req, res, next) => {
  const { uuid: { uuid }, eventType = 'No event', sourceApplication = 'No source' } = req.body.data;
  const sql = 'SELECT user.email, user.first_name, user.last_name FROM uuid_users INNER JOIN user ON user.id = uuid_users.user_id WHERE uuid = ?';

  pool.query(sql, (error, results) => {
    if (error) next(error);
    
    const emails = results.map(user => user.email).join(', ');
    const mailOptions = {
      from: '"Mosaic Support" <support@mosaicui.com>',
      to: emails,
      subject: "Customer Notification Admin - Error Support",
      text: `There was an error ${uuid} during ${eventType} from ${sourceApplication} application`
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if(err){
        next(err)
      }

      console.log('Message sent: %s', info.messageId);
      return res.send({ message: "Email successfully sent." });
    });
  });
});

app.get('/forms/:formId(\\d+)', (req, res, next) => {
  const formId = req.params.formId;
  const sql = `SELECT * FROM form WHERE id = ${formId}`;

  pool.query(sql, (error, results) => {
    if (error) next(error);

    if (results.length > 0){
      const schema = JSON.parse(results[0].schema);
  
      const jsonSchema = {
        _id: results[0].id,
        title:  schema.title,
        type: schema.display,
        display: schema.display,
        components: schema.components,
        name: results[0].name,
        path: schema.path,
      }
  
      return res.send(jsonSchema);
    } else{
      return res.send({ message: "Not results." });
    }
  });
});

app.get('/forms', (req, res) => {
  pool.query('SELECT * FROM form', (error, results) => {
    if (error) next(error);

    const forms = results.map(form => {
      const schema = JSON.parse(form.schema);

      return {
        _id: form.id,
        type: schema.display,
        title: schema.title,
        tags: [],
        path: '',
        name: form.title,
        modified: '',
        display: schema.display,
        components: schema.components
      };
    });

    res.send({ data: forms });
  });
});

app.post('/forms', (req, res) => {
  const form = {
    name: req.body.name || "form",
    schema: JSON.stringify(req.body)
  };

  pool.query('INSERT INTO form SET ?', form, (error, results) => {
    if (error) next(error);

    res.send({ id: results.insertId, message: "Form successfully saved." });
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

  pool.query('UPDATE form SET ? WHERE id = ?', [form, formId], (error, results) => {
    if (error) next(error);

    res.send({ message: "Form successfully updated." });
  });
});

app.post('/forms/delete', (req, res, next) => {
  const formId = req.body._id;

  pool.query('DELETE FROM form WHERE id = ?', [formId], (error, results) => {
    if (error) next(error);

    res.send({ message: "Form successfully deleted." });
  });
});

app.get('/licenses', (req, res, next) => {
  pool.query('SELECT * from licenses', (error, results) => {
    if (error) next(error);

    return res.send({ data: results });
  });
});

app.post('/licenses', (req, res, next) => {
  const licenseId = req.body.data.license.license_id;
  const seats = req.body.data.seats;

  pool.query('UPDATE licenses SET seats = ? WHERE license_id = ?', [seats, licenseId], (error, results) => {
    if (error) next(error);

    res.send({ message: "License successfully updated." });
  });
});


app.get('/customer/notifications', (req, res, next) => {
  const email = req.query.email;
  let sql = 'SELECT event_id, event_type, source_application, communication_payload FROM customer_notification WHERE communication_payload IS NOT NULL LIMIT 10';

  if(email) {
    sql = `SELECT event_id, event_type, source_application, communication_payload FROM customer_notification WHERE communication_payload IS NOT NULL AND JSON_EXTRACT(communication_payload, '$.to.emailAddress') LIKE "%${email}%" LIMIT 10`;
  }

  pool.query(sql, (error, results) => {
    if (error) next(error);

    if(results && results.length > 0){
      const response = results.map(item => ({
        event_id: item.event_id,
        event_type: item.event_type,
        source_application: item.source_application,
        email: (JSON.parse(item.communication_payload)).to.emailAddress
      }));

      return res.send({ data: response });
    } else {
      return res.send({ data: [], message: 'No results.'});
    }
  });
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
    if(err) next(err)

    return res.send({ message: "Email successfully sent." });
  });
});

app.get('/notification/search', (req, res, next) => {
  const email = req.query.email;
  const event_type = req.query.event_type;

  if (!email || !event_type) return res.send({ message: 'email and event_type required', data: [] });

  let sql = `SELECT * FROM (SELECT event_id, event_type, source_application, creation_date, CAST(JSON_UNQUOTE(JSON_EXTRACT(communication_payload, '$.to.emailAddress')) AS CHAR) as email, CAST(JSON_UNQUOTE(JSON_EXTRACT(communication_payload, '$.to.contactAttributes.subscriberAttributes.uuid')) AS CHAR) as uuid FROM customer_notification) as errors WHERE uuid IS NOT NULL AND email LIKE '%${email}%' AND event_type LIKE '%${event_type}%'`;

  if (req.query.source_application) {
    sql += ` AND source_application LIKE '%${req.query.source_application}%'`;
  }

  if (req.query.start_date) {
    sql += ` AND creation_date >= CONVERT("${req.query.start_date}", datetime)`;
  }

  if (req.query.end_date) {
    sql += ` AND creation_date <= CONVERT("${req.query.end_date}", datetime)`;
  }

  sql += ` LIMIT 10`; 

  pool.query(sql, (error, results) => {
    if (error) next(error);
    if (results && results.length > 0) {
      return res.send({ data: results });
    } else {
      return res.send({ data: [], message: 'No results.'});
    }
  });
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: {
      message: err.message || "Internal Server Error"
    }
  })
});

app.listen(8080, () => console.log('Server running on port 8080'));