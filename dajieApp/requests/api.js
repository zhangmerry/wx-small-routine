const API_BASE = 'https://m.dajie.com/miniapp';

module.exports = {
	API_LOGIN: API_BASE + '/login/loginDj',   //登录
	API_REGISTER: API_BASE + '/reg/register',   //注册
	API_SEND_REGCODE: API_BASE + '/reg/sendRegCode',   //发送验证码
	API_JOB_SEARCH: API_BASE + '/job/search',   //职位搜索
	API_JOB_DETAIL: API_BASE + '/job',  //职位详情+投递
	API_MINE_FEEDBACK: API_BASE + '/job/apply/feedBacks', //投递反馈
	API_REMUSE_COMPELETE: API_BASE + '/job/checkResumeComplete', //检查简历完整度
	API_MINE_REMUSE: API_BASE + '/resume/home', //简历详情页
	API_MINE_INDEX: API_BASE + '/resume/simpleuser', //我的首页
	API_MINE_SUBSCRIBE: API_BASE + '/subscribe/getSubscribes', //我的订阅
	API_SESSION_KEY: API_BASE + '/account/jsCode2Session', //获取 3rd_session_key
	API_ERWEI_CODE: API_BASE + '/scan/callback?code=', //获取二维码内容
	API_LOGINOUT: API_BASE + '/logout/logoutDj' //退出登录
}
