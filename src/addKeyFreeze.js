/* eslint-disable no-param-reassign */
export default function addKeyFreeze(obj) {
	Object.keys(obj).forEach((key) => {
		obj[key].key = key;
	});
	// console.log(obj);
	return Object.freeze({ ...obj });
}
