<template>
  <Row>
  网页容器
  {{ webContainerList }}
  <Row type="flex">
    <Col span="4" v-for="(item, index) in webContainerList" :key="index">
      <img :src="item.icon" width="80px;" height="80px;" @click="openWebMainPage(item.id)">
      {{item.name}}

    </Col>
    <Col span="4">
      <Button shape="circle" icon="ios-add" style="width: 80px; height: 80px;" @click="openWebMainPage()"></Button>
    </Col>
  </Row>
  </Row>
</template>

<script>
export default {
  data () {
    return {
      webContainerList: []
    }
  },
  methods: {
    async getWebContainer () {
      this.webContainerList = await this.$db.webContainer.toArray()
    },
    async addWebContainer () {
      await this.$db.webContainer.add({
        name: 'Github',
        link: 'https://github.com/',
        icon: 'https://github.com/fluidicon.png'
      })
    },
    openWebMainPage (target) {
      const url = process.env.NODE_ENV === 'development'
        ? `http://localhost:9080`
        : 'beyondweb://-'
      const {BrowserWindow} = this.$electron.remote
      let win = new BrowserWindow({})
      win.maximize()
      if (target) {
        win.loadURL(url + '/#webMainPage/?target=' + target)
      } else {
        win.loadURL(url + '/#webMainPage/')
      }
    }
  },
  mounted () {
    this.getWebContainer()
  }
}
</script>
