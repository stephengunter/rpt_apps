<script setup>
import { MqResponsive } from 'vue3-mq'
import { ref, reactive, computed, watch, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { INIT_USERS, FETCH_USERS, CREATE_USER, STORE_USER, IMPORT_USERS
} from '@/store/actions.type'
import { SET_ERRORS, CLEAR_ERRORS } from '@/store/mutations.type'
import { isEmptyObject, deepClone , activeOptions, copyFromQuery,
	resolveErrorData, onErrors, onSuccess, setValues, badRequest, is400
} from '@/utils'
import { WIDTH, ROUTE_NAMES } from '@/consts'

const name = 'UsersIndexView'
const store = useStore()
const route = useRoute()
const router = useRouter()

const initialState = {
	admin_only: false,
	form: {
		title: '新增用戶',
		active: false,
		model: {},
		action: ''
	}
}

const state = reactive(deepClone(initialState))
const active_options = activeOptions


const query = computed(() => store.state.users.query)
const pagedList = computed(() => store.state.users.pagedList)
const roles = computed(() => store.state.users.roles)

const head = ref(null)


onMounted(() => {
	if(roles.length) init()
	else {
		store.dispatch(INIT_USERS)
		.then(() => {
			nextTick(init)
		})
		.catch(error => onErrors(error))
	}
})
function init() {
	head.value.init()
}

function fetchData(query) {
	if(!query) query = head.value.getQuery()
	store.commit(CLEAR_ERRORS)
	store.dispatch(FETCH_USERS, query)
	.then(() => {
		if(query.role) state.admin_only = true
		else state.admin_only = false		
	})
	.catch(error => onErrors(error))
}
function search(val) {
	state.params.keyword = val
	onParamsChanged()
}
function onOptionChanged(option) {
	if(option.hasOwnProperty('page')) state.params.page = option.page
	if(option.hasOwnProperty('size')) state.params.pageSize = option.size
	onParamsChanged()
}
function onParamsChanged() {
	router.push({ path: route.path, query: { ...state.params } })
}

function details(id) {
	router.push({ name: ROUTE_NAMES.USER_DETAILS, params: { id } })
}

function onCreate() {
	store.commit(CLEAR_ERRORS)
	store.dispatch(CREATE_USER)
	.then(model => {
		state.form.title = '新增用戶'
		state.form.action = STORE_USER
		state.form.model = deepClone(model)
		state.form.active = true
	})
	.catch(error => onErrors(error))
}
function onCancel() {
	state.form = deepClone(initialState.form)
}
function onSubmit(form) {
	setValues(form, state.form.model)
	store.dispatch(STORE_USER, state.form.model)
	.then(() => {
		fetchData()
		onCancel()
		onSuccess()
	})
	.catch(error => handleSubmitError(error))
}
function handleSubmitError(error) {
	if(is400(error)) {
		let errors = resolveErrorData(error)
		if(errors) store.commit(SET_ERRORS, Object.values(errors))
		else onErrors(error)
	}else onErrors(error)
}
</script>

<template>
	<div>
		<UserHead ref="head" :query="query" :active_options="active_options"
		@submit="fetchData" @create="onCreate"
		/>
		<v-row dense>
			<v-col cols="12">
				<UserTable v-if="!isEmptyObject(pagedList)"
				:model="pagedList" :roles="roles" :admin_only="state.admin_only"
				@options_changed="onOptionChanged"
				@select="details"
				/>
			</v-col>
		</v-row>
		<v-dialog persistent v-model="state.form.active" :width="WIDTH.M + 50">
			<v-card v-if="state.form.active" :max-width="WIDTH.M">
				<CommonCardTitle :title="state.form.title" 
				@cancel="onCancel"
				/>
				<v-card-text>
					<UserCreateForm
					:model="state.form.model"
					@submit="onSubmit"
					/>
				</v-card-text>
			</v-card>
		</v-dialog>
	</div>
</template>