// pages/subscriber/subscriber.js
var request = require('../../requests/request.js');
var component = require('../../utils/component.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data: {},
    isEmpty: null,
    loadingMore: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    component.isNetwork.call(this);
    this.requestData();
  },

  //请求数据
  requestData: function() {
    var _this = this;
    _this.setData({
        loadingMore: true
    });
    request.requestSubscribe('', (res) => {
      if(res.statusCode == 0) {
        var data = res.data;
        var arrLength = 0;
        if(Object.keys(data).length > 0) {
          arrLength = data.fullTimeIntentions.length + data.internIntentions.length
         + data.projectIntentions.length + data.scheduleIntentions.length;
        }
        _this.setData({
          data: res.data,
          isEmpty: (arrLength > 0 ? false : true)
        });
      } else {

      }
    }, () => {
      wx.navigateTo({
        url: '../login/login'
      });
    }, () => {

    }, () => {
      _this.setData({
        loadingMore: false
      });
    });
  },

  //点击搜索
  searchKeyword: function(e){
    var keyword = e.currentTarget.dataset.keyword;
    wx.navigateTo({
      url: '../searchResult/searchResult?keyword='+keyword
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

