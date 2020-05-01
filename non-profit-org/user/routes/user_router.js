const express = require('express')
var nodemailer = require('nodemailer');
const router = express.Router()
const User_auth = require('./../model/user_registration')
const user_password_reset = require('./../model/user_password_reset')
const user_fun=require('./../model/user_function')
const app=express()
var crypto = require("crypto");


router.get('/',async (req,res) =>{
  var user_status="";
  if (req.session.user_detail) {
    user_status="login";
  }

  //req.flash("message","");
  var message_data=req.flash("message");
  res.render('user_template/home',
    { title: 'Learncess|Home',css_main:'css/home.css',
    css_file1:'css/flexslider.css',
    css_file2:'css/fancybox/jquery.fancybox.css',
    css_file3:'css/bootstrap.min.css',
    message_dict:{"page":"home",message_data},
    user_status:user_status,
  })
})
router.get('/register_for_volunteer',async (req,res) =>{
  var user_status="";
  if (req.session.user_detail) {
    user_status="login";
    var message_data=req.flash("message");
    res.render('user_template/volunteer_form',
    { title: 'Learncess|be volunteer',css_main:'css/home.css',
      css_file1:'css/util.css',
      css_file2:'css/volunteer_css.css',
      css_file3:'css/bootstrap.min.css',
      message_dict:{"page":"",message_data},
      user_status:user_status,
    })
  }
  else {
    req.flash("message","You have to login for this Feature!");
    res.redirect('/login');
  }

})

router.get('/login',async (req,res) =>{
  var user_status="";
  if (req.session.user_detail) {
    user_status="login";
  }
  var message_data=req.flash("message");
  res.render('user_template/auth_login',
  { title: 'Learncess|Login',css_main:'css/home.css',
    css_file1:'css/util.css',
    css_file2:'css/auth_login.css',
    css_file3:'css/bootstrap.min.css',
    message_dict:{"page":"",message_data},
    user_status:user_status,
  })
})
router.get('/register',async (req,res) =>{
  var user_status="";
  if (req.session.user_detail) {
    user_status="login";
  }
  var message_data=req.flash("message");
  res.render('user_template/auth_register',
  { title: 'Learncess|Register',css_main:'css/home.css',
    css_file1:'css/util.css',
    css_file2:'css/auth_login.css',
    css_file3:'css/bootstrap.min.css',
    message_dict:{"page":"",message_data},
    user_status:user_status
  })
})

router.get('/email_verification',async (req,res) =>{
  var user_status="";
  if (req.session.user_detail) {
    user_status="login";
  }
  var message_data=req.flash("message");
  res.render('user_template/otp_form',
  { title: 'Learncess|Email Verification',css_main:'css/home.css',
    css_file1:'css/util.css',
    css_file2:'css/auth_login.css',
    css_file3:'css/bootstrap.min.css',
    email_id:req.session.user_auth.email_id,
    message_dict:{"page":"",message_data},
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
        req.flash("message","User is Already Exist With this Email ID!")
        res.redirect('/register');
    }
    else {
      if (password!=re_password) {
           console.log("not match");
           var message="Password Not Matched !"
           req.flash("message","Passwords Not Matched!")
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
        req.flash("message","You Registered Successfully Please Login now!")
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
    req.flash("message","Otp Enter is Incoorect try again!")
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
          req.flash("message","You Logged in Successfully!")
          res.redirect('/')
        }
        else{

        }
      }
      else {
        req.flash("message","Password is Incorrect!")
        res.redirect('/login')
      }
    }
    else {
      req.flash("message","Sorry user with this email have no account to our platform,please register first!")
      res.redirect('/login');

    }

  });

})
router.get("/logout",async(req,res)=>{
  req.flash("message","You Logged Out Successfully!")
  req.session.destroy((err) => {
    res.redirect('/')
  })
})

