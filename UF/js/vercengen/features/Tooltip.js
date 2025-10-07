/**
 * Represents a Tooltip Feature that contains a set of components which are wrapped inside an Interface.
 * @type {ve.Tooltip}
 * 
 * ##### DOM:
 * - `.instance`: this:{@link ve.Tooltip}
 * 
 * ##### Options:
 * - `arg0_components_obj`: {@link Object}<{@link ve.Component}>|{@link string}
 * - `arg1_options`: {@link Object}
 *   - `element`: {@link HTMLElement}|{@link string}
 *   - `style`: {@linK Object}<{@link string}>
 */
ve.Tooltip = class {
	constructor (arg0_components_obj, arg1_options) {
		//Convert from parameters
		let components_obj = arg0_components_obj;
		let options = (arg1_options) ? arg1_options : {};
		
		//Initialise options
		if (options.element === undefined)
			console.error(`arg1_options.element needs to be defined for ve.Tooltip to work.`);
		
		//Declare local instance variables
		this.anchor_element = (typeof options.element === "string") ? 
			document.querySelector(options.element) : options.element;
		this.element = document.createElement("div");
			this.element.instance = this;
		HTML.setAttributesObject(this.element, (options.attributes) ? options.attributes : {});
		HTML.applyCSSStyle(this.element, options.value);
		
		//Set tippy tooltip based on element
		
	}
};