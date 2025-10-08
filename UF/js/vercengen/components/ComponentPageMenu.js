
ve.PageMenu = class vePageMenu extends ve.Component {
	static demo_value = {
		page_one: {
			name: "Home",
			components_obj: {}
		},
		page_two: {
			name: "About",
			components_obj: {}
		}
	};
	
	constructor (arg0_page_obj, arg1_options) {
		//Convert from parameters
		let page_obj = arg0_page_obj;
		let options = (arg1_options) ? arg1_options : {};
			super(options);
			
		//Initialise options
		options.attributes = (options.attributes) ? options.attributes : {};
		options.starting_page = (options.starting_page) ? options.starting_page : Object.keys(page_obj)[0];
		
		//Declare local instance variables
		this.element = document.createElement("div");
			this.element.setAttribute("component", "ve-page-menu");
			Object.iterate(options.attributes, (local_key, local_value) => {
				this.element.setAttribute(local_key, local_value.toString());
			});
			this.element.instance = this;
			HTML.applyCSSStyle(this.element, options.style);
		this.interfaces_obj = {};
		this.navbar_el = document.createElement("nav");
			this.navbar_el.classList.add("navbar");
		
		//1. Navbar handling
		{
			//Append header element; navbar_el
			//Iterate over all keys in page_obj and create ve.Interface; tab instances for them
			Object.iterate(page_obj, (local_key, local_value) => {
				let local_name = (local_value.name) ? local_value.name : local_key;
				let local_name_el = document.createElement("div");
				local_name_el.classList.add("tab");
				if (local_key === options.starting_page)
					local_name_el.classList.add("active");
				local_name_el.id = local_key;
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
		
		//2. Body handling; display starting interface
		{
			this.v = options.starting_page;
		}
	}
	
	get v () {
		//Return statement
		return this.navbar_el.querySelector(`.tab.active`).id;
	}
	
	set v (arg0_page_key) {
		//Convert from parameters
		let page_key = arg0_page_key;
		
		//Declare local instance variables
		let active_tab_el = this.navbar_el.querySelector(`.tab[id="${page_key}"]`);
		let all_tabs = this.navbar_el.querySelectorAll(`.tab`);
		
		//Modify active tab
		all_tabs.forEach((local_tab) => local_tab.classList.remove("active"));
		if (active_tab_el) {
			active_tab_el.classList.add("active");
		} else {
			console.error(`active_tab_el could not be found for ${page_key}.`);
		}
		
		//Switch interface to selected page
		this.interface_el.innerHTML = "";
		this.interface_el.appendChild(this.interfaces_obj[page_key].element);
		setTimeout(() => {
			this.updateUnderline();
		}, 100);
	}
	
	updateUnderline (arg0_animate_y) {
		//Convert from parameters
		let animate_y = arg0_animate_y;
		
		//Declare local instance variables
		let active_tab = this.navbar_el.querySelector(`.tab.active`);
			if (!active_tab) return;
		let underline_computed_style = window.getComputedStyle(this.underline_el);
		
		let offset_left = active_tab.offsetLeft;
		let tab_width = active_tab.offsetWidth;
		let underline_y = active_tab.offsetTop + active_tab.offsetHeight - parseFloat(underline_computed_style.height);
		
		//Snap vertically, animate horizontally
		this.underline_el.style.transition = "none";
		this.underline_el.style.top = `${underline_y}px`;
		
		requestAnimationFrame(() => {
			this.underline_el.style.left = `${offset_left}px`;
			this.underline_el.style.transition = `left 0.5s ease, width 0.5s ease`;
			this.underline_el.style.width = `${tab_width}px`;
		});
	}
};