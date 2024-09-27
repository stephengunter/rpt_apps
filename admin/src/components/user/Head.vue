<script setup>
import { MqResponsive } from 'vue3-mq'
import { ref, reactive, computed, watch, onBeforeMount, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import Errors from '@/common/errors'
import { isEmptyObject, deepClone , activeOptions, areObjectsEqual, reviewedOptions,
	setValues, badRequest, tryParseInt, isTrue
} from '@/utils'
import { ROLE_TYPES, ROLES } from '@/consts'

const name = 'UserHead'
const emit = defineEmits(['submit', 'create', 'report'])
defineExpose({
   init, setQuery, getQuery, setPageOption
})

const store = useStore()
const route = useRoute()
const router = useRouter()

const props = defineProps({
	query: {
      type: Object,
      default: null
   },
	active_options: {
      type: Array,
      default: () => []
   }
})
const initialState = {
	query: {
	},
	role: ''
}
const state = reactive(deepClone(initialState))
const active_options = activeOptions
const role_options = [{
	value: 'admin', title: '管理者'
},
{
	value: '', title: '所有用戶'
}]
const query_match_route = computed(() => {
	if(route.query) {
		return areObjectsEqual(state.query, route.query, true)
	} return false
})
watch(route, init)

function init() {
   if(isEmptyObject(route.query)) {
		router.push({ path: route.path, query: { ...props.query } })
      return
	}
	state.query = { ...route.query }

	state.query.active = isTrue(state.query.active)
	state.query.page = tryParseInt(state.query.page)
	state.query.pageSize = tryParseInt(state.query.pageSize)
   emit('submit', state.query)
}
function setQuery(model) {
   setValues(model, state.query)
}
function getQuery() {
   return state.query
}
function setPageOption(option) {
	if(option.hasOwnProperty('page')) state.query.page = option.page
	if(option.hasOwnProperty('size')) state.query.pageSize = option.size
	onSubmit()
}
function onRoleChanged(val) {
	if(val) {
		state.query.role = `${ROLE_TYPES.BOSS},${ROLE_TYPES.DEV}`
	}else {
		state.query.role = ''
	}
	onSubmit()
}
function onQueryChanged() {
	onSubmit()
}

function onKeywordChanged(val) {
	state.query.keyword = val
	onSubmit()
}
function onSubmit() {
	if(query_match_route.value) emit('submit', state.query)
	else router.push({ path: route.path, query: { ...state.query } })	
}
function onCreate() {
	emit('create')
}

</script>


<template>
   <form v-show="!isEmptyObject(state.query)" @submit.prevent="onSubmit">
		<v-row dense>
			<v-col cols="3">
				<v-radio-group v-model="state.query.active" inline @update:modelValue="onQueryChanged">
					<v-radio v-for="(item, index) in active_options" :key="index"
					:label="item.title" :value="item.value"
					/>
				</v-radio-group>
			</v-col>
         <v-col cols="3">
				<v-select density="compact" label="角色"
				:items="role_options" v-model="state.role"
				@update:modelValue="onRoleChanged"
				/>
			</v-col>
			<v-col cols="3">
				<CommonInputSearch :keyword="state.query.keyword"
				@search="onKeywordChanged"
				/>
			</v-col>
			<v-col cols="3">
				<CommonButtonCreate class_name="float-right" 
				@create="onCreate"
				/>
			</v-col>
		</v-row>
	</form>
</template>