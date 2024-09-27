<script setup>
import { reactive, onBeforeMount } from 'vue'
import { deepClone } from '@/utils'

const name = 'DocForm'
const props = defineProps({
	list: {
		type: Array,
		default: () => []
	},
   keep_reasons: {
		type: Array,
		default: () => []
	}
})
const emit = defineEmits(['submit'])

const initialState = {
   models: []
}
const state = reactive(deepClone(initialState))

onBeforeMount(() => {
   props.list.forEach(item => {
      let model = deepClone(item)
      model.error = ''
      state.models.push(model)
   })
   
})

function onSubmit() {
   state.models.forEach(model => {
      if(model.keep < 1) {
         model.error = '必須選擇保留原因'
      }else model.error = ''
   })

   let error_index = state.models.findIndex(x => x.error !== '')
   if(error_index < 0) {
      emit('submit', state.models)
   }
   
}


</script>
<template>
   <form @submit.prevent="onSubmit">
      <v-row dense>
         <v-col cols="12">
				<DocTable :can_check="false" :list="state.models" 
            :keep_reasons="keep_reasons" 
            />
			</v-col>
         <v-col cols="12">
            <v-btn class="float-right" type="submit" color="success">確定</v-btn>
         </v-col>
      </v-row>
   </form>
</template>