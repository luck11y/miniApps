import Api from '../../../utils/config/api.js';
var utils = require('../../../utils/util.js');
let app = getApp()

Page({
  data: {
    posts_key: [],
    nearbydatas: ['由近到远'],
    fooddatas: ["日本菜", "私房菜", "家常菜", "下午茶", "创意菜", "湖北菜", "粉面馆", "川菜", "卤味", "湘菜", "粤菜", "咖啡厅", "小龙虾", "火锅", "海鲜", "烧烤", "小吃快餐", "江浙菜", "韩国料理", "东南亚菜", "西餐", "自助餐", "面包甜点", "其他美食"],
    sortingdatas: ['人气排序'],
    page: 1,
    isScroll: true,
    ismodel: false,
    isnearby: false,
    isfood: false,
    issorting: false,
    businessCate: '',
    browSort: ''
  },
  onLoad: function (options) {
    this.getData();
  },
  onShow: function () {
    this.setData({
      posts_key:[]
    })
    this.getData()
  },
  getData: function () {
    let lat = '30.51597', lng = '114.34035';  //lat纬度   lng经度
    let _parms = {
      locationX: app.globalData.userInfo.lng ? app.globalData.userInfo.lng:lng,
      locationY: app.globalData.userInfo.lat ? app.globalData.userInfo.lat:lat,
      page: this.data.page,
      rows: 8
    }
    console.log("_parms:",_parms)
    if (this.data.businessCate) { //美食类别 
      _parms.businessCate = this.data.businessCate
    } else if (this.data.browSort) { //综合排序
      _parms.browSort = this.data.browSort
    }
    Api.shoplist(_parms).then((res) => {
      let that = this
      let data = res.data;
      wx.hideLoading()
      if (data.code == 0 && data.data.list != null && data.data.list != "" && data.data.list != []) {
        wx.stopPullDownRefresh()
        let posts = this.data.posts_key;
        let _data = data.data.list
        for (let i = 0; i < _data.length; i++) {
          _data[i].distance = utils.transformLength(_data[i].distance)
          posts.push(_data[i])
        }
        that.setData({
          posts_key: posts
        })
      }
    })
  },
  onInputText: function (e) { //获取搜索框内的值
    // this.setData({
    //   searchValue: e.detail.value
    // })
    let _parms = {
      searchKey: e.detail.value,
      locationX: app.globalData.userInfo.lng,
      locationY: app.globalData.userInfo.lat,
    }
    Api.shoplist(_parms).then((res) => {
      if (res.data.code == 0 && res.data.data.list != [] && res.data.data.list != '') {
        this.setData({
          posts_key: res.data.data.list
        });
      }
    })
  },
  // onSearchInp: function () {
  //   let _parms = {
  //     searchKey: this.data.searchValue
  //   }
  //   Api.shoplist(_parms).then((res) => {
  //     this.setData({
  //       posts_key: res.data.data.list
  //     });
  //   })
  // },
  //点击列表跳转详情
  onTouchItem: function (event) {
    wx.navigateTo({
      url: '../merchant-particulars/merchant-particulars?shopid=' + event.currentTarget.id,
    })
  },
  onReachBottom: function () {  //用户上拉触底加载更多
      this.setData({
        page: this.data.page + 1
      });
      this.getData()
  },
  onPullDownRefresh:function(){
    this.setData({
      businessCate: '',
      browSort: '',
      posts_key: [],
      page: 1
    });
    this.getData()
  },



  // 模态框 start
  openmodel: function (e) {  //打开模态框
    let id = e.currentTarget.id
    this.setData({
      ismodel: true,
      isScroll: false,
      businessCate:'',
      browSort:''
    })
    if (id == 1) {
      this.setData({
        isnearby: true
      })
    } else if (id == 2) {
      this.setData({
        isfood: true
      })
    } else if (id == 3) {
      this.setData({
        issorting: true
      })
    }
  },
  closemodel: function () {  //关闭模态框
    this.setData({
      ismodel: false,
      isnearby: false,
      isfood: false,
      issorting: false,
      isScroll: true
    })
  },
  nearby: function () {  //附近
    this.setData({
      isnearby: true,
      isfood: false,
      issorting: false
    })
  },
  goodfood: function () {  //美食
    this.setData({
      isnearby: false,
      isfood: true,
      issorting: false
    })
  },
  sorting: function () {   //综合排序
    this.setData({
      isnearby: false,
      isfood: false,
      issorting: true
    })
  },
  clicknearby: function (ev) { //附近之一
    let id = ev.currentTarget.id
    let _data = this.data.nearbydatas
    let _value = ''
    wx.getSetting({
      success: (res) => {
        if (!res.authSetting['scope.userLocation']) { // 用户未授受获取其用户信息或位置信息
          wx.showModal({
            title: '提示',
            content: '查询附近餐厅需要你授权位置信息',
            success: function (res) {
              if (res.confirm) {
                wx.openSetting({  //打开授权设置界面
                  success: (res) => {
                    if (res.authSetting['scope.userLocation']) {
                      wx.getLocation({
                        type: 'wgs84',
                        success: function (res) {
                          let latitude = res.latitude
                          let longitude = res.longitude
                          app.globalData.userInfo.lat = latitude
                          app.globalData.userInfo.lng = longitude
                        }
                      })
                    }
                  }
                })
              }
            }
          })
        } else {
          for (let i = 0; i < _data.length; i++) {
            if (id == i) {
              _value = _data[i]
            }
          }
          this.closemodel()
          this.getData()
        }
      }
    })
  },
  clickfood: function (ev) { //美食之一
    let id = ev.currentTarget.id
    let _data = this.data.fooddatas
    let _value = ''
    for (let i = 0; i < _data.length; i++) {
      if (id == i) {
        _value = _data[i]
      }
    }
    this.setData({
      businessCate: _value,
      browSort: '',
      posts_key: []
    })
    this.closemodel()
    this.getData()
  },
  clicksorting: function (ev) { //综合排序之一
    let id = ev.currentTarget.id
    let _data = this.data.sortingdatas;
    let _value = ''
    for (let i = 0; i < _data.length; i++) {
      if (id == i) {
        _value = _data[i]
      }
    }
    this.closemodel()
    this.setData({
      browSort: '2',
      businessCate: '',
      posts_key: []
    })
    this.getData()
  }

  //模态框 end
})