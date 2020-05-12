const express = require('express')
var nodemailer = require('nodemailer');
const club_registration = require('./../model/club_model')
const router = express.Router()
const app=express()
var crypto = require("crypto");
const user_fun=require('../../user/model/user_function')



router.get('/Invite_for_club',async (req,res) =>{
  var user_data=[];
  var user_access="";
  if (req.session.user_detail) {
    user_data=req.session.user_detail;
    user_access=req.session.user_detail[0].user_access;
    var message_data=req.flash("message");
    res.render('user_template/club_invitation_form',
    { title: 'Learncess|Club Invitation',css_main:'css/home.css',
      css_file1:'css/util.css',
      css_file2:'css/volunteer_css.css',
      css_file3:'css/bootstrap.min.css',
      message_dict:{"page":"",message_data,"user_access":user_access},
      user_detail:user_data,
    })
  }
  else {
    req.flash("message","You have to login for this Feature!");
    res.redirect('/login');
  }

})

router.post('/Inviting_for_club',async (req,res) =>{
  if (req.session.user_detail) {
    club_registration.find({user_id:req.session.user_detail[0]._id },
      function(err, response){
        if (response.length!=0) {
          req.flash("message","You already invited us..Still you have any query please contact us on given detail on our website!");
          res.redirect('/Invite_for_club')
        }
        else {
          try {
            const club_data=new club_registration({
              user_id:req.session.user_detail[0]._id,
              school_name:req.body.school_name,
              school_email_id:req.body.school_email,
              school_address:req.body.school_address,
              school_state:req.body.state_school,
              school_country:"India",
              school_city:req.body.city_school,
              school_website_url:req.body.school_website,
              school_area_pin_code:req.body.pin_code,
              school_cordinator_name:req.body.school_cordi_name,
              school_cordinator_email_id:req.body.school_cordi_email_id,
              school_cordinator_phone_no:req.body.school_cordi_phone_no,
              review_done:'false',
            })
            club_data.save();
            subject='Club Invitation- '+ req.headers.host;
            text='Hello '+req.body.school_name+'\n\nWe Accepted your Invitation for club setup.'+
            '\nFurther Instruction we will send you via school email id as well as we will contact to your cordinator for more detail .\n'+
            'If you have any query '+
            'then please contact us on given detail on our website.\n\n'+
            'Thanks for moving one step forward to improve our your the student future as well as your school!\n\n'+
            'The '+ req.headers.host +' team';
            user_fun.email_validation(req.body.school_email,subject,text);
            user_fun.email_validation(req.body.school_cordi_email_id,subject,text);
            req.flash("message","Your Invitation is Successfully Accepted!");
            res.redirect('/')

          } catch (e) {
            req.flash("message","Something is going wrong please refresh!");
            res.redirect('/Invite_for_club')
          } finally {

          }
        }

      });
  }
  else {
    req.flash("message","You have to login for this Feature!");
    res.redirect('/login');
  }

})

module.exports = router
