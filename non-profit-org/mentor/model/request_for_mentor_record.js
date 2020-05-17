const mongoose=require('mongoose')


const request_for_mentor_record = new mongoose.Schema({
  user_id:{
    type: String,
    required: true,
  },
  mentor_request_id: {
    type: String,
    required: true
  },
  mentor_request_status:{
    type:String,
    required:true
  },

  createdAt: {
   type: Date,
   default: Date.now
 }
})


module.exports = mongoose.model('request_for_mentor_record',request_for_mentor_record )
