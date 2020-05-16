const express = require('express')
var nodemailer = require('nodemailer');
const club_registration = require('./../../club_detail/model/club_model')
const club_record = require('./../../club_detail/model/club_record')
const volunteer = require('./../../volunteer/model/volunteer_model')
const user = require('./../../user/model/user_registration')
const user_fun=require('./../../user/model/user_function')
const router = express.Router()
const app=express()
//var crypto = require("crypto");
//const user_fun=require('../../user/model/user_function')


router.get('/resquest_for_club_setup',async (req,res) =>{
  if (req.session.user_detail) {
        club_registration.find({}, function(err, clubs) {
          var message_data=req.flash("message");
          res.render('user_template/admin_pannel/admin_club/club_data',
          { title: 'Learncess|Admin|Club Requests',css_main:'',
            message_dict:{"page":"",message_data,"user_access":req.session.user_detail[0].user_access},
            user_detail:req.session.user_detail,
            club:clubs,
          })
    })
  }
  else {
    req.flash("message","You have to login for this Feature!");
    res.redirect('/login');
  }

})

router.get('/club_request_detail/:club_id',async (req,res) =>{
  if (req.session.user_detail) {
      club_registration.find({_id:req.params.club_id}, function(err, clubs) {
        club_record.find({club_id:req.params.club_id}, function(err, club_records) {
          var message_data=req.flash("message");
          res.render('user_template/admin_pannel/admin_club/club_detail',
          { title: 'Learncess|Admin|Register Volunteer',css_main:'',
            message_dict:{"page":"",message_data,"user_access":req.session.user_detail[0].user_access},
            user_detail:req.session.user_detail,
            club:clubs,
            club_record:club_records,
          })
        })
      })
  }
  else {
    req.flash("message","You have to login for this Feature!");
    res.redirect('/login');
  }

})

router.post('/admin_update_school_detail/:club_id',async (req,res) =>{
  if (req.session.user_detail) {
      club_registration.find({_id:req.params.club_id}, function(err, clubs) {
        if (clubs.length!=1) {
          req.flash("message","Data not Found Please contact Technician!");
          res.redirect('/club_request_detail/'+clubs[0]._id);
        }
        else {
          clubs[0].school_name=req.body.school_name,
          clubs[0].school_email_id=req.body.school_email_id,
          clubs[0].school_address=req.body.school_address,
          clubs[0].school_state=req.body.school_state,
          clubs[0].school_country=req.body.school_country,
          clubs[0].school_city=req.body.school_city,
          clubs[0].school_website_url=req.body.school_website_url,
          clubs[0].school_area_pin_code=req.body.school_area_pin_code,
          clubs[0].school_cordinator_name=req.body.school_cordinator_name,
          clubs[0].school_cordinator_email_id=req.body.school_cordinator_email_id,
          clubs[0].school_cordinator_phone_no=req.body.school_cordinator_phone_no,
          clubs[0].save();
          req.flash("message","School Data is Successfully Upadted!");
          res.redirect('/club_request_detail/'+clubs[0]._id);
        }
      })
  }
  else {
    req.flash("message","You have to login for this Feature!");
    res.redirect('/login');
  }

})

router.post('/admin_update_club_request_record/:club_id',async (req,res) =>{
  if (req.session.user_detail) {
      club_registration.find({_id:req.params.club_id}, function(err, clubs) {
        club_record.find({club_id:req.params.club_id}, function(err, club_records) {
          if (clubs.length!=1) {
            req.flash("message","Data not Found Please contact Technician!");
            res.redirect('/club_request_detail/'+clubs[0]._id);
          }
          else {
            clubs[0].review_done=req.body.application_review,
            club_records[0].club_request_status=req.body.application_status,
            console.log(club_records[0]);
            clubs[0].save();
            club_records[0].save();
            if (req.body.application_status=="accepted") {
              subject='Club Request Status- '+ req.headers.host;
              text='Hello '+clubs[0].first_name+'\n\n Your Application is reviewed and we accepted as a part of our organization.\n\n'+
              'Thanks for moving one step forward to improve our society!\n\n'+
              'The '+ req.headers.host +' team';
              user_fun.email_validation(clubs[0].school_email_id,subject,text);
              user_fun.email_validation(clubs[0].school_cordinator_email_id,subject,text);
            }
            else if (req.body.application_status=="rejected") {
              subject='Club Request Status- '+ req.headers.host;
              text='Hello '+clubs[0].school_name+'\n\n Your Application is reviewed and we are sorry to say you that you are rejected.\n\n'+
              'Thanks for moving one step forward to improve our society!\n\n'+
              'The '+ req.headers.host +' team';
               user_fun.email_validation(clubs[0].school_email_id,subject,text);
               user_fun.email_validation(clubs[0].school_cordinator_email_id,subject,text);
            }
            req.flash("message","Club Request Record data is suceesfully Updated!");
            res.redirect('/club_request_detail/'+clubs[0]._id);
          }
        })
      })
  }
  else {
    req.flash("message","You have to login for this Feature!");
    res.redirect('/login');
  }

})
router.get('/delete_school/:club_id',async (req,res) =>{
  if (req.session.user_detail) {
      club_registration.findOneAndDelete({_id:req.params.club_id}, function(err, clubs) {
        club_record.findOneAndDelete({club_id:req.params.club_id}, function(err, club_records) {
          req.flash("message","School is suceesfully Deleted!");
          res.redirect('/resquest_for_club_setup');
        })
      })
  }
  else {
    req.flash("message","You have to login for this Feature!");
    res.redirect('/login');
  }

})


module.exports = router
