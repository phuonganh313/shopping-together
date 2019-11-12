export function displayPrice(price, currency, showCurrencySymbol = true) {
	price = parseFloat(price);
	if (typeof currency == "undefined") {
		return psRound(price);
	}
	price = psRound(price);
    price = formatNumber(price, 2, ",", ".") + " " + currency;
	return showCurrencySymbol
		? price
		: String(price).replace(currency, "");
}

function formatNumber(value, numberOfDecimal, thousenSeparator, virgule) {
	value = value.toFixed(numberOfDecimal);
	let valString = value + "";
	let tmp = valString.split(".");
	let absValString = tmp.length === 2 ? tmp[0] : valString;
	let decimalString = ("0." + (tmp.length === 2 ? tmp[1] : 0)).substr(2);
	let nb = absValString.length;

	for (let i = 1; i < 4; i++)
		if (value >= Math.pow(10, 3 * i))
			absValString =
				absValString.substring(0, nb - 3 * i) +
				thousenSeparator +
				absValString.substring(nb - 3 * i);

	if (parseInt(numberOfDecimal) === 0) return absValString;
	return absValString + virgule + (decimalString > 0 ? decimalString : "00");
}

function psRound(value, places, roundMode) {
	if (typeof roundMode === "undefined") roundMode = 2;
	if (typeof places === "undefined") places = 2;
	let method = parseInt(roundMode);
	if (method === 0) return ceilf(value, parseInt(places));
	else if (method === 1) return floorf(value, parseInt(places));
	else if (method === 3 || method === 4 || method === 5) {
		// From PHP Math.c
		let precisionPlaces = 14 - Math.floor(psLog10(Math.abs(value)));
		let f1 = Math.pow(10, Math.abs(places));
		let tmpValue = 0;

		if (precisionPlaces > places && precisionPlaces - places < 15) {
			let f2 = Math.pow(10, Math.abs(precisionPlaces));
			if (precisionPlaces >= 0) tmpValue = value * f2;
			else tmpValue = value / f2;

			tmpValue = psRoundHelper(tmpValue, roundMode);

			/* now correctly move the decimal point */
			f2 = Math.pow(10, Math.abs(places - precisionPlaces));
			/* because places < precisionPlaces */
			tmpValue /= f2;
		} else {
			/* adjust the value */
			if (places >= 0) tmpValue = value * f1;
			else tmpValue = value / f1;

			if (Math.abs(tmpValue) >= 1e15) return value;
		}

		tmpValue = psRoundHelper(tmpValue, roundMode);
		if (places > 0) tmpValue = tmpValue / f1;
		else tmpValue = tmpValue * f1;

		return tmpValue;
	} else {
		return psRoundHalfUp(value, parseInt(places));
	}
}

function ceilf(value, precision) {
	if (typeof precision === "undefined") precision = 0;
	let precisionFactor = precision === 0 ? 1 : Math.pow(10, precision);
	let tmp = value * precisionFactor;
	let tmp2 = tmp.toString();
	if (tmp2[tmp2.length - 1] === 0) return value;
	return Math.ceil(value * precisionFactor) / precisionFactor;
}

function psRoundHalfUp(value, precision) {
	let mul = Math.pow(10, precision);
	let val = value * mul;

	let nextDigit = Math.floor(val * 10) - 10 * Math.floor(val);
	if (nextDigit >= 5) val = Math.ceil(val);
	else val = Math.floor(val);

	return val / mul;
}

function psRoundHelper(value, mode) {
	let tmpValue = 0;
	// From PHP Math.c
	if (value >= 0.0) {
		tmpValue = Math.floor(value + 0.5);
		if (
			(mode == 3 && value == -0.5 + tmpValue) ||
			(mode == 4 && value == 0.5 + 2 * Math.floor(tmpValue / 2.0)) ||
			(mode == 5 && value == 0.5 + 2 * Math.floor(tmpValue / 2.0) - 1.0)
		)
			tmpValue -= 1.0;
	} else {
		tmpValue = Math.ceil(value - 0.5);
		if (
			(mode == 3 && value == 0.5 + tmpValue) ||
			(mode == 4 && value == -0.5 + 2 * Math.ceil(tmpValue / 2.0)) ||
			(mode == 5 && value == -0.5 + 2 * Math.ceil(tmpValue / 2.0) + 1.0)
		)
			tmpValue += 1.0;
	}

	return tmpValue;
}

function floorf(value, precision) {
	if (typeof precision === "undefined") precision = 0;
	let precisionFactor = precision === 0 ? 1 : Math.pow(10, precision);
	let tmp = value * precisionFactor;
	let tmp2 = tmp.toString();
	if (tmp2[tmp2.length - 1] === 0) return value;
	return Math.floor(value * precisionFactor) / precisionFactor;
}

function psLog10(value) {
	return Math.log(value) / Math.LN10;
}