router.get('/forgot_password',async (req,res) =>{
  crypto.randomBytes(20, function(err, buf) {
       var token = buf.toString('hex');
       console.log(token);
     });
  var user_status="";
  if (req.session.user_detail) {
    user_status="login";
  }
  let message_data=req.flash("message");
  res.render('user_template/forgot_password',
  { title: 'Learncess|Login',css_main:'css/home.css',
    css_file1:'css/util.css',
    css_file2:'css/auth_login.css',
    css_file3:'css/bootstrap.min.css',
    message_dict:{"page":"",message_data},
    user_status:user_status,
  })
})

router.post('/reset_password',async (req,res) =>{
  var email_id=req.body.email;
  console.log(email_id);
  User_auth.find({email_id:email_id }, function(err, response){
    //console.log(response[0]);
    if (response.length!=0) {
      crypto.randomBytes(20, function(err, buf) {
           var token = buf.toString('hex');
           // console.log(token);
           // console.log(response[0].id);
           // console.log( Date.now() + 3600000);
           // console.log(response[0].password);
           subject='Password Reset on '+ req.headers.host;
           text='Hello '+response[0].first_name+'\n\n You are receiving this email because you requested a password reset for your user account at '+req.headers.host+
           '\n\n Please go to the following page and choose a new password:\n\n'+'http://'+req.headers.host+'/password-reset-confirm?token='+token+"\n\n"+
           'Your username, in case you have forgotten:  ' + response[0].email_id + '\n\n'+' Note: The Link is only Valid Up to 1 hour\n\n'+
           'Thanks for using our site!\n\n'+
           'The '+ req.headers.host +' team';
            user_fun.email_validation(email_id,subject,text);
            //console.log(req.headers.host);

           const password_reset=new user_password_reset({
             user_id:response[0].id,
             old_password:response[0].password,
             password_token:token,
             password_reset_status:"not_done",
             token_expired_time:Date.now()+3600000
           })
           password_reset.save();
           req.flash("message","Email is sent Successfully.Further instruction for reseting password is sent to your email!!")
           res.redirect('/')

         });
    }
    else {
      req.flash("message","Sorry user is not exist with this email ID so please register first! or check email id...")
      res.redirect('/forgot_password')
    }
  });

})

router.get('/password-reset-confirm',async (req,res) =>{
  var user_status="";
  if (req.session.user_detail) {
    user_status="login";
  }
  let message_data=req.flash("message");
  user_password_reset.find({ password_token:req.query.token, token_expired_time: { $gt: Date.now() } }, function(err, response) {
    console.log(response);
    if (response.length==0) {
      req.flash('message', 'Password reset token is invalid or has expired.');
      res.redirect('/forgot_password');
    }
    else{
      //console.log(response);
      res.render('user_template/reset_confirm',
      { title: 'Learncess|Login',css_main:'css/home.css',
        css_file1:'css/util.css',
        css_file2:'css/auth_login.css',
        css_file3:'css/bootstrap.min.css',
        token:response[0].password_token,
        id:response[0].user_id,
        message_dict:{"page":"",message_data},
        user_status:user_status,
      })
    }
  });
})
router.post('/reset_password_done/:token/:user_id',async (req,res) =>{
  var user_status="";
  if (req.session.user_detail) {
    user_status="login";
  }
  let message_data=req.flash("message");
  let password1=req.body.pass1;
  let password2=req.body.pass2;
  console.log(req.params.user_id);
  console.log(req.params.token);

  if (password1!=password2) {
      req.flash("message","Password Not Match!!");
      res.redirect('/password-reset-confirm');
  }
  else{
    User_auth.find({_id:req.params.user_id}, function(err, response) {
      console.log(response);
      if (response.length!=0) {
          user_password_reset.find({password_token:req.params.token}, function(err, new_response){
            console.log(new_response)
            if (new_response.length!=0) {
              response[0].password=password1;
              new_response[0].password_reset_status="done";
              response[0].save();
              new_response[0].save();
              req.flash("message","Your Password is Successfully Updated!! Please Login");
              res.redirect("/login");
            }
            else{
              req.flash("message","Password token not found or it get expired !");
              res.redirect("/password-reset-confirm");
            }

          });

      }
      else{
        req.flash("message","Sorry User Not Found !");
        res.redirect("/login");
      }
    });

  }
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
