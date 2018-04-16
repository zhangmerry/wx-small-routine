// pages/searchResult/searchResult.js
var request = require('../../requests/request.js');
var component = require('../../utils/component.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    keyword: '',
    pageIndex: 1,
    loadingMore: false,
    jobList: [],
    isLastPage: 0  //是否最后一页
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if(wx.showShareMenu) {
      wx.showShareMenu({
        withShareTicket: true
      });
    }
    this.setData({  //session失效从订阅页跳过来
      keyword: (options ? decodeURIComponent(options.keyword) : that.data.keyword)
    });
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.loadingMore) {
      return;
    }
    if(this.data.isLastPage) {
      return;
    }
    requestData.call(this);
  },

  //跳到详情页
  toDetailPage: function(e){
    var jid = e.currentTarget.dataset.jid;
    wx.navigateTo({
      url: '../jobDetail/jobDetail?jid='+jid
    });
  },

  //投递
  deliver: function(e){
    var that = this;
    var jid = e.currentTarget.dataset.jid;
    var index = e.currentTarget.dataset.index;
    component.deliver({jid: jid}, (res) => {
      if(res.statusCode == 0) {
        console.log('投递成功！');
        //改变状态
        var newJobList = that.data.jobList;
        newJobList[index].hasApply = true;
        that.setData({
          jobList: newJobList
        });
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'success',
          duration: 2000
        });
      }
    });
  },

  //搜索提交
  searchSubmit: function(e){
    this.setData({
      keyword: e.detail.value,
      pageIndex: 1,
      jobList: []
    });
    requestData.call(this);
  },

  /**
   * 用户点击右上角分享
   */
  //分享
  onShareAppMessage: function (res) {
    var keyword = this.data.keyword;
    var options = {
      title: '大街网 | 社会职位招聘',
      //desc: '年轻人的社交招聘神器',
      path: '/pages/searchResult/searchResult?keyword='+keyword
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

function requestData() {
  var _this = this;
  var data = {
    keyword: this.data.keyword,
    page: this.data.pageIndex
  };
  _this.setData({
      loadingMore: true
    });
  console.log('pageIndex---'+data.page);
  request.requestSearchJob(data, (res) => {
    if(res.statusCode == 0) {
      _this.setData({
        jobList: _this.data.jobList.concat(res.data.list),
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
