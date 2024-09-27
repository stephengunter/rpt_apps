<script setup>
import { reactive, ref, computed, onBeforeMount } from 'vue'
import { API_URL } from '@/config'

const name = 'AttachmentPhoto'
const props = defineProps({
   model: {
      type: Object,
      default: null
   },
	max_width: {
      type: String,
      default: '200'
   },
	height: {
      type: String,
      default: '300'
   }
})

onBeforeMount(() => {
	console.log(props.model)
})
</script>

<template>
	<v-img 
	:max-width="max_width" :height="height"
	:src="`${API_URL}/photoes/${model.id}`" 
  	>
		<template v-slot:error>
			<v-img 
			:max-width="max_width" :height="height"  
			src="@/assets/photo_404.png"
			/>
		</template>
  	</v-img>
</template>