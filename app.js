var express = require('express');
var app = express();
var groupRoute = require('./routes/group');
var documentRoute = require('./routes/document');
var userRoute = require('./routes/user');
var config = require('./config/config');
var utilService = require('./service/utilService');
var messageCode = require('./config/messageCode');
var User = require('./model/user');
var Group = require('./model/group');
var path = require('path');
var colors = require('colors');
var mongoose = require('mongoose');
var flash = require('connect-flash');
var bodyParser = require('body-parser');
var session = require('express-session');
var expressValidator = require('express-validator');
var RedisStore = require('connect-redis')(session);
var cookieParser = require('cookie-parser');
var util = require('util');
var passport = require('passport'),
    localStrategy = require('passport-local').Strategy;
const cheerio = require('cheerio')
var https = require('https');
var url = "https://ke.qq.com/classroom/index.html#course_id=198477&term_id=100235260&ch_id=327937&vch_id=30&section_id=69&task_id=1197398227617613";

// 建立mongodb连接
mongoose.connect(config.mongodb_uri);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.on('open', function() {
    console.log(colors.yellow('Connected to Mongoose on ' + config.mongodb_uri));
});

/**设置cookies*/
app.use(cookieParser());
app.use(flash()); // use flash function

// 设置请求内容容量
app.use(bodyParser.json({
    limit: '10mb'
}));
app.use(bodyParser.urlencoded({
    limit: '10mb',
    extended: true
}));
app.use(expressValidator());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')));

/**设置session*/
app.use(session({
    secret: config.cookies_secret, // 加密方式
    name: config.cookies_secret, // 存储在cookies中的名称
    cookie: {
        maxAge: config.cookies_expire
    }, //设置maxAge是86400000ms，即24h后session和相应的cookie失效过期
    resave: false,
    saveUninitialized: true,
    store: new RedisStore({
        host: config.redis_host,
        port: config.redis_port,
        pass: config.redis_pass,
        "ttl": config.redis_expire, //Session的有效期为1天
        prefix: config.redis_prefix, //自定义存储sessionId的前缀
    }),
}));
app.use(passport.initialize());
app.use(passport.session());

//  user的_id放在session中
passport.serializeUser(function(user, done) {
    done(null, user._id);
});

//  user对象的反序列化
passport.deserializeUser(function(_id, done) {
    User.findOne({ '_id': _id }, function(err, user) {
        done(null, user);
    });
});


passport.use('signup', new localStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true //此处为true，下面函数的参数才能有req
}, function(req, email, password, done) {
    req.checkBody('email', '您输入的email无效').notEmpty().isEmail();
    req.checkBody('password', "您输入了无效密码").notEmpty().isLength({ min: 4 });
    var errors = req.validationErrors();
    if (errors) {
        var messages = [];
        errors.forEach(function(error) {
            messages.push(error.msg);
        });
        return done(null, false, req.flash('error', messages));
    }
    User.findOne({ 'email': email }, function(err, user) {
        if (err) {
            return done(err);
        }
        if (user) {
            return done(null, false, "此邮件已经被注册");
        }
        var group = new Group();
        group.name = "我的文件夹";

        var newUser = new User();
        newUser.email = email;
        newUser.password = password;
        newUser.grouplist = [group._id];

        newUser.save(function(err, result) {
            if (err) {
                return done(err);
            }
            return done(null, false, "注册成功!");
        });
    });
}));



passport.use('login', new localStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true //此处为true，下面函数的参数才能有req
}, function(req, email, password, done) {
    req.checkBody('email', '您输入的email无效').notEmpty();
    req.checkBody('password', "您输入了无效密码").notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        var messages = [];
        errors.forEach(function(error) {
            messages.push(error.msg);
        });
        return done(null, false, req.flash('error', messages));
    }
    User.findOne({ 'email': email }, function(err, user) {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false, "用户名错误!");
        }
        if (user.password != password) {
            return done(null, false, "密码错误!");
        }
        return done(null, user, "登录成功!");
    });

}));

