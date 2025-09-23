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
	
	/**
	 * Opens the relevant window
	 * @param {string} [arg0_mode="instance"] - Whether the UI is bound to 'class'/'instance'. If 'class', it displays all static Vercengen fields.
	 * @param {Object} [arg1_options]
	 *  @param {boolean} [arg1_options.do_not_close_if_open=false] - Whether to close the Window already bound to class_window or instance_window
	 *  @param {boolean} [arg1_options.is_window=false] - If the item is not a Window, then it is a frozen form of a Window with a constant z-index that cannot be moved/closed
	 *
	 *  @param {string} [arg1_options.anchor="top_left"] - Either 'bottom_left'/'bottom_right'/'top_left'/'top_right'. If neither this nor .x/.y are defined, the UI is spawned at the cursor position
	 *  @param {number|string} [arg1_options.height]
	 *  @param {number|string} [arg1_options.width]
	 *  @param {number|string} [arg1_options.x] - Mouse coordinates if undefined
	 *  @param {number|string} [arg1_options.y] - Mouse coordinates if undefined
	 */
	open (arg0_mode, arg1_options) { //[WIP] - Finish function body
		//Convert from parameters
		let mode = (arg0_mode) ? arg0_mode : "instance";
		let options = (arg1_options) ? arg1_options : {};
		
		//Declare local instance variables
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