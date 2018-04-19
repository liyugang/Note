/**
 * Created by super on 2016/5/19.
 */
module.exports = {

    // 
    service_port: '7777',
    // redis 配置信息
    redis_host: '192.168.1.70',
    redis_port: '6384',
    redis_pass: '',
    // 存储在redis过期时间配置
    redis_expire: 60 * 60 * 24,
    // session存储在redis中的头
    redis_prefix: 'oneday:',
    // cookies中的失效时间
    cookies_expire: 30 * 24 * 60 * 60,
    cookies_secret: 'oneday',
    mongodb_uri: 'mongodb://localhost/oneDay',

};