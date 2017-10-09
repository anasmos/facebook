let mongoose = require('mongoose');

// Article Schema
let articleSchema = mongoose.Schema({
  like:{
    type:Number,
    required: false
  },
  author:{
    type: String,
    required: true
  },
  userid:{
    type: String,
    required: true
  },
  body:{
    type: String,
    required: true
  }
});

let Article = module.exports = mongoose.model('Article', articleSchema);
