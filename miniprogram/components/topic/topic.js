const recommend = 'https://topbook.cc/webapi/community/topic/page'
const app = getApp();
let winHeight = 0
let isShow = false

Component({
  data: {
    recommendList: [],
    cursor: 0,
    triggered: false,
    top: 0,
    classNote: '.topic-',
    count: 0
  },
  lifetimes: {
    attached: function() {
      // 在组件实例进入页面节点树时执行
      const params = {
        limit: 20,
        start: this.data.cursor
      }
      app.get(recommend, params).then((res) => {
        const list = res.data.data.items
        this.setData({
          recommendList: list,
          cursor: this.data.cursor + 20
        })
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
      const params = {
        limit: 20,
        start: this.data.cursor
      }
      app.get(recommend, params).then((res) => {
        let list = res.data.data.items
        if (flag) {
          list = this.data.recommendList.concat(list)
        } else {
          list = list
        }
        this.setData({
          recommendList: list,
          cursor: this.data.cursor + 20,
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
      let urls = e.target.dataset.urls || current
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