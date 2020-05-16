const express = require('express')
var nodemailer = require('nodemailer');
const club_registration = require('./../../club_detail/model/club_model')
const volunteer = require('./../../volunteer/model/volunteer_model')
const volunteer_record = require('./../../volunteer/model/volunteer_record')
const user = require('./../../user/model/user_registration')
const user_fun=require('./../../user/model/user_function')
const router = express.Router()
const app=express()
//var crypto = require("crypto");
//const user_fun=require('../../user/model/user_function')


router.get('/register_volunteer',async (req,res) =>{
  if (req.session.user_detail) {
    user.find({}, function(err, users) {
      volunteer.find({}, function(err, volunteers) {
        club_registration.find({}, function(err, clubs) {
          var message_data=req.flash("message");
          res.render('user_template/admin_pannel/admin_volunteer/volunteer_data',
          { title: 'Learncess|Admin|Register Volunteer',css_main:'',
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

router.get('/volunteer_detail/:volunteer_id',async (req,res) =>{
  if (req.session.user_detail) {
      volunteer.find({_id:req.params.volunteer_id}, function(err, volunteers) {
        volunteer_record.find({volunteer_id:req.params.volunteer_id}, function(err, volunteers_record) {
          var message_data=req.flash("message");
          res.render('user_template/admin_pannel/admin_volunteer/volunteer_detail',
          { title: 'Learncess|Admin|Register Volunteer',css_main:'',
            message_dict:{"page":"",message_data,"user_access":req.session.user_detail[0].user_access},
            user_detail:req.session.user_detail,
            volunteer:volunteers,
            volunteer_record:volunteers_record,
          })
        })
      })
  }
  else {
    req.flash("message","You have to login for this Feature!");
    res.redirect('/login');
  }

})

router.post('/admin_update_volunteer_data/:volunteer_id',async (req,res) =>{
  if (req.session.user_detail) {
    volunteer.find({_id:req.params.volunteer_id}, function(err, volunteers) {
      if (volunteers.length!=1) {
        req.flash("message","Sorry No Record Found.. For Any Issue contact with technician!");
        res.redirect('/volunteer_detail/'+volunteers[0]._id);
      }else {
        volunteers[0].first_name=req.body.first_name,
        volunteers[0].last_name=req.body.last_name,
        volunteers[0].email_id=req.body.email_id,
        volunteers[0].current_proffession=req.body.current_proffession,
        volunteers[0].current_address=req.body.current_address,
        volunteers[0].current_country=req.body.current_country,
        volunteers[0].current_state=req.body.current_state,
        volunteers[0].current_city=req.body.current_city,
        volunteers[0].current_pincode=req.body.current_pincode,
        volunteers[0].mobile_no=req.body.mobile_no,
        volunteers[0].linkdin_url=req.body.linkdin_url,
        volunteers[0].description_for_join=req.body.description_for_join,
        volunteers[0].save();
        req.flash("message","Volunteer Data is Suceesfully Updated!");
        res.redirect('/volunteer_detail/'+volunteers[0]._id);
      }
    })

  }
  else {
    req.flash("message","You have to login for this Feature!");
    res.redirect('/login');
  }

})

router.post('/admin_update_volunteer_record/:volunteer_id',async (req,res) =>{
  if (req.session.user_detail) {
      volunteer.find({_id:req.params.volunteer_id}, function(err, volunteers) {
        volunteer_record.find({volunteer_id:req.params.volunteer_id}, function(err, volunteers_record) {
          volunteers[0].review_done=req.body.application_review,
          volunteers_record[0].application_status=req.body.application_status,
          volunteers_record[0].volunteer_position=req.body.volunteer_position,
          volunteers[0].save();
          volunteers_record[0].save();
          if (req.body.application_status=="accepted") {
            subject='Volunteer Application Status- '+ req.headers.host;
            text='Hello '+volunteers[0].first_name+'\n\n Your Application is reviewed and we accepted as a part of our organization.\n\n'+
            'Thanks for moving one step forward to improve our society!\n\n'+
            'The '+ req.headers.host +' team';
             user_fun.email_validation(volunteers[0].email_id,subject,text);
          }
          else if (req.body.application_status=="rejected") {
            subject='Volunteer Application Status- '+ req.headers.host;
            text='Hello '+volunteers[0].first_name+'\n\n Your Application is reviewed and we are sorry to say you that you are rejected.\n\n'+
            'Thanks for moving one step forward to improve our society!\n\n'+
            'The '+ req.headers.host +' team';
             user_fun.email_validation(volunteers[0].email_id,subject,text);
          }
          req.flash("message","Volunteer Record Data is Successfully Updated!");
          res.redirect('/volunteer_detail/'+volunteers[0]._id);
        })
      })
  }
  else {
    req.flash("message","You have to login for this Feature!");
    res.redirect('/login');
  }

})

router.get('/delete_volunteer/:volunteer_id',async (req,res) =>{
  if (req.session.user_detail) {
      volunteer.findOneAndDelete({_id:req.params.volunteer_id}, function(err, result) {
        volunteer_record.findOneAndDelete({volunteer_id:req.params.volunteer_id}, function(err, result) {
          req.flash("message","Volunteer is succcessfully Delted!");
          res.redirect('/register_volunteer');
        })
      })
  }
  else {
    req.flash("message","You have to login for this Feature!");
    res.redirect('/login');
  }

})



module.exports = router
