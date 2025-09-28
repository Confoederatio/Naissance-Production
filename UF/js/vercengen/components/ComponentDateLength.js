setTimeout(() => {
	ve.DateLength = class veDateLength extends ve.Component {
		constructor(arg0_value, arg1_options) {
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
			this.element = document.createElement("span");
				this.element.setAttribute("component", "ve-datelength");
				this.element.instance = this;
			HTML.applyCSSStyle(this.element, options.style);
			
			this.value = value;
			
			//Format HTML string
		}
	}
}, 0);