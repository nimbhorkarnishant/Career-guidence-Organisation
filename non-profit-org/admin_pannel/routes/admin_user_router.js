const express = require('express')
var nodemailer = require('nodemailer');
const club_registration = require('./../../club_detail/model/club_model')
const volunteer = require('./../../volunteer/model/volunteer_model')
const user = require('./../../user/model/user_registration')
const router = express.Router()
const app=express()
//var crypto = require("crypto");
//const user_fun=require('../../user/model/user_function')


router.get('/User_Authentication',async (req,res) =>{
  var message_data=req.flash("message");
  if (req.session.user_detail) {
    user.find({}, function(err, users) {
      volunteer.find({}, function(err, volunteers) {
        club_registration.find({}, function(err, clubs) {
          res.render('user_template/admin_pannel/admin_user_auth/user_authentication',
          { title: 'Learncess|Admin|User Authentication',css_main:'',
            css_file1:'',
            css_file2:'',
            css_file3:'',
            message_dict:{"page":"",message_data,"user_access":req.session.user_detail[0].user_access},
            user_detail:req.session.user_detail,
            user:users,
          })
        })
      })
    })
  }
  else {
    req.flash("message","You have to login for this Feature!");
    res.redirect('/login');
  }

})

router.get('/user_detail/:user_id',async (req,res) =>{
  var message_data=req.flash("message");
  if (req.session.user_detail) {
    user.find({_id:req.params.user_id}, function(err, users) {
          res.render('user_template/admin_pannel/admin_user_auth/user_detail',
          { title: 'Learncess|Admin|User Authentication',css_main:'',
            message_dict:{"page":"",message_data,"user_access":req.session.user_detail[0].user_access},
            user_detail:req.session.user_detail,
            user:users,
          })
    })
  }
  else {
    req.flash("message","You have to login for this Feature!");
    res.redirect('/login');
  }

})

router.post('/admin_update_user/:user_id',async (req,res) =>{
  var message_data=req.flash("message");
  if (req.session.user_detail) {
    user.find({_id:req.params.user_id}, function(err, users) {
          if (users.length==1) {
            users[0].first_name=req.body.first_name;
            users[0].last_name=req.body.last_name;
            users[0].email_id=req.body.email_id;
            users[0].user_access=req.body.user_access;
            users[0].save();
            req.flash("message","User Data is Successfully Updated!");
            res.redirect('/user_detail/'+users[0]._id);
          }
          else
          {
            req.flash("message","No User Found!");
            res.redirect('/user_detail');
          }
    })
  }
  else {
    req.flash("message","You have to login for this Feature!");
    res.redirect('/login');
  }

})

router.post('/admin_change_password/:user_id',async (req,res) =>{
  var message_data=req.flash("message");
  if (req.session.user_detail) {
    user.find({_id:req.params.user_id}, function(err, users) {
          var  pass1=req.body.pass1;
          var pass2=req.body.pass2;
          if (users.length==1) {
            if (pass1==pass2) {
              users[0].password=pass1;
              users[0].save();
              req.flash("message","User Password is Successfully Updated!");
              res.redirect('/user_detail/'+users[0]._id);
            }
            else {
              req.flash("message","Sorry Password Does not Matched!");
              res.redirect('/user_detail/'+users[0]._id);
            }
          }
          else
          {
            req.flash("message","No User Found!");
            res.redirect('/user_detail');
          }
    })
  }
  else {
    req.flash("message","You have to login for this Feature!");
    res.redirect('/login');
  }

})

router.get('/delete_user/:user_id',async (req,res) =>{
  var message_data=req.flash("message");
  if (req.session.user_detail) {
    user.findOneAndDelete({_id:req.params.user_id}, function(err, result) {
      req.flash("message","User Deleted Successfully!");
      res.redirect('/User_Authentication');
    })
  }
  else {
    req.flash("message","You have to login for this Feature!");
    res.redirect('/login');
  }

})





module.exports = router
