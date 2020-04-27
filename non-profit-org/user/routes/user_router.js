const express = require('express')
var nodemailer = require('nodemailer');
const router = express.Router()
const User_auth = require('./../model/user_registration')
const app=express()


router.get('/',async (req,res) =>{
  var user_status="";
  if (req.session.user_detail) {
    user_status="login";
  }

  res.render('user_template/home',
    { title: 'Learncess|Home',css_main:'css/home.css',
    css_file1:'css/flexslider.css',
    css_file2:'css/fancybox/jquery.fancybox.css',
    css_file3:'css/bootstrap.min.css',
    message_dict:{"page":"home","message":""},
    user_status:user_status,
  })
})

router.get('/login',async (req,res) =>{
  var user_status="";
  if (req.session.user_detail) {
    user_status="login";
  }
  res.render('user_template/auth_login',
  { title: 'Learncess|Login',css_main:'css/home.css',
    css_file1:'css/util.css',
    css_file2:'css/auth_login.css',
    css_file3:'css/bootstrap.min.css',
    message_dict:{"page":"","message":""},
    user_status:user_status,
  })
})
router.get('/register',async (req,res) =>{
  var user_status="";
  if (req.session.user_detail) {
    user_status="login";
  }
  res.render('user_template/auth_register',
  { title: 'Learncess|Register',css_main:'css/home.css',
    css_file1:'css/util.css',
    css_file2:'css/auth_login.css',
    css_file3:'css/bootstrap.min.css',
    message_dict:{"page":"","message":""},
    user_status:user_status
  })
})

router.get('/email_verification',async (req,res) =>{
  var user_status="";
  if (req.session.user_detail) {
    user_status="login";
  }

  res.render('user_template/otp_form',
  { title: 'Learncess|Email Verification',css_main:'css/home.css',
    css_file1:'css/util.css',
    css_file2:'css/auth_login.css',
    css_file3:'css/bootstrap.min.css',
    email_id:req.session.user_auth.email_id,
    message_dict:{"page":"","message":""},
    user_status:user_status
  })
})

router.post('/registering_user',async (req,res) =>{
  try {
    var first_name=req.body.first_name;
    var last_name=req.body.last_name;
    var email_id=req.body.email;
    var password=req.body.password;
    var re_password=req.body.re_password;

    User_auth.find({email_id:email_id }, "email_id", function(err, response){
    console.log(response);
    if (response.length!=0) {
        console.log("exist");
        res.redirect('/register');
    }
    else {
      if (password!=re_password) {
           console.log("not match");
           var message="Password Not Matched !"
           res.redirect('/register');
        }
      else {
        const user_auth=new User_auth({
          first_name:first_name,
          last_name:last_name,
          email_id:email_id,
          password:re_password,
        })
        try{
          if(req.session.user_auth){
            req.session.user_auth=user_auth;
         } else {
           req.session.user_auth=user_auth;
         }
          var data=email_validation(req.session.user_auth.email_id);
          if (!req.session.generated_otp) {
            req.session.generated_otp=data[1];
          }
          else {
              req.session.generated_otp=data[1];
          }
          console.log(req.session.user_auth)
          res.redirect('/email_verification');
        }
        catch (error) {
          console.log(error);
        }
      }

    }

   });

  }
  catch (e) {
    console.log(e);

  }
  finally {

  }

})

router.post('/saving_user',async (req,res) =>{
  var otp=req.body.otp;
  if (req.session.generated_otp==otp) {
    try {
      const user_auth=new User_auth(req.session.user_auth)
      user_auth.save()
      req.session.destroy((err) => {
        res.redirect('/login')
      })

    } catch (e) {
      console.log("dupication");
      console.log(e)

    } finally {

    }

  }
  else{
    console.log("Otp is incorrect",req.session.user_auth);
    res.redirect('/email_verification');
  }


})

router.get("/resend_otp",async (req,res)=>{
  try {
    var data=email_validation(req.session.user_auth.email_id);
    if (req.session.generated_otp) {
      req.session.generated_otp=data[1];
    }
    else {
      req.session.generated_otp=data[1];
    }
    console.log(req.session.user_auth)
    res.redirect("/email_verification")

  } catch (e) {
    console.log(e);

  } finally {

  }


})

router.post('/login_validation',async (req,res)=>{
  var email_id=req.body.email;
  var password=req.body.password;
  User_auth.find({email_id:email_id }, function(err, response){
    console.log(response);
    if (!response.length==0) {
      if (response[0].password==password) {
        if (!req.session.user_detail) {
          req.session.user_detail=response;
          res.redirect('/')
        }
        else{

        }
      }
      else {
      }
    }
    else {

    }

  });

})
router.get("/logout",async(req,res)=>{
  req.session.destroy((err) => {
    res.redirect('/')
  })
})





function email_validation(email_id){
  var validation_data=[];
  console.log("hello");
  var genrated_otp=otp_generator();
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
    subject: 'Account Verification Email',
    text:genrated_otp,
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
  validation_data.push(email_id,genrated_otp)
  return validation_data;
}


function otp_generator(){
  // Declare a string variable
   // which stores all string
   var string = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
   let OTP = '';

   // Find the length of string
   var len = string.length;
   for (let i = 0; i < 6; i++ ) {
       OTP += string[Math.floor(Math.random() * len)];
   }
   return OTP;
}

module.exports = router
