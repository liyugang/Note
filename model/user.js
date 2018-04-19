/*
Schema for user.
用户
*/

var _ = require('underscore');
var moment = require('moment');
var mongoose = require('mongoose');

// 活动主表
var UserSchema = mongoose.Schema({
  email: { //Used for login email
    type: String,
    required: true,
  },
  username: { //Used for login username
    type: String,
  },
  password: { //Used for login password
    type: String,
    required: true
  },
  sex: {
    type: String,
  },
  address: {
    type: String,
  },
  accessToken: {
    type: String
  }, // Used for Remember Me
  people_name: {
    type: String,
  },
  grouplist: [{ //类别
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group'
  }],
  //- 结束迁移部分
  lastLogin: Date
});


module.exports = mongoose.model('User', UserSchema);