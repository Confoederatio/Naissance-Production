setTimeout(() => {
	ve.Checkbox = class veCheckbox extends ve.Component {
		constructor (arg0_value, arg1_options) {
			//Convert from parameters
			let value = arg0_value;
			let options = (arg1_options) ? arg1_options : {};
				super(options);
				
			//Initialise options
			options.attributes = (options.attributes) ? options.attributes : {};
			
			//Declare local instance variables
			this.element = document.createElement("span");
				this.element.setAttribute("component", "ve-checkbox");
				this.element.instance = this;
			HTML.applyCSSStyle(this.element, options.style);
			
			this.value = value;
			
			//Format HTML_string
			let html_string = [];
			html_string.push(`<ul>`);
			if (typeof this.value === "object") {
				html_string.push(...ve.Checkbox.generateHTMLRecursively(this.value));
			} else {
				html_string.push(...ve.Checkbox.generateHTMLRecursively({ value: this.value }));
			}
			html_string.push(`</ul>`);
			
			//Populate element and initialise handlers
			this.element.innerHTML = html_string.join("");
			
			let all_checkbox_els = this.element.querySelectorAll("input");
			all_checkbox_els.forEach((el) => el.addEventListener("change", (e) => {
				this.value = this.v;
			}));
			
			this.v = this.value;
		}
		
		static generateHTMLRecursively (arg0_value) {
			//Convert from parameters
			let value = arg0_value;
			
			//Declare local instance variables
			let html_string = [];
			
			//Iterate over all keys in value
			Object.iterate(value, (local_key, local_value) => {
				if (typeof local_value === "boolean") {
					html_string.push(`<li><input id = "${local_key}" type = "checkbox"${(local_value) ? " checked" : ""}>${(local_key) ? `<label for = "${local_key}">${local_key}</label>` : ""}</li>`);
				} else if (typeof local_value === "object") {
					html_string.push(`<ul id = "${local_key}">`);
						html_string.push(...ve.Checkbox.generateHTMLRecursively(local_value));
					html_string.push(`</ul>`);
				}
			});
			
			//Return statement
			return html_string;
		}
		
		get v () {
			//Declare local instance variables
			let traverse = (ul_el) => {
				let local_obj = {};
				
				[...ul_el.children].forEach((li_el) => {
					if (li_el.tagName === "LI") {
						let input_el = li_el.querySelector(`input[type="checkbox"]`);
						if (input_el) local_obj[input_el.id] = input_el.checked;
					} else if (li_el.tagName === "UL") {
						local_obj[li_el.id] = traverse(li_el);
					}
				});
				
				//Return statement
				return local_obj;
			}
			
			//Return statement
			let root_el = this.element.querySelector("ul");
			return traverse(root_el);
		}
		
		set v (arg0_value) {
			//Convert from parameters
			let value = arg0_value;
			
			//Parse value
			if (typeof value === "boolean") {
				//Set singular checkbox value
				this.value = value;
				this.element.querySelector(`input[type="checkbox"]`).checked = value;
			} else {
				let traverse = (ul_el, values) => {
					[...ul_el.children].forEach((li_el) => {
						if (li_el.tagName === "LI") {
							let input_el = li_el.querySelector(`input[type="checkbox"]`);
							if (input_el && input_el.id in values)
								input_el.checked = (!!values[input_el.id]);
						} else if (li_el.tagName === "UL") {
							if (li_el.id && typeof values[li_el.id] === "object")
								traverse(li_el, values[li_el.id]);
						}
					})
				};
				
				let root_ul = this.element.querySelector("ul");
				traverse(root_ul, value);
				this.value = value;
			}
		}
		
		remove () {
			this.element.remove();
		}
	};
}, 0);