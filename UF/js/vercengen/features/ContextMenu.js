/**
 * Represents a ContextMenu Feature that contains a set of components. {@link ve.Window} instances are stored in `.windows`. Recursive.
 * 
 * The immediate {@link ve.Button} element bound to the ContextMenu instance is contained in `.element`.
 * @type {ve.ContextMenu}
 * 
 * ##### DOM:
 * - `.instance`: this:{@link ve.ContextMenu} - Applies to `this.element` only.
 * 
 * ##### Options:
 * - `arg0_components_obj`: {@link Object}<{@link ve.Component}>
 * - `arg1_options`: {@link Object}
 *   - `.anchor="left"` - Either 'left'/'right', the X order in which Windows are expanded.
 *   - `.button_options`: {@link Object}
 *   - `.can_close=true`: {@link boolean} - Whether context menus can be closed without invoking the .close() method.
 *   - `.x=HTML.mouse_x`: {@link number} - Determines where context menus should be anchored to.
 *   - `.y=HTML.mouse_y`: {@link number} - Determines where context menus should be anchored to.
 *   
 * ##### Instance:
 * - `.element`: {@link ve.Button}.element
 * - `.windows`: {@link Array}<{@link ve.Window}>
 */
ve.ContextMenu = class { //[WI] - Finish class body
	constructor (arg0_components_obj, arg1_options) {
		//Convert from parameters
		let components_obj = arg0_components_obj;
		let options = (arg1_options) ? arg1_options : {};
		
		//Initialise options
		options.x = (options.x !== undefined) ? options.x : HTML.mouse_x;
		options.y = (options.y !== undefined) ? options.y : HTML.mouse_y;
		
		//Declare local instance variables
	}
};