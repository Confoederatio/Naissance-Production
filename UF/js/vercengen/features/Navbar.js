/**
 * Represents a Navbar Feature, ideally at the global level (unless it is specifically bound to an element in .options).
 * @type {ve.Navbar}
 * 
 * ##### DOM:
 * - `.instance`: this:{@link ve.Window}
 * 
 * ##### Options:
 * - `arg0_navbar_obj`: {@link Object}
 *   - `<tab_key>`: {@link Object}
 *     - `name`: {@link string}
 *     - 
 *     - `active`: {@link boolean}
 *     - `<dropdown_key>`: {@link Object}
 *       - `<dropdown_key>`: {@link Object} - Nested dropdown if available.
 *       - `.active`: {@link boolean}
 *       - `.onclick`: {@link function}({@link HTMLElement})
 *       - `.keybind`: {@link string} - Mousetrap key combo which triggers the bound `.onclick` event if possible.
 *       - `.name`: {@link string}
 * - `arg1_options`: {@link Object}
 *   - `.anchor_element`: {@link HTMLElement}|{@link string}
 *   - `.attributes`: {@link Object}
 *     - `<attribute_key>`: {@link string}
 *   - `.name`: {@link string}
 *   - `.style`: {@link Object}
 *     - `<style_key>`: {@link string}
 */
ve.Navbar = class { //[WIP] - Finish Class body
	constructor (arg0_navbar_obj, arg1_options) {
		//Convert from parameters
		let navbar_obj = (arg0_navbar_obj) ? arg0_navbar_obj : {};
		let options = (arg1_options) ? arg1_options : {};
		
		//Declare local instance variables
		this.element = document.createElement("div");
			this.element.setAttribute("class", "ve navbar");
			this.element.instance = this;
			HTML.setAttributesObject(this.element, options.attributes);
			HTML.applyCSSStyle(this.element, options.style);
		
		//Format html_string
		let html_string = this.generateHTMLRecursively(navbar_obj);
		this.element.innerHTML = html_string.join("");
		
		//Append child to body unless an anchor_element is defined
		if (options.anchor_element) {
			options.anchor_element = (typeof options.anchor_element === "object") ? 
				options.anchor_element : document.querySelector(options.anchor_element.toString());
			
			options.anchor_element.appendChild(this.element);
		} else {
			document.body.appendChild(this.element);
		}
	}
	
	generateHTMLRecursively (arg0_navbar_obj) {
		//Convert from parameters
		let navbar_obj = (arg0_navbar_obj) ? arg0_navbar_obj : {};
		
		//Declare local instance variables
		let html_string = [];
		let reserved_keys = ["name", "active"];
		
		html_string.push(`<ul>`);
			html_string.push(`<li>`);
			if (navbar_obj.name === undefined)
				console.warn(`ve.Navbar: generateHTMLRecursively - .name is undefined for the following object:`, navbar_obj);
			html_string.push((navbar_obj.name) ? navbar_obj.name : "Button");
		
			//Iterate over all entries in navbar_obj and recursively populate them
			Object.iterate(navbar_obj, (local_key, local_value) => {
				if (!reserved_keys.includes(local_key))
					if (typeof local_value === "object") {
						let all_local_keys = Object.keys(local_value);
						let has_non_reserved_key = false;
						
						//Iterate over all_local_keys to see if it has a non-reserved key
						for (let i = 0; i < all_local_keys.length; i++)
							if (!reserved_keys.includes(all_local_keys[i])) {
								has_non_reserved_key = true;
								break;
							}
						
						//If a non-reserved key exists, this is a dropdown menu, otherwise it is a dropdown item
						if (has_non_reserved_key) {
							html_string.concat(this.generateHTMLRecursively(local_value));
						} else {
							html_string.push(`<li class = "link">`);
								html_string.push(`<a>${(local_value.name) ? local_value.name : local_key}</a>`);
							html_string.push(`</li>`);
						}
					}
			});
			
			html_string.push(`</li>`);
		html_string.push(`</ul>`);
		
		//Return statement
		return html_string;
	}
};