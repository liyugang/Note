/**
 * Created by super on 2016/4/19.
 */
var crypto = require('crypto');
var config = require('../config/config.js');
var Buffer = require("buffer").Buffer;
var MyPromise = require('bluebird');
var messageCode = require('../config/messageCode');

// 工具服务
var Util = {

  //response类型常量字符串
  ResponseInfo_Success: 'Success',
  ResponseInfo_Null: 'Null',
  ResponseInfo_Failed: 'Failed',
  ResponseInfo_InternetError: 'InternetError',
  ResponseInfo_UnknowError: 'UnknowError',
  ResponseInfo_IsLogin_No: 'NoLogin',
  /**
   * 设置返回信息的状态
   * @param sourceObj
   * @param typeStr
   * @returns {*}
   */
  messageFormat: function(sourceObj, message, typeStr) {
    var result = {};
    switch (typeStr) {
      case this.ResponseInfo_Success:
        result.data = sourceObj;
        result.code = messageCode.ErrorCode_Success;
        result.message = message ? message : messageCode.ErrorCode_Success_Message;
        break;
      case this.ResponseInfo_Null:
        result.code = messageCode.ErrorCode_Null;
        result.message = message ? message : messageCode.ErrorCode_Null_Message;
        break;
      case this.ResponseInfo_Failed:
        result.code = messageCode.ErrorCode_Failed;
        result.message = message ? message : messageCode.ErrorCode_Failed_Message;
      case this.ResponseInfo_IsLogin_No:
        result.code = messageCode.ErrorCode_IsLogin_No;
        result.message = message ? message : messageCode.ErrorCode_IsLogin_No_Meg;
        break;
      case this.ResponseInfo_InternetError:
        result.code = messageCode.ErrorCode_InternetError;
        result.message = message ? message : messageCode.ErrorCode_InternetError_Message;
        break;
      case this.ResponseInfo_UnknowError:
        result.code = messageCode.ErrorCode_UnknowError;
        result.message = message ? message : messageCode.ErrorCode_UnknowError_Message;
        break;
      default:
        result.data = sourceObj;
        result.code = messageCode.ErrorCode_Success;
        result.message = message ? message : messageCode.ErrorCode_Success_Message;
        break;
    }
    return result;
  },
  /**
   * base64编码
   */
  enbase64: function(text) {
    return new Buffer(text).toString('base64');
  },
  /**
   * base64解码
   */
  debase64: function(text) {
    return new Buffer(text, 'base64').toString();
  },
  /**
   * 设置时间格式
   * @param timeStr
   * @param formatTypeStr
   */
  setTimeFormat: function(timeStr, formatTypeStr) {
    var resultStr = "";
    if (timeStr === null || timeStr === '') {
      return resultStr;
    }
    var src = new Date(timeStr);
    switch (formatTypeStr) {
      case 'yyyy-MM-dd HH:mm:ss':
        //普通格式：2016-08-12 04:55:30
        resultStr = this.dateFormat(src, "yyyy-MM-dd HH:mm:ss");
        break;
      case 'yyyy-MM-dd':
        //2016-08-12
        resultStr = this.dateFormat(src, "yyyy-MM-dd");
        break;
      case 'HH:mm':
        //11:18
        resultStr = this.dateFormat(src, "HH:mm");
        break;
      case 'yyyyMMddHHmmss':
        //普通格式：2016-08-12 04:55:30
        resultStr = this.dateFormat(src, "yyyyMMddHHmmss");
        break;
      case 'yyyy.MM.dd':
        //普通格式：2016.08.12
        resultStr = this.dateFormat(src, "yyyy.MM.dd");
        break;
      case 'Today?yyyy-MM-dd HH:mm:ss':
        //动态格式分情况，今天：今天 04:55
        //今天前：2016-08-12 04:55
        if (src.toDateString() === new Date().toDateString()) {
          //今天
          var timePart = this.dateFormat(src, "HH:mm");
          resultStr = "今天 " + timePart;
        } else if (src < new Date()) {
          //之前
          resultStr = this.dateFormat(src, "yyyy-MM-dd HH:mm");
        }
        break;
      case 'TimeLine?yyyy/MM/dd HH:mm':
        //动态格式分情况，*分钟前，*小时前，*天前，超过一周显示具体时间 2017/5/28  18:43:00
        var srcTime = src.getTime();
        var nowSrc = new Date().getTime();
        var diffMins = Math.ceil((nowSrc - srcTime) / (1000 * 60)); //分钟数,向上取整
        var diffHours = Math.ceil((nowSrc - srcTime) / (1000 * 60 * 60)); //小时数,向上取整
        var diffDays = Math.ceil((nowSrc - srcTime) / (1000 * 60 * 60 * 24)); //天数,向上取整
        if (diffMins < 60) {
          resultStr = diffMins + "分钟前";
        } else if (diffHours < 24) {
          resultStr = diffHours + "小时前";
        } else if (diffDays < 7) {
          resultStr = diffDays + "天前";
        } else {
          resultStr = this.dateFormat(src, "yyyy/MM/dd HH:mm");
        }
        break;
      default:
        break;
    }
    return resultStr;
  },
  /**
   * 时间格式化
   * @param datetime
   * @param fmt
   * @returns {*}
   */
  tsToDateFormat: function(nS) {
    return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ');
  },
  /**
   * 时间格式化
   * @param datetime
   * @param fmt
   * @returns {*}
   */
  dateFormat: function(datetime, fmt) {
    var o = {
      "M+": datetime.getMonth() + 1, //月份
      "d+": datetime.getDate(), //日
      "H+": datetime.getHours(), //小时
      "m+": datetime.getMinutes(), //分
      "s+": datetime.getSeconds(), //秒
      "q+": Math.floor((datetime.getMonth() + 3) / 3), //季度
      "S": datetime.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (datetime.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
  },
  /**
   * 字符串转为时间类型
   * @param str,格式为 yyyyMMddHHmmss
   */
  strConvertToDateTime: function(timeStr) {
    var date = null;
    //timeStr中只能出现数字
    var reg = /^[0-9]+$/;
    var res = reg.test(timeStr);
    if (res === true && timeStr.length >= 14) {
      var year = timeStr.substr(0, 4);
      var month = timeStr.substr(4, 2) - 1;
      var day = timeStr.substr(6, 2);
      var hour = timeStr.substr(8, 2);
      var minute = timeStr.substr(10, 2);
      var second = timeStr.substr(12, 2);
      date = new Date();
      date.setFullYear(year, month, day);
      date.setHours(hour, minute, second, 0);
    }
    return date;
  },
  /**
   * 数组去重，去掉空字符串的项
   * @param sourceArray
   * @returns {*}
   */
  arrayUnique: function(sourceArray) {
    if (sourceArray === null || sourceArray.length === 0) {
      return [];
    }
    var n = [sourceArray[0]]; //结果数组
    for (var i = 1; i < sourceArray.length; i++) //从第二项开始遍历
    {
      //去掉空字符串的项
      if (sourceArray[i] === "") continue;
      //如果当前数组的第i项在当前数组中第一次出现的位置不是i，
      //那么表示第i项是重复的，忽略掉。否则存入结果数组
      if (sourceArray.indexOf(sourceArray[i]) === i) n.push(sourceArray[i]);
    }
    return n;
  },
  /**
   * 对象数组按照指定属性快速排序
   * @param arr Array 对象数组
   * @param key string 用于排序的属性
   * @param dir asc升序、desc降序
   */
  sortObj: function(arr, key, dir) {
    arr.sort(function(a, b) {
      dir = dir || 'asc';
      if (dir === 'asc') {
        return a[key] - b[key];
      } else {
        return b[key] - a[key];
      }
    });
    return arr;
  },
  /**
   * 处理手机号，中间用*表示
   * @param pho
   * @returns {string}
   */
  phoStr: function(pho) {
    var resultStr = '';
    if (pho === null || pho === '') {
      return resultStr;
    }
    resultStr = pho.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
    return resultStr;
  },
  /**
   * 格式化json，保证JSON.parse方法能够正常工作
   * @param str
   */
  formatJsonStr: function(str) {
    //把NaN全部替换成0
    str = str.replace(/NaN/g, '0');
    return str;
  },
  /**
   * 格式化json，保证JSON.parse方法能够正常工作
   * @param str
   */
  parseParamsUrl: function(params) {
    var params_url = ['', '', ''];
    params_url[0] = "/" + (params['code'] ? params['code'] : '0');
    params_url[1] = "/" + (params['page'] ? params['page'] : 0);
    params_url[2] = "/" + (params['count'] ? params['count'] : 10);
    params_url = params_url.join('');
    return params_url;
  },
  /**
   *  返回数据格式化
   * @param str
   */
  formatBackSuccessWithCode: function(object) {
    return {
      message: object,
      responCode: errorCode.ErrorCode_Success,
      responMessage: errorCode.ErrorCode_Success_Message,
      code: '200',
      type: 'SUCCESS'
    };
  },
  /**
   *  返回数据格式化
   * @param str
   */
  formatBackErr: function(object) {
    return {
      message: object,
      responCode: errorCode.ErrorCode_Failed,
      responMessage: errorCode.ErrorCode_Failed_Message
    };
  },
  /**
   * 获取客户端IP
   * @param req
   * @returns {*|string}
   */
  getClientIP: function(req) {
    return req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;
  },
  /**
   * 获取当前用户编号
   * @param req
   * @returns {*|string}
   */
  getCurrentUserId: function(req) {
    return req.headers.currentuserid || (req.session.passport ? req.session.passport.user : null);
  },
  /**
   * 生产融云签名
   */
  creatSignature: function(Nonce, Timestamp, RY_APP_SECRET) {
    return this.sha1Encryption(RY_APP_SECRET + Nonce + Timestamp);
  },
  /**
   * 使用sha1进行加密
   * @param str
   */
  sha1Encryption: function(str) {
    var content = str;
    var sha1 = crypto.createHash('sha1');
    sha1.update(content);
    return sha1.digest('hex');
  },
  /**
   * 生产随机数
   */
  rangeRandom: function(rangeNum) {
    var num = Math.random(); //Math.random()：得到一个0到1之间的随机数
    num = Math.ceil(num * rangeNum); //num*80的取值范围在0~80之间,使用向上取整就可以得到一个1~80的随机数
    //num就是你要的随机数,如果你希望个位数前加0,那么这样:
    return num;
  },
  /**
   * 生产id
   */
  producePrimaryKey: function(rangeNum) {
    var primaryKey = parseInt(Date.parse(new Date()) + this.produceNum(3, this.rangeRandom(1000)));
    return primaryKey;
  },
  /**
   * 生产id
   */
  produceNum: function(Bits, num) {
    var bitsNum = '';
    num = String(num);
    for (var i = 0; i < Bits; i++) {
      if (num[i]) {
        bitsNum = bitsNum + num[i];
      } else {
        bitsNum = bitsNum + '0';
      }
    }
    return bitsNum;
  },
  /**
   * obj按照顺序拼接字符串
   */
  ObjToString: function(obj, rule) {
    var rules = rule.split(':');
    var paramsList = [];
    rules.forEach(function(item, index) {
      paramsList.push(obj[item]);
    });
    return paramsList.join('/');
  },
  /**
   * 判断是否为手机
   */
  checkMobile: function(agent) {
    var flag = false;
    var keywords = ["android", "iphone", "ipod", "ipad", "windows phone", "mqqbrowser"];
    //排除 Windows 桌面系统  
    if (!(agent.indexOf("windows nt") > -1) || (agent.indexOf("windows nt") > -1 && agent.indexOf("compatible; msie 9.0;") > -1)) {
      //排除苹果桌面系统  
      if (!(agent.indexOf("windows nt") > -1) && !(agent.indexOf("macintosh") > -1)) {
        for (var i = 0; i < keywords.length - 1; i++) {
          if (agent.indexOf(keywords[i]) > -1) {
            flag = true;
            break;
          }
        }
      }
    }
    return flag;
  },
  /**
   * 根据list中元素的指定属性，设置名词信息，
   * 注意：这里的list是已经排好的顺序，只是没有名次
   * 注意：该方法不适用分页数据，主要是第二页后的数据是不支持的，分页时，需要通过sql获取真实名次
   * @param list
   * @param basedAttr
   * @returns {*}
   */
  setListSque: function(list, basedAttr) {
    if (list.length === 0) {
      return list;
    }
    var position = 1; //排名：从1开始
    for (var i = 0; i < list.length; i++) {
      if (i === 0) {
        list[i].position = 1;
        position++;
        continue;
      }
      if (list[i][basedAttr] === list[i - 1][basedAttr]) {
        list[i].position = list[i - 1].position;
      } else {
        list[i].position = position;
      }
      position++;
    }
    return list;
  }
};

module.exports = Util;