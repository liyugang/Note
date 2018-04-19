/*
Schema for Document.
用户
*/

var _ = require('underscore');
var moment = require('moment');
var mongoose = require('mongoose');

// 活动主表
var DocumentSchema = mongoose.Schema({
  title: { //
    type: String,
  },
  size: { //Used for login size
    type: Number,
  },
  content: { //Used for login content
    type: String,
  },
  password: { //Used for login password
    type: String,
  },
  pic: {
    type: String,
  },
  url: {
    type: String,
  },
  isrecycling: {
    type: Boolean,
    default: false
  },
  isdelete: {
    type: Boolean,
    default: false
  },
  group: { //类别
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group'
  },
  userId: { //
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  //- 结束迁移部分
  crtTime: Date
});


module.exports = mongoose.model('Document', DocumentSchema);