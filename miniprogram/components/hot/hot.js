const recommend = "https://blink-open-api.csdn.net/v1/pc/blink/newBlink";
const app = getApp();
let winHeight = 0
let isShow = false

Component({
  data: {
    list: [],
    cursor: '',
    triggered: false,
    top: 0,
    count: 0,
    classNote: '.hot-'
  },
  lifetimes: {
    attached: function() {
      // 在组件实例进入页面节点树时执行
      const result = app.globalData[recommend].data
      result.data.forEach(item => {
        item.content = item.content.replace(/\[face\].+\[\/face\]/g, '')
        item.pictures = item.pictures || []
      })
      const list = result.data
      this.setData({ list: list, cursor: list[list.length - 1].blinkId  })
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
      this.setData({ count: this.data.count + 5 })
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
      const cursor = this.data.cursor
      const parmas = cursor ? { limitId: cursor } : null
      app.get(recommend, parmas).then((res) => {
        let list = []
        if (flag) {
          res.data.data.forEach(item => {
            item.content = item.content.replace(/\[face\].+\[\/face\]/g, '')
            item.pictures = item.pictures || []
          })
          list = this.data.list.concat(res.data.data)
        } else {
          list = res.data.data
        }
        this.setData({
          list: list,
          cursor: list[list.length - 1].blinkId,
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
      if ((this.data.count > this.data.list.length) || !this.createIntersectionObserver) {
        // 超出了范围不要再监听了或者根本就API不支持
        return this.data.count = this.data.list.length
      }
      
      const intersectionObserver = this.createIntersectionObserver();
      //这里bottom：100，是指显示区域以下 100px 时，就会触发回调函数。
      intersectionObserver.relativeToViewport({ bottom: 100 }).observe(this.data.classNote + (this.data.count - 1), (res) => {
        if (res.boundingClientRect.top > 0) {
          console.log('出发')
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