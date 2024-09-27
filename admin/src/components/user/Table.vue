<script setup>
import { ref, reactive, computed, watch, onBeforeMount, onMounted } from 'vue'
import { isEmptyObject, toDate, dateToNumber } from '@/utils'

const name = 'UserTable'
const props = defineProps({
   model: {
		type: Object,
		default: null
	},
   loading: {
		type: Boolean,
		default: false
	},
   can_remove: {
      type: Boolean,
      default: false
   },
   can_edit: {
      type: Boolean,
      default: true
   },
   roles: {
      type: Array,
      default: () => []
   },
   admin_only: {
      type: Boolean,
      default: false
   }
})

const emit = defineEmits(['select', 'options_changed'])

const headers = [{
   title: '姓名',
   align: 'start',
   width: '15%',
   sortable: false,
   key: 'name',
},{
   title: 'UserName',
   align: 'start',
   width: '30%',
   sortable: false,
   key: 'userName',
},{
   title: '出生日期',
   align: 'start',
   width: '15%',
   sortable: false,
   key: 'profiles.dateOfBirth',
},{
   title: '手機號碼',
   align: 'start',
   width: '20%',
   sortable: false,
   key: 'phoneNumber',
},{
   title: 'Email',
   align: 'start',
   width: '20%',
   sortable: false,
   key: 'email',
}]


const admin_headers = [{
   title: 'UserName',
   align: 'start',
   width: '30%',
   sortable: false,
   key: 'userName',
},{
   title: '手機號碼',
   align: 'start',
   width: '20%',
   sortable: false,
   key: 'phoneNumber',
},{
   title: '角色',
   align: 'start',
   width: '20%',
   sortable: false,
   key: 'roles',
}]

const list = computed(() => isEmptyObject(props.model) ? [] : props.model.viewList)

function roles(user) {
   return user.roles ? user.roles.split(',').map(id => props.roles.find(r => r.id === id)) : []
}
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
function dobText(user) {
   if(user.profiles && user.profiles.dateOfBirth) {
      const dob = toDate(user.profiles.dateOfBirth)
      return dateToNumber(dob, true)
   }
   return ''
}

</script>


<template>
   <v-data-table-server v-if="admin_only"
   v-model:items-per-page="model.pageSize"
   :headers="admin_headers"
   :items-length="model.totalItems"
   :loading="props.loading"
   :items="list"
   >
      <template v-slot:item.userName="{ item }">
         <a href="#" @click.prevent="select(item.id)">{{ item.userName }}</a>
      </template>
      
      <template v-slot:item.roles="{ item }">
         <UserRoleLabel v-for="(role, index) in roles(item)" :key="index"
         :model="role" 
         />
      </template>
      <template v-slot:bottom="{ item }">
         <CommonTablePager  :model="model"
         @page_changed="onPageChanged" @size_changed="onPageSizeChanged"
         />
      </template>
      
   </v-data-table-server>
   <v-data-table-server v-else
   v-model:items-per-page="model.pageSize"
   :headers="headers"
   :items-length="model.totalItems"
   :loading="props.loading"
   :items="list"
   >
      <template v-slot:item.userName="{ item }">
         <a href="#" @click.prevent="select(item.id)">{{ item.userName }}</a>
      </template>
      <template v-slot:item.profiles.dateOfBirth="{ item }">
         {{ item.profiles ? item.profiles.dobNum : '' }}
      </template>
      <template v-slot:bottom="{ item }">
         <CommonTablePager  :model="model"
         @page_changed="onPageChanged" @size_changed="onPageSizeChanged"
         />
      </template>
      
   </v-data-table-server>
</template>
