/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import vuetify from './vuetify'
import { registerFilters } from './filters'
import { addVue3Mq } from './vue3Mq'
import { addTimeAgo } from './timeago'
import { addSocialSharing } from './socialSharing'

import router from '@/routes'
import store from '@/store'

export const registerPlugins = (app) => {
	registerFilters(app)
	addVue3Mq(app)
	addTimeAgo(app)
	addSocialSharing(app)

	app.use(vuetify)
		.use(router)
		.use(store)
		
}
