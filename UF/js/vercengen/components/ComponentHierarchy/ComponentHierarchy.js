ve.Hierarchy = class veHierarchy extends ve.Component {
	constructor (arg0_components_obj, arg1_options) {
		//Convert from parameters
		let components_obj = (arg0_components_obj) ? arg0_components_obj : {};
		let options = (arg1_options) ? arg1_options : {};
			super(options);
			
		//Initialise options
		options.attributes = (options.attributes) ? options.attributes : {};
		
		this.element = document.createElement("div");
		this.element.id = "test";
		this.element.setAttribute("component", "ve-hierarchy");
		HTML.applyCSSStyle(this.element, options.style);
		
		//Append components_obj to this.element
		this.v = components_obj;
		/*setInterval(() => {
			console.log(this.nestable);
		}, 3000);*/
	}
	
	addItem (arg0_parent_el, arg1_hierarchy_datatype) {
		//Convert from parameters
		let parent_el = (arg0_parent_el) ? arg0_parent_el : this.element.querySelector("ol");
		let hierarchy_datatype = arg1_hierarchy_datatype;
		
		//Append child
		if (typeof parent_el === "string") parent_el = this.element.querySelector(parent_el);
		if (parent_el)
			parent_el.appendChild(hierarchy_datatype.element);
	}
	
	/**
	 * Returns an object representative of the items in the hierarchy.
	 * 
	 * @param {Object} [arg0_options]
	 *  @param {boolean} [arg0_options.flatten_object=false] - Whether the object should be flattened, returning only serialisable JSON keys.
	 *  
	 * @returns {Object}
	 */
	getHierarchyObject (arg0_options) {
		//Convert from parameters
		let options = (arg0_options) ? arg0_options : {};
		
		//Declare local instance variables
		let hierarchy_obj = {};
		
		//Iterate over all li elements in local_el
		hierarchy_obj = HTML.traverseDOM(this.element.querySelector("ol"), (local_el, local_return_obj) => {
			if (local_el.id && local_el.getAttribute("component") === "ve-hierarchy-datatype") 
				if (options.flatten_object) {
					local_return_obj[local_el.id] = local_el.instance.options;
				} else {
					local_return_obj[local_el.id] = local_el;
				}
			
			//Return statement
			return local_return_obj;
		});
		
		//Return statement
		return hierarchy_obj;
	}
	
	get name () {
		//Return statement
		return (this.components_obj.name) ? this.components_obj.name.v : "";
	}
	
	set name (arg0_value) {
		//Convert from parameters
		let value = arg0_value;
		
		//Set name
		if (this.components_obj.name) {
			this.components_obj.name.v = value;
		} else {
			this.components_obj.name = new ve.HTML(value);
			this.v = this.components_obj;
		}
	}
	
	remove () {
		this.element.remove();
	}
	
	removeItem (arg0_hierarchy_datatype) {
		//Convert from parameters
		let hierarchy_datatype = arg0_hierarchy_datatype;
		
		//Remove item
		hierarchy_datatype.remove();
	}
	
	get v () {
		//Return statement
		return this.components_obj;
	}
	
	set v (arg0_components_obj) {
		//Convert from parameters
		let components_obj = arg0_components_obj;
		
		//Reset element; re-append all components in components_obj to element 
		this.components_obj = components_obj;
		this.element.innerHTML = "";
		
		//1. Append all non-hierarchy datatype Vercengen components to controls; iterate over all this.components_obj
		Object.iterate(this.components_obj, (local_key, local_value) => {
			if (!local_value.is_vercengen_hierarchy_datatype)
				this.element.appendChild(local_value.element);
		});
		
		//2. Append all hierarchy datatype Vercengen components; iterate over all this.components_obj
		let ol_el = document.createElement("ol");
		ol_el.setAttribute("class", "list ve-drag-disabled ve-hierarchy");
		
		Object.iterate(this.components_obj, (local_key, local_value) => {
			if (local_value.is_vercengen_hierarchy_datatype)
				ol_el.appendChild(local_value.element);
		});
		this.element.appendChild(ol_el);
		console.log(this.getHierarchyObject({ flatten_object: true }));
		this.nestable = new Nestable(ol_el, { items: ".group, .item" });
	}
};