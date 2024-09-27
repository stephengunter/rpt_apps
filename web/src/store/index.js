import { createStore } from 'vuex'

import app from './modules/app.module'
import docs from './modules/docs.module'

const store = createStore({
   modules: {
      app,
      docs
   }
})

export default store
