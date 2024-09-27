import { createRouter, createWebHistory } from 'vue-router'
import appRoutes from './app'
import store from '@/store'

import { ROUTE_NAMES } from '@/consts'
import { APP_CLOSED } from '@/config'
import { GET_MENUS } from '@/store/actions.type'
import { SET_ROUTE, CLEAR_ERRORS, SET_DOC_PERSONS, SET_DOCS } from '@/store/mutations.type'

const history = createWebHistory(process.env.BASE_URL)
const routes = appRoutes.map(item => {
	let parts = item.view.split('/')
	if(parts.length === 3) {
		return { 
			...item, 
			component: () => import(`@/views/${parts[0]}/${parts[1]}/${parts[2]}.vue`)
		}
	}
	else if(parts.length === 2) {
		return { 
			...item, 
			component: () => import(`@/views/${parts[0]}/${parts[1]}.vue`)
		}
	}else {
		const path = `@/views/${item.view}.vue`
		return { 
			...item, 
			component: () => import(`@/views/${item.view}.vue`)
		}
	}
})


const redirect = (next, route) => next(route)

const authDone = (next, to, auth = false) => {
	store.dispatch(GET_MENUS, auth)
	return next()
}

const router = createRouter({
	history, routes
})


router.beforeEach((to, from, next) => {
	if(APP_CLOSED && to.name !== ROUTE_NAMES.CLOSE) return redirect(next, { name: ROUTE_NAMES.CLOSE })
	
	if(to.name !== from.name) {
		store.commit(SET_DOC_PERSONS, [])
		store.commit(SET_DOCS, [])
	}
	
	store.commit(SET_ROUTE, { to: appRoutes.find(page => page.name === to.name), from: appRoutes.find(page => page.name === from.name) })
	store.commit(CLEAR_ERRORS)
	
	return authDone(next, to, false)
})

export default router
