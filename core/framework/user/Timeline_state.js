DALS.Timeline.parseAction = function (arg0_json) {
	//Convert from parameters
	let json = (typeof arg0_json === "string") ? JSON.parse(arg0_json) : arg0_json
	
	//Initialise JSON
	if (json.options === undefined) json.options = {};
	if (json.value === undefined) json.value = [];
	
	//Iterate over multi-value packet (MVP) and filter it down to superclass single-value packets (SVPs)
	console.log(json.value);
	for (let i = 0; i < json.value.length; i++)
		if (json.value[i].type)
			naissance[json.value[i].type].parseAction(json.value[i]);
};