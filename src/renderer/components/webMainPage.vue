<template>
  <div class="layout">
    <Layout>
      <Header :style="{position: 'fixed', width: '100%'}">
        <Row>
          <Col :xs="8" :sm="6" :md="4" :lg="2">
            <ButtonGroup>
              <Button type="primary" shape="circle" icon="md-arrow-back" @click="goBack()"></Button>
              <Button type="primary" shape="circle" icon="md-arrow-forward" @click="goForward()"></Button>
              <Button v-if="loading==false" type="primary" shape="circle" icon="md-refresh" @click="refresh()"></Button>
              <Button v-else type="primary" shape="circle" icon="md-close" @click="stop()"></Button>
            </ButtonGroup>
          </Col>
          <Col :xs="8" :sm="12" :md="16" :lg="20">
            <Input type="url" prefix="ios-lock" placeholder="输入网址" icon="ios-search-outline" v-model="link" />
          </Col>
          <Col :xs="4" :sm="3" :md="2" :lg="1">
            <Button style="margin-left: 20px;" type="primary" @click="go()">Go</Button>
          </Col>
          <Col :xs="4" :sm="3" :md="2" :lg="1">
            <Button style="margin-left: 30px;" type="success" icon="md-more"></Button>
          </Col>
        </Row>
      </Header>
      <Content :style="{margin: '64px 0 0', background: '#fff', minHeight: '200px', minHeight: '500px'}">
        <webview id='first' :src="webviewCfg.url" partition="persist:webviewsession" autosize="on" :style="webviewCfg.style" :useragent="webviewCfg.useragent"></webview>
      </Content>
      <!-- <Footer></Footer> -->
    </Layout>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loading: false,
      pageId: '',
      config: {},
      webviewCfg: {
        style: 'width: 100%; height:calc(100vh - 64px);',
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
    stop () {
      this.webview.stop()
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
        this.loading = true
        if (process.env.NODE_ENV === 'development') {
          this.webview.openDevTools()
          let currentWin = this.$electron.remote.getCurrentWindow()
          currentWin.setTitle(this.webview.getTitle())
          this.link = this.webview.getURL()
        }
      })
      this.webview.addEventListener('did-fail-load', (e) => {
        this.$Message.error('加载失败.' + e.errorCode + '|' + e.errorDescription)
      })
      this.webview.addEventListener('did-finish-load', (e) => {
        let self = this
        setTimeout(function () {
          self.loading = false
          self.link = self.webview.getURL()
        }, 1000)
      })
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
