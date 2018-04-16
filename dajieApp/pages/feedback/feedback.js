// pages/feedback/feedback.js
var request = require('../../requests/request.js');
var component = require('../../utils/component.js');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLastPage: false,
    list: [],
    pageIndex: 1,
    loadingMore: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    component.isNetwork.call(this);
    requestData.call(this);
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
    if(this.data.loadingMore) {
      return;
    }
    if(this.data.isLastPage) {
      return;
    }
    requestData.call(this);
  }
});

function requestData() {
  var _this = this;
  var data = {
    page: this.data.pageIndex,
    pageSize: 10
  };
  _this.setData({
      loadingMore: true
    });
  console.log('pageIndex-----'+data.page);
  request.requestFeedback(data, (res) => {
    if(res.statusCode == 0) {
      _this.setData({
        list: _this.data.list.concat(res.data.list),
        pageIndex: data.page + 1,
        isLastPage: res.data.isLastPage
      });
    } else {

    }
  }, () => {
    app.redirectLogin();
  }, () => {

  }, () => {
    _this.setData({
      loadingMore: false
    });
  });
}
