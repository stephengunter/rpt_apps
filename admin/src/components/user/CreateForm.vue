<script setup>
import { reactive, computed, onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import { useVuelidate } from '@vuelidate/core'
import { email, required, numeric , helpers } from '@vuelidate/validators'
import { VALIDATE_MESSAGES } from '@/consts'
import { CLEAR_ERRORS } from '@/store/mutations.type' 
import { setValues, deepClone, statusText, isValidPhoneNumber, isValidTWID, isValidDob } from '@/utils'

const name = 'UserCreateForm'
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
   form: {
		id: '',
		userName: '',
      email: '',
      name: '',
		phoneNumber: '',
		active: true
   }
}
const state = reactive(deepClone(initialState))
const status_text = computed(() => statusText(state.form.active))

onBeforeMount(init)

const labels = {
   'userName':'身分證號',
	'dob':'出生日期(6位數字)',
   'email':'Email',
	'name':'姓名',
	'phoneNumber':'手機號碼',
	'active':'狀態'
}

const rules = computed(() => {
	return {
		userName: { 
			required: helpers.withMessage(VALIDATE_MESSAGES.REQUIRED(labels['userName']), required),
			is_valid_userName: helpers.withMessage(VALIDATE_MESSAGES.WRONG_FORMAT_OF(labels['userName']), checkUserName)
		},
		dob: { 
			required: helpers.withMessage(VALIDATE_MESSAGES.REQUIRED(labels['dob']), required),
			is_valid_dob: helpers.withMessage(VALIDATE_MESSAGES.WRONG_FORMAT_OF(labels['dob']), checkDob)
		},
		email: { 
			required: helpers.withMessage(VALIDATE_MESSAGES.REQUIRED(labels['email']), required), 
			email: helpers.withMessage(VALIDATE_MESSAGES.WRONG_FORMAT_OF(labels['email']), email), 
		},
		name: {
			required: helpers.withMessage(VALIDATE_MESSAGES.REQUIRED(labels['name']), required)
		},
		phoneNumber: {
			required: helpers.withMessage(VALIDATE_MESSAGES.REQUIRED(labels['phoneNumber']), required),
			numeric: helpers.withMessage(VALIDATE_MESSAGES.IS_NUMERIC(labels['phoneNumber']), numeric),
			is_valid_phoneNumber: helpers.withMessage(VALIDATE_MESSAGES.WRONG_FORMAT_OF(labels['phoneNumber']), checkPhone)
		}
	}
})

const v$ = useVuelidate(rules, state.form)

function init() {
	setValues(props.model, state.form)
}
function onSubmit() {
	v$.value.$validate().then(valid => {
      if(!valid) return
		emit('submit', state.form)
	})
}
function onInputChanged(){
   store.commit(CLEAR_ERRORS)
}

function checkUserName(val) {
	if(!val) return false
	return isValidTWID(val)
}
function checkPhone(val) {
	if(!val) return false
	return isValidPhoneNumber(val)
}
function checkDob(val) {
	if(!val) return false
	return isValidDob(val)
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
				<v-text-field :label="labels['userName']"                   
				v-model="state.form.userName"
				:error-messages="v$.userName.$errors.map(e => e.$message)"                     
				@input="v$.userName.$touch"
				@blur="v$.userName.$touch"
				/>
				<v-text-field :label="labels['dob']"                   
				v-model="state.form.dob"
				:error-messages="v$.dob.$errors.map(e => e.$message)"                     
				@input="v$.dob.$touch"
				@blur="v$.dob.$touch"
				/>
				<v-text-field :label="labels['phoneNumber']"
				v-model="state.form.phoneNumber"
				:error-messages="v$.phoneNumber.$errors.map(e => e.$message)"                     
				@input="v$.phoneNumber.$touch"
				@blur="v$.phoneNumber.$touch"
				/>
				<v-text-field :label="labels['email']"
				v-model="state.form.email"
				:error-messages="v$.email.$errors.map(e => e.$message)"                     
				@input="v$.email.$touch"
				@blur="v$.email.$touch"
				/>
				<CommonErrorsList />
			</v-col>
			<v-col cols="12">
				<v-btn type="submit" color="success" class="float-right">
				存檔
				</v-btn>
			</v-col>  
		</v-row>
	</form>
</template>