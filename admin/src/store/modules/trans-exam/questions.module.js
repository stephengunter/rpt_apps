import Service from '@/services/trans-exam/questions.service'
import { resolveErrorData, deepClone } from '@/utils'

import { INIT_TRANEXAM_QUESTIONS, FETCH_TRANEXAM_QUESTIONS, CREATE_TRANEXAM_QUESTION, STORE_TRANEXAM_QUESTION,
   TRANEXAM_QUESTION_DETAILS, EDIT_TRANEXAM_QUESTION,
   UPDATE_TRANEXAM_QUESTION } from '@/store/actions.type'
import { SET_TRANEXAM_QUESTION_INDEX_MODEL, SET_TRANEXAM_QUESTIONS, SET_TRANEXAM_QUESTION, SET_LOADING } from '@/store/mutations.type'



const initialState = {
   query: {
   },
   optionCount: 4,
   pagedList: null,
   question: null,
   recruits: []
}

const state = deepClone(initialState)
 
const getters = {
   
}


const actions = {
   [INIT_TRANEXAM_QUESTIONS](context) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.init()
            .then(model => {
               context.commit(SET_TRANEXAM_QUESTION_INDEX_MODEL, model)
               resolve()
            })
            .catch(error => reject(error))
            .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [FETCH_TRANEXAM_QUESTIONS](context, query) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.fetch(query)
            .then(model => {
               context.commit(SET_TRANEXAM_QUESTIONS, model)
               resolve(model)
            })
            .catch(error => reject(error))
            .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [CREATE_TRANEXAM_QUESTION](context, query) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.create(query)
            .then(model => resolve(model))
            .catch(error => reject(error))
            .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [STORE_TRANEXAM_QUESTION](context, model) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.store(model)
            .then(model => resolve(model))
            .catch(error => reject(error))
            .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [TRANEXAM_QUESTION_DETAILS](context, id) {
      context.commit(SET_TRANEXAM_QUESTION, null)
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.details(id)
            .then(model => {
               context.commit(SET_TRANEXAM_QUESTION, model)
               resolve(model)
            })
            .catch(error => reject(error))
            .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [EDIT_TRANEXAM_QUESTION](context, id) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.edit(id)
            .then(user => resolve(user))
            .catch(error => reject(error))
            .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [UPDATE_TRANEXAM_QUESTION](context, { id, model }) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.update(id, model)
            .then(() => resolve())
            .catch(error => reject(error))
            .finally(() => context.commit(SET_LOADING, false))
      })
   }
}


const mutations = {
   [SET_TRANEXAM_QUESTION_INDEX_MODEL](state, model) {
      state.query = model.request
      state.optionCount = model.optionCount
   },
   [SET_TRANEXAM_QUESTIONS](state, model) {
      state.pagedList = model
   },
   [SET_TRANEXAM_QUESTION](state, question) {
      state.question = question
   }
}

export default {
   state,
   actions,
   mutations,
   getters
}
 