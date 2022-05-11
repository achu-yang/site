===
title: JavaScript详解
time: 2022-02-12
tag: JavaScript
===

# 场景
一个网页会包含很多的图片，例如淘宝京东这些购物网站，商品图片多只之又多，页面图片多，加载的图片就多。服务器压力就会很大。不仅影响渲染速度还会浪费带宽。

# 如何解决
我们知道当浏览器遇到img标签的时候是通过src去请求资源的，也意味着src不赋值时，浏览器不会去请求资源。
思路就来了，我们可以快要看的时候才去给img标签赋值

## 问题
1. 什么情况才算快要看
2. 如何赋值

## 解决问题
1. 获取需要加载内容盒子相对于body的高度确认是否加载
<div style='margin: 0 auto;'>
  <img src='./jpg/懒加载1.png'>
</div>
获取元素离页面body的高度
HTML.offset
写了一个方法无论父级元素如何都能获得正确的偏移量，将这个偏移量和scrollTop + clientHight比

```js
function findBodyTop(element) {
  let body = document.body;
  let hight = 0;
  while (element.offsetParent !== body) {
    console.log(element.offsetParent)
    hight += element.offsetTop;
    element = element.offsetParent;
  }
  hight += element.offsetTop;
  return hight;
}
```

1. 无间隔的列表1
2. 无间隔的列表2
3. 无间隔的列表3

1. 有间隔的列表1

2. 有间隔的列表1

3. 有间隔的列表1

```js
function lazyload(imgs){
  // 可视区域高度
  var h = window.innerHeight;
  //滚动区域高度
  var s = document.documentElement.scrollTop || document.body.scrollTop;
  for(var i=0;i<imgs.length;i++){
    //图片距离顶部的距离大于可视区域和滚动区域之和时懒加载
    if ((h+s)>getTop(imgs[i])) {
      // 真实情况是页面开始有2秒空白，所以使用setTimeout定时2s
      (function(i){
        setTimeout(function(){
          // 不加立即执行函数i会等于9
          // 隐形加载图片或其他资源，
          //创建一个临时图片，这个图片在内存中不会到页面上去。实现隐形加载
          var temp = new Image();
          temp.src = imgs[i].getAttribute('data-src');//只会请求一次
          // onload判断图片加载完毕，真是图片加载完毕，再赋值给dom节点
          temp.onload = function(){
            // 获取自定义属性data-src，用真图片替换假图片
            imgs[i].src = imgs[i].getAttribute('data-src')
          }
        },2000)
      })(i)
    }
  }
}
lazyload(imgs);

// 滚屏函数
window.onscroll =function(){
  lazyload(imgs);
}

```