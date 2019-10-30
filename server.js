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
      from: '"Mosaic Support" <support@mosaicui.com>',
      to: emails,
      subject: "Customer Notification Admin - Error Support",
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

app.get('/forms', (req, res) => res.send({"_id":"5db76cfef8917c975652d129","type":"form","tags":[],"owner":"5db29779cb4ff22499f1ab46","components":[{"autofocus":false,"input":true,"tableView":true,"label":"Select the error code","key":"select","placeholder":"","data":{"values":[{"value":"","label":""}],"json":"","url":"https://mosaic-ui-api.localtunnel.me/codes","resource":"5db297e88b6d0b152fab2b8c","custom":"","project":"osnodsjcwhrwjsk","headers":[{"value":"","key":""}]},"dataSrc":"url","valueProperty":"id","defaultValue":"","refreshOn":"","filter":"","authenticate":false,"template":"<span>{{ item.code }}</span>","multiple":false,"protected":false,"unique":false,"persistent":true,"hidden":false,"clearOnHide":true,"validate":{"required":false},"type":"select","labelPosition":"top","tags":[],"conditional":{"show":"","when":null,"eq":""},"properties":{},"selectValues":"data","defaultPermission":""},{"autofocus":false,"input":true,"label":"Submit","tableView":false,"key":"submit","size":"md","leftIcon":"","rightIcon":"","block":false,"action":"submit","disableOnInvalid":false,"theme":"primary","type":"button"}],"revisions":"","_vid":0,"title":"dropdown","display":"form","access":[{"roles":[],"type":"create_own"},{"roles":[],"type":"create_all"},{"roles":[],"type":"read_own"},{"roles":["5db297e88b6d0b27ddab2b89","5db297e88b6d0b9de1ab2b8a","5db297e88b6d0b57b6ab2b8b"],"type":"read_all"},{"roles":[],"type":"update_own"},{"roles":[],"type":"update_all"},{"roles":[],"type":"delete_own"},{"roles":[],"type":"delete_all"},{"roles":[],"type":"team_read"},{"roles":[],"type":"team_write"},{"roles":[],"type":"team_admin"}],"submissionAccess":[{"roles":["5db297e88b6d0b57b6ab2b8b"],"type":"create_own"},{"roles":[],"type":"create_all"},{"roles":["5db297e88b6d0b57b6ab2b8b"],"type":"read_own"},{"roles":[],"type":"read_all"},{"roles":["5db297e88b6d0b57b6ab2b8b"],"type":"update_own"},{"roles":[],"type":"update_all"},{"roles":["5db297e88b6d0b57b6ab2b8b"],"type":"delete_own"},{"roles":[],"type":"delete_all"},{"roles":[],"type":"team_read"},{"roles":[],"type":"team_write"},{"roles":[],"type":"team_admin"}],"settings":{},"properties":{},"name":"dropdown","path":"dropdown","project":"5db297e88b6d0b9579ab2b88","created":"2019-10-28T22:34:38.724Z","modified":"2019-10-30T17:38:31.233Z","machineName":"osnodsjcwhrwjsk:dropdown"}));
app.get('/forms/:formId', (req, res) => res.send({ message: 'hello' }));

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: {
      message: err.message || "Internal Server Error"
    }
  })
})

app.listen(8080, () => console.log("Server running on port 8080"));