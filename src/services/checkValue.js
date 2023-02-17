export const checarValor = (value, event) => {
	if (!isNaN(parseFloat(value))) {
		return value;
	} else {
		event.target.value = '';
		return '';
	}
};
