<script setup>
import { MqResponsive } from 'vue3-mq'
import { ref, reactive, computed, watch, onBeforeMount, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import Errors from '@/common/errors'
import { isEmptyObject, deepClone , activeOptions, areObjectsEqual, reviewedOptions,
	setValues, badRequest, tryParseInt, isTrue
} from '@/utils'
import { SHOW_PHOTO } from '@/store/actions.type'

const name = 'TransExamQuestionTable'

const emit = defineEmits(['select', 'options_changed'])

const store = useStore()
const route = useRoute()
const router = useRouter()

const props = defineProps({
	model: {
		type: Object,
		default: null
	},
	can_remove: {
		type: Boolean,
		default: false
	},
	can_edit: {
		type: Boolean,
		default: true
	},
	show_resolves: {
		type: Boolean,
		default: true
	},
	show_recruits: {
		type: Boolean,
		default: true
	},
	show_terms: {
		type: Boolean,
		default: false
	}
})
const initialState = {
	headers: [{
		sortable: false,
		title: 'Id',
		key: 'id',
		width: '30px'
	},
	{
		sortable: false,
		title: '標題',
		key: 'title',
		width: '30%'
	},
	{
		sortable: false,
		title: '圖片',
		key: 'attachments',
		width: '20%'
	},
	{
		sortable: false,
		title: '選項',
		key: 'options'
	}]	
	
}
const state = reactive(deepClone(initialState))

const list = computed(() => isEmptyObject(props.model) ? [] : props.model.viewList)

function showPhoto(photo) {
	Bus.emit(SHOW_PHOTO, photo);
}
      
function remove(id) {
	emit('remove', id);
}
function edit(id){
	emit('edit', id);
}

onBeforeMount(() => {
	// if(props.can_remove || props.can_edit) state.headers.unshift({
	// 	sortable: false,
	// 	text: '',
	// 	value: '',
	// 	width: '45px'
	// })
	// if(props.show_resolves) state.headers.push({
	// 	sortable: false,
	// 	text: '解析',
	// 	width: '10%'
	// })
	// if(props.show_terms) state.headers.push({
	// 	sortable: false,
	// 	text: '條文',
	// 	width: '15%'
	// })
	// if(props.show_recruits) state.headers.push({
	// 	sortable: false,
	// 	text: '考古題',
	// 	width: '15%'
	// })
})
function select(id) {
	emit('select', id)
}
function onPageChanged(page) {
   emit('options_changed', {
      page
   })
}     
function onPageSizeChanged(size) {
   emit('options_changed', {
      size 
   })
} 
</script>

<template>
   <v-data-table-server v-model:items-per-page="model.pageSize"
   :headers="state.headers"
   :items-length="model.totalItems"
   :items="list"
   >
		<!-- <template v-slot:item.action="{ item }">
			<CommonButtonEdit size="x-small" :icon_only="true" color="success"
						@edit="edit(item.id)"
						/>
      </template> -->
		<template v-slot:item.title="{ item }">
			<a href="#" @click.prevent="select(item.id)">{{ item.title }}</a>
			
      </template>
		<template v-slot:item.attachments="{ item }">
			<AttachmentPhoto v-for="(photo, index) in item.attachments" :key="index" max_width="240px" 
			:model="photo"
			/>
      </template>
		<template v-slot:bottom="{ item }">
         <CommonTablePager  :model="model"
         @page_changed="onPageChanged" @size_changed="onPageSizeChanged"
         />
      </template>
      <!-- <template v-slot:body="{ items }">
         <tbody>
            <tr v-for="item in items" :key="item.id">
               <td>
						<CommonButtonEdit size="x-small" :icon_only="true" color="success"
						@edit="edit(item.id)"
						/>
                <v-btn v-if="can_edit" @click.prevent="edit(item.id)" icon color="success">
                     <v-icon small>mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn v-if="can_remove" @click.prevent="remove(item.id)" small icon color="error">
                     <v-icon>mdi-delete-circle</v-icon>
                  </v-btn> 
               </td>
               <td>
                  {{ item.id }}
               </td>
               <td>
                  {{ item.title }}
                  <a href="#" v-if="item.attachments.length" @click.prevent="showPhoto(item.attachments[0])">
							85
                 <img  style="vertical-align:middle" 
                     :src="item.attachments[0].previewPath | photoNameUrl(50)"
                     > 
                  </a>
               </td>
               <td style="padding: 10px 16px;">
                  <option-list :options="item.options" 
                  @show-photo="showPhoto"
                  />
               </td>
               
            </tr>
         </tbody>
      </template> -->
   </v-data-table-server>
</template>
