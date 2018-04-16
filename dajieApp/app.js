//app.js
var util = require('./utils/util.js');
//var Mock = require('./utils/mock.js');
var api = require('./requests/api.js');

let isDebug = false;

App({
  onLaunch: function () {
    // 登录
    if(wx.setTopBarText) {
       wx.setTopBarText({
        text: '大街网 | 社会职位招聘'
      });
    }
  },
  onShow: function(){

  },
  globalData: {
    isLogin: false,
    isLimit: true,
    third_session_key: wx.getStorageSync("third_session_key")
  },
  //获取3rd_session_key
  wxLogin: function(fn){
    var that = this;
    wx.login({
      success: (res) => {
        var code = res.code;
        if(!isDebug) {
          wx.request({
                url: api.API_SESSION_KEY,
                method: 'GET',
                data: {code: code},
                success: function(res){
                  res = res.data;
                  if(res.statusCode == 0) {
                    var thirdSession = res.data.third_session;
                    var globalSession = that.globalData.third_session_key;

                    if(!globalSession) {
                      that.globalData.third_session_key= thirdSession;
                      globalSession = thirdSession;
                    }
                    wx.setStorageSync('third_session_key', globalSession);
                    //console.log('globalSession success--'+globalSession);
                    util.isFuction(fn) && fn();
                   } else {
                     console.log('3Session error--');
                   }
                },
                fail: function(){
                  console.log('error');
                },
                complete: function(){
                  //console.log('complete');
                }
              });
        } else {
          var res = Mock.mock({
            "status" : "SUCCESS",
            "statusCode":0,
            "data" : {
              "wx_err_code" : "微信返回的错误码",
              "wx_err_msg" : "微信返回的错误信息",
              "third_session_key" : "服务端⽣生成的登录标识，所有请求都要带上"
            }
          });
          if(res.statusCode == 0) {
                var thirdSession = res.data.third_session_key;
                console.log(thirdSession);
                wx.setStorageSync('third_session_key', thirdSession);
              } else {}
        }
      }
    });
  },
  //检查会话状态
  checkSession: function(fn){
    var that = this;
    //if(this.globalData.isLimit) {
      //this.globalData.isLimit = false;
      wx.checkSession({
        success: (res) => {
          //that.globalData.isLimit = true;
          var thirdSession = wx.getStorageSync("third_session_key");
          //console.log('check thirdSession--'+thirdSession);
          if(!thirdSession) {
            that.wxLogin(fn);
          } else {
            util.isFuction(fn) && fn();
          }
        },
        fail: () => {
          that.wxLogin(fn);
        }
      });
    //}
  },

  //跳到登录页
  redirectLogin: function(){
    wx.navigateTo({
      url: '../login/login'
    });
  }
});
