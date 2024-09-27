import { ROUTE_TYPES, ROUTE_NAMES, MENUS, ENTITY_TYPES } from '@/consts'
import { isNullOrEmpty, upperFirstLetter, pluralization } from '@/utils'
import Page from '@/models/page'

const USER = ENTITY_TYPES.USER
const PROFILES = ENTITY_TYPES.PROFILES
const TRANS_EXAM = ENTITY_TYPES.TRANS_EXAM
const QUESTION = ENTITY_TYPES.QUESTION

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
   name: 'test',
   path: '/test',
   view: 'Test',      
   icon: '',
   title: 'Test',
   menus: []
})
]

const adminlinks = [
// groups
// new Page({
//    name: ROUTE_NAMES.DASHBOARDS,
//    path: `/${ROUTE_NAMES.DASHBOARDS}`,
//    view: `${upperFirstLetter(ROUTE_NAMES.DASHBOARDS)}`,
//    icon: 'mdi-view-dashboard',
//    title: '儀表版',
//    menus: [MENUS.MAIN],
//    alias: '/'
// }),
new Page({
   name: pluralization(USER.name),
   path: `/${pluralization(USER.name)}`,
   view: `${pluralization(USER.name)}/Index`,
   icon: 'mdi-account', 
   title: `${USER.title}管理`,
   menus: [MENUS.MAIN]
}),
new Page({
   name: pluralization(TRANS_EXAM.name),
   path: `/${pluralization(TRANS_EXAM.name)}`,
   view: `${pluralization(TRANS_EXAM.name)}/Index`,
   icon: 'mdi-keyboard-outline', 
   title: `${TRANS_EXAM.title}`,
   menus: [MENUS.MAIN],
   alias: '/'
}),

//Groups Users
new Page({
   name: ROUTE_NAMES.USER_DETAILS,
   path: '/users/:id',
   view: 'users/Details',
   icon: '', 
   title: `${USER.title}管理`,
   menus: [],
   parent: 'users'
}),
//Groups TRANS_EXAM
new Page({
   name: ROUTE_NAMES.TRANS_EXAM_QUESTIONS,
   path: `/trans-exams/questions`,
   view: `trans-exams/question/Index`,
   icon: 'mdi-office-building',
   title: `題庫管理,${TRANS_EXAM.title} - 題庫管理`,
   menus: [MENUS.MAIN],
   parent: pluralization(TRANS_EXAM.name),
}),
new Page({
   name: ROUTE_NAMES.TRANS_EXAM_QUESTION_DETAILS,
   path: `/trans-exams/questions/:id`,
   view: `trans-exams/question/Details`,
   icon: '',
   title: `題庫管理,${TRANS_EXAM.title} - 題庫管理`,
   menus: [],
   parent: pluralization(TRANS_EXAM.name),
}),
]
const guestLinks = [
new Page({
   name: ROUTE_NAMES.LOGIN,
   path: `/${ROUTE_NAMES.LOGIN}`,
   view: `${upperFirstLetter(ROUTE_NAMES.LOGIN)}`,
   icon: '',
   title: 'Login',
   menus: []
})
]

applinks.forEach(page => page.setType(ROUTE_TYPES.FOR_ALL))

adminlinks.forEach(page => page.setType(ROUTE_TYPES.ADMIN_ONLY))

guestLinks.forEach(page => page.setType(ROUTE_TYPES.GUEST_ONLY))

const appRoutes = applinks.concat(adminlinks).concat(guestLinks)

appRoutes.forEach((page, index) => {
   page.setSubs(appRoutes.filter(item => item.hasParent(page.name)))
   page.setOrder(index)
})

export default appRoutes