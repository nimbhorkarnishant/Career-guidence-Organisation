const express = require('express')
var nodemailer = require('nodemailer');
const club_registration = require('./../../club_detail/model/club_model')
const volunteer = require('./../../volunteer/model/volunteer_model')
const user = require('./../../user/model/user_registration')
const router = express.Router()
const app=express()
//var crypto = require("crypto");
//const user_fun=require('../../user/model/user_function')



router.get('/admin',async (req,res) =>{
  if (req.session.user_detail) {
    user.find({}, function(err, users) {
      volunteer.find({}, function(err, volunteers) {
        club_registration.find({}, function(err, clubs) {
          var message_data=req.flash("message");
          res.render('user_template/admin_pannel/admin_pannel_home',
          { title: 'Learncess|Admin',css_main:'',
            css_file1:'',
            css_file2:'',
            css_file3:'',
            message_dict:{"page":"",message_data,"user_access":req.session.user_detail[0].user_access},
            user_detail:req.session.user_detail,
            user:users,
            volunteer:volunteers,
            club:clubs,
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

router.get('/User_Authentication',async (req,res) =>{
  if (req.session.user_detail) {
    user.find({}, function(err, users) {
      volunteer.find({}, function(err, volunteers) {
        club_registration.find({}, function(err, clubs) {
          var message_data=req.flash("message");
          res.render('user_template/admin_pannel/user_authentication',
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

router.get('/register_volunteer',async (req,res) =>{
  if (req.session.user_detail) {
    user.find({}, function(err, users) {
      volunteer.find({}, function(err, volunteers) {
        club_registration.find({}, function(err, clubs) {
          var message_data=req.flash("message");
          res.render('user_template/admin_pannel/volunteer_data',
          { title: 'Learncess|Admin|Register Volunteer',css_main:'',
            css_file1:'',
            css_file2:'',
            css_file3:'',
            message_dict:{"page":"",message_data,"user_access":req.session.user_detail[0].user_access},
            user_detail:req.session.user_detail,
            volunteer:volunteers,
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

router.get('/resquest_for_club_setup',async (req,res) =>{
  if (req.session.user_detail) {
    user.find({}, function(err, users) {
      volunteer.find({}, function(err, volunteers) {
        club_registration.find({}, function(err, clubs) {
          var message_data=req.flash("message");
          res.render('user_template/admin_pannel/club_data',
          { title: 'Learncess|Admin|Club Requests',css_main:'',
            css_file1:'',
            css_file2:'',
            css_file3:'',
            message_dict:{"page":"",message_data,"user_access":req.session.user_detail[0].user_access},
            user_detail:req.session.user_detail,
            club:clubs,
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



module.exports = router
