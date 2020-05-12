const mongoose=require('mongoose')


const volunteer_registration = new mongoose.Schema({
  user_id:{
    type: String,
    required: true,
    unique:true,
  },
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true

  },
  email_id: {
    type: String,
    required: true,
  },
  current_proffession: {
    type: String,
    required: true
  },
  current_address: {
    type: String,
    required: true
  },

  current_country: {
    type: String,
    required: true
  },
  current_state: {
    type: String,
    required: true
  },
  current_city: {
    type: String,
    required: true
  },
  cuurent_pincode: {
    type: String,
    required: true
  },
  linkdin_url: {
    type: String,
    required: true
  },
  resume_filename:{
    type:String,
    required:true,
  },
  description_for_join: {
    type: String,
    required: true
  },
  review_done:{
    type:String,
    required:true,
  },
  createdAt: {
   type: Date,
   default: Date.now
 }
})


module.exports = mongoose.model('volunteer_registration', volunteer_registration)
