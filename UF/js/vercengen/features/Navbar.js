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
		
		//Initialise options
		
		//Declare local instance variables
	}
};