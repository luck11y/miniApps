
import Api from '../../../utils/config/api.js';
import { GLOBAL_API_DOMAIN } from '../../../utils/config/config.js';
var utils = require("../../../utils/util.js")
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    topsrc:'https://xq-1256079679.file.myqcloud.com/test_timg (1)_0.8.jpg',
    video:'https://xqmp4-1256079679.file.myqcloud.com/xq_20180426192623_wxf91e2a026658e78e.o6zAJs-7D9920jC4XTKdzt72lobs.qoerV5BJT0lc5165f156f44736d9ed650723d5d21649.mp4',
    imgs: [
      'https://xq-1256079679.file.myqcloud.com/test_timg (2)_0.8.jpg',
      'https://xq-1256079679.file.myqcloud.com/test_timg (3)_0.8.jpg',
      'https://xq-1256079679.file.myqcloud.com/test_timg (4)_0.8.jpg',
      'https://xq-1256079679.file.myqcloud.com/test_timg (5)_0.8.jpg'
    ],
    cmtdata:[],
    commentVal:'',
    isComment: false,
    user:{
      name:'Montage',
      year:'20',
      sex:'2',
      height:'160',
      num:'001',
      ticket:'831',
      match:'麻辣小龙虾'
    },
    poll:'投票',
    isvote:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },
  castvote:function(){
    this.setData({
      isvote:!this.data.isvote
    })
    if(this.data.isvote){
      this.setData({
        poll:'已投'
      })
    }else{
      this.setData({
        poll: '投票'
      })
    }
  },
  showAreatext: function () {  //显示发表输入框
    this.setData({
      isComment: true
    })
  },
  getCommentVal: function (e) { //获取评论输入框
    this.setData({
      commentVal: e.detail.value
    })
  },
  setcmtadd: function () {  //新增文章评论
    if (!this.data.commentVal) {
      wx.showToast({
        title: '请输入评论内容',
        icon: 'none',
        duration: 2000
      })
      this.setData({
        isComment: false
      })
      return false;
    } else {
      let _value = utils.utf16toEntities(this.data.commentVal)
      this.setData({
        commentVal: _value,
        isComment: false
      })
    }
    return false
    let _parms = {
      refId: this.data._id,
      cmtType: '2',
      content: this.data.commentVal,
      userId: app.globalData.userInfo.userId,
      userName: app.globalData.userInfo.userName,
      nickName: app.globalData.userInfo.nickName,
    }
    Api.cmtadd(_parms).then((res) => {
      this.setData({
        isComment: false
      })
      this.getcmtlist()
    })
  },
})