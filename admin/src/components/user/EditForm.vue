<script setup>
import { reactive, computed, onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import { useVuelidate } from '@vuelidate/core'
import { email, required, numeric , helpers } from '@vuelidate/validators'
import { VALIDATE_MESSAGES } from '@/consts'
import { CLEAR_ERRORS } from '@/store/mutations.type' 
import { setValues, deepClone, statusText, isValidPhoneNumber, isValidTWID, isValidDob } from '@/utils'

const name = 'UserEditForm'
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
   'email':'Email',
	'phoneNumber':'手機號碼',
	'active':'狀態'
}

const rules = computed(() => {
	return {
		email: { 
			required: helpers.withMessage(VALIDATE_MESSAGES.REQUIRED(labels['email']), required), 
			email: helpers.withMessage(VALIDATE_MESSAGES.WRONG_FORMAT_OF(labels['email']), email), 
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
function checkPhone(val) {
	if(!val) return false
	return isValidPhoneNumber(val)
}
</script>

<template>
   <form v-if="props.model" @submit.prevent="onSubmit" @input="onInputChanged">
		<v-row>
			<v-col cols="12">
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
				<v-switch
				v-model="state.form.active"
				color="success" :label="status_text"
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