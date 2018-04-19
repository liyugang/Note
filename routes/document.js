var express = require('express');
var moment = require('moment');
var router = express.Router();
var redisDb = {};
var redis = require("redis");
var document = require("../model/document");
var utilService = require("../service/utilService");

// 创建文档
router.post('/createAndUpdate', function(req, res) {
  var docId = req.body.docId;
  console.log('docId---',docId);
  if (docId) {
    document.findByIdAndUpdate(docId, req.body, function(err, data) {
      res.send(utilService.messageFormat(data, null, 'Success'));
    });
  } else {
    req.body.crtTime = new Date();
    document.create(req.body, function(err, data) {
      res.send(utilService.messageFormat(data, null, 'Success'));
    });
  }
});

// 根据分组获取文档列表
router.get('/list/:group/:page/:count', function(req, res) {
  var group = req.params.group;
  var userId = req.session.passport.user;
  document.find({
    group: group,
    userId: userId
  }).lean().exec(function(err, data) {
    data.forEach(function(item, index) {
      data[index].crtTime = moment(item.crtTime).format("YYYY-MM-DD HH:mm:ss");
    });
    console.log(data);
    res.send(utilService.messageFormat(data, null, 'Success'));
  });
});

// 获取文档详情
router.get('/:documentId', function(req, res) {
  var documentId = req.params.documentId;
  document.findOne({
    _id: documentId
  }, function(err, data) {
    res.send(utilService.messageFormat(data, null, 'Success'));
  });
});

// 删除文档
router.post('/delete/:documentId', function(req, res) {
  var documentId = req.params.documentId;
  document.remove({
    _id: documentId
  }, function(err, data) {
    res.send(utilService.messageFormat(data, null, 'Success'));
  });
});

// 更新文档
router.post('/:documentId', function(req, res) {
  var documentId = req.params.documentId;
  document.update({
    _id: documentId
  }, function(err, data) {
    res.send(utilService.messageFormat(data, null, 'Success'));
  });
});


module.exports = router;