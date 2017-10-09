const mongoose = require('mongoose');

// comment Schema
const CommentSchema = mongoose.Schema({
  postid:{
    type: String,
    required: true
  },
  name:{
    type: String,
    required: true
  },
  userid:{
    type:String,
    required:true
  },
  comment:{
    type: String,
    required: true
  }
  });

const Comments = module.exports = mongoose.model('Comments', CommentSchema);
