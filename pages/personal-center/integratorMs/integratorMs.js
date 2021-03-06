import {
  GLOBAL_API_DOMAIN
} from '../../../utils/config/config.js';
import Api from '../../../utils/config/api.js'
var utils = require('../../../utils/util.js')
var app = getApp();

Page({
  data: {
    _build_url: GLOBAL_API_DOMAIN,
    speciesList:'',
    data: [],
    page: 1,
    flag: true,
    isdata: false,
    total:0,
  },
  // 金币商城直通车
  goldPath: function () {
    wx.showToast({
      title: '待更新...',
      icon: 'none',
      duration: 2000
    })
  },
  onLoad:function(){
    this.getTicketaBlancees(); //金币余额
    this.getTicketList(); //获取劵列表
  },

  getTicketaBlancees: function () { //金币余额   入参:userId
    let _parmes = {
      userId: app.globalData.userInfo.userId,   //userId
    };
    Api.getTicketaBlance(_parmes).then((res) => {
      this.setData({
        aggregate: res.data
      });
    });
  },

  getTicketList: function () { //获取劵列表   入参:userId
    let _parms = {
      userId: app.globalData.userInfo.userId,   //userId     
      type: 2,
      page: this.data.page,
      rows: 10
    };
    Api.speciesList(_parms).then((res) => {
      wx.hideLoading();
      if (res.data.code == 0) {
        let _data = res.data.data.list;
        if (!_data){
          return false;
        }
        let posts = this.data.data;
        for (let i = 0; i < _data.length; i++) {
          posts.push(_data[i])
        }
        if (posts.length > 0) {
          this.setData({
            isdata: true
          })
        } 
        if(_data.length <= 0) {
          this.setData({
            flag: false
          })
        }
        this.setData({
          data: posts,
          total:res.data.data.total
        })
      } else {
        this.setData({
          flag: false
        })
      }
    });
  },
  
  heaven:function(){ //关于金币
    wx.navigateTo({
      url: 'available-m/available-m',
    })
  },
  //用户上拉触底
  onReachBottom: function () {
    if (this.data.flag) {
      wx.showLoading({
        title: '加载中..'
      })
      this.setData({
        page: this.data.page + 1
      });
      this.getTicketList();
    }
  },
  //用户下拉刷新
  onPullDownRefresh: function () {
    this.setData({
      data: [],
      page: 1,
      flag: true
    });
    this.getTicketList();
  }
})