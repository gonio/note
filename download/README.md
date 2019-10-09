# 下载文件的几种方法
## 1、HTML5自带属性
使用a标签的download属性（HTML5），可以任意下载href的地址（同域名）；兼容性：不支持ie  

```html
<a href="index_logo.gif" download="logo">下载</a>
```  
## 2、借助HTML5 Blob实现文本信息文件下载

```javascript
var exportFile = function (content, filename) {
     // 创建隐藏的可下载链接
     var eleLink = document.createElement('a');
     eleLink.download = filename;
     eleLink.style.display = 'none';
     // 字符内容转变成blob地址
     var blob = new Blob([content]);
     eleLink.href = URL.createObjectURL(blob);
     // 触发点击
     document.body.appendChild(eleLink);
     eleLink.click();
     // 然后移除
     document.body.removeChild(eleLink);
 };
```  

## 3、借助Base64实现任意文件下载
```javascript
var exportFile = function (domImg, filename) {
    // 创建隐藏的可下载链接
    var eleLink = document.createElement('a');
    eleLink.download = filename;
    eleLink.style.display = 'none';
    // 图片转base64地址
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    var width = domImg.naturalWidth;
    var height = domImg.naturalHeight;
    context.drawImage(domImg, 0, 0);
    // 如果是PNG图片，则canvas.toDataURL('image/png')
    eleLink.href = canvas.toDataURL('image/jpeg');
    // 触发点击
    document.body.appendChild(eleLink);
    eleLink.click();
    // 然后移除
    document.body.removeChild(eleLink);
};
```  

## 4、需要post一些参数获取下载数据
```javascript
var exportFile = function  (url, config) {
    const doc = document;
    const form = doc.createElement('form');
    const input = doc.createElement('input');
    let field;
    form.action = url;
    form.method = 'post';
    form.style.display = 'none';
    input.type = 'hidden';

    //设置表单参数
    _.each(config, (value, name) => {
        field = input.cloneNode(false);
        field.name = name;
        field.value = value;
        form.appendChild(field);
    });
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
}
```
