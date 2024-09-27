<script setup>
import { reactive, ref, watch, computed, onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import { useVuelidate } from '@vuelidate/core'
import { email, required, numeric , helpers } from '@vuelidate/validators'
import { VALIDATE_MESSAGES } from '@/consts'
import Errors from '@/common/errors'
import { CLEAR_ERRORS } from '@/store/mutations.type' 
import { setValues, deepClone, uuid } from '@/utils'

const name = 'TransExamQuestionRow'
const props = defineProps({
   model: {
      type: Object,
      default: null
   },
	version: {
      type: Number,
      default: 0
   }
})
const emit = defineEmits(['submit'])


watch(
	() => props.version,
	(value) => {
		console.log(value)
		if(value) onSubmit()
	}
)

const store = useStore()
const initialState = {
   form: {
		id: '',
		title: '',
		correct: false
   },
	attachments: [],
	medias:[],
	errors: new Errors()
}
const state = reactive(deepClone(initialState))
const file_upload = ref(null)

onBeforeMount(init)

const labels = {
   'title':'標題'
}


function init() {
	setValues(props.model, state.form)
	if(!state.form.id) state.form.id = uuid()
}
function onSubmit() {
	console.log('onSubmit')
	state.errors.clear()
	checkTitle()
	if(state.errors.any()) return
	
	state.attachments = []
	state.medias.forEach(media => state.attachments.push(media.file))
	emit('submit', { form: state.form, attachments: state.attachments })
}
function onInputChanged() {	
   store.commit(CLEAR_ERRORS)
}
function checkTitle() {
	if(state.form.title) {
		state.errors.clear('title')
	}else {
		if(state.medias.length) state.errors.clear('title')
		else state.errors.set('title', ['必須輸入標題'])
	}
}
function onFileAdded({ files, thumbs }) {
	state.medias = []
	for (let i = 0; i < files.length; i++) {
		state.medias.push({
			file: files[i], thumb: thumbs[i]
		})
	}
	checkTitle()
}
</script>

<template>
   <tr>
		<td>
			{{ version }}
			<v-checkbox v-model="state.form.correct" :value="true" hide-details
         />
		</td>
		<td>
			<v-text-field variant="outlined" density="compact" class="mt-3"
			v-model="state.form.title"
			:error-messages="state.errors.get(`title`)"
			@input="checkTitle(index)"
			/>
		</td>
		<td>
			<CommonInputUpload ref="file_upload" :multiple="true" :show_button="true" :is_media="true"
			@file-added="onFileAdded" @file-removed="onFileAdded" 
			/>
			
			<v-img v-for="media in state.medias" :src="media.thumb.data" max-width="240">
			</v-img>
		</td>
		
	</tr>
</template>