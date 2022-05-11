let res = 
  {"body":"<p>===\ntime: 2021-02-01\ntitle: 为什么呢?\ntag: a,b,对的\n===</p>\n<h1 id=\"hello\">hello</h1>\n<h2 id=\"shaya\">shaya</h2>\n<p>dflsadkjf</p>\n<ol>\n<li>g</li>\n<li>bf</li>\n<li>kfjsdl</li>\n</ol>\n"}

// function getMDMeta (res) {
//   let text = res.body;
//   let reg = /===(\S*)===/
//   console.log(text.match(reg))
// }
// getMDMeta(res)
let varstr = "<p>===\ntime: 2021-02-01\ntitle: 为什么呢?\ntag: a,b,对的\n===</p>\n<h1 id=\"hello\">hello</h1>\n<h2 id=\"shaya\">shaya</h2>\n<p>dflsadkjf</p>\n<ol>\n<li>g</li>\n<li>bf</li>\n<li>kfjsdl</li>\n</ol>\n",
reg = /<p>===([\s\S]*)===<\/p>/g
str = varstr.match(reg)[0];
timeReg = /time:.*\n/
titleReg = /title:.*\n/
tagReg = /tag:.*\n/
console.log(str.match(reg1),str.match(reg2),str.match(reg3))
finalHTML = varstr.replace(reg,"")
// console.log(str,finalHTML)