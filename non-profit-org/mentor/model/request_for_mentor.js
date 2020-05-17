const mongoose=require('mongoose')


const mentor_request = new mongoose.Schema({
  user_id:{
    type: String,
    required: true,
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

  mobile_no: {
    type: String,
    required: true
  },
  describe_mentoring_topic: {
    type: String,
    required: true
  },
  call_prefference: {
    type: String,
    required: true
  },
  time_for_call:{
    type:String,
    required:true,
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


module.exports = mongoose.model('mentor_request', mentor_request)
