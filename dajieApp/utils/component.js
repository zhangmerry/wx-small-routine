var request = require('../requests/request.js');
var util = require('../utils/util.js');
//立即投递
function deliver(obj, successCb){
	var _this = this;
	request.requestResumeComplete('', (res) => {
		if(res.statusCode == 0) {
    		request.requestDeliver(obj.jid, '', (res) => {
    			util.isFuction(successCb) && successCb(res);
    			wx.showToast({
		          title: '投递成功',
		          icon: 'success',
		          duration: 1000
		        });
		    }, () => {
		    	wx.navigateTo({
					url: '../login/login'
				});
		    });
		}
	}, () => { //没有登录
		wx.navigateTo({
			url: '../login/login'
		});
	}, () => {
		wx.showModal({ //简历不完善
	        title: '简历不完整',
	        content: '您的简历完整度不足，无法投递，建议先完善简历。',
	        cancelText: '停止投递',
	        cancelColor: '#666',
	        confirmText: '完善简历',
	        confirmColor: '#00B6D7',
	        success: function(res) {
	          if (res.confirm) {
	            wx.navigateTo({
	              url: '../resume/resume'
	            });
	          } else if (res.cancel) {
	            console.log('停止投递');
	          }
	        }
	     });
	}, () => {});
}
var showNotNet = function(obj, fn){
	wx.showModal({
        title: '',
        content: '网络异常，点击重新加载。',
        showCancel: false,
        confirmText: '重新加载',
        confirmColor: '#00B6D7',
        success: function(res) {
          if (res.confirm) {
            var page = getCurrentPages().pop();
			if (page == undefined || page == null) {
				return;
			}
			isNetwork.call(page, fn);
			/*if(obj.data.isNet) {
				fn();
			}*/
          }
        }
    });
};

//网络状态
function isNetwork(fn=null) {
	var _this = this;
	var isNet = true;
	wx.getNetworkType({
		success: (res) => {
			if(res.networkType == 'none') {
				isNet = false;
				_this.setData({
					loadingMore: false,
					isNet: false
				});
				showNotNet(_this, fn);
			} else {
				_this.setData({
					isNet: true
				});
				util.isFuction(fn) && fn();
			}

		}
	});
	if(wx.onNetworkStatusChange) {
		wx.onNetworkStatusChange(function(res){
			if(res.networkType == 'none') {
				isNet = false;
				_this.setData({
					loadingMore: false,
					isNet: false
				});
				showNotNet(_this,fn);
			} else {
				_this.setData({
					isNet: true
				});
			}
		});
	} else {
		console.log('不支持此接口~');
	}
}



module.exports = {
	deliver: deliver,
	isNetwork: isNetwork
};
