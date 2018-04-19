var express = require('express');
var MyPromise = require('bluebird');
var router = express.Router();
var redisDb = {};
var redis = require("redis");
var group = require("../model/group");
var user = require("../model/user");
var utilService = require("../service/utilService");

// 创建分组
router.post('/create', function(req, res) {
  var name = req.body.name;
  var userId = req.session.passport.user;
  group.create({
    name: name,
    userId: userId,
  }, function(err, groupData) {
    if (err) {
      res.send(utilService.messageFormat(err, null, 'Success'));
    } else {
      user.findOne({
        _id: userId
      }, function(err, userData) {
        var grouplist = userData.grouplist;
        grouplist.push(groupData._id);
        user.findByIdAndUpdate(userId, {
          grouplist: grouplist,
        }, function(err, data) {
          res.send(utilService.messageFormat(groupData, null, 'Success'));
        });
      });
    }
  });
});


function updateUser(req) {
  var userId = req.session.passport.user;
  group.create({
    name: name,
    userId: userId,
  }, function(err, data) {
    console.log('data+++', err, data);
    res.send(utilService.messageFormat(data, null, 'Success'));
  });
}

// 获取分组列表
router.get('/list/:userId/:page/:count', function(req, res) {
  var userId = req.params.userId;
  group.find({
    userId: userId
  }, function(err, data) {
    res.send(utilService.messageFormat(data, null, 'Success'));
  });
});


// 获取分组详情
router.get('/:groupId', function(req, res) {
  var groupId = req.params.groupId;
  group.findOne({
    _id: groupId
  }, function(err, data) {
    res.send(utilService.messageFormat(data, null, 'Success'));
  });
});

// 删除分组
router.post('/delete/:groupId', function(req, res) {
  var groupId = req.params.groupId;
  group.remove({
    _id: groupId
  }, function(err, data) {
    res.send(utilService.messageFormat(data, null, 'Success'));
  });
});

// 更新分组
router.post('/update/:groupId', function(req, res) {
  var groupId = req.params.groupId;
  var name = req.body.name;
  group.findByIdAndUpdate(groupId, {
    name: name
  }, function(err, data) {
    res.send(utilService.messageFormat(data, null, 'Success'));
  });
});

module.exports = router;