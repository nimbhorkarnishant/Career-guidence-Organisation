const mongoose=require('mongoose')

const user_password_reset = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,

  },

  old_password: {
    type: String,
    required: true,

  },

  password_token: {
    type: String,
    required: true,
    unique:true

  },
  password_reset_status:{
    type: String,
    required: true
  },

  token_expired_time: {
    type: Date,
    required: true,
  },

  createdAt: {
   type: Date,
   default: Date.now
 }
})
module.exports = mongoose.model('user_password_reset', user_password_reset)
