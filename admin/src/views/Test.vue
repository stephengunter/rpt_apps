<script setup>
import { reactive, onBeforeMount } from 'vue'
import { DIALOG_MAX_WIDTH } from '@/config'
import { setValues, deepClone, statusText, isValidUserName, isValidPhoneNumber, isValidTWID } from '@/utils'

const data = reactive({
	image: {
		active: false
	}
})
onBeforeMount(init)  
function init() {
	console.log(isValidTWID("F124597024"))
}

</script>

<template>
	<div>
		<v-row>
			<v-col cols="12">
				<v-img src="@/assets/photo_404.png" max-width="240px"></v-img>
				<v-img
        class="mx-auto"
        max-width="200"
        src="https://picsum.photos/500/300?image=232"
      ></v-img>
			</v-col>
		</v-row>
		<v-row>
			<v-col cols="12">
				<v-img
    class="mx-auto"
    max-width="200" height="300"
    src="https://bad.src/not/valid"
  >
    <template v-slot:error>
      <v-img
        class="mx-auto"
        max-width="200" height="300"
        src="@/assets/photo_404.png"
      ></v-img>
    </template>
  </v-img>
			</v-col>
		</v-row>
		
	</div>
 </template>