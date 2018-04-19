var express = require('express');
var router = express.Router();
var redisDb = {};
var redis = require("redis");
var user = require("../model/user");
var utilService = require("../service/utilService");


// 获取个人信息详情
router.get('/:userId', function(req, res) {
  var userId = req.params.userId;
  user.findOne({
      _id: userId
    })
    .populate({
      path: 'grouplist',
      select: '_id name'
    })
    .exec(function(err, result) {
      res.send(utilService.messageFormat(result, null, 'Success'));
    });
});

// 更新个人信息详情
router.post('/:userId', function(req, res) {
  var userId = req.params.userId;
  var content = req.body.content;
  user.findOne({
    _id: userId
  }, function(err, data) {
    res.send(data);
  });
});


module.exports = router;