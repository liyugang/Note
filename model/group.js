/*
Schema for Group.
用户
*/

var _ = require('underscore');
var moment = require('moment');
var mongoose = require('mongoose');

// 活动主表
var GroupSchema = mongoose.Schema({
  name: { //
    type: String,
  },
  password: { //Used for login password
    type: String,
  },
  userId: { //
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  //- 结束迁移部分
  lastLogin: Date,
});


module.exports = mongoose.model('Group', GroupSchema);