const mongoose=require('mongoose')


const volunteer_record = new mongoose.Schema({
  user_id:{
    type: String,
    required: true,
  },
  volunteer_id: {
    type: String,
    required: true
  },
  application_status:{
    type:String,
    required:true,
  },
  volunteer_position:{
    type:String,
    required:true,
  },
  createdAt: {
   type: Date,
   default: Date.now
 }
})


module.exports = mongoose.model('volunteer_record', volunteer_record)
