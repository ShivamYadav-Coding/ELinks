const nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
    service: 'outlook',
    auth: {
      user: process.env.email,
      pass: process.env.pass
    }
  });

  function sendEmail(receiver, subject, paragraph, link, linkText) {
    var mailOptions = {
        from: process.env.email,
        to: receiver,
        subject: `${subject}`,
        html: `<div style="width: 100%; text-align: center;">
        <h1 style="color: darkslategray; font-family: 'Times New Roman', Times, serif;">ELinks</h1>
        <p style="color: darkslategrey; font-size: 1.20rem; font-family: Georgia, 'Times New Roman', Times, serif;">
        ${paragraph }
        </p><br>
    
        <a href="${link}" style="text-decoration: none; color: floralwhite; background-color: seagreen; padding: .5rem 1rem; font-size: 1.25rem; border-radius: .5rem;">${linkText}</a>
    </div>`
      };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
     });
  }

module.exports = { sendEmail };