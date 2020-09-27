const recommend = 'https://sso.ifanr.com/api/v5/wp/buzz/'
const app = getApp();
let winHeight = 0
let isShow = false

Component({
  data: {
    recommendList: [],
    cursor: 20,
    triggered: false,
    top: 0
  },
  lifetimes: {
    attached: function() {
      // 在组件实例进入页面节点树时执行
      const params = {
        limit: 20,
        offset: this.data.cursor
      }
      app.get(recommend, params).then((res) => {
        const list = res.data.objects
        list.forEach(item => {
          const p = /<p>([\s\S]*?)<\/p>/g
          item.post_content = p.exec(item.post_content)[1]
          const time = new Date(item.created_at * 1000)
          item.created_at = `${time.toLocaleDateString()} ${time.toLocaleTimeString()}`
        })
        this.setData({
          recommendList: list,
          cursor: this.data.cursor + 20
        })
        console.log(list)
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
        offset: this.data.cursor
      }
      app.get(recommend, params).then((res) => {
        let list = res.data.objects
        list.forEach(item => {
          const p = /<p>([\s\S]*?)<\/p>/g
          item.post_content = p.exec(item.post_content)[1]
          const time = new Date(item.created_at * 1000)
          item.created_at = `${time.toLocaleDateString()} ${time.toLocaleTimeString()}`
        })
        if (flag) {
          list = this.data.recommendList.concat(list)
        } else {
          list = list
        }
        this.setData({
          recommendList: list,
          cursor: this.data.cursor + 20,
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
    }
  }
})