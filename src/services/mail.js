const nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.email,
      pass: process.env.pass
    }
  });

  function verifyEmail(receiver, link) {
    var mailOptions = {
        from: process.env.email,
        to: receiver,
        subject: 'Authenticate your NoteYacht Accout',
        text: link
      };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
     });
  }

  function resetEmail(receiver, link) {
      console.log('sending reser email..');
  }

  module.exports = { verifyEmail, resetEmail};