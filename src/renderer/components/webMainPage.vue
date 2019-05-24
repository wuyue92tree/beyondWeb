<template>
  <Row>
    <Row style="margin: 20px;">
      <Col span="3">
        <Button type="primary" @click="goBack()">后退</Button>
        <Button type="primary" @click="goForward()">前进</Button>
        <Button type="primary" @click="refresh()">刷新</Button>
      </Col>
      <Col span="10">
        <Input type="text" prefix="ios-lock" placeholder="输入网址" icon="ios-star-outline" v-model="link"  />
      </Col>
      <Col span="4">
        <Button type="primary" @click="go()">Go</Button>
      </Col>
    </Row>
    <webview id='first' :src="webviewCfg.url" partition="persist:webviewsession" autosize="on" :style="webviewCfg.style" :useragent="webviewCfg.useragent"></webview>
  </Row>
</template>

<script>
export default {
  data () {
    return {
      pageId: '',
      config: {},
      webviewCfg: {
        style: 'width: 100%; height:' + window.screen.height + 'px;',
        useragent: '',
        url: ''
      },
      link: ''
    }
  },
  methods: {
    go () {
      this.webviewCfg.url = this.link
    },
    goBack () {
      if (this.webview.canGoBack()) {
        this.webview.goBack()
      } else {
        this.$Message.warning('无法后退')
      }
    },
    goForward () {
      if (this.webview.canGoForward()) {
        this.webview.goForward()
      } else {
        this.$Message.warning('无法前进')
      }
    },
    refresh () {
      this.webview.reload()
    },
    async init () {
      this.pageId = this.$route.query.target
      if (this.pageId) {
        this.config = (await this.$db.webContainer.where({id: parseInt(this.pageId)}).toArray())[0]
        this.webviewCfg.url = this.config.link
      }
      // let proxy = (!accountInfo.proxy) ? '未设置' : accountInfo.proxy
      // const { session } = this.$electron.remote
      // let ses = session.fromPartition('persist:webviewsession')
      // ses.clearStorageData({storages: ['cookies']})
      // ses.setProxy({
      //   proxyRules: accountInfo.proxy,
      //   // proxyBypassRules: this.$db.get('dev_config').proxyWhiteList
      //   // proxyRules: 'http://127.0.0.1:1080',
      //   proxyBypassRules: 'localhost'
      // }, function () {
      //   console.log('proxy is ready!')
      // })
      this.webview = document.getElementById('first')
      this.webview.addEventListener('dom-ready', (e) => {
        if (process.env.NODE_ENV === 'development') {
          this.webview.openDevTools()
          let currentWin = this.$electron.remote.getCurrentWindow()
          currentWin.setTitle(this.webview.getTitle())
          this.link = this.webview.getURL()
        }
      })
      // this.webview.addEventListener('did-finish-load', (e) => {
      //   this.link = this.webview.getURL()
      // })
      this.webview.addEventListener('new-window', (e) => {
        this.webview.loadURL(e.url)
      })
    }
  },
  mounted () {
    this.init()
  }
}
</script>
