# 基本的函数式编程

下面例子是一个具体的函数式体现

```javascript
// 数组中每个单词，首字母大写


// 一般写法
const arr = ['apple', 'pen', 'apple-pen'];
for(const i in arr){
  const c = arr[i][0];
  arr[i] = c.toUpperCase() + arr[i].slice(1);
}

console.log(arr);


// 函数式写法一
function upperFirst(word) {
  return word[0].toUpperCase() + word.slice(1);
}

function wordToUpperCase(arr) {
  return arr.map(upperFirst);
}

console.log(wordToUpperCase(['apple', 'pen', 'apple-pen']));


// 函数式写法二
console.log(arr.map(['apple', 'pen', 'apple-pen'], word => word[0].toUpperCase() + word.slice(1)));
```

当情况变得更加复杂时，表达式的写法会遇到几个问题：

表意不明显，逐渐变得难以维护
复用性差，会产生更多的代码量
会产生很多中间变量
函数式编程很好的解决了上述问题。首先参看 函数式写法一，它利用了函数封装性将功能做拆解（粒度不唯一），并封装为不同的函数，而再利用组合的调用达到目的。这样做使得表意清晰，易于维护、复用以及扩展。其次利用 高阶函数，Array.map 代替 for…of 做数组遍历，减少了中间变量和操作。

而 函数式写法一 和 函数式写法二 之间的主要差别在于，可以考虑函数是否后续有复用的可能，如果没有，则后者更优。

# 链式优化
从上面 函数式写法二 中我们可以看出，函数式代码在写的过程中，很容易造成 横向延展，即产生多层嵌套，下面我们举个比较极端点的例子。
```javascript
// 计算数字之和


// 一般写法
console.log(1 + 2 + 3 - 4)


// 函数式写法
function sum(a, b) {
  return a + b;
}

function sub(a, b) {
  return a - b;
}

console.log(sub(sum(sum(1, 2), 3), 4);
```

本例仅为展示 横向延展 的比较极端的情况，随着函数的嵌套层数不断增多，导致代码的可读性大幅下降，还很容易产生错误。

在这种情况下，我们可以考虑多种优化方式，比如下面的 链式优化 。
```javascript
// 优化写法 (嗯，你没看错，这就是 lodash 的链式写法)
const utils = {
  chain(a) {
    this._temp = a;
    return this;
  },
  sum(b) {
    this._temp += b;
    return this;
  },
  sub(b) {
    this._temp -= b;
    return this;
  },
  value() {
    const _temp = this._temp;
    this._temp = undefined;
    return _temp;
  }
};

console.log(utils.chain(1).sum(2).sum(3).sub(4).value());
```

这样改写后，结构会整体变得比较清晰，而且链的每一环在做什么也可以很容易的展现出来。函数的嵌套和链式的对比还有一个很好的例子，那就是 回调函数 和 Promise 模式。
```javascript
// 顺序请求两个接口


// 回调函数
import $ from 'jquery';
$.post('a/url/to/target', (rs) => {
  if(rs){
    $.post('a/url/to/another/target', (rs2) => {
      if(rs2){
        $.post('a/url/to/third/target');
      }
    });
  }
});


// Promise
import request from 'catta';  // catta 是一个轻量级请求工具，支持 fetch,jsonp,ajax，无依赖
request('a/url/to/target')
  .then(rs => rs ? $.post('a/url/to/another/target') : Promise.reject())
  .then(rs2 => rs2 ? $.post('a/url/to/third/target') : Promise.reject());
```

随着回调函数嵌套层级和单层复杂度增加，它将会变得臃肿且难以维护，而 Promise 的链式结构，在高复杂度时，仍能纵向扩展，而且层次隔离很清晰。

常见的函数式编程模型
# 闭包（Closure）
可以保留局部变量不被释放的代码块，被称为一个闭包

闭包的概念比较抽象，相信大家都或多或少知道、用到这个特性

那么闭包到底能给我们带来什么好处？

先来看一下如何创建一个闭包：
```javascript
// 创建一个闭包
function makeCounter() {
  let k = 0;

  return function() {
    return ++k;
  };
}

const counter = makeCounter();

console.log(counter());  // 1
console.log(counter());  // 2
```

