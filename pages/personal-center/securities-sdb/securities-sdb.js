var interval = null //倒计时函数


import Api from '../../../utils/config/api.js';
import { GLOBAL_API_DOMAIN } from '../../../utils/config/config.js';
var utils = require('../../../utils/util.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTime: 61,
    _build_url: GLOBAL_API_DOMAIN,
    butTxt:'获取验证码',
    phoneNum:'',//手机号码
    codeNum:'',   //输入的验证码
    verifyId:'',//后台返回的验证码
    isClick:false,
    istouqu:false,
    isBack:false,
    isabss:false,
    referrer:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('options:',options);
    this.findByCode();
    if(options.back == 1){
      this.setData({
        isBack:true
      })
    }
    if(options.userId){
      this.setData({
        referrer: options.userId
      })
    }
    let q = decodeURIComponent(options.q)
    if (q) {
      if (utils.getQueryString(q, 'flag') == 6) {
        let _ref = utils.getQueryString(q, 'userId');
        this.setData({
          referrer: _ref
        })
      }
    }
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
   
  },

  findByCode: function () { //通过code查询用户信息
    let that = this;
    wx.login({
      success: res => {
        if (res.code) {
          let _parms = {
            code: res.code
          }
          Api.getOpenId(_parms).then((res) => {
            console.log("getOpenId_parms:",_parms)
            app.globalData.userInfo.openId = res.data.data.openId;
            app.globalData.userInfo.sessionKey = res.data.data.sessionKey;
            if (res.data.data.unionId) {
              app.globalData.userInfo.unionId = res.data.data.unionId;
              that.getmyuserinfo();
            } else {
              that.setData({
                istouqu:true
              })
            }
          })
        }
      }
    })
  },

  againgetinfo: function () { //请求用户授权获取获取用户unionId
    let that = this;
    wx.getUserInfo({
      withCredentials: true,
      success: function (res) {
        let _pars = {
          sessionKey: app.globalData.userInfo.sessionKey,
          ivData: res.iv,
          encrypData: res.encryptedData
        }
        Api.phoneAES(_pars).then((resv) => {
          if (resv.data.code == 0) {
            that.setData({
              istouqu: false
            })
            let _data = JSON.parse(resv.data.data);
            app.globalData.userInfo.unionId = _data.unionId;
            app.globalData.userInfo.openId = _data.openId;
            that.getmyuserinfo();
          }
        })
      }
    })
  },

  getmyuserinfo: function () { //从自己的服务器获取用户信息
    let _parms = {
      openId: app.globalData.userInfo.openId,
      unionId: app.globalData.userInfo.unionId
    }, that = this;
    console.log("getmyuserinfo_parms:",_parms);
    Api.addUserUnionId(_parms).then((res) => {
      if (res.data.data) {
        app.globalData.userInfo.userId = res.data.data;
        wx.request({  //从自己的服务器获取用户信息
          url: this.data._build_url + 'user/get/' + res.data.data,
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            if (res.data.code == 0) {
              let data = res.data.data;
              for (let key in data) {
                for (let ind in app.globalData.userInfo) {
                  if (key == ind) {
                    app.globalData.userInfo[ind] = data[key]
                  }
                }
              };
              console.log('app.globalData.userInfo:', app.globalData.userInfo)
              if (data.mobile) {
                wx.switchTab({
                  url: '../../index/index'
                })
              }
            }
          }
        })
      }
    })
  },
  changePhone: function (e) {  //监听手机号输入
    let _value = e.detail.value, RegExp = /^[1][3456789][0-9]{9}$/;
    if (!_value) {
      this.setData({
        phoneNum:''
      })
    }
    if (RegExp.test(_value)) {  //校验手机号码 
      this.setData({
        phoneNum:_value,
        isClick:true
      })
    }else{
      clearInterval(interval);
      this.setData({
        isClick: false,
        isabss: false,
        codeNum:'',
        verifyId:'',
        butTxt: '获取验证码'
      })
    }
  },

  changeCode: function (e) {//监听验证码输入
    let _value = e.detail.value;
    if (!_value) {
      this.setData({
        codeNum: ''
      })
    }
    if (_value.length == 4) {
      this.setData({
        codeNum: _value
      })
    }
  },
  
  getVerificationCode() {   //点击获取验证码
    console.log('getVerificationCode')
    let that = this;
    if(this.data.isabss){
      return
    }
    this.setData({
      isabss:true
    })
    if (this.data.phoneNum) {
      let _parms = {
        shopMobile: that.data.phoneNum,
        userId: app.globalData.userInfo.userId,
        userName: app.globalData.userInfo.userName
      }
      console.log('_parms:', _parms);
      Api.sendForRegister(_parms).then((res) => {
        if (res.data.code == 0) {
          that.setData({
            verifyId: res.data.data.verifyId,
            veridyTime: res.data.data.veridyTime
          })
          that.Countdown();
        
          that.setData({
            isclick: false
          })
        }
      })
    }else{
      wx.showToast({
        title: '请输入电话号码',
        icon: 'none',
        mask: 'true',
        duration: 2000
      })
    }
      
  },

  Countdown: function () {  //倒计时
    let that = this, currentTime = that.data.currentTime;
    interval = setInterval(function () {
      currentTime--;
      that.setData({
        butTxt: currentTime + '秒'
      })
      if (currentTime <= 0) {
        clearInterval(interval)
        that.setData({
          butTxt: '获取验证码',
          currentTime: 61,
          isClick: false
        })
      }
    }, 1000)
  },
  
  registered:function(){//点击注册（领红包）按钮  ,核验验证码
    console.log('registered')
      let that = this;
      if (this.data.phoneNum){
        if (this.data.codeNum){
          if (this.data.codeNum == this.data.verifyId){
            console.log("userInfo123:", app.globalData.userInfo);
            let _parms = {
              shopMobile: this.data.phoneNum,
              SmsContent: this.data.verifyId,
              userId: app.globalData.userInfo.userId,
              userName: app.globalData.userInfo.userName
            }
            console.log('_parms:', _parms)
            // return;
            Api.isVerify(_parms).then((res) => {
              if (res.data.code == 0) {
                app.globalData.userInfo.userId=res.data.data;
                that.getuserInfo();
                if (that.data.referrer){  //推荐人
                  console.log("referrer:", that.data.referrer)
                  that.setpullUser();
                }
              }
            })
          }else{
            wx.showToast({
              title: '验证码输入错误',
              icon: 'none',
              mask: 'true',
              duration: 2000
            })
            this.setData({
              codeNum:''
            })
          }
        }else{
          wx.showToast({
            title: '请输入验证码',
            icon: 'none',
            mask: 'true',
            duration: 2000
          })
        }
      }else{
        wx.showToast({
          title: '请输入电话号码',
          icon: 'none',
          mask: 'true',
          duration: 2000
        })
      }
  },

  getuserInfo: function (val) {//从自己的服务器获取用户信息
    let that = this;
    wx.request({  
      url: that.data._build_url + 'user/get/' + app.globalData.userInfo.userId,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (res.data.code == 0) {
          let data = res.data.data;
          if(val == 1){
            for (let key in data) {
              for (let ind in app.globalData.userInfo) {
                if (key == ind) {
                  app.globalData.userInfo[ind] = data[key]
                }
              }
            };
          }
          if (that.data.isBack){
            wx.navigateBack({
              data: 1
            })
          }else{
            wx.switchTab({
              url: '../../index/index'
            })
          }
        }
      }
    })
  },

  setpullUser:function(){  //上传推荐人userId
    let _parms = { userId: this.data.referrer};
    Api.setPullUser(_parms).then((res)=>{
      if(res.data.code == 0){
        console.log('res:',res)
      }
    })
  }
})



