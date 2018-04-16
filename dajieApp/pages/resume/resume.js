// pages/resume/resume.js
var request = require('../../requests/request.js');
var component = require('../../utils/component.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    data: {},
    resumeStatus: '',
    loadingMore: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    component.isNetwork.call(this);
    this.requestResumeDetail();
  },

  /*请求数据*/
  requestResumeDetail: function(){
    var that = this;
    this.setData({
        loadingMore: true
    });
    //var p = new Promise(function(resolve, reject){
      request.requestResumeDetail('', (res) => {
        if(res.statusCode == 0) {
          that.setData({
            data: res.data,
            resumeStatus: res.data.resumeStatus
          });
          wx.setNavigationBarTitle({
            title: '简历完整度'+this.data.resumeStatus+'%'
          });
        } else {

        }
      }, () => {
        wx.navigateTo({
          url: '../login/login'
        });
       }, () => {}, () => {
        that.setData({
          loadingMore: false
        });
       });
    //});
    //return p;
  },

  //扫码
  canCode: function(){
    wx.scanCode({
      success: (res) => {
        var content = res.result;
        request.requestErweiCode(content, (res) => {
          if(res.statusCode == 0) {
            console.log('扫码成功content--'+content);
          }
        }, () => {
          wx.navigateTo({
            url: '../login/login'
          });
        });
      }
    });
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
