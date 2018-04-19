/**
 * Created by super on 2016/5/26.
 */
module.exports = {

    ErrorCode_Success:'000',
    ErrorCode_Message:'登录成功',
    ErrorCode_Success_Message:'返回成功',

    ErrorCode_Error:'002',
    ErrorCode_Error_Message:'登录失败',
    ErrorCode_Error_TryToRegister_Failed_Message:'注册失败，请重试',
    ErrorCode_Error_BindedWeChat:'00201',
    ErrorCode_Error_BindedWeChat_Message:'输入的手机号已经绑定其他微信，请重试',
    ErrorCode_Error_BindedWeChat_Failed:'00202',
    ErrorCode_Error_BindedWeChat_Failed_Message:'微信绑定手机号失败',
    ErrorCode_Error_WechatLogin_Failed:'00203',
    ErrorCode_Error_WechatLogin_Failed_Message:'该微信账户在系统中不存在，请使用微信注册',

    ErrorCode_Null:'004',
    ErrorCode_Null_Message:'查询为空',
    ErrorCode_Null_Pol_Null:'00401',
    ErrorCode_Null_Message_Pol_Null:'用户只能修改自己创建的策略的说明',
    ErrorCode_Out_Message:'退出成功',
    ErrorCode_Success_Query:'获取成功',
    ErrorCode_IsLogin:'010',
    ErrorCode_IsLogin_Meg:'用户已经登录',
    ErrorCode_IsLogin_No:'011',
    ErrorCode_IsLogin_No_Meg:'用户未登录',
    ErrorCode_Windows:'020',
    ErrorCode_Windows_Meg:'pc端不能访问获取手机验证码',
    ErrorCode_Meg_Syn:'策略同步成功！',
    ErrorCode_WeChat:'030',        // 绑定微信账户
    ErrorCode_WeChat_Meg:'绑定微信账户',
    ErrorCode_No_WeChat:'031',     // 未绑定微信账户
    ErrorCode_No_WeChat_Meg:'未绑定微信账户',
    ErrorCode_FindSuccess:'040',//成功找到文件
    ErrorCode_FindSuccess_Msg:'查找文件成功',
    ErrorCode_FindFail:'041',//成功找到文件
    ErrorCode_FindFail_Msg:'查找文件失败',
    ErrorCode_ImgUploadFail:'042',
    ErrorCode_ImgUploadFail_Msg:'头像上传失败',

    ErrorCode_Failed:'100', //失敗
    ErrorCode_Failed_Message:'加载失败，请稍后重试~',
    ErrorCode_Failed_Message_stockProductTop:'获取数库行业分类失败',
    ErrorCode_Failed_Message_csfIndexRatioDetail:'获取行业/概念指数成分股涨跌幅详情失败',
    ErrorCode_Failed_Message_dateTimeError:'开始时间必须小于结束时间',

    ErrorCode_InternetError:'110', //请求失败
    ErrorCode_InternetError_Message:'加载失败，请稍后重试~', //请求失败

    ErrorCode_UnknowError:'120', //未知错误
    ErrorCode_UnknowError_Message:'加载失败，请稍后重试~', //未知错误

    //---------------------------数库返回code
    ErrorCode_Success_OpenAPI:'200',  //成功

    //---------------------------落地数据返回code
    ErrorCode_Success_Service:'000',  //成功

    //---------------------------Java返回code
    ErrorCode_Success_JAVA:'000'  //成功

};