//Initialise functions
DALS.Timeline.loadState = function (arg0_json) {
	console.error(`DALS.Timeline.loadState(arg0_json) has not been manually overridden by the program!`);
};
DALS.Timeline.parseAction = function (arg0_json) {
	console.error(`DALS.Timeline.parseAction(arg0_json) does not have a parser bound to it.`)
};
DALS.Timeline.saveState = function () {
	console.error(`DALS.Timeline.saveState() has not been manuially overridden by the program! Returning an empty object.`);
	
	//Return statement
	return {};
};