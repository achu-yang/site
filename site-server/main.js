const express = require("express"),
cors = require('cors');
const pathLib = require('path'),
bodyParser = require("body-parser");
var multer  = require('multer');
 // 使用框架创建web服务器   
const app = express();
//加载静态文件
app.use(express.static('static'));  
//解决跨域问题
app.use(cors()); 
app.use(bodyParser.json());
// 解决上传文件问题
app.use(multer({ dest: './tmp/' }).any())

// 常用工具加载
const {handleMdFile, query} = require('./utils.js');
const { setTimeout } = require("timers");
const { join } = require("path");

const FileTable = 'pigeonhole';
const FileSQL = {
  'add': 'INSERT INTO ' + FileTable +'(`id`,`tags`,`label`,`time`,`content`)VALUES(?,?,?,?,?)',
  'delete': 'delete from ' + FileTable +' where id = ?',
  'findAll': 'SELECT id,label FROM ' + FileTable,
  'findFile': 'SELECT * FROM ' + FileTable +' where id = ?',
  'getId': 'select max(id) from ' + FileTable,
  'findTag': 'SELECT tags FROM ' + FileTable,
}


// *******************************get*****************************
// 当客户端以get方式访问/路由时
app.get('/test', (req, res) => {  
  let json = handleMdFile('static/test.md');
  // res.end(json);
});
var tagSetList = []
app.get('/tag/list', (req, res) => {
  tagSetList = []  
  query(FileSQL.findTag).then(list=>{
    tagSetList = []
    for (let i = 0; i < list.length; i++) {
      let tagName = list[i].tags
      if (tagName !== undefined && tagName !== '' && tagName !== null) {
        if (tagSetList.indexOf(tagName) == -1) {
          tagSetList.push(tagName);
        }
      }
    }
    res.send(tagSetList)
  });
});

app.get('/tag/file', (req, res) => {  
  query(FileSQL.findAll + ' where tags = ?',[req.query.tagName]).then(list=>{
    res.send(list)
  })
});

// 归档文件List
app.get('/fileTree', (req, res)=>{
  // query(FileSQL.findAll).then(value=>{
  //   res.send(value)
  // }).catch(e=>{
  //   res.send(e);
  // });
  query(FileSQL.findTag).then(list=>{
    let tagSetList = []
    for (let i = 0; i < list.length; i++) {
      let tagName = list[i].tags
      if (tagName !== undefined && tagName !== '' && tagName !== null) {
        if (tagSetList.indexOf(tagName) == -1) {
          tagSetList.push(tagName);
        }
      }
    }
    let json = {};
    Promise.all(tagSetList.map(tagName=>{
      return query(FileSQL.findAll + ' where tags = ?',[tagName]).then(list=>{
        json[tagName] = list;
      });
    })).then(()=>{
      res.send(json)
    })
    
  })
});

app.get('/file', (req, res)=>{
  query(FileSQL.findFile,[req.query.id]).then(list=>{
    res.send(list[0])
  });
});

app.delete('/fileTree', (req, res)=>{
  query(FileSQL.delete,[req.query.id]).then(value=>{
    res.send('successful')
  })


});

// ******************************post*****************************
// 文件上传接口
app.post('/fileUpload', function(req, res){
  // 上传的文件在req.files中
  // var filename = req.files[0].path + pathLib.parse(req.files[0].originalname).ext
  var filename = __dirname + '/tmp/' +  req.files[0].originalname
  // console.log(filename)
  fs.rename(req.files[0].path, filename, function(err){
    if(err){
      res.send(err)
    }else{
      fs.readFile(filename,"utf8",(err, data)=>{
        let fileName = 'static/' +  req.files[0].originalname;
        fs.writeFile(fileName,data,err => {
          if (!err) {
            let json = handleMdFile(filename);
            query(FileSQL.getId).then(value=>{
              let newId = value[0]['max(id)'] + 1;
              let tags = json.tag.split(',');
              for (let i = 0; i < tags.length; i++) {
                query(FileSQL.add,
                  [ 
                    newId,
                    tags[i],
                    req.files[0].originalname.split('.md')[0],
                    '2029-03-29',
                    json.data
                  ])
              }
              res.send('successful')
            }).catch(e=>{
              res.send(e)
            });
          }
      });   
    });
  }
})});


//启动端口监听
var server = app.listen(20000, function () {
  var host = server.address().address;
  var port = server.address().port;
  // console.log("应用实例，访问地址为 http://%s:%s", host, port)
});

