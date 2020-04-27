function email_validation(email_id){
  console.log("hello");
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
    subject: 'Sending Email using Node.js',
    text: 'That was easy!'
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}
