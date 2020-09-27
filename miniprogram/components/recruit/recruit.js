const recommend = 'https://www.zhihu.com/hot';
const app = getApp();
let winHeight = 0
let isShow = false

Component({
  data: {
    list: [],
    triggered: false,
    top: 0
  },
  lifetimes: {
    attached: function() {
      // 在组件实例进入页面节点树时执行
      const data = app.globalData[recommend].data
      let reg = /<script id="js-initialData" type="text\/json">([\s\S]*?)<\/script>/
      if (reg.test(data)) {
        const result = JSON.parse(reg.exec(data)[1])
        const list = result.initialState.topstory.hotList
        this.setData({ list: list })
      }
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
    }
  },
  methods: {
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
    getRecommend () {
      const header = {
        'content-type': 'text/html',
        'origin': 'https://www.zhihu.com',
        'referer': 'https://www.zhihu.com/hot'
      }
      app.get(recommend, null, header).then((res) => {
        let data = res.data
        let reg = /<script id="js-initialData" type="text\/json">([\s\S]*?)<\/script>/
        if (reg.test(data)) {
          const result = JSON.parse(reg.exec(data)[1])
          const list = result.initialState.topstory.hotList
          this.setData({ list: list, triggered: false })
        }
      })
    },
    previewAvatar (e) {
      const current = e.target.dataset.src
      wx.previewImage({
        current: current, // 当前显示图片的http链接
        urls: [current] // 需要预览的图片http链接列表
      })
    }
  }
})
