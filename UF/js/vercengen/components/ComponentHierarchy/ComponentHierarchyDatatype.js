ve.HierarchyDatatype = class veHierarchyDatatype extends ve.Component {
	static demo_value = {
		name: new ve.Text(`Entry #${Math.randomNumber(0, 1000000)}`),
		context_menu_button: new ve.Button((e) => {
			console.log(e);
		}, { name: "Options"})
	};
	
	constructor (arg0_components_obj, arg1_options) {
		//Convert from parameters
		let components_obj = (arg0_components_obj) ? arg0_components_obj : {};
		let options = (arg1_options) ? arg1_options : {};
			super(options);
		
		//Initialise options
		options.attributes = (options.attributes) ? options.attributes : {};
		options.type = (options.type) ? options.type : "item"; //Either 'item'/'group'
		
		//Declare local instance variables
		this.element = document.createElement("li");
			this.element.setAttribute("class", options.type);
			if (options.type === "item")
				this.element.setAttribute("data-nestable-disabled", "nesting");
			this.element.setAttribute("component", "ve-hierarchy-datatype");
			Object.iterate(options.attributes, (local_key, local_value) => {
				this.element.setAttribute(local_key, local_value.toString());
			});
			this.element.instance = this;
		this.is_vercengen_hierarchy_datatype = true;
		this.type = options.type;
		HTML.applyCSSStyle(this.element, options.style);
		
		//Append components_obj elements to this.element
		this.components_obj = components_obj;
		this.refresh();
	}
	
	get v () {
		//Return statent
		return this.components_obj;
	}
	
	set v (arg0_components_obj) {
		//Convert from parameters
		let components_obj = arg0_components_obj;
		
		//Reset this.components_obj
		this.components_obj = components_obj;
		this.refresh();
	}
	
	refresh () {
		//Declare local instance variables
		let has_subitems = false;
		
		//1. Append regular components first as group components
		this.element.innerHTML = "";
		Object.iterate(this.components_obj, (local_key, local_value) => {
			if (!local_value.is_vercengen_hierarchy_datatype) {
				this.element.appendChild(local_value.element);
			} else {
				has_subitems = true;
			}
		});
		
		//2. Append ol components if .is_group resolves to true
		if (has_subitems && this.type === "group") {
			let ol_el = document.createElement("ol");
			
			//Iterate over all this.components_obj and append the sublist at the end
			Object.iterate(this.components_obj, (local_key, local_value) => {
				if (local_value.is_vercengen_hierarchy_datatype)
					ol_el.appendChild(local_value.element);
			});
			this.element.appendChild(ol_el);
		}
	}
	
	remove () {
		this.element.remove();
	}
};