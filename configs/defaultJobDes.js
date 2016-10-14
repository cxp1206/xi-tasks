/** 默认的任务描述信息
 * 为了方便,导出的对象名称与文件名称一致,否则会找不到信息
 * Created by caoxp on 16/10/11.
 */

exports.defaultJobDes = {
    name:'schedule:job:name',//任务名称
    module:'schedule:job:module',//任务执行的相对于程序根目录的文件夹或文件名称,每个文件夹必须有一个index文件,对外输出start方法
    state:1,//任务状态
    createdAt:new Date,
    lastRunning:new Date,
    rule:'schedule:job:rule',//任务运行规则,格式为cron
    description:'一个任务',//任务描述
    
}