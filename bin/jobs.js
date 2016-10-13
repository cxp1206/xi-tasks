#!/usr/bin/env node

'use strict'

/**
 * Created by caoxp on 16/10/12.
 */



var program = require('commander');
var packages = require('../package.json');
var manager = require('../jobs/jobLib');



function addJob(name) {
    
    let addj = new manager();
    addj.addJob(name);
}
function startJob(name) {
    let start = new manager();
    start.excuteJob(name);
}
function cancelJob(name) {
     let m = new manager();
    m.cancleJob(name);
}
program
    .allowUnknownOption()
    .version(packages.version)
    .option('-a|add <jobname>','添加任务',addJob)
    .option('-s|start <jobname>','开始运行任务',startJob)
    .option('-c|cancle <jobname>','取消任务',cancelJob)

program.parse(process.argv);


