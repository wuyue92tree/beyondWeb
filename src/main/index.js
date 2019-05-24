'use strict'

import { app, BrowserWindow, Menu, dialog } from 'electron'
import { autoUpdater } from 'electron-updater'

const serve = require('electron-serve')
const packageInfo = require('../../package.json')

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  // : `file://${__dirname}/index.html`
  : serve({scheme: 'beyondweb', directory: __dirname})

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000
  })

  // BrowserWindow.addDevToolsExtension('/home/wuyue/Project/morgan-v3/morgan-spider/script/ResumeSearchPlugin')

  const template = [
    {
      label: '菜单',
      submenu: [
        {
          label: '开发者工具',
          accelerator: (function () {
            if (process.platform === 'darwin') {
              return 'Alt+Command+I'
            } else {
              return 'Ctrl+Shift+I'
            }
          })(),
          click: function (item, focusedWindow) {
            if (focusedWindow) {
              focusedWindow.toggleDevTools()
            }
          }
        },
        {
          label: '检查更新',
          click: function (item, focusedWindow) {
            if (focusedWindow) {
              autoUpdater.checkForUpdates()
            }
          }
        },
        {
          label: '刷新', role: 'reload'
        },
        {
          label: '编辑',
          submenu: [
            {role: 'undo', label: '撤销'},
            {role: 'redo', label: '恢复'},
            {type: 'separator'},
            {role: 'cut', label: '剪切'},
            {role: 'copy', label: '复制'},
            {role: 'paste', label: '粘贴'},
            {role: 'pasteandmatchstyle', label: '带样式粘贴'},
            {role: 'delete', label: '删除'},
            {role: 'selectall', label: '全选'}
          ]
        },
        {
          label: '关于',
          click: function () {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: '关于',
              message: 'WEB+',
              detail: '版本： v' + packageInfo.version + '\n联系作者： wuyue92tree@163.com'
            })
          }
        }
      ]
    }
  ]
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
  if (process.env.NODE_ENV !== 'development') {
    winURL(mainWindow)
  } else {
    mainWindow.loadURL(winURL)
    console.log(winURL)
  }

  // updateHandle()

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
