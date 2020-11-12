
function stringedArrayToArray(stringedArray) {
	if (stringedArray == null || stringedArray == undefined) { return [] }

	let tempArray = new Array()
	let finalArray = new Array()
	let arrayToSend = new Array()

	tempArray = stringedArray.split("[")
	tempArray = stringedArray.split("]")
	tempArray = tempArray.filter((el) => { return el.length > 1 })
	tempArray = tempArray.forEach((element) => {
		let resultElement = element.replace(/[\[\]&\"]+/g, ' ').split(",")
		if (resultElement[0].length < 1) {
			resultElement.shift()
		}
		resultElement[0] = resultElement[0].trim()
		resultElement[1] = resultElement[1].trim()
		finalArray.push(resultElement)
	 })
	
	 tempArray = new Array()

	 let i = 0;
	 while (i < finalArray.length) {
		 let singleArray = new Array()
		 singleArray.push(finalArray[i + 0])
		 singleArray.push(finalArray[i + 1])
		 singleArray.push(finalArray[i + 2])
		 singleArray.push(finalArray[i + 3])
		 singleArray.push(finalArray[i + 4])
		 i += 5
		 arrayToSend.push(singleArray)
	 }
	 return arrayToSend
}



module.exports = {
	stringedArrayToArray,
}