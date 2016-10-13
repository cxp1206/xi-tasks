/** 公用模块加载器
 * Created by caoxp on 16/10/12.
 */
'use strict'

module.exports = function (context) {
    //加载公用lib
    context.libs={
        'node-schedule':require('node-schedule'),
        'ioredis':require('ioredis'),
        'config':require('../config'),
        'debugInfo':require('debug')('task:info'),
        'debugError':require('debug')('task:error')
        
    }
    let config = context.libs['config'];
    let redis = new context.libs['ioredis']({
        port:config.redis.port,
        host:config.redis.host,
        password:config.redis.password,
        db:config.redis.db
    });
    context.redisClient = redis;
}
