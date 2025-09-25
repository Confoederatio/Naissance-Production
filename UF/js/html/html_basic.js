//Initialise functions
{
	if (!global.HTML) global.HTML = {};
	
	HTML.applyAttributesObject = function (arg0_el, arg1_attributes_obj) {
		//Convert from parameters
		let el = (typeof arg0_el === "object") ? arg0_el : document.querySelector(arg0_el);
		let attributes_obj = (arg1_attributes_obj) ? arg1_attributes_obj : {};
		
		//Iterate over attributes_obj
		Object.iterate(attributes_obj, (local_key, local_value) => {
			el.setAttribute(local_key, local_value);
		});
	};
	
	HTML.applyCSSStyle = function (arg0_el, arg1_style) {
		//Convert from parameters
		let el = (typeof arg0_el === "object") ? arg0_el : document.querySelector(arg0_el);
		let style = arg1_style;
		
		//Apply CSS style to el
		if (typeof style === "object") {
			HTML.applyCSSStyleObject(el, style);
		} else if (typeof style === "string") {
			el.setAttribute("style", style);
		}
	};
	
	HTML.applyCSSStyleObject = function (arg0_el, arg1_style_obj) {
		//Convert from parameters
		let el = (typeof arg0_el === "object") ? arg0_el : document.querySelector(arg0_el);
		let style_obj = (arg1_style_obj) ? arg1_style_obj : {};
		
		//Iterate over style_obj and apply it to el.style
		Object.iterate(style_obj, (local_key, local_value) => {
			el.style[local_key] = local_value.toString();
		});
	};
	
	HTML.getCSSPosition = function (arg0_anchor, arg1_x, arg2_y) {
		//Convert from parameters
		let anchor = (arg0_anchor) ? arg0_anchor : "top_left";
		let x_coord = parseInt(arg1_x);
		let y_coord = parseInt(arg2_y);
		
		//Declare local instance variables
		let return_obj = {};
		let x_string = (typeof x_coord === "string") ? x_coord : `${x_coord}px`;
		let y_string = (typeof y_coord === "string") ? y_coord : `${y_coord}px`;
		
		//Set return_obj styles based on anchor
		if (anchor === "top_left") {
			return_obj.left = x_string;
			return_obj.top = y_string;
		} else if (anchor === "top_right") {
			return_obj.right = x_string;
			return_obj.top = y_string;
		} else if (anchor === "bottom_left") {
			return_obj.bottom = y_string;
			return_obj.left = x_string;
		} else if (anchor === "bottom_right") {
			return_obj.bottom = y_string;
			return_obj.right = x_string;
		}
		
		//Return statement
		return return_obj;
	};
	
	HTML.getCSSSize = function (arg0_width, arg1_height) {
		//Convert from parameters
		let width = arg0_width;
		let height = arg1_height;
		
		//Return statement
		return {
			height: (typeof this.height === "string") ? this.height : `${this.height}px`,
			width: (typeof this.width === "string") ? this.width : `${this.width}px`
		};
	};
	
	HTML.objectToAttributes = function (arg0_object) {
		//Convert from parameters
		let object = (arg0_object) ? arg0_object : {};
		
		//Declare local instance variables
		let attribute_string = [];
		
		//Iterate over object and put together attribute_string
		Object.iterate(object, (local_key, local_value) => {
			if (local_value !== undefined)
				attribute_string.push(`${local_key} = "${local_value}"`);
		});
		
		//Format attribute_string
		attribute_string = attribute_string.join(" ");
		
		//Return statement
		return (attribute_string) ? ` ${attribute_string}` : "";
	};
}