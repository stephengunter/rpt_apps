<script setup>
import { reactive, ref, computed, onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import { useVuelidate } from '@vuelidate/core'
import { email, required, numeric, helpers } from '@vuelidate/validators'
import { VALIDATE_MESSAGES } from '@/consts'
import Errors from '@/common/errors'
import { CLEAR_ERRORS } from '@/store/mutations.type'
import { setValues, deepClone, statusText, isValidPhoneNumber, isValidTWID, isValidDob } from '@/utils'

const name = 'TransExamQuestionForm'
const props = defineProps({
	model: {
		type: Object,
		default: null
	},
	active: {
		type: Boolean,
		default: false
	}
})
const emit = defineEmits(['submit'])

const store = useStore()
const initialState = {
	version: 0,
	form: {
		id: '',
		title: '',
		active: true
	},
	attachments: [],
	medias: [],
	options: [],
	errors: new Errors()
}
const state = reactive(deepClone(initialState))
const file_upload = ref(null)

onBeforeMount(init)

const labels = {
	'title': '標題',
	'active': '狀態'
}


function init() {
	const except = ['options']
	setValues(props.model, state.form, except)
}
function onSubmit() {
	store.commit(CLEAR_ERRORS)
	state.version += 1
	console.log(state.version)

	return
	if (state.errors.any()) return

	state.attachments = []
	state.medias.forEach(media => state.attachments.push(media.file))
	emit('submit', { form: state.form, attachments: state.attachments })
}
function onOptionsSubmit(models) {
	console.log('onOptionsSubmit', models)
}
function onInputChanged() {
	store.commit(CLEAR_ERRORS)
}
function checkTitle() {
	if (state.form.title) {
		state.errors.clear('title')
	} else {
		if (state.medias.length) state.errors.clear('title')
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
function checkOptionTitle(index) {

}
</script>

<template>
	<form v-if="model" @submit.prevent="onSubmit" @input="onInputChanged">
		<v-row dense>
			<v-col cols="12">
				<v-textarea label="標題" v-model="state.form.title" rows="5" row-height="15" outlined auto-grow
					:error-messages="state.errors.get('title')" @input="checkTitle" @blur="checkTitle" />
			</v-col>
		</v-row>
		<v-row dense>
			<v-col cols="12">
				<CommonInputUpload ref="file_upload" :multiple="true" :show_button="true" :is_media="true"
				@file-added="onFileAdded" @file-removed="onFileAdded" 
				/>
			</v-col>

			<v-col cols="3" v-for="media in state.medias">
				<v-img :src="media.thumb.data" max-width="240">
				</v-img>
			</v-col>
		</v-row>
		<v-row dense>
			<v-col cols="12">
				<TransExamOptionTable :version="state.version"
				:options="model.options"
				@submit="onOptionsSubmit"
				/>
				
			</v-col>
		</v-row>
		<v-row dense>
			<v-col cols="12">
				<CommonErrorsList />
			</v-col>
		</v-row>
		<v-row dense>
			<v-col cols="12">
				<v-btn type="submit" color="success" class="float-right">
					存檔
				</v-btn>
			</v-col>
		</v-row>
	</form>
</template>