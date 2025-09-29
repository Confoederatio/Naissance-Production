setTimeout(() => {
	ve.Number = class veNumber extends ve.Component {
		static demo_value = 1;
		
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
				max: options.max,
				min: options.min,
				step: options.step,
				...options.attributes
			};
			this.element = document.createElement("span");
				this.element.setAttribute("component", "ve-number");
				this.element.instance = this;
			HTML.applyCSSStyle(this.element, options.style);
			
			this.value = value;
			
			//Format HTML string
			let html_string = [];
			if (options.name) html_string.push(`<span>${options.name}</span> `);
			html_string.push(`<input type = "number"${HTML.objectToAttributes(attributes)}>`);
			
			//Populate element and initialise handlers
			this.element.innerHTML = html_string.join("");
			
			let input_el = this.element.querySelector("input");
			input_el.addEventListener("input", (e) => {
				this.value = global.Number(e.target.value);
			});
			this.v = this.value;
		}
		
		get v () {
			//Return statement
			return this.value;
		}
		
		set v (arg0_value) {
			//Convert from parameters
			let value = arg0_value;
			
			//Set value and update UI
			this.value = value;
			this.element.querySelector("input").value = this.value;
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
}, 0);
