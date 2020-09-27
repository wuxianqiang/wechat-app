const recommend = 'https://apinew.juejin.im/recommend_api/v1/short_msg/recommend'
const app = getApp();
let winHeight = 0
let isShow = false

Component({
  data: {
    recommendList: [],
    cursor: '0',
    triggered: false,
    top: 0
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
          triggered: false
        })
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
    }
  }
})