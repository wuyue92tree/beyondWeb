<style>
.ivu-tabs-nav {
  padding-left: 80px !important;
}
.ivu-tabs-bar {
  margin-bottom: 0 !important;
  -webkit-app-region: drag;
}
#mainPageHeader {
  padding: 0 0 !important;
  padding-left: 10px !important;
}
</style>


<template>
  <div class="layout">
    <Layout>
      <div :style="{position: 'fixed', width: '100%'}">
        <Tabs type="card"
              closable
              @on-tab-remove="handleTabRemove">
          <TabPane :label="title">
            <Header id="mainPageHeader">
              <Row>
                <Col :xs="8"
                     :sm="6"
                     :md="4"
                     :lg="2">
                <ButtonGroup>
                  <Button type="primary"
                          shape="circle"
                          icon="md-arrow-back"
                          @click="goBack()"></Button>
                  <Button type="primary"
                          shape="circle"
                          icon="md-arrow-forward"
                          @click="goForward()"></Button>
                  <Button v-if="loading==false"
                          type="primary"
                          shape="circle"
                          icon="md-refresh"
                          @click="refresh()"></Button>
                  <Button v-else
                          type="primary"
                          shape="circle"
                          icon="md-close"
                          @click="stop()"></Button>
                </ButtonGroup>
                </Col>
                <Col :xs="8"
                     :sm="12"
                     :md="16"
                     :lg="20">
                <Input type="url"
                       prefix="ios-lock"
                       placeholder="输入网址"
                       icon="ios-search-outline"
                       v-model="link" />
                </Col>
                <Col :xs="4"
                     :sm="3"
                     :md="2"
                     :lg="1">
                <Button style="margin-left: 20px;"
                        type="primary"
                        @click="go()">Go</Button>
                </Col>
                <Col :xs="4"
                     :sm="3"
                     :md="2"
                     :lg="1">
                <Dropdown style="margin-left: 20px"
                          placement="bottom-end"
                          trigger="click">
                  <Button type="success"
                          icon="md-more"></Button>
                  <DropdownMenu slot="list">
                    <DropdownItem @click.native="saveContainer()">保存容器</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
                </Col>
              </Row>
            </Header>
            <Content :style="{margin: '0 0 0', background: '#fff', minHeight: '200px', minHeight: '500px'}">
              <webview id='first'
                       :src="webviewCfg.url"
                       partition="persist:webviewsession"
                       autosize="on"
                       :style="webviewCfg.style"
                       :useragent="webviewCfg.useragent"></webview>
            </Content>
          </TabPane>
          <TabPane label="标签二"></TabPane>
        </Tabs>
      </div>

      <!-- <Footer></Footer> -->

      <Modal v-model="saveContainerModalShow"
             title="保存容器">
        <div>
          <Form ref="containerForm"
                :model="containerForm"
                :rules="containerFormRule"
                :label-width="80">
            <FormItem label="名称"
                      prop="name">
              <Input v-model="containerForm.name"
                     placeholder="网页容器名称"></Input>
            </FormItem>
            <FormItem label="链接"
                      prop="link">
              <Input v-model="containerForm.link"
                     placeholder="网页链接"></Input>
            </FormItem>
            <FormItem label="图标链接"
                      prop="icon">
              <Input v-model="containerForm.icon"
                     placeholder="图标链接"></Input>
            </FormItem>
          </Form>
        </div>
        <div slot="footer">
          <Button type="text"
                  size="large"
                  @click="saveContainerModalShow=false">取消</Button>
          <Button type="primary"
                  size="large"
                  @click="addWebContainer('containerForm')">确定</Button>
        </div>
      </Modal>
    </Layout>
  </div>
</template>

<script>
export default {
  data () {
    return {
      title: 'about:blank',
      loading: false,
      saveContainerModalShow: false,
      pageId: '',
      containerForm: {
        link: '',
        name: '',
        icon: ''
      },
      containerFormRule: {
        link: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      },
      config: {},
      webviewCfg: {
        style: 'width: 100%; height:calc(100vh);',
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
    async addWebContainer (name) {
      this.$refs[name].validate(async (valid) => {
        if (valid) {
          if (this.pageId === '' || this.pageId === undefined) {
            var containerId = await this.$db.webContainer.add({
              name: this.containerForm.name,
              link: this.containerForm.link,
              icon: this.containerForm.icon
            })
          } else {
            containerId = this.pageId
            await this.$db.webContainer.update(parseInt(containerId), {
              name: this.containerForm.name,
              link: this.containerForm.link,
              icon: this.containerForm.icon
            })
          }
          const { ipcRenderer } = require('electron')
          ipcRenderer.send('updateWebContainerList')
          this.$Message.success('保存成功')
          this.saveContainerModalShow = false
          setTimeout(() => {
            const url = process.env.NODE_ENV === 'development'
              ? `http://localhost:9080`
              : 'byw://-'
            let currentWin = this.$electron.remote.getCurrentWindow()
            currentWin.loadURL(url + '/#webMainPage/?target=' + containerId)
          }, 2000)
        } else {
          this.$Message.error('保存失败')
        }
      })
    },
    async saveContainer () {
      try {
        this.saveContainerModalShow = true
        console.log(this.pageId)
        if (this.pageId === '' || this.pageId === undefined) {
          this.containerForm.name = this.webview.getTitle()
          this.containerForm.link = this.webview.getURL()
        } else {
          let self = this
          await this.$db.webContainer.get(parseInt(this.pageId))
            .then(function (res) {
              self.containerForm = res
            })
        }
      } catch (error) {
        console.log(error)
      }
    },
    handleTabRemove () { },
    async init () {
      this.pageId = this.$route.query.target
      if (this.pageId) {
        this.config = (await this.$db.webContainer.where({ id: parseInt(this.pageId) }).toArray())[0]
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
        }
        let currentWin = this.$electron.remote.getCurrentWindow()
        currentWin.setTitle(this.webview.getTitle())
        this.title = this.webview.getTitle()
        this.link = this.webview.getURL()
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
