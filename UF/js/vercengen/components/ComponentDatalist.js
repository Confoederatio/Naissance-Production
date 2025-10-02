ve.Datalist = class veDatalist extends ve.Component {
	constructor (arg0_value, arg1_options) {
		//Convert from parameters
		let value = arg0_value;
		let options = (arg1_options) ? arg1_options : {};
			super(options);
		
		//Initialise options
		options.attributes = (options.attributes) ? options.attributes : {};
		
		//Declare local instance variables
		let attributes = {
			readonly: options.disabled,
			...options.attributes
		};
		this.element = document.createElement("div");
			this.element.setAttribute("component", "ve-datalist");
			this.element.instance = this;
		HTML.applyCSSStyle(this.element, options.style);
		
		this.value = value;
		
		//Format HTML string
		let html_string = [];
		html_string.push(`<span id = "name"></span>`);
		
		html_string.push(`<input list = "datalist" type = "text"${HTML.objectToAttributes(attributes)}>`);
		html_string.push(`<datalist id = "datalist">`);
		html_string.push(`</datalist>`);
		
		//Populate element and initialise handlers
		this.element.innerHTML = html_string.join("");
		
		let input_el = this.element.querySelector("input");
		input_el.addEventListener("change", (e) => {
			this.value = e.target.value.toString();
		});
		this.name = options.name;
		this.v = this.value;
	}
	
	get name () {
		//Return statement
		return this.element.querySelector(`#name`).innerHTML;
	}
	
	set name (arg0_value) {
		//Convert from parameters
		let value = arg0_value;
		
		//Set name
		this.element.querySelector(`#name`).innerHTML = (value) ? value : "";
	}
	
	get v () {
		//Return statement
		return this.value;
	}
	
	set v (arg0_value) {
		//Convert from parameters
		let value = arg0_value;
		
		//Declare local instance variables
		let html_string = [];
		
		if (typeof value === "object") {
			//Iterate over all keys in value and assign <option> tags to the datalist
			Object.iterate(value, (local_key, local_value) => {
				if (local_key === "selected") {
					this.element.querySelector(`input[type="text"]`).value = local_value;
				} else {
					html_string.push(`<option value = "${local_key}">${local_value}</option>`);
				}
			});
			this.element.querySelector("datalist").innerHTML = html_string.join("");
		} else if (typeof value === "string") {
			this.element.querySelector(`input[type="text"]`).value = value;
		}
		
		this.value = value;
		if (this.options.onchange) this.options.onchange(this.value);
	}
	
	remove () {
		this.element.remove();
	}
};