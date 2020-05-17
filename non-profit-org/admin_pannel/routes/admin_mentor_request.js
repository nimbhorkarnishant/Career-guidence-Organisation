const express = require('express')
var nodemailer = require('nodemailer');
const mentor_request = require('./../../mentor/model/request_for_mentor')
const mentor_request_record = require('./../../mentor/model/request_for_mentor_record')
const user = require('./../../user/model/user_registration')
const user_fun=require('./../../user/model/user_function')
const router = express.Router()
const app=express()
//var crypto = require("crypto");
//const user_fun=require('../../user/model/user_function')


router.get('/mentor_request',async (req,res) =>{
  if (req.session.user_detail) {
        mentor_request.find({}, function(err, mentor_requests) {
          var message_data=req.flash("message");
          res.render('user_template/admin_pannel/admin_mentor_request/mentor_request_data',
          { title: 'Learncess|Admin|Club Requests',css_main:'',
            message_dict:{"page":"",message_data,"user_access":req.session.user_detail[0].user_access},
            user_detail:req.session.user_detail,
            mentor_request:mentor_requests,
          })
        })
  }
  else {
    req.flash("message","You have to login for this Feature!");
    res.redirect('/login');
  }

})

router.get('/mentor_request_detail/:mentor_request_id',async (req,res) =>{
  if (req.session.user_detail) {
      mentor_request.find({_id:req.params.mentor_request_id}, function(err, mentor_requests) {
        mentor_request_record.find({mentor_request_id:req.params.mentor_request_id}, function(err, mentor_request_records) {
          var message_data=req.flash("message");
          res.render('user_template/admin_pannel/admin_mentor_request/mentor_request_detail',
          { title: 'Learncess|Admin|Register Volunteer',css_main:'',
            message_dict:{"page":"",message_data,"user_access":req.session.user_detail[0].user_access},
            user_detail:req.session.user_detail,
            mentor_request:mentor_requests,
            mentor_request_record:mentor_request_records,
          })
        })
      })
  }
  else {
    req.flash("message","You have to login for this Feature!");
    res.redirect('/login');
  }

})

router.post('/admin_update_mentor_request/:mentor_request_id',async (req,res) =>{
  if (req.session.user_detail) {
      mentor_request.find({_id:req.params.mentor_request_id}, function(err, mentor_requests) {
        if (mentor_request.length==0) {
          req.flash("message","Data not Found Please contact Technician!");
          res.redirect('/mentor_request_detail/'+mentor_requests[0]._id);
        }
        else {
          mentor_requests[0].first_name=req.body.first_name,
          mentor_requests[0].last_name=req.body.last_name,
          mentor_requests[0].email_id=req.body.email_id,
          mentor_requests[0].mobile_no=req.body.mobile_no,
          mentor_requests[0].describe_mentoring_topic=req.body.discription,
          mentor_requests[0].call_prefference=req.body.call_prefference,
          mentor_requests[0].time_for_call=req.body.time_for_call,
          mentor_requests[0].save();
          req.flash("message","Mentor Request Data is Successfully Upadted!");
          res.redirect('/mentor_request_detail/'+mentor_requests[0]._id);
        }
      })
  }
  else {
    req.flash("message","You have to login for this Feature!");
    res.redirect('/login');
  }

})

router.post('/admin_update_mentor_request_record/:mentor_request_id',async (req,res) =>{
  if (req.session.user_detail) {
      mentor_request.find({_id:req.params.mentor_request_id}, function(err, mentor_requests) {
        mentor_request_record.find({mentor_request_id:req.params.mentor_request_id}, function(err, mentor_request_records) {
          if (mentor_request.length==0) {
            req.flash("message","Data not Found Please contact Technician!");
            res.redirect('/club_request_detail/'+clubs[0]._id);
          }
          else {
            mentor_requests[0].review_done=req.body.application_review,
            mentor_request_records[0].mentor_request_status=req.body.request_status,
            mentor_requests[0].save();
            mentor_request_records[0].save();
            req.flash("message","Mentor Request Data is Successfully Upadted!");
            res.redirect('/mentor_request_detail/'+mentor_requests[0]._id);
          }
        })
      })
  }
  else {
    req.flash("message","You have to login for this Feature!");
    res.redirect('/login');
  }

})
router.get('/delete_mentor_request/:mentor_request_id',async (req,res) =>{
  if (req.session.user_detail) {
      mentor_request.findOneAndDelete({_id:req.params.mentor_request_id}, function(err, clubs) {
        mentor_request_record.findOneAndDelete({mentor_request_id:req.params.mentor_request_id}, function(err, club_records) {
          req.flash("message","Mentor Request is suceesfully Deleted!");
          res.redirect('/mentor_request');
        })
      })
  }
  else {
    req.flash("message","You have to login for this Feature!");
    res.redirect('/login');
  }

})


module.exports = router
