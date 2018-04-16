// pages/jobDetail/jobDetail.js
var request = require('../../requests/request.js');
var component = require('../../utils/component.js');
var showToast = require('../../showToast/showToast.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    jid: null,
    data: {},
    isDeliver: false,
    canIUse: wx.canIUse('button.open-type.contact'),
    loadingMore: null  //是否正在加载
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.setData({
      jid: (options ? options.jid : that.data.jid)
    });
    if(wx.showShareMenu) {
      wx.showShareMenu({
        withShareTicket: true
      });
    }
    component.isNetwork.call(this);
    this.requestData(this.data.jid);
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /*请求数据*/
  requestData: function(jid){
    var that = this;
    this.setData({
        loadingMore: true
    });
    request.requestJobDetail(jid,'', (res) => {
      if(res.statusCode == 0) {
        that.setData({
          data: res.data,
          isDeliver: res.data.jobInfo.hasApply
        });
      } else {

      }
    }, null, () => {

    }, () => {
      that.setData({
        loadingMore: false
      });
    });
  },

  /*立即投递*/
  deliver: function(){
    var that = this;
    component.deliver({jid: this.data.jid}, (res) => {
      if(res.statusCode == 0) {
        console.log('投递成功！');
        //改变状态
        that.setData({
          isDeliver: true
        });
      }
    });
  },
  /*跳到首页*/
  redirectIndex: function(){
    wx.switchTab({
      url: '../jobIndex/jobIndex'
    });
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

  },

  /**
   * 用户点击右上角分享
   */
  //分享
  onShareAppMessage: function (res) {
    var jid = this.data.jid;
    var data = this.data.data.jobInfo;
    var options = {
      title: data.jobName+data.salary,
      desc: data.jobName+data.salary,
      path: '/pages/jobDetail/jobDetail?jid='+jid
    };
    return {
      title: options.title,
      desc: options.desc,
      path: options.path,
      success: function(res) {
        // 转发成功
      },
      fail: function(res) {
        // 转发失败
      }
    }
  }
});
