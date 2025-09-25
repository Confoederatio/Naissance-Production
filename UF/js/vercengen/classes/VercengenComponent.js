ve.Component = class {
	constructor (arg0_options) {
		//Convert from parameters
		let options = (arg0_options) ? arg0_options : {};
		
		//Declare local instance variables
		let child_class = this.constructor;
		
		this.is_vercengen_component = true;
		
		this.height = options.height;
		this.width = options.width;
		this.x = options.x;
		this.y = options.y;
	}
	
	//Runs over all ve classes that extend ve.Component and lint them
	static linter () {
		Object.iterate(global.ve, (local_key, local_value) => {
			try {
				if (Object.getPrototypeOf(local_value) === ve.Component) {
					let local_description = Object.getOwnPropertyDescriptor(local_value.prototype, "v");
					
					//Check if get()/set() methods exist
					if (!local_description || typeof local_description.get !== "function")
						console.error(`ve.Component: ve.${local_key} does not have a valid get v() function.`);
					if (!local_description || typeof local_description.set !== "function")
						console.error(`ve.Component: ve.${local_key} does not have a valid set v() function.`);
					
					//Check if remove() method exists
					if (typeof local_value.prototype.remove !== "function")
						console.error(`ve.Component: ve.${local_key} does not have a valid remove() function to remove its corresponding DOM element upon being cleared.`);
				}
			} catch (e) { console.error(e); }
		});
	}
};