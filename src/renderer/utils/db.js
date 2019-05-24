import Dexie from 'dexie'

const db = new Dexie('beyondWeb')

db.version(1).stores({
  webContainer: '++id,name,link,icon'
})

db.transaction('rw', db.webContainer, async () => {
  // Make sure we have something in DB:
  if ((await db.webContainer.count()) === 0) {
    await db.webContainer.add({
      name: '百度一下',
      link: 'https://www.baidu.com',
      icon: 'https://www.baidu.com/img/baidu_85beaf5496f291521eb75ba38eacbd87.svg'
    })
  }
}).catch(e => {
  alert(e.stack || e)
})

export default db
