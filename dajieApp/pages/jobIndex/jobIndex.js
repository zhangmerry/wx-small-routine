//index.js
//获取应用实例
var request = require('../../requests/request.js');
var component = require('../../utils/component.js');
const app = getApp();

Page({
  data: {
    scrollHeight: 0,  //屏幕高度
    loadingMore: false,  //是否加载更多
    jobList: [],  //job列表
    keyword: '',  //关键词
    pageIndex: 1, //页数
    isLastPage: 0,  //是否最后一页
    isNet: true,
    //搜索数据
    jobType: null,
    city: null,
    salary: null
  },

  onLoad: function () {
    var that = this;
    if(wx.showShareMenu) {
      wx.showShareMenu({
        withShareTicket: true
      });
    }
    component.isNetwork.call(that, function(){
      if(that.data.isNet){
        requestData.call(that);
      }
    });
  },

  onReady: function(){

  },

  onShow: function () {
    var that = this;
    this.setData({
      keyword: ''
    });
    wx.getSystemInfo({
      success: (res) => {
        that.setData({
          scrollHeight: res.windowHeight - (100 * res.windowWidth / 750)
        });
      }
    });
  },
  //上拉触底
  onReachBottom: function () {
    var that = this;
    if (that.data.loadingMore) {
      return;
    }
    if(that.data.isLastPage) {
      return;
    }
    requestData.call(that);
  },

  //跳到详情页
  toDetailPage: function(e){
    var bid = e.currentTarget.dataset.bid;
    wx.navigateTo({
      url: '../jobDetail/jobDetail?jid='+bid
    });
  },

  //搜索提交
  searchSubmit: function(e){
    wx.navigateTo({
      url: '../searchResult/searchResult?keyword='+e.detail.value
    });
  },

  //分享
  onShareAppMessage: function (res) {
    var options = {
      title: '大街网 | 社会职位招聘',
      desc: '年轻人的社交招聘神器',
      path: '/pages/jobIndex/jobIndex'
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
    keyword: _this.data.keyword,
    page: _this.data.pageIndex
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
  }, null, () => {

  }, () => {
    _this.setData({
      loadingMore: false
    });
  });
}

