const express = require('express')
var nodemailer = require('nodemailer');
const router = express.Router()
const app=express()
const mentor_request = require('./../model/request_for_mentor')
const mentor_request_record = require('./../model/request_for_mentor_record')

const upload=require('express-fileupload')
var crypto = require("crypto");
const user_fun=require('../../user/model/user_function')




router.get('/chat_with_expert',async (req,res) =>{
  var user_data=[];
  var user_access="";
  if (req.session.user_detail) {
    user_data=req.session.user_detail;
    user_access=req.session.user_detail[0].user_access;
    var message_data=req.flash("message");
    res.render('user_template/mentor/mentor_request_form',
    { title: 'Learncess|be volunteer',css_main:'css/home.css',
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

router.post('/registering_mentor_request',async (req,res) =>{
  if (req.session.user_detail) {
    const mentor_data=new mentor_request({
        user_id:req.session.user_detail[0]._id,
        first_name:req.body.first_name,
        last_name:req.body.last_name,
        email_id:req.body.email_id,
        mobile_no:req.body.mobile_no,
        describe_mentoring_topic:req.body.discription,
        call_prefference:req.body.call_prefference,
        time_for_call:req.body.time_for_call,
        review_done:'false',
      })
      const mentor_data_record=mentor_request_record({
        user_id:req.session.user_detail[0]._id,
        mentor_request_id:mentor_data._id,
        mentor_request_status:"incomplete",
      })
      mentor_data.save();
      mentor_data_record.save();
      subject='Chat with Expert - '+ req.headers.host;
      text='Hello '+req.body.first_name+'\n\n Successfully Application is accepted we will contact you as early as.\n\n'+
      'then please contact us on given detail on our website.\n\n'+
      'Thanks for moving one step forward to improve our society!\n\n'+
      'The '+ req.headers.host +' team';
      user_fun.email_validation(req.body.email_id,subject,text);
      req.flash("message","Your Request is Successfully Accepted!");
      res.redirect('/')
  }
  else {
    req.flash("message","You have to login for this Feature!");
    res.redirect('/login');
  }

})

module.exports = router
