const express = require('express')
var nodemailer = require('nodemailer');
const club_registration = require('./../../club_detail/model/club_model')
const volunteer = require('./../../volunteer/model/volunteer_model')
const user = require('./../../user/model/user_registration')
const mentor_request = require('./../../mentor/model/request_for_mentor')
const router = express.Router()
const app=express()
//var crypto = require("crypto");
//const user_fun=require('../../user/model/user_function')



router.get('/admin',async (req,res) =>{
  if (req.session.user_detail) {
    user.find({}, function(err, users) {
      volunteer.find({}, function(err, volunteers) {
        club_registration.find({}, function(err, clubs) {
          mentor_request.find({}, function(err, mentor_requests) {
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
              mentor_request:mentor_requests,
            })
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
