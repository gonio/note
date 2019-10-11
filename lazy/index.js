class Lazy {
    constructor () {
        this._queue = []; // 把当前的动作加入执行队列
        this.name = 'hyz';
        setTimeout(() => this.next(), 0);
    }

    getUp () {
        this._queue.push(() => {
            console.log(this.name + 'getUp');
            this.next();
        });
        return this;
    }

    eat () {
        this._queue.push(() => {
            console.log(this.name + 'eat');
            this.next();
        });
        return this;
    }

    bath () {
        this._queue.push(() => {
            console.log(this.name + 'bath');
            this.next();
        });
        return this;
    }

    sleep (hour) {
        this._queue.push(() => {
            setTimeout(() => {
                console.log(this.name + `sleep ${hour}s`);
                this.next();
            }, hour * 1000);
        });
        return this;
    }

    /**
     * 执行队列中的下一个动作
     * @param arg
     */
    next (arg) {
        const fn = this._queue.shift();
        if (typeof fn === 'function') {
            fn.apply(this, arg);
        } else {
            console.log('over');
        }
    }
}


const lazy = new Lazy();
lazy.getUp().eat().sleep(1).getUp().sleep(10).bath();
