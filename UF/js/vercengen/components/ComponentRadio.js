ve.Radio = class veRadio extends ve.Component {
	constructor (arg0_value, arg1_options) {
		//Convert from parameters
		let value = arg0_value;
		let options = (arg1_options) ? arg1_options : {};
			super(options);
			
		//Initialise options
		options.attributes = (options.attributes) ? options.attributes : {};
		
		//Declare local instance variables
		this.element = document.createElement("div");
			this.element.setAttribute("component", "ve-radio");
			this.element.instance = this;
		HTML.applyCSSStyle(this.element, options.style);
		
		this.value = value;
		
		//Format html_string
		let html_string = [];
		html_string.push(`<fieldset>`);
			if (options.name)
				html_string.push(`<legend>${options.name}</legend>`);
			html_string.push(`<ul>`);
				if (typeof this.value === "object") {
					html_string.push(...ve.Radio.generateHTMLRecursively(this.value));
				} else {
					html_string.push(...ve.Radio.generateHTMLRecursively({ value: this.value }));
				}
			html_string.push(`</ul>`);
		html_string.push(`</fieldset>`);
		
		//Populate element and initialise handlers
		this.element.innerHTML = html_string.join("");
		
		let all_radio_els = this.element.querySelectorAll("input");
		all_radio_els.forEach((el) => el.addEventListener("change", (e) => {
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
				html_string.push(`<li><input id = "${local_key}" type = "radio"${(local_value) ? " checked" : ""}>${(local_key) ? `<label for = "${local_key}">${local_key}</label>` : ""}</li>`);
			} else if (typeof local_value === "object") {
				html_string.push(`<ul id = "${local_key}">`);
					html_string.push(...ve.Radio.generateHTMLRecursively(local_value));
				html_string.push(`</ul>`);
			}
		});
		
		//Return statement
		return html_string;
	}
	
	get v () {
		//Declare local instance variables
		return this.element.querySelector(`input[type="radio"]:checked`).value;
	}
	
	set v (arg0_value) {
		//Convert from parameters
		let value = arg0_value;
		
		//Parse value
		if (typeof value === "boolean") {
			//Set singular checkbox value
			this.value = value;
			this.element.querySelector(`input[type="radio"]`).checked = value;
		} else {
			let traverse = (ul_el, values) => {
				[...ul_el.children].forEach((li_el) => {
					if (li_el.tagName === "LI") {
						let input_el = li_el.querySelector(`input[type="radio"]`);
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
		
		if (this.options.onchange) this.options.onchange(this.value);
	}
	
	remove () {
		this.element.remove();
	}
};