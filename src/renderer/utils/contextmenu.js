const {remote} = require('electron')
const {Menu} = remote

const template = [
  {role: 'undo', label: '撤销'},
  {role: 'redo', label: '恢复'},
  {type: 'separator'},
  {role: 'cut', label: '剪切'},
  {role: 'copy', label: '复制'},
  {role: 'paste', label: '粘贴'},
  {role: 'pasteandmatchstyle', label: '带样式粘贴'},
  {role: 'delete', label: '删除'},
  {role: 'selectall', label: '全选'},
  {type: 'separator'},
  {label: '刷新', role: 'reload'},
  {
    label: '开发者工具',
    click: function (item, focusedWindow) {
      if (focusedWindow) {
        focusedWindow.toggleDevTools()
      }
    }
  }
]

const menu = Menu.buildFromTemplate(template)

export function initContextMenu () {
  window.addEventListener('contextmenu', (e) => {
    e.preventDefault()
    menu.popup({window: remote.getCurrentWindow()})
  }, false)
}
