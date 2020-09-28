const app = getApp()
const hot = 'https://blink-open-api.csdn.net/v1/pc/blink/newBlink'
const recommend = 'https://apinew.juejin.im/recommend_api/v1/short_msg/recommend'
const recruit = 'https://www.zhihu.com/hot'

// pages/homePage/homePage.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
      color: '#ffffff'
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
      const params = {
        cursor: '0',
        id_type: 4,
        limit: 20,
        sort_type: 300
      }
      const header = {
        'origin': 'https://juejin.im',
        'referer': 'https://juejin.im/pins/recommended'
      }
      const zhihu = {
        'content-type': 'text/html',
        'origin': 'https://www.zhihu.com',
        'referer': 'https://www.zhihu.com/hot'
      }
      wx.getSystemInfo({
        success: (res) => {
          const theme = res.theme
          if (theme === 'dark') {
            this.setData({ color: '#111111' })
          } else {
            this.setData({ color: '#ffffff' })
          }
        }
      })
      Promise.all([
        app.get(hot),
        app.post(recommend, params, header),
        app.get(recruit, null, zhihu)
      ]).then(() => {
        wx.redirectTo({
          url: '/pages/layout/layout?id=1'
        })
      })
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
  
    }
  })