<template>
  <div>
    <Layout>
      <Header :style="headerStyle">
        <Menu mode="horizontal"
              :theme="theme1"
              active-name="1">
          <MenuItem name="0"><img src="/static/web+.svg"
               width="94px;"
               height="47px;"
               style="margin-top: 6px;"></MenuItem>
          <MenuItem name="1"
                    @click.native="changePath('/webContainer')">
          <Icon type="ios-browsers" />网页容器
          </MenuItem>
          <MenuItem name="2"
                    @click.native="changePath('/plugin')">
          <Icon type="ios-appstore" />插件中心
          </MenuItem>
          <MenuItem name="3"
                    @click.native="changePath('/setting')">
          <Icon type="ios-build" />控制面板
          </MenuItem>
          <MenuItem name="4"
                    @click.native="openPage('https://github.com/wuyue92tree/beyondWeb')">
          <Icon type="logo-github" />github
          </MenuItem>
        </Menu>
      </Header>
      <Content :style="{margin: '64px 0 0', background: '#fff', minHeight: '0px'}">
        <div style="width: 100%; height:calc(100vh - 98px); padding: 20px;">
          <router-view></router-view>
        </div>
      </Content>
      <!-- <Footer style="text-align: center">2019 &copy; wuyue92tree</Footer> -->
      <Modal v-model="updateModal"
             title="检查更新"
             :loading="loading"
             :mask-closable="false">
        <p>{{ updateMessage }}</p>
        <p>{{ updateInfo }}</p>
        <Progress v-if="updatePercent!==''"
                  :percent="updatePercent"
                  status="active" />
        <div slot="footer">
          <Button v-if="canDownload===true"
                  type="primary"
                  size="large"
                  @click="callUpdate">重启并更新软件</Button>
        </div>
      </Modal>
    </Layout>
  </div>
</template>
<script>
const packageInfo = require('../../../package.json')
export default {
  data () {
    return {
      theme1: 'dark',
      headerStyle: { position: 'fixed', width: '100%', zIndex: 999 },
      loading: true,
      updateModal: false,
      updateInfo: '',
      updateMessage: '',
      updatePercent: '',
      canDownload: false
    }
  },
  methods: {
    changePath (path) {
      this.$router.push(path)
    },
    openPage (link) {
      const { shell } = this.$electron.remote
      shell.openExternal(link)
    },
    checkVersion () {
      let self = this
      const { ipcRenderer } = require('electron')
      ipcRenderer.on('message', function (event, text) {
        if (text.type === 'error') {
          self.updateMessage = text.message
        } else if (text.type === 'checking-for-update') {
          self.loading = false
          self.updateModal = true
          self.updateMessage = text.message
        } else if (text.type === 'update-available') {
          self.updateMessage = text.message
          self.updateInfo = '当前版本: "' + packageInfo.version + '" && 可更新版: ' + JSON.stringify(text.info.version)
        } else if (text.type === 'update-not-available') {
          self.updateMessage = text.message
          self.updateInfo = '当前版本: ' + JSON.stringify(text.info.version)
        }
      })
      ipcRenderer.on('downloadProgress', function (event, progressObj) {
        self.updatePercent = progressObj.percent || 0
      })
      ipcRenderer.on('isUpdateNow', () => {
        self.canDownload = true
      })
    },
    init () {
      if (this.$os.platform() !== 'darwin') {
        this.headerStyle = { position: 'fixed', width: '100%', zIndex: 999, padding: 0 }
      }
    }
  },
  mounted () {
    this.init()
    this.checkVersion()
  }
}
</script>
