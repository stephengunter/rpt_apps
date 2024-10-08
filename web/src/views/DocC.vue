<script setup>
import { ref, reactive, computed, watch, onBeforeMount, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { deepClone , onErrors, copyFromQuery
} from '@/utils'
import { INIT_DOCS, FETCH_DOCS, STORE_DOC } from '@/store/actions.type'

import { WIDTH } from '@/consts'

const name = 'DocCView'
const store = useStore()
const route = useRoute()
const router = useRouter()
const table = ref(null)

const initialState = {
	query: {
      person: '',
      flag: -1
	},
   select: {
		title: '請選擇姓名',
		action: '',
		active: false,
      model: null
	},
   form: {
		title: '請選擇保留原因',
		active: false,
      list: []
	},
   saves: 0,
   checked_ids: [],
   fetching: false
}
const state = reactive(deepClone(initialState))
const persons = computed(() => store.state.docs.persons)
const keep_reasons = computed(() => store.state.docs.keep_reasons)
const person_selected = computed(() => {
   if(persons.value && state.query.person) {
      return persons.value.find(p => p.person === state.query.person)
   }
   return null
})
const list = computed(() => store.state.docs.list)

onBeforeMount(() => {
   if(persons.value && persons.value.length) {
      init()
   }else {
      store.dispatch(INIT_DOCS, { flag: state.query.flag })
		.then(() => {        
			nextTick(init)
		})
		.catch(error => onErrors(error))
   }
})

watch(route, init)

function init() {
	if(route.query) copyFromQuery(state.query, route.query)
	if(state.query.person) {      
      fetchData(state.query)
   }else {
      state.select.active = true
   }  
}
function selectPerson() {
   state.select.active = true
}
function onNameSelected(name) {
   state.query.person = name
   router.push({ name: 'doc-c', query: { ...state.query } })
   state.select.active = false
}
function getKeepReason(key) {
   return ''
}
function onSave() {
   const checked_ids = table.value.getCheckIds()
   if(checked_ids.length) {
      let records = list.value.filter(x => checked_ids.includes(x.id))
      state.form.list = records
      state.form.active = true
   }
   else {
      const model = {
         flag: state.query.flag,
         person: state.query.person,
         ids: []
      }

      store.dispatch(STORE_DOC, model)
      .then(() => {
         fetchData(state.query)
      })
      .catch(error => onErrors(error))
   }
   
   
}
function onCancel() {
   state.form.list = []
   state.form.active = false
}

function fetchData(query) {
   state.fetching = true
   store.dispatch(FETCH_DOCS, query)
   .then(list => {
      state.checked_ids = list.filter(x => x.keep > 0 && x.keep !== 2).map(x => x.id)
      nextTick(() => {
         table.value.setCheckIds(state.checked_ids)
      })
   })
   .catch(error => onErrors(error))
}

function onSubmit(models) {
   const model = {
      flag: state.query.flag,
      person: state.query.person,
      docModels: models.slice(0)
   }
   store.dispatch(STORE_DOC, model)
   .then(() => {
      fetchData(state.query)
      onCancel()
   })
   .catch(error => onErrors(error))
}

function cancel() {
   state.select.active = false
}
</script>

<template>
<div>
   <v-row dense>
      <v-col cols="4">
         <v-select density="compact" readonly
         label="承辦人"  :items="persons" item-title="person" item-value="person"
         v-model="state.query.person" @click.prevent="selectPerson"
         />
      </v-col>
      <v-col cols="4">
         <!-- <div>
            <v-btn class="float-left mr-3" color="success"
            @click.prevent="onSave" 
            >
            確定
            </v-btn>
         </div>
         <div class="ml-2 mt-2">
            <span v-if="person_selected">存檔次數： {{ person_selected.saves }}</span>
         </div> -->
         
      </v-col>
      <v-col cols="4">
         <!-- <div class="ml-2 mt-2">
            <span style="color: red;">資料清查作業已經截止</span>
         </div> -->
      </v-col>
   </v-row>
   <v-row dense>
		<v-col cols="12">
			<DocTable ref="table"  :list="list" :allow_edit="false"
         :keep_reasons="keep_reasons"
         />
		</v-col>
	</v-row>
   <v-dialog persistent v-model="state.select.active" :width="WIDTH.M + 50">
		<v-card v-if="state.select.active" :max-width="WIDTH.M">
			<CommonCardTitle :title="state.select.title" @cancel="cancel"
			/>
			<v-card-text>
				<v-row dense>
               <v-col cols="12">
                  <v-table hover>
                     <thead>
                        <tr>
                           <th class="font-weight-bold" style="width: 95%;">姓名</th>
                        </tr>
                     </thead>
                     <tbody>
                        <tr v-for="(model, index) in persons" :key="index">
                           <td>
                              <a href="#" v-text="model.person ? model.person : '(null)'" @click.prevent="onNameSelected(model.person ? model.person : 'null')"></a>
                           </td>
                        </tr>
                     </tbody>
                  </v-table>
               </v-col>
            </v-row>
			</v-card-text>
		</v-card>
	</v-dialog>
   <!-- <v-dialog persistent v-model="state.form.active" :width="WIDTH.XL + 50">
		<v-card v-if="state.form.active" :max-width="WIDTH.XL">
			<CommonCardTitle :title="state.form.title" 
         @cancel="onCancel"
			/>
			<v-card-text>
            <DocForm :list="state.form.list" :keep_reasons="keep_reasons" 
            @submit="onSubmit"
            />
			</v-card-text>
		</v-card>
	</v-dialog> -->
</div>
</template>