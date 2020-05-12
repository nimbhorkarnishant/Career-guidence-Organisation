const mongoose=require('mongoose')


const user_registration = new mongoose.Schema({
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
    unique: true
  },
  user_access:{
    type:String,
    required:true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
   type: Date,
   default: Date.now
 }
})


module.exports = mongoose.model('User_auth', user_registration)
