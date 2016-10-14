/** 处理任务,及调度
 * Created by caoxp on 16/10/11.
 */

'use strict'
var fs = require('fs');
var path = require('path');
var loader = require('../core/loader');
var co = require('co');

 class JobManager{
     /**
      * 初始函数,
      * */
     constructor(){
         new loader(this);
         this.rootPath = path.join(__dirname,'../');

     }
     /**
      * @method addJob 添加任务,此时没有对任务进行启动,只是将任务信息进行存储
      * @param {string|object} config 如果为字符串,需要和configs中的名称一致,
      * 如果找不到,会默认使用defaultJobDes.
      * 如果为对象,则结构与defaultJobDes一致.
      * */
     addJob(config){
         let configName='',data='';
         let defaultData = require('../configs/defaultJobDes').defaultJobDes;
         let dinfo = this.libs['debugInfo'],derror = this.libs['debugError'];
         if(!config){
             dinfo('没有输入任务名称,请输入');
             return;
         }
         if(typeof config ==='string'){
             configName = config;
             let fsPath = path.join(__dirname,'../configs/',configName+'.js');
             let isExit=true;

             try{
                 fs.accessSync(fsPath) ;
                 data = Object.assign({},defaultData,require(fsPath)[configName]);
             }catch(e){
                 isExit = false;
                 data = defaultData;
             }
             //加载任务信息
             if(!data){
                 //如果没有找到,则重新加载默认的任务信息
                 data=require('../configs/defaultJobDes').defaultJobDes;
             }
         }else if(typeof config === 'object'){//直接传入任务描述
             data = Object.assign({},defaultData,config);
         }
         //将任务添加到redis中存储
         this._saveIntoRedis(data);
         
     }
     _saveIntoRedis(data){
         let self = this,client = this.redisClient;
         let dinfo = this.libs['debugInfo'],derror = this.libs['debugError'];
         co(function *() {
             console.log(data);
             let name = data.name||'jobs:name';
            yield client.rpush('jobs:lists',name);//将任务压入list中
          let m = client.multi();//事务处理
             for(var a in data){
                 client.hset('jobs:'+name,a,data[a]);//将任务的描述信息存储到hash结构中,field存储属性,
             }
              m.exec(function (err, msg) {
                  if(err){
                      derror('[%s]:job is add failure.',name);
                      throw err;
                  }
                  dinfo('[%s]:job is add sucessful.',name);
              })
         }).catch(er=>{
             derror('[%s]:job is add failure.',name);
         })

     }

     /**
      * 启动任务,
      * 传入参数为任务名称和执行根目录
      * */
     excuteJob(name,rootPath){
         let self = this,client = this.redisClient;
         let dinfo = this.libs['debugInfo'],derror = this.libs['debugError'];
         if(!rootPath){
             rootPath=this.rootPath;
         }
         co(function *() {
             //获取任务信息
             let jobModelPath = yield client.hget('jobs:'+name,'module'),
                 jobRule = yield client.hget('jobs:'+name,'rule'),
                 state = yield client.hget('jobs:'+name,'state');
             //将任务信息转化为schedule
             if(state == 2){
                 //任务执行中
                 dinfo('[%s]:schedule is running',name);
                 return ;
             }
             if(!jobModelPath){
                 dinfo('[%s]:schedule is not config module name',name);
                 return ;
             }
             console.log(__dirname);
             jobModelPath = path.join(rootPath,jobModelPath);
              let jobModel = require(jobModelPath);
            let jobs = self.libs['node-schedule'].scheduleJob(name,jobRule,function () {
                 dinfo('[%s]:schedule is running',name);
                 //执行任务中的相应的处理逻辑
                client.hset('jobs:'+name,'state',2).then();
                jobModel.start(function () {
                     client.hset('jobs:'+name,'lastRunning',new Date()).then();
                     client.hset('jobs:'+name,'state',1).then();
                });
             });
         }).catch(e=>{
              client.hset('jobs:'+name,'state',4).then();
             derror('执行任务时报错');
             derror(e);
         })
         
     }
     cancleJob(name){
        let job = this.libs['node-schedule'].scheduledJobs[name];
         let self = this,client = this.redisClient;
         if(job){
              client.hset('jobs:'+name,'state',3).then();
             job.cancle();
         }

     }
 }

module.exports = JobManager;