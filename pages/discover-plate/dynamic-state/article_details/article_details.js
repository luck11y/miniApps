import Api from '../../../../utils/config/api.js';
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    _id:'',    //文章ID
    details:{},   //文章数据 
    cmtdata:[],   //文章评论数据 
    interval:'',  //时间差
    commentVal:'',  //评论内容
    isComment: false,
    preview:{},    //预览数据
    userId:'1'  //虚拟ID 暂用
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.id){
      const id = options.id
      this.setData({
        _id: id
      })
      this.gettopiclist(id)
      this.getcmtlist()
    }else{
      options.content = JSON.parse(options.content)
      this.setData({
        details: options        
      })
    }
    
    // this.setcmtadd()
  },
  gettopiclist:function(id){  //获取文章内容数据
    let _parms = {
      id: id
    }
    Api.topiclist(_parms).then((res) => {
      let _data = res.data.data.list[0];
      _data.content = JSON.parse(_data.content)
      this.setData({
        details: res.data.data.list[0]
      })
    })
  },
  getcmtlist:function(){  //获取文章评论数据
    let _parms = {
      zanUserId: app.globalData.userInfo.userId ? app.globalData.userInfo.userId : this.data.userId,
      cmtType:'2',
      refId:this.data._id
    }
    Api.cmtlist(_parms).then((res) => {
      let _data = res.data.data;
      this.setData({
        cmtdata: _data
      })
    })
  },
  showAreatext: function () {  //显示发表输入框
    this.setData({
      isComment: true
    })
  },
  //获取评论输入框
  getCommentVal: function (e) {
    this.setData({
      commentVal: e.detail.value
    })
  },
  setcmtadd:function(){  //新增文章评论
    let _parms = {
      refId:this.data._id,
      cmtType:'2',
      content:this.data.commentVal,
      userId: app.globalData.userInfo.userId ? app.globalData.userInfo.userId : this.data.userId,
      userName:'测试文章评论内容',
      nickName:'测试文章评论内容'
    }
    Api.cmtadd(_parms).then((res) => {
      this.setData({
        isComment: false
      })
      this.getcmtlist()
    })
  },
 
  //跳转至所有评论
  jumpTotalComment: function () {
    wx.navigateTo({
      url: '../../../index/merchant-particulars/total-comment/total-comment?id=' + this.data._id +'&cmtType=2&source=article'
    })
  },
  //评论点赞
  toLike: function (event) {
    let that = this
    let id = event.currentTarget.id
    let ind=''
    for (let i = 0; i < this.data.cmtdata.list.length; i++) {
      if (this.data.cmtdata.list[i].id == id) {
        ind = i;
      }
    }
    let _parms = {
      refId: id,
      type: '4',
      userId: app.globalData.userInfo.userId ? app.globalData.userInfo.userId : this.data.userId,
    }
    Api.zanadd(_parms).then((res) => {
      if (res.data.code == 0) {
        wx.showToast({
          title: '点赞成功'
        })
        var _cmtdata = that.data.cmtdata
        _cmtdata.list[ind].isZan = 1;
        _cmtdata.list[ind].zan++;
        that.setData({
          cmtdata: _cmtdata
        });
      }
    })
  },
  //取消点赞
  cancelLike: function (event) {
    let that = this
    let id = event.currentTarget.id
    let ind = ''
    for (let i = 0; i < this.data.cmtdata.list.length; i++) {
      if (this.data.cmtdata.list[i].id == id) {
        ind = i;
      }
    }
    let _parms = {
      refId: id,
      type: '4',
      userId: app.globalData.userInfo.userId ? app.globalData.userInfo.userId : this.data.userId,
    }
    Api.zandelete(_parms).then((res) => {
      if (res.data.code == 0) {
        wx.showToast({
          title: '取消成功'
        })
        let _cmtdata = that.data.cmtdata
        _cmtdata.list[ind].isZan = 0;
        _cmtdata.list[ind].zan == 0 ? _cmtdata.list[ind].zan : _cmtdata.list[ind].zan--;
        that.setData({
          cmtdata: _cmtdata
        });
      }
    })
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
  


  
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '分享文章',
      path: '/pages/discover-plate/dynamic-state/article_details/article_details',
      success: function (res) {
        // 转发成功
        wx.showToast({
          title: '转发成功',
          icon: 'success',
          duration: 2000
        })
      },
      fail: function (res) {
        // 转发失败
        wx.showToast({
          title: '转发失败成功',
          icon: 'none',
          duration: 2000
        })
      }
    }
  }

})