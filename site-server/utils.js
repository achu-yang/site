// 将md转化为html的js包
const { rejects } = require('assert');
var {marked} = require('marked');
fs = require('fs');
//导入模块
const mysql = require('mysql')
//建立与mysql数据库的联系
const db = mysql.createPool({
    host:'127.0.0.1',   //数据库的IP地址
    user:'root',        //登录数据库的账号
    password:'123456',//登录数据库的密码
    database:'mysite'     //指定要操作哪个数据库
})


module.exports.handleMdFile = function (path) {
  let jsonData = {};
  //读取本地的md文件
  var data = fs.readFileSync(path, 'utf-8');
  data = marked(data)
  // return data
  // 匹配正则
  let reg = /<p>===([\s\S]*)===<\/p>\n/g;
  // 获取元数据
  str = data.match(reg)[0];
  timeReg = /time:.*\n/
  titleReg = /title:.*\n/
  tagReg = /tag:.*\n/
  jsonData.data = data.replace(reg,"");
  jsonData.time = str.match(timeReg)[0].replace("\n","").split(':')[1].replace(" ","");
  jsonData.title = str.match(titleReg)[0].replace("\n","").split(':')[1].replace(" ","");
  jsonData.tag = str.match(tagReg)[0].replace("\n","").split(':')[1].replace(" ","");
  // return JSON.stringify(jsonData);
  // console.log(jsonData)
  return jsonData 
}

module.exports.query = function (sql,arr) {
  return new Promise((resolve, reject)=>{
    if (arr === undefined) {
      db.query(sql,(err,results)=>{
        if (err) {
          reject(err.message)
        } else {
          console.log(sql,'查询成功')
          resolve(results)
        }
      });
    } else {
      db.query(sql,arr,(err,results)=>{
        if (err) {
          reject(err.message)
        } else {
          console.log(sql + ' ' + arr.join(','),'操作成功')
          resolve(results)
        }
      });
    }

  })
}

module.exports.mkdir = function (path) {
  fs.exists(path, function(exists) {
    if (exists) {
      console.log('目录已存在')
      return;
    }
    fs.mkdir(path,function(err){
      if (err) {
        console.error(err);
        return;
      } else {
        console.log('创建目录成功');
      }
    });
  });
}

module.exports.rmdir = function (path) {
  fs.exists(path, function(exists) {
    if (!exists) {
      console.log('目录不存在')
      return;
    }
    fs.rmdir(path,function(err){
      if (err) {
        console.error(err);
        return;
      } else {
        console.log('删除目录成功');
      }
    });
  });
}
