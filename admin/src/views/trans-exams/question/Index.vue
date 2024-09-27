<script setup>
import { MqResponsive } from 'vue3-mq'
import { ref, reactive, computed, watch, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { INIT_TRANEXAM_QUESTIONS, FETCH_TRANEXAM_QUESTIONS, CREATE_TRANEXAM_QUESTION, STORE_TRANEXAM_QUESTION, 
	STORE_ATTACHMENT
} from '@/store/actions.type'
import { SET_ERRORS, CLEAR_ERRORS } from '@/store/mutations.type'
import { isEmptyObject, deepClone , activeOptions, copyFromQuery,
	resolveErrorData, onErrors, onSuccess, setValues, badRequest, is400
} from '@/utils'
import { WIDTH, ROUTE_NAMES } from '@/consts'

const name = 'TransExamQuestionsIndexView'
const store = useStore()
const route = useRoute()
const router = useRouter()

const initialState = {
	admin_only: false,
	form: {
		title: '新增題目',
		active: false,
		model: {},
		action: ''
	}
}

const state = reactive(deepClone(initialState))
const active_options = activeOptions


const query = computed(() => store.state.trans_exam_questions.query)
const pagedList = computed(() => store.state.trans_exam_questions.pagedList)
const recruits  = computed(() => store.state.trans_exam_questions.recruits)
const optionCount  = computed(() => store.state.trans_exam_questions.optionCount)

const head = ref(null)


onMounted(() => {
	if(recruits.length) init()
	else {
		store.dispatch(INIT_TRANEXAM_QUESTIONS)
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
	store.dispatch(FETCH_TRANEXAM_QUESTIONS, query)
	.then(() => {
		// if(query.role) state.admin_only = true
		// else state.admin_only = false		
	})
	.catch(error => onErrors(error))
}
function search(val) {
	state.params.keyword = val
	onParamsChanged()
}
function onOptionChanged(option) {
	let query = deepClone(head.value.getQuery())

	if(option.hasOwnProperty('page')) query.page = option.page
	if(option.hasOwnProperty('size')) query.pageSize = option.size
	onQueryChanged(query)
}
function onQueryChanged(query) {
	router.push({ path: route.path, query })
}

function details(id) {
	console.log('opopo')
	router.push({ name: ROUTE_NAMES.TRANS_EXAM_QUESTION_DETAILS, params: { id } })
}

function onCreate() {
	store.commit(CLEAR_ERRORS)
	store.dispatch(CREATE_TRANEXAM_QUESTION, { option_count: optionCount.value })
	.then(model => {
		console.log(model)
		state.form.title = '新增題目'
		state.form.action = STORE_TRANEXAM_QUESTION
		state.form.model = deepClone(model)
		state.form.active = true
	})
	.catch(error => onErrors(error))
}
function onCancel() {
	state.form = deepClone(initialState.form)
}
function onSubmit(model) {
	
	setValues(model.form, state.form.model)
	store.dispatch(STORE_TRANEXAM_QUESTION, state.form.model)
	.then(data => {
		if(model.attachments.length) {
			console.log(model.attachments)
			let attachments = []
			model.attachments.forEach(item => {
				attachments.push({
					postType: 'Question',
					postId: data.id,
					file: item
				})
			})
			
			storeAttachments(attachments)
			.then(attachment_results => {
				console.log(attachment_results)
			})
			.catch(error => reject(error))
		
		}
		
		// fetchData()
		// onCancel()
		// onSuccess()
	})
	.catch(error => handleSubmitError(error))
}

function storeAttachments(attachments) {
	if(!attachments.length) return new Promise((resolve) => resolve([]))
	return new Promise((resolve, reject) => {
		let results = []
		attachments.forEach(attachment => {
			store.commit(CLEAR_ERRORS)
			store.dispatch(STORE_ATTACHMENT, attachment)
			.then(model => {
				model.uuid = attachment.uuid
				results.push(model)
				if(results.length === attachments.length) {
					resolve(results)
				}
			})
			.catch(error => reject(error))
		})
	})
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
		<TransExamQuestionHead ref="head" :query="query" :active_options="active_options"
		@submit="fetchData" @create="onCreate"
		/>
		<v-row dense>
			<v-col cols="12">
				<TransExamQuestionTable v-if="!isEmptyObject(pagedList)"
				:model="pagedList"
				@options_changed="onOptionChanged"
				@select="details"
				/>
			</v-col>
		</v-row>
		<v-dialog persistent v-model="state.form.active" :width="WIDTH.L + 50">
			<v-card v-if="state.form.active" :max-width="WIDTH.L">
				<CommonCardTitle :title="state.form.title" 
				@cancel="onCancel"
				/>
				<v-card-text>
					<TransExamQuestionForm
					:model="state.form.model" :option_count="state.form.option_count"
					@submit="onSubmit"
					/>
				</v-card-text>
			</v-card>
		</v-dialog>
	</div>
</template>