import { cloneDeep } from 'lodash'

export const deepClone = (obj) => cloneDeep(obj)

export const getListFromObj = (obj) => {
   const list = [];
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const value = obj[key]
            list.push({ value: key, title: value })
        }
    }
    return list
}

export const findItemFromObj = (obj, item_key, item_value) => {
   for (const key in obj) {
      const item = obj[key]
      if (item.hasOwnProperty(key)) {
         if (item[item_key] === item_value) return item
      }
   }
   return null
}

export const setValues = (source, dest, except = []) => {
   for(const key of Object.keys(dest)) {
      if(except.includes(key)) continue
		if(source.hasOwnProperty(key)) {
			dest[key] = source[key]
		}
	}

   // for(const [key, value] of Object.keys(source)) {
   //    if(except.includes(key)) continue
	// 	if(dest.hasOwnProperty(key)) {
	// 		dest[key] = value
	// 	}
	// }
}
export const areObjectsEqual = (obj1, obj2, ignoreType = false) => {
   if (obj1 === obj2) return true
   if (obj1 == null || obj2 == null) return false
   if (typeof obj1 !== 'object' || typeof obj2 !== 'object') return false

   const keys1 = Object.keys(obj1)
   const keys2 = new Set(Object.keys(obj2))

   if (keys1.length !== keys2.size) {
      return false
   }

   for (const key of keys1) {
      if (!keys2.has(key)) return false
      const val1 = obj1[key]
      const val2 = obj2[key]

      let areValuesEqual
      if (ignoreType) {
         areValuesEqual = String(val1) === String(val2)
      } else {
         areValuesEqual = val1 === val2
      }

      if (typeof val1 === 'object' && typeof val2 === 'object') {
         areValuesEqual = areObjectsEqual(val1, val2, ignoreType)
      }

      if (!areValuesEqual) {
         return false
      }
   }

   return true
}

export const isEmptyObject = (obj) => {
   if (obj == null) return true

   // Assume if it has a length property with a non-zero value
   // that that property is correct.
   if (obj.length > 0)    return false
   if (obj.length === 0)  return true

   // If it isn't an object at this point
   // it is empty, but it can't be anything *but* empty
   // Is it empty?  Depends on your application.
   if (typeof obj !== 'object') return true

   // Otherwise, does it have any properties of its own?
   // Note that this doesn't handle
   // toString and valueOf enumeration bugs in IE < 9
   for (var key in obj) {
      if (hasOwnProperty.call(obj, key)) return false
   }

   return true;
}

export const appendFormData = (formData, data, parentKey) => {
   if (data === null || data === undefined) {
     // If data is null or undefined, you can decide to either skip it or append an empty string
     formData.append(parentKey, '')
   } else if (data && typeof data === 'object' && !(data instanceof File)) {
     // Handle nested objects
     Object.keys(data).forEach(key => {
       appendFormData(formData, data[key], parentKey ? `${parentKey}[${key}]` : key)
     })
   } else {
     // Handle all other types (including File)
     formData.append(parentKey, data)
   }
}

export const isDirty = (form, model, excepts = []) => {
   for (const key in form) {
      if(excepts.length && excepts.includes(key)) continue
      
      if (model.hasOwnProperty(key)) {
         let formValue = form[key]
         let modelValue = model[key]

         if (formValue instanceof Date && modelValue instanceof Date) {
            // Compare Date objects by their time values
            if (formValue.getTime() !== modelValue.getTime()) {
              console.log('key', key)
              console.log('formValue', formValue, 'modelValue', modelValue)
              return true
            }
         } else if (formValue !== modelValue) {
            console.log('key', key)
            console.log('formValue', formValue, 'modelValue', modelValue)
            return true
         }
      }
   }
   return false
}