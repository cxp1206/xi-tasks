/** 任务状态
 * Created by caoxp on 16/10/11.
 */
'use strict'
const PREPARE = '任务准备执行';//执行前
const EXCUTING = '任务执行中';//执行中
const CANCLING = '任务取消';//取消
const FAILURE = '任务失败';//失败


exports.jobState = {
    state: {
        prepare: 1,
        excute: 2,
        cancle: 3,
        failure: 4
    },
    stateDes: {
        prepare: PREPARE,
        excute: EXCUTING,
        cancle: CANCLING,
        failure: FAILURE
    },
    getStateDes: function (code) {
       let stateKeys = Object.keys(this.state);
       let name = stateKeys.filter(key=>{
            return this.state[key] === code;
        })
        return this.stateDes[name];
    },
    getStateCode:function (key) {
        return this.state[key];
    }
}