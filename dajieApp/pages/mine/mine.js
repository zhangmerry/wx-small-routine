// pages/mine/mine.js
var request = require('../../requests/request.js');
var component = require('../../utils/component.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data:{},
    isLogin: app.globalData.isLogin,
    loadingMore: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    component.isNetwork.call(this);
    //this.requestData();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //if(app.globalData.isLogin) {
      this.requestData();
    //}

  },

  /*请求数据*/
  requestData: function(){
    var that = this;
    this.setData({
        loadingMore: true
    });
    request.requestMineIndex('', (res) => {
      if(res.statusCode == 0) {
        that.setData({
          isLogin: true,
          data: res.data
        });
      } else {

      }
    }, () => {
      that.setData({
        isLogin: false
      });
    }, () => {}, () => {
      that.setData({
          loadingMore: false
      });
    });
  },
  /*是否登录*/
  getRedirectUrl: function(loginUrl){
    var url = '../login/login';
    if(this.data.isLogin) {
      url = loginUrl;
    }
    return url;
  },

  /*跳到简历页*/
  toResumePage: function(){
    var url = this.getRedirectUrl('../resume/resume');
    wx.navigateTo({
      url: url
    });
  },

  /*跳到订阅页*/
  toSubscriberPage: function(){
    var url = this.getRedirectUrl('../subscriber/subscriber');
    wx.navigateTo({
      url: url
    });
  },

  /*跳到投递反馈页*/
  toFeedbackPage: function(){
    var url = this.getRedirectUrl('../feedback/feedback');
    wx.navigateTo({
      url: url
    });
  },

  /*跳到登录页*/
  redirectLogin: function(){
    app.redirectLogin();
  },

  /**/
  setLoadingMore: function(){
    this.setData({
      loadingMore:null
    });
  },


  /*退出登录*/
  loginOut: function(){
    var that = this;
    request.requestLoginOut('', (res) => {
      app.globalData.isLogin = false;
      //that.setLoadingMore();
      wx.navigateTo({
        url: '../login/login'
      });
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
