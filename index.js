var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var cors = require('cors');
const creds = require('./config');

var transport = {
    service: 'gmail',
    auth: {
      user: creds.USER,
      pass: creds.PASS
  }
}

var transporter = nodemailer.createTransport(transport)

transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log('Server is ready to take messages');
  }
});

router.post('/send', (req, res, next) => {
  var name = req.body.name
  var email = req.body.email
  var cell = req.body.cellno
  var address = req.body.address
  var order = req.body.order
  var content = `Name of Customer: ${name} \n\nOrder details:\n ${order}\n\nContact Details:\nemail: ${email},cell: ${cell}\n\nDelivery Address: \n${address} `

  var mail = {
    from: name,
    to: 'ntlokodwa@gmail.com',  // Change to email address that you want to receive messages on
    subject: 'New order from Thenjiwe',
    text: content

  }


  transporter.sendMail(mail, (err, data) => {
    if (err) {
      res.json({
        status: err
      })
    } else {
      
      res.json({
       status: 'success'
      })

      transporter.sendMail({
        from: "thenjiwe.auth@gmail.com",
        to: email,
        subject: "Thenjiwe Order Submission was successful",
        text: `Thank you for ordering through us ${name}!\n\n\ Your order has been submitted. We will contact you shortly for delivery.`
      }, function(error, info){
        if(error) {
          console.log(error);
        } else{
          console.log('Message sent: ' + info.response);
        }
      });
      
    }
  });
});

const app = express();
app.use(cors());
app.use(express.json());
app.use('/', router);
app.listen(3002);