makeCounter 这个函数的代码块，在返回的函数中，对局部变量 k ，进行了引用，导致局部变量无法在函数执行结束后，被系统回收掉，从而产生了闭包。而这个闭包的作用就是，“保留住“ 了局部变量，使内层函数调用时，可以重复使用该变量；而不同于全局变量，该变量只能在函数内部被引用。

换句话说，闭包其实就是创造出了一些函数私有的 ”持久化变量“。

所以从这个例子，我们可以总结出，闭包的创造条件是：

存在内、外两层函数
内层函数对外层函数的局部变量进行了引用
闭包的用途
闭包的主要用途就是可以定义一些作用域局限的持久化变量，这些变量可以用来做缓存或者计算的中间量等等。
```javascript
// 简单的缓存工具
// 匿名函数创造了一个闭包
const cache = (function() {
  const store = {};
  
  return {
    get(key) {
      return store[key];
    },
    set(key, val) {
      store[key] = val;
    }
  }
}());

cache.set('a', 1);
cache.get('a');  // 1
```

上面例子是一个简单的缓存工具的实现，匿名函数创造了一个闭包，使得 store 对象 ，一直可以被引用，不会被回收。

闭包的弊端
持久化变量不会被正常释放，持续占用内存空间，很容易造成内存浪费，所以一般需要一些额外手动的清理机制。

# 高阶函数
接受或者返回一个函数的函数称为高阶函数

听上去很高冷的一个词汇，但是其实我们经常用到，只是原来不知道他们的名字而已。JavaScript 语言是原生支持高阶函数的，因为 JavaScript 的函数是一等公民，它既可以作为参数又可以作为另一个函数的返回值使用。

我们经常可以在 JavaScript 中见到许多原生的高阶函数，例如 Array.map , Array.reduce , Array.filter

下面以 map 为例，我们看看他是如何使用的

# map （映射）
映射是对集合而言的，即把集合的每一项都做相同的变换，产生一个新的集合

map 作为一个高阶函数，他接受一个函数参数作为映射的逻辑
```javascript
// 数组中每一项加一，组成一个新数组


// 一般写法
const arr = [1,2,3];
const rs = [];
for(let n of arr){
  rs.push(++n);
}
console.log(rs)


// map改写
const arr = [1,2,3];
const rs = arr.map(n => ++n);
```

上面一般写法，利用 for...of 循环的方式遍历数组会产生额外的操作，而且有改变原数组的风险

而 map 函数封装了必要的操作，使我们仅需要关心映射逻辑的函数实现即可，减少了代码量，也降低了副作用产生的风险。

# 柯里化（Currying）
给定一个函数的部分参数，生成一个接受其他参数的新函数

可能不常听到这个名词，但是用过 undescore 或 lodash 的人都见过他。

有一个神奇的 _.partial 函数，它就是柯里化的实现
```javascript
// 获取目标文件对基础路径的相对路径


// 一般写法
const BASE = '/path/to/base';
const relativePath = path.relative(BASE, '/some/path');


// _.parical 改写
const BASE = '/path/to/base';
const relativeFromBase = _.partial(path.relative, BASE);

const relativePath = relativeFromBase('/some/path');
```

通过 _.partial ，我们得到了新的函数 relativeFromBase ，这个函数在调用时就相当于调用 path.relative ，并默认将第一个参数传入 BASE ，后续传入的参数顺序后置。

本例中，我们真正想完成的操作是每次获得相对于 BASE 的路径，而非相对于任何路径。柯里化可以使我们只关心函数的部分参数，使函数的用途更加清晰，调用更加简单。

# 组合（Composing）
将多个函数的能力合并，创造一个新的函数

同样你第一次见到他可能还是在 lodash 中，compose 方法（现在叫 flow）

```javascript
// 数组中每个单词大写，做 Base64


// 一般写法 (其中一种)
const arr = ['pen', 'apple', 'applypen'];
const rs = [];
for(const w of arr){
  rs.push(btoa(w.toUpperCase()));
}
console.log(rs);


// _.flow 改写
const arr = ['pen', 'apple', 'applypen'];
const upperAndBase64 = _.partialRight(_.map, _.flow(_.upperCase, btoa));
console.log(upperAndBase64(arr));
```

_.flow 将转大写和转 Base64 的函数的能力合并，生成一个新的函数。方便作为参数函数或后续复用。

参考自：https://fed.taobao.org/blog/2017/03/16/javascript-functional-programing/
