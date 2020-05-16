const mongoose=require('mongoose')


const club_record = new mongoose.Schema({
  user_id:{
    type: String,
    required: true,
  },
  club_id: {
    type: String,
    required: true
  },
  club_request_status:{
    type:String,
    required:true
  },

  createdAt: {
   type: Date,
   default: Date.now
 }
})


module.exports = mongoose.model('club_record',club_record )
