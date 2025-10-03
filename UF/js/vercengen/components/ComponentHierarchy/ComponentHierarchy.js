ve.Hierarchy = class veHierarchy extends ve.Component {
	constructor (arg0_components_obj, arg1_options) {
		//Convert from parameters
		let components_obj = (arg0_components_obj) ? arg0_components_obj : {};
		let options = (arg1_options) ? arg1_options : {};
			super(options);
			
		//Initialise options
		options.attributes = (options.attributes) ? options.attributes : {};
		
		this.element = document.createElement("div");
		this.element.setAttribute("component", "ve-hierarchy");
		HTML.applyCSSStyle(this.element, options.style);
		
		//Append components_obj to this.element
		this.components_obj = components_obj;
		
		//1. Append all non-hierarchy datatype Vercengen components to controls; iterate over all this.components_obj
		//2. Append all hierarchy datatype Vercengen components; iterate over all this.components_obj
	}
	
	addItem (arg0_parent_el, arg1_hierarchy_datatype) {
		
	}
	
	remove () {
		this.element.remove();
	}
	
	removeItem (arg0_hierarchy_datatype) {
		
	}
	
	get v () {
		
	}
	
	set v (arg0_components_obj) {
		
	}
};