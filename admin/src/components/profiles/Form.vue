<script setup>
import { reactive, computed, onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import { useVuelidate } from '@vuelidate/core'
import { required, helpers } from '@vuelidate/validators'
import { VALIDATE_MESSAGES } from '@/consts'
import { CLEAR_ERRORS } from '@/store/mutations.type' 
import { setValues, deepClone, isValidDob } from '@/utils'

const name = 'ProfilesForm'
const props = defineProps({
   model: {
      type: Object,
      default: null
   },
	active: {
      type: Boolean,
      default: false
   },
	can_remove: {
      type: Boolean,
      default: false
   }
})
const emit = defineEmits(['submit', 'remove'])

const store = useStore()
const initialState = {
   form: {
      name: '',
		dob: '',
      ps: ''
   }
}
const state = reactive(deepClone(initialState))

onBeforeMount(init)

const labels = {
	'name':'姓名',
	'dob':'出生日期',
	'ps':'備註'
}

const rules = computed(() => {
	return {
		name: { 
			required: helpers.withMessage(VALIDATE_MESSAGES.REQUIRED(labels['name']), required)
		},
		dob: { 
			required: helpers.withMessage(VALIDATE_MESSAGES.REQUIRED(labels['dob']), required),
			is_valid_dob: helpers.withMessage(VALIDATE_MESSAGES.WRONG_FORMAT_OF(labels['dob']), checkDob)
		}
	}
})

const v$ = useVuelidate(rules, state.form)

function init() {
	setValues(props.model, state.form)
}
function checkDob(val) {
	if(!val) return false
	return isValidDob(val)
}
function onSubmit() {
	v$.value.$validate().then(valid => {
      if(!valid) return
		emit('submit', state.form)
	})
}
function remove() {
	emit('remove')
}
function onInputChanged(){
   store.commit(CLEAR_ERRORS)
}
</script>

<template>
   <form v-if="props.model" @submit.prevent="onSubmit" @input="onInputChanged">
		<v-row>
			<v-col cols="12">
				<v-text-field :label="labels['name']"                
				v-model="state.form.name"
				:error-messages="v$.name.$errors.map(e => e.$message)"                     
				@input="v$.name.$touch"
				@blur="v$.name.$touch"
				/>
				<v-text-field :label="labels['dob']"                
				v-model="state.form.dob"
				:error-messages="v$.dob.$errors.map(e => e.$message)"                     
				@input="v$.dob.$touch"
				@blur="v$.dob.$touch"
				/>
				<v-text-field :label="labels['ps']"                   
				v-model="state.form.ps"
				/>
				<CommonErrorsList v-if="props.active" />
			</v-col>
			<v-col cols="12">
				<v-btn type="button" v-if="props.can_remove" color="error" 
				@click.prevent="remove"
				>
				刪除
				</v-btn>
				<v-btn type="submit" color="success" class="float-right">
				存檔
				</v-btn>
			</v-col>
		</v-row>
	</form>
</template>