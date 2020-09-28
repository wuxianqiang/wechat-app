const app = getApp();
const url = "https://blink-open-api.csdn.net/v1/pc/blink/newBlink";
const recommend = 'https://apinew.juejin.im/recommend_api/v1/short_msg/recommend'
let winWidth = 0
// pages/homePage/homePage.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    current: 'recommend',
    translateX: 0,
    dotFlag: false,
    theme: 'light',
    list: [
      {title: '推荐', key: 'recommend'},
      {title: '热门', key: 'hot'},
      {title: '榜单', key: 'recruit'},
      {title: '快讯', key: 'info'},
      {title: '话题', key: 'topic'},
      {title: '树洞', key: 'jandan'},
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getSystemInfo({
      success: (res) => {
        winWidth = res.windowWidth
        this.setData({ theme: res.theme })
        const theme = res.theme
        if (theme === 'dark') {
          wx.setNavigationBarColor({
            frontColor: '#ffffff',
            backgroundColor: '#111111'
          })
        } else {
          wx.setNavigationBarColor({
            frontColor: '#111111',
            backgroundColor: "#ffffff",
          })
        }
      }
    })
    wx.onThemeChange((res) => {
      this.setData({ theme: res.theme })
      const theme = res.theme
      if (theme === 'dark') {
        wx.setNavigationBarColor({
          frontColor: '#ffffff',
          backgroundColor: '#111111'
        })
      } else {
        wx.setNavigationBarColor({
          frontColor: '#111111',
          backgroundColor: "#ffffff",
        })
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
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '「摸鱼」是什么梗？',
      path: '/pages/homePage/homePage'
    }
  },
  onShareTimeline: function () {
    return {
      title: '「摸鱼」是什么梗？',
      imageUrl: '../../images/logo.png'
    }
  },
  /**
   * 用户点击标题
   */
  handleClick (e) {
    const id = e.target.dataset.id
    const index = this.data.list.findIndex(item => item.key === id)
    const componentInstance = this.selectComponent(`#${id}`)
    componentInstance && componentInstance.resetPage && componentInstance.resetPage()
    this.setData({ current: id, translateX: -index * winWidth })
  },
  /**
   * 用户返回顶部
   */
  handleDot () {
    const id = this.data.current
    const componentInstance = this.selectComponent(`#${id}`)
    componentInstance && componentInstance.setScrollTop && componentInstance.setScrollTop()
  },
  /**
   * 显示返回顶部的按钮
   */
  showDot () {
    this.setData({ dotFlag: true })
  },
  /**
   * 隐藏返回顶部的按钮
   */
  hidedot () {
    this.setData({ dotFlag: false })
  }
});
