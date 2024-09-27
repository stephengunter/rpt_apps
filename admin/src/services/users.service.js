import BaseService from '@/common/baseService'
import { API_URL } from '@/config'

const source =`${API_URL}/admin/users`

const init = () => BaseService.fetch(`${source}/init`)

const fetch = (params) => BaseService.fetch(source, params)

const create = () => BaseService.fetch(`${source}/create`)

const store = (model) => BaseService.post(`${source}`, model)

const roles = () => BaseService.fetch(`${source}/roles`)

const importing  = (model) => BaseService.post(`${source}/import`, model)

const details = (id) => BaseService.fetch(`${source}/${id}`)

const edit = (id) => BaseService.fetch(`${source}/edit/${id}`)

const update = (id, model) => BaseService.put(`${source}/${id}`, model)

const addPassword = (model) => BaseService.post(`${source}/password`, model)

export default { init, fetch, create, store, roles, importing, details, edit, update, addPassword }