const recommend = 'https://apinew.juejin.im/recommend_api/v1/short_msg/recommend'
const app = getApp();
let winHeight = 0
let isShow = false

Component({
  data: {
    recommendList: [],
    cursor: '0',
    triggered: false,
    top: 0,
    classNote: '.recommend-',
    count: 0
  },
  lifetimes: {
    attached: function() {
      // 在组件实例进入页面节点树时执行
      const result = app.globalData[recommend].data
      this.setData({
        recommendList: result.data,
        cursor: result.cursor
      })
    },
    detached: function() {
      // 在组件实例被从页面节点树移除时执行
    },
    ready: function () {
      wx.getSystemInfo({
        success: (res) => {
          winHeight = res.windowHeight
        }
      })
      // 可以先初始化首屏需要展示的图片
      this.setData({
        count: 5
      })
      // 开始监听节点，注意需要在onReady才能监听，此时节点才渲染
      this.viewPort()
    }
  },
  methods: {
    handleTolower () {
      this.getRecommend(true)
    },
    handleRefresh () {
      this.getRecommend()
    },
    setScrollTop () {
      this.setData({ top: 0 })
    },
    resetPage () {
      if (isShow) {
        this.triggerEvent('showdot')
      } else {
        this.triggerEvent('hidedot')
      }
    },
    handleScroll (event) {
      let scrollTop = event.detail.scrollTop
      if ((scrollTop > winHeight) && !isShow  && winHeight) {
        this.triggerEvent('showdot')
        isShow = true
      }
      if ((scrollTop < winHeight) && isShow && winHeight) {
        this.triggerEvent('hidedot')
        isShow = false
      }
    },
    getRecommend (flag) {
      const params = {
        cursor: this.data.cursor,
        id_type: 4,
        limit: 20,
        sort_type: 300
      }
      const header = {
        'referer': 'https://juejin.im/pins/recommended',
        'origin': 'https://juejin.im'
      }
      app.post(recommend, params, header).then((res) => {
        let list = []
        if (flag) {
          list = this.data.recommendList.concat(res.data.data)
        } else {
          list = res.data.data
        }
        this.setData({
          recommendList: list,
          cursor: res.data.cursor,
          triggered: false,
          count: this.data.count + 5
        })
        this.viewPort()
      })
    },
    previewAvatar (e) {
      const current = e.target.dataset.src
      wx.previewImage({
        current: current, // 当前显示图片的http链接
        urls: [current] // 需要预览的图片http链接列表
      })
    },
    previewImage (e) {
      const current = e.target.dataset.src
      let urls = e.target.dataset.urls || [current]
      urls = urls.map((item) => {
        if (typeof item === 'object') {
          return item.url
        }
        return item
      })
      wx.previewImage({
        current: current, // 当前显示图片的http链接
        urls: urls // 需要预览的图片http链接列表
      })
    },
    viewPort () {
      if ((this.data.count > this.data.recommendList.length) || !this.createIntersectionObserver) {
        // 超出了范围不要再监听了或者根本就API不支持
        return this.data.count = this.data.recommendList.length
      }
      const intersectionObserver = this.createIntersectionObserver();
      //这里bottom：100，是指显示区域以下 100px 时，就会触发回调函数。
      intersectionObserver.relativeToViewport({ bottom: 100 }).observe(this.data.classNote + (this.data.count - 1), (res) => {
        if (res.boundingClientRect.top > 0) {
          intersectionObserver.disconnect()
          this.setData({
            count: this.data.count + 5
          })
          this.viewPort();
        }
      })
    }
  }
})