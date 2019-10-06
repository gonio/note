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
                const res = this._executor(this._fulfilled.bind(this), this._rejected.bind(this));
                this._res = this._res || res;
            } catch (e) {
                console.log(e);
                this._rejected(e);
            }
        }
    }

    then (onFulfilled, onRejected) {
        this._onFulfilled = onFulfilled;
        this._onRejected = onRejected;
        this.next();
        this._nextPromise = new MyPromise((res, rej) => {
            this._nextFulfilled = res;
            this._nextRejected = rej;
        });
        return this._nextPromise;
    }

    catch (onCatch) {

        // catch 其实就是 then 的无 fulfilled 处理
        return this.then(null, onCatch);
    }

    finally (onFinally) {
        this._onFinally = onFinally;
        this.next();
        return this;
    }

    _fulfilled (data) {
        if (this._status === PENDING) {
            this._status = FULFILLED;
            this._res = data || this._res;
            this.next();
        }
    }

    _rejected (data) {
        if (this._status === PENDING) {
            this._status = REJECTED;
            this._res = data || this._res;
            this.next();
        }
    }

    next () {
        setTimeout(() => {
            if (this._status === FULFILLED) {
                if (typeof this._onFulfilled === 'function') {

                    this._onFulfilledRes = this._onFulfilled(this._res);

                    if (this._onFulfilledRes instanceof MyPromise) {
                        this._nextPromise._res = this._onFulfilledRes._res;
                    } else {
                        this._nextPromise._res = this._onFulfilledRes;
                    }
                    this._nextPromise._fulfilled(this._nextPromise._res);
                    this._onFulfilled = null;
                }
            } else if (this._status === REJECTED) {
                if (typeof this._onRejected === 'function') {

                    // 执行then的reject回调
                    // 后面的步骤全部reject
                    this._onRejectedRes = this._onRejected(this._res);

                    if (this._onRejectedRes instanceof MyPromise) {
                        this._nextPromise._res = this._onRejectedRes._res;
                    } else {
                        this._nextPromise._res = this._onRejectedRes;
                    }

                    this._nextPromise._rejected(this._nextPromise._res);
                    this._onRejected = null;
                } else {

                    // 后面的步骤全部reject
                    this._nextPromise && this._nextPromise._rejected(this._res);
                }
            }

            // Finally回调
            if (typeof this._onFinally === 'function') {
                this._onFinally();
                this._onFinally = null;
            }
        }, 0);
    }
}

new MyPromise((res, rej) => {
    rej(22);
    return 11;
}).then((data) => {
    console.log('======================');
    console.log(data);
}).then((data) => {
    return new MyPromise((res, rej) => rej(33));
}).then((data) => {
    console.log(data);
}).catch((data) => {
    console.log(data);
}).finally((data) => {
    console.log('finally');
});

b = new Promise(function (res, rej) {
    rej(22);
    return 11;
}).then((data) => {
    console.log(data);
}).then((data) => {
    return new Promise((res, rej) => rej(33));
}).then((data) => {
    console.log(data);
}).catch((data) => {
    console.log(data);
}).finally((data) => {
    console.log('finally');
});
