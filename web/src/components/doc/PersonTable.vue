<script setup>
import { reactive, onBeforeMount } from 'vue'
import { deepClone } from '@/utils'

const name = 'DocPersonTable'

const emit = defineEmits(['selected'])
const props = defineProps({
   persons: {
      type: Array,
      default: () => []
   }
})

const initialState = {

}
const state = reactive(deepClone(initialState))

onBeforeMount(() => {

})

function onNameSelected(name) {
   emit('selected', name)
}
</script>

<template>
   <v-table hover>
      <thead>
         <tr>
            <th class="font-weight-bold" style="width: 30%;">姓名</th>
            <th class="font-weight-bold" style="width: 10%;">是否已確認</th>
            <th class="font-weight-bold" style="width: 15%;">存檔時間</th>
            <th class="font-weight-bold" style="width: 20%;">IP</th>
         </tr>
      </thead>
      <tbody>
         <tr v-for="(model, index) in persons" :key="index">
            <td>
               <a href="#" v-text="model.person ? model.person : '(null)'"
                  @click.prevent="onNameSelected(model.person ? model.person : 'null')"></a>
            </td>
            <td v-if="model.confirmed" style="color: blue;">
               已確認
            </td>
            <td v-else style="color: red;">
               尚未確認
            </td>
            <td v-if="model.confirmed" style="color: blue;">
               {{ model.lastUpdatedText }}
            </td>
            <td v-else>

            </td>
            <td v-if="model.confirmed" style="color: blue;">
               {{ model.ip }}
            </td>
            <td v-else>

            </td>
         </tr>
      </tbody>
   </v-table>
</template>