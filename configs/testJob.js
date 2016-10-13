/**
 * Created by caoxp on 16/10/12.
 */

exports.testJob = {
    name:'testJob',//任务名称
    module:'test',//文件夹名称,在jobs文件夹中.每个文件夹必须有一个index文件,对外输出start方法
    state:1,//任务状态
    createdAt:new Date,
    rule:'* * * * * *',//1秒执行一次
    description:'一个测试任务'//任务描述
}