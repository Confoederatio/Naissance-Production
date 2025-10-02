ve.Colour = class veColour extends ve.Component {
	constructor (arg0_value, arg1_options) {
		//Convert from parameters
		let value = (arg0_value) ? arg0_value : [255, 255, 255];
		let options = (arg1_options) ? arg1_options : {};
		super(options);
		
		//Initialise options
		options.attributes = options.attributes ? options.attributes : {};
		if (options.name === undefined) options.name = "Colour";
		
		//Declare local instance variables
		this.element = document.createElement("div");
		this.element.setAttribute("component", "ve-colour");
		this.element.instance = this;
		HTML.applyCSSStyle(this.element, options.style);
		
		this.value = value;
		
		//Format HTML string
		let html_string = [];
		html_string.push(`<span id = "name"></span> `);
		html_string.push(`<input type = "color"${HTML.objectToAttributes(options.attributes)}>`);
		
		//Populate element and initialise handlers; set .instance
		this.element.innerHTML = html_string.join("");
		
		let input_el = this.element.querySelector("input");
		input_el.addEventListener("input", (e) => {
			this.value = e.target.value;
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
		return Colour.convertHexToRGBA(this.value);
	}
	
	set v (arg0_value) {
		//Convert from parameters
		let value = Colour.convertRGBAToHex(arg0_value);
		
		//Set value and update UI
		this.value = value;
		this.element.querySelector("input").value = this.value;
		if (this.options.onchange) this.options.onchange(this.value);
	}
	
	remove () {
		this.element.remove();
	}
	
	//Class methods
	toString () {
		return String(this.value);
	}
	
	valueOf () {
		return this.value;
	}
};