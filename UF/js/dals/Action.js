//Initialise class
if (!global.DALS) global.DALS = {};

DALS.Action = class {
	//Declare local static variables
	static instances = [];
	
	//Constructor/getter/setter
	constructor (arg0_redo_function, arg1_undo_function, arg2_options) {
		//Convert from parameters
		let redo_function = arg0_redo_function;
		let undo_function = arg1_undo_function;
		let options = (arg2_options) ? arg2_options : {};
		
		//Internal guard clauses
		if (typeof redo_function !== "function")
			throw new Error(`arg0_redo_function must be of type 'function' for dals.Action.`);
		if (undo_function === undefined)
			throw new Error(`arg0_undo_function must be of type 'function' for dals.Action.`);
		
		//Assign Action to dals.Timeline
		if (!options.timeline) {
		
		} else {
			//Assign to specified timeline
			
		}
	}
	
	get () {
	
	}
	
	set () {
	
	}
	
	//Class methods
	delete () {
	
	}
};