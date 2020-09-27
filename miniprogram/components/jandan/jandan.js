const recommend = 'https://jandan.net/api/v1/comment/flow_recommend'
const app = getApp();
let winHeight = 0
let isShow = false

Component({
  data: {
    recommendList: [],
    cursor: '',
    triggered: false,
    top: 0
  },
  lifetimes: {
    attached: function() {
      // 在组件实例进入页面节点树时执行
      const params = {
        limit: 20,
        start: this.data.cursor
      }
      app.get(recommend, params).then((res) => {
        const list = res.data.data
        this.setData({
          recommendList: list,
          cursor: list[list.length - 1].id
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
        let list = res.data.data
        if (flag) {
          list = this.data.recommendList.concat(list)
        } else {
          list = list
        }
        this.setData({
          recommendList: list,
          cursor: list[list.length - 1].id,
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
      console.log(urls, current, '内容')
      wx.previewImage({
        current: current, // 当前显示图片的http链接
        urls: urls // 需要预览的图片http链接列表
      })
    }
  }
})