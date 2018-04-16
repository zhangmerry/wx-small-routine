// pages/login/login.js
//获取应用实例
var request = require('../../requests/request.js');
var showToast = require('../../showToast/showToast.js');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showLoginView: true,//控制显示登录还是注册
    showPasswordView: true,//控制显示帐号密码登录还是验证码登录
    verifyCodeTime: '',//倒计时text
    showRegCode: true,//控制显示注册倒计时/按钮
    showLogCode: true,//控制显示登录的倒计时/按钮
    valiCode: '',
    phone: '',
    regInfo: {
      username: '',
      account: '',
      password: '',
      rPassword: '',
      code: ''
    },
    logInfo: {
      account: '',
      password: ''
    },
    loadingMore: false //正在登录
  },


  // 登录注册view切换
  setRegViewShow: function () {
    if (this.data.showLoginView) {
      this.setData({
        showLoginView: false
      });
      wx.setNavigationBarTitle({
        title: '注册'
      });
    }
  },
  setLoginViewShow: function () {
    if (!this.data.showLoginView) {
      this.setData({
        showLoginView: true
      });
      wx.setNavigationBarTitle({
        title: '登录'
      });
    }
  },
  //帐号/验证码登录切换
  setPasswordView: function () {
    this.setData({
      showPasswordView: !this.data.showPasswordView,
      logInfo: {
        account: '',
        password: ''
      },
      phone: '',
      valiCode: ''
    });
    wx.setNavigationBarTitle({
        title: '登录'
    });
  },
  //绑定input框输入事件，将值绑定到data
  bindKeyInput: function (e) {
    var name = e.target.dataset.name;
    if (this.data.showLoginView) {
      if (name == 'account' || name == 'phone') {
        this.setData({
          'logInfo.account' : e.detail.value
        });
      }
    } else {
      switch(name) {
        case 'username' :
          this.setData({
            'regInfo.username' : e.detail.value
          });
          break;
        case 'account' :
          this.setData({
            'regInfo.account' : e.detail.value
          });
          break;
        case 'password' :
          this.setData({
            'regInfo.password' : e.detail.value
          });
          break;
        case 'rPassword' :
          this.setData({
            'regInfo.rPassword' : e.detail.value
          });
          break;
        case 'code' :
          this.setData({
            'regInfo.code' : e.detail.value
          });
          break;
      }
    }
  },

  // 获取验证码
  getCode: function () {
    var self = this;
    var account = self.data.showLoginView ? self.data.logInfo.account : self.data.regInfo.account;//手机号
    var isReg = self.data.showLoginView ? false : true;
    self.setData({showLogCode : true, showRegCode: true});
    if (account.trim() == '') {
      self._showToast('请输入手机号');
      return;
    }
    if(!self._validatePhone(account)) {
      self._showToast('手机号不合法');
      return;
    }
    //console.log('验证码接口传参', {account: account, type: isReg ? 1 : 0});
    request.requestSendRegcode({account: account, type: isReg ? 1 : 0}, function (res) {
      let {code, msg} = res.data;
      if (code != 0) {
        self._showToast(msg);
      } else {
        //显示倒计时
        var c = 60;
        self.intervalId && clearInterval(self.intervalId);
        self.intervalId = setInterval(function(){
          c = c-1;
          self.setData({verifyCodeTime: c + 's后重发'});
          isReg ? self.setData({showRegCode: false}) : self.setData({showLogCode: false});
          if (c == 0) {
            clearInterval(self.intervalId);
            self.setData({
              verifyCodeTime: ''
            });
            isReg ? self.setData({showRegCode: true}) : self.setData({showLogCode: true});
          }
        }, 1000);
      }
    }, function () {
      //console.log('请求出错');
    });
  },

  // 注册按钮事件
  regBtnClick: function () {
    var self = this;
    let isOk = this.validateRegForm();
    let param = this.data.regInfo;
    //console.log('注册传参', param);
    if (isOk) {
      request.requestRegister(param, function (res) {
        let {code, msg} = res.data;
        if (code == 0) {
          wx.switchTab({
            url: '../mine/mine',
            success: (res) => {
              var page = getCurrentPages().pop();
              if (page == undefined || page == null) {return;}
               page.onLoad();
            }
          });
        } else {
          self._showToast(msg);
        }
      }, function () {
        console.log('请求出错');
      },function () {

      });
    }
  },

  // 登录按钮事件
  logFormSubmit: function (e) {
    let self = this;
    if (this.data.showPasswordView) {//帐号密码登录
      self.setData({
        logInfo : {
          account: e.detail.value.account,
          password: e.detail.value.password,
          type: 0
        }
      });
    } else {//手机号验证码登录
      self.setData({
        logInfo : {
          account: e.detail.value.phone,
          password: e.detail.value.code,
          code: e.detail.value.code,
          type: 1
        }
      });
    }
    let isOk = self.validateLogInfo();
    let param = self.data.logInfo;
    //console.log('登录传参', param);
    if (isOk) {
      self.setData({
        loadingMore:true
      });
      request.requestLogin(param, function (res) {
        let {code, msg} = res.data;
        if (code == 0) {
          app.globalData.isLogin = true;
          var pages = getCurrentPages();
          if(pages.length > 0) {
            var prevPage = pages[pages.length - 2];  //上一个页面
            prevPage.setData({
              loadingMore: null
            });
            wx.navigateBack({
              delta: 1
            });
          } else {
            wx.switchTab({
              url: '../mine/mine',
              success: (res) => {
                var page = getCurrentPages().pop();
                if (page == undefined || page == null) {return;}
                 page.onLoad();
              }
            });
          }
        } else {
          self._showToast(msg);
        }
      }, function () {
        //console.log('请求出错');
      }, function(){
        self.setData({
          loadingMore:false
        });
      });
    }
  },

  validateLogInfo: function () {
    let self = this;
    let logInfo = self.data.logInfo;
    if (logInfo.account.trim() == '') {
      self._showToast(self.data.showPasswordView ? '手机号/邮箱不能为空' : '手机号不能为空');
      return false;
    }
    if (logInfo.password.trim() == '') {
      self._showToast(self.data.showPasswordView ? '密码不能为空' : '验证码不能为空');
      return false;
    }
    if (!self.data.showPasswordView) {
      if (!self._validatePhone(logInfo.account)) {
        self._showToast('手机号不合法');
        return false;
      }
    } else {
      if (!self._validatePhone(logInfo.account) && !self._validateEmail(logInfo.account)) {
        self._showToast('帐号不合法');
        return false;
      }
    }
    return true;
  },

  validateRegForm: function () {
    let self = this;
    let regInfo = self.data.regInfo;
    if (regInfo.username.trim() == '') {
      self._showToast('姓名不能为空');
      return false;
    }
    if (regInfo.account.trim() == '' || !self._validatePhone(regInfo.account.trim())) {
      self._showToast('请输入正确的手机号');
      return false;
    }
    if (regInfo.code.trim() == '') {
      self._showToast('验证码不能为空');
      return false;
    }
    if (regInfo.password.trim() == '') {
      self._showToast('密码不能为空');
      return false;
    }
    if (regInfo.rPassword.trim() == '') {
      self._showToast('请再次输入密码');
      return false;
    }
    if (!(regInfo.rPassword.trim() === regInfo.password.trim())) {
      self._showToast('两次输入的密码不一致');
      return false;
    }
    return true;
  },

  _showToast: function (msg) {
    // wx.showToast({
    //   title: msg,
    //   duration: 3000
    // });
    showToast.showToast({
      title: msg,
      // mask: true,//是否显示透明蒙层，防止触摸穿透，默认：true 选填
      duration: 2000
      // cb:       接口调用成功的回调函数 选填
    });
  },

  _validatePhone: function (str) {
    var reg = /^1[0-9]{10}$/g;
    if (!reg.test(str)) {
        return false;
    }
    return true;
  },

  _validateEmail: function (str) {
    var p = /^([a-zA-Z0-9-_.])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
    if (!p.test(str)) {
        return false;
    }
    return true;
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('---login onLoad---');
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  }
});
