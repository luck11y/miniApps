import Api from '../../../utils/config/api.js';
import { GLOBAL_API_DOMAIN } from '../../../utils/config/config.js';
var utils = require('../../../utils/util.js')
var app = getApp()
Page({
  data: {
    _build_url: GLOBAL_API_DOMAIN,
    picUrl: '',
    _data: 0,
  },
  onLoad: function (options) {
    this.setData({
      picUrl: options.picUrl
    })
  },
  onShow: function () {
    this.getuserNUm();//邀请人数
  },

  getuserNUm: function () {
    console.log('_build_url:', this.data._build_url)
    let that = this,userId=app.globalData.userInfo.userId;
    wx.request({
      url: this.data._build_url+'/pullUser/get/' + userId,
      success: function (res) {
        if (res.data.code == 0) {
          that.setData({
            _data: res.data.data.pullNum,
          });
        }
      }
    })
  },

  // 保存图片
  saveImgToPhotosAlbumTap: function () {
    let imgUrl = this.data.picUrl;
    wx.downloadFile({
      url: imgUrl,
      success: function (res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function (res) {
            wx.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 1500
            })
          },
          fail: function (res) {
            console.log(res)
          }
        })
      },
      fail: function () {
        console.log('fail')
      }
    })

  },
  onShareAppMessage: function () {
    return {
      title: '就差你了,一起来注册领享7劵吧',
      desc: '就差你了,一起来注册领享7劵吧',
      path: 'pages/personal-center/securities-sdb/securities-sdb?userId=' + app.globalData.userInfo.userId,
      imageUrl: 'https://xqmp4-1256079679.file.myqcloud.com/text_56225273879281812.png',
    }
  }
})
