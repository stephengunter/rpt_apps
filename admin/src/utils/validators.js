import Errors from '@/common/errors'

export const isValidTWID = (id) => {
   id = id.trim();
   let verification = id.match("^[A-Z][12]\\d{8}$")
	if(!verification){
		return false
	}
   let conver = "ABCDEFGHJKLMNPQRSTUVXYWZIO"
   let weights = [1, 9, 8, 7, 6, 5, 4, 3, 2, 1, 1]

   id = String(conver.indexOf(id[0]) + 10) + id.slice(1);

   let checkSum = 0
   for (let i = 0; i < id.length; i++) {
      let c = parseInt(id[i])
      let w = weights[i]
      checkSum += c * w
   }

   return checkSum % 10 == 0
}

export const addErrorMsg = (validator, key, msg) => {
   let errors = { ...validator.errors }
   errors[key] = [msg]
   validator.setErrors(errors)
}

export const getErrorMsg = (errors, key) => {
   if(errors) {
      return errors.hasOwnProperty(key) ? errors[key][0] : ''
   }
   return  '';
}

export const clearErrors = (errors, keys = []) => {
   keys.forEach(key => {
      if(errors.hasOwnProperty(key)) errors[key] = []
   })
	return errors;
}

export const isValidUserName = (input) => {
   var pattern = /^[a-zA-Z0-9_.@]*$/    
   // Using test method of RegExp object to check if input matches the pattern
   return pattern.test(input)
}

export const isValidPhoneNumber = (input) => {
   var regex = /^0\d{9}$/;
   return regex.test(input);
}

export const isValidDob = (input) => {
   // Check if input is exactly 6 characters long
   if (input.length !== 6) {
       return false;
   }

   // Parse the parts of the input
   const yearPart = input.substring(0, 2);  // First two characters for the year
   const monthPart = input.substring(2, 4); // Middle two characters for the month
   const dayPart = input.substring(4, 6);   // Last two characters for the day

   // Convert the parts to integers
   const year = parseInt(yearPart, 10);
   const month = parseInt(monthPart, 10);
   const day = parseInt(dayPart, 10);

   // Check if parsing was successful
   if (isNaN(year) || isNaN(month) || isNaN(day)) {
       return false; // Input must contain valid numbers
   }

   // Check if year is between 15 and 99
   if (year < 15 || year > 99) {
       return false;
   }

   // Check if month is between 1 and 12
   if (month < 1 || month > 12) {
       return false;
   }

   // Check if the day is valid for the given month
   if (!isValidDayForMonth(month, day)) {
       return false;
   }

   // If all checks pass, the DOB is valid
   return true;
}

export const isValidDayForMonth = (month, day) => {
   // Days per month (index corresponds to month number, where index 1 is January, index 2 is February, etc.)
   const daysInMonth = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

   // Check if the day is within the valid range for the given month
   return day >= 1 && day <= daysInMonth[month];
}

// Example usage
const dob = "790312";
console.log(isValidDob(dob)); // Outputs: true or false based on validation

export const isValidURL = (str) => {
   const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i') // fragment locator
   return !!pattern.test(str)
}