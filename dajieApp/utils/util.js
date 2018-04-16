//var promiseUtil = require('./es6-promise.js');

function isFuction(obj){
	return typeof obj === 'function';
}
function httpsPromisify(fn) {
  return function (obj = {}) {
    return new promiseUtil((resolve, reject) => {
      obj.success = function (res) {
        resolve(res)
      };

      obj.fail = function (res) {
        reject(res)
      };

      fn(obj);
    });
  }
}

module.exports = {
	isFuction: isFuction,
	httpsPromisify: httpsPromisify
}
