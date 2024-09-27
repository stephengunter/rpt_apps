<script setup>
import { reactive, ref, computed, watch, onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import { useVuelidate } from '@vuelidate/core'
import { email, required, numeric , helpers } from '@vuelidate/validators'
import { VALIDATE_MESSAGES } from '@/consts'
import Errors from '@/common/errors'
import { CLEAR_ERRORS, SET_ERRORS } from '@/store/mutations.type' 
import { setValues, deepClone, statusText, isValidPhoneNumber, isValidTWID, isValidDob } from '@/utils'

const name = 'TransExamOptionTable'
const props = defineProps({
   options: {
      type: Array,
      default: () => []
   },
	version: {
      type: Number,
      default: 0
   }
})
const emit = defineEmits(['submit'])

const store = useStore()
const initialState = {
   models: [],
	// attachments: [],
	// medias:[],
	// errors: new Errors()
}
const state = reactive(deepClone(initialState))
const file_upload = ref(null)

watch(
	() => props.version,
	(value) => {
		console.log(value)
	}
)
onBeforeMount(init)

const labels = {
   'title':'標題',
	'active':'狀態'
}


function init() {
	//console.log(props.model)
	//setValues(props.model, state.form)
}
function onSubmit() {
	if(state.errors.any()) return
	
	state.attachments = []
	state.medias.forEach(media => state.attachments.push(media.file))
	emit('submit', { form: state.form, attachments: state.attachments })
}
function onRowSubmit(model) {
	
	let index = state.models.findIndex(item => item.form.id === model.form.id)
	if(index < 0) state.models.push(model)
	else state.models.splice(index, 1)
	
	if(state.models.length === props.options.length) {
		if(checkModels(state.models)) {
			console.log('ok state.models', state.models)
			emit('submit', state.models)
		}
	}
	
}
function checkModels(models) {
	console.log('checkModels', models)
	const correctItems = models.filter(model => model.form.correct)
	if(correctItems.length > 1) {
		store.commit(SET_ERRORS, { correct: ['只能有一個正確選項'] })
		return false
	}
	if(correctItems.length < 1) {
		store.commit(SET_ERRORS, { correct: ['必須有一個正確選項'] })
		return false
	}
	else return true
	
}
</script>

<template>
   <v-table>
		<thead>
			<tr>
				<th style="width: 10%;">正確答案</th>
				<th style="width: 70%;">標題</th>
				<th style="width: 20%;">圖片</th>
				
			</tr>
		</thead>
		<tbody>
			<TransExamOptionRow v-for="(option, index) in options" :key="index"
			:version="version" :model="option"
			@submit="onRowSubmit"
			/>
		</tbody>
	</v-table>
</template>