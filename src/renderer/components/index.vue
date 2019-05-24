<template>
  <Row>
    <Menu mode="horizontal" :theme="theme1" active-name="1">
      <MenuItem name="0"><img src="/static/web+.svg" width="94px;" height="47px;" style="margin-top: 6px;"></MenuItem>
      <MenuItem name="1" @click.native="changePath('/webContainer')">
        <Icon type="ios-browsers"/>网页容器
      </MenuItem>
      <MenuItem name="2" @click.native="changePath('/plugin')">
        <Icon type="ios-appstore"/>插件中心
      </MenuItem>
      <MenuItem name="3" @click.native="changePath('/setting')">
        <Icon type="ios-build"/>控制面板
      </MenuItem>
      <MenuItem name="4" @click.native="openPage('https://github.com/wuyue92tree/beyondWeb')">
        <Icon type="logo-github"/>github
      </MenuItem>
    </Menu>
    <br>
    <Row>
      <router-view></router-view>
    </Row>
  </Row>
</template>
<script>
export default {
  data () {
    return {
      theme1: 'dark'
    }
  },
  methods: {
    changePath (path) {
      this.$router.push(path)
    },
    openPage (link) {
      const { shell } = this.$electron.remote
      shell.openExternal(link)
    }
  }
}
</script>
