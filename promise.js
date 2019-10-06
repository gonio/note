const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class MyPromise {
    constructor (executor) {
        // 初始化状态为 pending
        this._status = PENDING;
        // this._onFulfilled;
        // this._onRejected;
        // this._onCatch;
        this._executor = executor;

        if (typeof this._executor === 'function') {
            try {
                const res = this._executor(this._fulfilled.bind(this), this._rejected.bind(this));
                this._res = this._res || res;
            } catch (e) {
                console.log(e);
                if (typeof this._onCatch === 'function') {
                    this._onCatch();
                }
                if (typeof this._onFinally === 'function') {
                    this._onFinally();
                    this._onFinally = null;
                }
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
        this._onCatch = onCatch;
    }

    finally (onFinally) {
        this._onFinally = onFinally;
    }

    _fulfilled (data) {
        this._status = FULFILLED;
        this._res = data || this._res;
        this.next();
    }

    _rejected (data) {
        this._status = REJECTED;
        this._res = data || this._res;
        this.next();
    }

    next () {
        setTimeout(() => {
            if (this._status === FULFILLED) {
                if (typeof this._onFulfilled === 'function') {

                    this._onFulfilledRes = this._onFulfilled(this._res);

                    if (this._onFulfilledRes instanceof MyPromise) {

                        // 执行下一步的resolve回调
                        if (typeof this._nextFulfilled === 'function') {
                            this._nextFulfilled(this._onFulfilledRes._res);
                        }
                    } else {

                        // 执行下一步的resolve回调
                        if (typeof this._nextFulfilled === 'function') {
                            this._nextFulfilled(this._onFulfilledRes);
                        }
                    }

                    this._onFulfilled = null;
                }
            } else if (this._status === REJECTED) {
                if (typeof this._onRejected === 'function') {

                    // 执行then的reject回调
                    this._onRejectedRes = this._onRejected(this._res);

                    // 执行下一步的reject回调
                    if (typeof this._nextRejected === 'function') {
                        this._nextRejected(this._onRejectedRes);
                    }
                    this._onRejected = null;
                }
            }

            // Finally回调
            if (typeof this._onFinally === 'function' && this._status !== PENDING) {
                this._onFinally();
                this._onFinally = null;
            }
        }, 0);
    }
}

new MyPromise((res) => {
    res(22);
    return 11;
}).then((data) => {
    console.log('======================');
    console.log(data);
}).then((data) => {
    return new MyPromise(res => res(33));
}).then((data) => {
    console.log(data);
}).finally((data) => {
    console.log('finally');
});

b = new Promise(function (res) {
    res(22);
    return 11;
}).then((data) => {
    console.log(data);
}).then((data) => {
    return new Promise(res => res(33));
}).then((data) => {
    console.log(data);
}).finally((data) => {
    console.log('finally');
});
