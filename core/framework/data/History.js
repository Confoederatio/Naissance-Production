naissance.History = class extends ve.Class {
	constructor (arg0_keyframes_obj, arg1_options) {
		//Convert from parameters
		super();
		this.keyframes = (arg0_keyframes_obj) ? arg0_keyframes_obj : {};
		
		//Declare local instance variables
		this.options = {
			components_obj: {},
			...arg1_options
		};
		this.interface = new ve.Interface({}, { name: "Keyframes", width: 99 });
	}
	
	addKeyframe (argn_arguments) {
		
	}
	
	draw () {
		
	}
	
	fromJSON () {
		
	}
	
	getKeyframe (arg0_options) {
		
	}
	
	toJSON () {
		
	}
};