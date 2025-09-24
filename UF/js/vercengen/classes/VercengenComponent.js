ve.Component = class {
	constructor () {
		//Declare local instance variables
		let child_class = this.constructor;
	}
	
	//Runs over all ve classes that extend ve.Component and lint them
	static linter () {
		Object.iterate(global.ve, (local_key, local_value) => {
			try {
				if (Object.getPrototypeOf(local_value) === ve.Component) {
					//Check if delete() method exists
					if (typeof local_value.prototype.delete !== "function")
						console.error(`ve.Component: ve.${local_key} does not have a valid delete() function to remove its corresponding DOM element upon being cleared.`);
					
					//Check if get()/set() methods exist
					if (typeof local_value.prototype.get !== "function")
						console.error(`ve.Component: ve.${local_key} does not have a valid get() function.`);
					if (typeof local_value.prototype.set !== "function")
						console.error(`ve.Component: ve.${local_key} does not have a valid set() function.`);
				}
			} catch (e) {}
		});
	}
};