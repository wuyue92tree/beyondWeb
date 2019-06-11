'use strict'

import { app, BrowserWindow, Menu, dialog, ipcMain } from 'electron'
import { autoUpdater } from 'electron-updater'
const log = require('electron-log')
const serve = require('electron-serve')
const packageInfo = require('../../package.json')

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path')
    .join(__dirname, '/static')
    .replace(/\\/g, '\\\\')
}

let mainWindow
const winURL =
  process.env.NODE_ENV === 'development'
    ? `http://localhost:9080`
    : serve({ scheme: 'beyondweb', directory: __dirname }) // : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    width: 1000,
    minWidth: 563,
    maxHeight: 1000,
    useContentSize: true,
    titleBarStyle: 'hiddenInset'
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
          label: '刷新',
          role: 'reload'
        },
        {
          label: '编辑',
          submenu: [
            { role: 'undo', label: '撤销' },
            { role: 'redo', label: '恢复' },
            { type: 'separator' },
            { role: 'cut', label: '剪切' },
            { role: 'copy', label: '复制' },
            { role: 'paste', label: '粘贴' },
            { role: 'pasteandmatchstyle', label: '带样式粘贴' },
            { role: 'delete', label: '删除' },
            { role: 'selectall', label: '全选' }
          ]
        },
        {
          label: '关于',
          click: function () {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: '关于',
              message: 'WEB+',
              detail:
                '版本： v' +
                packageInfo.version +
                '\n联系作者： wuyue92tree@163.com'
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

  updateHandle()

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

/* 处理渲染进程消息 */

// 更新webContainer列表
ipcMain.on('updateWebContainerList', (e, args) => {
  console.log('get message')
  mainWindow.webContents.send('updateWebContainerList')
})

// 执行软件版本更新
ipcMain.on('isUpdateNow', (e, arg) => {
  console.log(arguments)
  console.log('开始更新')
  // some code here to handle event
  autoUpdater.quitAndInstall()
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

autoUpdater.logger = log
autoUpdater.logger.transports.file.level = 'info'
const uploadUrl = 'https://github.com'
function updateHandle () {
  console.log('start check')
  // const os = require('os')
  autoUpdater.setFeedURL(uploadUrl)
  autoUpdater.checkForUpdates()
  autoUpdater.on('error', error => {
    sendUpdateMessage({ type: 'error', message: '检查更新出错: ' + error })
  })
  autoUpdater.on('checking-for-update', function () {
    sendUpdateMessage({
      type: 'checking-for-update',
      message: '正在检查更新……'
    })
  })
  autoUpdater.on('update-available', function (info) {
    sendUpdateMessage({
      type: 'update-available',
      message: '有可用的新版本:',
      info: info
    })
  })
  autoUpdater.on('update-not-available', function (info) {
    sendUpdateMessage({
      type: 'update-not-available',
      message: '现在使用的就是最新版本，不用更新',
      info: info
    })
  })

  // 更新下载进度事件
  autoUpdater.on('download-progress', function (progressObj) {
    let logMessage = 'Download speed: ' + progressObj.bytesPerSecond
    console.log(logMessage)
    logMessage = logMessage + ' - Downloaded ' + progressObj.percent + '%'
    logMessage =
      logMessage +
      ' (' +
      progressObj.transferred +
      '/' +
      progressObj.total +
      ')'
    mainWindow.webContents.send('downloadProgress', progressObj)
  })
  autoUpdater.on('update-downloaded', function (
    event,
    releaseNotes,
    releaseName,
    releaseDate,
    updateUrl,
    quitAndUpdate
  ) {
    mainWindow.webContents.send('isUpdateNow')
  })

  ipcMain.on('checkForUpdate', () => {
    // 执行自动更新检查
    autoUpdater.checkForUpdates()
  })
}

// 通过main进程发送事件给renderer进程，提示更新信息
function sendUpdateMessage (text) {
  mainWindow.webContents.send('message', text)
}
