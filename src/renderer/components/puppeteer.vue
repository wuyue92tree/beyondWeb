<template>
  <div style="padding: 20px;">
    <h3>puppeteer管理</h3>
    <Table border
           :columns="columns"
           :data="puppeteerList"></Table>

    <Modal v-model="modal"
           width="1000"
           :fullscreen="fullscreen"
           :mask-closable="false"
           title="Puppeteer脚本编写">
      <Form ref="puppeteerForm"
            :model="puppeteerForm"
            :rules="puppeteerFormRule"
            :label-width="80">
        <FormItem label="名称"
                  prop="title">
          <Input v-model="puppeteerForm.title"
                 placeholder="输入脚本名称"></Input>
        </FormItem>
        <FormItem label="脚本内容"
                  prop="content">
          <editor v-model="puppeteerForm.content"
                  @init="editorInit"
                  lang="javascript"
                  theme="chrome"
                  width="100%"
                  height="400"></editor>
        </FormItem>
        <FormItem label="启用"
                  prop="active">
          <i-switch v-model="puppeteerForm.active"
                    size="large">
            <span slot="open">是</span>
            <span slot="close">否</span>
          </i-switch>
        </FormItem>
      </Form>

      <div slot="footer">
        <Button type="text"
                size="large"
                @click="fullscreen=!fullscreen">全屏切换</Button>
        <Button type="text"
                size="large"
                @click="modal=false">取消</Button>
        <Button type="primary"
                size="large"
                @click="savePuppeteer('puppeteerForm')">保存</Button>
        <Button type="primary"
                size="large"
                @click="runPuppeteer">执行</Button>
        <Button type="error"
                size="large"
                @click="stopPuppeteer">停止</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
export default {
  data () {
    return {
      columns: [
        {
          title: 'Name',
          key: 'name',
          render: (h, params) => {
            return h('div', [
              h('Icon', {
                props: {
                  type: 'person'
                }
              }),
              h('strong', params.row.name)
            ])
          }
        },
        {
          title: 'Age',
          key: 'age'
        },
        {
          title: 'Address',
          key: 'address'
        },
        {
          title: 'Action',
          key: 'action',
          width: 150,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    // this.show(params.index)
                    this.modal = true
                  }
                }
              }, 'View'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.remove(params.index)
                  }
                }
              }, 'Delete')
            ])
          }
        }
      ],
      puppeteerList: [
        {
          name: 'John Brown',
          age: 18,
          address: 'New York No. 1 Lake Park'
        },
        {
          name: 'Jim Green',
          age: 24,
          address: 'London No. 1 Lake Park'
        },
        {
          name: 'Joe Black',
          age: 30,
          address: 'Sydney No. 1 Lake Park'
        },
        {
          name: 'Jon Snow',
          age: 26,
          address: 'Ottawa No. 2 Lake Park'
        }
      ],
      modal: false,
      puppeteerForm: {
        title: '',
        content: '',
        active: true
      },
      puppeteerFormRule: {
        title: [{ required: true, message: '不能为空', trigger: 'blur' }],
        content: [{ required: true, message: '不能为空', trigger: 'blur' }]
      },
      browser: '',
      fullscreen: false
    }
  },
  components: {
    editor: require('vue2-ace-editor')
  },
  methods: {
    savePuppeteer (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$Message.success('Success!')
        } else {
          this.$Message.error('Fail!')
        }
      })
    },
    runPuppeteer () {
      if (this.browser) {
        this.$Message.warning('当前有puppeteer进程正在运行.')
      } else {
        // eslint-disable-next-line no-eval
        eval(this.puppeteerForm.content)
      }
    },
    stopPuppeteer () {
      if (this.browser) {
        this.browser.close()
        this.browser = ''
      } else {
        this.$Message.warning('当前没有运行的puppeteer进程.')
      }
    },
    editorInit () {
      require('brace/ext/language_tools') // language extension prerequsite...
      require('brace/mode/html')
      require('brace/mode/javascript') // language
      require('brace/mode/less')
      require('brace/theme/chrome')
      require('brace/snippets/javascript') // snippet
    }
  }
}
</script>
