const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class MyPromise {
    constructor (executor) {

        // 初始化状态为 pending
        this._status = PENDING;
        this._executor = executor;

        if (typeof this._executor === 'function') {
            try {
                const res = this._executor(this.fulfilled.bind(this), this.rejected.bind(this));
                this._res = this._res || res;
            } catch (e) {

                // 报错走rejected处理
                this.rejected(e);
            }
        }
    }

    then (onFulfilled, onRejected) {
        this._onFulfilled = onFulfilled;
        this._onRejected = onRejected;
        this.next();
        this._nextPromise = new MyPromise((res, rej) => {
        });
        return this._nextPromise;
    }

    catch (onCatch) {

        // catch其实就是rejected的回调处理
        return this.then(null, onCatch);
    }

    finally (onFinally) {
        return this.then(() => {
            onFinally();
        }, () => {
            onFinally();
        });
    }

    fulfilled (data) {
        if (this._status === PENDING) {
            this._status = FULFILLED;
            this._res = data || this._res;
            this.next();
        }
    }

    rejected (data) {
        if (this._status === PENDING) {
            this._status = REJECTED;
            this._res = data || this._res;
            this.next();
        }
    }

    next () {
        setTimeout(() => {
            let result;
            if (this._status === FULFILLED) {
                if (typeof this._onFulfilled === 'function') {

                    const fulfilledRes = this._onFulfilled(this._res);

                    // 返回的是promise处理一下往后传递的返回结果
                    if (fulfilledRes instanceof MyPromise) {
                        fulfilledRes.then((data) => {
                            this._nextPromise.fulfilled(data);
                        }, (data) => {
                            this._nextPromise.rejected(data);
                        });
                    } else {
                        this._nextPromise.fulfilled(fulfilledRes);
                    }

                    this._onFulfilled = null;
                }
            } else if (this._status === REJECTED) {
                if (typeof this._onRejected === 'function') {

                    // 执行then的reject回调
                    this._onRejectedRes = this._onRejected(this._res);

                    // 返回的是promise处理一下往后传递的返回结果
                    if (this._onRejectedRes instanceof MyPromise) {
                        result = this._onRejectedRes._res;
                    } else {
                        result = this._onRejectedRes;
                    }

                    this._nextPromise.rejected(result);
                    this._onRejected = null;
                } else {

                    // 后面的步骤全部reject
                    this._nextPromise && this._nextPromise.rejected(this._res);
                }
            }
        }, 0);
    }

}

MyPromise.all = function (promises) {
    return new MyPromise((res, rej) => {
        const result = {};
        promises.forEach((promise, index) => {
            promise.then((data) => {
                check(data, index);
            }, rej);
        });

        function check (data, index) {
            result[index] = data;
            result.length = result.length ? ++result.length : 1;

            // 全部解决了
            if (result.length === promises.length) {
                res(Array.from(result));
            }
        }
    });
};
MyPromise.race = function (promises) {
    return new MyPromise((res, rej) => {
        promises.forEach(promise => {
            promise.then(res, rej);
        });
    });
};
MyPromise.resolve = function (data) {
    return new MyPromise((res, rej) => {
        res(data);
    });
};
MyPromise.reject = function (data) {
    return new MyPromise((res, rej) => {
        rej(data);
    });
};

/* 测试代码 ************************************************************************************/

// let a = new MyPromise((res, rej) => {
//     setTimeout(() => {
//         res(22);
//     }, 1000);
// });
// let b = new MyPromise((res, rej) => {
//     setTimeout(() => {
//         res(11);
//     }, 0);
// });
//
// MyPromise.all([a, b]).then((data) => {
//     console.log(data);
// }, (data) => {
//     console.log(data);
// });
// let a = new Promise((res, rej) => {
//     setTimeout(() => {
//         res(22);
//     }, 1000);
// });
// let b = new Promise((res, rej) => {
//     setTimeout(() => {
//         res(11);
//     }, 0);
// });
//
// Promise.all([a, b]).then((data) => {
//     console.log(data);
// }, (data) => {
//     console.log(data);
// });

// new MyPromise((res, rej) => {
//     setTimeout(() => {
//         res(22);
//     }, 1000);
//     return 11;
// }).then((data) => {
//     console.log('======================');
//     console.log(data);
// }).then((data) => {
//     return new MyPromise((res, rej) => {
//         setTimeout(() => {
//             rej(33);
//         }, 1000);
//     });
// }).then((data) => {
//     console.log(data);
// }).catch((data) => {
//     console.log(data);
// }).finally((data) => {
//     console.log('finally');
// });

// var test = new MyPromise((res, rej) => {
//     setTimeout(() => {
//         res(22);
//     }, 1000);
//     return 11;
// });
// setTimeout(() => {
//     test.then((data) => {
//         console.log('======================');
//         console.log(data);
//     }).then((data) => {
//         return new MyPromise((res, rej) => rej(33));
//     }).then((data) => {
//         console.log(data);
//     }).catch((data) => {
//         console.log(data);
//     }).finally((data) => {
//         console.log('finally');
//     });
// }, 5000);

// b = new Promise(function (res, rej) {
//     setTimeout(() => {
//         res(22);
//     }, 1000);
//     return 11;
// }).then((data) => {
//     console.log(data);
// }).then((data) => {
//     return new Promise((res, rej) => rej(33));
// }).then((data) => {
//     console.log(data);
// }).catch((data) => {
//     console.log(data);
// }).finally((data) => {
//     console.log('finally');
// });
