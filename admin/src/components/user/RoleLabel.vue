<script setup>
import { getRoleColor } from '@/utils'
import { ROLE_TYPES, ROLES } from '@/consts'

const name = 'UserRoleLabel'
const props = defineProps({
   model: {
		type: Object,
		default: null
	},
   index: {
		type: Number,
		default: 0
	}
})

function roleColor(role) {
   return getRoleColor(role)
}
function roleTitle(role) {
   if(role.name === ROLE_TYPES.BOSS) return '管理員'
   if(role.name === ROLE_TYPES.DEV) return '管理員'
   return ''
}
</script>
<template>
   <v-chip v-if="model" variant="flat" size="small"
   :color="roleColor(model)" 
   :class="{ 'ml-1' : props.index > 0 }"
   >
   {{ roleTitle(model) }}
   </v-chip>
</template>