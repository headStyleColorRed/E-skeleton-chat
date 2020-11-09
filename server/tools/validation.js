
// //	E M A I L	V A L I D A T I O N 
// function validateEmailData(userData) {
// 	let validationResult = {
// 		isError: false,
// 		errorMessage: new String()
// 	}

// 	if (validateEmail(userData.email).length > 1) {
// 		validationResult.isError = true
// 		validationResult.errorMessage = validateEmail(userData.email)
// 		return validationResult
// 	}

// 	return validationResult
// }

// //	F U L L		B O A R D 		V A L I D A T I O N
// function validateboardData(userData) {
// 	let id = "id"
// 	let name = "name"
// 	let membersId = "membersId"

// 	let validationResult = {
// 		isError: false,
// 		errorMessage: new String()
// 	}

// 	if (validateEmail(userData.ownerId).length > 1) {
// 		validationResult.isError = true
// 		validationResult.errorMessage = validateEmail(userData.ownerId)
// 		return validationResult
// 	}

// 	if (validateGenericStringWithMinMaxLength(id, userData.id).length > 1) {
// 		validationResult.isError = true
// 		validationResult.errorMessage = validateGenericStringWithMinMaxLength(id, userData.id)
// 		return validationResult
// 	}

// 	if (validateGenericStringWithMinMaxLength(name, userData.name).length > 1) {
// 		validationResult.isError = true
// 		validationResult.errorMessage = validateGenericStringWithMinMaxLength(name, userData.name)
// 		return validationResult
// 	}

// 	if (validateGenericStringArray(membersId, userData.membersId).length > 1) {
// 		validationResult.isError = true
// 		validationResult.errorMessage = validateGenericStringArray(membersId, userData.membersId)
// 		return validationResult
// 	}

// 	return validationResult
// }



// //	F U L L		C O L U M N		V A L I D A T I O N
// function validateColumnData(userData) {
// 	let id = "id"
// 	let title = "title"

// 	let validationResult = {
// 		isError: false,
// 		errorMessage: new String()
// 	}

// 	if (validateGenericStringWithMinMaxLength(id, userData.id).length > 1) {
// 		validationResult.isError = true
// 		validationResult.errorMessage = validateGenericStringWithMinMaxLength(id, userData.id)
// 		return validationResult
// 	}

// 	if (validateGenericStringWithMinMaxLength(title, userData.title).length > 1) {
// 		validationResult.isError = true
// 		validationResult.errorMessage = validateGenericStringWithMinMaxLength(title, userData.title)
// 		return validationResult
// 	}

// 	return validationResult
// }

// //	F U L L		C A R D		V A L I D A T I O N
// function validateCardData(userData) {
// 	let id = "id"
// 	let title = "title"

// 	let validationResult = {
// 		isError: false,
// 		errorMessage: new String()
// 	}

// 	if (validateGenericStringWithMinMaxLength(id, userData.id).length > 1) {
// 		validationResult.isError = true
// 		validationResult.errorMessage = validateGenericStringWithMinMaxLength(id, userData.id)
// 		return validationResult
// 	}

// 	return validationResult
// }



// //	#	#	#	#	#	#		V A L I D A T O R S		#	#	#	#	#	#	#	//

// function validateEmail(str) {
// 	var error = "";
// 	console.log(str);
// 	if (!str)
// 		error = "Email error: Email field missing"
// 	else if (str == "") {
// 		error = "Email error: Empty Email";
// 	} else if ((str.length < 5) || (str.length > 40)) {
// 		error = "Email error: Email must have 5-40 characters";
// 	} else if (!str.includes("@")) {
// 		error = "Email error: Email is not valid, missing @";
// 	} else if (!str.includes(".com")) {
// 		error = "Email error: Email is not valid, missing .com";
// 	}
	
// 	return error;
// }

// function validateGenericString(field, str) {
// 	var error = "";

// 	if (!str)
// 		error = `${field} error: ${field} field missing`
// 	else if (str == "") {
// 		error = `${field} error: Empty ${field}`;
// 	}
	
// 	return error;
// }

// function validateGenericStringWithMinMaxLength(field, str) {
// 	var error = "";

// 	if (!str)
// 		error = `${field} error: ${field} field missing`
// 	else if (str == "") {
// 		error = `${field} error: Empty ${field}`;
// 	} else if ((str.length < 4) || (str.length > 40)) {
// 		error = `${field} error: ${field} must have 4-40 characters`;
// 	}

// 	return error;
// }

// function validateGenericStringArray(field, arr) {
// 	var error = "";
	
// 	arr.forEach(element => {
// 		if (!element)
// 			error = `${field} error: ${field} field missing`
// 		else if (element == "") {
// 			error = `${field} error: Empty ${field}`;
// 		}
// 	});

// 	return error;
// }


// module.exports = {
// 	validateboardData,
// 	validateEmailData,
// 	validateColumnData,
// 	validateCardData,
// }