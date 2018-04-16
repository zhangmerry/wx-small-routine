var api = require('./api.js');
var util = require('../utils/util.js');
//var Mock = require('../utils/mock.js');
var showToast = require('../showToast/showToast.js');

const app = getApp();
let isDebug = false;

/*网络请求*/
function request(method='GET', url, data, successCb, noLogin, errorCb, completeCb) {
	app.checkSession(() => {
		//var timer = setInterval(function(){
			//var search = wx.getStorageSync("third_session_key");
	        //if(search)  {
	        	wx.request({
					url: url,
					method: method,
					data: data,
					header: {
						'third-session': wx.getStorageSync("third_session_key"),
						'content-type': 'application/x-www-form-urlencoded'
					},
					success: function(res){
						res = res.data;
						if(res.statusCode == 0) {
							util.isFuction(successCb) && successCb(res);
						} else {
							var code = res.data.code;
							if(code == 1000) {//请求失败
								console.log('请求失败');
							} else if(code == 1001) {//会话已过期, 请重新获取有效的3rd_session
								app.globalData.third_session_key = '';
								app.wxLogin(() => {
									var page = getCurrentPages().pop();
									if (page == undefined || page == null) {
										return;
									}
									page.onLoad();
								});
							} else if(code == 1002) {//请登录后操作
								util.isFuction(noLogin) && noLogin();
							} else if(code == 1003) {//用户状态错误
								console.log('用户状态错误');
							} else {
								if(errorCb) {
									util.isFuction(errorCb) && errorCb();
								} else {
									showToast.showToast({
								      title: res.data.msg,
								      duration: 2000
								    });
								}

							}
						}
					},
					fail: function(){
						util.isFuction(errorCb) && errorCb();
					},
					complete: function(){
						//timer && clearInterval(timer);
						util.isFuction(completeCb) && completeCb();
					}
				});
	        //}
		//}, 1000);

	});
}


