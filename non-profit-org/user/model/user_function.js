var nodemailer = require('nodemailer');

// File cal.js
module.exports = {
  email_validation(email_id,subject,text){
    var validation_data=[];
    console.log("hello");
    //var genrated_otp=otp_generator();
    var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'learncess@gmail.com',
      pass: 'learncess2512@'
    }
    });

    var mailOptions = {
      from: 'learncess@gmail.com',
      to: email_id,
      subject: subject,
      text:text,
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
    return true;
  }

};
