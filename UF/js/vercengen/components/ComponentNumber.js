setTimeout(() => {
	ve.Number = class veNumber extends ve.Component {
		constructor (arg0_value, arg1_options) {
			super();
			
			//Convert from parameters
			let value = arg0_value;
			let options = (arg1_options) ? arg1_options : {};
			
			//Initialise options
			options.attributes = options.attributes ? options.attributes : {};
			
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
			this.height = options.height;
			this.width = options.width;
			this.x = options.x;
			this.y = options.y;
			
			this.value = value;
			
			//Format HTML string
			let html_string = [];
			if (options.name) html_string.push(`<span>${options.name}</span> `);
			html_string.push(`<input type = "number"${objectToAttributes(attributes)}>`);
			
			//Populate element and initialise handlers; set .instance
			this.element.innerHTML = html_string.join("");
			
			let input_el = this.element.querySelector("input");
			input_el.addEventListener("input", (e) => {
				this.value = global.Number(e.target.value);
			});
			this.v = this.value;
		}
		
		bind (arg0_container_el) {
			//Convert from parameters
			let container_el = arg0_container_el;
			
			//Set variable_key, append to container_el
			container_el.appendChild(this.element);
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