app.post('/signup', function(req, res, next) {
    passport.authenticate('signup', function(err, user, info) {
        return res.send(utilService.messageFormat(user, info, 'Success'));
    })(req, res);
});

app.post('/login', function(req, res, next) {
    passport.authenticate('login', function(err, user, info) {
        if (user) {
            req.logIn(user, function(err) {
                if (err) return next(err);
                return res.send(utilService.messageFormat(user, null, 'Success'));
            });
        } else {
            return res.send(utilService.messageFormat(null, info, 'Failed'));
        }
    })(req, res);
});

app.post('/logout', function(req, res, next) {
    req.logout();
    res.send(utilService.messageFormat("退出登录！", null, 'Success'));
});

//将req.isAuthenticated()封装成中间件
var isAuthenticated = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.send(utilService.messageFormat(null, null, 'NoLogin'));
};

app.use("/group", isAuthenticated, groupRoute);
app.use("/document", isAuthenticated, documentRoute);
app.use("/user", isAuthenticated, userRoute);


app.get("/signup", function(req, res) {
    res.render('signup');
});
app.get("/vue", function(req, res) {
    res.render('vue');
});
app.use(function(req, res, next) {
    var logined = req.isAuthenticated();
    if (!logined && (req.method === "GET")) {
        res.render('login');
    } else {
        res.render('manager', { userId: req.session.passport.user });
    }
});

// Handle 404
app.use(function(req, res) {
    //console.log('message in 404');
    res.status(404);
    res.send('404');
});

// Handle 500
app.use(function(error, req, res, next) {
    // throw error;
    console.log(util.inspect(error, {
        depth: null
    }));
    res.status(500);
    res.send('500');
});


// https.get(url, function(res) {
//     var html = '';
//     // 获取页面数据
//     res.on('data', function(data) {
//         html += data;
//     });
//     // 数据获取结束
//     res.on('end', function() {
//         // 通过过滤页面信息获取实际需求的轮播图信息
//         var slideListData = filterSlideList(html);
//         // 打印信息
//         printInfo(slideListData);
//     });
// }).on('error', function() {
//     console.log('获取数据出错！');
// });

// /* 过滤页面信息 */
// function filterSlideList(html) {
//     if (html) {
//         // 沿用JQuery风格，定义$
//         var $ = cheerio.load(html);
//         // 根据id获取轮播图列表信息
//         var slideList = $('#foucsSlideList');
//         // 轮播图数据
//         var slideListData = [];
//         console.log(html)
//             /* 轮播图列表信息遍历 */
//         slideList.find('li').each(function(item) {

//             var pic = $(this);
//             // 找到a标签并获取href属性
//             var pic_href = pic.find('a').attr('href');
//             // 找到a标签的子标签img并获取_src
//             var pic_src = pic.find('a').children('img').attr('_src');
//             // 找到a标签的子标签img并获取alt
//             var pic_message = pic.find('a').children('img').attr('alt');
//             // 向数组插入数据
//             slideListData.push({
//                 pic_href: pic_href,
//                 pic_message: pic_message,
//                 pic_src: pic_src
//             });
//         });
//         // 返回轮播图列表信息
//         return slideListData;
//     } else {
//         console.log('无数据传入！');
//     }
// }

// /* 打印信息 */
// function printInfo(slideListData) {
//     // 计数
//     var count = 0;
//     // 遍历信息列表
//     slideListData.forEach(function(item) {
//         // 获取图片
//         var pic_src = item.pic_src;
//         // 获取图片对应的链接地址
//         var pic_href = item.pic_href;
//         // 获取图片信息
//         var pic_message = item.pic_message;
//         // 打印信息
//         console.log('第' + (++count) + '个轮播图');
//         console.log(pic_message);
//         console.log(pic_href);
//         console.log(pic_src);
//         console.log('\n');
//     });
// }




// 捕获可以让系统崩溃的错误，避免进程反复重启
process.on('uncaughtException', function(err) {
    err.name = "UncaughtExceptionError";
    console.log('Caught exception: ' + err);
});

//监听端口
app.listen(config.service_port, function() {
    console.log("service start on " + config.service_port + "...");
});
module.exports = app;