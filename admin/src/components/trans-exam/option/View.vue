<script setup>
import { reactive, computed } from 'vue'

const name = 'TransExamQuestionView'
const props = defineProps({
	model: {
      type: Object,
      default: null
   }
})
const emit = defineEmits(['edit'])

const lastUpdated = computed(() => props.model ? `${props.model.lastUpdated}` : '')

const roles = computed(() => props.model.roles ? props.model.roles.split(',').map(id => props.roles.find(r => r.id === id)) : [])

const labels = {
	'title':'標題',
   'email':'Email',
	'name':'名稱',
	'phoneNumber':'手機號碼',
	'roles':'角色',
	'active':'狀態',
	'createdAt':'建檔日期',
	'lastUpdated':'最後更新',
}

function edit() {
	emit('edit')
}
</script>

<template>
	<v-row>
		<v-col cols="12">
			<p class="q-title" v-text="model.title">				
			</p>
		</v-col>
	</v-row>
	<v-row>
		<v-col cols="6" v-for="(photo, index) in model.attachments" :key="index">
			<AttachmentPhoto max_width="480"  height="180"
			:model="photo"
			/>
		</v-col>
	</v-row>
</template>