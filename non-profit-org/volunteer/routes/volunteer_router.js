const express = require('express')
var nodemailer = require('nodemailer');
const router = express.Router()
const app=express()
const volunteer_registration = require('./../model/volunteer_model')
const volunteer_record = require('./../model/volunteer_record')
const upload=require('express-fileupload')
var crypto = require("crypto");
const user_fun=require('../../user/model/user_function')




router.get('/register_for_volunteer',async (req,res) =>{
  var user_data=[];
  var user_access="";
  if (req.session.user_detail) {
    user_data=req.session.user_detail;
    user_access=req.session.user_detail[0].user_access;
    var message_data=req.flash("message");
    res.render('user_template/volunteer_form',
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

router.post('/registering_for_volunteer',async (req,res) =>{
  if (req.session.user_detail) {
    volunteer_registration.find({user_id:req.session.user_detail[0]._id },
      function(err, response){
        if (response.length!=0) {
          req.flash("message","You Already Apply to become volunteer,we will update you via email.. Stillyou have any problem then contact us!");
          res.redirect('/register_for_volunteer')
        }
        else
        {
          try
          {
            // crypto.randomBytes(20, function(err, buf) {
            //   var token = buf.toString('hex');
            //   if (req.files) {
            //     console.log(req.files);
            //     var file=req.files.resume_file;
            //     console.log(file.name);
            //     file.mv("./volunteer/images/volunteer_resume/"+token+file.name, function(error){
            //         if(error){
            //             console.log("Couldn't upload the game file");
            //             console.log(error);
            //         }else{
                      //  console.log("Game file succesfully uploaded.");
              const volunteer_data=new volunteer_registration({
                user_id:req.session.user_detail[0]._id,
                first_name:req.body.first_name,
                last_name:req.body.last_name,
                email_id:req.body.email_d,
                current_proffession:req.body.profession,
                current_address:req.body.address,
                current_country:"India",
                current_state:req.body.current_state,
                current_city:req.body.current_city,
                current_pincode:req.body.pincode,
                mobile_no:req.body.mobile_no,
                linkdin_url:req.body.url,
            //    resume_filename:token+file.name,
                description_for_join:req.body.description,
                review_done:'false',
              })
              const volunteer_record_data=volunteer_record({
                user_id:req.session.user_detail[0]._id,
                volunteer_id:volunteer_data._id,
                application_status:"None",
                volunteer_position:"untitled",
              })
              volunteer_data.save();
              volunteer_record_data.save();
              subject='Volunteer Registration- '+ req.headers.host;
              text='Hello '+req.body.first_name+'\n\n Your Registartion done succesfully to become a part of our organization.'+
              '\n So according to our procedure we will first go through your detail and next we will setup one interview for this.\n'+
              'We will send you further instruction via email id. If you have any questions or doubts or anything other \n'+
              'then please contact us on given detail on our website.\n\n'+
              'Thanks for moving one step forward to improve our society!\n\n'+
              'The '+ req.headers.host +' team';
               user_fun.email_validation(req.body.email_d,subject,text);
              req.flash("message","Your Registration is Successfully Accepted!");
              res.redirect('/')

          }
          catch (e) {
            req.flash("message","Something is going wrong please refresh!");
            res.redirect('/register_for_volunteer')
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
