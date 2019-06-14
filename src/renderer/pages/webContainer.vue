<style>
.text-overflow {
  display: block; /*内联对象需加*/
  word-break: keep-all; /* 不换行 */
  white-space: nowrap; /* 不换行 */
  overflow: hidden; /* 内容超出宽度时隐藏超出部分的内容 */
  text-overflow: ellipsis; /* 当对象内文本溢出时显示省略标记(...) ；需与overflow:hidden;一起使用。*/
}
#webContainerDropdown {
  display: block !important;
}
</style>


<template>
  <Row>
    <Breadcrumb :style="{margin: '20px 0'}">
      <BreadcrumbItem>网页容器</BreadcrumbItem>
    </Breadcrumb>

    <Row type="flex"
         style="-webkit-app-region: no-drag">
      <vuedraggable v-model="webContainerList"
                    @change="updated"
                    style="width: 100%">
        <Col span="4"
             v-for="(item, index) in webContainerList"
             :key="index"
             style="padding-right: 5px; padding-bottom: 5px;">
        <Card>
          <Dropdown transfer
                    ref="contentMenu"
                    trigger="contextMenu"
                    placement="right-start"
                    id="webContainerDropdown">
            <div style="text-align:center">
              <img v-if="item.icon"
                   :src="item.icon"
                   width="80px;"
                   height="80px;"
                   @click="openWebMainPage(item.id)">
              <img v-else
                   src="/static/web+Icon.svg"
                   width="80px;"
                   height="80px;"
                   @click="openWebMainPage(item.id)">
              <h3 class="text-overflow">{{item.name}}</h3>
            </div>
            <DropdownMenu slot="list">
              <DropdownItem @click.native="openWebMainPage(item.id)">打开</DropdownItem>
              <DropdownItem @click.native="delWebContainer(item.id)">删除</DropdownItem>
              <DropdownItem divided>取消</DropdownItem>
            </DropdownMenu>
          </Dropdown>

        </Card>
        </Col>
      </vuedraggable>
    </Row>

    <Breadcrumb :style="{margin: '20px 0'}">
      <BreadcrumbItem><Button class="primary"
                @click="openWebMainPage()">新增容器</Button></BreadcrumbItem>
    </Breadcrumb>
  </Row>
</template>

<script>
import vuedraggable from 'vuedraggable'

export default {
  data () {
    return {
      webContainerList: []
    }
  },
  components: {
    vuedraggable: vuedraggable
  },
  methods: {
    async getWebContainer () {
      this.webContainerList = await this.$db.webContainer.toArray()
    },
    async delWebContainer (id) {
      try {
        this.$Modal.confirm({
          title: '警告',
          content: '<p>确定要移除该网页容器么？</p>',
          okText: '确认',
          cancelText: '取消',
          onOk: async () => {
            await this.$db.webContainer.where({
              id: id
            }).delete()
            await this.getWebContainer()
            this.$Message.success('删除成功')
          }
        })
      } catch (error) {
        this.$Message.error('删除失败 ' + error)
      }
    },
    openWebMainPage (target) {
      const url = process.env.NODE_ENV === 'development'
        ? `http://localhost:9080`
        : 'byw://-'
      const { BrowserWindow } = this.$electron.remote
      let win = new BrowserWindow({
        titleBarStyle: 'hiddenInset',
        minWidth: 500,
        minHeight: 400
      })
      win.maximize()
      if (target) {
        win.loadURL(url + '/#webMainPage/?target=' + target)
      } else {
        win.loadURL(url + '/#webMainPage/')
      }
    },
    init () {
      const ipcRenderer = require('electron').ipcRenderer
      // 渲染进程，用于更新webContainer列表
      ipcRenderer.on('updateWebContainerList', () => {
        this.getWebContainer()
      })
    },
    updated () {
      console.log(this.webContainerList)
    }
  },
  mounted () {
    this.getWebContainer()
    this.init()
  }
}
</script>
