<script setup>
const name = 'ProfilesView'
const props = defineProps({
	model: {
      type: Object,
      default: null
   }
})
const emit = defineEmits(['add','edit'])

const labels = {
	'name':'姓名',
	'dob':'出生日期',
	'ps':'備註',
	'createdAt':'建檔日期',
	'lastUpdated':'最後更新',
}
</script>

<template>
	<v-row>
		<v-col cols="12">
			<v-text-field :label="labels['name']"
			readonly :model-value="model.name"
			/>
			<v-text-field :label="labels['dob']"
			readonly :model-value="model.dobNum"
			/>
			<v-textarea :label="labels['ps']"
			readonly :model-value="model.ps"
			/>
			<v-text-field :label="labels['createdAt']"
			readonly :model-value="model.createdAtText"
			/>
			<v-text-field :label="labels['lastUpdated']"
			readonly :model-value="model.lastUpdatedText"
			/>
		</v-col>
	</v-row>
</template>