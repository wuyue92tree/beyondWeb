import Dexie from 'dexie'

const db = new Dexie('beyondWeb')

db.version(1).stores({
  webContainer: '++id,orderId,name,link,icon'
})

db.version(2).stores({
  containerPreload: '++id,containerId,title,content'
})

db.version(3).stores({
  containerPuppeteer: '++id,containerId,title,content'
})

db.transaction('rw', db.webContainer, async () => {
  // Make sure we have something in DB:
  if ((await db.webContainer.count()) === 0) {
    const webContainerId = await db.webContainer.add({
      name: '百度一下',
      link: 'https://www.baidu.com',
      icon:
        'https://www.baidu.com/img/baidu_85beaf5496f291521eb75ba38eacbd87.svg'
    })
    await db.webContainer.update(webContainerId, { orderId: webContainerId })
  }
}).catch(e => {
  alert(e.stack || e)
})

export default db
