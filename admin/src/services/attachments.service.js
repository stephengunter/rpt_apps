import BaseService from '@/common/baseService'
import { API_URL } from '@/config'

const source =`${API_URL}/admin/attachments`

const temp = (form) => BaseService.post(`${source}/temp`, form)

const store = (form) => BaseService.post(`${source}`, form)

const get = (id) => BaseService.fetch(`${source}/${id}`)


export default { temp, store, get }