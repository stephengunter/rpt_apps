import { createStore } from 'vuex'

import app from './modules/app.module'
import auth from './modules/auth.module'
import attachments from './modules/attachments.module'
import users from './modules/users.module'
import profiles from './modules/profiles.module'
import trans_exam_questions from './modules/trans-exam/questions.module'

const store = createStore({
   modules: {
      app,
      auth,
      attachments,
      users,
      profiles,
      trans_exam_questions
   }
})

export default store
