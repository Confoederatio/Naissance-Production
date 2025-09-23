if (!global.ve) global.ve = {};

ve.Class = class {
	//Declare local static variables
	static instances = [];
	
	//Constructor/getter/setter
	constructor (arg0_options) {
		//Convert from parameters
		let options = (arg0_options) ? arg0_options : {};
		
		//Declare local instance variables
		this.id = Class.generateRandomID(ve.Class); //Non-Vercengen objects can be used freely
		
		this.class_window = undefined;
		this.instance_window = undefined;
	}
	
	//Class methods
	close (arg0_mode) {
		//Convert from parameters
	}
	
	draw (arg0_function, arg1_interval) {
	
	}
	
	isClosed (arg0_mode) {
		//Return statement
	}
	
	isOpen (arg0_mode) {
		//Return statement
	}
	
	open (arg0_mode, arg1_options) {
	
	}
	
	//State methods
	getState () {
		//Declare local instance variables
		let child_class = this.constructor;
		let parent_class = Object.getPrototypeOf(child_class);
		let state_obj = {};
		
		//Fetch instance fields in child class
		let instance_fields = Object.keys(this);
		
		//Fetch static fields unique to child class, mutate their keys to have 'static-' prepended to them.
		let static_fields = Object.getOwnPropertyNames(child_class).filter((key) => (
			!["length", "prototype", "name"].includes(key) && //Filter out any default keys
			!Object.getOwnPropertyNames(parent_class).includes(key) //Filter out any parent keys
		)).reduce((local_obj, key) => {
			local_obj[`static-${key}`] = child_class[key];
			
			//Return statement
			return local_obj;
		}, {});
		
		//Filter both static_fields and instance_fields for .vercengen_component and append them to state_obj
		let temp_state_obj = { ...static_fields, ...instance_fields };
		
		Object.iterate(temp_state_obj, (local_key, local_value) => {
			try {
				if (local_value.is_vercengen_component)
					state_obj[local_key] = local_value;
			} catch (e) {}
		});
		
		//Return statement
		return state_obj;
	}
};