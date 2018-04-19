/**
 * Created by gaos on 2016/9/8.
 */
var config = require("../config/config.js");
var redisDb = {};
var redis = require("redis");
var redisClient = null;

/**
 * 添加string类型的数据
 * @param key 键
 * @params value 值
 * @params expire (过期时间,单位秒;可为空，为空表示不过期)
 * @param callBack(err,result)
 */
redisDb.login = function(account, password, port, callback) {

  redisClient = redis.createClient(port, account, { auth_pass: password });

  redisClient.on("error", function(err) {
      console.log("Redis连接失败");
      redisClient.quit();
      callback.send(null, {
        code: 110,
        message: err
      });
    })
    .on('connect', function() {
      console.log('Redis连接成功.');
      req.session.logined = account;
      callback.send(null, {
        code: 200,
        message: "链接成功"
      });
    });
};


module.exports = redisDb;