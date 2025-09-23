setTimeout(() => {
	ve.Interface = class veInterface extends ve.Component {
		constructor (arg0_components_obj, arg1_options) {
			super();
			
			//Convert from parameters
			let components_obj = arg0_components_obj;
			let options = (arg1_options) ? arg1_options : {};
			
			//Declare local instance variables
			this.dimensions = [0, 0]; //Populate this.dimensions to [width, height];
			
			//Iterate over all keys in components_obj that .is_vercengen_component to find max dimensions needed for the table
		}
	};
}, 0);