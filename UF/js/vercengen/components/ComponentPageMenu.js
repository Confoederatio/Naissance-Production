
ve.PageMenu = class vePageMenu extends ve.Component {
	constructor (arg0_page_obj, arg1_options) {
		//Convert from parameters
		let page_obj = arg0_page_obj;
		let options = (arg1_options) ? arg1_options : {};
			super(options);
			
		//Initialise options
		options.starting_page = (options.starting_page) ? options.starting_page : Object.keys(page_obj)[0];
		
		//Declare local instance variables
		this.element = document.createElement("div");
			this.element.setAttribute("component", "ve-page-menu");
			this.element.instance = this;
			HTML.applyCSSStyle(this.element, options.style);
		this.interfaces_obj = {};
		this.navbar_el = document.createElement("nav");
			this.navbar_el.classList.add("navbar");
		
		//Append header element; navbar_el
		//Iterate over all keys in page_obj and create ve.Interface instances for them
		Object.iterate(page_obj, (local_key, local_value) => {
			let local_name = (local_value.name) ? local_value.name : local_key;
			let local_name_el = document.createElement("div");
				local_name_el.classList.add("tab");
				if (local_key === options.starting_page)
					local_name_el.classList.add("active");
				local_name_el.innerHTML = local_name;
			
			//Format navbar_el; populate this.interfaces_obj
			this.navbar_el.appendChild(local_name_el);
			this.interfaces_obj[local_key] = new ve.Interface(local_value.components_obj, local_value.options);
		});
		this.underline_el = document.createElement("span");
			this.underline_el.classList.add("underline");
			this.navbar_el.appendChild(this.underline_el);
			
		//Append body element; interface_el
		this.interface_el = document.createElement("div");
		this.interface_el.id = "component-body";
			
		this.element.append(this.navbar_el, this.interface_el);
		
		//Add tab onclick handlers for this.navbar_el
		let all_tabs = this.navbar_el.querySelectorAll(`.tab`);
		
		all_tabs.forEach((local_tab) => {
			local_tab.addEventListener("click", () => {
				all_tabs.forEach((local_tab) => local_tab.classList.remove("active"));
				local_tab.classList.add("active");
				this.updateUnderline();
			});
		});
	}
	
	updateUnderline (arg0_animate_y) { //[WIP] - Finish function body
		//Convert from parameters
		let animate_y = arg0_animate_y;
		
		//Declare local instance variables
		let active_tab = this.navbar_el.querySelector(`.tab.active`);
			if (!active_tab) return;
		
		let offset_left = active_tab.offsetLeft;
	}
};