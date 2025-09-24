setTimeout(() => {
	ve.Number = class veNumber extends ve.Component {
		constructor (arg0_value, arg1_options) {
			super();
			
			//Convert from parameters
			let value = arg0_value;
			let options = (arg1_options) ? arg1_options : {};
			
			//Declare local instance variables
			let html_string = [];
			this.element = document.createElement("span");
			this.value = value;
			
			if (options.name) html_string.push(`<span>${options.name}</span> `);
			html_string.push(`<input type = "number">`);
			
			//Populate element and initialise handlers; set .instance
			this.element.innerHTML = html_string.join("");
			this.element.instance = this;
			this.element.querySelector("input").addEventListener("input", (e) => {
				this.value = Number(e.target.value);
			});
		}
		
		bindTo (arg0_container_el) {
			//Convert from parameters
			let container_el = arg0_container_el;
			
			//Set variable_key, append to container_el
			container_el.appendChild(this.element);
		}
		
		delete () {
			this.element.remove();
		}
		
		get () {
			//Return statement
			return this.value;
		}
		
		set (arg0_value) {
			//Convert from parameters
			let value = arg0_value;
			
			//Set value and update UI
			this.value = value;
			this.element.querySelector("input").value = this.value;
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
