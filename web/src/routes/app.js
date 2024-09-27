import { ROUTE_TYPES, ROUTE_NAMES, MENUS, ENTITY_TYPES } from '@/consts'
import { isNullOrEmpty, upperFirstLetter, pluralization } from '@/utils'
import Page from '@/models/page'

const applinks = [
new Page({
   name: ROUTE_NAMES.CLOSE,
   path: `/${ROUTE_NAMES.CLOSE}`,
   view: `${upperFirstLetter(ROUTE_NAMES.CLOSE)}`,
   icon: '',
   title: '系統維護中',
   menus: []
}),
new Page({
   name: ROUTE_NAMES.NOT_FOUND,
   path: '/:pathMatch(.*)*',
   view: '404', 
   icon: '',
   title: 'Page Not Found',
   menus: []
}),
new Page({
   name: 'doc',
   path: '/doc',
   view: 'Doc',      
   icon: 'mdi-file-document',
   title: '舊公文資料確認-說明',
   menus: [MENUS.MAIN],
   alias: '/'
})
,
new Page({
   name: 'doc-a',
   path: '/doc_a',
   view: 'DocA',      
   icon: 'mdi-file-document',
   title: '舊公文資料確認-A類',
   menus: [MENUS.MAIN]
}),
new Page({
   name: 'doc-b',
   path: '/doc_b',
   view: 'DocB',      
   icon: 'mdi-file-document',
   title: '舊公文資料確認-B類',
   menus: [MENUS.MAIN]
}),
new Page({
   name: 'doc-c',
   path: '/doc_c',
   view: 'DocC',      
   icon: 'mdi-file-document',
   title: '舊公文資料確認-C類',
   menus: [MENUS.MAIN]
})
,
new Page({
   name: 'doc-d',
   path: '/doc_d',
   view: 'DocD',      
   icon: 'mdi-file-gavel',
   title: '審判公文，隨卷歸檔',
   menus: [MENUS.MAIN]
})
]

const userlinks = []

const guestLinks = []

applinks.forEach(page => page.setType(ROUTE_TYPES.FOR_ALL))

userlinks.forEach(page => page.setType(ROUTE_TYPES.ADMIN_ONLY))

guestLinks.forEach(page => page.setType(ROUTE_TYPES.GUEST_ONLY))

const appRoutes = applinks.concat(userlinks).concat(guestLinks)

appRoutes.forEach((page, index) => {
   page.setSubs(appRoutes.filter(item => item.hasParent(page.name)))
   page.setOrder(index)
})

export default appRoutes