/*搜索职位*/
function requestSearchJob( data, successCb, noLogin=null, errorCb, completeCb) {
	if(!isDebug) {
		request('GET', api.API_JOB_SEARCH, data, successCb, noLogin, errorCb, completeCb);
	} else {
		var res = Mock.mock({
			"status" : "SUCCESS",
			"statusCode":0,
			"data": {
				"isLastPage" : 0,
				"list|5-10": [{
			      "jobName":"前端开发工程师",//职位名称
				  "corpName":"阿里巴巴网络科技有限公司",//公司名
				  "corpLogo":"",//公司LOGO
				  "isVip":false, //是否B端公司
				  "isFav":false, //职位是否已收藏
				  "salary":"20-25K",//薪酬
				  "kind":0, //0:全职；1：兼职；2：实习
				  "tagType":0, //0:没有;2:置顶;3:急聘
				  "tagTypes":[2,3], //2 置顶，3 急聘
				  "experience":"3年经验",//⼯工作经验
				  "cityNames":"北京",//城市名称
				  "publishTime":"",//发布时间
				  "hasApply|1":false //是否投递
			    }]
			}
		});
		util.isFuction(successCb) && successCb(res);
	}
}
/*搜索职位结果页*/
function requestSearchResult(data, successCb, noLogin=null, errorCb, completeCb){
	if(!isDebug) {
		request('GET', api.API_JOB_SEARCH, data, successCb, noLogin, errorCb, completeCb);
	} else {
		var res = Mock.mock({
			"jobList|5-10": [{
		      'id|+1': 1,
		      'imgLogo': '',
		      'name': '前端开发工程师',
		      'corp': '阿里巴巴网络科技有限公司',
		      'city': '北京',
		      'year': '5-10年',
		      'experence': '3年经验',
		      'isJpBg|1': false,
		      'isjp|1': false,
		      'isd|1': false,
		      'iscorp|1': false,
		      'isDelivery|1': false
		    }]
		});
		util.isFuction(successCb) && successCb(res);
	}
}
/*职位详情页*/
function requestJobDetail(id, data, successCb, noLogin=null, errorCb, completeCb){
	if(!isDebug) {
		request('GET', api.API_JOB_DETAIL+'/'+id+'/detail', data, successCb, noLogin, errorCb, completeCb);
	} else {
		var res = Mock.mock({
			"status":"SUCCESS",
			"statusCode":0,
			"data":{
		        "jobInfo" : {
					"jobSeq" : 0,
					"jid" : "xxxx-xxxx-xxxx-xxxxx",
					"jobName" : "职位名称",
					"salary" : "7k/月",
					"corpName" : "公司名",
					"createDate" : "1天前",
					"cityName" : "北京",
					"experienceName" : "应届⽣生",
					"degreeName" : "本科",
					"isFullTime" : true,
					"isPartTime" : true,
					"isIntern" : true,
					"internshipDays" : "",
					"keywords" : ["五险⼀一金", "带薪年假","五险⼀一金", "带薪年假"],
					"intro" : "职位详情",
					"address" : "⾯面试地址",
					"salarySettling" : "结算⽅方式",
					"headCount" : 10, //招聘⼈人数
					"hasApply|1": false
				},
				"corpInfo" : {
					"corpId" : 0,
					"corpName" : "公司名",
					"corpLogo" : "https://f1.dajieimg.com/n/corp_square_logo/T1c4bvBvDT1RXrhCrK_b.jpg",
					"industryName" : "互联⽹网",
					"cityName" : "北北京",
					"qualityName" : "国企",
					"isBusinessCorp" : false,
					"corpScale": "10-49人"
				},
				"hrInfo" : {
					"uid" : 0,
					"avatar" : "https://f1.dajieimg.com/n/corp_square_logo/T1c4bvBvDT1RXrhCrK_b.jpg",
					"name" : "陈测测",
					"sex" : 1,
					"position" : "测试",
					"jobCnt" : 1,
					"resumeHandle" : 50,
					"hrHomePage" : "https://job.dajie.com/",
					"isBussinessUser": true
				}
		    }
		});
		util.isFuction(successCb) && successCb(res);
	}
}
/*检查简历完整度*/
function requestResumeComplete(data, successCb, noLogin=null, errorCb, completeCb) {
	if(!isDebug) {
		request('GET', api.API_REMUSE_COMPELETE, data, successCb, noLogin, errorCb, completeCb);
	} else {
		var res = Mock.mock({
			"status" : "SUCCESS",
			"statusCode":1,
			"data": {
		        "code" : 1,
				"msg" : "抱歉，您的简历完整度低，暂⽆无法投递。"
		    }
		});
		util.isFuction(successCb) && successCb(res);
	}
}
/*投递请求*/
function requestDeliver(id, data, successCb, noLogin=null, errorCb, completeCb) {
	if(!isDebug) {
		request('GET', api.API_JOB_DETAIL+'/'+id+'/apply', data, successCb, noLogin, errorCb, completeCb);
	} else {
		var res = Mock.mock({
			"status" : "SUCCESS",
			"statusCode":0,
			"data" : {
				"code" : 1,
				"msg" : "职位不存在"
			}
		});
		util.isFuction(successCb) && successCb(res);
	}
}
/*我的首页*/
function requestMineIndex(data, successCb, noLogin=null, errorCb, completeCb) {
	if(!isDebug) {
		request('GET', api.API_MINE_INDEX, data, successCb, noLogin, errorCb, completeCb);
	} else {
		var res = Mock.mock({
			"status" : "SUCCESS",
			"statusCode":0,
			"data":{
		        "schoolOrCorp" :"大街网",
				"majorOrPosition":"java开发",
				"name" :"李四",
				"avatar":"xxx",
			    "resumeStatus":11,        //简历完整度
			    "isCompleted": 1  //完整
			},
		});
		util.isFuction(successCb) && successCb(res);
	}
}
/*简历详情页*/
function requestResumeDetail(data, successCb, noLogin=null, errorCb, completeCb){
	if(!isDebug) {
		request('GET', api.API_MINE_REMUSE, data, successCb, noLogin, errorCb, completeCb);
	} else {
		var res = Mock.mock({
			"status" : "SUCCESS",
			"statusCode":0,
			"data":{
		        "baseInfo":{
		            "completed":false,
		            "avatar":null,   //头像
		            "name":'姓名',     //姓名
		            "sex":0,           //性别id
		            "sexName":"",     //性别
		            "domicile":0,      //户口ID
		            "domicileName":"北京",  //户口
		            "birthday":null,    //出生时间
		            "liveCity":0,
		            "liveCityName":"北京",   //居住地
		            "workYears":0,      //工作年限（数字）
		            "workYearsName":"5年",   //工作年限（例如5年）
		            "status":1,
		            "statusName":"正在找工作，快速到岗",
		            "mobile":"1519****789",     //手机号
		            "email":"邮箱",      //邮箱
		            "qq":"812****731",
		            "idCardNum":"21398978908777****",  //身份证
		            "height":0,       //身高
		            "weight":0,         //体重
		            "nation":"汉",     //国际
		            "political":0,
		            "politicalName":"党员",    //政治面貌
		            "marriage":0,
		            "marriageName":"已婚",    //婚否
		            "address":"北京市，海淀区，王庄路1号清华同方大",         //住址
		            "cardId":0,
		            "cardType":0,
		            "userTitle":"",
		            "age":0,              //年龄
		            "previewUrl":"",
		            "mobileOk":false,
		            "corpName":"公司名",         //公司名
					"position":"职位",    //职位
					"positionLevel":"职位级别"   //职位级别
		        },
		        "intentionInfo":{
		            "completed":false,
		            "huntJobType":"全职",                //工作类型
		            "positionIndustryStr":"所属行业所属行业所属行业所属行业",     //所属行业
		            "positionFunctionStr":"职位类别职位类别职位类别",      //职位类别
		            "cityStr":"工作城市",           //工作城市
		            "salaryArea":"薪资范围"         //薪资范围
		        },
		        "resumeStatus":11,        //简历完整度
		        "isCompleted":1
		    }
		});
		util.isFuction(successCb) && successCb(res);
	}
}
/*投递反馈*/
function requestFeedback(data, successCb, noLogin=null, errorCb, completeCb) {
	if(!isDebug) {
		request('GET', api.API_MINE_FEEDBACK, data, successCb, noLogin, errorCb, completeCb);
	} else {
		var res = Mock.mock({
			"status" : "SUCCESS",
			"statusCode":0,
			"data": {
		        "curPage": 1,
		        "totalPage": 1,
		        "isLastPage|1": true,
		        "list|8-12": [
		            {
		                "jobName": "测试",
		                "feedBackDate": "11-24 09:09",
		                "feedBackDes": "筛选不通过",
		                "corpName": "大街网",
		                "corpLogo": "https://f1.dajieimg.com/n/micro_blog/T1Jzd_BvKT1RXrhCrK_m.jpg"
		            }
		        ]
		    }
		});
		util.isFuction(successCb) && successCb(res);
	}
}
/*我的订阅*/
function requestSubscribe(data, successCb, noLogin=null, errorCb, completeCb) {
	if(!isDebug) {
		request('GET', api.API_MINE_SUBSCRIBE, data, successCb, noLogin, errorCb, completeCb);
	} else {
		var res = Mock.mock({
			"status" : "SUCCESS",
			"statusCode":0,
			"data":{
				"fullTimeIntentions|3-5": [ //全职
			        {
			            "cityName": "北京",
			            "industry": "银行",
			            "todayCount": 1,
			            "salary": "3k-5k",
			            "totalCount": 321,
			            "subTile": "全职+销售代表+其他设计"
			        }
			    ],
			    "partTimeIntentions|3-5": [//兼职
			        {
			            "cityName": "北京",
			            "industry": "银行",
			            "todayCount": 1,
			            "salary": "3k-5k",
			            "totalCount": 321,
			            "subTile": "兼职+销售代表+其他设计"
			        }
			    ],
			     "internIntentions|3-5": [//实习
			        {
			            "cityName": "北京",
			            "industry": "银行",
			            "todayCount": 1,
			            "salary": "3k-5k",
			            "totalCount": 321,
			            "subTile": "实习+销售代表+其他设计"
			        }
			    ]
			}
		});
		util.isFuction(successCb) && successCb(res);
	}
}
/*获取3rd_session_key*/
/*function requestSessionKey(data) {
	if(!isDebug) {
		wx.request({
          url: api.API_SESSION_KEY,
          method: 'GET',
          data: data,
          success: function(res){
            if(res.statusCode == 0) {
              var thirdSession = res.data.third_session_key;
              console.log(thirdSession);
              wx.setStorageSync('third_session_key', thirdSession);
            } else {}
          },
          fail: function(){
            console.log('error');
          },
          complete: function(){
            console.log('complete');
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
}*/
/*登录*/
function requestLogin(data, successCb, errorCb, completeCb) {
	if(!isDebug) {
		request('POST', api.API_LOGIN, data, successCb, null, errorCb, completeCb);
	} else {
		var res = Mock.mock({
			"status" : "SUCCESS",
			"data": {
		        "msg":"该帐号已被禁用",
		        "redirect":"",
		        "code":"0"
		    }
		});
		util.isFuction(successCb) && successCb(res);
	}
}
/*注册*/
function requestRegister(data, successCb, errorCb, completeCb) {
	if(!isDebug) {
		request('POST', api.API_REGISTER, data, successCb, null, errorCb, completeCb);
	} else {
		var res = Mock.mock({
			"status" : "SUCCESS",
			"data": {
		        "msg":"注册失败",
		        "redirect":"",
		        "code":"0"
		    }
		});
		util.isFuction(successCb) && successCb(res);
	}
}
/*退出登录*/
function requestLoginOut(data, successCb, errorCb, completeCb) {
	if(!isDebug) {
		request('GET', api.API_LOGINOUT, data, successCb, null, errorCb, completeCb);
	} else {
		var res = Mock.mock({
			"status" : "SUCCESS",
			"statusCode":0,
			"data": {
		        "code":"0"
		    }
		});
		util.isFuction(successCb) && successCb(res);
	}
}
/*发送注册验证码*/
function requestSendRegcode(data, successCb, errorCb, completeCb) {
	if(!isDebug) {
		request('POST', api.API_SEND_REGCODE, data, successCb, null, errorCb, completeCb);
	} else {
		var res = Mock.mock({
			"status" : "SUCCESS",
			"data": {
		        "msg":"账号错误",
		        "redirect":"",
		        "code":"0"
		    }
		});
		util.isFuction(successCb) && successCb(res);
	}
}
/*获取二维码内容*/
function requestErweiCode(data, successCb, errorCb, completeCb) {
	if(!isDebug) {
		request('POST', api.API_ERWEI_CODE+data, successCb, null, errorCb, completeCb);
	} else {
		var res = Mock.mock({
			"status" : "SUCCESS",
			"statusCode":0,
			"data": {

		    }
		});
		util.isFuction(successCb) && successCb(res);
	}
}
module.exports = {
	requestSearchJob: requestSearchJob,
	requestSearchResult: requestSearchResult,
	requestDeliver: requestDeliver,
	requestResumeDetail: requestResumeDetail,
	requestJobDetail: requestJobDetail,
	requestFeedback: requestFeedback,
	requestResumeComplete: requestResumeComplete,
	requestMineIndex: requestMineIndex,
	requestSubscribe: requestSubscribe,
	requestLogin: requestLogin,
	requestRegister: requestRegister,
	requestSendRegcode: requestSendRegcode,
	//requestSessionKey: requestSessionKey,
	requestErweiCode: requestErweiCode,
	requestLoginOut: requestLoginOut
}
