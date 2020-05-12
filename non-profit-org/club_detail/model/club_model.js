const mongoose=require('mongoose')


const club_registration = new mongoose.Schema({
  user_id:{
    type: String,
    required: true,
    unique:true,
  },
  school_name: {
    type: String,
    required: true
  },
  school_email_id: {
    type: String,
    required: true,
  },
  school_address: {
    type: String,
    required: true
  },
  school_country: {
    type: String,
    required: true
  },
  school_state: {
    type: String,
    required: true
  },
  school_city: {
    type: String,
    required: true
  },
  school_website_url: {
    type: String,
  },
  school_area_pin_code: {
    type: String,
    required: true
  },
  school_cordinator_name:{
    type: String,
    required: true
  },
  school_cordinator_email_id: {
    type: String,
    required: true
  },
  school_cordinator_phone_no: {
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


module.exports = mongoose.model('club_registration',club_registration )
