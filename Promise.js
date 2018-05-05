function Promise(callback) {
    if (typeof callback != "function") {
        throw new Error('Promise构造的参数错误！');
    }
    this.callbackList = [];
    var _this = this;
    setTimeout(function() {
        if (_this.callbackList.length) {
            var cbObj = _this.callbackList.shift(); // 取出第一个回调对象
            callback(function(data) {
                if (typeof cbObj.resolve == "function") {
                    var _p = cbObj.resolve(data); // 执行resolve回调 返回新的Promise
                    if (_this.callbackList.length) {
                        if (_p instanceof Promise) {
                            _p.callbackList = _this.callbackList; // 新的Promise继承callbackList
                            _this.callbackList = []; // 清空实例的callbackList
                        } else {
                            throw new Error('请返回Promise实例！');
                        }
                    }

                } else {
                    throw new Error('resolve方法不存在！');
                }
                cbObj = null; // 防止内存溢出
                _this = null;

            }, function(data) {
                if (typeof cbObj.reject == "function") {
                    cbObj.reject(data); // 执行reject
                } else {
                    throw new Error('reject方法不存在！');
                }
                cbObj = null;
            });
        }

    }, 0)
}
Promise.prototype = {
    then: function(resolve, reject) {
        if ((reject && typeof reject != "function") || typeof resolve != "function") {
            throw new Error('then方法的参数错误！');
        } else {
            this.callbackList.push({ "resolve": resolve, "reject": reject }); // 放入队列
        }
        return this;
    }
}



function runAsync1() {
    var p = new Promise(function(resolve, reject) {
        //做一些异步操作
        setTimeout(function() {
            console.log('异步任务1执行完成');
            resolve('随便什么数据1');
        }, 1000);
    });
    return p;
}

function runAsync2() {
    var p = new Promise(function(resolve, reject) {
        //做一些异步操作
        setTimeout(function() {
            console.log('异步任务2执行完成');
            reject('错误数据');
        }, 2000);
    });
    return p;
}

runAsync1()
    .then(function(data) {
        console.log(data);
        return runAsync2();
    })
    .then(function(data) {
        console.log(data);
        return '直接返回数据'; //这里直接返回数据
    }, function(data) {
        console.log(data);
        return '直接返回数据'; //这里直接返回数据
    })