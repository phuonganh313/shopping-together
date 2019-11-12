export function isNumeric(number){
    return  /^\d+$/.test(number);
}
export function require(text){
    return text.length;
}

export function isName(name, ignoreNumber = true){
	let reg = ignoreNumber ? /^[^0-9!<>,;?=+()@#"°{}_$%~:]+$/ : /^[^!<>,;?=+()@#"°{}_$%~:]+$/;
	return (reg.test(name) || name.length == 0);
}

export function isPercentage(discount){
    return (/^([0-9]([0-9])?|00)(\.\d{1,2}){0,1}$/.test(discount) || /^100(\.0{1,2})?$/.test(discount));
}